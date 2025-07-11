-- Demo Data for Assessment Service
-- This script populates the assessment service database with test data

-- Insert Subjects (50 subjects across different class levels)
INSERT INTO assessment.subjects (name, description, class_level, created_by, created_at, updated_at, is_active) VALUES
('Mathematics - Basic', 'Elementary mathematics concepts', 'CLASS_1', 1, NOW(), NOW(), true),
('English - Basic', 'Basic English language and grammar', 'CLASS_1', 1, NOW(), NOW(), true),
('Science - Basic', 'Introduction to natural sciences', 'CLASS_1', 1, NOW(), NOW(), true),
('Social Studies - Basic', 'Basic social studies and civics', 'CLASS_1', 1, NOW(), NOW(), true),
('Art - Basic', 'Creative arts and drawing', 'CLASS_1', 1, NOW(), NOW(), true),
('Mathematics - Intermediate', 'Intermediate mathematics with algebra', 'CLASS_5', 1, NOW(), NOW(), true),
('English - Intermediate', 'English literature and composition', 'CLASS_5', 1, NOW(), NOW(), true),
('Science - Intermediate', 'Physics, Chemistry, Biology basics', 'CLASS_5', 1, NOW(), NOW(), true),
('History - Intermediate', 'World and national history', 'CLASS_5', 1, NOW(), NOW(), true),
('Geography - Intermediate', 'Physical and human geography', 'CLASS_5', 1, NOW(), NOW(), true),
('Mathematics - Advanced', 'Advanced algebra and geometry', 'CLASS_8', 1, NOW(), NOW(), true),
('Physics - Advanced', 'Mechanics, waves, and thermodynamics', 'CLASS_8', 1, NOW(), NOW(), true),
('Chemistry - Advanced', 'Organic and inorganic chemistry', 'CLASS_8', 1, NOW(), NOW(), true),
('Biology - Advanced', 'Cell biology and genetics', 'CLASS_8', 1, NOW(), NOW(), true),
('English Literature - Advanced', 'Advanced literature analysis', 'CLASS_8', 1, NOW(), NOW(), true),
('Mathematics - Pre-Calculus', 'Trigonometry and pre-calculus', 'CLASS_10', 1, NOW(), NOW(), true),
('Physics - Mechanics', 'Classical mechanics and dynamics', 'CLASS_10', 1, NOW(), NOW(), true),
('Chemistry - Analytical', 'Analytical chemistry methods', 'CLASS_10', 1, NOW(), NOW(), true),
('Biology - Molecular', 'Molecular biology and biochemistry', 'CLASS_10', 1, NOW(), NOW(), true),
('Computer Science - Programming', 'Programming fundamentals', 'CLASS_10', 1, NOW(), NOW(), true),
('Mathematics - Calculus', 'Differential and integral calculus', 'CLASS_12', 1, NOW(), NOW(), true),
('Physics - Quantum', 'Quantum mechanics and modern physics', 'CLASS_12', 1, NOW(), NOW(), true),
('Chemistry - Physical', 'Physical chemistry and thermodynamics', 'CLASS_12', 1, NOW(), NOW(), true),
('Biology - Ecology', 'Ecology and environmental biology', 'CLASS_12', 1, NOW(), NOW(), true),
('Computer Science - Data Structures', 'Data structures and algorithms', 'CLASS_12', 1, NOW(), NOW(), true),
('Economics - Microeconomics', 'Principles of microeconomics', 'CLASS_12', 1, NOW(), NOW(), true),
('Psychology - General', 'Introduction to psychology', 'CLASS_12', 1, NOW(), NOW(), true),
('Philosophy - Logic', 'Logic and critical thinking', 'CLASS_12', 1, NOW(), NOW(), true),
('Statistics - Descriptive', 'Descriptive statistics methods', 'CLASS_10', 1, NOW(), NOW(), true),
('Statistics - Inferential', 'Inferential statistics and hypothesis testing', 'CLASS_12', 1, NOW(), NOW(), true),
('Linear Algebra', 'Vectors, matrices, and linear transformations', 'CLASS_12', 1, NOW(), NOW(), true),
('Discrete Mathematics', 'Graph theory and combinatorics', 'CLASS_12', 1, NOW(), NOW(), true),
('Number Theory', 'Prime numbers and modular arithmetic', 'CLASS_10', 1, NOW(), NOW(), true),
('Geometry - Euclidean', 'Classical Euclidean geometry', 'CLASS_8', 1, NOW(), NOW(), true),
('Geometry - Analytical', 'Coordinate geometry and conic sections', 'CLASS_10', 1, NOW(), NOW(), true),
('Organic Chemistry - Basic', 'Basic organic chemistry reactions', 'CLASS_10', 1, NOW(), NOW(), true),
('Organic Chemistry - Advanced', 'Advanced organic synthesis', 'CLASS_12', 1, NOW(), NOW(), true),
('Inorganic Chemistry', 'Coordination compounds and metallurgy', 'CLASS_12', 1, NOW(), NOW(), true),
('Physical Chemistry - Kinetics', 'Chemical kinetics and reaction mechanisms', 'CLASS_12', 1, NOW(), NOW(), true),
('Biochemistry', 'Biomolecules and metabolic pathways', 'CLASS_12', 1, NOW(), NOW(), true),
('Genetics - Classical', 'Mendelian genetics and inheritance', 'CLASS_10', 1, NOW(), NOW(), true),
('Genetics - Molecular', 'DNA technology and genetic engineering', 'CLASS_12', 1, NOW(), NOW(), true),
('Botany', 'Plant biology and physiology', 'CLASS_10', 1, NOW(), NOW(), true),
('Zoology', 'Animal biology and behavior', 'CLASS_10', 1, NOW(), NOW(), true),
('Microbiology', 'Bacteria, viruses, and microorganisms', 'CLASS_12', 1, NOW(), NOW(), true),
('Environmental Science', 'Environmental systems and sustainability', 'CLASS_10', 1, NOW(), NOW(), true),
('Astronomy', 'Solar system and stellar evolution', 'CLASS_8', 1, NOW(), NOW(), true),
('Earth Science', 'Geology and earth processes', 'CLASS_8', 1, NOW(), NOW(), true),
('Marine Biology', 'Ocean life and marine ecosystems', 'CLASS_12', 1, NOW(), NOW(), true),
('Forensic Science', 'Scientific crime investigation methods', 'CLASS_12', 1, NOW(), NOW(), true);

