import { useEffect, useRef, useState } from "react";

interface StatItem {
  target: number;
  suffix: string;
  label: string;
}

const stats: StatItem[] = [
  { target: 2000, suffix: "+", label: "HAPPY CUSTOMERS" },
  { target: 4.9, suffix: "★", label: "AVERAGE RATING" },
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
    <section
      ref={ref}
      className="w-full flex items-center justify-center"
      style={{ height: "88px", background: "#3D2B1F" }}
    >
      <div className="max-w-[1280px] w-full mx-auto px-8 flex items-center justify-center gap-12 md:gap-20">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center text-center">
            <span
              className="font-display"
              style={{ fontSize: "28px", color: "#C9964A", lineHeight: 1.2 }}
            >
              <AnimatedNumber target={stat.target} suffix={stat.suffix} animate={inView} />
            </span>
            <span
              style={{
                fontSize: "11px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#ffffff",
                marginTop: "4px",
              }}
            >
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsStrip;
