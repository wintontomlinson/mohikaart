-- Categories
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Products
CREATE TABLE public.products (
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

-- Site image slots (hero, about, etc.)
CREATE TABLE public.site_images (
  key TEXT PRIMARY KEY,
  image_url TEXT NOT NULL,
  alt TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER trg_categories_updated  BEFORE UPDATE ON public.categories  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER trg_products_updated    BEFORE UPDATE ON public.products    FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER trg_site_images_updated BEFORE UPDATE ON public.site_images FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- RLS
ALTER TABLE public.categories  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_images ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Public read categories"  ON public.categories  FOR SELECT USING (true);
CREATE POLICY "Public read products"    ON public.products    FOR SELECT USING (true);
CREATE POLICY "Public read site_images" ON public.site_images FOR SELECT USING (true);

-- Open write (admin uses hardcoded password gate client-side per user request)
CREATE POLICY "Open write categories"  ON public.categories  FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Open write products"    ON public.products    FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Open write site_images" ON public.site_images FOR ALL USING (true) WITH CHECK (true);

-- Storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images','product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies (open per user choice of hardcoded password admin)
CREATE POLICY "Public read product-images"   ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Public insert product-images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images');
CREATE POLICY "Public update product-images" ON storage.objects FOR UPDATE USING (bucket_id = 'product-images');
CREATE POLICY "Public delete product-images" ON storage.objects FOR DELETE USING (bucket_id = 'product-images');