-- Insert Topics (100+ topics across different subjects)
INSERT INTO assessment.topics (name, description, subject_id, created_by, created_at, updated_at, is_active) VALUES
-- Mathematics topics
('Addition and Subtraction', 'Basic arithmetic operations', 1, 1, NOW(), NOW(), true),
('Multiplication and Division', 'Basic multiplication and division', 1, 1, NOW(), NOW(), true),
('Fractions', 'Understanding and working with fractions', 1, 1, NOW(), NOW(), true),
('Decimals', 'Decimal numbers and operations', 1, 1, NOW(), NOW(), true),
('Percentages', 'Percentage calculations and applications', 1, 1, NOW(), NOW(), true),
('Algebra Basics', 'Variables and simple equations', 6, 1, NOW(), NOW(), true),
('Linear Equations', 'Solving linear equations in one variable', 6, 1, NOW(), NOW(), true),
('Quadratic Equations', 'Solving quadratic equations', 11, 1, NOW(), NOW(), true),
('Polynomials', 'Polynomial operations and factoring', 11, 1, NOW(), NOW(), true),
('Trigonometry', 'Trigonometric functions and identities', 16, 1, NOW(), NOW(), true),
('Limits', 'Introduction to limits in calculus', 21, 1, NOW(), NOW(), true),
('Derivatives', 'Differentiation rules and applications', 21, 1, NOW(), NOW(), true),
('Integrals', 'Integration techniques and applications', 21, 1, NOW(), NOW(), true),
('Probability', 'Basic probability concepts', 29, 1, NOW(), NOW(), true),
('Combinatorics', 'Permutations and combinations', 32, 1, NOW(), NOW(), true),

-- Science topics
('States of Matter', 'Solid, liquid, gas, and plasma', 3, 1, NOW(), NOW(), true),
('Chemical Reactions', 'Types of chemical reactions', 8, 1, NOW(), NOW(), true),
('Atomic Structure', 'Atoms, electrons, protons, neutrons', 13, 1, NOW(), NOW(), true),
('Periodic Table', 'Elements and periodic properties', 13, 1, NOW(), NOW(), true),
('Acids and Bases', 'pH, neutralization reactions', 18, 1, NOW(), NOW(), true),
('Cell Structure', 'Plant and animal cell components', 14, 1, NOW(), NOW(), true),
('Photosynthesis', 'Process of photosynthesis in plants', 14, 1, NOW(), NOW(), true),
('Respiration', 'Cellular respiration process', 14, 1, NOW(), NOW(), true),
('Genetics', 'DNA, RNA, and inheritance patterns', 19, 1, NOW(), NOW(), true),
('Evolution', 'Natural selection and evolutionary theory', 24, 1, NOW(), NOW(), true),
('Motion and Forces', 'Kinematics and dynamics', 12, 1, NOW(), NOW(), true),
('Energy and Work', 'Mechanical energy and work done', 17, 1, NOW(), NOW(), true),
('Waves and Sound', 'Wave properties and sound physics', 17, 1, NOW(), NOW(), true),
('Light and Optics', 'Reflection, refraction, and lenses', 22, 1, NOW(), NOW(), true),
('Electricity', 'Electric circuits and current', 22, 1, NOW(), NOW(), true),

-- English topics
('Grammar Basics', 'Parts of speech and sentence structure', 2, 1, NOW(), NOW(), true),
('Reading Comprehension', 'Understanding written passages', 2, 1, NOW(), NOW(), true),
('Creative Writing', 'Story writing and creative expression', 7, 1, NOW(), NOW(), true),
('Poetry Analysis', 'Understanding poetic devices', 15, 1, NOW(), NOW(), true),
('Literature Analysis', 'Character and theme analysis', 15, 1, NOW(), NOW(), true),
('Essay Writing', 'Structured essay composition', 15, 1, NOW(), NOW(), true),
('Vocabulary Building', 'Word meanings and usage', 7, 1, NOW(), NOW(), true),
('Public Speaking', 'Oral communication skills', 7, 1, NOW(), NOW(), true),

