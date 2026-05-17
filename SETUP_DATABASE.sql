-- ════════════════════════════════════════════════════════════════════
--  MOHIKA ART — ONE-SHOT DATABASE SETUP
--
--  Use karna kaise hai:
--    1. Supabase Dashboard → SQL Editor → "New query"
--    2. Ye poori file copy karke paste karo
--    3. "Run" click karo (ya Ctrl+Enter)
--    4. Bas ho gaya — saari tables, RLS, triggers, RPCs setup ho gaye
--
--  Phir admin user banane ke liye is file ke last mein dekho.
-- ════════════════════════════════════════════════════════════════════


-- ┌────────────────────────────────────────────────────────────────┐
-- │ PART 1 — Helper trigger function for updated_at                │
-- └────────────────────────────────────────────────────────────────┘

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;


-- ┌────────────────────────────────────────────────────────────────┐
-- │ PART 2 — Categories, Products, Site Images                     │
-- └────────────────────────────────────────────────────────────────┘

CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  short_description TEXT,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  original_price NUMERIC(10,2),
  category_slug TEXT,
  image_url TEXT,
  gallery JSONB NOT NULL DEFAULT '[]'::jsonb,
  badge TEXT,
  featured BOOLEAN NOT NULL DEFAULT false,
  in_stock BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.site_images (
  key TEXT PRIMARY KEY,
  image_url TEXT NOT NULL,
  alt TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS trg_categories_updated  ON public.categories;
DROP TRIGGER IF EXISTS trg_products_updated    ON public.products;
DROP TRIGGER IF EXISTS trg_site_images_updated ON public.site_images;

CREATE TRIGGER trg_categories_updated  BEFORE UPDATE ON public.categories  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER trg_products_updated    BEFORE UPDATE ON public.products    FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER trg_site_images_updated BEFORE UPDATE ON public.site_images FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

ALTER TABLE public.categories  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_images ENABLE ROW LEVEL SECURITY;


-- ┌────────────────────────────────────────────────────────────────┐
-- │ PART 3 — App settings (admin config)                           │
-- └────────────────────────────────────────────────────────────────┘

CREATE TABLE IF NOT EXISTS public.app_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

DROP TRIGGER IF EXISTS touch_app_settings ON public.app_settings;
CREATE TRIGGER touch_app_settings
BEFORE UPDATE ON public.app_settings
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

INSERT INTO public.app_settings (key, value)
VALUES ('razorpay', '{"key_id": "", "mode": "test", "secret_configured": false}'::jsonb)
ON CONFLICT (key) DO NOTHING;


-- ┌────────────────────────────────────────────────────────────────┐
-- │ PART 4 — Orders                                                │
-- └────────────────────────────────────────────────────────────────┘

CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE DEFAULT ('MA-' || to_char(now(), 'YYMMDD') || '-' || lpad((floor(random() * 10000))::text, 4, '0')),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  shipping_address TEXT NOT NULL,
  shipping_city TEXT NOT NULL,
  shipping_pincode TEXT NOT NULL,
  shipping_state TEXT,
  notes TEXT,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal NUMERIC NOT NULL DEFAULT 0,
  total NUMERIC NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'INR',
  status TEXT NOT NULL DEFAULT 'pending',
  payment_method TEXT,
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_status  ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON public.orders(created_at DESC);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP TRIGGER IF EXISTS touch_orders ON public.orders;
CREATE TRIGGER touch_orders
BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();


-- ┌────────────────────────────────────────────────────────────────┐
-- │ PART 5 — Inquiries (Contact form)                              │
-- └────────────────────────────────────────────────────────────────┘

CREATE TABLE IF NOT EXISTS public.inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  product TEXT,
  idea TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;


-- ┌────────────────────────────────────────────────────────────────┐
-- │ PART 6 — Admin users + is_admin() helper                       │
-- └────────────────────────────────────────────────────────────────┘

CREATE TABLE IF NOT EXISTS public.admin_users (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin self-read" ON public.admin_users;
CREATE POLICY "Admin self-read"
  ON public.admin_users FOR SELECT
  USING (auth.uid() = id);

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


-- ┌────────────────────────────────────────────────────────────────┐
-- │ PART 7 — Public-read + admin-only-write RLS policies           │
-- └────────────────────────────────────────────────────────────────┘

DROP POLICY IF EXISTS "Public read products"  ON public.products;
DROP POLICY IF EXISTS "Admin write products"  ON public.products;
CREATE POLICY "Public read products"  ON public.products  FOR SELECT USING (true);
CREATE POLICY "Admin write products"  ON public.products  FOR ALL    USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Public read categories"  ON public.categories;
DROP POLICY IF EXISTS "Admin write categories"  ON public.categories;
CREATE POLICY "Public read categories"  ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admin write categories"  ON public.categories FOR ALL    USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Public read site_images"  ON public.site_images;
DROP POLICY IF EXISTS "Admin write site_images"  ON public.site_images;
CREATE POLICY "Public read site_images"  ON public.site_images FOR SELECT USING (true);
CREATE POLICY "Admin write site_images"  ON public.site_images FOR ALL    USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Public read app_settings"  ON public.app_settings;
DROP POLICY IF EXISTS "Admin write app_settings"  ON public.app_settings;
CREATE POLICY "Public read app_settings"  ON public.app_settings FOR SELECT USING (true);
CREATE POLICY "Admin write app_settings"  ON public.app_settings FOR ALL    USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Public insert inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Admin read inquiries"    ON public.inquiries;
DROP POLICY IF EXISTS "Admin update inquiries"  ON public.inquiries;
DROP POLICY IF EXISTS "Admin delete inquiries"  ON public.inquiries;
CREATE POLICY "Public insert inquiries" ON public.inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin read inquiries"    ON public.inquiries FOR SELECT USING (public.is_admin());
CREATE POLICY "Admin update inquiries"  ON public.inquiries FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin delete inquiries"  ON public.inquiries FOR DELETE USING (public.is_admin());

DROP POLICY IF EXISTS "Admin read orders"     ON public.orders;
DROP POLICY IF EXISTS "Admin update orders"   ON public.orders;
DROP POLICY IF EXISTS "Admin delete orders"   ON public.orders;
CREATE POLICY "Admin read orders"   ON public.orders FOR SELECT USING (public.is_admin());
CREATE POLICY "Admin update orders" ON public.orders FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin delete orders" ON public.orders FOR DELETE USING (public.is_admin());


-- ┌────────────────────────────────────────────────────────────────┐
-- │ PART 8 — Length / format constraints                           │
-- └────────────────────────────────────────────────────────────────┘

DO $$ BEGIN
  ALTER TABLE public.inquiries ADD CONSTRAINT inquiries_name_len      CHECK (length(name)   BETWEEN 1 AND 80);
  ALTER TABLE public.inquiries ADD CONSTRAINT inquiries_email_len     CHECK (length(email)  BETWEEN 5 AND 120);
  ALTER TABLE public.inquiries ADD CONSTRAINT inquiries_phone_len     CHECK (length(phone)  BETWEEN 5 AND 20);
  ALTER TABLE public.inquiries ADD CONSTRAINT inquiries_idea_len      CHECK (length(idea)   BETWEEN 1 AND 1000);
  ALTER TABLE public.inquiries ADD CONSTRAINT inquiries_email_format  CHECK (email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$');
EXCEPTION WHEN duplicate_object THEN NULL; WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.products ADD CONSTRAINT products_name_len  CHECK (length(name) BETWEEN 1 AND 140);
  ALTER TABLE public.products ADD CONSTRAINT products_slug_len  CHECK (length(slug) BETWEEN 1 AND 140);
  ALTER TABLE public.products ADD CONSTRAINT products_price_pos CHECK (price >= 0 AND price < 10000000);
EXCEPTION WHEN duplicate_object THEN NULL; WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.categories ADD CONSTRAINT categories_name_len CHECK (length(name) BETWEEN 1 AND 80);
  ALTER TABLE public.categories ADD CONSTRAINT categories_slug_len CHECK (length(slug) BETWEEN 1 AND 80);
EXCEPTION WHEN duplicate_object THEN NULL; WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.orders ADD CONSTRAINT orders_total_pos      CHECK (total    >= 0 AND total    < 100000000);
  ALTER TABLE public.orders ADD CONSTRAINT orders_subtotal_pos   CHECK (subtotal >= 0 AND subtotal < 100000000);
  ALTER TABLE public.orders ADD CONSTRAINT orders_pincode_format CHECK (shipping_pincode ~ '^[0-9]{6}$');
  ALTER TABLE public.orders ADD CONSTRAINT orders_email_format   CHECK (customer_email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$');
  ALTER TABLE public.orders ADD CONSTRAINT orders_status_allowed
    CHECK (status IN ('pending','payment_submitted','confirmed','shipped','delivered','cancelled'));
EXCEPTION WHEN duplicate_object THEN NULL; WHEN duplicate_column THEN NULL; END $$;


-- ┌────────────────────────────────────────────────────────────────┐
-- │ PART 9 — Inquiry rate-limit (anti-spam)                        │
-- └────────────────────────────────────────────────────────────────┘

CREATE OR REPLACE FUNCTION public.enforce_inquiry_rate_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v_recent INT; v_today  INT;
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


-- ┌────────────────────────────────────────────────────────────────┐
-- │ PART 10 — Server-side order RPCs                               │
-- └────────────────────────────────────────────────────────────────┘

CREATE OR REPLACE FUNCTION public.create_order(
  p_customer        JSONB,
  p_items           JSONB,
  p_payment_method  TEXT DEFAULT 'whatsapp'
)
RETURNS TABLE (id UUID, order_number TEXT, total NUMERIC, currency TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_items_recomputed JSONB := '[]'::jsonb;
  v_subtotal NUMERIC := 0;
  v_total NUMERIC := 0;
  v_order_id UUID;
  v_order_number TEXT;
  v_currency TEXT := 'INR';
  v_method TEXT;
  rec RECORD;
  v_item JSONB;
  v_qty INT;
  v_id UUID;
  v_email TEXT;
  v_phone TEXT;
BEGIN
  v_method := lower(coalesce(p_payment_method, 'whatsapp'));
  IF v_method NOT IN ('whatsapp','razorpay','cod') THEN RAISE EXCEPTION 'Invalid payment method'; END IF;

  IF jsonb_typeof(p_items) <> 'array' THEN RAISE EXCEPTION 'Items must be an array'; END IF;
  IF jsonb_array_length(p_items) = 0  THEN RAISE EXCEPTION 'Cart is empty';          END IF;
  IF jsonb_array_length(p_items) > 50 THEN RAISE EXCEPTION 'Too many items';         END IF;

  IF length(coalesce(p_customer->>'name','')) NOT BETWEEN 1 AND 80     THEN RAISE EXCEPTION 'Invalid name';     END IF;
  v_email := lower(coalesce(p_customer->>'email',''));
  IF length(v_email) NOT BETWEEN 5 AND 120                              THEN RAISE EXCEPTION 'Invalid email';    END IF;
  IF v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'                            THEN RAISE EXCEPTION 'Invalid email';    END IF;
  v_phone := coalesce(p_customer->>'phone','');
  IF length(v_phone) NOT BETWEEN 5 AND 20                               THEN RAISE EXCEPTION 'Invalid phone';    END IF;
  IF length(coalesce(p_customer->>'address','')) NOT BETWEEN 1 AND 240  THEN RAISE EXCEPTION 'Invalid address';  END IF;
  IF length(coalesce(p_customer->>'city','')) NOT BETWEEN 1 AND 60      THEN RAISE EXCEPTION 'Invalid city';     END IF;
  IF length(coalesce(p_customer->>'state','')) > 60                     THEN RAISE EXCEPTION 'State too long';   END IF;
  IF length(coalesce(p_customer->>'notes','')) > 500                    THEN RAISE EXCEPTION 'Notes too long';   END IF;
  IF (p_customer->>'pincode') !~ '^[0-9]{6}$'                           THEN RAISE EXCEPTION 'Invalid pincode';  END IF;

  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items) LOOP
    v_id  := (v_item->>'id')::uuid;
    v_qty := GREATEST(1, LEAST(99, coalesce((v_item->>'qty')::int, 1)));

    SELECT id, slug, name, price, in_stock INTO rec
      FROM public.products WHERE id = v_id LIMIT 1;
    IF NOT FOUND        THEN RAISE EXCEPTION 'Product % not found', v_id; END IF;
    IF rec.in_stock = false THEN RAISE EXCEPTION 'Product "%" out of stock', rec.name; END IF;

    v_items_recomputed := v_items_recomputed || jsonb_build_array(jsonb_build_object(
      'id', rec.id, 'slug', rec.slug, 'name', rec.name, 'price', rec.price, 'qty', v_qty,
      'customization', v_item->'customization'
    ));
    v_subtotal := v_subtotal + (rec.price * v_qty);
  END LOOP;

  v_total := v_subtotal;
  IF v_total > 1000000 THEN RAISE EXCEPTION 'Order total exceeds limit. Please contact us for bulk orders.'; END IF;

  INSERT INTO public.orders(
    customer_name, customer_email, customer_phone,
    shipping_address, shipping_city, shipping_state, shipping_pincode,
    notes, items, subtotal, total, currency, status, payment_method
  ) VALUES (
    p_customer->>'name', v_email, v_phone,
    p_customer->>'address', p_customer->>'city',
    nullif(p_customer->>'state',''), p_customer->>'pincode',
    nullif(p_customer->>'notes',''), v_items_recomputed,
    v_subtotal, v_total, v_currency, 'pending', v_method
  ) RETURNING orders.id, orders.order_number INTO v_order_id, v_order_number;

  id := v_order_id; order_number := v_order_number; total := v_total; currency := v_currency;
  RETURN NEXT;
END $$;

REVOKE ALL ON FUNCTION public.create_order(JSONB, JSONB, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_order(JSONB, JSONB, TEXT) TO anon, authenticated;


CREATE OR REPLACE FUNCTION public.record_payment(
  p_order_id UUID, p_payment_id TEXT, p_rzp_order_id TEXT DEFAULT NULL, p_signature TEXT DEFAULT NULL
)
RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF coalesce(p_payment_id, '') = '' THEN RAISE EXCEPTION 'Payment id required'; END IF;
  UPDATE public.orders
     SET razorpay_payment_id = p_payment_id,
         razorpay_order_id   = coalesce(p_rzp_order_id, razorpay_order_id),
         razorpay_signature  = coalesce(p_signature, razorpay_signature),
         status              = CASE WHEN status = 'pending' THEN 'payment_submitted' ELSE status END,
         updated_at          = now()
   WHERE id = p_order_id AND razorpay_payment_id IS NULL;
  RETURN FOUND;
END $$;
REVOKE ALL ON FUNCTION public.record_payment(UUID, TEXT, TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.record_payment(UUID, TEXT, TEXT, TEXT) TO anon, authenticated;


CREATE OR REPLACE FUNCTION public.cancel_pending_order(p_order_id UUID)
RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.orders SET status = 'cancelled', updated_at = now()
   WHERE id = p_order_id AND status = 'pending';
  RETURN FOUND;
END $$;
REVOKE ALL ON FUNCTION public.cancel_pending_order(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.cancel_pending_order(UUID) TO anon, authenticated;


-- ┌────────────────────────────────────────────────────────────────┐
-- │ PART 11 — Admin management RPCs                                │
-- └────────────────────────────────────────────────────────────────┘

CREATE OR REPLACE FUNCTION public.list_admins()
RETURNS TABLE (id UUID, email TEXT, created_at TIMESTAMPTZ)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.is_admin() THEN RAISE EXCEPTION 'Not authorized'; END IF;
  RETURN QUERY
    SELECT a.id, coalesce(a.email, u.email), a.created_at
      FROM public.admin_users a
      LEFT JOIN auth.users u ON u.id = a.id
      ORDER BY a.created_at ASC;
END $$;
REVOKE ALL ON FUNCTION public.list_admins() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.list_admins() TO authenticated;


CREATE OR REPLACE FUNCTION public.promote_admin(p_email TEXT)
RETURNS UUID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_id UUID; v_email TEXT;
BEGIN
  IF NOT public.is_admin() THEN RAISE EXCEPTION 'Not authorized'; END IF;
  IF coalesce(p_email,'') = '' THEN RAISE EXCEPTION 'Email required'; END IF;
  SELECT id, email INTO v_id, v_email FROM auth.users WHERE lower(email) = lower(p_email) LIMIT 1;
  IF v_id IS NULL THEN RAISE EXCEPTION 'No user with email %. Ask them to sign up first.', p_email; END IF;
  INSERT INTO public.admin_users (id, email) VALUES (v_id, v_email)
    ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;
  RETURN v_id;
END $$;
REVOKE ALL ON FUNCTION public.promote_admin(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.promote_admin(TEXT) TO authenticated;


CREATE OR REPLACE FUNCTION public.demote_admin(p_id UUID)
RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_count INT;
BEGIN
  IF NOT public.is_admin() THEN RAISE EXCEPTION 'Not authorized'; END IF;
  SELECT count(*) INTO v_count FROM public.admin_users;
  IF v_count <= 1 THEN RAISE EXCEPTION 'Cannot remove the last admin'; END IF;
  DELETE FROM public.admin_users WHERE id = p_id;
  RETURN FOUND;
END $$;
REVOKE ALL ON FUNCTION public.demote_admin(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.demote_admin(UUID) TO authenticated;


-- ┌────────────────────────────────────────────────────────────────┐
-- │ PART 12 — Storage buckets + policies                           │
-- └────────────────────────────────────────────────────────────────┘

INSERT INTO storage.buckets (id, name, public) VALUES ('product-images','product-images', true)
  ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('site-images','site-images', true)
  ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public read product-images"   ON storage.objects;
DROP POLICY IF EXISTS "Admin insert product-images"  ON storage.objects;
DROP POLICY IF EXISTS "Admin update product-images"  ON storage.objects;
DROP POLICY IF EXISTS "Admin delete product-images"  ON storage.objects;
CREATE POLICY "Public read product-images"   ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Admin insert product-images"  ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images' AND public.is_admin());
CREATE POLICY "Admin update product-images"  ON storage.objects FOR UPDATE USING (bucket_id = 'product-images' AND public.is_admin());
CREATE POLICY "Admin delete product-images"  ON storage.objects FOR DELETE USING (bucket_id = 'product-images' AND public.is_admin());

DROP POLICY IF EXISTS "Public read site-images"   ON storage.objects;
DROP POLICY IF EXISTS "Admin insert site-images"  ON storage.objects;
DROP POLICY IF EXISTS "Admin update site-images"  ON storage.objects;
DROP POLICY IF EXISTS "Admin delete site-images"  ON storage.objects;
CREATE POLICY "Public read site-images"   ON storage.objects FOR SELECT USING (bucket_id = 'site-images');
CREATE POLICY "Admin insert site-images"  ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'site-images' AND public.is_admin());
CREATE POLICY "Admin update site-images"  ON storage.objects FOR UPDATE USING (bucket_id = 'site-images' AND public.is_admin());
CREATE POLICY "Admin delete site-images"  ON storage.objects FOR DELETE USING (bucket_id = 'site-images' AND public.is_admin());


-- ════════════════════════════════════════════════════════════════════
--  DONE! Ab admin user banane ke liye:
--
--  1. Supabase Dashboard → Authentication → Users → "Add user"
--     - Email: aapka@email.com
--     - Password: koi strong password
--     - Auto Confirm User: tick karo
--     - Click "Create User"
--
--  2. Phir SQL Editor mein ye chalao (apna email daalo):
--
--     INSERT INTO public.admin_users (id, email)
--     SELECT id, email FROM auth.users
--     WHERE lower(email) = lower('APNA_EMAIL@gmail.com')
--     ON CONFLICT (id) DO NOTHING;
--
--  3. /admin URL pe login karo. Ho gaya!
-- ════════════════════════════════════════════════════════════════════
