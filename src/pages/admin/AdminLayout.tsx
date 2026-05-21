import { ReactNode, useEffect, useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  LogOut, Package, Home, Menu, LayoutDashboard,
  ShoppingCart, Tag, Settings, Mail,
  X, Eye, EyeOff, ShieldAlert,
} from "lucide-react";
import { AdminAuthProvider, useAdminAuth } from "@/lib/admin-auth";
import logo from "@/assets/mohika-mark.png";

/* ─── Login ─── */
const AdminLogin = () => {
  const { signIn } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setBusy(true);
    const { error } = await signIn(email, pw);
    setBusy(false);
    if (error) setErr(error);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden"
      style={{ background: "radial-gradient(ellipse 70% 60% at 30% 20%, hsl(38 65% 91%/0.55), transparent 60%), radial-gradient(ellipse 50% 50% at 80% 80%, hsl(36 42% 93%/0.55), transparent 60%), linear-gradient(168deg, hsl(36 42% 99%) 0%, hsl(35 32% 96%) 100%)" }}>
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#c9a84c]/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#c9a84c]/5 blur-3xl pointer-events-none" />
      <form onSubmit={onSubmit} className="bg-white/80 backdrop-blur-2xl rounded-3xl p-10 w-full max-w-md shadow-2xl border border-white/60 relative z-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[#1a1208] flex items-center justify-center p-2">
            <img src={logo} alt="Mohika Art" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="font-display text-2xl leading-none" style={{ color: "#1a1208" }}>Mohika <span className="italic" style={{ color: "#c9a84c" }}>Art</span></div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mt-1">Admin Panel</div>
          </div>
        </div>
        <h1 className="font-display text-3xl mb-1" style={{ color: "#1a1208" }}>Welcome back</h1>
        <p className="text-sm text-muted-foreground mb-8">Sign in to manage your store.</p>
        <div className="space-y-4">
          <div>
            <label className="block text-[11px] uppercase tracking-widest mb-2 text-muted-foreground">Email</label>
            <input type="email" autoComplete="email" autoFocus required value={email}
              onChange={(e) => { setEmail(e.target.value); setErr(""); }}
              placeholder="you@mohikaart.com"
              className="w-full px-4 py-3 rounded-xl bg-white border border-[#e5e0d8] focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/20 outline-none text-sm transition-all" />
          </div>
          <div>
            <label className="block text-[11px] uppercase tracking-widest mb-2 text-muted-foreground">Password</label>
            <div className="relative">
              <input type={show ? "text" : "password"} autoComplete="current-password" required value={pw}
                onChange={(e) => { setPw(e.target.value); setErr(""); }}
                placeholder="••••••••"
                className="w-full px-4 py-3 pr-11 rounded-xl bg-white border border-[#e5e0d8] focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/20 outline-none text-sm transition-all" />
              <button type="button" onClick={() => setShow((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          {err && (
            <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-red-50 border border-red-200">
              <ShieldAlert className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span className="text-sm text-red-600">{err}</span>
            </div>
          )}
          <button type="submit" disabled={busy || !email || !pw}
            className="w-full px-6 py-3.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg"
            style={{ background: "#1a1208", color: "#fdf9f0" }}>
            {busy ? "Signing in…" : "Sign In"}
          </button>
        </div>
        <Link to="/" className="block text-center mt-5 text-xs text-muted-foreground hover:text-foreground transition-colors">← Back to store</Link>
      </form>
    </div>
  );
};

/* ─── Not Authorized ─── */
const NotAuthorized = () => {
  const { signOut, user } = useAdminAuth();
  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "hsl(36 42% 98%)" }}>
      <div className="bg-white/80 backdrop-blur-xl border border-[#e5e0d8] rounded-3xl shadow-2xl p-10 max-w-md text-center">
        <ShieldAlert className="w-10 h-10 mx-auto mb-4" style={{ color: "#c9a84c" }} />
        <h2 className="font-display text-2xl mb-2" style={{ color: "#1a1208" }}>Not authorized</h2>
        <p className="text-sm text-muted-foreground mb-6">
          {user?.email ? <><strong>{user.email}</strong> doesn't have admin access.</> : "Not signed in as admin."}
        </p>
        <div className="flex gap-3 justify-center">
          <Link to="/" className="px-5 py-2.5 rounded-xl border border-[#e5e0d8] text-sm hover:bg-[#f5f0e8] transition-colors">Back to store</Link>
          <button onClick={signOut} className="px-5 py-2.5 rounded-xl text-sm text-white" style={{ background: "#1a1208" }}>Sign out</button>
        </div>
      </div>
    </div>
  );
};

/* ─── Nav Items ─── */
const navItems = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/admin/products", icon: Package, label: "Products" },
  { to: "/admin/categories", icon: Tag, label: "Categories" },
  { to: "/admin/orders", icon: ShoppingCart, label: "Orders" },
  { to: "/admin/inquiries", icon: Mail, label: "Inquiries" },
  { to: "/admin/settings", icon: Settings, label: "Settings" },
];

const bottomNavItems = [
  navItems[0], // Dashboard
  navItems[1], // Products
  navItems[3], // Orders
  navItems[4], // Inquiries
  navItems[5], // Settings
];

