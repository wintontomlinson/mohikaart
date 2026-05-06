import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { formatINR } from "@/lib/site";
import { Eye, X, ChevronDown } from "lucide-react";
import { toast } from "sonner";

type Order = {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  shipping_city: string;
  shipping_state: string | null;
  shipping_pincode: string;
  items: any;
  subtotal: number;
  total: number;
  status: string;
  payment_method: string | null;
  notes: string | null;
  created_at: string;
};

const STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

const statusColors: Record<string, string> = {
  pending:   "bg-amber-100 text-amber-700 border-amber-200",
  confirmed: "bg-blue-100 text-blue-700 border-blue-200",
  shipped:   "bg-indigo-100 text-indigo-700 border-indigo-200",
  delivered: "bg-emerald-100 text-emerald-700 border-emerald-200",
  cancelled: "bg-rose-100 text-rose-700 border-rose-200",
};

const fmt = (d: string) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState("all");
  const [viewing, setViewing] = useState<Order | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = async () => {
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    setOrders((data ?? []) as Order[]);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    setUpdatingId(null);
    if (error) return toast.error(error.message);
    toast.success("Status updated");
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o));
    if (viewing?.id === id) setViewing((v) => v ? { ...v, status } : v);
  };

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const counts = STATUSES.reduce((acc, s) => ({ ...acc, [s]: orders.filter((o) => o.status === s).length }), {} as Record<string, number>);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-4xl">Orders</h1>
        <p className="text-sm text-muted-foreground mt-1">{orders.length} total orders</p>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all ${filter === "all" ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"}`}
        >
          All ({orders.length})
        </button>
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium border capitalize transition-all ${filter === s ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"}`}
          >
            {s} ({counts[s] ?? 0})
          </button>
        ))}
      </div>

      {/* Orders table */}
      <div className="bg-background rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="text-left p-4">Order</th>
                <th className="text-left p-4 hidden md:table-cell">Customer</th>
                <th className="text-left p-4 hidden lg:table-cell">Date</th>
                <th className="text-left p-4">Total</th>
                <th className="text-left p-4">Status</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id} className="border-t border-border hover:bg-muted/20 transition-colors">
                  <td className="p-4">
                    <div className="font-medium">#{o.order_number}</div>
                    <div className="text-xs text-muted-foreground md:hidden">{o.customer_name}</div>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <div>{o.customer_name}</div>
                    <div className="text-xs text-muted-foreground">{o.customer_email}</div>
                  </td>
                  <td className="p-4 hidden lg:table-cell text-muted-foreground">{fmt(o.created_at)}</td>
                  <td className="p-4 font-medium">{formatINR(o.total)}</td>
                  <td className="p-4">
                    <div className="relative inline-flex items-center">
                      <select
                        value={o.status}
                        onChange={(e) => updateStatus(o.id, e.target.value)}
                        disabled={updatingId === o.id}
                        className={`appearance-none pl-2.5 pr-7 py-1 rounded-full text-[10px] uppercase tracking-widest font-medium border cursor-pointer outline-none transition-all ${statusColors[o.status] ?? "bg-muted text-muted-foreground border-border"}`}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s} className="text-foreground bg-background capitalize">{s}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2 w-3 h-3 pointer-events-none opacity-60" />
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setViewing(o)}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-muted transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="p-10 text-center text-muted-foreground">No orders found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {viewing && (
        <div className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-6">
          <div className="bg-background w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-t-3xl md:rounded-3xl shadow-2xl">
            <div className="sticky top-0 bg-background border-b border-border px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="font-display text-2xl">Order #{viewing.order_number}</h2>
                <p className="text-xs text-muted-foreground mt-0.5">{fmt(viewing.created_at)}</p>
              </div>
              <button onClick={() => setViewing(null)} className="w-9 h-9 rounded-full hover:bg-muted flex items-center justify-center transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status</span>
                <div className="relative inline-flex items-center">
                  <select
                    value={viewing.status}
                    onChange={(e) => updateStatus(viewing.id, e.target.value)}
                    className={`appearance-none pl-3 pr-8 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-medium border cursor-pointer outline-none ${statusColors[viewing.status] ?? "bg-muted text-muted-foreground border-border"}`}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s} className="text-foreground bg-background capitalize">{s}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2.5 w-3 h-3 pointer-events-none opacity-60" />
                </div>
              </div>

              {/* Customer */}
              <div>
                <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Customer</h3>
                <div className="bg-muted/40 rounded-xl p-4 space-y-1.5 text-sm">
                  <div className="font-medium">{viewing.customer_name}</div>
                  <div className="text-muted-foreground">{viewing.customer_email}</div>
                  <div className="text-muted-foreground">{viewing.customer_phone}</div>
                </div>
              </div>

              {/* Shipping */}
              <div>
                <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Shipping Address</h3>
                <div className="bg-muted/40 rounded-xl p-4 text-sm text-muted-foreground leading-relaxed">
                  {viewing.shipping_address}, {viewing.shipping_city}{viewing.shipping_state ? `, ${viewing.shipping_state}` : ""}, {viewing.shipping_pincode}
                </div>
              </div>

              {/* Items */}
              <div>
                <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Items</h3>
                <div className="bg-muted/40 rounded-xl overflow-hidden">
                  {(Array.isArray(viewing.items) ? viewing.items : []).map((item: any, i: number) => (
                    <div key={i} className="flex items-center justify-between px-4 py-3 border-b border-border/40 last:border-0">
                      <div>
                        <div className="text-sm font-medium">{item.name}</div>
                        <div className="text-xs text-muted-foreground">Qty: {item.qty}</div>
                      </div>
                      <div className="text-sm font-medium">{formatINR(item.price * item.qty)}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="border-t border-border pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{formatINR(viewing.subtotal)}</span>
                </div>
                <div className="flex justify-between font-semibold text-base">
                  <span>Total</span>
                  <span>{formatINR(viewing.total)}</span>
                </div>
              </div>

              {/* Notes */}
              {viewing.notes && (
                <div>
                  <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Notes</h3>
                  <div className="bg-muted/40 rounded-xl p-4 text-sm text-muted-foreground">{viewing.notes}</div>
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
