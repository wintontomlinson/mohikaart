-- ────────────────────────────────────────────────────────────────────
--  Security lockdown
--    1. Admin users are real auth.users — no more client-side password
--    2. Writes on every table require is_admin()
--    3. Public can still INSERT orders/inquiries and SELECT public data
--    4. Order totals are computed SERVER-SIDE via create_order RPC
--    5. Storage: public read, admin-only writes; new site-images bucket
-- ────────────────────────────────────────────────────────────────────

-- ── 1. admin_users table ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.admin_users (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- An admin can read their own row (used by client to confirm admin status)
DROP POLICY IF EXISTS "Admin self-read"   ON public.admin_users;
DROP POLICY IF EXISTS "Admin self-update" ON public.admin_users;
CREATE POLICY "Admin self-read"
  ON public.admin_users FOR SELECT
  USING (auth.uid() = id);

-- ── 2. is_admin() helper (security definer to bypass RLS recursion) ─
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users WHERE id = auth.uid()
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;

-- ── 3. Replace open RLS with admin-gated RLS ─────────────────────────

-- products: keep public SELECT, lock writes
DROP POLICY IF EXISTS "Open write products"    ON public.products;
DROP POLICY IF EXISTS "Admin write products"   ON public.products;
CREATE POLICY "Admin write products"
  ON public.products FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- categories
DROP POLICY IF EXISTS "Open write categories"  ON public.categories;
DROP POLICY IF EXISTS "Admin write categories" ON public.categories;
CREATE POLICY "Admin write categories"
  ON public.categories FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- site_images
DROP POLICY IF EXISTS "Open write site_images"  ON public.site_images;
DROP POLICY IF EXISTS "Admin write site_images" ON public.site_images;
CREATE POLICY "Admin write site_images"
  ON public.site_images FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- app_settings: public SELECT, only admin can write
DROP POLICY IF EXISTS "Open write app_settings"  ON public.app_settings;
DROP POLICY IF EXISTS "Admin write app_settings" ON public.app_settings;
CREATE POLICY "Admin write app_settings"
  ON public.app_settings FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- inquiries: keep INSERT public, lock everything else
DROP POLICY IF EXISTS "Public read inquiries"   ON public.inquiries;
DROP POLICY IF EXISTS "Open update inquiries"   ON public.inquiries;
DROP POLICY IF EXISTS "Open delete inquiries"   ON public.inquiries;
DROP POLICY IF EXISTS "Admin read inquiries"    ON public.inquiries;
DROP POLICY IF EXISTS "Admin update inquiries"  ON public.inquiries;
DROP POLICY IF EXISTS "Admin delete inquiries"  ON public.inquiries;

CREATE POLICY "Admin read inquiries"
  ON public.inquiries FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admin update inquiries"
  ON public.inquiries FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin delete inquiries"
  ON public.inquiries FOR DELETE
  USING (public.is_admin());

-- orders: NO direct insert/select for anon — must go through RPCs.
-- Admin keeps full CRUD via auth.
DROP POLICY IF EXISTS "Public insert orders"  ON public.orders;
DROP POLICY IF EXISTS "Public read orders"    ON public.orders;
DROP POLICY IF EXISTS "Open update orders"    ON public.orders;
DROP POLICY IF EXISTS "Open delete orders"    ON public.orders;
DROP POLICY IF EXISTS "Admin read orders"     ON public.orders;
DROP POLICY IF EXISTS "Admin update orders"   ON public.orders;
DROP POLICY IF EXISTS "Admin delete orders"   ON public.orders;

CREATE POLICY "Admin read orders"
  ON public.orders FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admin update orders"
  ON public.orders FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin delete orders"
  ON public.orders FOR DELETE
  USING (public.is_admin());

-- ── 4. Server-side order creation RPC ────────────────────────────────
--   • Validates each line item against products table
--   • Recomputes subtotal & total
--   • Ignores any client-supplied total
--   • Returns the persisted row (with order_number)

CREATE OR REPLACE FUNCTION public.create_order(
  p_customer        JSONB,         -- { name, email, phone, address, city, state, pincode, notes }
  p_items           JSONB,         -- [{ id, qty, customization? }, ...]
  p_payment_method  TEXT DEFAULT 'whatsapp'  -- whatsapp | razorpay | cod
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
BEGIN
  -- payment_method allow-list
  v_method := lower(coalesce(p_payment_method, 'whatsapp'));
  IF v_method NOT IN ('whatsapp','razorpay','cod') THEN
    RAISE EXCEPTION 'Invalid payment method';
  END IF;

  -- validate cart shape
  IF jsonb_array_length(p_items) = 0 THEN
    RAISE EXCEPTION 'Cart is empty';
  END IF;
  IF jsonb_array_length(p_items) > 50 THEN
    RAISE EXCEPTION 'Too many items';
  END IF;

  -- validate customer
  IF coalesce(p_customer->>'name','')        = '' THEN RAISE EXCEPTION 'Name required';    END IF;
  IF coalesce(p_customer->>'email','')       = '' THEN RAISE EXCEPTION 'Email required';   END IF;
  IF coalesce(p_customer->>'phone','')       = '' THEN RAISE EXCEPTION 'Phone required';   END IF;
  IF coalesce(p_customer->>'address','')     = '' THEN RAISE EXCEPTION 'Address required'; END IF;
  IF coalesce(p_customer->>'city','')        = '' THEN RAISE EXCEPTION 'City required';    END IF;
  IF coalesce(p_customer->>'pincode','')     = '' THEN RAISE EXCEPTION 'Pincode required'; END IF;

  -- pincode must be 6 digits
  IF (p_customer->>'pincode') !~ '^[0-9]{6}$' THEN
    RAISE EXCEPTION 'Invalid pincode';
  END IF;

  -- email must look like an email
  IF (p_customer->>'email') !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' THEN
    RAISE EXCEPTION 'Invalid email';
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

  v_total := v_subtotal;  -- shipping/discount can extend this later

  INSERT INTO public.orders(
    customer_name, customer_email, customer_phone,
    shipping_address, shipping_city, shipping_state, shipping_pincode,
    notes, items, subtotal, total, currency, status, payment_method
  ) VALUES (
    p_customer->>'name',
    lower(p_customer->>'email'),
    p_customer->>'phone',
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

-- ── 4b. Record payment attempt (anon-callable post-checkout) ────────
--   • Persists razorpay payment ids on a *specific* order
--   • Sets status to 'payment_submitted' — admin still verifies before fulfilling
--   • Does NOT trust client about success; status='confirmed' must come from
--     a webhook / signed Edge Function later

CREATE OR REPLACE FUNCTION public.record_payment(
  p_order_id    UUID,
  p_payment_id  TEXT,
  p_rzp_order_id TEXT DEFAULT NULL,
  p_signature   TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF coalesce(p_payment_id, '') = '' THEN
    RAISE EXCEPTION 'Payment id required';
  END IF;

  UPDATE public.orders
     SET razorpay_payment_id = p_payment_id,
         razorpay_order_id   = coalesce(p_rzp_order_id, razorpay_order_id),
         razorpay_signature  = coalesce(p_signature,    razorpay_signature),
         status              = CASE WHEN status = 'pending' THEN 'payment_submitted' ELSE status END,
         updated_at          = now()
   WHERE id = p_order_id
     AND razorpay_payment_id IS NULL;   -- prevent overwriting

  RETURN FOUND;
END $$;

REVOKE ALL ON FUNCTION public.record_payment(UUID, TEXT, TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.record_payment(UUID, TEXT, TEXT, TEXT) TO anon, authenticated;

-- Same idea for cancellation (user closed the Razorpay modal)
CREATE OR REPLACE FUNCTION public.cancel_pending_order(p_order_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.orders
     SET status = 'cancelled',
         updated_at = now()
   WHERE id = p_order_id
     AND status = 'pending';        -- only cancellable while still pending

  RETURN FOUND;
END $$;

REVOKE ALL ON FUNCTION public.cancel_pending_order(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.cancel_pending_order(UUID) TO anon, authenticated;

-- ── 5. Storage policy lockdown + new site-images bucket ──────────────

-- product-images: keep public SELECT, restrict writes to admin
DROP POLICY IF EXISTS "Public insert product-images" ON storage.objects;
DROP POLICY IF EXISTS "Public update product-images" ON storage.objects;
DROP POLICY IF EXISTS "Public delete product-images" ON storage.objects;

CREATE POLICY "Admin insert product-images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-images' AND public.is_admin());

CREATE POLICY "Admin update product-images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'product-images' AND public.is_admin());

CREATE POLICY "Admin delete product-images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'product-images' AND public.is_admin());

-- site-images bucket (used by AdminImages for hero/about/gallery slots)
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-images', 'site-images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public read site-images"   ON storage.objects;
DROP POLICY IF EXISTS "Admin insert site-images"  ON storage.objects;
DROP POLICY IF EXISTS "Admin update site-images"  ON storage.objects;
DROP POLICY IF EXISTS "Admin delete site-images"  ON storage.objects;

CREATE POLICY "Public read site-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'site-images');

CREATE POLICY "Admin insert site-images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'site-images' AND public.is_admin());

CREATE POLICY "Admin update site-images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'site-images' AND public.is_admin());

CREATE POLICY "Admin delete site-images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'site-images' AND public.is_admin());

-- ────────────────────────────────────────────────────────────────────
--  ⚠️  BOOTSTRAP THE FIRST ADMIN
--
--   After running this migration, run these two SQL statements in
--   Supabase Dashboard → SQL Editor (replace the email/password):
--
--   -- Create the auth user (do this in Authentication → Users → Add user)
--   -- Then promote them:
--   INSERT INTO public.admin_users (id, email)
--   SELECT id, email FROM auth.users WHERE email = 'YOUR_ADMIN_EMAIL'
--   ON CONFLICT (id) DO NOTHING;
-- ────────────────────────────────────────────────────────────────────
