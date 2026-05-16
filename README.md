# Mohika Art

The customer-facing storefront and admin panel for Mohika Art — a
handmade resin gifting brand. Built as a single-page React app with
Supabase as the backend (Postgres + Auth + Storage).

## Tech stack

- **Frontend:** React 18, Vite, TypeScript, TailwindCSS, framer-motion,
  shadcn/ui, lucide-react, recharts.
- **Backend:** Supabase (Postgres + Auth + Storage), enforced via Row
  Level Security and SECURITY DEFINER RPCs.
- **Payments:** Razorpay (publishable key only on the client; admin
  verifies before fulfilment).
- **State:** React Query for server state, a tiny React Context for
  cart, localStorage for persistence.

## Local development

```bash
# 1. Install deps
npm install

# 2. Copy env and fill in your Supabase project values
cp .env.example .env

# 3. Start the dev server
npm run dev
```

The app runs on http://localhost:8080.

## Database setup

Run all migrations in `supabase/migrations/` via the Supabase CLI or
Dashboard SQL editor in chronological order. After the
`security_lockdown` migration runs, bootstrap the first admin manually
(see comment block at the bottom of that migration file).

Once at least one admin exists, you can manage the rest from
**/admin/users** in the panel.

## Project structure

```
src/
├── App.tsx                — routes
├── main.tsx               — entry + ErrorBoundary
├── components/
│   ├── site/              — storefront sections + chrome
│   └── ui/                — shadcn primitives
├── pages/                 — route components
│   └── admin/             — admin panel pages
├── lib/
│   ├── admin-auth.ts      — Supabase Auth + admin_users check
│   ├── cart.tsx           — cart context (localStorage backed)
│   ├── cms.ts             — JSON settings (hero, testimonials, …)
│   ├── settings.ts        — store contact details
│   ├── site.ts            — image resolver + INR formatter
│   └── validation.ts      — shared input limits + URL sanitisers
├── integrations/supabase/ — generated client + Database types
└── assets/                — bundled product/category fallback images
supabase/migrations/        — DB schema, RLS, RPCs (SECURITY.md)
```

## Admin features

| Page                 | What you can do |
|----------------------|-----------------|
| Dashboard            | At-a-glance KPIs, recent orders, top products, status breakdown |
| Analytics            | KPIs with previous-period delta, revenue/orders trends, top cities, CSV export |
| Products             | CRUD + bulk select + duplicate + featured/in-stock toggles + CSV export |
| Categories           | CRUD with image upload + sort order |
| Coupons              | Percent / flat coupons with min order + expiry |
| Orders               | Search + status flow (pending → payment_submitted → confirmed → shipped → delivered) + CSV export |
| Inquiries            | View + reply to contact-form submissions |
| Testimonials         | CMS-driven reviews, on/off toggle |
| Hero Section         | Edit headline, CTAs, stats, badge |
| Announcements        | Rotating top-bar messages with `{threshold}` token |
| Site Images          | Replace hero / about / gallery photos |
| Admin Users          | Promote/demote teammates (cannot remove last admin or yourself) |
| Settings             | Store contact info, free-shipping threshold, SEO metadata, Razorpay key |

## Security

See [SECURITY.md](./SECURITY.md) for the full layered-defence write-up
(RLS, server-side validation, CSP, rate-limiting, etc.).

## Build & deploy

```bash
npm run build
# Output is in dist/ — deploy to any static host (Vercel, Netlify,
# Cloudflare Pages, S3+CloudFront, Supabase static hosting, …).
```

When deploying, mirror the `Content-Security-Policy` and friends from
`index.html` into your hosting provider's HTTP response headers for
the strongest protection (browsers honour HTTP headers more strictly
than equivalent `<meta>` tags).
