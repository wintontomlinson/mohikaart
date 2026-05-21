import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, ArrowRight, Quote, Mail, Calendar, Sparkles, Truck } from "lucide-react";
const weddingImg = "/placeholder.svg";
const trayImg = "/placeholder.svg";
const frameImg = "/placeholder.svg";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
};

const tiers = [
  {
    image: trayImg,
    title: "Bouquet Tray",
    price: "₹4,500",
    blurb: "A wide resin tray cast around your bridal bouquet, meant for your console or coffee table.",
    features: [
      "Full bouquet preservation",
      "Premium resin, gold leaf accents",
      "Engraved names + wedding date",
      "Delivered in luxury gift box",
    ],
  },
  {
    image: frameImg,
    title: "Floral Frame",
    price: "₹3,200",
    blurb: "A wall-ready frame featuring pressed petals, your invite or vow excerpt, under museum-grade resin.",
    features: [
      "12×16in archival frame",
      "Pressed petals + invite card",
      "Choice of gold or natural wood",
      "Ready-to-hang with hardware",
    ],
  },
  {
    image: weddingImg,
    title: "Petal Coaster Set",
    price: "₹2,800",
    blurb: "A set of four hand-poured coasters, each holding a single petal from your bouquet.",
    features: [
      "Set of 4 coasters",
      "One petal per coaster",
      "Hand-finished gold edges",
      "Velvet-lined storage box",
    ],
  },
];

const steps = [
  {
    icon: Mail,
    label: "Send Bouquet",
    desc: "Ship within 48 hours of your wedding. We send a free packing kit on request.",
  },
  {
    icon: Calendar,
    label: "Drying",
    desc: "We gently dry every petal over 7 days to preserve color & shape.",
  },
  {
    icon: Sparkles,
    label: "Design Mock",
    desc: "We share a design layout and colors for your approval before pouring.",
  },
  {
    icon: Truck,
    label: "Resin Pour & Delivery",
    desc: "Hand-poured, cured for 14 days, packed in luxury and shipped to your door.",
  },
];

