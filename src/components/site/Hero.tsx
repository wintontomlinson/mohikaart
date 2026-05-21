import { Link } from "react-router-dom";
import { IMAGES } from "@/lib/products";
import { useInView } from "@/hooks/use-in-view";
import { useCountUp } from "@/hooks/use-count-up";

const Hero = () => {
  const { ref: sectionRef, inView } = useInView();
  const { count: ordersCount, ref: statsRef } = useCountUp(2000);
  const { count: yearsCount, ref: yearsRef } = useCountUp(3);

  const words = ["Turn", "Memories", "Into", "Timeless", "Art."];

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Grain overlay */}
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none z-10"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }}
      />

      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#fdf9f0] via-[#fdf9f0] to-[#f5eed8]" />

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Heading - word by word stagger */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif leading-[1.1]">
              {words.map((word, i) => (
                <span
                  key={i}
                  className={`inline-block mr-3 ${inView ? "animate-fade-in" : "opacity-0"}`}
                  style={{ animationDelay: `${i * 0.1}s`, animationFillMode: "both" }}
                >
                  {word === "Timeless" ? (
                    <span className="italic text-[#c9a84c]">{word}</span>
                  ) : (
                    word
                  )}
                </span>
              ))}
            </h1>

            <p className="text-lg text-[#1a1208]/60 max-w-md leading-relaxed">
              Handcrafted resin keepsakes that preserve your most precious moments.
              Each piece is uniquely made with real flowers, names & love.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link
                to="/shop"
                className="group relative px-8 py-4 bg-[#1a1208] text-[#fdf9f0] text-sm font-semibold tracking-wider rounded-full overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-xl"
              >
                <span className="relative z-10">SHOP COLLECTION</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#c9a84c]/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </Link>
              <Link
                to="/custom-order"
                className="px-8 py-4 border-2 border-[#1a1208]/20 text-[#1a1208] text-sm font-semibold tracking-wider rounded-full hover:border-[#c9a84c] hover:text-[#c9a84c] transition-all"
              >
                CUSTOM ORDER
              </Link>
            </div>

            {/* Stats */}
            <div ref={statsRef} className="flex items-center gap-8 pt-4">
              <div>
                <p className="text-2xl font-serif font-bold text-[#1a1208]">{ordersCount}+</p>
                <p className="text-xs text-[#1a1208]/50">Happy Orders</p>
              </div>
              <div className="w-px h-10 bg-[#c9a84c]/20" />
              <div>
                <p className="text-2xl font-serif font-bold text-[#1a1208]">4.9<span className="text-[#c9a84c]">★</span></p>
                <p className="text-xs text-[#1a1208]/50">Avg Rating</p>
              </div>
              <div className="w-px h-10 bg-[#c9a84c]/20" />
              <div ref={yearsRef}>
                <p className="text-2xl font-serif font-bold text-[#1a1208]">{yearsCount} Yrs</p>
                <p className="text-xs text-[#1a1208]/50">Crafting</p>
              </div>
            </div>
          </div>

          {/* Right Side - Hero Image + Floating Cards */}
          <div className="relative hidden lg:block">
            {/* Main image with Ken Burns */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/5]">
              <img
                src={IMAGES.hero_main}
                alt="Handcrafted resin art"
                className="w-full h-full object-cover animate-ken-burns"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1208]/20 to-transparent" />
            </div>

            {/* Floating Card 1 */}
            <div className="absolute -left-8 top-1/4 bg-white rounded-xl p-3 shadow-xl animate-float-card1">
              <div className="flex items-center gap-3">
                <img
                  src={IMAGES.hero_float1}
                  alt="Name Keychains"
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div>
                  <p className="text-xs font-medium text-[#1a1208]">Name Keychains</p>
                  <p className="text-[10px] text-[#c9a84c]">From ₹499</p>
                </div>
              </div>
            </div>

            {/* Floating Card 2 */}
            <div className="absolute -right-4 bottom-1/4 bg-white rounded-xl p-3 shadow-xl animate-float-card2">
              <div className="flex items-center gap-3">
                <img
                  src={IMAGES.hero_float2}
                  alt="Bookmarks"
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div>
                  <p className="text-xs font-medium text-[#1a1208]">Resin Bookmarks</p>
                  <p className="text-[10px] text-[#c9a84c]">From ₹349</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
