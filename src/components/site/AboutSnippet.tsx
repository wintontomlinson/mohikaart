import { Link } from "react-router-dom";
import { IMAGES } from "@/lib/products";

const AboutSnippet = () => (
  <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
    <div className="grid md:grid-cols-2 gap-12 items-center">
      {/* Left - Image */}
      <div className="relative">
        <img
          src={IMAGES.craft_process}
          alt="Crafting process"
          className="w-full rounded-2xl shadow-xl object-cover aspect-[4/5]"
          loading="lazy"
        />
      </div>

      {/* Right - Content */}
      <div className="space-y-6">
        <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-[#c9a84c]">OUR STORY</p>
        <h2 className="text-3xl md:text-4xl font-serif text-[#1a1208]">
          Crafted with love since 2021
        </h2>
        <p className="text-[#1a1208]/60 leading-relaxed">
          Every piece handpoured with real flowers, gold detailing & heart.
          What started as a passion project has now touched over 2000+ lives
          across India with unique handcrafted keepsakes.
        </p>

        {/* Mini stats */}
        <div className="flex items-center gap-6 py-4">
          <div className="text-center">
            <p className="text-xl font-serif font-bold text-[#1a1208]">2000+</p>
            <p className="text-[10px] text-[#1a1208]/50 uppercase tracking-wider">Orders</p>
          </div>
          <div className="w-px h-8 bg-[#c9a84c]/20" />
          <div className="text-center">
            <p className="text-xl font-serif font-bold text-[#1a1208]">4.9<span className="text-[#c9a84c]">★</span></p>
            <p className="text-[10px] text-[#1a1208]/50 uppercase tracking-wider">Rating</p>
          </div>
          <div className="w-px h-8 bg-[#c9a84c]/20" />
          <div className="text-center">
            <p className="text-xl font-serif font-bold text-[#1a1208]">Pan India</p>
            <p className="text-[10px] text-[#1a1208]/50 uppercase tracking-wider">Delivery</p>
          </div>
        </div>

        <Link
          to="/about"
          className="inline-flex text-[#c9a84c] text-sm font-medium hover:underline"
        >
          Read Our Story &rarr;
        </Link>
      </div>
    </div>
  </section>
);

export default AboutSnippet;
