import { useState, useEffect } from "react";
import { MessageCircle, Phone, Instagram, Mail, Send, Check, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useStoreSettings } from "@/lib/settings";
import { EMAIL_RE, PHONE_RE, LIMITS, clamp } from "@/lib/validation";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const faqData = [
  {
    q: "How long does a custom order take?",
    a: "7–14 working days from design approval to delivery.",
  },
  {
    q: "Can I send my own dried flowers?",
    a: "Yes, absolutely! Please contact us first so we can guide you on how to ship them safely.",
  },
  {
    q: "Do you ship outside India?",
    a: "Currently we ship within India only. International shipping is coming soon.",
  },
  {
    q: "What's your return policy?",
    a: "Custom pieces are non-returnable as each one is uniquely made for you.",
  },
  {
    q: "How do I share my customization details?",
    a: "Via the inquiry form on this page or directly through WhatsApp.",
  },
];

const productTypes = [
  "Name Keychain",
  "Photo Frame",
  "Wedding Keepsake",
  "Bookmark",
  "Coaster Set",
  "Gift Hamper",
  "Other",
];

const ContactPage = () => {
  const { phone, phone_display, email, instagram } = useStoreSettings();
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const revealRef = useScrollReveal();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.target as HTMLFormElement);
    const name = clamp(fd.get("name"), LIMITS.name);
    const phoneV = clamp(fd.get("phone"), LIMITS.phone);
    const emailV = clamp(fd.get("email"), LIMITS.email).toLowerCase();
    const product = clamp(fd.get("product"), LIMITS.product);
    const idea = clamp(fd.get("idea"), LIMITS.idea);

    if (!name) return toast.error("Please enter your name");
    if (!PHONE_RE.test(phoneV)) return toast.error("Please enter a valid phone number");
    if (!EMAIL_RE.test(emailV)) return toast.error("Please enter a valid email");

    setSending(true);
    const { error } = await supabase.from("inquiries").insert({
      name,
      phone: phoneV,
      email: emailV,
      product: product || null,
      idea: idea || null,
    });
    setSending(false);
    if (error) {
      toast.error("Something went wrong. Please try again.");
      return;
    }
    setSuccess(true);
  };

  return (
    <>
      {/* Header */}
      <section className="py-24" style={{ background: "#FAF7F4" }}>
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <span
              className="inline-block text-[11px] uppercase tracking-[0.25em] font-semibold mb-5"
              style={{ color: "#C9964A" }}
            >
              Start a Conversation
            </span>
            <h1
              className="font-light leading-[1.08]"
              style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontFamily: "var(--font-display)", color: "#3D2B1F" }}
            >
              Let's create something{" "}
              <em className="not-italic italic" style={{ color: "#C9964A", fontFamily: "var(--font-serif)" }}>
                extraordinary
              </em>
              .
            </h1>
            <p className="mt-5 text-[15px] leading-[1.7] text-gray-500 max-w-lg">
              Whether you have a clear vision or just a spark of an idea — reach out. We'll guide you through every step of bringing your keepsake to life.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left Column - Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <h2
                className="mb-8"
                style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontFamily: "var(--font-display)", color: "#3D2B1F" }}
              >
                Reach us directly
              </h2>
              <div ref={revealRef} className="scroll-reveal space-y-4">
                {/* WhatsApp */}
                <a
                  href={`https://wa.me/${phone.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="luxury-card flex gap-4 p-6 rounded-[20px] bg-white transition-all duration-300"
                  style={{ border: "1px solid #e5e0d8" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 16px 40px -12px rgba(61,43,31,0.12)";
                    e.currentTarget.style.borderColor = "rgba(201,150,74,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.borderColor = "#e5e0d8";
                  }}
                >
                  <div
                    className="w-14 h-14 rounded-[14px] flex items-center justify-center shrink-0"
                    style={{ background: "#FAF7F4" }}
                  >
                    <MessageCircle className="w-5 h-5" style={{ color: "#C9964A" }} />
                  </div>
                  <div>
                    <div className="text-[14px] font-medium" style={{ color: "#3D2B1F" }}>
                      WhatsApp
                    </div>
                    <div className="text-[13px] text-gray-500 mt-0.5">{phone_display}</div>
                    <div className="text-[12px] mt-1.5 font-medium" style={{ color: "#C9964A" }}>
                      Fastest — replies within minutes
                    </div>
                  </div>
                </a>

                {/* Phone */}
                <a
                  href={`tel:${phone}`}
                  className="luxury-card flex gap-4 p-6 rounded-[20px] bg-white transition-all duration-300"
                  style={{ border: "1px solid #e5e0d8" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 16px 40px -12px rgba(61,43,31,0.12)";
                    e.currentTarget.style.borderColor = "rgba(201,150,74,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.borderColor = "#e5e0d8";
                  }}
                >
                  <div
                    className="w-14 h-14 rounded-[14px] flex items-center justify-center shrink-0"
                    style={{ background: "#FAF7F4" }}
                  >
                    <Phone className="w-5 h-5" style={{ color: "#C9964A" }} />
                  </div>
                  <div>
                    <div className="text-[14px] font-medium" style={{ color: "#3D2B1F" }}>
                      Call Us
                    </div>
                    <div className="text-[13px] text-gray-500 mt-0.5">{phone_display}</div>
                  </div>
                </a>

                {/* Instagram */}
                <a
                  href={`https://instagram.com/${instagram.replace(/^@/, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="luxury-card flex gap-4 p-6 rounded-[20px] bg-white transition-all duration-300"
                  style={{ border: "1px solid #e5e0d8" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 16px 40px -12px rgba(61,43,31,0.12)";
                    e.currentTarget.style.borderColor = "rgba(201,150,74,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.borderColor = "#e5e0d8";
                  }}
                >
                  <div
                    className="w-14 h-14 rounded-[14px] flex items-center justify-center shrink-0"
                    style={{ background: "#FAF7F4" }}
                  >
                    <Instagram className="w-5 h-5" style={{ color: "#C9964A" }} />
                  </div>
                  <div>
                    <div className="text-[14px] font-medium" style={{ color: "#3D2B1F" }}>
                      Instagram
                    </div>
                    <div className="text-[13px] text-gray-500 mt-0.5">@{instagram}</div>
                  </div>
                </a>

                {/* Email */}
                <a
                  href={`mailto:${email}`}
                  className="luxury-card flex gap-4 p-6 rounded-[20px] bg-white transition-all duration-300"
                  style={{ border: "1px solid #e5e0d8" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 16px 40px -12px rgba(61,43,31,0.12)";
                    e.currentTarget.style.borderColor = "rgba(201,150,74,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.borderColor = "#e5e0d8";
                  }}
                >
                  <div
                    className="w-14 h-14 rounded-[14px] flex items-center justify-center shrink-0"
                    style={{ background: "#FAF7F4" }}
                  >
                    <Mail className="w-5 h-5" style={{ color: "#C9964A" }} />
                  </div>
                  <div>
                    <div className="text-[14px] font-medium" style={{ color: "#3D2B1F" }}>
                      Email
                    </div>
                    <div className="text-[13px] text-gray-500 mt-0.5">{email}</div>
                  </div>
                </a>
              </div>
            </motion.div>

            {/* Right Column - Form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
            >
              {/* Response time badge */}
              <span className="gold-glow-pulse inline-flex items-center px-4 py-2 rounded-full text-[11px] font-semibold mb-6 tracking-wide"
                style={{ background: "rgba(201,150,74,0.08)", color: "#C9964A", border: "1px solid rgba(201,150,74,0.15)" }}
              >
                We typically respond within 24 hours
              </span>

              {success ? (
                /* Success state */
                <motion.div
                  className="bg-white rounded-[24px] p-8 lg:p-10 flex flex-col items-center justify-center text-center"
                  style={{
                    border: "1px solid #e5e0d8",
                    minHeight: "400px",
                    boxShadow: "0 20px 60px -20px rgba(0,0,0,0.08)",
                  }}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <motion.div
                    className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
                    style={{ background: "rgba(201,150,74,0.1)" }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <Check className="w-7 h-7" style={{ color: "#C9964A" }} />
                  </motion.div>
                  <h3
                    className="text-2xl mb-3"
                    style={{ fontFamily: "var(--font-display)", color: "#3D2B1F" }}
                  >
                    Your inquiry has been received!
                  </h3>
                  <p className="text-[14px] text-gray-500 max-w-sm leading-relaxed">
                    Thank you for trusting us with your vision. Our team will review your details and reach out within 24 hours to discuss next steps.
                  </p>
                </motion.div>
              ) : (
                /* Form container */
                <form
                  onSubmit={onSubmit}
                  className="bg-white rounded-[24px] p-8 lg:p-10"
                  style={{
                    border: "1px solid #e5e0d8",
                    boxShadow: "0 20px 60px -20px rgba(0,0,0,0.08)",
                  }}
                >
                  <h3
                    className="text-xl mb-1"
                    style={{ fontFamily: "var(--font-display)", color: "#3D2B1F" }}
                  >
                    Custom Order Inquiry
                  </h3>
                  <p className="text-[13px] text-gray-500 mb-8">
                    Tell us about the piece you envision and we'll get back to you within 24 hours.
                  </p>

                  <div className="space-y-5">
                    {/* Name */}
                    <div>
                      <label className="block text-[11px] uppercase tracking-[0.15em] font-semibold text-gray-500 mb-2">
                        Name *
                      </label>
                      <input
                        required
                        name="name"
                        maxLength={80}
                        autoComplete="name"
                        className="w-full px-4 h-[48px] rounded-[14px] text-sm outline-none transition-all duration-300"
                        style={{ background: "#FAF7F4", border: "1px solid #e5e0d8" }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = "#C9964A";
                          e.currentTarget.style.boxShadow = "0 0 0 3px rgba(201,150,74,0.08)";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = "#e5e0d8";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-[11px] uppercase tracking-[0.15em] font-semibold text-gray-500 mb-2">
                        Phone *
                      </label>
                      <input
                        required
                        type="tel"
                        name="phone"
                        maxLength={20}
                        autoComplete="tel"
                        placeholder="+91 98765 43210"
                        className="w-full px-4 h-[48px] rounded-[14px] text-sm outline-none transition-all duration-300"
                        style={{ background: "#FAF7F4", border: "1px solid #e5e0d8" }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = "#C9964A";
                          e.currentTarget.style.boxShadow = "0 0 0 3px rgba(201,150,74,0.08)";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = "#e5e0d8";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-[11px] uppercase tracking-[0.15em] font-semibold text-gray-500 mb-2">
                        Email *
                      </label>
                      <input
                        required
                        type="email"
                        name="email"
                        maxLength={120}
                        autoComplete="email"
                        className="w-full px-4 h-[48px] rounded-[14px] text-sm outline-none transition-all duration-300"
                        style={{ background: "#FAF7F4", border: "1px solid #e5e0d8" }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = "#C9964A";
                          e.currentTarget.style.boxShadow = "0 0 0 3px rgba(201,150,74,0.08)";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = "#e5e0d8";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      />
                    </div>

                    {/* Product Type */}
                    <div>
                      <label className="block text-[11px] uppercase tracking-[0.15em] font-semibold text-gray-500 mb-2">
                        Product Type
                      </label>
                      <select
                        name="product"
                        className="w-full px-4 h-[48px] rounded-[14px] text-sm outline-none transition-all duration-300 cursor-pointer"
                        style={{ background: "#FAF7F4", border: "1px solid #e5e0d8" }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = "#C9964A";
                          e.currentTarget.style.boxShadow = "0 0 0 3px rgba(201,150,74,0.08)";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = "#e5e0d8";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      >
                        <option value="">Select a type…</option>
                        {productTypes.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Idea */}
                    <div>
                      <label className="block text-[11px] uppercase tracking-[0.15em] font-semibold text-gray-500 mb-2">
                        Your Idea
                      </label>
                      <textarea
                        name="idea"
                        rows={4}
                        maxLength={1000}
                        placeholder="Describe names, colors, occasion…"
                        className="w-full px-4 py-3 rounded-[14px] text-sm outline-none transition-all duration-300 resize-none"
                        style={{ background: "#FAF7F4", border: "1px solid #e5e0d8" }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = "#C9964A";
                          e.currentTarget.style.boxShadow = "0 0 0 3px rgba(201,150,74,0.08)";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = "#e5e0d8";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      />
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={sending}
                      className="w-full rounded-full h-[50px] text-[12px] uppercase tracking-[0.12em] font-semibold flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-60"
                      style={{ background: "#3D2B1F", color: "#FAF7F4" }}
                      onMouseEnter={(e) => {
                        if (!sending) e.currentTarget.style.boxShadow = "0 8px 30px -8px rgba(61,43,31,0.4)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      {sending ? "Sending…" : (
                        <>
                          Send Inquiry <Send className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24" style={{ background: "#FAF7F4" }}>
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <motion.h2
            className="text-center mb-12"
            style={{ fontSize: "clamp(1.85rem, 4vw, 3rem)", fontFamily: "var(--font-display)", color: "#3D2B1F" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Common Questions
          </motion.h2>

          <div className="max-w-2xl mx-auto space-y-3">
            {faqData.map((faq, i) => (
              <motion.div
                key={i}
                className="luxury-card bg-white rounded-[16px] overflow-hidden transition-all duration-300"
                style={{ border: "1px solid #e5e0d8" }}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                >
                  <span className="text-[14px] font-medium" style={{ color: "#3D2B1F" }}>
                    {faq.q}
                  </span>
                  <ChevronDown
                    className="w-4 h-4 shrink-0 ml-4 transition-transform duration-300"
                    style={{
                      color: "#C9964A",
                      transform: openFaq === i ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5">
                        <p className="text-[13px] text-gray-500 leading-[1.7]">{faq.a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactPage;
