import { useEffect, useRef, useState } from "react";

function useCountUp(target: number, duration = 1200, trigger = false) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!trigger) return;
    const start = performance.now();
    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out: 1 - (1 - t)^3
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [trigger, target, duration]);

  return value;
}

const StatsStrip = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const customers = useCountUp(2000, 1200, visible);
  const rating = useCountUp(49, 1200, visible); // 49 / 10 = 4.9
  const handmade = useCountUp(100, 1200, visible);

  const stats = [
    { value: `${customers}+`, label: "HAPPY CUSTOMERS" },
    { value: `${(rating / 10).toFixed(1)}★`, label: "AVERAGE RATING" },
    { value: `${handmade}%`, label: "HANDMADE" },
  ];

  return (
    <section
      ref={ref}
      className="w-full flex items-center justify-center"
      style={{ height: "88px", background: "#3D2B1F" }}
    >
      <div className="max-w-[1280px] mx-auto px-8 w-full flex items-center justify-center gap-12 md:gap-20">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col items-center text-center">
            <span
              style={{
                fontSize: "28px",
                fontWeight: 600,
                color: "#C9964A",
                lineHeight: 1,
                fontFamily: "var(--font-display)",
              }}
            >
              {s.value}
            </span>
            <span
              style={{
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                color: "#FAF7F4",
                marginTop: "4px",
              }}
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsStrip;
