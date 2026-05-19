import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

const HomeCTA = () => (
  <motion.section
    className="py-24 relative overflow-hidden"
    style={{ background: "linear-gradient(180deg, #FAF7F4 0%, #f5f0ea 50%, #FAF7F4 100%)" }}
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
  >
    {/* Decorative gold divider at top */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-[1px] bg-gradient-to-r from-transparent via-[#C9964A]/50 to-transparent" />

    {/* Subtle decorative elements */}
    <div className="absolute top-12 left-[10%] w-2 h-2 rounded-full bg-[#C9964A]/10" />
    <div className="absolute bottom-16 right-[15%] w-3 h-3 rounded-full bg-[#C9964A]/8" />
    <div className="absolute top-1/3 right-[8%] w-1.5 h-1.5 rounded-full bg-[#C9964A]/15" />

    <div className="max-w-[1280px] mx-auto px-6 lg:px-8 text-center relative">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <p
          style={{ fontSize: "11px", letterSpacing: "0.3em", textTransform: "uppercase", color: "#C9964A", fontWeight: 600, marginBottom: "16px" }}
        >
          Begin Your Story
        </p>
        <h2
          className="font-display"
          style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 400, lineHeight: 1.1, color: "#3D2B1F" }}
        >
          Ready to preserve your
          <br />
          most precious{" "}
          <em style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", color: "#C9964A" }}>
            moment
          </em>
          ?
        </h2>
        <p
          className="mt-5 mx-auto"
          style={{
            maxWidth: "520px",
            fontSize: "16px",
            color: "hsl(25 10% 38%)",
            lineHeight: 1.8,
          }}
        >
          Every piece begins with a conversation. Share your idea \u2014 a name, a date, a pressed bouquet \u2014 and we will craft something truly extraordinary, just for you.
        </p>
      </motion.div>

      <motion.div
        className="mt-10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <Link
          to="/contact"
          className="group inline-flex items-center justify-center rounded-full transition-all duration-300 hover:shadow-[0_12px_40px_-10px_rgba(61,43,31,0.4)] hover:-translate-y-0.5"
          style={{
            height: "56px",
            minWidth: "200px",
            padding: "0 36px",
            background: "#3D2B1F",
            color: "#FAF7F4",
            fontSize: "14px",
            fontWeight: 600,
            letterSpacing: "0.04em",
          }}
        >
          Begin Your Custom Piece
          <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
        </Link>
      </motion.div>

      <motion.a
        href="https://wa.me/917975590498"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 mt-5 transition-colors duration-300 hover:text-[#3D2B1F]"
        style={{ fontSize: "13px", color: "#C9964A", fontWeight: 500 }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <MessageCircle className="w-4 h-4" />
        Prefer WhatsApp? Message us directly
      </motion.a>
    </div>
  </motion.section>
);

export default HomeCTA;
