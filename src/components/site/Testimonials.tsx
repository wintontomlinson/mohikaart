import { motion, useInView } from "framer-motion";
import { Star } from "lucide-react";
import { useRef, useState, useEffect, useCallback } from "react";

const REVIEWS = [
  { stars: 5, text: "Absolutely beautiful! The name keychain I ordered for my best friend's birthday was even more stunning in person.", name: "Priya S.", product: "Name Keychain" },
  { stars: 5, text: "The resin tray is a showstopper. Every guest asks where I got it from. Packaging was also super premium!", name: "Ananya M.", product: "Resin Tray" },
  { stars: 5, text: "Got our wedding bouquet preserved as a keepsake. We will treasure it forever. Worth every rupee!", name: "Sneha & Rahul", product: "Wedding Keepsake" },
  { stars: 5, text: "Ordered a custom photo frame as an anniversary gift. My wife cried happy tears. Highly recommended!", name: "Vikram T.", product: "Photo Frame" },
  { stars: 5, text: "Fast delivery, perfect packaging and the bookmark set is just gorgeous. Already placing my second order!", name: "Meera K.", product: "Bookmark Set" },
];

const Testimonials = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-scroll
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let animId: number;
    let pos = 0;
    const speed = 0.5;
    const scroll = () => {
      if (!isPaused) {
        pos += speed;
        if (pos >= el.scrollWidth / 2) pos = 0;
        el.scrollLeft = pos;
      }
      animId = requestAnimationFrame(scroll);
    };
    animId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animId);
  }, [isPaused]);

  return (
    <section ref={ref} className="py-14 md:py-20" style={{ background: "#fdf9f0" }}>
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-10"
        >
          <p className="text-[11px] uppercase tracking-[0.25em] font-semibold mb-3" style={{ color: "#c9a84c" }}>
            Testimonials
          </p>
          <h2 className="font-display" style={{ fontWeight: 400, fontSize: "clamp(1.85rem, 3.8vw, 2.6rem)", lineHeight: 1.1, letterSpacing: "-0.02em", color: "#1a1208" }}>
            What our customers say 💬
          </h2>
        </motion.div>

        {/* Carousel */}
        <div
          ref={scrollRef}
          className="overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="flex gap-4 md:gap-5" style={{ width: "max-content" }}>
            {/* Duplicate for seamless loop */}
            {[...REVIEWS, ...REVIEWS].map((review, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: (i % REVIEWS.length) * 0.08 }}
                className="shrink-0 w-[300px] sm:w-[340px] p-6 rounded-2xl"
                style={{ background: "#fff", border: "1px solid rgba(26,18,8,0.06)", boxShadow: "0 4px 16px -6px rgba(26,18,8,0.08)" }}
              >
                {/* Stars */}
                <div className="flex gap-0.5 mb-3">
                  {[...Array(review.stars)].map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5" style={{ fill: "#c9a84c", color: "#c9a84c" }} />
                  ))}
                </div>
                {/* Review text */}
                <p className="text-[13px] sm:text-sm leading-relaxed mb-4 font-serif italic" style={{ color: "rgba(26,18,8,0.7)" }}>
                  "{review.text}"
                </p>
                {/* Customer */}
                <div className="text-[10px] uppercase tracking-[0.15em] font-semibold" style={{ color: "#c9a84c" }}>
                  {review.name} | {review.product}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
