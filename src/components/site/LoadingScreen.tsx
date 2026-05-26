import { useEffect } from "react";

/**
 * LoadingScreen — keeps HTML splash visible until counter hits 100% (1.5s),
 * then fades it out smoothly. Shows on EVERY page load.
 */
const LoadingScreen = () => {
  useEffect(() => {
    const splash = document.getElementById("splash-loader");
    if (!splash) return;

    // Remove splash as soon as React renders (page is ready)
    // No need to wait for the artificial counter — user sees content instantly
    splash.classList.add("done");
    const timer = setTimeout(() => { try { splash.remove(); } catch (e) {} }, 400);

    return () => clearTimeout(timer);
  }, []);

  return null;
};

export default LoadingScreen;