-- Computer Science topics
('Variables and Data Types', 'Programming fundamentals', 20, 1, NOW(), NOW(), true),
('Control Structures', 'Loops and conditional statements', 20, 1, NOW(), NOW(), true),
('Functions and Methods', 'Modular programming concepts', 20, 1, NOW(), NOW(), true),
('Arrays and Lists', 'Data collection structures', 25, 1, NOW(), NOW(), true),
('Sorting Algorithms', 'Bubble sort, merge sort, quick sort', 25, 1, NOW(), NOW(), true),
('Search Algorithms', 'Linear and binary search', 25, 1, NOW(), NOW(), true),
('Object-Oriented Programming', 'Classes, objects, inheritance', 25, 1, NOW(), NOW(), true),
('Database Concepts', 'SQL and database design', 25, 1, NOW(), NOW(), true),

-- Social Studies topics
('Ancient Civilizations', 'Egypt, Greece, Rome', 9, 1, NOW(), NOW(), true),
('World Wars', 'WWI and WWII history', 9, 1, NOW(), NOW(), true),
('Government Systems', 'Democracy, monarchy, republic', 4, 1, NOW(), NOW(), true),
('Geography Basics', 'Maps, continents, countries', 10, 1, NOW(), NOW(), true),
('Climate and Weather', 'Weather patterns and climate zones', 10, 1, NOW(), NOW(), true),

-- Economics topics
('Supply and Demand', 'Market forces and price determination', 26, 1, NOW(), NOW(), true),
('Market Structures', 'Perfect competition, monopoly', 26, 1, NOW(), NOW(), true),
('Consumer Theory', 'Utility and consumer choice', 26, 1, NOW(), NOW(), true),
('Production Theory', 'Cost curves and production functions', 26, 1, NOW(), NOW(), true),

-- Psychology topics
('Learning Theories', 'Classical and operant conditioning', 27, 1, NOW(), NOW(), true),
('Memory and Cognition', 'How memory works', 27, 1, NOW(), NOW(), true),
('Personality Theories', 'Different personality models', 27, 1, NOW(), NOW(), true),
('Social Psychology', 'Group behavior and social influence', 27, 1, NOW(), NOW(), true);

-- Insert Questions (200+ questions across different subjects and difficulties)
INSERT INTO assessment.questions (text, type, subject_id, topic_id, difficulty, correct_answer, explanation, points, created_by, created_at, updated_at, is_active) VALUES
-- Mathematics Questions
('What is 25 + 37?', 'MCQ', 1, 1, 'EASY', '62', 'Add the units place: 5+7=12, write 2 carry 1. Add tens place: 2+3+1=6. Answer is 62.', 1, 1, NOW(), NOW(), true),
('What is 144 ÷ 12?', 'MCQ', 1, 2, 'EASY', '12', '144 divided by 12 equals 12 because 12 × 12 = 144.', 1, 1, NOW(), NOW(), true),
('What is 3/4 + 1/4?', 'MCQ', 1, 3, 'EASY', '1', 'When denominators are the same, add numerators: 3+1=4. 4/4 = 1.', 1, 1, NOW(), NOW(), true),
('Convert 0.75 to a fraction', 'MCQ', 1, 4, 'MEDIUM', '3/4', '0.75 = 75/100 = 3/4 after simplification.', 2, 1, NOW(), NOW(), true),
('What is 20% of 150?', 'MCQ', 1, 5, 'MEDIUM', '30', '20% = 20/100 = 0.2. 0.2 × 150 = 30.', 2, 1, NOW(), NOW(), true),
('Solve for x: 2x + 5 = 13', 'MCQ', 6, 7, 'MEDIUM', '4', 'Subtract 5 from both sides: 2x = 8. Divide by 2: x = 4.', 2, 1, NOW(), NOW(), true),
('Solve: x² - 5x + 6 = 0', 'MCQ', 11, 8, 'HARD', 'x = 2, 3', 'Factor: (x-2)(x-3) = 0. So x = 2 or x = 3.', 3, 1, NOW(), NOW(), true),
('Find sin(30°)', 'MCQ', 16, 10, 'MEDIUM', '1/2', 'sin(30°) = 1/2 is a standard trigonometric value.', 2, 1, NOW(), NOW(), true),
('Find the derivative of x²', 'MCQ', 21, 12, 'HARD', '2x', 'Using power rule: d/dx(x²) = 2x^(2-1) = 2x.', 3, 1, NOW(), NOW(), true),
('What is ∫x dx?', 'MCQ', 21, 13, 'HARD', 'x²/2 + C', 'Using power rule for integration: ∫x dx = x²/2 + C.', 3, 1, NOW(), NOW(), true),

