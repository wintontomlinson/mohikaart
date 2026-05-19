import { useState, useEffect, useCallback } from "react";
import { X, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

type GalleryItem = {
  src: string;
  alt: string;
  category: string;
};

const images: GalleryItem[] = [
  { src: catKeychain, alt: "Resin name keychain", category: "Keychains" },
  { src: g1, alt: "Resin pouring process", category: "All" },
  { src: catFrame, alt: "Resin photo frame", category: "Frames" },
  { src: g3, alt: "Product flatlay", category: "All" },
  { src: catWedding, alt: "Wedding keepsake", category: "Wedding" },
  { src: g2, alt: "Packaging resin art", category: "Packaging" },
  { src: g4, alt: "Workspace studio shot", category: "All" },
  { src: catHamper, alt: "Gift hamper packaging", category: "Packaging" },
  { src: g5, alt: "Happy customer with order", category: "All" },
  { src: g6, alt: "Couple resin keepsake", category: "Wedding" },
];

const tabs = ["All", "Keychains", "Frames", "Wedding", "Packaging"];

const GalleryPage = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [lightbox, setLightbox] = useState<string | null>(null);

  const filtered = activeTab === "All" ? images : images.filter((img) => img.category === activeTab);

  const closeLightbox = useCallback(() => setLightbox(null), []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
    };
    if (lightbox) {
      document.addEventListener("keydown", handleKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, closeLightbox]);

  return (
    <>
      {/* Header Section */}
      <section className="py-24" style={{ background: "#FAF7F4" }}>
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1
              className="font-light leading-[1.08]"
              style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontFamily: "var(--font-display)", color: "#3D2B1F" }}
            >
              Our work speaks{" "}
              <em className="not-italic italic" style={{ color: "#C9964A", fontFamily: "var(--font-serif)" }}>
                for itself
              </em>
              .
            </h1>
            <p className="mt-5 text-[15px] leading-[1.7] text-gray-500 max-w-lg">
              From delicate name keychains to preserved wedding bouquets — a curated look at the pieces that have left our studio and found their forever homes.
            </p>
          </motion.div>

          {/* Filter tabs */}
          <motion.div
            className="flex flex-wrap gap-2 mt-10"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-5 py-2.5 rounded-full text-[11px] tracking-[0.06em] uppercase font-semibold transition-all duration-300"
                style={
                  activeTab === tab
                    ? { background: "#3D2B1F", color: "#fff", boxShadow: "0 4px 12px -4px rgba(61,43,31,0.3)" }
                    : { border: "1px solid #e5e0d8", background: "transparent", color: "#3D2B1F" }
                }
                onMouseEnter={(e) => {
                  if (activeTab !== tab) {
                    e.currentTarget.style.background = "#FAF7F4";
                    e.currentTarget.style.borderColor = "rgba(201,150,74,0.3)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== tab) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.borderColor = "#e5e0d8";
                  }
                }}
              >
                {tab}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Masonry Grid */}
      <section className="py-20">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <div
            style={{ columnGap: "20px" }}
            className="[column-count:1] sm:[column-count:2] lg:[column-count:3]"
          >
            {filtered.map((img, i) => (
              <div
                key={`${activeTab}-${img.src}-${i}`}
                className="break-inside-avoid mb-5 rounded-[16px] overflow-hidden cursor-pointer relative group"
                style={{
                  animation: `countup-fade 0.6s ease both`,
                  animationDelay: `${i * 100}ms`,
                }}
                onClick={() => setLightbox(img.src)}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  className="w-full h-auto block transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex flex-col items-center justify-center gap-2">
                  <ArrowUpRight className="w-6 h-6 text-white" />
                  <span className="text-white text-[12px] font-medium tracking-[0.1em] uppercase">
                    View Full Size
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.80)", backdropFilter: "blur(16px)" }}
            onClick={closeLightbox}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <button
              className="absolute top-8 right-8 w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-200"
              style={{ background: "rgba(255,255,255,0.1)" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.2)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
              onClick={closeLightbox}
              aria-label="Close lightbox"
            >
              <X className="w-5 h-5 text-white" />
            </button>
            <motion.img
              src={lightbox}
              alt="Gallery full view"
              className="max-w-[85vw] max-h-[80vh] object-contain rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GalleryPage;
