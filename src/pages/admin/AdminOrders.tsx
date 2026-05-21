import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { formatINR } from "@/lib/site";
import { Search, X, Download, ShoppingCart, ChevronRight, Package } from "lucide-react";
import { toast } from "sonner";
import { TableRowSkeleton } from "@/components/admin/Skeleton";
import EmptyState from "@/components/admin/EmptyState";

type Order = {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string | null;
  shipping_address: string | null;
  shipping_city: string | null;
  shipping_state: string | null;
  shipping_pincode: string | null;
  items: any;
  subtotal: number;
  total: number;
  status: string;
  payment_method: string | null;
  notes: string | null;
  created_at: string;
};

const STATUSES = ["All", "pending", "confirmed", "shipped", "delivered", "cancelled"];

const statusColor = (s: string) => {
  switch (s) {
    case "delivered": return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "shipped": return "bg-blue-50 text-blue-700 border-blue-200";
    case "confirmed": return "bg-indigo-50 text-indigo-700 border-indigo-200";
    case "cancelled": return "bg-red-50 text-red-700 border-red-200";
    default: return "bg-amber-50 text-amber-700 border-amber-200";
  }
};

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const load = async () => {
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    setOrders((data ?? []) as Order[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (orderId: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);
    if (error) return toast.error(error.message);
    toast.success(`Status updated to ${status}`);
    setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status } : o));
    if (selectedOrder?.id === orderId) setSelectedOrder({ ...selectedOrder, status });
  };

  const filtered = orders.filter((o) => {
    if (statusFilter !== "All" && o.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        o.order_number?.toLowerCase().includes(q) ||
        o.customer_name?.toLowerCase().includes(q) ||
        o.customer_email?.toLowerCase().includes(q) ||
        o.shipping_city?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const exportCSV = () => {
    const headers = ["Order#", "Customer", "Email", "Phone", "City", "Total", "Status", "Date"];
    const rows = filtered.map((o) => [
      o.order_number, o.customer_name, o.customer_email || "", o.customer_phone || "",
      o.shipping_city || "", o.total, o.status, new Date(o.created_at).toLocaleDateString("en-IN"),
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported");
  };

  return (
    <div className="pb-24 lg:pb-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl" style={{ color: "#1a1208" }}>Orders</h1>
          <p className="text-sm text-muted-foreground mt-1">{orders.length} total orders</p>
        </div>
        <button onClick={exportCSV}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#e5e0d8] text-sm font-medium hover:bg-[#f5f0e8] transition-colors bg-white/70">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Search + Status Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/80 backdrop-blur border border-[#e5e0d8]/60 flex-1 max-w-md shadow-sm">
          <Search className="w-4 h-4 text-muted-foreground/60 shrink-0" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by order#, name, email, city…"
            className="flex-1 outline-none bg-transparent text-sm placeholder:text-muted-foreground/50" />
          {search && <button onClick={() => setSearch("")} className="text-muted-foreground hover:text-foreground"><X className="w-3.5 h-3.5" /></button>}
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {STATUSES.map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3.5 py-1.5 rounded-full text-[11px] uppercase tracking-wider font-semibold border transition-all ${
                statusFilter === s ? "border-[#1a1208] bg-[#1a1208] text-[#fdf9f0]" : "border-[#e5e0d8] text-muted-foreground hover:border-[#c9a84c]/50 bg-white/60"
              }`}>
              {s === "All" ? "All" : s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-[#e5e0d8]/60 overflow-hidden">
          {[...Array(8)].map((_, i) => <TableRowSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={ShoppingCart}
          title={orders.length === 0 ? "No orders yet" : "No matching orders"}
          description={orders.length === 0 ? "Orders will appear here when customers place them" : "Try adjusting your filters"}
        />
      ) : (
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-[#e5e0d8]/60 overflow-hidden">
          {/* Table header */}
          <div className="hidden sm:grid grid-cols-[1fr_1.2fr_0.8fr_0.8fr_0.8fr_40px] gap-4 px-5 py-3 border-b border-[#e5e0d8]/40 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
            <span>Order #</span>
            <span>Customer</span>
            <span>Date</span>
            <span>Total</span>
            <span>Status</span>
            <span></span>
          </div>
          {/* Rows */}
          {filtered.map((o) => (
            <div key={o.id} onClick={() => setSelectedOrder(o)}
              className="grid grid-cols-1 sm:grid-cols-[1fr_1.2fr_0.8fr_0.8fr_0.8fr_40px] gap-2 sm:gap-4 px-5 py-3.5 border-b border-[#e5e0d8]/30 hover:bg-[#f8f5f0] cursor-pointer transition-colors items-center">
              <div className="font-medium text-sm" style={{ color: "#1a1208" }}>#{o.order_number}</div>
              <div>
                <div className="text-sm" style={{ color: "#1a1208" }}>{o.customer_name}</div>
                <div className="text-[11px] text-muted-foreground">{o.customer_email || o.customer_phone}</div>
              </div>
              <div className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" })}</div>
              <div className="text-sm font-semibold" style={{ color: "#1a1208" }}>{formatINR(o.total)}</div>
              <div>
                <select value={o.status} onClick={(e) => e.stopPropagation()}
                  onChange={(e) => updateStatus(o.id, e.target.value)}
                  className={`text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full border outline-none cursor-pointer ${statusColor(o.status)}`}>
                  {STATUSES.filter((s) => s !== "All").map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground/30 hidden sm:block" />
            </div>
          ))}
        </div>
      )}

      {/* Order Detail Drawer */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
          <div className="relative w-full max-w-lg h-full bg-[#fdf9f0] border-l border-[#e5e0d8] shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="sticky top-0 bg-[#fdf9f0] border-b border-[#e5e0d8]/60 p-6 flex items-center justify-between z-10">
              <div>
                <h2 className="font-display text-xl" style={{ color: "#1a1208" }}>Order #{selectedOrder.order_number}</h2>
                <p className="text-xs text-muted-foreground mt-0.5">{new Date(selectedOrder.created_at).toLocaleString("en-IN")}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="w-9 h-9 rounded-xl hover:bg-[#f5f0e8] flex items-center justify-center transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status */}
              <div className="flex items-center gap-3">
                <label className="text-[11px] uppercase tracking-widest text-muted-foreground font-medium">Status</label>
                <select value={selectedOrder.status}
                  onChange={(e) => updateStatus(selectedOrder.id, e.target.value)}
                  className={`text-[11px] uppercase tracking-wider font-semibold px-3 py-1.5 rounded-full border outline-none cursor-pointer ${statusColor(selectedOrder.status)}`}>
                  {STATUSES.filter((s) => s !== "All").map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Customer */}
              <div className="bg-white rounded-xl border border-[#e5e0d8]/60 p-4 space-y-2">
                <h3 className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-3">Customer</h3>
                <div className="text-sm font-medium" style={{ color: "#1a1208" }}>{selectedOrder.customer_name}</div>
                {selectedOrder.customer_email && <div className="text-xs text-muted-foreground">{selectedOrder.customer_email}</div>}
                {selectedOrder.customer_phone && <div className="text-xs text-muted-foreground">{selectedOrder.customer_phone}</div>}
              </div>

              {/* Shipping */}
              <div className="bg-white rounded-xl border border-[#e5e0d8]/60 p-4 space-y-2">
                <h3 className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-3">Shipping Address</h3>
                <div className="text-sm" style={{ color: "#1a1208" }}>
                  {selectedOrder.shipping_address && <div>{selectedOrder.shipping_address}</div>}
                  <div>
                    {[selectedOrder.shipping_city, selectedOrder.shipping_state, selectedOrder.shipping_pincode].filter(Boolean).join(", ")}
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="bg-white rounded-xl border border-[#e5e0d8]/60 p-4">
                <h3 className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-3">Items</h3>
                <div className="space-y-3">
                  {(Array.isArray(selectedOrder.items) ? selectedOrder.items : []).map((item: any, i: number) => (
                    <div key={i} className="flex items-center gap-3 py-2 border-b border-[#e5e0d8]/30 last:border-0">
                      <div className="w-10 h-10 rounded-lg bg-[#f8f5f0] flex items-center justify-center shrink-0">
                        <Package className="w-4 h-4 text-muted-foreground/40" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate" style={{ color: "#1a1208" }}>{item.name || item.product_name || "Item"}</div>
                        <div className="text-[11px] text-muted-foreground">Qty: {item.quantity || item.qty || 1}</div>
                      </div>
                      <div className="text-sm font-semibold" style={{ color: "#1a1208" }}>{formatINR(item.price || item.total || 0)}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="bg-white rounded-xl border border-[#e5e0d8]/60 p-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span style={{ color: "#1a1208" }}>{formatINR(selectedOrder.subtotal || 0)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold pt-2 border-t border-[#e5e0d8]/40">
                  <span style={{ color: "#1a1208" }}>Total</span>
                  <span style={{ color: "#1a1208" }}>{formatINR(selectedOrder.total)}</span>
                </div>
              </div>

              {/* Payment & Notes */}
              {(selectedOrder.payment_method || selectedOrder.notes) && (
                <div className="bg-white rounded-xl border border-[#e5e0d8]/60 p-4 space-y-2">
                  {selectedOrder.payment_method && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Payment</span>
                      <span className="font-medium capitalize" style={{ color: "#1a1208" }}>{selectedOrder.payment_method}</span>
                    </div>
                  )}
                  {selectedOrder.notes && (
                    <div>
                      <span className="text-xs text-muted-foreground">Notes:</span>
                      <p className="text-sm mt-1" style={{ color: "#1a1208" }}>{selectedOrder.notes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
