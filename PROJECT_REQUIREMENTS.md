# Car Choice — Website Requirements & Implementation Plan

**Stack:** React (frontend) + Supabase (Auth, Database, Storage)
**Purpose:** Public car inventory site with customer accounts + owner admin dashboard

---

## 1. Tech Stack

| Layer | Choice |
|---|---|
| Frontend | Next.js (React framework, App Router) |
| Styling | Tailwind CSS |
| Backend / DB | Supabase (Postgres) |
| Auth | Supabase Auth (Email/Password + Google OAuth) |
| File Storage | Supabase Storage (car images) |
| Images | Next.js `<Image>` component (auto-optimization/responsive sizing) |
| Hosting | Vercel (recommended — zero-config Next.js deployment) |

### Why Next.js
- SSR/SSG for car listing pages → properly indexable by Google (critical for search discovery of individual cars)
- Built-in image optimization solves large car-photo performance concerns
- File-based routing (`/cars/[id]`, `/dashboard`, `/dashboard/cars/[id]/edit`)
- API routes available for any server-side logic that must never touch the browser (e.g. anything needing the `service_role` key, dynamic sitemap generation)

---

## 2. Design System

### Brand colors (from logo)
- Black: `#0A0A0A`
- Red (primary accent): `#E32227`
- Blue (secondary accent): `#1E5FCC`
- Chrome/silver (headings/dividers): `#C0C0C0` → `#E5E5E5`

### Dark mode
| Token | Value |
|---|---|
| Background | `#0A0A0A` |
| Surface / cards | `#171717` / `#1F1F1F` |
| Primary accent | `#E32227` |
| Secondary accent | `#1E5FCC` |
| Text primary | `#F5F5F5` |
| Text secondary | `#A3A3A3` |
| Borders | `#2A2A2A` |

### Light mode
| Token | Value |
|---|---|
| Background | `#FAFAFA` / `#FFFFFF` |
| Surface / cards | `#F1F1F1` |
| Primary accent | `#E32227` |
| Secondary accent | `#164A9E` |
| Text primary | `#111111` |
| Text secondary | `#5C5C5C` |
| Borders | `#E0E0E0` |

### Notes
- Header/nav stays black in both modes (matches logo plate).
- CTA buttons (WhatsApp, View Details) → red.
- Secondary links/actions → blue.
- Favorite/heart icon → red when active.
- Mobile-first responsive design (Tailwind breakpoints: `sm`, `md`, `lg`, `xl`).
- Minimum 44x44px tap targets on all interactive elements.
- No hover-only interactions (mobile has no hover).

---

## 3. Database Schema (Supabase / Postgres)

```sql
-- Profiles (extends auth.users)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  avatar_url text,
  is_admin boolean default false,
  created_at timestamp default now()
);

-- Cars
create table cars (
  id uuid primary key default gen_random_uuid(),
  make text not null,
  model text not null,
  year int not null,
  price numeric not null,
  original_price numeric, -- for showing strikethrough discounts
  mileage int,
  fuel_type text,
  transmission text,
  description text,
  features text[], -- e.g. {'Bluetooth','Backup Camera','Sunroof'}
  status text default 'available' check (status in ('draft','available','reserved','sold')),
  sold_at timestamp,
  views_count int default 0,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Car images
create table car_images (
  id uuid primary key default gen_random_uuid(),
  car_id uuid references cars(id) on delete cascade,
  image_url text not null,
  sort_order int default 0,
  is_cover boolean default false
);

-- Favorites
create table favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  car_id uuid references cars(id) on delete cascade,
  created_at timestamp default now(),
  unique(user_id, car_id)
);

-- Inquiries
create table inquiries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  car_id uuid references cars(id),
  name text,
  phone text,
  email text,
  message text,
  channel text default 'form' check (channel in ('form','whatsapp')),
  status text default 'new' check (status in ('new','contacted','closed')),
  created_at timestamp default now()
);

-- Shop settings (whatsapp number, hours, etc.)
create table settings (
  key text primary key,
  value text
);
```

---

## 4. Security Requirements

- Row Level Security (RLS) enabled on **every** table, default deny.
- `cars`: public `SELECT` only where `status != 'draft'`; `INSERT/UPDATE/DELETE` restricted to admin.
- `favorites` / `inquiries`: users can only access rows where `user_id = auth.uid()`; admin can read all.
- `profiles.is_admin`: never editable by the user themselves — set only via Supabase dashboard/service role.
- `service_role` key never exposed in frontend code — only the public `anon` key belongs in React.
- Storage bucket for car images: public read, write restricted to admin via storage policies.
- Validate file type/size on all image uploads.
- Sanitize/validate all form inputs before insert (inquiry form, car form).
- Honeypot field or rate limiting on public inquiry form (spam protection).
- HTTPS enforced everywhere (automatic on Vercel/Netlify).
- CORS restricted to production domain in Supabase project settings.
- Environment variables for all keys — never hardcoded, never committed to git.
- Google OAuth redirect URLs configured for both local dev and production domains.
- Regular automated backups (confirm Supabase plan covers this).
- Test every RLS policy as a non-admin user before launch (try to break it).

