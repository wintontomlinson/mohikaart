import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { formatINR } from "@/lib/site";
import {
  Package, ShoppingCart, IndianRupee, TrendingUp, TrendingDown, Star, AlertCircle,
  Mail, Sparkles, Megaphone, Ticket, ArrowUpRight, MessageSquareQuote,
  BarChart3, Users, Clock, CheckCircle2, Truck, Eye,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid,
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
  prevWeekRevenue: number;
  prevMonthRevenue: number;
  todayRevenue: number;
  todayOrders: number;
  recentOrders: Order[];
  newInquiries: number;
  totalInquiries: number;
  ordersByDay: { day: string; revenue: number; orders: number }[];
  ordersByStatus: { name: string; value: number; color: string }[];
  topProducts: { name: string; qty: number; revenue: number }[];
};

const STATUS_COLORS: Record<string, string> = {
  pending:           "#f59e0b",
  payment_submitted: "#06b6d4",
  confirmed:         "#3b82f6",
  shipped:           "#6366f1",
  delivered:         "#10b981",
  cancelled:         "#ef4444",
};

const STATUS_ICONS: Record<string, any> = {
  pending:           Clock,
  payment_submitted: IndianRupee,
  confirmed:         CheckCircle2,
  shipped:           Truck,
  delivered:         CheckCircle2,
  cancelled:        AlertCircle,
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
      const prevWeekStart = now - 14 * 24 * 3600 * 1000;
      const prevMonthStart = now - 60 * 24 * 3600 * 1000;
      const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);

      setStats({
        totalProducts: products?.length ?? 0,
        featuredProducts: products?.filter((p) => p.featured).length ?? 0,
        outOfStock: products?.filter((p) => !p.in_stock).length ?? 0,
        totalOrders: allOrders.length,
        pendingOrders: allOrders.filter((o) => o.status === "pending").length,
        totalRevenue: allOrders.filter((o) => o.status !== "cancelled").reduce((s, o) => s + (Number(o.total) || 0), 0),
        monthRevenue: allOrders
          .filter((o) => new Date(o.created_at).getTime() >= monthAgo && o.status !== "cancelled")
          .reduce((s, o) => s + (Number(o.total) || 0), 0),
        weekRevenue: allOrders
          .filter((o) => new Date(o.created_at).getTime() >= weekAgo && o.status !== "cancelled")
          .reduce((s, o) => s + (Number(o.total) || 0), 0),
        prevWeekRevenue: allOrders
          .filter((o) => {
            const t = new Date(o.created_at).getTime();
            return t >= prevWeekStart && t < weekAgo && o.status !== "cancelled";
          })
          .reduce((s, o) => s + (Number(o.total) || 0), 0),
        prevMonthRevenue: allOrders
          .filter((o) => {
            const t = new Date(o.created_at).getTime();
            return t >= prevMonthStart && t < monthAgo && o.status !== "cancelled";
          })
          .reduce((s, o) => s + (Number(o.total) || 0), 0),
        todayRevenue: allOrders
          .filter((o) => new Date(o.created_at).getTime() >= todayStart.getTime() && o.status !== "cancelled")
          .reduce((s, o) => s + (Number(o.total) || 0), 0),
        todayOrders: allOrders
          .filter((o) => new Date(o.created_at).getTime() >= todayStart.getTime())
          .length,
        recentOrders: allOrders.slice(0, 6),
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
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
          <span className="text-sm text-muted-foreground">Loading dashboard…</span>
        </div>
      </div>
    );

  const s = stats!;

  const weekChange = s.prevWeekRevenue > 0 ? ((s.weekRevenue - s.prevWeekRevenue) / s.prevWeekRevenue) * 100 : null;

  const statCards = [
    { label: "Total Revenue", value: formatINR(s.totalRevenue), sub: `${formatINR(s.monthRevenue)} this month`, icon: IndianRupee, gradient: "from-emerald-500 to-emerald-600", link: "/admin/analytics" },
    { label: "Orders", value: s.totalOrders, sub: `${s.pendingOrders} pending`, icon: ShoppingCart, gradient: "from-amber-500 to-orange-500", link: "/admin/orders" },
    { label: "Products", value: s.totalProducts, sub: `${s.featuredProducts} featured`, icon: Package, gradient: "from-violet-500 to-purple-600", link: "/admin/products" },
    { label: "Inquiries", value: s.totalInquiries, sub: `${s.newInquiries} new`, icon: Mail, gradient: "from-sky-500 to-blue-600", link: "/admin/inquiries" },
  ];

  const statusColor: Record<string, string> = {
    pending:           "bg-amber-50 text-amber-700 border-amber-200",
    payment_submitted: "bg-cyan-50 text-cyan-700 border-cyan-200",
    confirmed:         "bg-blue-50 text-blue-700 border-blue-200",
    shipped:           "bg-indigo-50 text-indigo-700 border-indigo-200",
    delivered:         "bg-emerald-50 text-emerald-700 border-emerald-200",
    cancelled:         "bg-rose-50 text-rose-700 border-rose-200",
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{greeting} 👋</p>
          <h1 className="font-display text-3xl md:text-4xl mt-1">Dashboard</h1>
        </div>
        <div className="flex items-center gap-3">
          {weekChange !== null && (
            <div className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${weekChange >= 0 ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
              {weekChange >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              {weekChange >= 0 ? "+" : ""}{weekChange.toFixed(1)}% vs last week
            </div>
          )}
          <Link
            to="/admin/analytics"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border hover:bg-white hover:shadow-sm text-xs font-medium transition-all"
          >
            <BarChart3 className="w-3.5 h-3.5" /> View Analytics
          </Link>
        </div>
      </div>

      {/* Today's highlight */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200/50 p-5 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-amber-900">Today's Performance</p>
            <p className="text-xs text-amber-700/70 mt-0.5">
              {s.todayOrders} order{s.todayOrders !== 1 ? "s" : ""} · {formatINR(s.todayRevenue)} revenue
            </p>
          </div>
        </div>
        {s.outOfStock > 0 && (
          <Link to="/admin/products" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-100 text-rose-700 text-xs font-medium hover:bg-rose-200 transition-colors">
            <AlertCircle className="w-3.5 h-3.5" /> {s.outOfStock} out of stock
          </Link>
        )}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((c) => (
          <Link
            key={c.label}
            to={c.link}
            className="relative bg-white rounded-2xl border border-border/60 p-5 hover:shadow-md hover:border-border transition-all group overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-20 h-20 rounded-full bg-gradient-to-br ${c.gradient} opacity-[0.08] -translate-y-1/3 translate-x-1/3 group-hover:opacity-[0.12] transition-opacity`} />
            <div className={`relative w-10 h-10 rounded-xl bg-gradient-to-br ${c.gradient} flex items-center justify-center mb-3 shadow-sm`}>
              <c.icon className="w-5 h-5 text-white" />
            </div>
            <div className="relative font-display text-2xl xl:text-3xl">{c.value}</div>
            <div className="relative text-xs font-medium text-foreground/70 mt-1">{c.label}</div>
            <div className="relative text-[11px] text-muted-foreground mt-0.5">{c.sub}</div>
            <ArrowUpRight className="absolute top-4 right-4 w-4 h-4 text-muted-foreground/30 group-hover:text-foreground/50 transition-colors" />
          </Link>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Revenue chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-border/60 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display text-xl">Revenue Trend</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Last 14 days</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500" /> Revenue
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={s.ordersByDay} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="goldGradDash" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(38, 72%, 58%)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(38, 72%, 58%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(34 28% 92%)" vertical={false} />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(25 10% 55%)" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(25 10% 55%)" }} width={50} />
              <Tooltip
                cursor={{ stroke: "hsl(34 58% 52%)", strokeDasharray: "4 4" }}
                contentStyle={{
                  background: "white",
                  border: "1px solid hsl(34 28% 90%)",
                  borderRadius: "12px",
                  fontSize: "12px",
                  boxShadow: "0 8px 28px -8px hsl(22 22% 22%/0.12)",
                  padding: "10px 14px",
                }}
                formatter={(value: number, key: string) =>
                  key === "revenue" ? [formatINR(value), "Revenue"] : [value, "Orders"]
                }
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="hsl(38, 72%, 52%)"
                strokeWidth={2.5}
                fill="url(#goldGradDash)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Status pie chart */}
        <div className="bg-white rounded-2xl border border-border/60 p-6">
          <h2 className="font-display text-xl mb-1">Order Status</h2>
          <p className="text-xs text-muted-foreground mb-4">Breakdown by current status</p>
          {s.ordersByStatus.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={s.ordersByStatus}
                  innerRadius={55}
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
                    background: "white",
                    border: "1px solid hsl(34 28% 90%)",
                    borderRadius: "12px",
                    fontSize: "12px",
                    textTransform: "capitalize",
                  }}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
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
        <div className="bg-white rounded-2xl border border-border/60 overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-border/50">
            <div>
              <h2 className="font-display text-xl">Recent Orders</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Latest activity</p>
            </div>
            <Link to="/admin/orders" className="text-xs text-amber-700 hover:text-amber-900 font-medium tracking-wide flex items-center gap-1 hover:gap-1.5 transition-all">
              View all <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          {s.recentOrders.length === 0 ? (
            <div className="p-10 text-center text-sm text-muted-foreground">
              No orders yet. Share your store to get started!
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {s.recentOrders.map((o) => {
                const StatusIcon = STATUS_ICONS[o.status] ?? Clock;
                return (
                  <div key={o.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-amber-50/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${statusColor[o.status]?.split(" ")[0] ?? "bg-muted"}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">#{o.order_number}</div>
                        <div className="text-xs text-muted-foreground">{o.customer_name}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full font-medium border ${statusColor[o.status] ?? "bg-muted text-muted-foreground border-border"}`}>
                        {o.status.replace("_", " ")}
                      </span>
                      <span className="text-sm font-semibold tabular-nums">{formatINR(o.total)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-border/60 overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-border/50">
            <div>
              <h2 className="font-display text-xl">Top Products</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Best sellers by quantity</p>
            </div>
            <Link to="/admin/products" className="text-xs text-amber-700 hover:text-amber-900 font-medium tracking-wide flex items-center gap-1 hover:gap-1.5 transition-all">
              Manage <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          {s.topProducts.length === 0 ? (
            <div className="p-10 text-center text-sm text-muted-foreground">
              No order items yet.
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {s.topProducts.map((p, i) => (
                <div key={p.name} className="flex items-center justify-between px-5 py-3.5 hover:bg-amber-50/30 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-display text-lg ${
                      i === 0 ? "bg-amber-100 text-amber-700" : i === 1 ? "bg-slate-100 text-slate-600" : "bg-orange-50 text-orange-600"
                    }`}>
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">{p.name}</div>
                      <div className="text-xs text-muted-foreground">{p.qty} sold</div>
                    </div>
                  </div>
                  <span className="text-sm font-semibold tabular-nums shrink-0">
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
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl">Quick Actions</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { to: "/admin/analytics",     icon: BarChart3,         label: "Analytics",           desc: "Revenue & insights",         color: "text-emerald-600 bg-emerald-50" },
            { to: "/admin/products",      icon: Package,           label: "Manage Products",     desc: "Add or edit products",        color: "text-violet-600 bg-violet-50" },
            { to: "/admin/orders",        icon: ShoppingCart,      label: "Orders",              desc: "Track & fulfill",             color: "text-amber-600 bg-amber-50" },
            { to: "/admin/coupons",       icon: Ticket,            label: "Coupons",             desc: "Create discounts",            color: "text-pink-600 bg-pink-50" },
            { to: "/admin/inquiries",     icon: Mail,              label: "Inquiries",           desc: "Reply to customers",          color: "text-sky-600 bg-sky-50" },
            { to: "/admin/testimonials",  icon: MessageSquareQuote,label: "Testimonials",        desc: "Manage reviews",              color: "text-orange-600 bg-orange-50" },
            { to: "/admin/hero",          icon: Sparkles,          label: "Hero Section",        desc: "Edit homepage hero",          color: "text-amber-600 bg-amber-50" },
            { to: "/admin/announcements", icon: Megaphone,         label: "Announcements",       desc: "Top bar messages",            color: "text-indigo-600 bg-indigo-50" },
          ].map((q) => (
            <Link
              key={q.to}
              to={q.to}
              className="bg-white rounded-xl border border-border/60 p-4 hover:shadow-md hover:border-border transition-all group flex items-start gap-3"
            >
              <div className={`w-9 h-9 rounded-lg ${q.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                <q.icon className="w-4.5 h-4.5" />
              </div>
              <div>
                <div className="font-medium text-sm">{q.label}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{q.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
