import PageHeader from "@/components/site/PageHeader";
import Categories from "@/components/site/Categories";

const CategoriesPage = () => (
  <>
    <PageHeader
      eyebrow="Categories"
      title={<>Find your <em className="not-italic text-gold-grad">perfect</em> piece.</>}
      subtitle="Browse our curated categories, from personalized keychains to wedding heirlooms"
    />
    <Categories heading={false} />
  </>
);

export default CategoriesPage;
