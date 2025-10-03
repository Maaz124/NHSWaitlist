-- Clear all tables in the NHS Waitlist database
-- WARNING: This will delete ALL data from all tables

-- Disable foreign key checks temporarily
SET session_replication_role = replica;

-- Clear all tables (in reverse dependency order)
TRUNCATE TABLE progress_reports CASCADE;
TRUNCATE TABLE module_activities CASCADE;
TRUNCATE TABLE anxiety_modules CASCADE;
TRUNCATE TABLE weekly_assessments CASCADE;
TRUNCATE TABLE onboarding_responses CASCADE;
TRUNCATE TABLE users CASCADE;
TRUNCATE TABLE health_check CASCADE;

-- Re-enable foreign key checks
SET session_replication_role = DEFAULT;

-- Reset sequences to start from 1
ALTER SEQUENCE IF EXISTS health_check_id_seq RESTART WITH 1;

-- Re-insert the health check record
INSERT INTO health_check (status) VALUES ('database_cleared');

-- Show current table status
SELECT 'Tables cleared successfully' as status;
