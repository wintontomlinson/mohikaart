import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { resolveImage } from "@/lib/site";
import catWedding from "@/assets/cat-wedding.jpg";
import catTray from "@/assets/cat-tray.jpg";
import catCouple from "@/assets/cat-couple.jpg";
import catFrame from "@/assets/cat-frame.jpg";
import catKeychain from "@/assets/cat-keychain.jpg";
import catHamper from "@/assets/cat-hamper.jpg";

type Cat = { id: string; name: string; slug: string; image_url: string | null };

const FALLBACK_CATEGORIES: Cat[] = [
  { id: "fb-wedding",   name: "Wedding Keepsakes", slug: "wedding-keepsakes", image_url: catWedding },
  { id: "fb-frames",    name: "Photo Frames",      slug: "photo-frames",      image_url: catFrame },
  { id: "fb-keychains", name: "Name Keychains",    slug: "name-keychains",    image_url: catKeychain },
  { id: "fb-coasters",  name: "Coaster Sets",      slug: "coaster-sets",      image_url: catTray },
  { id: "fb-bookmarks", name: "Bookmarks",         slug: "bookmarks",         image_url: catCouple },
  { id: "fb-hampers",   name: "Gift Hampers",      slug: "gift-hampers",      image_url: catHamper },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

const Categories = ({ heading = true }: { heading?: boolean }) => {
  const [cats, setCats] = useState<Cat[]>([]);

  useEffect(() => {
    supabase
      .from("categories")
      .select("id,name,slug,image_url")
      .order("sort_order")
      .then(({ data }) => setCats((data ?? []) as Cat[]));
  }, []);

  const display = cats.length > 0 ? cats : FALLBACK_CATEGORIES;

  return (
    <section id="categories" className="py-20">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
        {heading && (
          <motion.div
            className="mb-14"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <p
              style={{ fontSize: "11px", letterSpacing: "0.3em", textTransform: "uppercase", color: "#C9964A", fontWeight: 600, marginBottom: "12px" }}
            >
              Collections
            </p>
            <h2
              className="font-display"
              style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 400, lineHeight: 1.1, color: "#3D2B1F" }}
            >
              Curated for Every{" "}
              <em style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", color: "#C9964A" }}>
                Occasion
              </em>
            </h2>
          </motion.div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {display.map((c, i) => (
            <motion.div
              key={c.id}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <Link
                to={`/category/${c.slug}`}
                className="group relative overflow-hidden rounded-[20px] block transition-all duration-500"
                style={{ height: "280px", border: "1px solid transparent" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(201,150,74,0.3)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "transparent"; }}
              >
                <img
                  src={resolveImage(c.image_url)}
                  alt={c.name}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.08]"
                />
                {/* Dark gradient overlay */}
                <div className="absolute inset-0"
                  style={{ background: "linear-gradient(to top, rgba(0,0,0,0.70) 0%, rgba(0,0,0,0.20) 40%, transparent 60%)" }}
                />
                {/* Title */}
                <div className="absolute bottom-0 left-0 p-6">
                  <span className="font-display text-white" style={{ fontSize: "20px", fontWeight: 500 }}>
                    {c.name}
                  </span>
                </div>
                {/* SHOP NOW pill on hover */}
                <div className="absolute bottom-6 right-6 translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-[400ms] ease-out">
                  <span
                    className="inline-block rounded-full px-5 py-2"
                    style={{
                      background: "#C9964A",
                      color: "#ffffff",
                      fontSize: "10px",
                      fontWeight: 700,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                    }}
                  >
                    SHOP NOW
                  </span>
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
