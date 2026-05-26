import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Activity, ShoppingCart, Package, Clock, Filter } from "lucide-react";
import { toast } from "sonner";
import { TableRowSkeleton } from "@/components/admin/Skeleton";
import EmptyState from "@/components/admin/EmptyState";

type Order = {
  id: string;
  order_number: string;
  customer_name: string;
  status: string;
  created_at: string;
  updated_at?: string;
};

type Product = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at?: string;
};

type LogEntry = {
  id: string;
  type: "order" | "product";
  icon: typeof ShoppingCart | typeof Package;
  description: string;
  timestamp: string;
  color: string;
};

type FilterType = "all" | "orders" | "products";

const timeAgo = (date: string): string => {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
};

const AdminActivityLog = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("all");

  useEffect(() => {
    const load = async () => {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          supabase.from("orders").select("id,order_number,customer_name,status,created_at,updated_at").order("created_at", { ascending: false }).limit(100),
          supabase.from("products").select("id,name,slug,created_at,updated_at").order("created_at", { ascending: false }).limit(100),
        ]);

        setOrders((ordersRes.data ?? []) as Order[]);
        setProducts((productsRes.data ?? []) as Product[]);
      } catch (err: any) {
        toast.error("Failed to load activity data");
      }
      setLoading(false);
    };
    load();
  }, []);

  const logEntries = useMemo(() => {
    const entries: LogEntry[] = [];

    // Order entries — show status changes (when updated_at differs from created_at)
    for (const order of orders) {
      // Order creation
      entries.push({
        id: `order-created-${order.id}`,
        type: "order",
        icon: ShoppingCart,
        description: `New order #${order.order_number} from ${order.customer_name}`,
        timestamp: order.created_at,
        color: "text-blue-600 bg-blue-50 border-blue-200",
      });

      // If updated_at differs significantly from created_at, show a status change entry
      if (order.updated_at && order.updated_at !== order.created_at) {
        const createdTime = new Date(order.created_at).getTime();
        const updatedTime = new Date(order.updated_at).getTime();
        if (updatedTime - createdTime > 60000) {
          entries.push({
            id: `order-updated-${order.id}`,
            type: "order",
            icon: ShoppingCart,
            description: `Order #${order.order_number} status changed to "${order.status}"`,
            timestamp: order.updated_at,
            color: order.status === "delivered"
              ? "text-emerald-600 bg-emerald-50 border-emerald-200"
              : order.status === "cancelled"
              ? "text-red-600 bg-red-50 border-red-200"
              : "text-amber-600 bg-amber-50 border-amber-200",
          });
        }
      }
    }

    // Product entries
    for (const product of products) {
      entries.push({
        id: `product-created-${product.id}`,
        type: "product",
        icon: Package,
        description: `Product added: "${product.name}"`,
        timestamp: product.created_at,
        color: "text-purple-600 bg-purple-50 border-purple-200",
      });

      if (product.updated_at && product.updated_at !== product.created_at) {
        const createdTime = new Date(product.created_at).getTime();
        const updatedTime = new Date(product.updated_at).getTime();
        if (updatedTime - createdTime > 60000) {
          entries.push({
            id: `product-updated-${product.id}`,
            type: "product",
            icon: Package,
            description: `Product updated: "${product.name}"`,
            timestamp: product.updated_at,
            color: "text-indigo-600 bg-indigo-50 border-indigo-200",
          });
        }
      }
    }

    // Sort by timestamp desc
    entries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return entries;
  }, [orders, products]);

  const filteredEntries = useMemo(() => {
    if (filter === "all") return logEntries;
    if (filter === "orders") return logEntries.filter((e) => e.type === "order");
    if (filter === "products") return logEntries.filter((e) => e.type === "product");
    return logEntries;
  }, [logEntries, filter]);

  return (
    <div className="pb-24 lg:pb-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl" style={{ color: "#1a1208" }}>Activity Log</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {logEntries.length} activities tracked · {orders.length} orders · {products.length} products
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6">
        <Filter className="w-4 h-4 text-muted-foreground/50" />
        {([
          { id: "all", label: "All" },
          { id: "orders", label: "Orders" },
          { id: "products", label: "Products" },
        ] as const).map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-3.5 py-1.5 rounded-full text-[11px] uppercase tracking-wider font-semibold border transition-all ${
              filter === f.id
                ? "border-[#1a1208] bg-[#1a1208] text-[#fdf9f0]"
                : "border-[#e5e0d8] text-muted-foreground hover:border-[#c9a84c]/50 bg-white/60"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Timeline */}
      {loading ? (
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-[#e5e0d8]/60 overflow-hidden">
          {[...Array(10)].map((_, i) => (
            <TableRowSkeleton key={i} />
          ))}
        </div>
      ) : filteredEntries.length === 0 ? (
        <EmptyState
          icon={Activity}
          title="No activity yet"
          description="Activity will appear here as orders are placed and products are updated"
        />
      ) : (
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-[#e5e0d8]/60 overflow-hidden">
          <div className="divide-y divide-[#e5e0d8]/30">
            {filteredEntries.slice(0, 100).map((entry) => {
              const Icon = entry.icon;
              return (
                <div key={entry.id} className="flex items-center gap-4 px-5 py-4 hover:bg-[#f8f5f0] transition-colors">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${entry.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm leading-snug" style={{ color: "#1a1208" }}>
                      {entry.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
                    <Clock className="w-3 h-3" />
                    {timeAgo(entry.timestamp)}
                  </div>
                </div>
              );
            })}
          </div>
          {filteredEntries.length > 100 && (
            <div className="px-5 py-3 text-xs text-center text-muted-foreground border-t border-[#e5e0d8]/30">
              Showing most recent 100 of {filteredEntries.length} activities
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminActivityLog;