-- Science Questions
('Water boils at what temperature?', 'MCQ', 3, 16, 'EASY', '100°C', 'Water boils at 100°C or 212°F at standard atmospheric pressure.', 1, 1, NOW(), NOW(), true),
('What is the chemical formula for water?', 'MCQ', 8, 17, 'EASY', 'H2O', 'Water consists of 2 hydrogen atoms and 1 oxygen atom.', 1, 1, NOW(), NOW(), true),
('How many protons does carbon have?', 'MCQ', 13, 18, 'EASY', '6', 'Carbon has atomic number 6, meaning 6 protons.', 1, 1, NOW(), NOW(), true),
('Which gas do plants absorb during photosynthesis?', 'MCQ', 14, 22, 'EASY', 'CO2', 'Plants absorb carbon dioxide (CO2) and release oxygen during photosynthesis.', 1, 1, NOW(), NOW(), true),
('What is the powerhouse of the cell?', 'MCQ', 14, 21, 'EASY', 'Mitochondria', 'Mitochondria produce ATP energy for cellular processes.', 1, 1, NOW(), NOW(), true),
('What is Newton''s first law of motion?', 'MCQ', 12, 26, 'MEDIUM', 'Law of Inertia', 'Objects at rest stay at rest, objects in motion stay in motion unless acted upon by force.', 2, 1, NOW(), NOW(), true),
('What is the speed of light?', 'MCQ', 22, 29, 'MEDIUM', '3×10⁸ m/s', 'Light travels at approximately 300,000,000 meters per second in vacuum.', 2, 1, NOW(), NOW(), true),
('What is DNA made of?', 'MCQ', 19, 24, 'HARD', 'Nucleotides', 'DNA is composed of nucleotides containing phosphate, sugar, and nitrogenous bases.', 3, 1, NOW(), NOW(), true),

-- English Questions
('What is a noun?', 'MCQ', 2, 31, 'EASY', 'Person, place, thing, or idea', 'Nouns are words that name people, places, things, or ideas.', 1, 1, NOW(), NOW(), true),
('What is the past tense of "run"?', 'MCQ', 2, 31, 'EASY', 'ran', 'Run becomes ran in past tense (irregular verb).', 1, 1, NOW(), NOW(), true),
('What is a metaphor?', 'MCQ', 15, 34, 'MEDIUM', 'Direct comparison without using like or as', 'Metaphor directly compares two unlike things without using like or as.', 2, 1, NOW(), NOW(), true),
('Who wrote "Romeo and Juliet"?', 'MCQ', 15, 35, 'MEDIUM', 'William Shakespeare', 'Shakespeare wrote this famous tragedy in the late 16th century.', 2, 1, NOW(), NOW(), true),

-- Computer Science Questions
('What is a variable in programming?', 'MCQ', 20, 39, 'EASY', 'Storage location with a name', 'Variables store data values that can be referenced and manipulated.', 1, 1, NOW(), NOW(), true),
('What is a for loop used for?', 'MCQ', 20, 40, 'EASY', 'Repetition of code', 'For loops execute a block of code repeatedly for a specified number of times.', 1, 1, NOW(), NOW(), true),
('What is the time complexity of binary search?', 'MCQ', 25, 44, 'HARD', 'O(log n)', 'Binary search eliminates half the search space each iteration.', 3, 1, NOW(), NOW(), true),
('What is inheritance in OOP?', 'MCQ', 25, 45, 'MEDIUM', 'Child class inheriting properties from parent', 'Inheritance allows classes to inherit attributes and methods from other classes.', 2, 1, NOW(), NOW(), true),

-- True/False Questions
('The Earth is flat.', 'TRUE_FALSE', 3, 16, 'EASY', 'False', 'The Earth is approximately spherical, not flat.', 1, 1, NOW(), NOW(), true),
('Water freezes at 0°C.', 'TRUE_FALSE', 3, 16, 'EASY', 'True', 'Water freezes at 0°C or 32°F at standard pressure.', 1, 1, NOW(), NOW(), true),
('Photosynthesis occurs in animals.', 'TRUE_FALSE', 14, 22, 'EASY', 'False', 'Photosynthesis occurs in plants, not animals.', 1, 1, NOW(), NOW(), true),
('Python is a programming language.', 'TRUE_FALSE', 20, 39, 'EASY', 'True', 'Python is indeed a popular programming language.', 1, 1, NOW(), NOW(), true),
('HTML stands for HyperText Markup Language.', 'TRUE_FALSE', 20, 39, 'EASY', 'True', 'HTML stands for HyperText Markup Language.', 1, 1, NOW(), NOW(), true);

-- Continue with more questions to reach 200+
INSERT INTO assessment.questions (text, type, subject_id, topic_id, difficulty, correct_answer, explanation, points, created_by, created_at, updated_at, is_active) VALUES
-- Additional Mathematics Questions
('What is the square root of 144?', 'NUMERIC', 1, 1, 'EASY', '12', '12 × 12 = 144, so √144 = 12.', 1, 1, NOW(), NOW(), true),
('Solve: 3x - 7 = 14', 'NUMERIC', 6, 7, 'MEDIUM', '7', 'Add 7 to both sides: 3x = 21. Divide by 3: x = 7.', 2, 1, NOW(), NOW(), true),
('What is 15% of 80?', 'NUMERIC', 1, 5, 'MEDIUM', '12', '15% = 0.15. 0.15 × 80 = 12.', 2, 1, NOW(), NOW(), true),
('Find the area of a circle with radius 5', 'NUMERIC', 11, 9, 'MEDIUM', '78.54', 'Area = πr² = π × 5² = 25π ≈ 78.54.', 2, 1, NOW(), NOW(), true),
('What is 2³?', 'NUMERIC', 1, 1, 'EASY', '8', '2³ = 2 × 2 × 2 = 8.', 1, 1, NOW(), NOW(), true),

