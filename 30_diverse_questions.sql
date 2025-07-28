-- =====================================================
-- 30 DIVERSE QUESTIONS FOR ASSESSMENT SERVICE
-- =====================================================
-- Adding diverse questions across different subjects, types, and difficulty levels

-- ========== MATHEMATICS QUESTIONS ==========

-- Question 1: MCQ - Easy
INSERT INTO assessment.questions (text, type, subject_id, topic_id, difficulty, correct_answer_text, explanation, points, is_active, created_by, created_at, updated_at) VALUES
('What is the value of √16?', 'MCQ', 1, 1, 'EASY', '4', 'The square root of 16 is 4 because 4 × 4 = 16', 1, true, 1, NOW(), NOW());

INSERT INTO assessment.question_options (question_id, text, option_order) VALUES
(LAST_INSERT_ID(), '2', 1),
(LAST_INSERT_ID(), '4', 2),
(LAST_INSERT_ID(), '8', 3),
(LAST_INSERT_ID(), '16', 4);

-- Question 2: MCQ - Medium
INSERT INTO assessment.questions (text, type, subject_id, topic_id, difficulty, correct_answer_text, explanation, points, is_active, created_by, created_at, updated_at) VALUES
('If x² - 5x + 6 = 0, what are the values of x?', 'MCQ', 1, 4, 'MEDIUM', 'x = 2, 3', 'Factoring: (x-2)(x-3) = 0, so x = 2 or x = 3', 2, true, 1, NOW(), NOW());

INSERT INTO assessment.question_options (question_id, text, option_order) VALUES
(LAST_INSERT_ID(), 'x = 1, 6', 1),
(LAST_INSERT_ID(), 'x = 2, 3', 2),
(LAST_INSERT_ID(), 'x = -2, -3', 3),
(LAST_INSERT_ID(), 'x = 0, 5', 4);

-- Question 3: NUMERIC - Easy
INSERT INTO assessment.questions (text, type, subject_id, topic_id, difficulty, correct_answer_text, explanation, points, is_active, created_by, created_at, updated_at) VALUES
('Calculate: 15 + 27 - 8', 'NUMERIC', 1, 1, 'EASY', '34', 'Following order of operations: 15 + 27 = 42, then 42 - 8 = 34', 1, true, 1, NOW(), NOW());

-- Question 4: TRUE_FALSE - Easy  
INSERT INTO assessment.questions (text, type, subject_id, topic_id, difficulty, correct_answer_text, explanation, points, is_active, created_by, created_at, updated_at) VALUES
('The sum of angles in a triangle is always 180°.', 'TRUE_FALSE', 1, 6, 'EASY', 'True', 'This is a fundamental property of triangles in Euclidean geometry', 1, true, 1, NOW(), NOW());

-- Question 5: MCQ - Hard
INSERT INTO assessment.questions (text, type, subject_id, topic_id, difficulty, correct_answer_text, explanation, points, is_active, created_by, created_at, updated_at) VALUES
('In the arithmetic progression 5, 8, 11, 14, ..., what is the 20th term?', 'MCQ', 1, 5, 'HARD', '62', 'Using formula: an = a1 + (n-1)d, where a1=5, d=3, n=20. So a20 = 5 + 19×3 = 62', 3, true, 1, NOW(), NOW());

INSERT INTO assessment.question_options (question_id, text, option_order) VALUES
(LAST_INSERT_ID(), '59', 1),
(LAST_INSERT_ID(), '62', 2),
(LAST_INSERT_ID(), '65', 3),
(LAST_INSERT_ID(), '68', 4);

-- ========== PHYSICS QUESTIONS ==========

-- Question 6: MCQ - Easy
INSERT INTO assessment.questions (text, type, subject_id, topic_id, difficulty, correct_answer_text, explanation, points, is_active, created_by, created_at, updated_at) VALUES
('What is the SI unit of electric current?', 'MCQ', 2, 3, 'EASY', 'Ampere', 'The ampere (A) is the SI base unit for electric current', 1, true, 1, NOW(), NOW());

INSERT INTO assessment.question_options (question_id, text, option_order) VALUES
(LAST_INSERT_ID(), 'Volt', 1),
(LAST_INSERT_ID(), 'Ampere', 2),
(LAST_INSERT_ID(), 'Watt', 3),
(LAST_INSERT_ID(), 'Ohm', 4);

