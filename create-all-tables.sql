-- NHS Waitlist Application - Complete Database Schema
-- This script creates ALL tables and columns currently in use
-- Generated from live database inspection

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- CORE USER MANAGEMENT TABLES
-- =====================================================

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    phone_number TEXT,
    nhs_number TEXT,
    has_paid BOOLEAN DEFAULT FALSE,
  paid_amount INTEGER DEFAULT 0,
  paid_currency TEXT DEFAULT 'usd',
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- ASSESSMENT AND TRACKING TABLES
-- =====================================================

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

-- =====================================================
-- MOOD TRACKING TABLE
-- =====================================================

-- Create mood_entries table (with calendar integration and PDF export)
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

-- =====================================================
-- EDUCATIONAL MODULE TABLES
-- =====================================================

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

-- =====================================================
-- COMPREHENSIVE MODULE DATA TABLES
-- =====================================================

-- Create anxiety_guides table (Understanding Anxiety module)
CREATE TABLE IF NOT EXISTS anxiety_guides (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR REFERENCES users(id) NOT NULL,
    completed_sections JSONB,
    personal_notes JSONB,
    symptom_checklist JSONB,
    coping_tools_rating JSONB,
    worksheet_entries JSONB,
    quiz_answers JSONB,
    progress_data JSONB,
    action_plan_data JSONB,
    symptom_tracking_worksheet JSONB,
    personal_management_plan JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create sleep_assessments table (Sleep and Anxiety module)
CREATE TABLE IF NOT EXISTS sleep_assessments (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR REFERENCES users(id) NOT NULL,
    bed_time VARCHAR,
    wake_time VARCHAR,
    sleep_latency INTEGER,
    night_wakes INTEGER,
    sleep_quality INTEGER,
    daytime_energy INTEGER,
    anxiety_level INTEGER,
    sleep_environment JSONB,
    pre_sleep_routine JSONB,
    hindrances JSONB,
    personal_plan JSONB,
    additional_notes TEXT,
    completed_sections JSONB,
    progress_data JSONB,
    personal_notes JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create lifestyle_assessments table (Lifestyle & Wellbeing module)
CREATE TABLE IF NOT EXISTS lifestyle_assessments (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR REFERENCES users(id) NOT NULL,
    exercise_frequency DECIMAL(3,1),
    exercise_types JSONB,
    diet_quality DECIMAL(3,1),
    social_connections DECIMAL(3,1),
    stress_management JSONB,
    sleep_quality DECIMAL(3,1),
    screen_time DECIMAL(4,1),
    outdoor_time DECIMAL(3,1),
    hobbies JSONB,
    barriers JSONB,
    eating_habits JSONB,
    nutrition_challenges JSONB,
    social_support JSONB,
    social_challenges JSONB,
    personal_goals JSONB,
    personal_notes JSONB,
    completed_sections JSONB,
    progress_data JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- THERAPEUTIC TOOLS TABLES
-- =====================================================

-- Create thought_records table (Cognitive Behavioral Therapy)
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

-- Create weekly_thought_records table (for weekly module thought records)
CREATE TABLE IF NOT EXISTS weekly_thought_records (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR REFERENCES users(id) NOT NULL,
    module_id VARCHAR REFERENCES anxiety_modules(id) NOT NULL,
    week_number INTEGER NOT NULL,
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

-- =====================================================
-- STRIPE PAYMENT TABLES
-- =====================================================

-- Create payment_plans table
CREATE TABLE IF NOT EXISTS payment_plans (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    price_amount INTEGER NOT NULL,
    currency VARCHAR(3) DEFAULT 'usd',
    interval_type VARCHAR(20),
    interval_count INTEGER DEFAULT 1,
    stripe_price_id VARCHAR,
    stripe_product_id VARCHAR,
    is_active BOOLEAN DEFAULT TRUE,
    features JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create user_subscriptions table
CREATE TABLE IF NOT EXISTS user_subscriptions (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR REFERENCES users(id) NOT NULL,
    plan_id VARCHAR REFERENCES payment_plans(id) NOT NULL,
    stripe_subscription_id VARCHAR UNIQUE,
    stripe_customer_id VARCHAR NOT NULL,
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'canceled', 'past_due', etc.
    current_period_start TIMESTAMP,
    current_period_end TIMESTAMP,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    trial_start TIMESTAMP,
    trial_end TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create payment_transactions table
CREATE TABLE IF NOT EXISTS payment_transactions (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR REFERENCES users(id) NOT NULL,
    subscription_id VARCHAR REFERENCES user_subscriptions(id),
    stripe_payment_intent_id VARCHAR UNIQUE,
    stripe_invoice_id VARCHAR,
    amount INTEGER NOT NULL,
    currency VARCHAR(3) DEFAULT 'usd',
    status VARCHAR(20) NOT NULL, -- 'succeeded', 'failed', 'processing', etc.
    payment_method VARCHAR(50),
    description TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create user_payment_methods table
CREATE TABLE IF NOT EXISTS user_payment_methods (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR REFERENCES users(id) NOT NULL,
    stripe_payment_method_id VARCHAR UNIQUE NOT NULL,
    type VARCHAR(20) NOT NULL, -- 'card', 'bank_account', etc.
    card_brand VARCHAR(20),
    card_last4 VARCHAR(4),
    card_exp_month INTEGER,
    card_exp_year INTEGER,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- REPORTING AND ANALYTICS TABLES
-- =====================================================

-- Create progress_reports table
CREATE TABLE IF NOT EXISTS progress_reports (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR REFERENCES users(id) NOT NULL,
    report_data JSONB NOT NULL,
    generated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- SYSTEM HEALTH TABLE
-- =====================================================

-- Create health_check table (system monitoring)
CREATE TABLE IF NOT EXISTS health_check (
    id SERIAL PRIMARY KEY,
    status VARCHAR(50) DEFAULT 'healthy',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- User-related indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_mood_entries_user_date ON mood_entries(user_id, entry_date);
CREATE INDEX IF NOT EXISTS idx_anxiety_guides_user ON anxiety_guides(user_id);
CREATE INDEX IF NOT EXISTS idx_sleep_assessments_user ON sleep_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_lifestyle_assessments_user ON lifestyle_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_thought_records_user ON thought_records(user_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_user ON onboarding_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_weekly_assessments_user ON weekly_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_reports_user ON progress_reports(user_id);

-- =====================================================
-- PERMISSIONS AND GRANTS
-- =====================================================

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE nhs_waitlist TO nhs_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO nhs_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO nhs_user;

-- =====================================================
-- INITIAL DATA
-- =====================================================

-- Insert initial health check record
INSERT INTO health_check (status) VALUES ('tables_created') ON CONFLICT DO NOTHING;

-- =====================================================
-- ANXIETY MODULES INFORMATION
-- =====================================================

-- IMPORTANT: Anxiety modules are created automatically per-user when they sign up
-- The initializeAnxietyModules() function in the server code creates these modules:

-- Week 1: "Understanding Anxiety" (45 minutes, 4 activities)
--   - anxiety-intro: Understanding Anxiety Introduction (8 min)
--   - symptoms-check: Your Anxiety Symptoms (12 min)
--   - trigger-identification: Identifying Your Triggers (15 min)
--   - anxiety-diary: Anxiety Tracking Exercise (10 min)

-- Week 2: "Breathing & Relaxation" (38 minutes, 5 activities)
--   - breathing-intro: Introduction to Breathing Techniques (10 min)
--   - box-breathing: Box Breathing Exercise (8 min)
--   - progressive-relaxation: Progressive Muscle Relaxation (12 min)
--   - grounding-techniques: Grounding Techniques (6 min)
--   - breathing-practice: Breathing Practice Session (12 min)

-- Week 3: "Cognitive Strategies" (40 minutes, 3 activities)
--   - cognitive-intro: Introduction to Cognitive Techniques (10 min)
--   - thought-records: Thought Record Exercise (15 min)
--   - evidence-examination: Evidence Examination (15 min)

-- Week 4: "Mindfulness & Grounding" (35 minutes, 4 activities)
--   - mindfulness-intro: Introduction to Mindfulness (8 min)
--   - mindful-breathing: Mindful Breathing (10 min)
--   - body-scan: Body Scan Exercise (12 min)
--   - mindful-observation: Mindful Observation (10 min)

-- Week 5: "Behavioral Activation" (42 minutes, 4 activities)
--   - behavioral-intro: Introduction to Behavioral Techniques (10 min)
--   - activity-scheduling: Activity Scheduling (12 min)
--   - exposure-hierarchy: Exposure Hierarchy (15 min)
--   - behavioral-experiments: Behavioral Experiments (12 min)

-- Week 6: "Relapse Prevention" (35 minutes, 3 activities)
--   - relapse-intro: Introduction to Relapse Prevention (10 min)
--   - warning-signs: Identifying Warning Signs (15 min)
--   - maintenance-plan: Creating a Maintenance Plan (10 min)

-- The detailed content for each activity (including "Identifying Your Triggers")
-- is stored in the frontend code (client/src/pages/module-detail.tsx)
-- and gets loaded dynamically when users access each module.

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Show created tables
SELECT 'Database tables created successfully' as status;
SELECT count(*) as total_tables FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE';

-- Show table summary
SELECT 
    table_name,
    (SELECT count(*) FROM information_schema.columns WHERE table_name = t.table_name AND table_schema = 'public') as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
ORDER BY table_name;
