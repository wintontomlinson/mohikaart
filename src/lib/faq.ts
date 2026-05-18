// Shared FAQ data used by both the dedicated /faq page and the
// homepage FAQ accordion. Keep groups + question-shape stable -
// HomepageFAQ.tsx hand-picks a subset by group label.

export type FaqItem = { q: string; a: string };
export type FaqGroup = { label: string; faqs: FaqItem[] };

export const FAQ_GROUPS: FaqGroup[] = [
  {
    label: "Ordering",
    faqs: [
      {
        q: "How long does a custom order take?",
        a: "Most pieces are ready in 7–10 days. Wedding bouquet preservation and large bulk orders take 14–21 days. We'll share an exact ETA before confirming your order.",
      },
      {
        q: "Can I see a preview before final pour?",
        a: "Yes, for custom orders above ₹2,000 we share a layout mockup and color palette for your approval before pouring.",
      },
      {
        q: "What payment methods do you accept?",
        a: "We accept UPI, bank transfer, all major credit/debit cards, and net banking. For custom orders, a 50% advance is required to begin work.",
      },
    ],
  },
  {
    label: "Customization",
    faqs: [
      {
        q: "Can I send my own flowers or photos?",
        a: "Absolutely. That's the heart of what we do. Ship us your dried flowers, printed photos or keepsakes via courier and we'll incorporate them into the design.",
      },
      {
        q: "What can be embedded in resin?",
        a: "Almost anything flat or small: dried flowers, photos, fabric swatches, coins, leaves, letters, hair, feathers - if it matters to you, we'll find a way.",
      },
    ],
  },
  {
    label: "Shipping",
    faqs: [
      {
        q: "Do you ship across India?",
        a: "Yes, pan-India shipping is free on every order. We use insured premium courier partners with tracking, and orders typically arrive within 3–5 business days after dispatch.",
      },
      {
        q: "Do you ship internationally?",
        a: "Yes, we ship worldwide on request. Rates and customs duties vary by country. Please contact us on WhatsApp for a quote.",
      },
    ],
  },
  {
    label: "Care & Returns",
    faqs: [
      {
        q: "Are returns allowed?",
        a: "Custom and personalised pieces are non-returnable since they're made-to-order. If your piece arrives damaged, we replace it free of cost. See our Shipping & Returns page.",
      },
      {
        q: "Is the resin safe?",
        a: "Yes. We use premium epoxy resin that's fully cured before shipping. The surface is food-safe, non-toxic and skin-friendly. Avoid hot liquids directly on the surface.",
      },
    ],
  },
];
