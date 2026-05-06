import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import mark from "@/assets/mohika-mark.png";

const LoadingScreen = () => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background"
        >
          {/* Background blobs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-blush/30 blur-3xl blob-morph" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-champagne/30 blur-3xl blob-morph" />
          </div>

          {/* Logo with reveal */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0, rotateY: -90 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-24 h-24 rounded-3xl bg-card flex items-center justify-center shadow-luxe"
            style={{ perspective: "600px" }}
          >
            <img src={mark} alt="" className="w-16 h-16 object-contain" />
            {/* Glow ring */}
            <motion.div
              className="absolute inset-0 rounded-3xl border-2 border-gold/50"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>

          {/* Brand name */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8 text-center"
          >
            <div className="font-display text-3xl text-gold-grad" style={{ fontWeight: 300 }}>
              Mohika Art
            </div>
            <div className="text-[10px] uppercase tracking-[0.5em] text-muted-foreground mt-2">
              Customized Resin Crafts
            </div>
          </motion.div>

          {/* Progress bar */}
          <motion.div
            className="mt-10 w-48 h-0.5 rounded-full bg-border overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-gold to-champagne rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.8, delay: 0.3, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
