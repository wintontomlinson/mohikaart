import { useEffect, useState } from "react";
import { Save, Sparkles, Eye, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import {
  HeroContent,
  DEFAULT_HERO,
  fetchSetting,
  saveSetting,
  useInvalidateSetting,
} from "@/lib/cms";
import { Link } from "react-router-dom";

const inp =
  "w-full px-4 py-2.5 rounded-xl bg-background border border-border focus:border-foreground/40 outline-none text-sm transition-colors";

const Field = ({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) => (
  <div>
    <label className="block text-xs uppercase tracking-widest mb-2 text-muted-foreground">
      {label}
    </label>
    {children}
    {hint && <p className="text-[10px] text-muted-foreground/70 mt-1">{hint}</p>}
  </div>
);

const AdminHero = () => {
  const [data, setData] = useState<HeroContent>(DEFAULT_HERO);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const invalidate = useInvalidateSetting();

  useEffect(() => {
    fetchSetting<HeroContent>("hero_content", DEFAULT_HERO).then((d) => {
      setData(d);
      setLoading(false);
    });
  }, []);

  const save = async () => {
    setSaving(true);
    const { error } = await saveSetting("hero_content", data);
    setSaving(false);
    if (error) return toast.error(error.message);
    invalidate("hero_content");
    toast.success("Hero updated — refresh the homepage to see changes");
  };

  const reset = () => {
    if (confirm("Reset hero to default content?")) {
      setData(DEFAULT_HERO);
      toast.info("Defaults loaded — click Save to apply");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
        Loading…
      </div>
    );

  return (
    <div className="max-w-3xl space-y-8">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-4xl">Hero Section</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Edit the homepage hero. Headline, CTAs, stats and more.
          </p>
        </div>
        <Link
          to="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border hover:bg-muted text-xs"
        >
          <Eye className="w-3.5 h-3.5" /> Preview Site
        </Link>
      </div>

      {/* Eyebrow + Headline */}
      <div className="bg-background rounded-2xl border border-border overflow-hidden">
        <div className="px-6 py-5 border-b border-border flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <h2 className="font-display text-xl">Headline & Tagline</h2>
        </div>
        <div className="p-6 space-y-5">
          <Field label="Eyebrow text" hint="Small pill above the headline (e.g. categories you serve)">
            <input
              value={data.eyebrow}
              onChange={(e) => setData({ ...data, eyebrow: e.target.value })}
              className={inp}
            />
          </Field>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Headline part 1" hint="e.g. Turn">
              <input
                value={data.headline_part1}
                onChange={(e) => setData({ ...data, headline_part1: e.target.value })}
                className={inp}
              />
            </Field>
            <Field label="Headline highlight (gold)" hint="e.g. Memories">
              <input
                value={data.headline_highlight}
                onChange={(e) => setData({ ...data, headline_highlight: e.target.value })}
                className={inp}
              />
            </Field>
            <Field label="Headline part 2" hint="e.g. Into Timeless">
              <input
                value={data.headline_part2}
                onChange={(e) => setData({ ...data, headline_part2: e.target.value })}
                className={inp}
              />
            </Field>
            <Field label="Headline part 3 (italic)" hint="e.g. Art.">
              <input
                value={data.headline_part3}
                onChange={(e) => setData({ ...data, headline_part3: e.target.value })}
                className={inp}
              />
            </Field>
          </div>

          <Field label="Sub-headline" hint="The descriptive paragraph below the headline">
            <textarea
              rows={4}
              value={data.subheadline}
              onChange={(e) => setData({ ...data, subheadline: e.target.value })}
              className={inp + " resize-none"}
            />
          </Field>
        </div>
      </div>

      {/* CTAs */}
      <div className="bg-background rounded-2xl border border-border overflow-hidden">
        <div className="px-6 py-5 border-b border-border">
          <h2 className="font-display text-xl">Call-to-Action Buttons</h2>
        </div>
        <div className="p-6 space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Primary button label">
              <input
                value={data.cta_primary_label}
                onChange={(e) => setData({ ...data, cta_primary_label: e.target.value })}
                className={inp}
              />
            </Field>
            <Field label="Primary button link" hint="Internal path or full URL">
              <input
                value={data.cta_primary_link}
                onChange={(e) => setData({ ...data, cta_primary_link: e.target.value })}
                className={inp + " font-mono text-xs"}
              />
            </Field>
            <Field label="Secondary button label">
              <input
                value={data.cta_secondary_label}
                onChange={(e) => setData({ ...data, cta_secondary_label: e.target.value })}
                className={inp}
              />
            </Field>
            <Field label="Secondary button link">
              <input
                value={data.cta_secondary_link}
                onChange={(e) => setData({ ...data, cta_secondary_link: e.target.value })}
                className={inp + " font-mono text-xs"}
              />
            </Field>
          </div>
        </div>
      </div>

      {/* Image badge */}
      <div className="bg-background rounded-2xl border border-border overflow-hidden">
        <div className="px-6 py-5 border-b border-border">
          <h2 className="font-display text-xl">Image Badge</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Floating chip shown on the hero image (bottom-left).
          </p>
        </div>
        <div className="p-6 grid sm:grid-cols-2 gap-4">
          <Field label="Badge tag" hint="e.g. Bestseller, New In, Featured">
            <input
              value={data.badge_text}
              onChange={(e) => setData({ ...data, badge_text: e.target.value })}
              className={inp}
            />
          </Field>
          <Field label="Badge subtext" hint="e.g. Resin Trays">
            <input
              value={data.badge_subtext}
              onChange={(e) => setData({ ...data, badge_subtext: e.target.value })}
              className={inp}
            />
          </Field>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-background rounded-2xl border border-border overflow-hidden">
        <div className="px-6 py-5 border-b border-border">
          <h2 className="font-display text-xl">Stats Row</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Three stats shown below the CTAs.
          </p>
        </div>
        <div className="p-6 space-y-6">
          {/* Stat 1 */}
          <div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3 font-semibold">
              Stat #1
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              <Field label="Value (number)">
                <input
                  type="number"
                  value={data.stat1_value}
                  onChange={(e) => setData({ ...data, stat1_value: Number(e.target.value) })}
                  className={inp}
                />
              </Field>
              <Field label="Suffix">
                <input
                  value={data.stat1_suffix}
                  onChange={(e) => setData({ ...data, stat1_suffix: e.target.value })}
                  className={inp}
                  placeholder="+"
                />
              </Field>
              <Field label="Label">
                <input
                  value={data.stat1_label}
                  onChange={(e) => setData({ ...data, stat1_label: e.target.value })}
                  className={inp}
                />
              </Field>
            </div>
          </div>

          {/* Stat 2 */}
          <div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3 font-semibold">
              Stat #2
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Value (text or number)" hint="e.g. 4.9★ or 4.9">
                <input
                  value={data.stat2_value}
                  onChange={(e) => setData({ ...data, stat2_value: e.target.value })}
                  className={inp}
                />
              </Field>
              <Field label="Label">
                <input
                  value={data.stat2_label}
                  onChange={(e) => setData({ ...data, stat2_label: e.target.value })}
                  className={inp}
                />
              </Field>
            </div>
          </div>

          {/* Stat 3 */}
          <div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3 font-semibold">
              Stat #3
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              <Field label="Value (number)">
                <input
                  type="number"
                  value={data.stat3_value}
                  onChange={(e) => setData({ ...data, stat3_value: Number(e.target.value) })}
                  className={inp}
                />
              </Field>
              <Field label="Suffix">
                <input
                  value={data.stat3_suffix}
                  onChange={(e) => setData({ ...data, stat3_suffix: e.target.value })}
                  className={inp}
                  placeholder="yrs"
                />
              </Field>
              <Field label="Label">
                <input
                  value={data.stat3_label}
                  onChange={(e) => setData({ ...data, stat3_label: e.target.value })}
                  className={inp}
                />
              </Field>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky save bar */}
      <div className="sticky bottom-4 md:bottom-6 z-10">
        <div className="bg-background rounded-2xl border border-border shadow-luxe p-4 flex items-center justify-between gap-3">
          <div className="text-xs text-muted-foreground">
            Tip: To change the hero <strong>image</strong>, go to{" "}
            <Link to="/admin/images" className="underline hover:text-foreground">
              Site Images
            </Link>
            .
          </div>
          <div className="flex gap-2">
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-border text-sm hover:bg-muted transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
            <button
              onClick={save}
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-foreground text-background text-sm hover:opacity-85 transition-opacity disabled:opacity-60"
            >
              <Save className="w-4 h-4" /> {saving ? "Saving…" : "Save Hero"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHero;