-- Question 7: MCQ - Medium
INSERT INTO assessment.questions (text, type, subject_id, topic_id, difficulty, correct_answer_text, explanation, points, is_active, created_by, created_at, updated_at) VALUES
('According to Ohm''s law, if voltage increases and resistance remains constant, what happens to current?', 'MCQ', 2, 3, 'MEDIUM', 'Current increases', 'Ohm''s law: V = IR, so I = V/R. If V increases and R is constant, I increases proportionally', 2, true, 1, NOW(), NOW());

INSERT INTO assessment.question_options (question_id, text, option_order) VALUES
(LAST_INSERT_ID(), 'Current decreases', 1),
(LAST_INSERT_ID(), 'Current increases', 2),
(LAST_INSERT_ID(), 'Current remains same', 3),
(LAST_INSERT_ID(), 'Current becomes zero', 4);

-- Question 8: TRUE_FALSE - Medium
INSERT INTO assessment.questions (text, type, subject_id, topic_id, difficulty, correct_answer_text, explanation, points, is_active, created_by, created_at, updated_at) VALUES
('Light travels faster in water than in air.', 'TRUE_FALSE', 2, 1, 'MEDIUM', 'False', 'Light travels slower in denser media. Speed in water is about 225,000 km/s vs 300,000 km/s in air', 2, true, 1, NOW(), NOW());

-- Question 9: NUMERIC - Medium
INSERT INTO assessment.questions (text, type, subject_id, topic_id, difficulty, correct_answer_text, explanation, points, is_active, created_by, created_at, updated_at) VALUES
('A resistor of 10Ω has 2A current flowing through it. Calculate the voltage across it (in volts).', 'NUMERIC', 2, 3, 'MEDIUM', '20', 'Using Ohm''s law: V = IR = 2A × 10Ω = 20V', 2, true, 1, NOW(), NOW());

-- Question 10: MCQ - Hard
INSERT INTO assessment.questions (text, type, subject_id, topic_id, difficulty, correct_answer_text, explanation, points, is_active, created_by, created_at, updated_at) VALUES
('What is the critical angle for total internal reflection when light travels from glass (n=1.5) to air (n=1)?', 'MCQ', 2, 1, 'HARD', '41.8°', 'Critical angle θc = sin⁻¹(n₂/n₁) = sin⁻¹(1/1.5) = sin⁻¹(0.667) ≈ 41.8°', 3, true, 1, NOW(), NOW());

INSERT INTO assessment.question_options (question_id, text, option_order) VALUES
(LAST_INSERT_ID(), '30.0°', 1),
(LAST_INSERT_ID(), '41.8°', 2),
(LAST_INSERT_ID(), '48.6°', 3),
(LAST_INSERT_ID(), '60.0°', 4);

-- ========== CHEMISTRY QUESTIONS ==========

-- Question 11: MCQ - Easy
INSERT INTO assessment.questions (text, type, subject_id, topic_id, difficulty, correct_answer_text, explanation, points, is_active, created_by, created_at, updated_at) VALUES
('What is the chemical symbol for Gold?', 'MCQ', 3, 4, 'EASY', 'Au', 'Gold''s chemical symbol is Au, derived from the Latin word "aurum"', 1, true, 1, NOW(), NOW());

INSERT INTO assessment.question_options (question_id, text, option_order) VALUES
(LAST_INSERT_ID(), 'Go', 1),
(LAST_INSERT_ID(), 'Au', 2),
(LAST_INSERT_ID(), 'Gd', 3),
(LAST_INSERT_ID(), 'Ag', 4);

-- Question 12: TRUE_FALSE - Easy
INSERT INTO assessment.questions (text, type, subject_id, topic_id, difficulty, correct_answer_text, explanation, points, is_active, created_by, created_at, updated_at) VALUES
('Water has a pH of 7 at room temperature.', 'TRUE_FALSE', 3, 1, 'EASY', 'True', 'Pure water at 25°C has a pH of exactly 7, making it neutral', 1, true, 1, NOW(), NOW());

-- Question 13: MCQ - Medium
INSERT INTO assessment.questions (text, type, subject_id, topic_id, difficulty, correct_answer_text, explanation, points, is_active, created_by, created_at, updated_at) VALUES
('Which gas is produced when zinc reacts with hydrochloric acid?', 'MCQ', 3, 2, 'MEDIUM', 'Hydrogen', 'Zn + 2HCl → ZnCl₂ + H₂. This is a typical metal-acid reaction producing hydrogen gas', 2, true, 1, NOW(), NOW());

