import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import {
  Star, Heart, Plus, X, ArrowRight, ShoppingBag,
  Sparkles, ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/lib/cart";
import { supabase } from "@/integrations/supabase/client";
import { resolveImage, formatINR } from "@/lib/site";

type Product = {
  id: string;
  slug: string;
  name: string;
  short_description: string | null;
  description: string | null;
  category_slug: string | null;
  price: number;
  original_price: number | null;
  image_url: string | null;
  badge: string | null;
  featured: boolean;
  in_stock: boolean;
};

type Category = { slug: string; name: string };

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

const Shop = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { add } = useCart();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q")?.toLowerCase() ?? "";

  useEffect(() => {
    Promise.all([
      supabase.from("products").select("*").eq("in_stock", true).order("sort_order"),
      supabase.from("categories").select("slug,name").order("sort_order"),
    ]).then(([{ data: prods }, { data: cats }]) => {
      setProducts((prods ?? []) as Product[]);
      setCategories((cats ?? []) as Category[]);
      setLoading(false);
    });
  }, []);

  // Filter & sort
  const filtered = (() => {
    let list = activeCategory === "all" ? [...products] : products.filter((p) => p.category_slug === activeCategory);
    if (searchQuery) {
      list = list.filter((p) => p.name.toLowerCase().includes(searchQuery) || (p.short_description ?? "").toLowerCase().includes(searchQuery));
    }
    switch (sortBy) {
      case "price-asc": return list.sort((a, b) => a.price - b.price);
      case "price-desc": return list.sort((a, b) => b.price - a.price);
      case "newest": return [...list].reverse();
      case "bestselling": return list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
      default: return list;
    }
  })();

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

  const allCategories = [{ slug: "all", name: "All" }, ...categories];

  if (loading) {
    return (
      <div style={{ background: "#fdf9f0" }}>
        <section className="pt-28 pb-10">
          <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
            <div className="text-center">
              <div className="w-8 h-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin mx-auto" />
              <p className="text-sm text-muted-foreground mt-4">Loading collection…</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div style={{ background: "#fdf9f0" }}>
      {/* ── HEADER ── */}
      <section className="pt-28 pb-10 md:pb-14">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.16em] mb-8"
            style={{ color: "rgba(26,18,8,0.45)" }}
          >
            <Link to="/" className="hover:text-[#c9a84c] transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span style={{ color: "#1a1208" }}>Shop</span>
          </motion.nav>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-center"
          >
            <h1
              className="font-display mb-3"
              style={{ fontWeight: 400, fontSize: "clamp(2.2rem, 5vw, 3.2rem)", lineHeight: 1.1, letterSpacing: "-0.02em", color: "#1a1208" }}
            >
              Our{" "}
              <em className="font-serif italic" style={{ color: "#c9a84c", fontWeight: 400 }}>Collection</em>
            </h1>
            <p style={{ fontSize: "15px", color: "rgba(26,18,8,0.6)", maxWidth: 420, margin: "0 auto" }}>
              Handcrafted with love, personalized just for you
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── STICKY FILTER BAR ── */}
      <section
        className="sticky top-[60px] md:top-[68px] z-30 border-y"
        style={{ borderColor: "rgba(26,18,8,0.08)", background: "rgba(253,249,240,0.92)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}
      >
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
            {allCategories.map((c) => {
              const isActive = activeCategory === c.slug;
              return (
                <button
                  key={c.slug}
                  onClick={() => setActiveCategory(c.slug)}
                  className="shrink-0 transition-all duration-300"
                  style={{
                    padding: "8px 18px",
                    borderRadius: 9999,
                    fontSize: 11,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    fontWeight: 600,
                    background: isActive ? "#1a1208" : "transparent",
                    color: isActive ? "#fdf9f0" : "rgba(26,18,8,0.55)",
                    border: `1px solid ${isActive ? "#1a1208" : "rgba(26,18,8,0.12)"}`,
                    whiteSpace: "nowrap",
                  }}
                >
                  {c.name}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between mt-3">
            <span className="text-[11px] uppercase tracking-wider" style={{ color: "rgba(26,18,8,0.45)" }}>
              {filtered.length} {filtered.length === 1 ? "product" : "products"}
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-[11px] uppercase tracking-wider font-medium outline-none cursor-pointer"
              style={{ padding: "8px 14px", borderRadius: 9999, border: "1px solid rgba(26,18,8,0.1)", background: "#fff", color: "#1a1208" }}
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Newest</option>
              <option value="bestselling">Best Selling</option>
            </select>
          </div>
        </div>
      </section>

      {/* ── PRODUCT GRID ── */}
      <section className="max-w-[1280px] mx-auto px-6 lg:px-8 py-12 md:py-16">
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: "rgba(201,168,76,0.1)" }}>
                <ShoppingBag className="w-7 h-7" style={{ color: "#c9a84c" }} />
              </div>
              <h3 className="font-display text-xl mb-2" style={{ color: "#1a1208" }}>No products found</h3>
              <p className="text-sm mb-5" style={{ color: "rgba(26,18,8,0.55)" }}>Try a different category</p>
              <button
                onClick={() => setActiveCategory("all")}
                className="px-6 py-2.5 rounded-full text-[11px] uppercase tracking-wider font-semibold"
                style={{ background: "#1a1208", color: "#fdf9f0" }}
              >
                Browse All
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={`${activeCategory}-${sortBy}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-5"
            >
              {filtered.map((p, i) => {
                const { rating, count } = getProductRating(p.id);
                const discount = p.original_price && p.original_price > p.price
                  ? Math.round((1 - p.price / p.original_price) * 100)
                  : null;
                return (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                    className="group cursor-pointer"
                    style={{ transition: "transform 0.35s cubic-bezier(0.22,1,0.36,1), box-shadow 0.35s ease" }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-8px)"; e.currentTarget.style.boxShadow = "0 20px 40px -12px rgba(26,18,8,0.15)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                  >
                    <Link to={`/product/${p.slug}`}>
                      <div className="relative overflow-hidden rounded-xl sm:rounded-2xl" style={{ aspectRatio: "1/1" }}>
                        <img
                          src={resolveImage(p.image_url)}
                          alt={p.name}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.07]"
                        />

                        {p.badge && (
                          <div
                            className="absolute top-2 left-2 sm:top-3 sm:left-3 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[8px] sm:text-[9px] uppercase tracking-wider font-bold"
                            style={{ background: BADGE_STYLES[p.badge]?.bg ?? "#1a1208", color: BADGE_STYLES[p.badge]?.color ?? "#c9a84c" }}
                          >
                            {p.badge}
                          </div>
                        )}

                        {discount && (
                          <div
                            className="absolute top-2 right-9 sm:top-3 sm:right-12 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-[8px] sm:text-[9px] font-bold"
                            style={{ background: "#e53e3e", color: "#fff" }}
                          >
                            -{discount}%
                          </div>
                        )}

                        <button
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(p.id); }}
                          className="absolute top-2 right-2 sm:top-3 sm:right-3 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                          style={{ background: "rgba(255,255,255,0.9)", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
                        >
                          <Heart
                            className="w-3 h-3 sm:w-3.5 sm:h-3.5 transition-all"
                            style={{ color: wishlist.has(p.id) ? "#e53e3e" : "#999", fill: wishlist.has(p.id) ? "#e53e3e" : "none" }}
                          />
                        </button>

                        <div className="absolute inset-x-2 bottom-2 sm:inset-x-3 sm:bottom-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
                          <button
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAddToCart(p); }}
                            className="w-full py-2 sm:py-2.5 rounded-full text-[9px] sm:text-[10px] uppercase tracking-wider font-semibold flex items-center justify-center gap-1.5 transition-colors"
                            style={{ background: "#1a1208", color: "#fdf9f0" }}
                          >
                            <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Add to Cart
                          </button>
                        </div>
                      </div>
                    </Link>

                    <div className="mt-2.5 sm:mt-3 px-0.5">
                      <div className="text-[8px] sm:text-[9px] uppercase tracking-[0.18em] font-semibold mb-0.5 sm:mb-1" style={{ color: "#c9a84c" }}>
                        Handmade · Customizable
                      </div>
                      <Link to={`/product/${p.slug}`}>
                        <h3 className="text-[12px] sm:text-[13px] md:text-sm font-medium leading-tight mb-1 sm:mb-1.5 hover:text-[#c9a84c] transition-colors" style={{ color: "#1a1208", wordBreak: "break-word" }}>
                          {p.name}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-0.5 mb-1 sm:mb-1.5">
                        {[...Array(5)].map((_, j) => (
                          <Star key={j} className="w-2.5 h-2.5 sm:w-3 sm:h-3" style={{ fill: j < Math.floor(rating) ? "#c9a84c" : "#e5dfd3", color: j < Math.floor(rating) ? "#c9a84c" : "#e5dfd3" }} />
                        ))}
                        <span className="text-[9px] sm:text-[10px] ml-1" style={{ color: "rgba(26,18,8,0.45)" }}>({count})</span>
                      </div>
                      <div className="flex items-baseline gap-1.5 sm:gap-2">
                        <span className="font-semibold text-[13px] sm:text-sm" style={{ color: "#1a1208" }}>{formatINR(p.price)}</span>
                        {p.original_price && p.original_price > p.price && (
                          <span className="text-[10px] sm:text-xs line-through" style={{ color: "rgba(26,18,8,0.4)" }}>{formatINR(p.original_price)}</span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="max-w-[1280px] mx-auto px-6 lg:px-8 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-3xl px-6 py-14 md:px-12 md:py-16 text-center"
          style={{ background: "linear-gradient(135deg, #1a1208 0%, #2d2015 50%, #1a1208 100%)" }}
        >
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "linear-gradient(120deg, transparent 30%, rgba(201,168,76,0.1) 50%, transparent 70%)", backgroundSize: "200% 100%" }}
            animate={{ backgroundPosition: ["200% 0%", "-200% 0%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
          <div className="relative z-10">
            <h3 className="font-display text-xl md:text-2xl mb-2" style={{ color: "#fdf9f0", fontWeight: 400 }}>
              Can't find what you're looking for?
            </h3>
            <p className="text-sm mb-6" style={{ color: "rgba(253,249,240,0.6)" }}>
              We craft custom pieces too!
            </p>
            <Link
              to="/custom-order"
              className="group relative inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-[11px] tracking-[0.12em] uppercase font-semibold overflow-hidden transition-all duration-300 hover:scale-105"
              style={{ background: "#c9a84c", color: "#1a1208", boxShadow: "0 4px 20px -4px rgba(201,168,76,0.5)" }}
            >
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)" }} />
              <span className="relative z-10 flex items-center gap-2">
                Request Custom Order <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Shop;
