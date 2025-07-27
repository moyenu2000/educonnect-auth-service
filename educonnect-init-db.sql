-- Database initialization script for EduConnect
-- This script creates necessary schemas and initial data for microservices

-- ==========================================
-- TEMPORARY CLEANUP (Remove this section later)
-- ==========================================
DROP DATABASE IF EXISTS educonnect;
CREATE DATABASE educonnect;

-- Connect to the new database
\c educonnect;

-- ==========================================
-- SCHEMA CREATION
-- ==========================================

-- Create schemas for each microservice
CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS assessment;
CREATE SCHEMA IF NOT EXISTS discussion;

-- Grant permissions to default users
GRANT ALL PRIVILEGES ON SCHEMA auth TO educonnect;
GRANT ALL PRIVILEGES ON SCHEMA assessment TO educonnect;
GRANT ALL PRIVILEGES ON SCHEMA discussion TO educonnect;

GRANT ALL PRIVILEGES ON SCHEMA auth TO postgres;
GRANT ALL PRIVILEGES ON SCHEMA assessment TO postgres;
GRANT ALL PRIVILEGES ON SCHEMA discussion TO postgres;

-- Set search paths
ALTER DATABASE educonnect SET search_path TO public,auth,assessment,discussion;

-- ==========================================
-- WAIT FOR HIBERNATE TO CREATE TABLES
-- Note: Tables will be created by Hibernate when services start
-- This data will be inserted after table creation
-- ==========================================

-- Insert users (password is 'password123' hashed with BCrypt)
INSERT INTO auth.users (user_name, email, password, full_name, bio, role, is_enable, is_verified, provider, created_at, updated_at) VALUES
('admin', 'admin@educonnect.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi6', 'Admin User', 'Platform administrator', 'ADMIN', true, true, 'LOCAL', NOW(), NOW()),
('john_doe', 'john.doe@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi6', 'John Doe', 'Computer Science student', 'STUDENT', true, true, 'LOCAL', NOW(), NOW()),
('jane_smith', 'jane.smith@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi6', 'Jane Smith', 'Mathematics teacher', 'QUESTION_SETTER', true, true, 'LOCAL', NOW(), NOW()),
('alice_wilson', 'alice.wilson@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi6', 'Alice Wilson', 'Physics enthusiast', 'STUDENT', true, true, 'LOCAL', NOW(), NOW()),
('bob_teacher', 'bob.teacher@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi6', 'Bob Teacher', 'Chemistry instructor', 'QUESTION_SETTER', true, true, 'LOCAL', NOW(), NOW());

-- Insert subjects
INSERT INTO assessment.subjects (name, description, class_level, display_order, is_active, created_at, updated_at) VALUES
('Mathematics', 'Core mathematical concepts and problem solving', 'CLASS_10', 1, true, NOW(), NOW()),
('Physics', 'Fundamental principles of physics and mechanics', 'CLASS_10', 2, true, NOW(), NOW()),
('Chemistry', 'Chemical reactions and molecular structures', 'CLASS_10', 3, true, NOW(), NOW()),
('Computer Science', 'Programming and computational thinking', 'CLASS_12', 4, true, NOW(), NOW());

-- Insert topics
INSERT INTO assessment.topics (name, description, subject_id, display_order, is_active, created_at, updated_at) VALUES
-- Mathematics topics
('Algebra', 'Linear equations and algebraic expressions', 1, 1, true, NOW(), NOW()),
('Geometry', 'Shapes, angles, and geometric proofs', 1, 2, true, NOW(), NOW()),
-- Physics topics
('Mechanics', 'Motion, force, and energy', 2, 1, true, NOW(), NOW()),
('Thermodynamics', 'Heat and energy transfer', 2, 2, true, NOW(), NOW()),
-- Chemistry topics
('Atomic Structure', 'Atoms and periodic table', 3, 1, true, NOW(), NOW()),
('Chemical Bonding', 'Ionic and covalent bonds', 3, 2, true, NOW(), NOW()),
-- Computer Science topics
('Programming Basics', 'Variables, loops, and functions', 4, 1, true, NOW(), NOW()),
('Data Structures', 'Arrays, lists, and trees', 4, 2, true, NOW(), NOW());

-- Insert sample questions
INSERT INTO assessment.questions (text, type, subject_id, topic_id, difficulty, correct_answer, explanation, points, is_active, created_by, created_at, updated_at) VALUES
-- Math questions
('What is the value of x in 2x + 5 = 13?', 'MCQ', 1, 1, 'EASY', '4', 'Subtract 5 from both sides: 2x = 8, then divide by 2', 1, true, 3, NOW(), NOW()),
('Calculate the area of a triangle with base 10cm and height 8cm', 'NUMERIC', 1, 2, 'EASY', '40', 'Area = (1/2) × base × height = 40 cm²', 2, true, 3, NOW(), NOW()),
-- Physics questions
('What is Newton''s first law?', 'ESSAY', 2, 3, 'MEDIUM', 'An object at rest stays at rest unless acted upon by force', 'Law of inertia', 3, true, 3, NOW(), NOW()),
('Calculate kinetic energy of 5kg object at 10m/s', 'NUMERIC', 2, 3, 'MEDIUM', '250', 'KE = (1/2)mv² = 250 J', 3, true, 3, NOW(), NOW()),
-- Chemistry questions
('How many protons does carbon have?', 'NUMERIC', 3, 5, 'EASY', '6', 'Carbon has atomic number 6', 1, true, 5, NOW(), NOW()),
-- Programming questions
('What is a variable in programming?', 'ESSAY', 4, 7, 'EASY', 'A storage location with a name that contains data', 'Variables store data', 2, true, 3, NOW(), NOW());