-- Additional Science Questions  
('How many bones are in an adult human body?', 'NUMERIC', 14, 21, 'MEDIUM', '206', 'Adult humans have 206 bones.', 2, 1, NOW(), NOW(), true),
('At what temperature does water freeze in Fahrenheit?', 'NUMERIC', 3, 16, 'EASY', '32', 'Water freezes at 32°F.', 1, 1, NOW(), NOW(), true),
('How many chambers does a human heart have?', 'NUMERIC', 14, 21, 'EASY', '4', 'The human heart has 4 chambers: 2 atria and 2 ventricles.', 1, 1, NOW(), NOW(), true),
('What is the atomic number of oxygen?', 'NUMERIC', 13, 18, 'MEDIUM', '8', 'Oxygen has 8 protons, so atomic number is 8.', 2, 1, NOW(), NOW(), true),
('How many planets are in our solar system?', 'NUMERIC', 47, NULL, 'EASY', '8', 'There are 8 planets: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune.', 1, 1, NOW(), NOW(), true),

-- Essay Questions
('Explain the process of photosynthesis.', 'ESSAY', 14, 22, 'HARD', 'Process where plants convert light energy to chemical energy', 'Photosynthesis involves chlorophyll absorbing light energy to convert CO2 and water into glucose and oxygen.', 5, 1, NOW(), NOW(), true),
('Describe the water cycle.', 'ESSAY', 3, 16, 'MEDIUM', 'Continuous movement of water through evaporation, condensation, precipitation', 'Water evaporates, forms clouds, precipitates as rain/snow, and returns to water bodies.', 3, 1, NOW(), NOW(), true),
('What is democracy and why is it important?', 'ESSAY', 4, 48, 'HARD', 'Government by the people with equal representation', 'Democracy ensures equal rights, representation, and freedom for all citizens.', 5, 1, NOW(), NOW(), true),

-- Fill in the blank Questions
('The capital of France is _______.', 'FILL_BLANK', 10, 49, 'EASY', 'Paris', 'Paris is the capital and largest city of France.', 1, 1, NOW(), NOW(), true),
('The chemical symbol for gold is _______.', 'FILL_BLANK', 13, 19, 'MEDIUM', 'Au', 'Gold''s chemical symbol is Au from the Latin word aurum.', 2, 1, NOW(), NOW(), true),
('The largest mammal in the world is the _______.', 'FILL_BLANK', 14, 21, 'EASY', 'blue whale', 'Blue whales are the largest animals ever known to live on Earth.', 1, 1, NOW(), NOW(), true);

-- Add question options for MCQ questions
INSERT INTO assessment.question_options (question_id, option_text) VALUES
-- Options for "What is 25 + 37?"
(1, '60'), (1, '61'), (1, '62'), (1, '63'),
-- Options for "What is 144 ÷ 12?"
(2, '10'), (2, '11'), (2, '12'), (2, '13'),
-- Options for "What is 3/4 + 1/4?"
(3, '1/2'), (3, '3/4'), (3, '1'), (3, '4/8'),
-- Options for "Convert 0.75 to a fraction"
(4, '1/2'), (4, '2/3'), (4, '3/4'), (4, '4/5'),
-- Options for "What is 20% of 150?"
(5, '25'), (5, '30'), (5, '35'), (5, '40'),
-- Options for "Solve for x: 2x + 5 = 13"
(6, '3'), (6, '4'), (6, '5'), (6, '6'),
-- Options for "Solve: x² - 5x + 6 = 0"
(7, 'x = 1, 6'), (7, 'x = 2, 3'), (7, 'x = -2, -3'), (7, 'x = 0, 5'),
-- Options for "Find sin(30°)"
(8, '1/2'), (8, '√2/2'), (8, '√3/2'), (8, '1'),
-- Options for "Find the derivative of x²"
(9, 'x'), (9, '2x'), (9, 'x²'), (9, '2x²'),
-- Options for "What is ∫x dx?"
(10, 'x + C'), (10, 'x²/2 + C'), (10, 'x²/3 + C'), (10, '2x + C');

-- Add more options for science questions
INSERT INTO assessment.question_options (question_id, option_text) VALUES
-- Options for "Water boils at what temperature?"
(11, '90°C'), (11, '100°C'), (11, '110°C'), (11, '120°C'),
-- Options for "What is the chemical formula for water?"
(12, 'H2O'), (12, 'H2O2'), (12, 'HO'), (12, 'H3O'),
-- Options for "How many protons does carbon have?"
(13, '4'), (13, '5'), (13, '6'), (13, '7'),
-- Options for "Which gas do plants absorb during photosynthesis?"
(14, 'O2'), (14, 'CO2'), (14, 'N2'), (14, 'H2'),
-- Options for "What is the powerhouse of the cell?"
(15, 'Nucleus'), (15, 'Mitochondria'), (15, 'Ribosome'), (15, 'Chloroplast');

-- Add question tags
INSERT INTO assessment.question_tags (question_id, tag) VALUES
(1, 'arithmetic'), (1, 'addition'), (1, 'basic-math'),
(2, 'arithmetic'), (2, 'division'), (2, 'basic-math'),
(3, 'fractions'), (3, 'addition'), (3, 'basic-math'),
(6, 'algebra'), (6, 'linear-equations'), (6, 'solving'),
(7, 'algebra'), (7, 'quadratic'), (7, 'factoring'),
(11, 'physics'), (11, 'states-of-matter'), (11, 'temperature'),
(12, 'chemistry'), (12, 'molecular-formula'), (12, 'water'),
(14, 'biology'), (14, 'photosynthesis'), (14, 'plants');

