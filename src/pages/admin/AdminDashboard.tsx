import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { formatINR } from "@/lib/site";
import {
  Package, ShoppingCart, IndianRupee, TrendingUp, TrendingDown,
  Mail, Sparkles, MessageSquareQuote, BarChart3, Users, Ticket, Tag,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip,
  PieChart, Pie, Cell,
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
  shipped:           "#8b5cf6",
  delivered:         "#10b981",
  cancelled:         "#ef4444",
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

      const ordersByDay: { day: string; revenue: number; orders: number }[] = [];
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

      const ordersByStatus = Object.keys(STATUS_COLORS).map((s) => ({
        name: s.replace("_", " "),
        value: allOrders.filter((o) => o.status === s).length,
        color: STATUS_COLORS[s],
      })).filter((s) => s.value > 0);

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
      const weekAgo = now - 7 * 24 * 3600 * 1000;
      const prevWeekStart = now - 14 * 24 * 3600 * 1000;

      const weekRevenue = allOrders
        .filter((o) => new Date(o.created_at).getTime() >= weekAgo)
        .reduce((s, o) => s + (Number(o.total) || 0), 0);

      const prevWeekRevenue = allOrders
        .filter((o) => {
          const t = new Date(o.created_at).getTime();
          return t >= prevWeekStart && t < weekAgo;
        })
        .reduce((s, o) => s + (Number(o.total) || 0), 0);

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
        weekRevenue,
        prevWeekRevenue,
        recentOrders: allOrders.slice(0, 6),
        newInquiries: allInquiries.filter((i: any) => i.status === "new").length,
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
      <div className="flex items-center justify-center h-48 text-white/40 text-sm">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          Loading dashboard…
        </span>
      </div>
    );

  const s = stats!;
  const weekChange = s.prevWeekRevenue > 0
    ? ((s.weekRevenue - s.prevWeekRevenue) / s.prevWeekRevenue) * 100
    : null;

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      {/* Header */}
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <p className="text-sm text-white/40">{greeting} 👋</p>
          <h1 className="text-white text-3xl font-semibold mt-1">Dashboard</h1>
          <p className="text-sm text-white/40 mt-1">
            Last 7 days: {formatINR(s.weekRevenue)} ·{" "}
            {s.ordersByDay.slice(-7).reduce((sum, d) => sum + d.orders, 0)} orders
          </p>
        </div>
        <Link
          to="/admin/analytics"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] text-xs text-white/60 hover:text-white/90 transition-all"
        >
          <BarChart3 className="w-3.5 h-3.5" /> Full Analytics
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <KPICard
          label="Revenue"
          value={formatINR(s.totalRevenue)}
          sub={`₹${s.monthRevenue.toLocaleString("en-IN")} this month`}
          icon={IndianRupee}
          color="emerald"
          change={weekChange}
          to="/admin/orders"
        />
        <KPICard
          label="Orders"
          value={s.totalOrders.toString()}
          sub={`${s.pendingOrders} pending`}
          icon={ShoppingCart}
          color="amber"
          to="/admin/orders"
        />
        <KPICard
          label="Products"
          value={s.totalProducts.toString()}
          sub={`${s.featuredProducts} featured`}
          icon={Package}
          color="violet"
          to="/admin/products"
        />
        <KPICard
          label="Inquiries"
          value={s.totalInquiries.toString()}
          sub={`${s.newInquiries} new`}
          icon={Mail}
          color="sky"
          to="/admin/inquiries"
        />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-[#1a1a22] rounded-2xl border border-white/[0.04] p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-white font-semibold">Revenue Trend</h2>
              <p className="text-xs text-white/30 mt-0.5">Last 14 days</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-white/30">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> Revenue
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={s.ordersByDay}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "rgba(255,255,255,0.2)" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "rgba(255,255,255,0.2)" }}
                width={45}
              />
              <Tooltip
                contentStyle={{
                  background: "#1a1a22",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "12px",
                  fontSize: "12px",
                  color: "#fff",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                }}
                labelStyle={{ color: "rgba(255,255,255,0.5)" }}
                formatter={(value: number) => [formatINR(value), "Revenue"]}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#f59e0b"
                strokeWidth={2}
                fill="url(#revGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Order Status Pie */}
        <div className="bg-[#1a1a22] rounded-2xl border border-white/[0.04] p-5">
          <h2 className="text-white font-semibold mb-1">Order Status</h2>
          <p className="text-xs text-white/30 mb-4">Distribution breakdown</p>
          {s.ordersByStatus.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={s.ordersByStatus}
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {s.ordersByStatus.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "#1a1a22",
                      border: "1px solid rgba(255,255,255,0.06)",
                      borderRadius: "12px",
                      fontSize: "11px",
                      color: "#fff",
                      textTransform: "capitalize",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {s.ordersByStatus.slice(0, 4).map((st) => (
                  <div key={st.name} className="flex items-center gap-2 text-xs">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: st.color }} />
                    <span className="text-white/40 capitalize truncate">{st.name}</span>
                    <span className="text-white/70 ml-auto font-medium">{st.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-xs text-white/20">
              No orders yet
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders + Top Products */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Recent Orders */}
        <div className="bg-[#1a1a22] rounded-2xl border border-white/[0.04] overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-white/[0.04]">
            <h2 className="text-white font-semibold">Recent Orders</h2>
            <Link to="/admin/orders" className="text-xs text-amber-400/70 hover:text-amber-400 transition-colors">
              View all →
            </Link>
          </div>
          {s.recentOrders.length === 0 ? (
            <div className="p-10 text-center text-sm text-white/20">No orders yet.</div>
          ) : (
            <div className="divide-y divide-white/[0.04]">
              {s.recentOrders.map((o) => (
                <div key={o.id} className="flex items-center justify-between px-5 py-3 hover:bg-white/[0.02] transition-colors">
                  <div>
                    <div className="text-sm text-white/80 font-medium">#{o.order_number}</div>
                    <div className="text-xs text-white/30">{o.customer_name}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={o.status} />
                    <span className="text-sm text-white/80 font-medium tabular-nums">
                      {formatINR(o.total)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Products */}
        <div className="bg-[#1a1a22] rounded-2xl border border-white/[0.04] overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-white/[0.04]">
            <h2 className="text-white font-semibold">Top Products</h2>
            <Link to="/admin/products" className="text-xs text-amber-400/70 hover:text-amber-400 transition-colors">
              Manage →
            </Link>
          </div>
          {s.topProducts.length === 0 ? (
            <div className="p-10 text-center text-sm text-white/20">No sales data yet.</div>
          ) : (
            <div className="divide-y divide-white/[0.04]">
              {s.topProducts.map((p, i) => (
                <div key={p.name} className="flex items-center justify-between px-5 py-3 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-lg font-semibold text-amber-400/50 w-6 shrink-0 tabular-nums">{i + 1}</span>
                    <div className="min-w-0">
                      <div className="text-sm text-white/80 font-medium truncate">{p.name}</div>
                      <div className="text-xs text-white/30">{p.qty} sold</div>
                    </div>
                  </div>
                  <span className="text-sm text-white/70 font-medium tabular-nums shrink-0">
                    {formatINR(p.revenue)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-white font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {[
            { to: "/admin/products", icon: Package, label: "Products", desc: "Manage catalogue" },
            { to: "/admin/orders", icon: ShoppingCart, label: "Orders", desc: "Track & fulfill" },
            { to: "/admin/categories", icon: Tag, label: "Categories", desc: "Organize products" },
            { to: "/admin/coupons", icon: Ticket, label: "Coupons", desc: "Discount codes" },
            { to: "/admin/inquiries", icon: Mail, label: "Inquiries", desc: "Customer messages" },
            { to: "/admin/testimonials", icon: MessageSquareQuote, label: "Reviews", desc: "Manage reviews" },
            { to: "/admin/hero", icon: Sparkles, label: "Hero", desc: "Edit homepage" },
            { to: "/admin/users", icon: Users, label: "Team", desc: "Admin access" },
          ].map((q) => (
            <Link
              key={q.to}
              to={q.to}
              className="bg-[#1a1a22] rounded-2xl border border-white/[0.04] p-4 hover:border-white/[0.1] hover:bg-[#1e1e28] transition-all group"
            >
              <q.icon className="w-5 h-5 mb-3 text-white/30 group-hover:text-amber-400/70 transition-colors" />
              <div className="text-sm text-white/80 font-medium">{q.label}</div>
              <div className="text-[11px] text-white/30 mt-0.5">{q.desc}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ── Helper Components ── */

const KPICard = ({
  label, value, sub, icon: Icon, color, change, to,
}: {
  label: string;
  value: string;
  sub: string;
  icon: any;
  color: string;
  change?: number | null;
  to: string;
}) => {
  const colors: Record<string, { icon: string; glow: string }> = {
    emerald: { icon: "text-emerald-400", glow: "from-emerald-500/10" },
    amber:   { icon: "text-amber-400",   glow: "from-amber-500/10" },
    violet:  { icon: "text-violet-400",  glow: "from-violet-500/10" },
    sky:     { icon: "text-sky-400",     glow: "from-sky-500/10" },
  };
  const c = colors[color] ?? colors.amber;

  return (
    <Link
      to={to}
      className="relative bg-[#1a1a22] rounded-2xl border border-white/[0.04] p-4 lg:p-5 hover:border-white/[0.08] transition-all group overflow-hidden"
    >
      <div className={`absolute -top-10 -right-10 w-28 h-28 rounded-full bg-gradient-to-br ${c.glow} to-transparent blur-2xl opacity-50`} />
      <div className={`relative w-9 h-9 rounded-xl bg-white/[0.04] flex items-center justify-center mb-3 ${c.icon}`}>
        <Icon className="w-4.5 h-4.5" />
      </div>
      <div className="relative text-white text-xl lg:text-2xl font-semibold">{value}</div>
      <div className="relative text-xs text-white/50 font-medium mt-0.5">{label}</div>
      <div className="relative text-[11px] text-white/25 mt-0.5">{sub}</div>
      {change !== undefined && change !== null && (
        <div className={`relative inline-flex items-center gap-1 mt-2 text-[10px] px-2 py-0.5 rounded-full font-medium ${
          change >= 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
        }`}>
          {change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {change >= 0 ? "+" : ""}{change.toFixed(0)}% vs last week
        </div>
      )}
    </Link>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const colors: Record<string, string> = {
    pending:           "bg-amber-500/10 text-amber-400 border-amber-500/20",
    payment_submitted: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    confirmed:         "bg-blue-500/10 text-blue-400 border-blue-500/20",
    shipped:           "bg-violet-500/10 text-violet-400 border-violet-500/20",
    delivered:         "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    cancelled:         "bg-red-500/10 text-red-400 border-red-500/20",
  };
  return (
    <span className={`text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full font-medium border ${colors[status] ?? "bg-white/5 text-white/40 border-white/10"}`}>
      {status.replace("_", " ")}
    </span>
  );
};

export default AdminDashboard;
