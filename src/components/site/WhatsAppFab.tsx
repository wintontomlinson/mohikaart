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
      className="whatsapp-pulse fixed z-40 flex items-center justify-center rounded-full"
      style={{
        bottom: "24px",
        right: "24px",
        width: "52px",
        height: "52px",
        background: "#3D2B1F",
        color: "#FAF7F4",
      }}
    >
      <MessageCircle className="w-6 h-6" strokeWidth={1.6} />
    </a>
  );
};

export default WhatsAppFab;
