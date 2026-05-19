import { useEffect, useMemo, useState } from "react";
import { SlidersHorizontal, Search, X } from "lucide-react";
import { useSearchParams } from "react-router-dom";
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
  const [animKey, setAnimKey] = useState(0);

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

  const handleFilterChange = (slug: string) => {
    setActive(slug);
    setAnimKey((k) => k + 1);
  };

  return (
    <>
      {/* Hero Banner */}
      <section
        className="relative overflow-hidden"
        style={{ background: "#FAF7F4" }}
      >
        <div className="max-w-[1280px] mx-auto px-8 py-20 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <span
              style={{
                fontSize: "10px",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "#C9964A",
                fontWeight: 500,
              }}
            >
              Shop
            </span>
            <h1
              className="font-display mt-3"
              style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 300, lineHeight: 1.05 }}
            >
              The full{" "}
              <em className="not-italic" style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", color: "#C9964A" }}>
                collection
              </em>
              .
            </h1>
            <p className="mt-4" style={{ fontSize: "15px", color: "hsl(25 10% 46%)", lineHeight: 1.7, maxWidth: "400px" }}>
              Handcrafted resin keepsakes, every piece poured, set and finished by hand.
            </p>
          </div>
          <div className="flex items-center justify-center">
            <img
              src={catWedding}
              alt="Wedding keepsake resin art"
              className="w-full max-w-[380px] rounded-2xl object-cover shadow-lg"
              style={{ aspectRatio: "4/5" }}
            />
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20">
        <div className="max-w-[1280px] mx-auto px-8">

          {/* Filters bar */}
          <div className="flex flex-col gap-4 mb-12">
            {/* Search */}
            <div className="relative max-w-sm">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                type="search"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search products…"
                className="w-full pl-11 pr-10 py-3 rounded-full border border-[#e5e0d8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C9964A]/30 transition-shadow"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Category pills */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleFilterChange("all")}
                  className="px-5 py-2.5 rounded-full text-xs tracking-[0.08em] uppercase font-medium transition-all duration-300"
                  style={active === "all"
                    ? { background: "#3D2B1F", color: "#fff" }
                    : { border: "1px solid #e5e0d8", background: "transparent", color: "#3D2B1F" }
                  }
                  onMouseEnter={(e) => {
                    if (active !== "all") e.currentTarget.style.background = "#FAF7F4";
                  }}
                  onMouseLeave={(e) => {
                    if (active !== "all") e.currentTarget.style.background = "transparent";
                  }}
                >
                  All
                </button>
                {cats.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleFilterChange(c.slug)}
                    className="px-5 py-2.5 rounded-full text-xs tracking-[0.08em] uppercase font-medium transition-all duration-300"
                    style={active === c.slug
                      ? { background: "#3D2B1F", color: "#fff" }
                      : { border: "1px solid #e5e0d8", background: "transparent", color: "#3D2B1F" }
                    }
                    onMouseEnter={(e) => {
                      if (active !== c.slug) e.currentTarget.style.background = "#FAF7F4";
                    }}
                    onMouseLeave={(e) => {
                      if (active !== c.slug) e.currentTarget.style.background = "transparent";
                    }}
                  >
                    {c.name}
                  </button>
                ))}
              </div>

              {/* Sort + count */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>{filtered.length} item{filtered.length !== 1 && "s"}</span>
                </div>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as typeof sort)}
                  className="px-4 py-2.5 rounded-full border border-[#e5e0d8] bg-white text-xs tracking-[0.06em] focus:outline-none focus:ring-2 focus:ring-[#C9964A]/30 cursor-pointer"
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products grid */}
          {error ? (
            <div className="text-center py-24">
              <p className="font-serif text-xl text-muted-foreground mb-2">Couldn't load products</p>
              <p className="text-sm text-muted-foreground/70 mb-6">Please check your connection and try again.</p>
              <button
                onClick={() => setRetryCount(c => c + 1)}
                className="px-6 py-3 rounded-full text-xs tracking-[0.1em] uppercase"
                style={{ background: "#3D2B1F", color: "#FAF7F4" }}
              >
                Retry
              </button>
            </div>
          ) : loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-xl bg-gray-100 animate-pulse" style={{ aspectRatio: "1/1" }} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <p className="font-serif text-xl text-muted-foreground mb-2">No products found</p>
              <p className="text-sm text-muted-foreground/70">Try a different category or search term</p>
              <button
                onClick={() => { setActive("all"); setSearch(""); }}
                className="mt-6 px-6 py-3 rounded-full text-xs tracking-[0.1em] uppercase"
                style={{ background: "#3D2B1F", color: "#FAF7F4" }}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div key={animKey} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p, i) => <ProductCard key={p.id} p={p} index={i} />)}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default ShopPage;
