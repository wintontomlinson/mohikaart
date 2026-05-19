import Hero from "@/components/site/Hero";
import TrustBar from "@/components/site/TrustBar";
import Categories from "@/components/site/Categories";
import Showcase from "@/components/site/Showcase";
import About from "@/components/site/About";
import WhyUs from "@/components/site/WhyUs";
import Testimonials from "@/components/site/Testimonials";
import CustomOrderExperience from "@/components/site/CustomOrderExperience";
import Gallery from "@/components/site/Gallery";
import HomepageFAQ from "@/components/site/HomepageFAQ";
import Contact from "@/components/site/Contact";

const Index = () => (
  <>
    <h1 className="sr-only">
      Mohika Art - Luxury Handmade Resin Gifts, Personalized Keepsakes &amp; Wedding Memory Preservation
    </h1>
    <Hero />
    <TrustBar />
    <Categories />
    <Showcase />
    <About />
    <WhyUs />
    <Testimonials />
    <CustomOrderExperience />
    <Gallery />
    <HomepageFAQ />
    <Contact />
  </>
);

export default Index;
