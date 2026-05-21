import { motion, useInView } from "framer-motion";
import { Instagram } from "lucide-react";
import { useRef } from "react";
import g1 from "@/assets/gallery-pouring.jpg";
import g2 from "@/assets/gallery-packing.jpg";
import g3 from "@/assets/gallery-flatlay.jpg";
import g4 from "@/assets/gallery-workspace.jpg";
import g5 from "@/assets/gallery-customer.jpg";
import g6 from "@/assets/cat-couple.jpg";

const images = [g1, g2, g3, g4, g5, g6];
const labels = ["Pouring", "Packaging", "Flat Lay", "Workspace", "Customer Love", "Couple Frame"];

const InstagramGallery = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className="py-16 md:py-20">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-10"
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
        </motion.div>

        {/* 3x2 grid */}
        <div ref={ref} className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {images.map((src, i) => (
            <motion.a
              key={i}
              href="https://instagram.com/mohikaart"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="group relative overflow-hidden rounded-2xl aspect-square"
            >
              <img
                src={src}
                alt={`Mohika Art - ${labels[i]}`}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Hover overlay */}
              <div
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-400"
                style={{ background: "rgba(61,43,31,0.55)" }}
              >
                <div className="flex flex-col items-center gap-2 text-white">
                  <Instagram className="w-7 h-7" />
                  <span className="text-[11px] font-semibold uppercase tracking-wider">
                    {labels[i]}
                  </span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Follow button */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-8"
        >
          <a
            href="https://instagram.com/mohikaart"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full text-[11px] tracking-[0.1em] uppercase font-semibold transition-all duration-300 hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #833AB4, #FD1D1D, #F77737)",
              color: "white",
              boxShadow: "0 4px 16px -4px rgba(131,58,180,0.4)",
            }}
          >
            <Instagram className="w-4 h-4" />
            Follow us on Instagram
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default InstagramGallery;
