import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, Star, Package2, Truck, Play, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { resolveImage } from "@/lib/site";
import heroFallback from "@/assets/hero-resin-tray.jpg";
import keychain from "@/assets/cat-keychain.jpg";
import bookmark from "@/assets/cat-bookmark.jpg";

const badges = [
  { icon: Star,     label: "4.9 Rating",        sub: "2K+ Orders",       gold: true },
  { icon: Package2, label: "Handcrafted",         sub: "100% Handmade",    gold: false },
  { icon: Truck,    label: "Pan India Delivery",  sub: "Ships Nationwide", gold: false },
];

const Hero = () => {
  const [hero, setHero] = useState<string>(heroFallback);
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yLeft  = useTransform(scrollYProgress, [0, 1], [0, -55]);
  const yRight = useTransform(scrollYProgress, [0, 1], [0, -28]);
  const fadeOp = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

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

  return (
    <section
      ref={ref}
      id="top"
      className="relative overflow-hidden"
      style={{
        minHeight: "100svh",
        background:
          "radial-gradient(ellipse 80% 60% at 0% 0%, hsl(348 55% 93%/0.9), transparent 60%)," +
          "radial-gradient(ellipse 60% 55% at 95% 5%, hsl(38 65% 91%/0.75), transparent 55%)," +
          "radial-gradient(ellipse 45% 40% at 50% 100%, hsl(278 28% 94%/0.3), transparent 70%)," +
          "linear-gradient(170deg, hsl(36 42% 99%) 0%, hsl(35 32% 96%) 100%)",
      }}
    >
      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          style={{ y: yLeft }}
          className="absolute -top-48 -left-48 h-[48rem] w-[48rem] rounded-full bg-blush/25 blur-[100px]"
        />
        <motion.div
          style={{ y: yRight }}
          className="absolute -right-52 top-10 h-[54rem] w-[54rem] rounded-full bg-champagne/22 blur-[120px]"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Gold dust particles */}
        {[...Array(14)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full"
            style={{
              width:  `${1.5 + (i % 4) * 2}px`,
              height: `${1.5 + (i % 4) * 2}px`,
              left:   `${4 + i * 7}%`,
              top:    `${12 + (i % 6) * 13}%`,
              background: `hsl(${34 + i * 2} 58% 52%/0.25)`,
            }}
            animate={{ y: [0, -24, 0], opacity: [0.2, 0.7, 0.2], scale: [1, 1.5, 1] }}
            transition={{ duration: 4.5 + i * 0.7, repeat: Infinity, delay: i * 0.5, ease: "easeInOut" }}
          />
        ))}
        {/* Decorative rings */}
        <motion.div
          className="absolute top-20 right-16 w-[18rem] h-[18rem] rounded-full border border-amber-300/15 hidden lg:block"
          animate={{ rotate: 360 }}
          transition={{ duration: 38, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute top-28 right-24 w-[12rem] h-[12rem] rounded-full border border-rose-200/20 hidden lg:block"
          animate={{ rotate: -360 }}
          transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute top-32 right-28 w-[8rem] h-[8rem] rounded-full border border-amber-400/10 hidden lg:block"
          animate={{ rotate: 360 }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* MAIN LAYOUT */}
      <motion.div
        style={{ opacity: fadeOp }}
        className="relative mx-auto flex min-h-[calc(100svh-2rem)] max-w-[1320px] flex-col items-center gap-8 px-5 pb-0 pt-[92px] md:flex-row md:items-center md:gap-0 md:px-10 md:pt-[100px] md:pb-12"
      >

        {/* LEFT (44%) */}
        <motion.div
          style={{ y: yLeft }}
          className="flex w-full flex-col justify-center pb-10 md:w-[44%] md:pb-0 md:pr-12 lg:pr-16"
        >

          {/* Breadcrumb trail */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-2.5 flex items-center gap-1.5"
            style={{ fontSize: "10px", color: "hsl(25 10% 52%)", letterSpacing: "0.05em" }}
          >
            <span>Handcrafted in India</span>
            <ChevronRight className="w-2.5 h-2.5 opacity-50" />
            <span>Since 2021</span>
            <ChevronRight className="w-2.5 h-2.5 opacity-50" />
            <span style={{ color: "hsl(34 58% 48%)", fontWeight: 600 }}>2000+ Happy Customers</span>
          </motion.div>

          {/* Badge pill */}
          <motion.div
            initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.75, delay: 0.05 }}
            className="mb-7 inline-flex w-fit items-center gap-2 rounded-full px-4 py-2"
            style={{
              background: "linear-gradient(135deg, hsl(36 50% 99%/0.9), hsl(38 50% 97%/0.9))",
              backdropFilter: "blur(16px)",
              border: "1px solid hsl(34 58% 52%/0.2)",
              boxShadow: "0 2px 16px -6px hsl(34 58% 52%/0.2)",
              fontSize: "9px",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "hsl(25 10% 40%)",
              fontWeight: 600,
            }}
          >
            <motion.span
              animate={{ rotate: [0, 20, -10, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }}
            >
              <Sparkles className="h-3 w-3 shrink-0" style={{ color: "hsl(34 58% 52%)" }} />
            </motion.span>
            Resin Art · Personalized Gifts
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.1 }}
            className="font-display text-foreground"
            style={{
              fontWeight: 300,
              fontSize: "clamp(2.8rem, 5vw, 4.6rem)",
              lineHeight: 1.02,
              letterSpacing: "-0.03em",
            }}
          >
            Turn{" "}
            <em
              style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontWeight: 300,
                background: "linear-gradient(135deg, hsl(34 58% 44%), hsl(28 70% 52%), hsl(34 58% 48%))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Memories
            </em>
            <br />
            Into Timeless
            <br />
            <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 300, fontSize: "1.08em" }}>
              Art.
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            style={{
              marginTop: "1.6rem",
              color: "hsl(25 10% 42%)",
              fontSize: "clamp(0.88rem, 1.2vw, 0.98rem)",
              lineHeight: 1.85,
              maxWidth: "27rem",
              fontWeight: 380,
            }}
          >
            Customized handcrafted resin creations, preserving your most precious
            moments in luxurious, gallery-worthy keepsakes. Each piece made with
            love — one pour at a time.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.46 }}
            className="mt-9 flex flex-wrap gap-3"
          >
            {/* Primary */}
            <Link
              to="/shop"
              className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full"
              style={{
                padding: "0.92rem 2.2rem",
                fontSize: "0.8rem",
                letterSpacing: "0.06em",
                fontWeight: 600,
                background: "hsl(var(--foreground))",
                color: "hsl(var(--background))",
                boxShadow: "0 10px 32px -10px hsl(34 58% 52%/0.4), 0 2px 0 hsl(var(--foreground)/0.1) inset",
                transition: "all 0.38s cubic-bezier(0.22,1,0.36,1)",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 20px 48px -12px hsl(34 58% 52%/0.55), 0 2px 0 hsl(var(--foreground)/0.1) inset";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = "0 10px 32px -10px hsl(34 58% 52%/0.4), 0 2px 0 hsl(var(--foreground)/0.1) inset";
              }}
            >
              <span className="relative z-10 flex items-center gap-2.5">
                Shop Collection
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </Link>

            {/* Secondary */}
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 rounded-full text-foreground transition-all duration-300"
              style={{
                padding: "0.92rem 1.9rem",
                fontSize: "0.8rem",
                letterSpacing: "0.06em",
                fontWeight: 500,
                border: "1.5px solid hsl(var(--foreground)/0.15)",
                transition: "all 0.38s cubic-bezier(0.22,1,0.36,1)",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "hsl(var(--foreground))";
                e.currentTarget.style.color = "hsl(var(--background))";
                e.currentTarget.style.borderColor = "hsl(var(--foreground))";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "";
                e.currentTarget.style.color = "";
                e.currentTarget.style.borderColor = "";
                e.currentTarget.style.transform = "";
              }}
            >
              Custom Order
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.88 }}
            className="mt-10 flex flex-wrap items-center gap-2"
          >
            {badges.map((b, i) => (
              <motion.div
                key={b.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.92 + i * 0.1, duration: 0.4 }}
                className="flex items-center gap-2 rounded-full px-3 py-2"
                style={{
                  background: "hsl(36 50% 99%/0.7)",
                  backdropFilter: "blur(16px)",
                  border: "1px solid hsl(34 30% 88%/0.6)",
                  boxShadow: "0 2px 12px -4px hsl(22 22% 22%/0.06)",
                }}
              >
                <span
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                  style={{ background: "hsl(34 58% 52%/0.1)" }}
                >
                  <b.icon
                    className="h-3 w-3"
                    style={{ color: "hsl(34 58% 52%)", fill: b.gold ? "hsl(34 58% 52%)" : "none" }}
                  />
                </span>
                <div>
                  <div style={{ fontSize: "10.5px", fontWeight: 600, lineHeight: 1, color: "hsl(var(--foreground))" }}>
                    {b.label}
                  </div>
                  <div style={{ fontSize: "9px", marginTop: "2px", color: "hsl(25 10% 48%)" }}>
                    {b.sub}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* RIGHT (56%) */}
        <div className="relative w-full md:w-[56%]" style={{ height: "clamp(420px, 62vh, 680px)" }}>
          <motion.div style={{ y: yRight }} className="absolute inset-0">

            {/* Main image card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 22 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
              className="absolute rounded-[2.4rem] overflow-hidden group"
              style={{
                inset: "0 0 24px 20px",
                boxShadow:
                  "0 48px 120px -32px hsl(348 28% 28%/0.28), " +
                  "0 0 0 1px hsl(36 38% 88%/0.45), " +
                  "inset 0 1px 0 hsl(36 50% 100%/0.6)",
              }}
            >
              <img
                src={hero}
                alt="Luxury pressed-rose resin tray"
                className="h-full w-full object-cover transition-transform ease-out group-hover:scale-[1.04]"
                style={{ minHeight: "100%", transitionDuration: "2.2s" }}
              />
              {/* Depth overlays */}
              <div className="absolute inset-0 bg-gradient-to-tr from-foreground/8 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-foreground/8" />

              {/* Shimmer sweep */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                animate={{ x: ["-120%", "120%"] }}
                transition={{ duration: 4, repeat: Infinity, repeatDelay: 10, ease: "easeInOut" }}
              />

              {/* In-image bestseller label */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.6 }}
                className="absolute bottom-4 left-4 flex items-center gap-2.5 rounded-2xl px-3.5 py-2.5"
                style={{
                  background: "hsl(36 50% 99%/0.82)",
                  backdropFilter: "blur(20px) saturate(150%)",
                  border: "1px solid hsl(36 38% 92%/0.7)",
                  boxShadow: "0 8px 28px -8px hsl(22 22% 22%/0.2)",
                }}
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-xl" style={{ background: "hsl(34 58% 52%/0.12)" }}>
                  <Star className="h-3 w-3" style={{ fill: "hsl(34 58% 52%)", color: "hsl(34 58% 52%)" }} />
                </div>
                <div>
                  <div style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "hsl(34 58% 44%)", lineHeight: 1 }}>
                    Bestseller
                  </div>
                  <div className="font-serif" style={{ fontSize: "12px", marginTop: "3px", fontWeight: 400, color: "hsl(25 10% 32%)" }}>
                    Resin Trays
                  </div>
                </div>
              </motion.div>

              {/* Watch reel button */}
              <motion.a
                href="https://instagram.com/mohikaart"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.9, duration: 0.5, type: "spring", stiffness: 260 }}
                className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full px-3.5 py-2.5 cursor-pointer"
                style={{
                  background: "hsl(22 20% 14%/0.85)",
                  backdropFilter: "blur(14px)",
                  border: "1px solid hsl(36 38% 92%/0.12)",
                  boxShadow: "0 4px 16px -4px hsl(22 22% 10%/0.4)",
                }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex h-5 w-5 items-center justify-center rounded-full" style={{ background: "hsl(36 50% 99%/0.15)" }}>
                  <Play className="h-2.5 w-2.5 fill-current text-white/90" />
                </div>
                <span style={{ fontSize: "9.5px", color: "hsl(36 38% 96%)", letterSpacing: "0.1em", fontWeight: 500 }}>Watch Reel</span>
              </motion.a>
            </motion.div>

            {/* Floating card: New In (top-right) */}
            <motion.div
              initial={{ opacity: 0, x: 22, y: -16 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 1, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="absolute z-20 animate-float-slow"
              style={{ top: "4%", right: "0%", width: "clamp(124px, 12.5vw, 168px)" }}
              whileHover={{ scale: 1.06, transition: { duration: 0.3 } }}
            >
              <div
                className="overflow-hidden rounded-2xl p-2"
                style={{
                  background: "hsl(36 50% 99%/0.9)",
                  backdropFilter: "blur(24px) saturate(160%)",
                  border: "1px solid hsl(36 38% 92%/0.8)",
                  boxShadow:
                    "0 22px 56px -14px hsl(22 22% 22%/0.22), " +
                    "inset 0 1px 0 hsl(36 50% 100%/0.95)",
                }}
              >
                <img
                  src={bookmark}
                  alt="Floral resin bookmark"
                  loading="lazy"
                  className="w-full rounded-xl object-cover"
                  style={{ height: "clamp(86px, 9.5vw, 122px)" }}
                />
                <div className="px-1.5 pb-1.5 pt-2">
                  <div
                    className="flex items-center gap-1"
                    style={{ fontSize: "8px", letterSpacing: "0.24em", textTransform: "uppercase", color: "hsl(34 58% 48%)", fontWeight: 600 }}
                  >
                    <Sparkles className="h-2.5 w-2.5" style={{ color: "hsl(34 58% 52%)" }} />
                    New In
                  </div>
                  <div className="mt-0.5 font-serif" style={{ fontSize: "clamp(0.78rem, 1vw, 0.92rem)", fontWeight: 400 }}>
                    Bookmarks
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Floating card: Bestseller (center-left) */}
            <motion.div
              initial={{ opacity: 0, x: -22, y: 16 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 1, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
              className="absolute z-20 animate-float"
              style={{ bottom: "20%", left: "1%", width: "clamp(134px, 13.5vw, 180px)" }}
              whileHover={{ scale: 1.06, transition: { duration: 0.3 } }}
            >
              <div
                className="overflow-hidden rounded-2xl p-2"
                style={{
                  background: "hsl(36 50% 99%/0.9)",
                  backdropFilter: "blur(24px) saturate(160%)",
                  border: "1px solid hsl(36 38% 92%/0.8)",
                  boxShadow:
                    "0 22px 56px -14px hsl(22 22% 22%/0.22), " +
                    "inset 0 1px 0 hsl(36 50% 100%/0.95)",
                }}
              >
                <img
                  src={keychain}
                  alt="Personalised name keychain"
                  loading="lazy"
                  className="w-full rounded-xl object-cover"
                  style={{ height: "clamp(92px, 10.5vw, 132px)" }}
                />
                <div className="px-1.5 pb-1.5 pt-2">
                  <div
                    className="flex items-center gap-1"
                    style={{ fontSize: "8px", letterSpacing: "0.24em", textTransform: "uppercase", color: "hsl(34 58% 48%)", fontWeight: 600 }}
                  >
                    <Star className="h-2.5 w-2.5" style={{ fill: "hsl(34 58% 52%)", color: "hsl(34 58% 52%)" }} />
                    Bestseller
                  </div>
                  <div className="mt-0.5 font-serif" style={{ fontSize: "clamp(0.78rem, 1vw, 0.92rem)", fontWeight: 400 }}>
                    Name Keychains
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Decorative rings (bottom-right) */}
            <motion.div
              className="pointer-events-none absolute -bottom-4 -right-4 hidden h-32 w-32 rounded-full md:block"
              style={{ border: "1.5px solid hsl(34 58% 52%/0.25)" }}
              animate={{ rotate: 360 }}
              transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="pointer-events-none absolute -bottom-4 -right-4 hidden h-20 w-20 rounded-full md:block"
              style={{ border: "1px solid hsl(34 58% 52%/0.12)", margin: "1.2rem" }}
              animate={{ rotate: -360 }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Marquee strip */}
      <div className="relative mt-auto">
        <div className="gold-divider" />
        <div className="overflow-hidden py-4" style={{ background: "hsl(36 38% 99%/0.5)" }}>
          <div className="flex whitespace-nowrap" style={{ animation: "marquee 30s linear infinite" }}>
            {[...Array(2)].map((_, i) => (
              <span key={i} className="flex shrink-0 items-center">
                {[
                  "Handmade with Love", "Premium Resin Art", "Customized for You",
                  "Luxury Packaging",   "Pan India Delivery", "Memory Keepsakes",
                  "Wedding Gifts",      "Corporate Gifts",    "Since 2021",
                ].map((t) => (
                  <span
                    key={t}
                    className="px-8 font-display text-foreground/28"
                    style={{ fontWeight: 300, fontSize: "clamp(0.9rem, 1.4vw, 1.1rem)", letterSpacing: "0.04em" }}
                  >
                    {t}
                    <span className="mx-5 opacity-50" style={{ color: "hsl(34 58% 52%)" }}>·</span>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
        <div className="gold-divider" />
      </div>
    </section>
  );
};

export default Hero;
