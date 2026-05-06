import PageHeader from "@/components/site/PageHeader";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqGroups = [
  {
    label: "Ordering",
    faqs: [
      {
        q: "How long does a custom order take?",
        a: "Most pieces are ready in 7–10 days. Wedding bouquet preservation and large bulk orders take 14–21 days. We'll share an exact ETA before confirming your order.",
      },
      {
        q: "Can I see a preview before final pour?",
        a: "Yes, for custom orders above ₹2,000 we share a layout mockup and color palette for your approval before pouring.",
      },
      {
        q: "What payment methods do you accept?",
        a: "We accept UPI, bank transfer, all major credit/debit cards, and net banking. For custom orders, a 50% advance is required to begin work.",
      },
    ],
  },
  {
    label: "Customization",
    faqs: [
      {
        q: "Can I send my own flowers or photos?",
        a: "Absolutely. That's the heart of what we do. Ship us your dried flowers, printed photos or keepsakes via courier and we'll incorporate them into the design.",
      },
      {
        q: "What can be embedded in resin?",
        a: "Almost anything flat or small: dried flowers, photos, fabric swatches, coins, leaves, letters, hair, feathers — if it matters to you, we'll find a way.",
      },
    ],
  },
  {
    label: "Shipping",
    faqs: [
      {
        q: "Do you ship across India?",
        a: "Yes, pan-India shipping is free on every order. We use insured premium courier partners with tracking, and orders typically arrive within 3–5 business days after dispatch.",
      },
      {
        q: "Do you ship internationally?",
        a: "Yes, we ship worldwide on request. Rates and customs duties vary by country. Please contact us on WhatsApp for a quote.",
      },
    ],
  },
  {
    label: "Care & Returns",
    faqs: [
      {
        q: "Are returns allowed?",
        a: "Custom and personalised pieces are non-returnable since they're made-to-order. If your piece arrives damaged, we replace it free of cost. See our Shipping & Returns page.",
      },
      {
        q: "Is the resin safe?",
        a: "Yes. We use premium epoxy resin that's fully cured before shipping. The surface is food-safe, non-toxic and skin-friendly. Avoid hot liquids directly on the surface.",
      },
    ],
  },
];

const FAQPage = () => (
  <>
    <PageHeader
      eyebrow="Frequently Asked"
      title={<>Everything you <em className="not-italic text-gold-grad">need to know.</em></>}
      subtitle="Quick answers about ordering, shipping, customisation and care. Still curious? Reach out on WhatsApp anytime."
    />

    <section>
      <div className="container max-w-3xl">
        <div className="space-y-10">
          {faqGroups.map((group, gi) => (
            <motion.div
              key={group.label}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: gi * 0.08, duration: 0.5 }}
            >
              <div className="eyebrow mb-5">{group.label}</div>
              <Accordion type="single" collapsible className="w-full space-y-3">
                {group.faqs.map((f, i) => (
                  <AccordionItem
                    key={i}
                    value={`${gi}-${i}`}
                    className="glass rounded-2xl px-6 border-0 shadow-soft"
                  >
                    <AccordionTrigger className="font-serif text-lg md:text-xl text-left hover:no-underline py-5">
                      {f.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                      {f.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16 frost-card rounded-3xl p-10"
        >
          <div className="w-12 h-12 rounded-full bg-gold/12 flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-5 h-5 text-gold" />
          </div>
          <p className="font-serif text-xl mb-2">Still have questions?</p>
          <p className="text-muted-foreground text-sm mb-6">We usually reply in under 2 hours on WhatsApp.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://wa.me/919999999999"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-foreground text-background btn-glow text-xs tracking-[0.15em] uppercase"
            >
              <MessageCircle className="w-4 h-4" />
              Chat on WhatsApp
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full glass border border-foreground/15 text-xs tracking-[0.15em] uppercase hover:bg-foreground hover:text-background transition-all duration-400"
            >
              Send Us a Message
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  </>
);

export default FAQPage;
