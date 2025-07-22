-- =====================================================
-- AUTH SERVICE - Demo Users
-- =====================================================
-- Comprehensive demo users with all roles and various scenarios
-- Password for all users: 'password123' (hashed with BCrypt)

INSERT INTO auth.users (user_name, email, password, full_name, bio, role, is_enable, is_verified, provider, created_at, updated_at) VALUES

-- ========== ADMIN USERS ==========
('admin', 'admin@educonnect.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi6', 'System Administrator', 'Platform administrator with full access', 'ADMIN', true, true, 'LOCAL', NOW(), NOW()),
('super_admin', 'superadmin@educonnect.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi6', 'Super Admin', 'Senior platform administrator', 'ADMIN', true, true, 'LOCAL', NOW(), NOW()),
('tech_admin', 'techadmin@educonnect.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi6', 'Technical Administrator', 'Technical support and system maintenance', 'ADMIN', true, true, 'LOCAL', NOW(), NOW()),

-- ========== QUESTION SETTERS ==========
('prof_williams', 'williams@university.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi6', 'Prof. Sarah Williams', 'Mathematics Professor at Central University, PhD in Applied Mathematics', 'QUESTION_SETTER', true, true, 'LOCAL', NOW(), NOW()),
('dr_thomson', 'thomson@college.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi6', 'Dr. Michael Thomson', 'Physics Department Head, 15 years teaching experience', 'QUESTION_SETTER', true, true, 'LOCAL', NOW(), NOW()),
('prof_chen', 'chen@institute.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi6', 'Prof. Lisa Chen', 'Chemistry Professor specializing in Organic Chemistry', 'QUESTION_SETTER', true, true, 'LOCAL', NOW(), NOW()),
('dr_patel', 'patel@biotech.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi6', 'Dr. Raj Patel', 'Biology and Biotechnology expert, Research Scientist', 'QUESTION_SETTER', true, true, 'LOCAL', NOW(), NOW()),
('prof_garcia', 'garcia@compsci.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi6', 'Prof. Maria Garcia', 'Computer Science Professor, Software Engineering specialist', 'QUESTION_SETTER', true, true, 'LOCAL', NOW(), NOW()),
('dr_brown', 'brown@english.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi6', 'Dr. James Brown', 'English Literature Professor, Creative Writing expert', 'QUESTION_SETTER', true, true, 'LOCAL', NOW(), NOW()),
('prof_davis', 'davis@history.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi6', 'Prof. Emma Davis', 'History Professor specializing in World History', 'QUESTION_SETTER', true, true, 'LOCAL', NOW(), NOW()),

-- ========== HIGH-PERFORMING STUDENTS ==========
('alex_student', 'alex@student.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi6', 'Alex Johnson', 'Top performer in Mathematics and Physics, loves problem-solving', 'STUDENT', true, true, 'LOCAL', NOW(), NOW()),
('sophia_math', 'sophia@student.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi6', 'Sophia Martinez', 'Math enthusiast, participates in olympiads and competitions', 'STUDENT', true, true, 'LOCAL', NOW(), NOW()),
('david_physics', 'david@student.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi6', 'David Chen', 'Physics prodigy, aspiring to be a researcher', 'STUDENT', true, true, 'LOCAL', NOW(), NOW()),
('emily_bio', 'emily@student.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi6', 'Emily Rodriguez', 'Biology and Chemistry student, pre-med track', 'STUDENT', true, true, 'LOCAL', NOW(), NOW()),
('james_cs', 'james@student.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi6', 'James Wilson', 'Computer Science student, competitive programmer', 'STUDENT', true, true, 'LOCAL', NOW(), NOW()),

-- ========== AVERAGE STUDENTS ==========
('sarah_learner', 'sarah@student.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi6', 'Sarah Thompson', 'Hardworking student, enjoys group study sessions', 'STUDENT', true, true, 'LOCAL', NOW(), NOW()),
('mike_average', 'mike@student.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi6', 'Mike Anderson', 'Average performer, interested in multiple subjects', 'STUDENT', true, true, 'LOCAL', NOW(), NOW()),
('lisa_social', 'lisa@student.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi6', 'Lisa Kim', 'Social learner, loves discussions and group activities', 'STUDENT', true, true, 'LOCAL', NOW(), NOW()),
('john_steady', 'john@student.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi6', 'John Taylor', 'Steady progress student, good at following instructions', 'STUDENT', true, true, 'LOCAL', NOW(), NOW()),
('anna_curious', 'anna@student.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi6', 'Anna White', 'Curious learner, asks lots of questions', 'STUDENT', true, true, 'LOCAL', NOW(), NOW()),

