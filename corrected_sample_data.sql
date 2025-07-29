-- =====================================================
-- CORRECTED SAMPLE DATA FOR EDUCONNECT
-- =====================================================
-- Questions and options using correct column names

-- ========== QUESTIONS ==========
INSERT INTO assessment.questions (text, type, subject_id, topic_id, difficulty, correct_answer_text, explanation, points, is_active, created_by, created_at, updated_at) VALUES

-- ========== MATHEMATICS QUESTIONS ==========

-- Algebra - Easy
('Solve for x: 3x + 7 = 22', 'MCQ', 1, 1, 'EASY', 'x = 5', 'Subtract 7 from both sides: 3x = 15, then divide by 3: x = 5', 2, true, 1, NOW(), NOW()),
('What is the value of x² when x = 4?', 'NUMERIC', 1, 1, 'EASY', '16', '4² = 4 × 4 = 16', 1, true, 1, NOW(), NOW()),
('Factor the expression: x² - 9', 'FILL_BLANK', 1, 1, 'MEDIUM', '(x + 3)(x - 3)', 'This is a difference of squares: a² - b² = (a + b)(a - b)', 3, true, 1, NOW(), NOW()),

-- Geometry - Easy to Medium
('What is the area of a circle with radius 5 units?', 'NUMERIC', 1, 2, 'EASY', '78.54', 'Area = πr² = π × 5² = 25π ≈ 78.54 square units', 2, true, 1, NOW(), NOW()),
('In a right triangle, if one angle is 30°, what is the third angle?', 'MCQ', 1, 2, 'EASY', '60°', 'In a triangle, angles sum to 180°. Right triangle has 90°, so 180° - 90° - 30° = 60°', 2, true, 1, NOW(), NOW()),
('What is the Pythagorean theorem?', 'ESSAY', 1, 2, 'MEDIUM', 'In a right triangle, the square of the hypotenuse equals the sum of squares of the other two sides: a² + b² = c²', 'This fundamental theorem relates the sides of right triangles', 3, true, 1, NOW(), NOW()),

-- Trigonometry - Medium to Hard
('What is the value of sin(45°)?', 'MCQ', 1, 3, 'MEDIUM', '√2/2', 'sin(45°) = √2/2 ≈ 0.707', 2, true, 1, NOW(), NOW()),
('Prove the identity: sin²θ + cos²θ = 1', 'ESSAY', 1, 3, 'HARD', 'Using the unit circle definition, for any point (cos θ, sin θ) on the unit circle, the distance from origin is 1. By distance formula: √(cos²θ + sin²θ) = 1, therefore cos²θ + sin²θ = 1', 'This is the fundamental trigonometric identity', 4, true, 1, NOW(), NOW()),

-- ========== PHYSICS QUESTIONS ==========

-- Mechanics - Easy to Hard
('What is the SI unit of force?', 'MCQ', 2, 6, 'EASY', 'Newton', 'Force is measured in Newtons (N), named after Sir Isaac Newton', 1, true, 1, NOW(), NOW()),
('Calculate the kinetic energy of a 2 kg object moving at 10 m/s', 'NUMERIC', 2, 6, 'MEDIUM', '100', 'KE = ½mv² = ½ × 2 × 10² = 100 J', 3, true, 1, NOW(), NOW()),
('State and explain Newton''s Second Law of Motion', 'ESSAY', 2, 6, 'MEDIUM', 'Newton''s Second Law states that the acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass. F = ma, where F is force, m is mass, and a is acceleration.', 'This law quantifies the relationship between force, mass, and acceleration', 3, true, 1, NOW(), NOW()),

-- Thermodynamics
('What is absolute zero temperature?', 'MCQ', 2, 7, 'EASY', '-273.15°C', 'Absolute zero is the theoretical temperature where all molecular motion stops', 2, true, 1, NOW(), NOW()),
('Explain the First Law of Thermodynamics', 'ESSAY', 2, 7, 'MEDIUM', 'The First Law states that energy cannot be created or destroyed, only converted from one form to another. For a thermodynamic system: ΔU = Q - W, where ΔU is change in internal energy, Q is heat added, and W is work done by the system.', 'This law is essentially conservation of energy applied to thermal systems', 4, true, 1, NOW(), NOW()),

-- ========== CHEMISTRY QUESTIONS ==========

