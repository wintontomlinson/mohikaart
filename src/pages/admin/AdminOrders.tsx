import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { formatINR } from "@/lib/site";
import { Eye, X, ChevronDown, Search, Download, Package } from "lucide-react";
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

const STATUSES = ["pending", "payment_submitted", "confirmed", "shipped", "delivered", "cancelled"];

const statusStyles: Record<string, string> = {
  pending:           "bg-amber-500/10 text-amber-400 border-amber-500/20",
  payment_submitted: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  confirmed:         "bg-blue-500/10 text-blue-400 border-blue-500/20",
  shipped:           "bg-violet-500/10 text-violet-400 border-violet-500/20",
  delivered:         "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  cancelled:         "bg-red-500/10 text-red-400 border-red-500/20",
};

const fmt = (d: string) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
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

  const matchesSearch = (o: Order) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      o.order_number.toLowerCase().includes(q) ||
      o.customer_name.toLowerCase().includes(q) ||
      o.customer_email.toLowerCase().includes(q) ||
      (o.customer_phone || "").toLowerCase().includes(q) ||
      (o.shipping_city || "").toLowerCase().includes(q)
    );
  };

  const filtered = orders
    .filter((o) => filter === "all" ? true : o.status === filter)
    .filter(matchesSearch);

  const counts = STATUSES.reduce((acc, s) => ({ ...acc, [s]: orders.filter((o) => o.status === s).length }), {} as Record<string, number>);

  const exportCSV = () => {
    const headers = ["Order #", "Date", "Status", "Customer", "Email", "Phone", "Address", "City", "State", "Pincode", "Subtotal", "Total", "Payment Method"];
    const rows = filtered.map((o) => [
      o.order_number, new Date(o.created_at).toISOString(), o.status,
      o.customer_name, o.customer_email, o.customer_phone,
      o.shipping_address, o.shipping_city, o.shipping_state ?? "", o.shipping_pincode,
      o.subtotal, o.total, o.payment_method ?? "",
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mohika-orders-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="pb-20 lg:pb-0">
      {/* Header */}
      <div className="mb-6 flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-white text-3xl font-semibold">Orders</h1>
          <p className="text-sm text-white/40 mt-1">{orders.length} total · {filtered.length} shown</p>
        </div>
        <button
          onClick={exportCSV}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm text-white/60 hover:bg-white/[0.08] hover:text-white/90 transition-all"
        >
          <Download className="w-3.5 h-3.5" /> Export CSV
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#1a1a22] border border-white/[0.06] max-w-md mb-4">
        <Search className="w-4 h-4 text-white/25 shrink-0" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by order #, name, email, phone, city…"
          className="flex-1 outline-none bg-transparent text-sm text-white placeholder:text-white/25"
        />
        {search && (
          <button onClick={() => setSearch("")} className="text-white/30 hover:text-white/60">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <FilterBtn active={filter === "all"} onClick={() => setFilter("all")}>
          All ({orders.length})
        </FilterBtn>
        {STATUSES.map((s) => (
          <FilterBtn key={s} active={filter === s} onClick={() => setFilter(s)}>
            {s.replace("_", " ")} ({counts[s] ?? 0})
          </FilterBtn>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-[#1a1a22] rounded-2xl border border-white/[0.04] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.04]">
                <th className="text-left p-4 text-[11px] uppercase tracking-widest text-white/30 font-medium">Order</th>
                <th className="text-left p-4 text-[11px] uppercase tracking-widest text-white/30 font-medium hidden md:table-cell">Customer</th>
                <th className="text-left p-4 text-[11px] uppercase tracking-widest text-white/30 font-medium hidden lg:table-cell">Date</th>
                <th className="text-left p-4 text-[11px] uppercase tracking-widest text-white/30 font-medium">Total</th>
                <th className="text-left p-4 text-[11px] uppercase tracking-widest text-white/30 font-medium">Status</th>
                <th className="p-4 w-12"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id} className="border-t border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                  <td className="p-4">
                    <div className="text-white/80 font-medium">#{o.order_number}</div>
                    <div className="text-xs text-white/25 md:hidden">{o.customer_name}</div>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <div className="text-white/70">{o.customer_name}</div>
                    <div className="text-xs text-white/25">{o.customer_email}</div>
                  </td>
                  <td className="p-4 hidden lg:table-cell text-white/40">{fmt(o.created_at)}</td>
                  <td className="p-4 text-white/80 font-medium">{formatINR(o.total)}</td>
                  <td className="p-4">
                    <div className="relative inline-flex items-center">
                      <select
                        value={o.status}
                        onChange={(e) => updateStatus(o.id, e.target.value)}
                        disabled={updatingId === o.id}
                        className={`appearance-none pl-2.5 pr-7 py-1 rounded-lg text-[10px] uppercase tracking-widest font-medium border cursor-pointer outline-none transition-all bg-transparent ${statusStyles[o.status] ?? "bg-white/5 text-white/40 border-white/10"}`}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s} className="text-white bg-[#1a1a22] capitalize">{s}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2 w-3 h-3 pointer-events-none opacity-40" />
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setViewing(o)}
                      className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-white/30 hover:text-white/70 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="p-12 text-center text-white/20 text-sm">No orders found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {viewing && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-6">
          <div className="bg-[#1a1a22] w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-t-3xl md:rounded-2xl border border-white/[0.06] shadow-2xl">
            <div className="sticky top-0 bg-[#1a1a22] border-b border-white/[0.04] px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="text-white text-xl font-semibold">Order #{viewing.order_number}</h2>
                <p className="text-xs text-white/30 mt-0.5">{fmt(viewing.created_at)}</p>
              </div>
              <button onClick={() => setViewing(null)} className="w-9 h-9 rounded-xl hover:bg-white/5 flex items-center justify-center text-white/40 hover:text-white/70 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/70 font-medium">Status</span>
                <div className="relative inline-flex items-center">
                  <select
                    value={viewing.status}
                    onChange={(e) => updateStatus(viewing.id, e.target.value)}
                    className={`appearance-none pl-3 pr-8 py-1.5 rounded-lg text-[10px] uppercase tracking-widest font-medium border cursor-pointer outline-none bg-transparent ${statusStyles[viewing.status] ?? "bg-white/5 text-white/40 border-white/10"}`}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s} className="text-white bg-[#1a1a22] capitalize">{s}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2.5 w-3 h-3 pointer-events-none opacity-40" />
                </div>
              </div>

              {/* Customer */}
              <Section title="Customer">
                <div className="bg-white/[0.02] rounded-xl p-4 space-y-1.5 text-sm border border-white/[0.04]">
                  <div className="text-white/80 font-medium">{viewing.customer_name}</div>
                  <div className="text-white/40">{viewing.customer_email}</div>
                  <div className="text-white/40">{viewing.customer_phone}</div>
                </div>
              </Section>

              {/* Shipping */}
              <Section title="Shipping Address">
                <div className="bg-white/[0.02] rounded-xl p-4 text-sm text-white/50 leading-relaxed border border-white/[0.04]">
                  {viewing.shipping_address}, {viewing.shipping_city}{viewing.shipping_state ? `, ${viewing.shipping_state}` : ""}, {viewing.shipping_pincode}
                </div>
              </Section>

              {/* Items */}
              <Section title="Items">
                <div className="bg-white/[0.02] rounded-xl overflow-hidden border border-white/[0.04]">
                  {(Array.isArray(viewing.items) ? viewing.items : []).map((item: any, i: number) => (
                    <div key={i} className="flex items-center justify-between px-4 py-3 border-b border-white/[0.03] last:border-0">
                      <div>
                        <div className="text-sm text-white/80 font-medium">{item.name}</div>
                        <div className="text-xs text-white/30">Qty: {item.qty}</div>
                      </div>
                      <div className="text-sm text-white/70 font-medium">{formatINR(item.price * item.qty)}</div>
                    </div>
                  ))}
                </div>
              </Section>

              {/* Totals */}
              <div className="border-t border-white/[0.04] pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-white/40">
                  <span>Subtotal</span>
                  <span>{formatINR(viewing.subtotal)}</span>
                </div>
                <div className="flex justify-between text-white font-semibold text-base">
                  <span>Total</span>
                  <span>{formatINR(viewing.total)}</span>
                </div>
              </div>

              {/* Notes */}
              {viewing.notes && (
                <Section title="Notes">
                  <div className="bg-white/[0.02] rounded-xl p-4 text-sm text-white/50 border border-white/[0.04]">{viewing.notes}</div>
                </Section>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const FilterBtn = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button
    onClick={onClick}
    className={`px-3.5 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
      active
        ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
        : "bg-white/[0.03] text-white/40 border border-white/[0.06] hover:text-white/70 hover:border-white/[0.1]"
    }`}
  >
    {children}
  </button>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    <h3 className="text-[11px] uppercase tracking-widest text-white/30 font-medium mb-3">{title}</h3>
    {children}
  </div>
);

export default AdminOrders;
