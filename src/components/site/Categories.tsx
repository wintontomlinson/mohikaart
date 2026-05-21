import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { resolveImage } from "@/lib/site";

/* Premium product images — same as the Showcase/product grid */
import catKeychain from "@/assets/cat-keychain.jpg";
import catFrame from "@/assets/cat-frame.jpg";
import catWedding from "@/assets/cat-wedding.jpg";
import catBookmark from "@/assets/cat-bookmark.jpg";
import catTray from "@/assets/cat-tray.jpg";
import catHamper from "@/assets/cat-hamper.jpg";

const EASE = [0.22, 1, 0.36, 1] as const;

type Cat = { id: string; name: string; slug: string; image_url: string | null };

/* Premium image mapping — matches categories to the best product images */
const PREMIUM_IMAGES: Record<string, string> = {
  "name-keychains": catKeychain,
  "photo-frames": catFrame,
  "wedding-keepsakes": catWedding,
  "bookmarks": catBookmark,
  "coaster-sets": catTray,
  "gift-hampers": catHamper,
};

const FALLBACK_CATEGORIES: Cat[] = [
  { id: "fb-keychains", name: "Name Keychains", slug: "name-keychains", image_url: catKeychain },
  { id: "fb-frames", name: "Photo Frames", slug: "photo-frames", image_url: catFrame },
  { id: "fb-wedding", name: "Wedding Keepsakes", slug: "wedding-keepsakes", image_url: catWedding },
  { id: "fb-bookmarks", name: "Bookmarks", slug: "bookmarks", image_url: catBookmark },
  { id: "fb-coasters", name: "Coaster Sets", slug: "coaster-sets", image_url: catTray },
  { id: "fb-hampers", name: "Gift Hampers", slug: "gift-hampers", image_url: catHamper },
];

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

  /* Resolve image: use premium local image if available, else fallback to Supabase */
  const getImage = (cat: Cat): string => {
    if (PREMIUM_IMAGES[cat.slug]) return PREMIUM_IMAGES[cat.slug];
    return resolveImage(cat.image_url);
  };

  return (
    <section className="py-14 md:py-18">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
        {heading && (
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 md:mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: EASE }}
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
                <em className="font-serif italic" style={{ color: "#C9964A", fontWeight: 400 }}>
                  collections.
                </em>
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
            >
              <Link
                to="/categories"
                className="inline-flex items-center gap-2 transition-colors duration-300 hover:text-[#C9964A]"
                style={{
                  fontSize: "12px",
                  letterSpacing: "0.12em",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  color: "#3D2B1F",
                  paddingBottom: "4px",
                  borderBottom: "1px solid #C9964A",
                }}
              >
                Shop All Categories
                <ArrowUpRight style={{ width: 14, height: 14 }} />
              </Link>
            </motion.div>
          </div>
        )}

        {/* 3x2 grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 lg:gap-5 max-w-[1060px] mx-auto">
          {display.slice(0, 6).map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.65, delay: (i % 3) * 0.1, ease: EASE }}
              className="group relative"
            >
              <Link
                to={`/category/${c.slug}`}
                className="block relative overflow-hidden rounded-2xl"
                style={{ aspectRatio: "4 / 5" }}
              >
                {/* Image */}
                <img
                  src={getImage(c)}
                  alt={c.name}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-[1.06] group-hover:brightness-[1.05]"
                />

                {/* Default gradient overlay — subtle, elegant */}
                <div
                  aria-hidden
                  className="absolute inset-0 transition-opacity duration-500"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(26,18,8,0.75) 0%, rgba(26,18,8,0.25) 40%, rgba(26,18,8,0.05) 70%, transparent 100%)",
                  }}
                />

                {/* Hover overlay — darker, reveals text */}
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(26,18,8,0.85) 0%, rgba(26,18,8,0.4) 50%, rgba(26,18,8,0.15) 100%)",
                  }}
                />

                {/* Gold border glow on hover */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    boxShadow: "inset 0 0 0 1.5px rgba(201,168,76,0.25), 0 16px 48px -12px rgba(201,168,76,0.2)",
                  }}
                />

                {/* Content overlay */}
                <div className="absolute inset-x-0 bottom-0 p-4 md:p-5 flex flex-col justify-end">
                  {/* Category name */}
                  <h3
                    className="font-display transition-transform duration-500 group-hover:translate-y-[-2px]"
                    style={{
                      fontWeight: 500,
                      fontSize: "clamp(1rem, 1.5vw, 1.2rem)",
                      color: "#FAF7F4",
                      letterSpacing: "-0.01em",
                      lineHeight: 1.2,
                      textShadow: "0 1px 8px rgba(0,0,0,0.3)",
                    }}
                  >
                    {c.name}
                  </h3>

                  {/* "Shop Now" — slides up on hover */}
                  <div
                    className="flex items-center gap-1.5 mt-1.5 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500"
                    style={{
                      fontSize: "9px",
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      fontWeight: 600,
                      color: "#c9a84c",
                    }}
                  >
                    Shop Now
                    <ArrowUpRight style={{ width: 10, height: 10 }} />
                  </div>
                </div>

                {/* Top-right arrow indicator on hover */}
                <div
                  className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-500"
                  style={{
                    background: "rgba(255,255,255,0.12)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}
                >
                  <ArrowUpRight className="w-3 h-3 text-white" />
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
