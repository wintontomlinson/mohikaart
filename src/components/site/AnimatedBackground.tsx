import { motion, useReducedMotion } from "framer-motion";

/**
 * Global animated background with subtle floating orbs and particles.
 * Renders behind all content for depth.
 */
const AnimatedBackground = () => {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden>
      {/* Large floating orbs */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full opacity-[0.04]"
        style={{
          background: "radial-gradient(circle, hsl(34 58% 52%) 0%, transparent 70%)",
          top: "10%",
          left: "-5%",
        }}
        animate={{
          x: [0, 80, 30, 0],
          y: [0, -40, 20, 0],
          scale: [1, 1.15, 0.95, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full opacity-[0.035]"
        style={{
          background: "radial-gradient(circle, hsl(348 56% 75%) 0%, transparent 70%)",
          top: "40%",
          right: "-8%",
        }}
        animate={{
          x: [0, -60, -20, 0],
          y: [0, 50, -30, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-[450px] h-[450px] rounded-full opacity-[0.03]"
        style={{
          background: "radial-gradient(circle, hsl(278 32% 70%) 0%, transparent 70%)",
          bottom: "5%",
          left: "30%",
        }}
        animate={{
          x: [0, 40, -30, 0],
          y: [0, -60, 30, 0],
          scale: [1, 1.08, 0.92, 1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Small floating particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${2 + (i % 3) * 2}px`,
            height: `${2 + (i % 3) * 2}px`,
            background: i % 3 === 0
              ? "hsl(34 58% 52% / 0.4)"
              : i % 3 === 1
              ? "hsl(348 56% 70% / 0.3)"
              : "hsl(278 32% 65% / 0.3)",
            left: `${8 + i * 11}%`,
            top: `${5 + (i * 13) % 90}%`,
          }}
          animate={{
            y: [0, -(20 + i * 5), 10, 0],
            x: [0, (i % 2 === 0 ? 15 : -15), 0],
            opacity: [0.2, 0.7, 0.3, 0.2],
            scale: [1, 1.5, 0.8, 1],
          }}
          transition={{
            duration: 6 + i * 0.8,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(61,43,31,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(61,43,31,0.3) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />
    </div>
  );
};

export default AnimatedBackground;
