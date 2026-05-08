import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Save, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { DEFAULT_SETTINGS, StoreSettings, invalidateSettingsCache } from "@/lib/settings";

type RazorpayConfig = { key_id: string; mode: "test" | "live"; secret_configured: boolean };

const inp = "w-full px-4 py-2.5 rounded-xl bg-background border border-border focus:border-foreground/40 outline-none text-sm transition-colors";

const AdminSettings = () => {
  const [rzp, setRzp] = useState<RazorpayConfig>({ key_id: "", mode: "test", secret_configured: false });
  const [store, setStore] = useState<StoreSettings>(DEFAULT_SETTINGS);
  const [showKey, setShowKey] = useState(false);
  const [savingRzp, setSavingRzp] = useState(false);
  const [savingStore, setSavingStore] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from("app_settings").select("value").eq("key", "razorpay").maybeSingle(),
      supabase.from("app_settings").select("value").eq("key", "store").maybeSingle(),
    ]).then(([{ data: rzpData }, { data: storeData }]) => {
      if (rzpData?.value && typeof rzpData.value === "object" && !Array.isArray(rzpData.value)) {
        setRzp(rzpData.value as any);
      }
      if (storeData?.value && typeof storeData.value === "object" && !Array.isArray(storeData.value)) {
        setStore({ ...DEFAULT_SETTINGS, ...(storeData.value as any) });
      }
      setLoading(false);
    });
  }, []);

  const onSaveRzp = async () => {
    setSavingRzp(true);
    const { error } = await supabase.from("app_settings").upsert({ key: "razorpay", value: rzp as any });
    setSavingRzp(false);
    if (error) return toast.error(error.message);
    toast.success("Payment settings saved");
  };

  const onSaveStore = async () => {
    setSavingStore(true);
    const { error } = await supabase.from("app_settings").upsert({ key: "store", value: store as any });
    setSavingStore(false);
    if (error) return toast.error(error.message);
    invalidateSettingsCache();
    toast.success("Store settings saved — changes are live");
  };

  if (loading) return (
    <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
  );

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="font-display text-4xl">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Configure store details and payment settings</p>
      </div>

      {/* ── Store Info ─────────────────────────────────────────── */}
      <div className="bg-background rounded-2xl border border-border overflow-hidden">
        <div className="px-6 py-5 border-b border-border">
          <h2 className="font-display text-xl">Store Information</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Contact details shown in the footer, contact page, WhatsApp button, and checkout.
          </p>
        </div>

        <div className="p-6 space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-widest mb-2 text-muted-foreground">
                WhatsApp Number (digits only)
              </label>
              <input
                value={store.phone}
                onChange={(e) => setStore((s) => ({ ...s, phone: e.target.value.replace(/\D/g, "") }))}
                className={inp + " font-mono"}
                placeholder="919876543210"
              />
              <p className="text-[10px] text-muted-foreground mt-1">Include country code, no + or spaces</p>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest mb-2 text-muted-foreground">
                Display Phone
              </label>
              <input
                value={store.phone_display}
                onChange={(e) => setStore((s) => ({ ...s, phone_display: e.target.value }))}
                className={inp}
                placeholder="+91 98765 43210"
              />
              <p className="text-[10px] text-muted-foreground mt-1">Shown as text on the site</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-widest mb-2 text-muted-foreground">Email</label>
              <input
                type="email"
                value={store.email}
                onChange={(e) => setStore((s) => ({ ...s, email: e.target.value }))}
                className={inp}
                placeholder="hello@mohikaart.com"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest mb-2 text-muted-foreground">
                Instagram Handle
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">@</span>
                <input
                  value={store.instagram}
                  onChange={(e) => setStore((s) => ({ ...s, instagram: e.target.value.replace(/^@/, "") }))}
                  className={inp + " pl-8"}
                  placeholder="mohikaart"
                />
              </div>
            </div>
          </div>

          <div className="max-w-xs">
            <label className="block text-xs uppercase tracking-widest mb-2 text-muted-foreground">
              Free Shipping Threshold (₹)
            </label>
            <input
              type="number"
              value={store.free_shipping_threshold}
              onChange={(e) => setStore((s) => ({ ...s, free_shipping_threshold: Number(e.target.value) || 0 }))}
              className={inp}
              placeholder="499"
            />
            <p className="text-[10px] text-muted-foreground mt-1">Shown in the announcement bar</p>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-border flex justify-end">
          <button
            onClick={onSaveStore}
            disabled={savingStore}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-foreground text-background text-sm disabled:opacity-60 hover:opacity-85 transition-opacity"
          >
            <Save className="w-4 h-4" /> {savingStore ? "Saving…" : "Save Store Info"}
          </button>
        </div>
      </div>

      {/* ── Razorpay ───────────────────────────────────────────── */}
      <div className="bg-background rounded-2xl border border-border overflow-hidden">
        <div className="px-6 py-5 border-b border-border">
          <h2 className="font-display text-xl">Razorpay Payments</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Enter your Razorpay Publishable Key ID to enable online payments at checkout.
            Get it from{" "}
            <a href="https://dashboard.razorpay.com/app/keys" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
              razorpay.com/app/keys
            </a>.
          </p>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-widest mb-2 text-muted-foreground">Mode</label>
            <div className="flex gap-3">
              {(["test", "live"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setRzp((r) => ({ ...r, mode: m }))}
                  className={`px-5 py-2 rounded-full text-xs font-medium border capitalize transition-all ${
                    rzp.mode === m
                      ? "bg-foreground text-background border-foreground"
                      : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest mb-2 text-muted-foreground">
              {rzp.mode === "test" ? "Test" : "Live"} Key ID
            </label>
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                value={rzp.key_id}
                onChange={(e) => setRzp((r) => ({ ...r, key_id: e.target.value }))}
                className={inp + " pr-11 font-mono"}
                placeholder={rzp.mode === "test" ? "rzp_test_xxxxxxxxxxxxxxxxxxxx" : "rzp_live_xxxxxxxxxxxxxxxxxxxx"}
              />
              <button
                type="button"
                onClick={() => setShowKey((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">
              Only the publishable Key ID is stored here. Never enter your Key Secret.
            </p>
          </div>

          {rzp.key_id ? (
            <div className="flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 px-4 py-3 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              Razorpay {rzp.mode} mode is configured. Online payments will appear at checkout.
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 px-4 py-3 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
              No Key ID set. Customers will only see the WhatsApp order option at checkout.
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-border flex justify-end">
          <button
            onClick={onSaveRzp}
            disabled={savingRzp}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-foreground text-background text-sm disabled:opacity-60 hover:opacity-85 transition-opacity"
          >
            <Save className="w-4 h-4" /> {savingRzp ? "Saving…" : "Save Payment Settings"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
