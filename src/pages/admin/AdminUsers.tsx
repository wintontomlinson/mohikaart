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
    if (error) {
      toast.error(error.message);
      return;
    }
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
    <div className="max-w-3xl">
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-4xl flex items-center gap-3">
            <ShieldCheck className="w-7 h-7 text-amber-600" />
            Admin Users
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {admins.length} admin{admins.length === 1 ? "" : "s"} can sign in to this panel
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={load}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-border text-sm hover:bg-muted transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
          <button
            onClick={() => setShowInvite(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-foreground text-background text-sm hover:opacity-85 transition-opacity"
          >
            <Plus className="w-4 h-4" /> Add Admin
          </button>
        </div>
      </div>

      {/* Help banner */}
      <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-4 mb-6 flex gap-3">
        <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-800/90 leading-relaxed">
          <strong className="font-semibold">Admins must already have a Supabase Auth account.</strong>{" "}
          Have them sign up first (or create their account in Supabase Dashboard → Authentication → Users),
          then promote them here using their email. Removing an admin only revokes panel access — their
          account is not deleted.
        </div>
      </div>

      {/* Admins table */}
      <div className="bg-background rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="text-left p-4">Email</th>
                <th className="text-left p-4 hidden md:table-cell">Added</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={3} className="p-10 text-center text-muted-foreground">Loading…</td></tr>
              )}
              {!loading && admins.map((a) => {
                const isMe = a.id === user?.id;
                return (
                  <tr key={a.id} className="border-t border-border hover:bg-muted/20 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        <span className="font-medium">{a.email ?? "(no email)"}</span>
                        {isMe && (
                          <span className="text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                            You
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell text-muted-foreground">{fmt(a.created_at)}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => onDemote(a)}
                        disabled={isMe || busy || admins.length <= 1}
                        title={
                          isMe ? "You can't remove yourself" :
                          admins.length <= 1 ? "Can't remove the last admin" :
                          "Remove admin access"
                        }
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs hover:bg-destructive/10 text-destructive disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
              {!loading && admins.length === 0 && (
                <tr><td colSpan={3} className="p-10 text-center text-muted-foreground">No admins found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite modal */}
      {showInvite && (
        <div className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-6">
          <div className="bg-background w-full max-w-md rounded-t-3xl md:rounded-3xl shadow-2xl">
            <div className="px-6 py-5 border-b border-border">
              <h2 className="font-display text-2xl">Add Admin</h2>
              <p className="text-xs text-muted-foreground mt-1">
                Enter the email of an existing Supabase Auth user. They'll get full admin access.
              </p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-widest mb-2 text-muted-foreground">
                  Email address
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  maxLength={LIMITS.email}
                  autoFocus
                  placeholder="teammate@example.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-border focus:border-foreground/40 outline-none text-sm transition-colors"
                  onKeyDown={(e) => { if (e.key === "Enter") onPromote(); }}
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-border flex justify-end gap-3">
              <button
                onClick={() => { setShowInvite(false); setInviteEmail(""); }}
                className="px-5 py-2.5 rounded-full border border-border text-sm hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onPromote}
                disabled={busy || !inviteEmail}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-foreground text-background text-sm hover:opacity-85 transition-opacity disabled:opacity-60"
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
