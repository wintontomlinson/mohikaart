import { useEffect } from "react";

/**
 * LoadingScreen manages the HTML splash in index.html.
 * It waits for the counter to reach 100% (3.3s) then fades out.
 * Shows on every page load.
 */
const LoadingScreen = () => {
  useEffect(() => {
    const splash = document.getElementById("splash-loader");
    if (!splash) return;

    // Respect reduced motion
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      splash.remove();
      return;
    }

    let removed = false;
    const removeSplash = () => {
      if (removed) return;
      removed = true;
      splash.classList.add("fade-out");
      setTimeout(() => { try { splash.remove(); } catch(e) {} }, 700);
    };

    // Wait 3.3s — this is 500ms delay + 2800ms counter duration
    // So user sees full 0%→100% animation before site reveals
    const timer = setTimeout(removeSplash, 3300);

    // Safety max — never block longer than 5s
    const maxTimer = setTimeout(removeSplash, 5000);

    return () => {
      clearTimeout(timer);
      clearTimeout(maxTimer);
    };
  }, []);

  return null;
};

export default LoadingScreen;
