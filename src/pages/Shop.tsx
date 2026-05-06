import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, Search, X } from "lucide-react";
import PageHeader from "@/components/site/PageHeader";
import { ProductCard, Product } from "@/components/site/ProductCard";
import { supabase } from "@/integrations/supabase/client";

type Cat = { id: string; name: string; slug: string };

const ShopPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cats, setCats] = useState<Cat[]>([]);
  const [active, setActive] = useState<string>("all");
  const [sort, setSort] = useState<"featured" | "price-asc" | "price-desc">("featured");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from("products").select("id,slug,name,price,original_price,image_url,badge,short_description,category_slug").order("sort_order"),
      supabase.from("categories").select("id,name,slug").order("sort_order"),
    ]).then(([{ data: prods }, { data: catData }]) => {
      setProducts((prods ?? []) as Product[]);
      setCats((catData ?? []) as Cat[]);
      setLoading(false);
    });
  }, []);

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

  return (
    <>
      <PageHeader
        eyebrow="Shop"
        title={<>The full <em className="not-italic text-gold-grad">collection</em>.</>}
        subtitle="Handcrafted resin keepsakes, every piece poured, set and finished by hand."
      />

      <section className="py-12 md:py-16">
        <div className="container">

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
                className="w-full pl-11 pr-10 py-3 rounded-full border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 transition-shadow"
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
                  onClick={() => setActive("all")}
                  className={`px-5 py-2.5 rounded-full text-xs tracking-[0.08em] uppercase font-medium transition-all duration-300 ${active === "all" ? "bg-foreground text-background shadow-soft" : "glass hover:shadow-soft"}`}
                >
                  All
                </button>
                {cats.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setActive(c.slug)}
                    className={`px-5 py-2.5 rounded-full text-xs tracking-[0.08em] uppercase font-medium transition-all duration-300 ${active === c.slug ? "bg-foreground text-background shadow-soft" : "glass hover:shadow-soft"}`}
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
                  className="px-4 py-2.5 rounded-full border border-border bg-background text-xs tracking-[0.06em] focus:outline-none focus:ring-2 focus:ring-gold/30 cursor-pointer"
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products grid */}
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
              >
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="rounded-3xl bg-muted/40 aspect-[4/5] animate-pulse" />
                ))}
              </motion.div>
            ) : filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-24"
              >
                <div className="w-16 h-16 rounded-full bg-blush/30 flex items-center justify-center mx-auto mb-4">
                  <Search className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="font-serif text-xl text-muted-foreground mb-2">No products found</p>
                <p className="text-sm text-muted-foreground/70">Try a different category or search term</p>
                <button
                  onClick={() => { setActive("all"); setSearch(""); }}
                  className="mt-6 px-6 py-3 rounded-full bg-foreground text-background text-xs tracking-[0.1em] uppercase"
                >
                  Clear Filters
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
              >
                {filtered.map((p, i) => <ProductCard key={p.id} p={p} index={i} />)}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </>
  );
};

export default ShopPage;
