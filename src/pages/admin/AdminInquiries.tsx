import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Search, X, Mail, Phone, MessageCircle, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { TableRowSkeleton } from "@/components/admin/Skeleton";
import EmptyState from "@/components/admin/EmptyState";

type Inquiry = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  product: string | null;
  idea: string | null;
  status: string;
  created_at: string;
};

const STATUSES = ["All", "new", "replied", "closed"];

const statusColor = (s: string) => {
  switch (s) {
    case "replied": return "bg-blue-50 text-blue-700 border-blue-200";
    case "closed": return "bg-emerald-50 text-emerald-700 border-emerald-200";
    default: return "bg-amber-50 text-amber-700 border-amber-200";
  }
};

const AdminInquiries = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selected, setSelected] = useState<Inquiry | null>(null);

  const load = async () => {
    try {
      const { data } = await supabase.from("inquiries").select("*").order("created_at", { ascending: false });
      setInquiries((data ?? []) as Inquiry[]);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("inquiries").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(`Status updated to ${status}`);
    setInquiries((prev) => prev.map((inq) => inq.id === id ? { ...inq, status } : inq));
    if (selected?.id === id) setSelected({ ...selected, status });
  };

  const filtered = inquiries.filter((inq) => {
    if (statusFilter !== "All" && inq.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        inq.name?.toLowerCase().includes(q) ||
        inq.email?.toLowerCase().includes(q) ||
        inq.phone?.toLowerCase().includes(q) ||
        inq.product?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="pb-24 lg:pb-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl" style={{ color: "#1a1208" }}>Inquiries</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {inquiries.length} total · {inquiries.filter((i) => i.status === "new").length} new
          </p>
        </div>
      </div>

      {/* Search + Status Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/80 backdrop-blur border border-[#e5e0d8]/60 flex-1 max-w-md shadow-sm">
          <Search className="w-4 h-4 text-muted-foreground/60 shrink-0" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, email, phone, product…"
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
          {[...Array(6)].map((_, i) => <TableRowSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Mail}
          title={inquiries.length === 0 ? "No inquiries yet" : "No matching inquiries"}
          description={inquiries.length === 0 ? "Customer inquiries will appear here" : "Try adjusting your filters"}
        />
      ) : (
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-[#e5e0d8]/60 overflow-hidden">
          {/* Header row */}
          <div className="hidden sm:grid grid-cols-[1.2fr_1fr_1fr_0.8fr_0.7fr] gap-4 px-5 py-3 border-b border-[#e5e0d8]/40 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
            <span>Name</span>
            <span>Contact</span>
            <span>Product</span>
            <span>Date</span>
            <span>Status</span>
          </div>
          {filtered.map((inq) => (
            <div key={inq.id} onClick={() => setSelected(inq)}
              className="grid grid-cols-1 sm:grid-cols-[1.2fr_1fr_1fr_0.8fr_0.7fr] gap-2 sm:gap-4 px-5 py-3.5 border-b border-[#e5e0d8]/30 hover:bg-[#f8f5f0] cursor-pointer transition-colors items-center">
              <div className="font-medium text-sm" style={{ color: "#1a1208" }}>{inq.name}</div>
              <div className="text-xs text-muted-foreground truncate">{inq.email || inq.phone || "—"}</div>
              <div className="text-xs text-muted-foreground truncate">{inq.product || "—"}</div>
              <div className="text-xs text-muted-foreground">{new Date(inq.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</div>
              <div>
                <select value={inq.status} onClick={(e) => e.stopPropagation()}
                  onChange={(e) => updateStatus(inq.id, e.target.value)}
                  className={`text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full border outline-none cursor-pointer ${statusColor(inq.status)}`}>
                  {STATUSES.filter((s) => s !== "All").map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" onClick={() => setSelected(null)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-[0_24px_80px_-12px_rgba(26,18,8,0.18)] border border-[#e5e0d8]/60 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-6 border-b border-[#e5e0d8]/60 flex items-center justify-between">
              <h3 className="font-display text-lg" style={{ color: "#1a1208" }}>Inquiry Detail</h3>
              <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-lg hover:bg-[#f5f0e8] flex items-center justify-center transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Name */}
              <div>
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Name</label>
                <p className="text-sm font-medium mt-0.5" style={{ color: "#1a1208" }}>{selected.name}</p>
              </div>

              {/* Contact */}
              {selected.email && (
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Email</label>
                  <p className="text-sm mt-0.5" style={{ color: "#1a1208" }}>{selected.email}</p>
                </div>
              )}
              {selected.phone && (
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Phone</label>
                  <p className="text-sm mt-0.5" style={{ color: "#1a1208" }}>{selected.phone}</p>
                </div>
              )}

              {/* Product */}
              {selected.product && (
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Product/Idea</label>
                  <p className="text-sm mt-0.5" style={{ color: "#1a1208" }}>{selected.product}</p>
                </div>
              )}

              {/* Idea / Message */}
              {selected.idea && (
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Message</label>
                  <p className="text-sm mt-0.5 leading-relaxed bg-[#f8f5f0] rounded-xl p-3 border border-[#e5e0d8]/40" style={{ color: "#1a1208" }}>{selected.idea}</p>
                </div>
              )}

              {/* Date */}
              <div>
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Received</label>
                <p className="text-sm mt-0.5 text-muted-foreground">{new Date(selected.created_at).toLocaleString("en-IN")}</p>
              </div>

              {/* Status */}
              <div className="flex items-center gap-3">
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Status</label>
                <select value={selected.status}
                  onChange={(e) => updateStatus(selected.id, e.target.value)}
                  className={`text-[11px] uppercase tracking-wider font-semibold px-3 py-1.5 rounded-full border outline-none cursor-pointer ${statusColor(selected.status)}`}>
                  {STATUSES.filter((s) => s !== "All").map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Quick Reply Actions */}
              <div className="flex gap-3 pt-3 border-t border-[#e5e0d8]/40">
                {selected.email && (
                  <a href={`mailto:${selected.email}?subject=Re: Your inquiry at Mohika Art`}
                    target="_blank" rel="noopener"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#e5e0d8] text-sm hover:bg-[#f5f0e8] transition-colors">
                    <Mail className="w-4 h-4" style={{ color: "#c9a84c" }} /> Email
                    <ExternalLink className="w-3 h-3 text-muted-foreground/40" />
                  </a>
                )}
                {selected.phone && (
                  <a href={`https://wa.me/${selected.phone.replace(/\D/g, "")}?text=Hi ${selected.name}, regarding your inquiry at Mohika Art...`}
                    target="_blank" rel="noopener"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#e5e0d8] text-sm hover:bg-[#f5f0e8] transition-colors">
                    <MessageCircle className="w-4 h-4 text-emerald-600" /> WhatsApp
                    <ExternalLink className="w-3 h-3 text-muted-foreground/40" />
                  </a>
                )}
                {selected.phone && (
                  <a href={`tel:${selected.phone}`}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#e5e0d8] text-sm hover:bg-[#f5f0e8] transition-colors">
                    <Phone className="w-4 h-4 text-blue-600" /> Call
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInquiries;
