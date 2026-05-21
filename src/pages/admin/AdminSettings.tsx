import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Save, Eye, EyeOff, Settings as SettingsIcon, CreditCard, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { DEFAULT_SETTINGS, StoreSettings, useInvalidateStoreSettings } from "@/lib/settings";
import { DEFAULT_SEO, SeoSettings, fetchSetting, saveSetting, useInvalidateSetting } from "@/lib/cms";

type RazorpayConfig = { key_id: string; mode: "test" | "live"; secret_configured: boolean };

const inp = "w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white placeholder:text-white/25 focus:border-amber-500/40 focus:bg-white/[0.05] outline-none text-sm transition-all";

const AdminSettings = () => {
  const [rzp, setRzp] = useState<RazorpayConfig>({ key_id: "", mode: "test", secret_configured: false });
  const [store, setStore] = useState<StoreSettings>(DEFAULT_SETTINGS);
  const [seo, setSeo] = useState<SeoSettings>(DEFAULT_SEO);
  const [showKey, setShowKey] = useState(false);
  const [savingRzp, setSavingRzp] = useState(false);
  const [savingStore, setSavingStore] = useState(false);
  const [savingSeo, setSavingSeo] = useState(false);
  const [loading, setLoading] = useState(true);
  const invalidateStore = useInvalidateStoreSettings();
  const invalidateSetting = useInvalidateSetting();

  useEffect(() => {
    Promise.all([
      supabase.from("app_settings").select("value").eq("key", "razorpay").maybeSingle(),
      supabase.from("app_settings").select("value").eq("key", "store").maybeSingle(),
      fetchSetting<SeoSettings>("seo", DEFAULT_SEO),
    ]).then(([{ data: rzpData }, { data: storeData }, seoData]) => {
      if (rzpData?.value && typeof rzpData.value === "object" && !Array.isArray(rzpData.value)) {
        setRzp(rzpData.value as any);
      }
      if (storeData?.value && typeof storeData.value === "object" && !Array.isArray(storeData.value)) {
        setStore({ ...DEFAULT_SETTINGS, ...(storeData.value as any) });
      }
      setSeo(seoData);
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
    invalidateStore();
    toast.success("Store settings saved");
  };

  const onSaveSeo = async () => {
    setSavingSeo(true);
    const { error } = await saveSetting("seo", seo);
    setSavingSeo(false);
    if (error) return toast.error(error.message);
    invalidateSetting("seo");
    toast.success("SEO settings saved");
  };

  if (loading) return (
    <div className="flex items-center justify-center h-48 text-white/40 text-sm">Loading…</div>
  );

  return (
    <div className="max-w-2xl space-y-6 pb-20 lg:pb-0">
      <div>
        <h1 className="text-white text-3xl font-semibold">Settings</h1>
        <p className="text-sm text-white/40 mt-1">Configure store details, SEO, and payments</p>
      </div>

      {/* Store Information */}
      <SettingsCard icon={ShoppingCart} title="Store Information" desc="Contact details shown across the site">
        <div className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="WhatsApp Number" hint="Include country code, digits only">
              <input
                value={store.phone}
                onChange={(e) => setStore((s) => ({ ...s, phone: e.target.value.replace(/\D/g, "") }))}
                className={inp + " font-mono"}
                placeholder="919876543210"
              />
            </Field>
            <Field label="Display Phone">
              <input
                value={store.phone_display}
                onChange={(e) => setStore((s) => ({ ...s, phone_display: e.target.value }))}
                className={inp}
                placeholder="+91 98765 43210"
              />
            </Field>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Email">
              <input
                type="email"
                value={store.email}
                onChange={(e) => setStore((s) => ({ ...s, email: e.target.value }))}
                className={inp}
                placeholder="hello@mohikaart.com"
              />
            </Field>
            <Field label="Instagram Handle">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 text-sm">@</span>
                <input
                  value={store.instagram}
                  onChange={(e) => setStore((s) => ({ ...s, instagram: e.target.value.replace(/^@/, "") }))}
                  className={inp + " pl-8"}
                  placeholder="mohikaart"
                />
              </div>
            </Field>
          </div>
          <div className="max-w-xs">
            <Field label="Free Shipping Threshold (₹)" hint="Shown in announcement bar">
              <input
                type="number"
                value={store.free_shipping_threshold}
                onChange={(e) => setStore((s) => ({ ...s, free_shipping_threshold: Number(e.target.value) || 0 }))}
                className={inp}
                placeholder="499"
              />
            </Field>
          </div>
        </div>
        <SaveBar saving={savingStore} onSave={onSaveStore} label="Save Store Info" />
      </SettingsCard>

      {/* SEO Settings */}
      <SettingsCard icon={SettingsIcon} title="SEO Settings" desc="Page title, description, and social share">
        <div className="space-y-5">
          <Field label="Site Title" hint={`${seo.site_title.length}/60 characters`}>
            <input
              value={seo.site_title}
              onChange={(e) => setSeo((s) => ({ ...s, site_title: e.target.value }))}
              className={inp}
              placeholder="Mohika Art - Customized Resin Crafts"
            />
          </Field>
          <Field label="Meta Description" hint={`${seo.site_description.length}/160 characters`}>
            <textarea
              rows={3}
              value={seo.site_description}
              onChange={(e) => setSeo((s) => ({ ...s, site_description: e.target.value }))}
              className={inp + " resize-none"}
              placeholder="Brief summary (150-160 chars)"
            />
          </Field>
          <Field label="Keywords" hint="Comma-separated">
            <input
              value={seo.keywords}
              onChange={(e) => setSeo((s) => ({ ...s, keywords: e.target.value }))}
              className={inp}
              placeholder="resin art, customized gifts"
            />
          </Field>
          <Field label="Social Share Image (URL)" hint="1200×630px recommended">
            <input
              value={seo.og_image}
              onChange={(e) => setSeo((s) => ({ ...s, og_image: e.target.value }))}
              className={inp + " font-mono text-xs"}
              placeholder="https://…"
            />
          </Field>
        </div>
        <SaveBar saving={savingSeo} onSave={onSaveSeo} label="Save SEO" />
      </SettingsCard>

      {/* Razorpay */}
      <SettingsCard icon={CreditCard} title="Razorpay Payments" desc="Enable online payments at checkout">
        <div className="space-y-5">
          <Field label="Mode">
            <div className="flex gap-2">
              {(["test", "live"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setRzp((r) => ({ ...r, mode: m }))}
                  className={`px-5 py-2 rounded-xl text-xs font-medium capitalize transition-all ${
                    rzp.mode === m
                      ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                      : "bg-white/[0.03] text-white/40 border border-white/[0.06] hover:text-white/70"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </Field>
          <Field label={`${rzp.mode === "test" ? "Test" : "Live"} Key ID`} hint="Only the publishable Key ID — never your secret">
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                value={rzp.key_id}
                onChange={(e) => setRzp((r) => ({ ...r, key_id: e.target.value }))}
                className={inp + " pr-11 font-mono"}
                placeholder={rzp.mode === "test" ? "rzp_test_xxx" : "rzp_live_xxx"}
              />
              <button
                type="button"
                onClick={() => setShowKey((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </Field>

          {rzp.key_id ? (
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/5 px-4 py-3 rounded-xl border border-emerald-500/15">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
              Razorpay {rzp.mode} mode configured. Online payments enabled.
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-amber-300 bg-amber-500/5 px-4 py-3 rounded-xl border border-amber-500/15">
              <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
              No Key ID set. Only WhatsApp ordering will be available.
            </div>
          )}
        </div>
        <SaveBar saving={savingRzp} onSave={onSaveRzp} label="Save Payment Settings" />
      </SettingsCard>
    </div>
  );
};

/* ── Helpers ── */

const Field = ({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) => (
  <div>
    <label className="block text-[11px] uppercase tracking-widest mb-2 text-white/30 font-medium">{label}</label>
    {children}
    {hint && <p className="text-[10px] text-white/20 mt-1.5">{hint}</p>}
  </div>
);

const SettingsCard = ({ icon: Icon, title, desc, children }: { icon: any; title: string; desc: string; children: React.ReactNode }) => (
  <div className="bg-[#1a1a22] rounded-2xl border border-white/[0.04] overflow-hidden">
    <div className="px-6 py-5 border-b border-white/[0.04] flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
        <Icon className="w-4 h-4 text-amber-400" />
      </div>
      <div>
        <h2 className="text-white font-semibold">{title}</h2>
        <p className="text-[11px] text-white/30 mt-0.5">{desc}</p>
      </div>
    </div>
    <div className="p-6">
      {children}
    </div>
  </div>
);

const SaveBar = ({ saving, onSave, label }: { saving: boolean; onSave: () => void; label: string }) => (
  <div className="mt-6 pt-5 border-t border-white/[0.04] flex justify-end">
    <button
      onClick={onSave}
      disabled={saving}
      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 text-white text-sm font-medium hover:bg-amber-400 disabled:opacity-50 transition-colors shadow-lg shadow-amber-500/20"
    >
      <Save className="w-4 h-4" /> {saving ? "Saving…" : label}
    </button>
  </div>
);

export default AdminSettings;
