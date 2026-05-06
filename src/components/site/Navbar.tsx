import { useEffect, useRef, useState } from "react";
import { Menu, X, ShoppingBag, ChevronDown, Heart, Briefcase, BookOpen, HelpCircle, Truck, ArrowRight, Sparkles } from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/cart";
import logo from "@/assets/mohika-logo.png";

const links = [
  { to: "/",        label: "Home" },
  { to: "/shop",    label: "Shop" },
  { to: "/about",   label: "About" },
  { to: "/gallery", label: "Gallery" },
  { to: "/contact", label: "Contact" },
];

const moreLinks = [
  { to: "/wedding",    label: "Wedding",    icon: Heart,      desc: "Bridal bouquet preservation" },
  { to: "/corporate",  label: "Corporate",  icon: Briefcase,  desc: "Bulk & branded gifts" },
  { to: "/care-guide", label: "Care Guide", icon: BookOpen,   desc: "Keep your piece timeless" },
  { to: "/faq",        label: "FAQ",        icon: HelpCircle, desc: "Common questions answered" },
  { to: "/shipping",   label: "Shipping",   icon: Truck,      desc: "Delivery & returns" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const { count, setOpen: setCartOpen } = useCart();
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setMoreOpen(false);
    setMobileMoreOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    if (moreOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [moreOpen]);

  const isMoreActive = moreLinks.some((l) => pathname === l.to);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 inset-x-0 z-50"
    >
      {/* Announcement bar */}
      <AnimatePresence>
        {!scrolled && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
            style={{
              background: "linear-gradient(90deg, hsl(34 58% 52%), hsl(28 65% 55%), hsl(34 58% 52%))",
            }}
          >
            <div className="flex items-center justify-center gap-2 py-[7px] px-4">
              <Sparkles className="w-2.5 h-2.5 text-white/80 shrink-0" />
              <span style={{ fontSize: "10px", letterSpacing: "0.18em", color: "white", fontWeight: 500 }}>
                FREE SHIPPING on orders above ₹499 · Handcrafted with Love
              </span>
              <Sparkles className="w-2.5 h-2.5 text-white/80 shrink-0" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main nav bar */}
      <div
        className="transition-all duration-500"
        style={{
          background: scrolled ? "hsl(36 42% 99%/0.96)" : "hsl(36 42% 99%/0.82)",
          backdropFilter: "blur(20px) saturate(160%)",
          WebkitBackdropFilter: "blur(20px) saturate(160%)",
          boxShadow: scrolled
            ? "0 1px 0 hsl(34 30% 86%/0.8), 0 4px 24px -4px hsl(22 22% 22%/0.08)"
            : "0 1px 0 hsl(34 30% 88%/0.4)",
        }}
      >
        <nav className="max-w-[1320px] mx-auto px-5 md:px-10 flex items-center justify-between h-[64px] md:h-[72px]">

          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0 group">
            <img
              src={logo}
              alt="Mohika Art"
              className="h-[38px] md:h-[46px] w-auto object-contain transition-transform duration-300 group-hover:scale-[1.03]"
            />
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden lg:flex items-center gap-0.5">
            {links.map((l) => {
              const isActive = l.to === "/" ? pathname === "/" : pathname.startsWith(l.to);
              return (
                <li key={l.to}>
                  <NavLink
                    to={l.to}
                    end={l.to === "/"}
                    className={`relative px-4 py-2.5 text-[11.5px] tracking-[0.08em] uppercase font-medium transition-all duration-200 rounded-lg inline-block ${
                      isActive ? "text-foreground" : "text-foreground/50 hover:text-foreground"
                    }`}
                  >
                    {l.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-indicator"
                        className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-[2px] rounded-full"
                        style={{ background: "hsl(34 58% 52%)" }}
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </NavLink>
                </li>
              );
            })}

            {/* More dropdown */}
            <li className="relative" ref={moreRef}>
              <button
                onClick={() => setMoreOpen((v) => !v)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-[11.5px] tracking-[0.08em] uppercase font-medium transition-all duration-200 rounded-lg ${
                  isMoreActive || moreOpen ? "text-foreground" : "text-foreground/50 hover:text-foreground"
                }`}
              >
                More
                <motion.span
                  animate={{ rotate: moreOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center"
                >
                  <ChevronDown className="w-3 h-3" />
                </motion.span>
              </button>

              <AnimatePresence>
                {moreOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute top-[calc(100%+10px)] right-0 w-[270px] rounded-2xl overflow-hidden"
                    style={{
                      background: "hsl(36 42% 99%/0.98)",
                      backdropFilter: "blur(24px)",
                      border: "1px solid hsl(34 30% 88%/0.7)",
                      boxShadow: "0 24px 64px -16px hsl(22 22% 22%/0.18), 0 8px 24px -8px hsl(22 22% 22%/0.08)",
                    }}
                  >
                    <div className="px-4 pt-3 pb-2" style={{ borderBottom: "1px solid hsl(34 30% 88%/0.5)" }}>
                      <span style={{ fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "hsl(25 10% 52%)", fontWeight: 600 }}>
                        Explore
                      </span>
                    </div>
                    <div className="p-2">
                      {moreLinks.map((l) => {
                        const active = pathname === l.to;
                        return (
                          <Link
                            key={l.to}
                            to={l.to}
                            className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                              active ? "bg-amber-50" : "hover:bg-foreground/[0.03]"
                            }`}
                          >
                            <span
                              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 ${
                                active ? "bg-amber-100" : "bg-foreground/[0.04] group-hover:bg-amber-50"
                              }`}
                            >
                              <l.icon className={`w-3.5 h-3.5 transition-colors duration-200 ${
                                active ? "text-amber-600" : "text-foreground/35 group-hover:text-amber-500"
                              }`} />
                            </span>
                            <div className="min-w-0">
                              <div className={`text-[11.5px] font-semibold leading-none mb-0.5 transition-colors duration-200 ${
                                active ? "text-foreground" : "text-foreground/65 group-hover:text-foreground"
                              }`}>
                                {l.label}
                              </div>
                              <div className="text-[10px] leading-[1.4] text-foreground/38">{l.desc}</div>
                            </div>
                            <ArrowRight className="w-3 h-3 ml-auto shrink-0 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 text-foreground/30 transition-all duration-200" />
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          </ul>

          {/* Right side */}
          <div className="flex items-center gap-2">

            {/* Cart button */}
            <button
              onClick={() => setCartOpen(true)}
              aria-label="Open cart"
              className="relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-foreground/[0.05]"
              style={{ color: "hsl(var(--foreground)/0.6)" }}
            >
              <ShoppingBag className="w-[19px] h-[19px]" strokeWidth={1.5} />
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    key="badge"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                    className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                    style={{ background: "hsl(34 58% 52%)" }}
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <div className="hidden md:block w-px h-5 bg-foreground/10 mx-1" />

            {/* CTA — desktop */}
            <Link
              to="/shop"
              className="hidden md:inline-flex items-center gap-2 rounded-full text-[10.5px] tracking-[0.1em] uppercase font-semibold transition-all duration-300 group"
              style={{
                padding: "0.55rem 1.4rem",
                background: "hsl(var(--foreground))",
                color: "hsl(var(--background))",
                boxShadow: "0 2px 12px -3px hsl(34 58% 52%/0.35)",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 8px 28px -6px hsl(34 58% 52%/0.45)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = "0 2px 12px -3px hsl(34 58% 52%/0.35)";
              }}
            >
              Shop Now
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>

            {/* Hamburger — mobile */}
            <button
              onClick={() => setOpen((v) => !v)}
              className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center text-foreground/60 hover:text-foreground hover:bg-foreground/[0.05] transition-all duration-200"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                {open
                  ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}><X className="w-5 h-5" /></motion.div>
                  : <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}><Menu className="w-5 h-5" /></motion.div>
                }
              </AnimatePresence>
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden overflow-hidden"
            style={{
              background: "hsl(36 42% 99%/0.97)",
              backdropFilter: "blur(24px)",
              borderBottom: "1px solid hsl(34 30% 88%/0.6)",
              boxShadow: "0 16px 40px -8px hsl(22 22% 22%/0.1)",
            }}
          >
            <div className="max-w-[1320px] mx-auto px-5 py-3 pb-5">
              <ul className="flex flex-col gap-0.5">
                {links.map((l, i) => {
                  const isActive = l.to === "/" ? pathname === "/" : pathname.startsWith(l.to);
                  return (
                    <motion.li
                      key={l.to}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.22 }}
                    >
                      <NavLink
                        to={l.to}
                        end={l.to === "/"}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl text-[14px] font-medium transition-all duration-200 ${
                          isActive
                            ? "text-foreground bg-amber-50/60"
                            : "text-foreground/55 hover:text-foreground hover:bg-foreground/[0.025]"
                        }`}
                      >
                        {l.label}
                        {isActive && (
                          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "hsl(34 58% 52%)" }} />
                        )}
                      </NavLink>
                    </motion.li>
                  );
                })}

                {/* Mobile More */}
                <motion.li
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: links.length * 0.04, duration: 0.22 }}
                >
                  <button
                    onClick={() => setMobileMoreOpen((v) => !v)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-[14px] font-medium text-foreground/55 hover:text-foreground hover:bg-foreground/[0.025] transition-colors"
                  >
                    <span>More</span>
                    <motion.span
                      animate={{ rotate: mobileMoreOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </motion.span>
                  </button>

                  <AnimatePresence>
                    {mobileMoreOpen && (
                      <motion.ul
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden ml-2"
                      >
                        {moreLinks.map((l) => {
                          const active = pathname === l.to;
                          return (
                            <li key={l.to}>
                              <NavLink
                                to={l.to}
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] transition-colors ${
                                  active ? "text-foreground bg-amber-50/50" : "text-foreground/45 hover:text-foreground/75"
                                }`}
                              >
                                <span className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${active ? "bg-amber-100" : "bg-foreground/[0.04]"}`}>
                                  <l.icon className={`w-3.5 h-3.5 ${active ? "text-amber-600" : "text-foreground/40"}`} />
                                </span>
                                <span className="font-medium">{l.label}</span>
                                {active && (
                                  <span className="w-1.5 h-1.5 rounded-full ml-auto shrink-0" style={{ background: "hsl(34 58% 52%)" }} />
                                )}
                              </NavLink>
                            </li>
                          );
                        })}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </motion.li>
              </ul>

              <div className="mt-4 pt-4 flex gap-2.5" style={{ borderTop: "1px solid hsl(34 30% 88%/0.5)" }}>
                <Link
                  to="/shop"
                  className="flex items-center justify-center gap-2 flex-1 px-5 py-3 rounded-full text-[11px] tracking-[0.1em] uppercase font-semibold"
                  style={{
                    background: "hsl(var(--foreground))",
                    color: "hsl(var(--background))",
                    boxShadow: "0 4px 16px -4px hsl(34 58% 52%/0.3)",
                  }}
                >
                  Shop Collection
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
