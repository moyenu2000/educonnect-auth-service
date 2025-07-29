-- =====================================================
-- ENHANCED SAMPLE DATA FOR EDUCONNECT
-- =====================================================
-- Comprehensive subjects, topics, and questions for educational platform

-- First, let's clear existing data (optional)
-- DELETE FROM assessment.question_options WHERE question_id > 0;
-- DELETE FROM assessment.questions WHERE id > 0;
-- DELETE FROM assessment.topics WHERE id > 0;
-- DELETE FROM assessment.subjects WHERE id > 0;

-- ========== SUBJECTS ==========
INSERT INTO assessment.subjects (name, description, class_level, display_order, is_active, created_at, updated_at) VALUES

-- High School Core Subjects
('Mathematics', 'Comprehensive mathematics covering algebra, geometry, calculus, and statistics', 'CLASS_10', 1, true, NOW(), NOW()),
('Physics', 'Fundamental and advanced physics concepts, mechanics, thermodynamics, and modern physics', 'CLASS_10', 2, true, NOW(), NOW()),
('Chemistry', 'General chemistry, organic chemistry, and chemical analysis', 'CLASS_10', 3, true, NOW(), NOW()),
('Biology', 'Life sciences, human anatomy, genetics, and environmental biology', 'CLASS_10', 4, true, NOW(), NOW()),
('Computer Science', 'Programming, algorithms, data structures, and software development', 'CLASS_10', 5, true, NOW(), NOW()),
('English Literature', 'English language, literature analysis, and communication skills', 'CLASS_10', 6, true, NOW(), NOW()),
('History', 'World history, ancient civilizations, and historical analysis', 'CLASS_10', 7, true, NOW(), NOW()),
('Geography', 'Physical geography, human geography, and environmental studies', 'CLASS_10', 8, true, NOW(), NOW()),
('Economics', 'Microeconomics, macroeconomics, and economic theories', 'CLASS_11', 9, true, NOW(), NOW()),
('Philosophy', 'Logic, ethics, and philosophical reasoning', 'CLASS_11', 10, true, NOW(), NOW());

-- ========== TOPICS ==========
INSERT INTO assessment.topics (name, description, subject_id, display_order, is_active, created_at, updated_at) VALUES

-- Mathematics Topics
('Algebra', 'Linear and quadratic equations, polynomials, and algebraic expressions', 1, 1, true, NOW(), NOW()),
('Geometry', 'Plane geometry, coordinate geometry, and geometric proofs', 1, 2, true, NOW(), NOW()),
('Trigonometry', 'Trigonometric functions, identities, and applications', 1, 3, true, NOW(), NOW()),
('Calculus', 'Derivatives, integrals, and applications of calculus', 1, 4, true, NOW(), NOW()),
('Statistics & Probability', 'Statistical analysis, probability theory, and data interpretation', 1, 5, true, NOW(), NOW()),

-- Physics Topics
('Mechanics', 'Motion, forces, energy, and momentum', 2, 1, true, NOW(), NOW()),
('Thermodynamics', 'Heat, temperature, and energy transfer', 2, 2, true, NOW(), NOW()),
('Waves & Optics', 'Wave properties, sound, light, and optical phenomena', 2, 3, true, NOW(), NOW()),
('Electricity & Magnetism', 'Electric circuits, magnetic fields, and electromagnetic induction', 2, 4, true, NOW(), NOW()),
('Modern Physics', 'Atomic structure, quantum mechanics, and relativity', 2, 5, true, NOW(), NOW()),

-- Chemistry Topics
('Atomic Structure', 'Atoms, elements, periodic table, and chemical bonding', 3, 1, true, NOW(), NOW()),
('Chemical Reactions', 'Types of reactions, stoichiometry, and reaction mechanisms', 3, 2, true, NOW(), NOW()),
('Acids & Bases', 'pH, acid-base theories, and chemical equilibrium', 3, 3, true, NOW(), NOW()),
('Organic Chemistry', 'Hydrocarbons, functional groups, and organic reactions', 3, 4, true, NOW(), NOW()),
('Analytical Chemistry', 'Chemical analysis, spectroscopy, and laboratory techniques', 3, 5, true, NOW(), NOW()),

-- Biology Topics
('Cell Biology', 'Cell structure, organelles, and cellular processes', 4, 1, true, NOW(), NOW()),
('Genetics', 'DNA, heredity, mutations, and genetic engineering', 4, 2, true, NOW(), NOW()),
('Evolution', 'Natural selection, speciation, and evolutionary theory', 4, 3, true, NOW(), NOW()),
('Ecology', 'Ecosystems, biodiversity, and environmental interactions', 4, 4, true, NOW(), NOW()),
('Human Physiology', 'Body systems, anatomy, and physiological processes', 4, 5, true, NOW(), NOW()),

-- Computer Science Topics
('Programming Fundamentals', 'Variables, data types, control structures, and functions', 5, 1, true, NOW(), NOW()),
('Data Structures', 'Arrays, linked lists, stacks, queues, trees, and graphs', 5, 2, true, NOW(), NOW()),
('Algorithms', 'Sorting, searching, dynamic programming, and complexity analysis', 5, 3, true, NOW(), NOW()),
('Object-Oriented Programming', 'Classes, inheritance, polymorphism, and encapsulation', 5, 4, true, NOW(), NOW()),
('Database Systems', 'SQL, database design, normalization, and transactions', 5, 5, true, NOW(), NOW()),

