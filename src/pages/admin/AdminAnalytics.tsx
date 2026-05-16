import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { formatINR } from "@/lib/site";
import {
  TrendingUp, TrendingDown, IndianRupee, ShoppingCart, Users, Repeat,
  Calendar, Download,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid,
  BarChart, Bar,
} from "recharts";

type Order = {
  id: string;
  order_number: string;
  status: string;
  total: number;
  subtotal: number;
  customer_email: string;
  created_at: string;
  items: any;
  shipping_city: string;
  shipping_state: string | null;
};

type Range = "7d" | "30d" | "90d" | "ytd" | "all";

const RANGES: Record<Range, { label: string; days: number | null }> = {
  "7d":  { label: "Last 7 days",  days: 7 },
  "30d": { label: "Last 30 days", days: 30 },
  "90d": { label: "Last 90 days", days: 90 },
  "ytd": { label: "Year to date", days: null },
  "all": { label: "All time",     days: null },
};

const fmtDay = (d: Date) =>
  d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });

const ofRange = (orders: Order[], range: Range) => {
  if (range === "all") return orders;
  if (range === "ytd") {
    const start = new Date(new Date().getFullYear(), 0, 1).getTime();
    return orders.filter((o) => new Date(o.created_at).getTime() >= start);
  }
  const days = RANGES[range].days!;
  const cutoff = Date.now() - days * 24 * 3600 * 1000;
  return orders.filter((o) => new Date(o.created_at).getTime() >= cutoff);
};

