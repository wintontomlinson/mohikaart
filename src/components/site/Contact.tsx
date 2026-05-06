import { motion } from "framer-motion";
import { useState } from "react";
import { MessageCircle, Instagram, Mail, Send } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Contact = () => {
  const [sending, setSending] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    const fd = new FormData(e.target as HTMLFormElement);
    const { error } = await supabase.from("inquiries").insert({
      name: (fd.get("name") as string).trim(),
      phone: (fd.get("phone") as string).trim(),
      email: (fd.get("email") as string).trim(),
      product: (fd.get("product") as string) || null,
      idea: (fd.get("idea") as string).trim(),
    });
    setSending(false);
    if (error) {
      toast.error("Something went wrong. Please try again.");
      return;
    }
    (e.target as HTMLFormElement).reset();
    toast.success("Inquiry received! Mohika will reply within 24 hours.");
  };

  return (
    <section id="contact" className="relative py-28 md:py-40">
      <div className="container grid lg:grid-cols-2 gap-16 items-start">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-xs tracking-[0.3em] uppercase text-gold mb-5">Let's Create</div>
          <h2 className="font-display text-4xl md:text-6xl leading-tight">
            Let's craft something <em className="not-italic text-gold-grad">unforgettable.</em>
          </h2>
          <p className="mt-6 text-lg text-muted-foreground max-w-md">
            Share your idea, and we'll personally design a piece that captures
            your moment in resin.
          </p>

          <div className="mt-12 space-y-4">
            <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer" className="flex items-center gap-5 p-5 rounded-2xl glass hover:shadow-luxe transition-all duration-500 group">
              <div className="w-14 h-14 rounded-2xl bg-blush-grad flex items-center justify-center">
                <MessageCircle className="w-6 h-6" strokeWidth={1.5} />
              </div>
              <div>
                <div className="font-serif text-xl">WhatsApp Order</div>
                <div className="text-sm text-muted-foreground">Fastest replies · +91 99999 99999</div>
              </div>
              <span className="ml-auto text-2xl text-gold opacity-0 group-hover:opacity-100 transition">→</span>
            </a>
            <a href="https://instagram.com/mohikaart" target="_blank" rel="noopener noreferrer" className="flex items-center gap-5 p-5 rounded-2xl glass hover:shadow-luxe transition-all duration-500 group">
              <div className="w-14 h-14 rounded-2xl bg-blush-grad flex items-center justify-center">
                <Instagram className="w-6 h-6" strokeWidth={1.5} />
              </div>
              <div>
                <div className="font-serif text-xl">Instagram DM</div>
                <div className="text-sm text-muted-foreground">@mohikaart · daily updates</div>
              </div>
              <span className="ml-auto text-2xl text-gold opacity-0 group-hover:opacity-100 transition">→</span>
            </a>
            <a href="mailto:hello@mohikaart.com" className="flex items-center gap-5 p-5 rounded-2xl glass hover:shadow-luxe transition-all duration-500 group">
              <div className="w-14 h-14 rounded-2xl bg-blush-grad flex items-center justify-center">
                <Mail className="w-6 h-6" strokeWidth={1.5} />
              </div>
              <div>
                <div className="font-serif text-xl">Email</div>
                <div className="text-sm text-muted-foreground">hello@mohikaart.com</div>
              </div>
              <span className="ml-auto text-2xl text-gold opacity-0 group-hover:opacity-100 transition">→</span>
            </a>
          </div>
        </motion.div>

        <motion.form
          onSubmit={onSubmit}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass rounded-3xl p-8 md:p-12 shadow-luxe space-y-5"
        >
          <h3 className="font-display text-3xl mb-2">Inquiry Form</h3>
          <p className="text-sm text-muted-foreground mb-6">Tell us about your custom dream.</p>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-widest mb-2 text-muted-foreground">Name</label>
              <input required name="name" className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-gold outline-none transition" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest mb-2 text-muted-foreground">Phone</label>
              <input required name="phone" className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-gold outline-none transition" />
            </div>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest mb-2 text-muted-foreground">Email</label>
            <input required type="email" name="email" className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-gold outline-none transition" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest mb-2 text-muted-foreground">Product of Interest</label>
            <select name="product" className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-gold outline-none transition">
              <option>Name Keychain</option>
              <option>Photo Frame</option>
              <option>Wedding Keepsake</option>
              <option>Coaster Set</option>
              <option>Bookmark</option>
              <option>Custom Hamper</option>
              <option>Something Unique</option>
            </select>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest mb-2 text-muted-foreground">Your Idea</label>
            <textarea required name="idea" rows={4} className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-gold outline-none transition resize-none" placeholder="Describe the moment, names, colors..." />
          </div>
          <button
            disabled={sending}
            type="submit"
            className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-foreground text-background btn-glow disabled:opacity-60"
          >
            {sending ? "Sending..." : <>Send Inquiry <Send className="w-4 h-4" /></>}
          </button>
        </motion.form>
      </div>
    </section>
  );
};

export default Contact;
