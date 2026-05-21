import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { resolveImage } from "@/lib/site";
import { Pencil, Trash2, Plus, X, Save } from "lucide-react";
import { toast } from "sonner";
import ImageUpload from "./ImageUpload";

type Category = {
  id?: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
};

const empty: Category = { name: "", slug: "", description: null, image_url: null, sort_order: 0 };

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const AdminCategories = () => {
  const [cats, setCats] = useState<Category[]>([]);
  const [editing, setEditing] = useState<Category | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("categories").select("*").order("sort_order");
    setCats((data ?? []) as Category[]);
  };

  useEffect(() => { load(); }, []);

  const onSave = async () => {
    if (!editing) return;
    if (!editing.name.trim()) { toast.error("Name is required"); return; }
    const payload = { ...editing, slug: editing.slug || slugify(editing.name), sort_order: Number(editing.sort_order) || 0 };
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
    if (!confirm("Delete this category?")) return;
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  };

  return (
    <div className="pb-20 lg:pb-0">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-white text-3xl font-semibold">Categories</h1>
          <p className="text-sm text-white/40 mt-1">{cats.length} total</p>
        </div>
        <button
          onClick={() => setEditing({ ...empty })}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-white text-sm font-medium hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20"
        >
          <Plus className="w-4 h-4" /> New Category
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cats.map((c) => (
          <div key={c.id} className="bg-[#1a1a22] rounded-2xl border border-white/[0.04] overflow-hidden hover:border-white/[0.1] transition-all group">
            <div className="aspect-[16/7] bg-white/[0.02] overflow-hidden">
              <img
                src={resolveImage(c.image_url)}
                alt={c.name}
                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 opacity-80"
              />
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-white/90 font-medium">{c.name}</div>
                  <div className="text-xs text-white/25 mt-0.5">/{c.slug}</div>
                  {c.description && <div className="text-xs text-white/35 mt-1.5 line-clamp-2">{c.description}</div>}
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => setEditing(c)} className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-white/30 hover:text-white/70 transition-colors">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => onDelete(c.id!)} className="w-8 h-8 rounded-lg hover:bg-red-500/10 flex items-center justify-center text-white/20 hover:text-red-400 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="mt-3 text-[10px] uppercase tracking-widest text-white/20">Sort: {c.sort_order}</div>
            </div>
          </div>
        ))}
        {cats.length === 0 && (
          <div className="col-span-full p-12 text-center text-white/20 text-sm border border-dashed border-white/[0.06] rounded-2xl">
            No categories yet.
          </div>
        )}
      </div>

      {/* Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-6">
          <div className="bg-[#1a1a22] w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-t-3xl md:rounded-2xl border border-white/[0.06] shadow-2xl">
            <div className="sticky top-0 bg-[#1a1a22] border-b border-white/[0.04] px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-white text-xl font-semibold">{editing.id ? "Edit Category" : "New Category"}</h2>
              <button onClick={() => setEditing(null)} className="w-9 h-9 rounded-xl hover:bg-white/5 flex items-center justify-center text-white/40 hover:text-white/70 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <ImageUpload value={editing.image_url} onChange={(url) => setEditing({ ...editing, image_url: url })} label="Category image" />
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Name">
                  <input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value, slug: editing.slug || slugify(e.target.value) })} className={inp} placeholder="e.g. Resin Trays" />
                </Field>
                <Field label="Slug (URL)">
                  <input value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: slugify(e.target.value) })} className={inp} placeholder="e.g. resin-trays" />
                </Field>
              </div>
              <Field label="Description">
                <textarea rows={3} value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value || null })} className={inp + " resize-none"} placeholder="Short description" />
              </Field>
              <Field label="Sort Order">
                <input type="number" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} className={inp} />
              </Field>
            </div>
            <div className="sticky bottom-0 bg-[#1a1a22] border-t border-white/[0.04] px-6 py-4 flex justify-end gap-3">
              <button onClick={() => setEditing(null)} className="px-5 py-2.5 rounded-xl border border-white/[0.08] text-sm text-white/60 hover:bg-white/5 transition-colors">Cancel</button>
              <button onClick={onSave} disabled={saving} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 text-white text-sm font-medium hover:bg-amber-400 disabled:opacity-50 transition-colors shadow-lg shadow-amber-500/20">
                <Save className="w-4 h-4" /> {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const inp = "w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white placeholder:text-white/25 focus:border-amber-500/40 outline-none text-sm transition-all";
const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="block text-[11px] uppercase tracking-widest mb-2 text-white/30 font-medium">{label}</label>
    {children}
  </div>
);

export default AdminCategories;
