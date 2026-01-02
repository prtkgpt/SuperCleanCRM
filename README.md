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
In the "Environment Variables" section, add:

| Name | Value / How to Get It |
| :--- | :--- |
| **`DATABASE_URL`** | **Required.** Go to "Storage" in Vercel, create a Postgres database, and paste the connection string (e.g., `postgres://...`). |
| **`AUTH_SECRET`** | A random string (e.g. `complex_password_123`). |
| **`AUTH_TRUST_HOST`** | `true` |

### 4. Build Command (Important!)
To ensure the database works correctly on Vercel:
1.  Go to **Settings** -> **General** -> **Build & Development Settings**.
2.  Change **Build Command** to:
    ```bash
    npm run vercel-build
    ```
    *(This runs a special script that switches the database to Postgres and applies migrations)*

### 5. Deploy
Click **Deploy**.

---

## Local Development (MacBook)

1.  Clone repo.
2.  `pnpm install`
3.  Setup `.env` (see `.env.example`).
4.  `npx prisma migrate dev --name init`
5.  `pnpm dev`
