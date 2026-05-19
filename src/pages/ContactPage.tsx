import { useState } from "react";
import { MessageCircle, Instagram, Mail, Phone, Send, Check, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useStoreSettings } from "@/lib/settings";
import { EMAIL_RE, PHONE_RE, LIMITS, clamp } from "@/lib/validation";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const productTypes = [
  "Name Keychain",
  "Photo Frame",
  "Wedding Keepsake",
  "Bookmark",
  "Coaster Set",
  "Gift Hamper",
  "Other",
];

const faqItems = [
  { q: "How long does a custom order take?", a: "7–14 working days from design approval to delivery." },
  { q: "Can I send my own dried flowers?", a: "Yes, absolutely! Please contact us first so we can guide you on how to ship them safely." },
  { q: "Do you ship outside India?", a: "Currently we ship within India only. International shipping is coming soon." },
  { q: "What's your return policy?", a: "Custom pieces are non-returnable as each one is uniquely made for you. We guarantee quality." },
  { q: "How do I share my customization details?", a: "Via the inquiry form on this page or directly through WhatsApp — whichever is easier for you." },
];

const ContactPage = () => {
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { phone, phone_display, email, instagram } = useStoreSettings();
  const faqRef = useScrollReveal<HTMLDivElement>();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.target as HTMLFormElement);
    const name    = clamp(fd.get("name"),    LIMITS.name);
    const phoneV  = clamp(fd.get("phone"),   LIMITS.phone);
    const emailV  = clamp(fd.get("email"),   LIMITS.email).toLowerCase();
    const product = clamp(fd.get("product"), LIMITS.product);
    const idea    = clamp(fd.get("idea"),    LIMITS.idea);

    if (!name)                  return toast.error("Please enter your name");
    if (!EMAIL_RE.test(emailV)) return toast.error("Please enter a valid email");
    if (!PHONE_RE.test(phoneV)) return toast.error("Please enter a valid phone number");
    if (!idea)                  return toast.error("Please describe your idea");

    setSending(true);
    const { error } = await supabase.from("inquiries").insert({
      name, phone: phoneV, email: emailV, product: product || null, idea,
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
          <span style={{ fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase", color: "#C9964A", fontWeight: 500 }}>
            Get in Touch
          </span>
          <h1 className="font-display mt-3" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 300, lineHeight: 1.05 }}>
            Let's build a{" "}
            <em className="not-italic" style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", color: "#C9964A" }}>
              memory.
            </em>
          </h1>
          <p className="mt-4" style={{ fontSize: "15px", color: "hsl(25 10% 46%)", lineHeight: 1.7, maxWidth: "500px" }}>
            Reach out on WhatsApp, Instagram or fill out the inquiry form below. We usually reply within 24 hours.
          </p>
        </div>
      </section>

      {/* Contact Form + Info */}
      <section className="py-20">
        <div className="max-w-[1280px] mx-auto px-8 grid lg:grid-cols-2 gap-16 items-start">

          {/* Left - Contact info */}
          <div>
            <h2 className="font-display text-2xl mb-6" style={{ fontWeight: 400 }}>Get in touch</h2>
            <div className="space-y-4">
              <a
                href={`https://wa.me/${encodeURIComponent(phone.replace(/\D/g, ""))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-[#e5e0d8] hover:shadow-md transition-shadow duration-300"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "#FAF7F4" }}>
                  <MessageCircle className="w-5 h-5" style={{ color: "#3D2B1F" }} />
                </div>
                <div>
                  <div className="font-medium" style={{ fontSize: "15px" }}>WhatsApp Order</div>
                  <div className="text-sm" style={{ color: "hsl(25 10% 46%)" }}>Fastest replies · {phone_display}</div>
                  <div className="text-xs mt-0.5" style={{ color: "#C9964A" }}>Usually faster on WhatsApp</div>
                </div>
              </a>

              <a
                href={`tel:${phone}`}
                className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-[#e5e0d8] hover:shadow-md transition-shadow duration-300"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "#FAF7F4" }}>
                  <Phone className="w-5 h-5" style={{ color: "#3D2B1F" }} />
                </div>
                <div>
                  <div className="font-medium" style={{ fontSize: "15px" }}>Phone</div>
                  <div className="text-sm" style={{ color: "hsl(25 10% 46%)" }}>{phone_display}</div>
                </div>
              </a>

              <a
                href={`https://instagram.com/${encodeURIComponent(instagram.replace(/^@/, ""))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-[#e5e0d8] hover:shadow-md transition-shadow duration-300"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "#FAF7F4" }}>
                  <Instagram className="w-5 h-5" style={{ color: "#3D2B1F" }} />
                </div>
                <div>
                  <div className="font-medium" style={{ fontSize: "15px" }}>Instagram DM</div>
                  <div className="text-sm" style={{ color: "hsl(25 10% 46%)" }}>@{instagram} · daily updates</div>
                </div>
              </a>

              <a
                href={`mailto:${encodeURIComponent(email)}`}
                className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-[#e5e0d8] hover:shadow-md transition-shadow duration-300"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "#FAF7F4" }}>
                  <Mail className="w-5 h-5" style={{ color: "#3D2B1F" }} />
                </div>
                <div>
                  <div className="font-medium" style={{ fontSize: "15px" }}>Email</div>
                  <div className="text-sm" style={{ color: "hsl(25 10% 46%)" }}>{email}</div>
                </div>
              </a>
            </div>
          </div>

          {/* Right - Form */}
          <div>
            {/* Response time badge */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6"
              style={{ background: "#EAF3DE", color: "#27500A", fontSize: "12px", fontWeight: 500 }}
            >
              ⚡ We respond within 24 hours
            </div>

            {success ? (
              /* Success state */
              <div className="bg-white rounded-2xl p-12 border border-[#e5e0d8] text-center">
                <div
                  className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-5"
                  style={{ background: "#EAF3DE" }}
                >
                  <Check className="w-8 h-8" style={{ color: "#27500A" }} />
                </div>
                <h3 className="font-display text-2xl mb-2" style={{ fontWeight: 400 }}>
                  We'll be in touch within 24 hours!
                </h3>
                <p className="text-sm" style={{ color: "hsl(25 10% 46%)" }}>
                  Thank you for reaching out. We're excited to create something special for you.
                </p>
              </div>
            ) : (
              <form
                onSubmit={onSubmit}
                className="bg-white rounded-2xl p-8 border border-[#e5e0d8] space-y-5"
              >
                <h3 className="font-display text-2xl mb-1" style={{ fontWeight: 400 }}>Inquiry Form</h3>
                <p className="text-sm mb-6" style={{ color: "hsl(25 10% 46%)" }}>Tell us about your custom dream.</p>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: "hsl(25 10% 46%)" }}>Name</label>
                    <input required name="name" maxLength={80} autoComplete="name" className="w-full px-4 py-3 rounded-xl bg-[#FAF7F4] border border-[#e5e0d8] focus:border-[#C9964A] outline-none transition" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: "hsl(25 10% 46%)" }}>Phone</label>
                    <input required type="tel" name="phone" maxLength={20} autoComplete="tel" placeholder="+91 98765 43210" className="w-full px-4 py-3 rounded-xl bg-[#FAF7F4] border border-[#e5e0d8] focus:border-[#C9964A] outline-none transition" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: "hsl(25 10% 46%)" }}>Email</label>
                  <input required type="email" name="email" maxLength={120} autoComplete="email" className="w-full px-4 py-3 rounded-xl bg-[#FAF7F4] border border-[#e5e0d8] focus:border-[#C9964A] outline-none transition" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: "hsl(25 10% 46%)" }}>Product Type</label>
                  <select name="product" className="w-full px-4 py-3 rounded-xl bg-[#FAF7F4] border border-[#e5e0d8] focus:border-[#C9964A] outline-none transition">
                    <option value="">Select a product type…</option>
                    {productTypes.map((pt) => (
                      <option key={pt} value={pt}>{pt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: "hsl(25 10% 46%)" }}>Your Idea</label>
                  <textarea required name="idea" rows={4} maxLength={1000} className="w-full px-4 py-3 rounded-xl bg-[#FAF7F4] border border-[#e5e0d8] focus:border-[#C9964A] outline-none transition resize-none" placeholder="Describe the moment, names, colors..." />
                </div>
                <button
                  disabled={sending}
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-3 py-3.5 rounded-full disabled:opacity-60 transition-colors"
                  style={{ background: "#3D2B1F", color: "#FAF7F4", fontSize: "13px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}
                >
                  {sending ? "Sending..." : <><span>Send Inquiry</span> <Send className="w-4 h-4" /></>}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-20" style={{ background: "#FAF7F4" }}>
        <div className="max-w-[1280px] mx-auto px-8">
          <h2 className="font-display text-center mb-10" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)", fontWeight: 300 }}>
            Frequently Asked Questions
          </h2>
          <div ref={faqRef} className="scroll-reveal max-w-2xl mx-auto space-y-3">
            {faqItems.map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-[#e5e0d8] overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left"
                >
                  <span style={{ fontSize: "14px", fontWeight: 500 }}>{item.q}</span>
                  <ChevronDown
                    className="w-4 h-4 shrink-0 transition-transform duration-200"
                    style={{
                      transform: openFaq === i ? "rotate(180deg)" : "rotate(0deg)",
                      color: "#C9964A",
                    }}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4">
                    <p style={{ fontSize: "13px", color: "hsl(25 10% 46%)", lineHeight: 1.6 }}>
                      {item.a}
                    </p>
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
