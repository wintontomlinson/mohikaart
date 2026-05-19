import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import g1 from "@/assets/gallery-pouring.jpg";
import g2 from "@/assets/gallery-packing.jpg";
import g3 from "@/assets/gallery-flatlay.jpg";

const images = [g1, g2, g3];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

const Gallery = () => (
  <section className="py-20">
    <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
      <motion.div
        className="mb-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <h2
          className="font-display"
          style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 400, lineHeight: 1.1, color: "#3D2B1F" }}
        >
          A glimpse into our{" "}
          <em style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", color: "#C9964A" }}>
            studio
          </em>
          .
        </h2>
        <a
          href="https://instagram.com/mohikaart"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full transition-all duration-300 hover:bg-[#C9964A] hover:text-white"
          style={{ height: "40px", padding: "0 20px", border: "1.5px solid #C9964A", color: "#C9964A", fontSize: "12px", fontWeight: 600, letterSpacing: "0.06em" }}
        >
          @MOHIKAART
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {images.map((src, i) => (
          <motion.a
            key={i}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            href="https://instagram.com/mohikaart"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden rounded-[16px] block transition-all duration-500"
            style={{ height: "340px", border: "1px solid transparent" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,150,74,0.2)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "transparent"; }}
          >
            <img
              src={src}
              alt={`Mohika Art studio ${i + 1}`}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.05]"
            />
            {/* Dark overlay + text on hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 backdrop-blur-0 group-hover:backdrop-blur-[2px] transition-all duration-400 flex items-center justify-center">
              <span className="flex items-center gap-2 text-white text-sm font-medium opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                View on Instagram
                <ArrowUpRight className="w-4 h-4" />
              </span>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  </section>
);

export default Gallery;
