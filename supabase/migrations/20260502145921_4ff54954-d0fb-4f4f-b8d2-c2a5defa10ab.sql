-- App settings (key/value) for admin-managed config like Razorpay Key ID
CREATE TABLE public.app_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Public read so the storefront can read the publishable Razorpay Key ID
CREATE POLICY "Public read app_settings"
  ON public.app_settings FOR SELECT
  USING (true);

-- Open write (admin panel uses hardcoded password, no auth users yet)
CREATE POLICY "Open write app_settings"
  ON public.app_settings FOR ALL
  USING (true) WITH CHECK (true);

CREATE TRIGGER touch_app_settings
BEFORE UPDATE ON public.app_settings
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Seed Razorpay settings row
INSERT INTO public.app_settings (key, value)
VALUES ('razorpay', '{"key_id": "", "mode": "test", "secret_configured": false}'::jsonb);

-- Orders table
CREATE TABLE public.orders (
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
  status TEXT NOT NULL DEFAULT 'pending',  -- pending | paid | failed | shipped | delivered | cancelled
  payment_method TEXT,                      -- razorpay | whatsapp
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created ON public.orders(created_at DESC);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Anyone can create an order (checkout is anonymous)
CREATE POLICY "Public insert orders"
  ON public.orders FOR INSERT
  WITH CHECK (true);

-- Public read (admin panel + order confirmation page need this; no auth users yet)
CREATE POLICY "Public read orders"
  ON public.orders FOR SELECT
  USING (true);

-- Open update/delete (admin only via hardcoded password)
CREATE POLICY "Open update orders"
  ON public.orders FOR UPDATE
  USING (true) WITH CHECK (true);

CREATE POLICY "Open delete orders"
  ON public.orders FOR DELETE
  USING (true);

CREATE TRIGGER touch_orders
BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();