import { motion, useScroll, useSpring } from "framer-motion";

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 220, damping: 50, restDelta: 0.001 });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 origin-left z-[60]"
      style={{
        height: "2.5px",
        scaleX,
        background: "linear-gradient(90deg, hsl(34 58% 52%), hsl(38 72% 64%) 46%, hsl(348 55% 72%))",
        boxShadow: "0 0 10px hsl(34 58% 52%/0.45)",
      }}
    />
  );
};

export default ScrollProgress;
