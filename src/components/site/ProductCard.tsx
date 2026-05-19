import { useState, useEffect } from "react";
import { Heart, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { resolveImage, formatINR } from "@/lib/site";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";

export type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  original_price: number | null;
  image_url: string | null;
  badge: string | null;
  short_description: string | null;
  category_slug: string | null;
};

export const ProductCard = ({ p, index = 0 }: { p: Product; index?: number }) => {
  const { add } = useCart();
  const { has, toggle } = useWishlist();
  const wished = has(p.id);
  const [adding, setAdding] = useState(false);
  const [heartAnim, setHeartAnim] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    setAdding(true);
    add({ id: p.id, slug: p.slug, name: p.name, price: Number(p.price), image_url: p.image_url });
    setTimeout(() => setAdding(false), 800);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggle(p.id);
    setHeartAnim(true);
    setTimeout(() => setHeartAnim(false), 300);
  };

  const isCustomizable = !p.badge || p.badge.toLowerCase().includes("custom");

  return (
    <article
      className="group"
      style={{
        opacity: 0,
        animation: `countup-fade 0.4s ease-out ${(index % 6) * 60}ms forwards`,
      }}
    >
      <Link to={`/product/${p.slug}`} className="block">
        {/* Image container */}
        <div
          className="relative overflow-hidden"
          style={{ aspectRatio: "1/1", borderRadius: "10px 10px 0 0" }}
        >
          <img
            src={resolveImage(p.image_url)}
            alt={p.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.08]"
          />

          {/* Hover overlay */}
          <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: "rgba(0,0,0,0.45)" }}
          >
            <span className="flex items-center gap-2 text-white text-sm font-medium">
              <Eye className="w-4 h-4" />
              Quick View
            </span>
          </div>

          {/* Badge */}
          {p.badge && (
            <div
              className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-semibold"
              style={{ background: "#C9964A", color: "#fff" }}
            >
              {p.badge}
            </div>
          )}

          {/* Wishlist heart */}
          <button
            onClick={handleWishlist}
            className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center bg-white/90 backdrop-blur-sm transition-transform duration-200"
            style={{
              transform: heartAnim ? "scale(1.4)" : "scale(1)",
            }}
            aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              className="w-4 h-4 transition-colors duration-200"
              style={{
                color: wished ? "#e53e3e" : "#3D2B1F",
                fill: wished ? "#e53e3e" : "none",
              }}
            />
          </button>
        </div>

        {/* Info below image */}
        <div className="pt-3 pb-1">
          <h3 style={{ fontSize: "15px", fontWeight: 500, color: "#3D2B1F" }}>
            {p.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span style={{ fontSize: "14px", fontWeight: 600, color: "#C9964A" }}>
              {formatINR(Number(p.price))}
            </span>
            {p.original_price && Number(p.original_price) > Number(p.price) && (
              <span className="line-through text-xs" style={{ color: "hsl(25 10% 56%)" }}>
                {formatINR(Number(p.original_price))}
              </span>
            )}
          </div>
          {p.badge && (
            <div className="mt-1.5">
              <span
                className="inline-block px-2 py-0.5 rounded text-[10px] uppercase tracking-wider"
                style={{ background: "#FAF7F4", color: "#C9964A", border: "1px solid #e5e0d8" }}
              >
                {p.badge}
              </span>
            </div>
          )}
        </div>

        {/* Add to Cart / Customize CTA on hover */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleAdd}
            className="w-full py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors duration-200"
            style={{
              background: adding ? "#C9964A" : "#3D2B1F",
              color: "#FAF7F4",
            }}
          >
            {adding ? "Added!" : isCustomizable ? "Customize" : "Add to Cart"}
          </button>
        </div>
      </Link>
    </article>
  );
};

export const useProducts = (filter?: { featured?: boolean; categorySlug?: string; limit?: number }) => {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    let cancel = false;
    (async () => {
      const { supabase } = await import("@/integrations/supabase/client");
      let q = supabase.from("products").select("id,slug,name,price,original_price,image_url,badge,short_description,category_slug").order("sort_order");
      if (filter?.featured) q = q.eq("featured", true);
      if (filter?.categorySlug) q = q.eq("category_slug", filter.categorySlug);
      if (filter?.limit) q = q.limit(filter.limit);
      const { data: rows } = await q;
      if (!cancel) {
        setData((rows ?? []) as Product[]);
        setLoading(false);
      }
    })();
    return () => { cancel = true; };
  }, [filter?.featured, filter?.categorySlug, filter?.limit]);

  return { data, loading };
};

export const ProductGrid = ({ products }: { products: Product[] }) => (
  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {products.map((p, i) => <ProductCard key={p.id} p={p} index={i} />)}
  </div>
);
