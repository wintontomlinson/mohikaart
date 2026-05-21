import { Link } from "react-router-dom";
import { IMAGES } from "@/lib/products";
import { useCountUp } from "@/hooks/use-count-up";
import { useInView } from "@/hooks/use-in-view";

const AboutPage = () => {
  const { count: orders, ref: ordersRef } = useCountUp(2000);
  const { count: years, ref: yearsRef } = useCountUp(3);
  const { ref: storyRef, inView: storyVisible } = useInView();

  return (
    <div className="pt-24 pb-20">
      {/* Hero Split */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-serif text-[#1a1208] leading-tight">
              Crafted with <span className="italic text-[#c9a84c]">love</span>,<br />
              since 2021.
            </h1>
            <p className="text-lg text-[#1a1208]/60">Every piece tells a story — yours.</p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/shop"
                className="px-7 py-3.5 bg-[#1a1208] text-[#fdf9f0] text-sm font-semibold tracking-wider rounded-full hover:bg-[#1a1208]/85 transition-colors"
              >
                Shop Collection &rarr;
              </Link>
              <Link
                to="/custom-order"
                className="px-7 py-3.5 border-2 border-[#1a1208]/20 text-[#1a1208] text-sm font-semibold tracking-wider rounded-full hover:border-[#c9a84c] hover:text-[#c9a84c] transition-colors"
              >
                Custom Order &rarr;
              </Link>
            </div>
          </div>
          <div className="relative">
            <img
              src={IMAGES.about_hero}
              alt="Crafting resin art"
              className="w-full rounded-3xl shadow-xl object-cover aspect-[4/5]"
            />
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section ref={storyRef} className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`grid lg:grid-cols-2 gap-12 items-center ${storyVisible ? "animate-fade-in" : "opacity-0"}`}>
            <div className="relative space-y-4">
              <img
                src={IMAGES.about_story1}
                alt="Crafting"
                className="w-3/4 rounded-2xl shadow-lg"
              />
              <img
                src={IMAGES.about_story2}
                alt="Workshop"
                className="w-2/3 rounded-2xl shadow-lg ml-auto -mt-20 relative z-10"
              />
              <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-[#c9a84c] text-white text-xs font-medium rounded-full">
                @mohikaart
              </div>
            </div>

            <div className="space-y-6">
              <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-[#c9a84c]">OUR STORY</p>
              <h2 className="text-3xl md:text-4xl font-serif text-[#1a1208]">
                From a passion for art to 2000+ happy memories
              </h2>
              <div className="space-y-4 text-[#1a1208]/60 leading-relaxed">
                <p>
                  It started in 2021 with a simple idea — what if we could turn fleeting moments into
                  something you can hold forever? That spark became Mohika Art.
                </p>
                <p>
                  Every piece we create is handpoured with love, embedded with real flowers, touched
                  with gold leaf, and crafted specifically for the person receiving it.
                </p>
                <p>
                  We believe gifts should feel personal. Not mass-produced, not generic — but truly
                  unique. A name, a date, a flower from your bouquet — these details make our pieces special.
                </p>
                <p>
                  Today, we've delivered 2000+ keepsakes across India, each one carrying a story,
                  a memory, a moment preserved in resin forever.
                </p>
              </div>
              <Link to="/shop" className="inline-flex text-[#c9a84c] text-sm font-medium hover:underline">
                Shop Our Collection &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { emoji: "🌸", title: "100% Handmade", desc: "Every piece crafted by hand" },
            { emoji: "✨", title: "Premium Materials", desc: "UV-resistant resin & real flowers" },
            { emoji: "💌", title: "Fully Personalized", desc: "Custom designs for every order" },
            { emoji: "🚚", title: "Pan India Delivery", desc: "Shipped across all states" },
          ].map((item) => (
            <div key={item.title} className="text-center p-6 bg-white rounded-2xl shadow-sm">
              <div className="text-3xl mb-3">{item.emoji}</div>
              <h3 className="font-medium text-sm text-[#1a1208] mb-1">{item.title}</h3>
              <p className="text-xs text-[#1a1208]/50">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-[#1a1208]">
        <div ref={ordersRef} className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-3xl font-serif font-bold text-[#c9a84c]">{orders}+</p>
            <p className="text-sm text-[#fdf9f0]/50 mt-1">Orders</p>
          </div>
          <div>
            <p className="text-3xl font-serif font-bold text-[#c9a84c]">4.9★</p>
            <p className="text-sm text-[#fdf9f0]/50 mt-1">Rating</p>
          </div>
          <div ref={yearsRef}>
            <p className="text-3xl font-serif font-bold text-[#c9a84c]">{years} Yrs</p>
            <p className="text-sm text-[#fdf9f0]/50 mt-1">Artistry</p>
          </div>
          <div>
            <p className="text-3xl font-serif font-bold text-[#c9a84c]">Pan India</p>
            <p className="text-sm text-[#fdf9f0]/50 mt-1">Delivery</p>
          </div>
        </div>
      </section>

      {/* Meet the Maker */}
      <section className="py-20 text-center px-4">
        <div className="w-40 h-40 mx-auto rounded-full border-4 border-[#c9a84c] p-1 mb-6">
          <img
            src={IMAGES.about_story1}
            alt="Founder"
            className="w-full h-full rounded-full object-cover"
          />
        </div>
        <h3 className="text-xl font-serif text-[#1a1208] mb-2">Meet the Maker</h3>
        <p className="text-[#1a1208]/60 max-w-md mx-auto text-sm mb-4">
          Behind every piece is a passionate artist who believes in the magic of preserving memories.
          Every pour, every petal placement, every gold detail — done with intention and love.
        </p>
        <a
          href="https://instagram.com/mohikaart"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#c9a84c] text-sm font-medium hover:underline"
        >
          Follow @mohikaart
        </a>
      </section>

      {/* Process Timeline */}
      <section className="py-16 bg-[#fdf9f0]">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-serif text-[#1a1208] text-center mb-10">Our Process</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { emoji: "🎨", label: "Design" },
              { emoji: "🌸", label: "Embed" },
              { emoji: "⏳", label: "Cure" },
              { emoji: "📦", label: "Deliver" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-3xl mb-2">{s.emoji}</div>
                <p className="text-sm font-medium text-[#1a1208]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 text-center px-4">
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/shop"
            className="px-7 py-3.5 bg-[#1a1208] text-[#fdf9f0] text-sm font-semibold tracking-wider rounded-full"
          >
            Shop Collection &rarr;
          </Link>
          <Link
            to="/custom-order"
            className="px-7 py-3.5 border-2 border-[#1a1208]/20 text-[#1a1208] text-sm font-semibold tracking-wider rounded-full hover:border-[#c9a84c] hover:text-[#c9a84c] transition-colors"
          >
            Custom Order &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
