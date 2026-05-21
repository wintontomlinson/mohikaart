import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/lib/cart";

const CartDrawer = () => {
  const { items, count, total, remove, setQty, open, setOpen } = useCart();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#1a1208]/40 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      {/* Drawer */}
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-[#fdf9f0] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#c9a84c]/10">
          <h2 className="font-serif text-xl flex items-center gap-2">
            Your Cart <ShoppingBag className="w-5 h-5" />
            <span className="text-sm text-[#1a1208]/50">({count} items)</span>
          </h2>
          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-full hover:bg-[#1a1208]/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <ShoppingBag className="w-12 h-12 text-[#1a1208]/20 mb-4" />
              <p className="text-[#1a1208]/60 mb-4">Your cart is empty</p>
              <Link
                to="/shop"
                onClick={() => setOpen(false)}
                className="text-[#c9a84c] text-sm font-medium hover:underline"
              >
                Continue Shopping &rarr;
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 p-3 bg-white rounded-xl">
                <img
                  src={item.image_url || "/placeholder.svg"}
                  alt={item.name}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-[#1a1208] truncate">{item.name}</p>
                  <p className="text-[#c9a84c] font-semibold text-sm mt-1">
                    ₹{item.price.toLocaleString("en-IN")}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => setQty(item.id, item.qty - 1)}
                      className="w-7 h-7 rounded-full border border-[#1a1208]/10 flex items-center justify-center hover:bg-[#1a1208]/5"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm font-medium w-6 text-center">{item.qty}</span>
                    <button
                      onClick={() => setQty(item.id, item.qty + 1)}
                      className="w-7 h-7 rounded-full border border-[#1a1208]/10 flex items-center justify-center hover:bg-[#1a1208]/5"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => remove(item.id)}
                  className="p-1 self-start text-[#1a1208]/30 hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-[#c9a84c]/10 px-6 py-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[#1a1208]/60">Subtotal</span>
              <span className="text-xl font-serif font-semibold">
                ₹{total.toLocaleString("en-IN")}
              </span>
            </div>
            <Link
              to="/checkout"
              onClick={() => setOpen(false)}
              className="block w-full py-3.5 bg-[#c9a84c] text-white text-center text-sm font-semibold tracking-wider rounded-full hover:bg-[#b8933f] transition-colors"
            >
              Proceed to Checkout &rarr;
            </Link>
            <button
              onClick={() => setOpen(false)}
              className="block w-full text-center text-sm text-[#1a1208]/60 hover:text-[#c9a84c] transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
