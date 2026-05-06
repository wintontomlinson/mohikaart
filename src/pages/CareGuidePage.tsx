import PageHeader from "@/components/site/PageHeader";
import { motion } from "framer-motion";
import { Sun, Droplets, Sparkles, ShieldAlert, ThumbsUp, Clock } from "lucide-react";

const tips = [
  { icon: Sun,        title: "Avoid Direct Sunlight",  desc: "Long exposure to direct sun may slowly yellow the resin. Display indoors or in shaded, well-lit spots." },
  { icon: Droplets,   title: "Keep Dry",               desc: "Resin is water-resistant but not waterproof. Wipe with a soft, dry cloth. Never submerge in water." },
  { icon: Sparkles,   title: "Clean with Care",        desc: "Use a microfiber cloth. For stubborn marks, a drop of mild soap on a damp cloth is enough." },
  { icon: ShieldAlert,title: "Handle with Love",       desc: "Resin is durable but not unbreakable. Avoid drops and keep away from sharp impact or corners." },
  { icon: ThumbsUp,   title: "Display Proudly",        desc: "Your piece is UV-coated and scratch-resistant. It's made to be admired, touched, and gifted." },
  { icon: Clock,      title: "Long-Lasting Beauty",    desc: "With basic care, your Mohika Art piece will remain gallery-worthy for decades to come." },
];

const facts = [
  {
    title: "Tiny bubbles are natural.",
    desc: "Each piece is poured by hand; small inclusions are part of the charm — not a defect.",
  },
  {
    title: "Color may vary slightly.",
    desc: "Real flowers, dried petals, and natural pigments shift gently between batches — making each piece truly one-of-a-kind.",
  },
  {
    title: "Cured & food-safe surface.",
    desc: "Our resin is fully cured before shipping, safe to touch, but not recommended for hot drinks directly on the surface.",
  },
  {
    title: "Heat-sensitive.",
    desc: "Avoid leaving your piece in hot cars or near heat sources for extended periods. Store in room temperature.",
  },
];

const CareGuidePage = () => (
  <>
    <PageHeader
      eyebrow="Care Guide"
      title={<>Keep your keepsake <em className="not-italic text-gold-grad">timeless.</em></>}
      subtitle="A few gentle habits will keep your Mohika Art piece looking gallery-worthy for decades. Here's everything you need to know."
    />

    {/* Tips grid */}
    <section>
      <div className="container">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {tips.map((t, i) => (
            <motion.div
              key={t.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.07 }}
              className="glass rounded-3xl p-8 shadow-soft hover:shadow-luxe transition-all duration-500 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <t.icon className="w-5 h-5 text-gold" />
              </div>
              <h3 className="font-display text-xl mb-3">{t.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">{t.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Fun facts */}
    <section className="bg-blush/20">
      <div className="container max-w-3xl">
        <div className="eyebrow mb-5">Good to Know</div>
        <h2
          className="font-display leading-[1.04] mb-10"
          style={{ fontWeight: 300, fontSize: "clamp(1.8rem, 3vw, 2.8rem)" }}
        >
          A few things about{" "}
          <em className="not-italic text-gold-grad" style={{ fontStyle: "italic", fontFamily: "var(--font-serif)" }}>
            handmade resin.
          </em>
        </h2>
        <div className="space-y-5">
          {facts.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="frost-card rounded-2xl p-6"
            >
              <strong className="text-foreground font-semibold block mb-1">{f.title}</strong>
              <p className="text-muted-foreground leading-relaxed text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </>
);

export default CareGuidePage;
