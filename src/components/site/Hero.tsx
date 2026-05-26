import { motion, useScroll, useTransform, useSpring, useMotionValue, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles, Star, Package2, Truck, ChevronRight, Instagram, Heart, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { resolveImage } from "@/lib/site";
import { safePath } from "@/lib/validation";
import { useHeroContent } from "@/lib/cms";
import heroFallback from "@/assets/hero-resin-tray.jpg";
import keychain from "@/assets/cat-keychain.jpg";
import bookmark from "@/assets/cat-bookmark.jpg";

/* ── animated counter ── */
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!to) return;
    let start = 0;
    const step = to / 60;
    const id = setInterval(() => {
      start += step;
      if (start >= to) { setVal(to); clearInterval(id); }
      else setVal(Math.floor(start));
    }, 18);
    return () => clearInterval(id);
  }, [to]);
  return <>{val.toLocaleString()}{suffix}</>;
}

/* ── tilt card wrapper ── */
function TiltCard({ children, className = "", style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [5, -5]), { stiffness: 280, damping: 28 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-7, 7]), { stiffness: 280, damping: 28 });

  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }, [x, y]);
  const handleLeave = useCallback(() => { x.set(0); y.set(0); }, [x, y]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: "800px", ...style }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const Hero = () => {
  const { data: content } = useHeroContent();
  const [hero, setHero] = useState<string>(heroFallback);
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yRight = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const yImage = useTransform(scrollYProgress, [0, 1], [0, 50]);

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

  // Stat values: support both numeric and pre-formatted strings
  const stat2Numeric = !isNaN(Number(content.stat2_value));

  // Sanitize admin-controlled CTA links via shared helper.
  const ctaPrimary   = safePath(content.cta_primary_link,   "/shop");
  const ctaSecondary = safePath(content.cta_secondary_link, "/contact");

  return (
    <section
      ref={ref}
      id="top"
      className="relative overflow-hidden noise-overlay flex flex-col"
      style={{
        minHeight: "min(100svh, 900px)",
        background:
          "radial-gradient(ellipse 90% 70% at 5% 0%, hsl(348 55% 93%/0.95), transparent 55%)," +
          "radial-gradient(ellipse 65% 60% at 96% 0%, hsl(38 65% 91%/0.85), transparent 50%)," +
          "radial-gradient(ellipse 50% 45% at 55% 98%, hsl(278 28% 94%/0.45), transparent 65%)," +
          "radial-gradient(ellipse 40% 35% at 20% 70%, hsl(34 58% 92%/0.3), transparent 50%)," +
          "linear-gradient(168deg, hsl(36 42% 99%) 0%, hsl(35 32% 96%) 100%)",
      }}
    >
      {/* ── Animated mesh blobs + cinematic ambient ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div
          className="absolute -top-56 -left-52 h-[56rem] w-[56rem] rounded-full bg-blush/20 blur-[110px] will-change-transform"
        />
        <div
          className="absolute -right-56 -top-4 h-[62rem] w-[62rem] rounded-full bg-champagne/18 blur-[130px] will-change-transform"
        />
        {/* Morphing ambient glow */}
        <motion.div
          className="absolute bottom-0 left-1/3 h-[28rem] w-[28rem] rounded-full blur-[90px]"
          style={{ background: "hsl(34 58% 82%/0.12)" }}
          animate={{ scale: [1, 1.15, 1], x: [0, 40, 0], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/4 right-1/4 h-[20rem] w-[20rem] rounded-full blur-[100px] hidden md:block"
          style={{ background: "hsl(348 55% 88%/0.08)" }}
          animate={{ scale: [1, 1.2, 1], y: [0, -20, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        />

        {/* Gold dust particles — cinematic shimmer (reduced for performance) */}
        {!reduceMotion && [...Array(5)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full"
            style={{
              width:  `${1 + (i % 5) * 1.2}px`,
              height: `${1 + (i % 5) * 1.2}px`,
              left:   `${3 + i * 11.5}%`,
              top:    `${8 + (i * 13) % 75}%`,
              background: i % 4 === 0
                ? `hsl(34 58% 52%/0.4)`
                : i % 4 === 1
                ? `hsl(348 55% 72%/0.3)`
                : i % 4 === 2
                ? `hsl(38 62% 72%/0.25)`
                : `hsl(34 48% 78%/0.35)`,
            }}
            animate={{
              y: [0, -(12 + (i % 5) * 6), 0],
              x: [0, (i % 2 === 0 ? 4 : -4), 0],
              opacity: [0.1, 0.65, 0.1],
              scale: [1, 1.4, 1],
            }}
            transition={{
              duration: 3.5 + i * 0.6,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Decorative concentric rings — hidden for perf, shown after interaction */}

        {/* Light reflection removed for faster paint */}
      </div>

      {/* ── MAIN LAYOUT ── */}
      <div
        className="relative mx-auto flex w-full max-w-[1360px] flex-1 flex-col items-start gap-8 px-5 pb-8 pt-[72px] md:flex-row md:items-center md:gap-0 md:px-10 md:pb-8 md:pt-[84px]"
      >

        {/* ══ LEFT (45%) ══ */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex w-full flex-col justify-center pb-6 md:w-[45%] md:pb-0 md:pr-10 lg:pr-16 xl:pr-20"
        >
          {/* Eyebrow breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-3 flex items-center gap-1.5 flex-wrap"
            style={{ fontSize: "10px", color: "hsl(25 10% 50%)", letterSpacing: "0.06em" }}
          >
            <span className="inline-flex items-center gap-1">
              <Heart className="w-2.5 h-2.5" style={{ fill: "hsl(348 55% 72%)", color: "hsl(348 55% 72%)" }} />
              Handcrafted in India
            </span>
            <ChevronRight className="w-2.5 h-2.5 opacity-40" />
            <span>Since 2021</span>
            <ChevronRight className="w-2.5 h-2.5 opacity-40" />
            <span style={{ color: "hsl(34 58% 46%)", fontWeight: 700 }}>Trusted by 2000+</span>
          </motion.div>

          {/* Brand pill */}
          <motion.div
            initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.08 }}
            className="mb-7 inline-flex w-fit items-center gap-2.5 rounded-full"
            style={{
              padding: "0.45rem 1.1rem 0.45rem 0.65rem",
              background: "linear-gradient(135deg, hsl(36 50% 99%/0.95), hsl(348 55% 97%/0.85))",
              backdropFilter: "blur(20px)",
              border: "1px solid hsl(34 58% 52%/0.22)",
              boxShadow: "0 4px 20px -6px hsl(34 58% 52%/0.22), inset 0 1px 0 hsl(36 50% 100%/0.8)",
              fontSize: "9px",
              letterSpacing: "0.3em",
              textTransform: "uppercase" as const,
              color: "hsl(25 10% 36%)",
              fontWeight: 600,
            }}
          >
            <motion.span
              className="flex h-5 w-5 items-center justify-center rounded-full"
              style={{ background: "hsl(34 58% 52%/0.12)" }}
              animate={{ rotate: [0, 18, -10, 0] }}
              transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 3.5 }}
            >
              <Sparkles className="h-2.5 w-2.5" style={{ color: "hsl(34 58% 52%)" }} />
            </motion.span>
            <span className="line-clamp-1">{content.eyebrow}</span>
          </motion.div>

          {/* ── HEADLINE ── */}
          <div className="overflow-hidden">
            <motion.h1
              initial={{ opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.05, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="font-display"
              style={{
                fontWeight: 300,
                fontSize: "clamp(2.85rem, 5.2vw, 4.85rem)",
                lineHeight: 1.02,
                letterSpacing: "-0.03em",
                color: "hsl(var(--foreground))",
              }}
            >
              {content.headline_part1}{" "}
              <motion.em
                initial={{ backgroundPosition: "200% center" }}
                animate={{ backgroundPosition: "0% center" }}
                transition={{ duration: 2.5, delay: 0.5, ease: "easeOut" }}
                style={{
                  fontFamily: "var(--font-serif)",
                  fontStyle: "italic",
                  fontWeight: 300,
                  background: "linear-gradient(118deg, hsl(34 52% 42%), hsl(38 72% 62%) 42%, hsl(28 75% 54%) 62%, hsl(34 52% 42%))",
                  backgroundSize: "200% auto",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  display: "inline-block",
                }}
              >
                {content.headline_highlight}
              </motion.em>
              <br />
              <span style={{ fontWeight: 300 }}>{content.headline_part2}</span>
              {content.headline_part3 && (
                <>
                  <br />
                  <span
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontStyle: "italic",
                      fontWeight: 300,
                      fontSize: "1.1em",
                      letterSpacing: "-0.04em",
                    }}
                  >
                    {content.headline_part3}
                  </span>
                </>
              )}
            </motion.h1>
          </div>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.35 }}
            style={{
              marginTop: "1.5rem",
              color: "hsl(25 10% 40%)",
              fontSize: "clamp(0.875rem, 1.15vw, 0.975rem)",
              lineHeight: 1.85,
              maxWidth: "27rem",
              fontWeight: 380,
            }}
          >
            {content.subheadline}
          </motion.p>

          {/* ── CTA BUTTONS ── */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <Link
              to={ctaPrimary}
              className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full"
              style={{
                padding: "0.92rem 2.3rem",
                fontSize: "0.78rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                fontWeight: 600,
                background: "hsl(var(--foreground))",
                color: "hsl(var(--background))",
                boxShadow: "0 12px 36px -10px hsl(34 58% 38%/0.55), 0 2px 0 hsl(var(--foreground)/0.08) inset",
                transition: "all 0.4s cubic-bezier(0.22,1,0.36,1)",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 22px 50px -12px hsl(34 58% 38%/0.65), 0 2px 0 hsl(var(--foreground)/0.08) inset";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = "";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 36px -10px hsl(34 58% 38%/0.55), 0 2px 0 hsl(var(--foreground)/0.08) inset";
              }}
            >
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/12 to-transparent"
                animate={{ x: ["-120%", "120%"] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 6, ease: "easeInOut" }}
              />
              <span className="relative z-10 flex items-center gap-2.5">
                {content.cta_primary_label}
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1.5" />
              </span>
            </Link>

            <Link
              to={ctaSecondary}
              className="group inline-flex items-center gap-2 rounded-full transition-all duration-400"
              style={{
                padding: "0.92rem 2rem",
                fontSize: "0.78rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                fontWeight: 500,
                color: "hsl(var(--foreground))",
                border: "1.5px solid hsl(var(--foreground)/0.14)",
                transition: "all 0.4s cubic-bezier(0.22,1,0.36,1)",
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "hsl(var(--foreground))";
                el.style.color = "hsl(var(--background))";
                el.style.borderColor = "hsl(var(--foreground))";
                el.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "";
                el.style.color = "";
                el.style.borderColor = "";
                el.style.transform = "";
              }}
            >
              {content.cta_secondary_label}
            </Link>
          </motion.div>

          {/* ── STATS ROW ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.85, duration: 0.8 }}
            className="mt-10 flex items-center gap-6 flex-wrap"
          >
            <Stat
              value={<Counter to={content.stat1_value} suffix={content.stat1_suffix} />}
              label={content.stat1_label}
              delay={0}
            />
            <Stat
              value={stat2Numeric ? <Counter to={Number(content.stat2_value)} /> : content.stat2_value}
              label={content.stat2_label}
              delay={0.12}
            />
            <Stat
              value={<Counter to={content.stat3_value} suffix={content.stat3_suffix} />}
              label={content.stat3_label}
              delay={0.24}
            />

            {/* Dividers */}
            <div style={{ width: "1px", height: "28px", background: "hsl(34 28% 82%/0.8)" }} className="hidden sm:block" />

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3, duration: 0.5 }}
              className="flex items-center gap-1.5"
            >
              {[
                { Icon: Package2, label: "Premium packaging" },
                { Icon: Truck, label: "Pan-India shipping" },
                { Icon: ShieldCheck, label: "Quality guaranteed" },
              ].map(({ Icon, label }, i) => (
                <span
                  key={i}
                  title={label}
                  className="flex h-7 w-7 items-center justify-center rounded-full"
                  style={{
                    background: "hsl(36 50% 99%/0.9)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid hsl(34 30% 88%/0.6)",
                    boxShadow: "0 2px 8px -2px hsl(22 22% 22%/0.07)",
                  }}
                >
                  <Icon
                    className="h-3 w-3"
                    style={{ color: "hsl(34 58% 50%)" }}
                  />
                </span>
              ))}
              <span style={{ fontSize: "10px", color: "hsl(25 10% 44%)", marginLeft: "4px" }}>
                Handmade · Delivered India-wide
              </span>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* ══ RIGHT (55%) ══ */}
        <div className="relative w-full md:w-[55%]" style={{ height: "clamp(380px, 56vh, 620px)" }}>
          <motion.div style={{ y: yRight }} className="absolute inset-0">

            {/* ── MAIN HERO IMAGE ── */}
            <TiltCard
              className="absolute overflow-hidden rounded-[2.6rem] group cursor-default"
              style={{
                inset: "0 0 20px 24px",
                boxShadow:
                  "0 60px 140px -40px hsl(348 28% 28%/0.32), " +
                  "0 0 0 1px hsl(36 38% 88%/0.5), " +
                  "inset 0 1px 0 hsl(36 50% 100%/0.65)",
              }}
            >
              <motion.div className="absolute inset-0 scale-[1.08]" style={{ y: yImage }}>
                <img
                  src={hero}
                  alt="Luxury pressed-rose resin tray"
                  className="h-full w-full object-cover"
                  fetchPriority="high"
                  decoding="async"
                  width={800}
                  height={800}
                  style={{ backgroundColor: "hsl(36 30% 92%)" }}
                />
              </motion.div>

              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent pointer-events-none"
                animate={{ x: ["-130%", "130%"] }}
                transition={{ duration: 4.5, repeat: Infinity, repeatDelay: 12, ease: "easeInOut" }}
              />

              {/* Bestseller chip */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.6 }}
                className="absolute bottom-4 left-4 flex items-center gap-2.5 rounded-2xl"
                style={{
                  padding: "0.55rem 0.9rem",
                  background: "hsl(36 50% 99%/0.85)",
                  backdropFilter: "blur(24px) saturate(160%)",
                  border: "1px solid hsl(36 38% 94%/0.7)",
                  boxShadow: "0 8px 28px -8px hsl(22 22% 22%/0.22)",
                }}
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-xl" style={{ background: "hsl(34 58% 52%/0.12)" }}>
                  <Star className="h-3 w-3" style={{ fill: "hsl(34 58% 52%)", color: "hsl(34 58% 52%)" }} />
                </div>
                <div>
                  <div style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "hsl(34 58% 44%)", lineHeight: 1 }}>
                    {content.badge_text}
                  </div>
                  <div className="font-serif" style={{ fontSize: "12.5px", marginTop: "3px", fontWeight: 400, color: "hsl(25 10% 28%)" }}>
                    {content.badge_subtext}
                  </div>
                </div>
              </motion.div>

              {/* Instagram link */}
              <motion.a
                href="https://instagram.com/mohikaart"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 2.0, duration: 0.55, type: "spring", stiffness: 240 }}
                whileHover={{ scale: 1.07 }}
                className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full cursor-pointer"
                style={{
                  padding: "0.55rem 0.9rem",
                  background: "hsl(22 20% 12%/0.88)",
                  backdropFilter: "blur(16px)",
                  border: "1px solid hsl(36 38% 92%/0.1)",
                  boxShadow: "0 4px 18px -4px hsl(22 22% 10%/0.45)",
                }}
              >
                <Instagram className="h-3.5 w-3.5 text-white/80" />
                <span style={{ fontSize: "9.5px", color: "hsl(36 38% 95%)", letterSpacing: "0.1em", fontWeight: 500 }}>
                  @mohikaart
                </span>
              </motion.a>
            </TiltCard>

            {/* Floating cards */}
            <motion.div
              initial={{ opacity: 0, x: 28, y: -20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 1.1, delay: 0.85, ease: [0.22, 1, 0.36, 1] }}
              className="absolute z-20 animate-float-slow"
              style={{ top: "2%", right: "-1%", width: "clamp(118px, 12vw, 162px)" }}
            >
              <TiltCard>
                <div
                  className="overflow-hidden rounded-2xl p-2 cursor-default"
                  style={{
                    background: "hsl(36 50% 99%/0.92)",
                    backdropFilter: "blur(28px) saturate(170%)",
                    border: "1px solid hsl(36 38% 93%/0.8)",
                    boxShadow: "0 24px 60px -16px hsl(22 22% 22%/0.22), inset 0 1px 0 hsl(36 50% 100%/0.95)",
                  }}
                >
                  <img
                    src={bookmark}
                    alt="Floral resin bookmark"
                    loading="lazy"
                    width={200}
                    height={140}
                    className="w-full rounded-xl object-cover"
                    style={{ height: "clamp(82px, 9vw, 118px)", backgroundColor: "hsl(36 30% 94%)" }}
                  />
                  <div className="px-1.5 pb-1.5 pt-2">
                    <div
                      className="flex items-center gap-1"
                      style={{ fontSize: "7.5px", letterSpacing: "0.26em", textTransform: "uppercase", color: "hsl(34 58% 48%)", fontWeight: 700 }}
                    >
                      <Sparkles className="h-2 w-2" style={{ color: "hsl(34 58% 52%)" }} />
                      New In
                    </div>
                    <div className="mt-0.5 font-serif" style={{ fontSize: "clamp(0.76rem, 0.95vw, 0.9rem)", fontWeight: 400 }}>
                      Bookmarks
                    </div>
                  </div>
                </div>
              </TiltCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -28, y: 20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 1.1, delay: 1.05, ease: [0.22, 1, 0.36, 1] }}
              className="absolute z-20 animate-float"
              style={{ bottom: "18%", left: "-1%", width: "clamp(128px, 13vw, 174px)" }}
            >
              <TiltCard>
                <div
                  className="overflow-hidden rounded-2xl p-2 cursor-default"
                  style={{
                    background: "hsl(36 50% 99%/0.92)",
                    backdropFilter: "blur(28px) saturate(170%)",
                    border: "1px solid hsl(36 38% 93%/0.8)",
                    boxShadow: "0 24px 60px -16px hsl(22 22% 22%/0.22), inset 0 1px 0 hsl(36 50% 100%/0.95)",
                  }}
                >
                  <img
                    src={keychain}
                    alt="Personalised name keychain"
                    loading="lazy"
                    width={200}
                    height={150}
                    className="w-full rounded-xl object-cover"
                    style={{ height: "clamp(88px, 10vw, 128px)", backgroundColor: "hsl(36 30% 94%)" }}
                  />
                  <div className="px-1.5 pb-1.5 pt-2">
                    <div
                      className="flex items-center gap-1"
                      style={{ fontSize: "7.5px", letterSpacing: "0.26em", textTransform: "uppercase", color: "hsl(34 58% 48%)", fontWeight: 700 }}
                    >
                      <Star className="h-2 w-2" style={{ fill: "hsl(34 58% 52%)", color: "hsl(34 58% 52%)" }} />
                      Bestseller
                    </div>
                    <div className="mt-0.5 font-serif" style={{ fontSize: "clamp(0.76rem, 0.95vw, 0.9rem)", fontWeight: 400 }}>
                      Name Keychains
                    </div>
                  </div>
                </div>
              </TiltCard>
            </motion.div>

            {/* Orbit rings removed for performance */}
          </motion.div>
        </div>
      </div>

      {/* ── BOTTOM ACCENT LINE ── */}
      <div className="relative mt-auto">
        <div className="gold-divider" />
      </div>
    </section>
  );
};

const Stat = ({ value, label, delay }: { value: React.ReactNode; label: string; delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.95 + delay, duration: 0.5 }}
    className="flex flex-col"
  >
    <span
      className="font-display"
      style={{
        fontSize: "clamp(1.35rem, 2.2vw, 1.7rem)",
        fontWeight: 400,
        letterSpacing: "-0.03em",
        lineHeight: 1,
        background: "linear-gradient(135deg, hsl(34 52% 42%), hsl(38 72% 62%))",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}
    >
      {value}
    </span>
    <span style={{ fontSize: "10px", color: "hsl(25 10% 50%)", letterSpacing: "0.06em", marginTop: "2px" }}>
      {label}
    </span>
  </motion.div>
);

export default Hero;
