import { motion, useInView } from "framer-motion";
import { Instagram, Heart, MessageCircle } from "lucide-react";
import { useRef } from "react";
import g1 from "@/assets/gallery-pouring.jpg";
import g2 from "@/assets/gallery-packing.jpg";
import g3 from "@/assets/gallery-flatlay.jpg";
import g4 from "@/assets/gallery-workspace.jpg";
import g5 from "@/assets/gallery-customer.jpg";
import g6 from "@/assets/cat-couple.jpg";

const EASE = [0.22, 1, 0.36, 1] as const;

const images = [
  { src: g1, label: "Pouring", likes: "2.4k", comments: "89" },
  { src: g2, label: "Packaging", likes: "1.8k", comments: "56" },
  { src: g3, label: "Flat Lay", likes: "3.1k", comments: "124" },
  { src: g4, label: "Workspace", likes: "2.7k", comments: "95" },
  { src: g5, label: "Customer Love", likes: "4.2k", comments: "201" },
  { src: g6, label: "Couple Frame", likes: "1.5k", comments: "67" },
];

const InstagramGallery = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(201,168,76,0.04) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 relative z-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
          className="text-center mb-12"
        >
          <p
            className="font-semibold uppercase mb-3"
            style={{ fontSize: "11px", color: "#C9964A", letterSpacing: "0.25em" }}
          >
            Follow Along
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
            As Seen On{" "}
            <em className="font-serif italic" style={{ color: "#C9964A", fontWeight: 400 }}>
              @mohikaart
            </em>
          </h2>
          <p className="mt-3 text-sm" style={{ color: "rgba(61,43,31,0.55)" }}>
            Behind-the-scenes of our creative process
          </p>
        </motion.div>

        {/* Masonry-style grid */}
        <div ref={ref} className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {images.map((img, i) => {
            // Create varied heights for masonry effect
            const isLarge = i === 0 || i === 3;
            return (
              <motion.a
                key={i}
                href="https://instagram.com/mohikaart"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 40, scale: 0.92 }}
                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ duration: 0.7, delay: i * 0.1, ease: EASE }}
                className={`group relative overflow-hidden rounded-2xl ${
                  isLarge ? "row-span-1 md:row-span-2 aspect-[3/4] md:aspect-auto" : "aspect-square"
                }`}
                style={{ minHeight: isLarge ? undefined : undefined }}
              >
                <img
                  src={img.src}
                  alt={`Mohika Art - ${img.label}`}
                  loading="lazy"
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-[0.85]"
                />

                {/* Gradient overlay - always visible but subtle */}
                <div
                  className="absolute inset-0 transition-opacity duration-500"
                  style={{
                    background: "linear-gradient(to top, rgba(26,18,8,0.6) 0%, rgba(26,18,8,0.1) 40%, transparent 100%)",
                    opacity: 0.4,
                  }}
                />

                {/* Hover overlay with engagement stats */}
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500"
                  style={{ background: "rgba(26,18,8,0.65)", backdropFilter: "blur(2px)" }}
                >
                  <motion.div
                    initial={false}
                    className="flex items-center gap-4 text-white"
                  >
                    <span className="flex items-center gap-1.5">
                      <Heart className="w-5 h-5" fill="white" />
                      <span className="text-sm font-medium">{img.likes}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MessageCircle className="w-5 h-5" fill="white" />
                      <span className="text-sm font-medium">{img.comments}</span>
                    </span>
                  </motion.div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-white/70">
                    {img.label}
                  </span>
                </div>

                {/* Bottom label - visible by default */}
                <div className="absolute bottom-0 inset-x-0 p-3 group-hover:opacity-0 transition-opacity duration-300">
                  <div className="flex items-center gap-1.5">
                    <Instagram className="w-3.5 h-3.5 text-white/80" />
                    <span className="text-[10px] font-medium text-white/80 uppercase tracking-wider">
                      {img.label}
                    </span>
                  </div>
                </div>
              </motion.a>
            );
          })}
        </div>

        {/* Follow button */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-10"
        >
          <a
            href="https://instagram.com/mohikaart"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full text-[11px] tracking-[0.1em] uppercase font-semibold overflow-hidden transition-all duration-400 hover:scale-105 hover:shadow-xl"
            style={{
              background: "linear-gradient(135deg, #833AB4, #FD1D1D, #F77737)",
              color: "white",
              boxShadow: "0 8px 28px -8px rgba(131,58,180,0.4)",
            }}
          >
            {/* Shine sweep */}
            <span
              className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
              style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)" }}
            />
            <Instagram className="w-4 h-4 relative z-10" />
            <span className="relative z-10">Follow @mohikaart</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default InstagramGallery;
