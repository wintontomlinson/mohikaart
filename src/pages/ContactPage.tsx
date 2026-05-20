import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronRight, ChevronDown, MapPin, Phone, Mail, Clock, Instagram, MessageCircle, ArrowRight, CheckCircle, Send } from "lucide-react";
import { toast } from "sonner";
import { useStoreSettings } from "@/lib/settings";

const EASE = [0.22, 1, 0.36, 1] as const;

const FAQS = [
  { q: "How long does delivery take?", a: "5-7 business days pan India. Custom orders: 7-10 working days." },
  { q: "Do you ship outside India?", a: "Currently India only. International shipping coming soon!" },
  { q: "Can I modify my order?", a: "Yes — within 24 hours of ordering. WhatsApp us to make changes." },
  { q: "How to place a custom order?", a: "Fill our Custom Order form or WhatsApp us your idea directly." },
  { q: "Product arrived damaged?", a: "Message us within 48 hours with photos — we'll replace it free." },
];

const SUBJECTS = ["Order Query", "Custom Order", "Shipping Issue", "Feedback", "Other"];

const ContactPage = () => {
  const { phone, email, instagram } = useStoreSettings();
  const phoneDigits = (phone || "").replace(/\D/g, "");
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please fill in required fields");
      return;
    }
    setSubmitted(true);
  };

  const inputClass = "w-full px-4 py-3 rounded-xl bg-white text-sm outline-none transition-all duration-300 border border-[rgba(26,18,8,0.1)] focus:border-[#c9a84c] focus:ring-2 focus:ring-[rgba(201,168,76,0.15)] placeholder:text-[rgba(26,18,8,0.35)]";

  return (
    <div style={{ background: "#fdf9f0", color: "#1a1208" }}>

      {/* ━━ HEADER ━━ */}
      <section className="pt-28 pb-10 md:pb-12">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.16em] mb-8"
            style={{ color: "rgba(26,18,8,0.45)" }}
          >
            <Link to="/" className="hover:text-[#c9a84c] transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span style={{ color: "#1a1208" }}>Contact</span>
          </motion.nav>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="text-center"
          >
            <h1 className="font-display mb-3" style={{ fontWeight: 400, fontSize: "clamp(2.2rem, 5vw, 3.2rem)", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
              Get In{" "}
              <em className="font-serif italic" style={{ color: "#c9a84c", fontWeight: 400 }}>Touch</em>
              {" "}💌
            </h1>
            <p style={{ fontSize: "15px", color: "rgba(26,18,8,0.6)", maxWidth: 450, margin: "0 auto", lineHeight: 1.7 }}>
              Questions, custom orders, or just want to say hi — we're always here.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ━━ TWO COLUMN: INFO + FORM ━━ */}
      <section className="max-w-[1100px] mx-auto px-6 lg:px-8 pb-16 md:pb-20">
        <div className="grid md:grid-cols-5 gap-8 lg:gap-12">

          {/* LEFT: Info cards */}
          <div className="md:col-span-2 space-y-4">
            {[
              { icon: MapPin, label: "Location", value: "Handcrafted in India", color: "#c9a84c" },
              { icon: Phone, label: "WhatsApp", value: phone || "+91 99999 99999", href: `https://wa.me/${phoneDigits}`, color: "#25D366" },
              { icon: Mail, label: "Email", value: email || "hello@mohikaart.com", href: `mailto:${email || "hello@mohikaart.com"}`, color: "#c9a84c" },
              { icon: Clock, label: "Response Time", value: "We reply within 24 hours", color: "#c9a84c" },
            ].map((card, i) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
              >
                {card.href ? (
                  <a
                    href={card.href}
                    target={card.href.startsWith("https") ? "_blank" : undefined}
                    rel={card.href.startsWith("https") ? "noopener noreferrer" : undefined}
                    className="flex items-center gap-4 p-4 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                    style={{ background: "#fff", borderLeft: `3px solid ${card.color}`, boxShadow: "0 2px 12px -4px rgba(26,18,8,0.08)" }}
                  >
                    <card.icon className="w-5 h-5 shrink-0" style={{ color: card.color }} />
                    <div>
                      <p className="text-[10px] uppercase tracking-wider font-semibold mb-0.5" style={{ color: "rgba(26,18,8,0.45)" }}>{card.label}</p>
                      <p className="text-sm font-medium">{card.value}</p>
                    </div>
                  </a>
                ) : (
                  <div
                    className="flex items-center gap-4 p-4 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                    style={{ background: "#fff", borderLeft: `3px solid ${card.color}`, boxShadow: "0 2px 12px -4px rgba(26,18,8,0.08)" }}
                  >
                    <card.icon className="w-5 h-5 shrink-0" style={{ color: card.color }} />
                    <div>
                      <p className="text-[10px] uppercase tracking-wider font-semibold mb-0.5" style={{ color: "rgba(26,18,8,0.45)" }}>{card.label}</p>
                      <p className="text-sm font-medium">{card.value}</p>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}

            {/* Social icons */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5, ease: EASE }}
              className="flex items-center gap-3 pt-4"
            >
              {[
                { icon: Instagram, href: `https://instagram.com/${(instagram || "mohikaart").replace(/^@/, "")}`, color: "#833AB4", label: "Instagram" },
                { icon: MessageCircle, href: `https://wa.me/${phoneDigits}`, color: "#25D366", label: "WhatsApp" },
                { icon: Mail, href: `mailto:${email || "hello@mohikaart.com"}`, color: "#c9a84c", label: "Email" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-[1.2]"
                  style={{ background: "rgba(26,18,8,0.04)", color: "rgba(26,18,8,0.4)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = s.color; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(26,18,8,0.04)"; (e.currentTarget as HTMLElement).style.color = "rgba(26,18,8,0.4)"; }}
                >
                  <s.icon className="w-5 h-5" />
                </a>
              ))}
            </motion.div>
          </div>

          {/* RIGHT: Contact form */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
            className="md:col-span-3 p-6 md:p-8 rounded-2xl"
            style={{ background: "#fff", boxShadow: "0 8px 32px -8px rgba(26,18,8,0.1)", border: "1px solid rgba(26,18,8,0.05)" }}
          >
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center py-12"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
                    className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center"
                    style={{ background: "rgba(201,168,76,0.1)" }}
                  >
                    <CheckCircle className="w-8 h-8" style={{ color: "#c9a84c" }} />
                  </motion.div>
                  <h3 className="font-display text-xl mb-2" style={{ fontWeight: 500 }}>Message sent!</h3>
                  <p className="text-sm" style={{ color: "rgba(26,18,8,0.6)" }}>
                    We'll get back to you within 24 hours 🎉
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", subject: "", message: "" }); }}
                    className="mt-6 text-[11px] uppercase tracking-wider font-semibold transition-colors"
                    style={{ color: "#c9a84c" }}
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="space-y-4"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-semibold mb-1.5" style={{ color: "rgba(26,18,8,0.5)" }}>Full Name *</label>
                      <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Your name" className={inputClass} required />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-semibold mb-1.5" style={{ color: "rgba(26,18,8,0.5)" }}>Email Address *</label>
                      <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@email.com" className={inputClass} required />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-semibold mb-1.5" style={{ color: "rgba(26,18,8,0.5)" }}>Phone (optional)</label>
                      <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-semibold mb-1.5" style={{ color: "rgba(26,18,8,0.5)" }}>Subject</label>
                      <select name="subject" value={form.subject} onChange={handleChange} className={inputClass}>
                        <option value="">Select subject</option>
                        {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-semibold mb-1.5" style={{ color: "rgba(26,18,8,0.5)" }}>Message *</label>
                    <textarea name="message" value={form.message} onChange={handleChange} rows={5} placeholder="Tell us how we can help..." className={`${inputClass} resize-none`} required />
                  </div>
                  <button
                    type="submit"
                    className="group relative w-full overflow-hidden flex items-center justify-center gap-2 py-3.5 rounded-full text-[11px] tracking-[0.12em] uppercase font-semibold transition-all duration-300"
                    style={{ background: "#1a1208", color: "#fdf9f0" }}
                  >
                    <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)" }} />
                    <Send className="w-4 h-4 relative z-10" />
                    <span className="relative z-10">Send Message</span>
                    <ArrowRight className="w-4 h-4 relative z-10 transition-transform group-hover:translate-x-1" />
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* ━━ FAQ ACCORDION ━━ */}
      <section className="py-14 md:py-20" style={{ background: "rgba(201,168,76,0.03)" }}>
        <div className="max-w-[700px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
            className="text-center mb-10"
          >
            <h2 className="font-display" style={{ fontWeight: 400, fontSize: "clamp(1.6rem, 3vw, 2.2rem)", letterSpacing: "-0.02em" }}>
              Quick Answers
            </h2>
          </motion.div>

          <div className="space-y-3">
            {FAQS.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  className="rounded-xl overflow-hidden transition-all duration-300"
                  style={{ background: isOpen ? "#fff" : "transparent", border: "1px solid rgba(26,18,8,0.08)", boxShadow: isOpen ? "0 4px 16px -6px rgba(26,18,8,0.1)" : "none" }}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors hover:bg-white/60"
                  >
                    <span className="text-sm font-medium pr-4" style={{ color: "#c9a84c" }}>{faq.q}</span>
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                      className="shrink-0"
                    >
                      <ChevronDown className="w-4 h-4" style={{ color: "rgba(26,18,8,0.4)" }} />
                    </motion.span>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-4 text-sm leading-relaxed" style={{ color: "rgba(26,18,8,0.6)" }}>
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ━━ WHATSAPP CTA ━━ */}
      <section className="py-14 md:py-20" style={{ background: "#f0faf2" }}>
        <div className="max-w-[600px] mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <h3 className="font-display text-xl md:text-2xl mb-2" style={{ fontWeight: 400, color: "#1a1208" }}>
              Prefer instant replies? 💬
            </h3>
            <p className="text-sm mb-7" style={{ color: "rgba(26,18,8,0.6)" }}>
              Chat with us on WhatsApp — we usually reply within minutes!
            </p>
            <a
              href={`https://wa.me/${phoneDigits}?text=${encodeURIComponent("Hi Mohika! I have a question.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full text-[12px] tracking-[0.08em] uppercase font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
              style={{ background: "#25D366", color: "#fff", boxShadow: "0 4px 20px -4px rgba(37,211,102,0.4)" }}
            >
              <MessageCircle className="w-5 h-5" />
              Open WhatsApp Chat
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
