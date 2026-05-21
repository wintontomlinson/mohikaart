import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/lib/admin-auth";
import { Plus, Trash2, ShieldCheck, ShieldAlert, Mail, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { EMAIL_RE, LIMITS, clamp } from "@/lib/validation";

type Admin = { id: string; email: string | null; created_at: string };

const fmt = (d: string) =>
  new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

const AdminUsers = () => {
  const { user } = useAdminAuth();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.rpc("list_admins");
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    setAdmins((data ?? []) as Admin[]);
  };

  useEffect(() => { load(); }, []);

  const onPromote = async () => {
    const email = clamp(inviteEmail, LIMITS.email).toLowerCase();
    if (!EMAIL_RE.test(email)) return toast.error("Enter a valid email");
    setBusy(true);
    const { error } = await supabase.rpc("promote_admin", { p_email: email });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Admin added");
    setInviteEmail("");
    setShowInvite(false);
    load();
  };

  const onDemote = async (a: Admin) => {
    if (a.id === user?.id) return toast.error("You can't remove yourself");
    if (!confirm(`Remove admin access for ${a.email}?`)) return;
    setBusy(true);
    const { error } = await supabase.rpc("demote_admin", { p_id: a.id });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Admin removed");
    load();
  };

  return (
    <div className="max-w-3xl pb-20 lg:pb-0">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-white text-3xl font-semibold flex items-center gap-3">
            <ShieldCheck className="w-7 h-7 text-amber-400" />
            Admin Users
          </h1>
          <p className="text-sm text-white/40 mt-1">
            {admins.length} admin{admins.length === 1 ? "" : "s"} with panel access
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={load}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm text-white/60 hover:bg-white/[0.08] transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
          <button
            onClick={() => setShowInvite(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-white text-sm font-medium hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" /> Add Admin
          </button>
        </div>
      </div>

      {/* Info banner */}
      <div className="bg-amber-500/5 border border-amber-500/15 rounded-2xl p-4 mb-6 flex gap-3">
        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-200/70 leading-relaxed">
          <strong className="font-semibold text-amber-200/90">Admins must have a Supabase Auth account first.</strong>{" "}
          Create their account in Supabase Dashboard, then promote them here. Removing only revokes panel access.
        </div>
      </div>

      {/* Admins table */}
      <div className="bg-[#1a1a22] rounded-2xl border border-white/[0.04] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.04]">
              <th className="text-left p-4 text-[11px] uppercase tracking-widest text-white/30 font-medium">Email</th>
              <th className="text-left p-4 text-[11px] uppercase tracking-widest text-white/30 font-medium hidden md:table-cell">Added</th>
              <th className="p-4 w-28"></th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={3} className="p-12 text-center text-white/20">Loading…</td></tr>
            )}
            {!loading && admins.map((a) => {
              const isMe = a.id === user?.id;
              return (
                <tr key={a.id} className="border-t border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400/20 to-amber-600/10 flex items-center justify-center text-[11px] font-bold text-amber-300 border border-amber-500/15">
                        {a.email?.[0]?.toUpperCase() ?? "?"}
                      </div>
                      <span className="text-white/80 font-medium">{a.email ?? "(no email)"}</span>
                      {isMe && (
                        <span className="text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          You
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 hidden md:table-cell text-white/30">{fmt(a.created_at)}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => onDemote(a)}
                      disabled={isMe || busy || admins.length <= 1}
                      title={isMe ? "You can't remove yourself" : admins.length <= 1 ? "Can't remove the last admin" : "Remove"}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-red-400/70 hover:text-red-400 hover:bg-red-500/10 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  </td>
                </tr>
              );
            })}
            {!loading && admins.length === 0 && (
              <tr><td colSpan={3} className="p-12 text-center text-white/20">No admins found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Invite modal */}
      {showInvite && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-6">
          <div className="bg-[#1a1a22] w-full max-w-md rounded-t-3xl md:rounded-2xl border border-white/[0.06] shadow-2xl">
            <div className="px-6 py-5 border-b border-white/[0.04]">
              <h2 className="text-white text-xl font-semibold">Add Admin</h2>
              <p className="text-xs text-white/30 mt-1">Enter the email of an existing Supabase Auth user.</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-widest mb-2 text-white/30 font-medium">Email address</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  maxLength={LIMITS.email}
                  autoFocus
                  placeholder="teammate@example.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white placeholder:text-white/25 focus:border-amber-500/40 outline-none text-sm transition-all"
                  onKeyDown={(e) => { if (e.key === "Enter") onPromote(); }}
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-white/[0.04] flex justify-end gap-3">
              <button
                onClick={() => { setShowInvite(false); setInviteEmail(""); }}
                className="px-5 py-2.5 rounded-xl border border-white/[0.08] text-sm text-white/60 hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onPromote}
                disabled={busy || !inviteEmail}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 text-white text-sm font-medium hover:bg-amber-400 disabled:opacity-50 transition-colors shadow-lg shadow-amber-500/20"
              >
                <Plus className="w-4 h-4" /> {busy ? "Adding…" : "Add Admin"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
