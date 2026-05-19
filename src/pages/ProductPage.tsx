import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Plus, Minus, ShieldCheck, Truck, Sparkles, ChevronRight } from "lucide-react";
import { addDays, format, getDay } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { resolveImage, formatINR } from "@/lib/site";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { ProductCard, Product } from "@/components/site/ProductCard";
import PackagingShowcase from "@/components/site/PackagingShowcase";
import { pushRecentlyViewed, getRecentlyViewed, pruneRecentlyViewed } from "@/lib/recentlyViewed";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

type Full = Product & { description: string | null; gallery: string[] };

// Compute a delivery date `days` business days from today, skipping Sundays only
// (per Mohika's working calendar).
const computeDeliveryEstimate = (days: number): Date => {
  let target = new Date();
  let added = 0;
  while (added < days) {
    target = addDays(target, 1);
    if (getDay(target) !== 0) added += 1;
  }
  return target;
};

// Per-category business-day lead times that line up with the FAQ promises:
// wedding keepsakes are bouquet-preservation pieces (14-21 calendar days, ~18
// business days); photo frames, coaster sets and gift hampers are standard
// custom (7-10 days, ~9 business days); name keychains and bookmarks are the
// quickest poured pieces (~6 business days). Unknown / null category slugs
// fall back to a safe 7-day default.
const LEAD_TIME_BY_CATEGORY: Record<string, number> = {
  "wedding-keepsakes": 18,
  "photo-frames": 9,
  "name-keychains": 6,
  "coaster-sets": 9,
  "bookmarks": 6,
  "gift-hampers": 9,
};

const getLeadTimeDays = (categorySlug: string | null): number => {
  if (!categorySlug) return 7;
  return LEAD_TIME_BY_CATEGORY[categorySlug] ?? 7;
};

