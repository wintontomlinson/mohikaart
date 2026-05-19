import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  Phone,
  Instagram,
  Mail,
  Send,
  ChevronDown,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useStoreSettings } from "@/lib/settings";
import { EMAIL_RE, PHONE_RE, LIMITS, clamp } from "@/lib/validation";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
};

const PRODUCT_TYPES = [
  "Name Keychain",
  "Photo Frame",
  "Wedding Keepsake",
  "Bookmark",
  "Coaster Set",
  "Gift Hamper",
  "Other",
];

const FAQS = [
  {
    q: "How long does a custom order take?",
    a: "7\u201314 working days from design approval to delivery.",
  },
  {
    q: "Can I send my own dried flowers?",
    a: "Absolutely. We'll guide you on how to ship them safely.",
  },
  {
    q: "Do you ship internationally?",
    a: "Currently India only. International shipping launching in 2025.",
  },
  {
    q: "What's your return policy?",
    a: "Custom pieces are non-returnable as each is uniquely yours.",
  },
  {
    q: "How do I share customization details?",
    a: "Use the form above or message us on WhatsApp.",
  },
];

const inputStyle: React.CSSProperties = {
  background: "#FAF7F4",
  border: "1px solid #e5e0d8",
  borderRadius: "14px",
  height: "48px",
  fontSize: "15px",
  color: "#3D2B1F",
  width: "100%",
  paddingLeft: "16px",
  paddingRight: "16px",
  outline: "none",
  transition: "all 0.3s ease",
};

const labelStyle: React.CSSProperties = {
  fontSize: "11px",
  fontWeight: 600,
  color: "#6B7280",
  letterSpacing: "0.15em",
  textTransform: "uppercase",
  display: "block",
  marginBottom: "8px",
};

