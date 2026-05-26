/**
 * Premium Animation Utilities for MohikaArt
 * 3D effects, scroll reveals, magnetic hover, glassmorphism interactions
 */
import { motion, useMotionValue, useSpring, useTransform, useScroll, useInView, type Variants } from "framer-motion";
import { useRef, useCallback, type ReactNode, type CSSProperties } from "react";

/* ══════════════════════════════════════════════════════════
   EASING CURVES — Luxury feel
   ══════════════════════════════════════════════════════════ */
export const LUXURY_EASE = [0.22, 1, 0.36, 1] as const;
export const SPRING_SMOOTH = { stiffness: 260, damping: 30, mass: 0.8 };
export const SPRING_BOUNCY = { stiffness: 320, damping: 22, mass: 0.6 };
export const SPRING_GENTLE = { stiffness: 180, damping: 35, mass: 1 };

/* ══════════════════════════════════════════════════════════
   SCROLL REVEAL VARIANTS
   ══════════════════════════════════════════════════════════ */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 60, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.9, ease: LUXURY_EASE } },
};

export const fadeUpScale: Variants = {
  hidden: { opacity: 0, y: 50, scale: 0.92, filter: "blur(6px)" },
  visible: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", transition: { duration: 1, ease: LUXURY_EASE } },
};

export const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -60, filter: "blur(6px)" },
  visible: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.9, ease: LUXURY_EASE } },
};

export const fadeRight: Variants = {
  hidden: { opacity: 0, x: 60, filter: "blur(6px)" },
  visible: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.9, ease: LUXURY_EASE } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8, rotateX: 8 },
  visible: { opacity: 1, scale: 1, rotateX: 0, transition: { duration: 0.8, ease: LUXURY_EASE } },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

export const staggerFast: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

/* ══════════════════════════════════════════════════════════
   3D TILT CARD — Premium perspective hover
   ══════════════════════════════════════════════════════════ */
interface Tilt3DProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  intensity?: number;       // tilt degree multiplier (default 1)
  glare?: boolean;          // show reflective glare on hover
  scale?: number;           // hover scale (default 1.02)
  perspective?: number;     // perspective distance (default 800)
}

export function Tilt3D({
  children,
  className = "",
  style = {},
  intensity = 1,
  glare = true,
  scale = 1.02,
  perspective = 800,
}: Tilt3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);
  const glareOpacity = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6 * intensity, -6 * intensity]), SPRING_SMOOTH);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8 * intensity, 8 * intensity]), SPRING_SMOOTH);
  const scaleVal = useSpring(1, SPRING_SMOOTH);

  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(px);
    y.set(py);
    glareX.set((px + 0.5) * 100);
    glareY.set((py + 0.5) * 100);
    glareOpacity.set(0.15);
    scaleVal.set(scale);
  }, [x, y, glareX, glareY, glareOpacity, scaleVal, scale]);

  const handleLeave = useCallback(() => {
    x.set(0);
    y.set(0);
    glareOpacity.set(0);
    scaleVal.set(1);
  }, [x, y, glareOpacity, scaleVal]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        rotateX,
        rotateY,
        scale: scaleVal,
        transformStyle: "preserve-3d",
        perspective: `${perspective}px`,
        ...style,
      }}
      className={`relative ${className}`}
    >
      {children}
      {glare && (
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-[inherit] z-10"
          style={{
            opacity: glareOpacity,
            background: useTransform(
              [glareX, glareY],
              ([gx, gy]) => `radial-gradient(ellipse at ${gx}% ${gy}%, rgba(255,255,255,0.35) 0%, transparent 70%)`
            ),
          }}
        />
      )}
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAGNETIC HOVER — Element follows cursor slightly
   ══════════════════════════════════════════════════════════ */
interface MagneticProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  strength?: number; // how strongly it follows (default 0.3)
}

export function Magnetic({ children, className = "", style = {}, strength = 0.3 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useSpring(0, SPRING_BOUNCY);
  const my = useSpring(0, SPRING_BOUNCY);

  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    mx.set((e.clientX - cx) * strength);
    my.set((e.clientY - cy) * strength);
  }, [mx, my, strength]);

  const handleLeave = useCallback(() => {
    mx.set(0);
    my.set(0);
  }, [mx, my]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x: mx, y: my, ...style }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════
   SCROLL REVEAL SECTION — Wrap any section for animated entrance
   ══════════════════════════════════════════════════════════ */
interface RevealSectionProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  variant?: "fadeUp" | "fadeUpScale" | "fadeLeft" | "fadeRight" | "scaleIn";
  delay?: number;
  once?: boolean;
}

const variantMap = { fadeUp, fadeUpScale, fadeLeft, fadeRight, scaleIn };

export function RevealSection({
  children,
  className = "",
  style = {},
  variant = "fadeUp",
  delay = 0,
  once = true,
}: RevealSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "-80px" });
  const selectedVariant = variantMap[variant];

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: selectedVariant.hidden,
        visible: {
          ...((selectedVariant.visible as any) || {}),
          transition: {
            ...((selectedVariant.visible as any)?.transition || {}),
            delay,
          },
        },
      }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════
   PARALLAX FLOAT — Element floats gently with scroll
   ══════════════════════════════════════════════════════════ */
interface ParallaxFloatProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  speed?: number; // negative = opposite direction
  offset?: [string, string];
}

export function ParallaxFloat({
  children,
  className = "",
  style = {},
  speed = 0.2,
  offset = ["start end", "end start"],
}: ParallaxFloatProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: offset as any });
  const y = useTransform(scrollYProgress, [0, 1], [0, speed * -100]);

  return (
    <motion.div ref={ref} style={{ y, ...style }} className={className}>
      {children}
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════
   GLOW CARD — Glassmorphism card with animated border glow
   ══════════════════════════════════════════════════════════ */
interface GlowCardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  glowColor?: string;
}

export function GlowCard({ children, className = "", style = {}, glowColor = "rgba(201,150,74,0.4)" }: GlowCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      className={`relative overflow-hidden ${className}`}
      style={style}
    >
      {/* Animated glow border that follows cursor */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[inherit] z-0"
        style={{
          background: useTransform(
            [mouseX, mouseY],
            ([x, y]) => `radial-gradient(250px circle at ${x}px ${y}px, ${glowColor}, transparent 70%)`
          ),
          opacity: 0,
        }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════
   TEXT REVEAL — Character-by-character or word-by-word reveal
   ══════════════════════════════════════════════════════════ */
interface TextRevealProps {
  text: string;
  className?: string;
  style?: CSSProperties;
  mode?: "word" | "char";
  delay?: number;
}

export function TextReveal({ text, className = "", style = {}, mode = "word", delay = 0 }: TextRevealProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const units = mode === "word" ? text.split(" ") : text.split("");

  return (
    <span ref={ref} className={`inline-flex flex-wrap ${className}`} style={style}>
      {units.map((unit, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20, rotateX: 40 }}
          animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
          transition={{
            duration: 0.6,
            delay: delay + i * (mode === "word" ? 0.08 : 0.03),
            ease: LUXURY_EASE,
          }}
          className="inline-block"
          style={{ transformOrigin: "bottom", marginRight: mode === "word" ? "0.3em" : undefined }}
        >
          {unit}
        </motion.span>
      ))}
    </span>
  );
}
