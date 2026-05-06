import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { formatINR } from "@/lib/site";
import { Package, ShoppingCart, IndianRupee, TrendingUp, Star, AlertCircle, Mail } from "lucide-react";
import { Link } from "react-router-dom";

type Stats = {
  totalProducts: number;
  featuredProducts: number;
  outOfStock: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  recentOrders: any[];
  newInquiries: number;
  totalInquiries: number;
};

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [{ data: products }, { data: orders }, { data: inquiries }] = await Promise.all([
        supabase.from("products").select("id,featured,in_stock"),
        supabase.from("orders").select("id,status,total,created_at,customer_name,order_number").order("created_at", { ascending: false }).limit(5),
        supabase.from("inquiries").select("id,status"),
      ]);
      const allOrders = orders ?? [];
      const allInquiries = inquiries ?? [];
      setStats({
        totalProducts: products?.length ?? 0,
        featuredProducts: products?.filter((p) => p.featured).length ?? 0,
        outOfStock: products?.filter((p) => !p.in_stock).length ?? 0,
        totalOrders: allOrders.length,
        pendingOrders: allOrders.filter((o) => o.status === "pending").length,
        totalRevenue: allOrders.reduce((s, o) => s + (o.total || 0), 0),
        recentOrders: allOrders.slice(0, 5),
        newInquiries: allInquiries.filter((i) => i.status === "new").length,
        totalInquiries: allInquiries.length,
      });
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
  );

  const s = stats!;
  const statCards = [
    { label: "Total Products", value: s.totalProducts, sub: `${s.featuredProducts} featured`, icon: Package, color: "bg-violet-50 text-violet-600", link: "/admin" },
    { label: "Total Orders", value: s.totalOrders, sub: `${s.pendingOrders} pending`, icon: ShoppingCart, color: "bg-amber-50 text-amber-600", link: "/admin/orders" },
    { label: "Revenue", value: formatINR(s.totalRevenue), sub: "from all orders", icon: IndianRupee, color: "bg-emerald-50 text-emerald-600", link: "/admin/orders" },
    { label: "Out of Stock", value: s.outOfStock, sub: "need restocking", icon: AlertCircle, color: "bg-rose-50 text-rose-600", link: "/admin/products" },
    { label: "Inquiries", value: s.totalInquiries, sub: `${s.newInquiries} new`, icon: Mail, color: "bg-sky-50 text-sky-600", link: "/admin/inquiries" },
  ];

  const statusColor: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700",
    confirmed: "bg-blue-100 text-blue-700",
    shipped: "bg-indigo-100 text-indigo-700",
    delivered: "bg-emerald-100 text-emerald-700",
    cancelled: "bg-rose-100 text-rose-700",
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Overview of your store</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((c) => (
          <Link key={c.label} to={c.link}
            className="bg-background rounded-2xl border border-border p-5 hover:border-foreground/20 hover:shadow-sm transition-all group"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${c.color}`}>
              <c.icon className="w-5 h-5" />
            </div>
            <div className="font-display text-2xl xl:text-3xl">{c.value}</div>
            <div className="text-xs font-medium mt-0.5">{c.label}</div>
            <div className="text-[11px] text-muted-foreground mt-0.5">{c.sub}</div>
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-background rounded-2xl border border-border overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="font-display text-xl">Recent Orders</h2>
          <Link to="/admin/orders" className="text-xs text-foreground/50 hover:text-foreground transition-colors tracking-wide">View all →</Link>
        </div>
        {s.recentOrders.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">No orders yet.</div>
        ) : (
          <div className="divide-y divide-border">
            {s.recentOrders.map((o) => (
              <div key={o.id} className="flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors">
                <div>
                  <div className="text-sm font-medium">#{o.order_number}</div>
                  <div className="text-xs text-muted-foreground">{o.customer_name}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full font-medium ${statusColor[o.status] ?? "bg-muted text-muted-foreground"}`}>
                    {o.status}
                  </span>
                  <span className="text-sm font-medium">{formatINR(o.total)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick links */}
      <div className="grid sm:grid-cols-4 gap-4">
        {[
          { to: "/admin/products", icon: Package, label: "Manage Products", desc: "Add, edit or remove products" },
          { to: "/admin/categories", icon: TrendingUp, label: "Manage Categories", desc: "Organize your product categories" },
          { to: "/admin/inquiries", icon: Mail, label: "View Inquiries", desc: "Reply to customer contact forms" },
          { to: "/admin/images", icon: Star, label: "Site Images", desc: "Update photos across the site" },
        ].map((q) => (
          <Link key={q.to} to={q.to}
            className="bg-background rounded-2xl border border-border p-5 hover:border-foreground/25 hover:shadow-sm transition-all"
          >
            <q.icon className="w-5 h-5 mb-3 text-muted-foreground" />
            <div className="font-medium text-sm">{q.label}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{q.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
