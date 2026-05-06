import { ReactNode, useEffect, useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut, Package, Image as ImageIcon, Home, Menu, X, LayoutDashboard, ShoppingCart, Tag, Settings, Mail } from "lucide-react";
import logo from "@/assets/mohika-mark.png";

const KEY = "mohika.admin.auth.v1";
const PASSWORD = "2344"; // change anytime in src/pages/admin/AdminLayout.tsx

export const isAdmin = () => localStorage.getItem(KEY) === "1";

const AdminLogin = ({ onOk }: { onOk: () => void }) => {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (pw === PASSWORD) { localStorage.setItem(KEY, "1"); onOk(); }
          else setErr("Incorrect password");
        }}
        className="bg-card rounded-3xl p-10 w-full max-w-md shadow-2xl border border-border"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-foreground flex items-center justify-center p-2">
            <img src={logo} alt="Mohika Art" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="font-display text-2xl text-gold-grad leading-none" style={{ fontWeight: 350 }}>Mohika <span className="italic">Art</span></div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mt-1">Admin Panel</div>
          </div>
        </div>
        <h1 className="font-display text-3xl mb-1">Welcome back</h1>
        <p className="text-sm text-muted-foreground mb-8">Enter the admin password to access the panel.</p>
        <div className="space-y-4">
          <input
            type="password"
            autoFocus
            value={pw}
            onChange={(e) => { setPw(e.target.value); setErr(""); }}
            placeholder="Password"
            className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-foreground outline-none text-sm transition-colors"
          />
          {err && <p className="text-sm text-destructive">{err}</p>}
          <button type="submit" className="w-full px-6 py-3 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity">
            Sign In
          </button>
        </div>
        <Link to="/" className="block text-center mt-5 text-xs text-muted-foreground hover:text-foreground transition-colors">← Back to site</Link>
      </form>
    </div>
  );
};

const AdminLayout = ({ children }: { children?: ReactNode }) => {
  const [auth, setAuth] = useState(isAdmin());
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();
  const nav = useNavigate();

  useEffect(() => {
    const onStorage = () => setAuth(isAdmin());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  if (!auth) return <AdminLogin onOk={() => setAuth(true)} />;

  const items = [
    { to: "/admin",            icon: LayoutDashboard, label: "Dashboard" },
    { to: "/admin/products",   icon: Package,         label: "Products" },
    { to: "/admin/categories", icon: Tag,             label: "Categories" },
    { to: "/admin/orders",     icon: ShoppingCart,    label: "Orders" },
    { to: "/admin/inquiries",  icon: Mail,            label: "Inquiries" },
    { to: "/admin/images",     icon: ImageIcon,       label: "Site Images" },
    { to: "/admin/settings",   icon: Settings,        label: "Settings" },
  ];

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-background/10 flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-background/95 flex items-center justify-center p-1.5 shrink-0">
          <img src={logo} alt="Mohika Art" width={40} height={40} className="w-full h-full object-contain" />
        </div>
        <div>
          <div className="font-display text-xl text-gold-grad leading-none" style={{ fontWeight: 350 }}>Mohika <span className="italic">Art</span></div>
          <div className="text-[9px] uppercase tracking-[0.3em] text-background/60 mt-1.5">Admin Panel</div>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {items.map((it) => {
          const active = pathname === it.to || (it.to !== "/admin" && pathname.startsWith(it.to));
          return (
            <Link key={it.to} to={it.to}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${active ? "bg-background/15 text-background font-medium" : "text-background/70 hover:text-background hover:bg-background/10"}`}
            >
              <it.icon className="w-4 h-4 shrink-0" /> {it.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-background/10 space-y-1">
        <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-background/70 hover:text-background hover:bg-background/10 transition-all">
          <Home className="w-4 h-4 shrink-0" /> View Site
        </Link>
        <button
          onClick={() => { localStorage.removeItem(KEY); nav("/admin"); setAuth(false); }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-background/70 hover:text-background hover:bg-background/10 transition-all"
        >
          <LogOut className="w-4 h-4 shrink-0" /> Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Desktop Sidebar */}
      <aside className="w-60 shrink-0 bg-foreground text-background hidden md:flex flex-col">
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
          {items.map((it) => {
            const active = pathname === it.to || (it.to !== "/admin" && pathname.startsWith(it.to));
            return (
              <Link key={it.to} to={it.to}
                className={`flex-1 flex flex-col items-center gap-1 py-3 text-[10px] tracking-wider transition-colors ${active ? "text-background" : "text-background/50"}`}
              >
                <it.icon className="w-5 h-5" />
                {it.label}
              </Link>
            );
          })}
          <Link to="/"
            className="flex-1 flex flex-col items-center gap-1 py-3 text-[10px] tracking-wider text-background/50 transition-colors"
          >
            <Home className="w-5 h-5" />
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
