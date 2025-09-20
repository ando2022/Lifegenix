# Free Smoothie Event Setup Guide

## Quick Setup

### 1. Database Setup

You need to set up a PostgreSQL database first. You have two options:

#### Option A: Use Supabase (Recommended - Free Tier Available)
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Once created, go to Settings → Database
3. Copy the connection string (use the "Connection string" under Connection Pooling)
4. It will look like: `postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres`

#### Option B: Use Local PostgreSQL
1. Install PostgreSQL locally
2. Create a new database: `createdb lifegenix`
3. Your connection string will be: `postgresql://username:password@localhost:5432/lifegenix`

### 2. Environment Variables

Add these to your `.env.local` file:

```env
# Database (required)
DATABASE_URL=your_postgresql_connection_string_here

# Supabase Auth (required for authentication)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# For Supabase Auth, get these from:
# Supabase Dashboard → Settings → API
```

### 3. Run Database Migrations

Once your `.env.local` is configured with the DATABASE_URL:

```bash
# Generate migrations (already done)
npm run db:generate

# Apply migrations to your database
npm run db:migrate
```

### 4. Start the App

```bash
npm run dev
```

### 5. Access the Event Page

Navigate to: [http://localhost:3000/event/free-smoothie](http://localhost:3000/event/free-smoothie)

## Features

- ✅ Mobile-optimized design
- ✅ User registration with Supabase Auth
- ✅ 5-question health questionnaire
- ✅ Green completion screen for smoothie verification
- ✅ Data stored in PostgreSQL via Drizzle ORM

## Troubleshooting

### "password authentication failed"
- Check your DATABASE_URL is correct
- Ensure the password doesn't contain special characters that need URL encoding
- For Supabase, use the connection pooler URL (port 6543) not the direct connection

### "Can't find meta/_journal.json"
- Run `npm run db:generate` first to generate migration files

### Build errors
- Run `npm install` to ensure all dependencies are installed
- Check that `.env.local` exists with all required variables

## Testing the Flow

1. Go to `/event/free-smoothie`
2. Sign up with email and password
3. Complete the 5-question health questionnaire
4. Show the green success screen to get your free smoothie!

## Database Schema

The event data is stored in the `event_participants` table with:
- User registration info (email, name, phone)
- Questionnaire responses (JSON)
- Completion timestamp
- Claim status for tracking redemptions