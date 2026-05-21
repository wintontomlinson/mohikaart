import Hero from "@/components/site/Hero";
import Categories from "@/components/site/Categories";
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
      Mohika Art. Luxury Handmade Resin Gifts, Personalised Keepsakes and
      Wedding Memory Preservation
    </h1>
    {/* 1. HERO — DO NOT CHANGE */}
    <Hero />
    {/* 2. MARQUEE already inside Hero — speed fixed via CSS */}
    {/* 3. CATEGORIES — 3x2 grid with 3D tilt */}
    <Categories />
    {/* 4. HOW IT WORKS — 3-step simple process */}
    <HowItWorksSimple />
    {/* 5. BEST SELLERS */}
    <Showcase />
    {/* 6. TESTIMONIALS */}
    <Testimonials />
    {/* 7. INSTAGRAM GALLERY */}
    <InstagramGallery />
    {/* 8. CUSTOM ORDER CTA BANNER */}
    <CustomOrderBanner />
    {/* 9. ABOUT SNIPPET */}
    <AboutSnippet />
    {/* 10. NEWSLETTER / WHATSAPP */}
    <Newsletter />
    {/* 11. FOOTER — handled in SiteLayout */}
  </>
);

export default Index;
