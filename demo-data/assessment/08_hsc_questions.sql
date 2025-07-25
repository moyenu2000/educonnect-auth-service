-- =====================================================
-- ASSESSMENT SERVICE - HSC Questions for Bangladesh Students
-- =====================================================
-- Comprehensive question bank for CLASS_11 and CLASS_12 subjects
-- Based on Bangladesh HSC curriculum and exam patterns

-- HSC MATHEMATICS (CLASS_11 and CLASS_12) QUESTIONS
INSERT INTO assessment.questions (text, type, subject_id, topic_id, difficulty, correct_answer_text, explanation, points, is_active, created_by, created_at, updated_at) VALUES

-- Advanced Mathematics CLASS_11
('What is the derivative of sin(x)?', 'MCQ', 11, NULL, 'MEDIUM', 'cos(x)', 'The derivative of sin(x) is cos(x) by standard differentiation rules', 2, true, 4, NOW(), NOW()),
('Find the limit of (x²-4)/(x-2) as x approaches 2', 'MCQ', 11, NULL, 'MEDIUM', '4', 'Factor the numerator: (x+2)(x-2)/(x-2) = x+2, so limit is 2+2=4', 2, true, 4, NOW(), NOW()),
('What is the sum of first 10 terms of the series 2, 4, 6, 8, ...?', 'NUMERIC', 11, NULL, 'EASY', '110', 'This is arithmetic series with a=2, d=2. Sum = n/2[2a+(n-1)d] = 10/2[4+9×2] = 110', 2, true, 4, NOW(), NOW()),
('If log₂(x) = 3, what is the value of x?', 'MCQ', 11, NULL, 'EASY', '8', 'log₂(x) = 3 means 2³ = x, so x = 8', 1, true, 4, NOW(), NOW()),
('What is the coefficient of x² in the expansion of (x+2)³?', 'NUMERIC', 11, NULL, 'MEDIUM', '12', 'Using binomial theorem: (x+2)³ = x³ + 3x²(2) + 3x(2²) + 2³, coefficient of x² is 3×2 = 6... wait, it is 3×2² = 12', 2, true, 4, NOW(), NOW()),

-- Expert Mathematics CLASS_12
('What is the integral of 1/x dx?', 'MCQ', 21, NULL, 'MEDIUM', 'ln|x| + C', 'The integral of 1/x is the natural logarithm of absolute value of x plus constant', 3, true, 4, NOW(), NOW()),
('Find the area under the curve y = x² from x = 0 to x = 2', 'NUMERIC', 21, NULL, 'HARD', '8/3', 'Area = ∫₀² x² dx = [x³/3]₀² = 8/3 - 0 = 8/3', 3, true, 4, NOW(), NOW()),
('What is the equation of tangent to the curve y = x² at point (1,1)?', 'FILL_BLANK', 21, NULL, 'HARD', 'y = 2x - 1', 'dy/dx = 2x, at (1,1) slope = 2. Using point-slope form: y-1 = 2(x-1), so y = 2x-1', 3, true, 4, NOW(), NOW()),
('If matrix A = [[1,2],[3,4]], what is det(A)?', 'NUMERIC', 21, NULL, 'MEDIUM', '-2', 'det(A) = 1×4 - 2×3 = 4 - 6 = -2', 2, true, 4, NOW(), NOW()),
('What is the probability of getting exactly 2 heads in 3 coin tosses?', 'MCQ', 21, NULL, 'MEDIUM', '3/8', 'Using binomial probability: C(3,2) × (1/2)² × (1/2)¹ = 3 × 1/8 = 3/8', 2, true, 4, NOW(), NOW()),

