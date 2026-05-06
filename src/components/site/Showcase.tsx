import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useProducts, ProductCard } from "./ProductCard";

const Showcase = () => {
  const { data } = useProducts({ featured: true, limit: 6 });

  return (
    <section id="shop" className="relative py-28 md:py-40 bg-hero noise-overlay">
      <div className="container relative z-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div style={{ fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase", color: "hsl(34 58% 52%)", marginBottom: "1.25rem", fontWeight: 500 }}>The Collection</div>
            <h2 className="font-display leading-[1.04] tracking-[-0.03em] max-w-2xl" style={{ fontWeight: 300, fontSize: "clamp(2rem, 4vw, 3.6rem)" }}>
              Pieces that <em className="not-italic text-gold-grad animate-gradient-text" style={{ fontStyle: "italic", fontFamily: "var(--font-serif)" }}>tell</em> stories.
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link to="/shop" className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass border border-foreground/10 hover:bg-foreground hover:text-background transition-all duration-500 btn-magnetic group" style={{ fontSize: "11px", letterSpacing: "0.14em", fontWeight: 500, textTransform: "uppercase" }}>
              View Full Catalogue
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {data.map((p, i) => <ProductCard key={p.id} p={p} index={i} />)}
        </div>
      </div>
    </section>
  );
};

export default Showcase;
