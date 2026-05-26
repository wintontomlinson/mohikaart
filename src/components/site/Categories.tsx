import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
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
  { id: "fb-wedding", name: "Wedding Keepsakes", slug: "wedding-keepsakes", image_url: catWedding },
  { id: "fb-frames", name: "Photo Frames", slug: "photo-frames", image_url: catFrame },
  { id: "fb-keychains", name: "Name Keychains", slug: "name-keychains", image_url: catKeychain },
  { id: "fb-coasters", name: "Coaster Sets", slug: "coaster-sets", image_url: catTray },
  { id: "fb-bookmarks", name: "Bookmarks", slug: "bookmarks", image_url: catCouple },
  { id: "fb-hampers", name: "Gift Hampers", slug: "gift-hampers", image_url: catHamper },
];

/* ── Simple 3D tilt on hover (no external dependency) ── */
function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || window.matchMedia("(pointer: coarse)").matches) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    cardRef.current.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale3d(1.03,1.03,1.03)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)";
  };

  return (
    <div
      ref={cardRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transition: "transform 0.4s cubic-bezier(0.22,1,0.36,1)", transformStyle: "preserve-3d" }}
    >
      {children}
      {/* Glare overlay */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-[0.15] transition-opacity duration-500"
        style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 60%)" }}
      />
    </div>
  );
}

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
    <section className="py-14 md:py-18">
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
                <em className="font-serif italic" style={{ color: "#C9964A", fontWeight: 400 }}>
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

        {/* 3x2 grid, centered */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 lg:gap-5 max-w-[960px] mx-auto">
          {display.slice(0, 6).map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.65, delay: (i % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="group relative"
            >
              <TiltCard className="relative overflow-hidden rounded-2xl bg-white border border-[#e5e0d8]">
                <Link to={`/category/${c.slug}`} className="block">
                  <div className="relative overflow-hidden" style={{ aspectRatio: "1 / 1" }}>
                    <img
                      src={resolveImage(c.image_url)}
                      alt={c.name}
                      loading="lazy"
                      decoding="async"
                      width={400}
                      height={400}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                      style={{ backgroundColor: "hsl(36 30% 94%)" }}
                    />
                    <div
                      aria-hidden
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(61,43,31,0.78) 0%, rgba(61,43,31,0.15) 50%, transparent 75%)",
                      }}
                    />
                    <div className="absolute inset-x-0 bottom-0 p-3 md:p-4">
                      <h3
                        className="font-display"
                        style={{
                          fontWeight: 500,
                          fontSize: "clamp(0.95rem, 1.3vw, 1.15rem)",
                          color: "#FAF7F4",
                          letterSpacing: "-0.01em",
                          lineHeight: 1.2,
                        }}
                      >
                        {c.name}
                      </h3>
                      <div
                        className="flex items-center gap-1 mt-1 transition-all duration-500 group-hover:translate-x-1"
                        style={{
                          fontSize: "9.5px",
                          letterSpacing: "0.2em",
                          textTransform: "uppercase",
                          fontWeight: 600,
                          color: "rgba(250,247,244,0.7)",
                        }}
                      >
                        Shop Now
                        <ArrowUpRight style={{ width: 11, height: 11, opacity: 0.7 }} />
                      </div>
                    </div>
                  </div>
                </Link>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
