-- =====================================================
-- ASSESSMENT SERVICE - User Submissions and Performance Data
-- =====================================================
-- Realistic user submission data showing various performance patterns

INSERT INTO assessment.user_submissions (user_id, question_id, answer, is_correct, time_taken, points_earned, submitted_at) VALUES

-- ========== HIGH PERFORMER - ALEX JOHNSON (USER_ID: 12) ==========
-- Mathematics submissions - excellent performance
(12, 1, '4', true, 30, 1, NOW() - INTERVAL '5 days'),
(12, 2, '40', true, 45, 2, NOW() - INTERVAL '5 days'),
(12, 3, '12', true, 20, 1, NOW() - INTERVAL '4 days'),
(12, 5, '0.5', true, 35, 2, NOW() - INTERVAL '4 days'),
(12, 6, '1', true, 60, 2, NOW() - INTERVAL '3 days'),
(12, 7, '39', true, 90, 2, NOW() - INTERVAL '3 days'),
(12, 8, '2x + 3', true, 180, 3, NOW() - INTERVAL '2 days'),
-- Physics submissions
(12, 10, '3 × 10⁸ m/s', true, 25, 1, NOW() - INTERVAL '2 days'),
(12, 11, 'Volume increases', true, 40, 1, NOW() - INTERVAL '1 day'),
(12, 14, '250', true, 120, 3, NOW() - INTERVAL '1 day'),
-- Computer Science submissions
(12, 26, 'Stack', true, 30, 2, NOW() - INTERVAL '1 day'),
(12, 29, 'O(log n)', true, 45, 3, NOW()),

-- ========== HIGH PERFORMER - SOPHIA MARTINEZ (USER_ID: 13) ==========
-- Mathematics focus - consistently good
(13, 1, '4', true, 35, 1, NOW() - INTERVAL '6 days'),
(13, 3, '12', true, 25, 1, NOW() - INTERVAL '5 days'),
(13, 4, 'Yes', true, 15, 1, NOW() - INTERVAL '5 days'),
(13, 5, '0.5', true, 40, 2, NOW() - INTERVAL '4 days'),
(13, 6, '1', true, 65, 2, NOW() - INTERVAL '3 days'),
(13, 7, '39', true, 85, 2, NOW() - INTERVAL '2 days'),
-- Some chemistry
(13, 15, '6', true, 20, 1, NOW() - INTERVAL '2 days'),
(13, 16, 'Ionic bond', true, 45, 1, NOW() - INTERVAL '1 day'),

-- ========== AVERAGE PERFORMER - SARAH LEARNER (USER_ID: 16) ==========
-- Mixed performance across subjects
(16, 1, '5', false, 90, 0, NOW() - INTERVAL '7 days'),
(16, 2, '40', true, 120, 2, NOW() - INTERVAL '6 days'),
(16, 3, '12', true, 30, 1, NOW() - INTERVAL '5 days'),
(16, 10, '3 × 10⁸ m/s', true, 35, 1, NOW() - INTERVAL '4 days'),
(16, 15, '6', true, 25, 1, NOW() - INTERVAL '3 days'),
(16, 20, 'Mitochondria', true, 20, 1, NOW() - INTERVAL '2 days'),
(16, 22, 'Oxygen', true, 15, 1, NOW() - INTERVAL '1 day'),
-- Some wrong answers
(16, 5, '0.707', false, 120, 0, NOW() - INTERVAL '1 day'),
(16, 11, 'Volume decreases', false, 80, 0, NOW()),

-- ========== STRUGGLING STUDENT - TOM BROWN (USER_ID: 21) ==========
-- Lower performance, needs help
(21, 1, '3', false, 180, 0, NOW() - INTERVAL '8 days'),
(21, 1, '4', true, 200, 1, NOW() - INTERVAL '7 days'), -- Retried and got it right
(21, 3, '10', false, 120, 0, NOW() - INTERVAL '6 days'),
(21, 4, 'No', false, 90, 0, NOW() - INTERVAL '5 days'),
(21, 10, '3 × 10⁶ m/s', false, 60, 0, NOW() - INTERVAL '4 days'),
(21, 15, '8', false, 45, 0, NOW() - INTERVAL '3 days'),
(21, 20, 'Nucleus', false, 40, 0, NOW() - INTERVAL '2 days'),
-- Some correct answers showing improvement
(21, 22, 'Oxygen', true, 35, 1, NOW() - INTERVAL '1 day'),
(21, 33, 'William Shakespeare', true, 30, 1, NOW()),

