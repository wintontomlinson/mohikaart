import Hero from "@/components/site/Hero";
import Categories from "@/components/site/Categories";
import Showcase from "@/components/site/Showcase";
import Testimonials from "@/components/site/Testimonials";
import HomepageFAQ from "@/components/site/HomepageFAQ";

const Index = () => (
  <>
    <h1 className="sr-only">
      Mohika Art. Luxury Handmade Resin Gifts, Personalised Keepsakes and
      Wedding Memory Preservation
    </h1>
    <Hero />
    <Categories />
    <Showcase />
    <Testimonials />
    <HomepageFAQ />
  </>
);

export default Index;
