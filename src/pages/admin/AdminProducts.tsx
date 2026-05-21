import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { resolveImage, formatINR } from "@/lib/site";
import {
  Plus, Search, X, Filter, MoreHorizontal, Star, StarOff,
  Trash2, Copy, ArrowUpDown, ChevronDown, Package, Download,
  CheckSquare, Square, Pencil, Eye, EyeOff, AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import ConfirmModal from "@/components/admin/ConfirmModal";
import EmptyState from "@/components/admin/EmptyState";
import ProductEditDrawer from "./ProductEditDrawer";

// ── Types ──────────────────────────────────────────────────────────────────────
export type Product = {
  id?: string;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  price: number;
  original_price: number | null;
  category_slug: string | null;
  image_url: string | null;
  gallery: string[];
  badge: string | null;
  featured: boolean;
  in_stock: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
};

export const emptyProduct: Product = {
  name: "", slug: "", short_description: "", description: "",
  price: 0, original_price: null, category_slug: null, image_url: null,
  gallery: [], badge: null, featured: false, in_stock: true, sort_order: 0,
};

type FilterState = "all" | "featured" | "in_stock" | "out_of_stock";
type SortKey = "name" | "price" | "sort_order" | "created_at";
type SortDir = "asc" | "desc";


// ── Helpers ────────────────────────────────────────────────────────────────────
const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const BADGE_COLORS: Record<string, { bg: string; text: string }> = {
  Bestseller: { bg: "bg-[#1a1208]", text: "text-[#c9a84c]" },
  New: { bg: "bg-[#c9a84c]/15", text: "text-[#8a6d2b]" },
  Popular: { bg: "bg-violet-50", text: "text-violet-700" },
  Premium: { bg: "bg-[#2d2015]", text: "text-[#c9a84c]" },
};

// ── Component ──────────────────────────────────────────────────────────────────
const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ slug: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filter, setFilter] = useState<FilterState>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey>("sort_order");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [bulkConfirm, setBulkConfirm] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);


  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 250);
    return () => clearTimeout(t);
  }, [search]);

  // Keyboard shortcut: / to focus search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "/" && !e.ctrlKey && !e.metaKey && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  // ── Data fetching ──
  const loadProducts = useCallback(async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) { toast.error("Failed to load products"); return; }
    setProducts(
      (data ?? []).map((p: any) => ({ ...p, gallery: Array.isArray(p.gallery) ? p.gallery : [] }))
    );
    setLoading(false);
  }, []);

  const loadCategories = useCallback(async () => {
    const { data } = await supabase.from("categories").select("slug,name").order("sort_order");
    setCategories((data ?? []) as { slug: string; name: string }[]);
  }, []);


  useEffect(() => { loadProducts(); loadCategories(); }, [loadProducts, loadCategories]);

  // ── Realtime subscription ──
  useEffect(() => {
    const channel = supabase
      .channel("admin-products-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, (payload) => {
        if (payload.eventType === "INSERT") {
          const p = { ...payload.new, gallery: Array.isArray(payload.new.gallery) ? payload.new.gallery : [] } as Product;
          setProducts((prev) => [...prev, p]);
        } else if (payload.eventType === "UPDATE") {
          const p = { ...payload.new, gallery: Array.isArray(payload.new.gallery) ? payload.new.gallery : [] } as Product;
          setProducts((prev) => prev.map((x) => x.id === p.id ? p : x));
        } else if (payload.eventType === "DELETE") {
          setProducts((prev) => prev.filter((x) => x.id !== payload.old.id));
          setSelected((prev) => { const next = new Set(prev); next.delete(payload.old.id); return next; });
        }
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  // ── Filtering & Sorting ──
  const visible = useMemo(() => {
    let list = [...products];

    // Text search
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      list = list.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        (p.short_description?.toLowerCase().includes(q))
      );
    }


    // Status filter
    if (filter === "featured") list = list.filter((p) => p.featured);
    else if (filter === "in_stock") list = list.filter((p) => p.in_stock);
    else if (filter === "out_of_stock") list = list.filter((p) => !p.in_stock);

    // Category filter
    if (categoryFilter !== "all") {
      list = list.filter((p) => p.category_slug === categoryFilter);
    }

    // Sort
    list.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name") cmp = a.name.localeCompare(b.name);
      else if (sortKey === "price") cmp = a.price - b.price;
      else if (sortKey === "sort_order") cmp = a.sort_order - b.sort_order;
      else if (sortKey === "created_at") cmp = (a.created_at ?? "").localeCompare(b.created_at ?? "");
      return sortDir === "asc" ? cmp : -cmp;
    });

    return list;
  }, [products, debouncedSearch, filter, categoryFilter, sortKey, sortDir]);

  // ── Actions ──
  const toggleFeatured = async (p: Product) => {
    const { error } = await supabase.from("products").update({ featured: !p.featured }).eq("id", p.id!);
    if (error) return toast.error(error.message);
    setProducts((prev) => prev.map((x) => x.id === p.id ? { ...x, featured: !p.featured } : x));
    toast.success(p.featured ? "Removed from featured" : "Marked as featured");
  };

  const toggleStock = async (p: Product) => {
    const { error } = await supabase.from("products").update({ in_stock: !p.in_stock }).eq("id", p.id!);
    if (error) return toast.error(error.message);
    setProducts((prev) => prev.map((x) => x.id === p.id ? { ...x, in_stock: !p.in_stock } : x));
  };


  const deleteProduct = async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Product deleted");
    setConfirmDelete(null);
    setSelected((prev) => { const n = new Set(prev); n.delete(id); return n; });
  };

  const duplicateProduct = async (p: Product) => {
    const { id, created_at, updated_at, ...rest } = p as any;
    const { error } = await supabase.from("products").insert({
      ...rest,
      name: `${p.name} (Copy)`,
      slug: `${p.slug}-copy-${Date.now().toString(36).slice(-4)}`,
      featured: false,
    });
    if (error) return toast.error(error.message);
    toast.success("Product duplicated");
  };

  // ── Bulk Actions ──
  const bulkDelete = async () => {
    if (selected.size === 0) return;
    const { error } = await supabase.from("products").delete().in("id", Array.from(selected));
    if (error) return toast.error(error.message);
    toast.success(`Deleted ${selected.size} product${selected.size > 1 ? "s" : ""}`);
    setSelected(new Set());
    setBulkConfirm(false);
  };

  const bulkToggleStock = async (in_stock: boolean) => {
    const { error } = await supabase.from("products").update({ in_stock }).in("id", Array.from(selected));
    if (error) return toast.error(error.message);
    toast.success(`Updated ${selected.size} product${selected.size > 1 ? "s" : ""}`);
    setProducts((prev) => prev.map((x) => selected.has(x.id!) ? { ...x, in_stock } : x));
    setSelected(new Set());
  };

  const bulkToggleFeatured = async (featured: boolean) => {
    const { error } = await supabase.from("products").update({ featured }).in("id", Array.from(selected));
    if (error) return toast.error(error.message);
    toast.success(`Updated ${selected.size} product${selected.size > 1 ? "s" : ""}`);
    setProducts((prev) => prev.map((x) => selected.has(x.id!) ? { ...x, featured } : x));
    setSelected(new Set());
  };


  // ── Selection helpers ──
  const toggleSelect = (id: string) => {
    setSelected((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };
  const toggleAll = () => {
    if (selected.size === visible.length) setSelected(new Set());
    else setSelected(new Set(visible.map((p) => p.id!)));
  };
  const allSelected = visible.length > 0 && selected.size === visible.length;

  // ── Sort toggle ──
  const cycleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  // ── Stats ──
  const stats = useMemo(() => ({
    total: products.length,
    featured: products.filter((p) => p.featured).length,
    inStock: products.filter((p) => p.in_stock).length,
    outOfStock: products.filter((p) => !p.in_stock).length,
  }), [products]);

  // ── Render ──
  return (
    <div className="pb-24 lg:pb-0 -mt-2">
      {/* ── Sticky Header ── */}
      <div className="sticky top-0 z-20 -mx-4 lg:-mx-8 px-4 lg:px-8 pt-2 pb-4 bg-[hsl(36_42%_97%)]/95 backdrop-blur-md border-b border-transparent"
        style={{ borderColor: "rgba(229,224,216,0.4)" }}>
        {/* Title row */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="font-display text-2xl lg:text-3xl tracking-tight" style={{ color: "#1a1208" }}>
              Products
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <Stat label="Total" value={stats.total} />
              <span className="text-[#e5e0d8]">·</span>
              <Stat label="Featured" value={stats.featured} accent />
              <span className="text-[#e5e0d8]">·</span>
              <Stat label="Out" value={stats.outOfStock} warn={stats.outOfStock > 0} />
            </div>
          </div>
          <button
            onClick={() => setEditingProduct({ ...emptyProduct, gallery: [] })}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: "#1a1208", color: "#fdf9f0" }}
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>


        {/* Search + Filters row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
            <input
              ref={searchRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products…  /"
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-white border border-[#e5e0d8]/80 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/15 outline-none text-sm transition-all placeholder:text-muted-foreground/40 shadow-sm"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Status pills */}
            {(["all", "featured", "in_stock", "out_of_stock"] as FilterState[]).map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  filter === f
                    ? "border-[#1a1208] bg-[#1a1208] text-[#fdf9f0] shadow-sm"
                    : "border-[#e5e0d8] text-[#5c4a3a] hover:border-[#c9a84c]/40 bg-white"
                }`}
              >
                {f === "all" ? "All" : f === "featured" ? "Featured" : f === "in_stock" ? "In Stock" : "Out"}
              </button>
            ))}

            {/* Category dropdown */}
            <div className="relative">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="appearance-none pl-3 pr-7 py-1.5 rounded-lg text-xs font-medium border border-[#e5e0d8] bg-white text-[#5c4a3a] hover:border-[#c9a84c]/40 outline-none cursor-pointer transition-all"
              >
                <option value="all">All Categories</option>
                {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground/50 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>


      {/* ── Bulk Actions Bar ── */}
      {selected.size > 0 && (
        <div className="mt-4 p-3 px-4 rounded-xl bg-[#1a1208] text-[#fdf9f0] flex items-center justify-between flex-wrap gap-3 shadow-lg animate-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-[#c9a84c]" />
            <span className="text-sm font-medium">{selected.size} selected</span>
          </div>
          <div className="flex items-center gap-2">
            <BulkBtn onClick={() => bulkToggleStock(true)} label="Enable" />
            <BulkBtn onClick={() => bulkToggleStock(false)} label="Disable" />
            <BulkBtn onClick={() => bulkToggleFeatured(true)} label="Feature" />
            <BulkBtn onClick={() => bulkToggleFeatured(false)} label="Unfeature" />
            <button onClick={() => setBulkConfirm(true)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors">
              Delete
            </button>
            <button onClick={() => setSelected(new Set())}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#fdf9f0]/60 hover:text-[#fdf9f0] transition-colors">
              Clear
            </button>
          </div>
        </div>
      )}


      {/* ── Content ── */}
      {loading ? (
        <div className="mt-6 space-y-0 rounded-2xl bg-white border border-[#e5e0d8]/60 overflow-hidden shadow-sm">
          {[...Array(6)].map((_, i) => <TableRowSkeleton key={i} />)}
        </div>
      ) : products.length === 0 ? (
        <div className="mt-12">
          <EmptyState
            icon={Package}
            title="No products yet"
            description="Add your first product to start building your catalogue."
            action={{ label: "Add Product", onClick: () => setEditingProduct({ ...emptyProduct, gallery: [] }) }}
          />
        </div>
      ) : visible.length === 0 ? (
        <div className="mt-12">
          <EmptyState
            icon={Search}
            title="No results"
            description="Try adjusting your search or filters to find what you're looking for."
          />
        </div>
      ) : (
        <>
          {/* ── Desktop Table ── */}
          <div className="hidden md:block mt-6 rounded-2xl bg-white border border-[#e5e0d8]/60 overflow-hidden shadow-sm">
            {/* Table Header */}
            <div className="grid grid-cols-[40px_1fr_140px_100px_100px_80px_44px] items-center px-4 py-3 border-b border-[#e5e0d8]/40 bg-[#fdf9f0]/50">
              <div className="flex items-center justify-center">
                <button onClick={toggleAll} className="text-muted-foreground hover:text-foreground transition-colors">
                  {allSelected ? <CheckSquare className="w-4 h-4 text-[#c9a84c]" /> : <Square className="w-4 h-4" />}
                </button>
              </div>
              <SortHeader label="Product" sortKey="name" current={sortKey} dir={sortDir} onSort={cycleSort} />
              <SortHeader label="Price" sortKey="price" current={sortKey} dir={sortDir} onSort={cycleSort} />
              <div className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Status</div>
              <div className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Featured</div>
              <SortHeader label="Order" sortKey="sort_order" current={sortKey} dir={sortDir} onSort={cycleSort} />
              <div />
            </div>


            {/* Table Rows */}
            {visible.map((p) => (
              <div key={p.id}
                className={`grid grid-cols-[40px_1fr_140px_100px_100px_80px_44px] items-center px-4 py-3 border-b border-[#e5e0d8]/20 hover:bg-[#fdf9f0]/40 transition-colors group ${
                  selected.has(p.id!) ? "bg-[#c9a84c]/5" : ""
                }`}
              >
                {/* Checkbox */}
                <div className="flex items-center justify-center">
                  <button onClick={() => toggleSelect(p.id!)} className="text-muted-foreground hover:text-foreground transition-colors">
                    {selected.has(p.id!) ? <CheckSquare className="w-4 h-4 text-[#c9a84c]" /> : <Square className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />}
                  </button>
                </div>

                {/* Product info */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#f8f5f0] border border-[#e5e0d8]/60 shrink-0">
                    <img src={resolveImage(p.image_url)} alt="" className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate" style={{ color: "#1a1208" }}>{p.name}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] text-muted-foreground truncate">{p.category_slug?.replace(/-/g, " ") || "No category"}</span>
                      {p.badge && (
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider ${BADGE_COLORS[p.badge]?.bg || "bg-gray-100"} ${BADGE_COLORS[p.badge]?.text || "text-gray-700"}`}>
                          {p.badge}
                        </span>
                      )}
                    </div>
                  </div>
                </div>


                {/* Price */}
                <div>
                  <span className="text-sm font-semibold" style={{ color: "#1a1208" }}>{formatINR(p.price)}</span>
                  {p.original_price && p.original_price > p.price && (
                    <span className="ml-2 text-xs line-through text-muted-foreground">{formatINR(p.original_price)}</span>
                  )}
                </div>

                {/* Stock Toggle */}
                <div>
                  <Toggle active={p.in_stock} onToggle={() => toggleStock(p)} labelOn="Live" labelOff="Off" />
                </div>

                {/* Featured Toggle */}
                <div>
                  <Toggle active={p.featured} onToggle={() => toggleFeatured(p)} labelOn="Yes" labelOff="No" accent />
                </div>

                {/* Sort order */}
                <div className="text-xs text-muted-foreground font-mono">{p.sort_order}</div>

                {/* Actions */}
                <div className="relative">
                  <RowActions
                    onEdit={() => setEditingProduct({ ...p, gallery: p.gallery ?? [] })}
                    onDuplicate={() => duplicateProduct(p)}
                    onDelete={() => setConfirmDelete(p.id!)}
                  />
                </div>
              </div>
            ))}
          </div>


          {/* ── Mobile Cards ── */}
          <div className="md:hidden mt-4 space-y-3">
            {/* Select all */}
            <div className="flex items-center justify-between px-1">
              <button onClick={toggleAll} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
                {allSelected ? <CheckSquare className="w-3.5 h-3.5 text-[#c9a84c]" /> : <Square className="w-3.5 h-3.5" />}
                {allSelected ? "Deselect all" : "Select all"}
              </button>
              <span className="text-[11px] text-muted-foreground">{visible.length} product{visible.length !== 1 ? "s" : ""}</span>
            </div>

            {visible.map((p) => (
              <div key={p.id}
                className={`rounded-xl bg-white border overflow-hidden transition-all ${
                  selected.has(p.id!) ? "border-[#c9a84c]/50 shadow-md" : "border-[#e5e0d8]/60 shadow-sm"
                }`}
              >
                <div className="flex gap-3 p-3">
                  {/* Thumbnail */}
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-[#f8f5f0] shrink-0">
                    <img src={resolveImage(p.image_url)} alt="" className="w-full h-full object-cover" loading="lazy" />
                    <button onClick={() => toggleSelect(p.id!)}
                      className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/10 transition-colors">
                      {selected.has(p.id!) && <CheckSquare className="w-5 h-5 text-[#c9a84c] drop-shadow" />}
                    </button>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="text-sm font-medium truncate" style={{ color: "#1a1208" }}>{p.name}</h3>
                        <p className="text-[11px] text-muted-foreground mt-0.5 capitalize">{p.category_slug?.replace(/-/g, " ") || "No category"}</p>
                      </div>
                      <RowActions
                        onEdit={() => setEditingProduct({ ...p, gallery: p.gallery ?? [] })}
                        onDuplicate={() => duplicateProduct(p)}
                        onDelete={() => setConfirmDelete(p.id!)}
                      />
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-sm font-semibold" style={{ color: "#1a1208" }}>{formatINR(p.price)}</span>
                      <Toggle active={p.in_stock} onToggle={() => toggleStock(p)} labelOn="Live" labelOff="Off" small />
                      <Toggle active={p.featured} onToggle={() => toggleFeatured(p)} labelOn="★" labelOff="☆" accent small />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}


      {/* ── Modals ── */}
      <ConfirmModal
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => confirmDelete && deleteProduct(confirmDelete)}
        title="Delete Product"
        description="This product will be permanently removed. This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
      />
      <ConfirmModal
        open={bulkConfirm}
        onClose={() => setBulkConfirm(false)}
        onConfirm={bulkDelete}
        title={`Delete ${selected.size} product${selected.size > 1 ? "s" : ""}?`}
        description="These products will be permanently removed. This action cannot be undone."
        confirmLabel="Delete All"
        variant="danger"
      />

      {/* ── Edit Drawer ── */}
      <ProductEditDrawer
        product={editingProduct}
        categories={categories}
        onClose={() => setEditingProduct(null)}
        onSaved={() => { setEditingProduct(null); loadProducts(); }}
      />
    </div>
  );
};

