-- Quick fix: Add topics to existing subjects in assessment schema

-- Add topics for Mathematics - Class 12 (subject_id = 40)
INSERT INTO assessment.topics (name, description, subject_id, display_order, is_active, created_at, updated_at) VALUES
('Algebra', 'Algebraic expressions, equations, and inequalities', 40, 1, true, NOW(), NOW()),
('Calculus', 'Differential and integral calculus', 40, 2, true, NOW(), NOW()),
('Trigonometry', 'Trigonometric functions and identities', 40, 3, true, NOW(), NOW()),
('Coordinate Geometry', 'Analytical geometry and coordinate systems', 40, 4, true, NOW(), NOW()),
('Probability', 'Probability theory and statistics', 40, 5, true, NOW(), NOW()),
('Vectors', 'Vector algebra and geometry', 40, 6, true, NOW(), NOW());

-- Add topics for Mathematics - Class 11 (subject_id = 45)
INSERT INTO assessment.topics (name, description, subject_id, display_order, is_active, created_at, updated_at) VALUES
('Sets and Functions', 'Set theory and function concepts', 45, 1, true, NOW(), NOW()),
('Sequences and Series', 'Arithmetic and geometric progressions', 45, 2, true, NOW(), NOW()),
('Limits and Derivatives', 'Introduction to calculus', 45, 3, true, NOW(), NOW()),
('Mathematical Reasoning', 'Logic and proof techniques', 45, 4, true, NOW(), NOW()),
('Statistics', 'Data analysis and interpretation', 45, 5, true, NOW(), NOW()),
('Permutations and Combinations', 'Counting principles', 45, 6, true, NOW(), NOW());

-- Add topics for Mathematics - Class 10 (subject_id = 50)
INSERT INTO assessment.topics (name, description, subject_id, display_order, is_active, created_at, updated_at) VALUES
('Real Numbers', 'Number systems and properties', 50, 1, true, NOW(), NOW()),
('Polynomials', 'Polynomial expressions and equations', 50, 2, true, NOW(), NOW()),
('Linear Equations', 'Linear equations in two variables', 50, 3, true, NOW(), NOW()),
('Quadratic Equations', 'Quadratic expressions and equations', 50, 4, true, NOW(), NOW()),
('Arithmetic Progressions', 'Sequences and series', 50, 5, true, NOW(), NOW()),
('Triangles', 'Triangle properties and theorems', 50, 6, true, NOW(), NOW()),
('Coordinate Geometry', 'Distance and section formulas', 50, 7, true, NOW(), NOW()),
('Surface Areas and Volumes', 'Mensuration of 3D shapes', 50, 8, true, NOW(), NOW());

-- Add topics for Physics - Class 12 (subject_id = 41)
INSERT INTO assessment.topics (name, description, subject_id, display_order, is_active, created_at, updated_at) VALUES
('Electric Charges and Fields', 'Electrostatics and electric fields', 41, 1, true, NOW(), NOW()),
('Electrostatic Potential', 'Electric potential and capacitance', 41, 2, true, NOW(), NOW()),
('Current Electricity', 'Electric current and circuits', 41, 3, true, NOW(), NOW()),
('Moving Charges and Magnetism', 'Magnetic effects of current', 41, 4, true, NOW(), NOW()),
('Magnetism and Matter', 'Magnetic properties of materials', 41, 5, true, NOW(), NOW()),
('Electromagnetic Induction', 'Faraday''s law and Lenz''s law', 41, 6, true, NOW(), NOW()),
('Alternating Current', 'AC circuits and power', 41, 7, true, NOW(), NOW()),
('Electromagnetic Waves', 'Wave properties and spectrum', 41, 8, true, NOW(), NOW()),
('Ray Optics', 'Reflection and refraction', 41, 9, true, NOW(), NOW()),
('Wave Optics', 'Interference and diffraction', 41, 10, true, NOW(), NOW()),
('Dual Nature of Radiation', 'Photoelectric effect', 41, 11, true, NOW(), NOW()),
('Atoms', 'Atomic structure and spectra', 41, 12, true, NOW(), NOW()),
('Nuclei', 'Nuclear physics and radioactivity', 41, 13, true, NOW(), NOW()),
('Semiconductor Electronics', 'Diodes and transistors', 41, 14, true, NOW(), NOW());

