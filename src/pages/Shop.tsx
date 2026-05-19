import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, Search, X } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { ProductCard, Product } from "@/components/site/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import catWedding from "@/assets/cat-wedding.jpg";

type Cat = { id: string; name: string; slug: string };

// Cinematic easing curve used across the page
const LUXE_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Subtle floating gold particles for the hero — 5 dots at fixed positions,
// each gently drifts up/down on its own loop. Pure decoration.
const GoldParticles = () => {
  const particles = [
    { left: "8%", top: "22%", size: 6, delay: 0, duration: 6 },
    { left: "18%", top: "78%", size: 4, delay: 1.2, duration: 7.5 },
    { left: "42%", top: "12%", size: 5, delay: 0.6, duration: 8 },
    { left: "78%", top: "68%", size: 7, delay: 1.8, duration: 6.5 },
    { left: "92%", top: "32%", size: 4, delay: 0.9, duration: 7 },
  ];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            background: "#C9964A",
            opacity: 0.35,
            boxShadow: "0 0 12px rgba(201,150,74,0.55)",
          }}
          animate={{ y: [0, -15, 0], opacity: [0.3, 0.55, 0.3] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
};

const ShopPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cats, setCats] = useState<Cat[]>([]);
  const [active, setActive] = useState<string>("all");
  const [sort, setSort] = useState<"featured" | "price-asc" | "price-desc">("featured");
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Sync URL ?q= with local search (both directions)
  useEffect(() => {
    const q = searchParams.get("q") ?? "";
    if (q !== search) setSearch(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    const t = setTimeout(() => {
      const next = new URLSearchParams(searchParams);
      if (search) next.set("q", search); else next.delete("q");
      if (next.toString() !== searchParams.toString()) {
        setSearchParams(next, { replace: true });
      }
    }, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  useEffect(() => {
    setLoading(true);
    setError(false);
    Promise.all([
      supabase.from("products").select("id,slug,name,price,original_price,image_url,badge,short_description,category_slug").order("sort_order"),
      supabase.from("categories").select("id,name,slug").order("sort_order"),
    ]).then(([{ data: prods, error: e1 }, { data: catData, error: e2 }]) => {
      if (e1 || e2) { setError(true); setLoading(false); return; }
      setProducts((prods ?? []) as Product[]);
      setCats((catData ?? []) as Cat[]);
      setLoading(false);
    }).catch(() => { setError(true); setLoading(false); });
  }, [retryCount]);

  const filtered = useMemo(() => {
    let list = active === "all" ? products : products.filter((p) => p.category_slug === active);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || (p.short_description ?? "").toLowerCase().includes(q));
    }
    if (sort === "price-asc")  list = [...list].sort((a, b) => Number(a.price) - Number(b.price));
    if (sort === "price-desc") list = [...list].sort((a, b) => Number(b.price) - Number(a.price));
    return list;
  }, [products, active, sort, search]);

  // Re-key the grid on filter/sort/search changes so children re-stagger in
  const gridKey = `${active}-${sort}-${search}`;

  return (
    <>
      {/* ─────────────────────────────  HERO  ───────────────────────────── */}
      <section
        className="relative overflow-hidden pt-[110px] pb-24 md:pb-28"
        style={{ background: "linear-gradient(180deg, #FAF7F4 0%, rgba(250,247,244,0) 100%)" }}
      >
        <GoldParticles />

        <div className="relative max-w-[1280px] mx-auto px-6 lg:px-8 grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — copy */}
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: LUXE_EASE }}
              style={{
                fontSize: "11px",
                color: "#C9964A",
                letterSpacing: "0.25em",
                fontWeight: 600,
                textTransform: "uppercase",
              }}
              className="mb-6"
            >
              The Collection
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: LUXE_EASE, delay: 0.1 }}
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 400,
                fontSize: "clamp(2.5rem, 5vw, 3.8rem)",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                color: "#3D2B1F",
              }}
            >
              Curated keepsakes,
              <br />
              <span
                style={{
                  fontFamily: "var(--font-serif)",
                  fontStyle: "italic",
                  color: "#C9964A",
                  fontWeight: 400,
                }}
              >
                made for forever.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: LUXE_EASE, delay: 0.28 }}
              className="mt-7 text-base md:text-lg leading-relaxed max-w-lg"
              style={{ color: "rgba(61,43,31,0.72)" }}
            >
              Every piece in our atelier is hand-poured, hand-finished, and made one
              at a time. Browse the full collection of resin art keepsakes.
            </motion.p>

            {/* Tiny decorative gold rule */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.9, ease: LUXE_EASE, delay: 0.45 }}
              style={{
                originX: 0,
                height: 1,
                width: 64,
                marginTop: 32,
                background: "linear-gradient(90deg, #C9964A 0%, transparent 100%)",
              }}
            />
          </div>

          {/* Right — hero image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.1, ease: LUXE_EASE, delay: 0.18 }}
            className="relative"
          >
            <div
              className="relative overflow-hidden"
              style={{
                borderRadius: 24,
                aspectRatio: "4 / 5",
                boxShadow: "0 30px 80px -20px rgba(61,43,31,0.3)",
              }}
            >
              <img
                src={catWedding}
                alt="Mohika Art handcrafted resin keepsake"
                loading="eager"
                className="w-full h-full object-cover"
              />
              {/* Soft inner highlight for depth */}
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(160deg, rgba(255,255,255,0.05) 0%, transparent 38%, rgba(61,43,31,0.18) 100%)",
                }}
              />
            </div>

            {/* Floating tiny gold dot accent on the image corner */}
            <motion.div
              aria-hidden
              className="absolute -top-3 -left-3 w-6 h-6 rounded-full"
              style={{
                background: "#C9964A",
                boxShadow: "0 0 24px rgba(201,150,74,0.6)",
              }}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </div>
      </section>

      {/* ─────────────────────────────  FILTER BAR  ───────────────────────────── */}
      <section
        className="relative border-y"
        style={{ borderColor: "#e5e0d8", background: "rgba(250,247,244,0.6)", backdropFilter: "blur(8px)" }}
      >
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-6 md:py-7">
          <div className="flex flex-col gap-4">
            {/* Search */}
            <div className="relative w-full max-w-md">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                style={{ color: "rgba(61,43,31,0.5)" }}
              />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search the collection…"
                className="w-full pr-10 text-sm transition-all"
                style={{
                  height: 44,
                  paddingLeft: 44,
                  borderRadius: 9999,
                  border: "1px solid #e5e0d8",
                  background: "#ffffff",
                  color: "#3D2B1F",
                  outline: "none",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#C9964A")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e0d8")}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center"
                  style={{ color: "rgba(61,43,31,0.55)" }}
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Category pills */}
              <div className="flex flex-wrap gap-2">
                {[{ id: "all", slug: "all", name: "All" }, ...cats].map((c) => {
                  const isActive = active === c.slug;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setActive(c.slug)}
                      className="transition-all duration-300"
                      style={{
                        padding: "10px 20px",
                        borderRadius: 9999,
                        fontSize: 11,
                        textTransform: "uppercase",
                        letterSpacing: "0.12em",
                        fontWeight: 600,
                        background: isActive ? "#3D2B1F" : "transparent",
                        color: isActive ? "#FAF7F4" : "#3D2B1F",
                        border: `1px solid ${isActive ? "#3D2B1F" : "#e5e0d8"}`,
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = "#FAF7F4";
                          e.currentTarget.style.borderColor = "rgba(201,150,74,0.3)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = "transparent";
                          e.currentTarget.style.borderColor = "#e5e0d8";
                        }
                      }}
                    >
                      {c.name}
                    </button>
                  );
                })}
              </div>

              {/* Sort + count */}
              <div className="flex items-center gap-4">
                <div
                  className="hidden sm:flex items-center gap-2"
                  style={{ fontSize: 11, letterSpacing: "0.1em", color: "rgba(61,43,31,0.6)", textTransform: "uppercase" }}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>
                    {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}
                  </span>
                </div>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as typeof sort)}
                  className="cursor-pointer transition-colors"
                  style={{
                    padding: "10px 18px",
                    borderRadius: 9999,
                    border: "1px solid #e5e0d8",
                    background: "#ffffff",
                    color: "#3D2B1F",
                    fontSize: 11,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    fontWeight: 500,
                    outline: "none",
                  }}
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────  PRODUCT GRID  ───────────────────────────── */}
      <section className="max-w-[1280px] mx-auto px-6 lg:px-8 py-20">
        <AnimatePresence mode="wait">
          {error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center py-24"
            >
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 400,
                  fontSize: "clamp(1.75rem, 3vw, 2.25rem)",
                  color: "#3D2B1F",
                  marginBottom: 12,
                }}
              >
                We couldn't load the collection.
              </h2>
              <p className="text-sm mb-8" style={{ color: "rgba(61,43,31,0.6)" }}>
                Please check your connection and try again.
              </p>
              <button
                onClick={() => setRetryCount((c) => c + 1)}
                className="inline-flex items-center justify-center transition-all hover:opacity-90"
                style={{
                  height: 48,
                  padding: "0 32px",
                  borderRadius: 9999,
                  background: "#3D2B1F",
                  color: "#FAF7F4",
                  fontSize: 12,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                Retry
              </button>
            </motion.div>
          ) : loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            >
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-100 animate-pulse aspect-square"
                  style={{ borderRadius: 12 }}
                />
              ))}
            </motion.div>
          ) : filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: LUXE_EASE }}
              className="mx-auto text-center py-16 px-6"
              style={{
                maxWidth: 480,
                background: "#ffffff",
                border: "1px solid #e5e0d8",
                borderRadius: 24,
                boxShadow: "0 20px 60px -30px rgba(61,43,31,0.18)",
              }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ background: "rgba(201,150,74,0.1)" }}
              >
                <Search className="w-6 h-6" style={{ color: "#C9964A" }} />
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 400,
                  fontSize: "clamp(1.5rem, 2.5vw, 1.875rem)",
                  color: "#3D2B1F",
                  marginBottom: 10,
                  letterSpacing: "-0.01em",
                }}
              >
                No pieces match your search
              </h2>
              <p className="text-sm mb-7" style={{ color: "rgba(61,43,31,0.6)" }}>
                Try a different category or clear your filters to see everything.
              </p>
              <button
                onClick={() => {
                  setActive("all");
                  setSearch("");
                }}
                className="inline-flex items-center justify-center transition-all hover:opacity-90"
                style={{
                  height: 48,
                  padding: "0 28px",
                  borderRadius: 9999,
                  background: "#3D2B1F",
                  color: "#FAF7F4",
                  fontSize: 12,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                Reset Filters
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={gridKey}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            >
              {filtered.map((p, i) => (
                <ProductCard key={p.id} p={p} index={i} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </>
  );
};

export default ShopPage;
