# Solo Cleaner App (CleanDay CRM)

A simple, mobile-first web application for solo cleaners.

## 🚀 Deploy to Vercel (No Terminal Required)

1.  **Fork/Clone**: Ensure this code is in your GitHub repository.
2.  **Go to Vercel**: Log in to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3.  **Import Repository**: Select this repository from the list.
4.  **Configure Project**:
    *   **Framework Preset**: Next.js (default)
    *   **Root Directory**: `./` (default)
    *   **Build Command**: `prisma generate && next build` (default from package.json)

5.  **Environment Variables** (Expand the section):
    You need to add the following variables:

    *   `DATABASE_URL`: The connection string to your Postgres database.
        *   *Tip*: You can add a "Storage" resource (Vercel Postgres) directly in Vercel during creation, or use Neon/Supabase.
        *   If using Vercel Postgres, it might auto-configure `POSTGRES_PRISMA_URL` etc. You might need to alias it to `DATABASE_URL` or update schema.
    *   `AUTH_SECRET`: A random string (e.g. `complex_password_here`).
    *   `AUTH_TRUST_HOST`: Set to `true`.
    *   `NEXTAUTH_URL`: Your Vercel URL (e.g., `https://your-project.vercel.app`) - *add this after deployment if needed, or rely on Vercel to auto-handle it in V5*.

6.  **Deploy**: Click **Deploy**.

7.  **Database Setup (Post-Deploy)**:
    Once deployed, your database is empty. You need to run migrations.
    *   **Option A (Vercel Dashboard)**: Vercel settings might allow running commands, but typically you do this locally connecting to remote DB, OR:
    *   **Option B (Easy)**: I have included a "Seed" step you can run if you have terminal access, but without terminal, the app might error until tables exist.
    *   **Critical**: Prisma needs to push the schema. Vercel Build does `prisma generate` but NOT `prisma migrate deploy`.
    *   **Fix**: Update the Build Command in Vercel Settings to:
        `prisma migrate deploy && next build`

    **Recommended Vercel Build Command:**
    `npx prisma migrate deploy && next build`

## Features
- Calendar & Scheduling
- Client Management
- Job Tracking
- Mobile-first UI

## Tech Stack
- Next.js + Tailwind
- Prisma + Postgres
- NextAuth.js
