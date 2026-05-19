import { useEffect, useState } from "react";
import { Heart, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
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
  const [heartBounce, setHeartBounce] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    add({ id: p.id, slug: p.slug, name: p.name, price: Number(p.price), image_url: p.image_url });
    setTimeout(() => setAdding(false), 800);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setHeartBounce(true);
    toggle(p.id);
    setTimeout(() => setHeartBounce(false), 300);
  };

  return (
    <article
      className="group rounded-[12px] overflow-hidden bg-white transition-shadow duration-300 hover:shadow-lg"
      style={{
        border: "0.5px solid #e5e0d8",
        animation: `countup-fade 0.5s ease both`,
        animationDelay: `${(index % 9) * 80}ms`,
      }}
    >
      <Link to={`/product/${p.slug}`} className="block">
        {/* Image container */}
        <div className="relative overflow-hidden" style={{ aspectRatio: "1/1" }}>
          <img
            src={resolveImage(p.image_url)}
            alt={p.name}
            loading="lazy"
            className="w-full h-full object-cover rounded-t-[12px] transition-transform duration-300 group-hover:scale-[1.06]"
          />

          {/* Hover overlay with Quick View */}
          <div className="absolute inset-0 flex items-end justify-center pb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 60%)" }}
          >
            <span className="flex items-center gap-2 text-white text-xs font-medium tracking-wide uppercase">
              <Eye className="w-4 h-4" />
              Quick View
            </span>
          </div>

          {/* Wishlist button */}
          <button
            onClick={handleWishlist}
            className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-200"
            style={{
              background: "rgba(255,255,255,0.9)",
              transform: heartBounce ? "scale(1.25)" : "scale(1)",
            }}
            aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              className="w-3.5 h-3.5"
              style={{
                color: wished ? "#e05a6d" : "#3D2B1F",
                fill: wished ? "#e05a6d" : "none",
              }}
            />
          </button>
        </div>

        {/* Content area */}
        <div className="p-4">
          <h3 className="font-medium text-[15px] leading-snug" style={{ color: "#3D2B1F" }}>
            {p.name}
          </h3>

          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="font-semibold text-[14px]" style={{ color: "#C9964A" }}>
              {formatINR(Number(p.price))}
            </span>
            {p.original_price && Number(p.original_price) > Number(p.price) && (
              <span className="text-xs text-gray-400 line-through">
                {formatINR(Number(p.original_price))}
              </span>
            )}
          </div>

          {p.badge && (
            <span
              className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wide"
              style={{ background: "#FAF7F4", color: "#C9964A", border: "1px solid #e5e0d8" }}
            >
              {p.badge}
            </span>
          )}

          {/* Add to Cart / Customize button */}
          <button
            onClick={handleAdd}
            className="w-full mt-3 rounded-full h-[38px] text-xs uppercase tracking-wide font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: adding ? "#C9964A" : "#3D2B1F",
              color: "#FAF7F4",
            }}
          >
            {adding ? "Added!" : "Add to Cart"}
          </button>
        </div>
      </Link>
    </article>
  );
};

export const useProducts = (filter?: { featured?: boolean; categorySlug?: string; limit?: number }) => {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancel = false;
    (async () => {
      setLoading(true);
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
  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
    {products.map((p, i) => <ProductCard key={p.id} p={p} index={i} />)}
  </div>
);