-- Atomic Structure
('How many electrons can the first electron shell hold?', 'NUMERIC', 3, 11, 'EASY', '2', 'The first shell (K shell) can hold a maximum of 2 electrons', 1, true, 1, NOW(), NOW()),
('What is the atomic number of oxygen?', 'NUMERIC', 3, 11, 'EASY', '8', 'Oxygen has 8 protons, giving it atomic number 8', 1, true, 1, NOW(), NOW()),
('Explain the concept of isotopes', 'ESSAY', 3, 11, 'MEDIUM', 'Isotopes are atoms of the same element with the same number of protons but different numbers of neutrons. They have the same atomic number but different mass numbers. Example: Carbon-12 and Carbon-14 are isotopes of carbon.', 'Isotopes have identical chemical properties but different physical properties', 3, true, 1, NOW(), NOW()),

-- Chemical Reactions
('Balance the equation: H₂ + O₂ → H₂O', 'FILL_BLANK', 3, 12, 'MEDIUM', '2H₂ + O₂ → 2H₂O', 'To balance: 2 hydrogen molecules + 1 oxygen molecule → 2 water molecules', 3, true, 1, NOW(), NOW()),
('What type of reaction is photosynthesis?', 'MCQ', 3, 12, 'MEDIUM', 'Endothermic', 'Photosynthesis requires energy input from sunlight, making it endothermic', 2, true, 1, NOW(), NOW()),

-- ========== BIOLOGY QUESTIONS ==========

-- Cell Biology
('What is the function of mitochondria?', 'MCQ', 4, 16, 'EASY', 'Energy production', 'Mitochondria are the powerhouses of the cell, producing ATP through cellular respiration', 2, true, 1, NOW(), NOW()),
('Name the process by which plants make their own food', 'FILL_BLANK', 4, 16, 'EASY', 'Photosynthesis', 'Plants convert light energy into chemical energy through photosynthesis', 1, true, 1, NOW(), NOW()),
('Describe the structure and function of DNA', 'ESSAY', 4, 17, 'HARD', 'DNA (Deoxyribonucleic Acid) is a double-helix structure composed of nucleotides containing four bases: A, T, G, C. It stores genetic information and serves as a template for protein synthesis. The complementary base pairing (A-T, G-C) allows for accurate replication.', 'DNA is the molecular basis of heredity in all living organisms', 4, true, 1, NOW(), NOW()),

-- Genetics
('What did Gregor Mendel discover?', 'MCQ', 4, 17, 'MEDIUM', 'Laws of inheritance', 'Mendel discovered the basic principles of heredity through his pea plant experiments', 2, true, 1, NOW(), NOW()),
('Explain dominant and recessive alleles', 'ESSAY', 4, 17, 'MEDIUM', 'Dominant alleles are expressed in the phenotype even when only one copy is present (heterozygous). Recessive alleles are only expressed when two copies are present (homozygous recessive). Dominant alleles are typically represented by capital letters, recessive by lowercase.', 'This concept explains how traits are inherited from parents to offspring', 3, true, 1, NOW(), NOW()),

-- ========== COMPUTER SCIENCE QUESTIONS ==========

-- Programming Fundamentals
('What is a variable in programming?', 'ESSAY', 5, 21, 'EASY', 'A variable is a named storage location in memory that holds a value. Variables have a data type (int, string, float, etc.) and can be assigned and reassigned values during program execution.', 'Variables are fundamental building blocks of programming', 2, true, 1, NOW(), NOW()),
('Which loop executes at least once regardless of condition?', 'MCQ', 5, 21, 'MEDIUM', 'do-while loop', 'A do-while loop executes the body first, then checks the condition', 2, true, 1, NOW(), NOW()),

-- Data Structures
('What is the time complexity of binary search?', 'MCQ', 5, 22, 'MEDIUM', 'O(log n)', 'Binary search divides the search space in half with each comparison', 3, true, 1, NOW(), NOW()),
('Explain the difference between stack and queue', 'ESSAY', 5, 22, 'MEDIUM', 'A stack follows LIFO (Last In, First Out) principle with push/pop operations at the top. A queue follows FIFO (First In, First Out) principle with enqueue at rear and dequeue at front. Stacks are used for function calls and undo operations, queues for task scheduling and breadth-first search.', 'These are fundamental linear data structures with different access patterns', 4, true, 1, NOW(), NOW()),

-- Algorithms
('What is the worst-case time complexity of bubble sort?', 'MCQ', 5, 23, 'MEDIUM', 'O(n²)', 'Bubble sort compares each element with every other element in worst case', 3, true, 1, NOW(), NOW()),
('Explain the divide-and-conquer approach', 'ESSAY', 5, 23, 'HARD', 'Divide-and-conquer breaks a problem into smaller subproblems, solves them recursively, and combines the solutions. Steps: 1) Divide problem into subproblems, 2) Conquer by solving subproblems recursively, 3) Combine solutions. Examples include merge sort, quick sort, and binary search.', 'This is a fundamental algorithmic paradigm for solving complex problems', 4, true, 1, NOW(), NOW()),

