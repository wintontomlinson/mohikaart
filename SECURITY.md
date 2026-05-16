# Security Notes

This is a static-hosted React/Vite single-page app backed by Supabase.
The browser holds the Supabase anon (publishable) key, so all real
authority lives in Postgres RLS policies and SECURITY DEFINER RPCs.

## Layered defenses

1. **Row Level Security on every table** (`supabase/migrations/20260516120000_security_lockdown.sql`)
   - Public reads only on `products`, `categories`, `site_images`, `app_settings`.
   - All writes require `is_admin()`.
   - `orders` & `inquiries` are admin-read-only; the public can only insert
     via the validated SECURITY DEFINER RPCs.

2. **Server-side validation in `create_order` RPC**
   - Recomputes prices from `products` (no client-trusted totals).
   - Enforces email / pincode formats, length caps, max 50 items, ₹10 lakh
     order ceiling.
   - Per-line qty clamped to 1–99.
   - Validates payment method against an allow-list.

3. **Anti-spam on contact form** (`supabase/migrations/20260516180000_security_constraints.sql`)
   - BEFORE INSERT trigger: max 5 inquiries per email per hour, 20 per day.
   - DB-level CHECK constraints on length and email format.

4. **Browser hardening** (`index.html`)
   - Strict Content-Security-Policy: only same-origin scripts + Razorpay
     checkout, frame-ancestors locked, no `object-src`, https-only.
   - `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`.
   - Permissions-Policy denies camera/mic/geolocation/topics/cohorts.

5. **Client-side validation** (`src/lib/validation.ts`)
   - Shared `EMAIL_RE`, `PHONE_RE`, `PINCODE_RE`, `LIMITS` constants.
   - `safePath()` allows only same-site router paths for admin-controlled
     CTA links (defends against a compromised admin shipping a phishing
     URL through the Hero CMS).
   - `safeUrl()` blocks `javascript:` / `data:` URL schemes.
   - Every public form has `maxLength` attributes matching the DB caps.

6. **Storage**
   - `product-images` and `site-images` buckets: public read, admin-only
     write (RLS on `storage.objects`).
   - `ImageUpload.tsx` enforces 5 MB max and an image MIME allow-list
     before uploading.

## Admin authentication

- Admins are real `auth.users` rows; the password is **never** in the
  client bundle. Authentication uses `signInWithPassword`.
- Membership is verified by reading the `admin_users` table (which has
  a self-read RLS policy) right after sign-in.
- `is_admin()` SECURITY DEFINER function is the single source of truth
  used by every RLS policy and RPC.
- `/admin/users` page (added in this release) lets the existing admin
  promote / demote other users via the `promote_admin`, `demote_admin`,
  `list_admins` RPCs. The DB refuses to remove the last admin.

## What's still TODO

- Razorpay payment signature verification belongs in a Supabase Edge
  Function, not the browser. The current `record_payment` RPC marks the
  order as `payment_submitted`; admin verifies before fulfilling.
- Per-IP rate limiting (currently per-email) can be added with a Cloud
  function or Cloudflare WAF in front of Supabase.
- Email/SMS notifications on new orders should be sent server-side
  (Edge Function with a service role key), never from the browser.
