import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { resolveImage, formatINR } from "@/lib/site";
import { Pencil, Trash2, Plus, X, Save, ImagePlus, Star, Search, Copy, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import ImageUpload from "./ImageUpload";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { ProductCardSkeleton } from "@/components/admin/Skeleton";
import EmptyState from "@/components/admin/EmptyState";

type Product = {
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
  stock_qty: number;
  sort_order: number;
};

const empty: Product = {
  name: "", slug: "", short_description: "", description: "",
  price: 0, original_price: null, category_slug: null, image_url: null,
  gallery: [], badge: null, featured: false, in_stock: true, stock_qty: 0, sort_order: 0,
};

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const BADGE_STYLES: Record<string, { bg: string; color: string }> = {
  Bestseller: { bg: "#1a1208", color: "#c9a84c" },
  New: { bg: "#c9a84c", color: "#1a1208" },
  Popular: { bg: "#f5e6f0", color: "#1a1208" },
  Premium: { bg: "#2d2015", color: "#c9a84c" },
};

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cats, setCats] = useState<{ slug: string; name: string }[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "featured" | "in" | "out">("all");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const load = async () => {
    try {
      const { data } = await supabase.from("products").select("*").order("sort_order");
      setProducts((data ?? []).map((p: any) => ({ ...p, gallery: Array.isArray(p.gallery) ? p.gallery : [], stock_qty: p.stock_qty ?? 0 })) as Product[]);
    } catch {}
    setLoading(false);
    setSelected(new Set());
  };

  useEffect(() => {
    load();
    supabase.from("categories").select("slug,name").order("sort_order").then(({ data }) => setCats((data ?? []) as any)).catch(() => {});
  }, []);

  const onSave = async () => {
    if (!editing) return;
    if (!editing.name.trim()) { toast.error("Name is required"); return; }
    const payload = { ...editing, slug: editing.slug || slugify(editing.name), price: Number(editing.price) || 0, original_price: editing.original_price ? Number(editing.original_price) : null, sort_order: Number(editing.sort_order) || 0 };
    setSaving(true);
    const { error } = editing.id ? await supabase.from("products").update(payload).eq("id", editing.id) : await supabase.from("products").insert(payload);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success(editing.id ? "Product updated" : "Product created");
    setEditing(null); load();
  };

  const onDelete = async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted"); setConfirmDelete(null); load();
  };

  const onDuplicate = async (p: Product) => {
    const { id, ...rest } = p;
    delete (rest as any).created_at; delete (rest as any).updated_at;
    const { error } = await supabase.from("products").insert({ ...rest, name: `${p.name} (Copy)`, slug: `${p.slug}-copy-${Date.now().toString(36).slice(-4)}`, featured: false });
    if (error) return toast.error(error.message);
    toast.success("Duplicated"); load();
  };

  const toggleFeatured = async (p: Product) => {
    const { error } = await supabase.from("products").update({ featured: !p.featured }).eq("id", p.id!);
    if (error) return toast.error(error.message);
    setProducts((prev) => prev.map((x) => (x.id === p.id ? { ...x, featured: !p.featured } : x)));
  };

  const toggleStock = async (p: Product) => {
    const { error } = await supabase.from("products").update({ in_stock: !p.in_stock }).eq("id", p.id!);
    if (error) return toast.error(error.message);
    setProducts((prev) => prev.map((x) => (x.id === p.id ? { ...x, in_stock: !p.in_stock } : x)));
  };

  const visible = products.filter((p) => {
    if (debouncedSearch && !p.name.toLowerCase().includes(debouncedSearch.toLowerCase()) && !p.slug.toLowerCase().includes(debouncedSearch.toLowerCase())) return false;
    if (filter === "featured" && !p.featured) return false;
    if (filter === "out") return !p.in_stock;
    if (filter === "in") return p.in_stock;
    return true;
  });

  const toggleSelect = (id: string) => {
    setSelected((prev) => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  };
  const toggleAll = () => {
    if (selected.size === visible.length) setSelected(new Set());
    else setSelected(new Set(visible.map((p) => p.id!)));
  };
  const onBulkDelete = async () => {
    if (selected.size === 0) return;
    setBulkDeleting(true);
    const { error } = await supabase.from("products").delete().in("id", Array.from(selected));
    setBulkDeleting(false);
    if (error) return toast.error(error.message);
    toast.success(`Deleted ${selected.size} products`); load();
  };
  const onBulkToggleStock = async (in_stock: boolean) => {
    const { error } = await supabase.from("products").update({ in_stock }).in("id", Array.from(selected));
    if (error) return toast.error(error.message);
    toast.success(`Updated ${selected.size} products`); load();
  };

  const getDiscount = (p: Product) => {
    if (!p.original_price || p.original_price <= p.price) return 0;
    return Math.round(((p.original_price - p.price) / p.original_price) * 100);
  };

  return (
    <div className="pb-24 lg:pb-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl" style={{ color: "#1a1208" }}>Products</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {products.length} total · {products.filter((p) => p.featured).length} featured · {products.filter((p) => !p.in_stock).length} out of stock
          </p>
        </div>
        <button onClick={() => setEditing({ ...empty, gallery: [] })}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg transition-all hover:scale-[1.02]"
          style={{ background: "#1a1208", color: "#fdf9f0" }}>
          <Plus className="w-4 h-4" /> New Product
        </button>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/80 backdrop-blur border border-[#e5e0d8]/60 flex-1 max-w-md shadow-sm">
          <Search className="w-4 h-4 text-muted-foreground/60 shrink-0" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products…"
            className="flex-1 outline-none bg-transparent text-sm placeholder:text-muted-foreground/50" />
          {search && <button onClick={() => setSearch("")} className="text-muted-foreground hover:text-foreground"><X className="w-3.5 h-3.5" /></button>}
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {[{ id: "all", label: "All" }, { id: "featured", label: "Featured" }, { id: "in", label: "In Stock" }, { id: "out", label: "Out of Stock" }].map((f) => (
            <button key={f.id} onClick={() => setFilter(f.id as any)}
              className={`px-3.5 py-1.5 rounded-full text-[11px] uppercase tracking-wider font-semibold border transition-all ${
                filter === f.id ? "border-[#1a1208] bg-[#1a1208] text-[#fdf9f0]" : "border-[#e5e0d8] text-muted-foreground hover:border-[#c9a84c]/50 bg-white/60"
              }`}>{f.label}</button>
          ))}
        </div>
      </div>

      {/* Low Stock Alert */}
      {!loading && products.filter((p) => (p.stock_qty ?? 0) <= 5 && p.in_stock).length > 0 && (
        <div className="mb-6 bg-amber-50/80 backdrop-blur-xl rounded-2xl border border-amber-200/60 p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <h3 className="text-xs uppercase tracking-wider font-semibold text-amber-700">Low Stock Alert</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {products
              .filter((p) => (p.stock_qty ?? 0) <= 5 && p.in_stock)
              .map((p) => (
                <div key={p.id} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-amber-200 text-xs">
                  <span className="font-medium" style={{ color: "#1a1208" }}>{p.name}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                    (p.stock_qty ?? 0) <= 0 ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                  }`}>
                    {(p.stock_qty ?? 0) <= 0 ? "Out of Stock" : `${p.stock_qty} left`}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Product Grid — SAME STYLE AS FRONTEND */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      ) : visible.length === 0 ? (
        <EmptyState
          title={products.length === 0 ? "No products yet" : "No matches"}
          description={products.length === 0 ? "Add your first product to get started" : "Try adjusting your search or filters"}
          action={products.length === 0 ? { label: "Add Product", onClick: () => setEditing({ ...empty, gallery: [] }) } : undefined}
        />
      ) : (
        <>
          {/* Bulk actions */}
          {selected.size > 0 && (
            <div className="mb-4 p-3 rounded-xl bg-[#1a1208] border border-[#c9a84c]/30 flex items-center justify-between flex-wrap gap-2 sticky top-20 z-20 shadow-xl">
              <span className="text-sm font-medium text-white">{selected.size} product{selected.size > 1 ? "s" : ""} selected</span>
              <div className="flex gap-2">
                <button onClick={() => onBulkToggleStock(true)} className="px-3 py-1.5 rounded-lg text-[11px] font-semibold border border-emerald-400/50 bg-emerald-500 text-white hover:bg-emerald-600 transition-colors">Mark In Stock</button>
                <button onClick={() => onBulkToggleStock(false)} className="px-3 py-1.5 rounded-lg text-[11px] font-semibold border border-amber-400/50 bg-amber-500 text-white hover:bg-amber-600 transition-colors">Mark Out of Stock</button>
                <button onClick={onBulkDelete} className="px-3 py-1.5 rounded-lg text-[11px] font-semibold border border-red-400/50 bg-red-500 text-white hover:bg-red-600 transition-colors">Delete</button>
                <button onClick={() => setSelected(new Set())} className="px-3 py-1.5 rounded-lg text-[11px] font-medium text-white/70 hover:text-white transition-colors">Clear</button>
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {visible.map((p) => {
          const discount = getDiscount(p);
          return (
            <div key={p.id} className={`group relative bg-white/70 backdrop-blur rounded-2xl border overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${selected.has(p.id!) ? "border-[#c9a84c] ring-2 ring-[#c9a84c]/30" : "border-[#e5e0d8]/60 hover:border-[#c9a84c]/30"}`}>
              {/* Select checkbox */}
              <div className="absolute top-2 left-2 z-10" onClick={(e) => e.stopPropagation()}>
                <input type="checkbox" checked={selected.has(p.id!)} onChange={() => toggleSelect(p.id!)}
                  className={`w-5 h-5 rounded border-2 border-[#e5e0d8] bg-white/95 text-[#c9a84c] focus:ring-[#c9a84c]/30 cursor-pointer transition-all shadow-sm ${selected.size > 0 ? "opacity-100" : "opacity-0 group-hover:opacity-100"} checked:opacity-100`} />
              </div>
              {/* Image — click to select */}
              <div className="relative aspect-square overflow-hidden cursor-pointer" onClick={() => toggleSelect(p.id!)}>
                <img src={resolveImage(p.image_url)} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]" />
                {/* Badge */}
                {p.badge && (
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[8px] uppercase tracking-wider font-bold"
                    style={{ background: BADGE_STYLES[p.badge]?.bg || "#1a1208", color: BADGE_STYLES[p.badge]?.color || "#c9a84c" }}>
                    {p.badge}
                  </div>
                )}
                {/* Discount */}
                {discount > 0 && (
                  <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full text-[8px] font-bold bg-red-500 text-white">-{discount}%</div>
                )}
                {/* Stock badge */}
                {!p.in_stock && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="px-3 py-1 rounded-full bg-white/90 text-xs font-semibold" style={{ color: "#1a1208" }}>Out of Stock</span>
                  </div>
                )}
                {/* Stock qty badge */}
                {p.in_stock && (
                  <div className={`absolute bottom-2 left-2 px-1.5 py-0.5 rounded text-[8px] font-bold ${
                    (p.stock_qty ?? 0) <= 0
                      ? "bg-red-500 text-white"
                      : (p.stock_qty ?? 0) <= 5
                      ? "bg-amber-500 text-white"
                      : "bg-emerald-500/90 text-white"
                  }`}>
                    {(p.stock_qty ?? 0) <= 0 ? "0 qty" : `${p.stock_qty} qty`}
                  </div>
                )}
                {/* Hover actions */}
                <div className="absolute inset-x-2 bottom-2 flex gap-1.5 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  <button onClick={() => setEditing({ ...p, gallery: p.gallery ?? [] })} className="flex-1 py-2 rounded-full text-[9px] uppercase tracking-wider font-semibold flex items-center justify-center gap-1" style={{ background: "#1a1208", color: "#fdf9f0" }}>
                    <Pencil className="w-3 h-3" /> Edit
                  </button>
                  <button onClick={() => onDuplicate(p)} className="w-8 h-8 rounded-full bg-white/90 border border-[#e5e0d8] flex items-center justify-center hover:bg-white transition-colors">
                    <Copy className="w-3 h-3" style={{ color: "#1a1208" }} />
                  </button>
                  <button onClick={() => setConfirmDelete(p.id!)} className="w-8 h-8 rounded-full bg-white/90 border border-[#e5e0d8] flex items-center justify-center hover:bg-red-50 hover:border-red-200 transition-colors">
                    <Trash2 className="w-3 h-3 text-red-500" />
                  </button>
                </div>
              </div>

              {/* Card body */}
              <div className="p-3">
                <div className="text-[8px] uppercase tracking-[0.18em] font-semibold mb-0.5" style={{ color: "#c9a84c" }}>
                  {p.category_slug?.replace(/-/g, " ") || "Uncategorized"}
                </div>
                <h3 className="text-[12px] sm:text-[13px] font-medium leading-tight mb-1.5 line-clamp-2" style={{ color: "#1a1208" }}>{p.name}</h3>
                <div className="flex items-center gap-0.5 mb-1.5">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-2.5 h-2.5" style={{ fill: "#c9a84c", color: "#c9a84c" }} />)}
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-semibold text-[13px]" style={{ color: "#1a1208" }}>{formatINR(p.price)}</span>
                  {p.original_price && <span className="text-[10px] line-through text-muted-foreground">{formatINR(p.original_price)}</span>}
                </div>
                {/* Quick toggles */}
                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[#e5e0d8]/40">
                  <button onClick={() => toggleFeatured(p)} className={`text-[9px] px-2 py-0.5 rounded-full border transition-all ${p.featured ? "border-[#c9a84c] bg-[#c9a84c]/10 text-[#8a6d2b]" : "border-[#e5e0d8] text-muted-foreground hover:border-[#c9a84c]/50"}`}>
                    {p.featured ? "★ Featured" : "Feature"}
                  </button>
                  <button onClick={() => toggleStock(p)} className={`text-[9px] px-2 py-0.5 rounded-full border transition-all ${p.in_stock ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700"}`}>
                    {p.in_stock ? "In Stock" : "Out"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {visible.length === 0 && (
          <div className="col-span-full py-20 text-center text-muted-foreground text-sm">
            {products.length === 0 ? 'No products yet. Click "New Product" to add one.' : "No products match your filters."}
          </div>
        )}
      </div>
      </>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmModal
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => confirmDelete && onDelete(confirmDelete)}
        title="Delete Product"
        description="This product will be permanently removed from your store. This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
      />

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-6">
          <div className="bg-white w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-t-3xl md:rounded-3xl shadow-2xl border border-[#e5e0d8]/60">
            <div className="sticky top-0 bg-white border-b border-[#e5e0d8]/60 p-6 flex items-center justify-between z-10 rounded-t-3xl">
              <h2 className="font-display text-xl" style={{ color: "#1a1208" }}>{editing.id ? "Edit Product" : "New Product"}</h2>
              <button onClick={() => setEditing(null)} className="w-9 h-9 rounded-xl hover:bg-[#f5f0e8] flex items-center justify-center transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <ImageUpload value={editing.image_url} onChange={(url) => setEditing({ ...editing, image_url: url })} label="Main image" hint="Recommended: 1000×1000 px (square) · White/neutral background · JPG/WebP" />

              <div>
                <label className="block text-[11px] uppercase tracking-widest mb-3 text-muted-foreground font-medium">Gallery</label>
                <div className="flex flex-wrap gap-3">
                  {(editing.gallery ?? []).map((url, i) => (
                    <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-[#e5e0d8] group">
                      <img src={resolveImage(url)} alt="" className="w-full h-full object-cover" />
                      <button onClick={() => setEditing({ ...editing, gallery: editing.gallery.filter((_, j) => j !== i) })}
                        className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  ))}
                  <GalleryUpload onUploaded={(url) => setEditing({ ...editing, gallery: [...(editing.gallery ?? []), url] })} />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Name"><input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value, slug: editing.slug || slugify(e.target.value) })} className={inp} placeholder="Product name" /></Field>
                <Field label="Slug"><input value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: slugify(e.target.value) })} className={inp} /></Field>
              </div>
              <Field label="Short description"><input value={editing.short_description ?? ""} onChange={(e) => setEditing({ ...editing, short_description: e.target.value })} className={inp} /></Field>
              <Field label="Description"><textarea rows={4} value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className={inp + " resize-none"} /></Field>
              <div className="grid sm:grid-cols-3 gap-4">
                <Field label="Price (₹)"><input type="number" value={editing.price} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })} className={inp} /></Field>
                <Field label="Original Price"><input type="number" value={editing.original_price ?? ""} onChange={(e) => setEditing({ ...editing, original_price: e.target.value ? Number(e.target.value) : null })} className={inp} /></Field>
                <Field label="Sort Order"><input type="number" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} className={inp} /></Field>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Stock Quantity"><input type="number" value={editing.stock_qty ?? 0} onChange={(e) => setEditing({ ...editing, stock_qty: Number(e.target.value) })} className={inp} placeholder="0" /></Field>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Category"><select value={editing.category_slug ?? ""} onChange={(e) => setEditing({ ...editing, category_slug: e.target.value || null })} className={inp}>
                  <option value="">None</option>{cats.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                </select></Field>
                <Field label="Badge"><select value={editing.badge ?? ""} onChange={(e) => setEditing({ ...editing, badge: e.target.value || null })} className={inp}>
                  <option value="">None</option><option value="Bestseller">Bestseller</option><option value="New">New</option><option value="Popular">Popular</option><option value="Premium">Premium</option>
                </select></Field>
              </div>
              <div className="flex flex-wrap gap-5">
                <label className="inline-flex items-center gap-2.5 text-sm cursor-pointer" style={{ color: "#3d2b1f" }}>
                  <input type="checkbox" checked={editing.featured} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} className="w-4 h-4 rounded border-[#e5e0d8] text-[#c9a84c] focus:ring-[#c9a84c]/30" /> Featured
                </label>
                <label className="inline-flex items-center gap-2.5 text-sm cursor-pointer" style={{ color: "#3d2b1f" }}>
                  <input type="checkbox" checked={editing.in_stock} onChange={(e) => setEditing({ ...editing, in_stock: e.target.checked })} className="w-4 h-4 rounded border-[#e5e0d8] text-[#c9a84c] focus:ring-[#c9a84c]/30" /> In Stock
                </label>
              </div>
            </div>
            <div className="sticky bottom-0 bg-white border-t border-[#e5e0d8]/60 p-6 flex justify-end gap-3 rounded-b-3xl">
              <button onClick={() => setEditing(null)} className="px-5 py-2.5 rounded-xl border border-[#e5e0d8] text-sm hover:bg-[#f5f0e8] transition-colors">Cancel</button>
              <button onClick={onSave} disabled={saving} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50 shadow-lg transition-all"
                style={{ background: "#1a1208", color: "#fdf9f0" }}>
                <Save className="w-4 h-4" /> {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const inp = "w-full px-4 py-2.5 rounded-xl bg-white border border-[#e5e0d8] focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/20 outline-none text-sm transition-all";
const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div><label className="block text-[11px] uppercase tracking-widest mb-2 text-muted-foreground font-medium">{label}</label>{children}</div>
);

const GalleryUpload = ({ onUploaded }: { onUploaded: (url: string) => void }) => {
  const [busy, setBusy] = useState(false);
  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setBusy(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const name = `gallery-${Date.now()}-${Math.random().toString(36).slice(2, 6)}.${ext}`;
      const { error } = await supabase.storage.from("product-images").upload(name, file, { cacheControl: "3600", upsert: false });
      if (error) throw error;
      const { data } = supabase.storage.from("product-images").getPublicUrl(name);
      onUploaded(data.publicUrl); toast.success("Image added");
    } catch (err: any) { toast.error(err.message || "Upload failed"); }
    finally { setBusy(false); e.target.value = ""; }
  };
  return (
    <label className={`w-20 h-20 rounded-xl border-2 border-dashed border-[#e5e0d8] flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-[#c9a84c]/50 hover:bg-[#c9a84c]/5 transition-all ${busy ? "opacity-60 pointer-events-none" : ""}`}>
      <ImagePlus className="w-5 h-5 text-muted-foreground/50" />
      <span className="text-[9px] text-muted-foreground/50">{busy ? "…" : "Add"}</span>
      <input type="file" accept="image/*" onChange={onFile} className="hidden" disabled={busy} />
    </label>
  );
};

export default AdminProducts;
