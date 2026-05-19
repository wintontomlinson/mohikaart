import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Truck,
  Zap,
  Heart,
  Package,
  Award,
  BookOpen,
  Ribbon,
  MapPin,
  Search,
  ArrowRight,
} from "lucide-react";
import packingImg from "@/assets/gallery-packing.jpg";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
};

const tiers = [
  {
    icon: Truck,
    title: "Standard Delivery",
    price: "FREE",
    desc: "5–7 business days · Pan India",
  },
  {
    icon: Zap,
    title: "Express Delivery",
    price: "₹250",
    desc: "2–3 business days · Major cities",
    featured: true,
  },
  {
    icon: Heart,
    title: "Wedding Priority",
    price: "₹450",
    desc: "Pre-arranged · Pre-event delivery",
  },
];

const inBox = [
  {
    icon: Package,
    title: "Premium velvet box",
    body: "Lined in soft champagne velvet, designed to be reused as a keepsake holder.",
  },
  {
    icon: Award,
    title: "Certificate of authenticity",
    body: "Hand-numbered card signed by Mohika, confirming your piece is one-of-a-kind.",
  },
  {
    icon: BookOpen,
    title: "Care card",
    body: "Quick-reference guide with tips on how to keep your keepsake gallery-worthy.",
  },
  {
    icon: Ribbon,
    title: "Satin ribbon & seal",
    body: "Hand-tied silk ribbon and wax seal, ready to gift the moment it arrives.",
  },
];

const cities = [
  "Mumbai",
  "Delhi NCR",
  "Bengaluru",
  "Hyderabad",
  "Pune",
  "Chennai",
  "Kolkata",
  "Ahmedabad",
  "Jaipur",
  "Chandigarh",
  "Lucknow",
  "Goa",
];

