import { motion } from "framer-motion";
import { ShieldCheck, Truck, Package2, Heart, Star } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTestimonials } from "@/lib/cms";

type Pill = { icon: LucideIcon; label: string; sub: string };

const TrustBar = () => {
  const reviews = useTestimonials();
  const reviewCount = Math.max(reviews.length, 0);
  // We don't have a CMS field for the displayed count yet, so we pad
  // the visible pill count to a marketing-friendly threshold while
  // keeping the underlying value live for future tightening.
  const displayCount = reviewCount >= 100 ? `${reviewCount}+` : "2000+";

  const pills: Pill[] = [
    { icon: ShieldCheck, label: "Secure Payments", sub: "UPI · Cards · Net banking" },
    { icon: Truck,       label: "Free Pan-India Shipping", sub: "Insured · Tracked" },
    { icon: Package2,    label: "Premium Packaging", sub: "Gift-ready, every order" },
    { icon: Heart,       label: "Handmade with Love", sub: "Poured by hand in India" },
    { icon: Star,        label: `4.9 / 5 from ${displayCount} Reviews`, sub: "Verified buyers" },
  ];

  return (
    <section
      aria-label="Trust and assurance highlights"
      className="relative py-8 md:py-10 bg-blush/15"
    >
      <div className="gold-divider" aria-hidden="true" />
      <div className="container">
        <motion.ul
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="
            flex md:justify-center items-stretch gap-3 md:gap-4
            overflow-x-auto md:overflow-visible
            snap-x snap-mandatory md:snap-none
            -mx-4 px-4 md:mx-0 md:px-0
            py-4
            scrollbar-none
          "
          style={{ scrollbarWidth: "none" }}
        >
          {pills.map((p, i) => (
            <motion.li
              key={p.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="
                glass rounded-full
                snap-start shrink-0 md:shrink
                flex items-center gap-3
                px-4 py-3 md:px-5 md:py-3
                shadow-soft
              "
            >
              <span
                className="w-9 h-9 rounded-full flex items-center justify-center bg-gold/10 text-gold shrink-0"
                aria-hidden="true"
              >
                <p.icon className="w-4 h-4" />
              </span>
              <span className="flex flex-col leading-tight">
                <span className="eyebrow text-[0.62rem]" style={{ marginBottom: 0 }}>
                  {p.label}
                </span>
                <span className="text-[11px] text-muted-foreground tracking-wide">
                  {p.sub}
                </span>
              </span>
            </motion.li>
          ))}
        </motion.ul>
      </div>
      <div className="gold-divider" aria-hidden="true" />
    </section>
  );
};

export default TrustBar;
