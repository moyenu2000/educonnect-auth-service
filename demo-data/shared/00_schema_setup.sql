-- =====================================================
-- EduConnect Database Schema Setup
-- =====================================================
-- This script initializes the database schemas for all microservices

-- Create schemas if they don't exist
CREATE SCHEMA IF NOT EXISTS assessment;
CREATE SCHEMA IF NOT EXISTS discussion;
CREATE SCHEMA IF NOT EXISTS social_feed;
CREATE SCHEMA IF NOT EXISTS auth;

-- Grant permissions to the default user
GRANT ALL PRIVILEGES ON SCHEMA assessment TO educonnect;
GRANT ALL PRIVILEGES ON SCHEMA discussion TO educonnect;
GRANT ALL PRIVILEGES ON SCHEMA social_feed TO educonnect;
GRANT ALL PRIVILEGES ON SCHEMA auth TO educonnect;

-- Grant permissions to postgres user (for production)
GRANT ALL PRIVILEGES ON SCHEMA assessment TO postgres;
GRANT ALL PRIVILEGES ON SCHEMA discussion TO postgres;
GRANT ALL PRIVILEGES ON SCHEMA social_feed TO postgres;
GRANT ALL PRIVILEGES ON SCHEMA auth TO postgres;

-- Set search paths for easier access
ALTER DATABASE educonnect SET search_path TO public,assessment,discussion,social_feed,auth;

-- Print confirmation
SELECT 'Database schemas initialized successfully' as status;