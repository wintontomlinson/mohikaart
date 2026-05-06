import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import PageHeader from "@/components/site/PageHeader";
import { useCart } from "@/lib/cart";
import { resolveImage, formatINR } from "@/lib/site";
import { Minus, Plus, Trash2, CreditCard, MessageCircle, CheckCircle2, Package } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

declare global {
  interface Window { Razorpay: any; }
}

type Form = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  notes: string;
};

const emptyForm: Form = {
  name: "", email: "", phone: "",
  address: "", city: "", state: "", pincode: "",
  notes: "",
};

const CheckoutPage = () => {
  const { items, total, setQty, remove, clear } = useCart();
  const [form, setForm] = useState<Form>(emptyForm);
  const [step, setStep] = useState<"cart" | "success">("cart");
  const [processing, setProcessing] = useState(false);
  const [razorpayKeyId, setRazorpayKeyId] = useState<string>("");
  const [orderNumber, setOrderNumber] = useState<string>("");

  useEffect(() => {
    supabase.from("app_settings").select("value").eq("key", "razorpay").maybeSingle()
      .then(({ data }) => {
        if (data?.value && typeof data.value === "object" && !Array.isArray(data.value)) {
          setRazorpayKeyId((data.value as any).key_id ?? "");
        }
      });
  }, []);

  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    if (!form.name.trim()) { toast.error("Name is required"); return false; }
    if (!form.email.trim()) { toast.error("Email is required"); return false; }
    if (!form.phone.trim()) { toast.error("Phone is required"); return false; }
    if (!form.address.trim()) { toast.error("Address is required"); return false; }
    if (!form.city.trim()) { toast.error("City is required"); return false; }
    if (!form.pincode.trim()) { toast.error("Pincode is required"); return false; }
    return true;
  };

  const saveOrder = async (paymentMethod: "razorpay" | "whatsapp", extra: Record<string, string> = {}) => {
    const payload = {
      customer_name: form.name.trim(),
      customer_email: form.email.trim(),
      customer_phone: form.phone.trim(),
      shipping_address: form.address.trim(),
      shipping_city: form.city.trim(),
      shipping_state: form.state.trim() || null,
      shipping_pincode: form.pincode.trim(),
      notes: form.notes.trim() || null,
      items: items.map((i) => ({ id: i.id, slug: i.slug, name: i.name, price: i.price, qty: i.qty })),
      subtotal: total,
      total,
      payment_method: paymentMethod,
      status: "pending",
      ...extra,
    };
    const { data, error } = await supabase.from("orders").insert(payload).select("id,order_number").maybeSingle();
    if (error) throw new Error(error.message);
    return data!;
  };

  const onWhatsApp = async () => {
    if (!validate()) return;
    setProcessing(true);
    try {
      const order = await saveOrder("whatsapp");
      const text = encodeURIComponent(
        `Hi Mohika Art! Order #${order.order_number}\n\n` +
        items.map((i) => `${i.name} x ${i.qty}: ${formatINR(i.price * i.qty)}`).join("\n") +
        `\n\nTotal: ${formatINR(total)}` +
        `\n\nShip to: ${form.name}, ${form.address}, ${form.city}${form.state ? `, ${form.state}` : ""} - ${form.pincode}` +
        `\nPhone: ${form.phone}` +
        (form.notes ? `\nNote: ${form.notes}` : "")
      );
      setOrderNumber(order.order_number);
      clear();
      setStep("success");
      window.open(`https://wa.me/919999999999?text=${text}`, "_blank");
    } catch (e: any) {
      toast.error(e.message || "Something went wrong");
    } finally {
      setProcessing(false);
    }
  };

  const onRazorpay = async () => {
    if (!validate()) return;
    if (!razorpayKeyId) {
      toast.error("Online payments are not configured yet. Please order via WhatsApp.");
      return;
    }
    setProcessing(true);
    try {
      const order = await saveOrder("razorpay");

      if (!window.Razorpay) {
        await new Promise<void>((res, rej) => {
          const s = document.createElement("script");
          s.src = "https://checkout.razorpay.com/v1/checkout.js";
          s.onload = () => res();
          s.onerror = () => rej(new Error("Failed to load payment gateway"));
          document.head.appendChild(s);
        });
      }

      const rzp = new window.Razorpay({
        key: razorpayKeyId,
        amount: Math.round(total * 100),
        currency: "INR",
        name: "Mohika Art",
        description: `Order #${order.order_number}`,
        prefill: { name: form.name, email: form.email, contact: form.phone },
        theme: { color: "#b8860b" },
        handler: async (response: any) => {
          await supabase.from("orders").update({
            status: "confirmed",
            razorpay_payment_id: response.razorpay_payment_id ?? null,
            razorpay_order_id: response.razorpay_order_id ?? null,
            razorpay_signature: response.razorpay_signature ?? null,
          }).eq("id", order.id);
          setOrderNumber(order.order_number);
          clear();
          setStep("success");
          setProcessing(false);
        },
        modal: {
          ondismiss: async () => {
            await supabase.from("orders").update({ status: "cancelled" }).eq("id", order.id);
            toast.info("Payment cancelled.");
            setProcessing(false);
          },
        },
      });
      rzp.open();
    } catch (e: any) {
      toast.error(e.message || "Something went wrong");
      setProcessing(false);
    }
  };

  if (step === "success") {
    return (
      <>
        <PageHeader
          eyebrow="Order Placed"
          title={<>Thank you <em className="not-italic text-gold-grad">so much!</em></>}
          subtitle="Your order has been received. We'll be in touch within 24 hours."
        />
        <section className="py-16 md:py-24">
          <div className="container max-w-lg text-center">
            <div className="glass rounded-3xl p-10 md:p-14 shadow-luxe">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="font-display text-3xl mb-2">Order #{orderNumber}</h2>
              <p className="text-muted-foreground mt-3 leading-relaxed">
                Mohika will reach out to confirm your custom piece and share an ETA. All items are made-to-order and delivered within 7–10 days.
              </p>
              <div className="mt-8 flex flex-col gap-3">
                <Link to="/shop" className="px-8 py-3.5 rounded-full bg-foreground text-background btn-glow text-sm tracking-wide">
                  Continue Shopping
                </Link>
                <Link to="/" className="px-8 py-3.5 rounded-full border border-border text-sm hover:bg-muted transition-colors">
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Checkout"
        title={<>Your <em className="not-italic text-gold-grad">order.</em></>}
        subtitle="Review your cart, fill in your details, and place your order."
      />

      <section className="py-12 md:py-20">
        <div className="container">
          {items.length === 0 ? (
            <div className="text-center py-20">
              <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-40" />
              <p className="font-serif text-2xl mb-6">Your cart is empty.</p>
              <Link to="/shop" className="px-8 py-3 rounded-full bg-foreground text-background">Browse Collection</Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-12">

              {/* Left: cart items + delivery form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Cart items */}
                <div className="space-y-4">
                  {items.map((it) => (
                    <div key={it.id} className="flex gap-4 md:gap-5 p-4 md:p-5 rounded-2xl glass shadow-soft">
                      <img src={resolveImage(it.image_url)} alt={it.name} className="w-20 h-20 md:w-24 md:h-24 rounded-xl object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <Link to={`/product/${it.slug}`} className="font-serif text-base md:text-lg hover:underline line-clamp-1">{it.name}</Link>
                        <div className="text-sm text-muted-foreground mt-0.5">{formatINR(it.price)} each</div>
                        <div className="mt-3 flex items-center gap-3">
                          <div className="inline-flex items-center rounded-full border border-border">
                            <button onClick={() => setQty(it.id, it.qty - 1)} className="w-8 h-8 flex items-center justify-center"><Minus className="w-3 h-3" /></button>
                            <span className="w-8 text-center text-sm">{it.qty}</span>
                            <button onClick={() => setQty(it.id, it.qty + 1)} className="w-8 h-8 flex items-center justify-center"><Plus className="w-3 h-3" /></button>
                          </div>
                          <button onClick={() => remove(it.id)} className="text-muted-foreground hover:text-destructive ml-auto transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-display text-xl md:text-2xl text-gold-grad">{formatINR(it.price * it.qty)}</div>
                      </div>
                    </div>
                  ))}
                  <button onClick={clear} className="text-xs text-muted-foreground hover:text-destructive transition-colors">
                    Clear cart
                  </button>
                </div>

                {/* Delivery details form */}
                <div className="glass rounded-3xl p-6 md:p-8 shadow-soft space-y-5">
                  <h2 className="font-display text-2xl">Delivery Details</h2>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <F label="Full Name *">
                      <input value={form.name} onChange={set("name")} className={inp} placeholder="Priya Sharma" />
                    </F>
                    <F label="Phone *">
                      <input value={form.phone} onChange={set("phone")} className={inp} placeholder="+91 98765 43210" type="tel" />
                    </F>
                  </div>

                  <F label="Email *">
                    <input value={form.email} onChange={set("email")} className={inp} placeholder="you@email.com" type="email" />
                  </F>

                  <F label="Shipping Address *">
                    <input value={form.address} onChange={set("address")} className={inp} placeholder="Flat 4B, Sunrise Apartments, MG Road" />
                  </F>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <F label="City *">
                      <input value={form.city} onChange={set("city")} className={inp} placeholder="Mumbai" />
                    </F>
                    <F label="State">
                      <input value={form.state} onChange={set("state")} className={inp} placeholder="Maharashtra" />
                    </F>
                    <F label="Pincode *">
                      <input value={form.pincode} onChange={set("pincode")} className={inp} placeholder="400001" maxLength={6} />
                    </F>
                  </div>

                  <F label="Special Instructions">
                    <textarea
                      value={form.notes}
                      onChange={set("notes")}
                      rows={3}
                      className={inp + " resize-none"}
                      placeholder="Colour preferences, names to engrave, gift message…"
                    />
                  </F>
                </div>
              </div>

              {/* Right: summary + actions */}
              <aside className="lg:col-span-1">
                <div className="sticky top-32 glass rounded-3xl p-8 shadow-luxe">
                  <h2 className="font-display text-3xl mb-6">Order Summary</h2>

                  <div className="space-y-2.5 text-sm mb-6">
                    {items.map((it) => (
                      <div key={it.id} className="flex justify-between text-muted-foreground">
                        <span className="line-clamp-1 mr-2">{it.name} × {it.qty}</span>
                        <span className="shrink-0">{formatINR(it.price * it.qty)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between text-muted-foreground">
                      <span>Shipping</span>
                      <span className="text-gold">Free Pan India</span>
                    </div>
                    <div className="gold-divider my-3" />
                    <div className="flex justify-between font-display text-2xl">
                      <span>Total</span>
                      <span className="text-gold-grad">{formatINR(total)}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={onRazorpay}
                      disabled={processing}
                      className="w-full px-8 py-4 rounded-full bg-foreground text-background btn-glow inline-flex items-center justify-center gap-2 disabled:opacity-60 text-sm tracking-wide"
                    >
                      <CreditCard className="w-4 h-4" />
                      {processing ? "Processing…" : "Pay Online"}
                    </button>

                    <button
                      onClick={onWhatsApp}
                      disabled={processing}
                      className="w-full px-8 py-4 rounded-full border border-foreground/30 hover:bg-foreground hover:text-background transition-all duration-500 inline-flex items-center justify-center gap-2 disabled:opacity-60 text-sm"
                    >
                      <MessageCircle className="w-4 h-4" /> Order on WhatsApp
                    </button>
                  </div>

                  <p className="text-xs text-muted-foreground mt-5 text-center">
                    All items are made-to-order and delivered within 7–10 days.
                  </p>
                </div>
              </aside>

            </div>
          )}
        </div>
      </section>
    </>
  );
};

const inp = "w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-gold outline-none text-sm transition-colors";

const F = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="block text-xs uppercase tracking-widest mb-2 text-muted-foreground">{label}</label>
    {children}
  </div>
);

export default CheckoutPage;