export default AdminProducts;


// ── Sub-components ─────────────────────────────────────────────────────────────

const Stat = ({ label, value, accent, warn }: { label: string; value: number; accent?: boolean; warn?: boolean }) => (
  <span className={`text-xs ${warn ? "text-red-500" : accent ? "text-[#c9a84c]" : "text-muted-foreground"}`}>
    <span className="font-semibold">{value}</span> {label}
  </span>
);

const BulkBtn = ({ onClick, label }: { onClick: () => void; label: string }) => (
  <button onClick={onClick}
    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/10 text-[#fdf9f0]/90 hover:bg-white/20 transition-colors">
    {label}
  </button>
);

const Toggle = ({ active, onToggle, labelOn, labelOff, accent, small }: {
  active: boolean; onToggle: () => void; labelOn: string; labelOff: string; accent?: boolean; small?: boolean;
}) => (
  <button onClick={onToggle}
    className={`inline-flex items-center gap-1.5 ${small ? "px-2 py-0.5" : "px-2.5 py-1"} rounded-full text-[10px] font-semibold border transition-all ${
      active
        ? accent
          ? "border-[#c9a84c]/40 bg-[#c9a84c]/10 text-[#8a6d2b]"
          : "border-emerald-200 bg-emerald-50 text-emerald-700"
        : "border-[#e5e0d8] bg-[#f8f5f0] text-muted-foreground hover:border-[#c9a84c]/30"
    }`}
  >
    <span className={`w-1.5 h-1.5 rounded-full ${active ? (accent ? "bg-[#c9a84c]" : "bg-emerald-500") : "bg-[#e5e0d8]"}`} />
    {active ? labelOn : labelOff}
  </button>
);


const SortHeader = ({ label, sortKey: key, current, dir, onSort }: {
  label: string; sortKey: SortKey; current: SortKey; dir: SortDir; onSort: (k: SortKey) => void;
}) => (
  <button onClick={() => onSort(key)}
    className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-semibold text-muted-foreground hover:text-foreground transition-colors">
    {label}
    <ArrowUpDown className={`w-3 h-3 ${current === key ? "text-[#c9a84c]" : "opacity-30"}`} />
    {current === key && <span className="text-[8px] text-[#c9a84c]">{dir === "asc" ? "↑" : "↓"}</span>}
  </button>
);

const RowActions = ({ onEdit, onDuplicate, onDelete }: { onEdit: () => void; onDuplicate: () => void; onDelete: () => void }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)}
        className="w-7 h-7 rounded-lg hover:bg-[#f5f0e8] flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
        <MoreHorizontal className="w-4 h-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-8 z-50 w-36 bg-white rounded-xl border border-[#e5e0d8]/80 shadow-xl py-1 animate-in fade-in zoom-in-95 duration-150">
          <DropItem icon={Pencil} label="Edit" onClick={() => { onEdit(); setOpen(false); }} />
          <DropItem icon={Copy} label="Duplicate" onClick={() => { onDuplicate(); setOpen(false); }} />
          <div className="my-1 border-t border-[#e5e0d8]/40" />
          <DropItem icon={Trash2} label="Delete" onClick={() => { onDelete(); setOpen(false); }} danger />
        </div>
      )}
    </div>
  );
};


