import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Mail, ChevronDown, X, MessageSquare } from "lucide-react";
import { toast } from "sonner";

type Inquiry = {
  id: string;
  name: string;
  phone: string;
  email: string;
  product: string | null;
  idea: string;
  status: string;
  created_at: string;
};

const STATUS = ["new", "replied", "closed"];

const statusStyles: Record<string, string> = {
  new:     "bg-blue-500/10 text-blue-400 border-blue-500/20",
  replied: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  closed:  "bg-white/5 text-white/30 border-white/10",
};

const fmt = (d: string) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

const AdminInquiries = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [viewing, setViewing] = useState<Inquiry | null>(null);
  const [filter, setFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = async () => {
    const { data } = await supabase.from("inquiries").select("*").order("created_at", { ascending: false });
    setInquiries((data ?? []) as Inquiry[]);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    const { error } = await supabase.from("inquiries").update({ status }).eq("id", id);
    setUpdatingId(null);
    if (error) return toast.error(error.message);
    toast.success("Status updated");
    setInquiries((prev) => prev.map((i) => i.id === id ? { ...i, status } : i));
    if (viewing?.id === id) setViewing((v) => v ? { ...v, status } : v);
  };

  const filtered = filter === "all" ? inquiries : inquiries.filter((i) => i.status === filter);
  const counts = STATUS.reduce((acc, s) => ({ ...acc, [s]: inquiries.filter((i) => i.status === s).length }), {} as Record<string, number>);

  return (
    <div className="pb-20 lg:pb-0">
      <div className="mb-8">
        <h1 className="text-white text-3xl font-semibold">Inquiries</h1>
        <p className="text-sm text-white/40 mt-1">{inquiries.length} total from custom order form</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <FilterBtn active={filter === "all"} onClick={() => setFilter("all")}>All ({inquiries.length})</FilterBtn>
        {STATUS.map((s) => (
          <FilterBtn key={s} active={filter === s} onClick={() => setFilter(s)}>
            {s} ({counts[s] ?? 0})
          </FilterBtn>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[#1a1a22] rounded-2xl border border-white/[0.04] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.04]">
                <th className="text-left p-4 text-[11px] uppercase tracking-widest text-white/30 font-medium">Name</th>
                <th className="text-left p-4 text-[11px] uppercase tracking-widest text-white/30 font-medium hidden md:table-cell">Contact</th>
                <th className="text-left p-4 text-[11px] uppercase tracking-widest text-white/30 font-medium hidden lg:table-cell">Product</th>
                <th className="text-left p-4 text-[11px] uppercase tracking-widest text-white/30 font-medium hidden lg:table-cell">Date</th>
                <th className="text-left p-4 text-[11px] uppercase tracking-widest text-white/30 font-medium">Status</th>
                <th className="p-4 w-12"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((inq) => (
                <tr key={inq.id} className="border-t border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                  <td className="p-4">
                    <div className="text-white/80 font-medium">{inq.name}</div>
                    <div className="text-xs text-white/25 md:hidden">{inq.email}</div>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <div className="text-white/60">{inq.email}</div>
                    <div className="text-xs text-white/25">{inq.phone}</div>
                  </td>
                  <td className="p-4 hidden lg:table-cell text-white/35">{inq.product ?? "—"}</td>
                  <td className="p-4 hidden lg:table-cell text-white/30">{fmt(inq.created_at)}</td>
                  <td className="p-4">
                    <div className="relative inline-flex items-center">
                      <select
                        value={inq.status}
                        onChange={(e) => updateStatus(inq.id, e.target.value)}
                        disabled={updatingId === inq.id}
                        className={`appearance-none pl-2.5 pr-7 py-1 rounded-lg text-[10px] uppercase tracking-widest font-medium border cursor-pointer outline-none bg-transparent transition-all ${statusStyles[inq.status] ?? "bg-white/5 text-white/40 border-white/10"}`}
                      >
                        {STATUS.map((s) => (
                          <option key={s} value={s} className="text-white bg-[#1a1a22] capitalize">{s}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2 w-3 h-3 pointer-events-none opacity-40" />
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => setViewing(inq)} className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-white/30 hover:text-white/70 transition-colors">
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="p-12 text-center text-white/20 text-sm">No inquiries found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {viewing && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-6">
          <div className="bg-[#1a1a22] w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-t-3xl md:rounded-2xl border border-white/[0.06] shadow-2xl">
            <div className="sticky top-0 bg-[#1a1a22] border-b border-white/[0.04] px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="text-white text-xl font-semibold">Inquiry from {viewing.name}</h2>
                <p className="text-xs text-white/30 mt-0.5">{fmt(viewing.created_at)}</p>
              </div>
              <button onClick={() => setViewing(null)} className="w-9 h-9 rounded-xl hover:bg-white/5 flex items-center justify-center text-white/40 hover:text-white/70 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <Section title="Status">
                <div className="relative inline-flex items-center">
                  <select
                    value={viewing.status}
                    onChange={(e) => updateStatus(viewing.id, e.target.value)}
                    className={`appearance-none pl-3 pr-8 py-1.5 rounded-lg text-[10px] uppercase tracking-widest font-medium border cursor-pointer outline-none bg-transparent ${statusStyles[viewing.status] ?? "bg-white/5 text-white/40 border-white/10"}`}
                  >
                    {STATUS.map((s) => (
                      <option key={s} value={s} className="text-white bg-[#1a1a22] capitalize">{s}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2.5 w-3 h-3 pointer-events-none opacity-40" />
                </div>
              </Section>

              <Section title="Contact">
                <div className="bg-white/[0.02] rounded-xl p-4 space-y-1.5 text-sm border border-white/[0.04]">
                  <div className="text-white/80 font-medium">{viewing.name}</div>
                  <div className="text-white/40">{viewing.email}</div>
                  <div className="text-white/40">{viewing.phone}</div>
                </div>
              </Section>

              {viewing.product && (
                <Section title="Product of Interest">
                  <div className="bg-white/[0.02] rounded-xl px-4 py-3 text-sm text-white/60 border border-white/[0.04]">{viewing.product}</div>
                </Section>
              )}

              <Section title="Their Idea">
                <div className="bg-white/[0.02] rounded-xl p-4 text-sm text-white/50 leading-relaxed whitespace-pre-wrap border border-white/[0.04]">{viewing.idea}</div>
              </Section>

              <div className="flex gap-3 pt-2">
                <a
                  href={`mailto:${viewing.email}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-white text-sm font-medium hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20"
                >
                  <Mail className="w-4 h-4" /> Reply Email
                </a>
                <a
                  href={`https://wa.me/91${viewing.phone.replace(/\D/g, "").slice(-10)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-white/[0.08] text-sm text-white/70 hover:bg-white/5 transition-colors"
                >
                  WhatsApp
                </a>
              </div>
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

export default AdminInquiries;
