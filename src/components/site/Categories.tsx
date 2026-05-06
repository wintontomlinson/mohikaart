import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { resolveImage } from "@/lib/site";

type Cat = { id: string; name: string; slug: string; image_url: string | null };

const Categories = ({ heading = true }: { heading?: boolean }) => {
  const [cats, setCats] = useState<Cat[]>([]);

  useEffect(() => {
    supabase
      .from("categories")
      .select("id,name,slug,image_url")
      .order("sort_order")
      .then(({ data }) => setCats((data ?? []) as Cat[]));
  }, []);

  return (
    <section id="categories" className={`relative ${heading ? "py-28 md:py-40" : "py-14 md:py-20"} bg-blush/20`}>
      <div className="container">
        {heading && (
          <div className="max-w-2xl mx-auto text-center mb-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              style={{ fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase", color: "hsl(34 58% 52%)", marginBottom: "1.25rem", fontWeight: 500 }}
            >
              Explore
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display leading-[1.04] tracking-[-0.03em]"
              style={{ fontWeight: 300, fontSize: "clamp(2rem, 4vw, 3.6rem)" }}
            >
              Crafted Categories
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-5"
              style={{ fontSize: "clamp(0.92rem, 1.3vw, 1.02rem)", color: "hsl(25 10% 46%)", fontWeight: 380, lineHeight: 1.72 }}
            >
              From keychains to wedding heirlooms, find the perfect handmade keepsake for every moment.
            </motion.p>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
          {cats.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 40, scale: 0.93 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.65, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8 }}
              className="group relative rounded-3xl overflow-hidden shadow-card bg-card-grad card-3d"
            >
              <Link to={`/category/${c.slug}`} className="block">
                <div className="relative overflow-hidden aspect-[3/4]">
                  <img
                    src={resolveImage(c.image_url)}
                    alt={c.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    style={{ transitionDuration: "1400ms" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/65 via-foreground/10 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-t from-gold/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="absolute inset-0 rounded-3xl border-2 border-gold/0 group-hover:border-gold/25 transition-all duration-500 pointer-events-none" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.25em] text-background/60 mb-1.5">
                    Shop now
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                  </div>
                  <div className="font-display text-xl md:text-2xl text-background leading-tight">{c.name}</div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
