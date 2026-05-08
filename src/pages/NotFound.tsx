import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import mark from "@/assets/mohika-mark.png";

const NotFound = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-hero overflow-hidden">
      {/* Background blobs */}
      <motion.div
        className="absolute -top-32 -left-32 w-[36rem] h-[36rem] rounded-full bg-blush/40 blur-3xl pointer-events-none blob-morph"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-32 -right-32 w-[40rem] h-[40rem] rounded-full bg-champagne/40 blur-3xl pointer-events-none blob-morph"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50rem] h-[50rem] rounded-full bg-lavender/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
        {/* Logo mark */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotateY: -90 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex w-20 h-20 rounded-3xl bg-card shadow-luxe items-center justify-center mb-10 mx-auto"
          style={{ perspective: "600px" }}
        >
          <img src={mark} alt="Mohika Art" className="w-14 h-14 object-contain" />
        </motion.div>

        {/* 404 number */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-display text-[8rem] md:text-[11rem] leading-none text-gold-grad animate-gradient-text mb-4"
          style={{ fontWeight: 300 }}
        >
          404
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
        >
          <div className="text-xs tracking-[0.3em] uppercase text-gold mb-5">Page Not Found</div>
          <h1 className="font-display text-3xl md:text-5xl leading-tight mb-6">
            This memory<br />
            <em className="not-italic text-gold-grad">doesn't exist yet.</em>
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-md mx-auto mb-10">
            The page you're looking for has wandered off, like a petal in the breeze. Let's guide you back home.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            to="/"
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-foreground text-background btn-glow btn-magnetic"
          >
            <span className="flex items-center gap-3">
              Back to Home
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
          <Link
            to="/shop"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full border border-foreground/30 hover:bg-foreground hover:text-background transition-all duration-500 btn-magnetic"
          >
            <Sparkles className="w-4 h-4 text-gold" />
            Browse Collection
          </Link>
        </motion.div>

        {/* Decorative divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="gold-divider mt-14 max-w-xs mx-auto"
        />
      </div>
    </div>
  );
};

export default NotFound;