-- English Literature Topics
('Poetry Analysis', 'Poetic devices, themes, and literary interpretation', 6, 1, true, NOW(), NOW()),
('Drama & Theatre', 'Dramatic techniques, character analysis, and theatrical elements', 6, 2, true, NOW(), NOW()),
('Novel Studies', 'Narrative techniques, character development, and thematic analysis', 6, 3, true, NOW(), NOW()),
('Essay Writing', 'Argumentative essays, creative writing, and composition skills', 6, 4, true, NOW(), NOW()),
('Grammar & Linguistics', 'Syntax, semantics, and language structure', 6, 5, true, NOW(), NOW());

-- ========== QUESTIONS ==========
INSERT INTO assessment.questions (text, type, subject_id, topic_id, difficulty, correct_answer, explanation, points, is_active, created_by, created_at, updated_at) VALUES

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
('Derive the equation v² = u² + 2as from first principles', 'ESSAY', 2, 6, 'HARD', 'Starting with v = u + at and s = ut + ½at². From first equation: t = (v-u)/a. Substituting into second: s = u(v-u)/a + ½a((v-u)/a)². Simplifying: s = (v²-u²)/(2a), therefore v² = u² + 2as', 'This kinematic equation relates velocity, acceleration, and displacement', 5, true, 1, NOW(), NOW()),

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

-- ========== QUESTION OPTIONS ==========
INSERT INTO assessment.question_options (question_id, text, is_correct, display_order, created_at, updated_at) VALUES

-- Options for MCQ: Solve for x: 3x + 7 = 22
(1, 'x = 3', false, 1, NOW(), NOW()),
(1, 'x = 5', true, 2, NOW(), NOW()),
(1, 'x = 7', false, 3, NOW(), NOW()),
(1, 'x = 15', false, 4, NOW(), NOW()),

-- Options for MCQ: In a right triangle, if one angle is 30°, what is the third angle?
(5, '30°', false, 1, NOW(), NOW()),
(5, '45°', false, 2, NOW(), NOW()),
(5, '60°', true, 3, NOW(), NOW()),
(5, '90°', false, 4, NOW(), NOW()),

-- Options for MCQ: What is the value of sin(45°)?
(7, '1/2', false, 1, NOW(), NOW()),
(7, '√2/2', true, 2, NOW(), NOW()),
(7, '√3/2', false, 3, NOW(), NOW()),
(7, '1', false, 4, NOW(), NOW()),

-- Options for MCQ: What is the SI unit of force?
(9, 'Joule', false, 1, NOW(), NOW()),
(9, 'Newton', true, 2, NOW(), NOW()),
(9, 'Watt', false, 3, NOW(), NOW()),
(9, 'Pascal', false, 4, NOW(), NOW()),

-- Options for MCQ: What is absolute zero temperature?
(13, '-273.15°C', true, 1, NOW(), NOW()),
(13, '-273°C', false, 2, NOW(), NOW()),
(13, '0°C', false, 3, NOW(), NOW()),
(13, '-100°C', false, 4, NOW(), NOW()),

-- Options for MCQ: What is the function of mitochondria?
(19, 'Protein synthesis', false, 1, NOW(), NOW()),
(19, 'Energy production', true, 2, NOW(), NOW()),
(19, 'Waste removal', false, 3, NOW(), NOW()),
(19, 'DNA storage', false, 4, NOW(), NOW()),

-- Options for MCQ: What did Gregor Mendel discover?
(21, 'DNA structure', false, 1, NOW(), NOW()),
(21, 'Cell theory', false, 2, NOW(), NOW()),
(21, 'Laws of inheritance', true, 3, NOW(), NOW()),
(21, 'Evolution theory', false, 4, NOW(), NOW()),

-- Options for MCQ: Which loop executes at least once regardless of condition?
(24, 'for loop', false, 1, NOW(), NOW()),
(24, 'while loop', false, 2, NOW(), NOW()),
(24, 'do-while loop', true, 3, NOW(), NOW()),
(24, 'foreach loop', false, 4, NOW(), NOW()),

-- Options for MCQ: What is the time complexity of binary search?
(25, 'O(1)', false, 1, NOW(), NOW()),
(25, 'O(log n)', true, 2, NOW(), NOW()),
(25, 'O(n)', false, 3, NOW(), NOW()),
(25, 'O(n²)', false, 4, NOW(), NOW()),

-- Options for MCQ: What is the worst-case time complexity of bubble sort?
(27, 'O(n)', false, 1, NOW(), NOW()),
(27, 'O(n log n)', false, 2, NOW(), NOW()),
(27, 'O(n²)', true, 3, NOW(), NOW()),
(27, 'O(2^n)', false, 4, NOW(), NOW()),

-- Options for MCQ: What type of reaction is photosynthesis?
(16, 'Exothermic', false, 1, NOW(), NOW()),
(16, 'Endothermic', true, 2, NOW(), NOW()),
(16, 'Neutral', false, 3, NOW(), NOW()),
(16, 'Spontaneous', false, 4, NOW(), NOW());

-- Display success message
SELECT 'Enhanced sample data inserted successfully!' as status;
SELECT COUNT(*) as total_subjects FROM assessment.subjects;
SELECT COUNT(*) as total_topics FROM assessment.topics;
SELECT COUNT(*) as total_questions FROM assessment.questions;
SELECT COUNT(*) as total_options FROM assessment.question_options;