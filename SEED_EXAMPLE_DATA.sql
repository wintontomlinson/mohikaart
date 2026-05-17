-- ════════════════════════════════════════════════════════════════════
--  MOHIKA ART — SEED EXAMPLE DATA
--
--  Run this AFTER SETUP_DATABASE.sql to populate the site with
--  sample categories, products, and settings so it looks complete.
--
--  Supabase Dashboard → SQL Editor → New query → paste → Run
-- ════════════════════════════════════════════════════════════════════


-- ┌────────────────────────────────────────────────────────────────┐
-- │ Categories                                                      │
-- └────────────────────────────────────────────────────────────────┘

INSERT INTO public.categories (name, slug, description, sort_order) VALUES
('Name Keychains',     'name-keychains',     'Personalized resin keychains with your name preserved in art',    1),
('Photo Frames',       'photo-frames',       'Custom resin frames that turn your photos into timeless art',     2),
('Wedding Keepsakes',  'wedding-keepsakes',  'Preserve your bridal bouquet & wedding memories in luxury resin', 3),
('Bookmarks',          'bookmarks',          'Handcrafted floral resin bookmarks for book lovers',              4),
('Coaster Sets',       'coaster-sets',       'Elegant resin coasters with dried flowers & gold flakes',         5),
('Gift Hampers',       'gift-hampers',       'Curated luxury gift boxes for every occasion',                    6)
ON CONFLICT (slug) DO NOTHING;


-- ┌────────────────────────────────────────────────────────────────┐
-- │ Products (6 featured examples)                                  │
-- └────────────────────────────────────────────────────────────────┘

INSERT INTO public.products (name, slug, short_description, description, price, original_price, category_slug, badge, featured, in_stock, sort_order) VALUES
(
  'Personalized Name Keychain',
  'personalized-name-keychain',
  'Your name beautifully preserved in crystal-clear resin with dried flowers',
  'Each keychain is handcrafted with premium quality resin, real dried flowers, and gold leaf accents. Your name is carefully placed letter by letter to create a one-of-a-kind keepsake that you will cherish forever. Makes a perfect gift for birthdays, anniversaries, or just because.',
  499, 699, 'name-keychains', 'Bestseller', true, true, 1
),
(
  'Couple Photo Frame',
  'couple-photo-frame',
  'A stunning resin frame with preserved flowers around your favorite photo',
  'This luxury photo frame features hand-poured resin with real preserved roses, baby breath flowers, and subtle gold flakes. Your photo is sealed inside creating a timeless piece of art. Perfect for anniversaries, weddings, or as a romantic gift.',
  1299, 1799, 'photo-frames', 'Popular', true, true, 2
),
(
  'Bridal Bouquet Preservation',
  'bridal-bouquet-preservation',
  'Transform your wedding bouquet into a stunning resin art piece',
  'Your precious bridal bouquet deserves to last forever. We carefully preserve each flower petal in crystal-clear resin, creating a breathtaking keepsake that captures the magic of your special day. Choose from tray, block, or frame formats.',
  2499, 3499, 'wedding-keepsakes', 'Premium', true, true, 3
),
(
  'Floral Resin Bookmark',
  'floral-resin-bookmark',
  'Delicate pressed flowers sealed in a slim, elegant resin bookmark',
  'For the book lover who appreciates beauty in every detail. Each bookmark features real pressed flowers — roses, daisies, lavender — preserved in slim, crystal-clear resin. Comes with a silk tassel in gold or blush pink.',
  349, 499, 'bookmarks', 'New', true, true, 4
),
(
  'Gold Flake Coaster Set (4 pcs)',
  'gold-flake-coaster-set',
  'Set of 4 luxury resin coasters with real gold leaf and agate patterns',
  'Elevate your table setting with these stunning handmade resin coasters. Each piece features genuine gold leaf, crushed agate stone, and a geode-inspired edge. Non-slip cork backing. Set of 4 in a gift box.',
  1499, 1999, 'coaster-sets', NULL, true, true, 5
),
(
  'Premium Gift Hamper - Birthday',
  'premium-gift-hamper-birthday',
  'A curated box of resin art pieces perfect for birthdays',
  'The ultimate birthday gift! This premium hamper includes: 1 name keychain, 1 floral bookmark, 2 mini coasters, and a personalized resin initial — all beautifully packaged in our signature gold box with tissue paper and a handwritten note.',
  2199, 2999, 'gift-hampers', 'Gift Pick', true, true, 6
)
ON CONFLICT (slug) DO NOTHING;


-- ┌────────────────────────────────────────────────────────────────┐
-- │ Store Settings (contact info, shipping threshold)               │
-- └────────────────────────────────────────────────────────────────┘

INSERT INTO public.app_settings (key, value) VALUES
('store', '{
  "phone": "919876543210",
  "phone_display": "+91 98765 43210",
  "email": "hello@mohikaart.com",
  "instagram": "mohikaart",
  "free_shipping_threshold": 499,
  "currency": "INR"
}'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO public.app_settings (key, value) VALUES
('seo', '{
  "site_title": "Mohika Art — Customized Resin Crafts & Handmade Gifts",
  "site_description": "Handcrafted premium resin keepsakes — name keychains, photo frames, wedding memories, bookmarks & luxury gift hampers. Pan India delivery.",
  "keywords": "resin art, customized gifts, handmade gifts, wedding bouquet preservation, name keychain, photo frame, corporate gifts, India",
  "og_image": ""
}'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;


-- ════════════════════════════════════════════════════════════════════
--  DONE! Site ab populated hai with:
--  • 6 Categories
--  • 6 Featured Products (with prices, descriptions, badges)
--  • Store contact settings
--  • SEO settings
--
--  Next steps:
--  1. Admin panel se product images upload karo (Products → Edit → Main image)
--  2. Category images bhi add karo (Categories → Edit → Image)
--  3. Site pe hard refresh karo — products/categories dikhne lagenge
-- ════════════════════════════════════════════════════════════════════
