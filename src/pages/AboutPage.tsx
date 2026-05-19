import { Leaf, Heart, Sparkles, Clock } from "lucide-react";
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

const AboutPage = () => {
  const revealRef = useScrollReveal();

  return (
    <>
      {/* Hero Section */}
      <section className="py-20" style={{ background: "#FAF7F4" }}>
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div>
              <p className="eyebrow mb-4">Our Story</p>
              <h1
                className="font-display font-light leading-[1.08]"
                style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}
              >
                Born from{" "}
                <em className="not-italic italic" style={{ color: "#C9964A", fontFamily: "var(--font-serif)" }}>
                  passion
                </em>
                , perfected by hand.
              </h1>
              <p className="mt-6 text-[15px] leading-relaxed text-gray-500 max-w-md">
                Mohika Art began in 2021 as a small experiment — a kitchen table, a bottle of resin, and the simple desire to hold onto fleeting moments. What started as a personal obsession with preservation has grown into a studio dedicated to transforming life's milestones into tactile, lasting art.
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-gray-500 max-w-md">
                Today, every piece we create carries that same founding spirit: meticulous attention to detail, a reverence for the stories behind each order, and a commitment to quality that we refuse to compromise.
              </p>
            </div>

            {/* Right */}
            <div className="flex justify-center md:justify-end">
              <img
                src={workspaceImg}
                alt="Mohika Art workspace"
                className="rounded-2xl shadow-lg object-cover"
                style={{ aspectRatio: "4/5", maxHeight: "480px", width: "100%" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="max-w-[1280px] mx-auto px-8">
          <h2 className="font-display text-center mb-12" style={{ fontSize: "clamp(1.85rem, 4vw, 3rem)" }}>
            Our Guiding Principles
          </h2>

          <div ref={revealRef} className="scroll-reveal grid md:grid-cols-3 gap-4">
            {values.map((v) => (
              <div
                key={v.title}
                className="bg-white p-6 rounded-[16px] text-center"
                style={{ border: "0.5px solid #e5e0d8", minHeight: "160px" }}
              >
                <div
                  className="w-12 h-12 rounded-[10px] flex items-center justify-center mx-auto"
                  style={{ background: "#FAF7F4" }}
                >
                  <v.icon className="w-5 h-5" style={{ color: "#C9964A" }} />
                </div>
                <h4 className="text-[15px] font-medium mt-4" style={{ color: "#3D2B1F" }}>
                  {v.title}
                </h4>
                <p className="text-[13px] text-gray-500 mt-2 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>

          {/* Response time note */}
          <div className="flex items-center justify-center gap-3 mt-12">
            <Clock className="w-5 h-5 shrink-0" style={{ color: "#C9964A" }} />
            <span className="text-[14px] text-gray-500">
              Crafted with patience — each piece requires 7–14 days of careful work.
            </span>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
