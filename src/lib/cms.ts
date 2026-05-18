// Generic JSON-based CMS layer using Supabase app_settings table.
// Each "section" is a key in app_settings with its JSON value.

import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

/* ──────────────────────────────────────────────────────────────
   Hero content
   ────────────────────────────────────────────────────────────── */
export type HeroContent = {
  eyebrow: string;
  headline_part1: string;       // e.g. "Turn"
  headline_highlight: string;   // e.g. "Memories"
  headline_part2: string;       // e.g. "Into Timeless"
  headline_part3: string;       // e.g. "Art."
  subheadline: string;
  cta_primary_label: string;
  cta_primary_link: string;
  cta_secondary_label: string;
  cta_secondary_link: string;
  badge_text: string;           // bestseller chip
  badge_subtext: string;
  // Stats
  stat1_value: number;
  stat1_suffix: string;
  stat1_label: string;
  stat2_value: string;          // string so "4.9★" works
  stat2_label: string;
  stat3_value: number;
  stat3_suffix: string;
  stat3_label: string;
};

export const DEFAULT_HERO: HeroContent = {
  eyebrow: "Resin Art · Personalized Gifts · Memory Keepsakes",
  headline_part1: "Turn",
  headline_highlight: "Memories",
  headline_part2: "Into Timeless",
  headline_part3: "Art.",
  subheadline:
    "Customized handcrafted resin creations that preserve your most precious moments in luxurious, gallery-worthy keepsakes - each piece poured with love and intention.",
  cta_primary_label: "Shop Collection",
  cta_primary_link: "/shop",
  cta_secondary_label: "Custom Order",
  cta_secondary_link: "/contact",
  badge_text: "Bestseller",
  badge_subtext: "Resin Trays",
  stat1_value: 2000,
  stat1_suffix: "+",
  stat1_label: "Orders Crafted",
  stat2_value: "4.9★",
  stat2_label: "Avg. Rating",
  stat3_value: 3,
  stat3_suffix: "yrs",
  stat3_label: "Of Artistry",
};

/* ──────────────────────────────────────────────────────────────
   Announcements (rotating ticker in navbar)
   ────────────────────────────────────────────────────────────── */
export type Announcement = { id: string; text: string; active: boolean };

export const DEFAULT_ANNOUNCEMENTS: Announcement[] = [
  { id: "a1", text: "FREE SHIPPING on orders above ₹{threshold}", active: true },
  { id: "a2", text: "Handcrafted with Love - Since 2021", active: true },
  { id: "a3", text: "2000+ Happy Customers across India", active: true },
  { id: "a4", text: "Customized resin gifts for every occasion", active: true },
];

/* ──────────────────────────────────────────────────────────────
   Testimonials (CMS-driven)
   ────────────────────────────────────────────────────────────── */
export type Testimonial = {
  id: string;
  name: string;
  city: string;
  product: string;
  rating: number;
  text: string;
  active: boolean;
};

export const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "Aanya Mehta",
    city: "Mumbai",
    product: "Bridal Bouquet Preservation",
    rating: 5,
    text: "I gifted the wedding bouquet block to my sister and she literally cried. The detail, the gold flakes, the packaging - pure luxury.",
    active: true,
  },
  {
    id: "t2",
    name: "Riya Kapoor",
    city: "Delhi",
    product: "Name Keychain",
    rating: 5,
    text: "The name keychain looks like a piece of jewellery. Mohika personally messaged for every tiny detail. Beyond worth it.",
    active: true,
  },
  {
    id: "t3",
    name: "Saanvi Iyer",
    city: "Bengaluru",
    product: "Couple Photo Frame",
    rating: 5,
    text: "Ordered the couple frame for our anniversary. It feels heirloom - something I'll pass on. Pictures don't do it justice.",
    active: true,
  },
  {
    id: "t4",
    name: "Priya Sharma",
    city: "Jaipur",
    product: "Corporate Gift Hamper",
    rating: 5,
    text: "The corporate gift hampers for our team were absolutely stunning. Every single person was in awe. Will definitely order again!",
    active: true,
  },
  {
    id: "t5",
    name: "Neha Gupta",
    city: "Pune",
    product: "Custom Resin Tray",
    rating: 5,
    text: "I ordered a custom tray with my baby's first flowers. It's the most precious thing I own. Thank you Mohika for making memories tangible.",
    active: true,
  },
];

/* ──────────────────────────────────────────────────────────────
   Coupons / Discount codes
   ────────────────────────────────────────────────────────────── */
export type Coupon = {
  id: string;
  code: string;
  type: "percent" | "flat";
  value: number;
  min_order: number;
  active: boolean;
  expires_at?: string | null;
  usage_count?: number;
};

