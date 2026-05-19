import { useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
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

type GalleryImage = {
  src: string;
  alt: string;
  category: string;
};

const images: GalleryImage[] = [
  { src: catKeychain, alt: "Name keychain resin art", category: "Keychains" },
  { src: catFrame, alt: "Photo frame resin art", category: "Frames" },
  { src: catWedding, alt: "Wedding keepsake resin", category: "Wedding" },
  { src: g2, alt: "Luxury packaging", category: "Packaging" },
  { src: g1, alt: "Resin pouring process", category: "Keychains" },
  { src: g3, alt: "Flatlay arrangement", category: "Frames" },
  { src: g4, alt: "Studio workspace", category: "Wedding" },
  { src: g5, alt: "Happy customer", category: "Packaging" },
  { src: g6, alt: "Couple frame resin", category: "Frames" },
  { src: catHamper, alt: "Gift hamper set", category: "Packaging" },
];

const tabs = ["All", "Keychains", "Frames", "Wedding", "Packaging"];

const GalleryPage = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const ref = useScrollReveal<HTMLDivElement>();

  const filtered = activeTab === "All" ? images : images.filter((img) => img.category === activeTab);

  const closeLightbox = useCallback(() => setLightbox(null), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeLightbox]);

  return (
    <>
      {/* Header */}
      <section className="py-20" style={{ background: "#FAF7F4" }}>
        <div className="max-w-[1280px] mx-auto px-8">
          <h1
            className="font-display"
            style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 300, lineHeight: 1.05 }}
          >
            Our work speaks for itself.
          </h1>
          <p className="mt-4" style={{ fontSize: "15px", color: "hsl(25 10% 46%)", lineHeight: 1.7 }}>
            A peek inside our studio: the pours, the petals, the packaging, the people.
          </p>

          {/* Filter tabs */}
          <div className="mt-8 flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-5 py-2.5 rounded-full text-xs tracking-[0.08em] uppercase font-medium transition-all duration-300"
                style={activeTab === tab
                  ? { background: "#3D2B1F", color: "#fff" }
                  : { border: "1px solid #e5e0d8", background: "transparent", color: "#3D2B1F" }
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
            ref={ref}
            className="scroll-reveal"
            style={{ columnCount: 3, columnGap: "16px" }}
          >
            {filtered.map((img, i) => (
              <div
                key={`${activeTab}-${i}`}
                className="group relative cursor-pointer mb-4"
                style={{
                  breakInside: "avoid",
                  borderRadius: "10px",
                  overflow: "hidden",
                  opacity: 0,
                  animation: `countup-fade 0.4s ease-out ${i * 80}ms forwards`,
                }}
                onClick={() => setLightbox(i)}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  className="w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  style={{ borderRadius: "10px" }}
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-[10px]">
                  <span className="text-white text-sm font-medium">Shop this →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ backdropFilter: "blur(12px)", background: "rgba(0,0,0,0.7)" }}
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            aria-label="Close lightbox"
          >
            <X className="w-5 h-5" />
          </button>
          <img
            src={filtered[lightbox].src}
            alt={filtered[lightbox].alt}
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-xl"
            style={{
              animation: "countup-fade 0.3s ease-out forwards",
            }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
};

export default GalleryPage;
