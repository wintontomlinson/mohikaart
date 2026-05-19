import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useMemo } from "react";

export type CartItem = {
  id: string;
  slug: string;
  name: string;
  price: number;
  image_url?: string | null;
  qty: number;
};

type Ctx = {
  items: CartItem[];
  count: number;
  total: number;
  add: (it: Omit<CartItem, "qty">, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  open: boolean;
  setOpen: (v: boolean) => void;
};

const CartCtx = createContext<Ctx | null>(null);
const KEY = "mohika.cart.v1";

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(items));
  }, [items]);

  const add: Ctx["add"] = useCallback((it, qty = 1) => {
    setItems((prev) => {
      const i = prev.findIndex((p) => p.id === it.id);
      if (i >= 0) {
        const next = [...prev];
        next[i] = { ...next[i], qty: next[i].qty + qty };
        return next;
      }
      return [...prev, { ...it, qty }];
    });
    setOpen(true);
  }, []);

  const remove = useCallback((id: string) => setItems((p) => p.filter((i) => i.id !== id)), []);
  const setQty = useCallback((id: string, qty: number) => {
    if (qty <= 0) {
      setItems((p) => p.filter((i) => i.id !== id));
      return;
    }
    setItems((p) => p.map((i) => (i.id === id ? { ...i, qty: Math.min(99, qty) } : i)));
  }, []);
  const clear = useCallback(() => setItems([]), []);

  // Cross-tab sync, listen for updates from other tabs
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== KEY || e.newValue === null) return;
      try { setItems(JSON.parse(e.newValue)); } catch { /* ignore */ }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const value = useMemo<Ctx>(() => ({
    items,
    count: items.reduce((s, i) => s + i.qty, 0),
    total: items.reduce((s, i) => s + i.qty * i.price, 0),
    add, remove, setQty, clear, open, setOpen,
  }), [items, add, remove, setQty, clear, open]);

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
