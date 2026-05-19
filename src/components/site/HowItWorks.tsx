import { useScrollReveal } from "@/hooks/useScrollReveal";

const steps = [
  { n: "01", title: "Share Your Idea", desc: "Tell us about the moment, name or memory you want to preserve." },
  { n: "02", title: "Approve Design", desc: "We sketch, mock-up and confirm every detail before pouring." },
  { n: "03", title: "Handmade Creation", desc: "Crafted patiently: flowers placed, resin poured, polished by hand." },
  { n: "04", title: "Delivered with Love", desc: "Wrapped in luxury packaging and shipped safely to your door." },
];

const HowItWorks = () => {
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <section className="py-20" style={{ background: "#2C1F14" }}>
      <div className="max-w-[1280px] mx-auto px-8">
        <div className="mb-12">
          <span
            style={{
              fontSize: "10px",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "rgba(201,150,74,0.8)",
              fontWeight: 500,
            }}
          >
            The Process
          </span>
          <h2
            className="font-display mt-3 text-white"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 300 }}
          >
            How ordering{" "}
            <em
              className="not-italic"
              style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", color: "#C9964A" }}
            >
              works
            </em>
            .
          </h2>
        </div>

        <div
          ref={ref}
          className="scroll-reveal-right grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {steps.map((s) => (
            <div
              key={s.n}
              className="p-6 transition-all duration-[250ms] hover:border-[rgba(201,150,74,0.8)]"
              style={{
                height: "240px",
                borderRadius: "16px",
                background: "rgba(255,255,255,0.06)",
                border: "0.5px solid rgba(201,150,74,0.3)",
                display: "flex",
                flexDirection: "column",
                cursor: "default",
                transformStyle: "preserve-3d",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.transform = "perspective(800px) rotateY(3deg)";
                el.style.boxShadow = "0 0 20px rgba(201,150,74,0.15)";
                el.style.borderColor = "rgba(201,150,74,0.8)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.transform = "perspective(800px) rotateY(0deg)";
                el.style.boxShadow = "none";
                el.style.borderColor = "rgba(201,150,74,0.3)";
              }}
            >
              <span
                className="font-display"
                style={{ fontSize: "48px", color: "#C9964A", lineHeight: 1 }}
              >
                {s.n}
              </span>
              <h3
                className="mt-4"
                style={{ fontSize: "16px", color: "#fff", fontWeight: 500 }}
              >
                {s.title}
              </h3>
              <p
                className="mt-2"
                style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}
              >
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
