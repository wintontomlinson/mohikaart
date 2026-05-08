import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import PageHeader from "@/components/site/PageHeader";
import { ProductCard, Product } from "@/components/site/ProductCard";
import { supabase } from "@/integrations/supabase/client";

type Cat = { name: string; description: string | null };

const CategoryPage = () => {
  const { slug = "" } = useParams();
  const [cat, setCat] = useState<Cat | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    Promise.all([
      supabase.from("categories").select("name,description").eq("slug", slug).maybeSingle(),
      supabase.from("products")
        .select("id,slug,name,price,original_price,image_url,badge,short_description,category_slug")
        .eq("category_slug", slug).order("sort_order"),
    ]).then(([{ data: catData, error: e1 }, { data: prods, error: e2 }]) => {
      if (e1 || e2) { setError(true); setLoading(false); return; }
      setCat(catData);
      setProducts((prods ?? []) as Product[]);
      setLoading(false);
    }).catch(() => { setError(true); setLoading(false); });
  }, [slug]);

  return (
    <>
      <PageHeader
        eyebrow="Category"
        title={cat?.name ?? "Collection"}
        subtitle={cat?.description ?? "Browse this collection."}
      >
        <Link
          to="/categories"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          All categories
        </Link>
      </PageHeader>

      <section className="py-12 md:py-16">
        <div className="container">
          {error ? (
            <p className="text-center text-muted-foreground py-20">Couldn't load products. Please try again.</p>
          ) : loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-3xl bg-muted/40 aspect-[4/5] animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <p className="text-center text-muted-foreground py-20">No products in this category yet.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {products.map((p, i) => <ProductCard key={p.id} p={p} index={i} />)}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default CategoryPage;
