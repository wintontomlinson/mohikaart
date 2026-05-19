import { motion } from "framer-motion";
import { Leaf, Heart, Sparkles, Clock } from "lucide-react";
import workspaceImg from "@/assets/gallery-workspace.jpg";
import flatlayImg from "@/assets/gallery-flatlay.jpg";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
};

const values = [
  {
    icon: Leaf,
    title: "Sustainably Crafted",
    body: "Responsibly sourced materials, recyclable packaging, and zero-waste processes wherever possible.",
  },
  {
    icon: Heart,
    title: "Made by Hand",
    body: "No machines. Every piece is poured, set, and finished personally, each one signed by us.",
  },
  {
    icon: Sparkles,
    title: "Forever Unique",
    body: "Your story is one of a kind. So is your piece. We never repeat a design.",
  },
];

const stats = [
  { value: "2000+", label: "Happy customers" },
  { value: "4.9", label: "Average rating" },
  { value: "100%", label: "Handmade" },
];

const AboutPage = () => (
  <>
    {/* HERO */}
    <section
      className="relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #FAF7F4 0%, rgba(250,247,244,0.6) 60%, transparent 100%)",
        minHeight: "60vh",
      }}
    >
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 pt-28 pb-20 md:pt-32 md:pb-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="font-semibold uppercase mb-6"
              style={{
                fontSize: "11px",
                color: "#C9964A",
                letterSpacing: "0.25em",
              }}
            >
              Our Story
            </div>
            <h1
              className="font-display"
              style={{
                fontWeight: 400,
                fontSize: "clamp(2.5rem, 5vw, 3.8rem)",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                color: "#3D2B1F",
              }}
            >
              Where every keepsake{" "}
              <em
                className="font-serif italic"
                style={{ color: "#C9964A", fontWeight: 400 }}
              >
                begins with a story.
              </em>
            </h1>
            <div
              className="mt-7 space-y-5"
              style={{
                fontSize: "16px",
                lineHeight: 1.75,
                color: "hsl(25 10% 42%)",
              }}
            >
              <p>
                Mohika Art was born in a small kitchen in 2021, with a single bottle of resin
                and the dream of preserving life&apos;s quiet, beautiful moments. What started
                as a personal experiment has grown into a studio dedicated to handcrafted
                heirlooms.
              </p>
              <p>
                Today, every piece carries that same intention, meticulous detail, reverence
                for your story, and a refusal to compromise on quality. We don&apos;t make mass
                products. We make memories.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div
              className="overflow-hidden shadow-luxe"
              style={{
                aspectRatio: "4 / 5",
                borderRadius: "24px",
              }}
            >
              <img
                src={workspaceImg}
                alt="Mohika Art workspace"
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
            {/* Floating gold ring accent */}
            <motion.div
              aria-hidden
              className="hidden lg:block absolute -bottom-8 -left-8 w-32 h-32 rounded-full pointer-events-none"
              style={{ border: "1px solid rgba(201,150,74,0.35)" }}
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        </div>
      </div>
    </section>

    {/* BRAND VALUES */}
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
          What We Believe
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
          What we hold sacred
        </h2>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {values.map((v, i) => (
          <motion.div
            key={v.title}
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
              <v.icon strokeWidth={1.6} style={{ width: 22, height: 22, color: "#C9964A" }} />
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
              {v.title}
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
              {v.body}
            </p>
          </motion.div>
        ))}
      </div>
    </section>

    {/* FOUNDER */}
    <section style={{ background: "#FAF7F4" }}>
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-[1fr_1.2fr] gap-12 items-center">
          <motion.div {...fadeUp}>
            <div
              className="overflow-hidden shadow-luxe"
              style={{
                aspectRatio: "1 / 1",
                borderRadius: "20px",
              }}
            >
              <img
                src={flatlayImg}
                alt="Maker behind Mohika Art"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </motion.div>

          <motion.div
            {...fadeUp}
            transition={{
              duration: 0.7,
              delay: 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div
              className="font-semibold uppercase mb-5"
              style={{
                fontSize: "11px",
                color: "#C9964A",
                letterSpacing: "0.25em",
              }}
            >
              Meet the Maker
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
              Hands behind the art.
            </h2>
            <p
              className="mt-6"
              style={{
                fontSize: "16px",
                lineHeight: 1.75,
                color: "hsl(25 10% 42%)",
              }}
            >
              Every Mohika piece passes through the same pair of hands, those of our founder.
              From the first sketch to the final wax-sealed package, you&apos;re holding a
              story that&apos;s been told one careful step at a time. No assembly lines, no
              shortcuts, only patience, intention, and the quiet thrill of watching memory
              set in resin.
            </p>
            <p
              className="mt-8 font-serif italic"
              style={{
                fontSize: "22px",
                color: "#C9964A",
                fontWeight: 500,
              }}
            >
              Mohika
            </p>
          </motion.div>
        </div>
      </div>
    </section>

    {/* STATS STRIP */}
    <section style={{ background: "#2C1F14" }}>
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-3 gap-6 md:gap-10">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="text-center"
            >
              <div
                className="font-display"
                style={{
                  fontSize: "32px",
                  fontWeight: 400,
                  color: "#C9964A",
                  letterSpacing: "-0.01em",
                  lineHeight: 1.1,
                }}
              >
                {s.value}
              </div>
              <div
                className="mt-2 uppercase"
                style={{
                  fontSize: "11px",
                  color: "rgba(255,255,255,0.6)",
                  letterSpacing: "0.18em",
                  fontWeight: 500,
                }}
              >
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* RESPONSE TIME BANNER */}
    <section className="max-w-2xl mx-auto px-6 lg:px-8 py-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="text-center p-8"
        style={{
          background: "linear-gradient(180deg, #FAF7F4 0%, #ffffff 100%)",
          border: "1px solid #e5e0d8",
          borderRadius: "24px",
        }}
      >
        <div
          className="mx-auto flex items-center justify-center mb-4"
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "14px",
            background: "#ffffff",
            border: "1px solid #e5e0d8",
          }}
        >
          <Clock strokeWidth={1.6} style={{ width: 20, height: 20, color: "#C9964A" }} />
        </div>
        <p
          className="font-serif"
          style={{
            fontSize: "20px",
            color: "#3D2B1F",
            lineHeight: 1.5,
            letterSpacing: "-0.01em",
          }}
        >
          Crafted with patience,{" "}
          <em style={{ color: "#C9964A" }}>
            each piece takes 7&ndash;14 days of careful work.
          </em>
        </p>
      </motion.div>
    </section>
  </>
);

export default AboutPage;
