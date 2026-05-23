import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { formatINR } from "@/lib/site";
import {
  IndianRupee, ShoppingCart, Package, Mail, Plus, Tag,
  Settings, ArrowUpRight, TrendingUp, AlertTriangle,
  Clock, CheckCircle2, Truck, XCircle, Activity,
  BarChart3, FileText,
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { KPISkeleton, ChartSkeleton, TableRowSkeleton } from "@/components/admin/Skeleton";

type KPI = { label: string; value: string; sub: string; icon: any; to: string; color: string; badge?: string };

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [revenue, setRevenue] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [inquiryCount, setInquiryCount] = useState(0);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [chartData, setChartData] = useState<{ date: string; revenue: number }[]>([]);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [outOfStock, setOutOfStock] = useState<any[]>([]);
  const [newInquiries, setNewInquiries] = useState(0);
  const [activityFeed, setActivityFeed] = useState<{ icon: any; text: string; time: string; color: string }[]>([]);
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [todayOrders, setTodayOrders] = useState(0);

  useEffect(() => {
    const load = async () => {
      let ordersRes: any = { data: [] }, productsRes: any = { data: [], count: 0 }, inquiriesRes: any = { data: [], count: 0 };
      try {
        [ordersRes, productsRes, inquiriesRes] = await Promise.all([
          supabase.from("orders").select("id, order_number, customer_name, total, status, created_at").order("created_at", { ascending: false }),
          supabase.from("products").select("id, name, slug, in_stock, image_url, price").order("sort_order"),
          supabase.from("inquiries").select("id, name, status, created_at").order("created_at", { ascending: false }),
        ]);
      } catch {}

      const orders = ordersRes.data ?? [];
      const products = productsRes.data ?? [];
      const inquiries = inquiriesRes.data ?? [];

      setOrderCount(orders.length);
      setProductCount(products.length);
      setInquiryCount(inquiries.length);

      const totalRevenue = orders
        .filter((o: any) => o.status !== "cancelled")
        .reduce((sum: number, o: any) => sum + (o.total || 0), 0);
      setRevenue(totalRevenue);
      setRecentOrders(orders.slice(0, 6));

      // Pending orders count
      const pending = orders.filter((o: any) => o.status === "pending").length;
      setPendingOrders(pending);

      // Out of stock products
      const oos = products.filter((p: any) => !p.in_stock);
      setOutOfStock(oos);

      // New inquiries
      const newInq = inquiries.filter((i: any) => i.status === "new").length;
      setNewInquiries(newInq);

      // Today's stats
      const today = new Date().toISOString().slice(0, 10);
      const todayOrd = orders.filter((o: any) => o.created_at?.slice(0, 10) === today && o.status !== "cancelled");
      setTodayRevenue(todayOrd.reduce((s: number, o: any) => s + (o.total || 0), 0));
      setTodayOrders(todayOrd.length);

      // Build activity feed from recent orders + inquiries
      const feed: { icon: any; text: string; time: string; color: string }[] = [];
      orders.slice(0, 5).forEach((o: any) => {
        const statusIcon = o.status === "delivered" ? CheckCircle2 : o.status === "shipped" ? Truck : o.status === "cancelled" ? XCircle : Clock;
        const statusColor = o.status === "delivered" ? "#10b981" : o.status === "shipped" ? "#6366f1" : o.status === "cancelled" ? "#ef4444" : "#f59e0b";
        feed.push({
          icon: statusIcon,
          text: `Order #${o.order_number} — ${o.customer_name} (${o.status})`,
          time: timeAgo(o.created_at),
          color: statusColor,
        });
      });
      inquiries.slice(0, 3).forEach((i: any) => {
        feed.push({
          icon: Mail,
          text: `New inquiry from ${i.name}`,
          time: timeAgo(i.created_at),
          color: "#f59e0b",
        });
      });
      // Sort by time (most recent first) and take top 8
      feed.sort((a, b) => a.time.localeCompare(b.time));
      setActivityFeed(feed.slice(0, 8));

      // Build chart data for last 14 days
      const now = new Date();
      const days: { date: string; revenue: number }[] = [];
      for (let i = 13; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const key = d.toISOString().slice(0, 10);
        const dayRevenue = orders
          .filter((o: any) => o.created_at?.slice(0, 10) === key && o.status !== "cancelled")
          .reduce((sum: number, o: any) => sum + (o.total || 0), 0);
        days.push({ date: d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }), revenue: dayRevenue });
      }
      setChartData(days);
      setLoading(false);
    };
    load().catch(() => setLoading(false));
  }, []);

  const kpis: KPI[] = [
    { label: "Revenue", value: formatINR(revenue), sub: `Today: ${formatINR(todayRevenue)}`, icon: IndianRupee, to: "/admin/analytics", color: "#c9a84c" },
    { label: "Orders", value: String(orderCount), sub: `${todayOrders} today`, icon: ShoppingCart, to: "/admin/orders", color: "#6366f1", badge: pendingOrders > 0 ? `${pendingOrders} pending` : undefined },
    { label: "Products", value: String(productCount), sub: `${outOfStock.length} out of stock`, icon: Package, to: "/admin/products", color: "#10b981", badge: outOfStock.length > 0 ? `${outOfStock.length} OOS` : undefined },
    { label: "Inquiries", value: String(inquiryCount), sub: `${newInquiries} unread`, icon: Mail, to: "/admin/inquiries", color: "#f59e0b", badge: newInquiries > 0 ? `${newInquiries} new` : undefined },
  ];

  const quickActions = [
    { label: "Add Product", icon: Plus, to: "/admin/products", color: "#1a1208" },
    { label: "View Orders", icon: ShoppingCart, to: "/admin/orders", color: "#6366f1" },
    { label: "Categories", icon: Tag, to: "/admin/categories", color: "#10b981" },
    { label: "Analytics", icon: BarChart3, to: "/admin/analytics", color: "#8b5cf6" },
    { label: "Content", icon: FileText, to: "/admin/cms", color: "#ec4899" },
    { label: "Settings", icon: Settings, to: "/admin/settings", color: "#64748b" },
  ];

  const statusColor = (s: string) => {
    switch (s) {
      case "delivered": return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "shipped": return "bg-blue-50 text-blue-700 border-blue-200";
      case "confirmed": return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "cancelled": return "bg-red-50 text-red-700 border-red-200";
      default: return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  return (
    <div className="pb-24 lg:pb-0 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-3xl" style={{ color: "#1a1208" }}>Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Welcome back! Here's what's happening.</p>
        </div>
        <div className="text-right">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
            {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </div>
        </div>
      </div>

      {/* Alert Banner - Pending Orders / Out of Stock */}
      {!loading && (pendingOrders > 0 || outOfStock.length > 0 || newInquiries > 0) && (
        <div className="flex flex-wrap gap-3">
          {pendingOrders > 0 && (
            <Link to="/admin/orders" className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm hover:bg-amber-100 transition-colors">
              <Clock className="w-4 h-4" />
              <span className="font-medium">{pendingOrders} pending order{pendingOrders > 1 ? "s" : ""}</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-amber-500" />
            </Link>
          )}
          {outOfStock.length > 0 && (
            <Link to="/admin/products" className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm hover:bg-red-100 transition-colors">
              <AlertTriangle className="w-4 h-4" />
              <span className="font-medium">{outOfStock.length} product{outOfStock.length > 1 ? "s" : ""} out of stock</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-red-400" />
            </Link>
          )}
          {newInquiries > 0 && (
            <Link to="/admin/inquiries" className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-sm hover:bg-blue-100 transition-colors">
              <Mail className="w-4 h-4" />
              <span className="font-medium">{newInquiries} new inquir{newInquiries > 1 ? "ies" : "y"}</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-blue-400" />
            </Link>
          )}
        </div>
      )}

      {/* KPIs */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <KPISkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((k) => (
            <Link key={k.label} to={k.to}
              className="group relative bg-white/70 backdrop-blur-xl rounded-2xl border border-[#e5e0d8]/60 p-5 hover:shadow-lg hover:border-[#c9a84c]/30 transition-all hover:-translate-y-0.5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{ background: `${k.color}12`, border: `1px solid ${k.color}25` }}>
                <k.icon className="w-5 h-5" style={{ color: k.color }} />
              </div>
              <div className="text-2xl font-bold" style={{ color: "#1a1208" }}>{k.value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{k.label}</div>
              <div className="text-[10px] text-muted-foreground/60 mt-0.5">{k.sub}</div>
              {k.badge && (
                <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[9px] font-bold bg-red-50 text-red-600 border border-red-200">
                  {k.badge}
                </span>
              )}
              <ArrowUpRight className="w-4 h-4 text-muted-foreground/30 absolute top-4 right-4 group-hover:text-[#c9a84c] transition-colors hidden sm:block" />
            </Link>
          ))}
        </div>
      )}

      {/* Chart + Recent Orders + Activity Feed */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        {loading ? (
          <div className="lg:col-span-2"><ChartSkeleton /></div>
        ) : (
          <div className="lg:col-span-2 bg-white/70 backdrop-blur-xl rounded-2xl border border-[#e5e0d8]/60 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display text-lg" style={{ color: "#1a1208" }}>Revenue Trend</h3>
                <p className="text-xs text-muted-foreground">Last 14 days</p>
              </div>
              <Link to="/admin/analytics" className="flex items-center gap-1.5 text-xs text-[#c9a84c] hover:underline">
                <BarChart3 className="w-3.5 h-3.5" /> Full analytics
              </Link>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c9a84c" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#c9a84c" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v}`} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid #e5e0d8", background: "#fff", fontSize: 12 }}
                  formatter={(value: number) => [formatINR(value), "Revenue"]}
                />
                <Area type="monotone" dataKey="revenue" stroke="#c9a84c" strokeWidth={2} fill="url(#revenueGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Activity Feed */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-[#e5e0d8]/60 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg" style={{ color: "#1a1208" }}>Activity</h3>
            <Activity className="w-4 h-4 text-muted-foreground/40" />
          </div>
          {loading ? (
            <div className="space-y-0">{[...Array(5)].map((_, i) => <TableRowSkeleton key={i} />)}</div>
          ) : activityFeed.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No recent activity</p>
          ) : (
            <div className="space-y-1">
              {activityFeed.map((a, i) => (
                <div key={i} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#f8f5f0] transition-colors">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: `${a.color}12` }}>
                    <a.icon className="w-3.5 h-3.5" style={{ color: a.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] leading-snug" style={{ color: "#1a1208" }}>{a.text}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders Table + Out of Stock */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white/70 backdrop-blur-xl rounded-2xl border border-[#e5e0d8]/60 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg" style={{ color: "#1a1208" }}>Recent Orders</h3>
            <Link to="/admin/orders" className="text-xs text-[#c9a84c] hover:underline">View all</Link>
          </div>
          {loading ? (
            <div className="space-y-0">{[...Array(5)].map((_, i) => <TableRowSkeleton key={i} />)}</div>
          ) : recentOrders.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No orders yet</p>
          ) : (
            <div className="space-y-2">
              {recentOrders.map((o) => (
                <div key={o.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-[#f8f5f0] transition-colors">
                  <div>
                    <div className="text-sm font-medium" style={{ color: "#1a1208" }}>{o.customer_name || "—"}</div>
                    <div className="text-[10px] text-muted-foreground">#{o.order_number} · {timeAgo(o.created_at)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold" style={{ color: "#1a1208" }}>{formatINR(o.total || 0)}</div>
                    <span className={`inline-block mt-0.5 text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full border ${statusColor(o.status)}`}>
                      {o.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Out of Stock Alert */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-[#e5e0d8]/60 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg" style={{ color: "#1a1208" }}>Stock Alerts</h3>
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          {loading ? (
            <div className="space-y-3">{[...Array(3)].map((_, i) => <TableRowSkeleton key={i} />)}</div>
          ) : outOfStock.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
              <p className="text-sm text-muted-foreground">All products in stock!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {outOfStock.slice(0, 6).map((p) => (
                <div key={p.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-red-50/50 border border-red-100">
                  <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
                    <Package className="w-4 h-4 text-red-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium truncate" style={{ color: "#1a1208" }}>{p.name}</div>
                    <div className="text-[10px] text-red-500 font-medium">Out of stock</div>
                  </div>
                  <span className="text-xs font-semibold" style={{ color: "#1a1208" }}>{formatINR(p.price)}</span>
                </div>
              ))}
              {outOfStock.length > 6 && (
                <Link to="/admin/products" className="block text-center text-xs text-[#c9a84c] hover:underline pt-2">
                  +{outOfStock.length - 6} more
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="font-display text-lg mb-4" style={{ color: "#1a1208" }}>Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickActions.map((a) => (
            <Link key={a.label} to={a.to}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/70 border border-[#e5e0d8]/60 hover:shadow-md hover:border-[#c9a84c]/30 transition-all hover:-translate-y-0.5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${a.color}12`, border: `1px solid ${a.color}25` }}>
                <a.icon className="w-5 h-5" style={{ color: a.color }} />
              </div>
              <span className="text-xs font-medium" style={{ color: "#1a1208" }}>{a.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ── Time ago helper ── */
function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export default AdminDashboard;
