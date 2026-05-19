import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Star, ShieldCheck, Truck } from "lucide-react";
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
  const sectionRef = useRef<HTMLElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  useEffect(() => {
    supabase.from("site_images").select("image_url").eq("key", "hero").maybeSingle()
      .then(({ data }) => { if (data?.image_url) setHero(resolveImage(data.image_url)); });
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = imgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rotateX: y * -8, rotateY: x * 12 });
  }, []);

  const handleMouseLeave = useCallback(() => setTilt({ rotateX: 0, rotateY: 0 }), []);

  return (
    <section ref={sectionRef} className="relative min-h-[100vh] flex items-center overflow-hidden"
      style={{ background: "radial-gradient(ellipse 80% 60% at 30% 20%, hsl(348 55% 94%/0.6), transparent), radial-gradient(ellipse 60% 50% at 80% 80%, hsl(38 60% 92%/0.5), transparent), #FAF7F4" }}>
      
      {/* Floating gold particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div key={i} className="absolute w-1 h-1 rounded-full bg-[#C9964A]/30"
            style={{ left: `${15 + i * 14}%`, top: `${20 + (i % 3) * 25}%` }}
            animate={{ y: [0, -20, 0], opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 4 + i * 0.5, repeat: Infinity, delay: i * 0.7 }} />
        ))}
      </div>

      <motion.div style={{ opacity, scale }} className="max-w-[1280px] mx-auto px-6 lg:px-8 w-full py-16 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left -- Content */}
          <div className="order-2 lg:order-1">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
              
              {/* Eyebrow */}
              <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.6 }}
                style={{ fontSize: "11px", letterSpacing: "0.3em", textTransform: "uppercase", color: "#C9964A", fontWeight: 600 }}>
                {content.eyebrow || "Artisan Resin Keepsakes \u00B7 Since 2021"}
              </motion.p>

              {/* Headline */}
              <h1 className="mt-6 font-display" style={{ fontSize: "clamp(2.8rem, 5.5vw, 4.2rem)", fontWeight: 400, lineHeight: 1.05, letterSpacing: "-0.03em", color: "#3D2B1F" }}>
                Turn Memories
                <br />
                Into{" "}
                <span className="relative inline-block">
                  Timeless
                  <motion.span className="absolute -bottom-2 left-0 h-[2px] bg-[#C9964A]/40" initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ delay: 1, duration: 0.8 }} />
                </span>{" "}
                <em style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", color: "#C9964A" }}>Art.</em>
              </h1>

              {/* Subheadline */}
              <p className="mt-6" style={{ fontSize: "16px", lineHeight: 1.8, color: "hsl(25 10% 38%)", maxWidth: "460px" }}>
                {content.subheadline || "Hand-poured crystal resin preserving your most treasured memories \u2014 names, pressed flowers, wedding dates \u2014 into heirloom-quality art pieces that transcend time."}
              </p>

              {/* CTAs */}
              <motion.div className="mt-10 flex flex-wrap items-center gap-4"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.7 }}>
                <Link to="/shop" className="group inline-flex items-center gap-3 rounded-full transition-all duration-300 hover:shadow-[0_8px_30px_-8px_rgba(61,43,31,0.4)] hover:-translate-y-0.5"
                  style={{ height: "52px", padding: "0 32px", background: "#3D2B1F", color: "#FAF7F4", fontSize: "13px", fontWeight: 600, letterSpacing: "0.05em" }}>
                  Explore Collection
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link to="/gallery" className="inline-flex items-center gap-2 rounded-full transition-all duration-300 hover:bg-[#3D2B1F]/5"
                  style={{ height: "52px", padding: "0 32px", border: "1.5px solid #3D2B1F", color: "#3D2B1F", fontSize: "13px", fontWeight: 600, letterSpacing: "0.05em" }}>
                  View Our Work
                </Link>
              </motion.div>

              {/* Trust badges */}
              <motion.div className="mt-10 flex items-center gap-6 flex-wrap"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.6 }}>
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-[#C9964A] text-[#C9964A]" />)}
                  </div>
                  <span style={{ fontSize: "12px", color: "hsl(25 10% 38%)", fontWeight: 500 }}>2000+ happy customers</span>
                </div>
                <div className="hidden sm:flex items-center gap-4 text-[11px] text-gray-400">
                  <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-[#C9964A]" />Secure Payments</span>
                  <span className="flex items-center gap-1.5"><Truck className="w-3.5 h-3.5 text-[#C9964A]" />Free Shipping</span>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Right -- Hero Image with 3D tilt */}
          <motion.div className="order-1 lg:order-2 flex justify-center"
            initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}>
            <div ref={imgRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}
              className="relative" style={{ perspective: "1200px", maxWidth: "540px", width: "100%" }}>
              <motion.div style={{ transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`, transition: "transform 150ms ease-out", transformStyle: "preserve-3d" }}>
                <div className="relative rounded-[2rem] overflow-hidden"
                  style={{ boxShadow: "0 40px 100px -30px rgba(61,43,31,0.35), 0 0 0 1px rgba(201,150,74,0.1)" }}>
                  <img src={hero} alt="Luxury handmade resin art with preserved flowers"
                    className="w-full object-cover" style={{ aspectRatio: "4/5" }} fetchPriority="high" decoding="async" />
                  {/* Cinematic gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#3D2B1F]/20 via-transparent to-transparent" />
                </div>
                {/* Floating badge */}
                <motion.div className="absolute -bottom-4 -left-4 lg:-left-8 bg-white rounded-2xl px-5 py-3 shadow-[0_12px_40px_-10px_rgba(0,0,0,0.12)]"
                  animate={{ y: [0, -6, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
                  <p style={{ fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#C9964A", fontWeight: 700 }}>Bestseller</p>
                  <p style={{ fontSize: "14px", fontWeight: 500, color: "#3D2B1F", marginTop: "2px" }}>Floral Resin Tray</p>
                </motion.div>
                {/* Rating pill */}
                <motion.div className="absolute -top-3 -right-3 lg:-right-6 bg-white rounded-full px-4 py-2 shadow-[0_8px_24px_-6px_rgba(0,0,0,0.1)] flex items-center gap-1.5"
                  animate={{ y: [0, -4, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}>
                  <Star className="w-3.5 h-3.5 fill-[#C9964A] text-[#C9964A]" />
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "#3D2B1F" }}>4.9</span>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
