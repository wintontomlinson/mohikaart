import { motion, useInView } from "framer-motion";
import { useState, useRef } from "react";
import { ArrowRight, Palette, MessageCircle, Package, CheckCircle, Send, Upload, Calendar, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useStoreSettings, isPlaceholderPhone } from "@/lib/settings";

/* ── Form data type ── */
type FormData = {
  name: string;
  phone: string;
  email: string;
  productType: string;
  occasion: string;
  details: string;
  budget: string;
  deliveryDate: string;
  image: File | null;
};

const INITIAL_FORM: FormData = {
  name: "",
  phone: "",
  email: "",
  productType: "",
  occasion: "",
  details: "",
  budget: "",
  deliveryDate: "",
  image: null,
};

const productTypes = [
  "Name Keychain",
  "Photo Frame",
  "Resin Tray",
  "Wedding Keepsake",
  "Coaster Set",
  "Bookmark",
  "Gift Hamper",
  "Other",
];

const occasions = [
  "Birthday",
  "Wedding",
  "Anniversary",
  "Corporate Gift",
  "Just Because",
  "Other",
];

const budgetRanges = [
  "Under ₹500",
  "₹500–₹1500",
  "₹1500–₹3000",
  "₹3000+",
];

/* ── Why Custom cards ── */
const whyCards = [
  { emoji: "🎨", title: "Fully Personalized", desc: "Made exactly how you imagine it" },
  { emoji: "💌", title: "Direct Communication", desc: "We discuss every detail with you" },
  { emoji: "📦", title: "Premium Packaging", desc: "Every order packed with love" },
];

/* ── Process steps ── */
const processSteps = [
  { step: 1, title: "Fill the form / WhatsApp us", desc: "Share your idea and requirements" },
  { step: 2, title: "We confirm design & price", desc: "A detailed mockup is sent your way" },
  { step: 3, title: "You approve, we craft", desc: "Handmade with care and precision" },
  { step: 4, title: "Delivered to your door 🚪", desc: "Premium-packed and shipped safely" },
];

/* ── Shared input style ── */
const inputClass =
  "w-full px-4 py-3 rounded-xl bg-white border border-[#e5e0d8] text-sm text-[#3D2B1F] outline-none transition-all duration-300 focus:border-[#C9964A] focus:ring-2 focus:ring-[#C9964A]/20 placeholder:text-[#3D2B1F]/40";

