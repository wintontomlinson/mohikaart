import { Instagram, Mail, MessageCircle, MapPin, ArrowUpRight, Heart, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import mark from "@/assets/mohika-mark.png";
import { useStoreSettings } from "@/lib/settings";

const Footer = () => {
  const { phone, phone_display, email, instagram } = useStoreSettings();
  return (
  <footer className="relative bg-foreground text-background overflow-hidden">

    {/* Ambient glows */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80rem] h-[28rem] rounded-full bg-gold/[0.05] blur-[120px] pointer-events-none" />
    <div className="absolute bottom-0 right-0 w-[32rem] h-[20rem] rounded-full bg-blush/[0.04] blur-[90px] pointer-events-none" />
    <div className="absolute bottom-0 left-0 w-[20rem] h-[14rem] rounded-full bg-gold/[0.03] blur-[80px] pointer-events-none" />

    <div className="container relative">

      {/* ── CTA Banner ─────────────────────────────────────────── */}
      <div className="pt-16 pb-14 border-b border-background/[0.08]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="max-w-lg">
            <p className="text-[9px] uppercase tracking-[0.4em] text-gold/80 mb-3 font-medium">Ready to create?</p>
            <h2
              className="font-display leading-[1.15] text-background"
              style={{ fontWeight: 300, fontSize: "clamp(1.75rem, 3.5vw, 2.6rem)" }}
            >
              Let's make something{" "}
              <span className="italic text-gold-grad">beautiful</span>{" "}
              together.
            </h2>
          </div>
          <Link
            to="/contact"
            className="group shrink-0 inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-background text-foreground text-[10px] tracking-[0.2em] uppercase font-semibold hover:bg-gold/90 hover:text-background transition-all duration-500"
          >
            Start Custom Order
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
          </Link>
        </div>
      </div>

      {/* ── Main grid ──────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-12 gap-x-8 gap-y-12 pt-14 pb-12">

        {/* Brand col */}
        <div className="col-span-2 md:col-span-5">
          {/* Logo */}
          <div className="flex items-center gap-3.5 mb-6">
            <div className="w-12 h-12 rounded-xl bg-background/[0.08] border border-background/10 flex items-center justify-center p-2 shrink-0">
              <img src={mark} alt="Mohika Art" loading="lazy" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="font-display text-[1.9rem] text-gold-grad leading-none" style={{ fontWeight: 300 }}>
                Mohika <span className="italic">Art</span>
              </div>
              <p className="text-background/40 text-[8.5px] uppercase tracking-[0.38em] mt-1.5">Customized Resin Crafts</p>
            </div>
          </div>

          {/* Tagline */}
          <p className="font-serif text-[1.08rem] leading-[1.8] text-background/55 italic max-w-[24rem] mb-8">
            Crafting timeless keepsakes that hold the moments closest to your heart.
          </p>

          {/* Social icons */}
          <div className="flex items-center gap-2.5">
            {[
              { href: `https://instagram.com/${instagram}`, Icon: Instagram, label: "Instagram" },
              { href: `https://wa.me/${phone}`,             Icon: MessageCircle, label: "WhatsApp" },
              { href: `mailto:${email}`,                    Icon: Mail, label: "Email" },
            ].map(({ href, Icon, label }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                aria-label={label}
                className="group w-9 h-9 rounded-full border border-background/15 flex items-center justify-center text-background/45 hover:text-gold hover:border-gold/40 hover:bg-gold/[0.08] transition-all duration-300"
              >
                <Icon className="w-[14px] h-[14px]" />
              </a>
            ))}
          </div>
        </div>

        {/* Explore */}
        <div className="col-span-1 md:col-span-2 md:col-start-7">
          <p className="text-[8.5px] uppercase tracking-[0.32em] text-gold/75 mb-5 font-semibold">Explore</p>
          <ul className="space-y-3.5">
            {[
              { to: "/about",      label: "Our Story" },
              { to: "/shop",       label: "Shop All" },
              { to: "/categories", label: "Categories" },
              { to: "/gallery",    label: "Gallery" },
              { to: "/contact",    label: "Contact" },
            ].map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="group inline-flex items-center gap-1 text-[12.5px] text-background/50 hover:text-background transition-colors duration-200"
                >
                  <span className="group-hover:translate-x-0.5 transition-transform duration-200">{l.label}</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-40 transition-opacity duration-200" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div className="col-span-1 md:col-span-2">
          <p className="text-[8.5px] uppercase tracking-[0.32em] text-gold/75 mb-5 font-semibold">Services</p>
          <ul className="space-y-3.5">
            {[
              { to: "/wedding",    label: "Wedding" },
              { to: "/corporate",  label: "Corporate" },
              { to: "/care-guide", label: "Care Guide" },
              { to: "/faq",        label: "FAQ" },
              { to: "/shipping",   label: "Shipping" },
            ].map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="group inline-flex items-center gap-1 text-[12.5px] text-background/50 hover:text-background transition-colors duration-200"
                >
                  <span className="group-hover:translate-x-0.5 transition-transform duration-200">{l.label}</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-40 transition-opacity duration-200" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="col-span-2 md:col-span-3">
          <p className="text-[8.5px] uppercase tracking-[0.32em] text-gold/75 mb-5 font-semibold">Get in Touch</p>
          <ul className="space-y-4">
            {[
              {
                href: `https://wa.me/${phone}`,
                Icon: MessageCircle,
                text: phone_display,
                label: "WhatsApp",
              },
              {
                href: `https://instagram.com/${instagram}`,
                Icon: Instagram,
                text: `@${instagram}`,
                external: true,
                label: "Instagram",
              },
              {
                href: `mailto:${email}`,
                Icon: Mail,
                text: email,
                label: "Email",
              },
            ].map(({ href, Icon, text, external, label }) => (
              <li key={text}>
                <a
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="group flex items-center gap-3 text-[12.5px] text-background/50 hover:text-background transition-colors duration-200"
                >
                  <span className="w-7 h-7 rounded-lg bg-background/[0.06] border border-background/[0.08] flex items-center justify-center shrink-0 group-hover:bg-gold/[0.12] group-hover:border-gold/25 transition-all duration-300">
                    <Icon className="w-[13px] h-[13px] text-gold/60 group-hover:text-gold/90" />
                  </span>
                  {text}
                </a>
              </li>
            ))}
            <li className="flex items-center gap-3 text-[12.5px] text-background/40">
              <span className="w-7 h-7 rounded-lg bg-background/[0.06] border border-background/[0.08] flex items-center justify-center shrink-0">
                <MapPin className="w-[13px] h-[13px] text-gold/50" />
              </span>
              India · Ships Nationwide
            </li>
          </ul>
        </div>
      </div>

      {/* ── Bottom bar ─────────────────────────────────────────── */}
      <div className="gold-divider" />
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 py-5 text-[10.5px] text-background/30">
        <div className="flex items-center gap-1.5">
          © {new Date().getFullYear()} Mohika Art. Made with
          <Heart className="w-2.5 h-2.5 text-gold/50 fill-gold/35 mx-0.5" />
          in India.
        </div>
        <div className="flex items-center gap-6">
          {[
            { to: "/care-guide", label: "Care Guide" },
            { to: "/shipping",   label: "Shipping" },
            { to: "/faq",        label: "FAQ" },
          ].map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="hover:text-background/60 transition-colors duration-200"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>

    </div>
  </footer>
  );
};

export default Footer;