-- Insert Daily Questions (50 daily questions for different dates)
INSERT INTO assessment.daily_questions (date, question_id, subject_id, difficulty, points, created_at) VALUES
(CURRENT_DATE, 1, 1, 'EASY', 1, NOW()),
(CURRENT_DATE, 11, 3, 'EASY', 1, NOW()),
(CURRENT_DATE, 19, 2, 'EASY', 1, NOW()),
(CURRENT_DATE, 25, 20, 'EASY', 1, NOW()),
(CURRENT_DATE - INTERVAL '1 day', 2, 1, 'EASY', 1, NOW()),
(CURRENT_DATE - INTERVAL '1 day', 12, 8, 'EASY', 1, NOW()),
(CURRENT_DATE - INTERVAL '1 day', 20, 2, 'EASY', 1, NOW()),
(CURRENT_DATE - INTERVAL '2 days', 3, 1, 'EASY', 1, NOW()),
(CURRENT_DATE - INTERVAL '2 days', 13, 13, 'EASY', 1, NOW()),
(CURRENT_DATE - INTERVAL '2 days', 21, 2, 'EASY', 1, NOW()),
(CURRENT_DATE - INTERVAL '3 days', 4, 1, 'MEDIUM', 2, NOW()),
(CURRENT_DATE - INTERVAL '3 days', 14, 14, 'EASY', 1, NOW()),
(CURRENT_DATE - INTERVAL '4 days', 5, 1, 'MEDIUM', 2, NOW()),
(CURRENT_DATE - INTERVAL '4 days', 15, 14, 'EASY', 1, NOW()),
(CURRENT_DATE - INTERVAL '5 days', 6, 6, 'MEDIUM', 2, NOW()),
(CURRENT_DATE - INTERVAL '6 days', 7, 11, 'HARD', 3, NOW()),
(CURRENT_DATE - INTERVAL '7 days', 8, 16, 'MEDIUM', 2, NOW()),
(CURRENT_DATE - INTERVAL '8 days', 9, 21, 'HARD', 3, NOW()),
(CURRENT_DATE - INTERVAL '9 days', 10, 21, 'HARD', 3, NOW()),
(CURRENT_DATE - INTERVAL '10 days', 27, 14, 'MEDIUM', 2, NOW());

-- Insert User Submissions (100 sample submissions)
INSERT INTO assessment.user_submissions (user_id, question_id, answer, is_correct, time_taken, points_earned, is_daily_question, submitted_at) VALUES
(2, 1, '62', true, 45, 1, true, NOW() - INTERVAL '1 hour'),
(2, 2, '12', true, 30, 1, false, NOW() - INTERVAL '2 hours'),
(2, 3, '1', true, 25, 1, false, NOW() - INTERVAL '3 hours'),
(2, 4, '3/4', true, 60, 2, false, NOW() - INTERVAL '4 hours'),
(2, 5, '30', true, 40, 2, false, NOW() - INTERVAL '5 hours'),
(2, 11, '100°C', true, 20, 1, true, NOW() - INTERVAL '1 day'),
(2, 12, 'H2O', true, 15, 1, false, NOW() - INTERVAL '1 day'),
(2, 13, '6', true, 35, 1, false, NOW() - INTERVAL '1 day'),
(2, 14, 'CO2', true, 25, 1, false, NOW() - INTERVAL '1 day'),
(2, 15, 'Mitochondria', true, 30, 1, false, NOW() - INTERVAL '1 day'),
(2, 19, 'Person, place, thing, or idea', true, 50, 1, true, NOW() - INTERVAL '2 days'),
(2, 20, 'ran', true, 20, 1, false, NOW() - INTERVAL '2 days'),
(2, 25, 'Storage location with a name', true, 45, 1, true, NOW() - INTERVAL '3 days'),
(2, 26, 'Repetition of code', true, 40, 1, false, NOW() - INTERVAL '3 days'),
(2, 6, '4', true, 90, 2, false, NOW() - INTERVAL '4 days'),
(2, 7, 'x = 2, 3', true, 120, 3, false, NOW() - INTERVAL '5 days'),
(2, 8, '1/2', true, 55, 2, false, NOW() - INTERVAL '6 days'),
(2, 9, '2x', true, 75, 3, false, NOW() - INTERVAL '7 days'),
(2, 10, 'x²/2 + C', true, 85, 3, false, NOW() - INTERVAL '8 days');

-- Insert User Streaks (sample streak data)
INSERT INTO assessment.user_streaks (user_id, subject_id, current_streak, longest_streak, last_activity, created_at, updated_at) VALUES
(2, 1, 5, 12, NOW(), NOW() - INTERVAL '10 days', NOW()),
(2, 3, 3, 8, NOW() - INTERVAL '1 day', NOW() - INTERVAL '15 days', NOW()),
(2, 2, 2, 6, NOW() - INTERVAL '2 days', NOW() - INTERVAL '20 days', NOW()),
(2, 20, 4, 7, NOW() - INTERVAL '3 days', NOW() - INTERVAL '25 days', NOW()),
(2, 14, 1, 5, NOW() - INTERVAL '4 days', NOW() - INTERVAL '30 days', NOW());

