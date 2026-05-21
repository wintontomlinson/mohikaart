import { motion, useInView } from "framer-motion";
import { Instagram, ExternalLink, Camera, Heart } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { resolveImage } from "@/lib/site";
import g1 from "@/assets/gallery-pouring.jpg";
import g2 from "@/assets/gallery-packing.jpg";
import g3 from "@/assets/gallery-flatlay.jpg";
import g4 from "@/assets/gallery-workspace.jpg";
import g5 from "@/assets/gallery-customer.jpg";
import g6 from "@/assets/cat-couple.jpg";

const GALLERY_KEYS = ["gallery_1", "gallery_2", "gallery_3", "gallery_4", "gallery_5", "gallery_6"];
const FALLBACKS = [g1, g2, g3, g4, g5, g6];
const labels = ["Pouring", "Packaging", "Flat Lay", "Workspace", "Customer", "Couple Frame"];
const heights = ["aspect-[4/5]", "aspect-square", "aspect-[4/5]", "aspect-[4/5]", "aspect-square", "aspect-[4/5]"];

const Gallery = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [imgs, setImgs] = useState<string[]>(FALLBACKS);

  useEffect(() => {
    supabase
      .from("site_images")
      .select("key,image_url")
      .in("key", GALLERY_KEYS)
      .then(({ data }) => {
        if (!data?.length) return;
        setImgs((prev) => {
          const next = [...prev];
          data.forEach((row) => {
            const idx = GALLERY_KEYS.indexOf(row.key);
            if (idx >= 0 && row.image_url) next[idx] = resolveImage(row.image_url);
          });
          return next;
        });
      });
  }, []);

  return (
    <section id="gallery" className="relative py-28 md:py-40 overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-blush/15 blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-[28rem] h-[28rem] rounded-full bg-champagne/15 blur-[100px]" />
      </div>

      <div className="container relative z-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="eyebrow mb-4 flex items-center gap-2"
            >
              <Camera className="w-3.5 h-3.5" />
              Behind the Art
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display leading-[1.04] tracking-[-0.03em] max-w-lg"
              style={{ fontWeight: 300, fontSize: "clamp(2rem, 4vw, 3.6rem)" }}
            >
              From our studio to your{" "}
              <em className="not-italic text-gold-grad" style={{ fontStyle: "italic", fontFamily: "var(--font-serif)" }}>
                heart.
              </em>
            </motion.h2>
          </div>
          <motion.a
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            href="https://instagram.com/mohikaart"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-full glass border border-foreground/12 self-start md:self-end hover:bg-foreground hover:text-background transition-all duration-500 btn-magnetic"
          >
            <Instagram className="w-4 h-4" />
            <span style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 500 }}>@mohikaart</span>
            <ExternalLink className="w-3 h-3 opacity-50" />
          </motion.a>
        </div>

        {/* Masonry-feel grid */}
        <div ref={ref} className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
          {imgs.map((src, i) => (
            <motion.a
              key={i}
              href="https://instagram.com/mohikaart"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.85, y: 40, rotateX: 12 }}
              animate={isInView ? { opacity: 1, scale: 1, y: 0, rotateX: 0 } : {}}
              transition={{ duration: 0.75, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{
                scale: 1.04,
                y: -10,
                rotateX: -3,
                rotateY: 4,
                z: 30,
              }}
              className={`group relative overflow-hidden rounded-2xl shadow-3d card-shine ${heights[i]}`}
              style={{ transformStyle: "preserve-3d", perspective: "800px" }}
            >
              <img
                src={src}
                alt={`Mohika Art - ${labels[i]}`}
                loading="lazy"
                className="w-full h-full object-cover transition-transform group-hover:scale-[1.12]"
                style={{ transitionDuration: "1000ms", transform: "translateZ(0)" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/75 via-foreground/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
              <div className="absolute inset-0 rounded-2xl border-2 border-gold/0 group-hover:border-gold/35 transition-all duration-500 pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                <div className="flex items-center justify-between text-background">
                  <div className="flex items-center gap-1.5">
                    <Instagram className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-medium">{labels[i]}</span>
                  </div>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </div>
              </div>
              <div className="absolute top-3 right-3 w-8 h-8 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
                <Heart className="w-3.5 h-3.5" />
              </div>
            </motion.a>
          ))}
        </div>

        {/* Instagram CTA strip */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-12 flex flex-col sm:flex-row items-center gap-5 frost-card rounded-2xl py-7 px-8"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gold/20 to-blush/20 flex items-center justify-center shrink-0">
            <Instagram className="w-5 h-5 text-foreground" strokeWidth={1.5} />
          </div>
          <div>
            <div className="font-display text-lg" style={{ fontWeight: 400 }}>Follow our journey on Instagram</div>
            <div className="text-sm text-muted-foreground mt-0.5">Daily resin art, behind-the-scenes and new arrivals</div>
          </div>
          <a
            href="https://instagram.com/mohikaart"
            target="_blank"
            rel="noopener noreferrer"
            className="sm:ml-auto shrink-0 px-5 py-2.5 rounded-full bg-foreground text-background text-[10px] tracking-[0.16em] uppercase font-semibold hover:opacity-85 transition-opacity"
          >
            Follow @mohikaart
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Gallery;
