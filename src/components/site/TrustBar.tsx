import { motion, useInView } from "framer-motion";
import { Shield, Truck, Package, Award, Star, Heart } from "lucide-react";
import { useRef } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

const trustItems = [
  { icon: Package, label: "Premium Packaging", desc: "Gift-ready boxes" },
  { icon: Truck, label: "Pan-India Delivery", desc: "Free above ₹999" },
  { icon: Shield, label: "Quality Assured", desc: "Handcrafted perfection" },
  { icon: Award, label: "2000+ Orders", desc: "Trusted by many" },
  { icon: Star, label: "4.9★ Rating", desc: "Top-rated seller" },
  { icon: Heart, label: "Made with Love", desc: "Since 2021" },
];

const TrustBar = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <section className="py-6 md:py-8 relative overflow-hidden">
      {/* Subtle top/bottom borders */}
      <div
        className="absolute top-0 inset-x-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.2), transparent)" }}
      />
      <div
        className="absolute bottom-0 inset-x-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.2), transparent)" }}
      />

      <div ref={ref} className="max-w-[1280px] mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-center gap-4 md:gap-8 lg:gap-10 flex-wrap">
          {trustItems.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
              className="flex items-center gap-2.5 group cursor-default"
            >
              <motion.div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-400"
                style={{
                  background: "rgba(201,168,76,0.08)",
                  border: "1px solid rgba(201,168,76,0.12)",
                }}
                whileHover={{
                  scale: 1.12,
                  background: "rgba(201,168,76,0.15)",
                  borderColor: "rgba(201,168,76,0.3)",
                }}
              >
                <item.icon
                  className="w-4 h-4 transition-colors duration-300"
                  style={{ color: "#c9a84c" }}
                  strokeWidth={1.6}
                />
              </motion.div>
              <div className="hidden sm:block">
                <div
                  className="text-[11px] font-semibold leading-tight"
                  style={{ color: "#3D2B1F" }}
                >
                  {item.label}
                </div>
                <div
                  className="text-[10px] leading-tight mt-0.5"
                  style={{ color: "rgba(61,43,31,0.5)" }}
                >
                  {item.desc}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