-- HSC PHYSICS (CLASS_11 and CLASS_12) QUESTIONS
('What is the dimensional formula of momentum?', 'FILL_BLANK', 12, NULL, 'MEDIUM', '[MLT⁻¹]', 'Momentum = mass × velocity, so dimensions are [M][LT⁻¹] = [MLT⁻¹]', 2, true, 5, NOW(), NOW()),
('A car accelerates from 0 to 60 km/h in 10 seconds. What is its acceleration?', 'NUMERIC', 12, NULL, 'EASY', '1.67', '60 km/h = 16.67 m/s, acceleration = (16.67-0)/10 = 1.67 m/s²', 2, true, 5, NOW(), NOW()),
('What is the work done by a force of 10 N in moving an object 5 meters?', 'NUMERIC', 12, NULL, 'EASY', '50', 'Work = Force × Distance = 10 N × 5 m = 50 J', 1, true, 5, NOW(), NOW()),
('State Newton''s second law of motion', 'ESSAY', 12, NULL, 'MEDIUM', 'The acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass. F = ma', 'This is fundamental law of mechanics', 3, true, 5, NOW(), NOW()),
('What is the escape velocity from Earth\'s surface?', 'MCQ', 12, NULL, 'HARD', '11.2 km/s', 'Escape velocity from Earth is approximately 11.2 km/s or 11,200 m/s', 3, true, 5, NOW(), NOW()),

-- Advanced Physics CLASS_12
('What is the energy of a photon with frequency 5×10¹⁴ Hz?', 'NUMERIC', 22, NULL, 'HARD', '3.31e-19', 'E = hν = 6.626×10⁻³⁴ × 5×10¹⁴ = 3.31×10⁻¹⁹ J', 3, true, 5, NOW(), NOW()),
('What is the de Broglie wavelength formula?', 'FILL_BLANK', 22, NULL, 'HARD', 'λ = h/p', 'de Broglie wavelength λ = h/p where h is Planck constant and p is momentum', 3, true, 5, NOW(), NOW()),
('In a Young\'s double slit experiment, what causes interference?', 'ESSAY', 22, NULL, 'HARD', 'Interference occurs when light waves from two coherent sources (the two slits) superpose. Constructive interference creates bright fringes where path difference is nλ, destructive interference creates dark fringes where path difference is (n+1/2)λ', 'This demonstrates wave nature of light', 4, true, 5, NOW(), NOW()),
('What is the threshold frequency in photoelectric effect?', 'MCQ', 22, NULL, 'HARD', 'Minimum frequency for electron emission', 'Threshold frequency is the minimum frequency of light required to emit electrons from a metal surface', 3, true, 5, NOW(), NOW()),
('Calculate the capacitance of a parallel plate capacitor with area 0.01 m² and separation 0.001 m', 'NUMERIC', 22, NULL, 'MEDIUM', '8.85e-11', 'C = ε₀A/d = 8.85×10⁻¹² × 0.01 / 0.001 = 8.85×10⁻¹¹ F', 3, true, 5, NOW(), NOW()),

-- HSC CHEMISTRY (CLASS_11 and CLASS_12) QUESTIONS
('What is the electronic configuration of chlorine (Z=17)?', 'FILL_BLANK', 13, NULL, 'MEDIUM', '1s² 2s² 2p⁶ 3s² 3p⁵', 'Chlorine has 17 electrons distributed as 1s² 2s² 2p⁶ 3s² 3p⁵', 2, true, 6, NOW(), NOW()),
('What is the molecular formula of benzene?', 'MCQ', 13, NULL, 'EASY', 'C₆H₆', 'Benzene is an aromatic compound with formula C₆H₆', 1, true, 6, NOW(), NOW()),
('Calculate the molar mass of CaCO₃', 'NUMERIC', 13, NULL, 'EASY', '100', 'Ca=40, C=12, O=16×3=48. Total = 40+12+48 = 100 g/mol', 2, true, 6, NOW(), NOW()),
('What is the pH of 0.1 M HCl solution?', 'NUMERIC', 13, NULL, 'MEDIUM', '1', 'HCl is strong acid, [H⁺] = 0.1 M, pH = -log(0.1) = 1', 2, true, 6, NOW(), NOW()),
('Name the process of conversion of alkenes to alkanes', 'FILL_BLANK', 13, NULL, 'MEDIUM', 'Hydrogenation', 'Addition of hydrogen to alkenes in presence of catalyst converts them to alkanes', 2, true, 6, NOW(), NOW()),

