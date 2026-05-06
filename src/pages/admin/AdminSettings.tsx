import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Save, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

type RazorpayConfig = { key_id: string; mode: "test" | "live"; secret_configured: boolean };

const AdminSettings = () => {
  const [rzp, setRzp] = useState<RazorpayConfig>({ key_id: "", mode: "test", secret_configured: false });
  const [showKey, setShowKey] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("app_settings").select("value").eq("key", "razorpay").maybeSingle()
      .then(({ data }) => {
        if (data?.value && typeof data.value === "object" && !Array.isArray(data.value)) {
          setRzp(data.value as any);
        }
        setLoading(false);
      });
  }, []);

  const onSave = async () => {
    setSaving(true);
    const { error } = await supabase.from("app_settings").upsert({
      key: "razorpay",
      value: rzp as any,
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Settings saved");
  };

  if (loading) return (
    <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
  );

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="font-display text-4xl">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Configure payment and store settings</p>
      </div>

      {/* Razorpay */}
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
                className="w-full px-4 py-2.5 pr-11 rounded-xl bg-background border border-border focus:border-foreground/40 outline-none text-sm transition-colors font-mono"
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

          {rzp.key_id && (
            <div className="flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 px-4 py-3 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              Razorpay {rzp.mode} mode is configured. Online payments will appear at checkout.
            </div>
          )}
          {!rzp.key_id && (
            <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 px-4 py-3 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
              No Key ID set. Customers will only see the WhatsApp order option at checkout.
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-border flex justify-end">
          <button
            onClick={onSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-foreground text-background text-sm disabled:opacity-60 hover:opacity-85 transition-opacity"
          >
            <Save className="w-4 h-4" /> {saving ? "Saving…" : "Save Settings"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
