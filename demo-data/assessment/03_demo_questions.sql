-- =====================================================
-- ASSESSMENT SERVICE - Demo Questions
-- =====================================================
-- Comprehensive question bank for all subjects and difficulty levels

INSERT INTO assessment.questions (text, type, subject_id, topic_id, difficulty, correct_answer, explanation, points, is_active, created_by, created_at, updated_at) VALUES

-- ========== MATHEMATICS CLASS 10 - EASY QUESTIONS ==========
('What is the value of x in the equation 2x + 5 = 13?', 'MCQ', 1, 4, 'EASY', '4', 'Subtract 5 from both sides: 2x = 8, then divide by 2: x = 4', 1, true, 4, NOW(), NOW()),
('Calculate the area of a triangle with base 10 cm and height 8 cm.', 'NUMERIC', 1, 6, 'EASY', '40', 'Area = (1/2) × base × height = (1/2) × 10 × 8 = 40 cm²', 2, true, 4, NOW(), NOW()),
('What is the square root of 144?', 'NUMERIC', 1, 1, 'EASY', '12', '√144 = 12 because 12 × 12 = 144', 1, true, 4, NOW(), NOW()),
('Is 17 a prime number?', 'MCQ', 1, 1, 'EASY', 'Yes', '17 is only divisible by 1 and itself, making it a prime number', 1, true, 4, NOW(), NOW()),

-- ========== MATHEMATICS CLASS 10 - MEDIUM QUESTIONS ==========
('What is the value of sin(30°)?', 'MCQ', 1, 8, 'MEDIUM', '0.5', 'sin(30°) = 1/2 = 0.5', 2, true, 4, NOW(), NOW()),
('Find the discriminant of the quadratic equation 2x² + 5x + 3 = 0', 'NUMERIC', 1, 4, 'MEDIUM', '1', 'Discriminant = b² - 4ac = 5² - 4(2)(3) = 25 - 24 = 1', 2, true, 4, NOW(), NOW()),
('What is the 10th term of the arithmetic progression 3, 7, 11, 15, ...?', 'NUMERIC', 1, 5, 'MEDIUM', '39', 'a = 3, d = 4, 10th term = a + 9d = 3 + 9(4) = 39', 2, true, 4, NOW(), NOW()),

-- ========== MATHEMATICS CLASS 10 - HARD QUESTIONS ==========
('Find the derivative of f(x) = x² + 3x + 2', 'FILL_BLANK', 1, 4, 'HARD', '2x + 3', 'Using power rule: d/dx(x²) = 2x, d/dx(3x) = 3, d/dx(2) = 0', 3, true, 4, NOW(), NOW()),
('Prove that the sum of angles in a triangle is 180°', 'ESSAY', 1, 6, 'HARD', 'Draw a line parallel to one side through the opposite vertex. Using properties of parallel lines and alternate angles, we can show the sum equals 180°', 'This is a fundamental theorem in geometry', 4, true, 4, NOW(), NOW()),

-- ========== PHYSICS CLASS 10 - EASY QUESTIONS ==========
('What is the speed of light in vacuum?', 'MCQ', 2, 1, 'EASY', '3 × 10⁸ m/s', 'Light travels at approximately 300,000 km/s or 3 × 10⁸ m/s in vacuum', 1, true, 5, NOW(), NOW()),
('What happens to the volume of a gas when temperature increases at constant pressure?', 'MCQ', 2, 5, 'EASY', 'Volume increases', 'According to Charles Law, volume is directly proportional to temperature at constant pressure', 1, true, 5, NOW(), NOW()),
('What is the unit of electric current?', 'FILL_BLANK', 2, 3, 'EASY', 'Ampere', 'Electric current is measured in Amperes (A), named after André-Marie Ampère', 1, true, 5, NOW(), NOW()),

