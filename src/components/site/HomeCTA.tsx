import { Link } from "react-router-dom";

const HomeCTA = () => (
  <section className="py-20">
    <div className="max-w-[1280px] mx-auto px-8 text-center">
      <h2
        className="font-display"
        style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 400, lineHeight: 1.1, color: "#3D2B1F" }}
      >
        Ready to preserve your moment?
      </h2>
      <p
        className="mt-4 mx-auto"
        style={{
          maxWidth: "480px",
          fontSize: "15px",
          color: "hsl(25 10% 42%)",
          lineHeight: 1.75,
        }}
      >
        Every piece begins with a conversation. Share your idea — a name, a date, a pressed bouquet — and we'll craft something truly extraordinary, just for you.
      </p>
      <div className="mt-8">
        <Link
          to="/contact"
          className="inline-flex items-center justify-center rounded-full"
          style={{
            height: "48px",
            minWidth: "160px",
            padding: "0 28px",
            background: "#3D2B1F",
            color: "#FAF7F4",
            fontSize: "13px",
            fontWeight: 600,
            letterSpacing: "0.04em",
          }}
        >
          Begin Your Custom Piece &rarr;
        </Link>
      </div>
      <a
        href="https://wa.me/917975590498"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mt-4"
        style={{ fontSize: "13px", color: "#C9964A", textDecoration: "underline" }}
      >
        Prefer WhatsApp? Message us directly &rarr;
      </a>
    </div>
  </section>
);

export default HomeCTA;
