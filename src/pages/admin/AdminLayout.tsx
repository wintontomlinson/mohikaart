import { ReactNode, useEffect, useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  LogOut, Package, Image as ImageIcon, Home, Menu, LayoutDashboard,
  ShoppingCart, Tag, Settings, Mail, Sparkles, MessageSquareQuote,
  Megaphone, Ticket, Search, Eye, EyeOff, ShieldAlert, Users, BarChart3,
  Bell, X, Moon, Sun, ChevronRight,
} from "lucide-react";
import { AdminAuthProvider, useAdminAuth } from "@/lib/admin-auth";
import logo from "@/assets/mohika-mark.png";

/** Public helper kept for old imports (now backed by real auth) */
export const isAdmin = () => {
  return false;
};

/* ──────────────────────────────────────────────────────────
   Sign-in screen
   ────────────────────────────────────────────────────────── */
const AdminLogin = () => {
  const { signIn } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [pw, setPw]       = useState("");
  const [show, setShow]   = useState(false);
  const [err, setErr]     = useState("");
  const [busy, setBusy]   = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setBusy(true);
    const { error } = await signIn(email, pw);
    setBusy(false);
    if (error) setErr(error);
  };

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
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blush/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-champagne/15 blur-3xl pointer-events-none" />

      <form
        onSubmit={onSubmit}
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
            <div className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground mt-1">Admin Panel</div>
          </div>
        </div>

        <h1 className="font-display text-3xl mb-1">Welcome back</h1>
        <p className="text-sm text-muted-foreground mb-8">
          Sign in with your admin credentials to access the panel.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-[11px] uppercase tracking-widest mb-2 text-muted-foreground">Email</label>
            <input
              type="email"
              autoComplete="email"
              autoFocus
              required
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErr(""); }}
              placeholder="you@mohikaart.com"
              className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-foreground/50 outline-none text-sm transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-widest mb-2 text-muted-foreground">Password</label>
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                autoComplete="current-password"
                required
                value={pw}
                onChange={(e) => { setPw(e.target.value); setErr(""); }}
                placeholder="••••••••"
                className="w-full px-4 py-3 pr-11 rounded-xl bg-background border border-border focus:border-foreground/50 outline-none text-sm transition-colors"
              />
              <button
                type="button"
                onClick={() => setShow((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={show ? "Hide password" : "Show password"}
              >
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {err && (
            <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{err}</span>
            </p>
          )}

          <button
            type="submit"
            disabled={busy || !email || !pw}
            className="w-full px-6 py-3 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {busy ? "Signing in…" : "Sign In"}
          </button>
        </div>

        <Link to="/" className="block text-center mt-5 text-xs text-muted-foreground hover:text-foreground transition-colors">
          ← Back to site
        </Link>
      </form>
    </div>
  );
};

/* ──────────────────────────────────────────────────────────
   Authenticated-but-not-admin screen
   ────────────────────────────────────────────────────────── */
const NotAuthorized = () => {
  const { signOut, user } = useAdminAuth();
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-muted/30">
      <div className="bg-card border border-border rounded-2xl shadow-luxe p-10 max-w-md text-center">
        <ShieldAlert className="w-10 h-10 text-amber-600 mx-auto mb-4" />
        <h2 className="font-display text-2xl mb-2">Not authorized</h2>
        <p className="text-sm text-muted-foreground mb-6">
          {user?.email ? <><strong>{user.email}</strong> is signed in but not an admin.</> : "You are not signed in as an admin."}
          {" "}If this is your account, ask the site owner to grant admin access.
        </p>
        <div className="flex gap-3 justify-center">
          <Link to="/" className="px-5 py-2.5 rounded-full border border-border text-sm hover:bg-muted transition-colors">
            Back to site
          </Link>
          <button
            onClick={signOut}
            className="px-5 py-2.5 rounded-full bg-foreground text-background text-sm hover:opacity-85 transition-opacity"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
};

/* ──────────────────────────────────────────────────────────
   The upgraded admin shell with better UI
   ────────────────────────────────────────────────────────── */
const AdminShell = ({ children }: { children?: ReactNode }) => {
  const { isAdmin, loading, user, signOut } = useAdminAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch]         = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { pathname } = useLocation();
  const nav = useNavigate();

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-foreground flex items-center justify-center p-1.5 animate-pulse">
            <img src={logo} alt="" className="w-full h-full object-contain" />
          </div>
          <span className="text-sm text-muted-foreground">Loading admin…</span>
        </div>
      </div>
    );
  }
  if (!user) return <AdminLogin />;
  if (!isAdmin) return <NotAuthorized />;

  const groups: { title: string; items: { to: string; icon: any; label: string }[] }[] = [
    { title: "Overview", items: [
      { to: "/admin",           icon: LayoutDashboard, label: "Dashboard" },
      { to: "/admin/analytics", icon: BarChart3,       label: "Analytics" },
    ]},
    { title: "Catalogue", items: [
      { to: "/admin/products",    icon: Package, label: "Products" },
      { to: "/admin/categories",  icon: Tag,     label: "Categories" },
      { to: "/admin/coupons",     icon: Ticket,  label: "Coupons" },
    ]},
    { title: "Customers", items: [
      { to: "/admin/orders",     icon: ShoppingCart,        label: "Orders" },
      { to: "/admin/inquiries",  icon: Mail,                label: "Inquiries" },
      { to: "/admin/testimonials", icon: MessageSquareQuote, label: "Testimonials" },
    ]},
    { title: "Content", items: [
      { to: "/admin/hero",          icon: Sparkles,  label: "Hero Section" },
      { to: "/admin/announcements", icon: Megaphone, label: "Announcements" },
      { to: "/admin/images",        icon: ImageIcon, label: "Site Images" },
    ]},
    { title: "System", items: [
      { to: "/admin/users",    icon: Users,    label: "Admin Users" },
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

  // Current page title
  const currentPage = flatItems.find((i) => pathname === i.to || (i.to !== "/admin" && pathname.startsWith(i.to)));

  const SidebarContent = () => (
    <>
      {/* Logo area */}
      <div className="p-5 border-b border-white/[0.08] flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/95 flex items-center justify-center p-1.5 shrink-0 shadow-sm">
          <img src={logo} alt="Mohika Art" width={36} height={36} className="w-full h-full object-contain" />
        </div>
        {!sidebarCollapsed && (
          <div>
            <div className="font-display text-lg leading-none text-white/95" style={{ fontWeight: 350 }}>
              Mohika <span className="italic">Art</span>
            </div>
            <div className="text-[9px] uppercase tracking-[0.25em] text-white/50 mt-1.5">Admin Panel</div>
          </div>
        )}
      </div>

      {/* Search */}
      {!sidebarCollapsed && (
        <div className="p-4 pb-2">
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.08] hover:border-white/[0.15] transition-colors">
            <Search className="w-3.5 h-3.5 text-white/40 shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search menu..."
              className="flex-1 outline-none bg-transparent text-xs text-white placeholder:text-white/40"
            />
            {search && (
              <button onClick={() => setSearch("")} className="text-white/40 hover:text-white">
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-3 pt-1 overflow-y-auto space-y-5">
        {filtered.map((group) => (
          <div key={group.title}>
            {!sidebarCollapsed && (
              <div className="text-[9px] uppercase tracking-[0.22em] text-white/35 font-semibold px-3 mb-2">
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
                    title={sidebarCollapsed ? it.label : undefined}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] transition-all duration-200 group ${
                      active
                        ? "bg-gradient-to-r from-amber-500/15 to-amber-500/5 text-amber-300 font-medium shadow-[inset_0_0_0_1px_rgba(201,168,76,0.15)]"
                        : "text-white/60 hover:text-white hover:bg-white/[0.06]"
                    }`}
                  >
                    <it.icon className={`w-[18px] h-[18px] shrink-0 ${active ? "text-amber-400" : "group-hover:text-white/80"}`} />
                    {!sidebarCollapsed && <span>{it.label}</span>}
                    {active && !sidebarCollapsed && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-400" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-xs text-white/40 px-3 py-6 text-center">No matches</div>
        )}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-white/[0.08] space-y-1">
        {user && !sidebarCollapsed && (
          <div className="px-3 py-2 mb-1 flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-600/30 flex items-center justify-center text-[10px] font-bold text-amber-300 uppercase">
              {(user.email ?? "A").charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] text-white/70 truncate" title={user.email ?? undefined}>
                {user.email}
              </div>
              <div className="text-[9px] text-white/40">Admin</div>
            </div>
          </div>
        )}
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] text-white/55 hover:text-white hover:bg-white/[0.06] transition-all"
        >
          <Home className="w-4 h-4 shrink-0" />
          {!sidebarCollapsed && "View Site"}
        </Link>
        <button
          onClick={async () => { await signOut(); nav("/admin"); }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] text-white/55 hover:text-rose-300 hover:bg-rose-500/10 transition-all"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!sidebarCollapsed && "Sign out"}
        </button>
      </div>
    </>
  );

  return (
    <div
      className="flex"
      style={{
        minHeight: "100dvh",
        background: "linear-gradient(135deg, hsl(35 20% 96%) 0%, hsl(34 15% 94%) 100%)",
        marginTop: 0,
        paddingTop: 0,
      }}
    >
      {/* Desktop sidebar */}
      <aside
        className={`${sidebarCollapsed ? "w-[72px]" : "w-[260px]"} shrink-0 hidden md:flex flex-col sticky top-0 h-screen self-start transition-all duration-300`}
        style={{
          background: "linear-gradient(180deg, hsl(22 25% 12%) 0%, hsl(22 20% 16%) 100%)",
        }}
      >
        <SidebarContent />
        {/* Collapse toggle */}
        <button
          onClick={() => setSidebarCollapsed((v) => !v)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-foreground text-background flex items-center justify-center shadow-md hover:scale-110 transition-transform z-10"
          title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronRight className={`w-3.5 h-3.5 transition-transform ${sidebarCollapsed ? "" : "rotate-180"}`} />
        </button>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside
            className="absolute left-0 top-0 bottom-0 w-72 flex flex-col shadow-2xl"
            style={{
              background: "linear-gradient(180deg, hsl(22 25% 12%) 0%, hsl(22 20% 16%) 100%)",
            }}
          >
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Top header bar */}
        <header className="sticky top-0 z-40 backdrop-blur-xl border-b border-border/50" style={{ background: "rgba(252,250,246,0.85)" }}>
          <div className="flex items-center justify-between px-4 md:px-8 h-16">
            <div className="flex items-center gap-3">
              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(true)}
                className="md:hidden w-9 h-9 rounded-xl bg-foreground/5 flex items-center justify-center hover:bg-foreground/10 transition-colors"
                aria-label="Open menu"
              >
                <Menu className="w-4.5 h-4.5" />
              </button>

              {/* Breadcrumb / page title */}
              <div className="hidden md:flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Admin</span>
                {currentPage && (
                  <>
                    <ChevronRight className="w-3 h-3 text-muted-foreground/50" />
                    <span className="font-medium">{currentPage.label}</span>
                  </>
                )}
              </div>
              <div className="md:hidden font-display text-lg">
                {currentPage?.label ?? "Dashboard"}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Notifications placeholder */}
              <button className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-all relative">
                <Bell className="w-[18px] h-[18px]" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500" />
              </button>

              {/* View live site */}
              <Link
                to="/"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-all"
              >
                <Eye className="w-3.5 h-3.5" /> Live Site
              </Link>

              {/* User avatar */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center text-[11px] font-bold text-amber-800 uppercase border border-amber-200/60">
                {(user?.email ?? "A").charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* Mobile bottom nav */}
        <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border/50 flex backdrop-blur-xl" style={{ background: "rgba(252,250,246,0.92)" }}>
          {bottomNavItems.map((it) => {
            const active = pathname === it.to || (it.to !== "/admin" && pathname.startsWith(it.to));
            return (
              <Link
                key={it.to}
                to={it.to}
                className={`flex-1 flex flex-col items-center gap-1 py-3 text-[9.5px] tracking-wider transition-colors ${
                  active ? "text-amber-700 font-medium" : "text-muted-foreground"
                }`}
              >
                <it.icon className={`w-4.5 h-4.5 ${active ? "text-amber-600" : ""}`} />
                {it.label}
              </Link>
            );
          })}
        </nav>

        {/* Page content */}
        <main className="p-4 md:p-8 lg:p-10 pb-24 md:pb-10">
          {children ?? <Outlet />}
        </main>
      </div>
    </div>
  );
};

const AdminLayout = ({ children }: { children?: ReactNode }) => (
  <AdminAuthProvider>
    <AdminShell>{children}</AdminShell>
  </AdminAuthProvider>
);

export default AdminLayout;
