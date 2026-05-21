import { ReactNode, useEffect, useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  LogOut, Package, Image as ImageIcon, Home, Menu, LayoutDashboard,
  ShoppingCart, Tag, Settings, Mail, Sparkles, MessageSquareQuote,
  Megaphone, Ticket, Search, Eye, EyeOff, ShieldAlert, Users, BarChart3,
  X,
} from "lucide-react";
import { AdminAuthProvider, useAdminAuth } from "@/lib/admin-auth";
import logo from "@/assets/mohika-mark.png";

/** Public helper kept for old imports (now backed by real auth) */
export const isAdmin = () => false;

/* ──────────────────────────────────────────────────────────
   Sign-in screen
   ────────────────────────────────────────────────────────── */
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
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#0f0f12]">
      {/* Background accents */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-amber-500/5 to-transparent blur-3xl" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tl from-violet-500/5 to-transparent blur-3xl" />
      </div>

      <form
        onSubmit={onSubmit}
        className="relative bg-[#1a1a22]/90 backdrop-blur-2xl rounded-3xl p-10 w-full max-w-md shadow-2xl border border-white/[0.06]"
      >
        <div className="flex items-center gap-3 mb-10">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-600/20 flex items-center justify-center p-2 border border-amber-500/20">
            <img src={logo} alt="Mohika Art" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="font-display text-2xl text-white leading-none">
              Mohika <span className="text-amber-400 italic">Art</span>
            </div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-white/40 mt-1">Admin Console</div>
          </div>
        </div>

        <h1 className="text-white text-2xl font-semibold mb-1">Welcome back</h1>
        <p className="text-sm text-white/50 mb-8">Sign in to manage your store.</p>

        <div className="space-y-4">
          <div>
            <label className="block text-[11px] uppercase tracking-widest mb-2 text-white/40 font-medium">Email</label>
            <input
              type="email"
              autoComplete="email"
              autoFocus
              required
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErr(""); }}
              placeholder="you@mohikaart.com"
              className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/25 focus:border-amber-500/40 focus:bg-white/[0.06] outline-none text-sm transition-all"
            />
          </div>
          <div>
            <label className="block text-[11px] uppercase tracking-widest mb-2 text-white/40 font-medium">Password</label>
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                autoComplete="current-password"
                required
                value={pw}
                onChange={(e) => { setPw(e.target.value); setErr(""); }}
                placeholder="••••••••"
                className="w-full px-4 py-3 pr-11 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/25 focus:border-amber-500/40 focus:bg-white/[0.06] outline-none text-sm transition-all"
              />
              <button
                type="button"
                onClick={() => setShow((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
              >
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {err && (
            <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20">
              <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span className="text-sm text-red-300">{err}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={busy || !email || !pw}
            className="w-full px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-semibold hover:from-amber-400 hover:to-amber-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-amber-500/20"
          >
            {busy ? "Signing in…" : "Sign In"}
          </button>
        </div>

        <Link to="/" className="block text-center mt-6 text-xs text-white/30 hover:text-white/60 transition-colors">
          ← Back to store
        </Link>
      </form>
    </div>
  );
};

/* ──────────────────────────────────────────────────────────
   Not Authorized screen
   ────────────────────────────────────────────────────────── */
const NotAuthorized = () => {
  const { signOut, user } = useAdminAuth();
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#0f0f12]">
      <div className="bg-[#1a1a22]/90 backdrop-blur-2xl border border-white/[0.06] rounded-3xl shadow-2xl p-10 max-w-md text-center">
        <ShieldAlert className="w-12 h-12 text-amber-400 mx-auto mb-4" />
        <h2 className="text-white text-2xl font-semibold mb-2">Access Denied</h2>
        <p className="text-sm text-white/50 mb-6">
          {user?.email ? <><strong className="text-white/70">{user.email}</strong> does not have admin privileges.</> : "You are not signed in as an admin."}
        </p>
        <div className="flex gap-3 justify-center">
          <Link to="/" className="px-5 py-2.5 rounded-xl border border-white/10 text-sm text-white/70 hover:bg-white/5 transition-colors">
            Back to store
          </Link>
          <button
            onClick={signOut}
            className="px-5 py-2.5 rounded-xl bg-white/10 text-sm text-white hover:bg-white/15 transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
};

/* ──────────────────────────────────────────────────────────
   Admin Shell - Modern Dark Theme Layout
   ────────────────────────────────────────────────────────── */
const AdminShell = ({ children }: { children?: ReactNode }) => {
  const { isAdmin, loading, user, signOut } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState("");
  const { pathname } = useLocation();

  useEffect(() => { setSidebarOpen(false); }, [pathname]);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f0f12]">
        <div className="flex items-center gap-3 text-white/50 text-sm">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          Loading…
        </div>
      </div>
    );
  }
  if (!user) return <AdminLogin />;
  if (!isAdmin) return <NotAuthorized />;

  const groups: { title: string; items: { to: string; icon: any; label: string }[] }[] = [
    { title: "Overview", items: [
      { to: "/admin", icon: LayoutDashboard, label: "Dashboard" },
      { to: "/admin/analytics", icon: BarChart3, label: "Analytics" },
    ]},
    { title: "Catalogue", items: [
      { to: "/admin/products", icon: Package, label: "Products" },
      { to: "/admin/categories", icon: Tag, label: "Categories" },
      { to: "/admin/coupons", icon: Ticket, label: "Coupons" },
    ]},
    { title: "Customers", items: [
      { to: "/admin/orders", icon: ShoppingCart, label: "Orders" },
      { to: "/admin/inquiries", icon: Mail, label: "Inquiries" },
      { to: "/admin/testimonials", icon: MessageSquareQuote, label: "Testimonials" },
    ]},
    { title: "Content", items: [
      { to: "/admin/hero", icon: Sparkles, label: "Hero Section" },
      { to: "/admin/announcements", icon: Megaphone, label: "Announcements" },
      { to: "/admin/images", icon: ImageIcon, label: "Site Images" },
    ]},
    { title: "System", items: [
      { to: "/admin/users", icon: Users, label: "Admin Users" },
      { to: "/admin/settings", icon: Settings, label: "Settings" },
    ]},
  ];

  const flatItems = groups.flatMap((g) => g.items);
  const bottomNavItems = [
    flatItems[0],
    flatItems.find((i) => i.to === "/admin/products")!,
    flatItems.find((i) => i.to === "/admin/orders")!,
    flatItems.find((i) => i.to === "/admin/inquiries")!,
    flatItems.find((i) => i.to === "/admin/settings")!,
  ];

  const filtered = search.trim()
    ? groups
        .map((g) => ({ ...g, items: g.items.filter((i) => i.label.toLowerCase().includes(search.toLowerCase())) }))
        .filter((g) => g.items.length > 0)
    : groups;

  // Get current page title
  const currentPage = flatItems.find(
    (i) => pathname === i.to || (i.to !== "/admin" && pathname.startsWith(i.to))
  );

  return (
    <div className="min-h-screen bg-[#0f0f12] flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen ${
          collapsed ? "w-[72px]" : "w-[260px]"
        } bg-[#14141b] border-r border-white/[0.04] flex flex-col transition-all duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className={`flex items-center gap-3 p-5 border-b border-white/[0.04] ${collapsed ? "justify-center px-3" : ""}`}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400/20 to-amber-600/10 flex items-center justify-center p-1.5 shrink-0 border border-amber-500/10">
            <img src={logo} alt="Mohika Art" className="w-full h-full object-contain" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <div className="font-display text-lg text-white leading-none">
                Mohika <span className="text-amber-400 italic">Art</span>
              </div>
              <div className="text-[9px] uppercase tracking-[0.3em] text-white/30 mt-1">Admin</div>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto lg:hidden w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-white/40"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        {!collapsed && (
          <div className="px-4 pt-4 pb-2">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <Search className="w-3.5 h-3.5 text-white/25 shrink-0" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search…"
                className="flex-1 outline-none bg-transparent text-xs text-white placeholder:text-white/25"
              />
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 px-3 pt-2 overflow-y-auto space-y-5 scrollbar-thin scrollbar-thumb-white/5">
          {filtered.map((group) => (
            <div key={group.title}>
              {!collapsed && (
                <div className="text-[10px] uppercase tracking-[0.2em] text-white/20 font-semibold px-3 mb-2">
                  {group.title}
                </div>
              )}
              <div className="space-y-0.5">
                {group.items.map((it) => {
                  const active = pathname === it.to || (it.to !== "/admin" && pathname.startsWith(it.to));
                  return (
                    <Link
                      key={it.to}
                      to={it.to}
                      title={collapsed ? it.label : undefined}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] transition-all group relative ${
                        active
                          ? "bg-amber-500/10 text-amber-400 font-medium"
                          : "text-white/45 hover:text-white/80 hover:bg-white/[0.03]"
                      } ${collapsed ? "justify-center" : ""}`}
                    >
                      {active && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-amber-400" />
                      )}
                      <it.icon className="w-[18px] h-[18px] shrink-0" />
                      {!collapsed && <span>{it.label}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
          {!collapsed && filtered.length === 0 && (
            <div className="text-xs text-white/20 px-3 py-6 text-center">No results</div>
          )}
        </nav>

        {/* Bottom section */}
        <div className={`p-4 border-t border-white/[0.04] space-y-2 ${collapsed ? "px-2" : ""}`}>
          {!collapsed && user && (
            <div className="px-3 py-2 text-[11px] text-white/30 truncate" title={user.email ?? undefined}>
              {user.email}
            </div>
          )}
          <Link
            to="/"
            target="_blank"
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[13px] text-white/40 hover:text-white/70 hover:bg-white/[0.03] transition-all ${collapsed ? "justify-center" : ""}`}
          >
            <Home className="w-4 h-4 shrink-0" />
            {!collapsed && "View Store"}
          </Link>
          <button
            onClick={signOut}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[13px] text-red-400/60 hover:text-red-400 hover:bg-red-500/5 transition-all w-full ${collapsed ? "justify-center" : ""}`}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!collapsed && "Sign Out"}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top header bar */}
        <header className="sticky top-0 z-30 bg-[#0f0f12]/80 backdrop-blur-xl border-b border-white/[0.04]">
          <div className="flex items-center justify-between h-16 px-4 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden w-9 h-9 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-white/60 transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="hidden lg:flex w-9 h-9 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] items-center justify-center text-white/40 transition-colors"
              >
                <Menu className="w-4 h-4" />
              </button>
              {currentPage && (
                <div className="flex items-center gap-2">
                  <currentPage.icon className="w-4 h-4 text-amber-400/70" />
                  <h1 className="text-white/90 text-sm font-medium">{currentPage.label}</h1>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/"
                target="_blank"
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-white/40 hover:text-white/70 hover:bg-white/[0.04] transition-all"
              >
                <Eye className="w-3.5 h-3.5" />
                Live Site
              </Link>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400/30 to-amber-600/30 flex items-center justify-center text-[11px] font-bold text-amber-300 border border-amber-500/20">
                {user?.email?.[0]?.toUpperCase() ?? "A"}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-[#14141b]/95 backdrop-blur-xl border-t border-white/[0.04] px-2 py-1.5 flex justify-around safe-area-inset-bottom">
        {bottomNavItems.map((it) => {
          const active = pathname === it.to || (it.to !== "/admin" && pathname.startsWith(it.to));
          return (
            <Link
              key={it.to}
              to={it.to}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${
                active ? "text-amber-400" : "text-white/35"
              }`}
            >
              <it.icon className="w-5 h-5" />
              <span className="text-[9px] font-medium">{it.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

/* ──────────────────────────────────────────────────────────
   Export wrapped with auth provider
   ────────────────────────────────────────────────────────── */
const AdminLayout = () => (
  <AdminAuthProvider>
    <AdminShell />
  </AdminAuthProvider>
);

export default AdminLayout;
