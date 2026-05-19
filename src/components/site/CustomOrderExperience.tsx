import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Upload, MessageCircle, X, Flower2, ImagePlus } from "lucide-react";
import { toast } from "sonner";
import { useStoreSettings } from "@/lib/settings";
import frameFallback from "@/assets/cat-frame.jpg";

/* ──────────────────────────────────────────────────────────────
   Static option sets - kept in-file because they're tightly
   coupled to the inline shape SVGs and floral icon mapping.
   ────────────────────────────────────────────────────────────── */

type ShapeId = "square" | "round" | "heart" | "bookmark";
type ShapeOption = {
  id: ShapeId;
  label: string;
  icon: (className?: string) => JSX.Element;
};

const SHAPES: ShapeOption[] = [
  {
    id: "square",
    label: "Square Tray",
    icon: (className) => (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <rect x="4" y="4" width="16" height="16" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    ),
  },
  {
    id: "round",
    label: "Round Coaster",
    icon: (className) => (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    ),
  },
  {
    id: "heart",
    label: "Heart Pendant",
    icon: (className) => (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <path
          d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "bookmark",
    label: "Bookmark",
    icon: (className) => (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <path
          d="M7 4h10v16l-5-3.2L7 20V4Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

const FLOWERS = [
  { id: "rose",       label: "Rose" },
  { id: "peony",      label: "Peony" },
  { id: "babys",      label: "Baby's Breath" },
  { id: "lavender",   label: "Lavender" },
  { id: "hydrangea",  label: "Hydrangea" },
  { id: "daisy",      label: "Daisy" },
] as const;

type FlowerId = (typeof FLOWERS)[number]["id"];

const MAX_MESSAGE = 60;
const MAX_FILE_BYTES = 5 * 1024 * 1024;

/* ──────────────────────────────────────────────────────────────
   Preview frame: renders the chosen shape silhouette as a soft
   gold-bordered card. The uploaded photo (or the bundled fallback)
   is masked into the silhouette.
   ────────────────────────────────────────────────────────────── */

const PreviewShape = ({ shape, photo }: { shape: ShapeId; photo: string }) => {
  // Each shape uses an SVG <clipPath> so the photo conforms to the silhouette.
  const clipId = `mohika-clip-${shape}`;
  const path =
    shape === "square"
      ? <rect x="6" y="6" width="88" height="88" rx="10" />
      : shape === "round"
      ? <circle cx="50" cy="50" r="44" />
      : shape === "heart"
      ? <path d="M50 86s-34-20-34-46a18 18 0 0 1 34-9 18 18 0 0 1 34 9c0 26-34 46-34 46Z" />
      : <path d="M28 8h44v84l-22-14-22 14V8Z" />;

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full" role="img" aria-label="Live keepsake preview">
      <defs>
        <clipPath id={clipId}>{path}</clipPath>
        <linearGradient id="mohika-ring" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"  stopColor="hsl(38 62% 70%)" />
          <stop offset="50%" stopColor="hsl(34 54% 48%)" />
          <stop offset="100%" stopColor="hsl(38 62% 70%)" />
        </linearGradient>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <image
          href={photo}
          x="0"
          y="0"
          width="100"
          height="100"
          preserveAspectRatio="xMidYMid slice"
        />
        <rect x="0" y="0" width="100" height="100" fill="hsl(36 48% 99% / 0.1)" />
      </g>
      <g fill="none" stroke="url(#mohika-ring)" strokeWidth="1.2">
        {shape === "square" && <rect x="6" y="6" width="88" height="88" rx="10" />}
        {shape === "round"  && <circle cx="50" cy="50" r="44" />}
        {shape === "heart"  && <path d="M50 86s-34-20-34-46a18 18 0 0 1 34-9 18 18 0 0 1 34 9c0 26-34 46-34 46Z" />}
        {shape === "bookmark" && <path d="M28 8h44v84l-22-14-22 14V8Z" />}
      </g>
    </svg>
  );
};

/* Tiny floral glyph used in the preview corners. Kept inline so
   the section has zero asset dependencies beyond the fallback image. */
const FloralGlyph = ({ size = 18 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
    <g fill="hsl(348 58% 78%)" stroke="hsl(34 54% 48%)" strokeWidth="0.6">
      <circle cx="12" cy="12" r="2.2" />
      <ellipse cx="12" cy="6"  rx="2.2" ry="3.4" />
      <ellipse cx="12" cy="18" rx="2.2" ry="3.4" />
      <ellipse cx="6"  cy="12" rx="3.4" ry="2.2" />
      <ellipse cx="18" cy="12" rx="3.4" ry="2.2" />
    </g>
  </svg>
);

/* ──────────────────────────────────────────────────────────────
   Main section
   ────────────────────────────────────────────────────────────── */

const CustomOrderExperience = () => {
  const { phone } = useStoreSettings();
  const [shape, setShape] = useState<ShapeId>("square");
  const [flowers, setFlowers] = useState<FlowerId[]>(["rose", "babys"]);
  const [message, setMessage] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const focusShape = (idx: number) => {
    const next = SHAPES[idx];
    if (!next) return;
    setShape(next.id);
    buttonsRef.current[idx]?.focus();
  };

  const handleShapeKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, idx: number) => {
    const last = SHAPES.length - 1;
    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        e.preventDefault();
        focusShape(idx === last ? 0 : idx + 1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        e.preventDefault();
        focusShape(idx === 0 ? last : idx - 1);
        break;
      case "Home":
        e.preventDefault();
        focusShape(0);
        break;
      case "End":
        e.preventDefault();
        focusShape(last);
        break;
    }
  };

  const toggleFlower = (id: FlowerId) =>
    setFlowers((curr) =>
      curr.includes(id) ? curr.filter((f) => f !== id) : [...curr, id]
    );

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_FILE_BYTES) {
      toast.error("File too large; please pick a photo under 5MB");
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setPhoto(reader.result);
    };
    reader.onerror = () => toast.error("Could not read that file. Please try another.");
    reader.readAsDataURL(file);
  };

  const clearPhoto = () => {
    setPhoto(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const shapeLabel = useMemo(
    () => SHAPES.find((s) => s.id === shape)?.label ?? "",
    [shape]
  );
  const flowerLabels = useMemo(
    () =>
      FLOWERS.filter((f) => flowers.includes(f.id))
        .map((f) => f.label)
        .join(", "),
    [flowers]
  );

  const waHref = useMemo(() => {
    const lines = [
      "Hi Mohika! I'd love to design a custom keepsake.",
      `Shape: ${shapeLabel}`,
      `Flowers: ${flowerLabels || "(none selected yet)"}`,
      message.trim() ? `Message to engrave: "${message.trim()}"` : null,
      photo ? "I'll share the reference photo here on WhatsApp." : null,
    ].filter(Boolean);
    const text = encodeURIComponent(lines.join("\n"));
    return `https://wa.me/${phone}?text=${text}`;
  }, [phone, shapeLabel, flowerLabels, message, photo]);

  return (
    <section
      id="custom-order"
      className="relative py-28 md:py-40 overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 70% 50% at 0% 0%, hsl(348 58% 94% / 0.6), transparent), radial-gradient(ellipse 60% 50% at 100% 100%, hsl(38 62% 88% / 0.5), transparent), hsl(36 42% 98%)",
      }}
    >
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl mb-14 md:mb-20"
        >
          <div className="eyebrow mb-5">Design your keepsake</div>
          <h2
            className="font-display leading-[1.04] tracking-[-0.03em]"
            style={{ fontWeight: 300, fontSize: "clamp(2rem, 4vw, 3.6rem)" }}
          >
            Make it{" "}
            <em
              className="not-italic text-gold-grad"
              style={{ fontStyle: "italic", fontFamily: "var(--font-serif)" }}
            >
              entirely yours.
            </em>
          </h2>
          <p
            className="mt-5"
            style={{
              fontSize: "clamp(0.92rem, 1.3vw, 1.02rem)",
              color: "hsl(25 10% 46%)",
              fontWeight: 380,
              lineHeight: 1.72,
            }}
          >
            Choose a shape, pick the flowers that mean something, add a message,
            and we'll pour it into resin. Continue on WhatsApp when it feels right.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* ── LEFT: controls ────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-10"
          >
            {/* Shape */}
            <fieldset>
              <legend className="eyebrow mb-4">Choose your shape</legend>
              <div
                role="radiogroup"
                aria-label="Keepsake shape"
                className="grid grid-cols-2 sm:grid-cols-4 gap-3"
              >
                {SHAPES.map((s, idx) => {
                  const active = shape === s.id;
                  return (
                    <button
                      key={s.id}
                      ref={(el) => { buttonsRef.current[idx] = el; }}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      tabIndex={active ? 0 : -1}
                      onClick={() => setShape(s.id)}
                      onKeyDown={(e) => handleShapeKeyDown(e, idx)}
                      className={`group flex flex-col items-center gap-2 rounded-2xl px-3 py-4 transition-all duration-300 ${
                        active
                          ? "bg-foreground text-background shadow-luxe"
                          : "frost-card text-foreground"
                      }`}
                    >
                      {s.icon("w-7 h-7")}
                      <span className="btn-text text-[11px] tracking-[0.14em] uppercase">
                        {s.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {/* Flowers */}
            <fieldset>
              <legend className="eyebrow mb-4">Pick your flowers</legend>
              <div className="flex flex-wrap gap-2">
                {FLOWERS.map((f) => {
                  const active = flowers.includes(f.id);
                  return (
                    <button
                      key={f.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => toggleFlower(f.id)}
                      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs tracking-[0.08em] uppercase font-medium transition-all duration-300 ${
                        active
                          ? "bg-blush text-rose-text shadow-soft"
                          : "glass hover:shadow-soft"
                      }`}
                      style={
                        active
                          ? { color: "hsl(var(--rose-text))", background: "hsl(var(--blush))" }
                          : undefined
                      }
                    >
                      <Flower2 className="w-3.5 h-3.5" />
                      {f.label}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {/* Message */}
            <div>
              <label htmlFor="mohika-message" className="eyebrow mb-4 block">
                Add a personal message
              </label>
              <input
                id="mohika-message"
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value.slice(0, MAX_MESSAGE))}
                maxLength={MAX_MESSAGE}
                placeholder="For my forever, with love..."
                className="w-full rounded-full border border-border bg-background/80 px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 transition-shadow"
              />
              <div className="mt-1.5 text-right text-[11px] text-muted-foreground">
                {message.length} / {MAX_MESSAGE}
              </div>
            </div>

            {/* Photo */}
            <div>
              <span className="eyebrow mb-4 block">Upload a photo</span>
              <div className="flex items-center gap-3">
                <label className="inline-flex items-center gap-2 rounded-full glass border border-foreground/10 px-5 py-3 cursor-pointer hover:bg-foreground hover:text-background transition-all duration-400">
                  <Upload className="w-4 h-4" />
                  <span className="btn-text text-[12px] tracking-[0.14em] uppercase">
                    {photo ? "Replace photo" : "Choose photo"}
                  </span>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFile}
                    className="sr-only"
                  />
                </label>
                {photo && (
                  <button
                    type="button"
                    onClick={clearPhoto}
                    className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    Remove
                  </button>
                )}
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">
                Up to 5MB. Stays on your device until you continue on WhatsApp.
              </p>
            </div>
          </motion.div>

          {/* ── RIGHT: live preview ───────────────────────── */}
          <motion.aside
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="lg:sticky lg:top-28"
          >
            <div className="frost-card rounded-3xl p-6 md:p-8 shadow-luxe">
              <div className="flex items-center justify-between mb-5">
                <div className="eyebrow" style={{ marginBottom: 0 }}>
                  Live preview
                </div>
                <div className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                  {shapeLabel}
                </div>
              </div>

              <div className="relative aspect-square rounded-3xl overflow-hidden bg-card-grad shadow-card p-6 md:p-8">
                {/* Floral corner accents matching selection */}
                {flowers.length > 0 && (
                  <>
                    <div className="absolute top-3 left-3 opacity-80">
                      <FloralGlyph size={20} />
                    </div>
                    <div className="absolute top-3 right-3 opacity-70">
                      <FloralGlyph size={16} />
                    </div>
                    <div className="absolute bottom-3 left-3 opacity-70">
                      <FloralGlyph size={16} />
                    </div>
                    <div className="absolute bottom-3 right-3 opacity-80">
                      <FloralGlyph size={20} />
                    </div>
                  </>
                )}

                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-[86%] h-[86%] relative">
                    <PreviewShape shape={shape} photo={photo ?? frameFallback} />
                  </div>
                </div>

                {/* Etched message at the bottom */}
                {message.trim() && (
                  <div className="absolute inset-x-6 bottom-5 text-center">
                    <p
                      className="font-serif italic text-sm md:text-base text-rose-text/90 line-clamp-2"
                      style={{ color: "hsl(var(--rose-text) / 0.92)" }}
                    >
                      “{message.trim()}”
                    </p>
                  </div>
                )}

                {!photo && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-foreground/45">
                    <ImagePlus className="w-3.5 h-3.5" />
                    Add your photo
                  </div>
                )}
              </div>

              <div className="mt-6 flex flex-col gap-3">
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-foreground text-background btn-glow btn-text"
                >
                  <MessageCircle className="w-4 h-4" />
                  Continue on WhatsApp
                </a>
                <p className="text-[11px] text-muted-foreground text-center">
                  We reply in under 2 hours, most days within minutes.
                </p>
              </div>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
};

export default CustomOrderExperience;
