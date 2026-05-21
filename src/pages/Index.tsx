import Hero from "@/components/site/Hero";
import FeaturedShowcase from "@/components/site/FeaturedShowcase";
import HowItWorksSimple from "@/components/site/HowItWorksSimple";
import Showcase from "@/components/site/Showcase";
import Testimonials from "@/components/site/Testimonials";
import InstagramGallery from "@/components/site/InstagramGallery";
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

    {/* 2. FEATURED SHOWCASE — Editorial asymmetric grid (replaces categories) */}
    <FeaturedShowcase />

    {/* 3. HOW IT WORKS — 3-step simple process */}
    <HowItWorksSimple />

    {/* 4. BEST SELLERS — Product showcase grid */}
    <Showcase />

    {/* 5. CUSTOM ORDER CTA BANNER */}
    <CustomOrderBanner />

    {/* 6. TESTIMONIALS */}
    <Testimonials />

    {/* 7. ABOUT SNIPPET — Brand story */}
    <AboutSnippet />

    {/* 8. INSTAGRAM GALLERY */}
    <InstagramGallery />

    {/* 9. NEWSLETTER / WHATSAPP */}
    <Newsletter />

    {/* FOOTER — handled in SiteLayout */}
  </>
);

export default Index;
