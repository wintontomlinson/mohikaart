import Hero from "@/components/site/Hero";
import TrustBar from "@/components/site/TrustBar";
import Categories from "@/components/site/Categories";
import HowItWorksSimple from "@/components/site/HowItWorksSimple";
import Showcase from "@/components/site/Showcase";
import Testimonials from "@/components/site/Testimonials";
import InstagramGallery from "@/components/site/InstagramGallery";
import CustomOrderBanner from "@/components/site/CustomOrderBanner";
import AboutSnippet from "@/components/site/AboutSnippet";
import Newsletter from "@/components/site/Newsletter";
import PageTransition from "@/components/site/PageTransition";

const Index = () => (
  <PageTransition>
    <h1 className="sr-only">
      Mohika Art. Luxury Handmade Resin Gifts, Personalised Keepsakes and
      Wedding Memory Preservation
    </h1>
    {/* 1. HERO */}
    <Hero />
    {/* 2. TRUST BAR — social proof strip */}
    <TrustBar />
    {/* 3. CATEGORIES — 3x2 grid with 3D tilt */}
    <Categories />
    {/* 4. HOW IT WORKS — 3-step simple process */}
    <HowItWorksSimple />
    {/* 5. BEST SELLERS */}
    <Showcase />
    {/* 6. TESTIMONIALS — glassmorphism card slider */}
    <Testimonials />
    {/* 7. CUSTOM ORDER CTA BANNER */}
    <CustomOrderBanner />
    {/* 8. INSTAGRAM GALLERY — masonry grid */}
    <InstagramGallery />
    {/* 9. ABOUT SNIPPET */}
    <AboutSnippet />
    {/* 10. NEWSLETTER / WHATSAPP */}
    <Newsletter />
    {/* 11. FOOTER — handled in SiteLayout */}
  </PageTransition>
);

export default Index;
