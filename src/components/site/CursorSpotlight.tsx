import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

const CursorSpotlight = () => {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const springX = useSpring(x, { stiffness: 150, damping: 25 });
  const springY = useSpring(y, { stiffness: 150, damping: 25 });
  const reduceMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const lastTime = useRef(0);

  // Skip on touch / coarse-pointer devices and when reduced motion is requested
  useEffect(() => {
    if (reduceMotion) { setEnabled(false); return; }
    const m = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setEnabled(m.matches);
    update();
    m.addEventListener?.("change", update);
    return () => m.removeEventListener?.("change", update);
  }, [reduceMotion]);

  useEffect(() => {
    if (!enabled) return;
    const handleMove = (e: MouseEvent) => {
      // Throttle to ~60fps so we don't fire 1k+ times/sec
      const now = performance.now();
      if (now - lastTime.current < 16) return;
      lastTime.current = now;
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMove);
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-[60] hidden lg:block"
      aria-hidden="true"
    >
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
          background: "radial-gradient(circle, hsl(38 65% 75% / 0.07) 0%, transparent 70%)",
        }}
      />
    </motion.div>
  );
};

export default CursorSpotlight;
