import { useState } from "react";
import { Link } from "react-router-dom";
import { Palette, MessageCircle, Package, Check } from "lucide-react";
import { toast } from "sonner";

const CustomOrder = () => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    productType: "",
    occasion: "",
    details: "",
    budget: "",
    deliveryDate: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success("Custom order request sent!");
  };

  if (submitted) {
    return (
      <div className="pt-24 pb-20 min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4 animate-in zoom-in-95">
          <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-serif text-[#1a1208]">Request Received!</h2>
          <p className="text-[#1a1208]/60">We'll reply within 24 hours</p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-[#1a1208] text-[#fdf9f0] text-sm font-medium rounded-full mt-4"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="text-sm text-[#1a1208]/40 mb-8">
          <Link to="/" className="hover:text-[#c9a84c]">Home</Link> &gt; <span className="text-[#1a1208]">Custom Order</span>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif text-[#1a1208] mb-3">Create Your Dream Piece</h1>
          <p className="text-lg text-[#1a1208]/60">Tell us your idea — we'll craft it just for you</p>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 md:p-10 shadow-sm space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-[#1a1208] mb-1.5">Your Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-[#1a1208]/10 rounded-xl text-sm focus:outline-none focus:border-[#c9a84c]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1a1208] mb-1.5">Phone Number</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-[#1a1208]/10 rounded-xl text-sm focus:outline-none focus:border-[#c9a84c]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1a1208] mb-1.5">Email Address</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-[#1a1208]/10 rounded-xl text-sm focus:outline-none focus:border-[#c9a84c]"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-[#1a1208] mb-1.5">Product Type</label>
                <select
                  name="productType"
                  value={form.productType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-[#1a1208]/10 rounded-xl text-sm focus:outline-none focus:border-[#c9a84c] bg-white"
                >
                  <option value="">Select...</option>
                  <option>Name Keychain</option>
                  <option>Photo Frame</option>
                  <option>Resin Tray</option>
                  <option>Wedding Keepsake</option>
                  <option>Coaster Set</option>
                  <option>Bookmark</option>
                  <option>Gift Hamper</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1a1208] mb-1.5">Occasion</label>
                <select
                  name="occasion"
                  value={form.occasion}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[#1a1208]/10 rounded-xl text-sm focus:outline-none focus:border-[#c9a84c] bg-white"
                >
                  <option value="">Select...</option>
                  <option>Birthday</option>
                  <option>Wedding</option>
                  <option>Anniversary</option>
                  <option>Corporate Gift</option>
                  <option>Just Because</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1a1208] mb-1.5">Customization Details</label>
              <textarea
                name="details"
                value={form.details}
                onChange={handleChange}
                placeholder="Describe your idea — names, colors, size, special message, references..."
                required
                className="w-full px-4 py-3 border border-[#1a1208]/10 rounded-xl text-sm focus:outline-none focus:border-[#c9a84c] resize-none h-28"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1a1208] mb-2">Budget Range</label>
              <div className="flex flex-wrap gap-3">
                {["Under ₹500", "₹500–₹1,500", "₹1,500–₹3,000", "₹3,000+"].map((b) => (
                  <label
                    key={b}
                    className={`px-4 py-2 text-xs font-medium rounded-full border cursor-pointer transition-colors ${
                      form.budget === b
                        ? "bg-[#1a1208] text-[#fdf9f0] border-[#1a1208]"
                        : "border-[#1a1208]/10 text-[#1a1208]/70 hover:border-[#c9a84c]"
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

            <div>
              <label className="block text-sm font-medium text-[#1a1208] mb-1.5">Preferred Delivery Date (optional)</label>
              <input
                name="deliveryDate"
                type="date"
                value={form.deliveryDate}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-[#1a1208]/10 rounded-xl text-sm focus:outline-none focus:border-[#c9a84c]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#1a1208] text-[#fdf9f0] text-sm font-semibold tracking-wider rounded-full hover:bg-[#1a1208]/90 transition-colors mt-4"
            >
              Send My Request &rarr;
            </button>
          </form>

          {/* Why Custom Order */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            {[
              { icon: Palette, title: "Fully Personalized", desc: "Every piece designed to your vision" },
              { icon: MessageCircle, title: "Direct Communication", desc: "Chat with us throughout the process" },
              { icon: Package, title: "Premium Packaging", desc: "Gift-ready luxury packaging included" },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center p-6 bg-white rounded-2xl shadow-sm">
                <div className="w-12 h-12 mx-auto bg-[#c9a84c]/10 rounded-xl flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-[#c9a84c]" />
                </div>
                <h3 className="font-medium text-[#1a1208] text-sm mb-1">{title}</h3>
                <p className="text-xs text-[#1a1208]/50">{desc}</p>
              </div>
            ))}
          </div>

          {/* WhatsApp */}
          <div className="text-center mt-12 p-8 bg-green-50 rounded-2xl">
            <p className="text-[#1a1208]/70 mb-3">Prefer to chat directly?</p>
            <a
              href="https://wa.me/919999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white text-sm font-medium rounded-full hover:bg-green-600 transition-colors"
            >
              <MessageCircle className="w-4 h-4" /> Chat on WhatsApp &rarr;
            </a>
          </div>

          {/* Timeline */}
          <div className="mt-16">
            <h2 className="text-2xl font-serif text-[#1a1208] text-center mb-8">How Custom Orders Work</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["Fill Form", "Design Approval", "We Craft", "Delivered"].map((step, i) => (
                <div key={step} className="text-center">
                  <div className="w-10 h-10 mx-auto bg-[#c9a84c] text-white rounded-full flex items-center justify-center text-sm font-bold mb-3">
                    {i + 1}
                  </div>
                  <p className="text-sm font-medium text-[#1a1208]">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomOrder;
