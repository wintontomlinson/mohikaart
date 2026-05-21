import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, ShoppingBag, Menu, X, ChevronDown } from "lucide-react";
import { useCart } from "@/lib/cart";
import SearchOverlay from "./SearchOverlay";

const shopLinks = [
  { name: "All Products", href: "/shop" },
  { name: "Name Keychains", href: "/shop?cat=keychain" },
  { name: "Photo Frames", href: "/shop?cat=frame" },
  { name: "Wedding Keepsakes", href: "/shop?cat=wedding" },
  { name: "Resin Trays", href: "/shop?cat=tray" },
  { name: "Coaster Sets", href: "/shop?cat=coaster" },
  { name: "Bookmarks", href: "/shop?cat=bookmark" },
  { name: "Gift Hampers", href: "/shop?cat=hamper" },
];

const navLinks = [
  { name: "HOME", href: "/" },
  { name: "SHOP", href: "/shop", hasDropdown: true },
  { name: "CUSTOM ORDER", href: "/custom-order" },
  { name: "ABOUT", href: "/about" },
  { name: "GALLERY", href: "/gallery" },
  { name: "CONTACT", href: "/contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { count, setOpen: setCartOpen } = useCart();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setShopOpen(false);
  }, [location.pathname]);

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#fdf9f0]/90 backdrop-blur-md shadow-sm border-b border-[#c9a84c]/10"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#1a1208] flex items-center justify-center text-[#fdf9f0] font-serif text-lg font-bold">
                M
              </div>
              <span className="text-lg font-serif">
                Mohika <span className="italic text-[#c9a84c]">Art</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <div
                  key={link.name}
                  className="relative"
                  onMouseEnter={() => link.hasDropdown && setShopOpen(true)}
                  onMouseLeave={() => link.hasDropdown && setShopOpen(false)}
                >
                  <Link
                    to={link.href}
                    className={`text-xs font-medium tracking-widest transition-colors flex items-center gap-1 ${
                      isActive(link.href)
                        ? "text-[#c9a84c]"
                        : "text-[#1a1208]/80 hover:text-[#c9a84c]"
                    }`}
                  >
                    {link.name}
                    {link.hasDropdown && <ChevronDown className="w-3 h-3" />}
                  </Link>
                  {isActive(link.href) && (
                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#c9a84c] rounded-full" />
                  )}

                  {/* Shop Dropdown */}
                  {link.hasDropdown && shopOpen && (
                    <div className="absolute top-full left-0 pt-2 w-56">
                      <div className="bg-white rounded-xl shadow-lg border border-[#c9a84c]/10 py-2 overflow-hidden">
                        {shopLinks.map((sl) => (
                          <Link
                            key={sl.name}
                            to={sl.href}
                            className="block px-4 py-2.5 text-sm text-[#1a1208]/80 hover:text-[#c9a84c] hover:bg-[#fdf9f0] transition-colors"
                          >
                            {sl.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-full hover:bg-[#1a1208]/5 transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5 text-[#1a1208]/70" />
              </button>

              <button
                onClick={() => setCartOpen(true)}
                className="p-2 rounded-full hover:bg-[#1a1208]/5 transition-colors relative"
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5 text-[#1a1208]/70" />
                {count > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-[#c9a84c] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {count}
                  </span>
                )}
              </button>

              <Link
                to="/shop"
                className="hidden md:inline-flex items-center gap-1 px-5 py-2.5 bg-[#1a1208] text-[#fdf9f0] text-xs font-semibold tracking-wider rounded-full hover:bg-[#1a1208]/85 transition-colors"
              >
                SHOP NOW
                <span className="text-sm">&rarr;</span>
              </Link>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 rounded-full hover:bg-[#1a1208]/5 transition-colors"
                aria-label="Menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-[#fdf9f0] border-t border-[#c9a84c]/10 animate-in slide-in-from-top">
            <div className="max-w-7xl mx-auto px-4 py-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`block py-3 text-sm font-medium tracking-wider ${
                    isActive(link.href) ? "text-[#c9a84c]" : "text-[#1a1208]/80"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-[#c9a84c]/10">
                <p className="text-[10px] tracking-widest text-[#1a1208]/40 mb-2 uppercase">Categories</p>
                {shopLinks.slice(1).map((sl) => (
                  <Link
                    key={sl.name}
                    to={sl.href}
                    className="block py-2 text-sm text-[#1a1208]/60 hover:text-[#c9a84c]"
                  >
                    {sl.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};

export default Navbar;