-- ========== PHYSICS ENTHUSIAST - DAVID CHEN (USER_ID: 14) ==========
-- Strong in physics, good in math
(14, 10, '3 × 10⁸ m/s', true, 20, 1, NOW() - INTERVAL '5 days'),
(14, 11, 'Volume increases', true, 25, 1, NOW() - INTERVAL '4 days'),
(14, 14, '250', true, 90, 3, NOW() - INTERVAL '3 days'),
-- Mathematics
(14, 1, '4', true, 40, 1, NOW() - INTERVAL '2 days'),
(14, 5, '0.5', true, 30, 2, NOW() - INTERVAL '1 day'),
-- Some advanced questions
(14, 8, '2x + 3', true, 150, 3, NOW()),

-- ========== BIOLOGY STUDENT - EMILY RODRIGUEZ (USER_ID: 15) ==========
-- Excellent in biology, decent in chemistry
(15, 20, 'Mitochondria', true, 15, 1, NOW() - INTERVAL '6 days'),
(15, 21, 'Deoxyribonucleic Acid', true, 25, 1, NOW() - INTERVAL '5 days'),
(15, 22, 'Oxygen', true, 10, 1, NOW() - INTERVAL '4 days'),
(15, 23, 'Charles Darwin', true, 30, 2, NOW() - INTERVAL '3 days'),
-- Chemistry
(15, 15, '6', true, 20, 1, NOW() - INTERVAL '2 days'),
(15, 16, 'Ionic bond', true, 35, 1, NOW() - INTERVAL '1 day'),
(15, 17, '7', true, 15, 1, NOW()),

-- ========== COMPUTER SCIENCE STUDENT - JAMES WILSON (USER_ID: 15) ==========
-- Note: Using different user_id (35) for James Wilson
(35, 25, 'A storage location for data', true, 120, 2, NOW() - INTERVAL '7 days'),
(35, 26, 'Stack', true, 30, 2, NOW() - INTERVAL '6 days'),
(35, 27, 'HyperText Markup Language', true, 20, 1, NOW() - INTERVAL '5 days'),
(35, 29, 'O(log n)', true, 45, 3, NOW() - INTERVAL '4 days'),
-- Some math for well-rounded performance
(35, 1, '4', true, 35, 1, NOW() - INTERVAL '3 days'),
(35, 3, '12', true, 25, 1, NOW() - INTERVAL '2 days'),

-- ========== DIVERSE PERFORMANCE PATTERNS ==========
-- International student Raj (USER_ID: 24) - strong in math
(24, 1, '4', true, 25, 1, NOW() - INTERVAL '4 days'),
(24, 2, '40', true, 40, 2, NOW() - INTERVAL '3 days'),
(24, 3, '12', true, 18, 1, NOW() - INTERVAL '2 days'),
(24, 5, '0.5', true, 28, 2, NOW() - INTERVAL '1 day'),
(24, 7, '39', true, 75, 2, NOW()),

-- Exchange student Yuki (USER_ID: 25) - tech focused
(25, 26, 'Stack', true, 40, 2, NOW() - INTERVAL '3 days'),
(25, 27, 'HyperText Markup Language', true, 25, 1, NOW() - INTERVAL '2 days'),
(25, 10, '3 × 10⁸ m/s', true, 30, 1, NOW() - INTERVAL '1 day'),

-- Class 10 students with appropriate level questions
(27, 1, '4', true, 60, 1, NOW() - INTERVAL '2 days'),
(27, 2, '40', true, 90, 2, NOW() - INTERVAL '1 day'),
(27, 20, 'Mitochondria', true, 25, 1, NOW()),

