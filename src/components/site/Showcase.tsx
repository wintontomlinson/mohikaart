import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useProducts, ProductCard, Product } from "./ProductCard";

// Fallback products with Unsplash images shown when Supabase returns empty
const FALLBACK_PRODUCTS: Product[] = [
  { id: "fp-1", slug: "personalized-name-keychain", name: "Personalized Name Keychain", price: 499, original_price: 699, image_url: "https://images.unsplash.com/photo-1608848461950-0fe51dfc41cb?w=600&q=80", badge: "Bestseller", short_description: null, category_slug: "name-keychains" },
  { id: "fp-2", slug: "couple-photo-frame", name: "Couple Photo Frame", price: 1299, original_price: 1799, image_url: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&q=80", badge: "Popular", short_description: null, category_slug: "photo-frames" },
  { id: "fp-3", slug: "bridal-bouquet-preservation", name: "Bridal Bouquet Preservation", price: 2499, original_price: 3499, image_url: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80", badge: "Premium", short_description: null, category_slug: "wedding-keepsakes" },
  { id: "fp-4", slug: "floral-resin-bookmark", name: "Floral Resin Bookmark", price: 349, original_price: 499, image_url: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=80", badge: "New", short_description: null, category_slug: "bookmarks" },
  { id: "fp-5", slug: "ocean-resin-coaster-set", name: "Ocean Resin Coaster Set", price: 899, original_price: 1199, image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", badge: "Popular", short_description: null, category_slug: "coaster-sets" },
  { id: "fp-6", slug: "luxury-gift-hamper", name: "Luxury Gift Hamper", price: 2999, original_price: 3749, image_url: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&q=80", badge: "Premium", short_description: null, category_slug: "gift-hampers" },
];

/**
 * Best Sellers, premium ecommerce grid section.
 * Shows 6 featured products in a clean 3-col layout (Shopify luxury style).
 * Falls back to curated Unsplash images when Supabase is empty.
 */
const Showcase = () => {
  const { data, loading } = useProducts({ featured: true, limit: 6 });
  const display = data.length > 0 ? data : FALLBACK_PRODUCTS;

  return (
    <section className="py-16 md:py-20" style={{ background: "#FAF7F4" }}>
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 md:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <p
              className="font-semibold uppercase mb-3"
              style={{ fontSize: "11px", color: "#C9964A", letterSpacing: "0.25em" }}
            >
              Best Sellers
            </p>
            <h2
              className="font-display"
              style={{
                fontWeight: 400,
                fontSize: "clamp(1.85rem, 3.8vw, 2.6rem)",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                color: "#3D2B1F",
              }}
            >
              Loved by{" "}
              <em
                className="font-serif italic"
                style={{ color: "#C9964A", fontWeight: 400 }}
              >
                everyone.
              </em>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 transition-colors"
              style={{
                fontSize: "12px",
                letterSpacing: "0.12em",
                fontWeight: 600,
                textTransform: "uppercase",
                color: "#3D2B1F",
                paddingBottom: "4px",
                borderBottom: "1px solid #C9964A",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#C9964A")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#3D2B1F")}
            >
              View All Products
              <ArrowRight style={{ width: 14, height: 14 }} />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={`skeleton-${i}`}
                  className="aspect-square animate-pulse"
                  style={{ borderRadius: "20px", background: "rgba(61,43,31,0.05)" }}
                  aria-hidden="true"
                />
              ))
            : display.map((p, i) => <ProductCard key={p.id} p={p} index={i} />)
          }
        </div>
      </div>
    </section>
  );
};

export default Showcase;
