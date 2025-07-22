-- =====================================================
-- ASSESSMENT SERVICE - Contests and Exams
-- =====================================================
-- Comprehensive contest and exam data for competitive learning

-- Insert contests with various statuses and types
INSERT INTO assessment.contests (title, description, type, start_time, end_time, duration, rules, participants, status, created_at, updated_at) VALUES

-- ========== UPCOMING CONTESTS ==========
('Annual Mathematics Olympiad 2024', 'The most prestigious mathematics competition featuring algebra, geometry, and calculus problems', 'MIXED', NOW() + INTERVAL '2 weeks', NOW() + INTERVAL '2 weeks 3 hours', 180, 'No calculators allowed. Show all work. Partial credit given for methodology. Late submissions not accepted.', 0, 'UPCOMING', NOW(), NOW()),
('Physics Speed Challenge', 'Fast-paced physics problem solving contest covering mechanics, electricity, and optics', 'SPEED', NOW() + INTERVAL '1 week', NOW() + INTERVAL '1 week 1 hour', 60, 'Answer as many questions as possible in 60 minutes. Each correct answer: +10 points. Wrong answer: -2 points.', 0, 'UPCOMING', NOW(), NOW()),
('Chemistry Quiz Bowl Championship', 'Team-based chemistry competition covering organic, inorganic, and physical chemistry', 'ACCURACY', NOW() + INTERVAL '10 days', NOW() + INTERVAL '10 days 2 hours', 120, 'Teams of 4 students maximum. Accuracy is key - wrong answers penalized. Reference materials allowed.', 0, 'UPCOMING', NOW(), NOW()),
('Computer Programming Marathon', 'Intensive coding competition with algorithmic challenges and data structure problems', 'MIXED', NOW() + INTERVAL '3 days', NOW() + INTERVAL '3 days 4 hours', 240, 'Use any programming language. Original code only. Plagiarism detection enabled. Multiple submissions allowed.', 0, 'UPCOMING', NOW(), NOW()),
('Biology Research Challenge', 'Advanced biology competition focusing on genetics, ecology, and molecular biology', 'ACCURACY', NOW() + INTERVAL '5 days', NOW() + INTERVAL '5 days 90 minutes', 90, 'Research-based questions requiring deep understanding. Citations required for essay answers.', 0, 'UPCOMING', NOW(), NOW()),

-- ========== ACTIVE CONTESTS ==========
('Weekly Math Practice', 'Regular mathematics practice contest for all skill levels', 'MIXED', NOW() - INTERVAL '2 days', NOW() + INTERVAL '1 day', 4320, 'Open for 3 days. Submit anytime during window. Multiple attempts allowed on each question.', 25, 'ACTIVE', NOW() - INTERVAL '3 days', NOW()),
('Physics Lab Simulation Contest', 'Virtual physics experiments and problem solving', 'ACCURACY', NOW() - INTERVAL '1 day', NOW() + INTERVAL '2 days', 4320, 'Virtual lab environment provided. Detailed explanations required. Safety protocols must be followed.', 18, 'ACTIVE', NOW() - INTERVAL '2 days', NOW()),

-- ========== COMPLETED CONTESTS ==========
('Spring Chemistry Challenge 2024', 'Completed chemistry competition with excellent participation', 'MIXED', NOW() - INTERVAL '1 month', NOW() - INTERVAL '1 month 2 hours', 120, 'Standard chemistry competition rules applied. Periodic table provided.', 67, 'COMPLETED', NOW() - INTERVAL '5 weeks', NOW()),
('International Programming Contest', 'Global programming competition with participants worldwide', 'SPEED', NOW() - INTERVAL '2 weeks', NOW() - INTERVAL '2 weeks 3 hours', 180, 'ACM-ICPC style competition. Team programming allowed.', 234, 'COMPLETED', NOW() - INTERVAL '3 weeks', NOW()),
('Biology Excellence Awards', 'Annual biology competition recognizing outstanding students', 'ACCURACY', NOW() - INTERVAL '3 weeks', NOW() - INTERVAL '3 weeks 2 hours', 120, 'High school level biology. Research component included.', 89, 'COMPLETED', NOW() - INTERVAL '4 weeks', NOW()),
('Mathematics Talent Search', 'Challenging math problems for gifted students', 'MIXED', NOW() - INTERVAL '1 week', NOW() - INTERVAL '1 week 4 hours', 240, 'Advanced mathematics concepts. Proofs required for some problems.', 45, 'COMPLETED', NOW() - INTERVAL '2 weeks', NOW()),

