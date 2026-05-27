/**
 * Shared animation utilities — performance-first approach.
 * ✓ Only opacity + translateY for entrances (GPU-composited)
 * ✓ No filter: blur() in animated properties
 * ✓ Magnetic hover effect for buttons
 * ✓ Stagger container/item variants for Framer Motion
 * ✓ Mobile-safe: disables 3D tilt on touch devices
 */

import { motion, useMotionValue, useSpring, useTransform, type Variants } from "framer-motion";
import { useCallback, useRef, type ReactNode } from "react";

/* ─────────────────────────────────────────────
   STAGGER VARIANTS
   Usage:
     <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true }}>
       <motion.div variants={staggerItem}>...</motion.div>
     </motion.div>
   ───────────────────────────────────────────── */

export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

export const staggerItemScale: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ─────────────────────────────────────────────
   FADE IN VIEW — simple utility variant
   ───────────────────────────────────────────── */

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ─────────────────────────────────────────────
   MAGNETIC HOVER COMPONENT
   Shifts the element toward the cursor position
   within a small radius. Disabled on touch devices.
   ───────────────────────────────────────────── */

interface MagneticProps {
  children: ReactNode;
  className?: string;
  strength?: number; // px offset max, default 6
  as?: "div" | "span" | "button";
}

export function Magnetic({ children, className = "", strength = 6, as = "div" }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 22 });
  const springY = useSpring(y, { stiffness: 260, damping: 22 });

  const isTouchDevice = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;

  const handleMove = useCallback(
    (e: React.MouseEvent) => {
      if (isTouchDevice) return;
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      const dx = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const dy = (e.clientY - rect.top - rect.height / 2) / rect.height;
      x.set(dx * strength * 2);
      y.set(dy * strength * 2);
    },
    [isTouchDevice, strength, x, y]
  );

  const handleLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  const Tag = motion[as] as any;

  return (
    <Tag
      ref={ref}
      className={className}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
    </Tag>
  );
}

/* ─────────────────────────────────────────────
   ProductTilt3D — 3D tilt on hover for product cards
   Disabled on mobile (pointer: coarse)
   ───────────────────────────────────────────── */

interface ProductTilt3DProps {
  children: ReactNode;
  className?: string;
}

export function ProductTilt3D({ children, className = "" }: ProductTilt3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [4, -4]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { stiffness: 300, damping: 30 });

  const isTouchDevice = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;

  const handleMove = useCallback(
    (e: React.MouseEvent) => {
      if (isTouchDevice) return;
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      x.set((e.clientX - rect.left) / rect.width - 0.5);
      y.set((e.clientY - rect.top) / rect.height - 0.5);
    },
    [isTouchDevice, x, y]
  );

  const handleLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: "800px" }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   SECTION ENTRANCE — simple whileInView wrapper
   Usage:
     <SectionEntrance>
       <div>...</div>
     </SectionEntrance>
   ───────────────────────────────────────────── */

interface SectionEntranceProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function SectionEntrance({ children, className = "", delay = 0 }: SectionEntranceProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
