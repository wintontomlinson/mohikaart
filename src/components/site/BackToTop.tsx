import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useState } from "react";

const BackToTop = () => {
  const { scrollYProgress } = useScroll();
  const [show, setShow] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setShow(v > 0.2);
  });

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0 }}
      animate={show ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
      transition={{ duration: 0.3, type: "spring" }}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed left-6 z-40 w-12 h-12 rounded-full glass flex items-center justify-center shadow-soft hover:shadow-luxe hover:scale-110 transition-all duration-300"
      style={{ bottom: "calc(1.5rem + var(--fab-bottom-offset))" }}
      aria-label="Back to top"
    >
      <ArrowUp className="w-5 h-5" />
    </motion.button>
  );
};

export default BackToTop;
