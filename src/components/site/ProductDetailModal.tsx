import { X, Star, Minus, Plus, ShoppingBag, Truck, Package, RotateCcw, Heart } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Product } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { toast } from "sonner";

interface Props {
  product: Product;
  onClose: () => void;
}

const ProductDetailModal = ({ product, onClose }: Props) => {
  const [qty, setQty] = useState(1);
  const { add } = useCart();

  const handleAdd = () => {
    add(
      { id: product.id, slug: product.slug, name: product.name, price: product.price, image_url: product.image },
      qty
    );
    toast.success("Added to cart");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#1a1208]/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#fdf9f0] rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-[#1a1208]/5"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid md:grid-cols-2 gap-0">
          {/* Image */}
          <div className="aspect-square">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none" />
          </div>

          {/* Info */}
          <div className="p-6 md:p-8 space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-[10px] font-bold tracking-wider rounded-full bg-[#c9a84c] text-white">
                {product.badge}
              </span>
              <span className="px-2.5 py-1 text-[10px] font-bold tracking-wider rounded-full bg-red-500 text-white">
                -{product.discount}%
              </span>
            </div>

            <h2 className="text-2xl font-serif text-[#1a1208]">{product.name}</h2>

            <p className="text-xs text-[#c9a84c] font-medium tracking-wider uppercase">
              HANDMADE {product.customizable ? "· CUSTOMIZABLE" : "· READY TO SHIP"}
            </p>

            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#c9a84c] text-[#c9a84c]" />
                ))}
              </div>
              <span className="text-sm text-[#1a1208]/60">{product.rating} ({product.reviews} reviews)</span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-serif font-bold text-[#1a1208]">₹{product.price.toLocaleString("en-IN")}</span>
              <span className="text-lg text-[#1a1208]/40 line-through">₹{product.mrp.toLocaleString("en-IN")}</span>
            </div>

            <p className="text-sm text-[#1a1208]/60 leading-relaxed line-clamp-3">{product.description}</p>

            {product.customizable && (
              <div className="bg-[#c9a84c]/5 border border-[#c9a84c]/20 rounded-xl p-3">
                <p className="text-xs text-[#1a1208]/70">
                  ✏️ Share your customization details after ordering
                </p>
              </div>
            )}

            {/* Features */}
            <div className="grid grid-cols-2 gap-2 text-xs text-[#1a1208]/60">
              <div className="flex items-center gap-1.5"><Heart className="w-3.5 h-3.5 text-[#c9a84c]" /> Handmade</div>
              <div className="flex items-center gap-1.5"><Package className="w-3.5 h-3.5 text-[#c9a84c]" /> Premium Packaging</div>
              <div className="flex items-center gap-1.5"><Truck className="w-3.5 h-3.5 text-[#c9a84c]" /> Pan India Delivery</div>
              <div className="flex items-center gap-1.5"><RotateCcw className="w-3.5 h-3.5 text-[#c9a84c]" /> Easy Returns</div>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-3">
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

            {/* Buttons */}
            <button
              onClick={handleAdd}
              className="w-full py-3.5 bg-[#1a1208] text-[#fdf9f0] text-sm font-semibold tracking-wider rounded-full flex items-center justify-center gap-2 hover:bg-[#1a1208]/90 transition-colors"
            >
              <ShoppingBag className="w-4 h-4" /> ADD TO CART
            </button>
            <Link
              to="/custom-order"
              onClick={onClose}
              className="block w-full py-3 border-2 border-[#1a1208]/10 text-[#1a1208] text-sm font-medium text-center rounded-full hover:border-[#c9a84c] hover:text-[#c9a84c] transition-colors"
            >
              Request Custom Version
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