---

## 5. Implementation Phases

### Phase 1 — Foundation & Setup
- [ ] Create Supabase project
- [ ] Create all tables (schema above)
- [ ] Enable RLS + write policies for every table
- [ ] Set up Supabase Storage bucket for car images + policies
- [ ] Scaffold Next.js (App Router) + Tailwind project
- [ ] Set up environment variables (`.env.local` for Supabase URL/anon key; keep `service_role` server-only if ever used)
- [ ] Configure dark/light mode theme (Tailwind config with brand colors)
- [ ] Set up Supabase client helpers for server components/client components (per Next.js App Router conventions)

### Phase 2 — Public Site: Browsing
- [ ] Home page (hero, featured cars, search bar)
- [ ] Inventory page with filters (make, model, year, price, mileage, fuel, transmission)
- [ ] Sort by price / newest / mileage
- [ ] Car detail page (image gallery/carousel, specs, features list, description)
- [ ] "SOLD" badge on sold cars (still visible, non-interactive)
- [ ] "Similar cars" section on detail page
- [ ] Recently viewed cars (session-based)
- [ ] Responsive layout for mobile/tablet/desktop

### Phase 3 — Authentication
- [ ] Email/password sign up & login
- [ ] Google OAuth sign in (Supabase provider config)
- [ ] Auto-create `profiles` row on signup (Postgres trigger)
- [ ] Favorites: add/remove, "My Favorites" page
- [ ] Prompt for phone number after first login (for WhatsApp-related features)

### Phase 4 — Inquiries & WhatsApp
- [ ] Contact/inquiry form on car detail page
- [ ] WhatsApp button (`wa.me` link, pre-filled message with car info)
- [ ] WhatsApp click also inserts a row into `inquiries` (channel: 'whatsapp')
- [ ] Sticky WhatsApp button on mobile car detail page
- [ ] Disable WhatsApp/contact actions on sold cars

### Phase 5 — Owner Dashboard
- [ ] Admin-only route (guarded by `is_admin` check + RLS)
- [ ] Add/Edit car form (all fields + multi-select features checklist)
- [ ] Multi-image upload (drag & drop + camera capture on mobile, reorder, set cover photo)
- [ ] Auto-compress images before upload
- [ ] Listings table → mobile: stacked cards; desktop: table
- [ ] Quick status toggle (Available / Reserved / Sold) from listings view
- [ ] Auto-set `sold_at` timestamp when status → sold
- [ ] Duplicate/clone listing action
- [ ] Draft/publish toggle
- [ ] Inquiries inbox (grouped by car, status: New/Contacted/Closed)
- [ ] Click-to-call/WhatsApp/email directly from inquiry
- [ ] Basic stats: total listings, sold this month, new inquiries count
- [ ] Stale inventory flag (30+ days, no inquiries)
- [ ] Activity log (e.g. "Sold: 2021 Civic — marked sold July 10")

### Phase 6 — Trust, Conversion & Extras
- [ ] Google Reviews widget on homepage
- [ ] "Why buy from us" section (years in business, cars sold, warranty info)
- [ ] Financing/monthly payment estimator on car detail page
- [ ] Real shop photos (team, location, showroom)
- [ ] Privacy policy + terms page
- [ ] Footer with business info (address, hours, phone)

### Phase 7 — SEO & Performance
- [ ] Dynamic `metadata` per car page (year/make/model/price in title/description) via Next.js Metadata API
- [ ] Structured data (schema.org Vehicle markup)
- [ ] Dynamic sitemap (`sitemap.xml` via Next.js route handler, generated from live inventory)
- [ ] Use Next.js `<Image>` for automatic lazy-loading + responsive sizing (replaces manual lazy-load setup)
- [ ] Static generation (SSG) or incremental static regeneration (ISR) for car detail pages where possible
- [ ] Loading skeletons instead of blank screens
- [ ] Branded 404 and empty-state pages

### Phase 8 — Security Hardening & Testing
- [ ] Test all RLS policies as non-admin/anonymous user
- [ ] Confirm `service_role` key never appears in frontend bundle
- [ ] Verify CORS restricted to production domain
- [ ] Test Google OAuth redirect on production domain
- [ ] Load test image uploads (large files, wrong file types)
- [ ] Test spam protection on inquiry form
- [ ] Confirm backups are active on Supabase plan

### Phase 9 — Deployment & Launch
- [ ] Deploy frontend (Vercel/Netlify)
- [ ] Connect production domain
- [ ] Set production environment variables
- [ ] Final mobile device testing (iOS + Android, real devices)
- [ ] Final QA pass on all phases above
- [ ] Launch

---

## 6. Notes for Development

- Build mobile-first throughout — do not design desktop first and shrink down.
- Every new table/feature must have RLS policies written and tested before moving to the next phase.
- Keep `anon` key and `service_role` key strictly separated; only `anon` key ever ships to the browser.
