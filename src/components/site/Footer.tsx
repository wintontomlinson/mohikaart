import { Instagram, Mail, MessageCircle, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import mark from "@/assets/mohika-mark.png";
import { useStoreSettings } from "@/lib/settings";

const Footer = () => {
  const { phone, phone_display, email, instagram } = useStoreSettings();
  return (
    <footer className="bg-foreground text-background">
      <div className="container py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-start">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-lg bg-background/[0.08] flex items-center justify-center p-1.5">
                <img src={mark} alt="Mohika Art" className="w-full h-full object-contain" />
              </div>
              <div className="font-display text-xl text-gold-grad" style={{ fontWeight: 300 }}>
                Mohika <span className="italic">Art</span>
              </div>
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
