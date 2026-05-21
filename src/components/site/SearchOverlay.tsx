import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { Link } from "react-router-dom";
import { products } from "@/lib/products";

interface Props {
  open: boolean;
  onClose: () => void;
}

const SearchOverlay = ({ open, onClose }: Props) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  const results = query.length > 1
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-[#1a1208]/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
      <div className="w-full max-w-2xl bg-[#fdf9f0] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-[#c9a84c]/10">
          <Search className="w-5 h-5 text-[#c9a84c]" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-lg outline-none placeholder:text-[#1a1208]/30"
          />
          <button onClick={onClose} className="p-1 rounded-full hover:bg-[#1a1208]/5">
            <X className="w-5 h-5" />
          </button>
        </div>

        {results.length > 0 && (
          <div className="max-h-80 overflow-y-auto p-4 space-y-2">
            {results.map((p) => (
              <Link
                key={p.id}
                to={`/product/${p.slug}`}
                onClick={onClose}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#c9a84c]/5 transition-colors"
              >
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-14 h-14 rounded-lg object-cover"
                  loading="lazy"
                />
                <div className="flex-1">
                  <p className="font-medium text-[#1a1208] text-sm">{p.name}</p>
                  <p className="text-xs text-[#1a1208]/50">{p.category}</p>
                </div>
                <p className="text-sm font-semibold text-[#c9a84c]">
                  ₹{p.price.toLocaleString("en-IN")}
                </p>
              </Link>
            ))}
          </div>
        )}

        {query.length > 1 && results.length === 0 && (
          <div className="p-8 text-center text-[#1a1208]/50 text-sm">
            No products found for "{query}"
          </div>
        )}

        {query.length <= 1 && (
          <div className="p-8 text-center text-[#1a1208]/40 text-sm">
            Start typing to search products...
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchOverlay;
