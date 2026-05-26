import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { formatINR } from "@/lib/site";
import { Search, X, Users, ChevronDown, ChevronRight, Award, Phone, Mail } from "lucide-react";
import { toast } from "sonner";
import { TableRowSkeleton } from "@/components/admin/Skeleton";
import EmptyState from "@/components/admin/EmptyState";

type Order = {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string | null;
  items: any;
  total: number;
  status: string;
  created_at: string;
};

type Customer = {
  key: string;
  name: string;
  phone: string | null;
  email: string | null;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  orders: Order[];
};

type SortField = "totalSpent" | "totalOrders" | "lastOrderDate";

const AdminCustomers = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortField>("totalSpent");
  const [expandedCustomer, setExpandedCustomer] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) throw error;
        setOrders((data ?? []) as Order[]);
      } catch (err: any) {
        toast.error("Failed to load orders");
      }
      setLoading(false);
    };
    load();
  }, []);

  const customers = useMemo(() => {
    const map = new Map<string, Customer>();

    for (const order of orders) {
      const key = order.customer_phone || order.customer_email || order.customer_name;
      if (!key) continue;

      if (!map.has(key)) {
        map.set(key, {
          key,
          name: order.customer_name,
          phone: order.customer_phone,
          email: order.customer_email,
          totalOrders: 0,
          totalSpent: 0,
          lastOrderDate: order.created_at,
          orders: [],
        });
      }

      const customer = map.get(key)!;
      customer.totalOrders += 1;
      customer.totalSpent += order.total || 0;
      if (order.created_at > customer.lastOrderDate) {
        customer.lastOrderDate = order.created_at;
      }
      // Update name/email if newer order has them
      if (order.customer_name) customer.name = order.customer_name;
      if (order.customer_email) customer.email = order.customer_email;
      if (order.customer_phone) customer.phone = order.customer_phone;
      customer.orders.push(order);
    }

    return Array.from(map.values());
  }, [orders]);

  const filtered = useMemo(() => {
    let result = customers;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name?.toLowerCase().includes(q) ||
          c.phone?.toLowerCase().includes(q) ||
          c.email?.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      if (sortBy === "totalSpent") return b.totalSpent - a.totalSpent;
      if (sortBy === "totalOrders") return b.totalOrders - a.totalOrders;
      return new Date(b.lastOrderDate).getTime() - new Date(a.lastOrderDate).getTime();
    });

    return result;
  }, [customers, search, sortBy]);

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
    <div className="pb-24 lg:pb-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl" style={{ color: "#1a1208" }}>Customers</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {customers.length} customers · {customers.filter((c) => c.totalOrders >= 3).length} top customers · {formatINR(customers.reduce((s, c) => s + c.totalSpent, 0))} total revenue
          </p>
        </div>
      </div>

      {/* Search + Sort */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/80 backdrop-blur border border-[#e5e0d8]/60 flex-1 max-w-md shadow-sm">
          <Search className="w-4 h-4 text-muted-foreground/60 shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, phone, email…"
            className="flex-1 outline-none bg-transparent text-sm placeholder:text-muted-foreground/50"
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-muted-foreground hover:text-foreground">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {([
            { id: "totalSpent", label: "Top Spenders" },
            { id: "totalOrders", label: "Most Orders" },
            { id: "lastOrderDate", label: "Recent" },
          ] as const).map((s) => (
            <button
              key={s.id}
              onClick={() => setSortBy(s.id)}
              className={`px-3.5 py-1.5 rounded-full text-[11px] uppercase tracking-wider font-semibold border transition-all ${
                sortBy === s.id
                  ? "border-[#1a1208] bg-[#1a1208] text-[#fdf9f0]"
                  : "border-[#e5e0d8] text-muted-foreground hover:border-[#c9a84c]/50 bg-white/60"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-[#e5e0d8]/60 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <TableRowSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title={customers.length === 0 ? "No customers yet" : "No matching customers"}
          description={customers.length === 0 ? "Customers will appear here when orders are placed" : "Try adjusting your search"}
        />
      ) : (
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-[#e5e0d8]/60 overflow-hidden">
          {/* Table header */}
          <div className="hidden sm:grid grid-cols-[1.5fr_1fr_1.2fr_0.7fr_0.8fr_0.8fr_40px] gap-4 px-5 py-3 border-b border-[#e5e0d8]/40 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
            <span>Name</span>
            <span>Phone</span>
            <span>Email</span>
            <span>Orders</span>
            <span>Total Spent</span>
            <span>Last Order</span>
            <span></span>
          </div>

          {/* Rows */}
          {filtered.map((c) => (
            <div key={c.key}>
              <div
                onClick={() => setExpandedCustomer(expandedCustomer === c.key ? null : c.key)}
                className="grid grid-cols-1 sm:grid-cols-[1.5fr_1fr_1.2fr_0.7fr_0.8fr_0.8fr_40px] gap-2 sm:gap-4 px-5 py-3.5 border-b border-[#e5e0d8]/30 hover:bg-[#f8f5f0] cursor-pointer transition-colors items-center"
              >
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium" style={{ color: "#1a1208" }}>{c.name}</div>
                  {c.totalOrders >= 3 && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-bold bg-[#c9a84c]/10 text-[#8a6d2b] border border-[#c9a84c]/30">
                      <Award className="w-3 h-3" /> Top
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Phone className="w-3 h-3" /> {c.phone || "—"}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Mail className="w-3 h-3" /> {c.email || "—"}
                </div>
                <div className="text-sm font-medium" style={{ color: "#1a1208" }}>{c.totalOrders}</div>
                <div className="text-sm font-semibold" style={{ color: "#1a1208" }}>{formatINR(c.totalSpent)}</div>
                <div className="text-xs text-muted-foreground">
                  {new Date(c.lastOrderDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" })}
                </div>
                <div className="hidden sm:block">
                  {expandedCustomer === c.key ? (
                    <ChevronDown className="w-4 h-4 text-muted-foreground/50" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-muted-foreground/30" />
                  )}
                </div>
              </div>

              {/* Expanded order history */}
              {expandedCustomer === c.key && (
                <div className="bg-[#f8f5f0] border-b border-[#e5e0d8]/30 px-5 py-4">
                  <h4 className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold mb-3">
                    Order History
                  </h4>
                  <div className="space-y-2">
                    {c.orders.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center gap-4 bg-white rounded-xl px-4 py-3 border border-[#e5e0d8]/40"
                      >
                        <div className="text-sm font-medium" style={{ color: "#1a1208" }}>
                          #{order.order_number}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                        <div className="text-sm font-semibold" style={{ color: "#1a1208" }}>
                          {formatINR(order.total)}
                        </div>
                        <span
                          className={`text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full border ${statusColor(order.status)}`}
                        >
                          {order.status}
                        </span>
                        <div className="text-xs text-muted-foreground ml-auto">
                          {Array.isArray(order.items) ? `${order.items.length} item${order.items.length !== 1 ? "s" : ""}` : ""}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminCustomers;
