import { useEffect, useState } from "react";

/**
 * LoadingScreen works with the inline HTML splash in index.html.
 * It keeps the splash visible until the counter finishes (100%)
 * and the hero image is loaded, then smoothly fades it out.
 * Shows on EVERY page load (not just first visit).
 */
const LoadingScreen = () => {
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    const splash = document.getElementById("splash-loader");
    if (!splash) {
      setRemoved(true);
      return;
    }

    // Respect prefers-reduced-motion
    const prefersReduced =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      splash.remove();
      setRemoved(true);
      return;
    }

    const removeSplash = () => {
      // Don't remove twice
      if (!document.getElementById("splash-loader")) return;
      splash.classList.add("fade-out");
      setTimeout(() => {
        splash.remove();
        setRemoved(true);
      }, 600);
    };

    // Wait for the counter to finish (2.9s = 500ms delay + 2400ms animation)
    // Then check if hero image is loaded, otherwise wait a bit more
    const waitForReady = () => {
      const heroImg = document.querySelector(
        'img[fetchpriority="high"]'
      ) as HTMLImageElement | null;

      if (!heroImg || heroImg.complete) {
        // Hero already loaded or doesn't exist — remove immediately
        removeSplash();
        return;
      }

      // Wait for hero to load, but max 1.5s more
      const heroTimeout = setTimeout(removeSplash, 1500);
      heroImg.addEventListener(
        "load",
        () => {
          clearTimeout(heroTimeout);
          setTimeout(removeSplash, 150);
        },
        { once: true }
      );
    };

    // Min time = counter duration (500ms start delay + 2400ms count = 2900ms)
    // We add a tiny buffer → 3000ms
    const minTimer = setTimeout(waitForReady, 3000);

    // Absolute max — never keep splash longer than 5s
    const maxTimer = setTimeout(removeSplash, 5000);

    return () => {
      clearTimeout(minTimer);
      clearTimeout(maxTimer);
    };
  }, []);

  return null;
};

export default LoadingScreen;
