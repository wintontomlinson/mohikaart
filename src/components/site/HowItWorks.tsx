import { useScrollReveal } from "@/hooks/useScrollReveal";

const steps = [
  { n: "01", title: "Share Your Vision", desc: "Tell us about the memory you'd like to preserve — a name, a date, dried flowers from a special day." },
  { n: "02", title: "Design Approval", desc: "We create a detailed mockup for your review. Nothing is poured until every element is perfect." },
  { n: "03", title: "Handcrafted Creation", desc: "Your piece is carefully assembled and poured in our studio, then cured and polished to perfection." },
  { n: "04", title: "Delivered to You", desc: "Wrapped in our signature luxury packaging and shipped with care directly to your doorstep." },
];

const HowItWorks = () => {
  const ref = useScrollReveal<HTMLDivElement>(0.1);

  return (
    <section className="py-20" style={{ background: "#2C1F14" }}>
      <div className="max-w-[1280px] mx-auto px-8">
        <div className="mb-12">
          <p
            style={{
              fontSize: "11px",
              letterSpacing: "0.25em",
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
        </div>

        <div ref={ref} className="scroll-reveal grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((s) => (
            <div
              key={s.n}
              className="group p-6 rounded-[16px] flex flex-col"
              style={{
                height: "240px",
                background: "rgba(255,255,255,0.06)",
                border: "0.5px solid rgba(201,150,74,0.3)",
                transition: "transform 300ms ease, border-color 300ms ease, box-shadow 300ms ease",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.transform = "perspective(800px) rotateY(3deg)";
                el.style.borderColor = "rgba(201,150,74,0.7)";
                el.style.boxShadow = "0 0 24px rgba(201,150,74,0.15)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.transform = "perspective(800px) rotateY(0deg)";
                el.style.borderColor = "rgba(201,150,74,0.3)";
                el.style.boxShadow = "none";
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
                style={{ fontSize: "16px", color: "#ffffff", fontWeight: 500 }}
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
