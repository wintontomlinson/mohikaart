import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useWishlist } from "@/lib/wishlist";
import { useCart } from "@/lib/cart";
import { supabase } from "@/integrations/supabase/client";
import { resolveImage, formatINR } from "@/lib/site";
import { toast } from "sonner";
import PageHeader from "@/components/site/PageHeader";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  original_price: number | null;
  image_url: string | null;
  badge: string | null;
  in_stock: boolean;
};

const WishlistPage = () => {
  const { ids, toggle, count } = useWishlist();
  const { add } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (ids.size === 0) { setProducts([]); setLoading(false); return; }
    supabase
      .from("products")
      .select("id, name, slug, price, original_price, image_url, badge, in_stock")
      .in("id", Array.from(ids))
      .then(({ data }) => {
        setProducts((data ?? []) as Product[]);
        setLoading(false);
      });
  }, [ids]);

  const handleAddToCart = (p: Product) => {
    add({ id: p.id, slug: p.slug, name: p.name, price: p.price, image_url: p.image_url });
    toast.success(`${p.name} added to cart!`);
  };

  return (
    <>
      <PageHeader
        eyebrow="Your Wishlist"
        title={<>Saved <em className="not-italic text-gold-grad">favorites.</em></>}
        subtitle={count > 0 ? `You have ${count} item${count > 1 ? "s" : ""} saved.` : "Your wishlist is empty."}
      />

      <section className="py-12 md:py-20">
        <div className="container max-w-5xl">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="ml-2 text-sm text-muted-foreground">Loading…</span>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
              <p className="font-serif text-2xl mb-2">Nothing saved yet.</p>
              <p className="text-muted-foreground mb-8">Browse our collection and tap the heart to save items you love.</p>
              <Link to="/shop" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-foreground text-background btn-glow text-sm tracking-wide">
                Browse Collection <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
              {products.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="group relative rounded-2xl overflow-hidden bg-white border border-border/50 shadow-soft"
                >
                  {/* Image */}
                  <Link to={`/product/${p.slug}`} className="block relative overflow-hidden" style={{ aspectRatio: "1/1" }}>
                    <img
                      src={resolveImage(p.image_url)}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    {p.badge && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[8px] uppercase tracking-wider font-bold bg-foreground/90 text-background">
                        {p.badge}
                      </span>
                    )}
                    {!p.in_stock && (
                      <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Out of Stock</span>
                      </div>
                    )}
                  </Link>

                  {/* Info */}
                  <div className="p-3">
                    <Link to={`/product/${p.slug}`} className="block">
                      <h3 className="text-sm font-medium leading-tight line-clamp-2 mb-1.5 hover:text-gold transition-colors">{p.name}</h3>
                    </Link>
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="font-semibold text-sm">{formatINR(p.price)}</span>
                      {p.original_price && p.original_price > p.price && (
                        <span className="text-xs line-through text-muted-foreground">{formatINR(p.original_price)}</span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAddToCart(p)}
                        disabled={!p.in_stock}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-foreground text-background text-[10px] uppercase tracking-wider font-semibold disabled:opacity-40 transition-all hover:opacity-90"
                      >
                        <ShoppingBag className="w-3 h-3" /> Add to Cart
                      </button>
                      <button
                        onClick={() => toggle(p.id)}
                        className="w-9 h-9 flex items-center justify-center rounded-lg border border-border hover:border-red-300 hover:bg-red-50 transition-colors"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-red-500" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default WishlistPage;
