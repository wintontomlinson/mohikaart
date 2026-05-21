import { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { products, CATEGORIES } from "@/lib/products";
import ProductCard from "@/components/site/ProductCard";
import ProductDetailModal from "@/components/site/ProductDetailModal";
import { Product } from "@/lib/products";

const sortOptions = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "low-high" },
  { label: "Price: High to Low", value: "high-low" },
  { label: "Newest", value: "newest" },
  { label: "Best Selling", value: "best-selling" },
];

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("cat") || "all";
  const [sort, setSort] = useState("featured");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filtered = useMemo(() => {
    let list = activeCategory === "all"
      ? [...products]
      : products.filter((p) => p.categorySlug === activeCategory);

    switch (sort) {
      case "low-high": list.sort((a, b) => a.price - b.price); break;
      case "high-low": list.sort((a, b) => b.price - a.price); break;
      case "newest": list.sort((a, b) => (a.badge === "NEW" ? -1 : b.badge === "NEW" ? 1 : 0)); break;
      case "best-selling": list.sort((a, b) => b.reviews - a.reviews); break;
      default: break;
    }
    return list;
  }, [activeCategory, sort]);

  const setCategory = (cat: string) => {
    if (cat === "all") {
      searchParams.delete("cat");
    } else {
      searchParams.set("cat", cat);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="pt-24 pb-20">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="text-sm text-[#1a1208]/40 mb-4">
          <Link to="/" className="hover:text-[#c9a84c]">Home</Link> &gt; <span className="text-[#1a1208]">Shop</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-serif text-[#1a1208] mb-3">Our Collection</h1>
        <p className="text-[#1a1208]/60 max-w-md">Handcrafted with love, personalized just for you</p>
        <div className="flex items-center gap-6 mt-4 text-xs text-[#1a1208]/50">
          <span>2000+ Orders</span>
          <span>4.9★ Rating</span>
          <span>3 Yrs Crafting</span>
        </div>
      </div>

      {/* Sticky Filter Bar */}
      <div className="sticky top-16 md:top-20 z-30 bg-[#fdf9f0]/95 backdrop-blur-md border-y border-[#c9a84c]/10 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              <button
                onClick={() => setCategory("all")}
                className={`px-4 py-2 text-xs font-medium rounded-full whitespace-nowrap transition-colors ${
                  activeCategory === "all"
                    ? "bg-[#1a1208] text-[#fdf9f0]"
                    : "bg-white border border-[#1a1208]/10 text-[#1a1208]/70 hover:border-[#c9a84c]"
                }`}
              >
                All
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => setCategory(cat.slug)}
                  className={`px-4 py-2 text-xs font-medium rounded-full whitespace-nowrap transition-colors ${
                    activeCategory === cat.slug
                      ? "bg-[#1a1208] text-[#fdf9f0]"
                      : "bg-white border border-[#1a1208]/10 text-[#1a1208]/70 hover:border-[#c9a84c]"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Sort + count */}
            <div className="hidden md:flex items-center gap-4">
              <span className="text-xs text-[#1a1208]/40">{filtered.length} products</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="text-xs border border-[#1a1208]/10 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-[#c9a84c]"
              >
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filtered.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[#1a1208]/40">No products found in this category</p>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="mt-20 py-16 bg-[#1a1208]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-serif text-[#fdf9f0] mb-4">
            Can't find what you're looking for?
          </h2>
          <Link
            to="/custom-order"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#c9a84c] text-[#1a1208] text-sm font-semibold tracking-wider rounded-full hover:bg-[#b8933f] transition-colors"
          >
            Request Custom Order &rarr;
          </Link>
        </div>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </div>
  );
};

export default Shop;
