import { useEffect, useState } from "react";
import { Save, Plus, X, Pencil, Trash2, Star, MessageSquareQuote } from "lucide-react";
import { toast } from "sonner";
import {
  Testimonial,
  DEFAULT_TESTIMONIALS,
  fetchSetting,
  saveSetting,
  invalidateCmsCache,
} from "@/lib/cms";

const inp =
  "w-full px-4 py-2.5 rounded-xl bg-background border border-border focus:border-foreground/40 outline-none text-sm transition-colors";

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="block text-xs uppercase tracking-widest mb-2 text-muted-foreground">
      {label}
    </label>
    {children}
  </div>
);

const newId = () => `t${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

const blank = (): Testimonial => ({
  id: newId(),
  name: "",
  city: "",
  product: "",
  rating: 5,
  text: "",
  active: true,
});

const initials = (name: string) =>
  name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase() || "??";

const AdminTestimonials = () => {
  const [items, setItems] = useState<Testimonial[]>(DEFAULT_TESTIMONIALS);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSetting<Testimonial[]>("testimonials", DEFAULT_TESTIMONIALS).then((d) => {
      setItems(d);
      setLoading(false);
    });
  }, []);

  const persist = async (next: Testimonial[]) => {
    setSaving(true);
    setItems(next);
    const { error } = await saveSetting("testimonials", next);
    setSaving(false);
    if (error) return toast.error(error.message);
    invalidateCmsCache("testimonials");
  };

  const onSave = async () => {
    if (!editing) return;
    if (!editing.name.trim()) return toast.error("Name is required");
    if (!editing.text.trim()) return toast.error("Review text is required");

    const exists = items.find((i) => i.id === editing.id);
    const next = exists
      ? items.map((i) => (i.id === editing.id ? editing : i))
      : [...items, editing];

    await persist(next);
    toast.success(exists ? "Testimonial updated" : "Testimonial added");
    setEditing(null);
  };

  const onDelete = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    await persist(items.filter((i) => i.id !== id));
    toast.success("Deleted");
  };

  const toggleActive = async (id: string) => {
    await persist(
      items.map((i) => (i.id === id ? { ...i, active: !i.active } : i))
    );
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
        Loading…
      </div>
    );

  return (
    <div>
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-4xl">Testimonials</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {items.length} total · {items.filter((i) => i.active).length} active
          </p>
        </div>
        <button
          onClick={() => setEditing(blank())}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-foreground text-background text-sm hover:opacity-85 transition-opacity"
        >
          <Plus className="w-4 h-4" /> New Testimonial
        </button>
      </div>

      {/* Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((t) => (
          <div
            key={t.id}
            className={`bg-background rounded-2xl border p-5 transition-all ${
              t.active
                ? "border-border hover:border-foreground/20 hover:shadow-sm"
                : "border-border/50 opacity-60"
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                  style={{ background: "linear-gradient(135deg, hsl(34 58% 52%), hsl(348 58% 68%))" }}
                >
                  {initials(t.name)}
                </div>
                <div>
                  <div className="font-medium text-sm leading-tight">{t.name}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">{t.city}</div>
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => setEditing(t)}
                  className="w-7 h-7 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDelete(t.id)}
                  className="w-7 h-7 rounded-lg hover:bg-destructive/10 text-destructive flex items-center justify-center transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex gap-0.5 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${i < t.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`}
                />
              ))}
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-4 mb-3">
              "{t.text}"
            </p>

            <div className="flex items-center justify-between pt-3 border-t border-border">
              <span className="text-[10px] uppercase tracking-widest text-amber-700 italic">
                {t.product || "—"}
              </span>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={t.active}
                  onChange={() => toggleActive(t.id)}
                  className="sr-only"
                />
                <span
                  className={`w-8 h-4 rounded-full relative transition-colors ${
                    t.active ? "bg-emerald-500" : "bg-muted"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform ${
                      t.active ? "translate-x-4" : ""
                    }`}
                  />
                </span>
              </label>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="col-span-full text-center p-12 border border-dashed border-border rounded-2xl text-muted-foreground text-sm">
            No testimonials yet.
          </div>
        )}
      </div>

      {saving && (
        <div className="fixed bottom-6 right-6 bg-foreground text-background px-4 py-2 rounded-full text-xs flex items-center gap-2 shadow-luxe">
          <span className="w-2 h-2 rounded-full bg-amber-300 animate-pulse" />
          Saving…
        </div>
      )}

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-6">
          <div className="bg-background w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-t-3xl md:rounded-3xl shadow-2xl">
            <div className="sticky top-0 bg-background border-b border-border px-6 py-4 flex items-center justify-between">
              <h2 className="font-display text-2xl flex items-center gap-2">
                <MessageSquareQuote className="w-5 h-5 text-amber-600" />
                {items.find((i) => i.id === editing.id) ? "Edit" : "New"} Testimonial
              </h2>
              <button
                onClick={() => setEditing(null)}
                className="w-9 h-9 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Customer name">
                  <input
                    value={editing.name}
                    onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                    className={inp}
                    placeholder="e.g. Aanya Mehta"
                  />
                </Field>
                <Field label="City">
                  <input
                    value={editing.city}
                    onChange={(e) => setEditing({ ...editing, city: e.target.value })}
                    className={inp}
                    placeholder="e.g. Mumbai"
                  />
                </Field>
              </div>

              <Field label="Product purchased">
                <input
                  value={editing.product}
                  onChange={(e) => setEditing({ ...editing, product: e.target.value })}
                  className={inp}
                  placeholder="e.g. Bridal Bouquet Preservation"
                />
              </Field>

              <Field label="Rating">
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      onClick={() => setEditing({ ...editing, rating: n })}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          n <= editing.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="Review text">
                <textarea
                  rows={5}
                  value={editing.text}
                  onChange={(e) => setEditing({ ...editing, text: e.target.value })}
                  className={inp + " resize-none"}
                  placeholder="What did the customer say?"
                />
              </Field>

              <label className="flex items-center gap-3 cursor-pointer">
                <span
                  className={`w-9 h-5 rounded-full relative transition-colors ${
                    editing.active ? "bg-emerald-500" : "bg-muted"
                  }`}
                  onClick={() => setEditing({ ...editing, active: !editing.active })}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                      editing.active ? "translate-x-4" : ""
                    }`}
                  />
                </span>
                <span className="text-sm">
                  {editing.active ? "Visible on site" : "Hidden from site"}
                </span>
              </label>
            </div>
            <div className="sticky bottom-0 bg-background border-t border-border px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => setEditing(null)}
                className="px-5 py-2.5 rounded-full border border-border text-sm hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onSave}
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-foreground text-background text-sm hover:opacity-85 transition-opacity disabled:opacity-60"
              >
                <Save className="w-4 h-4" /> Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTestimonials;