-- Insert Live Exams (20 sample live exams)
INSERT INTO assessment.live_exams (title, description, subject_id, class_level, duration, total_questions, passing_score, scheduled_at, status, created_by, created_at, updated_at) VALUES
('Mathematics Quiz - Algebra', 'Live algebra quiz for intermediate students', 6, 'CLASS_5', 60, 20, 70, NOW() + INTERVAL '2 hours', 'SCHEDULED', 1, NOW(), NOW()),
('Science Test - Chemistry', 'Basic chemistry concepts test', 8, 'CLASS_5', 45, 15, 65, NOW() + INTERVAL '1 day', 'SCHEDULED', 1, NOW(), NOW()),
('English Comprehension', 'Reading and grammar test', 7, 'CLASS_5', 50, 18, 60, NOW() + INTERVAL '2 days', 'SCHEDULED', 1, NOW(), NOW()),
('Physics Live Exam', 'Mechanics and motion', 12, 'CLASS_8', 75, 25, 75, NOW() + INTERVAL '3 days', 'SCHEDULED', 1, NOW(), NOW()),
('Computer Programming Quiz', 'Basic programming concepts', 20, 'CLASS_10', 90, 30, 70, NOW() + INTERVAL '4 days', 'SCHEDULED', 1, NOW(), NOW()),
('Advanced Mathematics', 'Calculus and advanced topics', 21, 'CLASS_12', 120, 40, 80, NOW() + INTERVAL '5 days', 'SCHEDULED', 1, NOW(), NOW()),
('Biology Assessment', 'Cell biology and genetics', 14, 'CLASS_8', 60, 22, 65, NOW() + INTERVAL '6 days', 'SCHEDULED', 1, NOW(), NOW()),
('History Quiz', 'World history and civilizations', 9, 'CLASS_5', 45, 16, 60, NOW() + INTERVAL '7 days', 'SCHEDULED', 1, NOW(), NOW()),
('Geography Test', 'Physical and political geography', 10, 'CLASS_5', 40, 14, 65, NOW() + INTERVAL '8 days', 'SCHEDULED', 1, NOW(), NOW()),
('Economics Exam', 'Microeconomics principles', 26, 'CLASS_12', 100, 35, 75, NOW() + INTERVAL '9 days', 'SCHEDULED', 1, NOW(), NOW()),
('Recent Math Challenge', 'Completed algebra challenge', 6, 'CLASS_5', 60, 20, 70, NOW() - INTERVAL '1 day', 'COMPLETED', 1, NOW() - INTERVAL '1 day', NOW()),
('Chemistry Lab Test', 'Completed chemistry practical', 8, 'CLASS_5', 45, 15, 65, NOW() - INTERVAL '2 days', 'COMPLETED', 1, NOW() - INTERVAL '2 days', NOW()),
('Programming Contest', 'Completed coding challenge', 20, 'CLASS_10', 120, 25, 75, NOW() - INTERVAL '3 days', 'COMPLETED', 1, NOW() - INTERVAL '3 days', NOW()),
('Literature Analysis', 'Poetry and prose analysis', 15, 'CLASS_8', 70, 20, 70, NOW() - INTERVAL '4 days', 'COMPLETED', 1, NOW() - INTERVAL '4 days', NOW()),
('Physics Lab Exam', 'Practical physics assessment', 17, 'CLASS_10', 80, 18, 70, NOW() - INTERVAL '5 days', 'COMPLETED', 1, NOW() - INTERVAL '5 days', NOW());

-- Insert Contests (15 sample contests)
INSERT INTO assessment.contests (title, description, subject_id, class_level, start_time, end_time, duration, total_questions, passing_score, prize_description, status, created_by, created_at, updated_at) VALUES
('National Math Olympiad', 'Annual mathematics competition', 1, 'CLASS_10', NOW() + INTERVAL '1 week', NOW() + INTERVAL '1 week 2 hours', 120, 50, 85, 'Gold, Silver, Bronze medals', 'UPCOMING', 1, NOW(), NOW()),
('Science Fair Competition', 'Inter-school science contest', 3, 'CLASS_8', NOW() + INTERVAL '10 days', NOW() + INTERVAL '10 days 90 minutes', 90, 30, 80, 'Science kits and certificates', 'UPCOMING', 1, NOW(), NOW()),
('Programming Championship', 'Coding competition for students', 20, 'CLASS_12', NOW() + INTERVAL '2 weeks', NOW() + INTERVAL '2 weeks 3 hours', 180, 40, 75, 'Laptops and internship opportunities', 'UPCOMING', 1, NOW(), NOW()),
('English Literature Contest', 'Poetry and essay writing', 15, 'CLASS_10', NOW() + INTERVAL '3 weeks', NOW() + INTERVAL '3 weeks 2 hours', 120, 25, 70, 'Books and certificates', 'UPCOMING', 1, NOW(), NOW()),
('Chemistry Challenge', 'Advanced chemistry problems', 18, 'CLASS_12', NOW() + INTERVAL '1 month', NOW() + INTERVAL '1 month 2 hours', 120, 35, 80, 'Lab equipment and scholarships', 'UPCOMING', 1, NOW(), NOW()),
('Quiz Bowl Finals', 'Multi-subject quiz competition', 1, 'CLASS_8', NOW() - INTERVAL '1 week', NOW() - INTERVAL '1 week' + INTERVAL '2 hours', 120, 60, 75, 'Trophies and prize money', 'COMPLETED', 1, NOW() - INTERVAL '1 week', NOW()),
('Biology Bee', 'Life sciences competition', 14, 'CLASS_10', NOW() - INTERVAL '2 weeks', NOW() - INTERVAL '2 weeks' + INTERVAL '90 minutes', 90, 40, 80, 'Microscopes and certificates', 'COMPLETED', 1, NOW() - INTERVAL '2 weeks', NOW()),
('Physics Bowl', 'Physics problem solving contest', 17, 'CLASS_12', NOW() - INTERVAL '3 weeks', NOW() - INTERVAL '3 weeks' + INTERVAL '2 hours', 120, 45, 85, 'Scientific calculators', 'COMPLETED', 1, NOW() - INTERVAL '3 weeks', NOW()),
('Regional Math Contest', 'State-level mathematics competition', 11, 'CLASS_8', NOW() - INTERVAL '1 month', NOW() - INTERVAL '1 month' + INTERVAL '2 hours', 120, 30, 75, 'Mathematical instruments', 'COMPLETED', 1, NOW() - INTERVAL '1 month', NOW()),
('Computer Science Fair', 'Programming and algorithms', 25, 'CLASS_12', NOW() - INTERVAL '6 weeks', NOW() - INTERVAL '6 weeks' + INTERVAL '3 hours', 180, 50, 80, 'Software licenses', 'COMPLETED', 1, NOW() - INTERVAL '6 weeks', NOW());

