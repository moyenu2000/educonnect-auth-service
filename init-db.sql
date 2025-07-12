-- Database initialization script for EduConnect
-- This script creates necessary schemas for microservices

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

-- ==========================================
-- MOCK DATA FOR TESTING
-- ==========================================

-- Wait a moment to ensure all tables are created
-- Note: This data will be inserted after Hibernate creates the tables

-- Insert mock users (passwords are hashed with BCrypt for 'password123')
INSERT INTO auth.users (user_name, email, password, full_name, bio, role, is_enable, is_verified, provider, created_at, updated_at) VALUES
('john_doe', 'john.doe@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi6', 'John Doe', 'Computer Science student passionate about programming', 'STUDENT', true, true, 'LOCAL', NOW(), NOW()),
('jane_smith', 'jane.smith@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi6', 'Jane Smith', 'Mathematics teacher with 10 years experience', 'QUESTION_SETTER', true, true, 'LOCAL', NOW(), NOW()),
('myadmin', 'myadmin@educonnect.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi6', 'My Admin User', 'Platform administrator', 'ADMIN', true, true, 'LOCAL', NOW(), NOW()),
('myqsetter', 'myqsetter@educonnect.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi6', 'My Question Setter', 'Question creator and setter', 'QUESTION_SETTER', true, true, 'LOCAL', NOW(), NOW()),
('sarah_wilson', 'sarah.wilson@example.com', '$2a$10$N1EXMPL3H4SH3DF0RT3ST1NG', 'Sarah Wilson', 'Physics enthusiast and science lover', 'STUDENT', true, true, 'LOCAL', NOW(), NOW()),
('mike_johnson', 'mike.johnson@example.com', '$2a$10$N1EXMPL3H4SH3DF0RT3ST1NG', 'Mike Johnson', 'Chemistry teacher and researcher', 'QUESTION_SETTER', true, true, 'LOCAL', NOW(), NOW()),
('emily_brown', 'emily.brown@example.com', '$2a$10$N1EXMPL3H4SH3DF0RT3ST1NG', 'Emily Brown', 'High school student interested in biology', 'STUDENT', true, true, 'LOCAL', NOW(), NOW()),
('david_lee', 'david.lee@example.com', '$2a$10$N1EXMPL3H4SH3DF0RT3ST1NG', 'David Lee', 'English literature teacher', 'QUESTION_SETTER', true, true, 'LOCAL', NOW(), NOW()),
('lisa_garcia', 'lisa.garcia@example.com', '$2a$10$N1EXMPL3H4SH3DF0RT3ST1NG', 'Lisa Garcia', 'History student and debate enthusiast', 'STUDENT', true, true, 'LOCAL', NOW(), NOW()),
('robert_taylor', 'robert.taylor@example.com', '$2a$10$N1EXMPL3H4SH3DF0RT3ST1NG', 'Robert Taylor', 'Geography teacher and traveler', 'QUESTION_SETTER', true, true, 'LOCAL', NOW(), NOW()),
('anna_martinez', 'anna.martinez@example.com', '$2a$10$N1EXMPL3H4SH3DF0RT3ST1NG', 'Anna Martinez', 'Art student with creative passion', 'STUDENT', true, true, 'LOCAL', NOW(), NOW());

-- Wait for assessment service to create tables first
-- Insert subjects using proper enum values
INSERT INTO assessment.subjects (name, description, class_level, display_order, is_active, created_at, updated_at) VALUES
('Mathematics', 'Core mathematical concepts and problem solving', 'CLASS_10', 1, true, NOW(), NOW()),
('Physics', 'Fundamental principles of physics and mechanics', 'CLASS_10', 2, true, NOW(), NOW()),
('Chemistry', 'Chemical reactions and molecular structures', 'CLASS_10', 3, true, NOW(), NOW()),
('Biology', 'Life sciences and biological processes', 'CLASS_10', 4, true, NOW(), NOW()),
('English', 'Language arts and literature', 'CLASS_10', 5, true, NOW(), NOW()),
('History', 'World history and historical events', 'CLASS_10', 6, true, NOW(), NOW()),
('Geography', 'Physical and human geography', 'CLASS_10', 7, true, NOW(), NOW()),
('Computer Science', 'Programming and computational thinking', 'CLASS_12', 8, true, NOW(), NOW()),
('Economics', 'Economic principles and markets', 'CLASS_12', 9, true, NOW(), NOW()),
('Political Science', 'Government systems and political theory', 'CLASS_12', 10, true, NOW(), NOW());

-- Insert mock topics
INSERT INTO assessment.topics (name, description, subject_id, display_order, is_active, created_at, updated_at) VALUES
-- Mathematics topics
('Algebra', 'Linear equations and algebraic expressions', 1, 1, true, NOW(), NOW()),
('Geometry', 'Shapes, angles, and geometric proofs', 1, 2, true, NOW(), NOW()),
('Trigonometry', 'Sine, cosine, and trigonometric identities', 1, 3, true, NOW(), NOW()),
('Calculus', 'Derivatives and integrals', 1, 4, true, NOW(), NOW()),
-- Physics topics
('Mechanics', 'Motion, force, and energy', 2, 1, true, NOW(), NOW()),
('Thermodynamics', 'Heat, temperature, and energy transfer', 2, 2, true, NOW(), NOW()),
('Electromagnetism', 'Electric and magnetic fields', 2, 3, true, NOW(), NOW()),
('Optics', 'Light, reflection, and refraction', 2, 4, true, NOW(), NOW()),
-- Chemistry topics
('Atomic Structure', 'Atoms, electrons, and periodic table', 3, 1, true, NOW(), NOW()),
('Chemical Bonding', 'Ionic and covalent bonds', 3, 2, true, NOW(), NOW()),
('Organic Chemistry', 'Carbon compounds and reactions', 3, 3, true, NOW(), NOW()),
('Acids and Bases', 'pH, acids, bases, and neutralization', 3, 4, true, NOW(), NOW()),
-- Biology topics
('Cell Biology', 'Cell structure and functions', 4, 1, true, NOW(), NOW()),
('Genetics', 'DNA, genes, and heredity', 4, 2, true, NOW(), NOW()),
('Evolution', 'Natural selection and species development', 4, 3, true, NOW(), NOW()),
('Ecology', 'Ecosystems and environmental relationships', 4, 4, true, NOW(), NOW()),
-- Computer Science topics
('Programming Basics', 'Variables, loops, and functions', 8, 1, true, NOW(), NOW()),
('Data Structures', 'Arrays, lists, and trees', 8, 2, true, NOW(), NOW()),
('Algorithms', 'Sorting, searching, and optimization', 8, 3, true, NOW(), NOW()),
('Object-Oriented Programming', 'Classes, objects, and inheritance', 8, 4, true, NOW(), NOW());