INSERT INTO assessment.question_options (question_id, text, option_order) VALUES
(LAST_INSERT_ID(), 'Oxygen', 1),
(LAST_INSERT_ID(), 'Hydrogen', 2),
(LAST_INSERT_ID(), 'Carbon dioxide', 3),
(LAST_INSERT_ID(), 'Chlorine', 4);

-- Question 14: NUMERIC - Medium
INSERT INTO assessment.questions (text, type, subject_id, topic_id, difficulty, correct_answer_text, explanation, points, is_active, created_by, created_at, updated_at) VALUES
('How many moles are present in 44g of CO₂? (Atomic mass: C=12, O=16)', 'NUMERIC', 3, 3, 'MEDIUM', '1', 'Molar mass of CO₂ = 12 + 2×16 = 44 g/mol. Moles = 44g ÷ 44g/mol = 1 mol', 2, true, 1, NOW(), NOW());

-- Question 15: MCQ - Hard
INSERT INTO assessment.questions (text, type, subject_id, topic_id, difficulty, correct_answer_text, explanation, points, is_active, created_by, created_at, updated_at) VALUES
('In the periodic table, which element has the electron configuration [Ne] 3s² 3p⁵?', 'MCQ', 3, 4, 'HARD', 'Chlorine', '[Ne] 3s² 3p⁵ corresponds to 17 electrons (10 from Ne + 7), which is Chlorine (Cl)', 3, true, 1, NOW(), NOW());

INSERT INTO assessment.question_options (question_id, text, option_order) VALUES
(LAST_INSERT_ID(), 'Fluorine', 1),
(LAST_INSERT_ID(), 'Chlorine', 2),
(LAST_INSERT_ID(), 'Bromine', 3),
(LAST_INSERT_ID(), 'Sulfur', 4);

-- ========== BIOLOGY QUESTIONS ==========

-- Question 16: MCQ - Easy
INSERT INTO assessment.questions (text, type, subject_id, topic_id, difficulty, correct_answer_text, explanation, points, is_active, created_by, created_at, updated_at) VALUES
('Which organ is responsible for pumping blood in the human body?', 'MCQ', 4, 3, 'EASY', 'Heart', 'The heart is a muscular organ that pumps blood throughout the circulatory system', 1, true, 1, NOW(), NOW());

INSERT INTO assessment.question_options (question_id, text, option_order) VALUES
(LAST_INSERT_ID(), 'Liver', 1),
(LAST_INSERT_ID(), 'Heart', 2),
(LAST_INSERT_ID(), 'Kidney', 3),
(LAST_INSERT_ID(), 'Brain', 4);

-- Question 17: TRUE_FALSE - Easy
INSERT INTO assessment.questions (text, type, subject_id, topic_id, difficulty, correct_answer_text, explanation, points, is_active, created_by, created_at, updated_at) VALUES
('Photosynthesis occurs in the chloroplasts of plant cells.', 'TRUE_FALSE', 4, 1, 'EASY', 'True', 'Chloroplasts contain chlorophyll and are the sites where photosynthesis takes place in plants', 1, true, 1, NOW(), NOW());

-- Question 18: MCQ - Medium
INSERT INTO assessment.questions (text, type, subject_id, topic_id, difficulty, correct_answer_text, explanation, points, is_active, created_by, created_at, updated_at) VALUES
('What is the end product of glycolysis?', 'MCQ', 4, 2, 'MEDIUM', 'Pyruvate', 'Glycolysis breaks down glucose into two pyruvate molecules, producing ATP and NADH', 2, true, 1, NOW(), NOW());

INSERT INTO assessment.question_options (question_id, text, option_order) VALUES
(LAST_INSERT_ID(), 'Glucose', 1),
(LAST_INSERT_ID(), 'Pyruvate', 2),
(LAST_INSERT_ID(), 'Lactate', 3),
(LAST_INSERT_ID(), 'Acetyl-CoA', 4);

-- Question 19: FILL_BLANK - Medium
INSERT INTO assessment.questions (text, type, subject_id, topic_id, difficulty, correct_answer_text, explanation, points, is_active, created_by, created_at, updated_at) VALUES
('The process by which cells divide to form gametes is called _______.', 'FILL_BLANK', 4, 6, 'MEDIUM', 'meiosis', 'Meiosis is the type of cell division that produces gametes (sex cells) with half the chromosome number', 2, true, 1, NOW(), NOW());

