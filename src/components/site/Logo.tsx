/**
 * Mohika Art. Premium Modern Brand Lockup
 *
 * Wordmark. Refined "Mohika" + italic gold "Art" using Playfair Display.
 * Monogram. Modern minimalist mark: a flowing "M" with a gold accent dot,
 *            framed in a soft circular border. Premium, memorable, scalable.
 *
 * Both use design tokens for tone control on light/dark surfaces.
 */
type WordmarkProps = {
  variant?: "light" | "dark";
  className?: string;
};

export const Wordmark = ({ variant = "light", className = "" }: WordmarkProps) => (
  <span
    className={`font-display ${className}`}
    style={{
      fontWeight: 500,
      fontSize: "20px",
      letterSpacing: "0.02em",
      color: variant === "dark" ? "#FAF7F4" : "#3D2B1F",
      lineHeight: 1,
      display: "inline-flex",
      alignItems: "baseline",
      gap: "4px",
    }}
  >
    <span>Mohika</span>
    <em
      style={{
        fontFamily: "var(--font-serif)",
        fontStyle: "italic",
        fontWeight: 400,
        color: "#C9964A",
      }}
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
    case "gold":
      return "#C9964A";
    case "background":
      return "#FAF7F4";
    case "foreground":
    default:
      return "#3D2B1F";
  }
};

export const Monogram = ({
  size = 36,
  tone = "foreground",
  className = "",
}: MonogramProps) => {
  const stroke = toneToColor(tone);
  return (
    <svg
      role="img"
      aria-label="Mohika Art monogram"
      width={size}
      height={size}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      {/* Soft circular frame with gradient stroke */}
      <defs>
        <linearGradient id="mohika-ring" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.4" />
          <stop offset="50%" stopColor="#C9964A" stopOpacity="0.9" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0.4" />
        </linearGradient>
      </defs>

      {/* Outer ring, subtle premium frame */}
      <circle
        cx="32"
        cy="32"
        r="29"
        fill="none"
        stroke="url(#mohika-ring)"
        strokeWidth="1.4"
      />

      {/* Modern italic M, clean geometric shape */}
      <path
        d="M 18 44 L 18 22 L 26 22 L 32 36 L 38 22 L 46 22 L 46 44"
        fill="none"
        stroke={stroke}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Gold accent dot */}
      <circle cx="32" cy="49" r="1.6" fill="#C9964A" />
    </svg>
  );
};

export default Monogram;