-- Insert mock questions
INSERT INTO assessment.questions (text, type, subject_id, topic_id, difficulty, correct_answer, explanation, points, is_active, created_by, created_at, updated_at) VALUES
-- Mathematics questions
('What is the value of x in the equation 2x + 5 = 13?', 'MCQ', 1, 1, 'EASY', '4', 'Subtract 5 from both sides: 2x = 8, then divide by 2: x = 4', 1, true, 2, NOW(), NOW()),
('Calculate the area of a triangle with base 10 cm and height 8 cm.', 'NUMERIC', 1, 2, 'EASY', '40', 'Area = (1/2) × base × height = (1/2) × 10 × 8 = 40 cm²', 2, true, 2, NOW(), NOW()),
('What is the value of sin(30°)?', 'MCQ', 1, 3, 'MEDIUM', '0.5', 'sin(30°) = 1/2 = 0.5', 2, true, 2, NOW(), NOW()),
('Find the derivative of f(x) = x² + 3x + 2', 'FILL_BLANK', 1, 4, 'HARD', '2x + 3', 'Using power rule: d/dx(x²) = 2x, d/dx(3x) = 3, d/dx(2) = 0', 3, true, 2, NOW(), NOW()),

-- Physics questions
('What is Newton''s first law of motion?', 'ESSAY', 2, 5, 'EASY', 'An object at rest stays at rest and an object in motion stays in motion unless acted upon by an external force', 'This is the law of inertia', 2, true, 2, NOW(), NOW()),
('Calculate the kinetic energy of a 5 kg object moving at 10 m/s.', 'NUMERIC', 2, 5, 'MEDIUM', '250', 'KE = (1/2)mv² = (1/2) × 5 × 10² = 250 J', 3, true, 2, NOW(), NOW()),
('What happens to the volume of a gas when temperature increases at constant pressure?', 'MCQ', 2, 6, 'MEDIUM', 'Volume increases', 'According to Charles''s Law, volume is directly proportional to temperature', 2, true, 2, NOW(), NOW()),
('Light travels faster in which medium?', 'MCQ', 2, 8, 'EASY', 'Vacuum', 'Light travels fastest in vacuum at approximately 3×10⁸ m/s', 1, true, 2, NOW(), NOW()),

-- Chemistry questions
('How many protons does carbon have?', 'NUMERIC', 3, 9, 'EASY', '6', 'Carbon has atomic number 6, which equals the number of protons', 1, true, 5, NOW(), NOW()),
('What type of bond forms between sodium and chlorine?', 'MCQ', 3, 10, 'EASY', 'Ionic bond', 'Sodium loses an electron to chlorine, forming Na⁺ and Cl⁻ ions', 1, true, 5, NOW(), NOW()),
('What is the general formula for alkanes?', 'FILL_BLANK', 3, 11, 'MEDIUM', 'CnH2n+2', 'Alkanes are saturated hydrocarbons with this general formula', 2, true, 5, NOW(), NOW()),
('What is the pH of pure water at 25°C?', 'NUMERIC', 3, 12, 'EASY', '7', 'Pure water is neutral with pH = 7', 1, true, 5, NOW(), NOW()),

-- Biology questions
('What is the powerhouse of the cell?', 'MCQ', 4, 13, 'EASY', 'Mitochondria', 'Mitochondria produce ATP through cellular respiration', 1, true, 5, NOW(), NOW()),
('What does DNA stand for?', 'FILL_BLANK', 4, 14, 'EASY', 'Deoxyribonucleic Acid', 'DNA carries genetic information in all living organisms', 1, true, 5, NOW(), NOW()),
('Who proposed the theory of evolution by natural selection?', 'MCQ', 4, 15, 'MEDIUM', 'Charles Darwin', 'Darwin published "On the Origin of Species" in 1859', 2, true, 5, NOW(), NOW()),
('What is a food chain?', 'ESSAY', 4, 16, 'MEDIUM', 'A linear sequence of organisms where each is eaten by the next member in the chain', 'Food chains show the flow of energy through ecosystems', 3, true, 5, NOW(), NOW()),

-- Computer Science questions
('What is a variable in programming?', 'ESSAY', 8, 17, 'EASY', 'A storage location with an associated name that contains data', 'Variables store and manipulate data in programs', 2, true, 2, NOW(), NOW()),
('Which data structure follows LIFO principle?', 'MCQ', 8, 18, 'MEDIUM', 'Stack', 'Stack follows Last In, First Out principle', 2, true, 2, NOW(), NOW()),
('What is the time complexity of binary search?', 'MCQ', 8, 19, 'HARD', 'O(log n)', 'Binary search divides the search space in half each iteration', 3, true, 2, NOW(), NOW()),
('What is inheritance in OOP?', 'ESSAY', 8, 20, 'MEDIUM', 'A mechanism where a new class inherits properties and methods from an existing class', 'Inheritance promotes code reusability and establishes relationships between classes', 3, true, 2, NOW(), NOW());