-- ========== STRUGGLING STUDENTS ==========
('tom_struggling', 'tom@student.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi6', 'Tom Brown', 'Needs extra help, benefits from peer support', 'STUDENT', true, true, 'LOCAL', NOW(), NOW()),
('mary_effort', 'mary@student.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi6', 'Mary Davis', 'Puts in effort but struggles with concepts', 'STUDENT', true, true, 'LOCAL', NOW(), NOW()),
('peter_help', 'peter@student.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi6', 'Peter Garcia', 'Seeks help regularly, improving slowly', 'STUDENT', true, true, 'LOCAL', NOW(), NOW()),

-- ========== DIVERSE BACKGROUNDS ==========
('raj_international', 'raj@international.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi6', 'Raj Sharma', 'International student from India, strong in mathematics', 'STUDENT', true, true, 'LOCAL', NOW(), NOW()),
('yuki_exchange', 'yuki@exchange.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi6', 'Yuki Tanaka', 'Exchange student from Japan, interested in technology', 'STUDENT', true, true, 'LOCAL', NOW(), NOW()),
('ahmed_scholar', 'ahmed@scholar.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi6', 'Ahmed Al-Rashid', 'Scholarship student, excellent in sciences', 'STUDENT', true, true, 'LOCAL', NOW(), NOW()),
('marie_artist', 'marie@arts.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi6', 'Marie Dubois', 'Arts student also taking science courses', 'STUDENT', true, true, 'LOCAL', NOW(), NOW()),

-- ========== DIFFERENT CLASS LEVELS ==========
('class10_student1', 'c10s1@class10.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi6', 'Ryan Mitchell', 'Class 10 student, preparing for board exams', 'STUDENT', true, true, 'LOCAL', NOW(), NOW()),
('class10_student2', 'c10s2@class10.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi6', 'Emma Thompson', 'Class 10 student, strong in languages', 'STUDENT', true, true, 'LOCAL', NOW(), NOW()),
('class11_student1', 'c11s1@class11.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi6', 'Kevin Park', 'Class 11 student, science stream', 'STUDENT', true, true, 'LOCAL', NOW(), NOW()),
('class11_student2', 'c11s2@class11.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi6', 'Rachel Green', 'Class 11 student, commerce stream', 'STUDENT', true, true, 'LOCAL', NOW(), NOW()),
('class12_student1', 'c12s1@class12.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi6', 'Daniel Lee', 'Class 12 student, preparing for college entrance', 'STUDENT', true, true, 'LOCAL', NOW(), NOW()),
('class12_student2', 'c12s2@class12.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi6', 'Olivia Brown', 'Class 12 student, arts stream', 'STUDENT', true, true, 'LOCAL', NOW(), NOW()),

-- ========== SPECIAL SCENARIOS ==========
('inactive_user', 'inactive@test.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi6', 'Inactive User', 'Account disabled for testing', 'STUDENT', false, true, 'LOCAL', NOW(), NOW()),
('unverified_user', 'unverified@test.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi6', 'Unverified User', 'Email not verified for testing', 'STUDENT', true, false, 'LOCAL', NOW(), NOW()),
('oauth_user', 'oauth@gmail.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi6', 'OAuth Test User', 'Google OAuth user for testing', 'STUDENT', true, true, 'GOOGLE', NOW(), NOW()),

-- ========== LEGACY USERS FOR COMPATIBILITY ==========
('john_doe', 'john.doe@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi6', 'John Doe', 'Computer Science student passionate about programming', 'STUDENT', true, true, 'LOCAL', NOW(), NOW()),
('jane_smith', 'jane.smith@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi6', 'Jane Smith', 'Mathematics teacher with 10 years experience', 'QUESTION_SETTER', true, true, 'LOCAL', NOW(), NOW());

-- Print confirmation
SELECT 'Demo users created successfully' as status;
SELECT COUNT(*) as total_users FROM auth.users;
SELECT role, COUNT(*) as count FROM auth.users GROUP BY role;