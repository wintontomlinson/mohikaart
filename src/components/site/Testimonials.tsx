import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

const reviews = [
  {
    name: "Aanya Mehta",
    city: "Mumbai",
    avatar: "AM",
    text: "I gifted the wedding bouquet block to my sister and she literally cried. The detail, the gold flakes, the packaging — pure luxury.",
    rating: 5,
    product: "Bridal Bouquet Preservation",
  },
  {
    name: "Riya Kapoor",
    city: "Delhi",
    avatar: "RK",
    text: "The name keychain looks like a piece of jewellery. Mohika personally messaged for every tiny detail. Beyond worth it.",
    rating: 5,
    product: "Name Keychain",
  },
  {
    name: "Saanvi Iyer",
    city: "Bengaluru",
    avatar: "SI",
    text: "Ordered the couple frame for our anniversary. It feels heirloom — something I'll pass on. Pictures don't do it justice.",
    rating: 5,
    product: "Couple Photo Frame",
  },
  {
    name: "Priya Sharma",
    city: "Jaipur",
    avatar: "PS",
    text: "The corporate gift hampers for our team were absolutely stunning. Every single person was in awe. Will definitely order again!",
    rating: 5,
    product: "Corporate Gift Hamper",
  },
  {
    name: "Neha Gupta",
    city: "Pune",
    avatar: "NG",
    text: "I ordered a custom tray with my baby's first flowers. It's the most precious thing I own. Thank you Mohika for making memories tangible.",
    rating: 5,
    product: "Custom Resin Tray",
  },
];

const Testimonials = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % reviews.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + reviews.length) % reviews.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(next, 5500);
    return () => clearInterval(interval);
  }, [next]);

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 280 : -280, opacity: 0, scale: 0.92 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -280 : 280, opacity: 0, scale: 0.92 }),
  };

  return (
    <section
      className="relative py-28 md:py-40 overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 50% 0%, hsl(348 58% 94%/0.5), transparent), hsl(36 42% 98%)",
      }}
    >
      {/* Floating decorative elements */}
      <motion.div
        className="absolute top-20 left-10 w-32 h-32 rounded-full bg-gold/8 blur-3xl"
        animate={{ scale: [1, 1.4, 1], y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-48 h-48 rounded-full bg-champagne/20 blur-3xl"
        animate={{ scale: [1, 1.2, 1], x: [0, 15, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-lavender/8 blur-3xl pointer-events-none"
        animate={{ rotate: 360 }}
        transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
      />

      {/* Big quote marks */}
      <div className="absolute top-16 left-8 opacity-[0.035] pointer-events-none hidden lg:block">
        <Quote className="w-40 h-40 text-gold rotate-180" />
      </div>
      <div className="absolute bottom-16 right-8 opacity-[0.035] pointer-events-none hidden lg:block">
        <Quote className="w-40 h-40 text-gold" />
      </div>

      <div className="container relative z-10">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="eyebrow mb-5 flex items-center justify-center gap-2"
          >
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3" style={{ fill: "hsl(34 58% 52%)", color: "hsl(34 58% 52%)" }} />
              ))}
            </div>
            Words of Love
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-display leading-[1.04] tracking-[-0.03em]"
            style={{ fontWeight: 300, fontSize: "clamp(2rem, 4vw, 3.6rem)" }}
          >
            Loved by hearts
            <br />
            <em
              className="not-italic shimmer-text"
              style={{ fontStyle: "italic", fontFamily: "var(--font-serif)" }}
            >
              across India.
            </em>
          </motion.h2>
        </div>

        {/* Carousel */}
        <div className="relative max-w-4xl mx-auto" style={{ perspective: "1200px" }}>
          <div className="relative h-[300px] md:h-[260px] overflow-hidden">
            <AnimatePresence custom={direction} mode="wait">
              <motion.blockquote
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 frost-card rounded-3xl p-8 md:p-12 shadow-luxe text-center flex flex-col items-center justify-center"
              >
                {/* Avatar circle */}
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-background mb-5 shrink-0"
                  style={{ background: "linear-gradient(135deg, hsl(34 58% 52%), hsl(348 58% 68%))" }}
                >
                  {reviews[current].avatar}
                </div>

                <div className="flex gap-1 mb-4 text-gold">
                  {Array.from({ length: reviews[current].rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                <p
                  className="font-serif leading-[1.72] text-foreground/88 max-w-2xl"
                  style={{ fontSize: "clamp(0.98rem, 1.8vw, 1.18rem)", fontWeight: 400 }}
                >
                  "{reviews[current].text}"
                </p>

                <footer className="mt-6 flex flex-col items-center gap-1">
                  <div
                    className="font-display"
                    style={{ fontSize: "clamp(0.95rem, 1.4vw, 1.1rem)", fontWeight: 400, letterSpacing: "-0.01em" }}
                  >
                    {reviews[current].name}
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      style={{
                        fontSize: "9px",
                        letterSpacing: "0.28em",
                        textTransform: "uppercase",
                        color: "hsl(25 10% 52%)",
                      }}
                    >
                      {reviews[current].city}
                    </div>
                    <span className="text-gold/40">·</span>
                    <div
                      style={{
                        fontSize: "9px",
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: "hsl(34 58% 52%/0.75)",
                        fontStyle: "italic",
                      }}
                    >
                      {reviews[current].product}
                    </div>
                  </div>
                </footer>
              </motion.blockquote>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-6 mt-8">
            <button
              onClick={prev}
              className="w-12 h-12 rounded-full glass flex items-center justify-center hover:shadow-soft hover:scale-110 transition-all duration-300"
              aria-label="Previous review"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex gap-2">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDirection(i > current ? 1 : -1);
                    setCurrent(i);
                  }}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    i === current ? "w-8 bg-gold" : "w-2 bg-border hover:bg-gold/50"
                  }`}
                  aria-label={`Go to review ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-12 h-12 rounded-full glass flex items-center justify-center hover:shadow-soft hover:scale-110 transition-all duration-300"
              aria-label="Next review"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 grid grid-cols-3 gap-4 max-w-xl mx-auto"
        >
          {[
            { value: "2000+", label: "Happy Customers" },
            { value: "4.9★",  label: "Average Rating" },
            { value: "100%",  label: "Handmade" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.35 + i * 0.1 }}
              className="text-center p-5 rounded-2xl glass hover:shadow-soft transition-all duration-300"
            >
              <div className="font-display text-2xl md:text-3xl text-gold-grad">{stat.value}</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1.5">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
