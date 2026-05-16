import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import ImageUpload from "./ImageUpload";
import { toast } from "sonner";

type Slot = { key: string; image_url: string; alt: string | null };

const SECTIONS: { title: string; slots: { key: string; label: string; desc?: string }[] }[] = [
  {
    title: "Hero",
    slots: [
      { key: "hero", label: "Homepage hero image", desc: "Full-bleed hero on the home page" },
    ],
  },
  {
    title: "About",
    slots: [
      { key: "about_1", label: "About – main image",      desc: "Large top-left photo in the About collage" },
      { key: "about_2", label: "About – secondary image", desc: "Bottom-right photo in the About collage" },
      { key: "about_3", label: "About – accent image",    desc: "Small overlapping accent photo in the About collage" },
    ],
  },
  {
    title: "Gallery",
    slots: [
      { key: "gallery_1", label: "Gallery photo 1", desc: "Top-left slot in the studio gallery grid" },
      { key: "gallery_2", label: "Gallery photo 2", desc: "Top-center slot" },
      { key: "gallery_3", label: "Gallery photo 3", desc: "Top-right slot" },
      { key: "gallery_4", label: "Gallery photo 4", desc: "Bottom-left slot" },
      { key: "gallery_5", label: "Gallery photo 5", desc: "Bottom-center slot" },
      { key: "gallery_6", label: "Gallery photo 6", desc: "Bottom-right slot" },
    ],
  },
];

const AdminImages = () => {
  const [data, setData] = useState<Record<string, Slot>>({});

  const load = async () => {
    const { data: rows } = await supabase.from("site_images").select("*");
    const map: Record<string, Slot> = {};
    (rows ?? []).forEach((r: any) => { map[r.key] = r; });
    setData(map);
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

  return (
    <div>
      <h1 className="font-display text-4xl mb-2">Site Images</h1>
      <p className="text-sm text-muted-foreground mb-8">Replace the photos shown across the site. Changes are live immediately.</p>

      <div className="space-y-10 max-w-2xl">
        {SECTIONS.map((section) => (
          <div key={section.title}>
            <h2 className="font-display text-xl mb-4 pb-2 border-b border-border">{section.title}</h2>
            <div className="space-y-4">
              {section.slots.map((s) => (
                <div key={s.key} className="bg-background rounded-2xl border border-border p-6">
                  <div className="font-serif text-lg mb-0.5">{s.label}</div>
                  {s.desc && <p className="text-xs text-muted-foreground mb-1">{s.desc}</p>}
                  <div className="text-[10px] text-muted-foreground/50 font-mono mb-4">key: {s.key}</div>
                  <ImageUpload
                    bucket="site-images"
                    value={data[s.key]?.image_url}
                    onChange={(url) => update(s.key, url)}
                    label=""
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminImages;
