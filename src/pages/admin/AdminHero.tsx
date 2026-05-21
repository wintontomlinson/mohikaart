import { useEffect, useState } from "react";
import { Save, Sparkles, Eye, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { HeroContent, DEFAULT_HERO, fetchSetting, saveSetting, useInvalidateSetting } from "@/lib/cms";
import { Link } from "react-router-dom";

const inp = "w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white placeholder:text-white/25 focus:border-amber-500/40 focus:bg-white/[0.05] outline-none text-sm transition-all";

const Field = ({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) => (
  <div>
    <label className="block text-[11px] uppercase tracking-widest mb-2 text-white/30 font-medium">{label}</label>
    {children}
    {hint && <p className="text-[10px] text-white/20 mt-1.5">{hint}</p>}
  </div>
);

const AdminHero = () => {
  const [data, setData] = useState<HeroContent>(DEFAULT_HERO);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const invalidate = useInvalidateSetting();

  useEffect(() => {
    fetchSetting<HeroContent>("hero_content", DEFAULT_HERO).then((d) => { setData(d); setLoading(false); });
  }, []);

  const save = async () => {
    setSaving(true);
    const { error } = await saveSetting("hero_content", data);
    setSaving(false);
    if (error) return toast.error(error.message);
    invalidate("hero_content");
    toast.success("Hero updated");
  };

  const reset = () => {
    if (confirm("Reset to defaults?")) { setData(DEFAULT_HERO); toast.info("Defaults loaded — click Save to apply"); }
  };

  if (loading) return <div className="flex items-center justify-center h-48 text-white/40 text-sm">Loading…</div>;

  return (
    <div className="max-w-3xl space-y-6 pb-20 lg:pb-0">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-white text-3xl font-semibold">Hero Section</h1>
          <p className="text-sm text-white/40 mt-1">Edit the homepage hero headline, CTAs, and stats</p>
        </div>
        <Link to="/" target="_blank" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] text-xs text-white/60">
          <Eye className="w-3.5 h-3.5" /> Preview
        </Link>
      </div>

      {/* Headline */}
      <Card icon={Sparkles} title="Headline & Tagline">
        <div className="space-y-5">
          <Field label="Eyebrow text" hint="Pill above headline">
            <input value={data.eyebrow} onChange={(e) => setData({ ...data, eyebrow: e.target.value })} className={inp} />
          </Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Headline part 1"><input value={data.headline_part1} onChange={(e) => setData({ ...data, headline_part1: e.target.value })} className={inp} /></Field>
            <Field label="Headline highlight (gold)"><input value={data.headline_highlight} onChange={(e) => setData({ ...data, headline_highlight: e.target.value })} className={inp} /></Field>
            <Field label="Headline part 2"><input value={data.headline_part2} onChange={(e) => setData({ ...data, headline_part2: e.target.value })} className={inp} /></Field>
            <Field label="Headline part 3 (italic)"><input value={data.headline_part3} onChange={(e) => setData({ ...data, headline_part3: e.target.value })} className={inp} /></Field>
          </div>
          <Field label="Sub-headline">
            <textarea rows={4} value={data.subheadline} onChange={(e) => setData({ ...data, subheadline: e.target.value })} className={inp + " resize-none"} />
          </Field>
        </div>
      </Card>

      {/* CTAs */}
      <Card title="Call-to-Action Buttons">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Primary label"><input value={data.cta_primary_label} onChange={(e) => setData({ ...data, cta_primary_label: e.target.value })} className={inp} /></Field>
          <Field label="Primary link"><input value={data.cta_primary_link} onChange={(e) => setData({ ...data, cta_primary_link: e.target.value })} className={inp + " font-mono text-xs"} /></Field>
          <Field label="Secondary label"><input value={data.cta_secondary_label} onChange={(e) => setData({ ...data, cta_secondary_label: e.target.value })} className={inp} /></Field>
          <Field label="Secondary link"><input value={data.cta_secondary_link} onChange={(e) => setData({ ...data, cta_secondary_link: e.target.value })} className={inp + " font-mono text-xs"} /></Field>
        </div>
      </Card>

      {/* Badge */}
      <Card title="Image Badge">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Badge tag" hint="e.g. Bestseller"><input value={data.badge_text} onChange={(e) => setData({ ...data, badge_text: e.target.value })} className={inp} /></Field>
          <Field label="Badge subtext"><input value={data.badge_subtext} onChange={(e) => setData({ ...data, badge_subtext: e.target.value })} className={inp} /></Field>
        </div>
      </Card>

      {/* Stats */}
      <Card title="Stats Row">
        <div className="space-y-6">
          <StatRow n={1} value={data.stat1_value} suffix={data.stat1_suffix} label={data.stat1_label}
            onChange={(v, s, l) => setData({ ...data, stat1_value: v, stat1_suffix: s, stat1_label: l })} />
          <div>
            <div className="text-[10px] uppercase tracking-widest text-white/20 font-semibold mb-3">Stat #2</div>
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Value (text)"><input value={data.stat2_value} onChange={(e) => setData({ ...data, stat2_value: e.target.value })} className={inp} /></Field>
              <Field label="Label"><input value={data.stat2_label} onChange={(e) => setData({ ...data, stat2_label: e.target.value })} className={inp} /></Field>
            </div>
          </div>
          <StatRow n={3} value={data.stat3_value} suffix={data.stat3_suffix} label={data.stat3_label}
            onChange={(v, s, l) => setData({ ...data, stat3_value: v, stat3_suffix: s, stat3_label: l })} />
        </div>
      </Card>

      {/* Save bar */}
      <div className="sticky bottom-4 md:bottom-6 z-10">
        <div className="bg-[#1a1a22] rounded-2xl border border-white/[0.06] shadow-2xl p-4 flex items-center justify-between gap-3">
          <p className="text-xs text-white/30">To change the hero <strong className="text-white/50">image</strong>, go to <Link to="/admin/images" className="text-amber-400/70 hover:text-amber-400 underline">Site Images</Link>.</p>
          <div className="flex gap-2 shrink-0">
            <button onClick={reset} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/[0.08] text-sm text-white/50 hover:bg-white/5 transition-colors">
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
            <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 text-white text-sm font-medium hover:bg-amber-400 disabled:opacity-50 transition-colors shadow-lg shadow-amber-500/20">
              <Save className="w-4 h-4" /> {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Card = ({ icon: Icon, title, children }: { icon?: any; title: string; children: React.ReactNode }) => (
  <div className="bg-[#1a1a22] rounded-2xl border border-white/[0.04] overflow-hidden">
    <div className="px-6 py-5 border-b border-white/[0.04] flex items-center gap-2">
      {Icon && <Icon className="w-4 h-4 text-amber-400" />}
      <h2 className="text-white font-semibold">{title}</h2>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const StatRow = ({ n, value, suffix, label, onChange }: { n: number; value: number; suffix: string; label: string; onChange: (v: number, s: string, l: string) => void }) => (
  <div>
    <div className="text-[10px] uppercase tracking-widest text-white/20 font-semibold mb-3">Stat #{n}</div>
    <div className="grid sm:grid-cols-3 gap-3">
      <Field label="Value"><input type="number" value={value} onChange={(e) => onChange(Number(e.target.value), suffix, label)} className={inp} /></Field>
      <Field label="Suffix"><input value={suffix} onChange={(e) => onChange(value, e.target.value, label)} className={inp} /></Field>
      <Field label="Label"><input value={label} onChange={(e) => onChange(value, suffix, e.target.value)} className={inp} /></Field>
    </div>
  </div>
);

export default AdminHero;
