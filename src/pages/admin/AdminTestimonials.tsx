import { useEffect, useState } from "react";
import { Save, Plus, X, Pencil, Trash2, Star, MessageSquareQuote } from "lucide-react";
import { toast } from "sonner";
import { Testimonial, DEFAULT_TESTIMONIALS, fetchSetting, saveSetting, useInvalidateSetting } from "@/lib/cms";

const inp = "w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white placeholder:text-white/25 focus:border-amber-500/40 outline-none text-sm transition-all";

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="block text-[11px] uppercase tracking-widest mb-2 text-white/30 font-medium">{label}</label>
    {children}
  </div>
);

const newId = () => `t${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
const blank = (): Testimonial => ({ id: newId(), name: "", city: "", product: "", rating: 5, text: "", active: true });
const initials = (name: string) => name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase() || "??";

const AdminTestimonials = () => {
  const [items, setItems] = useState<Testimonial[]>(DEFAULT_TESTIMONIALS);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const invalidate = useInvalidateSetting();

  useEffect(() => {
    fetchSetting<Testimonial[]>("testimonials", DEFAULT_TESTIMONIALS).then((d) => { setItems(d); setLoading(false); });
  }, []);

  const persist = async (next: Testimonial[]) => {
    setSaving(true);
    setItems(next);
    const { error } = await saveSetting("testimonials", next);
    setSaving(false);
    if (error) return toast.error(error.message);
    invalidate("testimonials");
  };

  const onSave = async () => {
    if (!editing) return;
    if (!editing.name.trim()) return toast.error("Name required");
    if (!editing.text.trim()) return toast.error("Review text required");
    const exists = items.find((i) => i.id === editing.id);
    const next = exists ? items.map((i) => (i.id === editing.id ? editing : i)) : [...items, editing];
    await persist(next);
    toast.success(exists ? "Updated" : "Added");
    setEditing(null);
  };

  const onDelete = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    await persist(items.filter((i) => i.id !== id));
    toast.success("Deleted");
  };

  const toggleActive = async (id: string) => {
    await persist(items.map((i) => (i.id === id ? { ...i, active: !i.active } : i)));
  };

  if (loading) return <div className="flex items-center justify-center h-48 text-white/40 text-sm">Loading…</div>;

  return (
    <div className="pb-20 lg:pb-0">
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-white text-3xl font-semibold">Testimonials</h1>
          <p className="text-sm text-white/40 mt-1">{items.length} total · {items.filter((i) => i.active).length} active</p>
        </div>
        <button onClick={() => setEditing(blank())} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-white text-sm font-medium hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20">
          <Plus className="w-4 h-4" /> New
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((t) => (
          <div key={t.id} className={`bg-[#1a1a22] rounded-2xl border p-5 transition-all ${t.active ? "border-white/[0.04] hover:border-white/[0.1]" : "border-white/[0.02] opacity-50"}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 bg-gradient-to-br from-amber-500/30 to-violet-500/20 border border-white/[0.06]">
                  {initials(t.name)}
                </div>
                <div>
                  <div className="text-white/80 font-medium text-sm">{t.name}</div>
                  <div className="text-[11px] text-white/30">{t.city}</div>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => setEditing(t)} className="w-7 h-7 rounded-lg hover:bg-white/5 flex items-center justify-center text-white/25 hover:text-white/60 transition-colors">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => onDelete(t.id)} className="w-7 h-7 rounded-lg hover:bg-red-500/10 flex items-center justify-center text-white/15 hover:text-red-400 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="flex gap-0.5 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-3 h-3 ${i < t.rating ? "fill-amber-400 text-amber-400" : "text-white/10"}`} />
              ))}
            </div>
            <p className="text-xs text-white/40 leading-relaxed line-clamp-4 mb-3">"{t.text}"</p>
            <div className="flex items-center justify-between pt-3 border-t border-white/[0.04]">
              <span className="text-[10px] uppercase tracking-widest text-amber-400/50 italic">{t.product || "—"}</span>
              <ToggleSwitch checked={t.active} onChange={() => toggleActive(t.id)} />
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="col-span-full text-center p-12 border border-dashed border-white/[0.06] rounded-2xl text-white/20 text-sm">No testimonials yet.</div>
        )}
      </div>

      {saving && (
        <div className="fixed bottom-6 right-6 bg-[#1a1a22] border border-white/[0.06] text-white/70 px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-2xl">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" /> Saving…
        </div>
      )}

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-6">
          <div className="bg-[#1a1a22] w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-t-3xl md:rounded-2xl border border-white/[0.06] shadow-2xl">
            <div className="sticky top-0 bg-[#1a1a22] border-b border-white/[0.04] px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-white text-xl font-semibold flex items-center gap-2">
                <MessageSquareQuote className="w-5 h-5 text-amber-400" />
                {items.find((i) => i.id === editing.id) ? "Edit" : "New"} Testimonial
              </h2>
              <button onClick={() => setEditing(null)} className="w-9 h-9 rounded-xl hover:bg-white/5 flex items-center justify-center text-white/40 hover:text-white/70 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Customer name"><input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className={inp} placeholder="e.g. Aanya Mehta" /></Field>
                <Field label="City"><input value={editing.city} onChange={(e) => setEditing({ ...editing, city: e.target.value })} className={inp} placeholder="e.g. Mumbai" /></Field>
              </div>
              <Field label="Product purchased"><input value={editing.product} onChange={(e) => setEditing({ ...editing, product: e.target.value })} className={inp} /></Field>
              <Field label="Rating">
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button key={n} onClick={() => setEditing({ ...editing, rating: n })} className="transition-transform hover:scale-110">
                      <Star className={`w-7 h-7 ${n <= editing.rating ? "fill-amber-400 text-amber-400" : "text-white/10"}`} />
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="Review text"><textarea rows={5} value={editing.text} onChange={(e) => setEditing({ ...editing, text: e.target.value })} className={inp + " resize-none"} /></Field>
              <div className="flex items-center gap-3">
                <ToggleSwitch checked={editing.active} onChange={(v) => setEditing({ ...editing, active: v })} />
                <span className="text-sm text-white/50">{editing.active ? "Visible" : "Hidden"}</span>
              </div>
            </div>
            <div className="sticky bottom-0 bg-[#1a1a22] border-t border-white/[0.04] px-6 py-4 flex justify-end gap-3">
              <button onClick={() => setEditing(null)} className="px-5 py-2.5 rounded-xl border border-white/[0.08] text-sm text-white/60 hover:bg-white/5 transition-colors">Cancel</button>
              <button onClick={onSave} disabled={saving} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 text-white text-sm font-medium hover:bg-amber-400 disabled:opacity-50 transition-colors shadow-lg shadow-amber-500/20">
                <Save className="w-4 h-4" /> Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ToggleSwitch = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
  <button onClick={() => onChange(!checked)} className={`w-9 h-5 rounded-full relative transition-colors shrink-0 ${checked ? "bg-emerald-500" : "bg-white/10"}`}>
    <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? "translate-x-4" : ""}`} />
  </button>
);

export default AdminTestimonials;
