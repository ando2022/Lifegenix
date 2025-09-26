-- Debug script to check user_events table in production

-- 1. Check if the table exists and its structure
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'user_events'
ORDER BY ordinal_position;

-- 2. Check if the enum type exists and its values
SELECT
    n.nspname as schema,
    t.typname as enum_name,
    e.enumlabel as enum_value,
    e.enumsortorder as sort_order
FROM pg_type t
    JOIN pg_enum e ON t.oid = e.enumtypid
    JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
WHERE t.typname = 'event_type'
ORDER BY e.enumsortorder;

-- 3. Check RLS status
SELECT
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE tablename = 'user_events';

-- 4. Test insert with minimal data
-- This should work if the table is set up correctly
INSERT INTO user_events (
    session_id,
    event_type,
    event_name
) VALUES (
    'test_session_123',
    'user_action',
    'test_event'
) RETURNING *;

-- 5. Clean up test data
DELETE FROM user_events WHERE session_id = 'test_session_123';