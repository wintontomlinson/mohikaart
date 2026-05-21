-- Seed categories (if not existing)
INSERT INTO categories (name, slug, description, image_url, sort_order) VALUES
  ('Name Keychains', 'name-keychains', 'Stunning resin keychains with your name embedded in gold foil', '/src-asset/cat-keychain.jpg', 1),
  ('Photo Frames', 'photo-frames', 'Handcrafted resin frames with dried flowers and gold accents', '/src-asset/cat-frame.jpg', 2),
  ('Wedding Keepsakes', 'wedding-keepsakes', 'Preserve your wedding memories forever in crystal-clear resin', '/src-asset/cat-wedding.jpg', 3),
  ('Resin Trays', 'resin-trays', 'Heart-shaped and custom name trays filled with preserved flowers', '/src-asset/cat-tray.jpg', 4),
  ('Coaster Sets', 'coaster-sets', 'Ocean-inspired resin coasters with swirling blues and golds', '/src-asset/cat-couple.jpg', 5),
  ('Bookmarks', 'bookmarks', 'Delicate pressed flowers sealed in resin for your reading time', '/src-asset/cat-bookmark.jpg', 6),
  ('Gift Hampers', 'gift-hampers', 'Curated collections of handcrafted resin pieces beautifully boxed', '/src-asset/cat-hamper.jpg', 7)
ON CONFLICT (slug) DO NOTHING;

-- Seed products
INSERT INTO products (name, slug, short_description, description, price, original_price, category_slug, image_url, badge, featured, in_stock, sort_order) VALUES
  ('Personalized Name Keychain', 'personalized-name-keychain', 'Stunning resin keychain with gold foil name', 'A stunning resin keychain with your name or loved one''s name embedded in gold foil. Perfect everyday carry or thoughtful gift.', 499, 699, 'name-keychains', '/src-asset/cat-keychain.jpg', 'Bestseller', true, true, 1),
  ('Couple Photo Frame', 'couple-photo-frame', 'Resin frame with dried flowers and gold accents', 'Preserve your favorite couple moment in a handcrafted resin frame with dried flowers and gold accents.', 1299, 1799, 'photo-frames', '/src-asset/cat-frame.jpg', 'Popular', true, true, 2),
  ('Bridal Bouquet Preservation', 'bridal-bouquet-preservation', 'Wedding bouquet preserved in crystal-clear resin', 'Your wedding bouquet preserved forever in crystal-clear resin. A timeless heirloom piece.', 2499, 3499, 'wedding-keepsakes', '/src-asset/cat-wedding.jpg', 'Premium', true, true, 3),
  ('Floral Resin Bookmark', 'floral-resin-bookmark', 'Pressed flowers sealed in resin bookmark', 'Delicate pressed flowers sealed in resin. A beautiful companion for your reading time.', 349, 499, 'bookmarks', '/src-asset/cat-bookmark.jpg', 'New', false, true, 4),
  ('Ocean Resin Coaster Set (Set of 4)', 'ocean-resin-coaster-set', 'Ocean-inspired coasters with blues and golds', 'Ocean-inspired resin coasters with swirling blues and golds. Functional art for your table.', 899, 1199, 'coaster-sets', '/src-asset/cat-couple.jpg', 'Popular', false, true, 5),
  ('Luxury Gift Hamper', 'luxury-gift-hamper', 'Curated handcrafted resin pieces beautifully boxed', 'A curated collection of handcrafted resin pieces beautifully boxed for special occasions.', 2999, 3749, 'gift-hampers', '/src-asset/cat-hamper.jpg', 'Premium', true, true, 6),
  ('Floral Heart Resin Tray', 'floral-heart-resin-tray', 'Heart-shaped tray with preserved flowers', 'Heart-shaped resin tray filled with preserved flowers. Perfect for jewelry or as a decorative piece.', 1199, 1549, 'resin-trays', '/src-asset/cat-tray.jpg', 'Bestseller', true, true, 7),
  ('Custom Name Resin Tray', 'custom-name-resin-tray', 'Personalized tray with elegant calligraphy', 'A personalized resin tray with your name in elegant calligraphy. Ideal gift or home accent.', 1499, 1799, 'resin-trays', '/src-asset/hero-resin-tray.jpg', 'Popular', true, true, 8),
  ('Wedding Memory Frame', 'wedding-memory-frame', 'Custom resin frame with wedding flowers', 'Capture your wedding day in a custom resin frame with flowers from your actual celebration.', 1899, 2499, 'wedding-keepsakes', '/src-asset/gallery-customer.jpg', 'Bestseller', true, true, 9),
  ('Mini Keychains Bundle (Set of 3)', 'mini-keychains-bundle', 'Three mini personalized keychains', 'Three mini personalized keychains. Perfect for bridesmaids, friends, or family gifts.', 999, 1499, 'name-keychains', '/src-asset/gallery-flatlay.jpg', 'New', false, true, 10),
  ('Dried Flower Bookmark Set (Set of 3)', 'dried-flower-bookmark-set', 'Three unique bookmarks with pressed flowers', 'A set of three unique bookmarks with different pressed flower arrangements.', 699, 949, 'bookmarks', '/src-asset/gallery-pouring.jpg', 'Popular', false, true, 11),
  ('Corporate Gift Box', 'corporate-gift-box', 'Elegant branded resin pieces for teams', 'Elegant corporate gift box with branded resin pieces. Perfect for teams and clients.', 3499, 4099, 'gift-hampers', '/src-asset/gallery-packing.jpg', 'Premium', true, true, 12)
ON CONFLICT (slug) DO NOTHING;
