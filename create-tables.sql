-- Create NHS Waitlist Database Tables
-- This script creates all the necessary tables for the application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    nhs_number TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create onboarding_responses table
CREATE TABLE IF NOT EXISTS onboarding_responses (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR REFERENCES users(id) NOT NULL,
    responses JSONB NOT NULL,
    risk_score INTEGER NOT NULL,
    baseline_anxiety_level TEXT NOT NULL,
    completed_at TIMESTAMP DEFAULT NOW()
);

-- Create weekly_assessments table
CREATE TABLE IF NOT EXISTS weekly_assessments (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR REFERENCES users(id) NOT NULL,
    week_number INTEGER NOT NULL,
    responses JSONB NOT NULL,
    risk_score INTEGER NOT NULL,
    risk_level TEXT NOT NULL,
    needs_escalation BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP DEFAULT NOW()
);

-- Create anxiety_modules table
CREATE TABLE IF NOT EXISTS anxiety_modules (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR REFERENCES users(id) NOT NULL,
    week_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    estimated_minutes INTEGER NOT NULL,
    activities_total INTEGER NOT NULL,
    activities_completed INTEGER DEFAULT 0,
    minutes_completed INTEGER DEFAULT 0,
    is_locked BOOLEAN DEFAULT TRUE,
    completed_at TIMESTAMP,
    last_accessed_at TIMESTAMP,
    content_data JSONB,
    user_progress JSONB
);

-- Create module_activities table
CREATE TABLE IF NOT EXISTS module_activities (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id VARCHAR REFERENCES anxiety_modules(id) NOT NULL,
    activity_type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    content JSONB NOT NULL,
    estimated_minutes INTEGER NOT NULL,
    order_index INTEGER NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,
    user_response JSONB
);

-- Create progress_reports table
CREATE TABLE IF NOT EXISTS progress_reports (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR REFERENCES users(id) NOT NULL,
    report_data JSONB NOT NULL,
    generated_at TIMESTAMP DEFAULT NOW()
);

-- Create thought_records table
CREATE TABLE IF NOT EXISTS thought_records (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR REFERENCES users(id) NOT NULL,
    situation TEXT NOT NULL,
    emotion TEXT NOT NULL,
    intensity INTEGER NOT NULL,
    physical_sensations TEXT,
    automatic_thought TEXT,
    evidence_for TEXT,
    evidence_against TEXT,
    balanced_thought TEXT,
    new_emotion TEXT,
    new_intensity INTEGER,
    action_plan TEXT,
    selected_distortions JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create mood_entries table
CREATE TABLE IF NOT EXISTS mood_entries (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR REFERENCES users(id) NOT NULL,
    entry_date DATE NOT NULL,
    mood INTEGER NOT NULL,
    energy INTEGER NOT NULL,
    anxiety INTEGER NOT NULL,
    sleep INTEGER NOT NULL,
    emotions JSONB,
    activities JSONB,
    thoughts TEXT,
    gratitude JSONB,
    challenges TEXT,
    wins TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create health_check table (if not exists)
CREATE TABLE IF NOT EXISTS health_check (
    id SERIAL PRIMARY KEY,
    status VARCHAR(50) DEFAULT 'healthy',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial health check record
INSERT INTO health_check (status) VALUES ('tables_created') ON CONFLICT DO NOTHING;

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE nhs_waitlist TO nhs_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO nhs_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO nhs_user;

-- Show created tables
SELECT 'Database tables created successfully' as status;
