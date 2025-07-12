-- Assessment Service Database Initialization
-- This script initializes the assessment schema with proper data structure
-- Run this AFTER the assessment service has started and created tables

-- Use the assessment schema
SET search_path TO assessment, public;

-- Clear existing data to ensure clean state
TRUNCATE TABLE IF EXISTS assessment.question_options CASCADE;
TRUNCATE TABLE IF EXISTS assessment.question_tags CASCADE;
TRUNCATE TABLE IF EXISTS assessment.question_attachments CASCADE;
TRUNCATE TABLE IF EXISTS assessment.user_submissions CASCADE;
TRUNCATE TABLE IF EXISTS assessment.user_streaks CASCADE;
TRUNCATE TABLE IF EXISTS assessment.daily_questions CASCADE;
TRUNCATE TABLE IF EXISTS assessment.contest_problems CASCADE;
TRUNCATE TABLE IF EXISTS assessment.contests CASCADE;
TRUNCATE TABLE IF EXISTS assessment.live_exam_questions CASCADE;
TRUNCATE TABLE IF EXISTS assessment.live_exams CASCADE;
TRUNCATE TABLE IF EXISTS assessment.personalized_exam_questions CASCADE;
TRUNCATE TABLE IF EXISTS assessment.personalized_exams CASCADE;
TRUNCATE TABLE IF EXISTS assessment.questions CASCADE;
TRUNCATE TABLE IF EXISTS assessment.topics CASCADE;
TRUNCATE TABLE IF EXISTS assessment.subjects CASCADE;

-- Insert subjects with proper enum values
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

-- Insert topics linked to subjects
INSERT INTO assessment.topics (name, description, subject_id, display_order, is_active, created_at, updated_at) VALUES
-- Mathematics topics (subject_id = 1)
('Algebra', 'Linear equations and algebraic expressions', 1, 1, true, NOW(), NOW()),
('Geometry', 'Shapes, angles, and geometric proofs', 1, 2, true, NOW(), NOW()),
('Trigonometry', 'Sine, cosine, and trigonometric identities', 1, 3, true, NOW(), NOW()),
('Calculus', 'Derivatives and integrals', 1, 4, true, NOW(), NOW()),

-- Physics topics (subject_id = 2)
('Mechanics', 'Motion, force, and energy', 2, 1, true, NOW(), NOW()),
('Thermodynamics', 'Heat, temperature, and energy transfer', 2, 2, true, NOW(), NOW()),
('Electromagnetism', 'Electric and magnetic fields', 2, 3, true, NOW(), NOW()),
('Optics', 'Light, reflection, and refraction', 2, 4, true, NOW(), NOW()),

-- Chemistry topics (subject_id = 3)
('Atomic Structure', 'Atoms, electrons, and periodic table', 3, 1, true, NOW(), NOW()),
('Chemical Bonding', 'Ionic and covalent bonds', 3, 2, true, NOW(), NOW()),
('Organic Chemistry', 'Carbon compounds and reactions', 3, 3, true, NOW(), NOW()),
('Acids and Bases', 'pH, acids, bases, and neutralization', 3, 4, true, NOW(), NOW()),

-- Biology topics (subject_id = 4)
('Cell Biology', 'Cell structure and functions', 4, 1, true, NOW(), NOW()),
('Genetics', 'DNA, genes, and heredity', 4, 2, true, NOW(), NOW()),
('Evolution', 'Natural selection and species development', 4, 3, true, NOW(), NOW()),
('Ecology', 'Ecosystems and environmental relationships', 4, 4, true, NOW(), NOW()),

-- Computer Science topics (subject_id = 8)
('Programming Basics', 'Variables, loops, and functions', 8, 1, true, NOW(), NOW()),
('Data Structures', 'Arrays, lists, and trees', 8, 2, true, NOW(), NOW()),
('Algorithms', 'Sorting, searching, and optimization', 8, 3, true, NOW(), NOW()),
('Object-Oriented Programming', 'Classes, objects, and inheritance', 8, 4, true, NOW(), NOW());

