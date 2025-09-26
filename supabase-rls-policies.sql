-- RLS Policies for user_events table
-- Run this in Supabase SQL Editor

-- Enable RLS on user_events table
ALTER TABLE user_events ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow anonymous users to insert their own events
CREATE POLICY "Allow anonymous insert to user_events"
ON user_events
FOR INSERT
TO anon
WITH CHECK (true);

-- Policy 2: Allow authenticated users to insert their own events
CREATE POLICY "Allow authenticated insert to user_events"
ON user_events
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy 3: Allow users to read their own events
CREATE POLICY "Users can view own events"
ON user_events
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Policy 4: Allow anonymous users to read their session events
CREATE POLICY "Anonymous can view session events"
ON user_events
FOR SELECT
TO anon
USING (session_id IS NOT NULL);

-- Also enable RLS and add policies for related tables

-- user_sessions table
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

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

CREATE POLICY "Users can view own sessions"
ON user_sessions
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- recipe_generations table
ALTER TABLE recipe_generations ENABLE ROW LEVEL SECURITY;

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

-- shop_interactions table
ALTER TABLE shop_interactions ENABLE ROW LEVEL SECURITY;

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

-- conversions table
ALTER TABLE conversions ENABLE ROW LEVEL SECURITY;

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

-- user_analytics table
ALTER TABLE user_analytics ENABLE ROW LEVEL SECURITY;

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

CREATE POLICY "Users can view own analytics"
ON user_analytics
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Verify policies are created
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename IN (
    'user_events',
    'user_sessions',
    'recipe_generations',
    'shop_interactions',
    'conversions',
    'user_analytics'
)
ORDER BY tablename, policyname;