import { motion } from "framer-motion";
import { Mail, MessageCircle, ArrowRight } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useStoreSettings, isPlaceholderPhone } from "@/lib/settings";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const { phone } = useStoreSettings();
  const phoneDigits = (phone || "").replace(/\D/g, "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    // Open WhatsApp with email subscription message
    if (!isPlaceholderPhone(phone)) {
      const message = `Hi Mohika! I'd like to subscribe for updates. My email is ${trimmed}.`;
      window.open(`https://wa.me/${phoneDigits}?text=${encodeURIComponent(message)}`, "_blank");
    }
    toast.success("Thank you for subscribing!");
    setEmail("");
  };

  return (
    <section className="py-16 md:py-20">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95, rotateX: 6 }}
          whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-3xl px-6 py-12 md:px-12 md:py-14 hover-glow-gold"
          style={{
            background: "linear-gradient(135deg, #fdf8f3 0%, #fef5ee 50%, #fdf8f3 100%)",
            border: "1px solid rgba(201,150,74,0.15)",
            perspective: "1000px",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Subtle pattern */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, #3D2B1F 1px, transparent 0)`,
              backgroundSize: "24px 24px",
            }}
          />

          <div className="relative z-10">
            {/* Heading */}
            <div className="text-center mb-8">
              <h2
                className="font-display mb-2"
                style={{
                  fontWeight: 400,
                  fontSize: "clamp(1.5rem, 3vw, 2rem)",
                  lineHeight: 1.2,
                  letterSpacing: "-0.02em",
                  color: "#3D2B1F",
                }}
              >
                Get Exclusive Offers & New Launch Updates
              </h2>
              <p style={{ fontSize: "14px", color: "rgba(61,43,31,0.6)" }}>
                Be the first to know about limited drops and seasonal collections
              </p>
            </div>

            {/* Two options side by side */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto">
              {/* Email subscribe */}
              <form onSubmit={handleSubmit} className="flex items-center gap-2 flex-1 w-full sm:w-auto">
                <div className="flex items-center gap-2 flex-1 px-4 py-3 rounded-full bg-white border border-[#e5e0d8]">
                  <Mail className="w-4 h-4 text-foreground/40 shrink-0" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    className="flex-1 outline-none bg-transparent text-sm min-w-0"
                  />
                </div>
                <button
                  type="submit"
                  className="shrink-0 flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 hover:scale-105"
                  style={{ background: "#3D2B1F", color: "#FAF7F4" }}
                  aria-label="Subscribe"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Divider */}
              <span className="text-sm text-foreground/30 font-medium">or</span>

              {/* WhatsApp button */}
              <a
                href={`https://wa.me/${phoneDigits}?text=${encodeURIComponent("Hi Mohika! I'd like to join your WhatsApp updates list.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-[11px] tracking-[0.08em] uppercase font-semibold transition-all duration-300 hover:scale-105 whitespace-nowrap"
                style={{
                  background: "#25D366",
                  color: "white",
                  boxShadow: "0 4px 14px -4px rgba(37,211,102,0.4)",
                }}
              >
                <MessageCircle className="w-4 h-4" />
                Join on WhatsApp
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;