-- Insert questions with proper structure
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
('How many protons does carbon have?', 'NUMERIC', 3, 9, 'EASY', '6', 'Carbon has atomic number 6, which equals the number of protons', 1, true, 2, NOW(), NOW()),
('What type of bond forms between sodium and chlorine?', 'MCQ', 3, 10, 'EASY', 'Ionic bond', 'Sodium loses an electron to chlorine, forming Na⁺ and Cl⁻ ions', 1, true, 2, NOW(), NOW()),
('What is the general formula for alkanes?', 'FILL_BLANK', 3, 11, 'MEDIUM', 'CnH2n+2', 'Alkanes are saturated hydrocarbons with this general formula', 2, true, 2, NOW(), NOW()),
('What is the pH of pure water at 25°C?', 'NUMERIC', 3, 12, 'EASY', '7', 'Pure water is neutral with pH = 7', 1, true, 2, NOW(), NOW()),

-- Biology questions
('What is the powerhouse of the cell?', 'MCQ', 4, 13, 'EASY', 'Mitochondria', 'Mitochondria produce ATP through cellular respiration', 1, true, 2, NOW(), NOW()),
('What does DNA stand for?', 'FILL_BLANK', 4, 14, 'EASY', 'Deoxyribonucleic Acid', 'DNA carries genetic information in all living organisms', 1, true, 2, NOW(), NOW()),
('Who proposed the theory of evolution by natural selection?', 'MCQ', 4, 15, 'MEDIUM', 'Charles Darwin', 'Darwin published "On the Origin of Species" in 1859', 2, true, 2, NOW(), NOW()),
('What is a food chain?', 'ESSAY', 4, 16, 'MEDIUM', 'A linear sequence of organisms where each is eaten by the next member in the chain', 'Food chains show the flow of energy through ecosystems', 3, true, 2, NOW(), NOW()),

-- Computer Science questions
('What is a variable in programming?', 'ESSAY', 8, 17, 'EASY', 'A storage location with an associated name that contains data', 'Variables store and manipulate data in programs', 2, true, 2, NOW(), NOW()),
('Which data structure follows LIFO principle?', 'MCQ', 8, 18, 'MEDIUM', 'Stack', 'Stack follows Last In, First Out principle', 2, true, 2, NOW(), NOW()),
('What is the time complexity of binary search?', 'MCQ', 8, 19, 'HARD', 'O(log n)', 'Binary search divides the search space in half each iteration', 3, true, 2, NOW(), NOW()),
('What is inheritance in OOP?', 'ESSAY', 8, 20, 'MEDIUM', 'A mechanism where a new class inherits properties and methods from an existing class', 'Inheritance promotes code reusability and establishes relationships between classes', 3, true, 2, NOW(), NOW());

-- Insert MCQ options for multiple choice questions using ElementCollection approach
-- Note: Options are stored as ElementCollection in the Question entity
-- We need to update the questions with options after they are created

-- Update Question 1 with options (2x + 5 = 13)
UPDATE assessment.questions SET options = ARRAY['3', '4', '5', '6'] WHERE id = 1;

-- Update Question 3 with options (sin(30°))
UPDATE assessment.questions SET options = ARRAY['0.5', '0.707', '0.866', '1'] WHERE id = 3;

-- Update Question 7 with options (Gas volume and temperature)
UPDATE assessment.questions SET options = ARRAY['Volume increases', 'Volume decreases', 'Volume remains constant', 'Volume becomes zero'] WHERE id = 7;

-- Update Question 8 with options (Light speed)
UPDATE assessment.questions SET options = ARRAY['Air', 'Water', 'Glass', 'Vacuum'] WHERE id = 8;

-- Update Question 10 with options (Sodium chlorine bond)
UPDATE assessment.questions SET options = ARRAY['Ionic bond', 'Covalent bond', 'Metallic bond', 'Hydrogen bond'] WHERE id = 10;

-- Update Question 13 with options (Powerhouse of cell)
UPDATE assessment.questions SET options = ARRAY['Nucleus', 'Mitochondria', 'Ribosome', 'Chloroplast'] WHERE id = 13;

-- Update Question 15 with options (Evolution theory)
UPDATE assessment.questions SET options = ARRAY['Charles Darwin', 'Gregor Mendel', 'Alfred Wallace', 'Jean Lamarck'] WHERE id = 15;

-- Update Question 18 with options (LIFO data structure)
UPDATE assessment.questions SET options = ARRAY['Queue', 'Stack', 'Array', 'Linked List'] WHERE id = 18;

-- Update Question 19 with options (Binary search complexity)
UPDATE assessment.questions SET options = ARRAY['O(1)', 'O(log n)', 'O(n)', 'O(n²)'] WHERE id = 19;

