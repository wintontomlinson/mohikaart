import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

const CursorSpotlight = () => {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const springX = useSpring(x, { stiffness: 120, damping: 30 });
  const springY = useSpring(y, { stiffness: 120, damping: 30 });
  const reduceMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
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
      // Throttle to ~60fps
      const now = performance.now();
      if (now - lastTime.current < 16) return;
      lastTime.current = now;
      x.set(e.clientX);
      y.set(e.clientY);
    };

    // Detect interactive elements for cursor expansion
    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest("a, button, [role='button'], input, select, textarea, .cursor-expand");
      setIsHovering(!!interactive);
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    window.addEventListener("mouseover", handleOver, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseover", handleOver);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-[60] hidden lg:block"
      aria-hidden="true"
    >
      {/* Main spotlight glow */}
      <motion.div
        className="absolute rounded-full"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
          width: isHovering ? "600px" : "450px",
          height: isHovering ? "600px" : "450px",
          background: isHovering
            ? "radial-gradient(circle, hsl(34 58% 70% / 0.1) 0%, hsl(38 65% 75% / 0.04) 40%, transparent 70%)"
            : "radial-gradient(circle, hsl(38 65% 75% / 0.06) 0%, transparent 65%)",
          transition: "width 0.5s cubic-bezier(0.22,1,0.36,1), height 0.5s cubic-bezier(0.22,1,0.36,1), background 0.5s ease",
        }}
      />

      {/* Inner bright core — subtle */}
      <motion.div
        className="absolute rounded-full"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
          width: isHovering ? "80px" : "40px",
          height: isHovering ? "80px" : "40px",
          background: "radial-gradient(circle, hsl(34 58% 75% / 0.08) 0%, transparent 70%)",
          transition: "width 0.4s ease, height 0.4s ease",
        }}
      />
    </motion.div>
  );
};

export default CursorSpotlight;