-- ========== ENGLISH LITERATURE QUESTIONS ==========

-- Poetry Analysis
('What is a metaphor?', 'ESSAY', 6, 26, 'EASY', 'A metaphor is a figure of speech that directly compares two unlike things without using "like" or "as". It states that one thing IS another thing, creating an implicit comparison. Example: "Life is a journey" compares life to a journey.', 'Metaphors are powerful literary devices that create vivid imagery and meaning', 2, true, 1, NOW(), NOW()),
('Identify the rhyme scheme in a Shakespearean sonnet', 'FILL_BLANK', 6, 26, 'MEDIUM', 'ABAB CDCD EFEF GG', 'Shakespearean sonnets have 14 lines with this specific rhyme pattern', 3, true, 1, NOW(), NOW()),

-- Drama & Theatre
('What is dramatic irony?', 'ESSAY', 6, 27, 'MEDIUM', 'Dramatic irony occurs when the audience knows something that the characters do not. This creates tension, humor, or tragic effect. Example: In Romeo and Juliet, the audience knows Juliet is not really dead, but Romeo does not.', 'This technique engages the audience and creates emotional impact', 3, true, 1, NOW(), NOW()),
('Name the three unities in classical drama', 'FILL_BLANK', 6, 27, 'HARD', 'Unity of Action, Unity of Time, Unity of Place', 'These principles govern the structure of classical dramatic works', 4, true, 1, NOW(), NOW());

-- ========== QUESTION OPTIONS (for MCQ questions only) ==========
-- Note: The question_options table doesn't have is_correct column, so we'll use option_order
-- The correct answer is indicated by correct_answer_text in the questions table

INSERT INTO assessment.question_options (question_id, text, option_order) VALUES

-- Options for: Solve for x: 3x + 7 = 22 (question_id will be 1)
(1, 'x = 3', 1),
(1, 'x = 5', 2),
(1, 'x = 7', 3),
(1, 'x = 15', 4),

-- Options for: In a right triangle, if one angle is 30°, what is the third angle? (question_id will be 5)
(5, '30°', 1),
(5, '45°', 2),
(5, '60°', 3),
(5, '90°', 4),

-- Options for: What is the value of sin(45°)? (question_id will be 7)
(7, '1/2', 1),
(7, '√2/2', 2),
(7, '√3/2', 3),
(7, '1', 4),

-- Options for: What is the SI unit of force? (question_id will be 9)
(9, 'Joule', 1),
(9, 'Newton', 2),
(9, 'Watt', 3),
(9, 'Pascal', 4),

-- Options for: What is absolute zero temperature? (question_id will be 12)
(12, '-273.15°C', 1),
(12, '-273°C', 2),
(12, '0°C', 3),
(12, '-100°C', 4),

-- Options for: What type of reaction is photosynthesis? (question_id will be 18)
(18, 'Exothermic', 1),
(18, 'Endothermic', 2),
(18, 'Neutral', 3),
(18, 'Spontaneous', 4),

-- Options for: What is the function of mitochondria? (question_id will be 19)
(19, 'Protein synthesis', 1),
(19, 'Energy production', 2),
(19, 'Waste removal', 3),
(19, 'DNA storage', 4),

-- Options for: What did Gregor Mendel discover? (question_id will be 21)
(21, 'DNA structure', 1),
(21, 'Cell theory', 2),
(21, 'Laws of inheritance', 3),
(21, 'Evolution theory', 4),

-- Options for: Which loop executes at least once regardless of condition? (question_id will be 24)
(24, 'for loop', 1),
(24, 'while loop', 2),
(24, 'do-while loop', 3),
(24, 'foreach loop', 4),

-- Options for: What is the time complexity of binary search? (question_id will be 25)
(25, 'O(1)', 1),
(25, 'O(log n)', 2),
(25, 'O(n)', 3),
(25, 'O(n²)', 4),

-- Options for: What is the worst-case time complexity of bubble sort? (question_id will be 27)
(27, 'O(n)', 1),
(27, 'O(n log n)', 2),
(27, 'O(n²)', 3),
(27, 'O(2^n)', 4);

-- Display success message
SELECT 'Questions and options inserted successfully!' as status;
SELECT COUNT(*) as total_questions FROM assessment.questions;
SELECT COUNT(*) as total_options FROM assessment.question_options;