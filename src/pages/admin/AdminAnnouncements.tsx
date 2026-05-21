import { useEffect, useState } from "react";
import { Save, Plus, Trash2, GripVertical, Megaphone } from "lucide-react";
import { toast } from "sonner";
import { Announcement, DEFAULT_ANNOUNCEMENTS, fetchSetting, saveSetting, useInvalidateSetting } from "@/lib/cms";

const inp = "w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white placeholder:text-white/25 focus:border-amber-500/40 outline-none text-sm transition-all";

const newId = () => `a${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

const AdminAnnouncements = () => {
  const [items, setItems] = useState<Announcement[]>(DEFAULT_ANNOUNCEMENTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const invalidate = useInvalidateSetting();

  useEffect(() => {
    fetchSetting<Announcement[]>("announcements", DEFAULT_ANNOUNCEMENTS).then((d) => { setItems(d); setLoading(false); });
  }, []);

  const update = (id: string, patch: Partial<Announcement>) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));

  const add = () => setItems((prev) => [...prev, { id: newId(), text: "New announcement", active: true }]);
  const remove = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));

  const move = (idx: number, dir: -1 | 1) => {
    const next = [...items];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    setItems(next);
  };

  const save = async () => {
    setSaving(true);
    const { error } = await saveSetting("announcements", items);
    setSaving(false);
    if (error) return toast.error(error.message);
    invalidate("announcements");
    toast.success("Announcements saved");
  };

  if (loading) return <div className="flex items-center justify-center h-48 text-white/40 text-sm">Loading…</div>;

  return (
    <div className="max-w-3xl pb-20 lg:pb-0">
      <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-white text-3xl font-semibold">Announcements</h1>
          <p className="text-sm text-white/40 mt-1">
            Top bar messages. Use <code className="px-1.5 py-0.5 bg-white/5 rounded text-[11px] text-white/50">{"{threshold}"}</code> for free shipping amount.
          </p>
        </div>
        <button onClick={add} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-white text-sm font-medium hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20">
          <Plus className="w-4 h-4" /> Add Message
        </button>
      </div>

      {/* Preview */}
      <div className="mb-6 rounded-2xl overflow-hidden p-4 bg-gradient-to-r from-[#1a1a22] via-[#22222e] to-[#1a1a22] border border-white/[0.04]">
        <div className="text-[9px] uppercase tracking-[0.25em] text-amber-400/50 font-bold mb-2">Preview</div>
        <div className="text-white/70 text-xs space-y-1.5">
          {items.filter((i) => i.active).length === 0 ? (
            <span className="text-white/20">No active announcements</span>
          ) : (
            items.filter((i) => i.active).map((i) => (
              <div key={i.id} className="flex items-center gap-2">
                <span className="text-amber-400/60">✦</span>
                <span>{i.text.replace("{threshold}", "499")}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Items */}
      <div className="space-y-3">
        {items.map((item, idx) => (
          <div key={item.id} className="bg-[#1a1a22] rounded-2xl border border-white/[0.04] p-4 flex items-center gap-3 hover:border-white/[0.08] transition-colors">
            <div className="flex flex-col gap-0.5">
              <button onClick={() => move(idx, -1)} disabled={idx === 0} className="text-white/20 hover:text-white/60 disabled:opacity-20 transition-colors">
                <span className="block text-[10px] leading-none">▲</span>
              </button>
              <GripVertical className="w-3 h-3 text-white/10" />
              <button onClick={() => move(idx, 1)} disabled={idx === items.length - 1} className="text-white/20 hover:text-white/60 disabled:opacity-20 transition-colors">
                <span className="block text-[10px] leading-none">▼</span>
              </button>
            </div>

            <ToggleSwitch checked={item.active} onChange={(v) => update(item.id, { active: v })} />

            <input
              value={item.text}
              onChange={(e) => update(item.id, { text: e.target.value })}
              className={inp + " flex-1"}
              placeholder="Announcement text"
            />

            <button onClick={() => remove(item.id)} className="w-9 h-9 rounded-lg hover:bg-red-500/10 text-white/20 hover:text-red-400 flex items-center justify-center shrink-0 transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-center p-12 border border-dashed border-white/[0.06] rounded-2xl text-white/20 text-sm">
            No announcements yet.
          </div>
        )}
      </div>

      {/* Sticky save */}
      <div className="sticky bottom-4 md:bottom-6 mt-6 z-10">
        <div className="bg-[#1a1a22] rounded-2xl border border-white/[0.06] shadow-2xl p-4 flex items-center justify-between">
          <div className="text-xs text-white/30 flex items-center gap-1.5">
            <Megaphone className="w-3.5 h-3.5" />
            {items.filter((i) => i.active).length} of {items.length} active
          </div>
          <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 text-white text-sm font-medium hover:bg-amber-400 disabled:opacity-50 transition-colors shadow-lg shadow-amber-500/20">
            <Save className="w-4 h-4" /> {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

const ToggleSwitch = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
  <button
    onClick={() => onChange(!checked)}
    className={`w-9 h-5 rounded-full relative transition-colors shrink-0 ${checked ? "bg-emerald-500" : "bg-white/10"}`}
  >
    <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? "translate-x-4" : ""}`} />
  </button>
);

export default AdminAnnouncements;
