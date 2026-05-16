import { useEffect, useState } from "react";
import { Save, Plus, X, Pencil, Trash2, Ticket, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import {
  Coupon,
  DEFAULT_COUPONS,
  fetchSetting,
  saveSetting,
  invalidateCmsCache,
} from "@/lib/cms";
import { formatINR } from "@/lib/site";

const inp =
  "w-full px-4 py-2.5 rounded-xl bg-background border border-border focus:border-foreground/40 outline-none text-sm transition-colors";

const Field = ({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) => (
  <div>
    <label className="block text-xs uppercase tracking-widest mb-2 text-muted-foreground">
      {label}
    </label>
    {children}
    {hint && <p className="text-[10px] text-muted-foreground/70 mt-1">{hint}</p>}
  </div>
);

const newId = () => `c${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

const blank = (): Coupon => ({
  id: newId(),
  code: "",
  type: "percent",
  value: 10,
  min_order: 0,
  active: true,
  expires_at: null,
  usage_count: 0,
});

const isExpired = (c: Coupon) =>
  c.expires_at && new Date(c.expires_at).getTime() < Date.now();

const fmtDate = (d: string | null | undefined) => {
  if (!d) return "Never";
  try {
    return new Date(d).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
    });
  } catch { return "Invalid"; }
};

const AdminCoupons = () => {
  const [items, setItems] = useState<Coupon[]>(DEFAULT_COUPONS);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetchSetting<Coupon[]>("coupons", DEFAULT_COUPONS).then((d) => {
      setItems(d);
      setLoading(false);
    });
  }, []);

  const persist = async (next: Coupon[]) => {
    setItems(next);
    const { error } = await saveSetting("coupons", next);
    if (error) toast.error(error.message);
    else invalidateCmsCache("coupons");
  };

  const onSave = async () => {
    if (!editing) return;
    const code = editing.code.trim().toUpperCase();
    if (!code) return toast.error("Coupon code is required");
    if (editing.value <= 0) return toast.error("Discount value must be greater than 0");
    if (editing.type === "percent" && editing.value > 100) return toast.error("Percent discount can't exceed 100%");

    // dedupe by code (case-insensitive) excluding current
    if (items.find((i) => i.code.toUpperCase() === code && i.id !== editing.id)) {
      return toast.error("Coupon code already exists");
    }

    const exists = items.find((i) => i.id === editing.id);
    const updated = { ...editing, code };
    const next = exists
      ? items.map((i) => (i.id === editing.id ? updated : i))
      : [...items, updated];
    await persist(next);
    toast.success(exists ? "Coupon updated" : "Coupon created");
    setEditing(null);
  };

  const onDelete = async (id: string) => {
    if (!confirm("Delete this coupon? Customers won't be able to use it.")) return;
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
    toast.success("Code copied");
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
        Loading…
      </div>
    );

  const active = items.filter((i) => i.active && !isExpired(i)).length;

  return (
    <div>
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-4xl">Coupons</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {items.length} total · {active} active
          </p>
        </div>
        <button
          onClick={() => setEditing(blank())}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-foreground text-background text-sm hover:opacity-85 transition-opacity"
        >
          <Plus className="w-4 h-4" /> New Coupon
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((c) => {
          const expired = isExpired(c);
          return (
            <div
              key={c.id}
              className={`relative bg-background rounded-2xl border overflow-hidden transition-all ${
                c.active && !expired
                  ? "border-border hover:border-foreground/20 hover:shadow-sm"
                  : "border-border/50 opacity-60"
              }`}
            >
              {/* Coupon ribbon */}
              <div
                className="px-5 py-4 relative"
                style={{
                  background:
                    c.active && !expired
                      ? "linear-gradient(135deg, hsl(34 58% 52%/0.08), hsl(348 55% 92%/0.45))"
                      : "hsl(var(--muted))",
                  borderBottom: "1px dashed hsl(var(--border))",
                }}
              >
                <div className="flex items-center gap-2">
                  <Ticket className="w-4 h-4 text-amber-700" />
                  <code className="font-mono font-bold text-base tracking-wider">{c.code}</code>
                  <button
                    onClick={() => copyCode(c)}
                    className="ml-auto w-7 h-7 rounded-lg hover:bg-foreground/5 flex items-center justify-center transition-colors"
                  >
                    {copiedId === c.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                    )}
                  </button>
                </div>
                <div className="font-display text-2xl mt-2 text-amber-700">
                  {c.type === "percent" ? `${c.value}% OFF` : `${formatINR(c.value)} OFF`}
                </div>
              </div>

              <div className="p-5 space-y-2.5 text-xs">
                <Row label="Min order">
                  {c.min_order > 0 ? formatINR(c.min_order) : "No minimum"}
                </Row>
                <Row label="Expires">
                  <span className={expired ? "text-destructive" : ""}>
                    {fmtDate(c.expires_at)}
                    {expired && " (expired)"}
                  </span>
                </Row>
                <Row label="Uses">{c.usage_count ?? 0}</Row>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={c.active}
                      onChange={() => toggle(c.id)}
                      className="sr-only"
                    />
                    <span
                      className={`w-8 h-4 rounded-full relative transition-colors ${
                        c.active ? "bg-emerald-500" : "bg-muted"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform ${
                          c.active ? "translate-x-4" : ""
                        }`}
                      />
                    </span>
                    <span className="ml-2 text-[10px] uppercase tracking-widest text-muted-foreground">
                      {c.active ? "Active" : "Off"}
                    </span>
                  </label>

                  <div className="flex gap-1">
                    <button
                      onClick={() => setEditing(c)}
                      className="w-7 h-7 rounded-lg hover:bg-muted flex items-center justify-center"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDelete(c.id)}
                      className="w-7 h-7 rounded-lg hover:bg-destructive/10 text-destructive flex items-center justify-center"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {items.length === 0 && (
          <div className="col-span-full text-center p-12 border border-dashed border-border rounded-2xl text-muted-foreground text-sm">
            No coupons yet. Click "New Coupon" to create one.
          </div>
        )}
      </div>

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-6">
          <div className="bg-background w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-t-3xl md:rounded-3xl shadow-2xl">
            <div className="sticky top-0 bg-background border-b border-border px-6 py-4 flex items-center justify-between">
              <h2 className="font-display text-2xl flex items-center gap-2">
                <Ticket className="w-5 h-5 text-amber-600" />
                {items.find((i) => i.id === editing.id) ? "Edit" : "New"} Coupon
              </h2>
              <button
                onClick={() => setEditing(null)}
                className="w-9 h-9 rounded-full hover:bg-muted flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <Field label="Code" hint="Customers will type this at checkout. Letters & numbers, no spaces.">
                <input
                  value={editing.code}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      code: e.target.value.toUpperCase().replace(/\s+/g, ""),
                    })
                  }
                  className={inp + " font-mono uppercase"}
                  placeholder="WELCOME10"
                />
              </Field>

              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Discount type">
                  <div className="flex gap-2">
                    {(["percent", "flat"] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setEditing({ ...editing, type: t })}
                        className={`flex-1 px-4 py-2.5 rounded-xl text-xs font-medium border capitalize transition-all ${
                          editing.type === t
                            ? "bg-foreground text-background border-foreground"
                            : "border-border text-muted-foreground hover:border-foreground/30"
                        }`}
                      >
                        {t === "percent" ? "Percent (%)" : "Flat (₹)"}
                      </button>
                    ))}
                  </div>
                </Field>
                <Field label={editing.type === "percent" ? "Discount %" : "Discount ₹"}>
                  <input
                    type="number"
                    value={editing.value}
                    onChange={(e) => setEditing({ ...editing, value: Number(e.target.value) })}
                    className={inp}
                  />
                </Field>
              </div>

              <Field label="Minimum order amount (₹)" hint="0 = no minimum">
                <input
                  type="number"
                  value={editing.min_order}
                  onChange={(e) => setEditing({ ...editing, min_order: Number(e.target.value) })}
                  className={inp}
                />
              </Field>

              <Field label="Expiry date" hint="Leave empty for no expiry">
                <input
                  type="date"
                  value={editing.expires_at ? editing.expires_at.split("T")[0] : ""}
                  onChange={(e) =>
                    setEditing({ ...editing, expires_at: e.target.value || null })
                  }
                  className={inp}
                />
              </Field>

              <label className="flex items-center gap-3 cursor-pointer">
                <span
                  onClick={() => setEditing({ ...editing, active: !editing.active })}
                  className={`w-9 h-5 rounded-full relative transition-colors ${
                    editing.active ? "bg-emerald-500" : "bg-muted"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                      editing.active ? "translate-x-4" : ""
                    }`}
                  />
                </span>
                <span className="text-sm">
                  {editing.active ? "Active" : "Disabled"}
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
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-foreground text-background text-sm hover:opacity-85 transition-opacity"
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

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex items-center justify-between">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-medium">{children}</span>
  </div>
);

export default AdminCoupons;
