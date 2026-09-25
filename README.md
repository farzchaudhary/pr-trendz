# PR TRENDZ — Premium Cloud Store

Features:
- Premium black / metallic-gold interface
- Enter Website landing screen
- Shop / About / Contact pages
- Previous / next page arrows
- Owner dashboard
- Add, edit and delete products
- Image upload + client-side compression
- Cloud-synced products across phones and laptops via Supabase + Vercel API
- Local fallback before cloud configuration
- No unwanted blinking caret when tapping navigation/buttons

## Cloud setup
1. Create a Supabase project.
2. In Supabase SQL Editor, run `supabase.sql`.
3. In Vercel → Project → Settings → Environment Variables add:
   - `SUPABASE_URL` = your Supabase project URL
   - `SUPABASE_SERVICE_ROLE_KEY` = your Supabase service-role key
   - `OWNER_CODE` = `PRTRENDZ-OWNER-2026` (or your own private code)
4. Redeploy in Vercel.

The browser never receives the service-role key. Product reads/writes go through the Vercel API.
