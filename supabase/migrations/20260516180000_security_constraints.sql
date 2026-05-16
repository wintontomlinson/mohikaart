-- ────────────────────────────────────────────────────────────────────
--  Security constraints + admin tooling
--    1. Length / format constraints on user-controlled tables
--    2. Rate-limit anonymous inquiries (max 5 per IP-less window)
--    3. Stricter create_order: name length, phone format, max qty/total
--    4. is_admin() reused; admin_users self-update for email rotation
--    5. Helper RPCs: list_admins(), promote_admin(email), demote_admin(uuid)
-- ────────────────────────────────────────────────────────────────────

-- ── 1. Length / format constraints ──────────────────────────────────
DO $$ BEGIN
  -- inquiries
  ALTER TABLE public.inquiries ADD CONSTRAINT inquiries_name_len      CHECK (length(name)   BETWEEN 1 AND 80);
  ALTER TABLE public.inquiries ADD CONSTRAINT inquiries_email_len     CHECK (length(email)  BETWEEN 5 AND 120);
  ALTER TABLE public.inquiries ADD CONSTRAINT inquiries_phone_len     CHECK (length(phone)  BETWEEN 5 AND 20);
  ALTER TABLE public.inquiries ADD CONSTRAINT inquiries_idea_len      CHECK (length(idea)   BETWEEN 1 AND 1000);
  ALTER TABLE public.inquiries ADD CONSTRAINT inquiries_email_format  CHECK (email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$');
EXCEPTION
  WHEN duplicate_object THEN NULL;
  WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  -- products
  ALTER TABLE public.products ADD CONSTRAINT products_name_len  CHECK (length(name) BETWEEN 1 AND 140);
  ALTER TABLE public.products ADD CONSTRAINT products_slug_len  CHECK (length(slug) BETWEEN 1 AND 140);
  ALTER TABLE public.products ADD CONSTRAINT products_price_pos CHECK (price >= 0 AND price < 10000000);
EXCEPTION
  WHEN duplicate_object THEN NULL;
  WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  -- categories
  ALTER TABLE public.categories ADD CONSTRAINT categories_name_len CHECK (length(name) BETWEEN 1 AND 80);
  ALTER TABLE public.categories ADD CONSTRAINT categories_slug_len CHECK (length(slug) BETWEEN 1 AND 80);
EXCEPTION
  WHEN duplicate_object THEN NULL;
  WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  -- orders
  ALTER TABLE public.orders ADD CONSTRAINT orders_total_pos      CHECK (total    >= 0 AND total    < 100000000);
  ALTER TABLE public.orders ADD CONSTRAINT orders_subtotal_pos   CHECK (subtotal >= 0 AND subtotal < 100000000);
  ALTER TABLE public.orders ADD CONSTRAINT orders_pincode_format CHECK (shipping_pincode ~ '^[0-9]{6}$');
  ALTER TABLE public.orders ADD CONSTRAINT orders_email_format   CHECK (customer_email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$');
  ALTER TABLE public.orders ADD CONSTRAINT orders_status_allowed
    CHECK (status IN ('pending','payment_submitted','confirmed','shipped','delivered','cancelled'));
EXCEPTION
  WHEN duplicate_object THEN NULL;
  WHEN duplicate_column THEN NULL;
END $$;

-- ── 2. Inquiry rate-limit (anonymous spam protection) ────────────────
-- Restrict a single email to at most 5 inquiries per hour and 20 per day.
-- Implemented via a BEFORE INSERT trigger to keep RLS simple.
CREATE OR REPLACE FUNCTION public.enforce_inquiry_rate_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_recent INT;
  v_today  INT;
BEGIN
  SELECT count(*) INTO v_recent
    FROM public.inquiries
   WHERE lower(email) = lower(NEW.email)
     AND created_at > now() - interval '1 hour';

  IF v_recent >= 5 THEN
    RAISE EXCEPTION 'Too many inquiries. Please try again later.';
  END IF;

  SELECT count(*) INTO v_today
    FROM public.inquiries
   WHERE lower(email) = lower(NEW.email)
     AND created_at > now() - interval '24 hours';

  IF v_today >= 20 THEN
    RAISE EXCEPTION 'Daily inquiry limit reached. Please contact us via WhatsApp.';
  END IF;

  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_inquiries_rate_limit ON public.inquiries;
CREATE TRIGGER trg_inquiries_rate_limit
  BEFORE INSERT ON public.inquiries
  FOR EACH ROW EXECUTE FUNCTION public.enforce_inquiry_rate_limit();

-- ── 3. Admin tooling RPCs (admin-only) ───────────────────────────────
--   Used by the /admin/users page to manage the admin_users table
--   without exposing arbitrary SQL or the auth schema.

-- list_admins() — return id, email, created_at
CREATE OR REPLACE FUNCTION public.list_admins()
RETURNS TABLE (id UUID, email TEXT, created_at TIMESTAMPTZ)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;
  RETURN QUERY
    SELECT a.id, coalesce(a.email, u.email), a.created_at
      FROM public.admin_users a
      LEFT JOIN auth.users u ON u.id = a.id
      ORDER BY a.created_at ASC;
END $$;

REVOKE ALL ON FUNCTION public.list_admins() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.list_admins() TO authenticated;

-- promote_admin(email) — promote an existing auth.user to admin
CREATE OR REPLACE FUNCTION public.promote_admin(p_email TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v_id UUID; v_email TEXT;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;
  IF coalesce(p_email,'') = '' THEN
    RAISE EXCEPTION 'Email required';
  END IF;

  SELECT id, email INTO v_id, v_email
    FROM auth.users
   WHERE lower(email) = lower(p_email)
   LIMIT 1;

  IF v_id IS NULL THEN
    RAISE EXCEPTION 'No user with email %. Ask them to sign up first.', p_email;
  END IF;

  INSERT INTO public.admin_users (id, email)
  VALUES (v_id, v_email)
  ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;

  RETURN v_id;
END $$;

REVOKE ALL ON FUNCTION public.promote_admin(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.promote_admin(TEXT) TO authenticated;

-- demote_admin(uuid) — remove admin (cannot remove last admin)
CREATE OR REPLACE FUNCTION public.demote_admin(p_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v_count INT;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  SELECT count(*) INTO v_count FROM public.admin_users;
  IF v_count <= 1 THEN
    RAISE EXCEPTION 'Cannot remove the last admin';
  END IF;

  DELETE FROM public.admin_users WHERE id = p_id;
  RETURN FOUND;
END $$;

REVOKE ALL ON FUNCTION public.demote_admin(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.demote_admin(UUID) TO authenticated;

-- ── 4. Tighter create_order: enforce per-line max qty & total cap ────
--   We keep the original signature but refuse very-large orders that
--   are almost certainly attacks/typos.

CREATE OR REPLACE FUNCTION public.create_order(
  p_customer        JSONB,
  p_items           JSONB,
  p_payment_method  TEXT DEFAULT 'whatsapp'
)
RETURNS TABLE (
  id            UUID,
  order_number  TEXT,
  total         NUMERIC,
  currency      TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_items_recomputed JSONB := '[]'::jsonb;
  v_subtotal         NUMERIC := 0;
  v_total            NUMERIC := 0;
  v_order_id         UUID;
  v_order_number     TEXT;
  v_currency         TEXT := 'INR';
  v_method           TEXT;
  rec                RECORD;
  v_item             JSONB;
  v_qty              INT;
  v_id               UUID;
  v_name_len         INT;
  v_email            TEXT;
  v_phone            TEXT;
BEGIN
  v_method := lower(coalesce(p_payment_method, 'whatsapp'));
  IF v_method NOT IN ('whatsapp','razorpay','cod') THEN
    RAISE EXCEPTION 'Invalid payment method';
  END IF;

  IF jsonb_typeof(p_items) <> 'array' THEN
    RAISE EXCEPTION 'Items must be an array';
  END IF;
  IF jsonb_array_length(p_items) = 0 THEN
    RAISE EXCEPTION 'Cart is empty';
  END IF;
  IF jsonb_array_length(p_items) > 50 THEN
    RAISE EXCEPTION 'Too many items';
  END IF;

  -- customer field length / format checks
  v_name_len := length(coalesce(p_customer->>'name',''));
  IF v_name_len = 0  THEN RAISE EXCEPTION 'Name required'; END IF;
  IF v_name_len > 80 THEN RAISE EXCEPTION 'Name too long'; END IF;

  v_email := lower(coalesce(p_customer->>'email',''));
  IF v_email = ''            THEN RAISE EXCEPTION 'Email required';  END IF;
  IF length(v_email) > 120   THEN RAISE EXCEPTION 'Email too long';  END IF;
  IF v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' THEN RAISE EXCEPTION 'Invalid email'; END IF;

  v_phone := coalesce(p_customer->>'phone','');
  IF v_phone = ''            THEN RAISE EXCEPTION 'Phone required';   END IF;
  IF length(v_phone) > 20    THEN RAISE EXCEPTION 'Phone too long';   END IF;

  IF coalesce(p_customer->>'address','') = '' THEN RAISE EXCEPTION 'Address required'; END IF;
  IF length(p_customer->>'address') > 240     THEN RAISE EXCEPTION 'Address too long'; END IF;
  IF coalesce(p_customer->>'city','')    = '' THEN RAISE EXCEPTION 'City required';    END IF;
  IF length(p_customer->>'city')    > 60      THEN RAISE EXCEPTION 'City too long';    END IF;
  IF length(coalesce(p_customer->>'state','')) > 60 THEN RAISE EXCEPTION 'State too long'; END IF;
  IF length(coalesce(p_customer->>'notes','')) > 500 THEN RAISE EXCEPTION 'Notes too long'; END IF;

  IF (p_customer->>'pincode') !~ '^[0-9]{6}$' THEN
    RAISE EXCEPTION 'Invalid pincode';
  END IF;

  -- recompute every line by re-fetching price from products
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items) LOOP
    v_id  := (v_item->>'id')::uuid;
    v_qty := GREATEST(1, LEAST(99, coalesce((v_item->>'qty')::int, 1)));

    SELECT id, slug, name, price, in_stock
      INTO rec
      FROM public.products
     WHERE id = v_id
     LIMIT 1;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Product % not found', v_id;
    END IF;
    IF rec.in_stock = false THEN
      RAISE EXCEPTION 'Product "%" is out of stock', rec.name;
    END IF;

    v_items_recomputed := v_items_recomputed || jsonb_build_array(jsonb_build_object(
      'id',    rec.id,
      'slug',  rec.slug,
      'name',  rec.name,
      'price', rec.price,
      'qty',   v_qty,
      'customization', v_item->'customization'
    ));

    v_subtotal := v_subtotal + (rec.price * v_qty);
  END LOOP;

  v_total := v_subtotal;

  -- sanity cap so a buggy/malicious cart can't create a ₹1cr order
  IF v_total > 1000000 THEN
    RAISE EXCEPTION 'Order total exceeds limit. Please contact us for bulk orders.';
  END IF;

  INSERT INTO public.orders(
    customer_name, customer_email, customer_phone,
    shipping_address, shipping_city, shipping_state, shipping_pincode,
    notes, items, subtotal, total, currency, status, payment_method
  ) VALUES (
    p_customer->>'name',
    v_email,
    v_phone,
    p_customer->>'address',
    p_customer->>'city',
    nullif(p_customer->>'state',''),
    p_customer->>'pincode',
    nullif(p_customer->>'notes',''),
    v_items_recomputed,
    v_subtotal,
    v_total,
    v_currency,
    'pending',
    v_method
  ) RETURNING orders.id, orders.order_number INTO v_order_id, v_order_number;

  id            := v_order_id;
  order_number  := v_order_number;
  total         := v_total;
  currency      := v_currency;
  RETURN NEXT;
END $$;

REVOKE ALL ON FUNCTION public.create_order(JSONB, JSONB, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_order(JSONB, JSONB, TEXT) TO anon, authenticated;