-- Insert mock question options for MCQ questions
INSERT INTO assessment.question_options (question_id, option_text, is_correct) VALUES
-- Question 1 options (2x + 5 = 13)
(1, '3', false),
(1, '4', true),
(1, '5', false),
(1, '6', false),

-- Question 3 options (sin(30°))
(3, '0.5', true),
(3, '0.707', false),
(3, '0.866', false),
(3, '1', false),

-- Question 7 options (Gas volume and temperature)
(7, 'Volume increases', true),
(7, 'Volume decreases', false),
(7, 'Volume remains constant', false),
(7, 'Volume becomes zero', false),

-- Question 8 options (Light speed)
(8, 'Air', false),
(8, 'Water', false),
(8, 'Glass', false),
(8, 'Vacuum', true),

-- Question 10 options (Sodium chlorine bond)
(10, 'Ionic bond', true),
(10, 'Covalent bond', false),
(10, 'Metallic bond', false),
(10, 'Hydrogen bond', false),

-- Question 13 options (Powerhouse of cell)
(13, 'Nucleus', false),
(13, 'Mitochondria', true),
(13, 'Ribosome', false),
(13, 'Chloroplast', false),

-- Question 15 options (Evolution theory)
(15, 'Charles Darwin', true),
(15, 'Gregor Mendel', false),
(15, 'Alfred Wallace', false),
(15, 'Jean Lamarck', false),

-- Question 18 options (LIFO data structure)
(18, 'Queue', false),
(18, 'Stack', true),
(18, 'Array', false),
(18, 'Linked List', false),

-- Question 19 options (Binary search complexity)
(19, 'O(1)', false),
(19, 'O(log n)', true),
(19, 'O(n)', false),
(19, 'O(n²)', false);

-- Insert mock user submissions
INSERT INTO assessment.user_submissions (user_id, question_id, answer, is_correct, time_taken, points_earned, submitted_at) VALUES
-- John Doe submissions
(1, 1, '4', true, 45, 1, NOW() - INTERVAL '2 days'),
(1, 2, '40', true, 120, 2, NOW() - INTERVAL '2 days'),
(1, 3, '0.5', true, 60, 2, NOW() - INTERVAL '1 day'),
(1, 13, 'Mitochondria', true, 30, 1, NOW() - INTERVAL '1 day'),

-- Sarah Wilson submissions
(4, 1, '5', false, 90, 0, NOW() - INTERVAL '3 days'),
(4, 5, 'An object at rest stays at rest', true, 180, 2, NOW() - INTERVAL '2 days'),
(4, 6, '250', true, 150, 3, NOW() - INTERVAL '1 day'),
(4, 8, 'Vacuum', true, 25, 1, NOW()),

-- Emily Brown submissions
(6, 9, '6', true, 20, 1, NOW() - INTERVAL '2 days'),
(6, 13, 'Mitochondria', true, 15, 1, NOW() - INTERVAL '2 days'),
(6, 14, 'Deoxyribonucleic Acid', true, 45, 1, NOW() - INTERVAL '1 day'),
(6, 15, 'Charles Darwin', true, 35, 2, NOW() - INTERVAL '1 day'),

-- Lisa Garcia submissions  
(8, 4, '2x + 3', true, 240, 3, NOW() - INTERVAL '1 day'),
(8, 16, 'A linear sequence showing energy flow', true, 300, 3, NOW()),

-- Anna Martinez submissions
(10, 17, 'A storage location for data', true, 180, 2, NOW() - INTERVAL '1 day'),
(10, 18, 'Stack', true, 40, 2, NOW());

-- Insert mock user streaks
INSERT INTO assessment.user_streaks (user_id, subject_id, current_streak, longest_streak, last_activity, is_active, created_at, updated_at) VALUES
(1, 1, 3, 5, CURRENT_DATE, true, NOW(), NOW()), -- John Doe - Mathematics
(1, 2, 2, 4, CURRENT_DATE - INTERVAL '1 day', true, NOW(), NOW()), -- John Doe - Physics
(4, 2, 4, 6, CURRENT_DATE, true, NOW(), NOW()), -- Sarah Wilson - Physics
(6, 4, 5, 7, CURRENT_DATE, true, NOW(), NOW()), -- Emily Brown - Biology
(8, 1, 1, 3, CURRENT_DATE, true, NOW(), NOW()), -- Lisa Garcia - Mathematics
(10, 8, 2, 2, CURRENT_DATE, true, NOW(), NOW()); -- Anna Martinez - Computer Science

