import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeft, X, Instagram, ChevronRight, Eye } from "lucide-react";

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
  aspect: "portrait" | "square" | "landscape";
};

const ITEMS: GalleryItem[] = [
  { id: 1, src: catKeychain, name: "Personalized Name Keychain", category: "keychain", categoryLabel: "Keychains", aspect: "portrait" },
  { id: 2, src: catFrame, name: "Couple Photo Frame", category: "frame", categoryLabel: "Photo Frames", aspect: "square" },
  { id: 3, src: catWedding, name: "Bridal Bouquet Preservation", category: "wedding", categoryLabel: "Wedding", aspect: "portrait" },
  { id: 4, src: catBookmark, name: "Floral Resin Bookmark", category: "bookmark", categoryLabel: "Bookmarks", aspect: "landscape" },
  { id: 5, src: catTray, name: "Floral Heart Resin Tray", category: "tray", categoryLabel: "Trays", aspect: "portrait" },
  { id: 6, src: catHamper, name: "Luxury Gift Hamper", category: "hamper", categoryLabel: "Gift Hampers", aspect: "square" },
  { id: 7, src: catCouple, name: "Ocean Resin Coaster Set", category: "coaster", categoryLabel: "Coasters", aspect: "landscape" },
  { id: 8, src: heroTray, name: "Custom Name Resin Tray", category: "tray", categoryLabel: "Trays", aspect: "portrait" },
  { id: 9, src: galleryPouring, name: "Resin Pouring Process", category: "wedding", categoryLabel: "Process", aspect: "square" },
  { id: 10, src: galleryFlat, name: "Mini Keychains Bundle", category: "keychain", categoryLabel: "Keychains", aspect: "landscape" },
  { id: 11, src: galleryCustomer, name: "Wedding Memory Frame", category: "wedding", categoryLabel: "Wedding", aspect: "portrait" },
  { id: 12, src: galleryPacking, name: "Corporate Gift Box", category: "hamper", categoryLabel: "Gift Hampers", aspect: "square" },
  { id: 13, src: galleryWorkspace, name: "Studio Workspace", category: "tray", categoryLabel: "Process", aspect: "landscape" },
];

const CATEGORIES = [
  { slug: "all", label: "All" },
  { slug: "keychain", label: "Keychains" },
  { slug: "frame", label: "Photo Frames" },
  { slug: "wedding", label: "Wedding" },
  { slug: "tray", label: "Trays" },
  { slug: "coaster", label: "Coasters" },
  { slug: "bookmark", label: "Bookmarks" },
  { slug: "hamper", label: "Gift Hampers" },
];

