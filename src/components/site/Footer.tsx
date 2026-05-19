import { useState } from "react";
import { Instagram, Mail, MessageCircle, Heart, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
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
      toast.error("We will be in touch soon - please contact us via Instagram for now.");
      return;
    }
    const digits = (phone || "").replace(/\D/g, "");
    const message = `Hi Mohika! I'd like to join your inner circle - my email is ${trimmed}.`;
    const href = `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
    window.open(href, "_blank", "noopener,noreferrer");
    toast.success("Opening WhatsApp - drop your email there too if it didn't carry over.");
    setNewsletterEmail("");
  };

  return (
    <footer className="bg-foreground text-background">
      <div className="container py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 items-start">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <Monogram size={32} tone="background" />
              <Wordmark variant="dark" />
            </div>
            <p className="text-[12px] text-background/45 leading-relaxed max-w-[220px]">
              Handcrafted resin keepsakes that preserve your precious moments forever.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <p className="text-[9px] uppercase tracking-[0.25em] text-gold/70 mb-3 font-semibold">Explore</p>
            <ul className="space-y-2">
              {[
                { to: "/shop", label: "Shop" },
                { to: "/categories", label: "Categories" },
                { to: "/about", label: "About" },
                { to: "/contact", label: "Contact" },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-[12px] text-background/45 hover:text-background transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <p className="text-[9px] uppercase tracking-[0.25em] text-gold/70 mb-3 font-semibold">Help</p>
            <ul className="space-y-2">
              {[
                { to: "/shipping", label: "Shipping" },
                { to: "/care-guide", label: "Care Guide" },
                { to: "/faq", label: "FAQ" },
                { to: "/wedding", label: "Wedding" },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-[12px] text-background/45 hover:text-background transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter (sits to the LEFT of Contact on lg+).
              Real WhatsApp opt-in: tapping the arrow opens wa.me with a
              prefilled message containing the typed email so Mohika can
              follow up manually. The submit short-circuits with a soft
              Instagram fallback when the store phone is still the
              placeholder so unconfigured deployments never open chats to
              `919999999999`. */}
          <div className="col-span-2 md:col-span-2 lg:col-span-1">
            <p className="text-[9px] uppercase tracking-[0.25em] text-gold/70 mb-3 font-semibold">Newsletter</p>
            <p className="font-display text-base text-background/85 leading-snug mb-1.5">Join the inner circle</p>
            <p className="text-[12px] text-background/45 leading-relaxed mb-3 max-w-[260px]">
              Drop your email - we will send drop alerts and the occasional welcome surprise on WhatsApp.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex items-center gap-2">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="you@example.com"
                aria-label="Email address"
                className="flex-1 min-w-0 px-3 py-2 rounded-full bg-background/[0.06] border border-background/[0.12] text-[12px] text-background placeholder:text-background/30 focus:outline-none focus:border-gold/60 transition-colors"
              />
              <button
                type="submit"
                aria-label="Continue on WhatsApp"
                className="shrink-0 w-9 h-9 rounded-full bg-gold/80 hover:bg-gold text-foreground flex items-center justify-center transition-colors"
              >
                <ArrowRight className="w-4 h-4" strokeWidth={1.8} />
              </button>
            </form>
          </div>

          {/* Contact */}
          <div>
            <p className="text-[9px] uppercase tracking-[0.25em] text-gold/70 mb-3 font-semibold">Contact</p>
            <ul className="space-y-2.5">
              <li>
                <a href={`https://wa.me/${encodeURIComponent((phone || "").replace(/\D/g, ""))}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[12px] text-background/45 hover:text-background transition-colors">
                  <MessageCircle className="w-3.5 h-3.5 text-gold/60" />
                  {phone_display || "+91 98765 43210"}
                </a>
              </li>
              <li>
                <a href={`https://instagram.com/${instagram}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[12px] text-background/45 hover:text-background transition-colors">
                  <Instagram className="w-3.5 h-3.5 text-gold/60" />
                  @{instagram || "mohikaart"}
                </a>
              </li>
              <li>
                <a href={`mailto:${email}`} className="flex items-center gap-2 text-[12px] text-background/45 hover:text-background transition-colors">
                  <Mail className="w-3.5 h-3.5 text-gold/60" />
                  {email || "hello@mohikaart.com"}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-5 border-t border-background/[0.08] flex flex-col sm:flex-row justify-between items-center gap-2 text-[10px] text-background/25">
          <div className="flex items-center gap-1">
            © {new Date().getFullYear()} Mohika Art. Made with
            <Heart className="w-2.5 h-2.5 text-gold/40 fill-gold/25" />
            in India.
          </div>
          <div>Ships Pan India</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
