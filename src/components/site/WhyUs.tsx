import { motion, useInView } from "framer-motion";
import { Hand, Sparkles, Gem, Package, Gift, Truck } from "lucide-react";
import { useRef } from "react";

const items = [
  { icon: Hand,      title: "Handmade Precision",  desc: "Every piece poured, set and polished by hand with quiet patience.", color: "from-blush/40 to-champagne/30" },
  { icon: Sparkles,  title: "Fully Customized",    desc: "Names, dates, dried bouquets - designed entirely around your story.", color: "from-gold/20 to-blush/20" },
  { icon: Gem,       title: "Premium Resin",       desc: "Crystal clear, non-yellowing, jeweller-grade epoxy that lasts a lifetime.", color: "from-lavender/30 to-blush/20" },
  { icon: Package,   title: "Secure Packaging",    desc: "Multi-layered luxury packaging - your gift arrives flawless.", color: "from-champagne/30 to-gold/20" },
  { icon: Gift,      title: "Gifting Perfect",     desc: "Includes elegant gift box, ribbon and a handwritten note.", color: "from-blush/30 to-lavender/20" },
  { icon: Truck,     title: "Pan India Delivery",  desc: "Shipped safely across India with real-time tracking. Free on all orders.", color: "from-gold/30 to-champagne/20" },
];

const WhyUs = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative py-28 md:py-40">
      {/* Ambient blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-[35rem] h-[35rem] rounded-full bg-champagne/12 blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] rounded-full bg-blush/12 blur-[100px]" />
      </div>

      <div className="container relative z-10">
        <div className="max-w-2xl mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="eyebrow mb-5"
          >
            Why Mohika Art
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-display leading-[1.04] tracking-[-0.03em]"
            style={{ fontWeight: 300, fontSize: "clamp(2rem, 4vw, 3.6rem)" }}
          >
            Designed with detail.
            <br />
            <em
              className="not-italic text-gold-grad animate-gradient-text"
              style={{ fontStyle: "italic", fontFamily: "var(--font-serif)" }}
            >
              Delivered with devotion.
            </em>
          </motion.h2>
        </div>

        <div ref={ref} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {items.map((it, i) => (
            <motion.div
              key={it.title}
              initial={{ opacity: 0, y: 50, rotateX: 8 }}
              animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="frost-card rounded-3xl p-10 md:p-12 group relative overflow-hidden card-3d"
            >
              {/* Hover color bloom */}
              <div
                className={`absolute -top-10 -right-10 w-48 h-48 rounded-full bg-gradient-to-br ${it.color} blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700`}
              />
              {/* Top gold line */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blush/50 to-champagne/30 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-glow transition-all duration-500">
                  <it.icon className="w-7 h-7 text-foreground" strokeWidth={1.4} />
                </div>
                <h3
                  className="font-display mb-3"
                  style={{ fontSize: "clamp(1.15rem, 1.8vw, 1.4rem)", fontWeight: 400, letterSpacing: "-0.02em" }}
                >
                  {it.title}
                </h3>
                <p
                  className="leading-[1.72]"
                  style={{ fontSize: "0.92rem", color: "hsl(25 10% 46%)", fontWeight: 380 }}
                >
                  {it.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
