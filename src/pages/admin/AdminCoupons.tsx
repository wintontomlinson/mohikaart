import { useEffect, useState } from "react";
import { Save, Plus, X, Pencil, Trash2, Ticket, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { Coupon, DEFAULT_COUPONS, fetchSetting, saveSetting, useInvalidateSetting } from "@/lib/cms";
import { formatINR } from "@/lib/site";

const inp = "w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white placeholder:text-white/25 focus:border-amber-500/40 outline-none text-sm transition-all";

const Field = ({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) => (
  <div>
    <label className="block text-[11px] uppercase tracking-widest mb-2 text-white/30 font-medium">{label}</label>
    {children}
    {hint && <p className="text-[10px] text-white/20 mt-1.5">{hint}</p>}
  </div>
);

const newId = () => `c${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
const blank = (): Coupon => ({ id: newId(), code: "", type: "percent", value: 10, min_order: 0, active: true, expires_at: null, usage_count: 0 });
const isExpired = (c: Coupon) => c.expires_at && new Date(c.expires_at).getTime() < Date.now();
const fmtDate = (d: string | null | undefined) => {
  if (!d) return "Never";
  try { return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }); } catch { return "Invalid"; }
};

const AdminCoupons = () => {
  const [items, setItems] = useState<Coupon[]>(DEFAULT_COUPONS);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const invalidate = useInvalidateSetting();

  useEffect(() => {
    fetchSetting<Coupon[]>("coupons", DEFAULT_COUPONS).then((d) => { setItems(d); setLoading(false); });
  }, []);

  const persist = async (next: Coupon[]) => {
    setItems(next);
    const { error } = await saveSetting("coupons", next);
    if (error) toast.error(error.message);
    else invalidate("coupons");
  };

  const onSave = async () => {
    if (!editing) return;
    const code = editing.code.trim().toUpperCase();
    if (!code) return toast.error("Code required");
    if (editing.value <= 0) return toast.error("Value must be > 0");
    if (editing.type === "percent" && editing.value > 100) return toast.error("Can't exceed 100%");
    if (items.find((i) => i.code.toUpperCase() === code && i.id !== editing.id)) return toast.error("Code exists");

    const exists = items.find((i) => i.id === editing.id);
    const updated = { ...editing, code };
    const next = exists ? items.map((i) => (i.id === editing.id ? updated : i)) : [...items, updated];
    await persist(next);
    toast.success(exists ? "Updated" : "Created");
    setEditing(null);
  };

  const onDelete = async (id: string) => {
    if (!confirm("Delete this coupon?")) return;
    await persist(items.filter((i) => i.id !== id));
    toast.success("Deleted");
  };

  const toggle = async (id: string) => {
    await persist(items.map((i) => (i.id === id ? { ...i, active: !i.active } : i)));
  };

  const copyCode = (c: Coupon) => {
    navigator.clipboard.writeText(c.code);
    setCopiedId(c.id);
    setTimeout(() => setCopiedId(null), 1500);
    toast.success("Copied");
  };

  if (loading) return <div className="flex items-center justify-center h-48 text-white/40 text-sm">Loading…</div>;

  return (
    <div className="pb-20 lg:pb-0">
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-white text-3xl font-semibold">Coupons</h1>
          <p className="text-sm text-white/40 mt-1">{items.length} total · {items.filter((i) => i.active && !isExpired(i)).length} active</p>
        </div>
        <button onClick={() => setEditing(blank())} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-white text-sm font-medium hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20">
          <Plus className="w-4 h-4" /> New Coupon
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((c) => {
          const expired = isExpired(c);
          return (
            <div key={c.id} className={`relative bg-[#1a1a22] rounded-2xl border overflow-hidden transition-all ${c.active && !expired ? "border-white/[0.04] hover:border-white/[0.1]" : "border-white/[0.02] opacity-50"}`}>
              <div className="px-5 py-4 border-b border-dashed border-white/[0.06]" style={{ background: c.active && !expired ? "linear-gradient(135deg, rgba(245,158,11,0.05), rgba(139,92,246,0.03))" : undefined }}>
                <div className="flex items-center gap-2">
                  <Ticket className="w-4 h-4 text-amber-400/70" />
                  <code className="font-mono font-bold text-white/90 tracking-wider">{c.code}</code>
                  <button onClick={() => copyCode(c)} className="ml-auto w-7 h-7 rounded-lg hover:bg-white/5 flex items-center justify-center transition-colors">
                    {copiedId === c.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-white/25" />}
                  </button>
                </div>
                <div className="text-xl font-semibold text-amber-400 mt-2">
                  {c.type === "percent" ? `${c.value}% OFF` : `${formatINR(c.value)} OFF`}
                </div>
              </div>
              <div className="p-5 space-y-2.5 text-xs">
                <Row label="Min order">{c.min_order > 0 ? formatINR(c.min_order) : "None"}</Row>
                <Row label="Expires"><span className={expired ? "text-red-400" : ""}>{fmtDate(c.expires_at)}{expired && " (expired)"}</span></Row>
                <Row label="Uses">{c.usage_count ?? 0}</Row>
                <div className="flex items-center justify-between pt-3 border-t border-white/[0.04]">
                  <div className="flex items-center gap-2">
                    <ToggleSwitch checked={c.active} onChange={() => toggle(c.id)} />
                    <span className="text-[10px] uppercase tracking-widest text-white/25">{c.active ? "Active" : "Off"}</span>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => setEditing(c)} className="w-7 h-7 rounded-lg hover:bg-white/5 flex items-center justify-center text-white/25 hover:text-white/60 transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                    <button onClick={() => onDelete(c.id)} className="w-7 h-7 rounded-lg hover:bg-red-500/10 flex items-center justify-center text-white/15 hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {items.length === 0 && (
          <div className="col-span-full text-center p-12 border border-dashed border-white/[0.06] rounded-2xl text-white/20 text-sm">No coupons yet.</div>
        )}
      </div>

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-6">
          <div className="bg-[#1a1a22] w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-t-3xl md:rounded-2xl border border-white/[0.06] shadow-2xl">
            <div className="sticky top-0 bg-[#1a1a22] border-b border-white/[0.04] px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-white text-xl font-semibold flex items-center gap-2">
                <Ticket className="w-5 h-5 text-amber-400" />
                {items.find((i) => i.id === editing.id) ? "Edit" : "New"} Coupon
              </h2>
              <button onClick={() => setEditing(null)} className="w-9 h-9 rounded-xl hover:bg-white/5 flex items-center justify-center text-white/40 hover:text-white/70 transition-colors"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-6 space-y-5">
              <Field label="Code" hint="Letters & numbers, no spaces">
                <input value={editing.code} onChange={(e) => setEditing({ ...editing, code: e.target.value.toUpperCase().replace(/\s+/g, "") })} className={inp + " font-mono uppercase"} placeholder="WELCOME10" />
              </Field>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Discount type">
                  <div className="flex gap-2">
                    {(["percent", "flat"] as const).map((t) => (
                      <button key={t} onClick={() => setEditing({ ...editing, type: t })} className={`flex-1 px-4 py-2.5 rounded-xl text-xs font-medium capitalize transition-all ${editing.type === t ? "bg-amber-500/15 text-amber-400 border border-amber-500/30" : "bg-white/[0.03] text-white/40 border border-white/[0.06]"}`}>
                        {t === "percent" ? "%" : "₹ Flat"}
                      </button>
                    ))}
                  </div>
                </Field>
                <Field label={editing.type === "percent" ? "Discount %" : "Discount ₹"}>
                  <input type="number" value={editing.value} onChange={(e) => setEditing({ ...editing, value: Number(e.target.value) })} className={inp} />
                </Field>
              </div>
              <Field label="Min order (₹)" hint="0 = no minimum">
                <input type="number" value={editing.min_order} onChange={(e) => setEditing({ ...editing, min_order: Number(e.target.value) })} className={inp} />
              </Field>
              <Field label="Expiry date" hint="Leave empty for no expiry">
                <input type="date" value={editing.expires_at ? editing.expires_at.split("T")[0] : ""} onChange={(e) => setEditing({ ...editing, expires_at: e.target.value || null })} className={inp} />
              </Field>
              <div className="flex items-center gap-3">
                <ToggleSwitch checked={editing.active} onChange={(v) => setEditing({ ...editing, active: v })} />
                <span className="text-sm text-white/50">{editing.active ? "Active" : "Disabled"}</span>
              </div>
            </div>
            <div className="sticky bottom-0 bg-[#1a1a22] border-t border-white/[0.04] px-6 py-4 flex justify-end gap-3">
              <button onClick={() => setEditing(null)} className="px-5 py-2.5 rounded-xl border border-white/[0.08] text-sm text-white/60 hover:bg-white/5 transition-colors">Cancel</button>
              <button onClick={onSave} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 text-white text-sm font-medium hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20">
                <Save className="w-4 h-4" /> Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex items-center justify-between">
    <span className="text-white/30">{label}</span>
    <span className="text-white/60 font-medium">{children}</span>
  </div>
);

const ToggleSwitch = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
  <button onClick={() => onChange(!checked)} className={`w-9 h-5 rounded-full relative transition-colors shrink-0 ${checked ? "bg-emerald-500" : "bg-white/10"}`}>
    <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? "translate-x-4" : ""}`} />
  </button>
);

export default AdminCoupons;
