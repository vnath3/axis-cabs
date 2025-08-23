# Axis Cabs MVP

## Quick Start
1. Create a `.env` file in the project root with the required environment variables:

   ```
   PUBLIC_GA4_ID=             # optional, GA4 measurement ID
   PUBLIC_SUPABASE_URL=       # Supabase project URL
   PUBLIC_SUPABASE_ANON_KEY=  # Supabase anon key
   SUPABASE_URL=              # optional, same as PUBLIC_SUPABASE_URL
   SUPABASE_SERVICE_ROLE_KEY= # service role key for API routes
   PUBLIC_WHATSAPP_NUMBER=    # optional, WhatsApp number for CTAs
   PUBLIC_GOOGLE_REVIEW_URL=  # optional, link to Google reviews
   N8N_LEADS_WEBHOOK_URL=     # optional, webhook for new leads
   ADMIN_TOKEN=               # optional, token for reviews admin API
   ```
2. `npm i`
3. `npm run dev`
4. Open http://localhost:4321

## Editing Prices
- Update `src/data/pricing.json`. No code changes needed.

## Adding Pages
- Add entries to `src/data/routes.ts`, `packages.ts`, or `gems.ts`.
- The dynamic pages resolve by `slug`.

## Deploy
- Vercel → import repo → set env vars → deploy.

## Tracking
- GA4 (events wired in UI buttons via standard click tracking; add GTM if you prefer.)

## Notes
- Palette: Primary #FF6A00; consistent across components.
- WhatsApp: +919922333305 used in Header, Hero, Sticky CTAs, and form handoff.

