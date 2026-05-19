import { useState } from "react";
import { Instagram, Mail, MessageCircle, ArrowRight, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Monogram, Wordmark } from "@/components/site/Logo";
import { useStoreSettings, isPlaceholderPhone } from "@/lib/settings";
import { EMAIL_RE } from "@/lib/validation";

const Footer = () => {
  const { phone, phone_display, email, instagram } = useStoreSettings();
  const [newsletterEmail, setNewsletterEmail] = useState("");

  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = newsletterEmail.trim();
    if (!EMAIL_RE.test(trimmed)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (isPlaceholderPhone(phone)) {
      toast.error("We will be in touch soon. Please contact us via Instagram for now.");
      return;
    }
    const digits = (phone || "").replace(/\D/g, "");
    const message = `Hi Mohika! I'd like to join your inner circle. My email is ${trimmed}.`;
    const href = `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
    window.open(href, "_blank", "noopener,noreferrer");
    toast.success("Opening WhatsApp. Drop your email there too if it didn't carry over.");
    setNewsletterEmail("");
  };

  const phoneDigits = (phone || "").replace(/\D/g, "");

  return (
    <footer
      className="relative overflow-hidden"
      style={{ background: "#3D2B1F", color: "#FAF7F4" }}
    >
      {/* Subtle gold gradient line at top */}
      <div
        aria-hidden
        style={{
          height: "1px",
          background:
            "linear-gradient(90deg, transparent 0%, rgba(201,150,74,0.5) 50%, transparent 100%)",
        }}
      />

      {/* Main footer content */}
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 pt-20 pb-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-10">
          {/* Brand column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-4"
          >
            <Link to="/" className="inline-flex items-center gap-2.5 mb-6">
              <Monogram size={40} tone="background" />
              <Wordmark variant="dark" />
            </Link>
            <p
              style={{
                fontSize: "14px",
                lineHeight: 1.75,
                color: "rgba(250,247,244,0.65)",
                maxWidth: "320px",
              }}
            >
              Handcrafted resin keepsakes that preserve your most cherished moments
              forever. Made one piece at a time, by hand, in India.
            </p>

            {/* Social icons */}
            <div className="mt-7 flex items-center gap-3">
              {[
                {
                  icon: MessageCircle,
                  href: `https://wa.me/${phoneDigits}`,
                  label: "WhatsApp",
                  external: true,
                },
                {
                  icon: Instagram,
                  href: `https://instagram.com/${(instagram || "mohikaart").replace(/^@/, "")}`,
                  label: "Instagram",
                  external: true,
                },
                {
                  icon: Mail,
                  href: `mailto:${email}`,
                  label: "Email",
                  external: false,
                },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.external ? "_blank" : undefined}
                  rel={s.external ? "noopener noreferrer" : undefined}
                  aria-label={s.label}
                  className="flex items-center justify-center transition-all duration-300"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "9999px",
                    border: "1px solid rgba(250,247,244,0.15)",
                    color: "rgba(250,247,244,0.7)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#C9964A";
                    e.currentTarget.style.borderColor = "#C9964A";
                    e.currentTarget.style.color = "#3D2B1F";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.borderColor = "rgba(250,247,244,0.15)";
                    e.currentTarget.style.color = "rgba(250,247,244,0.7)";
                  }}
                >
                  <s.icon strokeWidth={1.6} style={{ width: 16, height: 16 }} />
                </a>
              ))}
            </div>
          </motion.div>



          {/* Explore links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-2"
          >
            <h4
              className="font-semibold uppercase mb-5"
              style={{
                fontSize: "11px",
                letterSpacing: "0.25em",
                color: "#C9964A",
              }}
            >
              Shop
            </h4>
            <ul className="space-y-3">
              {[
                { to: "/shop", label: "All Products" },
                { to: "/categories", label: "Categories" },
                { to: "/wedding", label: "Wedding" },
                { to: "/corporate", label: "Corporate" },
                { to: "/gallery", label: "Gallery" },
              ].map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="transition-colors"
                    style={{
                      fontSize: "14px",
                      color: "rgba(250,247,244,0.65)",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "#C9964A")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "rgba(250,247,244,0.65)")
                    }
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Help links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-2"
          >
            <h4
              className="font-semibold uppercase mb-5"
              style={{
                fontSize: "11px",
                letterSpacing: "0.25em",
                color: "#C9964A",
              }}
            >
              Help
            </h4>
            <ul className="space-y-3">
              {[
                { to: "/about", label: "About" },
                { to: "/contact", label: "Contact" },
                { to: "/shipping", label: "Shipping" },
                { to: "/care-guide", label: "Care Guide" },
                { to: "/faq", label: "FAQ" },
              ].map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="transition-colors"
                    style={{
                      fontSize: "14px",
                      color: "rgba(250,247,244,0.65)",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "#C9964A")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "rgba(250,247,244,0.65)")
                    }
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>



          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.26, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-4"
          >
            <h4
              className="font-semibold uppercase mb-5"
              style={{
                fontSize: "11px",
                letterSpacing: "0.25em",
                color: "#C9964A",
              }}
            >
              Inner Circle
            </h4>
            <p
              className="font-display mb-3"
              style={{
                fontSize: "20px",
                fontWeight: 400,
                lineHeight: 1.25,
                letterSpacing: "-0.01em",
                color: "#FAF7F4",
              }}
            >
              Drop alerts, behind the scenes,{" "}
              <em
                style={{
                  fontFamily: "var(--font-serif)",
                  fontStyle: "italic",
                  color: "#C9964A",
                }}
              >
                a quiet welcome.
              </em>
            </p>
            <p
              className="mb-5"
              style={{
                fontSize: "13px",
                lineHeight: 1.7,
                color: "rgba(250,247,244,0.55)",
              }}
            >
              Join our list to be the first to know about limited drops and seasonal
              collections.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex items-center gap-2">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="you@email.com"
                aria-label="Email address"
                className="flex-1 min-w-0 transition-colors"
                style={{
                  height: "44px",
                  paddingLeft: "18px",
                  paddingRight: "18px",
                  borderRadius: "9999px",
                  background: "rgba(250,247,244,0.06)",
                  border: "1px solid rgba(250,247,244,0.12)",
                  fontSize: "14px",
                  color: "#FAF7F4",
                  outline: "none",
                }}
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(201,150,74,0.6)")
                }
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(250,247,244,0.12)")
                }
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="shrink-0 flex items-center justify-center transition-all duration-300"
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "9999px",
                  background: "#C9964A",
                  color: "#3D2B1F",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#FAF7F4";
                  e.currentTarget.style.transform = "translateX(2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#C9964A";
                  e.currentTarget.style.transform = "translateX(0)";
                }}
              >
                <ArrowRight strokeWidth={2} style={{ width: 16, height: 16 }} />
              </button>
            </form>

            {/* Contact info */}
            <div className="mt-7 space-y-2.5">
              <a
                href={`https://wa.me/${phoneDigits}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 transition-colors"
                style={{
                  fontSize: "13px",
                  color: "rgba(250,247,244,0.6)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#C9964A")}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "rgba(250,247,244,0.6)")
                }
              >
                <MessageCircle strokeWidth={1.6} style={{ width: 14, height: 14, color: "#C9964A" }} />
                {phone_display || "+91 98765 43210"}
              </a>
              <div
                className="flex items-center gap-2.5"
                style={{
                  fontSize: "13px",
                  color: "rgba(250,247,244,0.6)",
                }}
              >
                <MapPin strokeWidth={1.6} style={{ width: 14, height: 14, color: "#C9964A" }} />
                Made in India · Ships nationwide
              </div>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div
          className="mt-16 mb-6"
          style={{
            height: "1px",
            background: "rgba(250,247,244,0.08)",
          }}
        />

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div
            style={{
              fontSize: "12px",
              color: "rgba(250,247,244,0.4)",
              letterSpacing: "0.02em",
            }}
          >
            © {new Date().getFullYear()} Mohika Art. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link
              to="/shipping"
              className="transition-colors"
              style={{
                fontSize: "12px",
                color: "rgba(250,247,244,0.4)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#C9964A")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "rgba(250,247,244,0.4)")
              }
            >
              Shipping
            </Link>
            <Link
              to="/faq"
              className="transition-colors"
              style={{
                fontSize: "12px",
                color: "rgba(250,247,244,0.4)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#C9964A")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "rgba(250,247,244,0.4)")
              }
            >
              FAQ
            </Link>
            <Link
              to="/care-guide"
              className="transition-colors"
              style={{
                fontSize: "12px",
                color: "rgba(250,247,244,0.4)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#C9964A")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "rgba(250,247,244,0.4)")
              }
            >
              Care Guide
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
