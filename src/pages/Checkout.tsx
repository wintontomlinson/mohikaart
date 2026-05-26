import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import PageHeader from "@/components/site/PageHeader";
import { useCart } from "@/lib/cart";
import { resolveImage, formatINR } from "@/lib/site";
import { Minus, Plus, Trash2, CreditCard, MessageCircle, CheckCircle2, Package } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useStoreSettings } from "@/lib/settings";
import { EMAIL_RE, PHONE_RE, PINCODE_RE, LIMITS, clamp } from "@/lib/validation";
import { canSubmit } from "@/lib/throttle";

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
  const { phone } = useStoreSettings();

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

  const EMAIL_RE_LOCAL   = EMAIL_RE;
  const PHONE_RE_LOCAL   = PHONE_RE;
  const PINCODE_RE_LOCAL = PINCODE_RE;

  const validate = () => {
    if (!form.name.trim() || form.name.trim().length > LIMITS.name)
      { toast.error("Please enter your name"); return false; }
    if (!EMAIL_RE_LOCAL.test(form.email.trim()) || form.email.length > LIMITS.email)
      { toast.error("Enter a valid email"); return false; }
    if (!PHONE_RE_LOCAL.test(form.phone.trim()) || form.phone.length > LIMITS.phone)
      { toast.error("Enter a valid phone number"); return false; }
    if (!form.address.trim() || form.address.length > LIMITS.address)
      { toast.error("Please enter your address"); return false; }
    if (!form.city.trim() || form.city.length > LIMITS.city)
      { toast.error("Please enter your city"); return false; }
    if (!PINCODE_RE_LOCAL.test(form.pincode.trim()))
      { toast.error("Pincode must be 6 digits"); return false; }
    if (form.notes.length > LIMITS.notes)
      { toast.error("Please shorten your special instructions"); return false; }
    if (items.length === 0)
      { toast.error("Your cart is empty"); return false; }
    if (items.length > 50)
      { toast.error("Too many items in cart - please contact us via WhatsApp"); return false; }
    return true;
  };

  /**
   * Server-side order creation (no client-trusted totals).
   * Calls public.create_order(customer, items, payment_method) RPC.
   */
  const saveOrder = async (paymentMethod: "razorpay" | "whatsapp" | "cod") => {
    const customer = {
      name:    clamp(form.name,    LIMITS.name),
      email:   clamp(form.email,   LIMITS.email).toLowerCase(),
      phone:   clamp(form.phone,   LIMITS.phone),
      address: clamp(form.address, LIMITS.address),
      city:    clamp(form.city,    LIMITS.city),
      state:   clamp(form.state,   LIMITS.state) || null,
      pincode: clamp(form.pincode, 6),
      notes:   clamp(form.notes,   LIMITS.notes) || null,
    };
    const cartItems = items.map((i) => ({ id: i.id, qty: Math.max(1, Math.min(99, i.qty | 0)) }));

    const { data, error } = await supabase.rpc("create_order", {
      p_customer:       customer,
      p_items:          cartItems,
      p_payment_method: paymentMethod,
    });

    if (error) throw new Error(error.message);
    const row = Array.isArray(data) ? data[0] : data;
    if (!row?.id) throw new Error("Order creation failed");
    return row as { id: string; order_number: string; total: number; currency: string };
  };

  const onWhatsApp = async () => {
    if (!validate()) return;
    if (!canSubmit("checkout", 8000)) {
      toast.error("Please wait a few seconds before trying again");
      return;
    }
    setProcessing(true);
    try {
      const order = await saveOrder("whatsapp");
      const text = encodeURIComponent(
        `Hi Mohika Art! Order #${order.order_number}\n\n` +
        items.map((i) => `${i.name} x ${i.qty}: ${formatINR(i.price * i.qty)}`).join("\n") +
        `\n\nTotal: ${formatINR(order.total)}` +
        `\n\nShip to: ${form.name}, ${form.address}, ${form.city}${form.state ? `, ${form.state}` : ""} - ${form.pincode}` +
        `\nPhone: ${form.phone}` +
        (form.notes ? `\nNote: ${form.notes}` : "")
      );
      setOrderNumber(order.order_number);
      clear();
      setStep("success");
      const safePhone = (phone || "").replace(/\D/g, "");
      window.open(`https://wa.me/${encodeURIComponent(safePhone)}?text=${text}`, "_blank", "noopener,noreferrer");
    } catch (e: any) {
      toast.error(e.message || "Something went wrong");
    } finally {
      setProcessing(false);
    }
  };

  const onCOD = async () => {
    if (!validate()) return;
    if (!canSubmit("checkout", 8000)) {
      toast.error("Please wait a few seconds before trying again");
      return;
    }
    setProcessing(true);
    try {
      const order = await saveOrder("cod");
      setOrderNumber(order.order_number);
      clear();
      setStep("success");
      toast.success("Order placed - pay on delivery");
    } catch (e: any) {
      toast.error(e.message || "Something went wrong");
    } finally {
      setProcessing(false);
    }
  };

  const onRazorpay = async () => {
    if (!validate()) return;
    if (!canSubmit("checkout", 8000)) {
      toast.error("Please wait a few seconds before trying again");
      return;
    }
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
        amount: Math.round(order.total * 100),
        currency: order.currency || "INR",
        name: "Mohika Art",
        description: `Order #${order.order_number}`,
        prefill: { name: form.name, email: form.email, contact: form.phone },
        theme: { color: "#b8860b" },
        handler: async (response: any) => {
          // Best-effort: tell the server the payment was submitted.
          // The server marks the order as 'payment_submitted'; the admin
          // verifies it (or a webhook later promotes to 'confirmed').
          await supabase.rpc("record_payment", {
            p_order_id:     order.id,
            p_payment_id:   response.razorpay_payment_id,
            p_rzp_order_id: response.razorpay_order_id ?? null,
            p_signature:    response.razorpay_signature ?? null,
          });
          setOrderNumber(order.order_number);
          clear();
          setStep("success");
          setProcessing(false);
        },
        modal: {
          ondismiss: async () => {
            await supabase.rpc("cancel_pending_order", { p_order_id: order.id });
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
                      <input value={form.name} onChange={set("name")} maxLength={LIMITS.name} autoComplete="name" className={inp} placeholder="Priya Sharma" />
                    </F>
                    <F label="Phone *">
                      <input value={form.phone} onChange={set("phone")} maxLength={LIMITS.phone} autoComplete="tel" className={inp} placeholder="+91 98765 43210" type="tel" />
                    </F>
                  </div>

                  <F label="Email *">
                    <input value={form.email} onChange={set("email")} maxLength={LIMITS.email} autoComplete="email" className={inp} placeholder="you@email.com" type="email" />
                  </F>

                  <F label="Shipping Address *">
                    <input value={form.address} onChange={set("address")} maxLength={LIMITS.address} autoComplete="street-address" className={inp} placeholder="Flat 4B, Sunrise Apartments, MG Road" />
                  </F>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <F label="City *">
                      <input value={form.city} onChange={set("city")} maxLength={LIMITS.city} autoComplete="address-level2" className={inp} placeholder="Mumbai" />
                    </F>
                    <F label="State">
                      <input value={form.state} onChange={set("state")} maxLength={LIMITS.state} autoComplete="address-level1" className={inp} placeholder="Maharashtra" />
                    </F>
                    <F label="Pincode *">
                      <input value={form.pincode} onChange={set("pincode")} maxLength={6} inputMode="numeric" autoComplete="postal-code" className={inp} placeholder="400001" />
                    </F>
                  </div>

                  <F label="Special Instructions">
                    <textarea
                      value={form.notes}
                      onChange={set("notes")}
                      rows={3}
                      maxLength={LIMITS.notes}
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

                    <button
                      onClick={onCOD}
                      disabled={processing}
                      className="w-full px-8 py-4 rounded-full border border-border hover:border-foreground/40 hover:bg-muted/40 transition-all duration-300 inline-flex items-center justify-center gap-2 disabled:opacity-60 text-sm text-foreground/75"
                    >
                      <Package className="w-4 h-4" /> Cash on Delivery
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
