import { motion } from "framer-motion";
import PageHeader from "@/components/site/PageHeader";

const EASE = [0.22, 1, 0.36, 1] as const;

const TermsPage = () => {
  return (
    <>
      <PageHeader
        title="Terms & Conditions"
        subtitle="Please read these terms carefully before using our website or placing an order."
      />

      <section className="max-w-3xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="prose prose-neutral max-w-none"
        >
          <p className="text-muted-foreground text-sm mb-8">Last updated: January 2025</p>

          <h2 className="font-display text-2xl mb-4">1. General</h2>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            By accessing and using the Mohika Art website, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use our website.
          </p>

          <h2 className="font-display text-2xl mb-4 mt-8">2. Products & Orders</h2>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
            <li>All products are handcrafted and may have minor natural variations</li>
            <li>Product images are representative; actual colors may vary slightly</li>
            <li>Orders once placed with custom personalization cannot be cancelled after 12 hours</li>
            <li>We reserve the right to cancel orders due to stock unavailability or pricing errors</li>
          </ul>

          <h2 className="font-display text-2xl mb-4 mt-8">3. Pricing & Payment</h2>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            All prices are listed in Indian Rupees (INR) and include applicable taxes. We accept payments through Razorpay (UPI, cards, net banking) and Cash on Delivery for select pincodes.
          </p>

          <h2 className="font-display text-2xl mb-4 mt-8">4. Shipping & Delivery</h2>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            We deliver Pan India. Standard delivery takes 5-8 business days. Custom orders may take 7-14 business days. Delivery timelines are estimates and may vary based on location and courier partner availability.
          </p>

          <h2 className="font-display text-2xl mb-4 mt-8">5. Intellectual Property</h2>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            All content on this website — including designs, logos, text, images, and product designs — are the property of Mohika Art and are protected by intellectual property laws. Unauthorized use or reproduction is prohibited.
          </p>

          <h2 className="font-display text-2xl mb-4 mt-8">6. Limitation of Liability</h2>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            Mohika Art shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or website. Our maximum liability is limited to the purchase price of the product.
          </p>

          <h2 className="font-display text-2xl mb-4 mt-8">7. Changes to Terms</h2>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on the website. Continued use of the site constitutes acceptance of the updated terms.
          </p>

          <h2 className="font-display text-2xl mb-4 mt-8">8. Contact</h2>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            For any questions regarding these Terms & Conditions, please contact us at hello@mohikaart.com.
          </p>
        </motion.div>
      </section>
    </>
  );
};

export default TermsPage;
