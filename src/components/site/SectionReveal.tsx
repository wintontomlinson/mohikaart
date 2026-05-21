import { motion, useInView, Variants } from "framer-motion";
import { useRef, ReactNode } from "react";

interface SectionRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  stagger?: number;
  once?: boolean;
}

const directions = {
  up: { y: 60, x: 0 },
  down: { y: -60, x: 0 },
  left: { x: 60, y: 0 },
  right: { x: -60, y: 0 },
};

const containerVariants: Variants = {
  hidden: {},
  visible: (stagger: number) => ({
    transition: {
      staggerChildren: stagger,
      delayChildren: 0.1,
    },
  }),
};

const SectionReveal = ({
  children,
  className = "",
  delay = 0,
  direction = "up",
  stagger = 0.12,
  once = true,
}: SectionRevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "-80px" });

  const { x, y } = directions[direction];

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      custom={stagger}
      variants={containerVariants}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
};

/* Child item that animates within a SectionReveal container */
interface RevealItemProps {
  children: ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
}

const itemVariants: Variants = {
  hidden: (dir: string) => {
    const { x, y } = directions[dir as keyof typeof directions] || directions.up;
    return { opacity: 0, y, x, filter: "blur(8px)" };
  },
  visible: {
    opacity: 1,
    y: 0,
    x: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const RevealItem = ({ children, className = "", direction = "up" }: RevealItemProps) => (
  <motion.div className={className} custom={direction} variants={itemVariants}>
    {children}
  </motion.div>
);

/* Single standalone reveal (no parent container needed) */
interface FadeRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  once?: boolean;
  blur?: boolean;
}

const FadeReveal = ({
  children,
  className = "",
  delay = 0,
  direction = "up",
  once = true,
  blur = true,
}: FadeRevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "-60px" });
  const { x, y } = directions[direction];

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y, x, filter: blur ? "blur(8px)" : "blur(0px)" }}
      animate={
        isInView
          ? { opacity: 1, y: 0, x: 0, filter: "blur(0px)" }
          : { opacity: 0, y, x, filter: blur ? "blur(8px)" : "blur(0px)" }
      }
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};

export { SectionReveal, RevealItem, FadeReveal };
export default SectionReveal;
