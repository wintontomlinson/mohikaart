import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { resolveImage } from "@/lib/site";
import galleryWorkspace from "@/assets/gallery-workspace.jpg";

const stats = [
  { value: "2000+", label: "Orders" },
  { value: "Pan India", label: "Shipping" },
  { value: "4.9★", label: "Rating" },
];

const AboutSnippet = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [imgSrc, setImgSrc] = useState(galleryWorkspace);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  useEffect(() => {
    // Use a product image instead of static gallery image
    supabase
      .from("products")
      .select("image_url")
      .eq("in_stock", true)
      .eq("featured", true)
      .not("image_url", "is", null)
      .order("sort_order")
      .limit(3)
      .then(({ data: prods }) => {
        // Use the 2nd or 3rd featured product for variety (hero uses 1st)
        const pick = prods?.[1] ?? prods?.[0];
        if (pick?.image_url) setImgSrc(resolveImage(pick.image_url));
      });
  }, []);

  return (
    <section ref={sectionRef} className="py-16 md:py-20" style={{ background: "#FAF7F4" }}>
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left: Image with parallax */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-3xl aspect-[4/5] md:aspect-[3/4]"
          >
            <motion.img
              src={imgSrc}
              alt="Mohika Art craft process"
              className="w-full h-full object-cover scale-110"
              style={{ y: imageY }}
              loading="lazy"
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "linear-gradient(to top, rgba(61,43,31,0.2) 0%, transparent 40%)" }}
            />
          </motion.div>

          {/* Right: Text content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <p
              className="font-semibold uppercase mb-3"
              style={{ fontSize: "11px", color: "#C9964A", letterSpacing: "0.25em" }}
            >
              Our Story
            </p>
            <h2
              className="font-display mb-5"
              style={{
                fontWeight: 400,
                fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                lineHeight: 1.2,
                letterSpacing: "-0.02em",
                color: "#3D2B1F",
              }}
            >
              Crafted with love{" "}
              <em className="font-serif italic" style={{ color: "#C9964A", fontWeight: 400 }}>
                since 2021.
              </em>
            </h2>

            <p
              className="mb-4"
              style={{ fontSize: "15px", lineHeight: 1.75, color: "rgba(61,43,31,0.7)" }}
            >
              Mohika Art was born from a passion for preserving life's beautiful moments in resin.
              Every piece is handcrafted with attention to detail, turning flowers, photos, and names
              into timeless keepsakes that tell your unique story.
            </p>
            <p
              className="mb-7"
              style={{ fontSize: "15px", lineHeight: 1.75, color: "rgba(61,43,31,0.7)" }}
            >
              From wedding bouquet preservation to personalized gifts, we pour love into every creation
              — because your memories deserve to last forever.
            </p>

            {/* Stats */}
            <div className="flex gap-6 mb-7">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                  className="text-center"
                >
                  <div
                    className="font-display"
                    style={{ fontSize: "1.3rem", fontWeight: 500, color: "#C9964A" }}
                  >
                    {stat.value}
                  </div>
                  <div
                    style={{ fontSize: "11px", color: "rgba(61,43,31,0.55)", letterSpacing: "0.05em", textTransform: "uppercase", marginTop: "2px" }}
                  >
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Read Our Story link */}
            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-[12px] tracking-[0.12em] uppercase font-semibold transition-colors duration-300 hover:text-[#C9964A]"
              style={{ color: "#3D2B1F", paddingBottom: "4px", borderBottom: "1px solid #C9964A" }}
            >
              Read Our Story
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSnippet;