const AdminAnalytics = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [range, setRange] = useState<Range>("30d");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("orders").select("*").order("created_at", { ascending: false })
      .then(({ data }) => {
        setOrders((data ?? []) as Order[]);
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => ofRange(orders, range), [orders, range]);

  const stats = useMemo(() => {
    const completed = filtered.filter((o) => o.status !== "cancelled");
    const revenue = completed.reduce((s, o) => s + Number(o.total || 0), 0);
    const avgOrder = completed.length > 0 ? revenue / completed.length : 0;

    const customers = new Set(filtered.map((o) => o.customer_email.toLowerCase()));
    const counts = new Map<string, number>();
    filtered.forEach((o) => counts.set(o.customer_email.toLowerCase(), (counts.get(o.customer_email.toLowerCase()) ?? 0) + 1));
    const repeatCustomers = Array.from(counts.values()).filter((n) => n > 1).length;

    // Previous-period comparison
    const days = RANGES[range].days;
    let prevRevenue = 0, prevOrders = 0;
    if (days) {
      const cutoff = Date.now() - days * 24 * 3600 * 1000;
      const prevCutoff = cutoff - days * 24 * 3600 * 1000;
      const prev = orders.filter((o) => {
        const t = new Date(o.created_at).getTime();
        return t >= prevCutoff && t < cutoff && o.status !== "cancelled";
      });
      prevRevenue = prev.reduce((s, o) => s + Number(o.total || 0), 0);
      prevOrders = prev.length;
    }

    const revChange = prevRevenue > 0 ? ((revenue - prevRevenue) / prevRevenue) * 100 : null;
    const orderChange = prevOrders > 0 ? ((completed.length - prevOrders) / prevOrders) * 100 : null;

    return {
      revenue,
      orders: completed.length,
      customers: customers.size,
      repeatCustomers,
      avgOrder,
      revChange,
      orderChange,
    };
  }, [filtered, orders, range]);

  // Daily revenue series
  const dailySeries = useMemo(() => {
    const days = RANGES[range].days ?? 90;
    const map = new Map<string, { day: string; revenue: number; orders: number }>();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      map.set(key, { day: fmtDay(d), revenue: 0, orders: 0 });
    }
    filtered.forEach((o) => {
      if (o.status === "cancelled") return;
      const key = new Date(o.created_at).toISOString().slice(0, 10);
      const ex = map.get(key);
      if (ex) {
        ex.revenue += Number(o.total || 0);
        ex.orders += 1;
      }
    });
    return Array.from(map.values());
  }, [filtered, range]);

  // Top cities
  const topCities = useMemo(() => {
    const m = new Map<string, { city: string; orders: number; revenue: number }>();
    filtered.forEach((o) => {
      if (o.status === "cancelled") return;
      const key = (o.shipping_city || "Unknown").trim();
      const ex = m.get(key) ?? { city: key, orders: 0, revenue: 0 };
      ex.orders += 1;
      ex.revenue += Number(o.total || 0);
      m.set(key, ex);
    });
    return Array.from(m.values()).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  }, [filtered]);

  const exportCSV = () => {
    const headers = ["Order #", "Date", "Status", "Customer Email", "City", "State", "Subtotal", "Total"];
    const rows = filtered.map((o) => [
      o.order_number,
      new Date(o.created_at).toISOString(),
      o.status,
      o.customer_email,
      o.shipping_city,
      o.shipping_state ?? "",
      o.subtotal,
      o.total,
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mohika-orders-${range}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-4xl">Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">Insights from your store performance</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="inline-flex bg-background border border-border rounded-full p-1">
            {(Object.keys(RANGES) as Range[]).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  range === r ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {RANGES[r].label}
              </button>
            ))}
          </div>
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border hover:bg-muted text-xs"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <KPI
          label="Revenue"
          value={formatINR(stats.revenue)}
          icon={IndianRupee}
          color="emerald"
          change={stats.revChange}
        />
        <KPI
          label="Orders"
          value={stats.orders}
          icon={ShoppingCart}
          color="amber"
          change={stats.orderChange}
        />
        <KPI
          label="Customers"
          value={stats.customers}
          icon={Users}
          color="violet"
        />
        <KPI
          label="Repeat Buyers"
          value={stats.repeatCustomers}
          icon={Repeat}
          color="sky"
        />
        <KPI
          label="Avg. Order"
          value={formatINR(stats.avgOrder)}
          icon={Calendar}
          color="rose"
        />
      </div>

      {/* Revenue chart */}
      <div className="bg-background rounded-2xl border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display text-xl">Revenue Over Time</h2>
            <p className="text-xs text-muted-foreground">{RANGES[range].label}</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={dailySeries}>
            <defs>
              <linearGradient id="aRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="hsl(34 58% 52%)" stopOpacity={0.45} />
                <stop offset="100%" stopColor="hsl(34 58% 52%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(34 28% 92%)" vertical={false} />
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(25 10% 55%)" }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(25 10% 55%)" }} width={50} />
            <Tooltip
              contentStyle={{
                background: "hsl(36 42% 99%)",
                border: "1px solid hsl(34 28% 87%)",
                borderRadius: "0.75rem",
                fontSize: "12px",
              }}
              formatter={(v: number, k: string) => k === "revenue" ? [formatINR(v), "Revenue"] : [v, "Orders"]}
            />
            <Area type="monotone" dataKey="revenue" stroke="hsl(34 58% 52%)" strokeWidth={2} fill="url(#aRev)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Top cities + Orders bar */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-background rounded-2xl border border-border p-6">
          <h2 className="font-display text-xl mb-4">Top Cities</h2>
          {topCities.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground py-12">No orders in this period</div>
          ) : (
            <div className="space-y-3">
              {topCities.map((c, i) => {
                const max = topCities[0].revenue || 1;
                const pct = (c.revenue / max) * 100;
                return (
                  <div key={c.city}>
                    <div className="flex items-baseline justify-between text-sm mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-display text-lg text-amber-700/70 w-6">{i + 1}</span>
                        <span className="font-medium">{c.city}</span>
                        <span className="text-xs text-muted-foreground">({c.orders} order{c.orders === 1 ? "" : "s"})</span>
                      </div>
                      <span className="tabular-nums font-medium">{formatINR(c.revenue)}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${pct}%`,
                          background: "linear-gradient(90deg, hsl(34 58% 52%), hsl(38 72% 62%))",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-background rounded-2xl border border-border p-6">
          <h2 className="font-display text-xl mb-4">Orders Per Day</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={dailySeries}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(34 28% 92%)" vertical={false} />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(25 10% 55%)" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(25 10% 55%)" }} allowDecimals={false} width={30} />
              <Tooltip
                contentStyle={{
                  background: "hsl(36 42% 99%)",
                  border: "1px solid hsl(34 28% 87%)",
                  borderRadius: "0.75rem",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="orders" fill="hsl(34 58% 52%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const colorClasses: Record<string, { bg: string; icon: string; chip: string }> = {
  emerald: { bg: "from-emerald-500/10 to-emerald-500/5", icon: "text-emerald-600", chip: "bg-emerald-100 text-emerald-700" },
  amber:   { bg: "from-amber-500/10 to-amber-500/5",     icon: "text-amber-600",   chip: "bg-amber-100 text-amber-700" },
  violet:  { bg: "from-violet-500/10 to-violet-500/5",   icon: "text-violet-600",  chip: "bg-violet-100 text-violet-700" },
  sky:     { bg: "from-sky-500/10 to-sky-500/5",         icon: "text-sky-600",     chip: "bg-sky-100 text-sky-700" },
  rose:    { bg: "from-rose-500/10 to-rose-500/5",       icon: "text-rose-600",    chip: "bg-rose-100 text-rose-700" },
};

const KPI = ({
  label, value, icon: Icon, color, change,
}: {
  label: string;
  value: string | number;
  icon: any;
  color: keyof typeof colorClasses;
  change?: number | null;
}) => {
  const cls = colorClasses[color];
  return (
    <div className="relative bg-background rounded-2xl border border-border p-5 overflow-hidden">
      <div className={`absolute -top-8 -right-8 w-24 h-24 rounded-full bg-gradient-to-br ${cls.bg} blur-2xl opacity-60`} />
      <div className={`relative w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${cls.icon} bg-current/10`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="relative font-display text-2xl xl:text-3xl">{value}</div>
      <div className="relative text-xs font-medium mt-0.5">{label}</div>
      {change !== undefined && change !== null && (
        <div className={`relative inline-flex items-center gap-1 mt-2 text-[10px] px-2 py-0.5 rounded-full font-medium ${
          change >= 0 ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
        }`}>
          {change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {change >= 0 ? "+" : ""}{change.toFixed(1)}%
        </div>
      )}
    </div>
  );
};

export default AdminAnalytics;