-- Insert mock contests
INSERT INTO assessment.contests (title, description, type, start_time, end_time, duration, rules, participants, status, created_at, updated_at) VALUES
('Math Challenge 2024', 'Annual mathematics competition for all levels', 'MIXED', NOW() + INTERVAL '1 week', NOW() + INTERVAL '1 week 2 hours', 120, 'No calculators allowed. Show all work.', 25, 'UPCOMING', NOW(), NOW()),
('Physics Speed Round', 'Quick physics problem solving contest', 'SPEED', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days 1 hour', 60, 'Answer as many questions as possible in 60 minutes.', 18, 'COMPLETED', NOW() - INTERVAL '3 days', NOW()),
('Chemistry Quiz Bowl', 'Team-based chemistry competition', 'ACCURACY', NOW() + INTERVAL '3 days', NOW() + INTERVAL '3 days 1.5 hours', 90, 'Teams of 4 students. Accuracy is key.', 12, 'UPCOMING', NOW(), NOW()),
('Biology Knowledge Test', 'Comprehensive biology assessment', 'MIXED', NOW() - INTERVAL '1 week', NOW() - INTERVAL '1 week 2 hours', 120, 'Multiple choice and essay questions.', 30, 'COMPLETED', NOW() - INTERVAL '8 days', NOW());

-- Insert contest problems
INSERT INTO assessment.contest_problems (contest_id, problem_ids) VALUES
(1, '{1,2,3,4}'), -- Math contest questions
(2, '{5,6,7,8}'), -- Physics contest questions  
(3, '{9,10,11,12}'), -- Chemistry contest questions
(4, '{13,14,15,16}'); -- Biology contest questions

-- Insert mock live exams
INSERT INTO assessment.live_exams (title, description, subject_id, class_level, scheduled_at, duration, instructions, passing_score, total_participants, status, created_at, updated_at) VALUES
('Midterm Mathematics Exam', 'Comprehensive math exam covering algebra and geometry', 1, 'CLASS_10', NOW() + INTERVAL '1 week', 180, 'Read all questions carefully. Show your work for partial credit.', 60, 0, 'SCHEDULED', NOW(), NOW()),
('Physics Lab Assessment', 'Practical physics examination', 2, 'CLASS_10', NOW() + INTERVAL '3 days', 120, 'Bring calculator and reference sheets.', 70, 0, 'SCHEDULED', NOW(), NOW()),
('Chemistry Final Exam', 'Final examination for chemistry course', 3, 'CLASS_10', NOW() - INTERVAL '2 days', 150, 'No notes allowed. Periodic table provided.', 65, 45, 'COMPLETED', NOW() - INTERVAL '1 week', NOW()),
('Biology Unit Test', 'Test on cell biology and genetics', 4, 'CLASS_10', NOW() + INTERVAL '5 days', 90, 'Multiple choice and short answer questions.', 60, 0, 'SCHEDULED', NOW(), NOW());

-- Insert live exam questions
INSERT INTO assessment.live_exam_questions (exam_id, question_ids) VALUES
(1, '{1,2,3,4}'), -- Math exam questions
(2, '{5,6,7,8}'), -- Physics exam questions
(3, '{9,10,11,12}'), -- Chemistry exam questions
(4, '{13,14,15,16}'); -- Biology exam questions

-- Insert mock personalized exams
INSERT INTO assessment.personalized_exams (user_id, title, description, subject_id, class_level, duration, total_questions, score, correct_answers, incorrect_answers, status, started_at, completed_at, created_at, updated_at) VALUES
(1, 'Algebra Practice Test', 'Personalized algebra assessment', 1, 'CLASS_10', 60, 10, 80, 8, 2, 'COMPLETED', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day 1 hour', NOW() - INTERVAL '2 days', NOW()),
(4, 'Physics Mechanics Quiz', 'Custom physics quiz on mechanics', 2, 'CLASS_10', 45, 8, 75, 6, 2, 'COMPLETED', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days 45 minutes', NOW() - INTERVAL '3 days', NOW()),
(6, 'Biology Cell Structure Test', 'Personalized test on cell biology', 4, 'CLASS_10', 30, 5, 100, 5, 0, 'COMPLETED', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day 30 minutes', NOW() - INTERVAL '2 days', NOW()),
(10, 'Programming Basics Assessment', 'Introduction to programming concepts', 8, 'CLASS_12', 90, 12, 0, 0, 0, 'SCHEDULED', NULL, NULL, NOW(), NOW());

-- Insert personalized exam questions
INSERT INTO assessment.personalized_exam_questions (exam_id, question_ids) VALUES
(1, '{1,2,3,4,17,18,19,20}'), -- John's algebra test
(2, '{5,6,7,8}'), -- Sarah's physics quiz
(3, '{13,14,15,16,9}'), -- Emily's biology test  
(4, '{17,18,19,20}'); -- Anna's programming assessment

-- Insert daily questions
INSERT INTO assessment.daily_questions (question_id, date, subject_id, difficulty, points, created_at) VALUES
(49, CURRENT_DATE, 1, 'EASY', 1, NOW()),
(50, CURRENT_DATE - INTERVAL '1 day', 1, 'MEDIUM', 2, NOW() - INTERVAL '1 day'),
(51, CURRENT_DATE - INTERVAL '2 days', 1, 'EASY', 1, NOW() - INTERVAL '2 days'),
(52, CURRENT_DATE - INTERVAL '3 days', 1, 'EASY', 1, NOW() - INTERVAL '3 days'),
(53, CURRENT_DATE - INTERVAL '4 days', 6, 'MEDIUM', 2, NOW() - INTERVAL '4 days');

-- Copy users to discussion service
INSERT INTO discussion.users (id, username, email, full_name, bio, avatar_url, created_at, updated_at) VALUES
(1, 'john_doe', 'john.doe@example.com', 'John Doe', 'Computer Science student passionate about programming', 'https://avatar.example.com/john.jpg', NOW(), NOW()),
(2, 'jane_smith', 'jane.smith@example.com', 'Jane Smith', 'Mathematics teacher with 10 years experience', 'https://avatar.example.com/jane.jpg', NOW(), NOW()),
(3, 'admin_user', 'admin@educonnect.com', 'Admin User', 'Platform administrator', 'https://avatar.example.com/admin.jpg', NOW(), NOW()),
(4, 'sarah_wilson', 'sarah.wilson@example.com', 'Sarah Wilson', 'Physics enthusiast and science lover', 'https://avatar.example.com/sarah.jpg', NOW(), NOW()),
(5, 'mike_johnson', 'mike.johnson@example.com', 'Mike Johnson', 'Chemistry teacher and researcher', 'https://avatar.example.com/mike.jpg', NOW(), NOW()),
(6, 'emily_brown', 'emily.brown@example.com', 'Emily Brown', 'High school student interested in biology', 'https://avatar.example.com/emily.jpg', NOW(), NOW()),
(7, 'david_lee', 'david.lee@example.com', 'David Lee', 'English literature teacher', 'https://avatar.example.com/david.jpg', NOW(), NOW()),
(8, 'lisa_garcia', 'lisa.garcia@example.com', 'Lisa Garcia', 'History student and debate enthusiast', 'https://avatar.example.com/lisa.jpg', NOW(), NOW()),
(9, 'robert_taylor', 'robert.taylor@example.com', 'Robert Taylor', 'Geography teacher and traveler', 'https://avatar.example.com/robert.jpg', NOW(), NOW()),
(10, 'anna_martinez', 'anna.martinez@example.com', 'Anna Martinez', 'Art student with creative passion', 'https://avatar.example.com/anna.jpg', NOW(), NOW());

-- Insert mock discussion groups
INSERT INTO discussion.discussion_groups (name, description, type, subject_id, class_level, is_private, rules, members_count, discussions_count, created_by_id, created_at, updated_at) VALUES
('Math Help Central', 'Get help with mathematics problems and concepts', 'SUBJECT', 1, 'CLASS_10', false, 'Be respectful. Show your work. Help others learn.', 8, 15, 2, NOW() - INTERVAL '1 month', NOW()),
('Physics Study Group', 'Collaborative physics learning and problem solving', 'STUDY', 2, 'CLASS_10', false, 'Share resources. Explain concepts clearly. No spam.', 6, 12, 4, NOW() - INTERVAL '3 weeks', NOW()),
('Chemistry Lab Partners', 'Discussion group for chemistry experiments and theory', 'SUBJECT', 3, 'CLASS_10', false, 'Safety first. Share lab experiences. Ask questions.', 5, 8, 5, NOW() - INTERVAL '2 weeks', NOW()),
('Biology Enthusiasts', 'Explore the wonders of life sciences together', 'SUBJECT', 4, 'CLASS_10', false, 'Respect all life. Share discoveries. Be curious.', 7, 20, 6, NOW() - INTERVAL '1 month', NOW()),
('Computer Science Club', 'Programming challenges and tech discussions', 'SUBJECT', 8, 'CLASS_12', false, 'Code with honor. Help debug. Share knowledge.', 4, 10, 1, NOW() - INTERVAL '2 months', NOW()),
('Class 10A Study Hall', 'Private study group for Class 10A students', 'CLASS', NULL, 'CLASS_10', true, 'Class members only. Support each other. Stay focused.', 12, 25, 3, NOW() - INTERVAL '2 months', NOW());

-- Insert group members
INSERT INTO discussion.group_members (user_id, group_id, role, joined_at) VALUES
-- Math Help Central members
(2, 1, 'ADMIN', NOW() - INTERVAL '1 month'),
(1, 1, 'MEMBER', NOW() - INTERVAL '3 weeks'),
(4, 1, 'MEMBER', NOW() - INTERVAL '3 weeks'),
(6, 1, 'MEMBER', NOW() - INTERVAL '2 weeks'),
(8, 1, 'MODERATOR', NOW() - INTERVAL '2 weeks'),
(10, 1, 'MEMBER', NOW() - INTERVAL '1 week'),

-- Physics Study Group members
(4, 2, 'ADMIN', NOW() - INTERVAL '3 weeks'),
(1, 2, 'MEMBER', NOW() - INTERVAL '2 weeks'),
(2, 2, 'MEMBER', NOW() - INTERVAL '2 weeks'),
(6, 2, 'MEMBER', NOW() - INTERVAL '1 week'),

-- Chemistry Lab Partners members  
(5, 3, 'ADMIN', NOW() - INTERVAL '2 weeks'),
(6, 3, 'MEMBER', NOW() - INTERVAL '2 weeks'),
(1, 3, 'MEMBER', NOW() - INTERVAL '1 week'),
(4, 3, 'MEMBER', NOW() - INTERVAL '1 week'),

-- Biology Enthusiasts members
(6, 4, 'ADMIN', NOW() - INTERVAL '1 month'),
(1, 4, 'MEMBER', NOW() - INTERVAL '3 weeks'),
(4, 4, 'MEMBER', NOW() - INTERVAL '3 weeks'),
(8, 4, 'MEMBER', NOW() - INTERVAL '2 weeks'),
(10, 4, 'MEMBER', NOW() - INTERVAL '1 week'),

-- Computer Science Club members
(1, 5, 'ADMIN', NOW() - INTERVAL '2 months'),
(10, 5, 'MEMBER', NOW() - INTERVAL '1 month'),
(2, 5, 'MEMBER', NOW() - INTERVAL '3 weeks');

-- Insert mock discussions
INSERT INTO discussion.discussions (title, content, type, author_id, subject_id, topic_id, class_level, upvotes_count, downvotes_count, answers_count, views_count, has_accepted_answer, status, group_id, created_at, updated_at) VALUES
('Help with Quadratic Equations', 'I''m struggling to understand how to solve quadratic equations using the quadratic formula. Can someone explain the steps clearly?', 'QUESTION', 1, 1, 1, 'CLASS_10', 5, 0, 3, 45, true, 'ACTIVE', 1, NOW() - INTERVAL '2 days', NOW()),
('Physics Lab: Pendulum Experiment', 'Our lab group measured different pendulum lengths and periods. Here are our results and analysis...', 'HELP', 4, 2, 5, 'CLASS_10', 8, 1, 2, 67, false, 'ACTIVE', 2, NOW() - INTERVAL '1 day', NOW()),
('Mitochondria Structure Question', 'Can someone explain the difference between inner and outer mitochondrial membranes? I''m confused about their functions.', 'QUESTION', 6, 4, 13, 'CLASS_10', 3, 0, 4, 29, true, 'ACTIVE', 4, NOW() - INTERVAL '3 hours', NOW()),
('Organic Chemistry Mechanisms', 'Discussion on SN1 vs SN2 reaction mechanisms. When do we use each type?', 'GENERAL', 5, 3, 11, 'CLASS_10', 12, 2, 6, 89, false, 'ACTIVE', 3, NOW() - INTERVAL '1 week', NOW()),
('Programming Contest Announcement', 'Upcoming coding contest next month! Topics include algorithms and data structures. Who''s interested?', 'ANNOUNCEMENT', 1, 8, 19, 'CLASS_12', 15, 0, 8, 156, false, 'ACTIVE', 5, NOW() - INTERVAL '3 days', NOW()),
('Geometric Proof Strategies', 'What are the best strategies for approaching geometric proofs? Looking for tips and techniques.', 'HELP', 8, 1, 2, 'CLASS_10', 6, 0, 5, 78, true, 'ACTIVE', 1, NOW() - INTERVAL '5 days', NOW()),
('Electromagnetic Induction Concepts', 'Having trouble understanding Faraday''s law and Lenz''s law. Can someone provide real-world examples?', 'QUESTION', 1, 2, 7, 'CLASS_10', 4, 0, 2, 34, false, 'ACTIVE', 2, NOW() - INTERVAL '6 hours', NOW()),
('Study Group Schedule', 'Let''s coordinate our study sessions for the upcoming biology exam. When is everyone available?', 'GENERAL', 6, 4, NULL, 'CLASS_10', 2, 0, 7, 23, false, 'ACTIVE', 4, NOW() - INTERVAL '1 day', NOW()),
('Java vs Python Debate', 'Which programming language is better for beginners? Let''s discuss the pros and cons of each.', 'GENERAL', 10, 8, 17, 'CLASS_12', 18, 5, 12, 201, false, 'ACTIVE', 5, NOW() - INTERVAL '2 weeks', NOW()),
('Chemical Equilibrium Problem', 'Can someone help me solve this equilibrium constant problem? I''m stuck on calculating concentrations.', 'QUESTION', 1, 3, 12, 'CLASS_10', 1, 0, 1, 15, false, 'ACTIVE', 3, NOW() - INTERVAL '2 hours', NOW());

-- Insert discussion tags
INSERT INTO discussion.discussion_tags (discussion_id, tags) VALUES
(1, '{"homework", "algebra", "formula"}'),
(2, '{"lab", "experiment", "data"}'),
(3, '{"cellular", "organelles", "membrane"}'),
(4, '{"reactions", "mechanisms", "organic"}'),
(5, '{"contest", "coding", "algorithms"}'),
(6, '{"geometry", "proofs", "strategies"}'),
(7, '{"electromagnetism", "laws", "examples"}'),
(8, '{"study", "schedule", "exam"}'),
(9, '{"programming", "languages", "beginners"}'),
(10, '{"equilibrium", "calculations", "chemistry"}');

-- Insert mock answers
INSERT INTO discussion.answers (content, author_id, discussion_id, upvotes_count, downvotes_count, is_accepted, created_at, updated_at) VALUES
-- Answers for quadratic equations question
('The quadratic formula is x = (-b ± √(b²-4ac)) / 2a. Here''s a step-by-step breakdown: 1) Identify a, b, c from ax²+bx+c=0, 2) Calculate discriminant b²-4ac, 3) Substitute into formula, 4) Solve for both ± cases.', 2, 1, 8, 0, true, NOW() - INTERVAL '1 day 12 hours', NOW()),
('Great explanation! I''d add that you should always check your answers by substituting back into the original equation.', 8, 1, 3, 0, false, NOW() - INTERVAL '1 day 6 hours', NOW()),
('Here''s a helpful memory trick: "negative b, plus or minus the square root, b squared minus four a c, all over two a" - sing it to remember!', 6, 1, 5, 0, false, NOW() - INTERVAL '1 day 2 hours', NOW()),

-- Answers for pendulum experiment
('Your data looks good! The relationship T = 2π√(L/g) should give you the theoretical values. Compare your experimental results with this formula.', 2, 2, 6, 0, false, NOW() - INTERVAL '18 hours', NOW()),
('Don''t forget to account for measurement uncertainties. Small errors in timing can affect your results significantly.', 5, 2, 4, 0, false, NOW() - INTERVAL '12 hours', NOW()),

-- Answers for mitochondria question
('The outer membrane is permeable to small molecules, while the inner membrane is highly selective. The inner membrane folds (cristae) house the electron transport chain for ATP production.', 5, 3, 7, 0, true, NOW() - INTERVAL '2 hours', NOW()),
('Think of it like a house with two walls - the outer wall (outer membrane) lets visitors in, but the inner wall (inner membrane) has security that carefully controls who enters the important rooms.', 6, 3, 4, 0, false, NOW() - INTERVAL '1 hour', NOW()),
('The space between membranes (intermembrane space) is crucial for the proton gradient that drives ATP synthesis!', 8, 3, 2, 0, false, NOW() - INTERVAL '30 minutes', NOW()),

-- Answers for organic chemistry mechanisms
('SN1: carbocation intermediate, 2-step mechanism, racemization occurs. SN2: concerted mechanism, inversion of stereochemistry, one step.', 2, 4, 9, 1, false, NOW() - INTERVAL '5 days', NOW()),
('Primary carbons favor SN2, tertiary favor SN1. Secondary can go either way depending on conditions!', 5, 4, 6, 0, false, NOW() - INTERVAL '4 days', NOW()),
('Polar protic solvents favor SN1, polar aprotic favor SN2. The solvent makes a huge difference!', 1, 4, 5, 0, false, NOW() - INTERVAL '3 days', NOW()),

-- Answers for programming contest
('Count me in! I''ve been practicing dynamic programming problems. Anyone want to form a study group?', 10, 5, 4, 0, false, NOW() - INTERVAL '2 days 12 hours', NOW()),
('I''m interested but need help with graph algorithms. Can we cover those in preparation?', 1, 5, 3, 0, false, NOW() - INTERVAL '2 days 6 hours', NOW()),
('Let''s create a shared document with practice problems and solutions!', 2, 5, 5, 0, false, NOW() - INTERVAL '1 day 18 hours', NOW()),

-- Answers for geometric proofs
('Start with what you know and work towards what you need to prove. Always state your reasoning for each step clearly.', 2, 6, 8, 0, true, NOW() - INTERVAL '4 days 12 hours', NOW()),
('Draw auxiliary lines when stuck - they often reveal hidden relationships in the figure.', 7, 6, 6, 0, false, NOW() - INTERVAL '4 days 6 hours', NOW()),
('Practice common proof techniques: direct proof, proof by contradiction, and proof by contrapositive.', 8, 6, 4, 0, false, NOW() - INTERVAL '4 days 2 hours', NOW()),

-- Answers for electromagnetic induction
('When a magnet moves through a coil, it changes the magnetic flux, inducing current that opposes the change (Lenz''s law). Think of generators and transformers!', 4, 7, 5, 0, false, NOW() - INTERVAL '4 hours', NOW()),
('Real example: regenerative braking in electric cars uses electromagnetic induction to convert kinetic energy back to electrical energy.', 2, 7, 3, 0, false, NOW() - INTERVAL '2 hours', NOW()),

-- Answer for biology study group
('I''m free Monday and Wednesday evenings. We should focus on cellular respiration and photosynthesis - those are always on exams.', 1, 8, 2, 0, false, NOW() - INTERVAL '20 hours', NOW()),
('Tuesday works for me. Let''s meet in the library study rooms - they have whiteboards we can use for diagrams.', 4, 8, 1, 0, false, NOW() - INTERVAL '18 hours', NOW()),
('Can we include some practice questions? I learn better when we work through problems together.', 8, 8, 3, 0, false, NOW() - INTERVAL '16 hours', NOW()),

-- Answers for Java vs Python debate
('Python is more beginner-friendly with simpler syntax, but Java teaches important concepts like static typing and object-oriented design.', 1, 9, 12, 2, false, NOW() - INTERVAL '1 week 5 days', NOW()),
('Python for rapid prototyping and data science, Java for enterprise applications and Android development. Both have their place!', 2, 9, 8, 1, false, NOW() - INTERVAL '1 week 4 days', NOW()),
('I started with Python and it helped me focus on logic rather than syntax. Once you understand programming concepts, learning Java becomes easier.', 10, 9, 6, 0, false, NOW() - INTERVAL '1 week 3 days', NOW()),

-- Answer for chemical equilibrium
('First, set up an ICE table (Initial, Change, Equilibrium). Then use the equilibrium expression Kc = [products]/[reactants] with the equilibrium concentrations.', 5, 10, 2, 0, false, NOW() - INTERVAL '1 hour', NOW());

-- Insert mock votes
INSERT INTO discussion.votes (user_id, discussion_id, answer_id, is_upvote, created_at) VALUES
-- Votes on discussions
(2, 1, NULL, true, NOW() - INTERVAL '1 day 18 hours'),
(4, 1, NULL, true, NOW() - INTERVAL '1 day 15 hours'),
(6, 1, NULL, true, NOW() - INTERVAL '1 day 12 hours'),
(8, 1, NULL, true, NOW() - INTERVAL '1 day 9 hours'),
(10, 1, NULL, true, NOW() - INTERVAL '1 day 6 hours'),

-- Votes on answers
(1, NULL, 1, true, NOW() - INTERVAL '1 day 11 hours'),
(4, NULL, 1, true, NOW() - INTERVAL '1 day 10 hours'),
(6, NULL, 1, true, NOW() - INTERVAL '1 day 9 hours'),
(8, NULL, 1, true, NOW() - INTERVAL '1 day 8 hours'),
(10, NULL, 1, true, NOW() - INTERVAL '1 day 7 hours'),

(2, NULL, 2, true, NOW() - INTERVAL '1 day 5 hours'),
(4, NULL, 2, true, NOW() - INTERVAL '1 day 4 hours'),
(6, NULL, 2, true, NOW() - INTERVAL '1 day 3 hours'),

(1, NULL, 3, true, NOW() - INTERVAL '1 day 1 hour'),
(2, NULL, 3, true, NOW() - INTERVAL '23 hours'),
(4, NULL, 3, true, NOW() - INTERVAL '22 hours'),
(8, NULL, 3, true, NOW() - INTERVAL '21 hours'),
(10, NULL, 3, true, NOW() - INTERVAL '20 hours');

-- Insert mock bookmarks
INSERT INTO discussion.bookmarks (user_id, discussion_id, created_at) VALUES
(1, 1, NOW() - INTERVAL '1 day 12 hours'),
(1, 4, NOW() - INTERVAL '1 week'),
(1, 5, NOW() - INTERVAL '3 days'),
(4, 2, NOW() - INTERVAL '1 day'),
(4, 7, NOW() - INTERVAL '6 hours'),
(6, 3, NOW() - INTERVAL '2 hours'),
(6, 8, NOW() - INTERVAL '1 day'),
(8, 6, NOW() - INTERVAL '5 days'),
(10, 5, NOW() - INTERVAL '2 days'),
(10, 9, NOW() - INTERVAL '1 week');

-- Insert mock notifications
INSERT INTO discussion.notifications (type, title, content, user_id, related_id, related_type, is_read, created_at) VALUES
('ANSWER', 'New Answer on Your Question', 'Someone answered your question about quadratic equations', 1, 1, 'ANSWER', true, NOW() - INTERVAL '1 day 12 hours'),
('UPVOTE', 'Your Answer Was Upvoted', 'Your answer about mitochondria received an upvote', 5, 4, 'ANSWER', true, NOW() - INTERVAL '2 hours'),
('ANSWER', 'New Answer in Group', 'New answer posted in Math Help Central group', 2, 1, 'ANSWER', false, NOW() - INTERVAL '1 day 6 hours'),
('MENTION', 'You Were Mentioned', 'You were mentioned in a discussion about programming', 1, 9, 'DISCUSSION', false, NOW() - INTERVAL '1 week'),
('GROUP_INVITE', 'Group Invitation', 'You were invited to join Chemistry Lab Partners', 8, 3, 'GROUP', true, NOW() - INTERVAL '2 weeks'),
('FOLLOW', 'New Follower', 'Someone started following your activity', 2, 1, 'USER', false, NOW() - INTERVAL '3 days'),
('UPVOTE', 'Discussion Upvoted', 'Your discussion about pendulum experiment was upvoted', 4, 2, 'DISCUSSION', true, NOW() - INTERVAL '18 hours'),
('ANSWER', 'Question Answered', 'Your question about electromagnetic induction was answered', 1, 7, 'ANSWER', false, NOW() - INTERVAL '4 hours'),
('MESSAGE', 'New Message', 'You have a new private message', 6, 1, 'MESSAGE', false, NOW() - INTERVAL '2 hours'),
('UPVOTE', 'Answer Upvoted', 'Your geometric proof answer received multiple upvotes', 2, 6, 'ANSWER', true, NOW() - INTERVAL '4 days');

-- Insert mock conversations
INSERT INTO discussion.conversations (last_message_id, unread_count, created_at, updated_at) VALUES
(1, 0, NOW() - INTERVAL '1 week', NOW() - INTERVAL '2 hours'),
(2, 1, NOW() - INTERVAL '3 days', NOW() - INTERVAL '1 hour'),
(3, 2, NOW() - INTERVAL '2 days', NOW() - INTERVAL '30 minutes'),
(4, 0, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day');

-- Insert conversation participants
INSERT INTO discussion.conversation_participants (conversation_id, user_id) VALUES
(1, 1), (1, 2), -- John and Jane
(2, 4), (2, 6), -- Sarah and Emily  
(3, 1), (3, 10), -- John and Anna
(4, 5), (4, 8); -- Mike and Lisa

-- Insert mock messages
INSERT INTO discussion.messages (content, type, sender_id, recipient_id, conversation_id, is_read, created_at, updated_at) VALUES
('Hi Jane, could you help me understand the quadratic formula derivation?', 'TEXT', 1, 2, 1, true, NOW() - INTERVAL '1 week', NOW() - INTERVAL '1 week'),
('Of course! Let me explain step by step. It comes from completing the square...', 'TEXT', 2, 1, 1, true, NOW() - INTERVAL '6 days 23 hours', NOW() - INTERVAL '6 days 23 hours'),
('That makes so much sense now! Thank you for the clear explanation.', 'TEXT', 1, 2, 1, true, NOW() - INTERVAL '6 days 22 hours', NOW() - INTERVAL '6 days 22 hours'),
('Hey Emily, want to form a study group for the biology exam?', 'TEXT', 4, 6, 2, true, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
('Absolutely! I was thinking the same thing. When should we meet?', 'TEXT', 6, 4, 2, false, NOW() - INTERVAL '1 hour', NOW() - INTERVAL '1 hour'),
('Anna, I saw your programming question. Here''s a helpful resource...', 'TEXT', 1, 10, 3, true, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
('Thanks John! This tutorial is exactly what I needed.', 'TEXT', 10, 1, 3, false, NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '30 minutes'),
('Another great resource for data structures is...', 'TEXT', 1, 10, 3, false, NOW() - INTERVAL '25 minutes', NOW() - INTERVAL '25 minutes'),
('Mike, what did you think about today''s chemistry lab results?', 'TEXT', 8, 5, 4, true, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
('The results were interesting! The yield was higher than expected.', 'TEXT', 5, 8, 4, true, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day');

-- Insert mock AI queries
INSERT INTO discussion.ai_queries (question, answer, type, subject_id, topic_id, context, confidence, user_id, created_at) VALUES
('Explain the concept of derivatives in calculus', 'A derivative represents the rate of change of a function at a given point. It measures how quickly the function value changes as the input changes. Geometrically, it represents the slope of the tangent line to the function at that point.', 'CONCEPT', 1, 4, 'Student asking about basic calculus concepts', 0.95, 1, NOW() - INTERVAL '2 days'),
('How do I solve quadratic equations?', 'There are several methods to solve quadratic equations: 1) Factoring, 2) Quadratic formula: x = (-b ± √(b²-4ac))/2a, 3) Completing the square, 4) Graphing. The quadratic formula works for all quadratic equations.', 'PROBLEM', 1, 1, 'Homework help request', 0.92, 4, NOW() - INTERVAL '1 day'),
('What is photosynthesis?', 'Photosynthesis is the process by which plants convert light energy into chemical energy (glucose). The equation is: 6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂. It occurs in chloroplasts and involves light-dependent and light-independent reactions.', 'CONCEPT', 4, 16, 'Biology study session', 0.98, 6, NOW() - INTERVAL '3 hours'),
('Explain Newton''s laws of motion', 'Newton''s three laws: 1) First Law (Inertia): Objects at rest stay at rest, objects in motion stay in motion unless acted upon by force. 2) Second Law: F = ma (Force equals mass times acceleration). 3) Third Law: For every action, there is an equal and opposite reaction.', 'EXPLANATION', 2, 5, 'Physics homework help', 0.96, 1, NOW() - INTERVAL '1 week'),
('Help with programming loops', 'Programming loops allow you to repeat code. Main types: 1) For loops: iterate a specific number of times, 2) While loops: continue while condition is true, 3) Do-while loops: execute at least once. Example: for(int i=0; i<10; i++) { //code }', 'HOMEWORK', 8, 17, 'Programming assignment', 0.90, 10, NOW() - INTERVAL '5 days');

-- Insert AI query sources
INSERT INTO discussion.ai_query_sources (query_id, sources) VALUES
(1, '{"Khan Academy Calculus", "MIT OpenCourseWare", "Calculus Textbook Ch. 3"}'),
(2, '{"Algebra Fundamentals", "Math Solver Guide", "Quadratic Equations Tutorial"}'),
(3, '{"Campbell Biology", "Photosynthesis Research Paper", "Plant Biology Encyclopedia"}'),
(4, '{"Physics Principles", "Classical Mechanics Textbook", "Newton Laws Explained"}'),
(5, '{"Programming Fundamentals", "Loop Tutorial", "Java Documentation"}');

-- Print confirmation
SELECT 'Database schemas and mock data initialized successfully' as status;