import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowRight } from "lucide-react";
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

type Cat = { id: string; name: string; slug: string; image_url: string | null; tagline?: string };

/* Premium image mapping — matches categories to the best product images */
const PREMIUM_IMAGES: Record<string, string> = {
  "name-keychains": catKeychain,
  "photo-frames": catFrame,
  "wedding-keepsakes": catWedding,
  "bookmarks": catBookmark,
  "coaster-sets": catTray,
  "gift-hampers": catHamper,
};

const CATEGORY_TAGLINES: Record<string, string> = {
  "name-keychains": "Personalized resin art",
  "photo-frames": "Preserve your moments",
  "wedding-keepsakes": "Timeless memories",
  "bookmarks": "Floral resin elegance",
  "coaster-sets": "Functional luxury",
  "gift-hampers": "Curated with love",
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
    <section className="py-16 md:py-20" style={{ background: "#FAF7F4" }}>
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

        {/* 3x2 grid — matches product showcase layout */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4 lg:gap-5">
          {display.slice(0, 6).map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55, delay: i * 0.08, ease: EASE }}
              className="group cursor-pointer"
              style={{
                transition: "transform 0.4s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow = "0 24px 48px -16px rgba(26,18,8,0.14), 0 0 0 1px rgba(201,168,76,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 16px -8px rgba(26,18,8,0.08)";
              }}
            >
              <Link to={`/category/${c.slug}`} className="block">
                {/* Image container — bright, sharp, no dark overlay */}
                <div
                  className="relative overflow-hidden rounded-2xl"
                  style={{
                    aspectRatio: "1 / 1",
                    boxShadow: "0 4px 16px -8px rgba(26,18,8,0.08)",
                  }}
                >
                  <img
                    src={getImage(c)}
                    alt={c.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]"
                  />

                  {/* Subtle bottom gradient for text legibility (very light) */}
                  <div
                    aria-hidden
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: "linear-gradient(to top, rgba(26,18,8,0.5) 0%, rgba(26,18,8,0.1) 40%, transparent 70%)",
                    }}
                  />

                  {/* Glassmorphism overlay on hover */}
                  <div
                    className="absolute inset-x-3 bottom-3 rounded-xl opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500"
                    style={{
                      padding: "10px 14px",
                      background: "rgba(255,255,255,0.85)",
                      backdropFilter: "blur(16px) saturate(160%)",
                      WebkitBackdropFilter: "blur(16px) saturate(160%)",
                      border: "1px solid rgba(255,255,255,0.6)",
                      boxShadow: "0 8px 24px -8px rgba(26,18,8,0.15)",
                    }}
                  >
                    <span
                      className="flex items-center justify-center gap-1.5 text-center"
                      style={{
                        fontSize: "10px",
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        fontWeight: 600,
                        color: "#3D2B1F",
                      }}
                    >
                      Explore Collection
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>

                  {/* Top-left category pill */}
                  <div
                    className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full"
                    style={{
                      background: "rgba(255,255,255,0.9)",
                      backdropFilter: "blur(8px)",
                      boxShadow: "0 2px 8px -2px rgba(0,0,0,0.1)",
                      fontSize: "8px",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      fontWeight: 700,
                      color: "#c9a84c",
                    }}
                  >
                    {display.length > 0 && (i + 1).toString().padStart(2, "0")}
                  </div>
                </div>

                {/* Card body — clean white, matching product showcase cards */}
                <div className="mt-3 px-1">
                  {/* Category tagline */}
                  <div
                    className="text-[8px] sm:text-[9px] uppercase tracking-[0.18em] font-semibold mb-0.5"
                    style={{ color: "#c9a84c" }}
                  >
                    {CATEGORY_TAGLINES[c.slug] || "Handmade · Premium"}
                  </div>
                  {/* Category name */}
                  <h3
                    className="font-display"
                    style={{
                      fontWeight: 500,
                      fontSize: "clamp(0.95rem, 1.4vw, 1.15rem)",
                      color: "#1a1208",
                      letterSpacing: "-0.01em",
                      lineHeight: 1.25,
                    }}
                  >
                    {c.name}
                  </h3>
                  {/* Explore link */}
                  <div
                    className="flex items-center gap-1 mt-1.5 transition-all duration-300 group-hover:gap-2"
                    style={{
                      fontSize: "11px",
                      fontWeight: 500,
                      color: "rgba(26,18,8,0.45)",
                    }}
                  >
                    <span className="transition-colors duration-300 group-hover:text-[#c9a84c]">
                      Shop Now
                    </span>
                    <ArrowRight
                      className="w-3 h-3 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-[#c9a84c]"
                    />
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
