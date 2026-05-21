import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { formatINR } from "@/lib/site";
import {
  Package, ShoppingCart, IndianRupee, TrendingUp, TrendingDown,
  Mail, Sparkles, MessageSquareQuote, BarChart3, Users, Ticket, Tag,
  ArrowUpRight, AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip,
  PieChart, Pie, Cell,
} from "recharts";

type Order = { id: string; status: string; total: number; created_at: string; customer_name: string; order_number: string; items: any };
type Stats = {
  totalProducts: number; featuredProducts: number; outOfStock: number;
  totalOrders: number; pendingOrders: number; totalRevenue: number;
  monthRevenue: number; weekRevenue: number; prevWeekRevenue: number;
  recentOrders: Order[]; newInquiries: number; totalInquiries: number;
  ordersByDay: { day: string; revenue: number; orders: number }[];
  ordersByStatus: { name: string; value: number; color: string }[];
  topProducts: { name: string; qty: number; revenue: number }[];
};

const STATUS_COLORS: Record<string, string> = {
  pending: "#f59e0b", payment_submitted: "#06b6d4", confirmed: "#3b82f6",
  shipped: "#8b5cf6", delivered: "#10b981", cancelled: "#ef4444",
};

const fmtDay = (d: Date) => d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });

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
        const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - i);
        const next = new Date(d); next.setDate(d.getDate() + 1);
        const dayOrders = allOrders.filter((o) => { const t = new Date(o.created_at).getTime(); return t >= d.getTime() && t < next.getTime(); });
        ordersByDay.push({ day: fmtDay(d), orders: dayOrders.length, revenue: dayOrders.reduce((s, o) => s + (Number(o.total) || 0), 0) });
      }

      const ordersByStatus = Object.keys(STATUS_COLORS).map((s) => ({
        name: s.replace("_", " "), value: allOrders.filter((o) => o.status === s).length, color: STATUS_COLORS[s],
      })).filter((s) => s.value > 0);

      const productMap = new Map<string, { qty: number; revenue: number }>();
      allOrders.forEach((o) => {
        (Array.isArray(o.items) ? o.items : []).forEach((it: any) => {
          const name = it?.name ?? "Unknown"; const qty = Number(it?.qty) || 0; const price = Number(it?.price) || 0;
          const ex = productMap.get(name) ?? { qty: 0, revenue: 0 };
          productMap.set(name, { qty: ex.qty + qty, revenue: ex.revenue + qty * price });
        });
      });
      const topProducts = Array.from(productMap.entries()).map(([name, v]) => ({ name, ...v })).sort((a, b) => b.qty - a.qty).slice(0, 5);

      const now = Date.now();
      const weekAgo = now - 7 * 24 * 3600 * 1000;
      const prevWeekStart = now - 14 * 24 * 3600 * 1000;
      const monthAgo = now - 30 * 24 * 3600 * 1000;

      setStats({
        totalProducts: products?.length ?? 0,
        featuredProducts: products?.filter((p) => p.featured).length ?? 0,
        outOfStock: products?.filter((p) => !p.in_stock).length ?? 0,
        totalOrders: allOrders.length,
        pendingOrders: allOrders.filter((o) => o.status === "pending").length,
        totalRevenue: allOrders.reduce((s, o) => s + (Number(o.total) || 0), 0),
        monthRevenue: allOrders.filter((o) => new Date(o.created_at).getTime() >= monthAgo).reduce((s, o) => s + (Number(o.total) || 0), 0),
        weekRevenue: allOrders.filter((o) => new Date(o.created_at).getTime() >= weekAgo).reduce((s, o) => s + (Number(o.total) || 0), 0),
        prevWeekRevenue: allOrders.filter((o) => { const t = new Date(o.created_at).getTime(); return t >= prevWeekStart && t < weekAgo; }).reduce((s, o) => s + (Number(o.total) || 0), 0),
        recentOrders: allOrders.slice(0, 6),
        newInquiries: allInquiries.filter((i: any) => i.status === "new").length,
        totalInquiries: allInquiries.length,
        ordersByDay, ordersByStatus, topProducts,
      });
      setLoading(false);
    };
    load();
  }, []);

  const greeting = useMemo(() => { const h = new Date().getHours(); return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening"; }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
      <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#c9a84c" }} />Loading…</span>
    </div>
  );

  const s = stats!;
  const weekChange = s.prevWeekRevenue > 0 ? ((s.weekRevenue - s.prevWeekRevenue) / s.prevWeekRevenue) * 100 : null;

  return (
    <div className="space-y-6 pb-24 lg:pb-0">
      {/* Header */}
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{greeting} ✦</p>
          <h1 className="font-display text-3xl mt-1" style={{ color: "#1a1208" }}>Dashboard</h1>
        </div>
        <Link to="/admin/analytics" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 backdrop-blur border border-[#e5e0d8]/60 hover:border-[#c9a84c]/40 text-xs text-muted-foreground hover:text-foreground transition-all shadow-sm">
          <BarChart3 className="w-3.5 h-3.5" /> Full Analytics
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI label="Revenue" value={formatINR(s.totalRevenue)} sub={`₹${s.monthRevenue.toLocaleString("en-IN")} this month`} icon={IndianRupee} gradient="from-emerald-50 to-emerald-100/50" iconColor="#10b981" change={weekChange} to="/admin/orders" />
        <KPI label="Orders" value={s.totalOrders.toString()} sub={`${s.pendingOrders} pending`} icon={ShoppingCart} gradient="from-amber-50 to-amber-100/50" iconColor="#f59e0b" to="/admin/orders" />
        <KPI label="Products" value={s.totalProducts.toString()} sub={`${s.featuredProducts} featured`} icon={Package} gradient="from-violet-50 to-violet-100/50" iconColor="#8b5cf6" to="/admin/products" />
        <KPI label="Inquiries" value={s.totalInquiries.toString()} sub={`${s.newInquiries} new`} icon={Mail} gradient="from-sky-50 to-sky-100/50" iconColor="#0ea5e9" to="/admin/inquiries" />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white/70 backdrop-blur-xl rounded-2xl border border-[#e5e0d8]/60 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display text-lg" style={{ color: "#1a1208" }}>Revenue Trend</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Last 14 days</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={s.ordersByDay}>
              <defs>
                <linearGradient id="revGradLux" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#c9a84c" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#c9a84c" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#9a8c7a" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#9a8c7a" }} width={45} />
              <Tooltip contentStyle={{ background: "#fffdf9", border: "1px solid #e5e0d8", borderRadius: "12px", fontSize: "12px", boxShadow: "0 8px 32px -8px rgba(26,18,8,0.12)" }}
                formatter={(value: number) => [formatINR(value), "Revenue"]} />
              <Area type="monotone" dataKey="revenue" stroke="#c9a84c" strokeWidth={2.5} fill="url(#revGradLux)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-[#e5e0d8]/60 p-5 shadow-sm">
          <h2 className="font-display text-lg mb-1" style={{ color: "#1a1208" }}>Order Status</h2>
          <p className="text-xs text-muted-foreground mb-3">Distribution</p>
          {s.ordersByStatus.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart><Pie data={s.ordersByStatus} innerRadius={50} outerRadius={70} paddingAngle={3} dataKey="value" strokeWidth={0}>
                  {s.ordersByStatus.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie></PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {s.ordersByStatus.slice(0, 4).map((st) => (
                  <div key={st.name} className="flex items-center gap-2 text-xs">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: st.color }} />
                    <span className="text-muted-foreground capitalize truncate">{st.name}</span>
                    <span className="ml-auto font-medium" style={{ color: "#1a1208" }}>{st.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : <div className="h-[180px] flex items-center justify-center text-xs text-muted-foreground">No orders yet</div>}
        </div>
      </div>

      {/* Recent Orders + Top Products */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-[#e5e0d8]/60 overflow-hidden shadow-sm">
          <div className="flex items-center justify-between p-5 border-b border-[#e5e0d8]/40">
            <h2 className="font-display text-lg" style={{ color: "#1a1208" }}>Recent Orders</h2>
            <Link to="/admin/orders" className="text-xs hover:text-foreground transition-colors" style={{ color: "#c9a84c" }}>View all →</Link>
          </div>
          {s.recentOrders.length === 0 ? <div className="p-10 text-center text-sm text-muted-foreground">No orders yet.</div> : (
            <div className="divide-y divide-[#e5e0d8]/40">
              {s.recentOrders.map((o) => (
                <div key={o.id} className="flex items-center justify-between px-5 py-3 hover:bg-[#f8f5f0]/50 transition-colors">
                  <div>
                    <div className="text-sm font-medium" style={{ color: "#1a1208" }}>#{o.order_number}</div>
                    <div className="text-xs text-muted-foreground">{o.customer_name}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={o.status} />
                    <span className="text-sm font-medium tabular-nums" style={{ color: "#1a1208" }}>{formatINR(o.total)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-[#e5e0d8]/60 overflow-hidden shadow-sm">
          <div className="flex items-center justify-between p-5 border-b border-[#e5e0d8]/40">
            <h2 className="font-display text-lg" style={{ color: "#1a1208" }}>Top Products</h2>
            <Link to="/admin/products" className="text-xs hover:text-foreground transition-colors" style={{ color: "#c9a84c" }}>Manage →</Link>
          </div>
          {s.topProducts.length === 0 ? <div className="p-10 text-center text-sm text-muted-foreground">No sales data yet.</div> : (
            <div className="divide-y divide-[#e5e0d8]/40">
              {s.topProducts.map((p, i) => (
                <div key={p.name} className="flex items-center justify-between px-5 py-3 hover:bg-[#f8f5f0]/50 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-lg font-display w-6 shrink-0 tabular-nums" style={{ color: "#c9a84c" }}>{i + 1}</span>
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate" style={{ color: "#1a1208" }}>{p.name}</div>
                      <div className="text-xs text-muted-foreground">{p.qty} sold</div>
                    </div>
                  </div>
                  <span className="text-sm font-medium tabular-nums shrink-0" style={{ color: "#1a1208" }}>{formatINR(p.revenue)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="font-display text-lg mb-4" style={{ color: "#1a1208" }}>Quick Actions</h2>
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
            <Link key={q.to} to={q.to} className="group bg-white/70 backdrop-blur rounded-2xl border border-[#e5e0d8]/60 p-4 hover:border-[#c9a84c]/40 hover:shadow-md transition-all">
              <q.icon className="w-5 h-5 mb-3 text-muted-foreground group-hover:text-[#c9a84c] transition-colors" />
              <div className="text-sm font-medium" style={{ color: "#1a1208" }}>{q.label}</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">{q.desc}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ── Helpers ── */
const KPI = ({ label, value, sub, icon: Icon, gradient, iconColor, change, to }: {
  label: string; value: string; sub: string; icon: any; gradient: string; iconColor: string; change?: number | null; to: string;
}) => (
  <Link to={to} className="relative bg-white/70 backdrop-blur-xl rounded-2xl border border-[#e5e0d8]/60 p-5 hover:border-[#c9a84c]/40 hover:shadow-md transition-all overflow-hidden group">
    <div className={`absolute -top-8 -right-8 w-24 h-24 rounded-full bg-gradient-to-br ${gradient} blur-2xl opacity-60`} />
    <div className="relative w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${iconColor}15` }}>
      <Icon className="w-5 h-5" style={{ color: iconColor }} />
    </div>
    <div className="relative font-display text-2xl" style={{ color: "#1a1208" }}>{value}</div>
    <div className="relative text-xs font-medium mt-0.5" style={{ color: "#1a1208" }}>{label}</div>
    <div className="relative text-[11px] text-muted-foreground mt-0.5">{sub}</div>
    {change !== undefined && change !== null && (
      <div className={`relative inline-flex items-center gap-1 mt-2 text-[10px] px-2 py-0.5 rounded-full font-medium ${change >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>
        {change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        {change >= 0 ? "+" : ""}{change.toFixed(0)}% vs last week
      </div>
    )}
  </Link>
);

const StatusBadge = ({ status }: { status: string }) => {
  const colors: Record<string, string> = {
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    payment_submitted: "bg-cyan-50 text-cyan-700 border-cyan-200",
    confirmed: "bg-blue-50 text-blue-700 border-blue-200",
    shipped: "bg-violet-50 text-violet-700 border-violet-200",
    delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
    cancelled: "bg-red-50 text-red-700 border-red-200",
  };
  return <span className={`text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full font-medium border ${colors[status] ?? "bg-gray-50 text-gray-600 border-gray-200"}`}>{status.replace("_", " ")}</span>;
};

export default AdminDashboard;
