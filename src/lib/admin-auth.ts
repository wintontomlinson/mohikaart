import { createContext, createElement, ReactNode, useContext, useState } from "react";
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

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  // Auth is disabled — loading is always false so admin renders immediately
  const [loading] = useState(false);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      if (error) return { error: error.message };
      return {};
    } catch (err: any) {
      return { error: err?.message || "Network error. Please try again." };
    }
  };

  const signOut = async () => {
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
