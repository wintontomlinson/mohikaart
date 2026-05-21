import Hero from "@/components/site/Hero";
import Showcase from "@/components/site/Showcase";
import Testimonials from "@/components/site/Testimonials";
import CustomOrderBanner from "@/components/site/CustomOrderBanner";
import AboutSnippet from "@/components/site/AboutSnippet";
import Newsletter from "@/components/site/Newsletter";

const Index = () => (
  <>
    <h1 className="sr-only">
      Mohika Art — Luxury Handmade Resin Gifts, Personalised Keepsakes and
      Wedding Memory Preservation
    </h1>

    {/* 1. HERO — Cinematic, immersive, luxury */}
    <Hero />

    {/* 2. BEST SELLERS — Product showcase grid */}
    <Showcase />

    {/* 3. CUSTOM ORDER CTA BANNER */}
    <CustomOrderBanner />

    {/* 4. TESTIMONIALS */}
    <Testimonials />

    {/* 5. ABOUT SNIPPET — Brand story */}
    <AboutSnippet />

    {/* 6. NEWSLETTER / WHATSAPP */}
    <Newsletter />

    {/* FOOTER — handled in SiteLayout */}
  </>
);

export default Index;