const ContactPage = () => {
  const { phone, phone_display, email, instagram } = useStoreSettings();
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.target as HTMLFormElement);
    const name = clamp(fd.get("name"), LIMITS.name);
    const phoneV = clamp(fd.get("phone"), LIMITS.phone);
    const emailV = clamp(fd.get("email"), LIMITS.email).toLowerCase();
    const product = clamp(fd.get("product"), LIMITS.product);
    const idea = clamp(fd.get("idea"), LIMITS.idea);

    if (!name) return toast.error("Please enter your name");
    if (!EMAIL_RE.test(emailV)) return toast.error("Please enter a valid email");
    if (!PHONE_RE.test(phoneV)) return toast.error("Please enter a valid phone number");
    if (!idea) return toast.error("Please describe your idea");

    setSending(true);
    const { error } = await supabase.from("inquiries").insert({
      name,
      phone: phoneV,
      email: emailV,
      product: product || null,
      idea,
    });
    setSending(false);
    if (error) {
      toast.error("Something went wrong. Please try again.");
      return;
    }
    (e.target as HTMLFormElement).reset();
    setSubmitted(true);
    toast.success("Inquiry received! Mohika will reply within 24 hours.");
  };

  // Inject focus styles once
  useEffect(() => {
    const id = "mohika-contact-input-styles";
    if (document.getElementById(id)) return;
    const s = document.createElement("style");
    s.id = id;
    s.innerHTML = `
      .mohika-input:focus, .mohika-input:focus-visible {
        border-color: #C9964A !important;
        box-shadow: 0 0 0 3px rgba(201,150,74,0.10) !important;
        background: #ffffff !important;
      }
      .mohika-input::placeholder { color: #9CA3AF; }
      .mohika-contact-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 20px 50px -15px rgba(61,43,31,0.12);
        border-color: rgba(201,150,74,0.3) !important;
      }
    `;
    document.head.appendChild(s);
  }, []);

  const phoneDigits = phone.replace(/\D/g, "");

  const contactCards = [
    {
      icon: MessageCircle,
      title: "WhatsApp",
      info: phone_display,
      href: `https://wa.me/${phoneDigits}`,
      external: true,
      hint: "Fastest replies — usually within minutes",
    },
    {
      icon: Phone,
      title: "Call us",
      info: phone_display,
      href: `tel:${phoneDigits}`,
      external: false,
    },
    {
      icon: Instagram,
      title: "Instagram",
      info: `@${instagram}`,
      href: `https://instagram.com/${instagram.replace(/^@/, "")}`,
      external: true,
    },
    {
      icon: Mail,
      title: "Email",
      info: email,
      href: `mailto:${email}`,
      external: false,
    },
  ];

  return (
    <>
      {/* HEADER */}
      <section style={{ background: "#FAF7F4" }} className="relative overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 pt-28 pb-16 md:pt-36 md:pb-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-semibold uppercase mb-6"
            style={{
              fontSize: "11px",
              color: "#C9964A",
              letterSpacing: "0.25em",
            }}
          >
            Get in Touch
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="font-display mx-auto"
            style={{
              fontWeight: 400,
              fontSize: "clamp(2.5rem, 5vw, 3.8rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              color: "#3D2B1F",
              maxWidth: "20ch",
            }}
          >
            Tell us your{" "}
            <em
              className="font-serif italic"
              style={{ color: "#C9964A", fontWeight: 400 }}
            >
              story.
            </em>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-6 mx-auto"
            style={{
              fontSize: "16px",
              lineHeight: 1.75,
              color: "hsl(25 10% 42%)",
              maxWidth: "44ch",
            }}
          >
            Every keepsake begins with a conversation. Share your vision, and we&apos;ll guide
            it to life.
          </motion.p>
        </div>
      </section>

      {/* MAIN */}
      <section className="max-w-[1280px] mx-auto px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          {/* LEFT: contact cards */}
          <div className="space-y-4">
            {contactCards.map((c, i) => (
              <motion.a
                key={c.title}
                href={c.href}
                target={c.external ? "_blank" : undefined}
                rel={c.external ? "noopener noreferrer" : undefined}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="mohika-contact-card flex gap-4 p-6 transition-all duration-500"
                style={{
                  background: "#ffffff",
                  border: "1px solid #e5e0d8",
                  borderRadius: "20px",
                  textDecoration: "none",
                }}
              >
                <div
                  className="flex items-center justify-center shrink-0"
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "14px",
                    background: "#FAF7F4",
                  }}
                >
                  <c.icon
                    strokeWidth={1.6}
                    style={{ width: 22, height: 22, color: "#3D2B1F" }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    style={{
                      fontSize: "15px",
                      fontWeight: 500,
                      color: "#3D2B1F",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {c.title}
                  </div>
                  <div
                    className="mt-0.5 truncate"
                    style={{
                      fontSize: "13px",
                      color: "#6B7280",
                      lineHeight: 1.6,
                    }}
                  >
                    {c.info}
                  </div>
                  {c.hint && (
                    <div
                      className="mt-1.5"
                      style={{
                        fontSize: "11px",
                        color: "#C9964A",
                        fontWeight: 500,
                        letterSpacing: "0.02em",
                      }}
                    >
                      {c.hint}
                    </div>
                  )}
                </div>
              </motion.a>
            ))}
          </div>

          {/* RIGHT: form */}
          <motion.div {...fadeUp}>
            {/* Response badge */}
            <div className="flex justify-end mb-4">
              <span
                className="inline-flex items-center gap-1.5 rounded-full"
                style={{
                  background: "#EAF3DE",
                  color: "#27500A",
                  padding: "6px 12px",
                  fontSize: "12px",
                  fontWeight: 500,
                  letterSpacing: "0.01em",
                }}
              >
                <span className="relative flex h-2 w-2">
                  <span
                    className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
                    style={{ background: "#27500A" }}
                  />
                  <span
                    className="relative inline-flex rounded-full h-2 w-2"
                    style={{ background: "#27500A" }}
                  />
                </span>
                We respond within 24 hours
              </span>
            </div>

            <div
              className="p-8 lg:p-10"
              style={{
                background: "#ffffff",
                borderRadius: "24px",
                border: "1px solid #e5e0d8",
                boxShadow: "0 20px 60px -20px rgba(0,0,0,0.08)",
              }}
            >
              <AnimatePresence mode="wait">
                {!submitted ? (
                  <motion.form
                    key="form"
                    onSubmit={onSubmit}
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.4 }}
                  >
                    <h3
                      className="font-display"
                      style={{
                        fontWeight: 400,
                        fontSize: "28px",
                        color: "#3D2B1F",
                        letterSpacing: "-0.02em",
                        lineHeight: 1.15,
                      }}
                    >
                      Custom Inquiry
                    </h3>
                    <p
                      className="mt-2 mb-7"
                      style={{
                        fontSize: "14px",
                        color: "#6B7280",
                        lineHeight: 1.6,
                      }}
                    >
                      Tell us a little about your idea — names, dates, colors, the moment
                      you&apos;re preserving.
                    </p>

                    <div className="space-y-5">
                      <div>
                        <label htmlFor="name" style={labelStyle}>
                          Name
                        </label>
                        <input
                          id="name"
                          name="name"
                          required
                          maxLength={80}
                          autoComplete="name"
                          className="mohika-input"
                          style={inputStyle}
                          placeholder="Your full name"
                        />
                      </div>

                      <div className="grid sm:grid-cols-2 gap-5">
                        <div>
                          <label htmlFor="phone" style={labelStyle}>
                            Phone
                          </label>
                          <input
                            id="phone"
                            name="phone"
                            type="tel"
                            required
                            maxLength={20}
                            autoComplete="tel"
                            className="mohika-input"
                            style={inputStyle}
                            placeholder="+91 98765 43210"
                          />
                        </div>
                        <div>
                          <label htmlFor="email" style={labelStyle}>
                            Email
                          </label>
                          <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            maxLength={120}
                            autoComplete="email"
                            className="mohika-input"
                            style={inputStyle}
                            placeholder="you@email.com"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="product" style={labelStyle}>
                          Product Type
                        </label>
                        <select
                          id="product"
                          name="product"
                          className="mohika-input"
                          style={{
                            ...inputStyle,
                            appearance: "none",
                            backgroundImage:
                              "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23C9964A' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")",
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "right 18px center",
                            paddingRight: "44px",
                          }}
                          defaultValue=""
                        >
                          <option value="" disabled>
                            Select a product…
                          </option>
                          {PRODUCT_TYPES.map((p) => (
                            <option key={p}>{p}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label htmlFor="idea" style={labelStyle}>
                          Your Story
                        </label>
                        <textarea
                          id="idea"
                          name="idea"
                          required
                          rows={5}
                          maxLength={1000}
                          className="mohika-input"
                          style={{
                            ...inputStyle,
                            height: "auto",
                            minHeight: "140px",
                            paddingTop: "14px",
                            paddingBottom: "14px",
                            resize: "vertical",
                            lineHeight: 1.6,
                          }}
                          placeholder="The moment, the names, the colors that matter…"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={sending}
                        className="w-full inline-flex items-center justify-center gap-2 transition-all duration-500"
                        style={{
                          height: "50px",
                          borderRadius: "9999px",
                          background: "#3D2B1F",
                          color: "#FAF7F4",
                          fontSize: "13px",
                          fontWeight: 600,
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                          opacity: sending ? 0.6 : 1,
                          cursor: sending ? "not-allowed" : "pointer",
                        }}
                        onMouseEnter={(e) => {
                          if (sending) return;
                          e.currentTarget.style.boxShadow =
                            "0 8px 30px -8px rgba(61,43,31,0.4)";
                          e.currentTarget.style.transform = "translateY(-2px)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = "none";
                          e.currentTarget.style.transform = "translateY(0)";
                        }}
                      >
                        {sending ? (
                          "Sending…"
                        ) : (
                          <>
                            Send Inquiry
                            <Send style={{ width: 14, height: 14 }} />
                          </>
                        )}
                      </button>
                    </div>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.6,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="text-center py-10"
                  >
                    <motion.div
                      initial={{ scale: 0, rotate: -10 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{
                        delay: 0.1,
                        type: "spring",
                        stiffness: 220,
                        damping: 14,
                      }}
                      className="mx-auto mb-6 flex items-center justify-center"
                      style={{
                        width: "72px",
                        height: "72px",
                        borderRadius: "9999px",
                        background: "#FAF7F4",
                        border: "1px solid rgba(201,150,74,0.35)",
                      }}
                    >
                      <CheckCircle2
                        strokeWidth={1.6}
                        style={{ width: 32, height: 32, color: "#C9964A" }}
                      />
                    </motion.div>
                    <h3
                      className="font-display"
                      style={{
                        fontWeight: 400,
                        fontSize: "28px",
                        color: "#3D2B1F",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      We&apos;ve received your inquiry
                    </h3>
                    <p
                      className="mt-3 mx-auto"
                      style={{
                        fontSize: "15px",
                        color: "hsl(25 10% 42%)",
                        lineHeight: 1.7,
                        maxWidth: "36ch",
                      }}
                    >
                      Mohika will personally reply within 24 hours with next steps and a
                      price estimate.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="mt-7 inline-flex items-center gap-2"
                      style={{
                        fontSize: "12px",
                        fontWeight: 600,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "#C9964A",
                      }}
                    >
                      Send another inquiry
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: "#FAF7F4" }}>
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-20">
          <motion.div {...fadeUp} className="text-center mb-12">
            <div
              className="font-semibold uppercase mb-5"
              style={{
                fontSize: "11px",
                color: "#C9964A",
                letterSpacing: "0.25em",
              }}
            >
              Quick Answers
            </div>
            <h2
              className="font-display"
              style={{
                fontWeight: 400,
                fontSize: "clamp(1.85rem, 3.8vw, 2.8rem)",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                color: "#3D2B1F",
              }}
            >
              Common Questions
            </h2>
          </motion.div>

          <div className="max-w-2xl mx-auto space-y-3">
            {FAQS.map((f, i) => {
              const open = openFaq === i;
              return (
                <motion.div
                  key={f.q}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  style={{
                    background: "#ffffff",
                    border: "1px solid #e5e0d8",
                    borderRadius: "16px",
                    overflow: "hidden",
                  }}
                >
                  <button
                    onClick={() => setOpenFaq(open ? null : i)}
                    className="w-full flex justify-between items-center px-6 py-4 text-left"
                    aria-expanded={open}
                    style={{
                      fontSize: "14px",
                      fontWeight: 500,
                      color: "#3D2B1F",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    <span>{f.q}</span>
                    <motion.span
                      animate={{ rotate: open ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="shrink-0 ml-4"
                    >
                      <ChevronDown
                        strokeWidth={1.8}
                        style={{ width: 18, height: 18, color: "#C9964A" }}
                      />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                        style={{ overflow: "hidden" }}
                      >
                        <div
                          className="px-6 pb-4"
                          style={{
                            fontSize: "13px",
                            color: "#6B7280",
                            lineHeight: 1.7,
                          }}
                        >
                          {f.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactPage;
