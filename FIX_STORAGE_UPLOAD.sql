-- ════════════════════════════════════════════════════════════════════
--  FIX: Storage upload permissions for admin
--
--  If image upload in admin panel gives "new row violates row-level
--  security policy" error, run this in Supabase SQL Editor.
--
--  This ensures authenticated admin users can upload/update/delete
--  files in both product-images and site-images buckets.
-- ════════════════════════════════════════════════════════════════════

-- Ensure buckets exist
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images','product-images', true)
  ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('site-images','site-images', true)
  ON CONFLICT (id) DO NOTHING;

-- Drop all existing storage policies (clean slate)
DROP POLICY IF EXISTS "Public read product-images"   ON storage.objects;
DROP POLICY IF EXISTS "Admin insert product-images"  ON storage.objects;
DROP POLICY IF EXISTS "Admin update product-images"  ON storage.objects;
DROP POLICY IF EXISTS "Admin delete product-images"  ON storage.objects;
DROP POLICY IF EXISTS "Public read site-images"      ON storage.objects;
DROP POLICY IF EXISTS "Admin insert site-images"     ON storage.objects;
DROP POLICY IF EXISTS "Admin update site-images"     ON storage.objects;
DROP POLICY IF EXISTS "Admin delete site-images"     ON storage.objects;

-- Public can read all images (for storefront display)
CREATE POLICY "Public read product-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

CREATE POLICY "Public read site-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'site-images');

-- Authenticated users (admins) can upload/update/delete
-- Using auth.role() = 'authenticated' instead of is_admin() to avoid
-- circular dependency issues with storage policies
CREATE POLICY "Auth insert product-images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

CREATE POLICY "Auth update product-images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

CREATE POLICY "Auth delete product-images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

CREATE POLICY "Auth insert site-images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'site-images' AND auth.role() = 'authenticated');

CREATE POLICY "Auth update site-images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'site-images' AND auth.role() = 'authenticated');

CREATE POLICY "Auth delete site-images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'site-images' AND auth.role() = 'authenticated');

-- ════════════════════════════════════════════════════════════════════
--  DONE! Ab admin panel se image upload kaam karega.
-- ════════════════════════════════════════════════════════════════════
