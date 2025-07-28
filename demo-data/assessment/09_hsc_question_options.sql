-- =====================================================
-- ASSESSMENT SERVICE - HSC Question Options
-- =====================================================
-- MCQ options for HSC questions created in 08_hsc_questions.sql
-- Using the correct column names based on QuestionOption entity

-- NOTE: These question IDs are estimated and may need adjustment after running the questions SQL
-- The actual IDs will depend on the sequence after existing demo data

-- Mathematics MCQ options (starting around ID 52+)
INSERT INTO assessment.question_options (question_id, text, option_order) VALUES
-- Question: "What is the derivative of sin(x)?" (estimated ID 52)
(52, 'cos(x)', 1),
(52, '-cos(x)', 2),
(52, 'sin(x)', 3),
(52, '-sin(x)', 4),

-- Question: "Find the limit of (x²-4)/(x-2) as x approaches 2" (estimated ID 53)
(53, '4', 1),
(53, '2', 2),
(53, '0', 3),
(53, 'undefined', 4),

-- Question: "If log₂(x) = 3, what is the value of x?" (estimated ID 55)
(55, '8', 1),
(55, '6', 2),
(55, '9', 3),
(55, '16', 4),

-- Question: "What is the integral of 1/x dx?" (estimated ID 57)
(57, 'ln|x| + C', 1),
(57, 'x²/2 + C', 2),
(57, '1/x² + C', 3),
(57, 'x + C', 4),

-- Question: "What is the probability of getting exactly 2 heads in 3 coin tosses?" (estimated ID 61)
(61, '3/8', 1),
(61, '1/4', 2),
(61, '1/2', 3),
(61, '2/3', 4),

-- Physics MCQ options
-- Question: "What is the escape velocity from Earth's surface?" (estimated ID 66)
(66, '11.2 km/s', 1),
(66, '7.9 km/s', 2),
(66, '9.8 km/s', 3),
(66, '15.0 km/s', 4),

-- Question: "What is the threshold frequency in photoelectric effect?" (estimated ID 70)
(70, 'Minimum frequency for electron emission', 1),
(70, 'Maximum frequency for electron emission', 2),
(70, 'Frequency of emitted electrons', 3),
(70, 'Average frequency of incident light', 4),

-- Chemistry MCQ options
-- Question: "What is the molecular formula of benzene?" (estimated ID 73)
(73, 'C₆H₆', 1),
(73, 'C₆H₁₂', 2),
(73, 'C₆H₁₄', 3),
(73, 'C₅H₆', 4),

-- Question: "What is the hybridization of carbon in methane?" (estimated ID 79)
(79, 'sp³', 1),
(79, 'sp²', 2),
(79, 'sp', 3),
(79, 'sp³d', 4),

-- Biology MCQ options
-- Question: "What is the site of protein synthesis in a cell?" (estimated ID 83)
(83, 'Ribosome', 1),
(83, 'Nucleus', 2),
(83, 'Mitochondria', 3),
(83, 'Golgi apparatus', 4),

-- Computer Science MCQ options
-- Question: "What is the time complexity of quicksort in average case?" (estimated ID 91)
(91, 'O(n log n)', 1),
(91, 'O(n²)', 2),
(91, 'O(n)', 3),
(91, 'O(log n)', 4);

-- Alternative approach using dynamic question ID lookup
-- This can be run after the questions are inserted

-- Clear any existing options for these questions first
-- DELETE FROM assessment.question_options WHERE question_id IN (
--     SELECT id FROM assessment.questions WHERE text IN (
--         'What is the derivative of sin(x)?',
--         'Find the limit of (x²-4)/(x-2) as x approaches 2',
--         'If log₂(x) = 3, what is the value of x?',
--         'What is the integral of 1/x dx?',
--         'What is the probability of getting exactly 2 heads in 3 coin tosses?',
--         'What is the escape velocity from Earth''s surface?',
--         'What is the threshold frequency in photoelectric effect?',
--         'What is the molecular formula of benzene?',
--         'What is the hybridization of carbon in methane?',
--         'What is the site of protein synthesis in a cell?',
--         'What is the time complexity of quicksort in average case?'
--     )
-- );

-- Dynamic insert with subqueries (use this approach if the static IDs don't work)
/*
-- Mathematics options
INSERT INTO assessment.question_options (question_id, text, option_order)
SELECT q.id, option_data.text, option_data.option_order
FROM assessment.questions q
CROSS JOIN (
    VALUES 
    ('cos(x)', 1),
    ('-cos(x)', 2),
    ('sin(x)', 3),
    ('-sin(x)', 4)
) AS option_data(text, option_order)
WHERE q.text = 'What is the derivative of sin(x)?';

INSERT INTO assessment.question_options (question_id, text, option_order)
SELECT q.id, option_data.text, option_data.option_order
FROM assessment.questions q
CROSS JOIN (
    VALUES 
    ('4', 1),
    ('2', 2),
    ('0', 3),
    ('undefined', 4)
) AS option_data(text, option_order)
WHERE q.text = 'Find the limit of (x²-4)/(x-2) as x approaches 2';

-- Continue this pattern for other MCQ questions...
*/

-- Print confirmation
SELECT 'HSC Question options created successfully' as status;
SELECT COUNT(*) as total_questions FROM assessment.questions;
SELECT COUNT(*) as total_options FROM assessment.question_options;