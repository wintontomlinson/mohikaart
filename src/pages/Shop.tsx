import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Star, Heart, Plus, X, ArrowRight, ShoppingBag,
  Package, Truck, Sparkles, ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/lib/cart";

const catKeychain = "/placeholder.svg";
const catFrame = "/placeholder.svg";
const catWedding = "/placeholder.svg";
import catBookmark from "@/assets/cat-bookmark.jpg";
const catTray = "/placeholder.svg";
const catHamper = "/placeholder.svg";
const catCouple = "/placeholder.svg";
import heroTray from "@/assets/hero-resin-tray.jpg";
import galleryFlat from "@/assets/gallery-flatlay.jpg";
import galleryCustomer from "@/assets/gallery-customer.jpg";
import galleryPacking from "@/assets/gallery-packing.jpg";
import galleryPouring from "@/assets/gallery-pouring.jpg";

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   PRODUCT DATA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  mrp: number;
  badge: string;
  discount: number;
  image: string;
  rating: number;
  reviews: number;
  description: string;
};


const PRODUCTS: Product[] = [
  { id: 1, name: "Personalized Name Keychain", category: "keychain", price: 499, mrp: 699, badge: "BESTSELLER", discount: 29, image: catKeychain, rating: 4.9, reviews: 67, description: "A stunning resin keychain with your name or loved one's name embedded in gold foil. Perfect everyday carry or thoughtful gift." },
  { id: 2, name: "Couple Photo Frame", category: "frame", price: 1299, mrp: 1799, badge: "POPULAR", discount: 28, image: catFrame, rating: 4.8, reviews: 45, description: "Preserve your favorite couple moment in a handcrafted resin frame with dried flowers and gold accents." },
  { id: 3, name: "Bridal Bouquet Preservation", category: "wedding", price: 2499, mrp: 3499, badge: "PREMIUM", discount: 29, image: catWedding, rating: 5.0, reviews: 34, description: "Your wedding bouquet preserved forever in crystal-clear resin. A timeless heirloom piece." },
  { id: 4, name: "Floral Resin Bookmark", category: "bookmark", price: 349, mrp: 499, badge: "NEW", discount: 30, image: catBookmark, rating: 4.7, reviews: 28, description: "Delicate pressed flowers sealed in resin. A beautiful companion for your reading time." },
  { id: 5, name: "Ocean Resin Coaster Set (Set of 4)", category: "coaster", price: 899, mrp: 1199, badge: "POPULAR", discount: 25, image: catCouple, rating: 4.6, reviews: 52, description: "Ocean-inspired resin coasters with swirling blues and golds. Functional art for your table." },
  { id: 6, name: "Luxury Gift Hamper", category: "hamper", price: 2999, mrp: 3749, badge: "PREMIUM", discount: 20, image: catHamper, rating: 4.9, reviews: 19, description: "A curated collection of handcrafted resin pieces beautifully boxed for special occasions." },
  { id: 7, name: "Floral Heart Resin Tray", category: "tray", price: 1199, mrp: 1549, badge: "BESTSELLER", discount: 22, image: catTray, rating: 4.8, reviews: 73, description: "Heart-shaped resin tray filled with preserved flowers. Perfect for jewelry or as a decorative piece." },
  { id: 8, name: "Custom Name Resin Tray", category: "tray", price: 1499, mrp: 1799, badge: "POPULAR", discount: 18, image: heroTray, rating: 4.7, reviews: 41, description: "A personalized resin tray with your name in elegant calligraphy. Ideal gift or home accent." },
  { id: 9, name: "Wedding Memory Frame", category: "wedding", price: 1899, mrp: 2499, badge: "BESTSELLER", discount: 25, image: galleryCustomer, rating: 4.9, reviews: 56, description: "Capture your wedding day in a custom resin frame with flowers from your actual celebration." },
  { id: 10, name: "Mini Keychains Bundle (Set of 3)", category: "keychain", price: 999, mrp: 1499, badge: "NEW", discount: 35, image: galleryFlat, rating: 4.5, reviews: 38, description: "Three mini personalized keychains. Perfect for bridesmaids, friends, or family gifts." },
  { id: 11, name: "Dried Flower Bookmark Set (Set of 3)", category: "bookmark", price: 699, mrp: 949, badge: "POPULAR", discount: 28, image: galleryPouring, rating: 4.6, reviews: 31, description: "A set of three unique bookmarks with different pressed flower arrangements." },
  { id: 12, name: "Corporate Gift Box", category: "hamper", price: 3499, mrp: 4099, badge: "PREMIUM", discount: 15, image: galleryPacking, rating: 4.8, reviews: 22, description: "Elegant corporate gift box with branded resin pieces. Perfect for teams and clients." },
];

