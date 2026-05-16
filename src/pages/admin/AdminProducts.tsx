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
    // Strip generated columns we don't want to copy verbatim.
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
    toast.success(`${in_stock ? "Restocked" : "Marked out of stock"}: ${selected.size}`);
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

  // Search + filter
  const visible = products.filter((p) => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.slug.toLowerCase().includes(search.toLowerCase())) return false;
    if (filter === "featured" && !p.featured) return false;
    if (filter === "out") return !p.in_stock;
    if (filter === "in") return p.in_stock;
    return true;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-4xl">Products</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {products.length} total · {products.filter((p) => p.featured).length} featured · {products.filter((p) => !p.in_stock).length} out of stock
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-border text-sm hover:bg-muted transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> CSV
          </button>
          <button onClick={() => setEditing({ ...empty, gallery: [] })} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-foreground text-background text-sm hover:opacity-85 transition-opacity">
            <Plus className="w-4 h-4" /> New Product
          </button>
        </div>
      </div>

      {/* Filter + search bar */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-background border border-border min-w-[220px] flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or slug..."
            className="flex-1 outline-none bg-transparent text-sm placeholder:text-muted-foreground/60"
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-muted-foreground hover:text-foreground">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {[
            { id: "all",      label: "All" },
            { id: "featured", label: "Featured" },
            { id: "in",       label: "In stock" },
            { id: "out",      label: "Out of stock" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as any)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all ${
                filter === f.id
                  ? "bg-foreground text-background border-foreground"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-background rounded-2xl border border-border overflow-hidden">
        {selected.size > 0 && (
          <div className="bg-amber-50/70 border-b border-amber-200 px-4 py-2.5 flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="font-medium">
              {selected.size} selected
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button onClick={() => onBulkSetFeatured(true)}  className="px-3 py-1.5 rounded-full bg-background border border-border hover:border-foreground/30 transition-colors">Mark featured</button>
              <button onClick={() => onBulkSetFeatured(false)} className="px-3 py-1.5 rounded-full bg-background border border-border hover:border-foreground/30 transition-colors">Unfeature</button>
              <button onClick={() => onBulkSetStock(true)}     className="px-3 py-1.5 rounded-full bg-background border border-border hover:border-foreground/30 transition-colors">In stock</button>
              <button onClick={() => onBulkSetStock(false)}    className="px-3 py-1.5 rounded-full bg-background border border-border hover:border-foreground/30 transition-colors">Out of stock</button>
              <button onClick={onBulkDelete}                   className="px-3 py-1.5 rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors">Delete</button>
              <button onClick={() => setSelected(new Set())}   className="px-3 py-1.5 rounded-full hover:bg-foreground/5 transition-colors">Clear</button>
            </div>
          </div>
        )}
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="text-left p-4 w-10">
                <input
                  type="checkbox"
                  checked={visible.length > 0 && selected.size === visible.length}
                  onChange={toggleAll}
                  className="cursor-pointer"
                  title="Select all"
                />
              </th>
              <th className="text-left p-4">Product</th>
              <th className="text-left p-4 hidden md:table-cell">Category</th>
              <th className="text-left p-4">Price</th>
              <th className="text-left p-4 hidden md:table-cell">Featured</th>
              <th className="text-left p-4 hidden md:table-cell">Stock</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {visible.map((p) => (
              <tr key={p.id} className={`border-t border-border hover:bg-muted/20 transition-colors ${selected.has(p.id!) ? "bg-amber-50/30" : ""}`}>
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={selected.has(p.id!)}
                    onChange={() => toggleSelect(p.id!)}
                    className="cursor-pointer"
                  />
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img src={resolveImage(p.image_url)} alt={p.name} className="w-12 h-12 rounded-lg object-cover" />
                    <div>
                      <div className="font-serif text-base">{p.name}</div>
                      <div className="text-xs text-muted-foreground">{p.slug}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4 hidden md:table-cell text-muted-foreground">{p.category_slug ?? "-"}</td>
                <td className="p-4 font-medium">{formatINR(Number(p.price))}</td>
                <td className="p-4 hidden md:table-cell">
                  <button
                    onClick={() => toggleFeatured(p)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted transition-colors"
                    title={p.featured ? "Remove from featured" : "Mark as featured"}
                  >
                    <Star className={`w-4 h-4 ${p.featured ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40"}`} />
                  </button>
                </td>
                <td className="p-4 hidden md:table-cell">
                  <button
                    onClick={() => toggleStock(p)}
                    className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-widest font-medium transition-colors ${
                      p.in_stock
                        ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                        : "bg-rose-100 text-rose-700 hover:bg-rose-200"
                    }`}
                  >
                    {p.in_stock ? "In stock" : "Out"}
                  </button>
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => onDuplicate(p)} className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-muted" title="Duplicate"><Copy className="w-4 h-4" /></button>
                  <button onClick={() => setEditing({ ...p, gallery: p.gallery ?? [] })} className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-muted ml-1" title="Edit"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => onDelete(p.id!)} className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-destructive/10 text-destructive ml-1" title="Delete"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr><td colSpan={7} className="p-10 text-center text-muted-foreground">
                {products.length === 0 ? `No products yet. Click "New Product" to add one.` : "No products match your filters."}
              </td></tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-6 animate-fade-in">
          <div className="bg-background w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-t-3xl md:rounded-3xl shadow-luxe">
            <div className="sticky top-0 bg-background border-b border-border p-6 flex items-center justify-between">
              <h2 className="font-display text-2xl">{editing.id ? "Edit Product" : "New Product"}</h2>
              <button onClick={() => setEditing(null)} className="w-9 h-9 rounded-full hover:bg-muted flex items-center justify-center"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-6 space-y-5">
              <ImageUpload value={editing.image_url} onChange={(url) => setEditing({ ...editing, image_url: url })} label="Main image" />

              {/* Gallery images */}
              <div>
                <label className="block text-xs uppercase tracking-widest mb-3 text-muted-foreground">Gallery images</label>
                <div className="flex flex-wrap gap-3">
                  {(editing.gallery ?? []).map((url, i) => (
                    <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-border group">
                      <img src={resolveImage(url)} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setEditing({ ...editing, gallery: editing.gallery.filter((_, j) => j !== i) })}
                        className="absolute inset-0 bg-foreground/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  ))}
                  <GalleryUpload onUploaded={(url) => setEditing({ ...editing, gallery: [...(editing.gallery ?? []), url] })} />
                </div>
                <p className="text-xs text-muted-foreground mt-2">Additional images shown in the product page gallery. Click × to remove.</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Name">
                  <input value={editing.name}
                    onChange={(e) => setEditing({ ...editing, name: e.target.value, slug: editing.slug || slugify(e.target.value) })}
                    className={input} />
                </Field>
                <Field label="Slug (URL)">
                  <input value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: slugify(e.target.value) })} className={input} />
                </Field>
              </div>

              <Field label="Short description">
                <input value={editing.short_description ?? ""} onChange={(e) => setEditing({ ...editing, short_description: e.target.value })} className={input} />
              </Field>
              <Field label="Description">
                <textarea rows={4} value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className={input + " resize-none"} />
              </Field>

              <div className="grid sm:grid-cols-3 gap-4">
                <Field label="Price (₹)">
                  <input type="number" value={editing.price} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })} className={input} />
                </Field>
                <Field label="Original price">
                  <input type="number" value={editing.original_price ?? ""} onChange={(e) => setEditing({ ...editing, original_price: e.target.value ? Number(e.target.value) : null })} className={input} />
                </Field>
                <Field label="Sort order">
                  <input type="number" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} className={input} />
                </Field>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Category">
                  <select value={editing.category_slug ?? ""} onChange={(e) => setEditing({ ...editing, category_slug: e.target.value || null })} className={input}>
                    <option value="">None</option>
                    {cats.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                  </select>
                </Field>
                <Field label="Badge (e.g. Bestseller)">
                  <input value={editing.badge ?? ""} onChange={(e) => setEditing({ ...editing, badge: e.target.value || null })} className={input} />
                </Field>
              </div>

              <div className="flex flex-wrap gap-6">
                <label className="inline-flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={editing.featured} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} /> Featured on homepage
                </label>
                <label className="inline-flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={editing.in_stock} onChange={(e) => setEditing({ ...editing, in_stock: e.target.checked })} /> In stock
                </label>
              </div>
            </div>
            <div className="sticky bottom-0 bg-background border-t border-border p-6 flex justify-end gap-3">
              <button onClick={() => setEditing(null)} className="px-5 py-2.5 rounded-full border border-border">Cancel</button>
              <button onClick={onSave} disabled={saving} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-foreground text-background btn-glow disabled:opacity-60">
                <Save className="w-4 h-4" /> {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const input = "w-full px-4 py-2.5 rounded-xl bg-background border border-border focus:border-gold outline-none text-sm";
const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="block text-xs uppercase tracking-widest mb-2 text-muted-foreground">{label}</label>
    {children}
  </div>
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
      toast.success("Image added to gallery");
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  };
  return (
    <label className={`w-20 h-20 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-gold/50 hover:bg-gold/5 transition-all ${busy ? "opacity-60 pointer-events-none" : ""}`}>
      <ImagePlus className="w-5 h-5 text-muted-foreground" />
      <span className="text-[9px] text-muted-foreground">{busy ? "…" : "Add"}</span>
      <input type="file" accept="image/*" onChange={onFile} className="hidden" disabled={busy} />
    </label>
  );
};

export default AdminProducts;