const ProductPage = () => {
  const { slug = "" } = useParams();
  const [p, setP] = useState<Full | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [recent, setRecent] = useState<Product[]>([]);
  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(1);
  const [notFound, setNotFound] = useState(false);
  const { add } = useCart();
  const { has: wishlistHas, toggle: wishlistToggle } = useWishlist();

  // Image zoom state (lg+ only)
  const [zoomEnabled, setZoomEnabled] = useState(false);
  const [zoomActive, setZoomActive] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const imageWrapRef = useRef<HTMLDivElement | null>(null);

  // Mobile fullscreen lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Sticky mobile CTA visibility - driven by an IntersectionObserver on a
  // sentinel placed at the bottom of the gallery column.
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [pastGallery, setPastGallery] = useState(false);

  useEffect(() => {
    setQty(1);
    setActive(0);
    setP(null);
    setNotFound(false);
    setPastGallery(false);
    supabase.from("products").select("*").eq("slug", slug).maybeSingle()
      .then(({ data, error }) => {
        if (error || !data) { setNotFound(true); return; }
        const gallery = Array.isArray(data.gallery) ? (data.gallery as string[]) : [];
        const full = { ...(data as any), gallery } as Full;
        setP(full);
        // Track recently-viewed once the product loads.
        pushRecentlyViewed(full.id);

        // Related (same category, exclude self)
        if (data.category_slug) {
          supabase.from("products")
            .select("id,slug,name,price,original_price,image_url,badge,short_description,category_slug")
            .eq("category_slug", data.category_slug).neq("id", data.id).limit(3)
            .then(({ data: rels }) => setRelated((rels ?? []) as Product[]));
        } else {
          setRelated([]);
        }

        // Recently-viewed rail (exclude the current product)
        const ids = getRecentlyViewed().filter((id) => id !== full.id);
        if (ids.length > 0) {
          supabase.from("products")
            .select("id,slug,name,price,original_price,image_url,badge,short_description,category_slug")
            .in("id", ids).limit(12)
            .then(({ data: rows }) => {
              const list = (rows ?? []) as Product[];
              // Preserve the most-recent-first order of the stored ids.
              const ordered = ids
                .map((id) => list.find((r) => r.id === id))
                .filter((r): r is Product => Boolean(r));
              setRecent(ordered);
              // Self-heal localStorage: drop any stored id that didn't come
              // back from supabase (deleted product, slug change, etc.) so
              // dead ids don't permanently occupy the 12-slot cap. Guarded
              // by `list.length > 0` so a failed network call never wipes
              // healthy entries.
              if (list.length > 0) {
                // Append full.id because the supabase fetch deliberately
                // excludes the current product from the rail data, but it
                // still belongs in localStorage so the next page can show it.
                pruneRecentlyViewed([...list.map((r) => r.id), full.id]);
              }
            });
        } else {
          setRecent([]);
        }
      });
  }, [slug]);

  // Gate the hover-zoom interaction to lg+ via window.matchMedia. Listen for
  // changes so it adapts when the user resizes the window or rotates a tablet.
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia("(min-width: 1024px)");
    const apply = () => setZoomEnabled(mql.matches);
    apply();
    if (mql.addEventListener) {
      mql.addEventListener("change", apply);
      return () => mql.removeEventListener("change", apply);
    }
    // Safari < 14 fallback
    mql.addListener(apply);
    return () => mql.removeListener(apply);
  }, []);

  // Sticky mobile CTA: toggle visibility once the sentinel scrolls past the top
  // of the viewport (i.e. the user has moved beyond the gallery column).
  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          // boundingClientRect.top < 0 means the sentinel is above the viewport.
          const above = entry.boundingClientRect.top < 0;
          setPastGallery(!entry.isIntersecting && above);
        }
      },
      { threshold: 0, rootMargin: "0px 0px 0px 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [p?.id]);

  // Lift WhatsAppFab + BackToTop above the 64px-tall sticky CTA bar while it
  // is shown. The bar is `md:hidden`, so we ALSO gate the offset on a
  // `(max-width: 767px)` matchMedia: on desktop the bar never appears, so the
  // FABs must not lift. The cleanup unconditionally resets the variable to
  // `0px` so navigating off the page or resizing past 767px while pastGallery
  // is still true cleans up correctly.
  useEffect(() => {
    if (typeof document === "undefined" || typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia("(max-width: 767px)");
    const apply = () => {
      document.documentElement.style.setProperty(
        "--fab-bottom-offset",
        pastGallery && mql.matches ? "76px" : "0px"
      );
    };
    apply();
    if (mql.addEventListener) {
      mql.addEventListener("change", apply);
      return () => {
        mql.removeEventListener("change", apply);
        document.documentElement.style.setProperty("--fab-bottom-offset", "0px");
      };
    }
    mql.addListener(apply); // Safari < 14 fallback
    return () => {
      mql.removeListener(apply);
      document.documentElement.style.setProperty("--fab-bottom-offset", "0px");
    };
  }, [pastGallery]);

  // Memoised delivery date string so we don't recompute on every render.
  // The hook sits before the early-return null guard, so guard `p` here.
  const deliveryLabel = useMemo(
    () => (p ? format(computeDeliveryEstimate(getLeadTimeDays(p.category_slug)), "EEE, d MMM") : ""),
    [p?.category_slug]
  );

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-hero">
        <div className="text-center px-6">
          <p className="font-serif text-2xl mb-3">Product not found</p>
          <p className="text-muted-foreground text-sm mb-6">This product may have been removed or the link is incorrect.</p>
          <Link to="/shop" className="px-7 py-3 rounded-full bg-foreground text-background text-xs tracking-[0.15em] uppercase btn-glow">
            Browse Shop
          </Link>
        </div>
      </div>
    );
  }

  if (!p) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-hero">
        <div className="flex flex-col items-center gap-4">
          <motion.div
            className="w-10 h-10 rounded-full border-2 border-gold/40 border-t-gold"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-sm uppercase tracking-widest text-muted-foreground">Loading</p>
        </div>
      </div>
    );
  }

  const allImages = [p.image_url, ...(p.gallery || [])].filter(Boolean) as string[];
  const main = resolveImage(allImages[active] ?? p.image_url);
  const wished = wishlistHas(p.id);

  const handleZoomMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!zoomEnabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomOrigin({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  const handleZoomEnter = () => { if (zoomEnabled) setZoomActive(true); };
  const handleZoomLeave = () => {
    setZoomActive(false);
    setZoomOrigin({ x: 50, y: 50 });
  };

  const handleMainImageClick = () => {
    // On lg+ the hover-zoom is the interaction; on smaller screens we open the
    // fullscreen lightbox instead.
    if (!zoomEnabled) setLightboxOpen(true);
  };

  const handleAddToCart = () => {
    add({ id: p.id, slug: p.slug, name: p.name, price: Number(p.price), image_url: p.image_url }, qty);
  };

  return (
    <>
      <section className="relative pt-10 md:pt-14 pb-16 md:pb-24 bg-hero noise-overlay overflow-hidden">
        {/* Background blobs */}
        <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-blush/30 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-[30rem] h-[30rem] rounded-full bg-champagne/25 blur-3xl pointer-events-none" />

        <div className="container relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-10">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/shop" className="hover:text-foreground transition-colors">Shop</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground">{p.name}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            {/* Images */}
            <div>
              <motion.div
                key={active}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className={`rounded-3xl overflow-hidden shadow-luxe aspect-[4/5] bg-card relative ${zoomEnabled ? "cursor-zoom-in" : "cursor-pointer"}`}
                ref={imageWrapRef}
                onMouseMove={handleZoomMove}
                onMouseEnter={handleZoomEnter}
                onMouseLeave={handleZoomLeave}
                onClick={handleMainImageClick}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setLightboxOpen(true);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label={zoomEnabled ? "Hover to zoom, press Enter to view full screen" : "Tap to view full screen"}
              >
                <img
                  src={main}
                  alt={p.name}
                  className="w-full h-full object-cover transition-transform duration-500 ease-out"
                  style={{
                    transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
                    transform: zoomActive ? "scale(1.6)" : "scale(1)",
                  }}
                />
                {p.badge && (
                  <div className="absolute top-5 left-5 px-3 py-1.5 rounded-full glass text-[10px] uppercase tracking-widest pointer-events-none">
                    {p.badge}
                  </div>
                )}
              </motion.div>
              {allImages.length > 1 && (
                <div className="mt-4 grid grid-cols-5 gap-3">
                  {allImages.map((src, i) => (
                    <button
                      key={i}
                      onClick={() => setActive(i)}
                      className={`rounded-2xl overflow-hidden aspect-square border-2 transition-all duration-300 ${
                        i === active ? "border-gold shadow-soft" : "border-transparent hover:border-border"
                      }`}
                    >
                      <img src={resolveImage(src)} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
              {/* Sentinel: when this scrolls past the viewport top, the sticky
                  mobile CTA bar slides up. */}
              <div ref={sentinelRef} aria-hidden="true" className="h-px w-full" />
            </div>

            {/* Info */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl leading-tight">{p.name}</h1>
                {p.short_description && (
                  <p className="mt-4 text-muted-foreground text-lg leading-relaxed">{p.short_description}</p>
                )}

                <div className="mt-8 flex items-baseline gap-4">
                  <div className="font-display text-4xl md:text-5xl text-gold-grad">{formatINR(Number(p.price))}</div>
                  {p.original_price && Number(p.original_price) > Number(p.price) && (
                    <div className="text-lg text-muted-foreground line-through">{formatINR(Number(p.original_price))}</div>
                  )}
                </div>

                <div className="gold-divider my-8" />

                {p.description && (
                  <p className="text-foreground/80 leading-relaxed font-serif text-lg">{p.description}</p>
                )}

                {/* Qty + Add to Cart */}
                <div className="mt-10 flex items-center gap-4">
                  <div className="inline-flex items-center rounded-full border border-border bg-card">
                    <button
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="w-11 h-11 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center font-display text-xl">{qty}</span>
                    <button
                      onClick={() => setQty((q) => q + 1)}
                      className="w-11 h-11 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 px-8 py-4 rounded-full bg-foreground text-background btn-glow btn-text inline-flex items-center justify-center gap-2 transition-all"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => wishlistToggle(p.id)}
                    aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
                    aria-pressed={wished}
                    className="w-12 h-12 rounded-full glass flex items-center justify-center hover:scale-110 transition-all duration-300"
                  >
                    <Heart
                      className="w-4 h-4 transition-all duration-300"
                      style={{
                        color: wished ? "hsl(348 70% 55%)" : undefined,
                        fill: wished ? "hsl(348 70% 55%)" : "none",
                      }}
                    />
                  </button>
                </div>

                {/* Delivery estimate chip */}
                <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-xs">
                  <Truck className="w-4 h-4 text-gold" strokeWidth={1.6} />
                  <span className="text-muted-foreground">Estimated delivery:</span>
                  <span className="font-semibold text-foreground">{deliveryLabel}</span>
                </div>

                {/* Trust badges */}
                <div className="mt-10 grid grid-cols-3 gap-4">
                  {[
                    { icon: Sparkles, label: "Handcrafted" },
                    { icon: ShieldCheck, label: "Premium Resin" },
                    { icon: Truck, label: "Free Delivery" },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="flex flex-col items-center gap-2 p-4 rounded-2xl glass text-center">
                      <Icon className="w-5 h-5 text-gold" strokeWidth={1.4} />
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium packaging strip - sits between trust badges and the rails */}
      <PackagingShowcase />

      {/* Recently-viewed rail */}
      {recent.length > 0 && (
        <section className="py-16 md:py-20">
          <div className="container">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-3xl md:text-5xl mb-12"
            >
              Recently <em className="not-italic text-gold-grad">viewed</em>
            </motion.h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {recent.slice(0, 6).map((r, i) => <ProductCard key={r.id} p={r} index={i} />)}
            </div>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="py-20 md:py-28">
          <div className="container">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-3xl md:text-5xl mb-12"
            >
              You may also <em className="not-italic text-gold-grad">love</em>
            </motion.h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {related.map((r, i) => <ProductCard key={r.id} p={r} index={i} />)}
            </div>
          </div>
        </section>
      )}

      {/* Sticky mobile CTA bar - md:hidden, slides up via framer-motion once
          the user scrolls past the gallery sentinel. */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: pastGallery ? 0 : 100 }}
        transition={{ type: "tween", duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 bottom-0 z-40 md:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        aria-hidden={!pastGallery}
      >
        <div
          className="mx-3 mb-3 rounded-full glass shadow-luxe flex items-center gap-2 pl-4 pr-2 py-2"
          style={{ height: "64px" }}
        >
          <div className="min-w-0 flex-1">
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground leading-none">
              {p.name}
            </div>
            <div className="font-display text-xl text-gold-grad leading-tight mt-0.5 truncate">
              {formatINR(Number(p.price))}
            </div>
          </div>
          <button
            onClick={() => wishlistToggle(p.id)}
            aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
            aria-pressed={wished}
            tabIndex={pastGallery ? 0 : -1}
            style={{ pointerEvents: pastGallery ? "auto" : "none" }}
            className="shrink-0 w-11 h-11 rounded-full bg-background/70 flex items-center justify-center transition-all"
          >
            <Heart
              className="w-4 h-4 transition-all duration-300"
              style={{
                color: wished ? "hsl(348 70% 55%)" : undefined,
                fill: wished ? "hsl(348 70% 55%)" : "none",
              }}
            />
          </button>
          <button
            onClick={handleAddToCart}
            tabIndex={pastGallery ? 0 : -1}
            style={{ pointerEvents: pastGallery ? "auto" : "none" }}
            className="shrink-0 px-5 h-11 rounded-full bg-foreground text-background btn-text inline-flex items-center justify-center"
          >
            Add to Cart
          </button>
        </div>
      </motion.div>

      {/* Mobile fullscreen lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-none w-screen h-screen p-0 bg-foreground/95 border-0 rounded-none flex flex-col items-center justify-center sm:rounded-none">
          <DialogTitle className="sr-only">Product image: {p.name}</DialogTitle>
          <div className="w-full flex-1 flex items-center justify-center px-4">
            <img
              src={main}
              alt={p.name}
              className="max-w-full max-h-[80vh] object-contain"
            />
          </div>
          {allImages.length > 1 && (
            <div className="w-full overflow-x-auto px-4 pb-6 pt-2">
              <div className="flex items-center gap-3 justify-center min-w-min">
                {allImages.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    aria-label={`View image ${i + 1}`}
                    className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      i === active ? "border-gold" : "border-background/15"
                    }`}
                  >
                    <img src={resolveImage(src)} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductPage;