const CustomOrderPage = () => {
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [fileName, setFileName] = useState("");
  const { phone } = useStoreSettings();
  const phoneDigits = (phone || "").replace(/\D/g, "");

  const formRef = useRef(null);
  const whyRef = useRef(null);
  const processRef = useRef(null);
  const formInView = useInView(formRef, { once: true, margin: "-60px" });
  const whyInView = useInView(whyRef, { once: true, margin: "-60px" });
  const processInView = useInView(processRef, { once: true, margin: "-60px" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm((prev) => ({ ...prev, image: file }));
    setFileName(file?.name || "");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.productType) {
      toast.error("Please fill in required fields (Name, Phone, Product Type)");
      return;
    }

    // Build WhatsApp message from form
    if (!isPlaceholderPhone(phone)) {
      const msg = [
        `🛍️ *Custom Order Request*`,
        ``,
        `*Name:* ${form.name}`,
        `*Phone:* ${form.phone}`,
        form.email ? `*Email:* ${form.email}` : "",
        `*Product:* ${form.productType}`,
        form.occasion ? `*Occasion:* ${form.occasion}` : "",
        form.budget ? `*Budget:* ${form.budget}` : "",
        form.deliveryDate ? `*Delivery By:* ${form.deliveryDate}` : "",
        form.details ? `\n*Details:*\n${form.details}` : "",
      ]
        .filter(Boolean)
        .join("\n");
      window.open(`https://wa.me/${phoneDigits}?text=${encodeURIComponent(msg)}`, "_blank");
    }

    setSubmitted(true);
    toast.success("We'll get back to you within 24 hours! 🎉");
  };

  return (
    <div className="pt-24 pb-16">
      {/* ── Page Header ── */}
      <section className="max-w-[800px] mx-auto px-6 text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p
            className="font-semibold uppercase mb-3"
            style={{ fontSize: "11px", color: "#C9964A", letterSpacing: "0.25em" }}
          >
            Custom Order
          </p>
          <h1
            className="font-display mb-4"
            style={{
              fontWeight: 400,
              fontSize: "clamp(2rem, 4.5vw, 3rem)",
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              color: "#3D2B1F",
            }}
          >
            Create Your Dream Piece{" "}
            <span className="inline-block">✨</span>
          </h1>
          <p style={{ fontSize: "16px", lineHeight: 1.7, color: "rgba(61,43,31,0.65)", maxWidth: "500px", margin: "0 auto" }}>
            Tell us what you have in mind — we'll craft it just for you
          </p>
        </motion.div>
      </section>

      {/* ── SECTION 1: ORDER FORM ── */}
      <section ref={formRef} className="max-w-[720px] mx-auto px-6 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={formInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-3xl p-6 md:p-10"
          style={{
            background: "rgba(255,255,255,0.7)",
            border: "1px solid rgba(201,150,74,0.15)",
            boxShadow: "0 12px 40px -12px rgba(61,43,31,0.1)",
          }}
        >
          {submitted ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center" style={{ background: "rgba(201,150,74,0.1)" }}>
                <CheckCircle className="w-8 h-8 text-[#C9964A]" />
              </div>
              <h3 className="font-display text-2xl mb-3" style={{ color: "#3D2B1F" }}>
                Request Sent! 🎉
              </h3>
              <p style={{ fontSize: "15px", color: "rgba(61,43,31,0.65)" }}>
                We'll get back to you within 24 hours. Check your WhatsApp!
              </p>
              <button
                onClick={() => { setSubmitted(false); setForm(INITIAL_FORM); setFileName(""); }}
                className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] tracking-[0.1em] uppercase font-semibold transition-all duration-300 hover:scale-105"
                style={{ background: "#3D2B1F", color: "#FAF7F4" }}
              >
                Submit Another Request
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name & Phone row */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#3D2B1F]/60 mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#3D2B1F]/60 mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#3D2B1F]/60 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@email.com"
                  className={inputClass}
                />
              </div>

              {/* Product Type & Occasion row */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#3D2B1F]/60 mb-1.5">
                    Product Type *
                  </label>
                  <select
                    name="productType"
                    value={form.productType}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  >
                    <option value="">Select product type</option>
                    {productTypes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#3D2B1F]/60 mb-1.5">
                    Occasion
                  </label>
                  <select
                    name="occasion"
                    value={form.occasion}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="">Select occasion</option>
                    {occasions.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Details textarea */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#3D2B1F]/60 mb-1.5">
                  Customization Details
                </label>
                <textarea
                  name="details"
                  value={form.details}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe your idea — name, colors, size, special message, reference images etc."
                  className={`${inputClass} resize-none`}
                />
              </div>

              {/* Budget range */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#3D2B1F]/60 mb-2.5">
                  Budget Range
                </label>
                <div className="flex flex-wrap gap-2">
                  {budgetRanges.map((b) => (
                    <label
                      key={b}
                      className={`cursor-pointer px-4 py-2 rounded-full text-[12px] font-medium border transition-all duration-300 ${
                        form.budget === b
                          ? "border-[#C9964A] bg-[#C9964A]/10 text-[#C9964A]"
                          : "border-[#e5e0d8] bg-white text-[#3D2B1F]/60 hover:border-[#C9964A]/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="budget"
                        value={b}
                        checked={form.budget === b}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      {b}
                    </label>
                  ))}
                </div>
              </div>

              {/* File upload & Date row */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#3D2B1F]/60 mb-1.5">
                    Reference Image (optional)
                  </label>
                  <label
                    className={`${inputClass} flex items-center gap-2 cursor-pointer hover:border-[#C9964A]/50`}
                  >
                    <Upload className="w-4 h-4 text-[#C9964A] shrink-0" />
                    <span className="truncate text-[#3D2B1F]/50">
                      {fileName || "Choose file..."}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="sr-only"
                    />
                  </label>
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#3D2B1F]/60 mb-1.5">
                    Preferred Delivery Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="deliveryDate"
                      value={form.deliveryDate}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              {/* Submit button */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full md:w-auto relative overflow-hidden inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-[12px] tracking-[0.1em] uppercase font-semibold transition-all duration-300 group"
                style={{
                  background: "#3D2B1F",
                  color: "#FAF7F4",
                  boxShadow: "0 6px 20px -6px rgba(61,43,31,0.4)",
                }}
              >
                {/* Shine sweep */}
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)" }} />
                <Send className="w-4 h-4 relative z-10" />
                <span className="relative z-10">Send My Request</span>
                <ArrowRight className="w-4 h-4 relative z-10 transition-transform group-hover:translate-x-1" />
              </motion.button>
            </form>
          )}
        </motion.div>
      </section>

      {/* ── SECTION 2: WHY CUSTOM ORDER ── */}
      <section ref={whyRef} className="max-w-[1000px] mx-auto px-6 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={whyInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2
            className="font-display"
            style={{
              fontWeight: 400,
              fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
              color: "#3D2B1F",
              letterSpacing: "-0.02em",
            }}
          >
            Why{" "}
            <em className="font-serif italic" style={{ color: "#C9964A" }}>
              Custom Order?
            </em>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          {whyCards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 24 }}
              animate={whyInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="text-center p-7 rounded-2xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              style={{
                background: "rgba(255,255,255,0.6)",
                border: "1px solid rgba(201,150,74,0.12)",
              }}
            >
              <div className="text-4xl mb-4">{card.emoji}</div>
              <h3 className="font-display text-lg mb-2" style={{ color: "#3D2B1F", fontWeight: 500 }}>
                {card.title}
              </h3>
              <p style={{ fontSize: "14px", color: "rgba(61,43,31,0.6)", lineHeight: 1.6 }}>
                {card.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── SECTION 3: WHATSAPP SHORTCUT ── */}
      <section className="max-w-[600px] mx-auto px-6 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center p-8 rounded-3xl"
          style={{
            background: "linear-gradient(135deg, rgba(37,211,102,0.05), rgba(37,211,102,0.12))",
            border: "1px solid rgba(37,211,102,0.2)",
          }}
        >
          <MessageCircle className="w-10 h-10 mx-auto mb-4" style={{ color: "#25D366" }} />
          <h3 className="font-display text-xl mb-2" style={{ color: "#3D2B1F", fontWeight: 500 }}>
            Prefer to chat directly?
          </h3>
          <p className="mb-5" style={{ fontSize: "14px", color: "rgba(61,43,31,0.6)" }}>
            Skip the form — message us on WhatsApp for instant support
          </p>
          <a
            href={`https://wa.me/${phoneDigits}?text=${encodeURIComponent("Hi Mohika! I'd like to place a custom order. Here's my idea:")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full text-[12px] tracking-[0.08em] uppercase font-semibold transition-all duration-300 hover:scale-105"
            style={{
              background: "#25D366",
              color: "white",
              boxShadow: "0 6px 20px -6px rgba(37,211,102,0.4)",
            }}
          >
            <MessageCircle className="w-4 h-4" />
            Chat on WhatsApp
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </section>

      {/* ── SECTION 4: PROCESS STEPS ── */}
      <section ref={processRef} className="max-w-[900px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={processInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p
            className="font-semibold uppercase mb-3"
            style={{ fontSize: "11px", color: "#C9964A", letterSpacing: "0.25em" }}
          >
            The Process
          </p>
          <h2
            className="font-display"
            style={{
              fontWeight: 400,
              fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
              color: "#3D2B1F",
              letterSpacing: "-0.02em",
            }}
          >
            How Custom Orders{" "}
            <em className="font-serif italic" style={{ color: "#C9964A" }}>
              Work
            </em>
          </h2>
        </motion.div>

        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-[23px] md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-[2px]">
            <motion.div
              className="h-full rounded-full"
              style={{ background: "linear-gradient(180deg, #C9964A, #e8c89a, #C9964A)" }}
              initial={{ scaleY: 0 }}
              animate={processInView ? { scaleY: 1 } : {}}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: "top" }}
            />
          </div>

          <div className="space-y-8 md:space-y-10">
            {processSteps.map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                animate={processInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                className={`relative flex items-start gap-5 ${
                  i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Step circle */}
                <div
                  className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center shrink-0 text-sm font-bold"
                  style={{
                    background: "#C9964A",
                    color: "white",
                    boxShadow: "0 4px 12px -2px rgba(201,150,74,0.4)",
                  }}
                >
                  {s.step}
                </div>

                {/* Content card */}
                <div
                  className="flex-1 p-5 rounded-2xl md:max-w-[320px]"
                  style={{
                    background: "rgba(255,255,255,0.7)",
                    border: "1px solid rgba(201,150,74,0.1)",
                  }}
                >
                  <h4 className="font-display text-base mb-1" style={{ color: "#3D2B1F", fontWeight: 500 }}>
                    {s.title}
                  </h4>
                  <p style={{ fontSize: "13px", color: "rgba(61,43,31,0.6)", lineHeight: 1.6 }}>
                    {s.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CustomOrderPage;
