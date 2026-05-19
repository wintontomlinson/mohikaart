import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const HomeCTA = () => {
  const ref = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      className="scroll-reveal py-20"
      style={{ background: "#FAF7F4" }}
    >
      <div className="max-w-[1280px] mx-auto px-8 text-center">
        <h2
          className="font-display"
          style={{
            fontSize: "clamp(2rem, 4vw, 3.2rem)",
            fontWeight: 300,
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
          }}
        >
          Let's craft something{" "}
          <em
            className="not-italic"
            style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              color: "#C9964A",
            }}
          >
            unforgettable.
          </em>
        </h2>
        <p
          className="mt-4 mx-auto"
          style={{
            maxWidth: "480px",
            fontSize: "15px",
            color: "hsl(25 10% 46%)",
            lineHeight: 1.7,
          }}
        >
          Share your idea, and we'll personally design a keepsake that captures
          your most cherished moment in resin.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3">
          <Link
            to="/contact"
            className="inline-flex items-center justify-center gap-2 rounded-full"
            style={{
              height: "48px",
              minWidth: "160px",
              padding: "0 32px",
              background: "#3D2B1F",
              color: "#FAF7F4",
              fontSize: "13px",
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            Start Your Custom Order
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm hover:underline"
            style={{ color: "hsl(25 10% 46%)" }}
          >
            Or message us on WhatsApp →
          </a>
        </div>
      </div>
    </section>
  );
};

export default HomeCTA;
