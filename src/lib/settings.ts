import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export type StoreSettings = {
  phone: string;        // digits only, e.g. "919876543210"
  phone_display: string; // e.g. "+91 98765 43210"
  email: string;
  instagram: string;    // handle without @, e.g. "mohikaart"
  free_shipping_threshold: number;
};

export const DEFAULT_SETTINGS: StoreSettings = {
  phone: "919999999999",
  phone_display: "+91 99999 99999",
  email: "hello@mohikaart.com",
  instagram: "mohikaart",
  free_shipping_threshold: 499,
};

/** Returns true when the configured store phone is still the placeholder
 *  fallback or otherwise non-dialable. Used to short-circuit wa.me CTAs so
 *  unconfigured deployments never open chats to `919999999999`. */
export const isPlaceholderPhone = (phone: string): boolean =>
  phone === DEFAULT_SETTINGS.phone || !phone || phone.replace(/\D/g, "").length < 10;

let _cache: StoreSettings | null = null;

export async function fetchStoreSettings(): Promise<StoreSettings> {
  if (_cache) return _cache;
  const { data } = await supabase
    .from("app_settings")
    .select("value")
    .eq("key", "store")
    .maybeSingle();
  const val =
    data?.value && typeof data.value === "object" && !Array.isArray(data.value)
      ? (data.value as Partial<StoreSettings>)
      : {};
  _cache = { ...DEFAULT_SETTINGS, ...val };
  return _cache;
}

export function invalidateSettingsCache() {
  _cache = null;
}

/** Reads store settings via React Query so saves elsewhere refresh
 *  every consumer (Navbar, WhatsApp button, Footer, …). */
export function useStoreSettings() {
  const q = useQuery({
    queryKey: ["app_setting", "store"],
    queryFn:  fetchStoreSettings,
    staleTime: 60_000,
  });
  return q.data ?? DEFAULT_SETTINGS;
}

/** Call after saving store settings in admin to refresh subscribers. */
export function useInvalidateStoreSettings() {
  const qc = useQueryClient();
  return () => {
    invalidateSettingsCache();
    qc.invalidateQueries({ queryKey: ["app_setting", "store"] });
  };
}
