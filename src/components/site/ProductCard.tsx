import { useEffect, useState } from "react";
import { motion } from "framer-motion";
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

export const ProductCard = ({ p, index = 0 }: { p: Product; index?: number }) => {
  const { add } = useCart();
  const { has, toggle } = useWishlist();
  const wished = has(p.id);
  const [adding, setAdding] = useState(false);

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
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay: (index % 6) * 0.1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8 }}
      className="group card-3d"
    >
      <Link to={`/product/${p.slug}`} className="block">
        <div className="relative overflow-hidden rounded-3xl bg-card-grad shadow-card aspect-[4/5]">
          <img
            src={resolveImage(p.image_url)}
            alt={p.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform group-hover:scale-110"
            style={{ transitionDuration: "1500ms" }}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

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

          {/* Add to cart overlay */}
          <div className="absolute inset-x-4 bottom-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
            <button
              onClick={handleAdd}
              className="w-full py-3 rounded-full bg-foreground text-background text-sm tracking-wide flex items-center justify-center gap-2 btn-magnetic shadow-luxe transition-all duration-300"
              style={adding ? { background: "hsl(34 58% 52%)", color: "white" } : {}}
            >
              <Plus className="w-4 h-4" />
              {adding ? "Added!" : "Add to Cart"}
            </button>
          </div>
          {/* Hover border glow */}
          <div className="absolute inset-0 rounded-3xl border-2 border-gold/0 group-hover:border-gold/30 transition-all duration-500 pointer-events-none" />
        </div>

        <div className="mt-5 flex items-end justify-between">
          <div className="min-w-0 flex-1 pr-4">
            <h3 className="font-serif text-xl group-hover:text-gold-grad transition-all duration-300 truncate">{p.name}</h3>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mt-1">Handmade · Customizable</p>
            {/* 5-star mini rating */}
            <div className="flex items-center gap-0.5 mt-2">
              {[...Array(5)].map((_, j) => (
                <Star key={j} className="w-3 h-3" style={{ fill: "hsl(34 58% 52%)", color: "hsl(34 58% 52%)" }} />
              ))}
              <span className="ml-1.5 text-[10px] text-muted-foreground">(4.9)</span>
            </div>
            {/* Scarcity messaging is intentionally not rendered until a real stock_count column lands in supabase + the explicit selects fetch it. */}
          </div>
          <div className="text-right shrink-0">
            <div className="font-display text-2xl text-gold-grad leading-none">{formatINR(Number(p.price))}</div>
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
