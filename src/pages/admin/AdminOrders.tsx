import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { formatINR } from "@/lib/site";
import { Search, X, Download, ShoppingCart, ChevronRight, Package, Printer, StickyNote, Save, Loader2, Calendar, Truck, Copy, MessageCircle } from "lucide-react";
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
const COURIERS = ["Delhivery", "BlueDart", "DTDC", "India Post", "Other"];


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
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesDraft, setNotesDraft] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [trackingCourier, setTrackingCourier] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [savingTracking, setSavingTracking] = useState(false);

  const load = async () => {
    try {
      const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      setOrders((data ?? []) as Order[]);
    } catch {}
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

  const saveNotes = async () => {
    if (!selectedOrder) return;
    setSavingNotes(true);
    const { error } = await supabase.from("orders").update({ notes: notesDraft }).eq("id", selectedOrder.id);
    setSavingNotes(false);
    if (error) return toast.error(error.message);
    toast.success("Notes saved");
    setOrders((prev) => prev.map((o) => o.id === selectedOrder.id ? { ...o, notes: notesDraft } : o));
    setSelectedOrder({ ...selectedOrder, notes: notesDraft });
    setEditingNotes(false);
  };

  const parseTracking = (notes: string | null): { courier: string; number: string } | null => {
    if (!notes) return null;
    const match = notes.match(/\[TRACKING:(.*?)\]/);
    if (!match) return null;
    try { return JSON.parse(match[1]); } catch { return null; }
  };

  const saveTracking = async () => {
    if (!selectedOrder) return;
    setSavingTracking(true);
    const trackingJson = JSON.stringify({ courier: trackingCourier, number: trackingNumber });
    const prefix = `[TRACKING:${trackingJson}]`;
    // Remove existing tracking prefix if any
    const cleanNotes = (selectedOrder.notes || "").replace(/\[TRACKING:.*?\]\s*/g, "").trim();
    const newNotes = trackingNumber ? `${prefix} ${cleanNotes}`.trim() : cleanNotes;

    const { error } = await supabase.from("orders").update({ notes: newNotes }).eq("id", selectedOrder.id);
    setSavingTracking(false);
    if (error) return toast.error(error.message);
    toast.success("Tracking info saved");
    setOrders((prev) => prev.map((o) => o.id === selectedOrder.id ? { ...o, notes: newNotes } : o));
    setSelectedOrder({ ...selectedOrder, notes: newNotes });
    setNotesDraft(newNotes);
  };

  const copyTracking = (tracking: { courier: string; number: string }) => {
    navigator.clipboard.writeText(`${tracking.courier}: ${tracking.number}`);
    toast.success("Tracking copied to clipboard");
  };

  const sendWhatsApp = (order: Order) => {
    if (!order.customer_phone) {
      toast.error("No phone number available");
      return;
    }
    const phone = order.customer_phone.replace(/[^0-9]/g, "");
    const phoneFormatted = phone.startsWith("91") ? phone : `91${phone}`;
    const tracking = parseTracking(order.notes);
    let message = "";

    switch (order.status) {
      case "confirmed":
        message = `Hi ${order.customer_name}! Your order #${order.order_number} has been confirmed. We're preparing it with love and will notify you once it ships. Thank you for choosing Mohika Art! 🎨`;
        break;
      case "shipped":
        message = `Hi ${order.customer_name}! Your order #${order.order_number} has been shipped.${tracking ? ` Tracking: ${tracking.courier} - ${tracking.number}` : ""} You'll receive it soon! 📦`;
        break;
      case "delivered":
        message = `Hi ${order.customer_name}! Your order #${order.order_number} has been delivered. We hope you love your handcrafted piece! Thank you for shopping with Mohika Art! ❤️`;
        break;
      default:
        message = `Hi ${order.customer_name}! This is an update regarding your order #${order.order_number}. Current status: ${order.status}. Please reach out if you have any questions!`;
    }

    window.open(`https://wa.me/${phoneFormatted}?text=${encodeURIComponent(message)}`, "_blank");
  };

  const filtered = orders.filter((o) => {
    if (statusFilter !== "All" && o.status !== statusFilter) return false;
    if (dateFrom && o.created_at?.slice(0, 10) < dateFrom) return false;
    if (dateTo && o.created_at?.slice(0, 10) > dateTo) return false;
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

  const printInvoice = (order: Order) => {
    const items = Array.isArray(order.items) ? order.items : [];
    const win = window.open("", "_blank");
    if (!win) { toast.error("Popup blocked"); return; }
    win.document.write(`<!DOCTYPE html><html><head><title>Invoice #${order.order_number}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', sans-serif; padding: 40px; color: #1a1208; font-size: 13px; }
  .header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 32px; padding-bottom: 20px; border-bottom: 2px solid #c9a84c; }
  .brand { font-size: 22px; font-weight: 700; } .brand span { color: #c9a84c; font-style: italic; }
  .inv-title { font-size: 28px; color: #c9a84c; font-weight: 300; }
  .meta { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px; }
  .meta-box { padding: 16px; background: #fdf9f0; border-radius: 8px; }
  .meta-label { font-size: 9px; text-transform: uppercase; letter-spacing: 2px; color: #999; margin-bottom: 6px; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
  th { text-align: left; font-size: 9px; text-transform: uppercase; letter-spacing: 1.5px; color: #999; padding: 10px 12px; border-bottom: 1px solid #e5e0d8; }
  td { padding: 12px; border-bottom: 1px solid #f0ebe3; }
  .totals { text-align: right; margin-top: 16px; }
  .totals .row { display: flex; justify-content: flex-end; gap: 32px; padding: 6px 0; }
  .totals .total { font-size: 18px; font-weight: 700; padding-top: 12px; border-top: 2px solid #1a1208; }
  .footer { margin-top: 48px; text-align: center; font-size: 11px; color: #999; }
  @media print { body { padding: 20px; } }
</style></head><body>
<div class="header"><div><div class="brand">Mohika <span>Art</span></div><div style="font-size:11px;color:#666;margin-top:4px">Handcrafted Resin Creations</div></div><div class="inv-title">INVOICE</div></div>
<div class="meta">
  <div class="meta-box"><div class="meta-label">Bill To</div><strong>${order.customer_name}</strong><br>${order.customer_email || ""}<br>${order.customer_phone || ""}</div>
  <div class="meta-box"><div class="meta-label">Invoice Details</div><strong>#${order.order_number}</strong><br>Date: ${new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}<br>Status: ${order.status.toUpperCase()}</div>
</div>
<div class="meta">
  <div class="meta-box"><div class="meta-label">Ship To</div>${order.shipping_address || ""}<br>${[order.shipping_city, order.shipping_state, order.shipping_pincode].filter(Boolean).join(", ")}</div>
  <div class="meta-box"><div class="meta-label">Payment</div>${order.payment_method || "N/A"}</div>
</div>
<table><thead><tr><th>#</th><th>Item</th><th>Qty</th><th style="text-align:right">Price</th></tr></thead><tbody>
${items.map((item: any, i: number) => `<tr><td>${i + 1}</td><td>${item.name || item.product_name || "Item"}</td><td>${item.quantity || item.qty || 1}</td><td style="text-align:right">₹${(item.price || item.total || 0).toLocaleString("en-IN")}</td></tr>`).join("")}
</tbody></table>
<div class="totals"><div class="row"><span>Subtotal:</span><span>₹${(order.subtotal || 0).toLocaleString("en-IN")}</span></div><div class="row total"><span>Total:</span><span>₹${order.total.toLocaleString("en-IN")}</span></div></div>
${order.notes ? `<div style="margin-top:24px;padding:12px;background:#fdf9f0;border-radius:8px;font-size:12px"><strong>Notes:</strong> ${order.notes}</div>` : ""}
<div class="footer">Thank you for your order! · Mohika Art · Handcrafted with Love</div>
</body></html>`);
    win.document.close();
    setTimeout(() => win.print(), 300);
  };


  return (
    <div className="pb-24 lg:pb-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl" style={{ color: "#1a1208" }}>Orders</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {orders.length} total · {orders.filter((o) => o.status === "pending").length} pending · {formatINR(orders.filter((o) => o.status !== "cancelled").reduce((s, o) => s + o.total, 0))} revenue
          </p>
        </div>
        <button onClick={exportCSV}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#e5e0d8] text-sm font-medium hover:bg-[#f5f0e8] transition-colors bg-white/70">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Search + Status Filters + Date Range */}
      <div className="flex flex-col gap-3 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
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
        {/* Date range filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <Calendar className="w-4 h-4 text-muted-foreground/50" />
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-[#e5e0d8] text-xs bg-white/80 outline-none focus:border-[#c9a84c]" />
          <span className="text-xs text-muted-foreground">to</span>
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-[#e5e0d8] text-xs bg-white/80 outline-none focus:border-[#c9a84c]" />
          {(dateFrom || dateTo) && (
            <button onClick={() => { setDateFrom(""); setDateTo(""); }} className="text-xs text-red-500 hover:text-red-700 ml-1">Clear</button>
          )}
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
            <div key={o.id} onClick={() => { setSelectedOrder(o); setNotesDraft(o.notes || ""); setEditingNotes(false); const t = parseTracking(o.notes); setTrackingCourier(t?.courier || ""); setTrackingNumber(t?.number || ""); }}
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
                {parseTracking(o.notes) && (
                  <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-semibold bg-blue-50 text-blue-600 border border-blue-200">
                    <Truck className="w-2.5 h-2.5" /> Tracked
                  </div>
                )}
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
              <div className="flex items-center gap-2">
                <button onClick={() => printInvoice(selectedOrder)}
                  className="w-9 h-9 rounded-xl bg-[#f5f0e8] hover:bg-[#ebe5d9] flex items-center justify-center transition-colors" title="Print Invoice">
                  <Printer className="w-4 h-4" style={{ color: "#1a1208" }} />
                </button>
                <button onClick={() => setSelectedOrder(null)} className="w-9 h-9 rounded-xl hover:bg-[#f5f0e8] flex items-center justify-center transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
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
                  <div>{[selectedOrder.shipping_city, selectedOrder.shipping_state, selectedOrder.shipping_pincode].filter(Boolean).join(", ")}</div>
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

              {/* Payment */}
              {selectedOrder.payment_method && (
                <div className="bg-white rounded-xl border border-[#e5e0d8]/60 p-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Payment Method</span>
                    <span className="font-medium capitalize" style={{ color: "#1a1208" }}>{selectedOrder.payment_method}</span>
                  </div>
                </div>
              )}

              {/* Shipping Tracking */}
              <div className="bg-white rounded-xl border border-[#e5e0d8]/60 p-4">
                <h3 className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                  <Truck className="w-3.5 h-3.5" /> Shipping Tracking
                </h3>
                {(() => {
                  const tracking = parseTracking(selectedOrder.notes);
                  return (
                    <div className="space-y-3">
                      {tracking && (
                        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-blue-50 border border-blue-200">
                          <div className="flex-1">
                            <div className="text-xs font-semibold text-blue-700">{tracking.courier}</div>
                            <div className="text-sm font-mono text-blue-900">{tracking.number}</div>
                          </div>
                          <button
                            onClick={() => copyTracking(tracking)}
                            className="w-8 h-8 rounded-lg bg-white border border-blue-200 flex items-center justify-center hover:bg-blue-100 transition-colors"
                            title="Copy Tracking"
                          >
                            <Copy className="w-3.5 h-3.5 text-blue-600" />
                          </button>
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] uppercase tracking-widest mb-1 text-muted-foreground">Courier</label>
                          <select
                            value={trackingCourier}
                            onChange={(e) => setTrackingCourier(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-[#f8f5f0] border border-[#e5e0d8] focus:border-[#c9a84c] outline-none text-xs"
                          >
                            <option value="">Select courier</option>
                            {COURIERS.map((c) => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-widest mb-1 text-muted-foreground">Tracking #</label>
                          <input
                            type="text"
                            value={trackingNumber}
                            onChange={(e) => setTrackingNumber(e.target.value)}
                            placeholder="Enter tracking number"
                            className="w-full px-3 py-2 rounded-lg bg-[#f8f5f0] border border-[#e5e0d8] focus:border-[#c9a84c] outline-none text-xs"
                          />
                        </div>
                      </div>
                      <button
                        onClick={saveTracking}
                        disabled={savingTracking || (!trackingCourier && !trackingNumber)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white disabled:opacity-50"
                        style={{ background: "#1a1208" }}
                      >
                        {savingTracking ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                        Save Tracking
                      </button>
                    </div>
                  );
                })()}
              </div>

              {/* WhatsApp Update */}
              <button
                onClick={() => sendWhatsApp(selectedOrder)}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-colors bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100"
              >
                <MessageCircle className="w-4 h-4" /> Send WhatsApp Update
              </button>


              {/* Notes - Editable */}
              <div className="bg-white rounded-xl border border-[#e5e0d8]/60 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs uppercase tracking-wider font-semibold text-muted-foreground flex items-center gap-2">
                    <StickyNote className="w-3.5 h-3.5" /> Notes
                  </h3>
                  {!editingNotes && (
                    <button onClick={() => { setEditingNotes(true); setNotesDraft(selectedOrder.notes || ""); }}
                      className="text-[10px] text-[#c9a84c] hover:underline font-medium">
                      Edit
                    </button>
                  )}
                </div>
                {editingNotes ? (
                  <div className="space-y-3">
                    <textarea rows={4} value={notesDraft} onChange={(e) => setNotesDraft(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#f8f5f0] border border-[#e5e0d8] focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/20 outline-none text-sm transition-all resize-none"
                      placeholder="Add internal notes about this order…" />
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => setEditingNotes(false)}
                        className="px-3 py-1.5 rounded-lg border border-[#e5e0d8] text-xs hover:bg-[#f5f0e8] transition-colors">Cancel</button>
                      <button onClick={saveNotes} disabled={savingNotes}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white disabled:opacity-50"
                        style={{ background: "#1a1208" }}>
                        {savingNotes ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed" style={{ color: selectedOrder.notes ? "#1a1208" : "#9ca3af" }}>
                    {selectedOrder.notes || "No notes yet. Click edit to add internal notes."}
                  </p>
                )}
              </div>

              {/* Print Invoice Button */}
              <button onClick={() => printInvoice(selectedOrder)}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-[#e5e0d8] text-sm font-medium hover:bg-[#f5f0e8] transition-colors bg-white">
                <Printer className="w-4 h-4" style={{ color: "#c9a84c" }} /> Print Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
