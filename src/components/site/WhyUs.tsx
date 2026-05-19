import { Hand, Sparkles, Gem, Package, Gift, Truck } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const items = [
  { icon: Hand,     title: "Handmade Precision",  desc: "Every piece poured, set and polished by hand with quiet patience." },
  { icon: Sparkles, title: "Fully Customized",    desc: "Names, dates, dried bouquets—designed entirely around your story." },
  { icon: Gem,      title: "Premium Resin",       desc: "Crystal clear, non-yellowing, jeweller-grade epoxy that lasts a lifetime." },
  { icon: Package,  title: "Secure Packaging",    desc: "Multi-layered luxury packaging—your gift arrives flawless." },
  { icon: Gift,     title: "Gifting Perfect",     desc: "Includes elegant gift box, ribbon and a handwritten note." },
  { icon: Truck,    title: "Pan India Delivery",  desc: "Shipped safely across India with real-time tracking. Free on all orders." },
];

const WhyUs = () => {
  const ref = useScrollReveal<HTMLDivElement>(0.1);

  return (
    <section className="py-20">
      <div className="max-w-[1280px] mx-auto px-8">
        <div className="mb-12">
          <p className="eyebrow mb-3" style={{ fontSize: "11px", letterSpacing: "0.25em" }}>
            Why Mohika Art
          </p>
          <h2
            className="font-display"
            style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 400, lineHeight: 1.1 }}
          >
            Designed with detail.{" "}
            <em style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", color: "#C9964A" }}>
              Delivered with devotion.
            </em>
          </h2>
        </div>

        <div ref={ref} className="scroll-reveal grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((it) => (
            <div
              key={it.title}
              className="p-6 rounded-[16px] bg-white"
              style={{
                minHeight: "160px",
                border: "0.5px solid #e5e0d8",
              }}
            >
              <div
                className="flex items-center justify-center rounded-[10px]"
                style={{
                  width: "48px",
                  height: "48px",
                  background: "#FAF7F4",
                }}
              >
                <it.icon className="w-5 h-5" style={{ color: "#3D2B1F" }} strokeWidth={1.5} />
              </div>
              <h3
                className="mt-4"
                style={{ fontSize: "15px", fontWeight: 500, color: "#3D2B1F" }}
              >
                {it.title}
              </h3>
              <p
                className="mt-2 leading-relaxed"
                style={{ fontSize: "13px", color: "rgb(107 114 128)" }}
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
