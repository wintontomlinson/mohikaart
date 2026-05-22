import { createContext, createElement, ReactNode, useContext, useEffect, useRef, useState } from "react";
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

// ── Dev bypass credentials ──
const DEV_EMAIL = "admin";
const DEV_PASS = "admin";
const FAKE_USER = { id: "dev-admin", email: "admin@mohikaart.com" } as unknown as User;

const isDevBypassed = () => {
  try { return sessionStorage.getItem("dev_admin_bypass") === "true"; } catch { return false; }
};

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(isDevBypassed() ? FAKE_USER : null);
  const [isAdmin, setIsAdmin] = useState(isDevBypassed());
  const [loading, setLoading] = useState(!isDevBypassed());
  const devMode = useRef(isDevBypassed());

  useEffect(() => {
    // If dev bypass is active, don't touch Supabase at all
    if (devMode.current) return;

    let cancelled = false;

    supabase.auth.getSession().then(async ({ data }) => {
      if (cancelled) return;
      const u = data.session?.user ?? null;
      setUser(u);
      if (u) {
        try {
          const { data: row } = await supabase.from("admin_users").select("id").eq("id", u.id).maybeSingle();
          setIsAdmin(!!row);
        } catch { setIsAdmin(false); }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    }).catch(() => {
      if (!cancelled) setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (cancelled || devMode.current) return;
      const u = session?.user ?? null;
      setUser(u);
      if (u) {
        try {
          const { data: row } = await supabase.from("admin_users").select("id").eq("id", u.id).maybeSingle();
          setIsAdmin(!!row);
        } catch { setIsAdmin(false); }
      } else {
        setIsAdmin(false);
      }
    });

    return () => { cancelled = true; sub.subscription.unsubscribe(); };
  }, []);

  const signIn = async (email: string, password: string) => {
    // Dev bypass: admin/admin → instant access, no network
    if (email.trim().toLowerCase() === DEV_EMAIL && password === DEV_PASS) {
      try { sessionStorage.setItem("dev_admin_bypass", "true"); } catch {}
      devMode.current = true;
      setUser(FAKE_USER);
      setIsAdmin(true);
      setLoading(false);
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
      return { error: err?.message || "Network error. Use admin/admin for offline access." };
    }
  };

  const signOut = async () => {
    try { sessionStorage.removeItem("dev_admin_bypass"); } catch {}
    devMode.current = false;
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
