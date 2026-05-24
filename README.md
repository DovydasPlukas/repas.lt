# Repas

"Repas" service ordering system — built as a final graduation project at Šiaulių State University of Applied Sciences, 2026.
 
[Repas](https://repas.lt/) is a company based in Šiauliai, Lithuania, offering washing, ironing and washing machine repair services. This system (hopes to) replace their manual order process (phone calls and messages) with an online booking platform where customers can place orders and admins can manage them through a dashboard.

**Live:** [repas-lt.vercel.app](https://repas-lt.vercel.app)

## Tech stack

- **Next.js 15** · **React 19** · **TypeScript**
- **Tailwind CSS** · **ShadCN UI**
- **PostgreSQL** (Neon) · **Prisma ORM**
- **NextAuth.js** — email/password + Google OAuth + 2FA
- **Stripe** — online payments
- **Resend** — email
- **Leaflet** + **OpenStreetMap** — interactive address map

## Getting started

```bash
npm install
```

Create a `.env` file in the root and fill in the values:

```env
# Database connection string for neonDB
DATABASE_URL=

# NextAuth secret for signing tokens and encrypting data
AUTH_SECRET=

# Google OAuth credentials for authentication
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Resend API key for sending emails
RESEND_API_KEY=
# Email address used as the sender for outgoing emails
RESEND_EMAIL_FROM=

# Stripe API keys for payment processing
STRIPE_API_SECRET=

# Application URL for client-side and NextAuth configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# NextAuth Configuration - Required for production builds
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_TRUSTED_HOSTS="localhost:3000,localhost"
```

Push the database schema:

```bash
npx prisma db push
```

Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
actions/      — Server actions (auth, orders, settings)
app/          — Next.js App Router pages and API routes
  (auth)/     — Login, register, password reset
  (checkout)/ — Order flow and order history
  (protected)/— Account settings pages
  api/        — REST API routes
  dashboard/  — Admin panel
  paslaugos/  — Checkout page
components/   — UI components
  auth/       — Auth forms
  checkout/   — Order flow steps
  dashboard/  — Admin panel components
  map/        — Leaflet map components
  ui/         — ShadCN base components
lib/          — Prisma client, auth, Stripe, Resend, utils
prisma/       — Database schema and seed
schemas/      — Zod validation schemas
```

## Deployment

Hosted on [Vercel](https://vercel.com).

## Links
 
- Live demo: [https://repas-lt.vercel.app](https://repas-lt.vercel.app)
- Company website: [https://repas.lt](https://repas.lt)