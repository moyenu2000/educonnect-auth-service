-- =====================================================
-- ASSESSMENT SERVICE - Question Options for MCQ Questions
-- =====================================================
-- Multiple choice options for all MCQ type questions

INSERT INTO assessment.question_options (question_id, option_text, is_correct) VALUES

-- Question 1: What is the value of x in the equation 2x + 5 = 13?
(1, '3', false),
(1, '4', true),
(1, '5', false),
(1, '6', false),

-- Question 4: Is 17 a prime number?
(4, 'Yes', true),
(4, 'No', false),

-- Question 5: What is the value of sin(30°)?
(5, '0.5', true),
(5, '0.707', false),
(5, '0.866', false),
(5, '1', false),

-- Question 10: What is the speed of light in vacuum?
(10, '3 × 10⁸ m/s', true),
(10, '3 × 10⁶ m/s', false),
(10, '3 × 10⁷ m/s', false),
(10, '3 × 10⁹ m/s', false),

-- Question 11: What happens to the volume of a gas when temperature increases at constant pressure?
(11, 'Volume increases', true),
(11, 'Volume decreases', false),
(11, 'Volume remains constant', false),
(11, 'Volume becomes zero', false),

-- Question 15: How many protons does carbon have?
-- This is NUMERIC type, no options needed

-- Question 16: What type of bond forms between sodium and chlorine?
(16, 'Ionic bond', true),
(16, 'Covalent bond', false),
(16, 'Metallic bond', false),
(16, 'Hydrogen bond', false),

-- Question 20: What is the powerhouse of the cell?
(20, 'Nucleus', false),
(20, 'Mitochondria', true),
(20, 'Ribosome', false),
(20, 'Chloroplast', false),

-- Question 22: Which gas is released during photosynthesis?
(22, 'Oxygen', true),
(22, 'Carbon dioxide', false),
(22, 'Nitrogen', false),
(22, 'Hydrogen', false),

-- Question 23: Who proposed the theory of evolution by natural selection?
(23, 'Charles Darwin', true),
(23, 'Gregor Mendel', false),
(23, 'Alfred Wallace', false),
(23, 'Jean Lamarck', false),

-- Question 26: Which data structure follows LIFO principle?
(26, 'Queue', false),
(26, 'Stack', true),
(26, 'Array', false),
(26, 'Linked List', false),

-- Question 29: What is the time complexity of binary search?
(29, 'O(1)', false),
(29, 'O(log n)', true),
(29, 'O(n)', false),
(29, 'O(n²)', false),

-- Question 33: Who wrote "Romeo and Juliet"?
(33, 'William Shakespeare', true),
(33, 'Charles Dickens', false),
(33, 'Jane Austen', false),
(33, 'Mark Twain', false),

-- Question 36: What is the capital of France?
(36, 'London', false),
(36, 'Berlin', false),
(36, 'Paris', true),
(36, 'Madrid', false),

-- Question 38: What is the largest planet in our solar system?
(38, 'Earth', false),
(38, 'Jupiter', true),
(38, 'Saturn', false),
(38, 'Neptune', false),

-- Additional MCQ questions with options
-- Mathematics questions
-- Basic arithmetic
INSERT INTO assessment.questions (text, type, subject_id, topic_id, difficulty, correct_answer, explanation, points, is_active, created_by, created_at, updated_at) VALUES
('What is 25% of 80?', 'MCQ', 1, 11, 'EASY', '20', '25% of 80 = (25/100) × 80 = 20', 1, true, 4, NOW(), NOW()),
('Which of the following is an irrational number?', 'MCQ', 1, 1, 'MEDIUM', '√2', '√2 cannot be expressed as a fraction of integers', 2, true, 4, NOW(), NOW()),
('What is the slope of the line y = 3x + 5?', 'MCQ', 1, 7, 'EASY', '3', 'In y = mx + b form, m is the slope', 1, true, 4, NOW(), NOW());

-- Get the IDs of the newly inserted questions
-- For question "What is 25% of 80?" (should be around ID 41)
INSERT INTO assessment.question_options (question_id, option_text, is_correct) VALUES
(41, '15', false),
(41, '20', true),
(41, '25', false),
(41, '30', false);

-- For question "Which of the following is an irrational number?" (should be around ID 42)
INSERT INTO assessment.question_options (question_id, option_text, is_correct) VALUES
(42, '1/3', false),
(42, '0.5', false),
(42, '√2', true),
(42, '2.5', false);

-- For question "What is the slope of the line y = 3x + 5?" (should be around ID 43)
INSERT INTO assessment.question_options (question_id, option_text, is_correct) VALUES
(43, '3', true),
(43, '5', false),
(43, '-3', false),
(43, '0', false);

