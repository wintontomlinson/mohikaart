import { motion } from "framer-motion";
import { Package2, Sparkles, Gift, Heart, LucideIcon } from "lucide-react";

type Step = {
  icon: LucideIcon;
  label: string;
  caption: string;
};

const STEPS: Step[] = [
  { icon: Package2, label: "Tissue-wrapped",   caption: "Soft blush tissue, hand-folded around every keepsake." },
  { icon: Sparkles, label: "Velvet pouch",      caption: "Tucked inside a champagne velvet pouch for safekeeping." },
  { icon: Gift,     label: "Gold foil seal",    caption: "Sealed with our embossed gold foil for that wax-seal touch." },
  { icon: Heart,    label: "Hand-tied ribbon",  caption: "Finished with a hand-tied silk ribbon and a love note." },
];

const PackagingShowcase = () => (
  <section className="py-16 md:py-24">
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="text-center mb-10 md:mb-14"
      >
        <p className="text-[10px] uppercase tracking-[0.3em] text-gold font-semibold">Unboxing ritual</p>
        <h2 className="mt-3 font-display text-3xl md:text-4xl">
          Premium packaging, <em className="not-italic text-gold-grad">every order</em>
        </h2>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="glass rounded-2xl p-5 md:p-6 flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 rounded-full bg-blush/40 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-gold" strokeWidth={1.4} />
              </div>
              <p className="font-display text-lg leading-tight">{step.label}</p>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{step.caption}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

export default PackagingShowcase;
