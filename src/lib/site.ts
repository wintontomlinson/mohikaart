// Maps seed-data /src-asset/<file> tokens to bundled ES asset URLs.
// Real admin uploads use full https URLs from storage and bypass this map.
import hero from "@/assets/hero-resin-tray.jpg";
const keychain = "/placeholder.svg";
const frame = "/placeholder.svg";
const tray = "/placeholder.svg";
const wedding = "/placeholder.svg";
const couple = "/placeholder.svg";
import bookmark from "@/assets/cat-bookmark.jpg";
const hamper = "/placeholder.svg";
import pouring from "@/assets/gallery-pouring.jpg";
import packing from "@/assets/gallery-packing.jpg";
import flatlay from "@/assets/gallery-flatlay.jpg";
import workspace from "@/assets/gallery-workspace.jpg";
import customer from "@/assets/gallery-customer.jpg";

const map: Record<string, string> = {
  "hero-resin-tray.jpg": hero,
  "cat-keychain.jpg": keychain,
  "cat-frame.jpg": frame,
  "cat-tray.jpg": tray,
  "cat-wedding.jpg": wedding,
  "cat-couple.jpg": couple,
  "cat-bookmark.jpg": bookmark,
  "cat-hamper.jpg": hamper,
  "gallery-pouring.jpg": pouring,
  "gallery-packing.jpg": packing,
  "gallery-flatlay.jpg": flatlay,
  "gallery-workspace.jpg": workspace,
  "gallery-customer.jpg": customer,
};

const PLACEHOLDER = "/placeholder.svg";

export function resolveImage(url?: string | null): string {
  if (!url) return PLACEHOLDER;
  if (url.startsWith("/src-asset/")) {
    const key = url.replace("/src-asset/", "");
    return map[key] ?? PLACEHOLDER;
  }
  return url;
}

export function formatINR(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}
