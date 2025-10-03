-- Initialize NHS Waitlist Database
-- This file runs when the PostgreSQL container starts for the first time

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Set timezone
SET timezone = 'UTC';

-- Create a simple health check table
CREATE TABLE IF NOT EXISTS health_check (
    id SERIAL PRIMARY KEY,
    status VARCHAR(50) DEFAULT 'healthy',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial health check record
INSERT INTO health_check (status) VALUES ('database_initialized');

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE nhs_waitlist TO nhs_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO nhs_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO nhs_user;