/* ─── Admin Shell ─── */
const AdminShell = ({ children }: { children?: ReactNode }) => {
  const { isAdmin, loading, user, signOut } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => { setSidebarOpen(false); }, [pathname]);
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior }); }, [pathname]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "hsl(36 42% 98%)" }}>
      <div className="flex items-center gap-3 text-muted-foreground text-sm">
        <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#c9a84c" }} />Loading…
      </div>
    </div>
  );
  if (!user) return <AdminLogin />;
  if (!isAdmin) return <NotAuthorized />;

  const currentPage = navItems.find((i) => pathname === i.to || (i.to !== "/admin" && pathname.startsWith(i.to)));

  return (
    <div className="min-h-screen flex" style={{ background: "hsl(36 42% 97%)" }}>
      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 z-50 h-screen ${collapsed ? "w-[72px]" : "w-[260px]"} flex flex-col transition-all duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="m-3 flex-1 flex flex-col rounded-2xl bg-white/70 backdrop-blur-xl border border-[#e5e0d8]/60 shadow-[0_8px_40px_-12px_rgba(26,18,8,0.08)] overflow-hidden">
          {/* Logo */}
          <div className={`flex items-center gap-3 p-5 ${collapsed ? "justify-center px-3" : ""}`}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center p-1.5 shrink-0" style={{ background: "linear-gradient(135deg, #1a1208, #2d2015)" }}>
              <img src={logo} alt="Mohika Art" className="w-full h-full object-contain" />
            </div>
            {!collapsed && (
              <div>
                <div className="font-display text-lg leading-none" style={{ color: "#1a1208" }}>Mohika <span className="italic" style={{ color: "#c9a84c" }}>Art</span></div>
                <div className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground mt-1">Admin</div>
              </div>
            )}
            <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden w-8 h-8 rounded-lg hover:bg-[#f5f0e8] flex items-center justify-center text-muted-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 overflow-y-auto">
            <div className="space-y-1">
              {navItems.map((it) => {
                const active = pathname === it.to || (it.to !== "/admin" && pathname.startsWith(it.to));
                return (
                  <Link key={it.to} to={it.to} title={collapsed ? it.label : undefined}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] transition-all relative ${collapsed ? "justify-center" : ""} ${
                      active ? "bg-[#1a1208] text-white font-medium shadow-md" : "text-[#3d2b1f]/70 hover:text-[#1a1208] hover:bg-[#f5f0e8]"
                    }`}>
                    <it.icon className={`w-[18px] h-[18px] shrink-0 ${active ? "text-[#c9a84c]" : ""}`} />
                    {!collapsed && <span>{it.label}</span>}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Bottom */}
          <div className={`p-4 border-t border-[#e5e0d8]/50 space-y-1 ${collapsed ? "px-2" : ""}`}>
            {!collapsed && user && (
              <div className="px-3 py-1.5 text-[10px] text-muted-foreground truncate">{user.email}</div>
            )}
            <Link to="/" target="_blank" className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[13px] text-muted-foreground hover:text-foreground hover:bg-[#f5f0e8] transition-all ${collapsed ? "justify-center" : ""}`}>
              <Home className="w-4 h-4 shrink-0" />{!collapsed && "View Store"}
            </Link>
            <button onClick={signOut} className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[13px] text-red-500/70 hover:text-red-600 hover:bg-red-50 transition-all w-full ${collapsed ? "justify-center" : ""}`}>
              <LogOut className="w-4 h-4 shrink-0" />{!collapsed && "Sign Out"}
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-30 mx-3 mt-3 rounded-2xl bg-white/70 backdrop-blur-xl border border-[#e5e0d8]/60 shadow-[0_4px_24px_-8px_rgba(26,18,8,0.06)]">
          <div className="flex items-center justify-between h-14 px-4 lg:px-6">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden w-9 h-9 rounded-xl bg-[#f8f5f0] hover:bg-[#f0ebe3] flex items-center justify-center transition-colors">
                <Menu className="w-4 h-4" style={{ color: "#1a1208" }} />
              </button>
              <button onClick={() => setCollapsed(!collapsed)} className="hidden lg:flex w-9 h-9 rounded-xl bg-[#f8f5f0] hover:bg-[#f0ebe3] items-center justify-center transition-colors">
                <Menu className="w-4 h-4" style={{ color: "#1a1208" }} />
              </button>
              {currentPage && (
                <div className="flex items-center gap-2">
                  <currentPage.icon className="w-4 h-4" style={{ color: "#c9a84c" }} />
                  <h1 className="text-sm font-medium" style={{ color: "#1a1208" }}>{currentPage.label}</h1>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Link to="/" target="_blank" className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-[#f5f0e8] transition-all">
                <Eye className="w-3.5 h-3.5" />View Store
              </Link>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white" style={{ background: "linear-gradient(135deg, #1a1208, #c9a84c)" }}>
                {user?.email?.[0]?.toUpperCase() ?? "A"}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-8 pt-6">
          <Outlet />
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden mx-3 mb-3 rounded-2xl bg-white/80 backdrop-blur-xl border border-[#e5e0d8]/60 shadow-[0_-4px_24px_-8px_rgba(26,18,8,0.08)] px-2 py-2 flex justify-around">
        {bottomNavItems.map((it) => {
          const active = pathname === it.to || (it.to !== "/admin" && pathname.startsWith(it.to));
          return (
            <Link key={it.to} to={it.to} className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${active ? "text-[#1a1208]" : "text-muted-foreground/50"}`}>
              <it.icon className={`w-5 h-5 ${active ? "text-[#c9a84c]" : ""}`} />
              <span className="text-[9px] font-medium">{it.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

const AdminLayout = () => (
  <AdminAuthProvider>
    <AdminShell />
  </AdminAuthProvider>
);

export default AdminLayout;
