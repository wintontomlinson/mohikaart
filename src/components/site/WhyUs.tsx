import { Hand, Sparkles, Gem, Package, Gift, Truck } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const items = [
  { icon: Hand,      title: "Handmade Precision",  desc: "Every piece poured, set and polished by hand with quiet patience." },
  { icon: Sparkles,  title: "Fully Customized",    desc: "Names, dates, dried bouquets — designed entirely around your story." },
  { icon: Gem,       title: "Premium Resin",       desc: "Crystal clear, non-yellowing, jeweller-grade epoxy that lasts a lifetime." },
  { icon: Package,   title: "Secure Packaging",    desc: "Multi-layered luxury packaging — your gift arrives flawless." },
  { icon: Gift,      title: "Gifting Perfect",     desc: "Includes elegant gift box, ribbon and a handwritten note." },
  { icon: Truck,     title: "Pan India Delivery",  desc: "Shipped safely across India with real-time tracking. Free on all orders." },
];

const WhyUs = () => {
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <section className="py-20" style={{ background: "#FAF7F4" }}>
      <div className="max-w-[1280px] mx-auto px-8">
        <div className="mb-12">
          <span
            style={{
              fontSize: "10px",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#C9964A",
              fontWeight: 500,
            }}
          >
            Why Mohika Art
          </span>
          <h2
            className="font-display mt-3"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 300 }}
          >
            Designed with detail.
            <br />
            <em
              className="not-italic"
              style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", color: "#C9964A" }}
            >
              Delivered with devotion.
            </em>
          </h2>
        </div>

        <div
          ref={ref}
          className="scroll-reveal grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {items.map((it) => (
            <div
              key={it.title}
              className="bg-white p-6 transition-all duration-300 hover:shadow-md"
              style={{
                minHeight: "160px",
                borderRadius: "16px",
                border: "0.5px solid #e5e0d8",
              }}
            >
              <div
                className="flex items-center justify-center"
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "10px",
                  background: "#FAF7F4",
                }}
              >
                <it.icon className="w-5 h-5" style={{ color: "#3D2B1F" }} strokeWidth={1.5} />
              </div>
              <h3 className="mt-4" style={{ fontSize: "15px", fontWeight: 500 }}>
                {it.title}
              </h3>
              <p
                className="mt-2"
                style={{
                  fontSize: "13px",
                  color: "hsl(25 10% 46%)",
                  lineHeight: 1.6,
                }}
              >
                {it.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
