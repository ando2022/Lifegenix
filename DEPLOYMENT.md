# Production Deployment Guide

## Critical: Database Connection Issue

The production error `getaddrinfo ENOTFOUND db.byyxnzeblpbuzvxubhgc.supabase.co` indicates your DATABASE_URL is not properly configured in production.

### Environment Variables Required

In your production environment (Vercel, Netlify, etc.), you need to set these environment variables:

```bash
# Database - IMPORTANT: URL-encode special characters in password!
DATABASE_URL=postgresql://postgres:Anastasia89%26@db.byyxnzeblpbuzvxubhgc.supabase.co:5432/postgres

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://byyxnzeblpbuzvxubhgc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5eXhuemVibHBidXp2eHViaGdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwMzY2MTAsImV4cCI6MjA3MzYxMjYxMH0.zPmKFVAyCU-MtzyD8ckqqV8NCe_6Yh6FSiI8SSshoFA

# Google Places (if using cafe features)
NEXT_PUBLIC_GOOGLE_PLACES_KEY=AIzaSyAg7AulOBOXCnrsMEf3PKNCXsWkH3iduRA
```

### Important Notes:

1. **PASSWORD ENCODING**: The `&` character in your password `Anastasia89&` must be URL-encoded as `%26`.
   - Original: `Anastasia89&`
   - Encoded: `Anastasia89%26`

2. **Verify Supabase Project Status**:
   - Log into Supabase dashboard
   - Ensure your project is active (not paused)
   - Check if the database is accessible

3. **For Vercel Deployment**:
   - Go to your project settings
   - Navigate to Environment Variables
   - Add all the variables above
   - Redeploy after adding variables

4. **For Other Platforms**:
   - Follow similar steps in your platform's dashboard
   - Ensure all environment variables are properly set

## OAuth Redirect Issue Fix

The redirect after `/event/free-smoothie` OAuth login needs the production URL configured:

1. **In Supabase Dashboard**:
   - Go to Authentication > URL Configuration
   - Add your production URL to "Redirect URLs":
     - `https://your-domain.com/auth/callback`
   - Update "Site URL" to your production domain

2. **Update OAuth Redirects**:
   - The code already handles redirects properly
   - Ensure your production domain is whitelisted in Supabase

## Testing Production Connection

After deploying with correct environment variables:

1. Check if the database connection works:
   - Try logging in
   - Check browser console for errors
   - Check server logs in your deployment platform

2. If still having issues:
   - Verify Supabase project is not paused
   - Check if IP restrictions are enabled (disable for testing)
   - Ensure all environment variables are exactly as shown above

## Fix for 400 Bad Request on user_events

The error `POST https://[project].supabase.co/rest/v1/user_events 400 (Bad Request)` occurs because RLS policies are not configured in production.

### Solution - Run the Drizzle Migration:

1. **Option A: Run via Supabase SQL Editor** (Recommended):
   - Go to Supabase Dashboard → SQL Editor
   - Copy the contents of `drizzle/0002_add_rls_policies.sql`
   - Paste and run the SQL
   - This enables Row Level Security and creates necessary policies

2. **Option B: Run via Drizzle CLI**:
   ```bash
   # Set the DATABASE_URL with URL-encoded password
   export DATABASE_URL="postgresql://postgres:Anastasia89%26@db.byyxnzeblpbuzvxubhgc.supabase.co:5432/postgres"

   # Run the migration
   npx drizzle-kit migrate
   ```

3. **Verify Migration Success**:
   - Check Supabase Dashboard → Database → Tables
   - Verify RLS is enabled on analytics tables
   - Test the event tracking in production

## Common Issues:

1. **Database Connection Failed**:
   - Usually due to incorrect DATABASE_URL format
   - Special characters in password not encoded
   - Supabase project paused or deleted

2. **OAuth Redirect Not Working**:
   - Production URL not added to Supabase redirect URLs
   - Site URL in Supabase not updated

3. **Environment Variables Not Loading**:
   - Platform requires rebuild after adding env vars
   - Variable names don't match exactly (case-sensitive)