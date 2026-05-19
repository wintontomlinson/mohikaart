import { Hand, Sparkles, Gem, Package, Gift, Truck } from "lucide-react";
import { motion } from "framer-motion";

const items = [
  { icon: Hand,     title: "Artisan Craftsmanship",  desc: "Each piece is meticulously poured, cured, and polished by hand over multiple days." },
  { icon: Sparkles, title: "Bespoke Designs",        desc: "Your vision brought to life \u2014 every detail customised to your exact specifications." },
  { icon: Gem,      title: "Museum-Grade Resin",     desc: "We use only crystal-clear, UV-resistant, non-yellowing epoxy that preserves forever." },
  { icon: Package,  title: "Luxury Packaging",       desc: "Presented in velvet-lined boxes with ribbon, tissue, and a handwritten note." },
  { icon: Gift,     title: "Gift-Ready Always",      desc: "Every order arrives beautifully wrapped \u2014 perfect for gifting without any extra effort." },
  { icon: Truck,    title: "Nationwide Delivery",    desc: "Insured shipping across India with real-time tracking. Always free, always careful." },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

const WhyUs = () => {
  return (
    <section className="py-20">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
        <motion.div
          className="mb-14"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p
            style={{ fontSize: "11px", letterSpacing: "0.3em", textTransform: "uppercase", color: "#C9964A", fontWeight: 600, marginBottom: "12px" }}
          >
            The Mohika Difference
          </p>
          <h2
            className="font-display relative inline-block"
            style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 400, lineHeight: 1.1, color: "#3D2B1F" }}
          >
            Crafted with intention.{" "}
            <em style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", color: "#C9964A" }}>
              Delivered with care.
            </em>
            <span className="absolute -bottom-3 left-0 w-16 h-[2px] bg-[#C9964A]/40" />
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((it, i) => (
            <motion.div
              key={it.title}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="luxury-card p-8 rounded-[20px] bg-white cursor-default"
              style={{
                minHeight: "200px",
                border: "1px solid #e5e0d8",
              }}
            >
              <div
                className="flex items-center justify-center rounded-[14px]"
                style={{
                  width: "56px",
                  height: "56px",
                  background: "linear-gradient(135deg, #FAF7F4, #f0ebe4)",
                }}
              >
                <it.icon className="w-5 h-5" style={{ color: "#C9964A" }} strokeWidth={1.5} />
              </div>
              <h3
                className="mt-5 font-display"
                style={{ fontSize: "17px", fontWeight: 500, color: "#3D2B1F" }}
              >
                {it.title}
              </h3>
              <p
                className="mt-3"
                style={{ fontSize: "14px", color: "rgb(107 114 128)", lineHeight: 1.7 }}
              >
                {it.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
