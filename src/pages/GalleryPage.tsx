import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

import g1 from "@/assets/gallery-pouring.jpg";
import g2 from "@/assets/gallery-packing.jpg";
import g3 from "@/assets/gallery-flatlay.jpg";
import g4 from "@/assets/gallery-workspace.jpg";
import g5 from "@/assets/gallery-customer.jpg";
import g6 from "@/assets/cat-couple.jpg";
import catKeychain from "@/assets/cat-keychain.jpg";
import catFrame from "@/assets/cat-frame.jpg";
import catWedding from "@/assets/cat-wedding.jpg";
import catHamper from "@/assets/cat-hamper.jpg";

const LUXE_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

type Category = "All" | "Keychains" | "Frames" | "Wedding" | "Packaging";
const TABS: Category[] = ["All", "Keychains", "Frames", "Wedding", "Packaging"];

type GalleryItem = { src: string; alt: string; category: Exclude<Category, "All"> };

// Hand-curated mix so each filter shows a varied set, and "All" feels rhythmic.
const IMAGES: GalleryItem[] = [
  { src: g1, alt: "Resin being poured into a mould", category: "Wedding" },
  { src: catKeychain, alt: "Personalised resin keychain", category: "Keychains" },
  { src: g3, alt: "Studio flat lay of finished pieces", category: "Frames" },
  { src: catFrame, alt: "Pressed flower resin frame", category: "Frames" },
  { src: g2, alt: "Hand-tied packaging being prepared", category: "Packaging" },
  { src: catWedding, alt: "Preserved wedding bouquet keepsake", category: "Wedding" },
  { src: g4, alt: "Inside the Mohika Art studio", category: "Packaging" },
  { src: g6, alt: "Couple's frame with custom names", category: "Frames" },
  { src: catHamper, alt: "Curated luxury gifting hamper", category: "Packaging" },
  { src: g5, alt: "A customer with her finished keepsake", category: "Wedding" },
  { src: catKeychain, alt: "Custom name keychain in resin", category: "Keychains" },
  { src: g1, alt: "A second pour, tinted in soft champagne", category: "Keychains" },
];