-- ========== PHYSICS CLASS 10 - MEDIUM QUESTIONS ==========
('Calculate the kinetic energy of a 5 kg object moving at 10 m/s.', 'NUMERIC', 2, 5, 'MEDIUM', '250', 'KE = (1/2)mv² = (1/2) × 5 × 10² = 250 J', 3, true, 5, NOW(), NOW()),
('What is Ohms Law?', 'ESSAY', 2, 3, 'MEDIUM', 'Ohms Law states that the current through a conductor is directly proportional to the voltage across it and inversely proportional to its resistance. V = IR', 'This fundamental law relates voltage, current, and resistance', 2, true, 5, NOW(), NOW()),

-- ========== PHYSICS CLASS 10 - HARD QUESTIONS ==========
('Explain electromagnetic induction with real-world examples', 'ESSAY', 2, 4, 'HARD', 'Electromagnetic induction is the production of electric current in a conductor when it moves through a magnetic field. Examples include generators, transformers, and induction motors. Faradays law governs this phenomenon.', 'This principle is fundamental to electrical power generation', 4, true, 5, NOW(), NOW()),

-- ========== CHEMISTRY CLASS 10 - EASY QUESTIONS ==========
('How many protons does carbon have?', 'NUMERIC', 3, 4, 'EASY', '6', 'Carbon has atomic number 6, which equals the number of protons', 1, true, 6, NOW(), NOW()),
('What type of bond forms between sodium and chlorine?', 'MCQ', 3, 2, 'EASY', 'Ionic bond', 'Sodium loses an electron to chlorine, forming Na⁺ and Cl⁻ ions', 1, true, 6, NOW(), NOW()),
('What is the pH of pure water at 25°C?', 'NUMERIC', 3, 1, 'EASY', '7', 'Pure water is neutral with pH = 7', 1, true, 6, NOW(), NOW()),

-- ========== CHEMISTRY CLASS 10 - MEDIUM QUESTIONS ==========
('What is the general formula for alkanes?', 'FILL_BLANK', 3, 3, 'MEDIUM', 'CnH2n+2', 'Alkanes are saturated hydrocarbons with this general formula', 2, true, 6, NOW(), NOW()),
('Explain the difference between ionic and covalent bonds', 'ESSAY', 3, 2, 'MEDIUM', 'Ionic bonds form between metals and non-metals through electron transfer, while covalent bonds form between non-metals through electron sharing. Ionic compounds conduct electricity when dissolved, covalent compounds typically do not.', 'Understanding bonding is crucial for predicting compound properties', 3, true, 6, NOW(), NOW()),

-- ========== BIOLOGY CLASS 10 - EASY QUESTIONS ==========
('What is the powerhouse of the cell?', 'MCQ', 4, 1, 'EASY', 'Mitochondria', 'Mitochondria produce ATP through cellular respiration', 1, true, 7, NOW(), NOW()),
('What does DNA stand for?', 'FILL_BLANK', 4, 7, 'EASY', 'Deoxyribonucleic Acid', 'DNA carries genetic information in all living organisms', 1, true, 7, NOW(), NOW()),
('Which gas is released during photosynthesis?', 'MCQ', 4, 1, 'EASY', 'Oxygen', 'Plants release oxygen as a byproduct of photosynthesis', 1, true, 7, NOW(), NOW()),

-- ========== BIOLOGY CLASS 10 - MEDIUM QUESTIONS ==========
('Who proposed the theory of evolution by natural selection?', 'MCQ', 4, 7, 'MEDIUM', 'Charles Darwin', 'Darwin published "On the Origin of Species" in 1859', 2, true, 7, NOW(), NOW()),
('Explain the process of respiration in humans', 'ESSAY', 4, 2, 'MEDIUM', 'Human respiration involves breathing (inhalation and exhalation), gas exchange in the lungs (oxygen enters blood, carbon dioxide exits), and cellular respiration where oxygen is used to produce ATP', 'Respiration is essential for cellular energy production', 3, true, 7, NOW(), NOW()),

-- ========== COMPUTER SCIENCE CLASS 11 - EASY QUESTIONS ==========
('What is a variable in programming?', 'ESSAY', 15, 1, 'EASY', 'A variable is a storage location with an associated name that contains data which can be modified during program execution', 'Variables are fundamental building blocks of programs', 2, true, 8, NOW(), NOW()),
('Which data structure follows LIFO principle?', 'MCQ', 15, 4, 'MEDIUM', 'Stack', 'Stack follows Last In, First Out principle', 2, true, 8, NOW(), NOW()),
('What does HTML stand for?', 'FILL_BLANK', 15, 8, 'EASY', 'HyperText Markup Language', 'HTML is the standard markup language for creating web pages', 1, true, 8, NOW(), NOW()),

