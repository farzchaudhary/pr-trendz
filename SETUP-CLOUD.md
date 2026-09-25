# PR TRENDZ cloud setup (one time)

## Supabase
1. Create a project at Supabase.
2. Open SQL Editor.
3. Paste everything from `supabase.sql` and run it.
4. Open Project Settings → API and copy:
   - Project URL
   - service_role key (keep it private)

## Vercel
Open your existing `pr-trendz-vite-fixed` project:
Settings → Environment Variables → Add each of these for Production (and Preview if you want):

`SUPABASE_URL` = your Supabase Project URL
`SUPABASE_SERVICE_ROLE_KEY` = your Supabase service_role key
`OWNER_CODE` = `PRTRENDZ-OWNER-2026`

Then Deployments → Redeploy the latest deployment.

After this, products added from the owner panel are stored in the cloud database and appear on every phone/laptop that opens the website.

IMPORTANT: never put the service-role key into a `VITE_...` variable and never paste it into frontend code.