(28, 33, 'William Shakespeare', true, 35, 1, NOW() - INTERVAL '1 day'),
(28, 36, 'Paris', true, 20, 1, NOW()),

-- Class 11 students
(29, 25, 'A storage location for data', true, 150, 2, NOW() - INTERVAL '2 days'),
(29, 26, 'Stack', true, 45, 2, NOW() - INTERVAL '1 day'),

(30, 1, '4', true, 45, 1, NOW() - INTERVAL '1 day'),
(30, 15, '6', true, 30, 1, NOW()),

-- Class 12 students with advanced questions
(31, 29, 'O(log n)', true, 60, 3, NOW() - INTERVAL '1 day'),
(31, 8, '2x + 3', true, 200, 3, NOW()),

-- Recent activity for various users
(12, 39, '36', true, 40, 1, NOW() - INTERVAL '2 hours'),
(13, 38, 'Jupiter', true, 25, 1, NOW() - INTERVAL '1 hour'),
(16, 36, 'Paris', true, 30, 1, NOW() - INTERVAL '30 minutes'),
(21, 20, 'Mitochondria', true, 45, 1, NOW() - INTERVAL '15 minutes');

-- Insert user streaks based on recent performance
INSERT INTO assessment.user_streaks (user_id, subject_id, current_streak, longest_streak, last_activity, is_active, created_at, updated_at) VALUES
-- Alex Johnson - high performer with good streaks
(12, 1, 7, 12, CURRENT_DATE, true, NOW(), NOW()), -- Mathematics
(12, 2, 4, 8, CURRENT_DATE, true, NOW(), NOW()),  -- Physics
(12, 15, 3, 5, CURRENT_DATE, true, NOW(), NOW()), -- Computer Science

-- Sophia Martinez - math focused
(13, 1, 8, 15, CURRENT_DATE, true, NOW(), NOW()), -- Mathematics
(13, 3, 2, 4, CURRENT_DATE - INTERVAL '1 day', true, NOW(), NOW()), -- Chemistry

-- David Chen - physics enthusiast
(14, 2, 6, 10, CURRENT_DATE, true, NOW(), NOW()), -- Physics
(14, 1, 3, 6, CURRENT_DATE, true, NOW(), NOW()),  -- Mathematics

-- Emily Rodriguez - biology student
(15, 4, 9, 14, CURRENT_DATE, true, NOW(), NOW()), -- Biology
(15, 3, 4, 7, CURRENT_DATE, true, NOW(), NOW()),  -- Chemistry

-- James Wilson - CS student
(35, 15, 5, 8, CURRENT_DATE, true, NOW(), NOW()), -- Computer Science
(35, 1, 2, 3, CURRENT_DATE, true, NOW(), NOW()),  -- Mathematics

-- Struggling students with lower streaks
(21, 1, 1, 2, CURRENT_DATE, true, NOW(), NOW()),  -- Tom Brown - Mathematics
(21, 4, 2, 3, CURRENT_DATE, true, NOW(), NOW()),  -- Biology

-- International students
(24, 1, 5, 9, CURRENT_DATE, true, NOW(), NOW()),  -- Raj - Mathematics
(25, 15, 3, 4, CURRENT_DATE, true, NOW(), NOW()), -- Yuki - Computer Science

-- Class level students
(27, 1, 2, 3, CURRENT_DATE, true, NOW(), NOW()),  -- Class 10 - Math
(29, 15, 1, 2, CURRENT_DATE, true, NOW(), NOW()), -- Class 11 - CS
(31, 25, 4, 6, CURRENT_DATE, true, NOW(), NOW()); -- Class 12 - Advanced CS

-- Print confirmation
SELECT 'User submissions and streaks created successfully' as status;
SELECT COUNT(*) as total_submissions FROM assessment.user_submissions;
SELECT COUNT(*) as total_streaks FROM assessment.user_streaks;
SELECT 
    is_correct, 
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
FROM assessment.user_submissions 
GROUP BY is_correct;