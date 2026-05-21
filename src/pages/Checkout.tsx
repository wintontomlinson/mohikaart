import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/lib/cart";
import { toast } from "sonner";
import { Check } from "lucide-react";

const Checkout = () => {
  const { items, total, clear } = useCart();
  const [placed, setPlaced] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", address: "", city: "", state: "", pincode: "", notes: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clear();
    setPlaced(true);
    toast.success("Order placed successfully!");
  };

  if (placed) {
    return (
      <div className="pt-24 pb-20 min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-serif text-[#1a1208]">Order Placed!</h2>
          <p className="text-[#1a1208]/60">Order #MKA{Math.floor(Math.random() * 9000) + 1000}</p>
          <p className="text-sm text-[#1a1208]/50">We'll send confirmation on WhatsApp & email</p>
          <Link to="/" className="inline-block px-6 py-3 bg-[#1a1208] text-[#fdf9f0] text-sm font-medium rounded-full mt-4">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="pt-24 pb-20 min-h-screen flex items-center justify-center text-center">
        <div>
          <h2 className="text-2xl font-serif text-[#1a1208] mb-3">Your cart is empty</h2>
          <Link to="/shop" className="text-[#c9a84c] text-sm font-medium hover:underline">Continue Shopping &rarr;</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-serif text-[#1a1208] mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-5">
            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-medium text-[#1a1208]">Customer Details</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required className="px-4 py-3 border border-[#1a1208]/10 rounded-xl text-sm focus:outline-none focus:border-[#c9a84c]" />
                <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required className="px-4 py-3 border border-[#1a1208]/10 rounded-xl text-sm focus:outline-none focus:border-[#c9a84c]" />
              </div>
              <input name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} required className="w-full px-4 py-3 border border-[#1a1208]/10 rounded-xl text-sm focus:outline-none focus:border-[#c9a84c]" />
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-medium text-[#1a1208]">Shipping Address</h3>
              <textarea name="address" placeholder="Full Address" value={form.address} onChange={handleChange} required rows={3} className="w-full px-4 py-3 border border-[#1a1208]/10 rounded-xl text-sm focus:outline-none focus:border-[#c9a84c] resize-none" />
              <div className="grid grid-cols-3 gap-4">
                <input name="city" placeholder="City" value={form.city} onChange={handleChange} required className="px-4 py-3 border border-[#1a1208]/10 rounded-xl text-sm focus:outline-none focus:border-[#c9a84c]" />
                <input name="state" placeholder="State" value={form.state} onChange={handleChange} required className="px-4 py-3 border border-[#1a1208]/10 rounded-xl text-sm focus:outline-none focus:border-[#c9a84c]" />
                <input name="pincode" placeholder="Pincode" value={form.pincode} onChange={handleChange} required className="px-4 py-3 border border-[#1a1208]/10 rounded-xl text-sm focus:outline-none focus:border-[#c9a84c]" />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-medium text-[#1a1208] mb-3">Order Notes (optional)</h3>
              <textarea name="notes" placeholder="Any customization details, special messages..." value={form.notes} onChange={handleChange} rows={3} className="w-full px-4 py-3 border border-[#1a1208]/10 rounded-xl text-sm focus:outline-none focus:border-[#c9a84c] resize-none" />
            </div>

            <button type="submit" className="w-full py-4 bg-[#c9a84c] text-white text-sm font-semibold tracking-wider rounded-full hover:bg-[#b8933f] transition-colors">
              Place Order &rarr;
            </button>
          </form>

          {/* Summary */}
          <div className="bg-white rounded-2xl p-6 shadow-sm h-fit sticky top-24">
            <h3 className="font-medium text-[#1a1208] mb-4">Order Summary</h3>
            <div className="space-y-3 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <img src={item.image_url || "/placeholder.svg"} alt="" className="w-12 h-12 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#1a1208] truncate">{item.name}</p>
                    <p className="text-xs text-[#1a1208]/40">Qty: {item.qty}</p>
                  </div>
                  <p className="text-sm font-medium">₹{(item.price * item.qty).toLocaleString("en-IN")}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-[#1a1208]/5 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#1a1208]/60">Subtotal</span>
                <span>₹{total.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#1a1208]/60">Shipping</span>
                <span className="text-green-600">{total >= 999 ? "FREE" : "₹99"}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg border-t border-[#1a1208]/5 pt-3 mt-3">
                <span>Total</span>
                <span>₹{(total + (total >= 999 ? 0 : 99)).toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