// Floating gold particle decoration for the header
const GoldParticles = () => {
  const particles = [
    { left: "10%", top: "30%", size: 6, delay: 0, duration: 6 },
    { left: "30%", top: "82%", size: 4, delay: 1.2, duration: 7.5 },
    { left: "55%", top: "20%", size: 5, delay: 0.6, duration: 8 },
    { left: "82%", top: "70%", size: 7, delay: 1.8, duration: 6.5 },
    { left: "92%", top: "28%", size: 4, delay: 0.9, duration: 7 },
  ];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            background: "#C9964A",
            opacity: 0.35,
            boxShadow: "0 0 12px rgba(201,150,74,0.55)",
          }}
          animate={{ y: [0, -15, 0], opacity: [0.3, 0.55, 0.3] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
};

const GalleryPage = () => {
  const [active, setActive] = useState<Category>("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const visible = useMemo(
    () => (active === "All" ? IMAGES : IMAGES.filter((i) => i.category === active)),
    [active],
  );

  // ESC key closes lightbox + body scroll lock while open
  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIndex(null);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [lightboxIndex]);

  const activeImage = lightboxIndex !== null ? visible[lightboxIndex] : null;

  return (
    <>
      {/* ─────────────────────────────  HEADER  ───────────────────────────── */}
      <section
        className="relative overflow-hidden pt-[110px] pb-20 md:pb-24"
        style={{
          background:
            "linear-gradient(180deg, #FAF7F4 0%, #FAF7F4 65%, rgba(250,247,244,0) 100%)",
        }}
      >
        <GoldParticles />

        <div className="relative max-w-[1280px] mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: LUXE_EASE }}
            style={{
              fontSize: "11px",
              color: "#C9964A",
              letterSpacing: "0.25em",
              fontWeight: 600,
              textTransform: "uppercase",
            }}
            className="mb-6"
          >
            Our Studio
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: LUXE_EASE, delay: 0.1 }}
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              fontSize: "clamp(2.5rem, 5.5vw, 4rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              color: "#3D2B1F",
              maxWidth: 820,
            }}
          >
            Our work speaks
            <br />
            <span
              style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                color: "#C9964A",
                fontWeight: 400,
              }}
            >
              for itself.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: LUXE_EASE, delay: 0.28 }}
            className="mt-7 text-base md:text-lg leading-relaxed"
            style={{ color: "rgba(61,43,31,0.72)", maxWidth: 600 }}
          >
            From delicate name keychains to preserved wedding bouquets, every
            piece tells a story. Step inside our studio.
          </motion.p>

          {/* ─────────  FILTER TABS  ───────── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: LUXE_EASE, delay: 0.4 }}
            className="mt-12 -mx-6 px-6 lg:mx-0 lg:px-0 overflow-x-auto no-scrollbar"
          >
            <div className="flex lg:justify-center gap-2 min-w-max lg:min-w-0">
              {TABS.map((tab) => {
                const isActive = active === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActive(tab)}
                    className="relative transition-all duration-300"
                    style={{
                      padding: "10px 22px",
                      borderRadius: 9999,
                      fontSize: 11,
                      textTransform: "uppercase",
                      letterSpacing: "0.12em",
                      fontWeight: 600,
                      background: isActive ? "#3D2B1F" : "transparent",
                      color: isActive ? "#FAF7F4" : "#3D2B1F",
                      border: `1px solid ${isActive ? "#3D2B1F" : "#e5e0d8"}`,
                      whiteSpace: "nowrap",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = "#FAF7F4";
                        e.currentTarget.style.borderColor = "rgba(201,150,74,0.3)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.borderColor = "#e5e0d8";
                      }
                    }}
                  >
                    <span className="relative z-10">{tab}</span>
                    {isActive && (
                      <motion.span
                        layoutId="gallery-tab-underline"
                        aria-hidden
                        className="absolute left-1/2 -translate-x-1/2"
                        style={{
                          bottom: -6,
                          width: 22,
                          height: 2,
                          borderRadius: 2,
                          background: "#C9964A",
                        }}
                        transition={{ duration: 0.4, ease: LUXE_EASE }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─────────────────────────────  MASONRY GRID  ───────────────────────────── */}
      <section className="max-w-[1280px] mx-auto px-6 lg:px-8 py-20">
        <motion.div
          key={active}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="[column-count:1] sm:[column-count:2] lg:[column-count:3]"
          style={{ columnGap: 20 }}
        >
          {visible.map((img, i) => (
            <button
              key={`${active}-${i}-${img.src}`}
              onClick={() => setLightboxIndex(i)}
              className="gallery-tile group relative block w-full break-inside-avoid mb-4 lg:mb-5 overflow-hidden cursor-pointer"
              style={{
                borderRadius: 14,
                opacity: 0,
                transform: "translateY(20px)",
                animation: `gallery-fade-up 0.7s cubic-bezier(0.22,1,0.36,1) forwards`,
                animationDelay: `${i * 80}ms`,
                boxShadow: "0 12px 36px -18px rgba(61,43,31,0.18)",
              }}
              aria-label={`Open ${img.alt}`}
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className="gallery-tile__img w-full h-auto block"
                style={{
                  transition: "transform 600ms cubic-bezier(0.22,1,0.36,1)",
                }}
              />
              {/* Hover dark gradient overlay */}
              <div
                aria-hidden
                className="absolute inset-0 opacity-0 group-hover:opacity-100"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)",
                  transition: "opacity 500ms cubic-bezier(0.22,1,0.36,1)",
                }}
              />
              {/* "View →" label */}
              <div
                className="absolute left-5 bottom-5 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
                style={{
                  transition:
                    "opacity 500ms cubic-bezier(0.22,1,0.36,1), transform 500ms cubic-bezier(0.22,1,0.36,1)",
                  color: "#ffffff",
                  fontSize: 13,
                  fontWeight: 500,
                  letterSpacing: "0.04em",
                }}
              >
                View &rarr;
              </div>
            </button>
          ))}
        </motion.div>

        {/* Empty state per filter */}
        {visible.length === 0 && (
          <div
            className="mx-auto text-center py-16 px-6"
            style={{
              maxWidth: 480,
              background: "#ffffff",
              border: "1px solid #e5e0d8",
              borderRadius: 24,
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 400,
                fontSize: "1.75rem",
                color: "#3D2B1F",
                marginBottom: 10,
              }}
            >
              Nothing here yet.
            </h2>
            <p className="text-sm" style={{ color: "rgba(61,43,31,0.6)" }}>
              Check back soon, we add fresh studio shots every week.
            </p>
          </div>
        )}
      </section>

      {/* ─────────────────────────────  LIGHTBOX  ───────────────────────────── */}
      <AnimatePresence>
        {activeImage && (
          <motion.div
            key="lightbox-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setLightboxIndex(null)}
            className="fixed inset-0 z-[120] flex items-center justify-center p-6"
            style={{
              background: "rgba(0,0,0,0.85)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Image viewer"
          >
            {/* Close button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex(null);
              }}
              className="absolute z-10 flex items-center justify-center transition-colors"
              style={{
                top: 24,
                right: 24,
                width: 48,
                height: 48,
                borderRadius: 9999,
                background: "rgba(255,255,255,0.1)",
                color: "#ffffff",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.2)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Image, clicking it should NOT close */}
            <motion.img
              key={activeImage.src}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: LUXE_EASE }}
              onClick={(e) => e.stopPropagation()}
              src={activeImage.src}
              alt={activeImage.alt}
              className="object-contain"
              style={{
                maxWidth: "90vw",
                maxHeight: "85vh",
                borderRadius: 16,
                boxShadow: "0 40px 120px -20px rgba(0,0,0,0.6)",
              }}
            />

            {/* Caption */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 px-5 py-2.5 text-center"
              style={{
                background: "rgba(255,255,255,0.08)",
                borderRadius: 9999,
                color: "rgba(255,255,255,0.8)",
                fontSize: 12,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                fontWeight: 500,
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
              }}
            >
              {activeImage.category}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scoped keyframe + hover scale for the masonry tiles */}
      <style>{`
        @keyframes gallery-fade-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .gallery-tile:hover .gallery-tile__img { transform: scale(1.03); }
      `}</style>
    </>
  );
};

export default GalleryPage;
