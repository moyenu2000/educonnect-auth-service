-- =====================================================
-- ASSESSMENT SERVICE - Subjects and Topics
-- =====================================================
-- Comprehensive subjects and topics for all class levels

-- Insert comprehensive subjects
INSERT INTO assessment.subjects (name, description, class_level, display_order, is_active, created_at, updated_at) VALUES

-- ========== CLASS 10 SUBJECTS ==========
('Mathematics', 'Core mathematical concepts including algebra, geometry, and trigonometry', 'CLASS_10', 1, true, NOW(), NOW()),
('Science - Physics', 'Fundamental principles of physics, motion, energy, and matter', 'CLASS_10', 2, true, NOW(), NOW()),
('Science - Chemistry', 'Chemical reactions, atomic structure, and molecular behavior', 'CLASS_10', 3, true, NOW(), NOW()),
('Science - Biology', 'Life sciences, human body, plants, and environmental biology', 'CLASS_10', 4, true, NOW(), NOW()),
('English', 'English language, literature, grammar, and communication skills', 'CLASS_10', 5, true, NOW(), NOW()),
('Social Science - History', 'World history, Indian history, and historical developments', 'CLASS_10', 6, true, NOW(), NOW()),
('Social Science - Geography', 'Physical and human geography, maps, and environmental studies', 'CLASS_10', 7, true, NOW(), NOW()),
('Social Science - Political Science', 'Democratic politics, governance, and civic responsibilities', 'CLASS_10', 8, true, NOW(), NOW()),
('Hindi', 'Hindi language, literature, and communication', 'CLASS_10', 9, true, NOW(), NOW()),
('Sanskrit', 'Sanskrit language, literature, and cultural studies', 'CLASS_10', 10, true, NOW(), NOW()),

-- ========== CLASS 11 SUBJECTS ==========
('Mathematics (Advanced)', 'Advanced mathematics including calculus, probability, and statistics', 'CLASS_11', 11, true, NOW(), NOW()),
('Physics (Advanced)', 'Advanced physics concepts, mechanics, thermodynamics, and waves', 'CLASS_11', 12, true, NOW(), NOW()),
('Chemistry (Advanced)', 'Organic, inorganic, and physical chemistry', 'CLASS_11', 13, true, NOW(), NOW()),
('Biology (Advanced)', 'Advanced biology, biochemistry, and molecular biology', 'CLASS_11', 14, true, NOW(), NOW()),
('Computer Science', 'Programming fundamentals, data structures, and algorithms', 'CLASS_11', 15, true, NOW(), NOW()),
('Economics', 'Microeconomics, macroeconomics, and economic principles', 'CLASS_11', 16, true, NOW(), NOW()),
('Business Studies', 'Business principles, management, and entrepreneurship', 'CLASS_11', 17, true, NOW(), NOW()),
('Accountancy', 'Financial accounting, cost accounting, and business mathematics', 'CLASS_11', 18, true, NOW(), NOW()),
('Psychology', 'Human behavior, cognitive processes, and psychological theories', 'CLASS_11', 19, true, NOW(), NOW()),
('Physical Education', 'Sports, fitness, health, and physical wellness', 'CLASS_11', 20, true, NOW(), NOW()),

-- ========== CLASS 12 SUBJECTS ==========
('Mathematics (Expert)', 'Expert level mathematics for competitive exams and higher studies', 'CLASS_12', 21, true, NOW(), NOW()),
('Physics (Expert)', 'Advanced physics for engineering and science careers', 'CLASS_12', 22, true, NOW(), NOW()),
('Chemistry (Expert)', 'Expert chemistry for medical and engineering entrance exams', 'CLASS_12', 23, true, NOW(), NOW()),
('Biology (Expert)', 'Advanced biology for medical entrance examinations', 'CLASS_12', 24, true, NOW(), NOW()),
('Computer Science (Advanced)', 'Advanced programming, software engineering, and AI concepts', 'CLASS_12', 25, true, NOW(), NOW()),
('Engineering Drawing', 'Technical drawing, CAD, and engineering graphics', 'CLASS_12', 26, true, NOW(), NOW()),
('Biotechnology', 'Applied biology, genetic engineering, and biotechnology applications', 'CLASS_12', 27, true, NOW(), NOW()),
('Environmental Science', 'Environmental studies, ecology, and sustainability', 'CLASS_12', 28, true, NOW(), NOW()),
('Statistics', 'Advanced statistics, data analysis, and research methods', 'CLASS_12', 29, true, NOW(), NOW()),
('Philosophy', 'Philosophical thinking, ethics, and logical reasoning', 'CLASS_12', 30, true, NOW(), NOW());

-- Insert comprehensive topics for each subject
INSERT INTO assessment.topics (name, description, subject_id, display_order, is_active, created_at, updated_at) VALUES

-- ========== MATHEMATICS CLASS 10 TOPICS ==========
('Real Numbers', 'Rational and irrational numbers, decimal expansions', 1, 1, true, NOW(), NOW()),
('Polynomials', 'Polynomial expressions, factorization, and algebraic identities', 1, 2, true, NOW(), NOW()),
('Linear Equations', 'Linear equations in two variables and their graphs', 1, 3, true, NOW(), NOW()),
('Quadratic Equations', 'Quadratic equations and their solutions', 1, 4, true, NOW(), NOW()),
('Arithmetic Progressions', 'Sequences, series, and arithmetic progressions', 1, 5, true, NOW(), NOW()),
('Triangles', 'Similar triangles, Pythagoras theorem, and triangle properties', 1, 6, true, NOW(), NOW()),
('Coordinate Geometry', 'Distance formula, section formula, and coordinate systems', 1, 7, true, NOW(), NOW()),
('Trigonometry', 'Trigonometric ratios, identities, and applications', 1, 8, true, NOW(), NOW()),
('Circles', 'Circle properties, tangents, and chord theorems', 1, 9, true, NOW(), NOW()),
('Surface Area and Volume', 'Mensuration of 3D objects and their properties', 1, 10, true, NOW(), NOW()),
('Statistics', 'Data analysis, mean, median, mode, and probability', 1, 11, true, NOW(), NOW()),

