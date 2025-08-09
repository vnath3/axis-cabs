# Axis Cabs MVP

## Quick Start
1. `cp .env.example .env` and fill `PUBLIC_GA4_ID`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`.
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