# Supabase OAuth Configuration for Production

## Critical: Configure these URLs in Supabase Dashboard

### 1. Go to Supabase Dashboard → Authentication → URL Configuration

### 2. Set the Site URL:
```
https://www.xova.ch
```

### 3. Add ALL these Redirect URLs (one per line):
```
https://www.xova.ch/auth/callback
https://xova.ch/auth/callback
http://localhost:3000/auth/callback
http://localhost:3000/**
https://www.xova.ch/**
https://xova.ch/**
```

### 4. Google OAuth Configuration

Go to Authentication → Providers → Google:

1. **Ensure Google is enabled**

2. **In Google Cloud Console** (console.cloud.google.com):
   - Go to APIs & Services → Credentials
   - Edit your OAuth 2.0 Client
   - Add these Authorized redirect URIs:
     ```
     https://byyxnzeblpbuzvxubhgc.supabase.co/auth/v1/callback
     https://www.xova.ch/auth/callback
     https://xova.ch/auth/callback
     ```

3. **Copy the Client ID and Client Secret** to Supabase

### 5. Environment Variables in Production

Ensure these are set in your deployment platform (Vercel, etc.):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://byyxnzeblpbuzvxubhgc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5eXhuemVibHBidXp2eHViaGdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwMzY2MTAsImV4cCI6MjA3MzYxMjYxMH0.zPmKFVAyCU-MtzyD8ckqqV8NCe_6Yh6FSiI8SSshoFA
```

## Testing the OAuth Flow

1. **Clear browser cookies** for xova.ch domain
2. **Visit** https://www.xova.ch/event/free-smoothie
3. **Click** "Continue with Google"
4. **After authentication**, should redirect to:
   - https://www.xova.ch/auth/callback
   - Then to: https://www.xova.ch/event/free-smoothie?event=true

## Common Issues:

### "Redirect URL mismatch"
- The redirect URL in the code doesn't match what's configured in Supabase
- Solution: Add the exact URL to Supabase redirect URLs list

### "OAuth callback not working"
- The Site URL in Supabase doesn't match production
- Solution: Set Site URL to `https://www.xova.ch`

### "Redirect loop"
- The auth callback route isn't processing the code properly
- Solution: Check server logs for auth callback errors

## Debug Steps:

1. **Check browser Network tab** during OAuth flow
2. **Look for the redirect** from Google to Supabase
3. **Then the redirect** from Supabase to your app
4. **Check for any 4xx or 5xx errors**

## After Configuration:

**IMPORTANT**: Changes to Supabase URL Configuration can take up to 60 seconds to propagate.