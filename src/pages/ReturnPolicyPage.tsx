import { motion } from "framer-motion";
import PageHeader from "@/components/site/PageHeader";

const EASE = [0.22, 1, 0.36, 1] as const;

const ReturnPolicyPage = () => {
  return (
    <>
      <PageHeader
        title="Return & Refund Policy"
        subtitle="We want you to love your purchase. Here's what to do if something isn't right."
      />

      <section className="max-w-3xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="prose prose-neutral max-w-none"
        >
          <p className="text-muted-foreground text-sm mb-8">Last updated: January 2025</p>

          <h2 className="font-display text-2xl mb-4">Handcrafted with Love</h2>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            Since all our products are handcrafted and personalized, each piece is made uniquely for you. We take great care in creating every item, but we understand things can sometimes go wrong.
          </p>

          <h2 className="font-display text-2xl mb-4 mt-8">When Can You Request a Return?</h2>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
            <li>If the product arrives damaged or broken</li>
            <li>If you received the wrong item</li>
            <li>If the personalization details are incorrect (our error)</li>
          </ul>

          <h2 className="font-display text-2xl mb-4 mt-8">Return Process</h2>
          <ol className="list-decimal pl-6 space-y-2 text-muted-foreground mb-4">
            <li>Contact us within <strong>48 hours</strong> of delivery via WhatsApp or email</li>
            <li>Share clear photos/videos of the issue</li>
            <li>We'll review and respond within 24 hours</li>
            <li>If approved, we'll arrange a replacement or refund</li>
          </ol>

          <h2 className="font-display text-2xl mb-4 mt-8">Non-Returnable Items</h2>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            Due to the personalized nature of our products, we cannot accept returns for:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
            <li>Change of mind after ordering</li>
            <li>Minor handcraft variations (these are natural and expected)</li>
            <li>Slight color differences from screen to actual product</li>
          </ul>

          <h2 className="font-display text-2xl mb-4 mt-8">Refunds</h2>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            Approved refunds will be processed within 5-7 business days to your original payment method. For COD orders, refunds will be transferred to your bank account.
          </p>

          <h2 className="font-display text-2xl mb-4 mt-8">Need Help?</h2>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            We're always happy to help! Reach out via WhatsApp or email us at hello@mohikaart.com.
          </p>
        </motion.div>
      </section>
    </>
  );
};

export default ReturnPolicyPage;
