import { Link } from "react-router-dom";

const CustomOrderCTA = () => (
  <section className="relative py-20 bg-[#1a1208] overflow-hidden">
    {/* Gold glow decoration */}
    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-64 h-64 bg-[#c9a84c]/10 rounded-full blur-3xl" />

    <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 className="text-3xl md:text-4xl font-serif text-[#fdf9f0] mb-4">
        Want something truly one-of-a-kind?
      </h2>
      <p className="text-[#fdf9f0]/60 text-lg mb-8 max-w-lg mx-auto">
        Share your idea — we'll craft it just for you.
      </p>
      <Link
        to="/custom-order"
        className="group relative inline-flex items-center gap-2 px-8 py-4 bg-[#c9a84c] text-[#1a1208] text-sm font-semibold tracking-wider rounded-full overflow-hidden hover:bg-[#b8933f] transition-colors"
      >
        <span className="relative z-10">REQUEST CUSTOM ORDER &rarr;</span>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      </Link>
    </div>
  </section>
);

export default CustomOrderCTA;
