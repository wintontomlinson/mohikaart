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
      className="group rounded-[16px] overflow-hidden bg-white"
      style={{
        border: "1px solid #e5e0d8",
        animation: `countup-fade 0.6s ease both`,
        animationDelay: `${(index % 9) * 100}ms`,
        transition: "transform 500ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 500ms cubic-bezier(0.22, 1, 0.36, 1), border-color 500ms cubic-bezier(0.22, 1, 0.36, 1)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-8px)";
        e.currentTarget.style.boxShadow = "0 24px 60px -16px rgba(61,43,31,0.2)";
        e.currentTarget.style.borderColor = "rgba(201,150,74,0.3)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.borderColor = "#e5e0d8";
      }}
    >
      <Link to={`/product/${p.slug}`} className="block">
        {/* Image container */}
        <div className="relative overflow-hidden" style={{ aspectRatio: "1/1" }}>
          <img
            src={resolveImage(p.image_url)}
            alt={p.name}
            loading="lazy"
            className="w-full h-full object-cover rounded-t-[16px] transition-transform duration-[600ms] ease-out group-hover:scale-[1.08]"
          />

          {/* Hover overlay with Quick View */}
          <div
            className="absolute inset-0 flex items-end justify-center pb-8 opacity-0 group-hover:opacity-100 transition-all duration-[400ms] ease-out translate-y-4 group-hover:translate-y-0 pointer-events-none"
            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.50) 0%, transparent 65%)" }}
          >
            <span className="flex items-center gap-2 text-white text-[11px] font-medium tracking-[0.12em] uppercase">
              <Eye className="w-4 h-4" />
              Quick View
            </span>
          </div>

          {/* Badge */}
          {p.badge && (
            <span
              className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-[0.1em]"
              style={{ background: "rgba(201,150,74,0.1)", color: "#C9964A" }}
            >
              {p.badge}
            </span>
          )}

          {/* Wishlist button */}
          <button
            onClick={handleWishlist}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center shadow-sm"
            style={{
              background: "rgba(255,255,255,0.95)",
              transition: "transform 300ms cubic-bezier(0.22, 1, 0.36, 1)",
              transform: heartBounce ? "scale(1.3)" : "scale(1)",
            }}
            aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              className="w-4 h-4"
              style={{
                color: wished ? "#e05a6d" : "#3D2B1F",
                fill: wished ? "#e05a6d" : "none",
                transition: "all 200ms ease",
              }}
            />
          </button>
        </div>

        {/* Content area */}
        <div className="p-5">
          <h3
            className="font-medium text-[16px] leading-snug truncate"
            style={{ color: "#3D2B1F", fontFamily: "var(--font-display)" }}
          >
            {p.name}
          </h3>

          <div className="flex items-baseline gap-2.5 mt-2">
            <span
              className="font-semibold text-[18px]"
              style={{ color: "#C9964A", fontFamily: "var(--font-display)" }}
            >
              {formatINR(Number(p.price))}
            </span>
            {p.original_price && Number(p.original_price) > Number(p.price) && (
              <span className="text-xs text-gray-400 line-through">
                {formatINR(Number(p.original_price))}
              </span>
            )}
          </div>

          {/* Add to Cart button */}
          <button
            onClick={handleAdd}
            className="w-full mt-4 rounded-full h-[42px] text-[12px] uppercase tracking-[0.12em] font-medium opacity-0 group-hover:opacity-100 transition-all duration-[400ms] ease-out"
            style={{
              background: adding ? "#C9964A" : "#3D2B1F",
              color: "#FAF7F4",
            }}
          >
            {adding ? "Added ✓" : "Add to Cart"}
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
  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {products.map((p, i) => <ProductCard key={p.id} p={p} index={i} />)}
  </div>
);
