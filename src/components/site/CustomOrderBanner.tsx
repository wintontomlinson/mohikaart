import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const CustomOrderBanner = () => {
  return (
    <section className="py-4 md:py-6">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95, rotateX: 8 }}
          whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-3xl px-8 py-14 md:py-16 text-center hover-glow-gold"
          style={{
            background: "linear-gradient(135deg, #3D2B1F 0%, #5a3d2e 50%, #3D2B1F 100%)",
            perspective: "1000px",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Shimmer animated bg */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(120deg, transparent 30%, rgba(201,150,74,0.12) 50%, transparent 70%)",
              backgroundSize: "200% 100%",
            }}
            animate={{ backgroundPosition: ["200% 0%", "-200% 0%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />

          {/* Decorative sparkles */}
          <motion.div
            className="absolute top-6 left-8 opacity-20"
            animate={{ rotate: 360, scale: [1, 1.2, 1] }}
            transition={{ duration: 8, repeat: Infinity }}
          >
            <Sparkles className="w-8 h-8 text-amber-300" />
          </motion.div>
          <motion.div
            className="absolute bottom-6 right-8 opacity-20"
            animate={{ rotate: -360, scale: [1, 1.3, 1] }}
            transition={{ duration: 10, repeat: Infinity }}
          >
            <Sparkles className="w-6 h-6 text-amber-300" />
          </motion.div>

          {/* Content */}
          <div className="relative z-10">
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="font-display mb-3"
              style={{
                fontWeight: 400,
                fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
                lineHeight: 1.2,
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
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mb-7 mx-auto max-w-md"
              style={{ fontSize: "15px", lineHeight: 1.6, color: "rgba(250,247,244,0.7)" }}
            >
              Share your idea & we'll craft it just for you
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <Link
                to="/custom-order"
                className="group relative inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-[11px] tracking-[0.12em] uppercase font-semibold overflow-hidden transition-all duration-300 hover:scale-105"
                style={{
                  background: "#C9964A",
                  color: "#3D2B1F",
                  boxShadow: "0 4px 20px -4px rgba(201,150,74,0.5)",
                }}
              >
                {/* Shine sweep on hover */}
                <span
                  className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                  style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)" }}
                />
                <span className="relative z-10 flex items-center gap-2">
                  Request Custom Order
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CustomOrderBanner;