-- Physics questions with options
INSERT INTO assessment.questions (text, type, subject_id, topic_id, difficulty, correct_answer, explanation, points, is_active, created_by, created_at, updated_at) VALUES
('What is the SI unit of force?', 'MCQ', 2, 5, 'EASY', 'Newton', 'Force is measured in Newtons (N), named after Isaac Newton', 1, true, 5, NOW(), NOW()),
('Which color has the shortest wavelength in visible light?', 'MCQ', 2, 1, 'MEDIUM', 'Violet', 'Violet light has the shortest wavelength (about 380-450 nm)', 2, true, 5, NOW(), NOW());

-- For "What is the SI unit of force?" (should be around ID 44)
INSERT INTO assessment.question_options (question_id, option_text, is_correct) VALUES
(44, 'Newton', true),
(44, 'Joule', false),
(44, 'Watt', false),
(44, 'Pascal', false);

-- For "Which color has the shortest wavelength in visible light?" (should be around ID 45)
INSERT INTO assessment.question_options (question_id, option_text, is_correct) VALUES
(45, 'Red', false),
(45, 'Blue', false),
(45, 'Violet', true),
(45, 'Green', false);

-- Chemistry questions with options
INSERT INTO assessment.questions (text, type, subject_id, topic_id, difficulty, correct_answer, explanation, points, is_active, created_by, created_at, updated_at) VALUES
('What is the chemical symbol for gold?', 'MCQ', 3, 4, 'EASY', 'Au', 'Gold chemical symbol is Au, from the Latin word aurum', 1, true, 6, NOW(), NOW()),
('Which of the following is a noble gas?', 'MCQ', 3, 4, 'MEDIUM', 'Helium', 'Helium is a noble gas in Group 18 of the periodic table', 2, true, 6, NOW(), NOW());

-- For "What is the chemical symbol for gold?" (should be around ID 46)
INSERT INTO assessment.question_options (question_id, option_text, is_correct) VALUES
(46, 'Go', false),
(46, 'Au', true),
(46, 'Ag', false),
(46, 'Gd', false);

-- For "Which of the following is a noble gas?" (should be around ID 47)
INSERT INTO assessment.question_options (question_id, option_text, is_correct) VALUES
(47, 'Oxygen', false),
(47, 'Nitrogen', false),
(47, 'Helium', true),
(47, 'Hydrogen', false);

-- Biology questions with options
INSERT INTO assessment.questions (text, type, subject_id, topic_id, difficulty, correct_answer, explanation, points, is_active, created_by, created_at, updated_at) VALUES
('How many chambers does a human heart have?', 'MCQ', 4, 3, 'EASY', '4', 'Human heart has 4 chambers: 2 atria and 2 ventricles', 1, true, 7, NOW(), NOW()),
('What is the largest organ in the human body?', 'MCQ', 4, 1, 'EASY', 'Skin', 'Skin is the largest organ, covering the entire body surface', 1, true, 7, NOW(), NOW());

-- For "How many chambers does a human heart have?" (should be around ID 48)
INSERT INTO assessment.question_options (question_id, option_text, is_correct) VALUES
(48, '2', false),
(48, '3', false),
(48, '4', true),
(48, '5', false);

-- For "What is the largest organ in the human body?" (should be around ID 49)
INSERT INTO assessment.question_options (question_id, option_text, is_correct) VALUES
(49, 'Liver', false),
(49, 'Brain', false),
(49, 'Lungs', false),
(49, 'Skin', true);

-- Computer Science questions with options
INSERT INTO assessment.questions (text, type, subject_id, topic_id, difficulty, correct_answer, explanation, points, is_active, created_by, created_at, updated_at) VALUES
('Which programming language is known for its use in web development?', 'MCQ', 15, 1, 'EASY', 'JavaScript', 'JavaScript is primarily used for web development and client-side scripting', 1, true, 8, NOW(), NOW()),
('What does CPU stand for?', 'MCQ', 15, 8, 'EASY', 'Central Processing Unit', 'CPU is the main processing component of a computer', 1, true, 8, NOW(), NOW());

-- For "Which programming language is known for its use in web development?" (should be around ID 50)
INSERT INTO assessment.question_options (question_id, option_text, is_correct) VALUES
(50, 'Python', false),
(50, 'JavaScript', true),
(50, 'C++', false),
(50, 'Java', false);

-- For "What does CPU stand for?" (should be around ID 51)
INSERT INTO assessment.question_options (question_id, option_text, is_correct) VALUES
(51, 'Computer Processing Unit', false),
(51, 'Central Processing Unit', true),
(51, 'Central Program Unit', false),
(51, 'Computer Program Unit', false);

-- Print confirmation
SELECT 'Question options created successfully' as status;
SELECT COUNT(*) as total_options FROM assessment.question_options;
SELECT 
    q.type, 
    COUNT(DISTINCT q.id) as questions_with_options,
    COUNT(qo.id) as total_options
FROM assessment.questions q 
LEFT JOIN assessment.question_options qo ON q.id = qo.question_id 
WHERE q.type = 'MCQ' 
GROUP BY q.type;