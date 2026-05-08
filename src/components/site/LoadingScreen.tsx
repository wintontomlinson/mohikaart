import { useEffect, useState } from "react";
import mark from "@/assets/mohika-mark.png";

const LoadingScreen = () => {
  const [show, setShow] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadeOut(true), 1800);
    const hideTimer = setTimeout(() => setShow(false), 2600);
    return () => { clearTimeout(fadeTimer); clearTimeout(hideTimer); };
  }, []);

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background transition-opacity duration-700"
      style={{ opacity: fadeOut ? 0 : 1, pointerEvents: fadeOut ? "none" : "auto" }}
    >
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-blush/30 blur-3xl blob-morph" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-champagne/30 blur-3xl blob-morph" />
      </div>

      {/* Logo */}
      <div
        className="relative w-24 h-24 rounded-3xl bg-card flex items-center justify-center shadow-luxe animate-scale-in"
      >
        <img src={mark} alt="" className="w-16 h-16 object-contain" />
        <div className="absolute inset-0 rounded-3xl border-2 border-gold/50 glow-pulse" />
      </div>

      {/* Brand name */}
      <div className="mt-8 text-center animate-scale-in" style={{ animationDelay: "0.3s", opacity: 0, animationFillMode: "forwards" }}>
        <div className="font-display text-3xl text-gold-grad" style={{ fontWeight: 300 }}>
          Mohika Art
        </div>
        <div className="text-[10px] uppercase tracking-[0.5em] text-muted-foreground mt-2">
          Customized Resin Crafts
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-10 w-48 h-0.5 rounded-full bg-border overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-gold to-champagne rounded-full"
          style={{ animation: "loading-progress 1.8s 0.3s ease-in-out forwards", width: "0%" }}
        />
      </div>

      <style>{`
        @keyframes loading-progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
