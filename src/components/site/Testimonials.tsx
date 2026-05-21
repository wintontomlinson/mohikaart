import { Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const reviews = [
  {
    text: "Absolutely beautiful! The name keychain for my best friend's birthday was even more stunning in person.",
    name: "Priya S.",
    product: "Name Keychain",
  },
  {
    text: "The resin tray is a showstopper. Every guest asks where I got it from. Packaging was super premium!",
    name: "Ananya M.",
    product: "Resin Tray",
  },
  {
    text: "Got our wedding bouquet preserved as a keepsake. We will treasure it forever. Worth every rupee!",
    name: "Sneha & Rahul",
    product: "Wedding Keepsake",
  },
  {
    text: "Ordered a custom photo frame as an anniversary gift. My wife cried happy tears. Highly recommended!",
    name: "Vikram T.",
    product: "Photo Frame",
  },
  {
    text: "Fast delivery, perfect packaging and the bookmark set is gorgeous. Already placing my second order!",
    name: "Meera K.",
    product: "Bookmark Set",
  },
];

const Testimonials = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let animId: number;
    let pos = 0;

    const animate = () => {
      if (!paused) {
        pos += 0.5;
        if (pos >= el.scrollWidth / 2) pos = 0;
        el.scrollLeft = pos;
      }
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [paused]);

  return (
    <section className="py-20 md:py-28 bg-[#fdf9f0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-[#c9a84c] mb-2">TESTIMONIALS</p>
        <h2 className="text-3xl md:text-4xl font-serif text-[#1a1208]">What our customers say</h2>
      </div>

      <div
        ref={scrollRef}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        className="overflow-hidden"
      >
        <div className="flex gap-6 px-4 sm:px-6 lg:px-8 w-max">
          {[...reviews, ...reviews].map((review, i) => (
            <div
              key={i}
              className="w-[350px] flex-shrink-0 bg-white rounded-2xl p-6 shadow-sm"
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} className="w-4 h-4 fill-[#c9a84c] text-[#c9a84c]" />
                ))}
              </div>

              <p className="text-sm italic text-[#1a1208]/70 leading-relaxed mb-4">
                "{review.text}"
              </p>

              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-[#1a1208]">— {review.name}</p>
                <p className="text-xs text-[#c9a84c]">{review.product}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
