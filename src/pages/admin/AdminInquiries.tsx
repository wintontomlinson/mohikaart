import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Mail, ChevronDown, X } from "lucide-react";
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

const statusColors: Record<string, string> = {
  new:     "bg-blue-100 text-blue-700 border-blue-200",
  replied: "bg-emerald-100 text-emerald-700 border-emerald-200",
  closed:  "bg-muted text-muted-foreground border-border",
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
    <div>
      <div className="mb-8">
        <h1 className="font-display text-4xl">Inquiries</h1>
        <p className="text-sm text-muted-foreground mt-1">{inquiries.length} total from the contact form</p>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all ${filter === "all" ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"}`}
        >
          All ({inquiries.length})
        </button>
        {STATUS.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium border capitalize transition-all ${filter === s ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"}`}
          >
            {s} ({counts[s] ?? 0})
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-background rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="text-left p-4">Name</th>
                <th className="text-left p-4 hidden md:table-cell">Contact</th>
                <th className="text-left p-4 hidden lg:table-cell">Product</th>
                <th className="text-left p-4 hidden lg:table-cell">Date</th>
                <th className="text-left p-4">Status</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((inq) => (
                <tr key={inq.id} className="border-t border-border hover:bg-muted/20 transition-colors">
                  <td className="p-4">
                    <div className="font-medium">{inq.name}</div>
                    <div className="text-xs text-muted-foreground md:hidden">{inq.email}</div>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <div>{inq.email}</div>
                    <div className="text-xs text-muted-foreground">{inq.phone}</div>
                  </td>
                  <td className="p-4 hidden lg:table-cell text-muted-foreground">{inq.product ?? "-"}</td>
                  <td className="p-4 hidden lg:table-cell text-muted-foreground">{fmt(inq.created_at)}</td>
                  <td className="p-4">
                    <div className="relative inline-flex items-center">
                      <select
                        value={inq.status}
                        onChange={(e) => updateStatus(inq.id, e.target.value)}
                        disabled={updatingId === inq.id}
                        className={`appearance-none pl-2.5 pr-7 py-1 rounded-full text-[10px] uppercase tracking-widest font-medium border cursor-pointer outline-none transition-all ${statusColors[inq.status] ?? "bg-muted text-muted-foreground border-border"}`}
                      >
                        {STATUS.map((s) => (
                          <option key={s} value={s} className="text-foreground bg-background capitalize">{s}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2 w-3 h-3 pointer-events-none opacity-60" />
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setViewing(inq)}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-muted transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="p-10 text-center text-muted-foreground">No inquiries found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail modal */}
      {viewing && (
        <div className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-6">
          <div className="bg-background w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-t-3xl md:rounded-3xl shadow-2xl">
            <div className="sticky top-0 bg-background border-b border-border px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="font-display text-2xl">Inquiry from {viewing.name}</h2>
                <p className="text-xs text-muted-foreground mt-0.5">{fmt(viewing.created_at)}</p>
              </div>
              <button onClick={() => setViewing(null)} className="w-9 h-9 rounded-full hover:bg-muted flex items-center justify-center transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Status</h3>
                <div className="relative inline-flex items-center">
                  <select
                    value={viewing.status}
                    onChange={(e) => updateStatus(viewing.id, e.target.value)}
                    className={`appearance-none pl-3 pr-8 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-medium border cursor-pointer outline-none ${statusColors[viewing.status] ?? "bg-muted text-muted-foreground border-border"}`}
                  >
                    {STATUS.map((s) => (
                      <option key={s} value={s} className="text-foreground bg-background capitalize">{s}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2.5 w-3 h-3 pointer-events-none opacity-60" />
                </div>
              </div>

              <div>
                <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Contact</h3>
                <div className="bg-muted/40 rounded-xl p-4 space-y-1.5 text-sm">
                  <div className="font-medium">{viewing.name}</div>
                  <div className="text-muted-foreground">{viewing.email}</div>
                  <div className="text-muted-foreground">{viewing.phone}</div>
                </div>
              </div>

              {viewing.product && (
                <div>
                  <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Product of Interest</h3>
                  <div className="bg-muted/40 rounded-xl px-4 py-3 text-sm">{viewing.product}</div>
                </div>
              )}

              <div>
                <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Their Idea</h3>
                <div className="bg-muted/40 rounded-xl p-4 text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{viewing.idea}</div>
              </div>

              <div className="flex gap-3 pt-2">
                <a
                  href={`mailto:${viewing.email}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-foreground text-background text-sm hover:opacity-85 transition-opacity"
                >
                  <Mail className="w-4 h-4" /> Reply by Email
                </a>
                <a
                  href={`https://wa.me/91${viewing.phone.replace(/\D/g, "").slice(-10)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-border text-sm hover:bg-muted transition-colors"
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

export default AdminInquiries;
