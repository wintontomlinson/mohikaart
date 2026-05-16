import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { formatINR } from "@/lib/site";
import {
  Package, ShoppingCart, IndianRupee, TrendingUp, Star, AlertCircle,
  Mail, Sparkles, Megaphone, Ticket, ArrowUpRight, MessageSquareQuote,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip,
  PieChart, Pie, Cell, Legend,
} from "recharts";

type Order = {
  id: string;
  status: string;
  total: number;
  created_at: string;
  customer_name: string;
  order_number: string;
  items: any;
};

type Stats = {
  totalProducts: number;
  featuredProducts: number;
  outOfStock: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  monthRevenue: number;
  weekRevenue: number;
  recentOrders: Order[];
  newInquiries: number;
  totalInquiries: number;
  ordersByDay: { day: string; orders: number; revenue: number }[];
  ordersByStatus: { name: string; value: number; color: string }[];
  topProducts: { name: string; qty: number; revenue: number }[];
};

const STATUS_COLORS: Record<string, string> = {
  pending:   "#f59e0b",
  confirmed: "#3b82f6",
  shipped:   "#6366f1",
  delivered: "#10b981",
  cancelled: "#ef4444",
};

const fmtDay = (d: Date) =>
  d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [{ data: products }, { data: orders }, { data: inquiries }] = await Promise.all([
        supabase.from("products").select("id,name,featured,in_stock,price"),
        supabase.from("orders").select("id,status,total,created_at,customer_name,order_number,items").order("created_at", { ascending: false }),
        supabase.from("inquiries").select("id,status"),
      ]);

      const allOrders: Order[] = (orders ?? []) as Order[];
      const allInquiries = inquiries ?? [];

      // Last 14 days revenue chart
      const ordersByDay: { day: string; orders: number; revenue: number }[] = [];
      for (let i = 13; i >= 0; i--) {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() - i);
        const next = new Date(d);
        next.setDate(d.getDate() + 1);
        const dayOrders = allOrders.filter((o) => {
          const t = new Date(o.created_at).getTime();
          return t >= d.getTime() && t < next.getTime();
        });
        ordersByDay.push({
          day: fmtDay(d),
          orders: dayOrders.length,
          revenue: dayOrders.reduce((s, o) => s + (Number(o.total) || 0), 0),
        });
      }

      // Orders by status
      const ordersByStatus = Object.keys(STATUS_COLORS).map((s) => ({
        name: s,
        value: allOrders.filter((o) => o.status === s).length,
        color: STATUS_COLORS[s],
      })).filter((s) => s.value > 0);

      // Top products by qty across order items
      const productMap = new Map<string, { qty: number; revenue: number }>();
      allOrders.forEach((o) => {
        const items = Array.isArray(o.items) ? o.items : [];
        items.forEach((it: any) => {
          const name = it?.name ?? "Unknown";
          const qty = Number(it?.qty) || 0;
          const price = Number(it?.price) || 0;
          const existing = productMap.get(name) ?? { qty: 0, revenue: 0 };
          productMap.set(name, { qty: existing.qty + qty, revenue: existing.revenue + qty * price });
        });
      });
      const topProducts = Array.from(productMap.entries())
        .map(([name, v]) => ({ name, ...v }))
        .sort((a, b) => b.qty - a.qty)
        .slice(0, 5);

      const now = Date.now();
      const monthAgo = now - 30 * 24 * 3600 * 1000;
      const weekAgo  = now -  7 * 24 * 3600 * 1000;

      setStats({
        totalProducts: products?.length ?? 0,
        featuredProducts: products?.filter((p) => p.featured).length ?? 0,
        outOfStock: products?.filter((p) => !p.in_stock).length ?? 0,
        totalOrders: allOrders.length,
        pendingOrders: allOrders.filter((o) => o.status === "pending").length,
        totalRevenue: allOrders.reduce((s, o) => s + (Number(o.total) || 0), 0),
        monthRevenue: allOrders
          .filter((o) => new Date(o.created_at).getTime() >= monthAgo)
          .reduce((s, o) => s + (Number(o.total) || 0), 0),
        weekRevenue: allOrders
          .filter((o) => new Date(o.created_at).getTime() >= weekAgo)
          .reduce((s, o) => s + (Number(o.total) || 0), 0),
        recentOrders: allOrders.slice(0, 5),
        newInquiries: allInquiries.filter((i) => i.status === "new").length,
        totalInquiries: allInquiries.length,
        ordersByDay,
        ordersByStatus,
        topProducts,
      });
      setLoading(false);
    };
    load();
  }, []);

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
        Loading dashboard…
      </div>
    );

  const s = stats!;

  const statCards = [
    { label: "Revenue",       value: formatINR(s.totalRevenue), sub: `₹${s.monthRevenue.toLocaleString()} this month`, icon: IndianRupee, color: "from-emerald-500/10 to-emerald-500/5", iconColor: "text-emerald-600", link: "/admin/orders" },
    { label: "Orders",        value: s.totalOrders,             sub: `${s.pendingOrders} pending`,                     icon: ShoppingCart, color: "from-amber-500/10 to-amber-500/5", iconColor: "text-amber-600", link: "/admin/orders" },
    { label: "Products",      value: s.totalProducts,           sub: `${s.featuredProducts} featured`,                 icon: Package,      color: "from-violet-500/10 to-violet-500/5", iconColor: "text-violet-600", link: "/admin/products" },
    { label: "Out of Stock",  value: s.outOfStock,              sub: "need restocking",                                icon: AlertCircle,  color: "from-rose-500/10 to-rose-500/5", iconColor: "text-rose-600", link: "/admin/products" },
    { label: "Inquiries",     value: s.totalInquiries,          sub: `${s.newInquiries} new`,                          icon: Mail,         color: "from-sky-500/10 to-sky-500/5", iconColor: "text-sky-600", link: "/admin/inquiries" },
  ];

  const statusColor: Record<string, string> = {
    pending:   "bg-amber-100 text-amber-700",
    confirmed: "bg-blue-100 text-blue-700",
    shipped:   "bg-indigo-100 text-indigo-700",
    delivered: "bg-emerald-100 text-emerald-700",
    cancelled: "bg-rose-100 text-rose-700",
  };

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{greeting} 👋</p>
          <h1 className="font-display text-4xl mt-1">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Last 7 days: {formatINR(s.weekRevenue)} ·{" "}
            {s.ordersByDay.slice(-7).reduce((sum, d) => sum + d.orders, 0)} orders
          </p>
        </div>
        <Link
          to="/"
          target="_blank"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border hover:bg-muted text-xs"
        >
          <ArrowUpRight className="w-3.5 h-3.5" /> View Live Site
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((c) => (
          <Link
            key={c.label}
            to={c.link}
            className={`relative bg-background rounded-2xl border border-border p-5 hover:border-foreground/20 hover:shadow-sm transition-all overflow-hidden group`}
          >
            <div className={`absolute -top-8 -right-8 w-24 h-24 rounded-full bg-gradient-to-br ${c.color} blur-2xl opacity-60`} />
            <div className={`relative w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${c.iconColor} bg-current/10`}>
              <c.icon className="w-5 h-5" />
            </div>
            <div className="relative font-display text-2xl xl:text-3xl">{c.value}</div>
            <div className="relative text-xs font-medium mt-0.5">{c.label}</div>
            <div className="relative text-[11px] text-muted-foreground mt-0.5">{c.sub}</div>
          </Link>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Revenue chart */}
        <div className="lg:col-span-2 bg-background rounded-2xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display text-xl">Revenue Trend</h2>
              <p className="text-xs text-muted-foreground">Last 14 days</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Revenue (₹)
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={s.ordersByDay} margin={{ top: 5, right: 0, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(38, 72%, 62%)" />
                  <stop offset="100%" stopColor="hsl(34, 52%, 42%)" />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(25 10% 55%)" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(25 10% 55%)" }} width={40} />
              <Tooltip
                cursor={{ fill: "hsl(34 28% 92% / 0.4)" }}
                contentStyle={{
                  background: "hsl(36 42% 99%)",
                  border: "1px solid hsl(34 28% 87%)",
                  borderRadius: "0.75rem",
                  fontSize: "12px",
                  boxShadow: "0 8px 28px -8px hsl(22 22% 22%/0.18)",
                }}
                formatter={(value: number, key: string) =>
                  key === "revenue" ? [formatINR(value), "Revenue"] : [value, "Orders"]
                }
              />
              <Bar dataKey="revenue" fill="url(#goldGrad)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status pie chart */}
        <div className="bg-background rounded-2xl border border-border p-5">
          <h2 className="font-display text-xl mb-1">Order Status</h2>
          <p className="text-xs text-muted-foreground mb-4">Breakdown by status</p>
          {s.ordersByStatus.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={s.ordersByStatus}
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {s.ordersByStatus.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "hsl(36 42% 99%)",
                    border: "1px solid hsl(34 28% 87%)",
                    borderRadius: "0.75rem",
                    fontSize: "12px",
                    textTransform: "capitalize",
                  }}
                />
                <Legend
                  iconType="circle"
                  wrapperStyle={{ fontSize: "11px", textTransform: "capitalize" }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-xs text-muted-foreground">
              No orders yet
            </div>
          )}
        </div>
      </div>

      {/* Recent orders + Top products */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-background rounded-2xl border border-border overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-border">
            <h2 className="font-display text-xl">Recent Orders</h2>
            <Link to="/admin/orders" className="text-xs text-foreground/50 hover:text-foreground tracking-wide">
              View all →
            </Link>
          </div>
          {s.recentOrders.length === 0 ? (
            <div className="p-10 text-center text-sm text-muted-foreground">
              No orders yet.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {s.recentOrders.map((o) => (
                <div key={o.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-muted/30 transition-colors">
                  <div>
                    <div className="text-sm font-medium">#{o.order_number}</div>
                    <div className="text-xs text-muted-foreground">{o.customer_name}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full font-medium ${statusColor[o.status] ?? "bg-muted text-muted-foreground"}`}>
                      {o.status}
                    </span>
                    <span className="text-sm font-medium tabular-nums">{formatINR(o.total)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-background rounded-2xl border border-border overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-border">
            <h2 className="font-display text-xl">Top Products</h2>
            <Link to="/admin/products" className="text-xs text-foreground/50 hover:text-foreground tracking-wide">
              Manage →
            </Link>
          </div>
          {s.topProducts.length === 0 ? (
            <div className="p-10 text-center text-sm text-muted-foreground">
              No order items yet.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {s.topProducts.map((p, i) => (
                <div key={p.name} className="flex items-center justify-between px-5 py-3.5 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-display text-2xl text-amber-700/70 w-8 shrink-0">
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">{p.name}</div>
                      <div className="text-xs text-muted-foreground">{p.qty} sold</div>
                    </div>
                  </div>
                  <span className="text-sm font-medium tabular-nums shrink-0">
                    {formatINR(p.revenue)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick links to all admin areas */}
      <div>
        <h2 className="font-display text-xl mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { to: "/admin/products",      icon: Package,           label: "Manage Products",     desc: "Add, edit or remove products" },
            { to: "/admin/categories",    icon: TrendingUp,        label: "Categories",          desc: "Organize your catalogue" },
            { to: "/admin/coupons",       icon: Ticket,            label: "Coupons",             desc: "Create discount codes" },
            { to: "/admin/orders",        icon: ShoppingCart,      label: "Orders",              desc: "Track & fulfill orders" },
            { to: "/admin/inquiries",     icon: Mail,              label: "Inquiries",           desc: "Reply to contact forms" },
            { to: "/admin/testimonials",  icon: MessageSquareQuote,label: "Testimonials",        desc: "Manage customer reviews" },
            { to: "/admin/hero",          icon: Sparkles,          label: "Hero Section",        desc: "Edit headline & stats" },
            { to: "/admin/announcements", icon: Megaphone,         label: "Announcements",       desc: "Top bar messages" },
            { to: "/admin/images",        icon: Star,              label: "Site Images",         desc: "Update photos" },
          ].map((q) => (
            <Link
              key={q.to}
              to={q.to}
              className="bg-background rounded-2xl border border-border p-5 hover:border-foreground/25 hover:shadow-sm transition-all group"
            >
              <q.icon className="w-5 h-5 mb-3 text-muted-foreground group-hover:text-amber-600 transition-colors" />
              <div className="font-medium text-sm">{q.label}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{q.desc}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
