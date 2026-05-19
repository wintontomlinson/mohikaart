import { Link } from "react-router-dom";

const HomeCTA = () => (
  <section className="py-20">
    <div className="max-w-[1280px] mx-auto px-8 text-center">
      <h2
        className="font-display"
        style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 400, lineHeight: 1.15 }}
      >
        Let's craft something unforgettable.
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
        Share your story—a name, a date, a preserved bouquet—and we'll turn it into a one-of-a-kind resin keepsake, handmade just for you.
      </p>
      <div className="mt-8">
        <Link
          to="/contact"
          className="inline-flex items-center justify-center rounded-full"
          style={{
            height: "48px",
            minWidth: "160px",
            padding: "0 32px",
            background: "#3D2B1F",
            color: "#FAF7F4",
            fontSize: "13px",
            fontWeight: 600,
            letterSpacing: "0.04em",
          }}
        >
          Start Your Custom Order →
        </Link>
      </div>
      <a
        href="https://wa.me/917975590498"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mt-4"
        style={{ fontSize: "13px", color: "#C9964A", textDecoration: "underline" }}
      >
        Or message us on WhatsApp
      </a>
    </div>
  </section>
);

export default HomeCTA;
