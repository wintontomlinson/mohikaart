// Shared input validators + sanitisers used across the front-end.
// The authoritative checks live server-side (RLS + create_order RPC),
// but client-side checks give immediate feedback and reduce wasted
// network round-trips.

export const EMAIL_RE   = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_RE   = /^[+\d][\d\s-]{8,14}$/;       // 9–15 digits incl. optional +
export const PINCODE_RE = /^\d{6}$/;
export const URL_PATH_RE = /^\/[a-zA-Z0-9\-_/?=&%.#]*$/;

/** Hard caps to keep stray input from filling the DB. */
export const LIMITS = {
  name:    80,
  email:   120,
  phone:   20,
  city:    60,
  state:   60,
  address: 240,
  notes:   500,
  idea:    1000,
  product: 80,
  short:   140,
  long:    4000,
  url:     500,
} as const;

/** Trim + clamp input length. Always safe to call with anything. */
export function clamp(v: unknown, max: number): string {
  if (typeof v !== "string") return "";
  const trimmed = v.trim();
  return trimmed.length > max ? trimmed.slice(0, max) : trimmed;
}

/** Strip any HTML tags from user-typed strings before display.
 *  We render text content as React children (already escaped), so
 *  this is just a belt-and-braces for places that interpolate. */
export function stripTags(v: string): string {
  return v.replace(/<\/?[^>]+>/g, "");
}

/** Allow only safe URLs. Returns the URL if safe, otherwise the
 *  fallback. Prevents `javascript:` / `data:` style injection from
 *  admin-controlled fields. */
export function safeUrl(url: string | null | undefined, fallback = "#"): string {
  if (!url) return fallback;
  const u = url.trim();
  // Allow same-site paths, anchors, and absolute http/https URLs only
  if (u.startsWith("/") || u.startsWith("#")) return u;
  if (/^https?:\/\//i.test(u)) {
    try {
      // Final parseability check
      // eslint-disable-next-line no-new
      new URL(u);
      return u;
    } catch {
      return fallback;
    }
  }
  return fallback;
}

/** Allow only same-site router paths (used for admin-controlled
 *  CTA links so a malicious admin can't ship a phishing link). */
export function safePath(p: string | null | undefined, fallback: string): string {
  if (!p) return fallback;
  const t = p.trim();
  return t.startsWith("/") ? t.slice(0, LIMITS.url) : fallback;
}

/** Normalise a phone number to digits-only (with optional leading +). */
export function digitsOnly(v: string): string {
  return v.replace(/[^\d]/g, "");
}
