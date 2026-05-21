import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { toast } from "sonner";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success("Subscribed successfully!");
      setEmail("");
    }
  };

  return (
    <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="bg-[#fdf9f0] border border-[#c9a84c]/10 rounded-3xl p-8 md:p-14 text-center max-w-2xl mx-auto shadow-sm">
        <h2 className="text-2xl md:text-3xl font-serif text-[#1a1208] mb-3">Stay in the loop</h2>
        <p className="text-[#1a1208]/60 mb-8">Get new launches & exclusive offers</p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-6">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 px-5 py-3 border border-[#1a1208]/10 rounded-full text-sm focus:outline-none focus:border-[#c9a84c] bg-white"
            required
          />
          <button
            type="submit"
            className="px-6 py-3 bg-[#1a1208] text-[#fdf9f0] text-sm font-semibold tracking-wider rounded-full hover:bg-[#1a1208]/85 transition-colors whitespace-nowrap"
          >
            Subscribe &rarr;
          </button>
        </form>

        <p className="text-xs text-[#1a1208]/40 mb-4">or</p>

        <a
          href="https://wa.me/919999999999"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white text-sm font-medium rounded-full hover:bg-green-600 transition-colors"
        >
          <MessageCircle className="w-4 h-4" /> Join on WhatsApp
        </a>
      </div>
    </section>
  );
};

export default Newsletter;
