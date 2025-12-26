# Solo Cleaner App (CleanDay CRM)

A simple, mobile-first web application for solo cleaners to manage clients, jobs, and schedule.

## Features
- **Calendar**: Day/Week view of upcoming jobs.
- **Clients**: Manage client details and addresses.
- **Jobs**: Schedule recurring or one-time jobs, track status (Completed/Paid).
- **Mobile-first Design**: Optimized for use on your phone.

## Tech Stack
- Next.js 15 (App Router)
- TypeScript & Tailwind CSS
- Prisma (SQLite for local / Postgres for prod)
- NextAuth.js (v5)

## 🚀 Local Development (MacBook Terminal)

Follow these steps to run the app on your local machine.

### 1. Prerequisites
- **Node.js** (v18 or newer)
- **pnpm** (recommended) or npm
- **Git**

### 2. Clone the Repository
```bash
git clone <your-repo-url>
cd <repo-name>
```

### 3. Install Dependencies
```bash
pnpm install
# or
npm install
```

### 4. Setup Environment Variables
Create a `.env` file in the root directory:
```bash
cp .env.example .env
# or just create it:
touch .env
```
Add the following content to `.env`:
```env
# Database connection (SQLite for local dev)
DATABASE_URL="file:./dev.db"

# Auth Secret (generate a random string)
AUTH_SECRET="super-secret-key-change-me"

# Optional: Stripe & Twilio (can leave as mock/empty for dev)
STRIPE_SECRET_KEY="sk_test_mock"
TWILIO_ACCOUNT_SID="AC_mock"
TWILIO_AUTH_TOKEN="mock"
TWILIO_PHONE_NUMBER="+15005550006"
```

### 5. Initialize Database
Run the migrations to create the database structure:
```bash
npx prisma migrate dev --name init
```
(This will create a `dev.db` file in your `prisma` folder)

### 6. Seed Sample Data (Optional)
Populate the app with a test user (`user@example.com` / `password123`) and sample clients/jobs:
```bash
npx prisma db seed
```

### 7. Run the App
Start the development server:
```bash
pnpm dev
# or
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

**Login Credentials (from Seed):**
- **Email**: `user@example.com`
- **Password**: `password123`

---

## 🌍 Deployment (cleandaycrm.com)

To launch on `cleandaycrm.com` (assuming you host on Vercel or a VPS):

### Option A: Vercel (Recommended)
1.  Push this code to a GitHub repository.
2.  Go to [Vercel](https://vercel.com) and "Add New Project".
3.  Import your repository.
4.  **Environment Variables**: Add them in Vercel settings.
    *   `DATABASE_URL`: You need a cloud Postgres database (e.g., Neon, Supabase, Vercel Postgres). Update the URL.
    *   `AUTH_SECRET`: Generate a strong secret (`openssl rand -base64 32`).
    *   `NEXTAUTH_URL`: `https://cleandaycrm.com` (if configured) or the Vercel URL.
5.  **Build Command**: `prisma generate && next build` (Vercel usually handles this, but ensure `postinstall` runs generate).
6.  **Deploy**.

### Option B: VPS (Docker/Node)
1.  Build the app: `pnpm build`.
2.  Start with `pnpm start`.
3.  Use a process manager like `pm2`.
4.  Set up Nginx as a reverse proxy pointing to port 3000.
5.  Configure SSL (Let's Encrypt).

### Database Note for Production
Local development uses SQLite. For production, switch `prisma/schema.prisma` provider to `postgresql`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```
And use a connection string for a Postgres database.