-- Insert question options for MCQ
INSERT INTO assessment.question_options (question_id, option_text, is_correct) VALUES
(1, '3', false),
(1, '4', true),
(1, '5', false),
(1, '6', false);

-- Copy users to discussion schema
INSERT INTO discussion.users (id, username, email, full_name, bio, avatar_url, created_at, updated_at) VALUES
(1, 'admin', 'admin@educonnect.com', 'Admin User', 'Platform administrator', 'https://avatar.example.com/admin.jpg', NOW(), NOW()),
(2, 'john_doe', 'john.doe@example.com', 'John Doe', 'Computer Science student', 'https://avatar.example.com/john.jpg', NOW(), NOW()),
(3, 'jane_smith', 'jane.smith@example.com', 'Jane Smith', 'Mathematics teacher', 'https://avatar.example.com/jane.jpg', NOW(), NOW()),
(4, 'alice_wilson', 'alice.wilson@example.com', 'Alice Wilson', 'Physics enthusiast', 'https://avatar.example.com/alice.jpg', NOW(), NOW()),
(5, 'bob_teacher', 'bob.teacher@example.com', 'Bob Teacher', 'Chemistry instructor', 'https://avatar.example.com/bob.jpg', NOW(), NOW());

-- Insert discussion groups
INSERT INTO discussion.groups (name, description, type, subject_id, class_level, is_private, rules, members_count, discussions_count, created_by_id, created_at, updated_at) VALUES
('Math Help Center', 'Get help with mathematics problems', 'SUBJECT', 1, 'CLASS_10', false, 'Be respectful and show your work', 3, 5, 3, NOW(), NOW()),
('Physics Study Group', 'Collaborative physics learning', 'STUDY', 2, 'CLASS_10', false, 'Share resources and explain concepts', 2, 3, 4, NOW(), NOW());

-- Insert group members
INSERT INTO discussion.group_members (user_id, group_id, role, joined_at) VALUES
(3, 1, 'ADMIN', NOW()),
(2, 1, 'MEMBER', NOW()),
(4, 1, 'MEMBER', NOW()),
(4, 2, 'ADMIN', NOW()),
(2, 2, 'MEMBER', NOW());

-- Insert sample discussions
INSERT INTO discussion.discussions (title, content, type, author_id, subject_id, topic_id, class_level, upvotes_count, downvotes_count, answers_count, views_count, has_accepted_answer, status, group_id, created_at, updated_at) VALUES
('Help with Quadratic Equations', 'I need help understanding the quadratic formula. Can someone explain?', 'QUESTION', 2, 1, 1, 'CLASS_10', 2, 0, 1, 15, true, 'ACTIVE', 1, NOW(), NOW()),
('Physics Lab Results', 'Our pendulum experiment results and analysis', 'HELP', 4, 2, 3, 'CLASS_10', 3, 0, 1, 25, false, 'ACTIVE', 2, NOW(), NOW());

-- Insert sample answers
INSERT INTO discussion.answers (content, author_id, discussion_id, upvotes_count, downvotes_count, is_accepted, created_at, updated_at) VALUES
('The quadratic formula is x = (-b ± √(b²-4ac)) / 2a. First identify a, b, c then substitute.', 3, 1, 2, 0, true, NOW(), NOW()),
('Great data! The relationship T = 2π√(L/g) matches your results well.', 3, 2, 1, 0, false, NOW(), NOW());

-- Insert sample user submissions for practice tracking
INSERT INTO assessment.user_submissions (user_id, question_id, answer, is_correct, time_taken, points_earned, submitted_at) VALUES
(2, 1, '4', true, 45, 1, NOW() - INTERVAL '1 day'),
(2, 2, '40', true, 120, 2, NOW() - INTERVAL '1 day'),
(4, 1, '4', true, 30, 1, NOW() - INTERVAL '2 days'),
(4, 5, '6', true, 20, 1, NOW() - INTERVAL '1 day');

-- Insert user streaks
INSERT INTO assessment.user_streaks (user_id, subject_id, current_streak, longest_streak, last_activity, is_active, created_at, updated_at) VALUES
(2, 1, 2, 3, CURRENT_DATE, true, NOW(), NOW()),
(4, 2, 1, 2, CURRENT_DATE, true, NOW(), NOW());

-- Print confirmation
SELECT 'EduConnect database initialized successfully with core data' as status;
