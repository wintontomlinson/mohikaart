import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Heart, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useCart } from "@/lib/cart";
import { supabase } from "@/integrations/supabase/client";
import { resolveImage, formatINR } from "@/lib/site";

type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  original_price: number | null;
  image_url: string | null;
  badge: string | null;
  featured: boolean;
};

const BADGE_STYLES: Record<string, { bg: string; color: string }> = {
  Bestseller: { bg: "#1a1208", color: "#c9a84c" },
  New: { bg: "#c9a84c", color: "#1a1208" },
  Popular: { bg: "#f5e6f0", color: "#1a1208" },
  Premium: { bg: "#2d2015", color: "#c9a84c" },
};

/* Generate a varied but deterministic rating from product id */
function getProductRating(id: string): { rating: number; count: number } {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = ((hash << 5) - hash + id.charCodeAt(i)) | 0;
  const ratings = [4.5, 4.6, 4.7, 4.8, 4.9, 5.0, 4.7, 4.8];
  const counts = [12, 28, 45, 67, 34, 19, 53, 41];
  const idx = Math.abs(hash) % ratings.length;
  return { rating: ratings[idx], count: counts[idx] };
}

const Showcase = () => {
  const { add } = useCart();
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    supabase
      .from("products")
      .select("id,slug,name,price,original_price,image_url,badge,featured")
      .eq("in_stock", true)
      .eq("featured", true)
      .order("sort_order")
      .limit(8)
      .then(({ data }) => {
        if (data && data.length > 0) {
          setProducts(data as Product[]);
        } else {
          // Fallback: get any 8 products
          supabase
            .from("products")
            .select("id,slug,name,price,original_price,image_url,badge,featured")
            .eq("in_stock", true)
            .order("sort_order")
            .limit(8)
            .then(({ data: fallback }) => {
              setProducts((fallback ?? []) as Product[]);
            });
        }
      });
  }, []);

  const toggleWishlist = (id: string) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleAddToCart = (p: Product) => {
    add({ id: p.id, slug: p.slug, name: p.name, price: p.price, image_url: p.image_url });
    toast.success("Added to cart!", { duration: 2500 });
  };

  if (products.length === 0) return null;

  return (
    <section className="py-14 md:py-20" style={{ background: "#fdf9f0" }}>
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 md:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="font-semibold uppercase mb-3" style={{ fontSize: "11px", color: "#c9a84c", letterSpacing: "0.25em" }}>
              Best Sellers
            </p>
            <h2 className="font-display" style={{ fontWeight: 400, fontSize: "clamp(1.85rem, 3.8vw, 2.6rem)", lineHeight: 1.1, letterSpacing: "-0.02em", color: "#1a1208" }}>
              Loved by{" "}
              <em className="font-serif italic" style={{ color: "#c9a84c", fontWeight: 400 }}>everyone.</em>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-[12px] tracking-[0.12em] uppercase font-semibold transition-colors hover:text-[#c9a84c]"
              style={{ color: "#1a1208", paddingBottom: "4px", borderBottom: "1px solid #c9a84c" }}
            >
              View All Products
              <ArrowRight style={{ width: 14, height: 14 }} />
            </Link>
          </motion.div>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-5">
          {products.map((p, i) => {
            const { rating, count } = getProductRating(p.id);
            const discount = p.original_price && p.original_price > p.price
              ? Math.round((1 - p.price / p.original_price) * 100)
              : null;
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                className="group cursor-pointer"
                style={{ transition: "transform 0.35s cubic-bezier(0.22,1,0.36,1), box-shadow 0.35s ease" }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-8px)"; e.currentTarget.style.boxShadow = "0 20px 40px -12px rgba(26,18,8,0.15)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <Link to={`/product/${p.slug}`}>
                  {/* Image */}
                  <div className="relative overflow-hidden rounded-2xl" style={{ aspectRatio: "1/1" }}>
                    <img src={resolveImage(p.image_url)} alt={p.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.07]" />

                    {/* Badge */}
                    {p.badge && (
                      <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] uppercase tracking-wider font-bold" style={{ background: BADGE_STYLES[p.badge]?.bg ?? "#1a1208", color: BADGE_STYLES[p.badge]?.color ?? "#c9a84c" }}>
                        {p.badge}
                      </div>
                    )}

                    {/* Discount */}
                    {discount && (
                      <div className="absolute top-2.5 right-10 sm:right-11 px-1.5 py-0.5 rounded-full text-[8px] sm:text-[9px] font-bold" style={{ background: "#e53e3e", color: "#fff" }}>
                        -{discount}%
                      </div>
                    )}

                    {/* Wishlist */}
                    <button
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(p.id); }}
                      className="absolute top-2.5 right-2.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                      style={{ background: "rgba(255,255,255,0.9)", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
                    >
                      <Heart className="w-3 h-3 sm:w-3.5 sm:h-3.5 transition-all" style={{ color: wishlist.has(p.id) ? "#e53e3e" : "#999", fill: wishlist.has(p.id) ? "#e53e3e" : "none" }} />
                    </button>

                    {/* Add to Cart */}
                    <div className="absolute inset-x-2.5 bottom-2.5 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
                      <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAddToCart(p); }}
                        className="w-full py-2 sm:py-2.5 rounded-full text-[9px] sm:text-[10px] uppercase tracking-wider font-semibold flex items-center justify-center gap-1.5"
                        style={{ background: "#1a1208", color: "#fdf9f0" }}
                      >
                        <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Add to Cart
                      </button>
                    </div>
                  </div>
                </Link>

                {/* Card body */}
                <div className="mt-2.5 px-0.5">
                  <div className="text-[8px] sm:text-[9px] uppercase tracking-[0.18em] font-semibold mb-0.5" style={{ color: "#c9a84c" }}>
                    Handmade · Customizable
                  </div>
                  <Link to={`/product/${p.slug}`}>
                    <h3 className="text-[12px] sm:text-[13px] font-medium leading-tight mb-1 hover:text-[#c9a84c] transition-colors" style={{ color: "#1a1208", wordBreak: "break-word" }}>
                      {p.name}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-0.5 mb-1">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="w-2.5 h-2.5 sm:w-3 sm:h-3" style={{ fill: j < Math.floor(rating) ? "#c9a84c" : "#e5dfd3", color: j < Math.floor(rating) ? "#c9a84c" : "#e5dfd3" }} />
                    ))}
                    <span className="text-[9px] sm:text-[10px] ml-1" style={{ color: "rgba(26,18,8,0.45)" }}>({count})</span>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-semibold text-[13px] sm:text-sm" style={{ color: "#1a1208" }}>{formatINR(p.price)}</span>
                    {p.original_price && p.original_price > p.price && (
                      <span className="text-[10px] sm:text-xs line-through" style={{ color: "rgba(26,18,8,0.4)" }}>{formatINR(p.original_price)}</span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Showcase;
