import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, Search, X, Grid2X2, Grid3X3, LayoutGrid, ArrowRight, PackageOpen } from "lucide-react";
import { useSearchParams, Link } from "react-router-dom";
import { ProductCard, Product } from "@/components/site/ProductCard";
import { supabase } from "@/integrations/supabase/client";

type Cat = { id: string; name: string; slug: string };

const LUXE_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const ShopPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cats, setCats] = useState<Cat[]>([]);
  const [active, setActive] = useState<string>("all");
  const [sort, setSort] = useState<string>("featured");
  const [gridCols, setGridCols] = useState<2 | 3 | 4>(4);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Sync URL ?q= with local search
  useEffect(() => {
    const q = searchParams.get("q") ?? "";
    if (q !== search) setSearch(q);
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
  }, [search]);

  useEffect(() => {
    setLoading(true);
    setError(false);
    Promise.all([
      supabase.from("products").select("id,slug,name,price,original_price,image_url,badge,short_description,category_slug,featured,created_at,sort_order").order("sort_order"),
      supabase.from("categories").select("id,name,slug").order("sort_order"),
    ]).then(([{ data: prods, error: e1 }, { data: catData, error: e2 }]) => {
      if (e1 || e2) { setError(true); setLoading(false); return; }
      setProducts((prods ?? []) as any[]);
      setCats((catData ?? []) as Cat[]);
      setLoading(false);
    }).catch(() => { setError(true); setLoading(false); });
  }, [retryCount]);

  const filtered = useMemo(() => {
    let list = active === "all" ? products : products.filter((p: any) => p.category_slug === active);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || (p.short_description ?? "").toLowerCase().includes(q));
    }
    // Sort
    if (sort === "price-asc") list = [...list].sort((a, b) => Number(a.price) - Number(b.price));
    if (sort === "price-desc") list = [...list].sort((a, b) => Number(b.price) - Number(a.price));
    if (sort === "newest") list = [...list].sort((a: any, b: any) => ((b.created_at || "") > (a.created_at || "") ? 1 : -1));
    if (sort === "bestselling") list = [...list].sort((a: any, b: any) => (a.featured === b.featured ? 0 : a.featured ? -1 : 1));
    return list;
  }, [products, active, sort, search]);

  const gridKey = `${active}-${sort}-${search}`;

  const gridClass = gridCols === 2
    ? "grid-cols-2 gap-4 md:gap-6"
    : gridCols === 3
    ? "grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6"
    : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5";

  return (
    <>
      {/* ── PAGE HEADER ── */}
      <section className="pt-28 pb-10 md:pb-12" style={{ background: "#FAF7F4" }}>
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: LUXE_EASE }}
            className="text-center"
          >
            <p
              className="font-semibold uppercase mb-3"
              style={{ fontSize: "11px", color: "#C9964A", letterSpacing: "0.25em" }}
            >
              Shop
            </p>
            <h1
              className="font-display mb-3"
              style={{
                fontWeight: 400,
                fontSize: "clamp(2rem, 4.5vw, 3rem)",
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
                color: "#3D2B1F",
              }}
            >
              Our{" "}
              <em className="font-serif italic" style={{ color: "#C9964A", fontWeight: 400 }}>
                Collection
              </em>
            </h1>
            <p style={{ fontSize: "15px", color: "rgba(61,43,31,0.6)", maxWidth: "400px", margin: "0 auto" }}>
              Handcrafted with love, personalized just for you
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── STICKY FILTER BAR ── */}
      <section
        className="sticky top-[60px] md:top-[68px] z-30 border-b"
        style={{
          borderColor: "#e5e0d8",
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(16px) saturate(180%)",
          WebkitBackdropFilter: "blur(16px) saturate(180%)",
        }}
      >
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-4">
          {/* Category pills — horizontally scrollable on mobile */}
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2 -mx-2 px-2">
            {[{ id: "all", slug: "all", name: "All" }, ...cats].map((c) => {
              const isActive = active === c.slug;
              return (
                <button
                  key={c.id}
                  onClick={() => setActive(c.slug)}
                  className="shrink-0 transition-all duration-300"
                  style={{
                    padding: "8px 18px",
                    borderRadius: 9999,
                    fontSize: 11,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    fontWeight: 600,
                    background: isActive ? "#3D2B1F" : "transparent",
                    color: isActive ? "#FAF7F4" : "rgba(61,43,31,0.6)",
                    border: `1px solid ${isActive ? "#3D2B1F" : "#e5e0d8"}`,
                    whiteSpace: "nowrap",
                  }}
                >
                  {c.name}
                </button>
              );
            })}
          </div>

          {/* Sort + Grid toggle */}
          <div className="flex items-center justify-between mt-3 gap-3">
            <div className="flex items-center gap-2 text-[11px] text-[rgba(61,43,31,0.55)] uppercase tracking-wider">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{filtered.length} {filtered.length === 1 ? "piece" : "pieces"}</span>
            </div>

            <div className="flex items-center gap-3">
              {/* Grid toggle */}
              <div className="hidden md:flex items-center gap-1 bg-[#f5f0ea] rounded-full p-1">
                {([2, 3, 4] as const).map((cols) => (
                  <button
                    key={cols}
                    onClick={() => setGridCols(cols)}
                    className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200"
                    style={{
                      background: gridCols === cols ? "#3D2B1F" : "transparent",
                      color: gridCols === cols ? "#FAF7F4" : "rgba(61,43,31,0.4)",
                    }}
                    aria-label={`${cols} columns`}
                  >
                    {cols === 2 && <Grid2X2 className="w-3.5 h-3.5" />}
                    {cols === 3 && <Grid3X3 className="w-3.5 h-3.5" />}
                    {cols === 4 && <LayoutGrid className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>

              {/* Sort dropdown */}
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="cursor-pointer text-[11px] uppercase tracking-wider font-medium transition-colors outline-none"
                style={{
                  padding: "8px 16px",
                  borderRadius: 9999,
                  border: "1px solid #e5e0d8",
                  background: "#ffffff",
                  color: "#3D2B1F",
                }}
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest</option>
                <option value="bestselling">Best Selling</option>
              </select>

              {/* Search toggle (inline) */}
              <div className="relative hidden sm:block">
                <div className="flex items-center gap-2 px-3 py-2 rounded-full border border-[#e5e0d8] bg-white">
                  <Search className="w-3.5 h-3.5 text-[rgba(61,43,31,0.4)]" />
                  <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search..."
                    className="w-24 focus:w-40 transition-all duration-300 outline-none bg-transparent text-xs"
                  />
                  {search && (
                    <button onClick={() => setSearch("")} aria-label="Clear">
                      <X className="w-3 h-3 text-[rgba(61,43,31,0.5)]" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile search */}
          <div className="sm:hidden mt-3">
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-full border border-[#e5e0d8] bg-white">
              <Search className="w-4 h-4 text-[rgba(61,43,31,0.4)] shrink-0" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="flex-1 outline-none bg-transparent text-sm"
              />
              {search && (
                <button onClick={() => setSearch("")} aria-label="Clear">
                  <X className="w-4 h-4 text-[rgba(61,43,31,0.5)]" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── PRODUCT GRID ── */}
      <section className="max-w-[1280px] mx-auto px-6 lg:px-8 py-12 md:py-16">
        <AnimatePresence mode="wait">
          {error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <h2 className="font-display text-2xl mb-3" style={{ color: "#3D2B1F" }}>
                We couldn't load the collection.
              </h2>
              <p className="text-sm mb-6" style={{ color: "rgba(61,43,31,0.6)" }}>
                Please check your connection and try again.
              </p>
              <button
                onClick={() => setRetryCount((c) => c + 1)}
                className="px-7 py-3 rounded-full text-[11px] tracking-[0.12em] uppercase font-semibold"
                style={{ background: "#3D2B1F", color: "#FAF7F4" }}
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
              className={`grid ${gridClass}`}
            >
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse aspect-square rounded-2xl" style={{ background: "rgba(61,43,31,0.06)" }} />
              ))}
            </motion.div>
          ) : filtered.length === 0 ? (
            /* ── EMPTY STATE ── */
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: LUXE_EASE }}
              className="mx-auto text-center py-16 px-6 max-w-md"
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                style={{ background: "rgba(201,150,74,0.1)" }}
              >
                <PackageOpen className="w-7 h-7" style={{ color: "#C9964A" }} />
              </div>
              <h2 className="font-display text-xl mb-2" style={{ color: "#3D2B1F" }}>
                No products found in this category
              </h2>
              <p className="text-sm mb-6" style={{ color: "rgba(61,43,31,0.6)" }}>
                Try a different category or clear your filters.
              </p>
              <button
                onClick={() => { setActive("all"); setSearch(""); }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-[11px] tracking-[0.1em] uppercase font-semibold"
                style={{ background: "#3D2B1F", color: "#FAF7F4" }}
              >
                Browse all products
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={gridKey}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className={`grid ${gridClass}`}
            >
              {filtered.map((p, i) => (
                <ProductCard key={p.id} p={p} index={i} />
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
          transition={{ duration: 0.7, ease: LUXE_EASE }}
          className="relative overflow-hidden rounded-3xl px-6 py-12 md:px-12 md:py-14 text-center"
          style={{
            background: "linear-gradient(135deg, #fdf8f3 0%, #fef5ee 50%, #fdf8f3 100%)",
            border: "1px solid rgba(201,150,74,0.15)",
          }}
        >
          <h3
            className="font-display mb-2"
            style={{ fontWeight: 400, fontSize: "clamp(1.4rem, 2.8vw, 1.8rem)", color: "#3D2B1F" }}
          >
            Can't find what you're looking for?
          </h3>
          <p className="mb-6" style={{ fontSize: "14px", color: "rgba(61,43,31,0.6)" }}>
            We craft custom pieces too! Share your idea and we'll make it just for you.
          </p>
          <Link
            to="/custom-order"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-[11px] tracking-[0.1em] uppercase font-semibold transition-all duration-300 hover:scale-105"
            style={{
              background: "#3D2B1F",
              color: "#FAF7F4",
              boxShadow: "0 4px 16px -4px rgba(61,43,31,0.35)",
            }}
          >
            Request Custom Order
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>
      </section>
    </>
  );
};

export default ShopPage;
