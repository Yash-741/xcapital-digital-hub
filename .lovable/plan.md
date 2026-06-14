## Lead Management System for XCapital

Build a complete lead capture + admin portal on the same domain.

### 1. Database (Supabase migration)

Create `public.leads` table:
- `id` uuid pk, `name`, `phone`, `email`, `requirement` (text), `message` (text, nullable), `status` (text default `'New'`, check in New/Contacted/In Progress/Closed), `source` (text, nullable), `created_at` timestamptz default now()

Grants + RLS:
- `GRANT INSERT ON public.leads TO anon, authenticated` (public form submits)
- `GRANT SELECT, UPDATE, DELETE ON public.leads TO authenticated`
- `GRANT ALL ON public.leads TO service_role`
- RLS enabled. Policies:
  - `anon` + `authenticated`: INSERT allowed (`with check true`)
  - `authenticated` admin role: SELECT/UPDATE/DELETE gated by `has_role(auth.uid(), 'admin')`

Roles infrastructure:
- `app_role` enum (`admin`, `user`)
- `user_roles` table + `has_role` SECURITY DEFINER function (per project standard)

Index: `created_at desc`, `status`.

### 2. Wire existing inquiry forms to insert leads

Existing forms to connect (all currently `setTimeout` stubs):
- `StoreEnquiryDialog` (store product enquiries) — source = `store:<productName>`, requirement = product/category name
- `about.tsx` "Reach Us" form — source = `about`
- `apply.$category.$slug.tsx` apply form — source = `apply:<category>`, requirement = product

Each calls `supabase.from('leads').insert(...)` directly with the anon client (RLS allows insert). On success: toast "Thank you! Our team will contact you shortly." + clear form. On error: toast "Something went wrong, please try again".

### 3. Admin routes

- `/admin` — login page (email + password). Uses `supabase.auth.signInWithPassword`. After sign-in, verifies caller has `admin` role via `has_role`; if not, signs out and shows "Invalid email or password". On success → navigate to `/admin/dashboard`.
- `/admin/dashboard` — protected. Place under `src/routes/_authenticated/admin.dashboard.tsx` so the integration-managed `_authenticated` gate redirects unauthenticated users (to `/auth` by default — we'll add a small client-side check that additionally redirects non-admins to `/admin`).

Because the managed `_authenticated` layout redirects to `/auth`, the dashboard component itself will:
- On mount, call `has_role` RPC; if not admin → `supabase.auth.signOut()` + navigate to `/admin`.

### 4. Admin dashboard UI

Header: "XCapital Admin Portal" + Logout.

Stat cards: Total / New / Contacted / Closed (computed from fetched data).

Leads table:
- Columns: Name, Phone, Email, Requirement, Status (editable Select), Date, Actions (Delete)
- Search input (filters name/phone/email, client-side)
- Status filter dropdown
- Requirement filter dropdown (distinct values from data)
- Sort: created_at desc
- Row click → expand row showing message, source, full timestamp
- Pagination: 12 per page

Data fetching: TanStack Query `useQuery` calling `supabase.from('leads').select('*').order('created_at', {ascending:false})`. Status updates: `supabase.from('leads').update({status}).eq('id', id)` then `invalidateQueries`.

### 5. Design

Navy blue (`#0a0a2e`-ish) + existing brand gold (`--brand-yellow`). Use existing shadcn Card, Table, Select, Input, Button, Badge components. Status badges color-coded.

### 6. Admin account

Provide instructions to the user: create the admin user via Cloud → Users (sign up email/password), then I'll insert a row into `user_roles` with that user's id + `admin` role (or provide a one-line insert tool call once they share the email).

### Files

New:
- `supabase/migrations/<ts>_leads_and_roles.sql`
- `src/routes/admin.tsx` (login)
- `src/routes/_authenticated/admin.dashboard.tsx` (dashboard)
- `src/lib/leads-insert.ts` (shared helper)

Edited:
- `src/components/site/StoreEnquiryDialog.tsx`
- `src/routes/about.tsx` (Reach Us form)
- `src/routes/apply.$category.$slug.tsx`

Note: the existing `service_leads` table + `submitLead` server fn stay untouched; new system uses the cleaner `leads` table per spec.
