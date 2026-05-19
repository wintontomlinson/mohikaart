import { motion } from "framer-motion";
import { Sun, Droplets, Sparkles, ShieldAlert, ThumbsUp, Clock } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
};

const cards = [
  {
    icon: Sun,
    title: "Keep out of direct sunlight",
    body: "Resin can yellow over time when exposed to direct UV. Display in indirect light.",
  },
  {
    icon: Droplets,
    title: "Avoid water exposure",
    body: "Wipe with dry microfiber cloth. Never submerge or soak.",
  },
  {
    icon: Sparkles,
    title: "Polish gently",
    body: "Use the included microfiber cloth. Avoid harsh chemicals.",
  },
  {
    icon: ShieldAlert,
    title: "Heat sensitive",
    body: "Keep away from radiators and direct heat above 60°C.",
  },
  {
    icon: ThumbsUp,
    title: "Handle with care",
    body: "While durable, drops on hard surfaces may chip the corners.",
  },
  {
    icon: Clock,
    title: "Lifetime piece",
    body: "With proper care, your keepsake will last a lifetime.",
  },
];

const CareGuidePage = () => (
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
          Care Guide
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
          Care for your{" "}
          <em
            className="font-serif italic"
            style={{ color: "#C9964A", fontWeight: 400 }}
          >
            keepsake.
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
          A few small habits will keep your Mohika piece gallery-worthy for decades. Here is
          everything you need to know.
        </motion.p>
      </div>
    </section>

    {/* CARE CARDS */}
    <section className="max-w-[1280px] mx-auto px-6 lg:px-8 py-20">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((c, i) => (
          <motion.div
            key={c.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.7,
              delay: i * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={{ y: -6 }}
            className="p-8 transition-all duration-500"
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
              className="flex items-center justify-center"
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "14px",
                background: "#FAF7F4",
              }}
            >
              <c.icon
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
              {c.title}
            </h3>
            <p
              className="mt-2"
              style={{
                fontSize: "13px",
                lineHeight: 1.7,
                color: "#6B7280",
              }}
            >
              {c.body}
            </p>
          </motion.div>
        ))}
      </div>
    </section>

    {/* CLOSING NOTE */}
    <section style={{ background: "#FAF7F4" }}>
      <div className="max-w-2xl mx-auto px-6 lg:px-8 py-20 text-center">
        <motion.p
          {...fadeUp}
          className="font-display italic mx-auto"
          style={{
            fontWeight: 400,
            fontSize: "clamp(1.4rem, 2.6vw, 1.8rem)",
            lineHeight: 1.4,
            letterSpacing: "-0.01em",
            color: "#3D2B1F",
            fontStyle: "italic",
          }}
        >
          Treat it like a memory, not a product. It will outlive us both.
        </motion.p>
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-6 uppercase"
          style={{
            fontSize: "11px",
            color: "#C9964A",
            letterSpacing: "0.25em",
            fontWeight: 600,
          }}
        >
          A note from Mohika
        </motion.div>
      </div>
    </section>
  </>
);

export default CareGuidePage;
