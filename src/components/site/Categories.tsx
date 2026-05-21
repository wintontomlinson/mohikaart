import { Link } from "react-router-dom";
import { CATEGORIES } from "@/lib/products";
import { useInView } from "@/hooks/use-in-view";
import { useTilt } from "@/hooks/use-tilt";
import { ArrowUpRight } from "lucide-react";

const CategoryCard = ({ cat, index }: { cat: typeof CATEGORIES[number]; index: number }) => {
  const tiltRef = useTilt<HTMLDivElement>({ max: 6, glare: true, maxGlare: 0.12 });

  return (
    <Link to={`/shop?cat=${cat.slug}`} className="group block">
      <div
        ref={tiltRef}
        className="relative aspect-square rounded-2xl overflow-hidden"
        style={{ animationDelay: `${index * 0.08}s` }}
      >
        <img
          src={cat.image}
          alt={cat.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1208]/70 via-[#1a1208]/20 to-transparent group-hover:from-[#1a1208]/80 transition-all" />
        <div className="absolute bottom-4 left-4 right-4 transform group-hover:-translate-y-1 transition-transform">
          <p className="text-white font-medium text-sm">{cat.name}</p>
          <p className="text-white/70 text-xs flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
            SHOP NOW <ArrowUpRight className="w-3 h-3" />
          </p>
        </div>
      </div>
    </Link>
  );
};

const Categories = () => {
  const { ref, inView } = useInView();

  return (
    <section ref={ref} className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-12">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-[#c9a84c] mb-2">CATEGORIES</p>
          <h2 className="text-3xl md:text-4xl font-serif text-[#1a1208]">Curated collections.</h2>
        </div>
        <Link
          to="/shop"
          className="hidden sm:flex items-center gap-1 text-sm font-medium text-[#1a1208]/70 hover:text-[#c9a84c] transition-colors"
        >
          SHOP ALL CATEGORIES <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      <div className={`grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 ${inView ? "animate-fade-in" : "opacity-0"}`}>
        {CATEGORIES.slice(0, 6).map((cat, i) => (
          <CategoryCard key={cat.slug} cat={cat} index={i} />
        ))}
      </div>
    </section>
  );
};

export default Categories;
