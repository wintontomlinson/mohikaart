import Hero from "@/components/site/Hero";
import Categories from "@/components/site/Categories";
import FeaturedProducts from "@/components/site/FeaturedProducts";
import Showcase from "@/components/site/Showcase";
import CustomOrderExperience from "@/components/site/CustomOrderExperience";
import Testimonials from "@/components/site/Testimonials";
import HomepageFAQ from "@/components/site/HomepageFAQ";

/**
 * Homepage, clean, conversion-focused luxury ecommerce flow.
 *
 * Section order (matches user spec):
 *   1. Hero
 *   2. Categories
 *   3. Featured Products
 *   4. Best Sellers (Showcase)
 *   5. Customization Preview (CustomOrderExperience)
 *   6. Testimonials
 *   7. FAQ
 *   8. Footer (rendered globally by SiteLayout)
 */
const Index = () => (
  <>
    <h1 className="sr-only">
      Mohika Art. Luxury Handmade Resin Gifts, Personalised Keepsakes &amp;
      Wedding Memory Preservation
    </h1>
    <Hero />
    <Categories />
    <FeaturedProducts />
    <Showcase />
    <CustomOrderExperience />
    <Testimonials />
    <HomepageFAQ />
  </>
);

export default Index;
