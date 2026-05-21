import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock, Instagram, MessageCircle, ChevronDown, Check } from "lucide-react";
import { toast } from "sonner";

const faqs = [
  { q: "What is the delivery time?", a: "Most orders are delivered within 5-7 business days. Custom orders and wedding keepsakes may take 2-4 weeks depending on complexity." },
  { q: "Do you ship outside India?", a: "Currently we deliver Pan India only. We're working on international shipping and hope to launch it soon!" },
  { q: "Can I modify my order after placing it?", a: "Yes! You can modify your order within 24 hours of placing it. Just reach out via WhatsApp or email with your changes." },
  { q: "What's the custom order process?", a: "Fill out our custom order form or message us on WhatsApp. We'll discuss your idea, share a quote, get your approval on the design, craft it, and deliver it with premium packaging." },
  { q: "What if my product arrives damaged?", a: "We pack everything with utmost care, but if something arrives damaged, contact us within 48 hours with photos and we'll send a replacement or full refund." },
];

const ContactPage = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success("Message sent!");
  };

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-serif text-[#1a1208] mb-3">Get In Touch</h1>
          <p className="text-[#1a1208]/60 max-w-md mx-auto">
            Questions, custom orders, or just want to say hi!
          </p>
        </div>

        {/* Two Column */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left - Info Cards */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: MapPin, label: "Location", value: "Handcrafted in India" },
                { icon: Phone, label: "WhatsApp", value: "+91 XXXXXXXXXX", href: "https://wa.me/919999999999" },
                { icon: Mail, label: "Email", value: "hello@mohikaart.com", href: "mailto:hello@mohikaart.com" },
                { icon: Clock, label: "Response", value: "Within 24 hours" },
              ].map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="p-5 bg-white rounded-2xl shadow-sm">
                  <Icon className="w-5 h-5 text-[#c9a84c] mb-3" />
                  <p className="text-xs text-[#1a1208]/40 uppercase tracking-wider">{label}</p>
                  {href ? (
                    <a href={href} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-[#1a1208] hover:text-[#c9a84c]">
                      {value}
                    </a>
                  ) : (
                    <p className="text-sm font-medium text-[#1a1208]">{value}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Social */}
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com/mohikaart"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-[#c9a84c]/10 flex items-center justify-center hover:bg-[#c9a84c]/20 transition-colors"
              >
                <Instagram className="w-5 h-5 text-[#c9a84c]" />
              </a>
              <a
                href="https://wa.me/919999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center hover:bg-green-200 transition-colors"
              >
                <MessageCircle className="w-5 h-5 text-green-600" />
              </a>
              <a
                href="mailto:hello@mohikaart.com"
                className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center hover:bg-blue-200 transition-colors"
              >
                <Mail className="w-5 h-5 text-blue-600" />
              </a>
            </div>
          </div>

          {/* Right - Form */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm">
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-serif text-[#1a1208] mb-2">Message sent!</h3>
                <p className="text-[#1a1208]/60 text-sm">We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#1a1208] mb-1.5">Full Name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-[#1a1208]/10 rounded-xl text-sm focus:outline-none focus:border-[#c9a84c]"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1a1208] mb-1.5">Email</label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-[#1a1208]/10 rounded-xl text-sm focus:outline-none focus:border-[#c9a84c]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1a1208] mb-1.5">Phone (optional)</label>
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-[#1a1208]/10 rounded-xl text-sm focus:outline-none focus:border-[#c9a84c]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1a1208] mb-1.5">Subject</label>
                  <select
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-[#1a1208]/10 rounded-xl text-sm focus:outline-none focus:border-[#c9a84c] bg-white"
                  >
                    <option value="">Select a topic...</option>
                    <option>General Inquiry</option>
                    <option>Custom Order</option>
                    <option>Order Status</option>
                    <option>Return/Exchange</option>
                    <option>Collaboration</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1a1208] mb-1.5">Message</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-[#1a1208]/10 rounded-xl text-sm focus:outline-none focus:border-[#c9a84c] resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="group relative w-full py-3.5 bg-[#1a1208] text-[#fdf9f0] text-sm font-semibold tracking-wider rounded-full overflow-hidden hover:bg-[#1a1208]/90 transition-colors"
                >
                  <span className="relative z-10">Send Message &rarr;</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#c9a84c]/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-2xl font-serif text-[#1a1208] text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-[#1a1208]/5 rounded-xl overflow-hidden bg-white">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left"
                >
                  <span className="text-sm font-medium text-[#1a1208]">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-[#1a1208]/40 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 text-sm text-[#1a1208]/60 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* WhatsApp CTA */}
        <div className="mt-16 p-8 bg-green-50 rounded-3xl text-center">
          <p className="text-[#1a1208]/70 mb-3 text-lg">Prefer instant replies?</p>
          <a
            href="https://wa.me/919999999999"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white text-sm font-medium rounded-full hover:bg-green-600 transition-colors"
          >
            <MessageCircle className="w-4 h-4" /> Open WhatsApp Chat &rarr;
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