const ShippingPage = () => (
  <>
    {/* HERO */}
    <section
      className="relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #FAF7F4 0%, rgba(250,247,244,0.6) 60%, transparent 100%)",
      }}
    >
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 pt-28 pb-16 md:pt-36 md:pb-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-semibold uppercase mb-6"
          style={{
            fontSize: "11px",
            color: "#C9964A",
            letterSpacing: "0.25em",
          }}
        >
          Delivery & Shipping
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="font-display mx-auto"
          style={{
            fontWeight: 400,
            fontSize: "clamp(2.5rem, 5vw, 3.8rem)",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            color: "#3D2B1F",
            maxWidth: "20ch",
          }}
        >
          Carefully packed,{" "}
          <em
            className="font-serif italic"
            style={{ color: "#C9964A", fontWeight: 400 }}
          >
            safely delivered.
          </em>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-6 mx-auto"
          style={{
            fontSize: "16px",
            lineHeight: 1.75,
            color: "hsl(25 10% 42%)",
            maxWidth: "52ch",
          }}
        >
          Every Mohika piece travels in a velvet box, wrapped in tissue and tied with satin,
          ready to gift the moment it arrives.
        </motion.p>
      </div>
    </section>

    {/* SHIPPING TIERS */}
    <section className="max-w-[1280px] mx-auto px-6 lg:px-8 py-20">
      <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-14">
        <div
          className="font-semibold uppercase mb-5"
          style={{
            fontSize: "11px",
            color: "#C9964A",
            letterSpacing: "0.25em",
          }}
        >
          Shipping Options
        </div>
        <h2
          className="font-display"
          style={{
            fontWeight: 400,
            fontSize: "clamp(1.85rem, 3.8vw, 2.8rem)",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            color: "#3D2B1F",
          }}
        >
          Choose how it arrives
        </h2>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {tiers.map((t, i) => (
          <motion.div
            key={t.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.7,
              delay: i * 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={{ y: -6 }}
            className="p-8 transition-all duration-500"
            style={{
              background: t.featured ? "#3D2B1F" : "#ffffff",
              border: t.featured ? "1px solid #3D2B1F" : "1px solid #e5e0d8",
              borderRadius: "20px",
              color: t.featured ? "#FAF7F4" : "#3D2B1F",
              position: "relative",
              boxShadow: t.featured
                ? "0 20px 60px -20px rgba(61,43,31,0.4)"
                : "none",
            }}
          >
            <div
              className="flex items-center justify-center"
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "14px",
                background: t.featured ? "rgba(201,150,74,0.15)" : "#FAF7F4",
              }}
            >
              <t.icon
                strokeWidth={1.6}
                style={{ width: 22, height: 22, color: "#C9964A" }}
              />
            </div>
            <h3
              className="mt-5 font-display"
              style={{
                fontWeight: 400,
                fontSize: "22px",
                color: t.featured ? "#FAF7F4" : "#3D2B1F",
                letterSpacing: "-0.01em",
                lineHeight: 1.2,
              }}
            >
              {t.title}
            </h3>
            <div
              className="mt-2 font-serif"
              style={{
                fontSize: "26px",
                color: "#C9964A",
                fontWeight: 500,
                letterSpacing: "0.01em",
              }}
            >
              {t.price}
            </div>
            <p
              className="mt-3"
              style={{
                fontSize: "13px",
                lineHeight: 1.7,
                color: t.featured ? "rgba(250,247,244,0.7)" : "#6B7280",
              }}
            >
              {t.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>

    {/* PACKAGING SECTION */}
    <section style={{ background: "#FAF7F4" }}>
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div {...fadeUp}>
            <div
              className="overflow-hidden shadow-luxe"
              style={{
                aspectRatio: "4 / 5",
                borderRadius: "24px",
              }}
            >
              <img
                src={packingImg}
                alt="Mohika Art packaging"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </motion.div>

          <motion.div
            {...fadeUp}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="font-semibold uppercase mb-5"
              style={{
                fontSize: "11px",
                color: "#C9964A",
                letterSpacing: "0.25em",
              }}
            >
              Inside The Box
            </div>
            <h2
              className="font-display"
              style={{
                fontWeight: 400,
                fontSize: "clamp(1.85rem, 3.8vw, 2.8rem)",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                color: "#3D2B1F",
              }}
            >
              Every detail considered.
            </h2>
            <p
              className="mt-5"
              style={{
                fontSize: "16px",
                lineHeight: 1.75,
                color: "hsl(25 10% 42%)",
              }}
            >
              Our packaging is part of the gift, designed to be opened slowly, kept on a
              shelf, and remembered.
            </p>

            <div className="mt-8 grid sm:grid-cols-2 gap-4">
              {inBox.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.07 }}
                  className="p-5"
                  style={{
                    background: "#ffffff",
                    border: "1px solid #e5e0d8",
                    borderRadius: "16px",
                  }}
                >
                  <div
                    className="flex items-center justify-center"
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "10px",
                      background: "#FAF7F4",
                    }}
                  >
                    <item.icon
                      strokeWidth={1.6}
                      style={{ width: 18, height: 18, color: "#C9964A" }}
                    />
                  </div>
                  <div
                    className="mt-3"
                    style={{
                      fontSize: "14px",
                      fontWeight: 500,
                      color: "#3D2B1F",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {item.title}
                  </div>
                  <p
                    className="mt-1.5"
                    style={{
                      fontSize: "12px",
                      lineHeight: 1.65,
                      color: "#6B7280",
                    }}
                  >
                    {item.body}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>

    {/* TRACKING INFO */}
    <section className="max-w-3xl mx-auto px-6 lg:px-8 py-20">
      <motion.div
        {...fadeUp}
        className="p-8 md:p-10"
        style={{
          background: "#ffffff",
          border: "1px solid #e5e0d8",
          borderRadius: "24px",
          boxShadow: "0 20px 60px -20px rgba(0,0,0,0.06)",
        }}
      >
        <div className="flex items-start gap-5">
          <div
            className="shrink-0 flex items-center justify-center"
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "14px",
              background: "#FAF7F4",
            }}
          >
            <Search
              strokeWidth={1.6}
              style={{ width: 22, height: 22, color: "#C9964A" }}
            />
          </div>
          <div className="flex-1">
            <div
              className="font-semibold uppercase mb-3"
              style={{
                fontSize: "11px",
                color: "#C9964A",
                letterSpacing: "0.25em",
              }}
            >
              Tracking
            </div>
            <h3
              className="font-display"
              style={{
                fontWeight: 400,
                fontSize: "clamp(1.4rem, 2.4vw, 1.75rem)",
                color: "#3D2B1F",
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
              }}
            >
              Always know where your piece is.
            </h3>
            <p
              className="mt-4"
              style={{
                fontSize: "15px",
                lineHeight: 1.75,
                color: "hsl(25 10% 42%)",
              }}
            >
              The moment your order ships, we send a tracking link via WhatsApp and email.
              Mohika personally checks every shipment until it lands at your door, if
              anything looks off, we are already on it.
            </p>
            <Link
              to="/contact"
              className="mt-6 inline-flex items-center gap-2"
              style={{
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#C9964A",
              }}
            >
              Need help with an order?
              <ArrowRight style={{ width: 14, height: 14 }} />
            </Link>
          </div>
        </div>
      </motion.div>
    </section>

    {/* SHIPPING MAP */}
    <section style={{ background: "#2C1F14" }}>
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-20 text-center">
        <motion.div
          {...fadeUp}
          className="inline-flex items-center justify-center mb-6"
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "14px",
            background: "rgba(201,150,74,0.15)",
            border: "1px solid rgba(201,150,74,0.3)",
          }}
        >
          <MapPin
            strokeWidth={1.6}
            style={{ width: 22, height: 22, color: "#C9964A" }}
          />
        </motion.div>
        <motion.h2
          {...fadeUp}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="font-display mx-auto"
          style={{
            fontWeight: 400,
            fontSize: "clamp(1.85rem, 3.8vw, 2.8rem)",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            color: "#FAF7F4",
            maxWidth: "22ch",
          }}
        >
          We deliver across{" "}
          <em
            className="font-serif italic"
            style={{ color: "#C9964A", fontWeight: 400 }}
          >
            India.
          </em>
        </motion.h2>
        <motion.p
          {...fadeUp}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-5 mx-auto"
          style={{
            fontSize: "15px",
            lineHeight: 1.75,
            color: "rgba(250,247,244,0.7)",
            maxWidth: "44ch",
          }}
        >
          From metros to small towns, if there is a pincode, we can reach it. International
          shipping launching in 2025.
        </motion.p>

        <motion.div
          {...fadeUp}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-10 flex flex-wrap justify-center gap-2.5 max-w-3xl mx-auto"
        >
          {cities.map((c) => (
            <span
              key={c}
              className="rounded-full"
              style={{
                fontSize: "12px",
                fontWeight: 500,
                color: "rgba(250,247,244,0.85)",
                background: "rgba(250,247,244,0.06)",
                border: "1px solid rgba(250,247,244,0.1)",
                padding: "8px 16px",
                letterSpacing: "0.02em",
              }}
            >
              {c}
            </span>
          ))}
          <span
            className="rounded-full"
            style={{
              fontSize: "12px",
              fontWeight: 500,
              color: "#C9964A",
              background: "rgba(201,150,74,0.1)",
              border: "1px solid rgba(201,150,74,0.3)",
              padding: "8px 16px",
              letterSpacing: "0.02em",
            }}
          >
            + every PIN code in India
          </span>
        </motion.div>
      </div>
    </section>
  </>
);

export default ShippingPage;
