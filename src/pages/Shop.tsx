import { useEffect, useMemo, useState } from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ProductCard, Product } from "@/components/site/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import catWedding from "@/assets/cat-wedding.jpg";

type Cat = { id: string; name: string; slug: string };

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
  const [gridKey, setGridKey] = useState(0);

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

  // Trigger stagger animation on filter change
  useEffect(() => {
    setGridKey((k) => k + 1);
  }, [active, sort, search]);

  const filtered = useMemo(() => {
    let list = active === "all" ? products : products.filter((p) => p.category_slug === active);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || (p.short_description ?? "").toLowerCase().includes(q));
    }
    if (sort === "price-asc") list = [...list].sort((a, b) => Number(a.price) - Number(b.price));
    if (sort === "price-desc") list = [...list].sort((a, b) => Number(b.price) - Number(a.price));
    return list;
  }, [products, active, sort, search]);

  return (
    <>
      {/* Hero Section */}
      <section className="py-24" style={{ background: "linear-gradient(to bottom, #FAF7F4, transparent)" }}>
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <span
                className="inline-block text-[11px] uppercase tracking-[0.25em] font-semibold mb-5"
                style={{ color: "#C9964A" }}
              >
                Our Collection
              </span>
              <h1
                className="font-light leading-[1.08]"
                style={{ fontSize: "clamp(2.5rem, 5vw, 3.5rem)", fontFamily: "var(--font-display)", color: "#3D2B1F" }}
              >
                Explore the full{" "}
                <em className="not-italic italic" style={{ color: "#C9964A", fontFamily: "var(--font-serif)" }}>
                  collection
                </em>
                .
              </h1>
              <p className="mt-6 text-[15px] leading-[1.7] text-gray-500 max-w-md">
                Every piece in our catalogue is handcrafted to order — poured with patience, polished with precision, and packaged with pride. Discover keepsakes that hold your most treasured memories.
              </p>
            </motion.div>

            {/* Right */}
            <motion.div
              className="flex justify-center md:justify-end"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="relative overflow-hidden rounded-[20px] w-full" style={{ aspectRatio: "4/5", maxHeight: "480px" }}>
                <img
                  src={catWedding}
                  alt="Handcrafted resin art collection"
                  className="w-full h-full object-cover transition-transform duration-[800ms] ease-out hover:scale-[1.02]"
                  style={{ boxShadow: "0 32px 80px -20px rgba(61,43,31,0.18)" }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Filter Section + Grid */}
      <section className="py-20">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          {/* Filters bar */}
          <motion.div
            className="flex flex-col gap-5 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Search input */}
            <div className="relative max-w-sm">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products…"
                className="w-full pl-11 pr-10 py-2.5 rounded-full text-sm outline-none transition-all duration-300"
                style={{ border: "1px solid #e5e0d8" }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#C9964A";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(201,150,74,0.1)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#e5e0d8";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Category pills */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActive("all")}
                  className="px-5 py-2.5 rounded-full text-[11px] tracking-[0.06em] uppercase font-semibold transition-all duration-300"
                  style={
                    active === "all"
                      ? { background: "#3D2B1F", color: "#fff", boxShadow: "0 4px 12px -4px rgba(61,43,31,0.3)" }
                      : { border: "1px solid #e5e0d8", background: "transparent", color: "#3D2B1F" }
                  }
                  onMouseEnter={(e) => {
                    if (active !== "all") {
                      e.currentTarget.style.background = "#FAF7F4";
                      e.currentTarget.style.borderColor = "rgba(201,150,74,0.3)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (active !== "all") {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.borderColor = "#e5e0d8";
                    }
                  }}
                >
                  All
                </button>
                {cats.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setActive(c.slug)}
                    className="px-5 py-2.5 rounded-full text-[11px] tracking-[0.06em] uppercase font-semibold transition-all duration-300"
                    style={
                      active === c.slug
                        ? { background: "#3D2B1F", color: "#fff", boxShadow: "0 4px 12px -4px rgba(61,43,31,0.3)" }
                        : { border: "1px solid #e5e0d8", background: "transparent", color: "#3D2B1F" }
                    }
                    onMouseEnter={(e) => {
                      if (active !== c.slug) {
                        e.currentTarget.style.background = "#FAF7F4";
                        e.currentTarget.style.borderColor = "rgba(201,150,74,0.3)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (active !== c.slug) {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.borderColor = "#e5e0d8";
                      }
                    }}
                  >
                    {c.name}
                  </button>
                ))}
              </div>

              {/* Sort + count */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-[11px] text-gray-400 uppercase tracking-wide">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>{filtered.length} item{filtered.length !== 1 && "s"}</span>
                </div>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as typeof sort)}
                  className="px-4 py-2.5 rounded-full text-[11px] tracking-wide outline-none cursor-pointer transition-all duration-300"
                  style={{ border: "1px solid #e5e0d8" }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#C9964A";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#e5e0d8";
                  }}
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Products grid */}
          {error ? (
            <div className="text-center py-24">
              <p className="text-xl text-gray-500 mb-2" style={{ fontFamily: "var(--font-serif)" }}>Couldn't load products</p>
              <p className="text-sm text-gray-400 mb-6">Please check your connection and try again.</p>
              <button
                onClick={() => setRetryCount((c) => c + 1)}
                className="px-8 py-3.5 rounded-full text-[11px] tracking-[0.1em] uppercase font-semibold transition-all duration-300"
                style={{ background: "#3D2B1F", color: "#FAF7F4", boxShadow: "0 4px 16px -4px rgba(61,43,31,0.3)" }}
              >
                Retry
              </button>
            </div>
          ) : loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-[16px] animate-pulse"
                  style={{ aspectRatio: "1/1", background: "#f0ece7" }}
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                style={{ background: "#FAF7F4" }}
              >
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-xl text-gray-500 mb-2" style={{ fontFamily: "var(--font-display)" }}>No products found</p>
              <p className="text-sm text-gray-400">Try a different category or search term</p>
              <button
                onClick={() => { setActive("all"); setSearch(""); }}
                className="mt-8 px-8 py-3.5 rounded-full text-[11px] tracking-[0.1em] uppercase font-semibold transition-all duration-300"
                style={{ background: "#3D2B1F", color: "#FAF7F4", boxShadow: "0 4px 16px -4px rgba(61,43,31,0.3)" }}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div key={gridKey} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p, i) => (
                <ProductCard key={p.id} p={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default ShopPage;
