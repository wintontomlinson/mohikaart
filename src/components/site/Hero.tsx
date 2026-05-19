import { useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-resin-tray.jpg";

const Hero = () => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    const rotateY = x * 16; // ±8deg
    const rotateX = -y * 12; // ±6deg
    el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    const el = cardRef.current;
    if (!el) return;
    el.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
  }, []);

  return (
    <section
      className="relative w-full flex items-center overflow-hidden"
      style={{
        minHeight: "max(100vh, 560px)",
        background:
          "radial-gradient(ellipse 90% 70% at 5% 0%, hsl(348 55% 93%/0.95), transparent 55%)," +
          "radial-gradient(ellipse 65% 60% at 96% 0%, hsl(38 65% 91%/0.85), transparent 50%)," +
          "linear-gradient(168deg, #FAF7F4 0%, hsl(35 32% 96%) 100%)",
      }}
    >
      <div className="max-w-[1280px] mx-auto px-8 w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center py-12">
        {/* Left Content */}
        <div className="flex flex-col justify-center">
          <h1
            className="font-display"
            style={{
              fontSize: "52px",
              fontWeight: 400,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            Designed with detail.
            <br />
            <em
              className="not-italic"
              style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
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
              lineHeight: 1.7,
              color: "hsl(25 10% 42%)",
              maxWidth: "420px",
            }}
          >
            Handcrafted resin keepsakes that preserve your most cherished
            moments — names, flowers, memories — made entirely by hand.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/shop"
              className="inline-flex items-center justify-center gap-2 rounded-full transition-transform duration-200 hover:-translate-y-0.5"
              style={{
                height: "48px",
                padding: "0 32px",
                background: "#3D2B1F",
                color: "#FAF7F4",
                fontSize: "13px",
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              Shop Now
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/gallery"
              className="inline-flex items-center justify-center gap-2 rounded-full transition-all duration-200 hover:-translate-y-0.5"
              style={{
                height: "48px",
                padding: "0 32px",
                border: "1.5px solid #3D2B1F",
                color: "#3D2B1F",
                fontSize: "13px",
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                background: "transparent",
              }}
            >
              View Gallery
            </Link>
          </div>
        </div>

        {/* Right - 3D Tilt Image */}
        <div className="flex items-center justify-center">
          <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative rounded-3xl overflow-hidden shadow-luxe w-full max-w-[480px]"
            style={{
              aspectRatio: "4/5",
              transition: "transform 100ms ease-out",
              transformStyle: "preserve-3d",
            }}
          >
            <img
              src={heroImage}
              alt="Luxury handmade resin tray with pressed flowers"
              className="w-full h-full object-cover"
              fetchPriority="high"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
