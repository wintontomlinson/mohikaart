import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { resolveImage } from "@/lib/site";
import { Plus, Pencil, Trash2, X, Save, Tag } from "lucide-react";
import { toast } from "sonner";
import ImageUpload from "./ImageUpload";
import ConfirmModal from "@/components/admin/ConfirmModal";
import EmptyState from "@/components/admin/EmptyState";
import Skeleton from "@/components/admin/Skeleton";

type Category = {
  id?: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
};

const empty: Category = { name: "", slug: "", description: "", image_url: null, sort_order: 0 };
const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const inp = "w-full px-4 py-2.5 rounded-xl bg-white border border-[#e5e0d8] focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/20 outline-none text-sm transition-all";

const AdminCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Category | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const load = async () => {
    const { data } = await supabase.from("categories").select("*").order("sort_order");
    setCategories((data ?? []) as Category[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const onSave = async () => {
    if (!editing) return;
    if (!editing.name.trim()) { toast.error("Name is required"); return; }
    const payload = {
      ...editing,
      slug: editing.slug || slugify(editing.name),
      sort_order: Number(editing.sort_order) || 0,
    };
    setSaving(true);
    const { error } = editing.id
      ? await supabase.from("categories").update(payload).eq("id", editing.id)
      : await supabase.from("categories").insert(payload);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success(editing.id ? "Category updated" : "Category created");
    setEditing(null);
    load();
  };

  const onDelete = async (id: string) => {
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Category deleted");
    setConfirmDelete(null);
    load();
  };

  return (
    <div className="pb-24 lg:pb-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl" style={{ color: "#1a1208" }}>Categories</h1>
          <p className="text-sm text-muted-foreground mt-1">{categories.length} categories</p>
        </div>
        <button onClick={() => setEditing({ ...empty })}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg transition-all hover:scale-[1.02]"
          style={{ background: "#1a1208", color: "#fdf9f0" }}>
          <Plus className="w-4 h-4" /> New Category
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white/70 rounded-2xl border border-[#e5e0d8]/60 overflow-hidden">
              <Skeleton className="h-40 rounded-none" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))}
        </div>
      ) : categories.length === 0 ? (
        <EmptyState
          icon={Tag}
          title="No categories yet"
          description="Add categories to organize your products"
          action={{ label: "Add Category", onClick: () => setEditing({ ...empty }) }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div key={cat.id} className="group bg-white/70 backdrop-blur rounded-2xl border border-[#e5e0d8]/60 overflow-hidden hover:shadow-lg hover:border-[#c9a84c]/30 transition-all">
              {/* Image */}
              <div className="relative h-40 overflow-hidden bg-[#f8f5f0]">
                {cat.image_url ? (
                  <img src={resolveImage(cat.image_url)} alt={cat.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Tag className="w-10 h-10 text-muted-foreground/20" />
                  </div>
                )}
                {/* Hover actions */}
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setEditing({ ...cat })}
                    className="w-8 h-8 rounded-full bg-white/90 border border-[#e5e0d8] flex items-center justify-center hover:bg-white shadow-sm transition-colors">
                    <Pencil className="w-3.5 h-3.5" style={{ color: "#1a1208" }} />
                  </button>
                  <button onClick={() => setConfirmDelete(cat.id!)}
                    className="w-8 h-8 rounded-full bg-white/90 border border-[#e5e0d8] flex items-center justify-center hover:bg-red-50 hover:border-red-200 shadow-sm transition-colors">
                    <Trash2 className="w-3.5 h-3.5 text-red-500" />
                  </button>
                </div>
              </div>
              {/* Info */}
              <div className="p-4">
                <h3 className="font-medium text-sm" style={{ color: "#1a1208" }}>{cat.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{cat.slug}</p>
                {cat.description && (
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{cat.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirm Delete */}
      <ConfirmModal
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => confirmDelete && onDelete(confirmDelete)}
        title="Delete Category"
        description="This category will be permanently removed. Products in this category will become uncategorized."
        confirmLabel="Delete"
        variant="danger"
      />

      {/* Edit Drawer */}
      {editing && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setEditing(null)} />
          <div className="relative w-full max-w-md h-full bg-[#fdf9f0] border-l border-[#e5e0d8] shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="sticky top-0 bg-[#fdf9f0] border-b border-[#e5e0d8]/60 p-6 flex items-center justify-between z-10">
              <h2 className="font-display text-xl" style={{ color: "#1a1208" }}>{editing.id ? "Edit Category" : "New Category"}</h2>
              <button onClick={() => setEditing(null)} className="w-9 h-9 rounded-xl hover:bg-[#f5f0e8] flex items-center justify-center transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <div className="p-6 space-y-5">
              <ImageUpload value={editing.image_url} onChange={(url) => setEditing({ ...editing, image_url: url })} label="Category Image" bucket="site-images" />

              <div>
                <label className="block text-[11px] uppercase tracking-widest mb-2 text-muted-foreground font-medium">Name</label>
                <input value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value, slug: editing.id ? editing.slug : slugify(e.target.value) })}
                  className={inp} placeholder="Category name" />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-widest mb-2 text-muted-foreground font-medium">Slug</label>
                <input value={editing.slug}
                  onChange={(e) => setEditing({ ...editing, slug: slugify(e.target.value) })}
                  className={inp} placeholder="category-slug" />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-widest mb-2 text-muted-foreground font-medium">Description</label>
                <textarea rows={3} value={editing.description ?? ""}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  className={inp + " resize-none"} placeholder="Optional description" />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-widest mb-2 text-muted-foreground font-medium">Sort Order</label>
                <input type="number" value={editing.sort_order}
                  onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })}
                  className={inp} />
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-[#fdf9f0] border-t border-[#e5e0d8]/60 p-6 flex justify-end gap-3">
              <button onClick={() => setEditing(null)} className="px-5 py-2.5 rounded-xl border border-[#e5e0d8] text-sm hover:bg-[#f5f0e8] transition-colors">Cancel</button>
              <button onClick={onSave} disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50 shadow-lg transition-all"
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

export default AdminCategories;
