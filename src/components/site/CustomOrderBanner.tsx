import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const EASE = [0.22, 1, 0.36, 1] as const;

/* Floating particle component */
const Particle = ({ i }: { i: number }) => {
  const size = 2 + (i % 4) * 1.5;
  const left = 5 + (i * 13.7) % 90;
  const top = 10 + (i * 17.3) % 80;
  const duration = 4 + (i % 5) * 1.2;
  const delay = i * 0.4;

  return (
    <motion.span
      className="absolute rounded-full"
      style={{
        width: size,
        height: size,
        left: `${left}%`,
        top: `${top}%`,
        background: i % 2 === 0
          ? "rgba(201,168,76,0.5)"
          : "rgba(255,255,255,0.3)",
      }}
      animate={{
        y: [0, -(20 + i * 5), 0],
        opacity: [0.2, 0.8, 0.2],
        scale: [1, 1.5, 1],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
};

const CustomOrderBanner = () => {
  const reduceMotion = useReducedMotion();

  return (
    <section className="py-6 md:py-10">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
          className="relative overflow-hidden rounded-[2rem] px-8 py-16 md:py-20 text-center"
          style={{
            background: "linear-gradient(160deg, #1a1208 0%, #2d1f12 30%, #3D2B1F 60%, #2a1c10 100%)",
          }}
        >
          {/* Animated gradient mesh */}
          <motion.div
            className="absolute inset-0 pointer-events-none opacity-60"
            style={{
              background: "radial-gradient(ellipse 60% 50% at 20% 20%, rgba(201,168,76,0.12), transparent 60%), radial-gradient(ellipse 50% 40% at 80% 80%, rgba(201,168,76,0.08), transparent 50%)",
            }}
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Shimmer sweep */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(120deg, transparent 30%, rgba(201,150,74,0.08) 50%, transparent 70%)",
              backgroundSize: "200% 100%",
            }}
            animate={{ backgroundPosition: ["200% 0%", "-200% 0%"] }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          />

          {/* Floating particles */}
          {!reduceMotion && [...Array(8)].map((_, i) => (
            <Particle key={i} i={i} />
          ))}

          {/* Decorative sparkles */}
          <motion.div
            className="absolute top-8 left-10 opacity-30"
            animate={{ rotate: 360, scale: [1, 1.3, 1] }}
            transition={{ duration: 8, repeat: Infinity }}
          >
            <Sparkles className="w-6 h-6 text-amber-300" />
          </motion.div>
          <motion.div
            className="absolute bottom-8 right-10 opacity-20"
            animate={{ rotate: -360, scale: [1, 1.4, 1] }}
            transition={{ duration: 12, repeat: Infinity }}
          >
            <Sparkles className="w-8 h-8 text-amber-300" />
          </motion.div>
          <motion.div
            className="absolute top-1/3 right-1/4 opacity-15"
            animate={{ y: [0, -10, 0], rotate: [0, 90, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
          >
            <Sparkles className="w-5 h-5 text-amber-200" />
          </motion.div>

          {/* Border glow effect */}
          <div
            className="absolute inset-0 rounded-[2rem] pointer-events-none"
            style={{ border: "1px solid rgba(201,168,76,0.15)" }}
          />

          {/* Content */}
          <div className="relative z-10 max-w-lg mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6, type: "spring" }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6"
              style={{
                background: "rgba(201,168,76,0.12)",
                border: "1px solid rgba(201,168,76,0.25)",
              }}
            >
              <Sparkles className="w-3 h-3" style={{ color: "#c9a84c" }} />
              <span className="text-[10px] uppercase tracking-[0.2em] font-semibold" style={{ color: "#c9a84c" }}>
                Custom Orders Open
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15, duration: 0.7, ease: EASE }}
              className="font-display mb-4"
              style={{
                fontWeight: 400,
                fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
                color: "#FAF7F4",
              }}
            >
              Want Something Truly{" "}
              <em className="font-serif italic" style={{ color: "#C9964A" }}>
                One-of-a-Kind?
              </em>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25, duration: 0.6, ease: EASE }}
              className="mb-8"
              style={{ fontSize: "15px", lineHeight: 1.7, color: "rgba(250,247,244,0.6)" }}
            >
              Share your vision & we'll handcraft it into a timeless resin masterpiece — personalized just for you.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.35, duration: 0.6, ease: EASE }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3"
            >
              <Link
                to="/custom-order"
                className="group relative inline-flex items-center gap-2.5 px-8 py-4 rounded-full text-[11px] tracking-[0.12em] uppercase font-semibold overflow-hidden transition-all duration-400 hover:scale-105"
                style={{
                  background: "#C9964A",
                  color: "#1a1208",
                  boxShadow: "0 8px 32px -8px rgba(201,150,74,0.6), 0 0 0 1px rgba(201,150,74,0.2)",
                }}
              >
                {/* Shine sweep on hover */}
                <span
                  className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                  style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)" }}
                />
                <span className="relative z-10 flex items-center gap-2">
                  Request Custom Order
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>

              <Link
                to="/gallery"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-[11px] tracking-[0.1em] uppercase font-semibold transition-all duration-300 hover:scale-105"
                style={{
                  border: "1px solid rgba(250,247,244,0.2)",
                  color: "rgba(250,247,244,0.7)",
                }}
              >
                View Past Work
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CustomOrderBanner;