-- ========== PHYSICS CLASS 10 TOPICS ==========
('Light - Reflection and Refraction', 'Laws of reflection, refraction, and optical phenomena', 2, 1, true, NOW(), NOW()),
('Human Eye and Colorful World', 'Vision, defects of vision, and dispersion of light', 2, 2, true, NOW(), NOW()),
('Electricity', 'Current electricity, Ohms law, and electrical circuits', 2, 3, true, NOW(), NOW()),
('Magnetic Effects of Electric Current', 'Magnetism, electromagnetic induction, and motors', 2, 4, true, NOW(), NOW()),
('Sources of Energy', 'Renewable and non-renewable energy sources', 2, 5, true, NOW(), NOW()),
('Our Environment', 'Ecosystem, pollution, and environmental management', 2, 6, true, NOW(), NOW()),

-- ========== CHEMISTRY CLASS 10 TOPICS ==========
('Acids, Bases and Salts', 'Properties of acids, bases, pH scale, and salt formation', 3, 1, true, NOW(), NOW()),
('Metals and Non-metals', 'Properties, extraction, and corrosion of metals', 3, 2, true, NOW(), NOW()),
('Carbon and its Compounds', 'Organic chemistry basics, hydrocarbons, and functional groups', 3, 3, true, NOW(), NOW()),
('Periodic Classification', 'Periodic table, trends, and element properties', 3, 4, true, NOW(), NOW()),
('Life Processes', 'Chemical processes in living organisms', 3, 5, true, NOW(), NOW()),
('Control and Coordination', 'Chemical coordination in plants and animals', 3, 6, true, NOW(), NOW()),

-- ========== BIOLOGY CLASS 10 TOPICS ==========
('Life Processes - Nutrition', 'Autotrophic and heterotrophic nutrition, digestion', 4, 1, true, NOW(), NOW()),
('Life Processes - Respiration', 'Cellular respiration, breathing, and gas exchange', 4, 2, true, NOW(), NOW()),
('Life Processes - Transportation', 'Circulatory system, blood, and lymphatic system', 4, 3, true, NOW(), NOW()),
('Life Processes - Excretion', 'Excretory system and waste removal', 4, 4, true, NOW(), NOW()),
('Control and Coordination', 'Nervous system, hormones, and plant responses', 4, 5, true, NOW(), NOW()),
('How do Organisms Reproduce?', 'Sexual and asexual reproduction in plants and animals', 4, 6, true, NOW(), NOW()),
('Heredity and Evolution', 'Genetics, variation, and evolutionary biology', 4, 7, true, NOW(), NOW()),
('Natural Resource Management', 'Conservation of forests, water, and wildlife', 4, 8, true, NOW(), NOW()),

-- ========== COMPUTER SCIENCE CLASS 11 TOPICS ==========
('Programming Fundamentals', 'Variables, data types, and basic programming concepts', 15, 1, true, NOW(), NOW()),
('Control Structures', 'Conditional statements, loops, and program flow control', 15, 2, true, NOW(), NOW()),
('Functions and Modules', 'Function definition, parameters, and modular programming', 15, 3, true, NOW(), NOW()),
('Data Structures', 'Lists, tuples, dictionaries, and basic data organization', 15, 4, true, NOW(), NOW()),
('File Handling', 'Reading from and writing to files', 15, 5, true, NOW(), NOW()),
('Object-Oriented Programming', 'Classes, objects, inheritance, and encapsulation', 15, 6, true, NOW(), NOW()),
('Database Concepts', 'Database design, SQL basics, and data management', 15, 7, true, NOW(), NOW()),
('Computer Networks', 'Internet, protocols, and network fundamentals', 15, 8, true, NOW(), NOW()),

-- ========== COMPUTER SCIENCE CLASS 12 TOPICS ==========
('Advanced Data Structures', 'Stacks, queues, trees, and graph algorithms', 25, 1, true, NOW(), NOW()),
('Algorithm Design', 'Sorting, searching, and algorithmic complexity', 25, 2, true, NOW(), NOW()),
('Database Management', 'Advanced SQL, normalization, and database design', 25, 3, true, NOW(), NOW()),
('Web Development', 'HTML, CSS, JavaScript, and web technologies', 25, 4, true, NOW(), NOW()),
('Software Engineering', 'Software development lifecycle and project management', 25, 5, true, NOW(), NOW()),
('Artificial Intelligence', 'Machine learning basics and AI applications', 25, 6, true, NOW(), NOW()),
('Cybersecurity', 'Security principles, encryption, and safe computing practices', 25, 7, true, NOW(), NOW()),
('Mobile App Development', 'Mobile platforms and app development fundamentals', 25, 8, true, NOW(), NOW());

-- Print confirmation
SELECT 'Subjects and topics created successfully' as status;
SELECT COUNT(*) as total_subjects FROM assessment.subjects;
SELECT COUNT(*) as total_topics FROM assessment.topics;