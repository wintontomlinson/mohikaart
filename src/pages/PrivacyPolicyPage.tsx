import { motion } from "framer-motion";
import PageHeader from "@/components/site/PageHeader";

const EASE = [0.22, 1, 0.36, 1] as const;

const PrivacyPolicyPage = () => {
  return (
    <>
      <PageHeader
        title="Privacy Policy"
        subtitle="Your privacy matters to us. Learn how we collect, use, and protect your information."
      />

      <section className="max-w-3xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="prose prose-neutral max-w-none"
        >
          <p className="text-muted-foreground text-sm mb-8">Last updated: January 2025</p>

          <h2 className="font-display text-2xl mb-4">1. Information We Collect</h2>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            When you place an order or contact us, we may collect your name, email address, phone number, shipping address, and payment information. We also collect browsing data through cookies to improve your experience.
          </p>

          <h2 className="font-display text-2xl mb-4 mt-8">2. How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
            <li>To process and fulfill your orders</li>
            <li>To communicate with you about your order status</li>
            <li>To send promotional offers (only with your consent)</li>
            <li>To improve our website and services</li>
            <li>To respond to your inquiries and support requests</li>
          </ul>

          <h2 className="font-display text-2xl mb-4 mt-8">3. Data Protection</h2>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            We implement appropriate security measures to protect your personal information. Your payment data is processed securely through Razorpay and is never stored on our servers.
          </p>

          <h2 className="font-display text-2xl mb-4 mt-8">4. Cookies</h2>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            We use cookies to enhance your browsing experience, remember your preferences, and analyze site traffic. You can control cookie settings through your browser.
          </p>

          <h2 className="font-display text-2xl mb-4 mt-8">5. Third-Party Services</h2>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            We may share your information with trusted third-party services for payment processing (Razorpay), shipping, and analytics. These services have their own privacy policies.
          </p>

          <h2 className="font-display text-2xl mb-4 mt-8">6. Your Rights</h2>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            You have the right to access, update, or delete your personal information. Contact us at hello@mohikaart.com for any data-related requests.
          </p>

          <h2 className="font-display text-2xl mb-4 mt-8">7. Contact Us</h2>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            If you have questions about this Privacy Policy, please contact us via email at hello@mohikaart.com or through our WhatsApp.
          </p>
        </motion.div>
      </section>
    </>
  );
};

export default PrivacyPolicyPage;
