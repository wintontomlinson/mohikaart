import { Instagram, Mail, MessageCircle, ArrowRight, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Monogram, Wordmark } from "@/components/site/Logo";
import { useStoreSettings } from "@/lib/settings";

const Footer = () => {
  const { phone, email, instagram } = useStoreSettings();
  const phoneDigits = (phone || "").replace(/\D/g, "");

  const quickLinks = [
    { to: "/", label: "Home" },
    { to: "/shop", label: "Shop" },
    { to: "/about", label: "About" },
    { to: "/gallery", label: "Gallery" },
    { to: "/contact", label: "Contact" },
  ];

  const policyLinks = [
    { to: "/shipping", label: "Shipping Policy" },
    { to: "/shipping", label: "Return Policy" },
    { to: "/faq", label: "FAQ" },
    { to: "/care-guide", label: "Care Guide" },
  ];

  const socials = [
    {
      icon: Instagram,
      href: `https://instagram.com/${(instagram || "mohikaart").replace(/^@/, "")}`,
      label: "Instagram",
    },
    {
      icon: MessageCircle,
      href: `https://wa.me/${phoneDigits}`,
      label: "WhatsApp",
    },
    {
      icon: Mail,
      href: `mailto:${email}`,
      label: "Email",
    },
  ];

  return (
    <footer
      className="relative overflow-hidden"
      style={{ background: "#2d2d2d", color: "#FAF7F4" }}
    >
      {/* Gold gradient line at top */}
      <div
        aria-hidden
        style={{
          height: "1px",
          background: "linear-gradient(90deg, transparent 0%, rgba(201,150,74,0.5) 50%, transparent 100%)",
        }}
      />

      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 pt-16 pb-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link to="/" className="inline-flex items-center gap-2.5 mb-5">
              <Monogram size={36} tone="background" />
              <Wordmark variant="dark" />
            </Link>
            <p style={{ fontSize: "14px", lineHeight: 1.7, color: "rgba(250,247,244,0.6)", maxWidth: "280px" }}>
              Handcrafted resin keepsakes that preserve your most cherished moments. Made with love in India.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <h4
              className="font-semibold uppercase mb-5"
              style={{ fontSize: "11px", letterSpacing: "0.25em", color: "#C9964A" }}
            >
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    className="text-sm transition-colors duration-300 hover:text-[#C9964A]"
                    style={{ color: "rgba(250,247,244,0.6)" }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Policies */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            <h4
              className="font-semibold uppercase mb-5"
              style={{ fontSize: "11px", letterSpacing: "0.25em", color: "#C9964A" }}
            >
              Policies
            </h4>
            <ul className="space-y-3">
              {policyLinks.map((l, i) => (
                <li key={`${l.label}-${i}`}>
                  <Link
                    to={l.to}
                    className="text-sm transition-colors duration-300 hover:text-[#C9964A]"
                    style={{ color: "rgba(250,247,244,0.6)" }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Connect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.26, ease: [0.22, 1, 0.36, 1] }}
          >
            <h4
              className="font-semibold uppercase mb-5"
              style={{ fontSize: "11px", letterSpacing: "0.25em", color: "#C9964A" }}
            >
              Connect
            </h4>
            <div className="flex items-center gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex items-center justify-center w-10 h-10 rounded-full border transition-all duration-300 hover:bg-[#C9964A] hover:border-[#C9964A] hover:text-[#2d2d2d]"
                  style={{ borderColor: "rgba(250,247,244,0.15)", color: "rgba(250,247,244,0.7)" }}
                >
                  <s.icon className="w-4 h-4" strokeWidth={1.6} />
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="mt-12 mb-6" style={{ height: "1px", background: "rgba(250,247,244,0.08)" }} />

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-3">
          <p style={{ fontSize: "12px", color: "rgba(250,247,244,0.4)" }}>
            © 2024 Mohika Art. Made with{" "}
            <Heart className="inline w-3 h-3 text-red-400" style={{ fill: "currentColor" }} />{" "}
            in India
          </p>
          <div className="flex items-center gap-5">
            <Link to="/shipping" className="text-xs transition-colors duration-300 hover:text-[#C9964A]" style={{ color: "rgba(250,247,244,0.4)" }}>
              Shipping
            </Link>
            <Link to="/faq" className="text-xs transition-colors duration-300 hover:text-[#C9964A]" style={{ color: "rgba(250,247,244,0.4)" }}>
              FAQ
            </Link>
            <Link to="/care-guide" className="text-xs transition-colors duration-300 hover:text-[#C9964A]" style={{ color: "rgba(250,247,244,0.4)" }}>
              Care Guide
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
