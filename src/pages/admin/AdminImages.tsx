import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import ImageUpload from "./ImageUpload";
import { toast } from "sonner";
import { Image as ImageIcon } from "lucide-react";

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
      { key: "about_1", label: "About - main image", desc: "Large photo in the About collage" },
      { key: "about_2", label: "About - secondary image", desc: "Supporting photo" },
      { key: "about_3", label: "About - accent image", desc: "Small accent photo" },
    ],
  },
  {
    title: "Gallery",
    slots: [
      { key: "gallery_1", label: "Gallery photo 1" },
      { key: "gallery_2", label: "Gallery photo 2" },
      { key: "gallery_3", label: "Gallery photo 3" },
      { key: "gallery_4", label: "Gallery photo 4" },
      { key: "gallery_5", label: "Gallery photo 5" },
      { key: "gallery_6", label: "Gallery photo 6" },
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
    <div className="pb-20 lg:pb-0">
      <div className="mb-8">
        <h1 className="text-white text-3xl font-semibold">Site Images</h1>
        <p className="text-sm text-white/40 mt-1">Replace photos across the site. Changes are live immediately.</p>
      </div>

      <div className="space-y-8 max-w-2xl">
        {SECTIONS.map((section) => (
          <div key={section.title}>
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/[0.04]">
              <ImageIcon className="w-4 h-4 text-amber-400/70" />
              <h2 className="text-white font-semibold">{section.title}</h2>
            </div>
            <div className="space-y-4">
              {section.slots.map((s) => (
                <div key={s.key} className="bg-[#1a1a22] rounded-2xl border border-white/[0.04] p-6">
                  <div className="text-white/80 font-medium mb-0.5">{s.label}</div>
                  {s.desc && <p className="text-xs text-white/30 mb-1">{s.desc}</p>}
                  <div className="text-[10px] text-white/15 font-mono mb-4">key: {s.key}</div>
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
