-- =====================================================
-- ASSESSMENT SERVICE - Practice Problems
-- =====================================================
-- Practice problems for students to practice questions

INSERT INTO assessment.practice_problems (question_id, difficulty_override, hint_text, hint_level, solution_steps, created_by, created_at, updated_at) VALUES

-- ========== MATHEMATICS PRACTICE PROBLEMS ==========
(1, NULL, 'Start by identifying what you need to find (x) and then use inverse operations.', 1, 'Step 1: Subtract 5 from both sides: 2x + 5 - 5 = 13 - 5\nStep 2: Simplify: 2x = 8\nStep 3: Divide both sides by 2: x = 4', 1, NOW(), NOW()),

(2, NULL, 'Remember the formula for area of a triangle: Area = (1/2) × base × height', 1, 'Step 1: Identify given values: base = 10 cm, height = 8 cm\nStep 2: Apply formula: Area = (1/2) × 10 × 8\nStep 3: Calculate: Area = 40 cm²', 1, NOW(), NOW()),

(3, NULL, 'Think about which number multiplied by itself gives 144.', 1, 'Step 1: Find the number that when squared equals 144\nStep 2: 12 × 12 = 144\nStep 3: Therefore √144 = 12', 1, NOW(), NOW()),

(5, NULL, 'Remember the standard trigonometric values. sin(30°) is one of the basic angles.', 1, 'Step 1: Recall that sin(30°) = 1/2\nStep 2: Convert to decimal: 1/2 = 0.5', 1, NOW(), NOW()),

(6, NULL, 'For quadratic equation ax² + bx + c = 0, discriminant = b² - 4ac', 2, 'Step 1: Identify coefficients: a = 2, b = 5, c = 3\nStep 2: Apply formula: b² - 4ac = 5² - 4(2)(3)\nStep 3: Calculate: 25 - 24 = 1', 1, NOW(), NOW()),

-- ========== PHYSICS PRACTICE PROBLEMS ==========
(8, NULL, 'Light travels at a constant speed in vacuum. This is a fundamental physical constant.', 1, 'Step 1: Recall that light speed in vacuum is approximately 300,000 km/s\nStep 2: Convert to standard units: 3 × 10⁸ m/s', 1, NOW(), NOW()),

(11, NULL, 'Use the kinetic energy formula: KE = (1/2)mv²', 2, 'Step 1: Identify given values: m = 5 kg, v = 10 m/s\nStep 2: Apply formula: KE = (1/2) × 5 × 10²\nStep 3: Calculate: KE = (1/2) × 5 × 100 = 250 J', 1, NOW(), NOW()),

-- ========== CHEMISTRY PRACTICE PROBLEMS ==========
(13, NULL, 'The atomic number tells you the number of protons in an atom.', 1, 'Step 1: Look up carbon in the periodic table\nStep 2: Find atomic number = 6\nStep 3: Atomic number = number of protons = 6', 1, NOW(), NOW()),

(15, NULL, 'Pure water at 25°C is neutral, meaning it has equal H⁺ and OH⁻ ions.', 1, 'Step 1: Understand that pure water is neutral\nStep 2: Neutral solutions have pH = 7\nStep 3: Therefore, pure water pH = 7', 1, NOW(), NOW()),

-- ========== BIOLOGY PRACTICE PROBLEMS ==========
(17, NULL, 'Think about which organelle is responsible for producing energy (ATP) in cells.', 1, 'Step 1: Recall that cells need energy to function\nStep 2: Mitochondria produce ATP through cellular respiration\nStep 3: Therefore, mitochondria are called the "powerhouse of the cell"', 1, NOW(), NOW()),

(19, NULL, 'This gas is essential for most life forms and is produced as a byproduct of photosynthesis.', 1, 'Step 1: Photosynthesis equation: 6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂\nStep 2: Identify the byproduct: O₂ (oxygen)\nStep 3: Plants release oxygen during photosynthesis', 1, NOW(), NOW()),

-- ========== COMPUTER SCIENCE PRACTICE PROBLEMS ==========
(22, NULL, 'Think about data structures that add and remove elements from the same end.', 2, 'Step 1: Understand LIFO = Last In, First Out\nStep 2: Consider which data structure follows this principle\nStep 3: Stack: elements are added and removed from the top only', 1, NOW(), NOW()),

(24, NULL, 'Consider how the search space is reduced in each iteration of binary search.', 2, 'Step 1: Binary search divides array in half each time\nStep 2: This gives logarithmic reduction: log₂(n)\nStep 3: Time complexity is O(log n)', 1, NOW(), NOW()),

-- ========== ENGLISH PRACTICE PROBLEMS ==========
(26, NULL, 'This is one of Shakespeare''s most famous tragedies about young lovers.', 1, 'Step 1: Identify the play as a Shakespearean tragedy\nStep 2: Recall Shakespeare''s major works\nStep 3: "Romeo and Juliet" is written by William Shakespeare', 1, NOW(), NOW()),

-- ========== GENERAL KNOWLEDGE PRACTICE PROBLEMS ==========
(30, NULL, 'Think about major European capitals and their countries.', 1, 'Step 1: Identify that France is in Europe\nStep 2: Recall major European capitals\nStep 3: Paris is the capital of France', 1, NOW(), NOW()),

(32, NULL, 'Consider the relative sizes of planets in our solar system.', 1, 'Step 1: List the planets by size\nStep 2: Jupiter is significantly larger than other planets\nStep 3: Jupiter is the largest planet in our solar system', 1, NOW(), NOW()),

(33, NULL, 'To find percentage, multiply the number by the percentage and divide by 100.', 1, 'Step 1: Convert percentage to decimal: 15% = 15/100 = 0.15\nStep 2: Multiply: 240 × 0.15\nStep 3: Calculate: 240 × 0.15 = 36', 1, NOW(), NOW());

-- Print confirmation
SELECT 'Practice problems created successfully' as status;
SELECT COUNT(*) as total_practice_problems FROM assessment.practice_problems;