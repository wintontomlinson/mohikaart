import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { resolveImage } from "@/lib/site";
import { X, Save, ImagePlus, Loader2, Upload, Trash2, GripVertical } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "./AdminProducts";
import { emptyProduct } from "./AdminProducts";

type Props = {
  product: Product | null;
  categories: { slug: string; name: string }[];
  onClose: () => void;
  onSaved: () => void;
};

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const MAX_BYTES = 5 * 1024 * 1024;
const OK_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];


const ProductEditDrawer = ({ product, categories, onClose, onSaved }: Props) => {
  const [form, setForm] = useState<Product>(emptyProduct);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (product) {
      setForm({ ...product, gallery: product.gallery ?? [] });
    }
  }, [product]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (product) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [product]);

  // ESC to close
  useEffect(() => {
    if (!product) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [product, onClose]);

  if (!product) return null;

  const update = (patch: Partial<Product>) => setForm((f) => ({ ...f, ...patch }));


  const onSave = async () => {
    if (!form.name.trim()) { toast.error("Product name is required"); return; }
    const payload = {
      ...form,
      slug: form.slug || slugify(form.name),
      price: Number(form.price) || 0,
      original_price: form.original_price ? Number(form.original_price) : null,
      sort_order: Number(form.sort_order) || 0,
    };
    // Remove fields Supabase manages
    const { id, created_at, updated_at, ...rest } = payload as any;

    setSaving(true);
    const { error } = form.id
      ? await supabase.from("products").update(rest).eq("id", form.id)
      : await supabase.from("products").insert(rest);
    setSaving(false);

    if (error) { toast.error(error.message); return; }
    toast.success(form.id ? "Product updated" : "Product created");
    onSaved();
  };

  const uploadImage = async (file: File, isGallery = false) => {
    if (!OK_TYPES.includes(file.type)) { toast.error("Only JPG, PNG, WEBP, GIF, AVIF allowed"); return; }
    if (file.size > MAX_BYTES) { toast.error("Image must be 5 MB or smaller"); return; }
    setUploading(true);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage.from("product-images").upload(name, file, { cacheControl: "3600", upsert: false, contentType: file.type });
      if (error) throw error;
      const { data } = supabase.storage.from("product-images").getPublicUrl(name);
      if (isGallery) {
        update({ gallery: [...(form.gallery ?? []), data.publicUrl] });
      } else {
        update({ image_url: data.publicUrl });
      }
      toast.success("Image uploaded");
    } catch (err: any) { toast.error(err?.message || "Upload failed"); }
    finally { setUploading(false); }
  };


  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-[2px] animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className="fixed right-0 top-0 bottom-0 z-[101] w-full max-w-lg bg-white shadow-2xl border-l border-[#e5e0d8]/60 flex flex-col animate-in slide-in-from-right duration-300"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5e0d8]/60 bg-white shrink-0">
          <div>
            <h2 className="font-display text-lg" style={{ color: "#1a1208" }}>
              {form.id ? "Edit Product" : "New Product"}
            </h2>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {form.id ? "Update product details" : "Fill in the details to create a product"}
            </p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-[#f5f0e8] flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body (scrollable) */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Main Image */}
          <div>
            <Label>Main Image</Label>
            <div className="flex items-center gap-4 mt-2">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#f8f5f0] border border-[#e5e0d8] shrink-0">
                {form.image_url ? (
                  <img src={resolveImage(form.image_url)} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
                    <ImagePlus className="w-6 h-6" />
                  </div>
                )}
              </div>
              <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#e5e0d8] bg-white hover:bg-[#f8f5f0] hover:border-[#c9a84c]/40 cursor-pointer text-sm transition-all">
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {uploading ? "Uploading…" : "Upload"}
                <input type="file" accept={OK_TYPES.join(",")} className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImage(f); e.target.value = ""; }} disabled={uploading} />
              </label>
              {form.image_url && (
                <button onClick={() => update({ image_url: null })} className="text-xs text-red-500 hover:text-red-600 transition-colors">Remove</button>
              )}
            </div>
          </div>


          {/* Gallery */}
          <div>
            <Label>Gallery</Label>
            <div className="flex flex-wrap gap-2.5 mt-2">
              {(form.gallery ?? []).map((url, i) => (
                <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-[#e5e0d8] group">
                  <img src={resolveImage(url)} alt="" className="w-full h-full object-cover" />
                  <button onClick={() => update({ gallery: form.gallery.filter((_, j) => j !== i) })}
                    className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>
              ))}
              <label className="w-16 h-16 rounded-lg border-2 border-dashed border-[#e5e0d8] flex flex-col items-center justify-center gap-0.5 cursor-pointer hover:border-[#c9a84c]/50 hover:bg-[#c9a84c]/5 transition-all">
                <ImagePlus className="w-4 h-4 text-muted-foreground/40" />
                <span className="text-[8px] text-muted-foreground/50">Add</span>
                <input type="file" accept={OK_TYPES.join(",")} className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImage(f, true); e.target.value = ""; }} disabled={uploading} />
              </label>
            </div>
          </div>

          {/* Name & Slug */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Name" required>
              <input value={form.name}
                onChange={(e) => update({ name: e.target.value, slug: form.slug || slugify(e.target.value) })}
                className={inp} placeholder="Product name" />
            </Field>
            <Field label="Slug">
              <input value={form.slug}
                onChange={(e) => update({ slug: slugify(e.target.value) })}
                className={inp} placeholder="auto-generated" />
            </Field>
          </div>


          {/* Short Description */}
          <Field label="Short Description">
            <input value={form.short_description ?? ""}
              onChange={(e) => update({ short_description: e.target.value })}
              className={inp} placeholder="Brief tagline" />
          </Field>

          {/* Description */}
          <Field label="Description">
            <textarea rows={4} value={form.description ?? ""}
              onChange={(e) => update({ description: e.target.value })}
              className={inp + " resize-none"} placeholder="Full product description…" />
          </Field>

          {/* Pricing */}
          <div className="grid grid-cols-3 gap-4">
            <Field label="Price (₹)" required>
              <input type="number" value={form.price}
                onChange={(e) => update({ price: Number(e.target.value) })}
                className={inp} min={0} />
            </Field>
            <Field label="Compare at (₹)">
              <input type="number" value={form.original_price ?? ""}
                onChange={(e) => update({ original_price: e.target.value ? Number(e.target.value) : null })}
                className={inp} min={0} placeholder="—" />
            </Field>
            <Field label="Sort Order">
              <input type="number" value={form.sort_order}
                onChange={(e) => update({ sort_order: Number(e.target.value) })}
                className={inp} />
            </Field>
          </div>

          {/* Category & Badge */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Category">
              <select value={form.category_slug ?? ""} onChange={(e) => update({ category_slug: e.target.value || null })} className={inp}>
                <option value="">None</option>
                {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
              </select>
            </Field>
            <Field label="Badge">
              <select value={form.badge ?? ""} onChange={(e) => update({ badge: e.target.value || null })} className={inp}>
                <option value="">None</option>
                <option value="Bestseller">Bestseller</option>
                <option value="New">New</option>
                <option value="Popular">Popular</option>
                <option value="Premium">Premium</option>
              </select>
            </Field>
          </div>


          {/* Toggles */}
          <div className="flex flex-wrap gap-6 py-2">
            <label className="inline-flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" checked={form.in_stock}
                onChange={(e) => update({ in_stock: e.target.checked })}
                className="w-4 h-4 rounded border-[#e5e0d8] text-emerald-600 focus:ring-emerald-200 transition-all" />
              <span className="text-sm text-[#3d2b1f] group-hover:text-[#1a1208] transition-colors">In Stock</span>
            </label>
            <label className="inline-flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" checked={form.featured}
                onChange={(e) => update({ featured: e.target.checked })}
                className="w-4 h-4 rounded border-[#e5e0d8] text-[#c9a84c] focus:ring-[#c9a84c]/20 transition-all" />
              <span className="text-sm text-[#3d2b1f] group-hover:text-[#1a1208] transition-colors">Featured</span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#e5e0d8]/60 bg-[#fdf9f0]/50 shrink-0">
          <button onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-[#e5e0d8] text-sm font-medium hover:bg-[#f5f0e8] transition-colors text-[#3d2b1f]">
            Cancel
          </button>
          <button onClick={onSave} disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50 shadow-lg transition-all hover:shadow-xl hover:scale-[1.01] active:scale-[0.99]"
            style={{ background: "#1a1208", color: "#fdf9f0" }}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Saving…" : form.id ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </>
  );
};

export default ProductEditDrawer;


// ── Shared styles ──────────────────────────────────────────────────────────────
const inp = "w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#e5e0d8] focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/15 outline-none text-sm transition-all placeholder:text-muted-foreground/40";

const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-[11px] uppercase tracking-widest text-muted-foreground font-medium">{children}</label>
);

const Field = ({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) => (
  <div>
    <label className="block text-[11px] uppercase tracking-widest mb-2 text-muted-foreground font-medium">
      {label}{required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
    {children}
  </div>
);
