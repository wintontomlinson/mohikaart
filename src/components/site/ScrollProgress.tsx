import { motion, useScroll, useSpring } from "framer-motion";

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 50, restDelta: 0.001 });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] z-[51] origin-left"
      style={{
        scaleX,
        background: "linear-gradient(90deg, hsl(38 65% 72%), hsl(36 55% 50%), hsl(350 60% 78%))",
      }}
    />
  );
};

export default ScrollProgress;
