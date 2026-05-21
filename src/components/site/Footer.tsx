import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Instagram, MessageCircle, Mail, ArrowRight, Heart } from "lucide-react";
import { toast } from "sonner";
import { useStoreSettings } from "@/lib/settings";
import { Monogram, Wordmark } from "@/components/site/Logo";

const EASE = [0.22, 1, 0.36, 1] as const;

const Footer = () => {
  const { phone, phone_display, email, instagram } = useStoreSettings();
  const phoneDigits = (phone || "").replace(/\D/g, "");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim() || !newsletterEmail.includes("@")) {
      toast.error("Please enter a valid email");
      return;
    }
    setSubscribed(true);
    setNewsletterEmail("");
    toast.success("Subscribed! 🎉");
  };

  const exploreLinks = [
    { to: "/", label: "Home" },
    { to: "/shop", label: "Shop Collection" },
    { to: "/custom-order", label: "Custom Order" },
    { to: "/about", label: "About Us" },
    { to: "/gallery", label: "Gallery" },
    { to: "/contact", label: "Contact Us" },
  ];

  const categoryLinks = [
    { to: "/shop?category=keychain", label: "Name Keychains" },
    { to: "/shop?category=frame", label: "Photo Frames" },
    { to: "/shop?category=wedding", label: "Wedding Keepsakes" },
    { to: "/shop?category=tray", label: "Resin Trays" },
    { to: "/shop?category=coaster", label: "Coaster Sets" },
    { to: "/shop?category=bookmark", label: "Bookmarks" },
    { to: "/shop?category=hamper", label: "Gift Hampers" },
  ];

  const helpLinks = [
    { to: "/shipping", label: "Shipping Policy" },
    { to: "/shipping", label: "Return Policy" },
    { to: "/shipping", label: "Privacy Policy" },
    { to: "/faq", label: "FAQ" },
    { to: "/contact", label: "Track My Order" },
  ];

  const socials = [
    { icon: Instagram, href: `https://instagram.com/${(instagram || "mohikaart").replace(/^@/, "")}`, label: "Instagram" },
    { icon: MessageCircle, href: `https://wa.me/${phoneDigits}`, label: "WhatsApp" },
    { icon: Mail, href: `mailto:${email || "hello@mohikaart.com"}`, label: "Email" },
  ];

  return (
    <footer style={{ background: "#1a1208", color: "#fdf9f0" }}>
      {/* Gold line top */}
      <div aria-hidden style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(201,150,74,0.4), transparent)" }} />

      {/* ━━ TOP SECTION — 4 COLUMNS ━━ */}
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* Column 1: Brand */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <Monogram size={32} tone="background" />
              <Wordmark variant="dark" />
            </Link>
            <p className="font-serif italic text-sm mb-3" style={{ color: "rgba(253,249,240,0.65)" }}>
              Turning memories into timeless art.
            </p>
            <p className="text-[12px] leading-relaxed mb-5" style={{ color: "rgba(253,249,240,0.45)", maxWidth: 260 }}>
              Premium handcrafted resin keepsakes, personalized for every occasion. Pan India delivery.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-2.5">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 hover:bg-[#c9a84c] hover:border-[#c9a84c] hover:text-[#1a1208] hover:scale-110"
                  style={{ borderColor: "rgba(201,150,74,0.25)", color: "rgba(253,249,240,0.6)" }}
                >
                  <s.icon className="w-4 h-4" strokeWidth={1.6} />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Column 2: Explore */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.08, ease: EASE }}
          >
            <h4 className="text-[10px] uppercase tracking-[0.22em] font-semibold mb-5" style={{ color: "#c9a84c" }}>
              Explore
            </h4>
            <ul className="space-y-2.5">
              {exploreLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    className="text-[13px] transition-all duration-200 hover:text-[#c9a84c] hover:translate-x-1 inline-block"
                    style={{ color: "rgba(253,249,240,0.6)" }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 3: Categories */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.14, ease: EASE }}
          >
            <h4 className="text-[10px] uppercase tracking-[0.22em] font-semibold mb-5" style={{ color: "#c9a84c" }}>
              Categories
            </h4>
            <ul className="space-y-2.5">
              {categoryLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    className="text-[13px] transition-all duration-200 hover:text-[#c9a84c] hover:translate-x-1 inline-block"
                    style={{ color: "rgba(253,249,240,0.6)" }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 4: Help & Connect */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
          >
            <h4 className="text-[10px] uppercase tracking-[0.22em] font-semibold mb-5" style={{ color: "#c9a84c" }}>
              Help
            </h4>
            <ul className="space-y-2.5 mb-6">
              {helpLinks.map((l, i) => (
                <li key={`${l.label}-${i}`}>
                  <Link
                    to={l.to}
                    className="text-[13px] transition-all duration-200 hover:text-[#c9a84c] hover:translate-x-1 inline-block"
                    style={{ color: "rgba(253,249,240,0.6)" }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            {/* Action buttons */}
            <div className="space-y-2.5">
              <a
                href={`https://wa.me/${phoneDigits}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] uppercase tracking-wider font-semibold transition-all duration-300 hover:scale-105"
                style={{ background: "#25D366", color: "#fff" }}
              >
                <MessageCircle className="w-3.5 h-3.5" /> WhatsApp Us
              </a>
              <br />
              <a
                href={`mailto:${email || "hello@mohikaart.com"}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] uppercase tracking-wider font-semibold border transition-all duration-300 hover:bg-[#c9a84c] hover:border-[#c9a84c] hover:text-[#1a1208]"
                style={{ borderColor: "rgba(201,150,74,0.25)", color: "rgba(253,249,240,0.6)" }}
              >
                <Mail className="w-3.5 h-3.5" /> Email Us
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ━━ MIDDLE — NEWSLETTER STRIP ━━ */}
      <div style={{ background: "rgba(201,150,74,0.06)" }}>
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium" style={{ color: "rgba(253,249,240,0.85)" }}>
                Get exclusive offers & new launches
              </p>
              <p className="text-[11px] mt-0.5" style={{ color: "rgba(253,249,240,0.4)" }}>
                Join 2000+ happy customers ✦
              </p>
            </div>
            {subscribed ? (
              <p className="text-sm font-medium" style={{ color: "#c9a84c" }}>Subscribed! 🎉</p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex items-center gap-2">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="px-4 py-2.5 rounded-full text-sm outline-none transition-colors"
                  style={{ background: "rgba(253,249,240,0.06)", border: "1px solid rgba(201,150,74,0.15)", color: "#fdf9f0", minWidth: 200 }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(201,150,74,0.5)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(201,150,74,0.15)"; }}
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-full text-[10px] uppercase tracking-wider font-semibold transition-all duration-300 hover:scale-105"
                  style={{ background: "#c9a84c", color: "#1a1208" }}
                >
                  Subscribe <ArrowRight className="w-3 h-3 inline ml-1" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* ━━ BOTTOM BAR ━━ */}
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-5">
        <div style={{ height: "1px", background: "rgba(201,150,74,0.08)", marginBottom: "1.25rem" }} />
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
          <p style={{ fontSize: "0.72rem", color: "rgba(253,249,240,0.4)" }}>
            © 2025 Mohika Art. Made with{" "}
            <Heart className="inline w-3 h-3" style={{ color: "#c9a84c", fill: "#c9a84c" }} />{" "}
            in India
          </p>
          <div className="flex items-center gap-4">
            {["Privacy Policy", "Return Policy", "Terms"].map((t) => (
              <Link
                key={t}
                to="/shipping"
                style={{ fontSize: "0.72rem", color: "rgba(253,249,240,0.4)" }}
                className="transition-colors hover:text-[#c9a84c]"
              >
                {t}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
