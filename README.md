# tasks.isaaccritchley.uk

A production-ready Next.js task submission app that syncs tasks to Apple Reminders via IFTTT webhooks.

## Features

- **Public task submission** – Anyone can submit tasks with title, notes, category, name, and due date
- **IFTTT sync** – Tasks automatically sync to Apple Reminders via IFTTT webhooks
- **Magic link auth** – Email-based authentication via Resend (next-auth v5)
- **Admin dashboard** – Full management of tasks, categories, blocked IPs, and system lock
- **Audit log** – All events recorded for security and compliance
- **IP blocking** – Block abusive IPs from submitting tasks
- **System lock** – Temporarily disable task submissions

## Tech Stack

- **Next.js 16** with App Router and TypeScript
- **Drizzle ORM** + **Neon** (PostgreSQL)
- **next-auth v5** (beta) with Resend magic links
- **Tailwind CSS v4**
- **Zod v4** for validation

## Setup

1. Copy `.env.example` to `.env.local` and fill in your values
2. Run database migrations: `npm run db:push`
3. Seed initial data: `npm run db:seed`
4. Start dev server: `npm run dev`

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `AUTH_SECRET` | Random secret for next-auth (run `openssl rand -base64 32`) |
| `AUTH_RESEND_KEY` | Resend API key for magic link emails |
| `IFTTT_WEBHOOK_KEY` | IFTTT Maker webhook key |
| `IFTTT_EVENT_NAME` | IFTTT event name (default: `add_reminder`) |

## Database Commands

```bash
npm run db:generate   # Generate migrations
npm run db:migrate    # Run migrations
npm run db:push       # Push schema directly (dev)
npm run db:studio     # Open Drizzle Studio
npm run db:seed       # Seed initial categories and system config
```

## Admin Access

Set a user's `role` to `"admin"` in the database to grant admin access. Admin users can access `/admin`.
