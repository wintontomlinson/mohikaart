import { useEffect } from "react";

/**
 * LoadingScreen — removes the HTML splash as soon as React has mounted
 * (i.e. the real homepage content is painted). No artificial delay.
 *
 * The splash counter in index.html animates 0→100% over 1.5s purely as
 * a perceived-progress indicator. If React mounts before 1.5s (common on
 * fast connections), we immediately fade it out. If it takes longer, the
 * counter already hit 100% and splash waits for this component to remove it.
 */
const LoadingScreen = () => {
  useEffect(() => {
    const splash = document.getElementById("splash-loader");
    if (!splash) return;

    // Force counter to 100% immediately since content is ready
    const pct = document.getElementById("s-pct");
    const bar = document.getElementById("s-bar");
    if (pct) pct.textContent = "100%";
    if (bar) bar.style.width = "100%";

    // Tiny delay (80ms) for the 100% paint to register, then fade out
    const timer = setTimeout(() => {
      splash.classList.add("done");
      setTimeout(() => { try { splash.remove(); } catch (e) {} }, 450);
    }, 80);

    return () => clearTimeout(timer);
  }, []);

  return null;
};

export default LoadingScreen;