-- Expert Chemistry CLASS_12
('What is the rate law for a first-order reaction?', 'FILL_BLANK', 23, NULL, 'HARD', 'Rate = k[A]', 'For first-order reaction A → B, rate is directly proportional to concentration of A', 3, true, 6, NOW(), NOW()),
('Calculate the equilibrium constant for N₂ + 3H₂ ⇌ 2NH₃ if [N₂]=1M, [H₂]=1M, [NH₃]=2M at equilibrium', 'NUMERIC', 23, NULL, 'HARD', '4', 'K = [NH₃]² / ([N₂][H₂]³) = 4 / (1×1) = 4', 3, true, 6, NOW(), NOW()),
('What is the hybridization of carbon in methane?', 'MCQ', 23, NULL, 'MEDIUM', 'sp³', 'Carbon in methane forms 4 sigma bonds using sp³ hybrid orbitals', 2, true, 6, NOW(), NOW()),
('Name the functional group -COOH', 'FILL_BLANK', 23, NULL, 'EASY', 'Carboxyl', 'The -COOH group is called carboxyl group, characteristic of carboxylic acids', 1, true, 6, NOW(), NOW()),
('What happens during electrolysis of water?', 'ESSAY', 23, NULL, 'MEDIUM', 'During electrolysis, water molecules decompose into hydrogen and oxygen gases. At cathode: 2H⁺ + 2e⁻ → H₂, At anode: 4OH⁻ → O₂ + 2H₂O + 4e⁻', 'This demonstrates decomposition by electrical energy', 3, true, 6, NOW(), NOW()),

-- HSC BIOLOGY (CLASS_11 and CLASS_12) QUESTIONS
('What is the site of protein synthesis in a cell?', 'MCQ', 14, NULL, 'EASY', 'Ribosome', 'Ribosomes are the cellular organelles where protein synthesis occurs', 1, true, 7, NOW(), NOW()),
('How many chromosomes does a normal human cell have?', 'NUMERIC', 14, NULL, 'EASY', '46', 'Humans have 46 chromosomes (23 pairs) in somatic cells', 1, true, 7, NOW(), NOW()),
('What is the full form of ATP?', 'FILL_BLANK', 14, NULL, 'EASY', 'Adenosine Triphosphate', 'ATP stands for Adenosine Triphosphate, the energy currency of cells', 1, true, 7, NOW(), NOW()),
('Name the process by which plants lose water through leaves', 'FILL_BLANK', 14, NULL, 'MEDIUM', 'Transpiration', 'Transpiration is the loss of water vapor from plant leaves through stomata', 2, true, 7, NOW(), NOW()),
('What is the role of chlorophyll in photosynthesis?', 'ESSAY', 14, NULL, 'MEDIUM', 'Chlorophyll absorbs light energy and converts it into chemical energy. It primarily absorbs red and blue light while reflecting green light. This captured energy drives the conversion of CO₂ and H₂O into glucose', 'Chlorophyll is essential for capturing solar energy', 3, true, 7, NOW(), NOW()),

-- Expert Biology CLASS_12
('What is the central dogma of molecular biology?', 'ESSAY', 24, NULL, 'HARD', 'The central dogma describes the flow of genetic information: DNA → RNA → Protein. DNA is transcribed to RNA, which is translated to proteins. This shows how genetic information is expressed', 'This is fundamental to understanding genetics', 4, true, 7, NOW(), NOW()),
('How many codons code for amino acids?', 'NUMERIC', 24, NULL, 'HARD', '61', 'Out of 64 possible codons, 61 code for amino acids and 3 are stop codons', 3, true, 7, NOW(), NOW()),
('What is the function of restriction enzymes?', 'ESSAY', 24, NULL, 'HARD', 'Restriction enzymes cut DNA at specific recognition sequences. They are used in genetic engineering to cut and manipulate DNA fragments. Different enzymes recognize different sequences and make different types of cuts', 'These are tools of genetic engineering', 3, true, 7, NOW(), NOW()),
('What is the difference between mitosis and meiosis?', 'ESSAY', 24, NULL, 'MEDIUM', 'Mitosis produces two identical diploid cells for growth and repair. Meiosis produces four genetically different haploid gametes for reproduction. Mitosis has one division, meiosis has two divisions with crossing over', 'These are two types of cell division', 4, true, 7, NOW(), NOW()),
('What is gene therapy?', 'ESSAY', 24, NULL, 'HARD', 'Gene therapy involves introducing genetic material into patient cells to treat disease. It can replace faulty genes, silence harmful genes, or introduce new genes to fight disease. Methods include viral vectors and direct injection', 'This is a modern medical technique', 4, true, 7, NOW(), NOW()),

