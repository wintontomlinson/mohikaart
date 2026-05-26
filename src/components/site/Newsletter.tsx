import { motion, useScroll, useTransform } from "framer-motion";
import { Mail, MessageCircle, ArrowRight } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { useStoreSettings, isPlaceholderPhone } from "@/lib/settings";
import { LUXURY_EASE, Magnetic } from "@/lib/animations";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const { phone } = useStoreSettings();
  const phoneDigits = (phone || "").replace(/\D/g, "");
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 0.4], [0.92, 1]);
  const rotateX = useTransform(scrollYProgress, [0, 0.4], [5, 0]);

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
    <section ref={sectionRef} className="py-16 md:py-20" style={{ perspective: "1200px" }}>
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
        <motion.div
          style={{ scale, rotateX }}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: LUXURY_EASE }}
          className="relative overflow-hidden rounded-3xl px-6 py-12 md:px-12 md:py-14"
        >
          <div
            className="absolute inset-0 rounded-3xl"
            style={{
              background: "linear-gradient(135deg, #fdf8f3 0%, #fef5ee 50%, #fdf8f3 100%)",
              border: "1px solid rgba(201,150,74,0.15)",
              boxShadow: "0 20px 60px -20px rgba(26,18,8,0.08)",
            }}
          />
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
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: 20, rotateX: 8 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1, ease: LUXURY_EASE }}
              style={{ perspective: "800px" }}
            >
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
            </motion.div>

            {/* Two options side by side */}
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto"
              initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.25, ease: LUXURY_EASE }}
            >
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
              <Magnetic strength={0.15}>
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
              </Magnetic>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;
