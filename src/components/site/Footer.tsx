import { Instagram, Mail, MessageCircle, MapPin, Phone, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useStoreSettings } from "@/lib/settings";

const EASE = [0.22, 1, 0.36, 1] as const;

const Footer = () => {
  const { phone, phone_display, email, instagram } = useStoreSettings();
  const phoneDigits = (phone || "").replace(/\D/g, "");

  return (
    <footer style={{ background: "#1a1208", color: "#fdf9f0" }}>
      {/* Gold line */}
      <div aria-hidden style={{ height: "1px", background: "linear-gradient(90deg, transparent, #c9a84c, transparent)" }} />

      {/* Main content */}
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-10 lg:gap-8">

          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE }}
            className="col-span-2 md:col-span-4"
          >
            <Link to="/" className="inline-block mb-5">
              <h3 className="font-serif text-2xl italic" style={{ color: "#c9a84c", fontWeight: 400 }}>
                Mohika Art
              </h3>
            </Link>
            <p className="text-[13px] leading-relaxed mb-6" style={{ color: "rgba(253,249,240,0.5)", maxWidth: 280 }}>
              Handcrafted resin keepsakes that preserve your most cherished moments. Every piece poured with love.
            </p>
            {/* Social */}
            <div className="flex items-center gap-2.5">
              {[
                { icon: Instagram, href: `https://instagram.com/${(instagram || "mohikaart").replace(/^@/, "")}`, label: "Instagram" },
                { icon: MessageCircle, href: `https://wa.me/${phoneDigits}`, label: "WhatsApp" },
                { icon: Mail, href: `mailto:${email || "hello@mohikaart.com"}`, label: "Email" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-[#c9a84c] hover:text-[#1a1208]"
                  style={{ background: "rgba(253,249,240,0.06)", color: "rgba(253,249,240,0.5)" }}
                >
                  <s.icon className="w-4 h-4" strokeWidth={1.6} />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Shop */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.08, ease: EASE }}
            className="col-span-1 md:col-span-2"
          >
            <h4 className="text-[10px] uppercase tracking-[0.2em] font-semibold mb-4" style={{ color: "#c9a84c" }}>Shop</h4>
            <ul className="space-y-2.5">
              {[
                { to: "/shop", label: "All Products" },
                { to: "/category/name-keychains", label: "Keychains" },
                { to: "/category/photo-frames", label: "Frames" },
                { to: "/category/wedding-keepsakes", label: "Wedding" },
                { to: "/category/resin-trays", label: "Trays" },
              ].map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-[13px] transition-colors duration-200 hover:text-[#c9a84c]" style={{ color: "rgba(253,249,240,0.5)" }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.14, ease: EASE }}
            className="col-span-1 md:col-span-2"
          >
            <h4 className="text-[10px] uppercase tracking-[0.2em] font-semibold mb-4" style={{ color: "#c9a84c" }}>Company</h4>
            <ul className="space-y-2.5">
              {[
                { to: "/about", label: "About Us" },
                { to: "/gallery", label: "Gallery" },
                { to: "/custom-order", label: "Custom Order" },
                { to: "/contact", label: "Contact" },
                { to: "/faq", label: "FAQ" },
              ].map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-[13px] transition-colors duration-200 hover:text-[#c9a84c]" style={{ color: "rgba(253,249,240,0.5)" }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
            className="col-span-2 md:col-span-4"
          >
            <h4 className="text-[10px] uppercase tracking-[0.2em] font-semibold mb-4" style={{ color: "#c9a84c" }}>Get In Touch</h4>
            <div className="space-y-3">
              <a
                href={`https://wa.me/${phoneDigits}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-[13px] transition-colors hover:text-[#c9a84c]"
                style={{ color: "rgba(253,249,240,0.5)" }}
              >
                <Phone className="w-3.5 h-3.5" style={{ color: "#c9a84c" }} />
                {phone_display || "+91 99999 99999"}
              </a>
              <a
                href={`mailto:${email || "hello@mohikaart.com"}`}
                className="flex items-center gap-2.5 text-[13px] transition-colors hover:text-[#c9a84c]"
                style={{ color: "rgba(253,249,240,0.5)" }}
              >
                <Mail className="w-3.5 h-3.5" style={{ color: "#c9a84c" }} />
                {email || "hello@mohikaart.com"}
              </a>
              <div className="flex items-center gap-2.5 text-[13px]" style={{ color: "rgba(253,249,240,0.5)" }}>
                <MapPin className="w-3.5 h-3.5" style={{ color: "#c9a84c" }} />
                Made in India · Ships Nationwide
              </div>
            </div>

            {/* Mini CTA */}
            <Link
              to="/custom-order"
              className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-full text-[10px] tracking-[0.1em] uppercase font-semibold transition-all duration-300 hover:scale-105"
              style={{ background: "#c9a84c", color: "#1a1208" }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Custom Order
              <ArrowRight className="w-3 h-3" />
            </Link>
          </motion.div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6" style={{ borderTop: "1px solid rgba(253,249,240,0.06)" }}>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-[11px]" style={{ color: "rgba(253,249,240,0.3)" }}>
              © 2024 Mohika Art. All rights reserved.
            </p>
            <div className="flex items-center gap-5">
              {[
                { to: "/shipping", label: "Shipping" },
                { to: "/care-guide", label: "Care Guide" },
                { to: "/faq", label: "FAQ" },
              ].map((l) => (
                <Link key={l.label} to={l.to} className="text-[11px] transition-colors duration-200 hover:text-[#c9a84c]" style={{ color: "rgba(253,249,240,0.3)" }}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
