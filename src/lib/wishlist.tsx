import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useMemo } from "react";
import { toast } from "sonner";

type Ctx = {
  ids: Set<string>;
  has: (id: string) => boolean;
  toggle: (id: string) => void;
  count: number;
};

const WishlistCtx = createContext<Ctx | null>(null);
const KEY = "mohika.wishlist.v1";

const readInitial = (): Set<string> => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    return new Set(Array.isArray(parsed) ? (parsed as string[]) : []);
  } catch {
    return new Set();
  }
};

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [ids, setIds] = useState<Set<string>>(readInitial);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(Array.from(ids))); } catch { /* ignore */ }
  }, [ids]);

  const has = useCallback((id: string) => ids.has(id), [ids]);

  const toggle = useCallback((id: string) => {
    setIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        toast("Removed from wishlist");
      } else {
        next.add(id);
        toast.success("Added to wishlist");
      }
      return next;
    });
  }, []);

  // Cross-tab sync via the storage event, mirroring cart.tsx semantics.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== KEY || e.newValue === null) return;
      try {
        const parsed = JSON.parse(e.newValue);
        setIds(new Set(Array.isArray(parsed) ? (parsed as string[]) : []));
      } catch { /* ignore */ }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const value = useMemo<Ctx>(() => ({
    ids,
    has,
    toggle,
    count: ids.size,
  }), [ids, has, toggle]);

  return <WishlistCtx.Provider value={value}>{children}</WishlistCtx.Provider>;
};

export const useWishlist = () => {
  const ctx = useContext(WishlistCtx);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
};
