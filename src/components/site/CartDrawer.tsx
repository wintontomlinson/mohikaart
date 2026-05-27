import { useCart } from "@/lib/cart";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { resolveImage, formatINR } from "@/lib/site";
import { Minus, Plus, Trash2, ShoppingBag, Sparkles, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const CartDrawer = () => {
  const { items, open, setOpen, setQty, remove, total, count } = useCart();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col bg-background p-0">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-border/60">
          <SheetTitle className="font-display text-3xl mb-0.5">Your Cart</SheetTitle>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            {count === 0 ? "Empty" : `${count} item${count !== 1 ? "s" : ""}`}
          </p>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-5 p-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-24 h-24 rounded-full bg-blush/40 flex items-center justify-center"
            >
              <ShoppingBag className="w-9 h-9 text-foreground/40" strokeWidth={1.3} />
            </motion.div>
            <div>
              <p className="font-serif text-xl mb-2">Your cart is empty</p>
              <p className="text-sm text-muted-foreground">Discover our handcrafted collection</p>
            </div>
            <Link
              to="/shop"
              onClick={() => setOpen(false)}
              className="mt-1 px-7 py-3 rounded-full bg-foreground text-background text-xs tracking-[0.12em] uppercase btn-glow"
            >
              Browse Collection
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
              <AnimatePresence initial={false}>
                {items.map((it) => (
                  <motion.div
                    key={it.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="flex gap-4 p-3 rounded-2xl shadow-soft"
                    style={{ background: "hsl(36 45% 99%)" }}
                  >
                    <Link to={`/product/${it.slug}`} onClick={() => setOpen(false)} className="shrink-0">
                      <img
                        src={resolveImage(it.image_url)}
                        alt={it.name}
                        className="w-20 h-20 rounded-xl object-cover"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/product/${it.slug}`}
                        onClick={() => setOpen(false)}
                        className="font-serif text-base leading-tight line-clamp-2 hover:text-gold transition-colors"
                      >
                        {it.name}
                      </Link>
                      <div className="font-display text-sm text-gold-grad mt-1">{formatINR(it.price)}</div>
                      <div className="mt-2.5 flex items-center gap-2">
                        <div className="inline-flex items-center rounded-full border border-border">
                          <button
                            onClick={() => setQty(it.id, it.qty - 1)}
                            className="w-7 h-7 flex items-center justify-center hover:bg-muted transition-colors rounded-l-full"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-7 text-center text-sm font-medium">{it.qty}</span>
                          <button
                            onClick={() => setQty(it.id, it.qty + 1)}
                            className="w-7 h-7 flex items-center justify-center hover:bg-muted transition-colors rounded-r-full"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => remove(it.id)}
                          className="ml-auto text-muted-foreground hover:text-destructive transition-colors p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Summary */}
            <div className="px-6 pb-6 pt-3 border-t border-border/60 space-y-3">
              {/* Free shipping notice */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gold/8 border border-gold/15">
                <Truck className="w-3.5 h-3.5 text-gold shrink-0" />
                <span className="text-[11px] text-gold/80">Free pan-India shipping on all orders</span>
              </div>

              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Subtotal ({count} items)</span>
                <span>{formatINR(total)}</span>
              </div>
              <div className="flex justify-between font-display text-2xl">
                <span>Total</span>
                <span className="text-gold-grad">{formatINR(total)}</span>
              </div>
              <Link
                to="/checkout"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 w-full px-6 py-4 rounded-full bg-foreground text-background btn-glow text-sm tracking-wide"
              >
                <Sparkles className="w-4 h-4" />
                Proceed to Checkout
              </Link>
              <button
                onClick={() => setOpen(false)}
                className="w-full text-xs text-muted-foreground hover:text-foreground py-2 transition-colors"
              >
                Continue shopping
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
