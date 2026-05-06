import PageHeader from "@/components/site/PageHeader";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Truck, Globe, RotateCcw, ShieldCheck, Clock, Package, ArrowRight } from "lucide-react";

const cards = [
  { icon: Truck,       title: "Free Pan-India Shipping",  desc: "Every order ships free across India via insured premium courier partners with full tracking." },
  { icon: Globe,       title: "International Shipping",   desc: "We ship worldwide on request. Rates and timelines vary by destination. Get a quote on WhatsApp." },
  { icon: ShieldCheck, title: "Damage Guarantee",         desc: "If your piece arrives damaged, we replace it free of cost. Just send a photo within 48 hours of delivery." },
  { icon: RotateCcw,   title: "Returns Policy",           desc: "Custom & personalised pieces are non-returnable. Stock items can be returned within 7 days if unused." },
];

const timeline = [
  { icon: Package, step: "Order Confirmed", time: "Same day", desc: "You receive a WhatsApp confirmation and production begins immediately." },
  { icon: Clock,   step: "Production",      time: "7–21 days", desc: "7–10 days for most items; 14–21 days for wedding & bulk orders." },
  { icon: Truck,   step: "Dispatch",        time: "After production", desc: "Tracking link shared via WhatsApp & email once dispatched." },
  { icon: ShieldCheck, step: "Delivered",   time: "3–5 days (India)", desc: "Arrives in luxury champagne packaging, ready to gift." },
];

const ShippingPage = () => (
  <>
    <PageHeader
      eyebrow="Shipping & Returns"
      title={<>Delivered with <em className="not-italic text-gold-grad">care.</em></>}
      subtitle="Every Mohika Art piece is hand-packed in our signature champagne box, wrapped in tissue and tied with a satin ribbon — ready to gift the moment it arrives."
    />

    {/* Cards */}
    <section>
      <div className="container">
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          {cards.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="glass rounded-3xl p-8 md:p-10 shadow-soft hover:shadow-luxe transition-all duration-500 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <c.icon className="w-5 h-5 text-gold" />
              </div>
              <h3 className="font-display text-2xl mb-3">{c.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{c.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Timeline */}
    <section className="bg-blush/20">
      <div className="container max-w-4xl">
        <div className="eyebrow mb-5 text-center">From Order to Your Door</div>
        <h2
          className="font-display text-center leading-[1.04] tracking-[-0.02em] mb-14"
          style={{ fontWeight: 300, fontSize: "clamp(1.8rem, 3vw, 2.8rem)" }}
        >
          Your order's{" "}
          <em className="not-italic text-gold-grad" style={{ fontStyle: "italic", fontFamily: "var(--font-serif)" }}>
            journey.
          </em>
        </h2>
        <div className="grid md:grid-cols-4 gap-8 relative">
          {/* connector line */}
          <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-gold/20 via-gold/40 to-gold/20" />
          {timeline.map((t, i) => (
            <motion.div
              key={t.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-champagne/50 to-blush/30 flex items-center justify-center mx-auto mb-4 relative z-10">
                <t.icon className="w-6 h-6 text-foreground" strokeWidth={1.4} />
              </div>
              <div className="font-display text-base mb-1">{t.step}</div>
              <div className="text-[10px] uppercase tracking-wider text-gold mb-2">{t.time}</div>
              <p className="text-xs text-muted-foreground leading-relaxed">{t.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-14 text-center"
        >
          <p className="text-sm text-muted-foreground mb-5">Need help tracking your order?</p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-foreground text-background btn-glow text-sm tracking-[0.15em] uppercase"
          >
            Track or Ask About an Order
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  </>
);

export default ShippingPage;
