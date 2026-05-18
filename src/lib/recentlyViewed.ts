/**
 * Recently-viewed product tracking.
 *
 * Stores a JSON array of product ids under localStorage key
 * "mohika.recentlyViewed.v1". The most recent id is at the FRONT of the array;
 * duplicates are removed; the list is capped at 12 entries.
 */
const KEY = "mohika.recentlyViewed.v1";
const MAX = 12;

const safeParse = (raw: string | null): string[] => {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((v): v is string => typeof v === "string");
  } catch {
    // Bad JSON - reset by returning empty (the next write will overwrite).
    return [];
  }
};

export const getRecentlyViewed = (): string[] => {
  if (typeof window === "undefined") return [];
  try {
    return safeParse(window.localStorage.getItem(KEY));
  } catch {
    return [];
  }
};

export const pushRecentlyViewed = (productId: string): void => {
  if (typeof window === "undefined" || !productId) return;
  try {
    const current = safeParse(window.localStorage.getItem(KEY));
    const deduped = current.filter((id) => id !== productId);
    const next = [productId, ...deduped].slice(0, MAX);
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Storage is unavailable (private mode, quota, etc.) - nothing to do.
  }
};
