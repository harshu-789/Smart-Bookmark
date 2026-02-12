# Smart Bookmark

Minimal bookmark manager built with Next.js (App Router), Supabase (Auth, Database, Realtime), and Tailwind CSS.

Features
- Google-only auth (no passwords)
- Add and delete personal bookmarks (URL + title)
- Bookmarks private to each user (RLS policies)
- Real-time list updates across tabs using Supabase Realtime

Quick start (local)

1. Create a Supabase project and enable Email/Password + OAuth providers. In Supabase Auth > Providers enable Google and configure credentials.
2. Create a table using `db/init.sql` in Supabase SQL editor. Enable the policies (the file includes RLS policies).
3. Set the following environment variables in Vercel or locally (e.g., in a `.env.local` file):

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Install and run locally:

```bash
npm install
npm run dev
```

Deployment (Vercel)

- Connect your Git repo to Vercel.
- Set the same `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel Environment Variables.
- In Supabase Auth settings add a Redirect URL for OAuth that points to your Vercel deployment, e.g. `https://your-app.vercel.app` or `https://your-app.vercel.app/api/auth/callback` if using callbacks.
- Deploy — the app should work at the Vercel URL.

Notes
- This project uses Supabase realtime PostgreSQL changes; ensure realtime is enabled in your Supabase project.
- The SQL in `db/init.sql` includes RLS policies so users only see their own bookmarks.