-- Question 20: MCQ - Hard
INSERT INTO assessment.questions (text, type, subject_id, topic_id, difficulty, correct_answer_text, explanation, points, is_active, created_by, created_at, updated_at) VALUES
('Which enzyme is responsible for unwinding DNA during replication?', 'MCQ', 4, 7, 'HARD', 'Helicase', 'DNA helicase unwinds the double helix by breaking hydrogen bonds between base pairs', 3, true, 1, NOW(), NOW());

INSERT INTO assessment.question_options (question_id, text, option_order) VALUES
(LAST_INSERT_ID(), 'DNA polymerase', 1),
(LAST_INSERT_ID(), 'Helicase', 2),
(LAST_INSERT_ID(), 'Ligase', 3),
(LAST_INSERT_ID(), 'Primase', 4);

-- ========== COMPUTER SCIENCE QUESTIONS ==========

-- Question 21: MCQ - Easy
INSERT INTO assessment.questions (text, type, subject_id, topic_id, difficulty, correct_answer_text, explanation, points, is_active, created_by, created_at, updated_at) VALUES
('Which of the following is a programming language?', 'MCQ', 15, 1, 'EASY', 'Python', 'Python is a high-level, interpreted programming language known for its simplicity', 1, true, 1, NOW(), NOW());

INSERT INTO assessment.question_options (question_id, text, option_order) VALUES
(LAST_INSERT_ID(), 'HTML', 1),
(LAST_INSERT_ID(), 'Python', 2),
(LAST_INSERT_ID(), 'CSS', 3),
(LAST_INSERT_ID(), 'PDF', 4);

-- Question 22: TRUE_FALSE - Easy
INSERT INTO assessment.questions (text, type, subject_id, topic_id, difficulty, correct_answer_text, explanation, points, is_active, created_by, created_at, updated_at) VALUES
('A variable in programming can store different types of data.', 'TRUE_FALSE', 15, 1, 'EASY', 'True', 'Variables are containers that can hold different types of data like numbers, strings, booleans, etc.', 1, true, 1, NOW(), NOW());

-- Question 23: MCQ - Medium
INSERT INTO assessment.questions (text, type, subject_id, topic_id, difficulty, correct_answer_text, explanation, points, is_active, created_by, created_at, updated_at) VALUES
('What is the time complexity of binary search?', 'MCQ', 25, 2, 'MEDIUM', 'O(log n)', 'Binary search divides the search space in half at each step, resulting in logarithmic time complexity', 2, true, 1, NOW(), NOW());

INSERT INTO assessment.question_options (question_id, text, option_order) VALUES
(LAST_INSERT_ID(), 'O(n)', 1),
(LAST_INSERT_ID(), 'O(log n)', 2),
(LAST_INSERT_ID(), 'O(n²)', 3),
(LAST_INSERT_ID(), 'O(1)', 4);

-- Question 24: FILL_BLANK - Medium
INSERT INTO assessment.questions (text, type, subject_id, topic_id, difficulty, correct_answer_text, explanation, points, is_active, created_by, created_at, updated_at) VALUES
('A _______ is a data structure that follows Last-In-First-Out (LIFO) principle.', 'FILL_BLANK', 25, 1, 'MEDIUM', 'stack', 'A stack is a linear data structure where elements are added and removed from the same end (top)', 2, true, 1, NOW(), NOW());

-- Question 25: MCQ - Hard
INSERT INTO assessment.questions (text, type, subject_id, topic_id, difficulty, correct_answer_text, explanation, points, is_active, created_by, created_at, updated_at) VALUES
('In database normalization, what does the Third Normal Form (3NF) eliminate?', 'MCQ', 25, 3, 'HARD', 'Transitive dependencies', '3NF eliminates transitive dependencies where non-key attributes depend on other non-key attributes', 3, true, 1, NOW(), NOW());

INSERT INTO assessment.question_options (question_id, text, option_order) VALUES
(LAST_INSERT_ID(), 'Partial dependencies', 1),
(LAST_INSERT_ID(), 'Transitive dependencies', 2),
(LAST_INSERT_ID(), 'Functional dependencies', 3),
(LAST_INSERT_ID(), 'Multi-valued dependencies', 4);

-- ========== ENGLISH QUESTIONS ==========

-- Question 26: MCQ - Easy
INSERT INTO assessment.questions (text, type, subject_id, topic_id, difficulty, correct_answer_text, explanation, points, is_active, created_by, created_at, updated_at) VALUES
('Which of the following is a noun?', 'MCQ', 5, NULL, 'EASY', 'Happiness', 'Happiness is a noun representing an abstract concept or state of being', 1, true, 1, NOW(), NOW());

