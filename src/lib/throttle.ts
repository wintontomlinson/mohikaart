/**
 * Simple client-side rate limiter.
 * Prevents spam-clicking forms by tracking last submission time per action key.
 * This is a UX guard — real rate limiting must be enforced server-side (RLS/Edge Functions).
 */

const _timestamps = new Map<string, number>();

/**
 * Returns true if the action is allowed (enough time has passed since last call).
 * Returns false if the user is submitting too fast.
 *
 * @param key   - Unique identifier for the action (e.g. "checkout", "contact")
 * @param cooldownMs - Minimum time between submissions in ms (default: 5000 = 5s)
 */
export function canSubmit(key: string, cooldownMs = 5000): boolean {
  const now = Date.now();
  const last = _timestamps.get(key) ?? 0;
  if (now - last < cooldownMs) return false;
  _timestamps.set(key, now);
  return true;
}

/**
 * Returns how many seconds remain before the next submission is allowed.
 * Returns 0 if the user can submit now.
 */
export function cooldownRemaining(key: string, cooldownMs = 5000): number {
  const now = Date.now();
  const last = _timestamps.get(key) ?? 0;
  const remaining = cooldownMs - (now - last);
  return remaining > 0 ? Math.ceil(remaining / 1000) : 0;
}
