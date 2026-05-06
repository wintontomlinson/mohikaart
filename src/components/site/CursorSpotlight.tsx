import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const CursorSpotlight = () => {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const springX = useSpring(x, { stiffness: 150, damping: 25 });
  const springY = useSpring(y, { stiffness: 150, damping: 25 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [x, y]);

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
