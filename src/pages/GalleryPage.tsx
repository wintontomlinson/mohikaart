import { useState } from "react";
import { Link } from "react-router-dom";
import { X, ChevronLeft, ChevronRight, Instagram, ShoppingBag } from "lucide-react";
import { GALLERY_IMAGES, IMAGES, CATEGORIES } from "@/lib/products";

const filters = [
  { name: "All", slug: "all" },
  ...CATEGORIES.slice(0, 7).map((c) => ({ name: c.name.replace(/s$/, ""), slug: c.slug })),
];

const GalleryPage = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = activeFilter === "all"
    ? GALLERY_IMAGES
    : GALLERY_IMAGES.filter((img) => img.category === activeFilter);

  const openLightbox = (i: number) => setLightbox(i);
  const closeLightbox = () => setLightbox(null);
  const prev = () => setLightbox((i) => (i !== null ? (i - 1 + filtered.length) % filtered.length : null));
  const next = () => setLightbox((i) => (i !== null ? (i + 1) % filtered.length : null));

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif text-[#1a1208] mb-3">Our Gallery</h1>
          <p className="text-[#1a1208]/60 max-w-md mx-auto">A glimpse into every piece poured with love</p>
          <a
            href="https://instagram.com/mohikaart"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 bg-[#c9a84c]/10 text-[#c9a84c] text-sm font-medium rounded-full hover:bg-[#c9a84c]/20"
          >
            <Instagram className="w-4 h-4" /> @mohikaart
          </a>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-4 mb-8 sticky top-16 md:top-20 z-20 bg-[#fdf9f0]/95 backdrop-blur-md pt-2 -mt-2">
          {filters.map((f) => (
            <button
              key={f.slug}
              onClick={() => setActiveFilter(f.slug)}
              className={`px-4 py-2 text-xs font-medium rounded-full whitespace-nowrap transition-colors ${
                activeFilter === f.slug
                  ? "bg-[#1a1208] text-[#fdf9f0]"
                  : "bg-white border border-[#1a1208]/10 text-[#1a1208]/70 hover:border-[#c9a84c]"
              }`}
            >
              {f.name}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
          {filtered.map((img, i) => (
            <div
              key={i}
              onClick={() => openLightbox(i)}
              className="group relative rounded-2xl overflow-hidden cursor-pointer break-inside-avoid"
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1208]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-start justify-end p-4">
                <p className="text-white text-sm font-medium">{img.alt}</p>
                <p className="text-white/60 text-xs capitalize">{img.category}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Instagram Strip */}
        <div className="mt-20 text-center">
          <h2 className="text-2xl font-serif text-[#1a1208] mb-6">As Seen On @mohikaart</h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {[IMAGES.g1, IMAGES.g2, IMAGES.g3, IMAGES.g4, IMAGES.g5, IMAGES.g6].map((src, i) => (
              <a
                key={i}
                href="https://instagram.com/mohikaart"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square rounded-lg overflow-hidden"
              >
                <img src={src} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />
                <div className="absolute inset-0 bg-[#1a1208]/0 group-hover:bg-[#1a1208]/40 transition-all flex items-center justify-center">
                  <Instagram className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </a>
            ))}
          </div>
          <a
            href="https://instagram.com/mohikaart"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a1208] text-[#fdf9f0] text-sm font-medium rounded-full mt-6 hover:bg-[#1a1208]/85"
          >
            Follow @mohikaart &rarr;
          </a>
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 py-16 bg-[#1a1208] rounded-3xl text-center px-8">
          <h2 className="text-2xl md:text-3xl font-serif text-[#fdf9f0] mb-4">See something you love?</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/shop"
              className="px-7 py-3.5 bg-[#c9a84c] text-[#1a1208] text-sm font-semibold tracking-wider rounded-full"
            >
              Shop Now &rarr;
            </Link>
            <Link
              to="/custom-order"
              className="px-7 py-3.5 border-2 border-[#fdf9f0]/20 text-[#fdf9f0] text-sm font-semibold tracking-wider rounded-full hover:border-[#c9a84c] hover:text-[#c9a84c]"
            >
              Custom Order &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div className="fixed inset-0 z-[90] bg-[#1a1208]/95 flex items-center justify-center p-4">
          <button onClick={closeLightbox} className="absolute top-6 right-6 text-white/70 hover:text-white">
            <X className="w-8 h-8" />
          </button>
          <button onClick={prev} className="absolute left-4 md:left-8 text-white/70 hover:text-white">
            <ChevronLeft className="w-10 h-10" />
          </button>
          <button onClick={next} className="absolute right-4 md:right-8 text-white/70 hover:text-white">
            <ChevronRight className="w-10 h-10" />
          </button>
          <div className="max-w-4xl max-h-[85vh]">
            <img
              src={filtered[lightbox].src}
              alt={filtered[lightbox].alt}
              className="max-w-full max-h-[80vh] object-contain rounded-xl"
            />
            <div className="flex items-center justify-between mt-4 px-2">
              <div>
                <p className="text-white font-medium">{filtered[lightbox].alt}</p>
                <p className="text-white/50 text-sm capitalize">{filtered[lightbox].category}</p>
              </div>
              <Link
                to="/shop"
                onClick={closeLightbox}
                className="px-5 py-2.5 bg-[#c9a84c] text-[#1a1208] text-xs font-semibold rounded-full flex items-center gap-1.5"
              >
                <ShoppingBag className="w-3.5 h-3.5" /> Shop this &rarr;
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