INSERT INTO assessment.question_options (question_id, text, option_order) VALUES
(LAST_INSERT_ID(), 'Beautiful', 1),
(LAST_INSERT_ID(), 'Happiness', 2),
(LAST_INSERT_ID(), 'Quickly', 3),
(LAST_INSERT_ID(), 'Running', 4);

-- Question 27: FILL_BLANK - Easy
INSERT INTO assessment.questions (text, type, subject_id, topic_id, difficulty, correct_answer_text, explanation, points, is_active, created_by, created_at, updated_at) VALUES
('The past tense of "go" is _______.', 'FILL_BLANK', 5, NULL, 'EASY', 'went', 'Went is the irregular past tense form of the verb "go"', 1, true, 1, NOW(), NOW());

-- Question 28: MCQ - Medium
INSERT INTO assessment.questions (text, type, subject_id, topic_id, difficulty, correct_answer_text, explanation, points, is_active, created_by, created_at, updated_at) VALUES
('In the sentence "The cat sat on the mat," what is the function of "on the mat"?', 'MCQ', 5, NULL, 'MEDIUM', 'Prepositional phrase', '"On the mat" is a prepositional phrase that functions as an adverbial phrase of place', 2, true, 1, NOW(), NOW());

INSERT INTO assessment.question_options (question_id, text, option_order) VALUES
(LAST_INSERT_ID(), 'Subject', 1),
(LAST_INSERT_ID(), 'Prepositional phrase', 2),
(LAST_INSERT_ID(), 'Direct object', 3),
(LAST_INSERT_ID(), 'Predicate', 4);

-- ========== MIXED DIFFICULTY QUESTIONS ==========

-- Question 29: ESSAY - Hard
INSERT INTO assessment.questions (text, type, subject_id, topic_id, difficulty, correct_answer_text, explanation, points, is_active, created_by, created_at, updated_at) VALUES
('Explain the importance of renewable energy sources and discuss three advantages they have over fossil fuels. (Write at least 100 words)', 'ESSAY', 2, 5, 'HARD', 'Sample answer should include: environmental benefits, sustainability, reduced pollution, economic advantages, energy independence, etc.', 'This question tests understanding of environmental science and critical thinking skills', 5, true, 1, NOW(), NOW());

-- Question 30: MCQ - Expert Level
INSERT INTO assessment.questions (text, type, subject_id, topic_id, difficulty, correct_answer_text, explanation, points, is_active, created_by, created_at, updated_at) VALUES
('In quantum mechanics, what is the significance of the Schrödinger equation?', 'MCQ', 22, NULL, 'EXPERT', 'It describes the wave function evolution', 'The Schrödinger equation is fundamental to quantum mechanics, describing how quantum states evolve over time', 4, true, 1, NOW(), NOW());

INSERT INTO assessment.question_options (question_id, text, option_order) VALUES
(LAST_INSERT_ID(), 'It calculates particle velocity', 1),
(LAST_INSERT_ID(), 'It describes the wave function evolution', 2),
(LAST_INSERT_ID(), 'It measures electromagnetic radiation', 3),
(LAST_INSERT_ID(), 'It determines atomic mass', 4);

-- Update correct_answer_option_id for MCQ questions
UPDATE assessment.questions q 
JOIN assessment.question_options qo ON q.id = qo.question_id 
SET q.correct_answer_option_id = qo.id 
WHERE q.type = 'MCQ' AND qo.text = q.correct_answer_text;

-- Print confirmation
SELECT 'Successfully added 30 diverse questions!' as status;
SELECT 
    COUNT(*) as total_questions,
    SUM(CASE WHEN type = 'MCQ' THEN 1 ELSE 0 END) as mcq_questions,
    SUM(CASE WHEN type = 'TRUE_FALSE' THEN 1 ELSE 0 END) as true_false_questions,
    SUM(CASE WHEN type = 'NUMERIC' THEN 1 ELSE 0 END) as numeric_questions,
    SUM(CASE WHEN type = 'FILL_BLANK' THEN 1 ELSE 0 END) as fill_blank_questions,
    SUM(CASE WHEN type = 'ESSAY' THEN 1 ELSE 0 END) as essay_questions
FROM assessment.questions 
WHERE id > (SELECT MAX(id) - 30 FROM assessment.questions);

SELECT 
    difficulty,
    COUNT(*) as count
FROM assessment.questions 
WHERE id > (SELECT MAX(id) - 30 FROM assessment.questions)
GROUP BY difficulty;