-- HSC COMPUTER SCIENCE QUESTIONS
('What is the time complexity of quicksort in average case?', 'MCQ', 25, 2, 'HARD', 'O(n log n)', 'Quicksort has average time complexity of O(n log n) due to divide and conquer approach', 3, true, 8, NOW(), NOW()),
('What is polymorphism in object-oriented programming?', 'ESSAY', 25, 1, 'HARD', 'Polymorphism allows objects of different classes to be treated as objects of a common base class. Same interface can be used for different underlying data types. Examples include method overriding and method overloading', 'Key concept in OOP design', 4, true, 8, NOW(), NOW()),
('What is the difference between INNER JOIN and LEFT JOIN in SQL?', 'ESSAY', 25, 3, 'HARD', 'INNER JOIN returns only matching records from both tables. LEFT JOIN returns all records from left table and matching records from right table, with NULL for non-matching right table records', 'Important for database queries', 3, true, 8, NOW(), NOW()),
('What is Big O notation?', 'ESSAY', 25, 2, 'MEDIUM', 'Big O notation describes the upper bound of algorithm time or space complexity as input size grows. It helps compare algorithm efficiency. Common complexities: O(1), O(log n), O(n), O(n log n), O(n²)', 'Fundamental concept in algorithm analysis', 3, true, 8, NOW(), NOW()),
('What is the difference between stack and heap memory?', 'ESSAY', 25, 1, 'HARD', 'Stack memory stores local variables and function call information in LIFO order. It is fast but limited in size. Heap memory stores dynamically allocated objects, is larger but slower to access, and requires manual memory management in some languages', 'Important for understanding memory management', 4, true, 8, NOW(), NOW()),

-- HSC ECONOMICS QUESTIONS
('What is GDP?', 'ESSAY', 16, NULL, 'MEDIUM', 'Gross Domestic Product (GDP) is the total monetary value of all goods and services produced within a country in a specific time period. It measures economic activity and is used to compare economic performance between countries', 'Key economic indicator', 3, true, 9, NOW(), NOW()),
('What is the law of demand?', 'ESSAY', 16, NULL, 'MEDIUM', 'The law of demand states that, other things being equal, as the price of a good increases, the quantity demanded decreases, and vice versa. This creates a downward-sloping demand curve', 'Fundamental economic principle', 2, true, 9, NOW(), NOW()),
('What is inflation?', 'FILL_BLANK', 16, NULL, 'EASY', 'General increase in prices', 'Inflation is the general increase in prices of goods and services over time, reducing purchasing power', 2, true, 9, NOW(), NOW()),
('Define opportunity cost', 'ESSAY', 16, NULL, 'MEDIUM', 'Opportunity cost is the value of the best alternative foregone when making a choice. It represents what you give up to get something else. This concept is fundamental to economic decision-making', 'Core economic concept', 2, true, 9, NOW(), NOW()),
('What is market equilibrium?', 'ESSAY', 16, NULL, 'MEDIUM', 'Market equilibrium occurs when quantity demanded equals quantity supplied at a particular price. At this point, there is no tendency for price to change as market forces are balanced', 'Important market concept', 3, true, 9, NOW(), NOW());

-- Insert MCQ options for the questions
-- Note: Question IDs will be auto-incremented from existing questions