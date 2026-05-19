import { motion } from "framer-motion";

const steps = [
  { n: "01", title: "Share Your Vision", desc: "Tell us about the memory you'd like to preserve \u2014 a name, a date, dried flowers from a special day." },
  { n: "02", title: "Design Approval", desc: "We create a detailed mockup for your review. Nothing is poured until every element is perfect." },
  { n: "03", title: "Handcrafted Creation", desc: "Your piece is carefully assembled and poured in our studio, then cured and polished to perfection." },
  { n: "04", title: "Delivered to You", desc: "Wrapped in our signature luxury packaging and shipped with care directly to your doorstep." },
];

const cardVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

const HowItWorks = () => {
  return (
    <section className="py-24 relative" style={{ background: "linear-gradient(160deg, #1a1210 0%, #2C1F14 50%, #1a1210 100%)" }}>
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
        <motion.div
          className="mb-14"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p
            style={{
              fontSize: "11px",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#C9964A",
              fontWeight: 600,
              marginBottom: "12px",
            }}
          >
            Our Process
          </p>
          <h2
            className="font-display"
            style={{
              fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
              fontWeight: 400,
              lineHeight: 1.1,
              color: "#ffffff",
            }}
          >
            From concept to{" "}
            <em style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", color: "#C9964A" }}>
              keepsake
            </em>
            .
          </h2>
        </motion.div>

        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Connecting line between cards (hidden on mobile) */}
          <div className="hidden lg:block absolute top-1/2 left-[12%] right-[12%] h-[1px] border-t border-dashed border-[#C9964A]/30 -translate-y-1/2 pointer-events-none" />

          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="relative group p-7 rounded-[20px] flex flex-col backdrop-blur-sm transition-all duration-500"
              style={{
                height: "260px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(201,150,74,0.2)",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = "rgba(201,150,74,0.6)";
                el.style.boxShadow = "0 0 30px rgba(201,150,74,0.1)";
                el.style.transform = "scale(1.02)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = "rgba(201,150,74,0.2)";
                el.style.boxShadow = "none";
                el.style.transform = "scale(1)";
              }}
            >
              <span
                className="font-display"
                style={{ fontSize: "56px", color: "#C9964A", lineHeight: 1, opacity: 0.8 }}
              >
                {s.n}
              </span>
              <h3
                className="mt-4"
                style={{ fontSize: "17px", color: "#ffffff", fontWeight: 500 }}
              >
                {s.title}
              </h3>
              <p
                className="mt-3"
                style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}
              >
                {s.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
