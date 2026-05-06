import PageHeader from "@/components/site/PageHeader";
import About from "@/components/site/About";
import WhyUs from "@/components/site/WhyUs";
import HowItWorks from "@/components/site/HowItWorks";

const AboutPage = () => (
  <>
    <PageHeader
      eyebrow="Our Story"
      title={<>Born from <em className="not-italic text-gold-grad">love</em>, made by hand.</>}
      subtitle="Mohika Art is a quiet rebellion against the disposable, a studio devoted to preserving the small, beautiful moments that make a life."
    />
    <About />
    <WhyUs />
    <HowItWorks />
  </>
);

export default AboutPage;
