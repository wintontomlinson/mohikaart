import { motion, useInView } from "framer-motion";
import { MessageSquare, Palette, Droplets, Gift } from "lucide-react";
import { useRef } from "react";

const steps = [
  { n: "01", title: "Share Your Idea", desc: "Tell us about the moment, name or memory you want to preserve.", icon: MessageSquare },
  { n: "02", title: "Approve Design", desc: "We sketch, mock-up and confirm every detail before pouring.", icon: Palette },
  { n: "03", title: "Handmade Creation", desc: "Crafted patiently: flowers placed, resin poured, polished by hand.", icon: Droplets },
  { n: "04", title: "Delivered with Love", desc: "Wrapped in luxury packaging and shipped safely to your door.", icon: Gift },
];

const HowItWorks = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="how" className="relative py-28 md:py-40 bg-foreground text-background overflow-hidden noise-overlay">
      <motion.div
        className="absolute -top-32 left-1/4 w-[40rem] h-[40rem] rounded-full bg-gold/10 blur-3xl blob-morph"
        animate={{ scale: [1, 1.2, 1], x: [0, 30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-[30rem] h-[30rem] rounded-full bg-blush/10 blur-3xl blob-morph"
        animate={{ scale: [1, 1.15, 1], y: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="container relative z-10">
        <div className="max-w-2xl mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            style={{ fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase", color: "hsl(38 62% 70%)", marginBottom: "1.25rem", fontWeight: 500 }}
          >
            The Process
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display leading-[1.04] tracking-[-0.03em]"
            style={{ fontWeight: 300, fontSize: "clamp(2rem, 4vw, 3.6rem)" }}
          >
            How ordering <em className="not-italic shimmer-text" style={{ fontStyle: "italic", fontFamily: "var(--font-serif)" }}>works</em>.
          </motion.h2>
        </div>

        <div ref={ref} className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.7, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="relative group"
            >
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-14 left-[60%] right-0 h-px">
                  <motion.div
                    className="h-full bg-gradient-to-r from-gold/50 to-transparent"
                    initial={{ scaleX: 0 }}
                    animate={isInView ? { scaleX: 1 } : {}}
                    transition={{ duration: 1, delay: i * 0.2 + 0.5 }}
                    style={{ transformOrigin: "left" }}
                  />
                </div>
              )}

              {/* 3D Card */}
              <motion.div
                whileHover={{ rotateX: -5, rotateY: 5, translateZ: 20, scale: 1.03 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="p-8 rounded-3xl border border-background/10 bg-background/5 backdrop-blur-sm group-hover:bg-background/10 transition-colors duration-500"
                style={{ transformStyle: "preserve-3d", perspective: "800px" }}
              >
                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold/20 to-blush/10 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:shadow-glow transition-all duration-500">
                  <s.icon className="w-6 h-6 text-gold" strokeWidth={1.4} />
                </div>

                <motion.div
                  className="font-display text-6xl text-gold-grad mb-4 leading-none"
                  whileHover={{ scale: 1.1, rotateZ: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {s.n}
                </motion.div>
                <h3 className="font-serif mb-3 group-hover:text-gold transition-colors duration-300" style={{ fontSize: "clamp(1.1rem, 1.8vw, 1.35rem)", fontWeight: 400, letterSpacing: "-0.01em" }}>{s.title}</h3>
                <p className="leading-[1.72]" style={{ fontSize: "0.9rem", color: "hsl(36 38% 97% / 0.55)", fontWeight: 380 }}>{s.desc}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
