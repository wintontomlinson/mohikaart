import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeft, X, Instagram, ChevronRight, Eye, Sparkles } from "lucide-react";

import catKeychain from "@/assets/cat-keychain.jpg";
import catFrame from "@/assets/cat-frame.jpg";
import catWedding from "@/assets/cat-wedding.jpg";
import catBookmark from "@/assets/cat-bookmark.jpg";
import catTray from "@/assets/cat-tray.jpg";
import catHamper from "@/assets/cat-hamper.jpg";
import catCouple from "@/assets/cat-couple.jpg";
import heroTray from "@/assets/hero-resin-tray.jpg";
import galleryFlat from "@/assets/gallery-flatlay.jpg";
import galleryCustomer from "@/assets/gallery-customer.jpg";
import galleryPacking from "@/assets/gallery-packing.jpg";
import galleryPouring from "@/assets/gallery-pouring.jpg";
import galleryWorkspace from "@/assets/gallery-workspace.jpg";

type GalleryItem = {
  id: number;
  src: string;
  name: string;
  category: string;
  categoryLabel: string;
};

const ITEMS: GalleryItem[] = [
  { id: 1, src: catKeychain, name: "Personalized Name Keychain", category: "keychain", categoryLabel: "Keychains" },
  { id: 2, src: catFrame, name: "Couple Photo Frame", category: "frame", categoryLabel: "Photo Frames" },
  { id: 3, src: catWedding, name: "Bridal Bouquet Preservation", category: "wedding", categoryLabel: "Wedding" },
  { id: 4, src: catBookmark, name: "Floral Resin Bookmark", category: "bookmark", categoryLabel: "Bookmarks" },
  { id: 5, src: catTray, name: "Floral Heart Resin Tray", category: "tray", categoryLabel: "Trays" },
  { id: 6, src: catHamper, name: "Luxury Gift Hamper", category: "hamper", categoryLabel: "Gift Hampers" },
  { id: 7, src: catCouple, name: "Ocean Resin Coaster Set", category: "coaster", categoryLabel: "Coasters" },
  { id: 8, src: heroTray, name: "Custom Name Resin Tray", category: "tray", categoryLabel: "Trays" },
  { id: 9, src: galleryPouring, name: "Resin Pouring Process", category: "process", categoryLabel: "Process" },
  { id: 10, src: galleryFlat, name: "Mini Keychains Bundle", category: "keychain", categoryLabel: "Keychains" },
  { id: 11, src: galleryCustomer, name: "Wedding Memory Frame", category: "wedding", categoryLabel: "Wedding" },
  { id: 12, src: galleryPacking, name: "Corporate Gift Box", category: "hamper", categoryLabel: "Gift Hampers" },
  { id: 13, src: galleryWorkspace, name: "Studio Workspace", category: "process", categoryLabel: "Process" },
];

const CATEGORIES = [
  { slug: "all", label: "All" },
  { slug: "keychain", label: "Keychains" },
  { slug: "frame", label: "Frames" },
  { slug: "wedding", label: "Wedding" },
  { slug: "tray", label: "Trays" },
  { slug: "coaster", label: "Coasters" },
  { slug: "bookmark", label: "Bookmarks" },
  { slug: "hamper", label: "Hampers" },
  { slug: "process", label: "Process" },
];

const EASE = [0.22, 1, 0.36, 1] as const;

/* ── Lazy-load image with fade-in reveal ── */
const LazyImage = ({ src, alt, className = "" }: { src: string; alt: string; className?: string }) => {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imgRef.current?.complete) setLoaded(true);
  }, []);

  return (
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      loading="lazy"
      onLoad={() => setLoaded(true)}
      className={`${className} transition-all duration-700 ${loaded ? "opacity-100 scale-100" : "opacity-0 scale-[1.02]"}`}
      style={{ willChange: "opacity, transform" }}
    />
  );
};

