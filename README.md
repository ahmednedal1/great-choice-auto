# Car Choice

Next.js + Supabase website for a used car dealership: public inventory,
customer accounts + favorites, WhatsApp inquiries, and an owner dashboard.

This is a **working foundation (Phase 1 + core of Phase 2–5)** from the
project spec — enough to run, connect to Supabase, and keep building on.
See `PROJECT_REQUIREMENTS.md` (if you have it from our chat) for the full
phased plan, design system, and security checklist.

## 1. Install

```bash
npm install
```

## 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Open the SQL Editor and run everything in `supabase/schema.sql`.
3. Go to **Storage** → create a bucket named `car-images`, set it to **Public**.
   Then run the storage policy SQL that's commented at the bottom of
   `supabase/schema.sql` (uncomment and run it).
4. Go to **Authentication → Providers** → enable **Google**, and paste in
   your Google OAuth Client ID/Secret (from Google Cloud Console). Add
   `http://localhost:3000` and your production domain as authorized
   redirect origins.
5. Copy your **Project URL** and **anon public key** from
   **Settings → API**.

## 3. Environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local` with your Supabase URL/anon key, WhatsApp number
(digits only, with country code, e.g. `15551234567`), and shop name.

## 4. Run it

```bash
npm run dev
```

Visit `http://localhost:3000`.

## 5. Make yourself the admin

1. Sign up for an account on the site (through `/signup`).
2. In the Supabase SQL Editor, run:
   ```sql
   update public.profiles set is_admin = true
   where id = (select id from auth.users where email = 'your-email@example.com');
   ```
3. Visit `/dashboard` — you now have owner access.

## What's included

- **Public site**: home page, `/cars` inventory grid, `/cars/[id]` detail
  page with gallery, specs, features, and a WhatsApp contact button that
  also logs the inquiry to Supabase.
- **Auth**: email/password + Google sign-in, `/login`, `/signup`,
  `/favorites`.
- **Owner dashboard**: `/dashboard` overview with stats + listings,
  `/dashboard/cars/new` and `/dashboard/cars/[id]/edit` with a full form
  (specs, feature checklist, multi-image upload).
- **Security**: Row Level Security policies for every table (see
  `supabase/schema.sql`) — the `anon` key is the only key ever used in the
  browser.
- **Design**: dark/light mode (toggle in the navbar), brand colors and
  fonts (Oswald + Inter) matching the logo.

## What's not built yet (see the phased plan)

- Working filters on the inventory page (UI is there, not wired to state)
- Inquiries inbox in the dashboard (table already collects `channel`,
  `status` — just needs a UI)
- Financing estimator, Google Reviews embed, "similar cars," recently
  viewed
- Sitemap / structured data
- Image compression before upload

## Folder structure

```
src/
  app/                 → pages (Next.js App Router)
    cars/              → inventory + car detail
    dashboard/          → owner admin area
    login/, signup/     → auth pages
    auth/callback/       → OAuth redirect handler
  components/          → CarCard, CarForm, Navbar, Footer, WhatsAppButton, ThemeToggle
  lib/supabase/         → browser + server Supabase clients
supabase/
  schema.sql           → full schema + RLS policies (run this first)
```
