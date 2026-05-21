import { Link } from "react-router-dom";
import { Instagram, MessageCircle, Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success("Subscribed successfully!");
      setEmail("");
    }
  };

  return (
    <footer className="bg-[#1a1208] text-[#fdf9f0]/80">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#c9a84c] flex items-center justify-center text-[#1a1208] font-serif text-lg font-bold">
                M
              </div>
              <span className="text-lg font-serif text-[#fdf9f0]">
                Mohika <span className="italic text-[#c9a84c]">Art</span>
              </span>
            </div>
            <p className="text-sm text-[#fdf9f0]/50 leading-relaxed">
              Turning memories into timeless art. Handcrafted premium resin keepsakes personalized just for you.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com/mohikaart"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-[#c9a84c]/30 flex items-center justify-center hover:bg-[#c9a84c] hover:border-[#c9a84c] transition-all group"
              >
                <Instagram className="w-4 h-4 text-[#c9a84c] group-hover:text-[#1a1208]" />
              </a>
              <a
                href="https://wa.me/919999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-[#c9a84c]/30 flex items-center justify-center hover:bg-[#c9a84c] hover:border-[#c9a84c] transition-all group"
              >
                <MessageCircle className="w-4 h-4 text-[#c9a84c] group-hover:text-[#1a1208]" />
              </a>
              <a
                href="mailto:hello@mohikaart.com"
                className="w-10 h-10 rounded-full border border-[#c9a84c]/30 flex items-center justify-center hover:bg-[#c9a84c] hover:border-[#c9a84c] transition-all group"
              >
                <Mail className="w-4 h-4 text-[#c9a84c] group-hover:text-[#1a1208]" />
              </a>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-[#fdf9f0] font-medium text-sm tracking-wider uppercase mb-4">Explore</h4>
            <ul className="space-y-2.5">
              {[
                { name: "Home", href: "/" },
                { name: "Shop", href: "/shop" },
                { name: "Custom Order", href: "/custom-order" },
                { name: "About", href: "/about" },
                { name: "Gallery", href: "/gallery" },
                { name: "Contact", href: "/contact" },
              ].map((l) => (
                <li key={l.name}>
                  <Link to={l.href} className="text-sm text-[#fdf9f0]/50 hover:text-[#c9a84c] transition-colors">
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-[#fdf9f0] font-medium text-sm tracking-wider uppercase mb-4">Categories</h4>
            <ul className="space-y-2.5">
              {[
                "Name Keychains",
                "Photo Frames",
                "Wedding Keepsakes",
                "Resin Trays",
                "Coaster Sets",
                "Bookmarks",
                "Gift Hampers",
              ].map((cat) => (
                <li key={cat}>
                  <Link to="/shop" className="text-sm text-[#fdf9f0]/50 hover:text-[#c9a84c] transition-colors">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-[#fdf9f0] font-medium text-sm tracking-wider uppercase mb-4">Help</h4>
            <ul className="space-y-2.5">
              {["Shipping Policy", "Return Policy", "Privacy Policy", "FAQ", "Track My Order"].map((item) => (
                <li key={item}>
                  <Link to="/contact" className="text-sm text-[#fdf9f0]/50 hover:text-[#c9a84c] transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-4 space-y-2">
              <a
                href="https://wa.me/919999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-xs font-medium rounded-full hover:bg-green-700 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" /> WhatsApp Us
              </a>
              <a
                href="mailto:hello@mohikaart.com"
                className="block w-fit px-4 py-2 border border-[#fdf9f0]/20 text-[#fdf9f0]/70 text-xs font-medium rounded-full hover:border-[#c9a84c] hover:text-[#c9a84c] transition-colors"
              >
                <Mail className="w-3.5 h-3.5 inline mr-1.5" /> Email Us
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Strip */}
      <div className="border-t border-[#fdf9f0]/5 bg-[#1a1208]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-[#fdf9f0]/60">Get exclusive offers & new launches</p>
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="px-4 py-2.5 bg-[#fdf9f0]/5 border border-[#fdf9f0]/10 rounded-full text-sm text-[#fdf9f0] placeholder:text-[#fdf9f0]/30 focus:outline-none focus:border-[#c9a84c] w-60"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#c9a84c] text-[#1a1208] text-xs font-semibold tracking-wider rounded-full hover:bg-[#b8933f] transition-colors"
              >
                Subscribe &rarr;
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#fdf9f0]/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#fdf9f0]/30">
          <p>&copy; 2024 Mohika Art. Made with &hearts; in India</p>
          <div className="flex gap-4">
            <Link to="/contact" className="hover:text-[#c9a84c] transition-colors">Privacy</Link>
            <Link to="/contact" className="hover:text-[#c9a84c] transition-colors">Returns</Link>
            <Link to="/contact" className="hover:text-[#c9a84c] transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