-- ========== CANCELLED CONTEST ==========
('Advanced Physics Symposium', 'Cancelled due to technical difficulties', 'ACCURACY', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days 2 hours', 120, 'Contest was cancelled due to server issues.', 0, 'CANCELLED', NOW() - INTERVAL '1 week', NOW());

-- Insert contest problems (mapping contests to question sets)
INSERT INTO assessment.contest_problems (contest_id, problem_ids) VALUES
(1, '{1,2,3,4,5,6,7,8}'),    -- Mathematics Olympiad
(2, '{10,11,12,13,14,15}'),   -- Physics Speed Challenge  
(3, '{15,16,17,18,19}'),      -- Chemistry Quiz Bowl
(4, '{25,26,27,28,29}'),      -- Programming Marathon
(5, '{20,21,22,23,24}'),      -- Biology Research Challenge
(6, '{1,3,5,39}'),            -- Weekly Math Practice
(7, '{10,11,14,38}'),         -- Physics Lab Simulation
(8, '{15,16,17,18}'),         -- Spring Chemistry Challenge (completed)
(9, '{25,26,29,30}'),         -- International Programming Contest (completed)
(10, '{20,21,22,23}'),        -- Biology Excellence Awards (completed)
(11, '{1,2,8,9}');            -- Mathematics Talent Search (completed)

-- Insert live exams with different statuses
INSERT INTO assessment.live_exams (title, description, subject_id, class_level, scheduled_at, duration, instructions, passing_score, total_participants, status, created_at, updated_at) VALUES

-- ========== SCHEDULED EXAMS ==========
('Class 10 Mathematics Final Exam', 'Comprehensive mathematics examination covering full curriculum including algebra, geometry, and trigonometry', 1, 'CLASS_10', NOW() + INTERVAL '2 weeks', 180, 'Bring pencil, eraser, and compass. Calculator not allowed. Show all working. Read questions carefully before answering.', 60, 0, 'SCHEDULED', NOW(), NOW()),
('Physics Midterm Assessment', 'Mid-semester physics examination focusing on mechanics and electricity', 2, 'CLASS_10', NOW() + INTERVAL '1 week', 120, 'Formula sheet provided. Draw clear diagrams. Units must be included in all numerical answers.', 65, 0, 'SCHEDULED', NOW(), NOW()),
('Chemistry Lab Practical Exam', 'Hands-on chemistry examination with experiments and analysis', 3, 'CLASS_10', NOW() + INTERVAL '10 days', 150, 'Safety goggles mandatory. Follow all safety protocols. Lab manual allowed for reference.', 70, 0, 'SCHEDULED', NOW(), NOW()),
('Biology Unit Test - Life Processes', 'Test covering respiration, circulation, and excretion in living organisms', 4, 'CLASS_10', NOW() + INTERVAL '5 days', 90, 'Diagrams should be labeled clearly. Answer all questions. Time management is crucial.', 60, 0, 'SCHEDULED', NOW(), NOW()),
('Computer Science Programming Exam', 'Practical programming examination with coding challenges', 15, 'CLASS_11', NOW() + INTERVAL '1 week', 120, 'Any programming language allowed. Code must be well-commented. Test cases will be provided.', 75, 0, 'SCHEDULED', NOW(), NOW()),
('Advanced Mathematics Placement Test', 'Challenging exam for advanced mathematics stream selection', 11, 'CLASS_11', NOW() + INTERVAL '3 days', 150, 'Cover all topics from basic to advanced level. Detailed solutions required for proof questions.', 80, 0, 'SCHEDULED', NOW(), NOW()),

-- ========== ACTIVE EXAMS ==========
('English Literature Assessment', 'Currently active literature examination', 5, 'CLASS_10', NOW() - INTERVAL '30 minutes', 120, 'Answer all questions. Critical analysis required for literature passages.', 65, 28, 'ACTIVE', NOW() - INTERVAL '2 hours', NOW()),

-- ========== COMPLETED EXAMS ==========
('Class 10 Science Quarterly Exam', 'Completed quarterly examination covering physics, chemistry, and biology', 2, 'CLASS_10', NOW() - INTERVAL '1 week', 180, 'All topics covered. Results published.', 60, 156, 'COMPLETED', NOW() - INTERVAL '2 weeks', NOW()),
('Mathematics Olympiad Qualifier', 'Qualifying round for national mathematics olympiad', 1, 'CLASS_10', NOW() - INTERVAL '2 weeks', 150, 'Advanced problem solving required.', 85, 89, 'COMPLETED', NOW() - INTERVAL '3 weeks', NOW()),
('Chemistry Annual Examination', 'Annual chemistry exam with excellent student participation', 3, 'CLASS_10', NOW() - INTERVAL '1 month', 120, 'Comprehensive chemistry assessment completed.', 65, 134, 'COMPLETED', NOW() - INTERVAL '5 weeks', NOW()),
('Physics Practical Assessment', 'Hands-on physics practical examination', 2, 'CLASS_10', NOW() - INTERVAL '3 days', 90, 'Laboratory practical completed successfully.', 70, 67, 'COMPLETED', NOW() - INTERVAL '1 week', NOW()),

-- ========== CANCELLED EXAM ==========
('Advanced Biology Symposium', 'Cancelled due to schedule conflicts', 4, 'CLASS_11', NOW() - INTERVAL '1 day', 120, 'Exam cancelled and rescheduled.', 70, 0, 'CANCELLED', NOW() - INTERVAL '3 days', NOW());

-- Insert live exam questions (mapping exams to question sets)
INSERT INTO assessment.live_exam_questions (exam_id, question_ids) VALUES
(1, '{1,2,3,4,5,6,7,8,9}'),     -- Class 10 Math Final
(2, '{10,11,12,13,14}'),         -- Physics Midterm  
(3, '{15,16,17,18,19}'),         -- Chemistry Lab Practical
(4, '{20,21,22,23,24}'),         -- Biology Unit Test
(5, '{25,26,27,28,29}'),         -- Computer Science Programming
(6, '{1,5,8,9,11}'),             -- Advanced Math Placement
(7, '{33,34,35}'),               -- English Literature (active)
(8, '{10,15,20,22,38}'),         -- Class 10 Science Quarterly (completed)
(9, '{1,2,8,9}'),                -- Math Olympiad Qualifier (completed)
(10, '{15,16,17,18,19}'),        -- Chemistry Annual (completed)
(11, '{10,11,14}');              -- Physics Practical (completed)

-- Insert personalized exams showing different completion states
INSERT INTO assessment.personalized_exams (user_id, title, description, subject_id, class_level, duration, total_questions, score, correct_answers, incorrect_answers, status, started_at, completed_at, created_at, updated_at) VALUES

-- ========== COMPLETED PERSONALIZED EXAMS ==========
-- High performer - Alex Johnson
(12, 'Advanced Algebra Mastery Test', 'Personalized assessment focusing on advanced algebraic concepts and problem solving', 1, 'CLASS_10', 90, 15, 92, 14, 1, 'COMPLETED', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days 1 hour 30 minutes', NOW() - INTERVAL '3 days', NOW()),
(12, 'Physics Mechanics Challenge', 'Custom physics assessment covering motion, forces, and energy concepts', 2, 'CLASS_10', 75, 12, 87, 10, 2, 'COMPLETED', NOW() - INTERVAL '1 week', NOW() - INTERVAL '1 week 1 hour 15 minutes', NOW() - INTERVAL '8 days', NOW()),

-- Good performer - Sophia Martinez  
(13, 'Mathematics Foundation Builder', 'Comprehensive math review covering core concepts', 1, 'CLASS_10', 60, 10, 85, 8, 2, 'COMPLETED', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days 1 hour', NOW() - INTERVAL '4 days', NOW()),
(13, 'Geometry Visualization Test', 'Spatial reasoning and geometric problem solving assessment', 1, 'CLASS_10', 45, 8, 78, 6, 2, 'COMPLETED', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days 45 minutes', NOW() - INTERVAL '6 days', NOW()),

-- Average performer - Sarah Learner
(16, 'Science Fundamentals Review', 'Mixed science questions covering basic concepts', 2, 'CLASS_10', 60, 12, 67, 8, 4, 'COMPLETED', NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days 1 hour', NOW() - INTERVAL '5 days', NOW()),
(16, 'Basic Mathematics Practice', 'Fundamental math skills assessment and practice', 1, 'CLASS_10', 45, 10, 70, 7, 3, 'COMPLETED', NOW() - INTERVAL '1 week', NOW() - INTERVAL '1 week 45 minutes', NOW() - INTERVAL '8 days', NOW()),

-- Biology enthusiast - Emily Rodriguez
(15, 'Cell Biology Deep Dive', 'Advanced cellular biology concepts and processes', 4, 'CLASS_10', 75, 15, 94, 14, 1, 'COMPLETED', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days 1 hour 15 minutes', NOW() - INTERVAL '3 days', NOW()),
(15, 'Human Anatomy Systems Test', 'Comprehensive human body systems assessment', 4, 'CLASS_10', 90, 18, 89, 16, 2, 'COMPLETED', NOW() - INTERVAL '1 week', NOW() - INTERVAL '1 week 1 hour 30 minutes', NOW() - INTERVAL '8 days', NOW()),

-- Computer Science student - James Wilson
(35, 'Programming Logic Fundamentals', 'Basic programming concepts and logical thinking', 15, 'CLASS_11', 90, 12, 91, 11, 1, 'COMPLETED', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days 1 hour 30 minutes', NOW() - INTERVAL '4 days', NOW()),
(35, 'Data Structures Introduction', 'Introduction to arrays, lists, and basic data structures', 15, 'CLASS_11', 75, 10, 85, 8, 2, 'COMPLETED', NOW() - INTERVAL '1 week', NOW() - INTERVAL '1 week 1 hour 15 minutes', NOW() - INTERVAL '8 days', NOW()),

-- Struggling student - Tom Brown  
(21, 'Basic Arithmetic Review', 'Fundamental arithmetic operations and concepts', 1, 'CLASS_10', 30, 6, 45, 3, 3, 'COMPLETED', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days 30 minutes', NOW() - INTERVAL '6 days', NOW()),
(21, 'Science Basics Introduction', 'Introduction to basic scientific concepts', 2, 'CLASS_10', 45, 8, 52, 4, 4, 'COMPLETED', NOW() - INTERVAL '2 weeks', NOW() - INTERVAL '2 weeks 45 minutes', NOW() - INTERVAL '15 days', NOW()),

-- ========== IN-PROGRESS PERSONALIZED EXAMS ==========
(12, 'Advanced Calculus Concepts', 'Challenging calculus problems for advanced students', 11, 'CLASS_11', 120, 20, 0, 0, 0, 'IN_PROGRESS', NOW() - INTERVAL '15 minutes', NULL, NOW() - INTERVAL '1 hour', NOW()),
(14, 'Physics Advanced Mechanics', 'Complex physics problems involving advanced mechanics', 12, 'CLASS_11', 105, 15, 0, 0, 0, 'IN_PROGRESS', NOW() - INTERVAL '30 minutes', NULL, NOW() - INTERVAL '2 hours', NOW()),
(16, 'Chemistry Organic Reactions', 'Organic chemistry reaction mechanisms and synthesis', 13, 'CLASS_11', 90, 12, 0, 0, 0, 'IN_PROGRESS', NOW() - INTERVAL '45 minutes', NULL, NOW() - INTERVAL '1 hour', NOW()),

-- ========== SCHEDULED PERSONALIZED EXAMS ==========
(13, 'Statistics and Probability', 'Advanced statistics and probability theory', 11, 'CLASS_11', 75, 10, 0, 0, 0, 'SCHEDULED', NULL, NULL, NOW(), NOW()),
(15, 'Molecular Biology Advanced', 'Advanced molecular biology and genetics', 14, 'CLASS_11', 90, 14, 0, 0, 0, 'SCHEDULED', NULL, NULL, NOW(), NOW()),
(35, 'Algorithm Design Patterns', 'Advanced algorithmic thinking and design patterns', 25, 'CLASS_12', 120, 15, 0, 0, 0, 'SCHEDULED', NULL, NULL, NOW(), NOW()),
(24, 'Engineering Mathematics', 'Mathematics concepts for engineering applications', 21, 'CLASS_12', 105, 16, 0, 0, 0, 'SCHEDULED', NULL, NULL, NOW(), NOW()),
(25, 'Computer Networks Fundamentals', 'Networking concepts and protocols', 25, 'CLASS_12', 90, 12, 0, 0, 0, 'SCHEDULED', NULL, NULL, NOW(), NOW());

-- Insert personalized exam questions (mapping exams to question sets)
INSERT INTO assessment.personalized_exam_questions (exam_id, question_ids) VALUES
-- Completed exams
(1, '{1,2,3,4,5,6,7,8,39,41,42,43,44,45,46}'),  -- Alex's Algebra test
(2, '{10,11,12,13,14,38,44,45,47,48,49,50}'),    -- Alex's Physics test
(3, '{1,3,5,7,39,41,42,43,44,45}'),              -- Sophia's Math Foundation
(4, '{2,6,9,41,42,43,44,45}'),                   -- Sophia's Geometry test
(5, '{10,15,20,22,38,44,45,47,48,49,50,51}'),    -- Sarah's Science review
(6, '{1,3,39,41,42,43,44,45,46,47}'),            -- Sarah's Basic Math
(7, '{20,21,22,23,24,47,48,49,50,51,15,16,17,18,19}'), -- Emily's Cell Biology
(8, '{20,21,22,23,24,47,48,49,50,51,15,16,17,18,19,20,21,22}'), -- Emily's Anatomy
(9, '{25,26,27,28,29,50,51,25,26,27,28,29}'),    -- James's Programming Logic
(10, '{25,26,29,50,51,25,26,29,50,51}'),         -- James's Data Structures
(11, '{1,3,39,41,42,43}'),                       -- Tom's Arithmetic
(12, '{10,15,20,22,38,44,45,47}'),               -- Tom's Science Basics

-- In-progress exams  
(13, '{1,2,5,6,8,9,11,41,42,43,44,45,46,47,48,49,50,51,25,26}'), -- Alex's Calculus
(14, '{10,11,12,13,14,38,44,45,47,48,49,50,51,25,26}'), -- David's Advanced Physics
(15, '{15,16,17,18,19,46,47,15,16,17,18,19}'),   -- Sarah's Organic Chemistry

-- Scheduled exams
(16, '{1,5,8,9,11,41,42,43,44,45}'),             -- Sophia's Statistics
(17, '{20,21,22,23,24,47,48,49,50,51,15,16,17,18}'), -- Emily's Molecular Biology  
(18, '{25,26,29,30,50,51,25,26,29,30,50,51,25,26,29}'), -- James's Algorithms
(19, '{1,2,5,8,9,11,41,42,43,44,45,46,47,48,49,50}'), -- Raj's Engineering Math
(20, '{25,50,51,25,50,51,25,50,51,25,50,51}');   -- Yuki's Networks

-- Insert daily questions for consistent engagement
INSERT INTO assessment.daily_questions (question_id, date, subject_id, difficulty, points, created_at) VALUES
-- Recent daily questions
(39, CURRENT_DATE, 1, 'EASY', 1, NOW()),
(38, CURRENT_DATE - INTERVAL '1 day', 2, 'EASY', 1, NOW() - INTERVAL '1 day'),
(20, CURRENT_DATE - INTERVAL '2 days', 4, 'EASY', 1, NOW() - INTERVAL '2 days'),
(33, CURRENT_DATE - INTERVAL '3 days', 5, 'EASY', 1, NOW() - INTERVAL '3 days'),
(15, CURRENT_DATE - INTERVAL '4 days', 3, 'EASY', 1, NOW() - INTERVAL '4 days'),
(41, CURRENT_DATE - INTERVAL '5 days', 1, 'MEDIUM', 2, NOW() - INTERVAL '5 days'),
(44, CURRENT_DATE - INTERVAL '6 days', 2, 'MEDIUM', 2, NOW() - INTERVAL '6 days'),

-- Weekly pattern for past month
(5, CURRENT_DATE - INTERVAL '1 week', 1, 'MEDIUM', 2, NOW() - INTERVAL '1 week'),
(47, CURRENT_DATE - INTERVAL '8 days', 3, 'MEDIUM', 2, NOW() - INTERVAL '8 days'),
(26, CURRENT_DATE - INTERVAL '9 days', 15, 'MEDIUM', 2, NOW() - INTERVAL '9 days'),
(11, CURRENT_DATE - INTERVAL '10 days', 2, 'EASY', 1, NOW() - INTERVAL '10 days'),
(22, CURRENT_DATE - INTERVAL '11 days', 4, 'EASY', 1, NOW() - INTERVAL '11 days'),
(1, CURRENT_DATE - INTERVAL '12 days', 1, 'EASY', 1, NOW() - INTERVAL '12 days'),
(16, CURRENT_DATE - INTERVAL '13 days', 3, 'EASY', 1, NOW() - INTERVAL '13 days'),

-- Older questions for history
(8, CURRENT_DATE - INTERVAL '2 weeks', 1, 'HARD', 3, NOW() - INTERVAL '2 weeks'),
(14, CURRENT_DATE - INTERVAL '15 days', 2, 'HARD', 3, NOW() - INTERVAL '15 days'),
(29, CURRENT_DATE - INTERVAL '16 days', 15, 'HARD', 3, NOW() - INTERVAL '16 days');

-- Print confirmation
SELECT 'Contests and exams created successfully' as status;
SELECT COUNT(*) as total_contests FROM assessment.contests;
SELECT status, COUNT(*) as count FROM assessment.contests GROUP BY status;
SELECT COUNT(*) as total_live_exams FROM assessment.live_exams;
SELECT status, COUNT(*) as count FROM assessment.live_exams GROUP BY status;
SELECT COUNT(*) as total_personalized_exams FROM assessment.personalized_exams;
SELECT status, COUNT(*) as count FROM assessment.personalized_exams GROUP BY status;
SELECT COUNT(*) as total_daily_questions FROM assessment.daily_questions;