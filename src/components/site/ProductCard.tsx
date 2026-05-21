import { useEffect, useState, useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Heart, Plus, Star } from "lucide-react";
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

/* Generate a varied but deterministic rating from product id */
function getProductRating(id: string): { rating: number; count: number } {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = ((hash << 5) - hash + id.charCodeAt(i)) | 0;
  const ratings = [4.5, 4.6, 4.7, 4.8, 4.9, 5.0, 4.7, 4.8];
  const counts = [12, 28, 45, 67, 34, 19, 53, 41];
  const idx = Math.abs(hash) % ratings.length;
  return { rating: ratings[idx], count: counts[idx] };
}

export const ProductCard = ({ p, index = 0 }: { p: Product; index?: number }) => {
  const { add } = useCart();
  const { has, toggle } = useWishlist();
  const wished = has(p.id);
  const [adding, setAdding] = useState(false);
  const { rating, count: reviewCount } = getProductRating(p.id);
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;

  /* ── 3D Tilt logic ── */
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), { stiffness: 250, damping: 25 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), { stiffness: 250, damping: 25 });
  const glareX = useTransform(mouseX, [-0.5, 0.5], [0, 100]);
  const glareY = useTransform(mouseY, [-0.5, 0.5], [0, 100]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  }, [mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    setAdding(true);
    add({ id: p.id, slug: p.slug, name: p.name, price: Number(p.price), image_url: p.image_url });
    setTimeout(() => setAdding(false), 800);
  };

  const discount = p.original_price && Number(p.original_price) > Number(p.price)
    ? Math.round((1 - Number(p.price) / Number(p.original_price)) * 100)
    : null;

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 50, scale: 0.92, rotateX: 10 }}
      whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay: (index % 6) * 0.12, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
      className="group card-shine"
    >
      <Link to={`/product/${p.slug}`} className="block">
        <div className="relative overflow-hidden rounded-3xl bg-card-grad shadow-3d aspect-square" style={{ transformStyle: "preserve-3d" }}>
          <img
            src={resolveImage(p.image_url)}
            alt={p.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform group-hover:scale-[1.12]"
            style={{ transitionDuration: "1200ms", transform: "translateZ(0)" }}
          />
          {/* 3D Depth overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          {/* Glare effect */}
          <motion.div
            className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.15), transparent 60%)`,
            }}
          />

          {/* Badges row */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            {p.badge && (
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", delay: (index % 6) * 0.1 + 0.3 }}
                className="px-3 py-1.5 rounded-full glass text-[10px] uppercase tracking-widest"
              >
                {p.badge}
              </motion.div>
            )}
            {discount && (
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", delay: (index % 6) * 0.1 + 0.4 }}
                className="px-2.5 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-bold"
                style={{ background: "hsl(34 58% 52%)", color: "white" }}
              >
                -{discount}%
              </motion.div>
            )}
          </div>

          {/* Wishlist button */}
          <button
            onClick={(e) => { e.preventDefault(); toggle(p.id); }}
            className="absolute top-4 right-4 w-10 h-10 rounded-full glass flex items-center justify-center transition-all duration-300 hover:scale-110"
            aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              className="w-4 h-4 transition-all duration-300"
              style={{
                color: wished ? "hsl(348 70% 55%)" : undefined,
                fill: wished ? "hsl(348 70% 55%)" : "none",
              }}
            />
          </button>

          {/* Add to cart - smooth slide-up on hover */}
          <div className="absolute inset-x-4 bottom-4 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400 ease-out">
            <button
              onClick={handleAdd}
              className="w-full py-3 rounded-full bg-foreground text-background text-sm tracking-wide flex items-center justify-center gap-2 shadow-lg transition-all duration-300 hover:bg-[#C9964A] hover:text-white"
              style={adding ? { background: "#C9964A", color: "white" } : {}}
            >
              <Plus className="w-4 h-4" />
              {adding ? "Added!" : "Add to Cart"}
            </button>
          </div>
          {/* Animated glow border */}
          <div className="absolute inset-0 rounded-3xl border-2 border-gold/0 group-hover:border-gold/40 transition-all duration-700 pointer-events-none group-hover:shadow-[inset_0_0_30px_rgba(201,150,74,0.1)]" />
        </div>

        <div className="mt-4 flex items-end justify-between gap-2">
          <div className="min-w-0 flex-1">
            {/* Full product name - no truncation */}
            <h3 className="font-serif text-base md:text-lg leading-tight group-hover:text-[#C9964A] transition-colors duration-300" style={{ wordBreak: "break-word" }}>
              {p.name}
            </h3>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">Handmade · Customizable</p>
            {/* Varied star rating */}
            <div className="flex items-center gap-0.5 mt-2">
              {[...Array(5)].map((_, j) => (
                <Star
                  key={j}
                  className="w-3 h-3"
                  style={{
                    fill: j < fullStars ? "hsl(34 58% 52%)" : (j === fullStars && hasHalf ? "hsl(34 58% 52%)" : "hsl(34 20% 85%)"),
                    color: j < fullStars ? "hsl(34 58% 52%)" : (j === fullStars && hasHalf ? "hsl(34 58% 52%)" : "hsl(34 20% 85%)"),
                  }}
                />
              ))}
              <span className="ml-1.5 text-[10px] text-muted-foreground">({rating})</span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="font-display text-xl md:text-2xl text-gold-grad leading-none">{formatINR(Number(p.price))}</div>
            {p.original_price && Number(p.original_price) > Number(p.price) && (
              <div className="text-xs text-muted-foreground line-through mt-1">{formatINR(Number(p.original_price))}</div>
            )}
          </div>
        </div>
      </Link>
    </motion.article>
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
  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
    {products.map((p, i) => <ProductCard key={p.id} p={p} index={i} />)}
  </div>
);
