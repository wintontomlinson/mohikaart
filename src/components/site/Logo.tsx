/**
 * Mohika Art brand lockup.
 *
 * Wordmark  - serif "Mohika" + italic gold "Art" lockup using --font-display.
 * Monogram  - self-contained inline SVG of a wax-seal medallion (concentric
 *             gold rings, cardinal-point dots, italic serif M). No raster.
 *
 * Both use currentColor for tone control so callers can place them on light
 * (foreground) or dark (background) chrome without per-component overrides.
 */
type WordmarkProps = {
  variant?: "light" | "dark";
  className?: string;
};

export const Wordmark = ({ variant = "light", className = "" }: WordmarkProps) => (
  <span
    className={`font-display text-lg md:text-xl ${className}`}
    style={{
      fontWeight: 350,
      color: variant === "dark" ? "hsl(var(--background))" : "hsl(var(--foreground))",
      letterSpacing: "-0.02em",
    }}
  >
    Mohika{" "}
    <em
      className="text-gold-grad"
      style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
    >
      Art
    </em>
  </span>
);

type MonogramTone = "gold" | "foreground" | "background";

type MonogramProps = {
  size?: number;
  tone?: MonogramTone;
  className?: string;
};

const toneToColor = (tone: MonogramTone) => {
  switch (tone) {
    case "gold":       return "hsl(var(--gold))";
    case "background": return "hsl(var(--background))";
    case "foreground":
    default:           return "hsl(var(--foreground))";
  }
};

export const Monogram = ({ size = 36, tone = "foreground", className = "" }: MonogramProps) => (
  <svg
    role="img"
    aria-label="Mohika Art monogram"
    width={size}
    height={size}
    viewBox="0 0 64 64"
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 ${className}`}
    style={{ color: toneToColor(tone) }}
  >
    {/* Outer thin ring */}
    <circle cx="32" cy="32" r="29" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.55" />
    {/* Inner thicker ring (the wax-seal body) */}
    <circle cx="32" cy="32" r="24" fill="none" stroke="currentColor" strokeWidth="2" />
    {/* Cardinal-point decorative dots */}
    <circle cx="32" cy="6.5"  r="1.1" fill="currentColor" />
    <circle cx="32" cy="57.5" r="1.1" fill="currentColor" />
    <circle cx="6.5"  cy="32" r="1.1" fill="currentColor" />
    <circle cx="57.5" cy="32" r="1.1" fill="currentColor" />
    {/* Italic serif M centered */}
    <text
      x="32"
      y="42"
      textAnchor="middle"
      fontFamily="'Playfair Display', 'Cormorant Garamond', serif"
      fontStyle="italic"
      fontWeight="500"
      fontSize="28"
      fill="currentColor"
      letterSpacing="-0.5"
    >
      M
    </text>
  </svg>
);

export default Monogram;
