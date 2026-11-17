# BYOB
an app to help with home improvement, maintenance and DIY. The app should help users track when their appliances are due for inspection, when the warranties run out, when the insurance need to be renewed. The app also should help users with DIY projects

## Current slice

Landing page with a **Properties** button, a property list, and a form to add a new property. Data is stored in Supabase; a Next.js API route (`/api/v1/properties`) is the only thing that talks to Supabase directly, using the service role key server-side.

## Setup

1. Install dependencies:
   ```
   npm install
   ```
2. Create a free [Supabase](https://supabase.com) project (pick a UK/EU region).
3. In the Supabase SQL Editor, run, in order:
   - `supabase/migrations/0001_create_properties.sql`
   - `supabase/seed.sql` (adds 3 sample properties)
4. Copy `.env.example` to `.env.local` and fill in the values from Supabase Project Settings → API:
   ```
   SUPABASE_URL=
   SUPABASE_SERVICE_ROLE_KEY=
   NEXT_PUBLIC_API_URL=/api/v1
   ```
5. Run the app:
   ```
   npm run dev
   ```
   Visit `http://localhost:3000`. If `.env.local` isn't set up yet, the Properties page shows a clear error with a Retry button rather than failing silently.

## Deploying to Vercel

Import the repo into Vercel, then add the same three environment variables (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_API_URL`) in the Vercel project settings before deploying.

## Quality gates

```
npm run build   # production build + typecheck
npm run lint    # eslint
npm test        # vitest + MSW (service layer, pages)
npm run test:e2e  # playwright smoke test (API stubbed, no Supabase needed)
```

**Field-name verification:** DEFERRED. The frontend and the API route were built together against the same schema, so field names match by construction, but this hasn't been checked against a live Supabase instance yet. Once you've completed steps 2–4 above, run `curl http://localhost:3000/api/v1/properties` and confirm the response fields (`id`, `name`, `propertyType`, `address`, `notes`, `createdAt`) match what the Properties page renders.

## Deliberately out of scope for this slice

Authentication/per-user data isolation, editing/deleting properties, the Needs Attention dashboard, projects, and dark-mode toggle (styles are dark-mode-ready via CSS variables, just not wired to a switch yet).

