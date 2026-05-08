import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Plus, Minus, ShieldCheck, Truck, Sparkles, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { resolveImage, formatINR } from "@/lib/site";
import { useCart } from "@/lib/cart";
import { ProductCard, Product } from "@/components/site/ProductCard";

type Full = Product & { description: string | null; gallery: string[] };

const ProductPage = () => {
  const { slug = "" } = useParams();
  const [p, setP] = useState<Full | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(1);
  const [notFound, setNotFound] = useState(false);
  const { add } = useCart();

  useEffect(() => {
    setQty(1);
    setActive(0);
    setP(null);
    setNotFound(false);
    supabase.from("products").select("*").eq("slug", slug).maybeSingle()
      .then(({ data, error }) => {
        if (error || !data) { setNotFound(true); return; }
        const gallery = Array.isArray(data.gallery) ? (data.gallery as string[]) : [];
        setP({ ...(data as any), gallery });
        if (data.category_slug) {
          supabase.from("products")
            .select("id,slug,name,price,original_price,image_url,badge,short_description,category_slug")
            .eq("category_slug", data.category_slug).neq("id", data.id).limit(3)
            .then(({ data: rels }) => setRelated((rels ?? []) as Product[]));
        }
      });
  }, [slug]);

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-hero">
        <div className="text-center px-6">
          <p className="font-serif text-2xl mb-3">Product not found</p>
          <p className="text-muted-foreground text-sm mb-6">This product may have been removed or the link is incorrect.</p>
          <Link to="/shop" className="px-7 py-3 rounded-full bg-foreground text-background text-xs tracking-[0.15em] uppercase btn-glow">
            Browse Shop
          </Link>
        </div>
      </div>
    );
  }

  if (!p) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-hero">
        <div className="flex flex-col items-center gap-4">
          <motion.div
            className="w-10 h-10 rounded-full border-2 border-gold/40 border-t-gold"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-sm uppercase tracking-widest text-muted-foreground">Loading</p>
        </div>
      </div>
    );
  }

  const allImages = [p.image_url, ...(p.gallery || [])].filter(Boolean) as string[];
  const main = resolveImage(allImages[active] ?? p.image_url);

  return (
    <>
      <section className="relative pt-10 md:pt-14 pb-16 md:pb-24 bg-hero noise-overlay overflow-hidden">
        {/* Background blobs */}
        <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-blush/30 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-[30rem] h-[30rem] rounded-full bg-champagne/25 blur-3xl pointer-events-none" />

        <div className="container relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-10">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/shop" className="hover:text-foreground transition-colors">Shop</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground">{p.name}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            {/* Images */}
            <div>
              <motion.div
                key={active}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-3xl overflow-hidden shadow-luxe aspect-[4/5] bg-card relative"
              >
                <img src={main} alt={p.name} className="w-full h-full object-cover" />
                {p.badge && (
                  <div className="absolute top-5 left-5 px-3 py-1.5 rounded-full glass text-[10px] uppercase tracking-widest">
                    {p.badge}
                  </div>
                )}
              </motion.div>
              {allImages.length > 1 && (
                <div className="mt-4 grid grid-cols-5 gap-3">
                  {allImages.map((src, i) => (
                    <button
                      key={i}
                      onClick={() => setActive(i)}
                      className={`rounded-2xl overflow-hidden aspect-square border-2 transition-all duration-300 ${
                        i === active ? "border-gold shadow-soft" : "border-transparent hover:border-border"
                      }`}
                    >
                      <img src={resolveImage(src)} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl leading-tight">{p.name}</h1>
                {p.short_description && (
                  <p className="mt-4 text-muted-foreground text-lg leading-relaxed">{p.short_description}</p>
                )}

                <div className="mt-8 flex items-baseline gap-4">
                  <div className="font-display text-4xl md:text-5xl text-gold-grad">{formatINR(Number(p.price))}</div>
                  {p.original_price && Number(p.original_price) > Number(p.price) && (
                    <div className="text-lg text-muted-foreground line-through">{formatINR(Number(p.original_price))}</div>
                  )}
                </div>

                <div className="gold-divider my-8" />

                {p.description && (
                  <p className="text-foreground/80 leading-relaxed font-serif text-lg">{p.description}</p>
                )}

                {/* Qty + Add to Cart */}
                <div className="mt-10 flex items-center gap-4">
                  <div className="inline-flex items-center rounded-full border border-border bg-card">
                    <button
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="w-11 h-11 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center font-display text-xl">{qty}</span>
                    <button
                      onClick={() => setQty((q) => q + 1)}
                      className="w-11 h-11 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => add({ id: p.id, slug: p.slug, name: p.name, price: Number(p.price), image_url: p.image_url }, qty)}
                    className="flex-1 px-8 py-4 rounded-full bg-foreground text-background btn-glow inline-flex items-center justify-center gap-2 text-sm tracking-wide transition-all"
                  >
                    Add to Cart
                  </button>
                  <button className="w-12 h-12 rounded-full glass flex items-center justify-center hover:scale-110 hover:text-rose-500 transition-all duration-300">
                    <Heart className="w-4 h-4" />
                  </button>
                </div>

                {/* Trust badges */}
                <div className="mt-10 grid grid-cols-3 gap-4">
                  {[
                    { icon: Sparkles, label: "Handcrafted" },
                    { icon: ShieldCheck, label: "Premium Resin" },
                    { icon: Truck, label: "Free Delivery" },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="flex flex-col items-center gap-2 p-4 rounded-2xl glass text-center">
                      <Icon className="w-5 h-5 text-gold" strokeWidth={1.4} />
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="py-20 md:py-28">
          <div className="container">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-3xl md:text-5xl mb-12"
            >
              You may also <em className="not-italic text-gold-grad">love</em>
            </motion.h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {related.map((r, i) => <ProductCard key={r.id} p={r} index={i} />)}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default ProductPage;
