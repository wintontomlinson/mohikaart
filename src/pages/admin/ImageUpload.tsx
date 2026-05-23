import { ChangeEvent, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { resolveImage } from "@/lib/site";
import { Upload, Loader2, Info } from "lucide-react";
import { toast } from "sonner";

type Props = {
  value: string | null | undefined;
  onChange: (url: string) => void;
  label?: string;
  className?: string;
  bucket?: "product-images" | "site-images";
  /** Hint about recommended image dimensions */
  hint?: string;
};

const MAX_BYTES = 5 * 1024 * 1024;
const OK_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];

const ImageUpload = ({ value, onChange, label = "Image", className, bucket = "product-images", hint }: Props) => {
  const [busy, setBusy] = useState(false);

  // Auto-detect hint if not provided
  const resolvedHint = hint ?? (
    bucket === "site-images"
      ? "Recommended: 1200×630 px · JPG/PNG/WebP · Max 5 MB"
      : "Recommended: 1000×1000 px (square) · JPG/PNG/WebP · Max 5 MB"
  );

  const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!OK_TYPES.includes(file.type)) { toast.error("Only JPG, PNG, WEBP, GIF or AVIF allowed"); e.target.value = ""; return; }
    if (file.size > MAX_BYTES) { toast.error("Image must be 5 MB or smaller"); e.target.value = ""; return; }
    setBusy(true);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage.from(bucket).upload(name, file, { cacheControl: "3600", upsert: false, contentType: file.type });
      if (error) throw error;
      const { data } = supabase.storage.from(bucket).getPublicUrl(name);
      onChange(data.publicUrl);
      toast.success("Image uploaded");
    } catch (err: any) { toast.error(err?.message || "Upload failed"); }
    finally { setBusy(false); e.target.value = ""; }
  };

  return (
    <div className={className}>
      {label && <label className="block text-[11px] uppercase tracking-widest mb-2 text-muted-foreground font-medium">{label}</label>}
      <div className="flex items-center gap-4">
        <div className="w-24 h-24 rounded-xl overflow-hidden bg-[#f8f5f0] border border-[#e5e0d8] shrink-0">
          {value ? (
            <img src={resolveImage(value)} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground/40 text-xs">No image</div>
          )}
        </div>
        <div className="space-y-2">
          <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#e5e0d8] bg-white hover:bg-[#f8f5f0] hover:border-[#c9a84c]/40 cursor-pointer text-sm transition-all">
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {busy ? "Uploading…" : "Upload"}
            <input type="file" accept={OK_TYPES.join(",")} onChange={onFile} className="hidden" disabled={busy} />
          </label>
          {resolvedHint && (
            <div className="flex items-start gap-1.5">
              <Info className="w-3 h-3 text-muted-foreground/50 shrink-0 mt-0.5" />
              <p className="text-[10px] text-muted-foreground/70 leading-relaxed">{resolvedHint}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
