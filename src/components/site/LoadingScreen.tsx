import { useEffect } from "react";

/**
 * LoadingScreen — instantly removes the HTML splash once React mounts.
 * No more waiting. Site loads fast with CSS transitions on content.
 */
const LoadingScreen = () => {
  useEffect(() => {
    const splash = document.getElementById("splash-loader");
    if (!splash) return;
    // Immediately fade out — no delay
    splash.classList.add("fade-out");
    setTimeout(() => { try { splash.remove(); } catch(e) {} }, 600);
  }, []);

  return null;
};

export default LoadingScreen;