-- Add tags to questions
UPDATE assessment.questions SET tags = ARRAY['algebra', 'equations', 'basic'] WHERE id = 1;
UPDATE assessment.questions SET tags = ARRAY['geometry', 'area', 'triangle'] WHERE id = 2;
UPDATE assessment.questions SET tags = ARRAY['trigonometry', 'sine', 'angles'] WHERE id = 3;
UPDATE assessment.questions SET tags = ARRAY['calculus', 'derivatives', 'functions'] WHERE id = 4;
UPDATE assessment.questions SET tags = ARRAY['mechanics', 'newton', 'laws'] WHERE id = 5;
UPDATE assessment.questions SET tags = ARRAY['thermodynamics', 'energy', 'kinetic'] WHERE id = 6;
UPDATE assessment.questions SET tags = ARRAY['thermodynamics', 'gas laws', 'charles'] WHERE id = 7;
UPDATE assessment.questions SET tags = ARRAY['optics', 'light', 'speed'] WHERE id = 8;
UPDATE assessment.questions SET tags = ARRAY['atomic', 'protons', 'carbon'] WHERE id = 9;
UPDATE assessment.questions SET tags = ARRAY['bonding', 'ionic', 'sodium'] WHERE id = 10;
UPDATE assessment.questions SET tags = ARRAY['organic', 'alkanes', 'hydrocarbons'] WHERE id = 11;
UPDATE assessment.questions SET tags = ARRAY['acids', 'ph', 'neutral'] WHERE id = 12;
UPDATE assessment.questions SET tags = ARRAY['cell biology', 'organelles', 'mitochondria'] WHERE id = 13;
UPDATE assessment.questions SET tags = ARRAY['genetics', 'dna', 'heredity'] WHERE id = 14;
UPDATE assessment.questions SET tags = ARRAY['evolution', 'darwin', 'selection'] WHERE id = 15;
UPDATE assessment.questions SET tags = ARRAY['ecology', 'food chain', 'energy'] WHERE id = 16;
UPDATE assessment.questions SET tags = ARRAY['programming', 'variables', 'basics'] WHERE id = 17;
UPDATE assessment.questions SET tags = ARRAY['data structures', 'stack', 'lifo'] WHERE id = 18;
UPDATE assessment.questions SET tags = ARRAY['algorithms', 'binary search', 'complexity'] WHERE id = 19;
UPDATE assessment.questions SET tags = ARRAY['oop', 'inheritance', 'classes'] WHERE id = 20;

-- Insert user submissions for testing
INSERT INTO assessment.user_submissions (user_id, question_id, answer, is_correct, time_taken, points_earned, submitted_at) VALUES
-- Student submissions (user_id 1 = john_doe)
(1, 1, '4', true, 45, 1, NOW() - INTERVAL '2 days'),
(1, 2, '40', true, 120, 2, NOW() - INTERVAL '2 days'),
(1, 3, '0.5', true, 60, 2, NOW() - INTERVAL '1 day'),
(1, 13, 'Mitochondria', true, 30, 1, NOW() - INTERVAL '1 day'),

-- More student submissions for testing
(4, 1, '5', false, 90, 0, NOW() - INTERVAL '3 days'),
(4, 5, 'An object at rest stays at rest', true, 180, 2, NOW() - INTERVAL '2 days'),
(4, 6, '250', true, 150, 3, NOW() - INTERVAL '1 day'),
(4, 8, 'Vacuum', true, 25, 1, NOW());

-- Insert user streaks for analytics
INSERT INTO assessment.user_streaks (user_id, subject_id, current_streak, longest_streak, last_activity, is_active, created_at, updated_at) VALUES
(1, 1, 3, 5, CURRENT_DATE, true, NOW(), NOW()), -- Mathematics
(1, 2, 2, 4, CURRENT_DATE - INTERVAL '1 day', true, NOW(), NOW()), -- Physics
(4, 2, 4, 6, CURRENT_DATE, true, NOW(), NOW()), -- Physics
(6, 4, 5, 7, CURRENT_DATE, true, NOW(), NOW()); -- Biology

-- Insert daily questions for current and recent dates
INSERT INTO assessment.daily_questions (question_id, date, subject_id, difficulty, points, created_at) VALUES
(1, CURRENT_DATE, 1, 'EASY', 1, NOW()),
(2, CURRENT_DATE - INTERVAL '1 day', 1, 'MEDIUM', 2, NOW() - INTERVAL '1 day'),
(3, CURRENT_DATE - INTERVAL '2 days', 1, 'EASY', 1, NOW() - INTERVAL '2 days'),
(5, CURRENT_DATE - INTERVAL '3 days', 2, 'EASY', 1, NOW() - INTERVAL '3 days'),
(9, CURRENT_DATE - INTERVAL '4 days', 3, 'MEDIUM', 2, NOW() - INTERVAL '4 days');

