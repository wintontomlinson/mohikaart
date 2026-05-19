import { MessageCircle } from "lucide-react";
import { useStoreSettings } from "@/lib/settings";
import { useState } from "react";

const WhatsAppFab = () => {
  const { phone } = useStoreSettings();
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={`https://wa.me/${phone}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="wa-pulse fixed z-40 flex items-center justify-center rounded-full transition-transform duration-300 hover:scale-110"
      style={{
        bottom: "24px",
        right: "24px",
        width: "56px",
        height: "56px",
        background: "linear-gradient(135deg, #25D366, #128C7E)",
        color: "#ffffff",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <MessageCircle className="w-6 h-6" strokeWidth={1.6} />
      {/* Tooltip */}
      <span
        className="absolute right-[calc(100%+12px)] whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-300 pointer-events-none"
        style={{
          background: "#3D2B1F",
          color: "#FAF7F4",
          opacity: hovered ? 1 : 0,
          transform: hovered ? "translateX(0)" : "translateX(8px)",
        }}
      >
        Chat with us
      </span>
    </a>
  );
};

export default WhatsAppFab;
