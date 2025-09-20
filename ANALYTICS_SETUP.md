# Analytics & Database Setup Guide

This guide will help you set up comprehensive user tracking and analytics for your Xova app.

## 🗄️ Database Setup

### 1. Supabase Database Tables

You need to create the following tables in your Supabase database:

```sql
-- User Events Table
CREATE TABLE user_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  event_type TEXT NOT NULL CHECK (event_type IN ('page_view', 'user_action', 'registration', 'recipe_generation', 'shop_interaction', 'error', 'conversion')),
  event_name TEXT NOT NULL,
  properties JSONB,
  page TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Sessions Table
CREATE TABLE user_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES auth.users(id),
  device_info JSONB,
  location JSONB,
  referrer TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  last_activity TIMESTAMP WITH TIME ZONE,
  page_views INTEGER DEFAULT 0,
  duration INTEGER, -- in seconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recipe Generations Table
CREATE TABLE recipe_generations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT NOT NULL,
  recipe_id TEXT NOT NULL,
  recipe_name TEXT,
  goal TEXT,
  mood_id TEXT,
  mood_name TEXT,
  ingredients JSONB,
  cost TEXT,
  prep_time INTEGER,
  user_profile JSONB,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Shop Interactions Table
CREATE TABLE shop_interactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT NOT NULL,
  shop_id TEXT NOT NULL,
  shop_name TEXT,
  action TEXT NOT NULL,
  recipe_id TEXT,
  properties JSONB,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Conversions Table
CREATE TABLE conversions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT NOT NULL,
  conversion_type TEXT NOT NULL,
  value TEXT,
  currency TEXT DEFAULT 'CHF',
  properties JSONB,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Analytics Summary Table
CREATE TABLE user_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  date TEXT NOT NULL, -- YYYY-MM-DD format
  page_views INTEGER DEFAULT 0,
  recipes_generated INTEGER DEFAULT 0,
  shop_interactions INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  session_duration INTEGER DEFAULT 0,
  last_activity TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Create indexes for better performance
CREATE INDEX idx_user_events_user_id ON user_events(user_id);
CREATE INDEX idx_user_events_session_id ON user_events(session_id);
CREATE INDEX idx_user_events_timestamp ON user_events(timestamp);
CREATE INDEX idx_user_events_event_type ON user_events(event_type);

CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_start_time ON user_sessions(start_time);

CREATE INDEX idx_recipe_generations_user_id ON recipe_generations(user_id);
CREATE INDEX idx_recipe_generations_timestamp ON recipe_generations(timestamp);

CREATE INDEX idx_shop_interactions_user_id ON shop_interactions(user_id);
CREATE INDEX idx_shop_interactions_shop_id ON shop_interactions(shop_id);

CREATE INDEX idx_conversions_user_id ON conversions(user_id);
CREATE INDEX idx_conversions_timestamp ON conversions(timestamp);

CREATE INDEX idx_user_analytics_user_id ON user_analytics(user_id);
CREATE INDEX idx_user_analytics_date ON user_analytics(date);
```

### 2. Row Level Security (RLS)

Enable RLS and create policies:

```sql
-- Enable RLS on all tables
ALTER TABLE user_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_analytics ENABLE ROW LEVEL SECURITY;

-- Create policies (users can only see their own data)
CREATE POLICY "Users can view own events" ON user_events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own events" ON user_events FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own sessions" ON user_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own sessions" ON user_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Similar policies for other tables...
```

## 📊 Google Analytics Setup

### 1. Create Google Analytics Property

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new GA4 property
3. Get your Measurement ID (format: G-XXXXXXXXXX)

### 2. Environment Variables

Create a `.env.local` file in your project root:

```env
# Supabase (you should already have these)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Optional: Additional analytics
NEXT_PUBLIC_MIXPANEL_TOKEN=your_mixpanel_token
NEXT_PUBLIC_HOTJAR_ID=your_hotjar_id
```

### 3. Update Your Layout

Add the analytics initialization to your root layout:

```tsx
// app/layout.tsx
import { useEffect } from 'react';
import { initGA } from '@/lib/analytics';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    initGA();
  }, []);

  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
```

## 🔧 Implementation Examples

### Track User Registration
```tsx
import { useAnalytics } from '@/hooks/useAnalytics';

const { trackUserRegistration } = useAnalytics();

// In your signup handler
const handleSignUp = async () => {
  // ... signup logic
  if (success) {
    await trackUserRegistration(user, profile);
  }
};
```

### Track Recipe Generation
```tsx
const { trackRecipeGeneration } = useAnalytics();

// In your recipe generation handler
const generateRecipe = async () => {
  // ... generation logic
  await trackRecipeGeneration(userProfile, mood, recipe);
};
```

### Track Shop Interactions
```tsx
const { trackShopInteraction } = useAnalytics();

// When user interacts with a shop
const handleShopClick = async (shopId: string) => {
  await trackShopInteraction('shop_viewed', shopId, shopName);
};
```

## 📈 Analytics Dashboard Queries

### User Registration Trends
```sql
SELECT 
  DATE(timestamp) as date,
  COUNT(*) as registrations
FROM user_events 
WHERE event_name = 'user_registered'
GROUP BY DATE(timestamp)
ORDER BY date DESC;
```

### Most Popular Recipe Goals
```sql
SELECT 
  properties->>'goal' as goal,
  COUNT(*) as count
FROM user_events 
WHERE event_name = 'recipe_generated'
GROUP BY properties->>'goal'
ORDER BY count DESC;
```

### User Engagement Metrics
```sql
SELECT 
  user_id,
  COUNT(*) as total_events,
  COUNT(DISTINCT session_id) as sessions,
  MAX(timestamp) as last_activity
FROM user_events 
GROUP BY user_id
ORDER BY total_events DESC;
```

## 🔒 Privacy & GDPR Compliance

### 1. Cookie Consent
The analytics system includes consent management:

```tsx
import { useAnalytics } from '@/hooks/useAnalytics';

const { setAnalyticsConsent } = useAnalytics();

// When user accepts cookies
const handleAcceptCookies = () => {
  setAnalyticsConsent(true);
};
```

### 2. Data Retention
Set up automated data cleanup:

```sql
-- Delete events older than 2 years
DELETE FROM user_events 
WHERE timestamp < NOW() - INTERVAL '2 years';
```

## 🚀 Next Steps

1. **Set up the database tables** in Supabase
2. **Configure environment variables**
3. **Test the tracking** in development
4. **Set up analytics dashboards** in Google Analytics
5. **Monitor data collection** and adjust as needed

## 📊 Key Metrics to Track

- **User Registration Rate**
- **Recipe Generation Completion Rate**
- **Shop Interaction Rate**
- **User Retention (Daily/Weekly/Monthly)**
- **Most Popular Recipe Types**
- **User Journey Analysis**
- **Error Rates and Types**

This setup gives you comprehensive tracking of user behavior while maintaining privacy compliance and data security.
