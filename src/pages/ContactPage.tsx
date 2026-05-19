import { useState, useEffect } from "react";
import { MessageCircle, Phone, Instagram, Mail, Send, Check, ChevronDown } from "lucide-react";
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
      <section className="py-20" style={{ background: "#FAF7F4" }}>
        <div className="max-w-[1280px] mx-auto px-8">
          <p className="eyebrow mb-4">Start a Conversation</p>
          <h1
            className="font-display font-light leading-[1.08]"
            style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}
          >
            Let's create something{" "}
            <em className="not-italic italic" style={{ color: "#C9964A", fontFamily: "var(--font-serif)" }}>
              extraordinary
            </em>
            .
          </h1>
          <p className="mt-5 text-[15px] leading-relaxed text-gray-500 max-w-lg">
            Whether you have a clear vision or just a spark of an idea — reach out. We'll guide you through every step of bringing your keepsake to life.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left Column - Contact Info */}
            <div>
              <h2 className="font-display mb-6" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>
                Reach us directly
              </h2>
              <div ref={revealRef} className="scroll-reveal space-y-4">
                {/* WhatsApp */}
                <a
                  href={`https://wa.me/${phone.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex gap-4 p-5 rounded-2xl bg-white transition-shadow duration-300 hover:shadow-md"
                  style={{ border: "1px solid #e5e0d8" }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "#FAF7F4" }}
                  >
                    <MessageCircle className="w-5 h-5" style={{ color: "#3D2B1F" }} />
                  </div>
                  <div>
                    <div className="text-[14px] font-medium" style={{ color: "#3D2B1F" }}>
                      WhatsApp
                    </div>
                    <div className="text-[13px] text-gray-500 mt-0.5">{phone_display}</div>
                    <div className="text-[12px] mt-1" style={{ color: "#C9964A" }}>
                      Fastest way to reach us — replies within minutes
                    </div>
                  </div>
                </a>

                {/* Phone */}
                <a
                  href={`tel:${phone}`}
                  className="flex gap-4 p-5 rounded-2xl bg-white transition-shadow duration-300 hover:shadow-md"
                  style={{ border: "1px solid #e5e0d8" }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "#FAF7F4" }}
                  >
                    <Phone className="w-5 h-5" style={{ color: "#3D2B1F" }} />
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
                  className="flex gap-4 p-5 rounded-2xl bg-white transition-shadow duration-300 hover:shadow-md"
                  style={{ border: "1px solid #e5e0d8" }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "#FAF7F4" }}
                  >
                    <Instagram className="w-5 h-5" style={{ color: "#3D2B1F" }} />
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
                  className="flex gap-4 p-5 rounded-2xl bg-white transition-shadow duration-300 hover:shadow-md"
                  style={{ border: "1px solid #e5e0d8" }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "#FAF7F4" }}
                  >
                    <Mail className="w-5 h-5" style={{ color: "#3D2B1F" }} />
                  </div>
                  <div>
                    <div className="text-[14px] font-medium" style={{ color: "#3D2B1F" }}>
                      Email
                    </div>
                    <div className="text-[13px] text-gray-500 mt-0.5">{email}</div>
                  </div>
                </a>
              </div>
            </div>

            {/* Right Column - Form */}
            <div>
              {/* Response time badge */}
              <span
                className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium mb-6"
                style={{ background: "#EAF3DE", color: "#27500A" }}
              >
                ⚡ We typically respond within 24 hours
              </span>

              {success ? (
                /* Success state */
                <div
                  className="bg-white rounded-2xl p-8 flex flex-col items-center justify-center text-center"
                  style={{ border: "1px solid #e5e0d8", minHeight: "400px" }}
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
                    style={{ background: "#EAF3DE" }}
                  >
                    <Check className="w-7 h-7" style={{ color: "#27500A" }} />
                  </div>
                  <h3 className="font-display text-2xl mb-3" style={{ color: "#3D2B1F" }}>
                    Your inquiry has been received!
                  </h3>
                  <p className="text-[14px] text-gray-500 max-w-sm leading-relaxed">
                    Thank you for trusting us with your vision. Our team will review your details and reach out within 24 hours to discuss next steps.
                  </p>
                </div>
              ) : (
                /* Form container */
                <form
                  onSubmit={onSubmit}
                  className="bg-white rounded-2xl p-8"
                  style={{ border: "1px solid #e5e0d8" }}
                >
                  <h3 className="font-display text-xl mb-1" style={{ color: "#3D2B1F" }}>
                    Custom Order Inquiry
                  </h3>
                  <p className="text-[13px] text-gray-500 mb-6">
                    Tell us about the piece you envision and we'll get back to you within 24 hours.
                  </p>

                  <div className="space-y-4">
                    {/* Name */}
                    <div>
                      <label className="block text-[12px] uppercase tracking-wide font-medium text-gray-500 mb-1.5">
                        Name *
                      </label>
                      <input
                        required
                        name="name"
                        maxLength={80}
                        autoComplete="name"
                        className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-colors"
                        style={{ background: "#FAF7F4", border: "1px solid #e5e0d8" }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "#C9964A")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e0d8")}
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-[12px] uppercase tracking-wide font-medium text-gray-500 mb-1.5">
                        Phone *
                      </label>
                      <input
                        required
                        type="tel"
                        name="phone"
                        maxLength={20}
                        autoComplete="tel"
                        placeholder="+91 98765 43210"
                        className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-colors"
                        style={{ background: "#FAF7F4", border: "1px solid #e5e0d8" }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "#C9964A")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e0d8")}
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-[12px] uppercase tracking-wide font-medium text-gray-500 mb-1.5">
                        Email *
                      </label>
                      <input
                        required
                        type="email"
                        name="email"
                        maxLength={120}
                        autoComplete="email"
                        className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-colors"
                        style={{ background: "#FAF7F4", border: "1px solid #e5e0d8" }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "#C9964A")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e0d8")}
                      />
                    </div>

                    {/* Product Type */}
                    <div>
                      <label className="block text-[12px] uppercase tracking-wide font-medium text-gray-500 mb-1.5">
                        Product Type
                      </label>
                      <select
                        name="product"
                        className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-colors cursor-pointer"
                        style={{ background: "#FAF7F4", border: "1px solid #e5e0d8" }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "#C9964A")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e0d8")}
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
                      <label className="block text-[12px] uppercase tracking-wide font-medium text-gray-500 mb-1.5">
                        Your Idea
                      </label>
                      <textarea
                        name="idea"
                        rows={4}
                        maxLength={1000}
                        placeholder="Describe names, colors, occasion…"
                        className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-colors resize-none"
                        style={{ background: "#FAF7F4", border: "1px solid #e5e0d8" }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "#C9964A")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e0d8")}
                      />
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={sending}
                      className="w-full rounded-full h-[44px] text-xs uppercase tracking-wide font-semibold flex items-center justify-center gap-2 transition-opacity disabled:opacity-60"
                      style={{ background: "#3D2B1F", color: "#FAF7F4" }}
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
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20" style={{ background: "#FAF7F4" }}>
        <div className="max-w-[1280px] mx-auto px-8">
          <h2 className="font-display text-center mb-10" style={{ fontSize: "clamp(1.85rem, 4vw, 3rem)" }}>
            Common Questions
          </h2>

          <div className="max-w-2xl mx-auto space-y-3">
            {faqData.map((faq, i) => (
              <div
                key={i}
                className="bg-white rounded-xl overflow-hidden"
                style={{ border: "1px solid #e5e0d8" }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left"
                >
                  <span className="text-[14px] font-medium" style={{ color: "#3D2B1F" }}>
                    {faq.q}
                  </span>
                  <ChevronDown
                    className="w-4 h-4 shrink-0 ml-4 transition-transform duration-200"
                    style={{
                      color: "#3D2B1F",
                      transform: openFaq === i ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4">
                    <p className="text-[13px] text-gray-500 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactPage;
