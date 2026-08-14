# Gregory Barmpas Portfolio

Premium recruiter-facing portfolio for Gregory Barmpas, built with Next.js App Router, TypeScript, Tailwind CSS, Prisma, Auth.js, Neon Postgres, Resend, and a privacy-friendly custom analytics layer.

## Features

- Public portfolio homepage with hero, about, skills, experience, education, and contact CTA
- Database-backed project showcase with search, filters, sorting, case-study pages, and click/view tracking
- Protected admin dashboard with project CRUD, reordering, archive/hide/delete, GitHub metadata sync, contact management, and analytics charts
- Contact form storage, honeypot protection, basic rate limiting, and Resend email forwarding
- Privacy-conscious analytics that hash IPs and never store raw IP addresses
- Print-friendly CV page with tracked PDF downloads
- Vercel + Neon deployment readiness

## Tech Stack

- Next.js App Router, React, TypeScript
- Tailwind CSS, Lucide React, Framer Motion
- Prisma ORM with Postgres/Neon
- Auth.js / NextAuth with GitHub OAuth and Prisma Adapter
- Resend for email forwarding
- Zod validation
- Recharts for admin analytics

## Local Setup

Install dependencies:

```bash
npm install
```

Create `.env` from the example:

```bash
cp .env.example .env
```

Configure:

```env
DATABASE_URL=
AUTH_SECRET=
AUTH_TRUST_HOST=true
GITHUB_ID=
GITHUB_SECRET=
ADMIN_EMAIL=
ADMIN_GITHUB_LOGIN=GregB712
RESEND_API_KEY=
RESEND_FROM_EMAIL=Portfolio <onboarding@resend.dev>
CONTACT_TO_EMAIL=gregorybarbas@gmail.com
GITHUB_TOKEN=
```

## Neon Database

1. Create a Neon Postgres project.
2. Copy the pooled or direct connection string into `DATABASE_URL`.
3. Run Prisma:

```bash
npm run db:migrate
npm run db:seed
```

Use Prisma Studio if needed:

```bash
npm run db:studio
```

## GitHub OAuth Admin

Create a GitHub OAuth app with callback:

```txt
http://localhost:3000/api/auth/callback/github
```

For production, add:

```txt
https://your-domain.com/api/auth/callback/github
```

Set `GITHUB_ID`, `GITHUB_SECRET`, `AUTH_SECRET`, `AUTH_TRUST_HOST=true`, and `ADMIN_EMAIL`. Only the configured admin email or `ADMIN_GITHUB_LOGIN` can sign in. If you set `AUTH_URL`, give it the full deployed origin, for example `https://your-domain.com`; do not leave it as an empty variable.

## Projects

Seed important projects:

```bash
npm run db:seed-projects
```

Archive database projects not present in the seed config:

```bash
npm run db:seed-projects -- --archive-missing
```

Overwrite manually edited seeded fields:

```bash
npm run db:seed-projects -- --force
```

Sync GitHub metadata:

```bash
npm run github:sync
npm run github:sync -- --repo=Loomi-Brain
```

The sync updates stars, forks, primary language, GitHub update date, and missing repo URLs. It does not overwrite long descriptions, problem statements, categories, tags, deployment URLs, priority, featured flags, or status.

## Contact + Resend

Set `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, and a verified `RESEND_FROM_EMAIL` for production. Contact submissions are stored in Postgres and forwarded by email. The admin dashboard can mark messages as read, replied, archived, spam, or delete them.

## Analytics

The app stores:

- Page views
- Project views
- GitHub and demo clicks
- CV downloads
- Contact submits
- LinkedIn/GitHub profile clicks
- Email copy events

Raw IP addresses are never stored. IPs are salted and hashed server-side for basic deduplication/rate limiting.

## CV PDF

Place the final PDF at:

```txt
public/Gregory_Barmpas_CV.pdf
```

The `/cv` page is print-friendly and the PDF download link is tracked.

## Run Locally

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

Admin dashboard:

```txt
http://localhost:3000/admin
```

## Deploy on Vercel

1. Push the repository to GitHub.
2. Create a Vercel project.
3. Add the environment variables from `.env.example`.
4. Connect Neon Postgres.
5. Run migrations against the production database:

```bash
npm run db:migrate
npm run db:seed
```

6. Deploy.

The build script runs `prisma generate && next build`.
