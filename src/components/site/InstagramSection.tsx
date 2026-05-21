import { Instagram } from "lucide-react";
import { IMAGES } from "@/lib/products";

const images = [IMAGES.g1, IMAGES.g2, IMAGES.g3, IMAGES.g4, IMAGES.g5, IMAGES.g6];

const InstagramSection = () => (
  <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
    <div className="text-center mb-12">
      <h2 className="text-3xl md:text-4xl font-serif text-[#1a1208] mb-2">As Seen On</h2>
      <p className="text-[#c9a84c] italic font-serif text-lg">@mohikaart</p>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
      {images.map((src, i) => (
        <a
          key={i}
          href="https://instagram.com/mohikaart"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative aspect-square rounded-xl overflow-hidden"
        >
          <img
            src={src}
            alt={`Instagram post ${i + 1}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-[#1a1208]/0 group-hover:bg-[#1a1208]/50 transition-all flex items-center justify-center">
            <Instagram className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </a>
      ))}
    </div>

    <div className="text-center mt-8">
      <a
        href="https://instagram.com/mohikaart"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a1208] text-[#fdf9f0] text-sm font-semibold tracking-wider rounded-full hover:bg-[#1a1208]/85 transition-colors"
      >
        Follow @mohikaart &rarr;
      </a>
    </div>
  </section>
);

export default InstagramSection;