-- ========== COMPUTER SCIENCE CLASS 11 - MEDIUM QUESTIONS ==========
('What is the time complexity of binary search?', 'MCQ', 15, 4, 'MEDIUM', 'O(log n)', 'Binary search divides the search space in half each iteration', 3, true, 8, NOW(), NOW()),
('Explain the concept of inheritance in OOP', 'ESSAY', 15, 6, 'MEDIUM', 'Inheritance is a mechanism where a new class inherits properties and methods from an existing class. It promotes code reusability and establishes IS-A relationships between classes', 'Inheritance is a fundamental OOP concept', 3, true, 8, NOW(), NOW()),

-- ========== COMPUTER SCIENCE CLASS 12 - HARD QUESTIONS ==========
('What is the difference between SQL and NoSQL databases?', 'ESSAY', 25, 3, 'HARD', 'SQL databases are relational, use structured schemas, and support ACID properties. NoSQL databases are non-relational, schema-flexible, and designed for scalability. SQL uses structured query language, while NoSQL uses various query methods.', 'Understanding database types is crucial for system design', 4, true, 8, NOW(), NOW()),
('Implement a function to reverse a linked list', 'ESSAY', 25, 1, 'HARD', 'Use three pointers: previous, current, and next. Iterate through the list, reversing the links by setting current.next = previous, then move all pointers forward', 'This is a common algorithmic problem', 5, true, 8, NOW(), NOW()),

-- ========== ENGLISH CLASS 10 QUESTIONS ==========
('Who wrote "Romeo and Juliet"?', 'MCQ', 5, NULL, 'EASY', 'William Shakespeare', 'Shakespeare wrote this famous tragedy in the 1590s', 1, true, 9, NOW(), NOW()),
('What is a metaphor?', 'ESSAY', 5, NULL, 'MEDIUM', 'A metaphor is a figure of speech that directly compares two unlike things without using "like" or "as". It states that one thing is another thing to create a vivid comparison.', 'Metaphors are important literary devices', 2, true, 9, NOW(), NOW()),
('Identify the subject in: "The quick brown fox jumps over the lazy dog"', 'FILL_BLANK', 5, NULL, 'EASY', 'The quick brown fox', 'The subject is who or what the sentence is about', 1, true, 9, NOW(), NOW()),

-- ========== MIXED DIFFICULTY QUESTIONS FOR VARIETY ==========
('What is the capital of France?', 'MCQ', 6, NULL, 'EASY', 'Paris', 'Paris is the capital and largest city of France', 1, true, 10, NOW(), NOW()),
('Explain the water cycle', 'ESSAY', 7, NULL, 'MEDIUM', 'The water cycle involves evaporation from water bodies, condensation in clouds, precipitation as rain/snow, and collection back into water bodies. It is driven by solar energy and gravity.', 'The water cycle is essential for life on Earth', 3, true, 10, NOW(), NOW()),
('What is the largest planet in our solar system?', 'MCQ', 2, 6, 'EASY', 'Jupiter', 'Jupiter is the largest planet, with a mass greater than all other planets combined', 1, true, 5, NOW(), NOW()),
('Calculate: 15% of 240', 'NUMERIC', 1, 11, 'EASY', '36', '15% of 240 = (15/100) × 240 = 36', 1, true, 4, NOW(), NOW()),
('What is photosynthesis?', 'ESSAY', 4, 1, 'MEDIUM', 'Photosynthesis is the process by which plants convert light energy into chemical energy (glucose). The equation is: 6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂', 'This process is vital for life on Earth', 3, true, 7, NOW(), NOW());

-- Print confirmation
SELECT 'Demo questions created successfully' as status;
SELECT COUNT(*) as total_questions FROM assessment.questions;
SELECT difficulty, COUNT(*) as count FROM assessment.questions GROUP BY difficulty;