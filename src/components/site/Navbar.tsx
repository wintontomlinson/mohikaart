import { useEffect, useRef, useState } from "react";
import {
  Menu, X, ShoppingBag, ChevronDown, Heart, Briefcase,
  BookOpen, HelpCircle, Truck, ArrowRight, Sparkles, Search,
} from "lucide-react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/cart";
import { Monogram, Wordmark } from "@/components/site/Logo";

/* ── nav links ── */
const links = [
  { to: "/",        label: "Home" },
  { to: "/shop",    label: "Shop" },
  { to: "/about",   label: "About" },
  { to: "/gallery", label: "Gallery" },
  { to: "/contact", label: "Contact" },
];

const moreLinks = [
  { to: "/wedding",    label: "Wedding",    icon: Heart,      desc: "Bridal bouquet preservation",  tag: "Popular" },
  { to: "/corporate",  label: "Corporate",  icon: Briefcase,  desc: "Bulk & branded gifts",         tag: "" },
  { to: "/care-guide", label: "Care Guide", icon: BookOpen,   desc: "Keep your piece timeless",     tag: "" },
  { to: "/faq",        label: "FAQ",        icon: HelpCircle, desc: "Common questions answered",    tag: "" },
  { to: "/shipping",   label: "Shipping",   icon: Truck,      desc: "Delivery & returns info",      tag: "" },
];

