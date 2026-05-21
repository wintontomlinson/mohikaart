import { motion, useInView, AnimatePresence } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, useEffect, useCallback } from "react";

const REVIEWS = [
  { stars: 5, text: "Absolutely beautiful! The name keychain I ordered for my best friend's birthday was even more stunning in person. The craftsmanship is truly exceptional.", name: "Priya S.", product: "Name Keychain", location: "Mumbai" },
  { stars: 5, text: "The resin tray is a showstopper. Every guest asks where I got it from. Packaging was also super premium — felt like unwrapping luxury!", name: "Ananya M.", product: "Resin Tray", location: "Delhi" },
  { stars: 5, text: "Got our wedding bouquet preserved as a keepsake. We will treasure it forever. Worth every rupee! The attention to detail is incredible.", name: "Sneha & Rahul", product: "Wedding Keepsake", location: "Bangalore" },
  { stars: 5, text: "Ordered a custom photo frame as an anniversary gift. My wife cried happy tears. The quality exceeded all expectations. Highly recommended!", name: "Vikram T.", product: "Photo Frame", location: "Pune" },
  { stars: 5, text: "Fast delivery, perfect packaging and the bookmark set is just gorgeous. Already placing my second order! Best gifting option ever.", name: "Meera K.", product: "Bookmark Set", location: "Hyderabad" },
];

const EASE = [0.22, 1, 0.36, 1] as const;

const Testimonials = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  const next = useCallback(() => {
    setDirection(1);
    setActive((prev) => (prev + 1) % REVIEWS.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setActive((prev) => (prev - 1 + REVIEWS.length) % REVIEWS.length);
  }, []);

  // Auto-advance
  useEffect(() => {
    timerRef.current = setInterval(next, 5000);
    return () => clearInterval(timerRef.current);
  }, [next]);

  const resetTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(next, 5000);
  };

  const handleNext = () => { next(); resetTimer(); };
  const handlePrev = () => { prev(); resetTimer(); };

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0, scale: 0.95 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0, scale: 0.95 }),
  };

  return (
    <section ref={ref} className="py-20 md:py-28 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div
          className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px] opacity-30"
          style={{ background: "hsl(38 62% 88%)" }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full blur-[100px] opacity-20"
          style={{ background: "hsl(348 56% 92%)" }}
        />
      </div>

      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
          className="text-center mb-14"
        >
          <p className="text-[11px] uppercase tracking-[0.25em] font-semibold mb-3" style={{ color: "#c9a84c" }}>
            Testimonials
          </p>
          <h2 className="font-display" style={{ fontWeight: 400, fontSize: "clamp(1.85rem, 3.8vw, 2.6rem)", lineHeight: 1.1, letterSpacing: "-0.02em", color: "#1a1208" }}>
            Loved by{" "}
            <em className="font-serif italic" style={{ color: "#c9a84c", fontWeight: 400 }}>
              thousands.
            </em>
          </h2>
        </motion.div>

        {/* Main testimonial card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
          className="max-w-[720px] mx-auto"
        >
          <div
            className="relative rounded-3xl p-8 md:p-12"
            style={{
              background: "rgba(255,255,255,0.7)",
              backdropFilter: "blur(24px) saturate(160%)",
              WebkitBackdropFilter: "blur(24px) saturate(160%)",
              border: "1px solid rgba(201,168,76,0.12)",
              boxShadow: "0 24px 64px -16px rgba(26,18,8,0.1), inset 0 1px 0 rgba(255,255,255,0.8)",
            }}
          >
            {/* Quote icon */}
            <div
              className="absolute -top-4 left-8 w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: "#c9a84c", boxShadow: "0 4px 16px -4px rgba(201,168,76,0.5)" }}
            >
              <Quote className="w-4 h-4 text-white" fill="white" />
            </div>

            {/* Animated review */}
            <div className="min-h-[200px] flex items-center justify-center">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={active}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.5, ease: EASE }}
                  className="text-center"
                >
                  {/* Stars */}
                  <div className="flex justify-center gap-1 mb-5">
                    {[...Array(REVIEWS[active].stars)].map((_, j) => (
                      <motion.div
                        key={j}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: j * 0.08, duration: 0.3, type: "spring" }}
                      >
                        <Star className="w-4 h-4" style={{ fill: "#c9a84c", color: "#c9a84c" }} />
                      </motion.div>
                    ))}
                  </div>

                  {/* Review text */}
                  <p
                    className="font-serif italic text-lg md:text-xl leading-relaxed mb-6"
                    style={{ color: "rgba(26,18,8,0.75)" }}
                  >
                    "{REVIEWS[active].text}"
                  </p>

                  {/* Customer info */}
                  <div className="flex items-center justify-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold"
                      style={{ background: "rgba(201,168,76,0.12)", color: "#c9a84c" }}
                    >
                      {REVIEWS[active].name.charAt(0)}
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-semibold" style={{ color: "#1a1208" }}>
                        {REVIEWS[active].name}
                      </div>
                      <div className="text-[11px]" style={{ color: "rgba(26,18,8,0.5)" }}>
                        {REVIEWS[active].product} · {REVIEWS[active].location}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6 pt-6" style={{ borderTop: "1px solid rgba(201,168,76,0.1)" }}>
              <button
                onClick={handlePrev}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                style={{ border: "1px solid rgba(26,18,8,0.1)", color: "rgba(26,18,8,0.5)" }}
                aria-label="Previous review"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Dots */}
              <div className="flex items-center gap-2">
                {REVIEWS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setDirection(i > active ? 1 : -1);
                      setActive(i);
                      resetTimer();
                    }}
                    className="relative"
                    aria-label={`Go to review ${i + 1}`}
                  >
                    <motion.div
                      className="rounded-full"
                      animate={{
                        width: i === active ? 24 : 8,
                        height: 8,
                        background: i === active ? "#c9a84c" : "rgba(26,18,8,0.12)",
                      }}
                      transition={{ duration: 0.3, ease: EASE }}
                    />
                  </button>
                ))}
              </div>

              <button
                onClick={handleNext}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                style={{ border: "1px solid rgba(26,18,8,0.1)", color: "rgba(26,18,8,0.5)" }}
                aria-label="Next review"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Bottom mini reviews strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4, ease: EASE }}
          className="flex justify-center gap-4 mt-10 flex-wrap"
        >
          {REVIEWS.map((r, i) => (
            <motion.button
              key={i}
              onClick={() => {
                setDirection(i > active ? 1 : -1);
                setActive(i);
                resetTimer();
              }}
              className="px-4 py-2.5 rounded-xl text-[11px] font-medium transition-all duration-300"
              animate={{
                background: i === active ? "rgba(201,168,76,0.12)" : "rgba(255,255,255,0.5)",
                borderColor: i === active ? "rgba(201,168,76,0.3)" : "rgba(26,18,8,0.06)",
                scale: i === active ? 1.05 : 1,
              }}
              style={{ border: "1px solid" }}
              whileHover={{ scale: 1.05 }}
            >
              <span style={{ color: i === active ? "#c9a84c" : "rgba(26,18,8,0.5)" }}>
                {r.name} — {r.product}
              </span>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
