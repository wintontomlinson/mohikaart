import { useDynamicSeo } from "@/lib/cms";

/**
 * Mirrors the admin-managed SEO settings into the document head.
 * Renders nothing — it just runs the hook.
 */
const SeoUpdater = () => {
  useDynamicSeo();
  return null;
};

export default SeoUpdater;
