import { Leaf, Heart, Sparkles, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import workspaceImg from "@/assets/gallery-workspace.jpg";

const values = [
  {
    icon: Leaf,
    title: "Sustainably Made",
    desc: "Responsibly sourced materials, minimal packaging waste, and eco-conscious processes at every step.",
  },
  {
    icon: Heart,
    title: "Poured with Devotion",
    desc: "No machines, no shortcuts. Every single piece is assembled and finished entirely by hand.",
  },
  {
    icon: Sparkles,
    title: "One of a Kind",
    desc: "Your memories are unique — and so is every keepsake we create. No two pieces are ever the same.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const AboutPage = () => {
  const revealRef = useScrollReveal();

  return (
    <>
      {/* Hero Section */}
      <section
        className="relative min-h-[60vh] flex items-center py-24"
        style={{ background: "linear-gradient(to bottom, #FAF7F4, rgba(250,247,244,0.4))" }}
      >
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 w-full">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <span
                className="inline-block text-[11px] uppercase tracking-[0.25em] font-semibold mb-5"
                style={{ color: "#C9964A" }}
              >
                Our Story
              </span>
              <h1
                className="font-light leading-[1.08]"
                style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontFamily: "var(--font-display)", color: "#3D2B1F" }}
              >
                Born from{" "}
                <em className="not-italic italic" style={{ color: "#C9964A", fontFamily: "var(--font-serif)" }}>
                  passion
                </em>
                , perfected by hand.
              </h1>
              <p className="mt-6 text-[15px] leading-[1.75] text-gray-500 max-w-md">
                Mohika Art began in 2021 as a small experiment — a kitchen table, a bottle of resin, and the simple desire to hold onto fleeting moments. What started as a personal obsession with preservation has grown into a studio dedicated to transforming life's milestones into tactile, lasting art.
              </p>
              <p className="mt-4 text-[15px] leading-[1.75] text-gray-500 max-w-md">
                Today, every piece we create carries that same founding spirit: meticulous attention to detail, a reverence for the stories behind each order, and a commitment to quality that we refuse to compromise.
              </p>
            </motion.div>

            {/* Right */}
            <motion.div
              className="flex justify-center md:justify-end"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              <div
                className="relative overflow-hidden rounded-[24px] w-full"
                style={{
                  aspectRatio: "4/5",
                  maxHeight: "520px",
                  boxShadow: "0 32px 80px -20px rgba(61,43,31,0.18)",
                }}
              >
                <img
                  src={workspaceImg}
                  alt="Mohika Art workspace"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <motion.h2
            className="text-center mb-14"
            style={{ fontSize: "clamp(1.85rem, 4vw, 3rem)", fontFamily: "var(--font-display)", color: "#3D2B1F" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            Our Guiding Principles
          </motion.h2>

          <motion.div
            ref={revealRef}
            className="scroll-reveal grid md:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            {values.map((v) => (
              <motion.div
                key={v.title}
                className="luxury-card bg-white p-8 rounded-[20px] text-center"
                style={{ border: "1px solid #e5e0d8" }}
                variants={cardVariants}
              >
                <div
                  className="w-14 h-14 rounded-[14px] flex items-center justify-center mx-auto"
                  style={{ background: "linear-gradient(135deg, #FAF7F4, #f3ede5)" }}
                >
                  <v.icon className="w-6 h-6" style={{ color: "#C9964A" }} />
                </div>
                <h4
                  className="text-[16px] font-medium mt-5"
                  style={{ color: "#3D2B1F", fontFamily: "var(--font-display)" }}
                >
                  {v.title}
                </h4>
                <p className="text-[13px] text-gray-500 mt-3 leading-[1.7]">{v.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Response time — premium banner */}
          <motion.div
            className="mt-16 mx-auto max-w-xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div
              className="flex items-center justify-center gap-4 px-8 py-5 rounded-[16px]"
              style={{
                background: "linear-gradient(135deg, #FAF7F4, #f7f2eb)",
                border: "1px solid #e5e0d8",
              }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                style={{ background: "rgba(201,150,74,0.1)" }}
              >
                <Clock className="w-5 h-5" style={{ color: "#C9964A" }} />
              </div>
              <div>
                <p className="text-[14px] font-medium" style={{ color: "#3D2B1F" }}>
                  Crafted with patience
                </p>
                <p className="text-[12px] text-gray-500 mt-0.5">
                  Each piece requires 7–14 days of careful, dedicated work.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
