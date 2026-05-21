import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { resolveImage } from "@/lib/site";
import ImageUpload from "./ImageUpload";
import { toast } from "sonner";
import { RefreshCw, Trash2, ExternalLink, ImageIcon } from "lucide-react";

type Slot = { key: string; image_url: string; alt: string | null };

/* Default bundled images that can be used as fallbacks */
const DEFAULT_IMAGES: Record<string, string> = {
  hero: "/src-asset/hero-resin-tray.jpg",
  about_1: "/src-asset/gallery-workspace.jpg",
  about_2: "/src-asset/gallery-customer.jpg",
  about_3: "/src-asset/gallery-pouring.jpg",
  gallery_1: "/src-asset/gallery-pouring.jpg",
  gallery_2: "/src-asset/gallery-packing.jpg",
  gallery_3: "/src-asset/gallery-flatlay.jpg",
  gallery_4: "/src-asset/gallery-workspace.jpg",
  gallery_5: "/src-asset/gallery-customer.jpg",
  gallery_6: "/src-asset/cat-couple.jpg",
};

const SECTIONS: { title: string; slots: { key: string; label: string; desc?: string }[] }[] = [
  {
    title: "Hero",
    slots: [
      { key: "hero", label: "Homepage Hero Image", desc: "Main banner image on the homepage. Recommended: 1920×1080px" },
    ],
  },
  {
    title: "About Section",
    slots: [
      { key: "about_1", label: "About - Main Image", desc: "Large photo in the About section collage (top-left)" },
      { key: "about_2", label: "About - Secondary Image", desc: "Bottom-right photo in the About collage" },
      { key: "about_3", label: "About - Accent Image", desc: "Small overlapping accent photo" },
    ],
  },
  {
    title: "Studio Gallery",
    slots: [
      { key: "gallery_1", label: "Gallery Photo 1", desc: "Top-left slot in the gallery grid" },
      { key: "gallery_2", label: "Gallery Photo 2", desc: "Top-center slot" },
      { key: "gallery_3", label: "Gallery Photo 3", desc: "Top-right slot" },
      { key: "gallery_4", label: "Gallery Photo 4", desc: "Bottom-left slot" },
      { key: "gallery_5", label: "Gallery Photo 5", desc: "Bottom-center slot" },
      { key: "gallery_6", label: "Gallery Photo 6", desc: "Bottom-right slot" },
    ],
  },
];

const AdminImages = () => {
  const [data, setData] = useState<Record<string, Slot>>({});
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data: rows } = await supabase.from("site_images").select("*");
    const map: Record<string, Slot> = {};
    (rows ?? []).forEach((r: any) => { map[r.key] = r; });
    setData(map);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const update = async (key: string, image_url: string) => {
    const existing = data[key];
    const payload = { key, image_url, alt: existing?.alt ?? null };
    const { error } = await supabase.from("site_images").upsert(payload);
    if (error) return toast.error(error.message);
    toast.success("Image updated");
    load();
  };

  const resetToDefault = async (key: string) => {
    const defaultUrl = DEFAULT_IMAGES[key];
    if (!defaultUrl) return;
    await update(key, defaultUrl);
  };

  const removeImage = async (key: string) => {
    const { error } = await supabase.from("site_images").delete().eq("key", key);
    if (error) return toast.error(error.message);
    toast.success("Image removed — will use default");
    load();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          Loading images…
        </div>
      </div>
    );
  }

  const totalSlots = SECTIONS.reduce((sum, s) => sum + s.slots.length, 0);
  const filledSlots = Object.keys(data).length;

  return (
    <div>
      <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
        <div>
          <h1 className="font-display text-4xl">Site Images</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage photos displayed across the website. Changes are live immediately.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-background border border-border rounded-full px-4 py-2">
          <ImageIcon className="w-3.5 h-3.5" />
          {filledSlots}/{totalSlots} slots filled
        </div>
      </div>

      {/* Current images overview */}
      <div className="bg-amber-50/50 border border-amber-200/50 rounded-2xl p-5 mb-8">
        <h3 className="text-sm font-medium text-amber-900 mb-3">Currently Uploaded Images</h3>
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
          {SECTIONS.flatMap((s) => s.slots).map((slot) => {
            const existing = data[slot.key];
            const imgUrl = existing?.image_url ? resolveImage(existing.image_url) : null;
            return (
              <div key={slot.key} className="relative group" title={slot.label}>
                <div className="aspect-square rounded-lg overflow-hidden border border-border bg-muted">
                  {imgUrl ? (
                    <img src={imgUrl} alt={slot.label} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-4 h-4 text-muted-foreground/30" />
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[7px] text-muted-foreground bg-background border border-border rounded px-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {slot.key}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-10 max-w-3xl">
        {SECTIONS.map((section) => (
          <div key={section.title}>
            <h2 className="font-display text-xl mb-1">{section.title}</h2>
            <p className="text-xs text-muted-foreground mb-5">
              {section.title === "Hero" && "The main banner image visitors see first."}
              {section.title === "About Section" && "Images shown in the About Us section collage."}
              {section.title === "Studio Gallery" && "Behind-the-scenes photos of your workspace and process."}
            </p>
            <div className="space-y-4">
              {section.slots.map((s) => {
                const existing = data[s.key];
                const imgUrl = existing?.image_url ? resolveImage(existing.image_url) : null;
                const isDefault = existing?.image_url?.startsWith("/src-asset/");

                return (
                  <div key={s.key} className="bg-white rounded-2xl border border-border p-5 hover:border-border/80 transition-colors">
                    <div className="flex items-start gap-5">
                      {/* Image preview */}
                      <div className="w-32 h-32 rounded-xl overflow-hidden bg-muted border border-border shrink-0">
                        {imgUrl ? (
                          <img src={imgUrl} alt={s.label} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/50">
                            <ImageIcon className="w-6 h-6 mb-1" />
                            <span className="text-[9px]">Empty</span>
                          </div>
                        )}
                      </div>

                      {/* Info + actions */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-medium text-sm">{s.label}</h3>
                            {s.desc && <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>}
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-[9px] font-mono text-muted-foreground/50 bg-muted px-1.5 py-0.5 rounded">
                                {s.key}
                              </span>
                              {isDefault && (
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 font-medium">
                                  Default
                                </span>
                              )}
                              {existing && !isDefault && (
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 font-medium">
                                  Custom
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Upload + actions */}
                        <div className="mt-4 flex items-center gap-2 flex-wrap">
                          <ImageUpload
                            bucket="site-images"
                            value={null}
                            onChange={(url) => update(s.key, url)}
                            label=""
                            className="inline-block"
                          />
                          {DEFAULT_IMAGES[s.key] && (
                            <button
                              onClick={() => resetToDefault(s.key)}
                              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full border border-border hover:bg-muted text-xs transition-colors"
                              title="Reset to default bundled image"
                            >
                              <RefreshCw className="w-3 h-3" /> Use Default
                            </button>
                          )}
                          {existing && (
                            <button
                              onClick={() => removeImage(s.key)}
                              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full border border-destructive/30 hover:bg-destructive/10 text-destructive text-xs transition-colors"
                              title="Remove custom image"
                            >
                              <Trash2 className="w-3 h-3" /> Remove
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminImages;
