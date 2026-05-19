import Hero from "@/components/site/Hero";
import StatsStrip from "@/components/site/StatsStrip";
import Categories from "@/components/site/Categories";
import WhyUs from "@/components/site/WhyUs";
import HowItWorks from "@/components/site/HowItWorks";
import Gallery from "@/components/site/Gallery";
import HomeCTA from "@/components/site/HomeCTA";

const Index = () => (
  <>
    <h1 className="sr-only">
      Mohika Art – Luxury Handmade Resin Gifts, Personalized Keepsakes &amp; Wedding Memory Preservation
    </h1>
    <Hero />
    <StatsStrip />
    <Categories />
    <WhyUs />
    <HowItWorks />
    <Gallery />
    <HomeCTA />
  </>
);

export default Index;
