import Hero from "@/components/site/Hero";
import About from "@/components/site/About";
import Categories from "@/components/site/Categories";
import WhyUs from "@/components/site/WhyUs";
import HowItWorks from "@/components/site/HowItWorks";
import Showcase from "@/components/site/Showcase";
import Gallery from "@/components/site/Gallery";
import Testimonials from "@/components/site/Testimonials";

const Index = () => (
  <>
    <h1 className="sr-only">Mohika Art Customized Resin Crafts, Handmade Gifts & Memory Keepsakes</h1>
    <Hero />
    <About />
    <Categories />
    <WhyUs />
    <HowItWorks />
    <Showcase />
    <Gallery />
    <Testimonials />
  </>
);

export default Index;
