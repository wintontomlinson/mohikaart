import { useEffect, useState } from "react";
import { fetchSetting, saveSetting, useInvalidateSetting, DEFAULT_SEO } from "@/lib/cms";
import { DEFAULT_SETTINGS, invalidateSettingsCache } from "@/lib/settings";
import type { StoreSettings } from "@/lib/settings";
import type { SeoSettings } from "@/lib/cms";
import { toast } from "sonner";
import { Save, Store, Globe, CreditCard, Loader2 } from "lucide-react";
import ImageUpload from "./ImageUpload";

const inp = "w-full px-4 py-2.5 rounded-xl bg-white border border-[#e5e0d8] focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/20 outline-none text-sm transition-all";

type RazorpaySettings = {
  mode: "test" | "live";
  key_id: string;
};

const DEFAULT_RAZORPAY: RazorpaySettings = { mode: "test", key_id: "" };

const AdminSettings = () => {
  const invalidate = useInvalidateSetting();

  // Store settings
  const [store, setStore] = useState<StoreSettings>(DEFAULT_SETTINGS);
  const [storeLoading, setStoreLoading] = useState(true);
  const [storeSaving, setStoreSaving] = useState(false);

  // SEO settings
  const [seo, setSeo] = useState<SeoSettings>(DEFAULT_SEO);
  const [seoLoading, setSeoLoading] = useState(true);
  const [seoSaving, setSeoSaving] = useState(false);

  // Razorpay settings
  const [razorpay, setRazorpay] = useState<RazorpaySettings>(DEFAULT_RAZORPAY);
  const [razorpayLoading, setRazorpayLoading] = useState(true);
  const [razorpaySaving, setRazorpaySaving] = useState(false);

  useEffect(() => {
    fetchSetting<StoreSettings>("store", DEFAULT_SETTINGS).then((d) => { setStore(d); setStoreLoading(false); });
    fetchSetting<SeoSettings>("seo", DEFAULT_SEO).then((d) => { setSeo(d); setSeoLoading(false); });
    fetchSetting<RazorpaySettings>("razorpay", DEFAULT_RAZORPAY).then((d) => { setRazorpay(d); setRazorpayLoading(false); });
  }, []);

  const saveStore = async () => {
    setStoreSaving(true);
    const { error } = await saveSetting("store", store);
    setStoreSaving(false);
    if (error) return toast.error(error.message);
    invalidateSettingsCache();
    invalidate("store");
    toast.success("Store settings saved");
  };

  const saveSeo = async () => {
    setSeoSaving(true);
    const { error } = await saveSetting("seo", seo);
    setSeoSaving(false);
    if (error) return toast.error(error.message);
    invalidate("seo");
    toast.success("SEO settings saved");
  };

  const saveRazorpay = async () => {
    setRazorpaySaving(true);
    const { error } = await saveSetting("razorpay", razorpay);
    setRazorpaySaving(false);
    if (error) return toast.error(error.message);
    invalidate("razorpay");
    toast.success("Payment settings saved");
  };

  return (
    <div className="pb-24 lg:pb-0 max-w-3xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl" style={{ color: "#1a1208" }}>Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your store configuration</p>
      </div>

      <div className="space-y-8">
        {/* Store Info */}
        <section className="bg-white/70 backdrop-blur-xl rounded-2xl border border-[#e5e0d8]/60 overflow-hidden">
          <div className="p-6 border-b border-[#e5e0d8]/40 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)" }}>
              <Store className="w-4.5 h-4.5" style={{ color: "#c9a84c" }} />
            </div>
            <div>
              <h2 className="font-display text-lg" style={{ color: "#1a1208" }}>Store Info</h2>
              <p className="text-xs text-muted-foreground">Contact details & preferences</p>
            </div>
          </div>
          {storeLoading ? (
            <div className="p-6 flex items-center justify-center py-12">
              <Loader2 className="w-5 h-5 animate-spin text-[#c9a84c]" />
            </div>
          ) : (
            <div className="p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-widest mb-2 text-muted-foreground font-medium">Phone (digits only)</label>
                  <input value={store.phone} onChange={(e) => setStore({ ...store, phone: e.target.value })} className={inp} placeholder="919876543210" />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-widest mb-2 text-muted-foreground font-medium">Phone Display</label>
                  <input value={store.phone_display} onChange={(e) => setStore({ ...store, phone_display: e.target.value })} className={inp} placeholder="+91 98765 43210" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-widest mb-2 text-muted-foreground font-medium">Email</label>
                  <input type="email" value={store.email} onChange={(e) => setStore({ ...store, email: e.target.value })} className={inp} placeholder="hello@mohikaart.com" />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-widest mb-2 text-muted-foreground font-medium">Instagram Handle</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">@</span>
                    <input value={store.instagram} onChange={(e) => setStore({ ...store, instagram: e.target.value })} className={inp + " pl-8"} placeholder="mohikaart" />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-widest mb-2 text-muted-foreground font-medium">Free Shipping Threshold (₹)</label>
                <input type="number" value={store.free_shipping_threshold} onChange={(e) => setStore({ ...store, free_shipping_threshold: Number(e.target.value) })} className={inp + " max-w-[200px]"} />
              </div>
              <div className="pt-3 flex justify-end">
                <button onClick={saveStore} disabled={storeSaving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50 shadow-lg transition-all"
                  style={{ background: "#1a1208", color: "#fdf9f0" }}>
                  {storeSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {storeSaving ? "Saving…" : "Save Store Info"}
                </button>
              </div>
            </div>
          )}
        </section>

        {/* SEO */}
        <section className="bg-white/70 backdrop-blur-xl rounded-2xl border border-[#e5e0d8]/60 overflow-hidden">
          <div className="p-6 border-b border-[#e5e0d8]/40 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }}>
              <Globe className="w-4.5 h-4.5 text-indigo-500" />
            </div>
            <div>
              <h2 className="font-display text-lg" style={{ color: "#1a1208" }}>SEO</h2>
              <p className="text-xs text-muted-foreground">Search engine & social sharing</p>
            </div>
          </div>
          {seoLoading ? (
            <div className="p-6 flex items-center justify-center py-12">
              <Loader2 className="w-5 h-5 animate-spin text-[#c9a84c]" />
            </div>
          ) : (
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-widest mb-2 text-muted-foreground font-medium">Site Title</label>
                <input value={seo.site_title} onChange={(e) => setSeo({ ...seo, site_title: e.target.value })} className={inp} placeholder="Mohika Art - Customized Resin Crafts" />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-widest mb-2 text-muted-foreground font-medium">Site Description</label>
                <textarea rows={3} value={seo.site_description} onChange={(e) => setSeo({ ...seo, site_description: e.target.value })} className={inp + " resize-none"} placeholder="Meta description for search results" />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-widest mb-2 text-muted-foreground font-medium">Keywords</label>
                <input value={seo.keywords} onChange={(e) => setSeo({ ...seo, keywords: e.target.value })} className={inp} placeholder="resin art, gifts, handmade" />
              </div>
              <ImageUpload value={seo.og_image} onChange={(url) => setSeo({ ...seo, og_image: url })} label="OG Image (social sharing)" bucket="site-images" />
              <div className="pt-3 flex justify-end">
                <button onClick={saveSeo} disabled={seoSaving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50 shadow-lg transition-all"
                  style={{ background: "#1a1208", color: "#fdf9f0" }}>
                  {seoSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {seoSaving ? "Saving…" : "Save SEO"}
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Razorpay / Payment */}
        <section className="bg-white/70 backdrop-blur-xl rounded-2xl border border-[#e5e0d8]/60 overflow-hidden">
          <div className="p-6 border-b border-[#e5e0d8]/40 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)" }}>
              <CreditCard className="w-4.5 h-4.5 text-emerald-500" />
            </div>
            <div>
              <h2 className="font-display text-lg" style={{ color: "#1a1208" }}>Payment (Razorpay)</h2>
              <p className="text-xs text-muted-foreground">Payment gateway configuration</p>
            </div>
          </div>
          {razorpayLoading ? (
            <div className="p-6 flex items-center justify-center py-12">
              <Loader2 className="w-5 h-5 animate-spin text-[#c9a84c]" />
            </div>
          ) : (
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-widest mb-2 text-muted-foreground font-medium">Mode</label>
                <div className="flex gap-3">
                  {(["test", "live"] as const).map((m) => (
                    <button key={m} onClick={() => setRazorpay({ ...razorpay, mode: m })}
                      className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                        razorpay.mode === m
                          ? "border-[#1a1208] bg-[#1a1208] text-[#fdf9f0]"
                          : "border-[#e5e0d8] text-muted-foreground hover:border-[#c9a84c]/50 bg-white"
                      }`}>
                      {m === "test" ? "Test Mode" : "Live Mode"}
                    </button>
                  ))}
                </div>
                {razorpay.mode === "test" && (
                  <p className="text-[11px] text-amber-600 mt-2">Test mode — no real payments will be processed</p>
                )}
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-widest mb-2 text-muted-foreground font-medium">Key ID</label>
                <input value={razorpay.key_id} onChange={(e) => setRazorpay({ ...razorpay, key_id: e.target.value })} className={inp} placeholder="rzp_test_xxxxxxxxxxxxxx" />
              </div>
              <div className="pt-3 flex justify-end">
                <button onClick={saveRazorpay} disabled={razorpaySaving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50 shadow-lg transition-all"
                  style={{ background: "#1a1208", color: "#fdf9f0" }}>
                  {razorpaySaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {razorpaySaving ? "Saving…" : "Save Payment"}
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default AdminSettings;