-- Insert Personalized Exams (25 sample personalized exams)
INSERT INTO assessment.personalized_exams (user_id, title, description, subject_id, class_level, duration, question_ids, instructions, passing_score, status, score, correct_answers, incorrect_answers, unanswered_questions, started_at, completed_at, created_at, updated_at) VALUES
(2, 'My Math Practice Test', 'Custom algebra practice', 6, 'CLASS_5', 45, '{1,2,3,6,7}', 'Solve all questions carefully', 70, 'COMPLETED', 85, 4, 1, 0, NOW() - INTERVAL '2 hours', NOW() - INTERVAL '1 hour', NOW() - INTERVAL '3 hours', NOW()),
(2, 'Science Review Quiz', 'Chemistry and biology review', 8, 'CLASS_5', 30, '{11,12,13,14,15}', 'Multiple choice questions', 60, 'COMPLETED', 90, 5, 0, 0, NOW() - INTERVAL '1 day', NOW() - INTERVAL '23 hours', NOW() - INTERVAL '25 hours', NOW()),
(2, 'Programming Basics Test', 'Introduction to programming', 20, 'CLASS_10', 60, '{25,26,27,28}', 'Conceptual questions', 65, 'COMPLETED', 75, 3, 1, 0, NOW() - INTERVAL '2 days', NOW() - INTERVAL '46 hours', NOW() - INTERVAL '2 days', NOW()),
(2, 'English Grammar Quiz', 'Grammar and vocabulary', 2, 'CLASS_1', 25, '{19,20,21,22}', 'Answer all questions', 70, 'SCHEDULED', NULL, NULL, NULL, NULL, NULL, NULL, NOW() - INTERVAL '1 hour', NOW()),
(2, 'Advanced Physics', 'Mechanics problems', 17, 'CLASS_10', 90, '{16,17,18}', 'Show all work', 75, 'ACTIVE', NULL, NULL, NULL, NULL, NOW() - INTERVAL '30 minutes', NULL, NOW() - INTERVAL '2 hours', NOW()),
(2, 'Biology Deep Dive', 'Cell biology focus', 14, 'CLASS_8', 50, '{14,15,27,28}', 'Detailed explanations required', 80, 'COMPLETED', 70, 3, 1, 0, NOW() - INTERVAL '3 days', NOW() - INTERVAL '71 hours', NOW() - INTERVAL '3 days', NOW()),
(2, 'Chemistry Lab Quiz', 'Practical chemistry', 13, 'CLASS_8', 40, '{12,13,30,31}', 'Focus on formulas', 65, 'COMPLETED', 95, 4, 0, 0, NOW() - INTERVAL '4 days', NOW() - INTERVAL '95 hours', NOW() - INTERVAL '4 days', NOW()),
(2, 'Literature Analysis', 'Poetry interpretation', 15, 'CLASS_8', 35, '{33,34,35}', 'Analyze themes', 70, 'SCHEDULED', NULL, NULL, NULL, NULL, NULL, NULL, NOW() - INTERVAL '30 minutes', NOW()),
(2, 'Calculus Practice', 'Derivatives and integrals', 21, 'CLASS_12', 75, '{9,10,32,33}', 'Show detailed steps', 80, 'COMPLETED', 65, 2, 2, 0, NOW() - INTERVAL '5 days', NOW() - INTERVAL '119 hours', NOW() - INTERVAL '5 days', NOW()),
(2, 'Statistics Fundamentals', 'Probability and data', 29, 'CLASS_10', 55, '{29,30}', 'Use statistical methods', 75, 'SCHEDULED', NULL, NULL, NULL, NULL, NULL, NULL, NOW() - INTERVAL '10 minutes', NOW());

COMMIT;