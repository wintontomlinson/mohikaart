import React, { useEffect, useState } from "react";
import {
  fetchSetting, saveSetting, useInvalidateSetting,
  DEFAULT_HERO, DEFAULT_ANNOUNCEMENTS, DEFAULT_TESTIMONIALS, DEFAULT_COUPONS,
} from "@/lib/cms";
import type { HeroContent, Announcement, Testimonial, Coupon } from "@/lib/cms";
import { toast } from "sonner";
import {
  Save, Loader2, Plus, Trash2, ToggleLeft, ToggleRight,
  Megaphone, Star, Sparkles, Ticket, ChevronDown, ChevronUp, GripVertical,
} from "lucide-react";

const inp = "w-full px-4 py-2.5 rounded-xl bg-white border border-[#e5e0d8] focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/20 outline-none text-sm transition-all";
const Field = ({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) => (
  <div>
    <label className="block text-[11px] uppercase tracking-widest mb-1.5 text-muted-foreground font-medium">{label}</label>
    {children}
    {hint && <p className="text-[10px] text-muted-foreground/60 mt-1">{hint}</p>}
  </div>
);

/* ─── Section Card ─── */
const Section = ({
  icon: Icon, title, subtitle, color, children, saving, onSave, defaultOpen = false,
}: {
  icon: any; title: string; subtitle: string; color: string;
  children: React.ReactNode; saving?: boolean; onSave?: () => void; defaultOpen?: boolean;
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-[#e5e0d8]/60 overflow-hidden">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-6 hover:bg-[#f8f5f0]/50 transition-colors text-left">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: `${color}14`, border: `1px solid ${color}28` }}>
            <Icon className="w-4.5 h-4.5" style={{ color }} />
          </div>
          <div>
            <h2 className="font-display text-base" style={{ color: "#1a1208" }}>{title}</h2>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground/50" /> : <ChevronDown className="w-4 h-4 text-muted-foreground/50" />}
      </button>
      {open && (
        <>
          <div className="border-t border-[#e5e0d8]/40 p-6 space-y-4">{children}</div>
          {onSave && (
            <div className="border-t border-[#e5e0d8]/40 px-6 py-4 flex justify-end bg-[#faf8f4]/50">
              <button onClick={onSave} disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50 shadow-lg transition-all hover:scale-[1.01]"
                style={{ background: "#1a1208", color: "#fdf9f0" }}>
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

/* ──────────────────────────────────────────────────────── */
const AdminCMS = () => {
  const invalidate = useInvalidateSetting();

  /* Hero */
  const [hero, setHero] = useState<HeroContent>(DEFAULT_HERO);
  const [heroSaving, setHeroSaving] = useState(false);

  /* Announcements */
  const [anns, setAnns] = useState<Announcement[]>(DEFAULT_ANNOUNCEMENTS);
  const [annsSaving, setAnnsSaving] = useState(false);

  /* Testimonials */
  const [tests, setTests] = useState<Testimonial[]>(DEFAULT_TESTIMONIALS);
  const [testsSaving, setTestsSaving] = useState(false);

  /* Coupons */
  const [coupons, setCoupons] = useState<Coupon[]>(DEFAULT_COUPONS);
  const [couponsSaving, setCouponsSaving] = useState(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchSetting<HeroContent>("hero_content", DEFAULT_HERO),
      fetchSetting<Announcement[]>("announcements", DEFAULT_ANNOUNCEMENTS),
      fetchSetting<Testimonial[]>("testimonials", DEFAULT_TESTIMONIALS),
      fetchSetting<Coupon[]>("coupons", DEFAULT_COUPONS),
    ]).then(([h, a, t, c]) => {
      setHero(h); setAnns(a); setTests(t);
      setCoupons(Array.isArray(c) ? c : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  /* ── Savers ── */
  const saveHero = async () => {
    setHeroSaving(true);
    const { error } = await saveSetting("hero_content", hero);
    setHeroSaving(false);
    if (error) return toast.error((error as any).message);
    invalidate("hero_content"); toast.success("Hero saved");
  };

  const saveAnns = async () => {
    setAnnsSaving(true);
    const { error } = await saveSetting("announcements", anns);
    setAnnsSaving(false);
    if (error) return toast.error((error as any).message);
    invalidate("announcements"); toast.success("Announcements saved");
  };

  const saveTests = async () => {
    setTestsSaving(true);
    const { error } = await saveSetting("testimonials", tests);
    setTestsSaving(false);
    if (error) return toast.error((error as any).message);
    invalidate("testimonials"); toast.success("Testimonials saved");
  };

  const saveCoupons = async () => {
    setCouponsSaving(true);
    const { error } = await saveSetting("coupons", coupons);
    setCouponsSaving(false);
    if (error) return toast.error((error as any).message);
    invalidate("coupons"); toast.success("Coupons saved");
  };

  /* ── Helpers ── */
  const newAnn = (): Announcement => ({ id: `a${Date.now()}`, text: "", active: true });
  const newTest = (): Testimonial => ({ id: `t${Date.now()}`, name: "", city: "", product: "", rating: 5, text: "", active: true });
  const newCoupon = (): Coupon => ({ id: `c${Date.now()}`, code: "", type: "percent", value: 10, min_order: 0, active: true, expires_at: null });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: "#c9a84c" }} />
      </div>
    );
  }

  return (
    <div className="pb-24 lg:pb-0 max-w-3xl space-y-5">
      {/* Header */}
      <div className="mb-2">
        <h1 className="font-display text-3xl" style={{ color: "#1a1208" }}>Content</h1>
        <p className="text-sm text-muted-foreground mt-1">Edit live site content — hero, announcements, testimonials & coupons</p>
      </div>

      {/* ── HERO ── */}
      <Section icon={Sparkles} title="Hero Section" subtitle="Main headline & CTAs on the homepage" color="#c9a84c" onSave={saveHero} saving={heroSaving} defaultOpen>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Eyebrow text">
            <input value={hero.eyebrow} onChange={(e) => setHero({ ...hero, eyebrow: e.target.value })} className={inp} placeholder="Resin Art · Personalized Gifts" />
          </Field>
          <Field label="Badge chip text">
            <input value={hero.badge_text} onChange={(e) => setHero({ ...hero, badge_text: e.target.value })} className={inp} />
          </Field>
        </div>

        <div className="p-4 rounded-xl bg-[#f8f5f0] border border-[#e5e0d8]/50 space-y-3">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Headline (split into parts for animation)</p>
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Part 1 (e.g. 'Turn')"><input value={hero.headline_part1} onChange={(e) => setHero({ ...hero, headline_part1: e.target.value })} className={inp} /></Field>
            <Field label="Highlight word (gold color)"><input value={hero.headline_highlight} onChange={(e) => setHero({ ...hero, headline_highlight: e.target.value })} className={inp} /></Field>
            <Field label="Part 2 (e.g. 'Into Timeless')"><input value={hero.headline_part2} onChange={(e) => setHero({ ...hero, headline_part2: e.target.value })} className={inp} /></Field>
            <Field label="Part 3 (e.g. 'Art.')"><input value={hero.headline_part3} onChange={(e) => setHero({ ...hero, headline_part3: e.target.value })} className={inp} /></Field>
          </div>
        </div>

        <Field label="Subheadline">
          <textarea rows={3} value={hero.subheadline} onChange={(e) => setHero({ ...hero, subheadline: e.target.value })} className={inp + " resize-none"} />
        </Field>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Primary CTA Label"><input value={hero.cta_primary_label} onChange={(e) => setHero({ ...hero, cta_primary_label: e.target.value })} className={inp} /></Field>
          <Field label="Primary CTA Link"><input value={hero.cta_primary_link} onChange={(e) => setHero({ ...hero, cta_primary_link: e.target.value })} className={inp} /></Field>
          <Field label="Secondary CTA Label"><input value={hero.cta_secondary_label} onChange={(e) => setHero({ ...hero, cta_secondary_label: e.target.value })} className={inp} /></Field>
          <Field label="Secondary CTA Link"><input value={hero.cta_secondary_link} onChange={(e) => setHero({ ...hero, cta_secondary_link: e.target.value })} className={inp} /></Field>
        </div>

        <div className="p-4 rounded-xl bg-[#f8f5f0] border border-[#e5e0d8]/50 space-y-3">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Stats (3 counters)</p>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Field label="Value 1"><input type="number" value={hero.stat1_value} onChange={(e) => setHero({ ...hero, stat1_value: Number(e.target.value) })} className={inp} /></Field>
              <Field label="Suffix"><input value={hero.stat1_suffix} onChange={(e) => setHero({ ...hero, stat1_suffix: e.target.value })} className={inp} placeholder="+" /></Field>
              <Field label="Label"><input value={hero.stat1_label} onChange={(e) => setHero({ ...hero, stat1_label: e.target.value })} className={inp} /></Field>
            </div>
            <div className="space-y-2">
              <Field label="Value 2"><input value={hero.stat2_value} onChange={(e) => setHero({ ...hero, stat2_value: e.target.value })} className={inp} placeholder="4.9★" /></Field>
              <Field label="Label"><input value={hero.stat2_label} onChange={(e) => setHero({ ...hero, stat2_label: e.target.value })} className={inp} /></Field>
            </div>
            <div className="space-y-2">
              <Field label="Value 3"><input type="number" value={hero.stat3_value} onChange={(e) => setHero({ ...hero, stat3_value: Number(e.target.value) })} className={inp} /></Field>
              <Field label="Suffix"><input value={hero.stat3_suffix} onChange={(e) => setHero({ ...hero, stat3_suffix: e.target.value })} className={inp} placeholder=" Yrs" /></Field>
              <Field label="Label"><input value={hero.stat3_label} onChange={(e) => setHero({ ...hero, stat3_label: e.target.value })} className={inp} /></Field>
            </div>
          </div>
        </div>
      </Section>

      {/* ── ANNOUNCEMENTS ── */}
      <Section icon={Megaphone} title="Announcements" subtitle="Rotating ticker in the navbar" color="#6366f1" onSave={saveAnns} saving={annsSaving}>
        <div className="space-y-2">
          {anns.map((a, i) => (
            <div key={a.id} className="flex items-center gap-2 p-3 rounded-xl bg-white border border-[#e5e0d8]/60 group">
              <GripVertical className="w-4 h-4 text-muted-foreground/30 shrink-0" />
              <input
                value={a.text}
                onChange={(e) => setAnns(anns.map((x, j) => j === i ? { ...x, text: e.target.value } : x))}
                className="flex-1 outline-none text-sm bg-transparent"
                placeholder="Announcement text… use {threshold} for free shipping amount"
              />
              <button onClick={() => setAnns(anns.map((x, j) => j === i ? { ...x, active: !x.active } : x))} title={a.active ? "Disable" : "Enable"}>
                {a.active
                  ? <ToggleRight className="w-5 h-5 text-emerald-500" />
                  : <ToggleLeft className="w-5 h-5 text-muted-foreground/40" />}
              </button>
              <button onClick={() => setAnns(anns.filter((_, j) => j !== i))} className="opacity-0 group-hover:opacity-100 transition-opacity">
                <Trash2 className="w-3.5 h-3.5 text-red-400 hover:text-red-600" />
              </button>
            </div>
          ))}
        </div>
        <button onClick={() => setAnns([...anns, newAnn()])}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-[#c9a84c]/40 text-sm text-[#c9a84c] hover:bg-[#c9a84c]/5 transition-colors">
          <Plus className="w-3.5 h-3.5" /> Add announcement
        </button>
      </Section>

      {/* ── TESTIMONIALS ── */}
      <Section icon={Star} title="Testimonials" subtitle="Customer reviews shown on homepage" color="#f59e0b" onSave={saveTests} saving={testsSaving}>
        <div className="space-y-3">
          {tests.map((t, i) => (
            <div key={t.id} className="p-4 rounded-xl bg-white border border-[#e5e0d8]/60 group space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold" style={{ color: "#1a1208" }}>Review #{i + 1}</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => setTests(tests.map((x, j) => j === i ? { ...x, active: !x.active } : x))} title={t.active ? "Hide" : "Show"}>
                    {t.active
                      ? <ToggleRight className="w-5 h-5 text-emerald-500" />
                      : <ToggleLeft className="w-5 h-5 text-muted-foreground/40" />}
                  </button>
                  <button onClick={() => setTests(tests.filter((_, j) => j !== i))} className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="w-3.5 h-3.5 text-red-400 hover:text-red-600" />
                  </button>
                </div>
              </div>
              <div className="grid sm:grid-cols-3 gap-3">
                <Field label="Name"><input value={t.name} onChange={(e) => setTests(tests.map((x, j) => j === i ? { ...x, name: e.target.value } : x))} className={inp} placeholder="Aanya Mehta" /></Field>
                <Field label="City"><input value={t.city} onChange={(e) => setTests(tests.map((x, j) => j === i ? { ...x, city: e.target.value } : x))} className={inp} placeholder="Mumbai" /></Field>
                <Field label="Product">
                  <input value={t.product} onChange={(e) => setTests(tests.map((x, j) => j === i ? { ...x, product: e.target.value } : x))} className={inp} placeholder="Resin Tray" />
                </Field>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-muted-foreground uppercase tracking-wider">Rating</span>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map((n) => (
                    <button key={n} onClick={() => setTests(tests.map((x, j) => j === i ? { ...x, rating: n } : x))}>
                      <Star className="w-4 h-4" style={{ fill: n <= t.rating ? "#c9a84c" : "transparent", color: n <= t.rating ? "#c9a84c" : "#d1cdc5" }} />
                    </button>
                  ))}
                </div>
              </div>
              <Field label="Review text">
                <textarea rows={2} value={t.text} onChange={(e) => setTests(tests.map((x, j) => j === i ? { ...x, text: e.target.value } : x))} className={inp + " resize-none"} placeholder="What the customer said…" />
              </Field>
            </div>
          ))}
        </div>
        <button onClick={() => setTests([...tests, newTest()])}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-[#c9a84c]/40 text-sm text-[#c9a84c] hover:bg-[#c9a84c]/5 transition-colors">
          <Plus className="w-3.5 h-3.5" /> Add testimonial
        </button>
      </Section>

      {/* ── COUPONS ── */}
      <Section icon={Ticket} title="Discount Coupons" subtitle="Promo codes applied at checkout" color="#10b981" onSave={saveCoupons} saving={couponsSaving}>
        {coupons.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No coupons yet. Create your first promo code!</p>
        ) : (
          <div className="space-y-3">
            {coupons.map((c, i) => (
              <div key={c.id} className="p-4 rounded-xl bg-white border border-[#e5e0d8]/60 group">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider ${c.active ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-gray-50 text-gray-500 border border-gray-200"}`}>
                      {c.active ? "Active" : "Inactive"}
                    </span>
                    {c.usage_count !== undefined && (
                      <span className="text-[10px] text-muted-foreground">{c.usage_count} uses</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setCoupons(coupons.map((x, j) => j === i ? { ...x, active: !x.active } : x))}>
                      {c.active ? <ToggleRight className="w-5 h-5 text-emerald-500" /> : <ToggleLeft className="w-5 h-5 text-muted-foreground/40" />}
                    </button>
                    <button onClick={() => setCoupons(coupons.filter((_, j) => j !== i))} className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="w-3.5 h-3.5 text-red-400 hover:text-red-600" />
                    </button>
                  </div>
                </div>
                <div className="grid sm:grid-cols-4 gap-3">
                  <Field label="Code">
                    <input value={c.code} onChange={(e) => setCoupons(coupons.map((x, j) => j === i ? { ...x, code: e.target.value.toUpperCase() } : x))}
                      className={inp + " font-mono uppercase"} placeholder="SAVE10" />
                  </Field>
                  <Field label="Type">
                    <select value={c.type} onChange={(e) => setCoupons(coupons.map((x, j) => j === i ? { ...x, type: e.target.value as "percent" | "flat" } : x))} className={inp}>
                      <option value="percent">% Percent</option>
                      <option value="flat">₹ Flat</option>
                    </select>
                  </Field>
                  <Field label={c.type === "percent" ? "% Off" : "₹ Off"}>
                    <input type="number" value={c.value} onChange={(e) => setCoupons(coupons.map((x, j) => j === i ? { ...x, value: Number(e.target.value) } : x))} className={inp} />
                  </Field>
                  <Field label="Min order (₹)">
                    <input type="number" value={c.min_order} onChange={(e) => setCoupons(coupons.map((x, j) => j === i ? { ...x, min_order: Number(e.target.value) } : x))} className={inp} />
                  </Field>
                </div>
                <div className="mt-3">
                  <Field label="Expires at (optional)">
                    <input type="date" value={c.expires_at ?? ""} onChange={(e) => setCoupons(coupons.map((x, j) => j === i ? { ...x, expires_at: e.target.value || null } : x))} className={inp + " max-w-[200px]"} />
                  </Field>
                </div>
              </div>
            ))}
          </div>
        )}
        <button onClick={() => setCoupons([...coupons, newCoupon()])}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-emerald-300 text-sm text-emerald-700 hover:bg-emerald-50 transition-colors">
          <Plus className="w-3.5 h-3.5" /> New coupon
        </button>
      </Section>
    </div>
  );
};

export default AdminCMS;
