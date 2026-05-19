import Hero from "@/components/site/Hero";
import TrustBar from "@/components/site/TrustBar";
import Categories from "@/components/site/Categories";
import Showcase from "@/components/site/Showcase";
import WhyUs from "@/components/site/WhyUs";
import CustomOrderExperience from "@/components/site/CustomOrderExperience";
import Testimonials from "@/components/site/Testimonials";
import HomepageFAQ from "@/components/site/HomepageFAQ";

const Index = () => (
  <>
    <h1 className="sr-only">
      Mohika Art - Luxury Handmade Resin Gifts, Personalized Keepsakes &amp; Wedding Memory Preservation
    </h1>
    <Hero />
    <TrustBar />
    <Categories />
    <Showcase />
    <WhyUs />
    <CustomOrderExperience />
    <Testimonials />
    <HomepageFAQ />
  </>
);

export default Index;
