import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { formatINR } from "@/lib/site";
import {
  IndianRupee, ShoppingCart, Package, Mail, Plus, Tag,
  Settings, ArrowUpRight, TrendingUp,
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { KPISkeleton, ChartSkeleton, TableRowSkeleton } from "@/components/admin/Skeleton";

type KPI = { label: string; value: string; sub: string; icon: any; to: string; color: string };

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [revenue, setRevenue] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [inquiryCount, setInquiryCount] = useState(0);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [chartData, setChartData] = useState<{ date: string; revenue: number }[]>([]);

  useEffect(() => {
    const load = async () => {
      let ordersRes: any = { data: [] }, productsRes: any = { count: 0 }, inquiriesRes: any = { count: 0 };
      try {
        [ordersRes, productsRes, inquiriesRes] = await Promise.all([
          supabase.from("orders").select("id, order_number, customer_name, total, status, created_at").order("created_at", { ascending: false }),
          supabase.from("products").select("id", { count: "exact", head: true }),
          supabase.from("inquiries").select("id", { count: "exact", head: true }),
        ]);
      } catch {}

      const orders = ordersRes.data ?? [];
      setOrderCount(orders.length);
      setProductCount(productsRes.count ?? 0);
      setInquiryCount(inquiriesRes.count ?? 0);

      const totalRevenue = orders
        .filter((o: any) => o.status !== "cancelled")
        .reduce((sum: number, o: any) => sum + (o.total || 0), 0);
      setRevenue(totalRevenue);
      setRecentOrders(orders.slice(0, 5));

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
    { label: "Revenue", value: formatINR(revenue), sub: "Total earnings", icon: IndianRupee, to: "/admin/orders", color: "#c9a84c" },
    { label: "Orders", value: String(orderCount), sub: "All time", icon: ShoppingCart, to: "/admin/orders", color: "#6366f1" },
    { label: "Products", value: String(productCount), sub: "In catalogue", icon: Package, to: "/admin/products", color: "#10b981" },
    { label: "Inquiries", value: String(inquiryCount), sub: "Total received", icon: Mail, to: "/admin/inquiries", color: "#f59e0b" },
  ];

  const quickActions = [
    { label: "Add Product", icon: Plus, to: "/admin/products", color: "#1a1208" },
    { label: "View Orders", icon: ShoppingCart, to: "/admin/orders", color: "#6366f1" },
    { label: "Categories", icon: Tag, to: "/admin/categories", color: "#10b981" },
    { label: "Inquiries", icon: Mail, to: "/admin/inquiries", color: "#f59e0b" },
    { label: "Products", icon: Package, to: "/admin/products", color: "#8b5cf6" },
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
      <div>
        <h1 className="font-display text-3xl" style={{ color: "#1a1208" }}>Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Welcome back! Here's what's happening.</p>
      </div>

      {/* KPIs */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <KPISkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((k) => (
            <Link key={k.label} to={k.to}
              className="group bg-white/70 backdrop-blur-xl rounded-2xl border border-[#e5e0d8]/60 p-5 hover:shadow-lg hover:border-[#c9a84c]/30 transition-all hover:-translate-y-0.5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{ background: `${k.color}12`, border: `1px solid ${k.color}25` }}>
                <k.icon className="w-5 h-5" style={{ color: k.color }} />
              </div>
              <div className="text-2xl font-bold" style={{ color: "#1a1208" }}>{k.value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{k.label}</div>
              <div className="text-[10px] text-muted-foreground/60 mt-0.5">{k.sub}</div>
              <ArrowUpRight className="w-4 h-4 text-muted-foreground/30 absolute top-4 right-4 group-hover:text-[#c9a84c] transition-colors hidden sm:block" />
            </Link>
          ))}
        </div>
      )}

      {/* Chart + Recent Orders */}
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
              <div className="flex items-center gap-1.5 text-xs text-emerald-600">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Active</span>
              </div>
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

        {/* Recent Orders */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-[#e5e0d8]/60 p-5">
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
                    <div className="text-[10px] text-muted-foreground">#{o.order_number}</div>
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

export default AdminDashboard;
