import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { getBestSellers } from "@/lib/products";
import ProductCard from "./ProductCard";
import { useInView } from "@/hooks/use-in-view";

const BestSellers = () => {
  const { ref, inView } = useInView();
  const bestsellers = getBestSellers();

  return (
    <section ref={ref} className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-12">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-[#c9a84c] mb-2">BEST SELLERS</p>
          <h2 className="text-3xl md:text-4xl font-serif text-[#1a1208]">Loved by everyone.</h2>
        </div>
        <Link
          to="/shop"
          className="hidden sm:flex items-center gap-2 text-sm font-medium text-[#1a1208]/70 hover:text-[#c9a84c] transition-colors"
        >
          VIEW ALL PRODUCTS <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 ${inView ? "animate-fade-in" : "opacity-0"}`}>
        {bestsellers.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>
    </section>
  );
};

export default BestSellers;
