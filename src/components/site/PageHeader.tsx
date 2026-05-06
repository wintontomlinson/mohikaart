import { motion } from "framer-motion";
import { ReactNode } from "react";

const PageHeader = ({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  children?: ReactNode;
}) => (
  <section className="relative pt-32 pb-14 md:pt-40 md:pb-24 bg-hero overflow-hidden noise-overlay">
    {/* Blobs */}
    <motion.div
      className="absolute -top-24 -left-24 w-[30rem] h-[30rem] rounded-full bg-blush/40 blur-3xl pointer-events-none blob-morph"
      animate={{ scale: [1, 1.08, 1] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute -bottom-24 -right-24 w-[34rem] h-[34rem] rounded-full bg-champagne/40 blur-3xl pointer-events-none blob-morph"
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
    />
    {/* Spinning gold ring accent */}
    <motion.div
      className="absolute -bottom-16 right-1/4 w-48 h-48 rounded-full border border-gold/20 pointer-events-none hidden md:block"
      animate={{ rotate: 360 }}
      transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
    />
    <motion.div
      className="absolute top-20 right-20 w-24 h-24 rounded-full border border-gold/10 pointer-events-none hidden lg:block"
      animate={{ rotate: -360 }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
    />

    <div className="container relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-3xl"
      >
        {eyebrow && (
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xs tracking-[0.3em] uppercase text-gold mb-5"
          >
            {eyebrow}
          </motion.div>
        )}
        <h1 className="font-display text-4xl md:text-6xl lg:text-[4rem] leading-[1.05]">{title}</h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl"
          >
            {subtitle}
          </motion.p>
        )}
        {children && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="mt-8"
          >
            {children}
          </motion.div>
        )}
      </motion.div>
    </div>
  </section>
);

export default PageHeader;
