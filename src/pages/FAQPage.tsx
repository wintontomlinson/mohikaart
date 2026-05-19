import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, MessageCircle, Mail } from "lucide-react";
import { useStoreSettings } from "@/lib/settings";
import { FAQ_GROUPS } from "@/lib/faq";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
};

// Map our FAQ_GROUPS labels into slightly more retail-friendly section names.
const SECTION_TITLES: Record<string, string> = {
  Ordering: "Ordering & Delivery",
  Customization: "Customization",
  Shipping: "Ordering & Delivery",
  "Care & Returns": "Care, Returns & Policies",
};

// Group FAQs into 4 broader sections — merging duplicates by display title.
const buildSections = () => {
  const map = new Map<string, { q: string; a: string }[]>();
  for (const g of FAQ_GROUPS) {
    const title = SECTION_TITLES[g.label] ?? g.label;
    const list = map.get(title) ?? [];
    list.push(...g.faqs);
    map.set(title, list);
  }
  return Array.from(map.entries()).map(([title, items]) => ({ title, items }));
};

const SECTIONS = buildSections();

const FAQPage = () => {
  const { phone, email } = useStoreSettings();
  const [open, setOpen] = useState<string | null>("0-0");
  const phoneDigits = phone.replace(/\D/g, "");

  return (
    <>
      {/* HERO */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, #FAF7F4 0%, rgba(250,247,244,0.6) 60%, transparent 100%)",
        }}
      >
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 pt-28 pb-16 md:pt-36 md:pb-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-semibold uppercase mb-6"
            style={{
              fontSize: "11px",
              color: "#C9964A",
              letterSpacing: "0.25em",
            }}
          >
            Help Center
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="font-display mx-auto"
            style={{
              fontWeight: 400,
              fontSize: "clamp(2.5rem, 5vw, 3.8rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              color: "#3D2B1F",
              maxWidth: "16ch",
            }}
          >
            Questions{" "}
            <em
              className="font-serif italic"
              style={{ color: "#C9964A", fontWeight: 400 }}
            >
              answered.
            </em>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-6 mx-auto"
            style={{
              fontSize: "16px",
              lineHeight: 1.75,
              color: "hsl(25 10% 42%)",
              maxWidth: "52ch",
            }}
          >
            Everything you might want to know about ordering, customizing, caring for and
            returning your Mohika keepsake — in one place.
          </motion.p>
        </div>
      </section>

      {/* GROUPED ACCORDION */}
      <section className="max-w-3xl mx-auto px-6 lg:px-8 py-20">
        <div className="space-y-14">
          {SECTIONS.map((section, gi) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: gi * 0.06 }}
            >
              <h2
                className="font-display mb-7"
                style={{
                  fontWeight: 400,
                  fontSize: "clamp(1.4rem, 2.6vw, 1.8rem)",
                  letterSpacing: "-0.02em",
                  color: "#3D2B1F",
                  lineHeight: 1.15,
                }}
              >
                {section.title}
              </h2>

              <div className="space-y-3">
                {section.items.map((f, i) => {
                  const id = `${gi}-${i}`;
                  const isOpen = open === id;
                  return (
                    <div
                      key={id}
                      style={{
                        background: "#ffffff",
                        border: "1px solid #e5e0d8",
                        borderRadius: "16px",
                        overflow: "hidden",
                      }}
                    >
                      <button
                        onClick={() => setOpen(isOpen ? null : id)}
                        aria-expanded={isOpen}
                        className="w-full flex justify-between items-center px-6 py-4 text-left"
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          color: "#3D2B1F",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        <span>{f.q}</span>
                        <motion.span
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                          className="shrink-0 ml-4"
                        >
                          <ChevronDown
                            strokeWidth={1.8}
                            style={{ width: 18, height: 18, color: "#C9964A" }}
                          />
                        </motion.span>
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            key="content"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{
                              duration: 0.32,
                              ease: [0.22, 1, 0.36, 1],
                            }}
                            style={{ overflow: "hidden" }}
                          >
                            <div
                              className="px-6 pb-4"
                              style={{
                                fontSize: "13px",
                                color: "#6B7280",
                                lineHeight: 1.7,
                              }}
                            >
                              {f.a}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* STILL NEED HELP */}
      <section style={{ background: "#FAF7F4" }}>
        <div className="max-w-3xl mx-auto px-6 lg:px-8 py-20">
          <motion.div
            {...fadeUp}
            className="text-center p-10 md:p-12"
            style={{
              background: "#ffffff",
              border: "1px solid #e5e0d8",
              borderRadius: "24px",
              boxShadow: "0 20px 60px -20px rgba(0,0,0,0.06)",
            }}
          >
            <div
              className="font-semibold uppercase mb-4"
              style={{
                fontSize: "11px",
                color: "#C9964A",
                letterSpacing: "0.25em",
              }}
            >
              Still need help?
            </div>
            <h3
              className="font-display mx-auto"
              style={{
                fontWeight: 400,
                fontSize: "clamp(1.5rem, 3vw, 2rem)",
                letterSpacing: "-0.02em",
                color: "#3D2B1F",
                lineHeight: 1.2,
                maxWidth: "20ch",
              }}
            >
              We&apos;re a quick message away.
            </h3>
            <p
              className="mt-4 mx-auto"
              style={{
                fontSize: "14px",
                lineHeight: 1.7,
                color: "#6B7280",
                maxWidth: "44ch",
              }}
            >
              Mohika personally responds within 24 hours, often much sooner on WhatsApp.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={`https://wa.me/${phoneDigits}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 transition-all duration-500"
                style={{
                  height: "48px",
                  padding: "0 24px",
                  borderRadius: "9999px",
                  background: "#3D2B1F",
                  color: "#FAF7F4",
                  fontSize: "13px",
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                <MessageCircle style={{ width: 14, height: 14 }} />
                WhatsApp Us
              </a>
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center justify-center gap-2 transition-all duration-500"
                style={{
                  height: "48px",
                  padding: "0 24px",
                  borderRadius: "9999px",
                  background: "transparent",
                  color: "#3D2B1F",
                  border: "1px solid #e5e0d8",
                  fontSize: "13px",
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                <Mail style={{ width: 14, height: 14 }} />
                Email Us
              </a>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 transition-all duration-500"
                style={{
                  height: "48px",
                  padding: "0 24px",
                  borderRadius: "9999px",
                  background: "#FAF7F4",
                  color: "#3D2B1F",
                  border: "1px solid #e5e0d8",
                  fontSize: "13px",
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                Send Inquiry
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default FAQPage;
