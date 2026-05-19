import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, Handshake, PartyPopper, ArrowRight, Check } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
};

const useCases = [
  {
    icon: Users,
    title: "Employee Gifts",
    body: "Onboarding kits, milestones, festive hampers, branded keepsakes your team will keep at their desk.",
  },
  {
    icon: Handshake,
    title: "Client Appreciation",
    body: "Year-end gestures and partner gifts that say thank you with quiet luxury, not a logo on a mug.",
  },
  {
    icon: PartyPopper,
    title: "Event Souvenirs",
    body: "Conferences, launches, weddings, retreats, meaningful favors guests carry home and remember.",
  },
];

const tiers = [
  {
    qty: "25+",
    discount: "10% off",
    perks: ["Logo engraving included", "Standard packaging", "Pan-India delivery"],
  },
  {
    qty: "50+",
    discount: "15% off",
    perks: [
      "Custom packaging insert",
      "Dedicated design call",
      "Priority production",
    ],
    featured: true,
  },
  {
    qty: "100+",
    discount: "20% off",
    perks: [
      "White-glove account manager",
      "Bespoke gift box design",
      "Express dispatch",
    ],
  },
];

const brands = [
  "Tanishq",
  "Tata 1mg",
  "Zomato",
  "Marriott",
  "Lemon Tree",
  "ITC Hotels",
];

