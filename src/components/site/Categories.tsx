import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { resolveImage } from "@/lib/site";
import catWedding from "@/assets/cat-wedding.jpg";
import catTray from "@/assets/cat-tray.jpg";
import catCouple from "@/assets/cat-couple.jpg";
import catFrame from "@/assets/cat-frame.jpg";
import catKeychain from "@/assets/cat-keychain.jpg";
import catHamper from "@/assets/cat-hamper.jpg";

type Cat = { id: string; name: string; slug: string; image_url: string | null };

// High quality Unsplash fallback images for each category
const UNSPLASH_FALLBACKS: Record<string, string> = {
  "wedding-keepsakes": "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80",
  "photo-frames":      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&q=80",
  "name-keychains":    "https://images.unsplash.com/photo-1608848461950-0fe51dfc41cb?w=600&q=80",
  "coaster-sets":      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
  "bookmarks":         "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=80",
  "gift-hampers":      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&q=80",
  "resin-trays":       "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=600&q=80",
};

const FALLBACK_CATEGORIES: Cat[] = [
  { id: "fb-wedding",   name: "Wedding Keepsakes", slug: "wedding-keepsakes", image_url: UNSPLASH_FALLBACKS["wedding-keepsakes"] },
  { id: "fb-frames",    name: "Photo Frames",      slug: "photo-frames",      image_url: UNSPLASH_FALLBACKS["photo-frames"] },
  { id: "fb-keychains", name: "Name Keychains",    slug: "name-keychains",    image_url: UNSPLASH_FALLBACKS["name-keychains"] },
  { id: "fb-coasters",  name: "Coaster Sets",      slug: "coaster-sets",      image_url: UNSPLASH_FALLBACKS["coaster-sets"] },
  { id: "fb-bookmarks", name: "Bookmarks",         slug: "bookmarks",         image_url: UNSPLASH_FALLBACKS["bookmarks"] },
  { id: "fb-hampers",   name: "Gift Hampers",      slug: "gift-hampers",      image_url: UNSPLASH_FALLBACKS["gift-hampers"] },
];

/**
 * Categories, clean luxury ecommerce grid (Shopify-style).
 * 3-up on desktop, 2-up tablet, 1-up mobile. Balanced spacing.
 */
const Categories = ({ heading = true }: { heading?: boolean }) => {
  const [cats, setCats] = useState<Cat[]>([]);

  useEffect(() => {
    supabase
      .from("categories")
      .select("id,name,slug,image_url")
      .order("sort_order")
      .then(({ data }) => setCats((data ?? []) as Cat[]));
  }, []);

  const display = cats.length > 0 ? cats : FALLBACK_CATEGORIES;

  return (
    <section className="py-16 md:py-20">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
        {heading && (
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
                Categories
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
                Curated{" "}
                <em
                  className="font-serif italic"
                  style={{ color: "#C9964A", fontWeight: 400 }}
                >
                  collections.
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
                to="/categories"
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
                Shop All Categories
                <ArrowUpRight style={{ width: 14, height: 14 }} />
              </Link>
            </motion.div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5 lg:gap-6">
          {display.slice(0, 6).map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.65, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -5 }}
              className="group relative overflow-hidden"
              style={{
                borderRadius: "20px",
                background: "#ffffff",
                border: "1px solid #e5e0d8",
                boxShadow: "0 4px 20px -8px rgba(61,43,31,0.08)",
              }}
            >
              <Link to={`/category/${c.slug}`} className="block">
                <div className="relative overflow-hidden" style={{ aspectRatio: "4 / 5" }}>
                  <img
                    src={c.image_url?.startsWith("http") ? c.image_url : resolveImage(c.image_url)}
                    alt={c.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                  />
                  {/* Soft dark gradient at bottom for legibility */}
                  <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(61,43,31,0.82) 0%, rgba(61,43,31,0.25) 45%, transparent 70%)",
                    }}
                  />
                  {/* Title overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
                    <h3
                      className="font-display"
                      style={{
                        fontWeight: 500,
                        fontSize: "clamp(1.1rem, 1.8vw, 1.4rem)",
                        color: "#FAF7F4",
                        letterSpacing: "-0.01em",
                        lineHeight: 1.2,
                      }}
                    >
                      {c.name}
                    </h3>
                    <div
                      className="flex items-center gap-1.5 mt-2 transition-all duration-500 group-hover:translate-x-1"
                      style={{
                        fontSize: "11px",
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        fontWeight: 600,
                        color: "rgba(250,247,244,0.8)",
                      }}
                    >
                      Shop Now
                      <ArrowUpRight style={{ width: 12, height: 12, opacity: 0.8 }} />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
