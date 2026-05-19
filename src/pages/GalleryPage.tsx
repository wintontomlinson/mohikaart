import { useState, useEffect, useCallback } from "react";
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
      <section className="py-20" style={{ background: "#FAF7F4" }}>
        <div className="max-w-[1280px] mx-auto px-8">
          <h1
            className="font-display font-light"
            style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}
          >
            Our work speaks{" "}
            <em className="not-italic italic" style={{ color: "#C9964A", fontFamily: "var(--font-serif)" }}>
              for itself
            </em>
            .
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-gray-500 max-w-lg">
            From delicate name keychains to preserved wedding bouquets — a curated look at the pieces that have left our studio and found their forever homes.
          </p>

          {/* Filter tabs */}
          <div className="flex flex-wrap gap-2 mt-8">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-5 py-2 rounded-full text-xs tracking-wide font-medium transition-all duration-200"
                style={
                  activeTab === tab
                    ? { background: "#3D2B1F", color: "#fff" }
                    : { border: "1px solid #e5e0d8", background: "transparent" }
                }
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Masonry Grid */}
      <section className="py-20">
        <div className="max-w-[1280px] mx-auto px-8">
          <div
            style={{ columnGap: "16px" }}
            className="[column-count:1] sm:[column-count:2] lg:[column-count:3]"
          >
            {filtered.map((img, i) => (
              <div
                key={`${activeTab}-${img.src}-${i}`}
                className="break-inside-avoid mb-4 rounded-[10px] overflow-hidden cursor-pointer relative group"
                style={{
                  animation: `countup-fade 0.5s ease both`,
                  animationDelay: `${i * 80}ms`,
                }}
                onClick={() => setLightbox(img.src)}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  className="w-full h-auto block transition-transform duration-300 group-hover:scale-105"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <span className="text-white text-sm font-medium tracking-wide">
                    Shop this →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(12px)" }}
          onClick={closeLightbox}
        >
          <button
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            onClick={closeLightbox}
            aria-label="Close lightbox"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          <img
            src={lightbox}
            alt="Gallery full view"
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
};

export default GalleryPage;
