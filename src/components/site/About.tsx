import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { ArrowRight, Award, Heart, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { resolveImage } from "@/lib/site";
import workspaceFallback from "@/assets/gallery-workspace.jpg";
import pouringFallback from "@/assets/gallery-pouring.jpg";
import flatlayFallback from "@/assets/gallery-flatlay.jpg";

const stats = [
  { value: "3+",   label: "Years of Craft" },
  { value: "2K+",  label: "Happy Customers" },
  { value: "100%", label: "Handmade" },
];

const About = () => {
  const sectionRef = useRef<HTMLElement>(null);

  const [img1, setImg1] = useState(pouringFallback);
  const [img2, setImg2] = useState(workspaceFallback);
  const [img3, setImg3] = useState(flatlayFallback);

  useEffect(() => {
    supabase
      .from("site_images")
      .select("key,image_url")
      .in("key", ["about_1", "about_2", "about_3"])
      .then(({ data }) => {
        (data ?? []).forEach((row) => {
          if (row.key === "about_1") setImg1(resolveImage(row.image_url));
          if (row.key === "about_2") setImg2(resolveImage(row.image_url));
          if (row.key === "about_3") setImg3(resolveImage(row.image_url));
        });
      });
  }, []);

  return (
    <section ref={sectionRef} id="about" className="relative py-28 md:py-40 overflow-hidden">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 right-0 w-[42rem] h-[42rem] rounded-full bg-champagne/20 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[36rem] h-[36rem] rounded-full bg-blush/20 blur-[100px]" />
      </div>

      <div className="container relative z-10 grid lg:grid-cols-12 gap-16 items-center">

        {/* ── Image Collage ── */}
        <div className="lg:col-span-6 relative h-[560px] md:h-[640px]" style={{ perspective: "1200px" }}>

          {/* Main large image */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="absolute top-0 left-0 w-[72%] h-[72%] rounded-[2.2rem] overflow-hidden shadow-luxe"
          >
            <img src={img1} alt="Artisan pouring resin" loading="lazy" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-blush/15" />
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              animate={{ x: ["-110%", "110%"] }}
              transition={{ duration: 4.5, repeat: Infinity, repeatDelay: 7, ease: "easeInOut" }}
            />
          </motion.div>

          {/* Secondary bottom-right image */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="absolute bottom-0 right-0 w-[60%] h-[58%] rounded-[2.2rem] overflow-hidden shadow-card border-4 border-background"
          >
            <img src={img2} alt="Resin studio workspace" loading="lazy" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-tl from-blush/20 to-transparent" />
          </motion.div>

          {/* Tiny accent image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="absolute top-[36%] right-0 w-[28%] h-[26%] rounded-[1.6rem] overflow-hidden shadow-soft border-2 border-background hidden md:block"
          >
            <img src={img3} alt="Resin flatlay" loading="lazy" className="w-full h-full object-cover" />
          </motion.div>

          {/* Decorative blobs */}
          <motion.div
            className="absolute -top-8 -left-8 w-28 h-28 rounded-full bg-blush/50 blur-3xl pointer-events-none"
            animate={{ scale: [1, 1.35, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -bottom-8 right-1/3 w-36 h-36 rounded-full bg-champagne/55 blur-3xl pointer-events-none"
            animate={{ scale: [1, 1.2, 1], x: [0, 10, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Floating years badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0, rotate: -10 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.85, type: "spring", stiffness: 180 }}
            className="absolute top-[48%] -right-5 md:-right-8 glass rounded-2xl px-5 py-4 shadow-card animate-float border border-gold/20 z-10"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold/15 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5 text-gold" strokeWidth={1.4} />
              </div>
              <div>
                <div className="font-display text-2xl text-gold-grad leading-none">3+</div>
                <div className="text-[9px] uppercase tracking-widest text-muted-foreground mt-1">Years of Craft</div>
              </div>
            </div>
          </motion.div>

          {/* Floating made with love chip */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 1.0 }}
            className="absolute bottom-[30%] -left-5 md:-left-8 glass rounded-xl px-4 py-2.5 shadow-soft animate-float-slow border border-border/50 z-10 hidden md:flex items-center gap-2"
          >
            <Heart className="w-3.5 h-3.5 shrink-0" style={{ color: "hsl(var(--blush-deep))", fill: "hsl(var(--blush-deep)/0.5)" }} />
            <span className="text-[10px] font-medium tracking-wide">Made with love</span>
          </motion.div>
        </div>

        {/* ── Text Content ── */}
        <div className="lg:col-span-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="eyebrow mb-5">Our Story</div>

            <h2
              className="font-display leading-[1.04] tracking-[-0.03em]"
              style={{ fontWeight: 300, fontSize: "clamp(2rem, 4vw, 3.6rem)" }}
            >
              Where every{" "}
              <em className="not-italic text-gold-grad animate-gradient-text" style={{ fontStyle: "italic", fontFamily: "var(--font-serif)" }}>
                memory
              </em>
              <br />finds its forever home.
            </h2>

            <p
              className="mt-8 leading-[1.8]"
              style={{ fontSize: "clamp(0.94rem, 1.35vw, 1.05rem)", color: "hsl(25 10% 42%)", fontWeight: 380 }}
            >
              Mohika Art was born from a quiet obsession: the belief that the
              little moments deserve to be held, touched, and admired forever.
              Every flower, every name, every heartbeat we capture in resin is a
              tribute to the people and stories you cherish most.
            </p>
            <p
              className="mt-5 leading-[1.8]"
              style={{ fontSize: "clamp(0.94rem, 1.35vw, 1.05rem)", color: "hsl(25 10% 42%)", fontWeight: 380 }}
            >
              From wedding bouquets to a child's first drawing, we transform life's
              most precious fragments into gallery-worthy keepsakes that last a
              lifetime.
            </p>

            {/* Stats row */}
            <div className="mt-10 grid grid-cols-3 gap-4">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.12, duration: 0.6 }}
                  className="frost-card rounded-2xl p-4 text-center"
                >
                  <div className="font-display text-2xl md:text-3xl text-gold-grad">{s.value}</div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1.5 leading-tight">{s.label}</div>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mt-10 flex flex-wrap gap-3"
            >
              <Link
                to="/about"
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-background text-[11px] tracking-[0.12em] uppercase font-semibold btn-glow"
              >
                Our Story
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/contact"
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-full glass border border-foreground/12 text-[11px] tracking-[0.12em] uppercase font-semibold hover:bg-foreground hover:text-background transition-all duration-500 btn-magnetic"
              >
                <Sparkles className="w-3 h-3" />
                Start Custom Order
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
