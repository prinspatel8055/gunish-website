# GUNICSH - Ganpat University | International Conference on Social Sciences & Humanities

A full-stack, self-hosted Content Management System (CMS) and public-facing website built for the Ganpat University International Conference on Social Sciences & Humanities (GUNICSH / Gunish). It is a unified Next.js application that serves both a dynamic public website and a secure, role-based admin portal for managing all conference content.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 |
| **Database** | PostgreSQL |
| **ORM** | Prisma v6 |
| **Authentication** | JWT via `jose` library (HttpOnly cookies) |
| **Password Hashing** | bcryptjs |
| **Edge Security** | Next.js Proxy (`src/proxy.ts`) |
| **Toast Notifications** | Sonner |
| **Icons** | Lucide React |
| **File Storage** | Local filesystem (`/public/uploads/`) |

---

## Getting Started (Local Development)

### Prerequisites

- **Node.js**: v20 or later
- **PostgreSQL**: v14 or later (running locally or accessible via network)
- **pnpm**: v9 or later (recommended)

### Installation

```bash
# Install dependencies
pnpm install

# Push database schema
npx prisma db push

# Seed Gunish conference data
npx tsx scripts/seed.ts

# Start development server
pnpm dev
```
Open [http://localhost:5000](http://localhost:5000) in your browser.
Admin portal: [http://localhost:5000/admin](http://localhost:5000/admin) (Default: `admin` / `admin@2026`).