const EASE = [0.22, 1, 0.36, 1] as const;

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

  // Distribute items into 3 columns for masonry
  const columns: GalleryItem[][] = [[], [], []];
  filtered.forEach((item, i) => columns[i % 3].push(item));

  return (
    <div style={{ background: "#fdf9f0" }}>

      {/* ━━ HEADER ━━ */}
      <section className="pt-28 pb-8 md:pb-10">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.16em] mb-8"
            style={{ color: "rgba(26,18,8,0.45)" }}
          >
            <Link to="/" className="hover:text-[#c9a84c] transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span style={{ color: "#1a1208" }}>Gallery</span>
          </motion.nav>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <h1 className="font-display mb-2" style={{ fontWeight: 400, fontSize: "clamp(2.2rem, 5vw, 3.2rem)", lineHeight: 1.1, letterSpacing: "-0.02em", color: "#1a1208" }}>
                Our{" "}
                <em className="font-serif italic" style={{ color: "#c9a84c", fontWeight: 400 }}>Gallery</em>
              </h1>
              <p style={{ fontSize: "15px", color: "rgba(26,18,8,0.6)" }}>
                A glimpse into every piece poured with love
              </p>
            </motion.div>

            <motion.a
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
              href="https://instagram.com/mohikaart"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[11px] tracking-[0.08em] uppercase font-semibold transition-all hover:scale-105 self-start md:self-auto"
              style={{ background: "linear-gradient(135deg, #833AB4, #FD1D1D, #F77737)", color: "#fff" }}
            >
              <Instagram className="w-3.5 h-3.5" /> @mohikaart
            </motion.a>
          </div>
        </div>
      </section>

      {/* ━━ STICKY FILTER BAR ━━ */}
      <div
        className="sticky top-0 z-40"
        style={{
          background: "rgba(253,249,240,0.97)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          boxShadow: "0 1px 0 rgba(26,18,8,0.06), 0 4px 16px -4px rgba(26,18,8,0.05)",
        }}
      >
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-3">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar -mx-1 px-1">
            {CATEGORIES.map((c) => {
              const isActive = activeCategory === c.slug;
              return (
                <button
                  key={c.slug}
                  onClick={() => setActiveCategory(c.slug)}
                  className="shrink-0 transition-all duration-300"
                  style={{
                    padding: "6px 16px",
                    borderRadius: 9999,
                    fontSize: 10,
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    fontWeight: 600,
                    background: isActive ? "#1a1208" : "transparent",
                    color: isActive ? "#fdf9f0" : "rgba(26,18,8,0.5)",
                    border: `1px solid ${isActive ? "#1a1208" : "rgba(26,18,8,0.1)"}`,
                    whiteSpace: "nowrap",
                  }}
                >
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ━━ MASONRY GRID ━━ */}
      <section className="max-w-[1280px] mx-auto px-6 lg:px-8 py-10 md:py-14">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {/* Column-based masonry */}
            {columns.map((col, colIdx) => (
              <div key={colIdx} className="flex flex-col gap-4">
                {col.map((item, itemIdx) => {
                  const globalIdx = filtered.indexOf(item);
                  const aspectClass = item.aspect === "portrait" ? "aspect-[3/4]" : item.aspect === "landscape" ? "aspect-[4/3]" : "aspect-square";
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: (colIdx * col.length + itemIdx) * 0.05, ease: EASE }}
                      className="group relative overflow-hidden cursor-pointer"
                      style={{ borderRadius: 14, boxShadow: "0 4px 16px -6px rgba(26,18,8,0.12)" }}
                      onClick={() => openLightbox(globalIdx)}
                    >
                      <div className={`${aspectClass} overflow-hidden`}>
                        <img
                          src={item.src}
                          alt={item.name}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                        />
                      </div>
                      {/* Hover overlay */}
                      <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-all duration-400" style={{ background: "linear-gradient(to top, rgba(26,18,8,0.75) 0%, rgba(26,18,8,0.1) 50%, transparent 100%)" }}>
                        <p className="text-[9px] uppercase tracking-[0.18em] font-semibold mb-1" style={{ color: "#c9a84c" }}>{item.categoryLabel}</p>
                        <p className="text-sm font-medium text-white leading-tight mb-2">{item.name}</p>
                        <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-semibold text-white/80">
                          <Eye className="w-3 h-3" /> View
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ━━ LIGHTBOX ━━ */}
      <AnimatePresence>
        {lightboxIndex !== null && filtered[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ background: "rgba(26,18,8,0.85)", backdropFilter: "blur(12px)" }}
            onClick={closeLightbox}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="relative max-w-[900px] w-full max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close */}
              <button onClick={closeLightbox} className="absolute -top-10 right-0 w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>

              {/* Image */}
              <img
                src={filtered[lightboxIndex].src}
                alt={filtered[lightboxIndex].name}
                className="w-full max-h-[80vh] object-contain rounded-2xl"
              />

              {/* Info bar */}
              <div className="flex items-center justify-between mt-4 px-2">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] font-semibold" style={{ color: "#c9a84c" }}>{filtered[lightboxIndex].categoryLabel}</p>
                  <p className="text-white text-sm font-medium mt-0.5">{filtered[lightboxIndex].name}</p>
                </div>
                <Link
                  to={`/shop`}
                  onClick={closeLightbox}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[10px] uppercase tracking-wider font-semibold transition-all hover:scale-105"
                  style={{ background: "#c9a84c", color: "#1a1208" }}
                >
                  Shop this <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {/* Nav arrows */}
              <button onClick={(e) => { e.stopPropagation(); goPrev(); }} className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-colors" style={{ background: "rgba(26,18,8,0.5)" }}>
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); goNext(); }} className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-colors" style={{ background: "rgba(26,18,8,0.5)" }}>
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ━━ INSTAGRAM STRIP ━━ */}
      <section className="py-14 md:py-20" style={{ background: "rgba(201,168,76,0.04)" }}>
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
            className="text-center mb-8"
          >
            <p className="text-sm mb-1" style={{ color: "rgba(26,18,8,0.5)" }}>As Seen On</p>
            <p className="font-serif italic text-2xl" style={{ color: "#c9a84c" }}>@mohikaart</p>
          </motion.div>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3">
            {[catKeychain, catFrame, catWedding, catTray, catHamper, catCouple].map((src, i) => (
              <motion.a
                key={i}
                href="https://instagram.com/mohikaart"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="group relative overflow-hidden rounded-xl aspect-square"
              >
                <img src={src} alt="Instagram" loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300" style={{ background: "rgba(26,18,8,0.5)" }}>
                  <Instagram className="w-6 h-6 text-white" />
                </div>
              </motion.a>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-8"
          >
            <p className="text-sm mb-3" style={{ color: "rgba(26,18,8,0.5)" }}>Follow us for daily drops ✨</p>
            <a
              href="https://instagram.com/mohikaart"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] tracking-[0.08em] uppercase font-semibold transition-all hover:scale-105"
              style={{ background: "#c9a84c", color: "#1a1208" }}
            >
              Follow @mohikaart <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* ━━ BOTTOM CTA ━━ */}
      <section className="py-14 md:py-20">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
            className="relative overflow-hidden rounded-3xl px-6 py-14 md:px-12 md:py-16 text-center"
            style={{ background: "#1a1208" }}
          >
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "linear-gradient(120deg, transparent 30%, rgba(201,168,76,0.08) 50%, transparent 70%)", backgroundSize: "200% 100%" }}
              animate={{ backgroundPosition: ["200% 0%", "-200% 0%"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
            <div className="relative z-10">
              <h3 className="font-display text-xl md:text-2xl mb-2" style={{ color: "#fdf9f0", fontWeight: 400 }}>
                See something you love?
              </h3>
              <p className="text-sm mb-7" style={{ color: "rgba(253,249,240,0.6)" }}>
                Shop our collection or order something completely custom.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-[11px] tracking-[0.1em] uppercase font-semibold transition-all hover:scale-105"
                  style={{ background: "#c9a84c", color: "#1a1208" }}
                >
                  Shop Now <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to="/custom-order"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-[11px] tracking-[0.1em] uppercase font-semibold transition-all hover:scale-105"
                  style={{ border: "1.5px solid rgba(253,249,240,0.3)", color: "#fdf9f0" }}
                >
                  Custom Order <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default GalleryPage;
