import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { supabase } from "@/integrations/supabase/client";
import { resolveImage } from "@/lib/site";
import catWedding from "@/assets/cat-wedding.jpg";
import catTray from "@/assets/cat-tray.jpg";
import catFrame from "@/assets/cat-frame.jpg";
import catKeychain from "@/assets/cat-keychain.jpg";
import catCouple from "@/assets/cat-couple.jpg";
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

const Categories = ({ heading = true }: { heading?: boolean }) => {
  const [cats, setCats] = useState<Cat[]>([]);
  const ref = useScrollReveal<HTMLDivElement>();

  useEffect(() => {
    supabase
      .from("categories")
      .select("id,name,slug,image_url")
      .order("sort_order")
      .then(({ data }) => setCats((data ?? []) as Cat[]));
  }, []);

  const display = cats.length >= 6 ? cats.slice(0, 6) : FALLBACK_CATEGORIES;

  return (
    <section className="py-20" style={{ background: "#FAF7F4" }}>
      <div className="max-w-[1280px] mx-auto px-8">
        {heading && (
          <div className="text-center mb-12">
            <span
              style={{
                fontSize: "10px",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "#C9964A",
                fontWeight: 500,
              }}
            >
              Explore
            </span>
            <h2
              className="font-display mt-3"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 300 }}
            >
              Crafted Categories
            </h2>
          </div>
        )}

        <div
          ref={ref}
          className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {display.map((c) => (
            <Link
              key={c.id}
              to={`/category/${c.slug}`}
              className="group relative overflow-hidden"
              style={{ height: "220px", borderRadius: "12px" }}
            >
              <img
                src={resolveImage(c.image_url)}
                alt={c.name}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-[250ms] ease-out group-hover:scale-[1.03]"
              />
              {/* Dark gradient overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.2) 40%, transparent 60%)",
                }}
              />
              {/* Title */}
              <div className="absolute bottom-0 left-0 p-4">
                <h3 className="text-white font-bold" style={{ fontSize: "18px" }}>
                  {c.name}
                </h3>
              </div>
              {/* SHOP NOW pill on hover */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-[250ms]">
                <span
                  className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-semibold"
                  style={{ background: "#FAF7F4", color: "#3D2B1F" }}
                >
                  Shop Now
                </span>
              </div>
              {/* Hover shadow & lift */}
              <div
                className="absolute inset-0 transition-all duration-[250ms] ease-out group-hover:-translate-y-1 group-hover:shadow-lg rounded-[12px]"
                style={{ pointerEvents: "none" }}
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
