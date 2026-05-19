import { Instagram } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import g1 from "@/assets/gallery-pouring.jpg";
import g2 from "@/assets/gallery-packing.jpg";
import g3 from "@/assets/gallery-flatlay.jpg";

const images = [g1, g2, g3];

const Gallery = () => {
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <section className="py-20" style={{ background: "#FAF7F4" }}>
      <div className="max-w-[1280px] mx-auto px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <h2
              className="font-display"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 300 }}
            >
              From our studio to your{" "}
              <em
                className="not-italic"
                style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", color: "#C9964A" }}
              >
                heart.
              </em>
            </h2>
          </div>
          <a
            href="https://instagram.com/mohikaart"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm hover:underline"
            style={{ color: "#3D2B1F" }}
          >
            <Instagram className="w-4 h-4" />
            @MOHIKAART
          </a>
        </div>

        <div ref={ref} className="scroll-reveal grid grid-cols-1 md:grid-cols-3 gap-3">
          {images.map((src, i) => (
            <a
              key={i}
              href="https://instagram.com/mohikaart"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden"
              style={{ height: "300px", borderRadius: "10px" }}
            >
              <img
                src={src}
                alt={`Mohika Art studio ${i + 1}`}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <span className="text-white text-sm font-medium flex items-center gap-2">
                  <Instagram className="w-4 h-4" />
                  Follow @mohikaart
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
