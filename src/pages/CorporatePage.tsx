import PageHeader from "@/components/site/PageHeader";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Briefcase, Award, Users, Package, ArrowRight, CheckCircle, Mail, MessageCircle } from "lucide-react";

const features = [
  { icon: Briefcase, title: "Branded Corporate Gifts",  desc: "Logo-embedded resin paperweights, desk accessories and pen holders for client gifting & onboarding hampers." },
  { icon: Award,     title: "Awards & Recognition",     desc: "Custom award trophies, employee milestones and recognition plaques cast in premium resin with gold inlay." },
  { icon: Users,     title: "Bulk Event Favors",        desc: "Conference giveaways, return gifts, and team event souvenirs. Minimum order from 25 pieces." },
  { icon: Package,   title: "Luxury Gift Hampers",      desc: "Curated festive hampers: Diwali, New Year, Onboarding kits — packaged in our signature champagne boxes." },
];

const clients = [
  "Tech Startups", "FMCG Brands", "Wedding Planners", "Event Agencies",
  "Real Estate Firms", "Finance Companies", "Healthcare Brands", "D2C Labels",
];

const benefits = [
  "Custom branding with logo engraving",
  "Dedicated account manager",
  "Design mockup before production",
  "Pan-India bulk delivery",
  "Flexible payment terms",
  "Volume discounts from 25 pieces",
];

const CorporatePage = () => (
  <>
    <PageHeader
      eyebrow="Corporate & Bulk Orders"
      title={<>Gifts that <em className="not-italic text-gold-grad">say it</em> beautifully.</>}
      subtitle="From branded paperweights to bespoke awards and festive hampers. We partner with brands that care about thoughtful gifting."
    >
      <Link
        to="/contact"
        className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-foreground text-background btn-glow text-sm tracking-[0.15em] uppercase"
      >
        Request a Quote
        <ArrowRight className="w-4 h-4" />
      </Link>
    </PageHeader>

    {/* Features grid */}
    <section>
      <div className="container">
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="glass rounded-3xl p-8 md:p-10 shadow-soft hover:shadow-luxe transition-all duration-500 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <f.icon className="w-5 h-5 text-gold" />
              </div>
              <h3 className="font-display text-2xl mb-3">{f.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Stats strip */}
    <section className="bg-foreground text-background">
      <div className="container grid md:grid-cols-3 gap-10 text-center">
        {[
          { value: "25+",   label: "Minimum Order" },
          { value: "14d",   label: "Avg Turnaround" },
          { value: "50+",   label: "Brands Served" },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="font-display text-5xl text-gold-grad mb-2" style={{ fontWeight: 300 }}>{s.value}</div>
            <div className="text-xs uppercase tracking-[0.25em] text-background/60">{s.label}</div>
          </motion.div>
        ))}
      </div>
    </section>

    {/* Benefits + clients */}
    <section>
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-14">
          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="eyebrow mb-5">What You Get</div>
            <h2
              className="font-display leading-[1.04] tracking-[-0.02em] mb-8"
              style={{ fontWeight: 300, fontSize: "clamp(1.8rem, 3vw, 2.8rem)" }}
            >
              Everything your brand{" "}
              <em className="not-italic text-gold-grad" style={{ fontStyle: "italic", fontFamily: "var(--font-serif)" }}>
                deserves.
              </em>
            </h2>
            <ul className="space-y-3.5">
              {benefits.map((b, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: 14 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="flex items-center gap-3 text-sm"
                >
                  <CheckCircle className="w-4 h-4 text-gold shrink-0" />
                  <span>{b}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Who we work with */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="eyebrow mb-5">Who We Work With</div>
            <h2
              className="font-display leading-[1.04] tracking-[-0.02em] mb-8"
              style={{ fontWeight: 300, fontSize: "clamp(1.8rem, 3vw, 2.8rem)" }}
            >
              Brands that care about{" "}
              <em className="not-italic text-gold-grad" style={{ fontStyle: "italic", fontFamily: "var(--font-serif)" }}>
                gifting right.
              </em>
            </h2>
            <div className="flex flex-wrap gap-2.5 mb-10">
              {clients.map((c) => (
                <span key={c} className="px-4 py-2 rounded-full glass text-xs tracking-[0.08em] uppercase">
                  {c}
                </span>
              ))}
            </div>
            {/* Contact options */}
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="https://wa.me/919999999999"
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-background text-xs tracking-[0.1em] uppercase btn-glow"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp Us
              </a>
              <a
                href="mailto:hello@mohikaart.com"
                className="flex items-center gap-2 px-6 py-3 rounded-full glass border border-foreground/12 text-xs tracking-[0.1em] uppercase hover:bg-foreground hover:text-background transition-all duration-400"
              >
                <Mail className="w-4 h-4" />
                Email Quote
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  </>
);

export default CorporatePage;
