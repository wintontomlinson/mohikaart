import { Hand, Sparkles, Gem, Package, Gift, Truck } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const items = [
  { icon: Hand,     title: "Artisan Craftsmanship",  desc: "Each piece is meticulously poured, cured, and polished by hand over multiple days." },
  { icon: Sparkles, title: "Bespoke Designs",        desc: "Your vision brought to life — every detail customised to your exact specifications." },
  { icon: Gem,      title: "Museum-Grade Resin",     desc: "We use only crystal-clear, UV-resistant, non-yellowing epoxy that preserves forever." },
  { icon: Package,  title: "Luxury Packaging",       desc: "Presented in velvet-lined boxes with ribbon, tissue, and a handwritten note." },
  { icon: Gift,     title: "Gift-Ready Always",      desc: "Every order arrives beautifully wrapped — perfect for gifting without any extra effort." },
  { icon: Truck,    title: "Nationwide Delivery",    desc: "Insured shipping across India with real-time tracking. Always free, always careful." },
];

const WhyUs = () => {
  const ref = useScrollReveal<HTMLDivElement>(0.1);

  return (
    <section className="py-20">
      <div className="max-w-[1280px] mx-auto px-8">
        <div className="mb-12">
          <p
            className="eyebrow mb-3"
            style={{ fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", color: "#C9964A", fontWeight: 600 }}
          >
            The Mohika Difference
          </p>
          <h2
            className="font-display"
            style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 400, lineHeight: 1.1, color: "#3D2B1F" }}
          >
            Crafted with intention.{" "}
            <em style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", color: "#C9964A" }}>
              Delivered with care.
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
                className="mt-2"
                style={{ fontSize: "13px", color: "rgb(107 114 128)", lineHeight: 1.6 }}
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
