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
    if (!confirm("Delete this category? Products in this category won't be deleted.")) return;
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl">Categories</h1>
          <p className="text-sm text-muted-foreground mt-1">{cats.length} total</p>
        </div>
        <button
          onClick={() => setEditing({ ...empty })}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-foreground text-background text-sm hover:opacity-85 transition-opacity"
        >
          <Plus className="w-4 h-4" /> New Category
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cats.map((c) => (
          <div key={c.id} className="bg-background rounded-2xl border border-border overflow-hidden hover:border-foreground/20 hover:shadow-sm transition-all group">
            <div className="aspect-[16/7] bg-muted overflow-hidden">
              <img
                src={resolveImage(c.image_url)}
                alt={c.name}
                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
              />
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-serif text-lg leading-tight">{c.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">/{c.slug}</div>
                  {c.description && <div className="text-xs text-muted-foreground mt-1.5 line-clamp-2">{c.description}</div>}
                </div>
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => setEditing(c)}
                    className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDelete(c.id!)}
                    className="w-8 h-8 rounded-lg hover:bg-destructive/10 text-destructive flex items-center justify-center transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="mt-3 text-[10px] uppercase tracking-widest text-muted-foreground">Sort: {c.sort_order}</div>
            </div>
          </div>
        ))}
        {cats.length === 0 && (
          <div className="col-span-full p-12 text-center text-muted-foreground text-sm">
            No categories yet. Click "New Category" to add one.
          </div>
        )}
      </div>

      {/* Edit / Create Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-6">
          <div className="bg-background w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-t-3xl md:rounded-3xl shadow-2xl">
            <div className="sticky top-0 bg-background border-b border-border px-6 py-4 flex items-center justify-between">
              <h2 className="font-display text-2xl">{editing.id ? "Edit Category" : "New Category"}</h2>
              <button onClick={() => setEditing(null)} className="w-9 h-9 rounded-full hover:bg-muted flex items-center justify-center transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <ImageUpload
                value={editing.image_url}
                onChange={(url) => setEditing({ ...editing, image_url: url })}
                label="Category image"
              />

              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Name">
                  <input
                    value={editing.name}
                    onChange={(e) => setEditing({ ...editing, name: e.target.value, slug: editing.slug || slugify(e.target.value) })}
                    className={input}
                    placeholder="e.g. Resin Trays"
                  />
                </Field>
                <Field label="Slug (URL)">
                  <input
                    value={editing.slug}
                    onChange={(e) => setEditing({ ...editing, slug: slugify(e.target.value) })}
                    className={input}
                    placeholder="e.g. resin-trays"
                  />
                </Field>
              </div>

              <Field label="Description">
                <textarea
                  rows={3}
                  value={editing.description ?? ""}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value || null })}
                  className={input + " resize-none"}
                  placeholder="Short description shown on categories page"
                />
              </Field>

              <Field label="Sort Order">
                <input
                  type="number"
                  value={editing.sort_order}
                  onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })}
                  className={input}
                />
              </Field>
            </div>
            <div className="sticky bottom-0 bg-background border-t border-border px-6 py-4 flex justify-end gap-3">
              <button onClick={() => setEditing(null)} className="px-5 py-2.5 rounded-full border border-border text-sm hover:bg-muted transition-colors">
                Cancel
              </button>
              <button
                onClick={onSave}
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-foreground text-background text-sm disabled:opacity-60 hover:opacity-85 transition-opacity"
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

const input = "w-full px-4 py-2.5 rounded-xl bg-background border border-border focus:border-foreground/40 outline-none text-sm transition-colors";
const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="block text-xs uppercase tracking-widest mb-2 text-muted-foreground">{label}</label>
    {children}
  </div>
);

export default AdminCategories;
