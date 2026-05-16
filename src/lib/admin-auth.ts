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

/**
 * Provider that subscribes to Supabase Auth and verifies the current
 * user is in `public.admin_users`. Wrap the admin tree with it.
 */
export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser]       = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Verify admin status against admin_users via RLS (admin_users has a self-read policy)
  const verifyAdmin = async (uid: string | undefined) => {
    if (!uid) return false;
    const { data, error } = await supabase
      .from("admin_users")
      .select("id")
      .eq("id", uid)
      .maybeSingle();
    if (error) return false;
    return !!data;
  };

  useEffect(() => {
    let cancelled = false;

    // Initial session
    supabase.auth.getSession().then(async ({ data }) => {
      if (cancelled) return;
      const u = data.session?.user ?? null;
      setUser(u);
      setIsAdmin(u ? await verifyAdmin(u.id) : false);
      setLoading(false);
    });

    // Live updates
    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (cancelled) return;
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
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    if (error) return { error: error.message };
    return {};
  };

  const signOut = async () => {
    await supabase.auth.signOut();
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
