import { useEffect } from "react";

/**
 * LoadingScreen — keeps HTML splash visible until counter hits 100% (1.5s),
 * then fades it out smoothly. Shows on EVERY page load.
 */
const LoadingScreen = () => {
  useEffect(() => {
    removeSplash();
  }, []);

  return null;
};

/** Remove the HTML splash — can be called from anywhere */
export function removeSplash() {
  const splash = document.getElementById("splash-loader");
  if (!splash) return;

  // Wait for counter to finish (1.5s) + tiny buffer, then fade out
  setTimeout(() => {
    splash.classList.add("done");
    setTimeout(() => { try { splash.remove(); } catch (e) {} }, 500);
  }, 1600);
}

export default LoadingScreen;
