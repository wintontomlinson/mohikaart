import { Heart, ShoppingBag, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { Product } from "@/lib/products";
import { toast } from "sonner";

interface Props {
  product: Product;
  index?: number;
}

const ProductCard = ({ product, index = 0 }: Props) => {
  const { add } = useCart();
  const { has, toggle } = useWishlist();
  const isWished = has(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    add({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image_url: product.image,
    });
    toast.success("Added to cart");
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(product.id);
  };

  const badgeColor: Record<string, string> = {
    BESTSELLER: "bg-[#c9a84c] text-white",
    POPULAR: "bg-[#1a1208] text-white",
    PREMIUM: "bg-purple-600 text-white",
    NEW: "bg-green-600 text-white",
  };

  return (
    <Link
      to={`/product/${product.slug}`}
      className="group block"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      <div className="relative overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />

          {/* Badge */}
          <span className={`absolute top-3 left-3 px-2.5 py-1 text-[10px] font-bold tracking-wider rounded-full ${badgeColor[product.badge] || "bg-gray-600 text-white"}`}>
            {product.badge}
          </span>

          {/* Discount */}
          <span className="absolute top-3 right-3 px-2 py-1 bg-red-500 text-white text-[10px] font-bold rounded-full">
            -{product.discount}%
          </span>

          {/* Wishlist */}
          <button
            onClick={handleWishlist}
            className="absolute top-12 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${isWished ? "fill-red-500 text-red-500" : "text-[#1a1208]/50"}`}
            />
          </button>

          {/* Add to Cart overlay */}
          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={handleAddToCart}
              className="w-full py-3 bg-[#1a1208] text-white text-xs font-semibold tracking-wider rounded-full flex items-center justify-center gap-2 hover:bg-[#1a1208]/90 transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              Add to Cart
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-xs text-[#1a1208]/50 mb-1">{product.category}</p>
          <h3 className="font-medium text-sm text-[#1a1208] leading-snug mb-2 line-clamp-2">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <Star className="w-3.5 h-3.5 fill-[#c9a84c] text-[#c9a84c]" />
            <span className="text-xs font-medium text-[#1a1208]">{product.rating}</span>
            <span className="text-xs text-[#1a1208]/40">({product.reviews})</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-[#1a1208]">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            <span className="text-sm text-[#1a1208]/40 line-through">
              ₹{product.mrp.toLocaleString("en-IN")}
            </span>
          </div>

          {/* Tag */}
          <p className="text-[10px] text-[#c9a84c] font-medium mt-1.5 uppercase tracking-wider">
            {product.customizable ? "Customizable" : "Ready to Ship"}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