-- Add topics for Physics - Class 11 (subject_id = 46)
INSERT INTO assessment.topics (name, description, subject_id, display_order, is_active, created_at, updated_at) VALUES
('Physical World', 'Introduction to physics', 46, 1, true, NOW(), NOW()),
('Units and Measurements', 'SI units and dimensional analysis', 46, 2, true, NOW(), NOW()),
('Motion in a Straight Line', 'Kinematics in one dimension', 46, 3, true, NOW(), NOW()),
('Motion in a Plane', 'Two-dimensional motion', 46, 4, true, NOW(), NOW()),
('Laws of Motion', 'Newton''s laws and applications', 46, 5, true, NOW(), NOW()),
('Work, Energy and Power', 'Energy conservation principles', 46, 6, true, NOW(), NOW()),
('System of Particles', 'Center of mass and momentum', 46, 7, true, NOW(), NOW()),
('Rotational Motion', 'Angular motion and torque', 46, 8, true, NOW(), NOW()),
('Gravitation', 'Universal gravitation law', 46, 9, true, NOW(), NOW()),
('Mechanical Properties of Solids', 'Stress, strain, and elasticity', 46, 10, true, NOW(), NOW()),
('Mechanical Properties of Fluids', 'Pressure and fluid mechanics', 46, 11, true, NOW(), NOW()),
('Thermal Properties of Matter', 'Heat and temperature', 46, 12, true, NOW(), NOW()),
('Thermodynamics', 'Laws of thermodynamics', 46, 13, true, NOW(), NOW()),
('Kinetic Theory', 'Molecular motion in gases', 46, 14, true, NOW(), NOW()),
('Oscillations', 'Simple harmonic motion', 46, 15, true, NOW(), NOW()),
('Waves', 'Wave motion and properties', 46, 16, true, NOW(), NOW());

-- Add topics for Chemistry - Class 12 (subject_id = 42)
INSERT INTO assessment.topics (name, description, subject_id, display_order, is_active, created_at, updated_at) VALUES
('The Solid State', 'Crystal structures and properties', 42, 1, true, NOW(), NOW()),
('Solutions', 'Types and properties of solutions', 42, 2, true, NOW(), NOW()),
('Electrochemistry', 'Redox reactions and cells', 42, 3, true, NOW(), NOW()),
('Chemical Kinetics', 'Reaction rates and mechanisms', 42, 4, true, NOW(), NOW()),
('Surface Chemistry', 'Adsorption and catalysis', 42, 5, true, NOW(), NOW()),
('General Principles of Metallurgy', 'Extraction of metals', 42, 6, true, NOW(), NOW()),
('p-Block Elements', 'Group 15-18 elements', 42, 7, true, NOW(), NOW()),
('d-Block and f-Block Elements', 'Transition metals', 42, 8, true, NOW(), NOW()),
('Coordination Compounds', 'Complex compounds', 42, 9, true, NOW(), NOW()),
('Haloalkanes and Haloarenes', 'Organic halogen compounds', 42, 10, true, NOW(), NOW()),
('Alcohols, Phenols and Ethers', 'Oxygen-containing compounds', 42, 11, true, NOW(), NOW()),
('Aldehydes, Ketones', 'Carbonyl compounds', 42, 12, true, NOW(), NOW()),
('Carboxylic Acids', 'Organic acids and derivatives', 42, 13, true, NOW(), NOW()),
('Amines', 'Nitrogen-containing compounds', 42, 14, true, NOW(), NOW()),
('Biomolecules', 'Carbohydrates, proteins, lipids', 42, 15, true, NOW(), NOW()),
('Polymers', 'Natural and synthetic polymers', 42, 16, true, NOW(), NOW()),
('Chemistry in Everyday Life', 'Applied chemistry', 42, 17, true, NOW(), NOW());

-- Print confirmation
SELECT 'Topics added successfully!' as status;
SELECT COUNT(*) as total_topics FROM assessment.topics;
SELECT s.name as subject_name, COUNT(t.id) as topic_count 
FROM assessment.subjects s 
LEFT JOIN assessment.topics t ON s.id = t.subject_id 
WHERE s.id IN (40, 41, 42, 45, 46, 50)
GROUP BY s.id, s.name 
ORDER BY s.name;