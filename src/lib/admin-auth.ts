import { createContext, createElement, ReactNode, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

type AdminAuthCtx = {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
};

const Ctx = createContext<AdminAuthCtx | null>(null);

// ── Dev bypass: skip Supabase auth with admin/admin ──
const DEV_EMAIL = "admin";
const DEV_PASS = "admin";
const FAKE_USER = { id: "dev-admin", email: "admin@mohikaart.com" } as unknown as User;

/**
 * Provider that subscribes to Supabase Auth and verifies the current
 * user is in `public.admin_users`. Wrap the admin tree with it.
 *
 * DEV MODE: Sign in with email "admin" password "admin" to bypass Supabase.
 */
export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser]       = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Verify admin status against admin_users via RLS (admin_users has a self-read policy)
  const verifyAdmin = async (uid: string | undefined) => {
    if (!uid) return false;
    try {
      const { data, error } = await supabase
        .from("admin_users")
        .select("id")
        .eq("id", uid)
        .maybeSingle();
      if (error) return false;
      return !!data;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    let cancelled = false;

    // Check if dev bypass session is stored
    if (sessionStorage.getItem("dev_admin_bypass") === "true") {
      setUser(FAKE_USER);
      setIsAdmin(true);
      setLoading(false);
      // Subscribe but ignore all auth changes in dev mode
      const { data: sub } = supabase.auth.onAuthStateChange(() => {});
      return () => { sub.subscription.unsubscribe(); };
    }

    // Initial session
    supabase.auth.getSession().then(async ({ data }) => {
      if (cancelled) return;
      const u = data.session?.user ?? null;
      setUser(u);
      setIsAdmin(u ? await verifyAdmin(u.id) : false);
      setLoading(false);
    }).catch(() => {
      // If Supabase is unreachable, just show login
      if (!cancelled) setLoading(false);
    });

    // Live updates
    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (cancelled) return;
      if (sessionStorage.getItem("dev_admin_bypass") === "true") return;
      const u = session?.user ?? null;
      setUser(u);
      setIsAdmin(u ? await verifyAdmin(u.id) : false);
    });
    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    // Dev bypass: admin/admin
    if (email.trim().toLowerCase() === DEV_EMAIL && password === DEV_PASS) {
      sessionStorage.setItem("dev_admin_bypass", "true");
      setUser(FAKE_USER);
      setIsAdmin(true);
      return {};
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      if (error) return { error: error.message };
      return {};
    } catch (err: any) {
      return { error: err?.message || "Failed to connect. Try admin/admin for dev access." };
    }
  };

  const signOut = async () => {
    sessionStorage.removeItem("dev_admin_bypass");
    try { await supabase.auth.signOut(); } catch {}
    setUser(null);
    setIsAdmin(false);
  };

  return createElement(
    Ctx.Provider,
    { value: { user, isAdmin, loading, signIn, signOut } },
    children
  );
};

export const useAdminAuth = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAdminAuth must be used inside <AdminAuthProvider>");
  return ctx;
};