-- Insert contests with proper structure
INSERT INTO assessment.contests (title, description, type, start_time, end_time, duration, rules, participants, status, created_at, updated_at) VALUES
('Math Challenge 2024', 'Annual mathematics competition for all levels', 'MIXED', NOW() + INTERVAL '1 week', NOW() + INTERVAL '1 week 2 hours', 120, 'No calculators allowed. Show all work.', 25, 'UPCOMING', NOW(), NOW()),
('Physics Speed Round', 'Quick physics problem solving contest', 'SPEED', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days 1 hour', 60, 'Answer as many questions as possible in 60 minutes.', 18, 'COMPLETED', NOW() - INTERVAL '3 days', NOW()),
('Chemistry Quiz Bowl', 'Team-based chemistry competition', 'ACCURACY', NOW() + INTERVAL '3 days', NOW() + INTERVAL '3 days 1.5 hours', 90, 'Teams of 4 students. Accuracy is key.', 12, 'UPCOMING', NOW(), NOW()),
('Biology Knowledge Test', 'Comprehensive biology assessment', 'MIXED', NOW() - INTERVAL '1 week', NOW() - INTERVAL '1 week 2 hours', 120, 'Multiple choice and essay questions.', 30, 'COMPLETED', NOW() - INTERVAL '8 days', NOW());

-- Insert live exams
INSERT INTO assessment.live_exams (title, description, subject_id, class_level, scheduled_at, duration, instructions, passing_score, total_participants, status, created_at, updated_at) VALUES
('Midterm Mathematics Exam', 'Comprehensive math exam covering algebra and geometry', 1, 'CLASS_10', NOW() + INTERVAL '1 week', 180, 'Read all questions carefully. Show your work for partial credit.', 60, 0, 'SCHEDULED', NOW(), NOW()),
('Physics Lab Assessment', 'Practical physics examination', 2, 'CLASS_10', NOW() + INTERVAL '3 days', 120, 'Bring calculator and reference sheets.', 70, 0, 'SCHEDULED', NOW(), NOW()),
('Chemistry Final Exam', 'Final examination for chemistry course', 3, 'CLASS_10', NOW() - INTERVAL '2 days', 150, 'No notes allowed. Periodic table provided.', 65, 45, 'COMPLETED', NOW() - INTERVAL '1 week', NOW()),
('Biology Unit Test', 'Test on cell biology and genetics', 4, 'CLASS_10', NOW() + INTERVAL '5 days', 90, 'Multiple choice and short answer questions.', 60, 0, 'SCHEDULED', NOW(), NOW());

-- Insert personalized exams
INSERT INTO assessment.personalized_exams (user_id, title, description, subject_id, class_level, duration, total_questions, score, correct_answers, incorrect_answers, status, started_at, completed_at, created_at, updated_at) VALUES
(1, 'Algebra Practice Test', 'Personalized algebra assessment', 1, 'CLASS_10', 60, 4, 80, 3, 1, 'COMPLETED', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day 1 hour', NOW() - INTERVAL '2 days', NOW()),
(4, 'Physics Mechanics Quiz', 'Custom physics quiz on mechanics', 2, 'CLASS_10', 45, 4, 75, 3, 1, 'COMPLETED', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days 45 minutes', NOW() - INTERVAL '3 days', NOW()),
(6, 'Biology Cell Structure Test', 'Personalized test on cell biology', 4, 'CLASS_10', 30, 4, 100, 4, 0, 'COMPLETED', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day 30 minutes', NOW() - INTERVAL '2 days', NOW()),
(10, 'Programming Basics Assessment', 'Introduction to programming concepts', 8, 'CLASS_12', 90, 4, 0, 0, 0, 'SCHEDULED', NULL, NULL, NOW(), NOW());

-- Print success message
SELECT 'Assessment Service database initialized successfully!' as status,
       (SELECT COUNT(*) FROM assessment.subjects) as subjects_count,
       (SELECT COUNT(*) FROM assessment.topics) as topics_count,
       (SELECT COUNT(*) FROM assessment.questions) as questions_count,
       (SELECT COUNT(*) FROM assessment.daily_questions) as daily_questions_count,
       (SELECT COUNT(*) FROM assessment.contests) as contests_count,
       (SELECT COUNT(*) FROM assessment.live_exams) as live_exams_count;