const GalleryPage = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = activeCategory === "all" ? ITEMS : ITEMS.filter((item) => item.category === activeCategory);

  const openLightbox = (idx: number) => setLightboxIndex(idx);
  const closeLightbox = () => setLightboxIndex(null);

  const goNext = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % filtered.length);
  }, [lightboxIndex, filtered.length]);

  const goPrev = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + filtered.length) % filtered.length);
  }, [lightboxIndex, filtered.length]);

  // Keyboard navigation
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxIndex, goNext, goPrev]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [lightboxIndex]);

  return (
    <div style={{ background: "#fdf9f0", minHeight: "100vh" }}>

      {/* ━━ HEADER ━━ */}
      <section className="pt-28 pb-6 md:pb-8">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.16em] mb-6"
            style={{ color: "rgba(26,18,8,0.4)" }}
          >
            <Link to="/" className="hover:text-[#c9a84c] transition-colors">Home</Link>
            <ChevronRight className="w-2.5 h-2.5" />
            <span style={{ color: "#1a1208" }}>Gallery</span>
          </motion.nav>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE }}
            >
              <p
                className="font-semibold uppercase mb-2"
                style={{ fontSize: "10px", color: "#c9a84c", letterSpacing: "0.28em" }}
              >
                Portfolio
              </p>
              <h1
                className="font-display"
                style={{
                  fontWeight: 400,
                  fontSize: "clamp(2rem, 4.5vw, 3rem)",
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                  color: "#1a1208",
                }}
              >
                Our{" "}
                <em className="font-serif italic" style={{ color: "#c9a84c", fontWeight: 400 }}>
                  Gallery
                </em>
              </h1>
              <p className="mt-2" style={{ fontSize: "14px", color: "rgba(26,18,8,0.55)", maxWidth: 380 }}>
                Every piece tells a story — explore our handcrafted resin collection
              </p>
            </motion.div>

            <motion.a
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
              href="https://instagram.com/mohikaart"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] tracking-[0.1em] uppercase font-semibold transition-all hover:scale-105 self-start md:self-auto overflow-hidden"
              style={{ background: "linear-gradient(135deg, #833AB4, #FD1D1D, #F77737)", color: "#fff" }}
            >
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)" }} />
              <Instagram className="w-3.5 h-3.5 relative z-10" />
              <span className="relative z-10">@mohikaart</span>
            </motion.a>
          </div>
        </div>
      </section>

      {/* ━━ CATEGORY PILLS — Sticky, Minimal, Premium ━━ */}
      <section
        className="sticky top-[60px] md:top-[68px] z-30"
        style={{
          background: "rgba(253,249,240,0.88)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          borderBottom: "1px solid rgba(26,18,8,0.05)",
        }}
      >
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-3">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar -mx-1 px-1">
            {CATEGORIES.map((c) => {
              const isActive = activeCategory === c.slug;
              return (
                <motion.button
                  key={c.slug}
                  onClick={() => setActiveCategory(c.slug)}
                  className="shrink-0 relative"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    padding: "5px 14px",
                    borderRadius: 9999,
                    fontSize: 10,
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    fontWeight: 600,
                    background: isActive ? "#1a1208" : "transparent",
                    color: isActive ? "#fdf9f0" : "rgba(26,18,8,0.5)",
                    border: `1px solid ${isActive ? "#1a1208" : "rgba(26,18,8,0.1)"}`,
                    whiteSpace: "nowrap",
                    transition: "all 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                >
                  {c.label}
                  {isActive && (
                    <motion.span
                      layoutId="activePill"
                      className="absolute inset-0 rounded-full"
                      style={{ background: "#1a1208", zIndex: -1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ━━ CSS COLUMNS MASONRY GRID ━━ */}
      <section className="max-w-[1280px] mx-auto px-6 lg:px-8 py-8 md:py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="gallery-masonry"
            style={{
              columnCount: 3,
              columnGap: "12px",
            }}
          >
            {filtered.map((item, idx) => {
              const globalIdx = filtered.indexOf(item);
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, delay: idx * 0.04, ease: EASE }}
                  className="group relative mb-3 cursor-pointer overflow-hidden"
                  style={{
                    breakInside: "avoid",
                    borderRadius: 12,
                    display: "inline-block",
                    width: "100%",
                  }}
                  onClick={() => openLightbox(globalIdx)}
                >
                  {/* Image — natural aspect ratio, no forced heights */}
                  <div className="relative overflow-hidden rounded-xl">
                    <LazyImage
                      src={item.src}
                      alt={item.name}
                      className="w-full h-auto block object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />

                    {/* Glass overlay on hover */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end"
                      style={{
                        background: "linear-gradient(to top, rgba(26,18,8,0.72) 0%, rgba(26,18,8,0.2) 40%, transparent 70%)",
                      }}
                    >
                      {/* Top-right view icon */}
                      <div className="absolute top-3 right-3">
                        <motion.div
                          initial={false}
                          className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{
                            background: "rgba(255,255,255,0.15)",
                            backdropFilter: "blur(8px)",
                            border: "1px solid rgba(255,255,255,0.2)",
                          }}
                        >
                          <Eye className="w-3.5 h-3.5 text-white" />
                        </motion.div>
                      </div>

                      {/* Bottom info */}
                      <div className="p-4">
                        <p
                          className="text-[8px] uppercase tracking-[0.22em] font-semibold mb-1"
                          style={{ color: "#c9a84c" }}
                        >
                          {item.categoryLabel}
                        </p>
                        <p className="text-[13px] font-medium text-white leading-snug">
                          {item.name}
                        </p>
                      </div>
                    </div>

                    {/* Soft shadow glow on hover */}
                    <div
                      className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        boxShadow: "inset 0 0 0 1px rgba(201,168,76,0.2), 0 12px 40px -8px rgba(201,168,76,0.2)",
                      }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Empty state */}
        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Sparkles className="w-8 h-8 mx-auto mb-4" style={{ color: "#c9a84c" }} />
            <p className="text-sm" style={{ color: "rgba(26,18,8,0.5)" }}>
              No items in this category yet
            </p>
          </motion.div>
        )}
      </section>

      {/* ━━ LIGHTBOX ━━ */}
      <AnimatePresence>
        {lightboxIndex !== null && filtered[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
            style={{ background: "rgba(26,18,8,0.92)", backdropFilter: "blur(16px)" }}
            onClick={closeLightbox}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="relative max-w-[860px] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={closeLightbox}
                className="absolute -top-12 right-0 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}
              >
                <X className="w-4 h-4 text-white/80" />
              </button>

              {/* Image */}
              <motion.img
                key={filtered[lightboxIndex].id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                src={filtered[lightboxIndex].src}
                alt={filtered[lightboxIndex].name}
                className="w-full max-h-[75vh] object-contain rounded-2xl"
              />

              {/* Info bar */}
              <div className="flex items-center justify-between mt-5 px-1">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.22em] font-semibold" style={{ color: "#c9a84c" }}>
                    {filtered[lightboxIndex].categoryLabel}
                  </p>
                  <p className="text-white text-sm font-medium mt-0.5">
                    {filtered[lightboxIndex].name}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-white/40">
                    {lightboxIndex + 1} / {filtered.length}
                  </span>
                  <Link
                    to="/shop"
                    onClick={closeLightbox}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[9px] uppercase tracking-[0.12em] font-semibold transition-all hover:scale-105"
                    style={{ background: "#c9a84c", color: "#1a1208" }}
                  >
                    Shop <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              {/* Navigation arrows */}
              <button
                onClick={(e) => { e.stopPropagation(); goPrev(); }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.12)" }}
              >
                <ArrowLeft className="w-4 h-4 text-white/80" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); goNext(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.12)" }}
              >
                <ArrowRight className="w-4 h-4 text-white/80" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ━━ INSTAGRAM STRIP ━━ */}
      <section className="py-16 md:py-20" style={{ background: "rgba(201,168,76,0.03)" }}>
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
            className="text-center mb-8"
          >
            <p className="text-[11px] uppercase tracking-[0.2em] font-semibold mb-2" style={{ color: "rgba(26,18,8,0.4)" }}>
              Follow Along
            </p>
            <p className="font-serif italic text-2xl" style={{ color: "#c9a84c" }}>
              @mohikaart
            </p>
          </motion.div>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-2.5">
            {[catKeychain, catFrame, catWedding, catTray, catHamper, catCouple].map((src, i) => (
              <motion.a
                key={i}
                href="https://instagram.com/mohikaart"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="group relative overflow-hidden rounded-lg aspect-square"
              >
                <img
                  src={src}
                  alt="Instagram"
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-400"
                  style={{ background: "rgba(26,18,8,0.55)" }}
                >
                  <Instagram className="w-5 h-5 text-white" />
                </div>
              </motion.a>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mt-8"
          >
            <a
              href="https://instagram.com/mohikaart"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[10px] tracking-[0.1em] uppercase font-semibold transition-all hover:scale-105 overflow-hidden"
              style={{ background: "#1a1208", color: "#fdf9f0" }}
            >
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" style={{ background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.15), transparent)" }} />
              <span className="relative z-10 flex items-center gap-2">
                Follow @mohikaart <ArrowRight className="w-3 h-3" />
              </span>
            </a>
          </motion.div>
        </div>
      </section>

      {/* ━━ BOTTOM CTA ━━ */}
      <section className="py-12 md:py-16">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
            className="relative overflow-hidden rounded-[2rem] px-6 py-14 md:px-12 md:py-16 text-center"
            style={{ background: "linear-gradient(160deg, #1a1208 0%, #2a1c10 50%, #1a1208 100%)" }}
          >
            {/* Shimmer */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "linear-gradient(120deg, transparent 30%, rgba(201,168,76,0.06) 50%, transparent 70%)", backgroundSize: "200% 100%" }}
              animate={{ backgroundPosition: ["200% 0%", "-200% 0%"] }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            />
            {/* Border glow */}
            <div className="absolute inset-0 rounded-[2rem] pointer-events-none" style={{ border: "1px solid rgba(201,168,76,0.1)" }} />

            <div className="relative z-10">
              <Sparkles className="w-5 h-5 mx-auto mb-4" style={{ color: "#c9a84c", opacity: 0.6 }} />
              <h3 className="font-display text-xl md:text-2xl mb-2" style={{ color: "#fdf9f0", fontWeight: 400 }}>
                See something you{" "}
                <em className="font-serif italic" style={{ color: "#c9a84c" }}>love?</em>
              </h3>
              <p className="text-[13px] mb-8 max-w-sm mx-auto" style={{ color: "rgba(253,249,240,0.5)", lineHeight: 1.7 }}>
                Shop our curated collection or create something completely custom.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link
                  to="/shop"
                  className="group relative inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-[10px] tracking-[0.1em] uppercase font-semibold overflow-hidden transition-all hover:scale-105"
                  style={{ background: "#c9a84c", color: "#1a1208", boxShadow: "0 6px 24px -6px rgba(201,168,76,0.5)" }}
                >
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)" }} />
                  <span className="relative z-10 flex items-center gap-2">
                    Shop Now <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
                <Link
                  to="/custom-order"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-[10px] tracking-[0.1em] uppercase font-semibold transition-all hover:scale-105"
                  style={{ border: "1.5px solid rgba(253,249,240,0.2)", color: "rgba(253,249,240,0.7)" }}
                >
                  Custom Order <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ━━ MASONRY CSS for responsive columns ━━ */}
      <style>{`
        .gallery-masonry {
          column-count: 2;
          column-gap: 10px;
        }
        @media (min-width: 640px) {
          .gallery-masonry {
            column-count: 2;
            column-gap: 12px;
          }
        }
        @media (min-width: 768px) {
          .gallery-masonry {
            column-count: 3;
            column-gap: 12px;
          }
        }
        @media (min-width: 1024px) {
          .gallery-masonry {
            column-count: 3;
            column-gap: 14px;
          }
        }
      `}</style>
    </div>
  );
};

export default GalleryPage;
