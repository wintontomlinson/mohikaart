import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { resolveImage } from "@/lib/site";
import { useHeroContent } from "@/lib/cms";
import heroFallback from "@/assets/hero-resin-tray.jpg";

const Hero = () => {
  const { data: content } = useHeroContent();
  const [hero, setHero] = useState<string>(heroFallback);
  const imgRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  useEffect(() => {
    supabase
      .from("site_images")
      .select("image_url")
      .eq("key", "hero")
      .maybeSingle()
      .then(({ data }) => {
        if (data?.image_url) setHero(resolveImage(data.image_url));
      });
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = imgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rotateX: y * -12, rotateY: x * 16 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt({ rotateX: 0, rotateY: 0 });
  }, []);

  return (
    <section
      className="flex items-center"
      style={{ minHeight: "max(100vh, 560px)" }}
    >
      <div className="max-w-[1280px] mx-auto px-8 w-full grid md:grid-cols-2 gap-12 md:gap-8 items-center py-12">
        {/* Left Column */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p
            className="eyebrow mb-4"
            style={{ fontSize: "11px", letterSpacing: "0.25em" }}
          >
            {content.eyebrow || "Handcrafted Resin Art"}
          </p>

          <h1
            className="font-display"
            style={{
              fontSize: "clamp(2.5rem, 5vw, 3.25rem)",
              fontWeight: 400,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: "#3D2B1F",
            }}
          >
            Designed with detail.
            <br />
            <em
              style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontWeight: 400,
                color: "#C9964A",
              }}
            >
              Delivered with devotion.
            </em>
          </h1>

          <p
            className="mt-5"
            style={{
              fontSize: "15px",
              lineHeight: 1.75,
              color: "hsl(25 10% 42%)",
              maxWidth: "420px",
            }}
          >
            {content.subheadline || "Each piece is poured, polished and packaged by hand—preserving your memories in crystal-clear resin that lasts a lifetime."}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 rounded-full"
              style={{
                height: "48px",
                padding: "0 28px",
                background: "#3D2B1F",
                color: "#FAF7F4",
                fontSize: "13px",
                fontWeight: 600,
                letterSpacing: "0.04em",
              }}
            >
              Shop Now
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/gallery"
              className="inline-flex items-center gap-2 rounded-full"
              style={{
                height: "48px",
                padding: "0 28px",
                border: "1.5px solid #3D2B1F",
                color: "#3D2B1F",
                fontSize: "13px",
                fontWeight: 600,
                letterSpacing: "0.04em",
                background: "transparent",
              }}
            >
              View Gallery
            </Link>
          </div>
        </motion.div>

        {/* Right Column - Product Image with 3D Tilt */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="flex justify-center"
        >
          <div
            ref={imgRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative overflow-hidden rounded-2xl"
            style={{
              perspective: "1000px",
              maxWidth: "520px",
              width: "100%",
            }}
          >
            <div
              style={{
                transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
                transition: "transform 100ms ease-out",
                transformStyle: "preserve-3d",
              }}
            >
              <img
                src={hero}
                alt="Luxury handmade resin art tray with pressed flowers"
                className="w-full h-auto object-cover rounded-2xl"
                style={{
                  boxShadow: "0 32px 80px -20px rgba(61,43,31,0.3)",
                  aspectRatio: "4/5",
                }}
                fetchPriority="high"
                decoding="async"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
