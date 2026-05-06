import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import ImageUpload from "./ImageUpload";
import { toast } from "sonner";

type Slot = { key: string; image_url: string; alt: string | null };

const SLOTS: { key: string; label: string }[] = [
  { key: "hero",    label: "Homepage hero image" },
  { key: "about_1", label: "About - main image" },
  { key: "about_2", label: "About - secondary image" },
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

      <div className="space-y-4 max-w-2xl">
        {SLOTS.map((s) => (
          <div key={s.key} className="bg-background rounded-2xl border border-border p-6">
            <div className="font-serif text-lg mb-1">{s.label}</div>
            <div className="text-xs text-muted-foreground mb-4">key: {s.key}</div>
            <ImageUpload
              value={data[s.key]?.image_url}
              onChange={(url) => update(s.key, url)}
              label=""
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminImages;
