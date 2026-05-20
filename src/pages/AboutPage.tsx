import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Instagram } from "lucide-react";
import { useRef, useState, useEffect } from "react";

import galleryPouring from "@/assets/gallery-pouring.jpg";
import catKeychain from "@/assets/cat-keychain.jpg";
import catTray from "@/assets/cat-tray.jpg";
import galleryWorkspace from "@/assets/gallery-workspace.jpg";

/* ── Count-up hook ── */
function useCountUp(target: number, inView: boolean, duration = 1200) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration / 16);
    const id = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(id); }
      else setVal(Math.floor(start));
    }, 16);
    return () => clearInterval(id);
  }, [inView, target, duration]);
  return val;
}

const EASE = [0.22, 1, 0.36, 1] as const;

const AboutPage = () => {
  const heroImgRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({ target: heroImgRef, offset: ["start end", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  const ordersCount = useCountUp(2000, statsInView);
  const yearsCount = useCountUp(3, statsInView, 800);

  const processRef = useRef(null);
  const processInView = useInView(processRef, { once: true, margin: "-80px" });

  return (
    <div style={{ background: "#fdf9f0" }}>

      {/* ━━ SECTION 1: HERO ━━ */}
      <section className="pt-28 pb-16 md:pb-20">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 grid md:grid-cols-5 gap-10 lg:gap-16 items-center">
          {/* Left (60%) */}
          <div className="md:col-span-3">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="text-[11px] uppercase tracking-[0.25em] font-semibold mb-5"
              style={{ color: "#c9a84c" }}
            >
              Our Story
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
              className="font-display mb-5"
              style={{ fontWeight: 400, fontSize: "clamp(2.2rem, 5vw, 3.4rem)", lineHeight: 1.1, letterSpacing: "-0.02em", color: "#1a1208" }}
            >
              Crafted with{" "}
              <em className="font-serif italic" style={{ color: "#c9a84c", fontWeight: 400 }}>love,</em>
              <br />since 2021.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
              className="text-base md:text-lg mb-8"
              style={{ color: "rgba(26,18,8,0.6)", maxWidth: 440, lineHeight: 1.7 }}
            >
              Every piece tells a story — yours.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.3 }}
              className="flex flex-wrap gap-3"
            >
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-[11px] tracking-[0.1em] uppercase font-semibold transition-all duration-300 hover:scale-105"
                style={{ background: "#1a1208", color: "#fdf9f0", boxShadow: "0 4px 16px -4px rgba(26,18,8,0.35)" }}
              >
                Shop Collection <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/custom-order"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-[11px] tracking-[0.1em] uppercase font-semibold transition-all duration-300 hover:scale-105"
                style={{ border: "1.5px solid #c9a84c", color: "#c9a84c" }}
              >
                Custom Order <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>
          </div>

          {/* Right (40%) */}
          <motion.div
            ref={heroImgRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: EASE, delay: 0.2 }}
            className="md:col-span-2 relative overflow-hidden rounded-3xl"
            style={{ aspectRatio: "3/4", boxShadow: "0 24px 60px -16px rgba(26,18,8,0.25)" }}
          >
            <motion.img
              src={galleryPouring}
              alt="Resin art crafting process"
              className="w-full h-full object-cover scale-110"
              style={{ y: heroY }}
            />
          </motion.div>
        </div>
      </section>

      {/* ━━ SECTION 2: OUR STORY ━━ */}
      <section className="py-16 md:py-24">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: stacked images */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
            className="relative"
          >
            <div className="relative w-[75%]">
              <img
                src={catKeychain}
                alt="Personalized name keychain"
                className="w-full rounded-2xl object-cover"
                style={{ aspectRatio: "4/5", boxShadow: "0 16px 40px -12px rgba(26,18,8,0.2)" }}
              />
            </div>
            <div className="absolute top-[40%] right-0 w-[55%]" style={{ zIndex: 2 }}>
              <img
                src={catTray}
                alt="Resin tray with flowers"
                className="w-full rounded-2xl object-cover"
                style={{ aspectRatio: "4/5", boxShadow: "0 16px 40px -12px rgba(26,18,8,0.2)", border: "4px solid #fdf9f0" }}
              />
            </div>
            <div
              className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full text-[10px] font-semibold"
              style={{ background: "rgba(26,18,8,0.8)", color: "#c9a84c", backdropFilter: "blur(8px)", zIndex: 3 }}
            >
              @mohikaart
            </div>
          </motion.div>

          {/* Right: text */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
          >
            <p className="text-[11px] uppercase tracking-[0.25em] font-semibold mb-4" style={{ color: "#c9a84c" }}>
              Our Story
            </p>
            <h2 className="font-display mb-6" style={{ fontWeight: 400, fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)", lineHeight: 1.15, color: "#1a1208", letterSpacing: "-0.02em" }}>
              From a passion for art to 2000+ happy memories
            </h2>
            <div className="space-y-4 text-[15px] leading-relaxed" style={{ color: "rgba(26,18,8,0.65)" }}>
              <p>Mohika Art was born in 2021 from a deep love for handcrafted beauty and the desire to turn fleeting moments into lasting keepsakes.</p>
              <p>Every piece is handpoured using premium crystal-clear resin, real dried flowers, gold leaf detailing — no two pieces are ever the same.</p>
              <p>Each creation is made to order, fully personalized to your vision. We don't believe in mass production — only in making things with heart.</p>
              <p>Today, we're proud to have crafted 2000+ memories and delivered them across India. Thank you for trusting us with yours.</p>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 mt-6 text-[12px] tracking-[0.1em] uppercase font-semibold transition-colors hover:opacity-80"
              style={{ color: "#c9a84c", borderBottom: "1px solid #c9a84c", paddingBottom: "3px" }}
            >
              Shop Our Collection <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ━━ SECTION 3: WHY CHOOSE US ━━ */}
      <section className="py-16 md:py-24" style={{ background: "rgba(201,168,76,0.04)" }}>
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
            className="text-center mb-12"
          >
            <p className="text-[11px] uppercase tracking-[0.25em] font-semibold mb-3" style={{ color: "#c9a84c" }}>
              Why Mohika Art
            </p>
            <h2 className="font-display" style={{ fontWeight: 400, fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)", color: "#1a1208", letterSpacing: "-0.02em" }}>
              What makes us different
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { emoji: "🌸", title: "100% Handmade", desc: "No machines, no mass production. Every piece poured by hand with care." },
              { emoji: "✨", title: "Premium Materials", desc: "Real dried flowers, genuine gold leaf, crystal-clear premium resin." },
              { emoji: "💌", title: "Fully Personalized", desc: "Made to your exact vision — names, dates, colors, flowers, everything." },
              { emoji: "🚚", title: "Pan India Delivery", desc: "Carefully packed and safely delivered to your doorstep." },
            ].map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
                className="text-center p-7 rounded-2xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg"
                style={{ background: "#fff", border: "1px solid rgba(201,168,76,0.1)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,168,76,0.4)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,168,76,0.1)"; }}
              >
                <div className="text-4xl mb-4">{card.emoji}</div>
                <h3 className="font-display text-lg mb-2" style={{ color: "#1a1208", fontWeight: 500 }}>{card.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(26,18,8,0.6)" }}>{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━ SECTION 4: STATS ━━ */}
      <section ref={statsRef} className="py-16 md:py-20" style={{ background: "#1a1208" }}>
        <div className="max-w-[1000px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: `${ordersCount.toLocaleString()}+`, label: "Orders Crafted" },
              { value: "4.9 ★", label: "Avg Rating" },
              { value: `${yearsCount} Yrs`, label: "Of Artistry" },
              { value: "Pan India", label: "Delivery" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
                className="text-center"
                style={{ borderRight: i < 3 ? "1px solid rgba(201,168,76,0.2)" : "none" }}
              >
                <div className="font-display text-2xl md:text-3xl mb-1" style={{ color: "#c9a84c" }}>{stat.value}</div>
                <div className="text-[10px] uppercase tracking-wider" style={{ color: "rgba(253,249,240,0.55)" }}>{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━ SECTION 5: MEET THE MAKER ━━ */}
      <section className="py-16 md:py-24">
        <div className="max-w-[600px] mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <p className="text-[11px] uppercase tracking-[0.25em] font-semibold mb-6" style={{ color: "#c9a84c" }}>
              The Artist
            </p>
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: EASE }}
              className="w-[180px] h-[180px] md:w-[200px] md:h-[200px] rounded-full mx-auto mb-6 overflow-hidden"
              style={{ border: "3px solid #c9a84c", boxShadow: "0 0 0 6px rgba(201,168,76,0.15)" }}
            >
              <img
                src={galleryWorkspace}
                alt="Mohika Art founder"
                className="w-full h-full object-cover"
              />
            </motion.div>
            <h3 className="font-serif text-2xl md:text-3xl mb-4" style={{ color: "#1a1208", fontWeight: 400, fontStyle: "italic" }}>
              Mohika
            </h3>
            <p className="text-[15px] leading-relaxed mb-6" style={{ color: "rgba(26,18,8,0.65)", maxWidth: 480, margin: "0 auto" }}>
              Hi! I'm the artist and founder behind Mohika Art. I started this journey in 2021 with a simple belief — that your memories deserve to be preserved beautifully. Each piece I make carries a little piece of my heart.
            </p>
            <a
              href="https://instagram.com/mohikaart"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] tracking-[0.08em] uppercase font-semibold transition-all duration-300 hover:scale-105"
              style={{ background: "linear-gradient(135deg, #833AB4, #FD1D1D, #F77737)", color: "#fff", boxShadow: "0 4px 14px -4px rgba(131,58,180,0.4)" }}
            >
              <Instagram className="w-4 h-4" /> Follow @mohikaart
            </a>
          </motion.div>
        </div>
      </section>

      {/* ━━ SECTION 6: PROCESS TIMELINE ━━ */}
      <section className="py-16 md:py-24" style={{ background: "rgba(201,168,76,0.04)" }}>
        <div className="max-w-[1000px] mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
            className="text-center mb-12"
          >
            <p className="text-[11px] uppercase tracking-[0.25em] font-semibold mb-3" style={{ color: "#c9a84c" }}>
              The Process
            </p>
            <h2 className="font-display" style={{ fontWeight: 400, fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)", color: "#1a1208", letterSpacing: "-0.02em" }}>
              How every piece is made
            </h2>
          </motion.div>

          <div ref={processRef} className="relative flex flex-col md:flex-row items-center md:items-start justify-center gap-8 md:gap-4">
            {/* Connecting line (desktop) */}
            <div className="hidden md:block absolute top-[50px] left-[15%] right-[15%] h-[2px]">
              <motion.div
                className="h-full rounded-full"
                style={{ background: "linear-gradient(90deg, #c9a84c, #e8c89a, #c9a84c)" }}
                initial={{ scaleX: 0 }}
                animate={processInView ? { scaleX: 1 } : {}}
                transition={{ duration: 1.2, delay: 0.3, ease: EASE }}
              />
            </div>

            {[
              { emoji: "🎨", title: "Design & Consult", desc: "We discuss your vision" },
              { emoji: "🌸", title: "Embed Real Flowers", desc: "Carefully placed by hand" },
              { emoji: "⏳", title: "Cure & Hand-polish", desc: "48hrs curing + polish" },
              { emoji: "📦", title: "Pack & Deliver", desc: "Premium gift packaging" },
            ].map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 24 }}
                animate={processInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.15, ease: EASE }}
                className="relative z-10 flex flex-col items-center text-center flex-1 max-w-[200px]"
              >
                <motion.div
                  className="w-[72px] h-[72px] rounded-full flex items-center justify-center mb-4"
                  style={{ background: "#fff", border: "2px solid #c9a84c", boxShadow: "0 6px 20px -4px rgba(201,168,76,0.2)" }}
                  animate={processInView ? { scale: [0.8, 1.05, 1] } : {}}
                  transition={{ duration: 0.6, delay: i * 0.15 + 0.3 }}
                >
                  <motion.span
                    className="text-2xl"
                    animate={processInView ? { y: [0, -3, 0] } : {}}
                    transition={{ duration: 1.5, delay: i * 0.15 + 0.8, repeat: Infinity, repeatDelay: 3 }}
                  >
                    {step.emoji}
                  </motion.span>
                </motion.div>
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] mb-1.5" style={{ color: "#c9a84c" }}>
                  Step {i + 1}
                </span>
                <h4 className="font-display text-sm mb-1" style={{ color: "#1a1208", fontWeight: 500 }}>{step.title}</h4>
                <p className="text-[12px]" style={{ color: "rgba(26,18,8,0.55)" }}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━ SECTION 7: BOTTOM CTA ━━ */}
      <section className="py-16 md:py-20">
        <div className="max-w-[700px] mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <h2 className="font-display mb-6" style={{ fontWeight: 400, fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)", color: "#1a1208", letterSpacing: "-0.02em" }}>
              Ready to preserve your memories?
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-[11px] tracking-[0.1em] uppercase font-semibold transition-all duration-300 hover:scale-105"
                style={{ background: "#1a1208", color: "#fdf9f0", boxShadow: "0 4px 16px -4px rgba(26,18,8,0.35)" }}
              >
                Shop Collection <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/custom-order"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-[11px] tracking-[0.1em] uppercase font-semibold transition-all duration-300 hover:scale-105"
                style={{ border: "1.5px solid #c9a84c", color: "#c9a84c" }}
              >
                Custom Order <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
