import PageHeader from "@/components/site/PageHeader";
import Contact from "@/components/site/Contact";

const ContactPage = () => (
  <>
    <PageHeader
      eyebrow="Get in Touch"
      title={<>Let's build a <em className="not-italic text-gold-grad">memory.</em></>}
      subtitle="Reach out on WhatsApp, Instagram or fill out the inquiry form below. We usually reply within 24 hours."
    />
    <Contact />
  </>
);

export default ContactPage;
