import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface StatItem {
  target: number;
  suffix: string;
  label: string;
}

const stats: StatItem[] = [
  { target: 2000, suffix: "+", label: "HAPPY CUSTOMERS" },
  { target: 4.9, suffix: "\u2605", label: "AVERAGE RATING" },
  { target: 100, suffix: "%", label: "HANDMADE" },
];

function AnimatedNumber({ target, suffix, animate }: { target: number; suffix: string; animate: boolean }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!animate) return;
    const duration = 1200;
    const startTime = performance.now();
    const isDecimal = target % 1 !== 0;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out: 1 - (1 - t)^3
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * target;
      setValue(isDecimal ? parseFloat(current.toFixed(1)) : Math.floor(current));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [animate, target]);

  const display = target % 1 !== 0 ? value.toFixed(1) : value.toLocaleString();

  return (
    <span>
      {display}{suffix}
    </span>
  );
}

const StatsStrip = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full flex items-center justify-center overflow-hidden"
      style={{ height: "100px", background: "linear-gradient(135deg, #3D2B1F 0%, #2C1F14 100%)" }}
    >
      <div className="max-w-[1280px] w-full mx-auto px-6 lg:px-8 flex items-center justify-center gap-8 md:gap-16 lg:gap-20">
        {stats.map((stat, idx) => (
          <div key={stat.label} className="flex items-center gap-8 md:gap-16 lg:gap-20">
            <div className="flex flex-col items-center text-center">
              <span
                className="font-display"
                style={{ fontSize: "32px", color: "#C9964A", lineHeight: 1.2 }}
              >
                <AnimatedNumber target={stat.target} suffix={stat.suffix} animate={inView} />
              </span>
              <span
                style={{
                  fontSize: "10px",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.6)",
                  marginTop: "6px",
                }}
              >
                {stat.label}
              </span>
            </div>
            {/* Gold divider between items */}
            {idx < stats.length - 1 && (
              <div className="hidden md:block w-[1px] h-10 bg-[#C9964A]/20" />
            )}
          </div>
        ))}
      </div>
    </motion.section>
  );
};

export default StatsStrip;