export const DEFAULT_COUPONS: Coupon[] = [];

/* ──────────────────────────────────────────────────────────────
   SEO settings
   ────────────────────────────────────────────────────────────── */
export type SeoSettings = {
  site_title: string;
  site_description: string;
  keywords: string;
  og_image: string;
};

export const DEFAULT_SEO: SeoSettings = {
  site_title: "Mohika Art - Customized Resin Crafts & Handmade Gifts",
  site_description:
    "Customized handcrafted resin creations that preserve your most precious moments. Wedding gifts, name keychains, photo frames & more - handmade in India.",
  keywords:
    "resin art, customized gifts, handmade gifts, wedding bouquet preservation, name keychain, photo frame, corporate gifts, India",
  og_image: "",
};

/* ──────────────────────────────────────────────────────────────
   Generic loader / saver (React Query + module-level cache)

   The module-level cache makes repeated reads cheap; React Query
   layered on top makes saves invalidate ALL components reading the
   same key, fixing the previous stale-UI-after-save bug.
   ────────────────────────────────────────────────────────────── */

const _cache = new Map<string, any>();

export async function fetchSetting<T>(key: string, fallback: T): Promise<T> {
  if (_cache.has(key)) return _cache.get(key);
  const { data } = await supabase
    .from("app_settings")
    .select("value")
    .eq("key", key)
    .maybeSingle();
  const val =
    data?.value && typeof data.value === "object"
      ? (data.value as any)
      : null;
  let result: T;
  if (Array.isArray(fallback)) {
    result = (Array.isArray(val) ? val : fallback) as T;
  } else {
    result = { ...(fallback as any), ...(val ?? {}) } as T;
  }
  _cache.set(key, result);
  return result;
}

export async function saveSetting(key: string, value: any) {
  _cache.delete(key);
  return supabase.from("app_settings").upsert({ key, value });
}

export function invalidateCmsCache(key?: string) {
  if (key) _cache.delete(key);
  else _cache.clear();
}

/* ──────────────────────────────────────────────────────────────
   Hooks (use React Query so saves auto-refresh subscribers)
   ────────────────────────────────────────────────────────────── */
function useSetting<T>(key: string, fallback: T) {
  return useQuery({
    queryKey: ["app_setting", key],
    queryFn:  () => fetchSetting<T>(key, fallback),
    staleTime: 60_000,
  });
}

/** Invalidate one (or all) CMS settings across the React tree.
 *  Call this from admin save handlers after `saveSetting()`. */
export function useInvalidateSetting() {
  const qc = useQueryClient();
  return (key?: string) => {
    invalidateCmsCache(key);
    if (key) qc.invalidateQueries({ queryKey: ["app_setting", key] });
    else qc.invalidateQueries({ queryKey: ["app_setting"] });
  };
}

export function useHeroContent() {
  const q = useSetting<HeroContent>("hero_content", DEFAULT_HERO);
  return { data: q.data ?? DEFAULT_HERO, loading: q.isLoading };
}

export function useAnnouncements() {
  const q = useSetting<Announcement[]>("announcements", DEFAULT_ANNOUNCEMENTS);
  return (q.data ?? DEFAULT_ANNOUNCEMENTS).filter((a) => a.active);
}

export function useTestimonials() {
  const q = useSetting<Testimonial[]>("testimonials", DEFAULT_TESTIMONIALS);
  return (q.data ?? DEFAULT_TESTIMONIALS).filter((t) => t.active);
}

/**
 * Hook that mirrors the admin's SEO settings into the live document.
 * Updates <title>, <meta name="description">, <meta name="keywords">,
 * og:title, og:description and og:image. Safe to call once at the
 * top of the React tree (e.g. inside <App>).
 */
export function useDynamicSeo() {
  const q = useSetting<SeoSettings>("seo", DEFAULT_SEO);
  const seo = q.data ?? DEFAULT_SEO;

  useEffect(() => {
    if (typeof document === "undefined") return;
    const setMeta = (selector: string, attr: string, value: string) => {
      const el = document.querySelector(selector);
      if (el && value) el.setAttribute(attr, value);
    };
    if (seo.site_title) document.title = seo.site_title;
    setMeta('meta[name="description"]', "content", seo.site_description);
    setMeta('meta[name="keywords"]',    "content", seo.keywords);
    setMeta('meta[property="og:title"]',       "content", seo.site_title);
    setMeta('meta[property="og:description"]', "content", seo.site_description);
    if (seo.og_image) setMeta('meta[property="og:image"]', "content", seo.og_image);
  }, [seo.site_title, seo.site_description, seo.keywords, seo.og_image]);
}
