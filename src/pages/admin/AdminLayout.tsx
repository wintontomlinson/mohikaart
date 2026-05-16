import { ReactNode, useEffect, useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  LogOut, Package, Image as ImageIcon, Home, Menu, LayoutDashboard,
  ShoppingCart, Tag, Settings, Mail, Sparkles, MessageSquareQuote,
  Megaphone, Ticket, Search, Eye, EyeOff,
} from "lucide-react";
import logo from "@/assets/mohika-mark.png";

const KEY = "mohika.admin.auth.v1";
const PASSWORD = "2344"; // change anytime here

export const isAdmin = () => localStorage.getItem(KEY) === "1";

const AdminLogin = ({ onOk }: { onOk: () => void }) => {
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    if (attempts >= 5) {
      setLocked(true);
      const t = setTimeout(() => { setLocked(false); setAttempts(0); }, 30000);
      return () => clearTimeout(t);
    }
  }, [attempts]);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 70% 60% at 30% 20%, hsl(348 55% 93%/0.6), transparent 60%)," +
          "radial-gradient(ellipse 50% 50% at 80% 80%, hsl(38 65% 91%/0.55), transparent 60%)," +
          "linear-gradient(168deg, hsl(36 42% 99%) 0%, hsl(35 32% 96%) 100%)",
      }}
    >
      {/* Decorative blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blush/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-champagne/15 blur-3xl pointer-events-none" />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (locked) return;
          if (pw === PASSWORD) {
            localStorage.setItem(KEY, "1");
            onOk();
          } else {
            setErr("Incorrect password");
            setAttempts((n) => n + 1);
          }
        }}
        className="bg-card/95 backdrop-blur-xl rounded-3xl p-10 w-full max-w-md shadow-2xl border border-border relative z-10"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-foreground flex items-center justify-center p-2">
            <img src={logo} alt="Mohika Art" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="font-display text-2xl text-gold-grad leading-none" style={{ fontWeight: 350 }}>
              Mohika <span className="italic">Art</span>
            </div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mt-1">Admin Panel</div>
          </div>
        </div>

        <h1 className="font-display text-3xl mb-1">Welcome back</h1>
        <p className="text-sm text-muted-foreground mb-8">
          Enter the admin password to access the panel.
        </p>

        <div className="space-y-4">
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              autoFocus
              value={pw}
              onChange={(e) => { setPw(e.target.value); setErr(""); }}
              placeholder="Password"
              disabled={locked}
              className="w-full px-4 py-3 pr-11 rounded-xl bg-background border border-border focus:border-foreground/50 outline-none text-sm transition-colors disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {err && !locked && (
            <p className="text-sm text-destructive flex items-center gap-2">
              {err}
              {attempts > 0 && <span className="text-xs opacity-60">({5 - attempts} tries left)</span>}
            </p>
          )}
          {locked && (
            <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg">
              Too many attempts. Please wait 30 seconds.
            </p>
          )}

          <button
            type="submit"
            disabled={locked || !pw}
            className="w-full px-6 py-3 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {locked ? "Locked" : "Sign In"}
          </button>
        </div>

        <Link to="/" className="block text-center mt-5 text-xs text-muted-foreground hover:text-foreground transition-colors">
          ← Back to site
        </Link>
      </form>
    </div>
  );
};

const AdminLayout = ({ children }: { children?: ReactNode }) => {
  const [auth, setAuth] = useState(isAdmin());
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { pathname } = useLocation();
  const nav = useNavigate();

  useEffect(() => {
    const onStorage = () => setAuth(isAdmin());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  if (!auth) return <AdminLogin onOk={() => setAuth(true)} />;

  const groups: { title: string; items: { to: string; icon: any; label: string }[] }[] = [
    {
      title: "Overview",
      items: [
        { to: "/admin", icon: LayoutDashboard, label: "Dashboard" },
      ],
    },
    {
      title: "Catalogue",
      items: [
        { to: "/admin/products",    icon: Package, label: "Products" },
        { to: "/admin/categories",  icon: Tag,     label: "Categories" },
        { to: "/admin/coupons",     icon: Ticket,  label: "Coupons" },
      ],
    },
    {
      title: "Customers",
      items: [
        { to: "/admin/orders",     icon: ShoppingCart,     label: "Orders" },
        { to: "/admin/inquiries",  icon: Mail,             label: "Inquiries" },
        { to: "/admin/testimonials", icon: MessageSquareQuote, label: "Testimonials" },
      ],
    },
    {
      title: "Content",
      items: [
        { to: "/admin/hero",         icon: Sparkles,  label: "Hero Section" },
        { to: "/admin/announcements", icon: Megaphone, label: "Announcements" },
        { to: "/admin/images",       icon: ImageIcon, label: "Site Images" },
      ],
    },
    {
      title: "System",
      items: [
        { to: "/admin/settings",  icon: Settings, label: "Settings" },
      ],
    },
  ];

  // Flatten for mobile bottom nav (keep most important)
  const flatItems = groups.flatMap((g) => g.items);
  const bottomNavItems = [
    flatItems[0], // Dashboard
    flatItems.find((i) => i.to === "/admin/products")!,
    flatItems.find((i) => i.to === "/admin/orders")!,
    flatItems.find((i) => i.to === "/admin/inquiries")!,
    flatItems.find((i) => i.to === "/admin/hero")!,
  ];

  // Filtered for search
  const filtered = search.trim()
    ? groups
        .map((g) => ({
          ...g,
          items: g.items.filter((i) =>
            i.label.toLowerCase().includes(search.toLowerCase())
          ),
        }))
        .filter((g) => g.items.length > 0)
    : groups;

  const SidebarContent = () => (
    <>
      <div className="p-5 border-b border-background/10 flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-background/95 flex items-center justify-center p-1.5 shrink-0">
          <img src={logo} alt="Mohika Art" width={40} height={40} className="w-full h-full object-contain" />
        </div>
        <div>
          <div className="font-display text-xl text-gold-grad leading-none" style={{ fontWeight: 350 }}>
            Mohika <span className="italic">Art</span>
          </div>
          <div className="text-[9px] uppercase tracking-[0.3em] text-background/60 mt-1.5">Admin Panel</div>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 pb-2">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background/[0.06] border border-background/10">
          <Search className="w-3.5 h-3.5 text-background/40 shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search menu..."
            className="flex-1 outline-none bg-transparent text-xs text-background placeholder:text-background/40"
          />
        </div>
      </div>

      <nav className="flex-1 p-4 pt-2 overflow-y-auto space-y-4">
        {filtered.map((group) => (
          <div key={group.title}>
            <div className="text-[9px] uppercase tracking-[0.25em] text-background/40 font-semibold px-3 mb-2">
              {group.title}
            </div>
            <div className="space-y-0.5">
              {group.items.map((it) => {
                const active = pathname === it.to || (it.to !== "/admin" && pathname.startsWith(it.to));
                return (
                  <Link
                    key={it.to}
                    to={it.to}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] transition-all ${
                      active
                        ? "bg-background/15 text-background font-medium"
                        : "text-background/65 hover:text-background hover:bg-background/8"
                    }`}
                  >
                    <it.icon className="w-4 h-4 shrink-0" />
                    {it.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-xs text-background/40 px-3 py-6 text-center">
            No matches
          </div>
        )}
      </nav>

      <div className="p-4 border-t border-background/10 space-y-1">
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] text-background/65 hover:text-background hover:bg-background/10 transition-all"
        >
          <Home className="w-4 h-4 shrink-0" /> View Site
        </Link>
        <button
          onClick={() => { localStorage.removeItem(KEY); nav("/admin"); setAuth(false); }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] text-background/65 hover:text-background hover:bg-background/10 transition-all"
        >
          <LogOut className="w-4 h-4 shrink-0" /> Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Desktop Sidebar */}
      <aside className="w-64 shrink-0 bg-foreground text-background hidden md:flex flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile overlay sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-foreground/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-foreground text-background flex flex-col shadow-2xl">
            <SidebarContent />
          </aside>
        </div>
      )}

      <div className="flex-1 min-w-0">
        {/* Mobile Header */}
        <header className="md:hidden bg-foreground text-background px-4 py-3.5 flex items-center justify-between sticky top-0 z-40">
          <button
            onClick={() => setMobileOpen(true)}
            className="w-9 h-9 rounded-xl bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors"
          >
            <Menu className="w-4 h-4" />
          </button>
          <div className="font-display text-lg text-gold-grad">Admin Panel</div>
          <button
            onClick={() => { localStorage.removeItem(KEY); setAuth(false); }}
            className="w-9 h-9 rounded-xl bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </header>

        {/* Mobile bottom nav */}
        <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-foreground text-background border-t border-background/10 flex">
          {bottomNavItems.map((it) => {
            const active = pathname === it.to || (it.to !== "/admin" && pathname.startsWith(it.to));
            return (
              <Link
                key={it.to}
                to={it.to}
                className={`flex-1 flex flex-col items-center gap-1 py-3 text-[9.5px] tracking-wider transition-colors ${
                  active ? "text-background" : "text-background/50"
                }`}
              >
                <it.icon className="w-4 h-4" />
                {it.label}
              </Link>
            );
          })}
          <Link
            to="/"
            className="flex-1 flex flex-col items-center gap-1 py-3 text-[9.5px] tracking-wider text-background/50 transition-colors"
          >
            <Home className="w-4 h-4" />
            Site
          </Link>
        </nav>

        <main className="p-4 md:p-10 pb-24 md:pb-10">
          {children ?? <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
