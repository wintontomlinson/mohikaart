import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useProducts, ProductCard } from "./ProductCard";

/**
 * Featured Products, editorial 4-up showcase.
 * Sits above Best Sellers as a curated "this week's picks" feel.
 * Uses the same product schema; pulls top 4 featured items.
 */
const FeaturedProducts = () => {
  const { data } = useProducts({ featured: true, limit: 4 });

  return (
    <section className="py-16 md:py-20">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 md:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <p
              className="font-semibold uppercase mb-3"
              style={{ fontSize: "11px", color: "#C9964A", letterSpacing: "0.25em" }}
            >
              Featured
            </p>
            <h2
              className="font-display"
              style={{
                fontWeight: 400,
                fontSize: "clamp(1.85rem, 3.8vw, 2.6rem)",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                color: "#3D2B1F",
              }}
            >
              This week&apos;s{" "}
              <em
                className="font-serif italic"
                style={{ color: "#C9964A", fontWeight: 400 }}
              >
                favourites.
              </em>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 transition-colors"
              style={{
                fontSize: "12px",
                letterSpacing: "0.12em",
                fontWeight: 600,
                textTransform: "uppercase",
                color: "#3D2B1F",
                paddingBottom: "4px",
                borderBottom: "1px solid #C9964A",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#C9964A")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#3D2B1F")}
            >
              Explore Collection
              <ArrowRight style={{ width: 14, height: 14 }} />
            </Link>
          </motion.div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {data.length > 0
            ? data.map((p, i) => <ProductCard key={p.id} p={p} index={i} />)
            : Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={`skeleton-${i}`}
                  className="aspect-square animate-pulse"
                  style={{ borderRadius: "16px", background: "rgba(61,43,31,0.06)" }}
                  aria-hidden="true"
                />
              ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
