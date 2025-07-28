-- Database initialization script for EduConnect
-- Creates required schemas and sets up permissions

-- Connect to educonnect database
\c educonnect;

-- Create schemas if they don't exist
CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS discussion;
CREATE SCHEMA IF NOT EXISTS assessment;

-- Grant all privileges on schemas to educonnect user
GRANT ALL ON SCHEMA auth TO educonnect;
GRANT ALL ON SCHEMA discussion TO educonnect;
GRANT ALL ON SCHEMA assessment TO educonnect;

-- Grant usage and create privileges on schemas
GRANT USAGE ON SCHEMA auth TO educonnect;
GRANT USAGE ON SCHEMA discussion TO educonnect;
GRANT USAGE ON SCHEMA assessment TO educonnect;

GRANT CREATE ON SCHEMA auth TO educonnect;
GRANT CREATE ON SCHEMA discussion TO educonnect;
GRANT CREATE ON SCHEMA assessment TO educonnect;

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA auth GRANT ALL ON TABLES TO educonnect;
ALTER DEFAULT PRIVILEGES IN SCHEMA discussion GRANT ALL ON TABLES TO educonnect;
ALTER DEFAULT PRIVILEGES IN SCHEMA assessment GRANT ALL ON TABLES TO educonnect;

-- Set default privileges for future sequences
ALTER DEFAULT PRIVILEGES IN SCHEMA auth GRANT ALL ON SEQUENCES TO educonnect;
ALTER DEFAULT PRIVILEGES IN SCHEMA discussion GRANT ALL ON SEQUENCES TO educonnect;
ALTER DEFAULT PRIVILEGES IN SCHEMA assessment GRANT ALL ON SEQUENCES TO educonnect;

-- Print confirmation
\echo 'Database schemas created successfully: auth, discussion, assessment'
\echo 'Permissions granted to educonnect user'