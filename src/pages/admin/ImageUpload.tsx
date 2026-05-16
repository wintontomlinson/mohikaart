import { ChangeEvent, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { resolveImage } from "@/lib/site";
import { Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";

type Props = {
  value: string | null | undefined;
  onChange: (url: string) => void;
  label?: string;
  className?: string;
  bucket?: "product-images" | "site-images";
};

const MAX_BYTES = 5 * 1024 * 1024;       // 5 MB
const OK_TYPES  = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];

const ImageUpload = ({
  value,
  onChange,
  label = "Image",
  className,
  bucket = "product-images",
}: Props) => {
  const [busy, setBusy] = useState(false);

  const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!OK_TYPES.includes(file.type)) {
      toast.error("Only JPG, PNG, WEBP, GIF or AVIF images are allowed");
      e.target.value = "";
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error("Image must be 5 MB or smaller");
      e.target.value = "";
      return;
    }

    setBusy(true);
    try {
      const ext  = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

      const { error } = await supabase.storage.from(bucket).upload(name, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });
      if (error) throw error;
      const { data } = supabase.storage.from(bucket).getPublicUrl(name);
      onChange(data.publicUrl);
      toast.success("Image uploaded");
    } catch (err: any) {
      toast.error(err?.message || "Upload failed");
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  };

  return (
    <div className={className}>
      {label && <label className="block text-xs uppercase tracking-widest mb-2 text-muted-foreground">{label}</label>}
      <div className="flex items-center gap-4">
        <div className="w-24 h-24 rounded-xl overflow-hidden bg-muted border border-border shrink-0">
          {value ? (
            <img src={resolveImage(value)} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">No image</div>
          )}
        </div>
        <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-border bg-background hover:bg-muted cursor-pointer text-sm">
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          {busy ? "Uploading…" : "Upload new"}
          <input
            type="file"
            accept={OK_TYPES.join(",")}
            onChange={onFile}
            className="hidden"
            disabled={busy}
          />
        </label>
      </div>
    </div>
  );
};

export default ImageUpload;
