import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import {
  Star, Heart, Plus, X, ArrowRight, ShoppingBag, Sparkles, ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
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
  short_description: string | null;
  category_slug: string | null;
  featured: boolean;
  sort_order: number;
  description: string | null;
};

type Category = { slug: string; name: string };

const BADGE_STYLES: Record<string, { bg: string; color: string }> = {
  Bestseller: { bg: "#1a1208", color: "#c9a84c" },
  New: { bg: "#c9a84c", color: "#1a1208" },
  Popular: { bg: "#f5e6f0", color: "#1a1208" },
  Premium: { bg: "#2d2015", color: "#c9a84c" },
};


const Shop = () => {
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get("category") || "all";
  const searchFromUrl = searchParams.get("q") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(categoryFromUrl);
  const [sortBy, setSortBy] = useState("featured");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { add } = useCart();
  const { has: wishlistHas, toggle: wishlistToggle } = useWishlist();

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

  useEffect(() => {
    const cat = searchParams.get("category") || "all";
    if (cat !== activeCategory) setActiveCategory(cat);
  }, [searchParams]);

  const allCategories = [{ slug: "all", name: "All" }, ...categories];

  const filtered = (() => {
    let list = activeCategory === "all"
      ? [...products]
      : products.filter((p) => p.category_slug === activeCategory);
    if (searchFromUrl) {
      const q = searchFromUrl.toLowerCase();
      list = list.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        (p.category_slug || "").includes(q) ||
        (p.short_description || "").toLowerCase().includes(q)
      );
    }
    switch (sortBy) {
      case "price-asc": return list.sort((a, b) => a.price - b.price);
      case "price-desc": return list.sort((a, b) => b.price - a.price);
      case "newest": return list.sort((a, b) => b.sort_order - a.sort_order);
      case "bestselling": return list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
      default: return list;
    }
  })();

  const handleAddToCart = (p: Product) => {
    add({ id: p.id, slug: p.slug, name: p.name, price: Number(p.price), image_url: p.image_url });
    toast.success("Added to cart!", { duration: 2500 });
  };

  const getDiscount = (p: Product) => {
    if (!p.original_price || p.original_price <= p.price) return 0;
    return Math.round(((p.original_price - p.price) / p.original_price) * 100);
  };


  return (
    <div style={{ background: "#fdf9f0" }}>
      {/* Header */}
      <section className="pt-28 pb-10 md:pb-14">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <motion.nav initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
            className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.16em] mb-8" style={{ color: "rgba(26,18,8,0.45)" }}>
            <Link to="/" className="hover:text-[#c9a84c] transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span style={{ color: "#1a1208" }}>Shop</span>
          </motion.nav>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="text-center">
            <h1 className="font-display mb-3" style={{ fontWeight: 400, fontSize: "clamp(2.2rem, 5vw, 3.2rem)", lineHeight: 1.1, letterSpacing: "-0.02em", color: "#1a1208" }}>
              Our <em className="font-serif italic" style={{ color: "#c9a84c", fontWeight: 400 }}>Collection</em>
            </h1>
            <p style={{ fontSize: "15px", color: "rgba(26,18,8,0.6)", maxWidth: 420, margin: "0 auto" }}>
              Handcrafted with love, personalized just for you
            </p>
          </motion.div>
        </div>
      </section>

      {/* Sticky Filter Bar */}
      <div className="sticky top-0 z-40" style={{ background: "rgba(253,249,240,0.97)", backdropFilter: "blur(20px) saturate(180%)", boxShadow: "0 1px 0 rgba(26,18,8,0.06)" }}>
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-3">
          {searchFromUrl && (
            <div className="flex items-center gap-2 mb-2 px-3 py-2 rounded-lg bg-gold/8 border border-gold/15">
              <span className="text-xs text-gold/80">Searching: <strong>"{searchFromUrl}"</strong></span>
              <Link to="/shop" className="ml-auto flex items-center gap-1 text-[10px] uppercase tracking-wider font-semibold text-foreground/60 hover:text-foreground transition-colors">
                <X className="w-3 h-3" /> Clear
              </Link>
            </div>
          )}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar -mx-1 px-1">
            {allCategories.map((c) => {
              const isActive = activeCategory === c.slug;
              return (
                <button key={c.slug} onClick={() => setActiveCategory(c.slug)} className="shrink-0 transition-all duration-300"
                  style={{ padding: "6px 16px", borderRadius: 9999, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 600,
                    background: isActive ? "#1a1208" : "transparent", color: isActive ? "#fdf9f0" : "rgba(26,18,8,0.5)",
                    border: `1px solid ${isActive ? "#1a1208" : "rgba(26,18,8,0.1)"}`, whiteSpace: "nowrap" }}>
                  {c.name}
                </button>
              );
            })}
          </div>
          <div className="flex items-center justify-between mt-2.5">
            <span className="text-[10px] uppercase tracking-[0.14em]" style={{ color: "rgba(26,18,8,0.4)" }}>
              {filtered.length} {filtered.length === 1 ? "product" : "products"}
            </span>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
              className="text-[10px] uppercase tracking-[0.1em] font-medium outline-none cursor-pointer"
              style={{ padding: "6px 12px", borderRadius: 9999, border: "1px solid rgba(26,18,8,0.08)", background: "rgba(255,255,255,0.8)", color: "#1a1208" }}>
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="newest">Newest</option>
              <option value="bestselling">Best Selling</option>
            </select>
          </div>
        </div>
      </div>


      {/* Product Grid */}
      <section className="max-w-[1280px] mx-auto px-6 lg:px-8 py-12 md:py-16">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="rounded-xl sm:rounded-2xl bg-[#e8e2d8] aspect-square" />
                <div className="mt-3 h-3 bg-[#e8e2d8] rounded w-3/4" />
                <div className="mt-2 h-3 bg-[#e8e2d8] rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {filtered.length === 0 ? (
              <motion.div key="empty" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-center py-20">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: "rgba(201,168,76,0.1)" }}>
                  <ShoppingBag className="w-7 h-7" style={{ color: "#c9a84c" }} />
                </div>
                <h3 className="font-display text-xl mb-2" style={{ color: "#1a1208" }}>No products found</h3>
                <p className="text-sm mb-5" style={{ color: "rgba(26,18,8,0.55)" }}>Try a different category</p>
                <button onClick={() => setActiveCategory("all")} className="px-6 py-2.5 rounded-full text-[11px] uppercase tracking-wider font-semibold" style={{ background: "#1a1208", color: "#fdf9f0" }}>
                  Browse All
                </button>
              </motion.div>
            ) : (
              <motion.div key={`${activeCategory}-${sortBy}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-5">
                {filtered.map((p, i) => {
                  const discount = getDiscount(p);
                  const wished = wishlistHas(p.id);
                  return (
                    <motion.div key={p.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                      className="group cursor-pointer rounded-2xl sm:rounded-[20px] bg-white/60 backdrop-blur-sm border border-transparent hover:border-[#c9a84c]/20 p-1.5 sm:p-2"
                      onClick={() => setSelectedProduct(p)}
                      style={{ transition: "transform 0.35s cubic-bezier(0.22,1,0.36,1), box-shadow 0.35s ease, border-color 0.3s ease" }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 20px 50px -12px rgba(26,18,8,0.12)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
                      <div className="relative overflow-hidden rounded-xl sm:rounded-2xl" style={{ aspectRatio: "1/1" }}>
                        <img src={resolveImage(p.image_url)} alt={p.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.07]" />
                        {p.badge && (
                          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[8px] sm:text-[9px] uppercase tracking-wider font-bold"
                            style={{ background: BADGE_STYLES[p.badge]?.bg || "#1a1208", color: BADGE_STYLES[p.badge]?.color || "#c9a84c" }}>
                            {p.badge}
                          </div>
                        )}
                        {discount > 0 && (
                          <div className="absolute top-2 right-9 sm:top-3 sm:right-12 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-[8px] sm:text-[9px] font-bold" style={{ background: "#e53e3e", color: "#fff" }}>
                            -{discount}%
                          </div>
                        )}
                        <button onClick={(e) => { e.stopPropagation(); wishlistToggle(p.id); }}
                          className="absolute top-2 right-2 sm:top-3 sm:right-3 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                          style={{ background: "rgba(255,255,255,0.9)", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                          <Heart className="w-3 h-3 sm:w-3.5 sm:h-3.5" style={{ color: wished ? "#e53e3e" : "#999", fill: wished ? "#e53e3e" : "none" }} />
                        </button>
                        <div className="absolute inset-x-2 bottom-2 sm:inset-x-3 sm:bottom-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
                          <button onClick={(e) => { e.stopPropagation(); handleAddToCart(p); }}
                            className="w-full py-2 sm:py-2.5 rounded-full text-[9px] sm:text-[10px] uppercase tracking-wider font-semibold flex items-center justify-center gap-1.5"
                            style={{ background: "#1a1208", color: "#fdf9f0" }}>
                            <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Add to Cart
                          </button>
                        </div>
                      </div>
                      <div className="mt-2.5 sm:mt-3 px-0.5">
                        <div className="text-[8px] sm:text-[9px] uppercase tracking-[0.18em] font-semibold mb-0.5 sm:mb-1" style={{ color: "#c9a84c" }}>
                          {categories.find((c) => c.slug === p.category_slug)?.name || "Handmade"} · Customizable
                        </div>
                        <h3 className="text-[12px] sm:text-[13px] md:text-sm font-medium leading-tight mb-1 sm:mb-1.5" style={{ color: "#1a1208" }}>{p.name}</h3>
                        <div className="flex items-center gap-0.5 mb-1 sm:mb-1.5">
                          {[...Array(5)].map((_, j) => <Star key={j} className="w-2.5 h-2.5 sm:w-3 sm:h-3" style={{ fill: "#c9a84c", color: "#c9a84c" }} />)}
                          <span className="ml-1 text-[9px] text-muted-foreground">(5.0)</span>
                        </div>
                        <div className="flex items-baseline gap-1.5 sm:gap-2">
                          <span className="font-semibold text-[13px] sm:text-sm" style={{ color: "#1a1208" }}>{formatINR(p.price)}</span>
                          {p.original_price && <span className="text-[10px] sm:text-xs line-through" style={{ color: "rgba(26,18,8,0.4)" }}>{formatINR(p.original_price)}</span>}
                          {discount > 0 && <span className="text-[9px] font-bold text-emerald-600">{discount}% off</span>}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </section>


      {/* Bottom CTA */}
      <section className="max-w-[1280px] mx-auto px-6 lg:px-8 pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-3xl px-6 py-14 md:px-12 md:py-16 text-center"
          style={{ background: "linear-gradient(135deg, #1a1208 0%, #2d2015 50%, #1a1208 100%)" }}>
          <div className="relative z-10">
            <h3 className="font-display text-xl md:text-2xl mb-2" style={{ color: "#fdf9f0", fontWeight: 400 }}>Can't find what you're looking for?</h3>
            <p className="text-sm mb-6" style={{ color: "rgba(253,249,240,0.6)" }}>We craft custom pieces too!</p>
            <Link to="/custom-order" className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-[11px] tracking-[0.12em] uppercase font-semibold hover:scale-105 transition-transform"
              style={{ background: "#c9a84c", color: "#1a1208", boxShadow: "0 4px 20px -4px rgba(201,168,76,0.5)" }}>
              Request Custom Order <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ background: "rgba(26,18,8,0.6)", backdropFilter: "blur(8px)" }}
            onClick={() => setSelectedProduct(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-[880px] max-h-[90vh] overflow-y-auto rounded-3xl grid md:grid-cols-2"
              style={{ background: "#fdf9f0", boxShadow: "0 40px 100px -20px rgba(26,18,8,0.4)" }}
              onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full flex items-center justify-center hover:bg-[rgba(26,18,8,0.08)]" style={{ color: "#1a1208" }}>
                <X className="w-5 h-5" />
              </button>
              <div className="relative overflow-hidden rounded-l-3xl md:rounded-r-none rounded-t-3xl md:rounded-t-none" style={{ aspectRatio: "1/1", minHeight: 300 }}>
                <img src={resolveImage(selectedProduct.image_url)} alt={selectedProduct.name} className="w-full h-full object-cover" />
                {selectedProduct.badge && (
                  <div className="absolute top-4 left-4 px-2.5 py-1 rounded-full text-[9px] uppercase tracking-wider font-bold"
                    style={{ background: BADGE_STYLES[selectedProduct.badge]?.bg || "#1a1208", color: BADGE_STYLES[selectedProduct.badge]?.color || "#c9a84c" }}>
                    {selectedProduct.badge}
                  </div>
                )}
              </div>
              <div className="p-6 md:p-8 flex flex-col">
                <div className="text-[9px] uppercase tracking-[0.18em] font-semibold mb-2" style={{ color: "#c9a84c" }}>Handmade · Customizable</div>
                <h2 className="font-display text-xl md:text-2xl mb-3" style={{ color: "#1a1208", fontWeight: 500, lineHeight: 1.2 }}>{selectedProduct.name}</h2>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-3.5 h-3.5" style={{ fill: "#c9a84c", color: "#c9a84c" }} />)}
                </div>
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="font-display text-2xl" style={{ color: "#1a1208" }}>{formatINR(selectedProduct.price)}</span>
                  {selectedProduct.original_price && (
                    <>
                      <span className="text-sm line-through" style={{ color: "rgba(26,18,8,0.4)" }}>{formatINR(selectedProduct.original_price)}</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: "rgba(229,62,62,0.1)", color: "#e53e3e" }}>
                        Save {formatINR(selectedProduct.original_price - selectedProduct.price)}
                      </span>
                    </>
                  )}
                </div>
                <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(26,18,8,0.65)" }}>{selectedProduct.description || selectedProduct.short_description}</p>
                <div className="rounded-xl p-3.5 mb-5" style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.15)" }}>
                  <p className="text-xs" style={{ color: "rgba(26,18,8,0.7)" }}>✏️ Share details after ordering and we'll craft it just for you</p>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-6">
                  {[{ emoji: "🤝", label: "Handmade" }, { emoji: "📦", label: "Premium Pack" }, { emoji: "🚚", label: "Pan India" }].map((h) => (
                    <div key={h.label} className="text-center p-2 rounded-xl" style={{ background: "rgba(26,18,8,0.03)" }}>
                      <div className="text-lg mb-0.5">{h.emoji}</div>
                      <div className="text-[9px] uppercase tracking-wider" style={{ color: "rgba(26,18,8,0.55)" }}>{h.label}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-auto space-y-2.5">
                  <button onClick={() => { handleAddToCart(selectedProduct); setSelectedProduct(null); }}
                    className="w-full py-3.5 rounded-full text-[11px] uppercase tracking-[0.12em] font-semibold flex items-center justify-center gap-2 hover:opacity-90"
                    style={{ background: "#1a1208", color: "#fdf9f0" }}>
                    <ShoppingBag className="w-4 h-4" /> Add to Cart
                  </button>
                  <Link to={`/product/${selectedProduct.slug}`} onClick={() => setSelectedProduct(null)}
                    className="w-full py-3 rounded-full text-[11px] uppercase tracking-[0.12em] font-semibold flex items-center justify-center gap-2 hover:bg-[rgba(26,18,8,0.04)]"
                    style={{ border: "1.5px solid rgba(26,18,8,0.15)", color: "#1a1208" }}>
                    <Sparkles className="w-4 h-4" style={{ color: "#c9a84c" }} /> View Full Details
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Shop;
