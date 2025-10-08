-- Migration Script: Update lifestyle_assessments columns to support decimal values
-- Run this script to update existing database tables

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Update existing columns to DECIMAL type
ALTER TABLE lifestyle_assessments 
ALTER COLUMN exercise_frequency TYPE DECIMAL(3,1);

ALTER TABLE lifestyle_assessments 
ALTER COLUMN diet_quality TYPE DECIMAL(3,1);

ALTER TABLE lifestyle_assessments 
ALTER COLUMN social_connections TYPE DECIMAL(3,1);

ALTER TABLE lifestyle_assessments 
ALTER COLUMN sleep_quality TYPE DECIMAL(3,1);

ALTER TABLE lifestyle_assessments 
ALTER COLUMN screen_time TYPE DECIMAL(4,1);

ALTER TABLE lifestyle_assessments 
ALTER COLUMN outdoor_time TYPE DECIMAL(3,1);

-- Show the updated table structure
SELECT 
    column_name, 
    data_type,
    numeric_precision,
    numeric_scale
FROM information_schema.columns 
WHERE table_name = 'lifestyle_assessments' 
AND column_name IN ('exercise_frequency', 'diet_quality', 'social_connections', 'sleep_quality', 'screen_time', 'outdoor_time')
ORDER BY column_name;

-- Test inserting decimal values
INSERT INTO lifestyle_assessments (
    user_id, 
    exercise_frequency, 
    diet_quality, 
    social_connections, 
    sleep_quality, 
    screen_time, 
    outdoor_time
) VALUES (
    'test-decimal-' || extract(epoch from now())::text,
    3.5,  -- 3.5 days per week
    7.5,  -- 7.5/10 diet quality
    6.5,  -- 6.5/10 social connections
    8.0,  -- 8/10 sleep quality
    4.5,  -- 4.5 hours screen time
    2.5   -- 2.5 hours outdoor time
) ON CONFLICT (user_id) DO NOTHING;

-- Verify the test data was inserted correctly
SELECT 
    user_id,
    exercise_frequency,
    diet_quality,
    social_connections,
    sleep_quality,
    screen_time,
    outdoor_time
FROM lifestyle_assessments 
WHERE user_id LIKE 'test-decimal-%'
ORDER BY created_at DESC
LIMIT 1;

-- Clean up test data
DELETE FROM lifestyle_assessments WHERE user_id LIKE 'test-decimal-%';

SELECT 'Migration completed successfully - lifestyle_assessments now supports decimal values!' as status;