const CATEGORIES = [
  { slug: "all", label: "All" },
  { slug: "keychain", label: "Name Keychains" },
  { slug: "frame", label: "Photo Frames" },
  { slug: "wedding", label: "Wedding Keepsakes" },
  { slug: "tray", label: "Resin Trays" },
  { slug: "coaster", label: "Coaster Sets" },
  { slug: "bookmark", label: "Bookmarks" },
  { slug: "hamper", label: "Gift Hampers" },
];

const BADGE_STYLES: Record<string, { bg: string; color: string }> = {
  BESTSELLER: { bg: "#1a1208", color: "#c9a84c" },
  NEW: { bg: "#c9a84c", color: "#1a1208" },
  POPULAR: { bg: "#f5e6f0", color: "#1a1208" },
  PREMIUM: { bg: "#2d2015", color: "#c9a84c" },
};


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   FORMAT PRICE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function formatINR(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   MAIN COMPONENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const Shop = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [wishlist, setWishlist] = useState<Set<number>>(new Set());
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { add } = useCart();

  // Filter & sort
  const filtered = (() => {
    let list = activeCategory === "all" ? [...PRODUCTS] : PRODUCTS.filter((p) => p.category === activeCategory);
    switch (sortBy) {
      case "price-asc": return list.sort((a, b) => a.price - b.price);
      case "price-desc": return list.sort((a, b) => b.price - a.price);
      case "newest": return list.sort((a, b) => b.id - a.id);
      case "bestselling": return list.sort((a, b) => b.reviews - a.reviews);
      default: return list;
    }
  })();

  const toggleWishlist = (id: number) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleAddToCart = (p: Product) => {
    add({ id: String(p.id), slug: p.name.toLowerCase().replace(/\s+/g, "-"), name: p.name, price: p.price, image_url: p.image });
    toast.success("🛒 Added to cart!", { duration: 2500 });
  };

  return (
    <div style={{ background: "#fdf9f0" }}>


      {/* ── HEADER ── */}
      <section className="pt-28 pb-10 md:pb-14">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          {/* Breadcrumb */}
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
          {/* Category pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
            {CATEGORIES.map((c) => {
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
                  {c.label}
                </button>
              );
            })}
          </div>

          {/* Sort + count */}
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
              {filtered.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                  className="group cursor-pointer"
                  onClick={() => setSelectedProduct(p)}
                  style={{ transition: "transform 0.35s cubic-bezier(0.22,1,0.36,1), box-shadow 0.35s ease" }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-8px)"; e.currentTarget.style.boxShadow = "0 20px 40px -12px rgba(26,18,8,0.15)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                >
                  {/* Image container */}
                  <div className="relative overflow-hidden rounded-xl sm:rounded-2xl" style={{ aspectRatio: "1/1" }}>
                    <img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.07]"
                    />

                    {/* Badge */}
                    <div
                      className="absolute top-2 left-2 sm:top-3 sm:left-3 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[8px] sm:text-[9px] uppercase tracking-wider font-bold"
                      style={{ background: BADGE_STYLES[p.badge]?.bg, color: BADGE_STYLES[p.badge]?.color }}
                    >
                      {p.badge}
                    </div>

                    {/* Discount */}
                    <div
                      className="absolute top-2 right-9 sm:top-3 sm:right-12 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-[8px] sm:text-[9px] font-bold"
                      style={{ background: "#e53e3e", color: "#fff" }}
                    >
                      -{p.discount}%
                    </div>

                    {/* Wishlist */}
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleWishlist(p.id); }}
                      className="absolute top-2 right-2 sm:top-3 sm:right-3 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                      style={{ background: "rgba(255,255,255,0.9)", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
                    >
                      <Heart
                        className="w-3 h-3 sm:w-3.5 sm:h-3.5 transition-all"
                        style={{ color: wishlist.has(p.id) ? "#e53e3e" : "#999", fill: wishlist.has(p.id) ? "#e53e3e" : "none" }}
                      />
                    </button>

                    {/* Add to Cart bar (hover) */}
                    <div
                      className="absolute inset-x-2 bottom-2 sm:inset-x-3 sm:bottom-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400"
                    >
                      <button
                        onClick={(e) => { e.stopPropagation(); handleAddToCart(p); }}
                        className="w-full py-2 sm:py-2.5 rounded-full text-[9px] sm:text-[10px] uppercase tracking-wider font-semibold flex items-center justify-center gap-1.5 transition-colors"
                        style={{ background: "#1a1208", color: "#fdf9f0" }}
                      >
                        <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Add to Cart
                      </button>
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="mt-2.5 sm:mt-3 px-0.5">
                    <div className="text-[8px] sm:text-[9px] uppercase tracking-[0.18em] font-semibold mb-0.5 sm:mb-1" style={{ color: "#c9a84c" }}>
                      Handmade · Customizable
                    </div>
                    <h3 className="text-[12px] sm:text-[13px] md:text-sm font-medium leading-tight mb-1 sm:mb-1.5" style={{ color: "#1a1208", wordBreak: "break-word" }}>
                      {p.name}
                    </h3>
                    <div className="flex items-center gap-0.5 mb-1 sm:mb-1.5">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="w-2.5 h-2.5 sm:w-3 sm:h-3" style={{ fill: j < Math.floor(p.rating) ? "#c9a84c" : "#e5dfd3", color: j < Math.floor(p.rating) ? "#c9a84c" : "#e5dfd3" }} />
                      ))}
                      <span className="text-[9px] sm:text-[10px] ml-1" style={{ color: "rgba(26,18,8,0.45)" }}>({p.reviews})</span>
                    </div>
                    <div className="flex items-baseline gap-1.5 sm:gap-2">
                      <span className="font-semibold text-[13px] sm:text-sm" style={{ color: "#1a1208" }}>{formatINR(p.price)}</span>
                      <span className="text-[10px] sm:text-xs line-through" style={{ color: "rgba(26,18,8,0.4)" }}>{formatINR(p.mrp)}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
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
          {/* Shimmer */}
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


      {/* ── PRODUCT DETAIL MODAL ── */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ background: "rgba(26,18,8,0.6)", backdropFilter: "blur(8px)" }}
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-[880px] max-h-[90vh] overflow-y-auto rounded-3xl grid md:grid-cols-2"
              style={{ background: "#fdf9f0", boxShadow: "0 40px 100px -20px rgba(26,18,8,0.4)" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close */}
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-[rgba(26,18,8,0.08)]"
                style={{ color: "#1a1208" }}
              >
                <X className="w-5 h-5" />
              </button>

              {/* Left: Image */}
              <div className="relative overflow-hidden rounded-l-3xl md:rounded-l-3xl md:rounded-r-none rounded-t-3xl md:rounded-t-none" style={{ aspectRatio: "1/1", minHeight: 300 }}>
                <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-2.5 py-1 rounded-full text-[9px] uppercase tracking-wider font-bold" style={{ background: BADGE_STYLES[selectedProduct.badge]?.bg, color: BADGE_STYLES[selectedProduct.badge]?.color }}>
                    {selectedProduct.badge}
                  </span>
                  <span className="px-2 py-1 rounded-full text-[9px] font-bold" style={{ background: "#e53e3e", color: "#fff" }}>
                    -{selectedProduct.discount}%
                  </span>
                </div>
              </div>

              {/* Right: Details */}
              <div className="p-6 md:p-8 flex flex-col">
                <div className="text-[9px] uppercase tracking-[0.18em] font-semibold mb-2" style={{ color: "#c9a84c" }}>
                  Handmade · Customizable
                </div>
                <h2 className="font-display text-xl md:text-2xl mb-3" style={{ color: "#1a1208", fontWeight: 500, lineHeight: 1.2 }}>
                  {selectedProduct.name}
                </h2>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5" style={{ fill: j < Math.floor(selectedProduct.rating) ? "#c9a84c" : "#e5dfd3", color: j < Math.floor(selectedProduct.rating) ? "#c9a84c" : "#e5dfd3" }} />
                  ))}
                  <span className="text-xs ml-1.5" style={{ color: "rgba(26,18,8,0.5)" }}>({selectedProduct.reviews} reviews)</span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="font-display text-2xl" style={{ color: "#1a1208" }}>{formatINR(selectedProduct.price)}</span>
                  <span className="text-sm line-through" style={{ color: "rgba(26,18,8,0.4)" }}>{formatINR(selectedProduct.mrp)}</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: "rgba(229,62,62,0.1)", color: "#e53e3e" }}>
                    Save {formatINR(selectedProduct.mrp - selectedProduct.price)}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(26,18,8,0.65)" }}>
                  {selectedProduct.description}
                </p>

                {/* Customizable note */}
                <div className="rounded-xl p-3.5 mb-5" style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.15)" }}>
                  <p className="text-xs" style={{ color: "rgba(26,18,8,0.7)" }}>
                    ✏️ Share details after ordering and we'll craft it just for you
                  </p>
                </div>

                {/* Highlights */}
                <div className="grid grid-cols-3 gap-2 mb-6">
                  {[
                    { icon: "🤝", label: "Handmade" },
                    { icon: "📦", label: "Premium Packaging" },
                    { icon: "🚚", label: "Pan India Delivery" },
                  ].map((h) => (
                    <div key={h.label} className="text-center p-2 rounded-xl" style={{ background: "rgba(26,18,8,0.03)" }}>
                      <div className="text-lg mb-0.5">{h.icon}</div>
                      <div className="text-[9px] uppercase tracking-wider" style={{ color: "rgba(26,18,8,0.55)" }}>{h.label}</div>
                    </div>
                  ))}
                </div>

                {/* Buttons */}
                <div className="mt-auto space-y-2.5">
                  <button
                    onClick={() => { handleAddToCart(selectedProduct); setSelectedProduct(null); }}
                    className="w-full py-3.5 rounded-full text-[11px] uppercase tracking-[0.12em] font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90"
                    style={{ background: "#1a1208", color: "#fdf9f0" }}
                  >
                    <ShoppingBag className="w-4 h-4" /> Add to Cart
                  </button>
                  <Link
                    to="/custom-order"
                    onClick={() => setSelectedProduct(null)}
                    className="w-full py-3 rounded-full text-[11px] uppercase tracking-[0.12em] font-semibold flex items-center justify-center gap-2 transition-all hover:bg-[rgba(26,18,8,0.04)]"
                    style={{ border: "1.5px solid rgba(26,18,8,0.15)", color: "#1a1208" }}
                  >
                    <Sparkles className="w-4 h-4" style={{ color: "#c9a84c" }} /> Request Custom Version
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
