import { MessageCircle } from "lucide-react";
import { useStoreSettings } from "@/lib/settings";

const WhatsAppFab = () => {
  const { phone } = useStoreSettings();
  return (
    <a
      href={`https://wa.me/${phone}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed z-40 flex items-center justify-center whatsapp-pulse"
      style={{
        bottom: "24px",
        right: "24px",
        width: "52px",
        height: "52px",
        borderRadius: "9999px",
        background: "#3D2B1F",
        color: "#FAF7F4",
        boxShadow: "0 4px 20px -4px rgba(61,43,31,0.4)",
      }}
    >
      <MessageCircle className="w-6 h-6" strokeWidth={1.6} />
    </a>
  );
};

export default WhatsAppFab;
