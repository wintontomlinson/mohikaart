import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

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

let _cache: StoreSettings | null = null;
let _promise: Promise<StoreSettings> | null = null;

export async function fetchStoreSettings(): Promise<StoreSettings> {
  if (_cache) return _cache;
  if (_promise) return _promise;
  _promise = supabase
    .from("app_settings")
    .select("value")
    .eq("key", "store")
    .maybeSingle()
    .then(({ data }) => {
      const val =
        data?.value && typeof data.value === "object" && !Array.isArray(data.value)
          ? (data.value as Partial<StoreSettings>)
          : {};
      _cache = { ...DEFAULT_SETTINGS, ...val };
      _promise = null;
      return _cache!;
    });
  return _promise;
}

export function invalidateSettingsCache() {
  _cache = null;
  _promise = null;
}

export function useStoreSettings() {
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_SETTINGS);
  useEffect(() => {
    fetchStoreSettings().then(setSettings);
  }, []);
  return settings;
}
