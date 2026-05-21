import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Heart, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "@/lib/cart";

import catKeychain from "@/assets/cat-keychain.jpg";
import catFrame from "@/assets/cat-frame.jpg";
import catWedding from "@/assets/cat-wedding.jpg";
import catBookmark from "@/assets/cat-bookmark.jpg";
import catTray from "@/assets/cat-tray.jpg";
import catHamper from "@/assets/cat-hamper.jpg";
import catCouple from "@/assets/cat-couple.jpg";
import heroTray from "@/assets/hero-resin-tray.jpg";

const PRODUCTS = [
  { id: 1, name: "Personalized Name Keychain", price: 499, mrp: 699, badge: "BESTSELLER", discount: 29, image: catKeychain, rating: 4.9, reviews: 67 },
  { id: 2, name: "Couple Photo Frame", price: 1299, mrp: 1799, badge: "POPULAR", discount: 28, image: catFrame, rating: 4.8, reviews: 45 },
  { id: 3, name: "Bridal Bouquet Preservation", price: 2499, mrp: 3499, badge: "PREMIUM", discount: 29, image: catWedding, rating: 5.0, reviews: 34 },
  { id: 7, name: "Floral Heart Resin Tray", price: 1199, mrp: 1549, badge: "BESTSELLER", discount: 22, image: catTray, rating: 4.8, reviews: 73 },
  { id: 4, name: "Floral Resin Bookmark", price: 349, mrp: 499, badge: "NEW", discount: 30, image: catBookmark, rating: 4.7, reviews: 28 },
  { id: 6, name: "Luxury Gift Hamper", price: 2999, mrp: 3749, badge: "PREMIUM", discount: 20, image: catHamper, rating: 4.9, reviews: 19 },
  { id: 5, name: "Ocean Resin Coaster Set", price: 899, mrp: 1199, badge: "POPULAR", discount: 25, image: catCouple, rating: 4.6, reviews: 52 },
  { id: 8, name: "Custom Name Resin Tray", price: 1499, mrp: 1799, badge: "POPULAR", discount: 18, image: heroTray, rating: 4.7, reviews: 41 },
];

const BADGE_STYLES: Record<string, { bg: string; color: string }> = {
  BESTSELLER: { bg: "#1a1208", color: "#c9a84c" },
  NEW: { bg: "#c9a84c", color: "#1a1208" },
  POPULAR: { bg: "#f5e6f0", color: "#1a1208" },
  PREMIUM: { bg: "#2d2015", color: "#c9a84c" },
};

function formatINR(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

const Showcase = () => {
  const { add } = useCart();
  const [wishlist, setWishlist] = useState<Set<number>>(new Set());

  const toggleWishlist = (id: number) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleAddToCart = (p: typeof PRODUCTS[0]) => {
    add({ id: String(p.id), slug: p.name.toLowerCase().replace(/\s+/g, "-"), name: p.name, price: p.price, image_url: p.image });
    toast.success("🛒 Added to cart!", { duration: 2500 });
  };

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

        {/* Product grid - same style as Shop page */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-5">
          {PRODUCTS.map((p, i) => (
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
              {/* Image */}
              <div className="relative overflow-hidden rounded-2xl" style={{ aspectRatio: "1/1" }}>
                <img src={p.image} alt={p.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.07]" />

                {/* Badge */}
                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] uppercase tracking-wider font-bold" style={{ background: BADGE_STYLES[p.badge]?.bg, color: BADGE_STYLES[p.badge]?.color }}>
                  {p.badge}
                </div>

                {/* Discount */}
                <div className="absolute top-2.5 right-10 sm:right-11 px-1.5 py-0.5 rounded-full text-[8px] sm:text-[9px] font-bold" style={{ background: "#e53e3e", color: "#fff" }}>
                  -{p.discount}%
                </div>

                {/* Wishlist */}
                <button
                  onClick={() => toggleWishlist(p.id)}
                  className="absolute top-2.5 right-2.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                  style={{ background: "rgba(255,255,255,0.9)", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
                >
                  <Heart className="w-3 h-3 sm:w-3.5 sm:h-3.5 transition-all" style={{ color: wishlist.has(p.id) ? "#e53e3e" : "#999", fill: wishlist.has(p.id) ? "#e53e3e" : "none" }} />
                </button>

                {/* Add to Cart */}
                <div className="absolute inset-x-2.5 bottom-2.5 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
                  <button
                    onClick={() => handleAddToCart(p)}
                    className="w-full py-2 sm:py-2.5 rounded-full text-[9px] sm:text-[10px] uppercase tracking-wider font-semibold flex items-center justify-center gap-1.5"
                    style={{ background: "#1a1208", color: "#fdf9f0" }}
                  >
                    <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Add to Cart
                  </button>
                </div>
              </div>

              {/* Card body */}
              <div className="mt-2.5 px-0.5">
                <div className="text-[8px] sm:text-[9px] uppercase tracking-[0.18em] font-semibold mb-0.5" style={{ color: "#c9a84c" }}>
                  Handmade · Customizable
                </div>
                <h3 className="text-[12px] sm:text-[13px] font-medium leading-tight mb-1" style={{ color: "#1a1208", wordBreak: "break-word" }}>
                  {p.name}
                </h3>
                <div className="flex items-center gap-0.5 mb-1">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-2.5 h-2.5 sm:w-3 sm:h-3" style={{ fill: j < Math.floor(p.rating) ? "#c9a84c" : "#e5dfd3", color: j < Math.floor(p.rating) ? "#c9a84c" : "#e5dfd3" }} />
                  ))}
                  <span className="text-[9px] sm:text-[10px] ml-1" style={{ color: "rgba(26,18,8,0.45)" }}>({p.reviews})</span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-semibold text-[13px] sm:text-sm" style={{ color: "#1a1208" }}>{formatINR(p.price)}</span>
                  <span className="text-[10px] sm:text-xs line-through" style={{ color: "rgba(26,18,8,0.4)" }}>{formatINR(p.mrp)}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Showcase;
