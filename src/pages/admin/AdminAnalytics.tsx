import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { formatINR } from "@/lib/site";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend,
} from "recharts";
import {
  TrendingUp, TrendingDown, IndianRupee, ShoppingCart, Package,
  Users,
} from "lucide-react";
import { KPISkeleton, ChartSkeleton } from "@/components/admin/Skeleton";

type Order = {
  id: string; total: number; subtotal: number; status: string;
  created_at: string; customer_name: string; items: any;
};

type Product = {
  id: string; name: string; slug: string; image_url: string | null;
  price: number; in_stock: boolean; category_slug: string | null;
};

const COLORS = ["#c9a84c", "#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6"];

const AdminAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [period, setPeriod] = useState<"7d" | "30d" | "90d" | "all">("30d");

  useEffect(() => {
    const load = async () => {
      const [ordersRes, productsRes] = await Promise.all([
        supabase.from("orders").select("id, total, subtotal, status, created_at, customer_name, items").order("created_at", { ascending: false }),
        supabase.from("products").select("id, name, slug, image_url, price, in_stock, category_slug"),
      ]);
      setOrders((ordersRes.data ?? []) as Order[]);
      setProducts((productsRes.data ?? []) as Product[]);
      setLoading(false);
    };
    load().catch(() => setLoading(false));
  }, []);

  // Filter orders by period
  const now = new Date();
  const cutoff = period === "all" ? new Date(0) : new Date(now.getTime() - (
    period === "7d" ? 7 : period === "30d" ? 30 : 90
  ) * 86400000);

  const filtered = orders.filter((o) => new Date(o.created_at) >= cutoff && o.status !== "cancelled");
  const totalRevenue = filtered.reduce((s, o) => s + (o.total || 0), 0);
  const totalOrders = filtered.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const uniqueCustomers = new Set(filtered.map((o) => o.customer_name?.toLowerCase())).size;

  // Previous period for comparison
  const prevCutoff = period === "all" ? new Date(0) : new Date(cutoff.getTime() - (now.getTime() - cutoff.getTime()));
  const prevFiltered = orders.filter((o) => {
    const d = new Date(o.created_at);
    return d >= prevCutoff && d < cutoff && o.status !== "cancelled";
  });
  const prevRevenue = prevFiltered.reduce((s, o) => s + (o.total || 0), 0);
  const revenueChange = prevRevenue > 0 ? Math.round(((totalRevenue - prevRevenue) / prevRevenue) * 100) : 0;

  // Revenue chart data
  const daysCount = period === "7d" ? 7 : period === "30d" ? 30 : period === "90d" ? 90 : Math.ceil((now.getTime() - new Date(orders.at(-1)?.created_at ?? now.toISOString()).getTime()) / 86400000) || 30;
  const revenueByDay: { date: string; revenue: number; orders: number }[] = [];
  for (let i = daysCount - 1; i >= 0; i--) {
    const d = new Date(now); d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const dayOrders = filtered.filter((o) => o.created_at?.slice(0, 10) === key);
    revenueByDay.push({
      date: d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
      revenue: dayOrders.reduce((s, o) => s + (o.total || 0), 0),
      orders: dayOrders.length,
    });
  }

  // Top products (from order items)
  const productSales: Record<string, { name: string; quantity: number; revenue: number }> = {};
  filtered.forEach((o) => {
    const items = Array.isArray(o.items) ? o.items : [];
    items.forEach((item: any) => {
      const name = item.name || item.product_name || "Unknown";
      if (!productSales[name]) productSales[name] = { name, quantity: 0, revenue: 0 };
      productSales[name].quantity += item.quantity || item.qty || 1;
      productSales[name].revenue += item.price || item.total || 0;
    });
  });
  const topProducts = Object.values(productSales).sort((a, b) => b.revenue - a.revenue).slice(0, 8);

  // Status breakdown for pie chart
  const statusCounts: Record<string, number> = {};
  orders.filter((o) => new Date(o.created_at) >= cutoff).forEach((o) => {
    statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
  });
  const statusPie = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

  // Category breakdown
  const catRevenue: Record<string, number> = {};
  filtered.forEach((o) => {
    const items = Array.isArray(o.items) ? o.items : [];
    items.forEach((item: any) => {
      const cat = item.category || item.category_slug || "uncategorized";
      catRevenue[cat] = (catRevenue[cat] || 0) + (item.price || item.total || 0);
    });
  });
  const catData = Object.entries(catRevenue)
    .map(([name, revenue]) => ({ name: name.replace(/-/g, " "), revenue }))
    .sort((a, b) => b.revenue - a.revenue).slice(0, 6);

  // Orders by day of week
  const dayOfWeek = [0, 0, 0, 0, 0, 0, 0];
  filtered.forEach((o) => { dayOfWeek[new Date(o.created_at).getDay()]++; });
  const weekData = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((name, i) => ({ name, orders: dayOfWeek[i] }));

  if (loading) {
    return (
      <div className="pb-24 lg:pb-0 space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="font-display text-3xl" style={{ color: "#1a1208" }}>Analytics</h1></div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <KPISkeleton key={i} />)}
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <ChartSkeleton /><ChartSkeleton />
        </div>
      </div>
    );
  }

  const kpis = [
    { label: "Revenue", value: formatINR(totalRevenue), change: revenueChange, icon: IndianRupee, color: "#c9a84c" },
    { label: "Orders", value: String(totalOrders), change: null, icon: ShoppingCart, color: "#6366f1" },
    { label: "Avg. Order", value: formatINR(avgOrderValue), change: null, icon: Package, color: "#10b981" },
    { label: "Customers", value: String(uniqueCustomers), change: null, icon: Users, color: "#f59e0b" },
  ];

  return (
    <div className="pb-24 lg:pb-0 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl" style={{ color: "#1a1208" }}>Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">Performance insights for your store</p>
        </div>
        {/* Period selector */}
        <div className="flex gap-1.5 bg-white/80 rounded-xl border border-[#e5e0d8]/60 p-1">
          {([["7d", "7 days"], ["30d", "30 days"], ["90d", "90 days"], ["all", "All time"]] as const).map(([id, label]) => (
            <button key={id} onClick={() => setPeriod(id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                period === id ? "bg-[#1a1208] text-[#fdf9f0] shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}>{label}</button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <div key={k.label} className="bg-white/70 backdrop-blur-xl rounded-2xl border border-[#e5e0d8]/60 p-5 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
              style={{ background: `${k.color}12`, border: `1px solid ${k.color}25` }}>
              <k.icon className="w-5 h-5" style={{ color: k.color }} />
            </div>
            <div className="text-2xl font-bold" style={{ color: "#1a1208" }}>{k.value}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{k.label}</div>
            {k.change !== null && k.change !== 0 && (
              <div className={`flex items-center gap-1 mt-1.5 text-[11px] font-medium ${k.change > 0 ? "text-emerald-600" : "text-red-500"}`}>
                {k.change > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {k.change > 0 ? "+" : ""}{k.change}% vs prev period
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-[#e5e0d8]/60 p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-display text-lg" style={{ color: "#1a1208" }}>Revenue Over Time</h3>
            <p className="text-xs text-muted-foreground">Daily revenue trend</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={revenueByDay}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#c9a84c" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#c9a84c" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} interval={Math.max(1, Math.floor(revenueByDay.length / 10))} />
            <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`} />
            <Tooltip
              contentStyle={{ borderRadius: 12, border: "1px solid #e5e0d8", background: "#fff", fontSize: 12 }}
              formatter={(value: number, name: string) => [name === "revenue" ? formatINR(value) : value, name === "revenue" ? "Revenue" : "Orders"]}
            />
            <Area type="monotone" dataKey="revenue" stroke="#c9a84c" strokeWidth={2} fill="url(#revGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Two-column: Top Products + Order Status */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-[#e5e0d8]/60 p-5">
          <h3 className="font-display text-lg mb-4" style={{ color: "#1a1208" }}>Top Products</h3>
          {topProducts.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No sales data yet</p>
          ) : (
            <div className="space-y-3">
              {topProducts.map((p, i) => (
                <div key={p.name} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                    style={{ background: `${COLORS[i % COLORS.length]}18`, color: COLORS[i % COLORS.length] }}>
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate" style={{ color: "#1a1208" }}>{p.name}</div>
                    <div className="text-[11px] text-muted-foreground">{p.quantity} sold</div>
                  </div>
                  <span className="text-sm font-semibold" style={{ color: "#1a1208" }}>{formatINR(p.revenue)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Status Pie */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-[#e5e0d8]/60 p-5">
          <h3 className="font-display text-lg mb-4" style={{ color: "#1a1208" }}>Order Status</h3>
          {statusPie.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No orders yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={statusPie} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={2}>
                  {statusPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e5e0d8", fontSize: 12 }} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Orders by Day + Category Revenue */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Orders by Day of Week */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-[#e5e0d8]/60 p-5">
          <h3 className="font-display text-lg mb-4" style={{ color: "#1a1208" }}>Orders by Day</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weekData}>
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e5e0d8", fontSize: 12 }} />
              <Bar dataKey="orders" fill="#c9a84c" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Revenue */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-[#e5e0d8]/60 p-5">
          <h3 className="font-display text-lg mb-4" style={{ color: "#1a1208" }}>Revenue by Category</h3>
          {catData.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No category data</p>
          ) : (
            <div className="space-y-3">
              {catData.map((c, i) => {
                const maxRev = catData[0]?.revenue || 1;
                return (
                  <div key={c.name} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="capitalize" style={{ color: "#1a1208" }}>{c.name}</span>
                      <span className="font-semibold" style={{ color: "#1a1208" }}>{formatINR(c.revenue)}</span>
                    </div>
                    <div className="h-2 rounded-full bg-[#f5f0e8] overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${(c.revenue / maxRev) * 100}%`, background: COLORS[i % COLORS.length] }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-[#e5e0d8]/60 p-5">
        <h3 className="font-display text-lg mb-4" style={{ color: "#1a1208" }}>Inventory Summary</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center p-4 rounded-xl bg-[#f8f5f0]">
            <div className="text-2xl font-bold" style={{ color: "#1a1208" }}>{products.length}</div>
            <div className="text-xs text-muted-foreground mt-0.5">Total Products</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-[#f8f5f0]">
            <div className="text-2xl font-bold text-emerald-600">{products.filter((p) => p.in_stock).length}</div>
            <div className="text-xs text-muted-foreground mt-0.5">In Stock</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-[#f8f5f0]">
            <div className="text-2xl font-bold text-red-500">{products.filter((p) => !p.in_stock).length}</div>
            <div className="text-xs text-muted-foreground mt-0.5">Out of Stock</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-[#f8f5f0]">
            <div className="text-2xl font-bold" style={{ color: "#c9a84c" }}>
              {new Set(products.map((p) => p.category_slug).filter(Boolean)).size}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">Categories Used</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
