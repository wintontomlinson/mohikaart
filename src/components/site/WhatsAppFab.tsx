import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { useStoreSettings } from "@/lib/settings";

const WhatsAppFab = () => {
  const { phone } = useStoreSettings();
  return (
  <motion.a
    href={`https://wa.me/${phone}`}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Chat on WhatsApp"
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ delay: 2.5, duration: 0.5, type: "spring", stiffness: 200 }}
    whileHover={{ scale: 1.1, rotate: -5 }}
    whileTap={{ scale: 0.9 }}
    className="fixed right-6 z-40 w-14 h-14 md:w-16 md:h-16 rounded-full bg-foreground text-background flex items-center justify-center shadow-luxe btn-glow group"
    style={{ bottom: "calc(1.5rem + var(--fab-bottom-offset))" }}
  >
    <motion.span
      className="absolute inset-0 rounded-full bg-blush/40"
      animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
    />
    <MessageCircle className="relative w-6 h-6 md:w-7 md:h-7" strokeWidth={1.6} />
    <span className="absolute right-full mr-3 px-3 py-1.5 rounded-full bg-foreground text-background text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 shadow-soft">
      Chat with Mohika
    </span>
  </motion.a>
  );
};

export default WhatsAppFab;
