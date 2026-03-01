# HealthMaxxing — Science-Backed Health Optimization Forum

A full-stack Next.js 15 forum platform for evidence-based health optimization, inspired by Qoves Studio's clean aesthetic.

## Tech Stack

- **Framework**: Next.js 15 (App Router) + TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: NextAuth.js v5 (OAuth: Google, GitHub + Credentials)
- **Image Uploads**: UploadThing
- **Styling**: Tailwind CSS + Radix UI components
- **Deployment**: Vercel

## Features

- 🏠 Beautiful landing page with stats
- 💬 Full forum with categories (Skincare, Fitness, Nutrition, Sleep, Longevity, Mental, Supplements, General)
- 🔐 Authentication (Google, GitHub OAuth + email/password)
- 📸 Image upload support in posts and comments
- ⬆️ Upvote/Downvote system
- 💬 Nested comments/replies
- ❤️ Comment likes
- 🏷️ Post tagging system
- 👤 User profiles
- 🔍 Search (coming soon)
- 📱 Fully responsive design

## Setup

### 1. Clone & Install

```bash
git clone https://github.com/raunaktreehouse-sketch/healthmaxxing.git
cd healthmaxxing
npm install
```

### 2. Database Setup

Create a PostgreSQL database (Supabase recommended for free tier):
1. Go to [supabase.com](https://supabase.com) → New Project
2. Copy the connection string

### 3. UploadThing Setup

1. Go to [uploadthing.com](https://uploadthing.com) → Create App
2. Copy App ID and Secret

### 4. OAuth Setup (Optional)

**Google**: [console.cloud.google.com](https://console.cloud.google.com) → Create OAuth 2.0 credentials
**GitHub**: [github.com/settings/developers](https://github.com/settings/developers) → New OAuth App

### 5. Environment Variables

Create `.env.local`:

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""

UPLOADTHING_SECRET=""
UPLOADTHING_APP_ID=""
```

### 6. Database Migration & Seed

```bash
npx prisma db push
npx prisma db generate
npx tsx prisma/seed.ts
```

### 7. Run

```bash
npm run dev
```

## Deployment to Vercel

1. Push to GitHub (already done)
2. Go to [vercel.com](https://vercel.com) → Import project from GitHub
3. Add all environment variables
4. Deploy!

### Connect healthmaxxing.org Domain

In Vercel: **Settings → Domains → Add** → Enter `healthmaxxing.org`

Vercel will give you DNS records to add in Hostinger:
- **A Record**: `@` → Vercel IP
- **CNAME Record**: `www` → `cname.vercel-dns.com`

## Domain DNS (Hostinger)

In Hostinger DNS Management for healthmaxxing.org:
| Type | Name | Value |
|------|------|-------|
| A | @ | 76.76.21.21 |
| CNAME | www | cname.vercel-dns.com |