const WeddingPage = () => (
  <>
    {/* HERO */}
    <section
      className="relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #FAF7F4 0%, #FBF1EC 60%, #FAF7F4 100%)",
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
          Wedding & Bridal
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
            maxWidth: "20ch",
          }}
        >
          Forever lives in{" "}
          <em
            className="font-serif italic"
            style={{ color: "#C9964A", fontWeight: 400 }}
          >
            every petal.
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
          We preserve your wedding bouquet, dried flowers, and once-in-a-lifetime moments,
          into resin keepsakes that hold time still.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            to="/contact?type=wedding"
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
            Start Your Preservation
            <ArrowRight style={{ width: 14, height: 14 }} />
          </Link>
          <Link
            to="/gallery"
            className="inline-flex items-center justify-center gap-2 transition-all duration-500"
            style={{
              height: "48px",
              padding: "0 28px",
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
            View Wedding Gallery
          </Link>
        </motion.div>
      </div>
    </section>

    {/* SERVICE TIERS */}
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
          Our Collection
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
          How we preserve
        </h2>
        <p
          className="mt-4 mx-auto"
          style={{
            fontSize: "15px",
            lineHeight: 1.7,
            color: "hsl(25 10% 42%)",
            maxWidth: "44ch",
          }}
        >
          Three signature ways to hold your wedding day forever, choose the one that fits
          your home.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {tiers.map((t, i) => (
          <motion.div
            key={t.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.7,
              delay: i * 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={{ y: -6 }}
            className="overflow-hidden flex flex-col"
            style={{
              background: "#ffffff",
              border: "1px solid #e5e0d8",
              borderRadius: "20px",
              transition: "box-shadow 0.5s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.boxShadow =
                "0 20px 50px -15px rgba(61,43,31,0.15)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
          >
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={t.image}
                alt={t.title}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="p-7 flex flex-col flex-1">
              <h3
                className="font-display"
                style={{
                  fontWeight: 400,
                  fontSize: "22px",
                  color: "#3D2B1F",
                  letterSpacing: "-0.01em",
                  lineHeight: 1.2,
                }}
              >
                {t.title}
              </h3>
              <div
                className="mt-2 font-serif"
                style={{
                  fontSize: "20px",
                  color: "#C9964A",
                  fontWeight: 500,
                  letterSpacing: "0.01em",
                }}
              >
                {t.price}
              </div>
              <p
                className="mt-3"
                style={{
                  fontSize: "14px",
                  lineHeight: 1.7,
                  color: "hsl(25 10% 42%)",
                }}
              >
                {t.blurb}
              </p>
              <ul className="mt-5 space-y-2.5 flex-1">
                {t.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2.5"
                    style={{
                      fontSize: "13px",
                      color: "#3D2B1F",
                      lineHeight: 1.6,
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
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/contact?type=wedding"
                className="mt-6 inline-flex items-center justify-center gap-2 w-full"
                style={{
                  height: "44px",
                  borderRadius: "9999px",
                  background: "#FAF7F4",
                  color: "#3D2B1F",
                  border: "1px solid #e5e0d8",
                  fontSize: "12px",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  transition: "all 0.4s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#3D2B1F";
                  e.currentTarget.style.color = "#FAF7F4";
                  e.currentTarget.style.borderColor = "#3D2B1F";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#FAF7F4";
                  e.currentTarget.style.color = "#3D2B1F";
                  e.currentTarget.style.borderColor = "#e5e0d8";
                }}
              >
                Begin
                <ArrowRight style={{ width: 12, height: 12 }} />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </section>

    {/* PROCESS TIMELINE */}
    <section style={{ background: "#2C1F14" }} className="relative overflow-hidden">
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
            The Process
          </div>
          <h2
            className="font-display"
            style={{
              fontWeight: 400,
              fontSize: "clamp(1.85rem, 3.8vw, 2.8rem)",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: "#FAF7F4",
            }}
          >
            From bouquet to keepsake
          </h2>
        </motion.div>

        <div className="relative">
          {/* connector line */}
          <div
            aria-hidden
            className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(201,150,74,0.5) 20%, rgba(201,150,74,0.5) 80%, transparent)",
            }}
          />

          <div className="grid md:grid-cols-4 gap-10 md:gap-6 relative">
            {steps.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="text-center relative"
              >
                <div
                  className="mx-auto flex items-center justify-center relative z-10"
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "9999px",
                    background: "#3D2B1F",
                    border: "1px solid rgba(201,150,74,0.4)",
                  }}
                >
                  <s.icon
                    strokeWidth={1.5}
                    style={{ width: 24, height: 24, color: "#C9964A" }}
                  />
                </div>
                <div
                  className="mt-5 font-display"
                  style={{
                    fontWeight: 500,
                    fontSize: "18px",
                    color: "#FAF7F4",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {i + 1}. {s.label}
                </div>
                <p
                  className="mt-2 mx-auto"
                  style={{
                    fontSize: "13px",
                    color: "rgba(250,247,244,0.65)",
                    lineHeight: 1.7,
                    maxWidth: "26ch",
                  }}
                >
                  {s.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* TESTIMONIAL */}
    <section className="max-w-[1280px] mx-auto px-6 lg:px-8 py-20">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-3xl mx-auto text-center"
      >
        <Quote
          strokeWidth={1.2}
          style={{
            width: 44,
            height: 44,
            color: "#C9964A",
            margin: "0 auto 24px",
            opacity: 0.7,
          }}
        />
        <p
          className="font-display italic"
          style={{
            fontWeight: 400,
            fontSize: "clamp(1.5rem, 3.2vw, 2.2rem)",
            lineHeight: 1.35,
            letterSpacing: "-0.01em",
            color: "#3D2B1F",
            fontStyle: "italic",
          }}
        >
          &ldquo;I held my wedding bouquet again, two years later. Still perfect. Mohika kept
          the day alive.&rdquo;
        </p>
        <div
          className="mt-8 uppercase"
          style={{
            fontSize: "11px",
            color: "#C9964A",
            letterSpacing: "0.25em",
            fontWeight: 600,
          }}
        >
          Riya & Arjun, Mumbai
        </div>
      </motion.div>
    </section>
  </>
);

export default WeddingPage;
