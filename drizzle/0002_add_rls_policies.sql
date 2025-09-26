-- Add RLS policies for analytics tables
-- This migration enables Row Level Security and creates policies for user tracking

-- Enable RLS on user_events table
ALTER TABLE user_events ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for idempotency)
DROP POLICY IF EXISTS "Allow anonymous insert to user_events" ON user_events;
DROP POLICY IF EXISTS "Allow authenticated insert to user_events" ON user_events;
DROP POLICY IF EXISTS "Users can view own events" ON user_events;
DROP POLICY IF EXISTS "Anonymous can view session events" ON user_events;

-- Create policies for user_events
CREATE POLICY "Allow anonymous insert to user_events"
ON user_events
FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Allow authenticated insert to user_events"
ON user_events
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Users can view own events"
ON user_events
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Anonymous can view session events"
ON user_events
FOR SELECT
TO anon
USING (session_id IS NOT NULL);

-- Enable RLS on user_sessions table
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow anonymous insert to user_sessions" ON user_sessions;
DROP POLICY IF EXISTS "Allow authenticated insert to user_sessions" ON user_sessions;
DROP POLICY IF EXISTS "Users can view own sessions" ON user_sessions;
DROP POLICY IF EXISTS "Allow anonymous update to user_sessions" ON user_sessions;
DROP POLICY IF EXISTS "Allow authenticated update to user_sessions" ON user_sessions;

-- Create policies for user_sessions
CREATE POLICY "Allow anonymous insert to user_sessions"
ON user_sessions
FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Allow authenticated insert to user_sessions"
ON user_sessions
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow anonymous update to user_sessions"
ON user_sessions
FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow authenticated update to user_sessions"
ON user_sessions
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Users can view own sessions"
ON user_sessions
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Enable RLS on recipe_generations table
ALTER TABLE recipe_generations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow anonymous insert to recipe_generations" ON recipe_generations;
DROP POLICY IF EXISTS "Allow authenticated insert to recipe_generations" ON recipe_generations;
DROP POLICY IF EXISTS "Users can view own recipe generations" ON recipe_generations;

-- Create policies for recipe_generations
CREATE POLICY "Allow anonymous insert to recipe_generations"
ON recipe_generations
FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Allow authenticated insert to recipe_generations"
ON recipe_generations
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Users can view own recipe generations"
ON recipe_generations
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Enable RLS on shop_interactions table
ALTER TABLE shop_interactions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow anonymous insert to shop_interactions" ON shop_interactions;
DROP POLICY IF EXISTS "Allow authenticated insert to shop_interactions" ON shop_interactions;
DROP POLICY IF EXISTS "Users can view own shop interactions" ON shop_interactions;

-- Create policies for shop_interactions
CREATE POLICY "Allow anonymous insert to shop_interactions"
ON shop_interactions
FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Allow authenticated insert to shop_interactions"
ON shop_interactions
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Users can view own shop interactions"
ON shop_interactions
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Enable RLS on conversions table
ALTER TABLE conversions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow anonymous insert to conversions" ON conversions;
DROP POLICY IF EXISTS "Allow authenticated insert to conversions" ON conversions;
DROP POLICY IF EXISTS "Users can view own conversions" ON conversions;

-- Create policies for conversions
CREATE POLICY "Allow anonymous insert to conversions"
ON conversions
FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Allow authenticated insert to conversions"
ON conversions
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Users can view own conversions"
ON conversions
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Enable RLS on user_analytics table
ALTER TABLE user_analytics ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow anonymous insert to user_analytics" ON user_analytics;
DROP POLICY IF EXISTS "Allow authenticated insert to user_analytics" ON user_analytics;
DROP POLICY IF EXISTS "Allow anonymous update to user_analytics" ON user_analytics;
DROP POLICY IF EXISTS "Allow authenticated update to user_analytics" ON user_analytics;
DROP POLICY IF EXISTS "Users can view own analytics" ON user_analytics;

-- Create policies for user_analytics
CREATE POLICY "Allow anonymous insert to user_analytics"
ON user_analytics
FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Allow authenticated insert to user_analytics"
ON user_analytics
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow anonymous update to user_analytics"
ON user_analytics
FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow authenticated update to user_analytics"
ON user_analytics
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Users can view own analytics"
ON user_analytics
FOR SELECT
TO authenticated
USING (user_id = auth.uid());