# Solo Cleaner App (CleanDay CRM)

A simple, mobile-first web application for solo cleaners.

## 🚀 Deploy to Vercel (Step-by-Step)

### 1. Get the Code
Fork this repository to your GitHub account.

### 2. Create Vercel Project
1.  Log in to [Vercel](https://vercel.com).
2.  Click **"Add New Project"**.
3.  Select this repository.

### 3. Configure Environment Variables
In the "Environment Variables" section of the deployment screen, add these:

| Name | Value / How to Get It |
| :--- | :--- |
| **`DATABASE_URL`** | **The most important one.**<br>1. After creating the project (or during), go to the **Storage** tab in Vercel.<br>2. Click **"Create Database"** -> **"Postgres"**.<br>3. Once created, go to the database settings/connection details.<br>4. Copy the **`POSTGRES_URL`** value (it starts with `postgres://...`).<br>5. Go back to your Project Settings -> Environment Variables.<br>6. Add a new variable named `DATABASE_URL` and paste that value.<br>*(Alternatively, use Neon.tech or Supabase and copy their connection string)*. |
| **`AUTH_SECRET`** | A random password used to encrypt sessions.<br>You can generate one [here](https://generate-secret.vercel.app/32) or just type a long random string like `my-super-secret-password-123-change-me`. |
| **`AUTH_TRUST_HOST`** | Set this to: `true` |
| **`NEXTAUTH_URL`** | (Optional on Vercel) Your site's URL, e.g., `https://my-app.vercel.app`. You can skip this for the first deploy. |

### 4. Deploy
Click **Deploy**.
*   *Note:* The first build might fail if the database isn't connected yet. If so, configure the `DATABASE_URL` variable as described above and click **Redeploy**.

### 5. Initialize Database (Crucial!)
After a successful deployment, the database is empty. You need to create the tables.
1.  Go to the **"Deployments"** tab in Vercel.
2.  Click the three dots `...` on your latest deployment -> **"Redeploy"** (ensure "Build Cache" is unchecked if you changed env vars).
3.  **Better Way:** modifying the Build Command.
    *   Go to **Settings** -> **General** -> **Build & Development Settings**.
    *   Change **Build Command** to: `npx prisma migrate deploy && next build`
    *   This ensures the database is updated every time you push code.

## Local Development (MacBook)

1.  Clone repo: `git clone ...`
2.  Install: `pnpm install`
3.  Setup `.env` (see `.env.example`).
4.  Run DB: `npx prisma migrate dev --name init`
5.  Seed: `npx prisma db seed`
6.  Start: `pnpm dev`

## Features
- Calendar & Scheduling
- Client Management
- Job Tracking
- Mobile-first UI
