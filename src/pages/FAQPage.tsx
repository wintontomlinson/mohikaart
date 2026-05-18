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
import { useStoreSettings } from "@/lib/settings";
import { FAQ_GROUPS } from "@/lib/faq";

const FAQPage = () => {
  const { phone } = useStoreSettings();
  return (
  <>
    <PageHeader
      eyebrow="Frequently Asked"
      title={<>Everything you <em className="not-italic text-gold-grad">need to know.</em></>}
      subtitle="Quick answers about ordering, shipping, customisation and care. Still curious? Reach out on WhatsApp anytime."
    />

    <section>
      <div className="container max-w-3xl">
        <div className="space-y-10">
          {FAQ_GROUPS.map((group, gi) => (
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
              href={`https://wa.me/${phone}`}
              target="_blank"
              rel="noopener noreferrer"
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
};

export default FAQPage;
