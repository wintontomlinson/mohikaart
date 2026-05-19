import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useStoreSettings } from "@/lib/settings";
import { FAQ_GROUPS, type FaqItem } from "@/lib/faq";

/* Hand-pick 6-8 of the most-asked questions across the four
   primary groups. Order intentionally mixes groups so the user
   sees a representative sweep (Ordering, Customization, Shipping,
   Care) without having to dig. */
const HOMEPAGE_GROUP_ORDER = [
  "Ordering",
  "Customization",
  "Shipping",
  "Care & Returns",
];

const PICKS: FaqItem[] = HOMEPAGE_GROUP_ORDER.flatMap((label) => {
  const group = FAQ_GROUPS.find((g) => g.label === label);
  if (!group) return [] as FaqItem[];
  // Take the first 2 from each priority group, capping at 8 total below.
  return group.faqs.slice(0, 2);
}).slice(0, 8);

/* schema.org FAQPage structured data. We render it inline as a JSON-LD
   <script> on the homepage only - /faq intentionally does NOT also emit
   this so Google sees a single canonical FAQ entity for the brand. */
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: PICKS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: f.a,
    },
  })),
};

const HomepageFAQ = () => {
  const { phone } = useStoreSettings();

  return (
    <section
      id="faq"
      className="relative py-28 md:py-40"
      style={{
        background:
          "radial-gradient(ellipse 60% 60% at 50% 0%, hsl(38 62% 88% / 0.35), transparent), hsl(36 42% 98%)",
      }}
    >
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="container max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14 md:mb-16"
        >
          <div className="eyebrow mb-5">Frequently Asked</div>
          <h2
            className="font-display leading-[1.04] tracking-[-0.03em]"
            style={{ fontWeight: 300, fontSize: "clamp(2rem, 4vw, 3.6rem)" }}
          >
            Questions,{" "}
            <em
              className="not-italic text-gold-grad"
              style={{ fontStyle: "italic", fontFamily: "var(--font-serif)" }}
            >
              answered.
            </em>
          </h2>
        </motion.div>

        <Accordion type="single" collapsible className="space-y-3">
          {PICKS.map((f, i) => (
            <motion.div
              key={`${i}-${f.q}`}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
            >
              <AccordionItem
                value={`hp-${i}`}
                className="frost-card rounded-2xl px-6 border-0 shadow-soft"
              >
                <AccordionTrigger className="font-display text-lg md:text-xl text-left hover:no-underline py-5">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-12 flex justify-center"
        >
          <a
            href={`https://wa.me/${phone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-foreground text-background btn-glow btn-text"
          >
            <MessageCircle className="w-4 h-4" />
            Still have questions? Chat on WhatsApp
            <span aria-hidden="true">→</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default HomepageFAQ;
