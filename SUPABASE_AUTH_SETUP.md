# Supabase OAuth Setup Guide

## Overview
The sign-up and sign-in pages now support multiple authentication methods:
- **Google OAuth** (requires configuration in Supabase)
- **GitHub OAuth** (requires configuration in Supabase) 
- **Apple Sign In** (requires configuration in Supabase)
- **Email/Password** (works by default)

## Setting Up Google OAuth in Supabase

### Step 1: Enable Google Provider in Supabase

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **Authentication** → **Providers**
4. Find **Google** in the list and click to expand
5. Toggle **Enable Google** to ON

### Step 2: Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API:
   - Go to **APIs & Services** → **Library**
   - Search for "Google+ API"
   - Click and enable it

4. Create OAuth 2.0 Credentials:
   - Go to **APIs & Services** → **Credentials**
   - Click **+ CREATE CREDENTIALS** → **OAuth client ID**
   - If prompted, configure OAuth consent screen first:
     - Choose "External" for user type
     - Fill in required fields (app name, support email, etc.)
     - Add your domain to authorized domains
     - Save and continue
   
5. Create OAuth client:
   - Application type: **Web application**
   - Name: "Xova Smoothie App" (or your choice)
   - Authorized JavaScript origins:
     ```
     http://localhost:3000
     http://localhost:3001
     http://localhost:3002
     http://localhost:3003
     http://localhost:3004
     https://your-domain.com
     ```
   - Authorized redirect URIs (IMPORTANT):
     ```
     https://[YOUR-SUPABASE-PROJECT-REF].supabase.co/auth/v1/callback
     ```
     (Get this URL from Supabase Dashboard → Authentication → Providers → Google)
   - Click **CREATE**

6. Copy the credentials:
   - **Client ID**: Copy this
   - **Client Secret**: Copy this

### Step 3: Configure Supabase with Google Credentials

1. Back in Supabase Dashboard → Authentication → Providers → Google
2. Paste your **Client ID** in the "Client ID" field
3. Paste your **Client Secret** in the "Client Secret" field
4. Leave "Authorized Client IDs" empty (unless you need specific client restrictions)
5. Click **Save**

### Step 4: Test Google Sign In

1. Visit http://localhost:3004/auth/signup
2. Click "Continue with Google"
3. You should be redirected to Google's OAuth consent screen
4. After authorizing, you'll be redirected back to your dashboard

## Setting Up GitHub OAuth (Optional)

### Step 1: Create GitHub OAuth App

1. Go to GitHub → Settings → Developer settings → OAuth Apps
2. Click **New OAuth App**
3. Fill in:
   - Application name: "Xova Smoothie App"
   - Homepage URL: `http://localhost:3004`
   - Authorization callback URL: `https://[YOUR-SUPABASE-PROJECT-REF].supabase.co/auth/v1/callback`
4. Click **Register application**
5. Copy the **Client ID**
6. Generate and copy a new **Client Secret**

### Step 2: Configure in Supabase

1. Supabase Dashboard → Authentication → Providers → GitHub
2. Toggle **Enable GitHub** to ON
3. Paste Client ID and Client Secret
4. Save

## Setting Up Apple Sign In (Optional)

Apple Sign In requires:
- Apple Developer account ($99/year)
- App ID configuration
- Service ID configuration
- Key generation

Detailed steps: [Supabase Apple Auth Guide](https://supabase.com/docs/guides/auth/social-login/auth-apple)

## Troubleshooting

### "Google OAuth is not enabled"
- Make sure you've enabled Google provider in Supabase Dashboard
- Check that you've saved the configuration after adding credentials

### "Redirect URI mismatch" 
- The redirect URI in Google Console must EXACTLY match Supabase's callback URL
- Format: `https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback`
- No trailing slashes!

### "Invalid client" error
- Double-check Client ID and Client Secret are correctly copied
- Ensure no extra spaces when pasting
- Try regenerating the client secret if issues persist

### Users not appearing in database
- OAuth users are automatically created in Supabase Auth
- The app creates a corresponding record in your `users` table on first smoothie save
- Check Supabase Dashboard → Authentication → Users to see all auth users

## Environment Variables

Your `.env.local` already has the required Supabase variables:
```env
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR-ANON-KEY]
```

No additional environment variables needed for OAuth - it's all configured in Supabase Dashboard.

## Features Implemented

✅ **Sign Up Page** (`/auth/signup`)
- Google OAuth button
- GitHub OAuth button  
- Apple Sign In button
- Email/password form
- Proper loading states for each provider
- Redirect handling after auth

✅ **Sign In Page** (`/auth/signin`)
- Same OAuth providers as sign up
- Forgot password functionality
- Remember redirect URL through auth flow

✅ **Auth Flow**
- Automatic redirect to dashboard after successful auth
- Preserves intended destination through OAuth flow
- Handles email confirmation when required
- Shows appropriate error messages

## Security Notes

- Client secrets are stored in Supabase, not in your code
- OAuth redirect URIs are validated by providers
- Supabase handles token exchange securely
- User sessions are managed by Supabase Auth