import { useEffect, useRef } from "react";

interface TiltOptions {
  max?: number;
  speed?: number;
  glare?: boolean;
  maxGlare?: number;
  scale?: number;
}

export function useTilt<T extends HTMLElement>(options: TiltOptions = {}) {
  const ref = useRef<T>(null);
  const { max = 6, speed = 400, glare = true, maxGlare = 0.12, scale = 1.02 } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Disable on mobile / reduced motion
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const isMobile = window.innerWidth < 768;
    if (mq.matches || isMobile) return;

    let glareEl: HTMLDivElement | null = null;
    if (glare) {
      glareEl = document.createElement("div");
      glareEl.style.cssText = `
        position:absolute;inset:0;pointer-events:none;border-radius:inherit;
        background:linear-gradient(135deg,rgba(255,255,255,${maxGlare}) 0%,transparent 80%);
        opacity:0;transition:opacity ${speed}ms ease;
      `;
      el.style.position = "relative";
      el.style.overflow = "hidden";
      el.appendChild(glareEl);
    }

    el.style.transition = `transform ${speed}ms ease`;
    el.style.transformStyle = "preserve-3d";

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rotateX = (0.5 - y) * max * 2;
      const rotateY = (x - 0.5) * max * 2;
      el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;
      if (glareEl) {
        glareEl.style.opacity = "1";
        glareEl.style.background = `linear-gradient(${Math.atan2(y - 0.5, x - 0.5) * (180 / Math.PI) + 90}deg, rgba(255,255,255,${maxGlare}) 0%, transparent 80%)`;
      }
    };

    const handleLeave = () => {
      el.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)";
      if (glareEl) glareEl.style.opacity = "0";
    };

    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);

    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
      if (glareEl && el.contains(glareEl)) el.removeChild(glareEl);
    };
  }, [max, speed, glare, maxGlare, scale]);

  return ref;
}
