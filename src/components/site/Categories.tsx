import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
      <div className="max-w-[1280px] mx-auto px-8">
        {heading && (
          <div className="mb-12">
            <p
              className="eyebrow mb-3"
              style={{ fontSize: "11px", letterSpacing: "0.25em" }}
            >
              Explore
            </p>
            <h2
              className="font-display"
              style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 400, lineHeight: 1.1 }}
            >
              Crafted Categories
            </h2>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {display.map((c) => (
            <Link
              key={c.id}
              to={`/category/${c.slug}`}
              className="category-card group relative overflow-hidden rounded-[12px]"
              style={{ height: "220px" }}
            >
              <img
                src={resolveImage(c.image_url)}
                alt={c.name}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[250ms] ease-out group-hover:scale-[1.03]"
              />
              {/* Dark gradient overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.1) 40%, transparent 60%)",
                }}
              />
              {/* Title */}
              <div className="absolute bottom-0 left-0 p-4">
                <span className="text-white font-bold" style={{ fontSize: "18px" }}>
                  {c.name}
                </span>
              </div>
              {/* SHOP NOW pill on hover */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-[250ms] ease-out">
                <span
                  className="inline-block rounded-full px-4 py-1.5"
                  style={{
                    background: "#C9964A",
                    color: "#ffffff",
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                  }}
                >
                  SHOP NOW
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
