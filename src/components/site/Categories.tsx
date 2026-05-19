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

const FALLBACK_CATEGORIES: Cat[] = [
  { id: "fb-wedding",   name: "Wedding Keepsakes", slug: "wedding-keepsakes", image_url: catWedding },
  { id: "fb-frames",    name: "Photo Frames",      slug: "photo-frames",      image_url: catFrame },
  { id: "fb-keychains", name: "Name Keychains",    slug: "name-keychains",    image_url: catKeychain },
  { id: "fb-coasters",  name: "Coaster Sets",      slug: "coaster-sets",      image_url: catTray },
  { id: "fb-bookmarks", name: "Bookmarks",         slug: "bookmarks",         image_url: catCouple },
  { id: "fb-hampers",   name: "Gift Hampers",      slug: "gift-hampers",      image_url: catHamper },
];

/**
 * Categories — clean luxury ecommerce grid (Shopify-style).
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {display.slice(0, 6).map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.65, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6 }}
              className="group relative overflow-hidden"
              style={{
                borderRadius: "20px",
                background: "#ffffff",
                border: "1px solid #e5e0d8",
              }}
            >
              <Link to={`/category/${c.slug}`} className="block">
                <div className="relative overflow-hidden" style={{ aspectRatio: "4 / 5" }}>
                  <img
                    src={resolveImage(c.image_url)}
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
                        "linear-gradient(to top, rgba(61,43,31,0.72) 0%, rgba(61,43,31,0.15) 45%, transparent 70%)",
                    }}
                  />
                  {/* Title overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                    <div
                      className="flex items-center gap-1.5 mb-1.5 transition-all duration-500 group-hover:translate-x-1"
                      style={{
                        fontSize: "10px",
                        letterSpacing: "0.22em",
                        textTransform: "uppercase",
                        fontWeight: 600,
                        color: "rgba(250,247,244,0.75)",
                      }}
                    >
                      Shop Now
                      <ArrowUpRight
                        style={{
                          width: 12,
                          height: 12,
                          opacity: 0.7,
                        }}
                      />
                    </div>
                    <h3
                      className="font-display"
                      style={{
                        fontWeight: 500,
                        fontSize: "clamp(1.1rem, 1.6vw, 1.35rem)",
                        color: "#FAF7F4",
                        letterSpacing: "-0.01em",
                        lineHeight: 1.2,
                      }}
                    >
                      {c.name}
                    </h3>
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