const DropItem = ({ icon: Icon, label, onClick, danger }: { icon: any; label: string; onClick: () => void; danger?: boolean }) => (
  <button onClick={onClick}
    className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs transition-colors ${
      danger ? "text-red-600 hover:bg-red-50" : "text-[#3d2b1f] hover:bg-[#f8f5f0]"
    }`}>
    <Icon className="w-3.5 h-3.5" /> {label}
  </button>
);

const TableRowSkeleton = () => (
  <div className="grid grid-cols-[40px_1fr_140px_100px_100px_80px_44px] items-center px-4 py-3 border-b border-[#e5e0d8]/20 animate-pulse">
    <div className="flex justify-center"><div className="w-4 h-4 rounded bg-[#e8e2d8]/60" /></div>
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg bg-[#e8e2d8]/60" />
      <div className="space-y-1.5">
        <div className="h-3.5 w-32 rounded bg-[#e8e2d8]/60" />
        <div className="h-2.5 w-20 rounded bg-[#e8e2d8]/40" />
      </div>
    </div>
    <div className="h-3.5 w-16 rounded bg-[#e8e2d8]/60" />
    <div className="h-5 w-12 rounded-full bg-[#e8e2d8]/60" />
    <div className="h-5 w-10 rounded-full bg-[#e8e2d8]/60" />
    <div className="h-3 w-8 rounded bg-[#e8e2d8]/40" />
    <div />
  </div>
);
