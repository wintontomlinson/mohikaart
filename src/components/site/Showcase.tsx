import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Heart, Plus } from "lucide-react";
import { useState, useRef, useCallback } from "react";
import { toast } from "sonner";
import { useCart } from "@/lib/cart";
import { LUXURY_EASE, SPRING_SMOOTH, staggerContainer, Magnetic } from "@/lib/animations";

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

/* ── 3D Tilt Product Card ── */
function ProductTilt3D({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const glareOpacity = useMotionValue(0);
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), SPRING_SMOOTH);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), SPRING_SMOOTH);
  const scale = useSpring(1, SPRING_SMOOTH);

  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect || window.matchMedia("(pointer: coarse)").matches) return;
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(px);
    y.set(py);
    glareX.set((px + 0.5) * 100);
    glareY.set((py + 0.5) * 100);
    glareOpacity.set(0.18);
    scale.set(1.03);
  }, [x, y, glareX, glareY, glareOpacity, scale]);

  const handleLeave = useCallback(() => {
    x.set(0);
    y.set(0);
    glareOpacity.set(0);
    scale.set(1);
  }, [x, y, glareOpacity, scale]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        rotateX,
        rotateY,
        scale,
        transformStyle: "preserve-3d",
        perspective: "900px",
      }}
      className={`relative ${className}`}
    >
      {children}
      {/* Reflective glare */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-2xl z-20"
        style={{
          opacity: glareOpacity,
          background: useTransform(
            [glareX, glareY],
            ([gx, gy]) => `radial-gradient(ellipse at ${gx}% ${gy}%, rgba(255,255,255,0.4) 0%, transparent 65%)`
          ),
        }}
      />
    </motion.div>
  );
}

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
    <section className="py-20 md:py-28 relative" style={{ background: "#fdf9f0" }}>
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full blur-[160px]" style={{ background: "hsl(34 58% 85%/0.06)" }} />
      </div>
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 md:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30, rotateX: 8 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: LUXURY_EASE }}
            style={{ perspective: "800px" }}
          >
            <p className="font-semibold uppercase mb-3" style={{ fontSize: "11px", color: "#c9a84c", letterSpacing: "0.25em" }}>
              Best Sellers
            </p>
            <h2 className="font-display" style={{ fontWeight: 400, fontSize: "clamp(1.85rem, 3.8vw, 2.6rem)", lineHeight: 1.1, letterSpacing: "-0.02em", color: "#1a1208" }}>
              Loved by{" "}
              <em className="font-serif italic shimmer-text" style={{ fontWeight: 400 }}>everyone.</em>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15, ease: LUXURY_EASE }}
          >
            <Magnetic strength={0.2}>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 text-[12px] tracking-[0.12em] uppercase font-semibold transition-colors hover:text-[#c9a84c]"
                style={{ color: "#1a1208", paddingBottom: "4px", borderBottom: "1px solid #c9a84c" }}
              >
                View All Products
                <ArrowRight style={{ width: 14, height: 14 }} />
              </Link>
            </Magnetic>
          </motion.div>
        </div>

        {/* Product grid — premium luxury 3D cards */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-5"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
        >
          {PRODUCTS.map((p, i) => (
            <motion.div
              key={p.id}
              variants={{
                hidden: { opacity: 0, y: 50, scale: 0.9, rotateX: 12, filter: "blur(6px)" },
                visible: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  rotateX: 0,
                  filter: "blur(0px)",
                  transition: { duration: 0.8, delay: i * 0.08, ease: LUXURY_EASE },
                },
              }}
              style={{ perspective: "1000px" }}
            >
              <ProductTilt3D className="group cursor-pointer">
              {/* Image */}
              <div className="relative overflow-hidden rounded-2xl" style={{ aspectRatio: "1/1", boxShadow: "0 4px 12px -6px rgba(26,18,8,0.06)", transition: "box-shadow 0.6s cubic-bezier(0.22,1,0.36,1)" }}>
                <img src={p.image} alt={p.name} loading="lazy" decoding="async" width={400} height={400} className="w-full h-full object-cover transition-all duration-[1.2s] ease-out group-hover:scale-[1.1] group-hover:brightness-[1.03]" style={{ backgroundColor: "hsl(36 30% 94%)" }} />

                {/* Glassmorphism overlay on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: "linear-gradient(to top, rgba(26,18,8,0.25) 0%, transparent 50%)" }}
                />

                {/* Badge */}
                <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[8px] sm:text-[9px] uppercase tracking-wider font-bold backdrop-blur-sm" style={{ background: BADGE_STYLES[p.badge]?.bg + "ee", color: BADGE_STYLES[p.badge]?.color }}>
                  {p.badge}
                </div>

                {/* Discount */}
                <div className="absolute top-2.5 right-10 sm:right-11 px-1.5 py-0.5 rounded-full text-[8px] sm:text-[9px] font-bold" style={{ background: "#e53e3e", color: "#fff" }}>
                  -{p.discount}%
                </div>

                {/* Wishlist */}
                <button
                  onClick={() => toggleWishlist(p.id)}
                  className="absolute top-2.5 right-2.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-115 backdrop-blur-sm"
                  style={{ background: "rgba(255,255,255,0.85)", boxShadow: "0 4px 12px -2px rgba(0,0,0,0.1)" }}
                >
                  <Heart className="w-3 h-3 sm:w-3.5 sm:h-3.5 transition-all" style={{ color: wishlist.has(p.id) ? "#e53e3e" : "#999", fill: wishlist.has(p.id) ? "#e53e3e" : "none" }} />
                </button>

                {/* Add to Cart — glassmorphism pill */}
                <div className="absolute inset-x-2.5 bottom-2.5 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                  <button
                    onClick={() => handleAddToCart(p)}
                    className="w-full py-2.5 sm:py-3 rounded-full text-[9px] sm:text-[10px] uppercase tracking-[0.1em] font-semibold flex items-center justify-center gap-1.5 backdrop-blur-md transition-all duration-300 hover:scale-[1.02]"
                    style={{ background: "rgba(26,18,8,0.88)", color: "#fdf9f0", boxShadow: "0 8px 24px -6px rgba(26,18,8,0.3)" }}
                  >
                    <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Add to Cart
                  </button>
                </div>

                {/* Animated border glow on hover */}
                <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ boxShadow: "inset 0 0 0 1.5px rgba(201,150,74,0.25), 0 20px 50px -15px rgba(201,150,74,0.12)" }} />
              </div>

              {/* Card body */}
              <div className="mt-3 px-0.5">
                <div className="text-[8px] sm:text-[9px] uppercase tracking-[0.18em] font-semibold mb-0.5" style={{ color: "#c9a84c" }}>
                  Handmade · Customizable
                </div>
                <h3 className="text-[12px] sm:text-[13px] font-medium leading-tight mb-1.5" style={{ color: "#1a1208", wordBreak: "break-word" }}>
                  {p.name}
                </h3>
                <div className="flex items-center gap-0.5 mb-1.5">
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
              </ProductTilt3D>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Showcase;