const Navbar = () => {
  const [scrolled, setScrolled]             = useState(false);
  const [scrollDir, setScrollDir]           = useState<"up" | "down">("up");
  const [open, setOpen]                     = useState(false);
  const [moreOpen, setMoreOpen]             = useState(false);
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
  const [searchOpen, setSearchOpen]         = useState(false);
  const [searchQuery, setSearchQuery]       = useState("");
  const moreRef     = useRef<HTMLDivElement>(null);
  const searchRef   = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

  const { count, setOpen: setCartOpen } = useCart();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  /* scroll tracking */
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 28);
      setScrollDir(y > lastScrollY.current + 4 ? "down" : "up");
      lastScrollY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* close on route change */
  useEffect(() => {
    setOpen(false);
    setMoreOpen(false);
    setMobileMoreOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  /* close dropdowns on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* keyboard shortcut: / opens search */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const isMoreActive = moreLinks.some((l) => pathname === l.to);
  const hide = scrolled && scrollDir === "down" && !open;

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <motion.header
      initial={{ y: -120, opacity: 0 }}
      animate={{ y: hide ? -120 : 0, opacity: 1 }}
      transition={{ duration: hide ? 0.3 : 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 z-50"
      style={{ top: "38px" }}
    >
      {/* ── Main nav bar ── */}
      <div
        className="transition-all duration-500"
        style={{
          height: "64px",
          background: scrolled ? "rgba(250,247,244,0.92)" : "rgba(250,247,244,0.82)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          boxShadow: scrolled
            ? "0 1px 0 rgba(0,0,0,0.04), 0 4px 20px -4px rgba(61,43,31,0.06)"
            : "0 1px 0 hsl(34 30% 88%/0.3)",
        }}
      >
        <nav className="max-w-[1280px] mx-auto px-6 lg:px-8 flex items-center justify-between h-full">

          {/* ── LOGO ── */}
          <Link to="/" className="flex items-center gap-2 shrink-0 group" aria-label="Mohika Art home">
            <span className="inline-flex items-center transition-transform duration-400 group-hover:scale-[1.04]">
              <Monogram size={36} tone="foreground" />
            </span>
            <Wordmark className="hidden sm:block" />
          </Link>

          {/* ── DESKTOP NAV ── */}
          <ul className="hidden lg:flex items-center gap-0">
            {links.map((l) => {
              const isActive = l.to === "/" ? pathname === "/" : pathname.startsWith(l.to);
              return (
                <li key={l.to}>
                  <NavLink
                    to={l.to}
                    end={l.to === "/"}
                    className="nav-link-underline group relative px-[14px] py-2.5 inline-flex flex-col items-center"
                  >
                    <span
                      className="text-[11px] tracking-[0.09em] uppercase font-semibold transition-all duration-250"
                      style={{
                        color: isActive ? "hsl(var(--foreground))" : "hsl(var(--foreground)/0.5)",
                      }}
                    >
                      {l.label}
                    </span>
                  </NavLink>
                </li>
              );
            })}

            {/* ── More dropdown ── */}
            <li className="relative" ref={moreRef}>
              <button
                onClick={() => setMoreOpen((v) => !v)}
                className="group relative px-[14px] py-2.5 inline-flex flex-col items-center"
                aria-haspopup="menu"
                aria-expanded={moreOpen}
              >
                <span
                  className="flex items-center gap-1 text-[11px] tracking-[0.09em] uppercase font-semibold transition-all duration-250"
                  style={{ color: isMoreActive || moreOpen ? "hsl(var(--foreground))" : "hsl(var(--foreground)/0.5)" }}
                >
                  More
                  <motion.span
                    animate={{ rotate: moreOpen ? 180 : 0 }}
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-center"
                  >
                    <ChevronDown className="w-3 h-3" />
                  </motion.span>
                </span>
              </button>

              <AnimatePresence>
                {moreOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute top-[calc(100%+8px)] right-0 w-[290px] rounded-2xl overflow-hidden"
                    style={{
                      background: "hsl(36 42% 99%/0.99)",
                      backdropFilter: "blur(24px) saturate(170%)",
                      border: "1px solid hsl(34 30% 88%/0.65)",
                      boxShadow:
                        "0 28px 72px -20px hsl(22 22% 22%/0.18), " +
                        "0 8px 22px -8px hsl(22 22% 22%/0.06), " +
                        "inset 0 1px 0 hsl(36 50% 100%/0.9)",
                    }}
                  >
                    <div
                      className="px-4 pt-3.5 pb-2.5 flex items-center gap-2"
                      style={{ borderBottom: "1px solid hsl(34 28% 90%/0.7)" }}
                    >
                      <Sparkles className="w-3 h-3" style={{ color: "hsl(34 58% 52%)" }} />
                      <span style={{ fontSize: "9px", letterSpacing: "0.22em", textTransform: "uppercase", color: "hsl(25 10% 48%)", fontWeight: 700 }}>
                        Explore More
                      </span>
                    </div>
                    <div className="p-2">
                      {moreLinks.map((l, i) => {
                        const active = pathname === l.to;
                        return (
                          <motion.div
                            key={l.to}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.04, duration: 0.2 }}
                          >
                            <Link
                              to={l.to}
                              className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-220 ${
                                active ? "bg-amber-50/70" : "hover:bg-foreground/[0.03]"
                              }`}
                            >
                              <span
                                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all duration-220 ${
                                  active ? "bg-amber-100" : "bg-foreground/[0.04] group-hover:bg-amber-50"
                                }`}
                              >
                                <l.icon
                                  className={`w-3.5 h-3.5 transition-colors duration-200 ${
                                    active ? "text-amber-600" : "text-foreground/30 group-hover:text-amber-500"
                                  }`}
                                />
                              </span>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5">
                                  <span
                                    className={`text-[11.5px] font-semibold leading-none transition-colors duration-200 ${
                                      active ? "text-foreground" : "text-foreground/65 group-hover:text-foreground"
                                    }`}
                                  >
                                    {l.label}
                                  </span>
                                  {l.tag && (
                                    <span
                                      className="text-[7.5px] font-bold tracking-wider rounded-full px-1.5 py-0.5"
                                      style={{
                                        background: "hsl(34 58% 52%/0.1)",
                                        color: "hsl(34 58% 46%)",
                                        letterSpacing: "0.15em",
                                        textTransform: "uppercase",
                                      }}
                                    >
                                      {l.tag}
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] leading-[1.4] text-foreground/40 mt-0.5">
                                  {l.desc}
                                </div>
                              </div>
                              <ArrowRight className="w-3 h-3 ml-auto shrink-0 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 text-foreground/25 transition-all duration-200" />
                            </Link>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          </ul>

          {/* ── RIGHT ACTIONS ── */}
          <div className="flex items-center gap-1 md:gap-1.5">

            {/* Search */}
            <div className="relative" ref={searchRef}>
              <motion.button
                onClick={() => setSearchOpen((v) => !v)}
                aria-label="Search"
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200"
                style={{ color: "hsl(var(--foreground)/0.55)" }}
                whileHover={{ backgroundColor: "hsl(var(--foreground)/0.05)", color: "hsl(var(--foreground))" }}
                whileTap={{ scale: 0.92 }}
              >
                <Search className="w-[18px] h-[18px]" strokeWidth={1.6} />
              </motion.button>

              <AnimatePresence>
                {searchOpen && (
                  <motion.form
                    onSubmit={submitSearch}
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-[calc(100%+8px)] w-[300px] rounded-2xl overflow-hidden"
                    style={{
                      background: "hsl(36 42% 99%/0.99)",
                      backdropFilter: "blur(20px)",
                      border: "1px solid hsl(34 30% 88%/0.7)",
                      boxShadow: "0 24px 56px -16px hsl(22 22% 22%/0.18)",
                    }}
                  >
                    <div className="p-3 flex items-center gap-2">
                      <Search className="w-4 h-4 text-foreground/40 ml-1.5 shrink-0" />
                      <input
                        autoFocus
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search products..."
                        className="flex-1 outline-none bg-transparent text-sm placeholder:text-foreground/30"
                      />
                      <kbd className="text-[9px] px-1.5 py-0.5 rounded bg-foreground/5 text-foreground/40 font-mono border border-foreground/10">
                        Enter
                      </kbd>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

            {/* Cart */}
            <motion.button
              onClick={() => setCartOpen(true)}
              aria-label="Open cart"
              className="relative w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200"
              style={{ color: "hsl(var(--foreground)/0.55)" }}
              whileHover={{ backgroundColor: "hsl(var(--foreground)/0.05)", color: "hsl(var(--foreground))" }}
              whileTap={{ scale: 0.92 }}
            >
              <ShoppingBag className="w-[18px] h-[18px]" strokeWidth={1.6} />
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    key="badge"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 520, damping: 22 }}
                    className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] px-0.5 rounded-full flex items-center justify-center text-[8.5px] font-bold text-white"
                    style={{ background: "hsl(34 58% 52%)" }}
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            <div className="hidden md:block w-px h-4 rounded-full bg-foreground/10 mx-1" />

            {/* Shop CTA — desktop */}
            <motion.div
              className="hidden md:block"
              whileHover={{ y: -1.5 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                to="/shop"
                className="relative overflow-hidden inline-flex items-center gap-2 rounded-full text-[10px] tracking-[0.1em] uppercase font-semibold group"
                style={{
                  padding: "0.52rem 1.25rem",
                  background: "hsl(var(--foreground))",
                  color: "hsl(var(--background))",
                  boxShadow: "0 4px 16px -4px hsl(34 58% 38%/0.4)",
                }}
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  Shop Now
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                </span>
              </Link>
            </motion.div>

            {/* Hamburger — mobile */}
            <motion.button
              onClick={() => setOpen((v) => !v)}
              className="lg:hidden w-9 h-9 rounded-full flex items-center justify-center text-foreground/55 hover:text-foreground transition-all duration-200"
              aria-label="Toggle menu"
              whileTap={{ scale: 0.9 }}
              style={{ background: open ? "hsl(var(--foreground)/0.06)" : "transparent" }}
            >
              <AnimatePresence mode="wait">
                {open
                  ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.14 }}><X className="w-[18px] h-[18px]" /></motion.div>
                  : <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.14 }}><Menu className="w-[18px] h-[18px]" /></motion.div>
                }
              </AnimatePresence>
            </motion.button>
          </div>
        </nav>
      </div>

      {/* ── MOBILE DRAWER ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden overflow-hidden"
            style={{
              background: "rgba(250,247,244,0.92)",
              backdropFilter: "blur(20px) saturate(180%)",
              borderBottom: "1px solid hsl(34 30% 88%/0.6)",
              boxShadow: "0 24px 56px -12px hsl(22 22% 22%/0.14)",
            }}
          >
            <div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-2 pb-4">
              {/* Mobile search */}
              <form onSubmit={submitSearch} className="mb-3 mt-1">
                <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-foreground/[0.04] border border-foreground/[0.08]">
                  <Search className="w-4 h-4 text-foreground/40 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="flex-1 outline-none bg-transparent text-sm placeholder:text-foreground/30"
                  />
                </div>
              </form>

              <ul className="flex flex-col gap-0.5">
                {links.map((l, i) => {
                  const isActive = l.to === "/" ? pathname === "/" : pathname.startsWith(l.to);
                  return (
                    <motion.li
                      key={l.to}
                      initial={{ opacity: 0, x: -14 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.045, duration: 0.26 }}
                    >
                      <NavLink
                        to={l.to}
                        end={l.to === "/"}
                        className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-[14px] font-medium transition-all duration-200 ${
                          isActive
                            ? "text-foreground bg-amber-50/50"
                            : "text-foreground/55 hover:text-foreground hover:bg-foreground/[0.025]"
                        }`}
                      >
                        <span>{l.label}</span>
                        {isActive && (
                          <span
                            className="w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ background: "hsl(34 58% 52%)" }}
                          />
                        )}
                      </NavLink>
                    </motion.li>
                  );
                })}

                <motion.li
                  initial={{ opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: links.length * 0.045, duration: 0.26 }}
                >
                  <button
                    onClick={() => setMobileMoreOpen((v) => !v)}
                    className="w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-[14px] font-medium text-foreground/55 hover:text-foreground hover:bg-foreground/[0.025] transition-colors"
                  >
                    <span>More</span>
                    <motion.span
                      animate={{ rotate: mobileMoreOpen ? 180 : 0 }}
                      transition={{ duration: 0.22 }}
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
                        transition={{ duration: 0.24 }}
                        className="overflow-hidden ml-2.5 mt-0.5 rounded-xl"
                        style={{
                          background: "hsl(36 42% 98%/0.6)",
                          border: "1px solid hsl(34 28% 90%/0.5)",
                        }}
                      >
                        {moreLinks.map((l) => {
                          const active = pathname === l.to;
                          return (
                            <li key={l.to}>
                              <NavLink
                                to={l.to}
                                className={`flex items-center gap-3 px-3.5 py-2.5 text-[13px] transition-colors ${
                                  active ? "text-foreground bg-amber-50/50" : "text-foreground/50 hover:text-foreground/80"
                                }`}
                              >
                                <span
                                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                                    active ? "bg-amber-100" : "bg-foreground/[0.04]"
                                  }`}
                                >
                                  <l.icon className={`w-3.5 h-3.5 ${active ? "text-amber-600" : "text-foreground/40"}`} />
                                </span>
                                <span className="font-medium">{l.label}</span>
                                {active && (
                                  <span
                                    className="w-1.5 h-1.5 rounded-full ml-auto shrink-0"
                                    style={{ background: "hsl(34 58% 52%)" }}
                                  />
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

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28, duration: 0.28 }}
                className="mt-3.5 pt-3.5 flex gap-2.5"
                style={{ borderTop: "1px solid hsl(34 30% 88%/0.5)" }}
              >
                <Link
                  to="/shop"
                  className="flex items-center justify-center gap-2 flex-1 px-5 py-3 rounded-full text-[10.5px] tracking-[0.1em] uppercase font-semibold"
                  style={{
                    background: "hsl(var(--foreground))",
                    color: "hsl(var(--background))",
                    boxShadow: "0 6px 20px -6px hsl(34 58% 38%/0.35)",
                  }}
                >
                  Shop Collection
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to="/contact"
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-full text-[10.5px] tracking-[0.1em] uppercase font-semibold"
                  style={{
                    border: "1.5px solid hsl(var(--foreground)/0.14)",
                    color: "hsl(var(--foreground)/0.65)",
                  }}
                >
                  Custom
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
