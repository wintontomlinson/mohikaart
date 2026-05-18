import { useEffect, useState } from "react";
import { Save, Plus, Trash2, GripVertical, Megaphone } from "lucide-react";
import { toast } from "sonner";
import {
  Announcement,
  DEFAULT_ANNOUNCEMENTS,
  fetchSetting,
  saveSetting,
  useInvalidateSetting,
} from "@/lib/cms";

const inp =
  "w-full px-4 py-2.5 rounded-xl bg-background border border-border focus:border-foreground/40 outline-none text-sm transition-colors";

const newId = () => `a${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

const AdminAnnouncements = () => {
  const [items, setItems] = useState<Announcement[]>(DEFAULT_ANNOUNCEMENTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const invalidate = useInvalidateSetting();

  useEffect(() => {
    fetchSetting<Announcement[]>("announcements", DEFAULT_ANNOUNCEMENTS).then((d) => {
      setItems(d);
      setLoading(false);
    });
  }, []);

  const update = (id: string, patch: Partial<Announcement>) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));

  const add = () =>
    setItems((prev) => [
      ...prev,
      { id: newId(), text: "New announcement", active: true },
    ]);

  const remove = (id: string) =>
    setItems((prev) => prev.filter((i) => i.id !== id));

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
    toast.success("Announcements saved - top bar will update");
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
        Loading…
      </div>
    );

  return (
    <div className="max-w-3xl">
      <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-4xl flex items-center gap-3">
            Announcements
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Rotating messages in the navbar top strip. Use{" "}
            <code className="px-1.5 py-0.5 bg-muted rounded text-[11px]">{"{threshold}"}</code>{" "}
            to insert your free shipping amount.
          </p>
        </div>
        <button
          onClick={add}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-foreground text-background text-sm hover:opacity-85 transition-opacity"
        >
          <Plus className="w-4 h-4" /> Add Message
        </button>
      </div>

      {/* Live preview strip */}
      <div
        className="mb-6 rounded-2xl overflow-hidden p-4"
        style={{
          background:
            "linear-gradient(90deg, hsl(22 24% 14%), hsl(28 26% 20%) 45%, hsl(34 38% 30%) 70%, hsl(22 24% 14%))",
        }}
      >
        <div className="text-[9px] uppercase tracking-[0.25em] text-amber-300/70 font-bold mb-2">
          Preview
        </div>
        <div className="text-white/90 text-xs space-y-1.5">
          {items.filter((i) => i.active).length === 0 ? (
            <span className="opacity-50">No active announcements</span>
          ) : (
            items.filter((i) => i.active).map((i) => (
              <div key={i.id} className="flex items-center gap-2">
                <span className="text-amber-300/70">✦</span>
                <span>{i.text.replace("{threshold}", "499")}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Items list */}
      <div className="space-y-3">
        {items.map((item, idx) => (
          <div
            key={item.id}
            className="bg-background rounded-2xl border border-border p-4 flex items-center gap-3 hover:border-foreground/20 transition-colors"
          >
            {/* Reorder */}
            <div className="flex flex-col gap-0.5">
              <button
                onClick={() => move(idx, -1)}
                disabled={idx === 0}
                className="text-muted-foreground hover:text-foreground transition-colors disabled:opacity-20"
              >
                <span className="block text-[10px] leading-none">▲</span>
              </button>
              <GripVertical className="w-3 h-3 text-muted-foreground/40" />
              <button
                onClick={() => move(idx, 1)}
                disabled={idx === items.length - 1}
                className="text-muted-foreground hover:text-foreground transition-colors disabled:opacity-20"
              >
                <span className="block text-[10px] leading-none">▼</span>
              </button>
            </div>

            {/* Active toggle */}
            <label className="flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={item.active}
                onChange={(e) => update(item.id, { active: e.target.checked })}
                className="sr-only"
              />
              <span
                className={`w-9 h-5 rounded-full relative transition-colors ${
                  item.active ? "bg-emerald-500" : "bg-muted"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                    item.active ? "translate-x-4" : ""
                  }`}
                />
              </span>
            </label>

            <input
              value={item.text}
              onChange={(e) => update(item.id, { text: e.target.value })}
              className={inp + " flex-1"}
              placeholder="Your announcement message"
            />

            <button
              onClick={() => remove(item.id)}
              className="w-9 h-9 rounded-lg hover:bg-destructive/10 text-destructive flex items-center justify-center shrink-0 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}

        {items.length === 0 && (
          <div className="text-center p-12 border border-dashed border-border rounded-2xl text-muted-foreground text-sm">
            No announcements yet. Click "Add Message" to create one.
          </div>
        )}
      </div>

      <div className="sticky bottom-4 md:bottom-6 mt-6 z-10">
        <div className="bg-background rounded-2xl border border-border shadow-luxe p-4 flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            <Megaphone className="w-3.5 h-3.5 inline mr-1" />
            {items.filter((i) => i.active).length} of {items.length} active
          </div>
          <button
            onClick={save}
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-foreground text-background text-sm hover:opacity-85 transition-opacity disabled:opacity-60"
          >
            <Save className="w-4 h-4" /> {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminAnnouncements;
