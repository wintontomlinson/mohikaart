import { motion, useInView } from "framer-motion";
import { ShoppingBag, Pencil, Package } from "lucide-react";
import { useRef } from "react";

const steps = [
  {
    icon: ShoppingBag,
    title: "Choose",
    desc: "Pick your product from our curated collection",
    emoji: "🛍️",
  },
  {
    icon: Pencil,
    title: "Customize",
    desc: "Share your details, photos & personalization",
    emoji: "✏️",
  },
  {
    icon: Package,
    title: "Delivered",
    desc: "Handcrafted & delivered safely to your door",
    emoji: "📦",
  },
];

const HowItWorksSimple = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-16 md:py-20" style={{ background: "#FAF7F4" }}>
      <div className="max-w-[1000px] mx-auto px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12"
        >
          <p
            className="font-semibold uppercase mb-3"
            style={{ fontSize: "11px", color: "#C9964A", letterSpacing: "0.25em" }}
          >
            How It Works
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
            Three simple{" "}
            <em className="font-serif italic" style={{ color: "#C9964A", fontWeight: 400 }}>
              steps.
            </em>
          </h2>
        </motion.div>

        {/* Steps */}
        <div ref={ref} className="relative flex flex-col md:flex-row items-center md:items-start justify-center gap-8 md:gap-4">
          {/* Connecting line (desktop) */}
          <div className="hidden md:block absolute top-[60px] left-[20%] right-[20%] h-[2px]">
            <motion.div
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, #C9964A, #e8c89a, #C9964A)" }}
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>

          {/* Connecting line (mobile) */}
          <div className="md:hidden absolute top-[60px] bottom-[60px] left-1/2 -translate-x-1/2 w-[2px]">
            <motion.div
              className="w-full h-full rounded-full"
              style={{ background: "linear-gradient(180deg, #C9964A, #e8c89a, #C9964A)" }}
              initial={{ scaleY: 0 }}
              animate={isInView ? { scaleY: 1 } : {}}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>

          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 flex flex-col items-center text-center flex-1 max-w-[260px]"
            >
              {/* Icon circle */}
              <motion.div
                className="w-[80px] h-[80px] rounded-full flex items-center justify-center mb-5"
                style={{
                  background: "white",
                  border: "2px solid #C9964A",
                  boxShadow: "0 8px 24px -4px rgba(201,150,74,0.2)",
                }}
                animate={isInView ? { scale: [0.8, 1.05, 1] } : {}}
                transition={{ duration: 0.6, delay: i * 0.2 + 0.3 }}
              >
                <motion.span
                  className="text-3xl"
                  animate={isInView ? { y: [0, -4, 0] } : {}}
                  transition={{ duration: 1.5, delay: i * 0.2 + 0.8, repeat: Infinity, repeatDelay: 3 }}
                >
                  {step.emoji}
                </motion.span>
              </motion.div>

              {/* Step number */}
              <span
                className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2"
                style={{ color: "#C9964A" }}
              >
                Step {i + 1}
              </span>

              {/* Title */}
              <h3
                className="font-display mb-2"
                style={{ fontSize: "1.2rem", fontWeight: 500, color: "#3D2B1F" }}
              >
                {step.title}
              </h3>

              {/* Description */}
              <p
                style={{ fontSize: "14px", lineHeight: 1.6, color: "rgba(61,43,31,0.65)" }}
              >
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSimple;
