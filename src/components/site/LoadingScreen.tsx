import { useEffect, useState } from "react";

const SEEN_KEY = "mohika.loadingseen.v1";

/**
 * LoadingScreen now works with the inline HTML splash in index.html.
 * On first session visit it keeps the HTML splash visible until critical
 * images are loaded (or a max timeout fires), then fades it out.
 * On subsequent visits (same session), it instantly removes the splash.
 */
const LoadingScreen = () => {
  const isFirstVisit =
    typeof window !== "undefined" && !sessionStorage.getItem(SEEN_KEY);
  const [removed, setRemoved] = useState(!isFirstVisit);

  useEffect(() => {
    const splash = document.getElementById("splash-loader");
    if (!splash) {
      setRemoved(true);
      return;
    }

    // If not first visit, remove immediately
    if (!isFirstVisit) {
      splash.remove();
      setRemoved(true);
      return;
    }

    // Respect prefers-reduced-motion
    const prefersReduced =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      splash.remove();
      sessionStorage.setItem(SEEN_KEY, "1");
      setRemoved(true);
      return;
    }

    // Wait for critical hero image to load, or max 3s
    const removeSplash = () => {
      splash.classList.add("fade-out");
      setTimeout(() => {
        splash.remove();
        setRemoved(true);
      }, 550);
      sessionStorage.setItem(SEEN_KEY, "1");
    };

    // Find hero image and wait for it
    const waitForHero = () => {
      const heroImg = document.querySelector(
        'img[fetchpriority="high"]'
      ) as HTMLImageElement | null;

      if (heroImg && heroImg.complete) {
        // Already loaded
        setTimeout(removeSplash, 300);
        return;
      }

      if (heroImg) {
        heroImg.addEventListener("load", () => setTimeout(removeSplash, 200), {
          once: true,
        });
      }
    };

    // Minimum display time of 1.8s (so the animation looks good)
    // then check if hero is loaded, or remove after max 3.5s
    const minTimer = setTimeout(waitForHero, 1800);
    const maxTimer = setTimeout(removeSplash, 3500);

    return () => {
      clearTimeout(minTimer);
      clearTimeout(maxTimer);
    };
  }, [isFirstVisit]);

  // This component doesn't render anything — the splash is in index.html
  return null;
};

export default LoadingScreen;
