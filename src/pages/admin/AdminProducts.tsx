import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { resolveImage, formatINR } from "@/lib/site";
import { Pencil, Trash2, Plus, X, Save, ImagePlus, Star, Search, Copy, Download } from "lucide-react";
import { toast } from "sonner";
import ImageUpload from "./ImageUpload";

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
  sort_order: number;
};

const empty: Product = {
  name: "", slug: "", short_description: "", description: "",
  price: 0, original_price: null, category_slug: null, image_url: null,
  gallery: [], badge: null, featured: false, in_stock: true, sort_order: 0,
};

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cats, setCats] = useState<{ slug: string; name: string }[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "featured" | "in" | "out">("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const load = async () => {
    const { data } = await supabase.from("products").select("*").order("sort_order");
    setProducts((data ?? []).map((p: any) => ({
      ...p,
      gallery: Array.isArray(p.gallery) ? p.gallery : [],
    })) as Product[]);
    setSelected(new Set());
  };

  useEffect(() => {
    load();
    supabase.from("categories").select("slug,name").order("sort_order")
      .then(({ data }) => setCats((data ?? []) as any));
  }, []);

  const onSave = async () => {
    if (!editing) return;
    if (!editing.name.trim()) { toast.error("Name is required"); return; }
    const payload = {
      ...editing,
      slug: editing.slug || slugify(editing.name),
      price: Number(editing.price) || 0,
      original_price: editing.original_price ? Number(editing.original_price) : null,
      sort_order: Number(editing.sort_order) || 0,
    };
    setSaving(true);
    const { error } = editing.id
      ? await supabase.from("products").update(payload).eq("id", editing.id)
      : await supabase.from("products").insert(payload);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success(editing.id ? "Product updated" : "Product created");
    setEditing(null);
    load();
  };

  const onDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  };

  const onDuplicate = async (p: Product) => {
    const { id, ...rest } = p;
    delete (rest as any).created_at;
    delete (rest as any).updated_at;
    const copy = {
      ...rest,
      name: `${p.name} (Copy)`,
      slug: `${p.slug}-copy-${Date.now().toString(36).slice(-4)}`,
      featured: false,
    };
    const { error } = await supabase.from("products").insert(copy);
    if (error) return toast.error(error.message);
    toast.success("Duplicated");
    load();
  };

  const onBulkDelete = async () => {
    if (selected.size === 0) return;
    if (!confirm(`Delete ${selected.size} product${selected.size === 1 ? "" : "s"}?`)) return;
    const { error } = await supabase.from("products").delete().in("id", Array.from(selected));
    if (error) return toast.error(error.message);
    toast.success(`Deleted ${selected.size}`);
    load();
  };

  const onBulkSetStock = async (in_stock: boolean) => {
    if (selected.size === 0) return;
    const { error } = await supabase.from("products").update({ in_stock }).in("id", Array.from(selected));
    if (error) return toast.error(error.message);
    toast.success(`Updated ${selected.size}`);
    load();
  };

  const onBulkSetFeatured = async (featured: boolean) => {
    if (selected.size === 0) return;
    const { error } = await supabase.from("products").update({ featured }).in("id", Array.from(selected));
    if (error) return toast.error(error.message);
    toast.success(`Updated ${selected.size}`);
    load();
  };

  const exportCSV = () => {
    const list = visible;
    const headers = ["Name", "Slug", "Category", "Price (INR)", "Original price", "Featured", "In stock", "Sort order", "Image URL"];
    const rows = list.map((p) => [
      p.name, p.slug, p.category_slug ?? "", p.price, p.original_price ?? "",
      p.featured ? "yes" : "no", p.in_stock ? "yes" : "no", p.sort_order, p.image_url ?? "",
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mohika-products-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === visible.length) setSelected(new Set());
    else setSelected(new Set(visible.map((p) => p.id!)));
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
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.slug.toLowerCase().includes(search.toLowerCase())) return false;
    if (filter === "featured" && !p.featured) return false;
    if (filter === "out") return !p.in_stock;
    if (filter === "in") return p.in_stock;
    return true;
  });

  return (
    <div className="pb-20 lg:pb-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-white text-3xl font-semibold">Products</h1>
          <p className="text-sm text-white/40 mt-1">
            {products.length} total · {products.filter((p) => p.featured).length} featured · {products.filter((p) => !p.in_stock).length} out of stock
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm text-white/60 hover:bg-white/[0.08] hover:text-white/90 transition-all"
          >
            <Download className="w-3.5 h-3.5" /> CSV
          </button>
          <button
            onClick={() => setEditing({ ...empty, gallery: [] })}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-white text-sm font-medium hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" /> New Product
          </button>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#1a1a22] border border-white/[0.06] flex-1 max-w-md">
          <Search className="w-4 h-4 text-white/25 shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products…"
            className="flex-1 outline-none bg-transparent text-sm text-white placeholder:text-white/25"
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-white/30 hover:text-white/60">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {[
            { id: "all", label: "All" },
            { id: "featured", label: "Featured" },
            { id: "in", label: "In Stock" },
            { id: "out", label: "Out of Stock" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as any)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === f.id
                  ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                  : "bg-white/[0.03] text-white/40 border border-white/[0.06] hover:text-white/70 hover:border-white/[0.1]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selected.size > 0 && (
        <div className="mb-4 bg-amber-500/5 border border-amber-500/20 rounded-xl px-4 py-3 flex items-center justify-between flex-wrap gap-2">
          <span className="text-sm text-amber-300 font-medium">{selected.size} selected</span>
          <div className="flex flex-wrap gap-1.5">
            <BulkBtn onClick={() => onBulkSetFeatured(true)}>Feature</BulkBtn>
            <BulkBtn onClick={() => onBulkSetFeatured(false)}>Unfeature</BulkBtn>
            <BulkBtn onClick={() => onBulkSetStock(true)}>In Stock</BulkBtn>
            <BulkBtn onClick={() => onBulkSetStock(false)}>Out of Stock</BulkBtn>
            <button onClick={onBulkDelete} className="px-3 py-1.5 rounded-lg text-xs text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-colors">Delete</button>
            <button onClick={() => setSelected(new Set())} className="px-3 py-1.5 rounded-lg text-xs text-white/40 hover:text-white/70 transition-colors">Clear</button>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-[#1a1a22] rounded-2xl border border-white/[0.04] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.04]">
                <th className="text-left p-4 w-10">
                  <input
                    type="checkbox"
                    checked={visible.length > 0 && selected.size === visible.length}
                    onChange={toggleAll}
                    className="w-4 h-4 rounded border-white/20 bg-white/5 text-amber-500 focus:ring-amber-500/30 cursor-pointer"
                  />
                </th>
                <th className="text-left p-4 text-[11px] uppercase tracking-widest text-white/30 font-medium">Product</th>
                <th className="text-left p-4 text-[11px] uppercase tracking-widest text-white/30 font-medium hidden md:table-cell">Category</th>
                <th className="text-left p-4 text-[11px] uppercase tracking-widest text-white/30 font-medium">Price</th>
                <th className="text-left p-4 text-[11px] uppercase tracking-widest text-white/30 font-medium hidden md:table-cell">Featured</th>
                <th className="text-left p-4 text-[11px] uppercase tracking-widest text-white/30 font-medium hidden md:table-cell">Stock</th>
                <th className="p-4 w-28"></th>
              </tr>
            </thead>
            <tbody>
              {visible.map((p) => (
                <tr
                  key={p.id}
                  className={`border-t border-white/[0.03] hover:bg-white/[0.02] transition-colors ${
                    selected.has(p.id!) ? "bg-amber-500/[0.03]" : ""
                  }`}
                >
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selected.has(p.id!)}
                      onChange={() => toggleSelect(p.id!)}
                      className="w-4 h-4 rounded border-white/20 bg-white/5 text-amber-500 focus:ring-amber-500/30 cursor-pointer"
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl overflow-hidden bg-white/5 shrink-0 border border-white/[0.06]">
                        <img src={resolveImage(p.image_url)} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-white/90 font-medium truncate">{p.name}</div>
                        <div className="text-[11px] text-white/25 truncate">{p.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 hidden md:table-cell text-white/40 text-xs">{p.category_slug ?? "—"}</td>
                  <td className="p-4 text-white/80 font-medium">{formatINR(Number(p.price))}</td>
                  <td className="p-4 hidden md:table-cell">
                    <button
                      onClick={() => toggleFeatured(p)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/5 transition-colors"
                    >
                      <Star className={`w-4 h-4 ${p.featured ? "fill-amber-400 text-amber-400" : "text-white/15"}`} />
                    </button>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <button
                      onClick={() => toggleStock(p)}
                      className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-widest font-medium transition-colors ${
                        p.in_stock
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-red-500/10 text-red-400 border border-red-500/20"
                      }`}
                    >
                      {p.in_stock ? "In stock" : "Out"}
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => onDuplicate(p)} className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-white/30 hover:text-white/70 transition-colors" title="Duplicate">
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setEditing({ ...p, gallery: p.gallery ?? [] })} className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-white/30 hover:text-white/70 transition-colors" title="Edit">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => onDelete(p.id!)} className="w-8 h-8 rounded-lg hover:bg-red-500/10 flex items-center justify-center text-white/20 hover:text-red-400 transition-colors" title="Delete">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-white/20 text-sm">
                    {products.length === 0 ? 'No products yet. Click "New Product" to add one.' : "No products match your filters."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit/Create Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-6 animate-fade-in">
          <div className="bg-[#1a1a22] w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-t-3xl md:rounded-2xl border border-white/[0.06] shadow-2xl">
            <div className="sticky top-0 bg-[#1a1a22] border-b border-white/[0.04] p-6 flex items-center justify-between z-10">
              <h2 className="text-white text-xl font-semibold">{editing.id ? "Edit Product" : "New Product"}</h2>
              <button onClick={() => setEditing(null)} className="w-9 h-9 rounded-xl hover:bg-white/5 flex items-center justify-center text-white/40 hover:text-white/70 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <ImageUpload value={editing.image_url} onChange={(url) => setEditing({ ...editing, image_url: url })} label="Main image" />

              {/* Gallery */}
              <div>
                <label className="block text-[11px] uppercase tracking-widest mb-3 text-white/30 font-medium">Gallery Images</label>
                <div className="flex flex-wrap gap-3">
                  {(editing.gallery ?? []).map((url, i) => (
                    <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-white/[0.06] group">
                      <img src={resolveImage(url)} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setEditing({ ...editing, gallery: editing.gallery.filter((_, j) => j !== i) })}
                        className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  ))}
                  <GalleryUpload onUploaded={(url) => setEditing({ ...editing, gallery: [...(editing.gallery ?? []), url] })} />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Name">
                  <input
                    value={editing.name}
                    onChange={(e) => setEditing({ ...editing, name: e.target.value, slug: editing.slug || slugify(e.target.value) })}
                    className={inp}
                    placeholder="Product name"
                  />
                </Field>
                <Field label="Slug (URL)">
                  <input value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: slugify(e.target.value) })} className={inp} />
                </Field>
              </div>

              <Field label="Short description">
                <input value={editing.short_description ?? ""} onChange={(e) => setEditing({ ...editing, short_description: e.target.value })} className={inp} placeholder="Brief tagline" />
              </Field>
              <Field label="Description">
                <textarea rows={4} value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className={inp + " resize-none"} placeholder="Full product description" />
              </Field>

              <div className="grid sm:grid-cols-3 gap-4">
                <Field label="Price (₹)">
                  <input type="number" value={editing.price} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })} className={inp} />
                </Field>
                <Field label="Original Price">
                  <input type="number" value={editing.original_price ?? ""} onChange={(e) => setEditing({ ...editing, original_price: e.target.value ? Number(e.target.value) : null })} className={inp} placeholder="For strikethrough" />
                </Field>
                <Field label="Sort Order">
                  <input type="number" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} className={inp} />
                </Field>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Category">
                  <select value={editing.category_slug ?? ""} onChange={(e) => setEditing({ ...editing, category_slug: e.target.value || null })} className={inp}>
                    <option value="">None</option>
                    {cats.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                  </select>
                </Field>
                <Field label="Badge">
                  <input value={editing.badge ?? ""} onChange={(e) => setEditing({ ...editing, badge: e.target.value || null })} className={inp} placeholder="e.g. Bestseller" />
                </Field>
              </div>

              <div className="flex flex-wrap gap-6">
                <label className="inline-flex items-center gap-2.5 text-sm text-white/70 cursor-pointer">
                  <input type="checkbox" checked={editing.featured} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} className="w-4 h-4 rounded border-white/20 bg-white/5 text-amber-500 focus:ring-amber-500/30" />
                  Featured on homepage
                </label>
                <label className="inline-flex items-center gap-2.5 text-sm text-white/70 cursor-pointer">
                  <input type="checkbox" checked={editing.in_stock} onChange={(e) => setEditing({ ...editing, in_stock: e.target.checked })} className="w-4 h-4 rounded border-white/20 bg-white/5 text-amber-500 focus:ring-amber-500/30" />
                  In stock
                </label>
              </div>
            </div>
            <div className="sticky bottom-0 bg-[#1a1a22] border-t border-white/[0.04] p-6 flex justify-end gap-3">
              <button onClick={() => setEditing(null)} className="px-5 py-2.5 rounded-xl border border-white/[0.08] text-sm text-white/60 hover:bg-white/5 transition-colors">
                Cancel
              </button>
              <button
                onClick={onSave}
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 text-white text-sm font-medium hover:bg-amber-400 disabled:opacity-50 transition-colors shadow-lg shadow-amber-500/20"
              >
                <Save className="w-4 h-4" /> {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ── Helpers ── */

const inp = "w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white placeholder:text-white/25 focus:border-amber-500/40 focus:bg-white/[0.05] outline-none text-sm transition-all";

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="block text-[11px] uppercase tracking-widest mb-2 text-white/30 font-medium">{label}</label>
    {children}
  </div>
);

const BulkBtn = ({ onClick, children }: { onClick: () => void; children: React.ReactNode }) => (
  <button onClick={onClick} className="px-3 py-1.5 rounded-lg text-xs text-white/60 bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] transition-colors">
    {children}
  </button>
);

const GalleryUpload = ({ onUploaded }: { onUploaded: (url: string) => void }) => {
  const [busy, setBusy] = useState(false);
  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const name = `gallery-${Date.now()}-${Math.random().toString(36).slice(2, 6)}.${ext}`;
      const { error } = await supabase.storage.from("product-images").upload(name, file, { cacheControl: "3600", upsert: false });
      if (error) throw error;
      const { data } = supabase.storage.from("product-images").getPublicUrl(name);
      onUploaded(data.publicUrl);
      toast.success("Image added");
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  };
  return (
    <label className={`w-20 h-20 rounded-xl border-2 border-dashed border-white/[0.08] flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-amber-500/30 hover:bg-amber-500/5 transition-all ${busy ? "opacity-60 pointer-events-none" : ""}`}>
      <ImagePlus className="w-5 h-5 text-white/25" />
      <span className="text-[9px] text-white/25">{busy ? "…" : "Add"}</span>
      <input type="file" accept="image/*" onChange={onFile} className="hidden" disabled={busy} />
    </label>
  );
};

export default AdminProducts;
