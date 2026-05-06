import PageHeader from "@/components/site/PageHeader";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Sparkles, Gift, Camera, Star, ArrowRight, CheckCircle } from "lucide-react";
import wedding from "@/assets/cat-wedding.jpg";
import couple from "@/assets/cat-couple.jpg";

const offerings = [
  { icon: Heart,    title: "Bridal Bouquet Preservation", desc: "Preserve your bridal bouquet flowers in a luxurious resin block, frame or paperweight — a forever memory of your special day." },
  { icon: Sparkles, title: "Wedding Invite Keepsakes",    desc: "Encase your wedding card, ring shots, or vow excerpts in a gallery-worthy resin display for your home." },
  { icon: Gift,     title: "Bridesmaid & Groomsmen Gifts", desc: "Personalised resin keychains, name tags & coasters — thoughtful tokens for your entire wedding party." },
  { icon: Camera,   title: "Photo & Date Memory Frames",  desc: "Your favourite moment, the wedding date, GPS coordinates of your venue — sealed in clear resin elegance." },
];

const process = [
  "Send us your bouquet within 48 hours of the wedding",
  "We gently dry and press every petal",
  "Design mockup shared for your approval",
  "Handcrafted over 14–21 days",
  "Delivered in luxury champagne packaging",
];

const WeddingPage = () => (
  <>
    <PageHeader
      eyebrow="Wedding Collection"
      title={<>Forever begins with a <em className="not-italic text-gold-grad">memory.</em></>}
      subtitle="From bridal bouquet preservation to bespoke invitation keepsakes. We craft heirlooms that hold your wedding day in light, color, and time."
    >
      <Link
        to="/contact"
        className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-foreground text-background btn-glow text-sm tracking-[0.15em] uppercase"
      >
        Plan Your Keepsake
        <ArrowRight className="w-4 h-4" />
      </Link>
    </PageHeader>

    {/* Offerings grid */}
    <section>
      <div className="container">
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {offerings.map((o, i) => (
            <motion.div
              key={o.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="glass rounded-3xl p-8 md:p-10 shadow-soft hover:shadow-luxe transition-all duration-500 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <o.icon className="w-5 h-5 text-gold" />
              </div>
              <h3 className="font-display text-2xl mb-3">{o.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{o.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Image + process section */}
    <section className="bg-blush/20">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Images collage */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="relative h-[420px] md:h-[520px]"
          >
            <div className="absolute top-0 left-0 w-[68%] h-[75%] rounded-[2rem] overflow-hidden shadow-luxe">
              <img src={wedding} alt="Wedding keepsake" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent" />
            </div>
            <div className="absolute bottom-0 right-0 w-[58%] h-[55%] rounded-[2rem] overflow-hidden shadow-card border-4 border-background">
              <img src={couple} alt="Couple frame" className="w-full h-full object-cover" />
            </div>
            {/* Badge */}
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, type: "spring" }}
              className="absolute top-[38%] -right-4 glass rounded-2xl px-4 py-3 shadow-card border border-gold/20 z-10 animate-float"
            >
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-3 h-3" style={{ fill: "hsl(34 58% 52%)", color: "hsl(34 58% 52%)" }} />
                  ))}
                </div>
                <div className="text-[10px] font-semibold">4.9/5</div>
              </div>
              <div className="text-[9px] text-muted-foreground mt-0.5 uppercase tracking-wider">Wedding Reviews</div>
            </motion.div>
          </motion.div>

          {/* Process */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
          >
            <div className="eyebrow mb-5">The Process</div>
            <h2
              className="font-display leading-[1.04] tracking-[-0.02em] mb-6"
              style={{ fontWeight: 300, fontSize: "clamp(1.8rem, 3vw, 2.8rem)" }}
            >
              Three weeks.{" "}
              <em className="not-italic text-gold-grad" style={{ fontStyle: "italic", fontFamily: "var(--font-serif)" }}>
                One forever.
              </em>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Send us your bouquet within 48 hours of your wedding. We dry, press, and pour over 21 days,
              finishing each piece by hand with gold leaf, your names, or the date you said yes.
            </p>
            <ul className="space-y-3.5 mb-10">
              {process.map((step, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: 14 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                  className="flex items-center gap-3 text-sm"
                >
                  <CheckCircle className="w-4 h-4 text-gold shrink-0" />
                  <span>{step}</span>
                </motion.li>
              ))}
            </ul>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-foreground/30 hover:bg-foreground hover:text-background transition-all duration-500 text-sm tracking-[0.15em] uppercase"
            >
              Start Your Order
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  </>
);

export default WeddingPage;