const CorporatePage = () => (
  <>
    {/* HERO */}
    <section
      className="relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #FAF7F4 0%, rgba(250,247,244,0.6) 60%, transparent 100%)",
      }}
    >
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 pt-28 pb-20 md:pt-36 md:pb-28 text-center">
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
          Corporate Gifts
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
            maxWidth: "22ch",
          }}
        >
          Branded keepsakes{" "}
          <em
            className="font-serif italic"
            style={{ color: "#C9964A", fontWeight: 400 }}
          >
            they&apos;ll actually keep.
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
            maxWidth: "56ch",
          }}
        >
          Resin keepsakes for employee gifting, client appreciation, and event souvenirs,
          bespoke from 25 pieces upward. Subtle branding, refined packaging, on-time delivery.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="mt-10"
        >
          <Link
            to="/contact?type=corporate"
            className="inline-flex items-center justify-center gap-2 transition-all duration-500"
            style={{
              height: "48px",
              padding: "0 28px",
              borderRadius: "9999px",
              background: "#3D2B1F",
              color: "#FAF7F4",
              fontSize: "13px",
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            Request Bulk Quote
            <ArrowRight style={{ width: 14, height: 14 }} />
          </Link>
        </motion.div>
      </div>
    </section>

    {/* USE CASES */}
    <section className="max-w-[1280px] mx-auto px-6 lg:px-8 py-20">
      <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-14">
        <div
          className="font-semibold uppercase mb-5"
          style={{
            fontSize: "11px",
            color: "#C9964A",
            letterSpacing: "0.25em",
          }}
        >
          Use Cases
        </div>
        <h2
          className="font-display"
          style={{
            fontWeight: 400,
            fontSize: "clamp(1.85rem, 3.8vw, 2.8rem)",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            color: "#3D2B1F",
          }}
        >
          Built for moments that matter
        </h2>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {useCases.map((u, i) => (
          <motion.div
            key={u.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.7,
              delay: i * 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={{ y: -6 }}
            className="text-center p-8 transition-all duration-500"
            style={{
              background: "#ffffff",
              border: "1px solid #e5e0d8",
              borderRadius: "20px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow =
                "0 20px 50px -15px rgba(61,43,31,0.15)";
              e.currentTarget.style.borderColor = "rgba(201,150,74,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.borderColor = "#e5e0d8";
            }}
          >
            <div
              className="mx-auto flex items-center justify-center"
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "14px",
                background: "#FAF7F4",
              }}
            >
              <u.icon
                strokeWidth={1.6}
                style={{ width: 22, height: 22, color: "#C9964A" }}
              />
            </div>
            <h3
              className="mt-5"
              style={{
                fontSize: "16px",
                fontWeight: 500,
                color: "#3D2B1F",
                letterSpacing: "-0.01em",
              }}
            >
              {u.title}
            </h3>
            <p
              className="mt-2 mx-auto"
              style={{
                fontSize: "13px",
                lineHeight: 1.7,
                color: "#6B7280",
                maxWidth: "26ch",
              }}
            >
              {u.body}
            </p>
          </motion.div>
        ))}
      </div>
    </section>

    {/* BULK PRICING */}
    <section style={{ background: "#FAF7F4" }}>
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-20">
        <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-14">
          <div
            className="font-semibold uppercase mb-5"
            style={{
              fontSize: "11px",
              color: "#C9964A",
              letterSpacing: "0.25em",
            }}
          >
            Volume Pricing
          </div>
          <h2
            className="font-display"
            style={{
              fontWeight: 400,
              fontSize: "clamp(1.85rem, 3.8vw, 2.8rem)",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: "#3D2B1F",
            }}
          >
            The more you gift, the more you save
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {tiers.map((t, i) => (
            <motion.div
              key={t.qty}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.7,
                delay: i * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ y: -6 }}
              className="p-8 transition-all duration-500 relative flex flex-col"
              style={{
                background: t.featured ? "#3D2B1F" : "#ffffff",
                border: t.featured
                  ? "1px solid #3D2B1F"
                  : "1px solid #e5e0d8",
                borderRadius: "20px",
                color: t.featured ? "#FAF7F4" : "#3D2B1F",
                boxShadow: t.featured
                  ? "0 20px 60px -20px rgba(61,43,31,0.4)"
                  : "none",
              }}
            >
              {t.featured && (
                <span
                  className="absolute -top-3 left-1/2 -translate-x-1/2 uppercase"
                  style={{
                    background: "#C9964A",
                    color: "#3D2B1F",
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "0.18em",
                    padding: "5px 14px",
                    borderRadius: "9999px",
                  }}
                >
                  Most Popular
                </span>
              )}
              <div
                className="font-display"
                style={{
                  fontWeight: 400,
                  fontSize: "44px",
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                  color: t.featured ? "#C9964A" : "#3D2B1F",
                }}
              >
                {t.qty}
              </div>
              <div
                className="uppercase mt-1.5"
                style={{
                  fontSize: "11px",
                  color: t.featured ? "rgba(250,247,244,0.6)" : "#6B7280",
                  letterSpacing: "0.18em",
                  fontWeight: 600,
                }}
              >
                Pieces &middot; {t.discount}
              </div>
              <ul className="mt-7 space-y-3 flex-1">
                {t.perks.map((p) => (
                  <li
                    key={p}
                    className="flex items-start gap-2.5"
                    style={{
                      fontSize: "14px",
                      lineHeight: 1.6,
                      color: t.featured ? "#FAF7F4" : "#3D2B1F",
                    }}
                  >
                    <Check
                      strokeWidth={2}
                      style={{
                        width: 14,
                        height: 14,
                        color: "#C9964A",
                        marginTop: 4,
                        flexShrink: 0,
                      }}
                    />
                    {p}
                  </li>
                ))}
              </ul>
              <Link
                to="/contact?type=corporate"
                className="mt-7 inline-flex items-center justify-center gap-2 w-full"
                style={{
                  height: "44px",
                  borderRadius: "9999px",
                  background: t.featured ? "#C9964A" : "#FAF7F4",
                  color: "#3D2B1F",
                  border: t.featured ? "1px solid #C9964A" : "1px solid #e5e0d8",
                  fontSize: "12px",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  transition: "all 0.4s ease",
                }}
              >
                Get Quote
                <ArrowRight style={{ width: 12, height: 12 }} />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* FEATURED BRANDS */}
    <section className="max-w-[1280px] mx-auto px-6 lg:px-8 py-20">
      <motion.div {...fadeUp} className="text-center mb-12">
        <div
          className="font-semibold uppercase mb-5"
          style={{
            fontSize: "11px",
            color: "#C9964A",
            letterSpacing: "0.25em",
          }}
        >
          Trusted by
        </div>
        <h2
          className="font-display mx-auto"
          style={{
            fontWeight: 400,
            fontSize: "clamp(1.5rem, 3vw, 2rem)",
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            color: "#3D2B1F",
            maxWidth: "32ch",
          }}
        >
          Brands that gift with intention
        </h2>
      </motion.div>

      <motion.div
        {...fadeUp}
        className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6"
      >
        {brands.map((b) => (
          <span
            key={b}
            className="font-display"
            style={{
              fontWeight: 500,
              fontSize: "20px",
              color: "#3D2B1F",
              opacity: 0.5,
              letterSpacing: "-0.01em",
              transition: "opacity 0.3s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.5")}
          >
            {b}
          </span>
        ))}
      </motion.div>
    </section>

    {/* CTA */}
    <section style={{ background: "#2C1F14" }}>
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-20 text-center">
        <motion.h2
          {...fadeUp}
          className="font-display mx-auto"
          style={{
            fontWeight: 400,
            fontSize: "clamp(1.85rem, 3.8vw, 2.8rem)",
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            color: "#FAF7F4",
            maxWidth: "22ch",
          }}
        >
          Plan a gift program that{" "}
          <em className="font-serif italic" style={{ color: "#C9964A", fontWeight: 400 }}>
            actually moves people.
          </em>
        </motion.h2>
        <motion.p
          {...fadeUp}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-5 mx-auto"
          style={{
            fontSize: "15px",
            lineHeight: 1.75,
            color: "rgba(250,247,244,0.7)",
            maxWidth: "44ch",
          }}
        >
          Tell us what you&apos;re celebrating. We&apos;ll handle the rest, design,
          production, and delivery.
        </motion.p>
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-9"
        >
          <Link
            to="/contact?type=corporate"
            className="inline-flex items-center justify-center gap-2 transition-all duration-500"
            style={{
              height: "48px",
              padding: "0 28px",
              borderRadius: "9999px",
              background: "#C9964A",
              color: "#3D2B1F",
              fontSize: "13px",
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            Request Bulk Quote
            <ArrowRight style={{ width: 14, height: 14 }} />
          </Link>
        </motion.div>
      </div>
    </section>
  </>
);

export default CorporatePage;
