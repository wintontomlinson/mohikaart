import { Leaf, Heart, Sparkles, Clock } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import workspaceImg from "@/assets/gallery-workspace.jpg";

const values = [
  { icon: Leaf, title: "Eco-conscious", desc: "We use responsibly sourced materials and minimal waste packaging." },
  { icon: Heart, title: "Made with love", desc: "Every piece is poured, arranged and polished by hand with care." },
  { icon: Sparkles, title: "Every piece is unique", desc: "No two creations are alike — your story makes it one of a kind." },
];

const AboutPage = () => {
  const valuesRef = useScrollReveal<HTMLDivElement>();

  return (
    <>
      {/* Hero - 2 column */}
      <section className="py-20" style={{ background: "#FAF7F4" }}>
        <div className="max-w-[1280px] mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <span
              style={{
                fontSize: "10px",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "#C9964A",
                fontWeight: 500,
              }}
            >
              Our Story
            </span>
            <h1
              className="font-display mt-3"
              style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 300, lineHeight: 1.05 }}
            >
              Born from{" "}
              <em className="not-italic" style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", color: "#C9964A" }}>
                love
              </em>
              , made by hand.
            </h1>
            <p className="mt-5" style={{ fontSize: "15px", color: "hsl(25 10% 42%)", lineHeight: 1.8, maxWidth: "460px" }}>
              Mohika Art is a quiet rebellion against the disposable — a studio
              devoted to preserving the small, beautiful moments that make a life.
            </p>
            <p className="mt-4" style={{ fontSize: "15px", color: "hsl(25 10% 42%)", lineHeight: 1.8, maxWidth: "460px" }}>
              Every flower, every name, every heartbeat we capture in resin is a
              tribute to the people and stories you cherish most. From wedding
              bouquets to a child's first drawing, we transform life's most precious
              fragments into keepsakes that last a lifetime.
            </p>
          </div>
          <div className="flex items-center justify-center">
            <img
              src={workspaceImg}
              alt="Mohika Art studio workspace"
              className="w-full max-w-[440px] rounded-2xl object-cover shadow-lg"
              style={{ aspectRatio: "4/5" }}
            />
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="max-w-[1280px] mx-auto px-8">
          <h2
            className="font-display text-center mb-12"
            style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 300 }}
          >
            What we stand for
          </h2>

          <div ref={valuesRef} className="scroll-reveal grid grid-cols-1 md:grid-cols-3 gap-4">
            {values.map((v) => (
              <div
                key={v.title}
                className="bg-white p-6 text-center"
                style={{ borderRadius: "16px", border: "0.5px solid #e5e0d8", minHeight: "160px" }}
              >
                <div
                  className="mx-auto flex items-center justify-center"
                  style={{ width: "48px", height: "48px", borderRadius: "10px", background: "#FAF7F4" }}
                >
                  <v.icon className="w-5 h-5" style={{ color: "#C9964A" }} strokeWidth={1.5} />
                </div>
                <h3 className="mt-4" style={{ fontSize: "15px", fontWeight: 500 }}>{v.title}</h3>
                <p className="mt-2" style={{ fontSize: "13px", color: "hsl(25 10% 46%)", lineHeight: 1.6 }}>
                  {v.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Response time note */}
          <div className="mt-12 flex items-center justify-center gap-3">
            <Clock className="w-5 h-5" style={{ color: "#C9964A" }} />
            <p style={{ fontSize: "14px", color: "hsl(25 10% 42%)" }}>
              Crafted with patience — each piece takes 7–14 days
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
