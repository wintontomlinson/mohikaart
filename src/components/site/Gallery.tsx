import g1 from "@/assets/gallery-pouring.jpg";
import g2 from "@/assets/gallery-packing.jpg";
import g3 from "@/assets/gallery-flatlay.jpg";

const images = [g1, g2, g3];

const Gallery = () => (
  <section className="py-20">
    <div className="max-w-[1280px] mx-auto px-8">
      <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <h2
          className="font-display"
          style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 400, lineHeight: 1.1 }}
        >
          From our studio to your heart.
        </h2>
        <a
          href="https://instagram.com/mohikaart"
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: "13px", color: "#C9964A", fontWeight: 500 }}
        >
          @MOHIKAART ↗
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {images.map((src, i) => (
          <a
            key={i}
            href="https://instagram.com/mohikaart"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden rounded-[10px]"
            style={{ height: "300px" }}
          >
            <img
              src={src}
              alt={`Mohika Art studio ${i + 1}`}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.04]"
            />
            {/* Dark overlay + text on hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
              <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Follow @mohikaart
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  </section>
);

export default Gallery;
