import PageHeader from "@/components/site/PageHeader";
import Gallery from "@/components/site/Gallery";
import Testimonials from "@/components/site/Testimonials";

const GalleryPage = () => (
  <>
    <PageHeader
      eyebrow="Gallery"
      title={<>Behind the <em className="not-italic text-gold-grad">art.</em></>}
      subtitle="A peek inside our studio: the pours, the petals, the packaging, the people."
    />
    <Gallery />
    <Testimonials />
  </>
);

export default GalleryPage;
