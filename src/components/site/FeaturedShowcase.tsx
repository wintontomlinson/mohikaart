import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { LUXURY_EASE, SPRING_SMOOTH, staggerContainer, Magnetic } from "@/lib/animations";

import catKeychain from "@/assets/cat-keychain.jpg";
import catWedding from "@/assets/cat-wedding.jpg";
import catTray from "@/assets/cat-tray.jpg";
import catFrame from "@/assets/cat-frame.jpg";

const EASE = LUXURY_EASE;

const FEATURED = [
  {
    image: catWedding,
    title: "Wedding Keepsakes",
    subtitle: "Preserve your bouquet forever",
    link: "/shop?category=wedding",
    accent: "hsl(348 55% 72%)",
  },
  {
    image: catKeychain,
    title: "Name Keychains",
    subtitle: "Personalized resin art",
    link: "/shop?category=keychain",
    accent: "hsl(34 58% 52%)",
  },
  {
    image: catTray,
    title: "Resin Trays",
    subtitle: "Functional luxury pieces",
    link: "/shop?category=tray",
    accent: "hsl(38 62% 60%)",
  },
  {
    image: catFrame,
    title: "Photo Frames",
    subtitle: "Memories in resin",
    link: "/shop?category=frame",
    accent: "hsl(278 28% 68%)",
  },
];

/**
 * Premium editorial showcase — replaces generic category cards
 * with a cinematic split-layout storytelling section.
 */
const FeaturedShowcase = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);

  return (
    <section
      ref={sectionRef}
      className="relative py-20 md:py-28 overflow-hidden"
      style={{ background: "#fdf9f0" }}
    >
      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <motion.div
          className="absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full blur-[140px]"
          style={{ background: "hsl(34 58% 82%/0.08)", y: bgY }}
        />
        <div
          className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full blur-[100px]"
          style={{ background: "hsl(348 55% 88%/0.06)" }}
        />
      </div>

      <div className="max-w-[1360px] mx-auto px-5 md:px-10 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30, rotateX: 8 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: EASE }}
          className="text-center mb-14 md:mb-18"
          style={{ perspective: "800px" }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5"
            style={{
              background: "rgba(201,168,76,0.08)",
              border: "1px solid rgba(201,168,76,0.15)",
            }}
          >
            <Sparkles className="w-3 h-3" style={{ color: "#c9a84c" }} />
            <span
              className="text-[9px] uppercase tracking-[0.25em] font-semibold"
              style={{ color: "#c9a84c" }}
            >
              Featured Creations
            </span>
          </motion.div>

          <h2
            className="font-display"
            style={{
              fontWeight: 300,
              fontSize: "clamp(2rem, 4vw, 3rem)",
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              color: "#1a1208",
            }}
          >
            Handcrafted with{" "}
            <em
              className="font-serif italic"
              style={{ color: "#c9a84c", fontWeight: 400 }}
            >
              love & intention.
            </em>
          </h2>
          <p
            className="mt-3 mx-auto max-w-md"
            style={{ fontSize: "14px", color: "rgba(26,18,8,0.5)", lineHeight: 1.7 }}
          >
            Each piece tells a story — explore our most coveted collections
          </p>
        </motion.div>

        {/* Editorial grid — asymmetric luxury layout with 3D stagger */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
        >
          {FEATURED.map((item, i) => (
            <motion.div
              key={item.title}
              variants={{
                hidden: { opacity: 0, y: 50, scale: 0.9, rotateX: 10, filter: "blur(6px)" },
                visible: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  rotateX: 0,
                  filter: "blur(0px)",
                  transition: { duration: 0.9, delay: i * 0.12, ease: EASE },
                },
              }}
              whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.4, ease: EASE } }}
              className={`group relative ${i === 0 ? "col-span-2 row-span-2" : ""}`}
              style={{ perspective: "1000px" }}
            >
              <Link
                to={item.link}
                className="block relative overflow-hidden rounded-2xl md:rounded-3xl h-full"
                style={{
                  aspectRatio: i === 0 ? "1 / 1" : "3 / 4",
                  minHeight: i === 0 ? undefined : "280px",
                }}
              >
                {/* Image with zoom */}
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-all duration-[1.2s] ease-out group-hover:scale-[1.06] group-hover:brightness-[1.03]"
                />

                {/* Gradient overlay — cinematic */}
                <div
                  className="absolute inset-0 transition-opacity duration-700"
                  style={{
                    background: `linear-gradient(to top, rgba(26,18,8,0.7) 0%, rgba(26,18,8,0.15) 45%, transparent 75%)`,
                  }}
                />

                {/* Hover intensify */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                  style={{
                    background: "linear-gradient(to top, rgba(26,18,8,0.8) 0%, rgba(26,18,8,0.3) 50%, rgba(26,18,8,0.05) 100%)",
                  }}
                />

                {/* Content */}
                <div className="absolute inset-x-0 bottom-0 p-4 md:p-6 flex flex-col justify-end">
                  <motion.div
                    className="transition-transform duration-500 group-hover:translate-y-[-4px]"
                  >
                    <h3
                      className="font-display"
                      style={{
                        fontWeight: 400,
                        fontSize: i === 0 ? "clamp(1.4rem, 2.5vw, 2rem)" : "clamp(1rem, 1.5vw, 1.25rem)",
                        color: "#FAF7F4",
                        letterSpacing: "-0.02em",
                        lineHeight: 1.15,
                        textShadow: "0 2px 12px rgba(0,0,0,0.3)",
                      }}
                    >
                      {item.title}
                    </h3>
                    <p
                      className="mt-1 font-serif italic"
                      style={{
                        fontSize: i === 0 ? "14px" : "12px",
                        color: "rgba(250,247,244,0.65)",
                      }}
                    >
                      {item.subtitle}
                    </p>
                  </motion.div>

                  {/* CTA — slides up on hover */}
                  <div
                    className="flex items-center gap-1.5 mt-3 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500"
                    style={{
                      fontSize: "9px",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      fontWeight: 600,
                      color: "#c9a84c",
                    }}
                  >
                    Explore
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>

                {/* Gold border glow on hover */}
                <div
                  className="absolute inset-0 rounded-2xl md:rounded-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                  style={{
                    boxShadow: `inset 0 0 0 1.5px rgba(201,168,76,0.2), 0 20px 60px -20px rgba(201,168,76,0.15)`,
                  }}
                />
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* View all link */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4, ease: EASE }}
          className="text-center mt-10"
        >
          <Magnetic strength={0.2}>
            <Link
              to="/shop"
              className="group inline-flex items-center gap-2.5 text-[11px] tracking-[0.12em] uppercase font-semibold transition-all duration-400 hover:gap-3.5"
              style={{ color: "#3D2B1F", paddingBottom: "4px", borderBottom: "1px solid #c9a84c" }}
            >
              View Full Collection
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Magnetic>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedShowcase;
