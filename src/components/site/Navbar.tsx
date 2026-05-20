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
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop", hasDropdown: true },
  { to: "/contact", label: "Custom Order" },
  { to: "/about", label: "About" },
  { to: "/gallery", label: "Gallery" },
  { to: "/contact", label: "Contact" },
];

const shopDropdownLinks = [
  { to: "/shop", label: "All Products" },
  { to: "/category/name-keychains", label: "Name Keychains" },
  { to: "/category/photo-frames", label: "Photo Frames" },
  { to: "/category/wedding-keepsakes", label: "Wedding Keepsakes" },
  { to: "/category/resin-trays", label: "Resin Trays" },
  { to: "/category/coaster-sets", label: "Coaster Sets" },
  { to: "/category/bookmarks", label: "Bookmarks" },
  { to: "/category/gift-hampers", label: "Gift Hampers" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [scrollDir, setScrollDir] = useState<"up" | "down">("up");
  const [open, setOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [mobileShopOpen, setMobileShopOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const shopRef = useRef<HTMLLIElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
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
    setShopOpen(false);
    setMobileShopOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  /* close dropdowns on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (shopRef.current && !shopRef.current.contains(e.target as Node)) setShopOpen(false);
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
      className="fixed top-0 inset-x-0 z-50"
    >
      {/* ── Main nav bar ── */}
      <div
        className="transition-all duration-500"
        style={{
          background: scrolled ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.75)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          boxShadow: scrolled
            ? "0 1px 0 rgba(0,0,0,0.06), 0 4px 20px -4px rgba(0,0,0,0.08)"
            : "none",
        }}
      >
        <nav className="max-w-[1360px] mx-auto px-5 md:px-10 flex items-center justify-between h-[60px] md:h-[68px]">

          {/* ── LOGO ── */}
          <Link to="/" className="flex items-center gap-2 shrink-0 group" aria-label="Mohika Art home">
            <span className="inline-flex items-center transition-transform duration-400 group-hover:scale-[1.04]">
              <Monogram size={36} tone="foreground" />
            </span>
            <Wordmark className="hidden sm:block" />
          </Link>

          {/* ── DESKTOP NAV ── */}
          <ul className="hidden lg:flex items-center gap-0">
            {links.map((l, idx) => {
              const isActive = l.to === "/" ? pathname === "/" : pathname.startsWith(l.to);
              const isShop = l.hasDropdown;

              if (isShop) {
                return (
                  <li key={`${l.to}-${idx}`} className="relative" ref={shopRef}>
                    <button
                      onMouseEnter={() => setShopOpen(true)}
                      onClick={() => setShopOpen((v) => !v)}
                      className="group relative px-[14px] py-2.5 inline-flex flex-col items-center"
                      aria-haspopup="menu"
                      aria-expanded={shopOpen}
                    >
                      <span
                        className="flex items-center gap-1 text-[11px] tracking-[0.09em] uppercase font-semibold transition-all duration-250"
                        style={{ color: shopOpen || pathname.startsWith("/shop") || pathname.startsWith("/category") ? "#3D2B1F" : "rgba(61,43,31,0.5)" }}
                      >
                        {l.label}
                        <motion.span
                          animate={{ rotate: shopOpen ? 180 : 0 }}
                          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                          className="flex items-center"
                        >
                          <ChevronDown className="w-3 h-3" />
                        </motion.span>
                      </span>
                      <motion.span
                        className="absolute bottom-1 left-1/2 -translate-x-1/2 rounded-full"
                        animate={{
                          width: pathname.startsWith("/shop") || pathname.startsWith("/category") ? "20px" : "0px",
                          opacity: pathname.startsWith("/shop") || pathname.startsWith("/category") ? 1 : 0,
                        }}
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                        style={{ height: "2px", background: "#C9964A" }}
                      />
                    </button>

                    <AnimatePresence>
                      {shopOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.96 }}
                          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                          className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 w-[220px] rounded-2xl overflow-hidden"
                          style={{
                            background: "rgba(255,255,255,0.98)",
                            backdropFilter: "blur(24px)",
                            border: "1px solid rgba(0,0,0,0.08)",
                            boxShadow: "0 20px 60px -12px rgba(0,0,0,0.15)",
                          }}
                          onMouseEnter={() => setShopOpen(true)}
                          onMouseLeave={() => setShopOpen(false)}
                        >
                          <div className="p-2">
                            {shopDropdownLinks.map((sl, i) => (
                              <motion.div
                                key={sl.to}
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.03, duration: 0.2 }}
                              >
                                <Link
                                  to={sl.to}
                                  className="block px-4 py-2.5 rounded-xl text-[13px] font-medium text-foreground/65 hover:text-foreground hover:bg-amber-50/60 transition-all duration-200"
                                >
                                  {sl.label}
                                </Link>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              }

              return (
                <li key={`${l.to}-${idx}`}>
                  <NavLink
                    to={l.to}
                    end={l.to === "/"}
                    className="group relative px-[14px] py-2.5 inline-flex flex-col items-center"
                  >
                    <span
                      className="text-[11px] tracking-[0.09em] uppercase font-semibold transition-all duration-250"
                      style={{
                        color: isActive ? "#3D2B1F" : "rgba(61,43,31,0.5)",
                      }}
                    >
                      {l.label}
                    </span>
                    {/* Active underline (slide-in) */}
                    <motion.span
                      className="absolute bottom-1 left-1/2 -translate-x-1/2 rounded-full"
                      animate={{
                        width: isActive ? "20px" : "0px",
                        opacity: isActive ? 1 : 0,
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      style={{ height: "2px", background: "#C9964A" }}
                    />
                    {/* Hover underline hint */}
                    <span
                      className="absolute bottom-1 left-1/2 -translate-x-1/2 rounded-full opacity-0 group-hover:opacity-40 transition-all duration-250"
                      style={{ height: "2px", width: "12px", background: "#C9964A" }}
                    />
                  </NavLink>
                </li>
              );
            })}
          </ul>

          {/* ── RIGHT ACTIONS ── */}
          <div className="flex items-center gap-1 md:gap-1.5">

            {/* Search */}
            <div className="relative" ref={searchRef}>
              <motion.button
                onClick={() => setSearchOpen((v) => !v)}
                aria-label="Search"
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200"
                style={{ color: "rgba(61,43,31,0.55)" }}
                whileHover={{ backgroundColor: "rgba(61,43,31,0.05)", color: "#3D2B1F" }}
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
                      background: "rgba(255,255,255,0.98)",
                      backdropFilter: "blur(20px)",
                      border: "1px solid rgba(0,0,0,0.08)",
                      boxShadow: "0 24px 56px -16px rgba(0,0,0,0.18)",
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
              style={{ color: "rgba(61,43,31,0.55)" }}
              whileHover={{ backgroundColor: "rgba(61,43,31,0.05)", color: "#3D2B1F" }}
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
                    style={{ background: "#C9964A" }}
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            <div className="hidden md:block w-px h-4 rounded-full bg-foreground/10 mx-1" />

            {/* Shop CTA, desktop */}
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
                  background: "#3D2B1F",
                  color: "#FAF7F4",
                  boxShadow: "0 4px 16px -4px rgba(61,43,31,0.4)",
                }}
              >
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  animate={{ x: ["-120%", "120%"] }}
                  transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 7, ease: "easeInOut" }}
                />
                <span className="relative z-10 flex items-center gap-1.5">
                  Shop Now
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                </span>
              </Link>
            </motion.div>

            {/* Hamburger, mobile */}
            <motion.button
              onClick={() => setOpen((v) => !v)}
              className="lg:hidden w-9 h-9 rounded-full flex items-center justify-center text-foreground/55 hover:text-foreground transition-all duration-200"
              aria-label="Toggle menu"
              whileTap={{ scale: 0.9 }}
              style={{ background: open ? "rgba(61,43,31,0.06)" : "transparent" }}
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
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.98)",
              backdropFilter: "blur(28px) saturate(170%)",
              borderBottom: "1px solid rgba(0,0,0,0.06)",
              boxShadow: "0 24px 56px -12px rgba(0,0,0,0.12)",
            }}
          >
            <div className="max-w-[1360px] mx-auto px-4 py-2 pb-4">
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
                {/* Home */}
                <motion.li
                  initial={{ opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0, duration: 0.26 }}
                >
                  <NavLink
                    to="/"
                    end
                    className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-[14px] font-medium transition-all duration-200 ${
                      pathname === "/"
                        ? "text-foreground bg-amber-50/50"
                        : "text-foreground/55 hover:text-foreground hover:bg-foreground/[0.025]"
                    }`}
                  >
                    <span>Home</span>
                    {pathname === "/" && (
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#C9964A" }} />
                    )}
                  </NavLink>
                </motion.li>

                {/* Shop with expandable subcategories */}
                <motion.li
                  initial={{ opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.045, duration: 0.26 }}
                >
                  <button
                    onClick={() => setMobileShopOpen((v) => !v)}
                    className="w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-[14px] font-medium text-foreground/55 hover:text-foreground hover:bg-foreground/[0.025] transition-colors"
                  >
                    <span>Shop</span>
                    <motion.span
                      animate={{ rotate: mobileShopOpen ? 180 : 0 }}
                      transition={{ duration: 0.22 }}
                      className="flex items-center"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </motion.span>
                  </button>

                  <AnimatePresence>
                    {mobileShopOpen && (
                      <motion.ul
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.24 }}
                        className="overflow-hidden ml-2.5 mt-0.5 rounded-xl"
                        style={{
                          background: "rgba(250,247,244,0.6)",
                          border: "1px solid rgba(0,0,0,0.05)",
                        }}
                      >
                        {shopDropdownLinks.map((sl) => (
                          <li key={sl.to}>
                            <NavLink
                              to={sl.to}
                              className={`block px-3.5 py-2.5 text-[13px] font-medium transition-colors ${
                                pathname === sl.to ? "text-foreground bg-amber-50/50" : "text-foreground/50 hover:text-foreground/80"
                              }`}
                            >
                              {sl.label}
                            </NavLink>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </motion.li>

                {/* Other links: Custom Order, About, Gallery, Contact */}
                {[
                  { to: "/contact", label: "Custom Order" },
                  { to: "/about", label: "About" },
                  { to: "/gallery", label: "Gallery" },
                  { to: "/contact", label: "Contact" },
                ].map((l, i) => {
                  const isActive = pathname === l.to;
                  return (
                    <motion.li
                      key={`${l.label}-${i}`}
                      initial={{ opacity: 0, x: -14 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (i + 2) * 0.045, duration: 0.26 }}
                    >
                      <NavLink
                        to={l.to}
                        className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-[14px] font-medium transition-all duration-200 ${
                          isActive
                            ? "text-foreground bg-amber-50/50"
                            : "text-foreground/55 hover:text-foreground hover:bg-foreground/[0.025]"
                        }`}
                      >
                        <span>{l.label}</span>
                        {isActive && (
                          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#C9964A" }} />
                        )}
                      </NavLink>
                    </motion.li>
                  );
                })}
              </ul>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28, duration: 0.28 }}
                className="mt-3.5 pt-3.5 flex gap-2.5"
                style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}
              >
                <Link
                  to="/shop"
                  className="flex items-center justify-center gap-2 flex-1 px-5 py-3 rounded-full text-[10.5px] tracking-[0.1em] uppercase font-semibold"
                  style={{
                    background: "#3D2B1F",
                    color: "#FAF7F4",
                    boxShadow: "0 6px 20px -6px rgba(61,43,31,0.35)",
                  }}
                >
                  Shop Collection
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to="/contact"
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-full text-[10.5px] tracking-[0.1em] uppercase font-semibold"
                  style={{
                    border: "1.5px solid rgba(61,43,31,0.14)",
                    color: "rgba(61,43,31,0.65)",
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
