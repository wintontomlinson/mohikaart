import { ShoppingBag, Pencil, Package } from "lucide-react";
import { useInView } from "@/hooks/use-in-view";

const steps = [
  {
    icon: ShoppingBag,
    title: "Choose",
    subtitle: "Your Product",
    desc: "Browse our collection & pick a piece",
  },
  {
    icon: Pencil,
    title: "Customize",
    subtitle: "Your Details",
    desc: "Share names, dates, photos or any idea",
  },
  {
    icon: Package,
    title: "Delivered",
    subtitle: "With Love",
    desc: "Handcrafted & packed with care for you",
  },
];

const HowItWorks = () => {
  const { ref, inView } = useInView();

  return (
    <section ref={ref} className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-[#c9a84c] mb-2">THE PROCESS</p>
          <h2 className="text-3xl md:text-4xl font-serif text-[#1a1208]">How it works</h2>
        </div>

        <div className="relative grid md:grid-cols-3 gap-8 md:gap-12">
          {/* Gold connecting line */}
          <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-transparent via-[#c9a84c]/30 to-transparent" />

          {steps.map((step, i) => (
            <div
              key={i}
              className={`text-center relative ${inView ? "animate-fade-in" : "opacity-0"}`}
              style={{ animationDelay: `${i * 0.15}s`, animationFillMode: "both" }}
            >
              <div className="w-16 h-16 mx-auto bg-[#fdf9f0] rounded-2xl flex items-center justify-center mb-5 shadow-sm relative z-10">
                <step.icon className="w-6 h-6 text-[#c9a84c]" />
              </div>
              <h3 className="font-serif text-xl text-[#1a1208] mb-1">{step.title}</h3>
              <p className="text-sm font-medium text-[#c9a84c] mb-3">{step.subtitle}</p>
              <p className="text-sm text-[#1a1208]/50 max-w-[200px] mx-auto">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
