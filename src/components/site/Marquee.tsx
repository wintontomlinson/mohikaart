const items = [
  "Handmade with Love",
  "Premium Resin Art",
  "Customized for You",
  "Luxury Packaging",
  "Pan India Delivery",
  "Memory Keepsakes",
  "Since 2021",
];

const Marquee = () => (
  <section className="relative overflow-hidden py-5 bg-[#1a1208]">
    {/* Blur fade edges */}
    <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#1a1208] to-transparent z-10" />
    <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#1a1208] to-transparent z-10" />

    <div className="marquee-strip flex whitespace-nowrap">
      {[...items, ...items, ...items, ...items].map((item, i) => (
        <span key={i} className="inline-flex items-center gap-4 mx-4">
          <span className="text-sm text-[#fdf9f0]/80 tracking-wider">{item}</span>
          <span className="text-[#c9a84c]">&#10022;</span>
        </span>
      ))}
    </div>
  </section>
);

export default Marquee;
