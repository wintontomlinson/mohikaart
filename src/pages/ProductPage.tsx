import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { Star, Minus, Plus, ShoppingBag, Heart, Truck, Package, RotateCcw, ChevronDown } from "lucide-react";
import { getProductBySlug, products } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { toast } from "sonner";
import ProductCard from "@/components/site/ProductCard";
import NotFound from "./NotFound";

const ProductPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const product = getProductBySlug(slug || "");
  const [qty, setQty] = useState(1);
  const [customNote, setCustomNote] = useState("");
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const { add } = useCart();
  const { has, toggle } = useWishlist();

  if (!product) return <NotFound />;

  const isWished = has(product.id);
  const related = products.filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id).slice(0, 4);

  const handleAdd = () => {
    add({ id: product.id, slug: product.slug, name: product.name, price: product.price, image_url: product.image }, qty);
    toast.success("Added to cart");
  };

  const accordions = [
    { key: "details", title: "Product Details", content: product.details },
    { key: "custom", title: "Customization Guide", content: "After placing your order, share your customization details (names, dates, colors, photos) via WhatsApp or email. We'll confirm the design with you before crafting." },
    { key: "shipping", title: "Shipping & Returns", content: product.shipping },
  ];

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="text-sm text-[#1a1208]/40 mb-8">
          <Link to="/" className="hover:text-[#c9a84c]">Home</Link> &gt;{" "}
          <Link to="/shop" className="hover:text-[#c9a84c]">Shop</Link> &gt;{" "}
          <span className="text-[#1a1208]">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left - Image */}
          <div>
            <div className="aspect-square rounded-3xl overflow-hidden bg-white shadow-sm">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>

          {/* Right - Info */}
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 text-[10px] font-bold tracking-wider rounded-full bg-[#c9a84c] text-white">
                {product.badge}
              </span>
              <span className="px-3 py-1 text-[10px] font-bold tracking-wider rounded-full bg-red-500 text-white">
                -{product.discount}% OFF
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-serif text-[#1a1208]">{product.name}</h1>

            <p className="text-xs text-[#c9a84c] font-semibold tracking-wider uppercase">
              HANDMADE {product.customizable ? "· CUSTOMIZABLE" : "· READY TO SHIP"}
            </p>

            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#c9a84c] text-[#c9a84c]" />
                ))}
              </div>
              <span className="text-sm text-[#1a1208]">{product.rating}</span>
              <span className="text-sm text-[#1a1208]/40">({product.reviews} reviews)</span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-serif font-bold text-[#1a1208]">₹{product.price.toLocaleString("en-IN")}</span>
              <span className="text-xl text-[#1a1208]/40 line-through">₹{product.mrp.toLocaleString("en-IN")}</span>
            </div>

            <p className="text-[#1a1208]/60 leading-relaxed">{product.description}</p>

            {/* Customization Box */}
            {product.customizable && (
              <div className="bg-[#c9a84c]/5 border border-[#c9a84c]/20 rounded-xl p-4 space-y-3">
                <p className="text-sm text-[#1a1208]/80 font-medium">
                  ✏️ This is customizable — share your details in the order note
                </p>
                <textarea
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder="Your customization details (names, dates, colors...)"
                  className="w-full px-4 py-3 border border-[#1a1208]/10 rounded-xl text-sm resize-none h-20 focus:outline-none focus:border-[#c9a84c] bg-white"
                />
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-[#1a1208]/60">Quantity:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-9 h-9 rounded-full border border-[#1a1208]/10 flex items-center justify-center hover:bg-[#1a1208]/5"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-lg font-medium w-8 text-center">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(10, q + 1))}
                  className="w-9 h-9 rounded-full border border-[#1a1208]/10 flex items-center justify-center hover:bg-[#1a1208]/5"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleAdd}
                className="flex-1 py-4 bg-[#1a1208] text-[#fdf9f0] text-sm font-semibold tracking-wider rounded-full flex items-center justify-center gap-2 hover:bg-[#1a1208]/90 transition-colors"
              >
                <ShoppingBag className="w-4 h-4" /> ADD TO CART
              </button>
              <button
                onClick={() => toggle(product.id)}
                className={`w-14 h-14 rounded-full border-2 flex items-center justify-center transition-colors ${
                  isWished ? "border-red-500 text-red-500" : "border-[#1a1208]/10 text-[#1a1208]/40 hover:border-red-500 hover:text-red-500"
                }`}
              >
                <Heart className={`w-5 h-5 ${isWished ? "fill-current" : ""}`} />
              </button>
            </div>

            <Link
              to="/custom-order"
              className="block w-full py-3.5 border-2 border-[#1a1208]/10 text-[#1a1208] text-sm font-medium text-center rounded-full hover:border-[#c9a84c] hover:text-[#c9a84c] transition-colors"
            >
              REQUEST CUSTOM VERSION
            </Link>

            {/* Feature Icons */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#c9a84c]/10">
              <div className="flex items-center gap-2 text-sm text-[#1a1208]/60">
                <Heart className="w-4 h-4 text-[#c9a84c]" /> Handmade
              </div>
              <div className="flex items-center gap-2 text-sm text-[#1a1208]/60">
                <Package className="w-4 h-4 text-[#c9a84c]" /> Premium Packaging
              </div>
              <div className="flex items-center gap-2 text-sm text-[#1a1208]/60">
                <Truck className="w-4 h-4 text-[#c9a84c]" /> 5-7 Day Delivery
              </div>
              <div className="flex items-center gap-2 text-sm text-[#1a1208]/60">
                <RotateCcw className="w-4 h-4 text-[#c9a84c]" /> Easy Returns
              </div>
            </div>

            {/* Accordions */}
            <div className="space-y-2 pt-4">
              {accordions.map((acc) => (
                <div key={acc.key} className="border border-[#1a1208]/5 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenAccordion(openAccordion === acc.key ? null : acc.key)}
                    className="w-full flex items-center justify-between px-5 py-4 text-sm font-medium text-[#1a1208] hover:bg-[#fdf9f0]/50"
                  >
                    {acc.title}
                    <ChevronDown className={`w-4 h-4 transition-transform ${openAccordion === acc.key ? "rotate-180" : ""}`} />
                  </button>
                  {openAccordion === acc.key && (
                    <div className="px-5 pb-4 text-sm text-[#1a1208]/60 leading-relaxed">
                      {acc.content}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-serif text-[#1a1208] mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
