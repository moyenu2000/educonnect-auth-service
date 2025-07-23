-- =====================================================
-- EduConnect Demo Data Expansion Script
-- =====================================================
-- This script expands the demo dataset to massive scale
-- Creating 10,000+ questions, 1,000+ discussions, and more
-- =====================================================

-- =====================================================
-- MASSIVE QUESTION GENERATION
-- =====================================================

-- Generate comprehensive Mathematics questions across all classes
DO $$
DECLARE
    subject_record RECORD;
    topic_record RECORD;
    question_counter INTEGER := 0;
    difficulty_levels TEXT[] := ARRAY['EASY', 'MEDIUM', 'HARD', 'EXPERT'];
    question_types TEXT[] := ARRAY['MCQ', 'FILL_BLANK', 'NUMERIC', 'TRUE_FALSE', 'ESSAY'];
    math_topics TEXT[] := ARRAY[
        'Algebra', 'Geometry', 'Trigonometry', 'Calculus', 'Statistics', 'Probability',
        'Coordinate Geometry', 'Matrices', 'Determinants', 'Complex Numbers', 'Sequences',
        'Series', 'Limits', 'Derivatives', 'Integrals', 'Differential Equations'
    ];
    physics_topics TEXT[] := ARRAY[
        'Mechanics', 'Thermodynamics', 'Waves', 'Optics', 'Electricity', 'Magnetism',
        'Modern Physics', 'Atomic Structure', 'Nuclear Physics', 'Electronics',
        'Quantum Mechanics', 'Relativity', 'Electromagnetic Induction', 'AC Circuits'
    ];
    chemistry_topics TEXT[] := ARRAY[
        'Atomic Structure', 'Chemical Bonding', 'Thermodynamics', 'Equilibrium', 'Redox',
        'Electrochemistry', 'Chemical Kinetics', 'Surface Chemistry', 'Organic Chemistry',
        'Inorganic Chemistry', 'Coordination Compounds', 'Biomolecules', 'Polymers'
    ];
    question_templates TEXT[] := ARRAY[
        'Calculate the value of: %s',
        'Find the solution for: %s', 
        'Determine the result when: %s',
        'What is the answer to: %s',
        'Solve the following: %s',
        'Evaluate: %s',
        'Compute: %s',
        'Find: %s'
    ];
BEGIN
    -- Generate questions for Mathematics subjects
    FOR subject_record IN 
        SELECT id, name, class_level FROM assessment.subjects 
        WHERE name LIKE '%Mathematics%' 
    LOOP
        FOR i IN 1..500 LOOP -- 500 questions per math subject
            INSERT INTO assessment.questions (
                text, type, subject_id, topic_id, difficulty, 
                correct_answer_text, explanation, points, is_active, 
                created_by, created_at, updated_at
            ) VALUES (
                format(question_templates[1 + (i % array_length(question_templates, 1))], 
                       math_topics[1 + (i % array_length(math_topics, 1))] || ' problem ' || i),
                question_types[1 + (i % array_length(question_types, 1))],
                subject_record.id,
                1 + (i % 5), -- Distribute across first 5 topics
                difficulty_levels[1 + (i % array_length(difficulty_levels, 1))],
                'Answer for question ' || (question_counter + i),
                'Detailed explanation for solving this ' || math_topics[1 + (i % array_length(math_topics, 1))] || ' problem.',
                CASE 
                    WHEN difficulty_levels[1 + (i % array_length(difficulty_levels, 1))] = 'EASY' THEN 2
                    WHEN difficulty_levels[1 + (i % array_length(difficulty_levels, 1))] = 'MEDIUM' THEN 3
                    WHEN difficulty_levels[1 + (i % array_length(difficulty_levels, 1))] = 'HARD' THEN 4
                    ELSE 5
                END,
                true,
                6 + (i % 5), -- Rotate among question setters
                NOW() - INTERVAL (i || ' days'),
                NOW() - INTERVAL ((i % 7) || ' days')
            );
        END LOOP;
        question_counter := question_counter + 500;
    END LOOP;

    -- Generate questions for Physics subjects
    FOR subject_record IN 
        SELECT id, name, class_level FROM assessment.subjects 
        WHERE name LIKE '%Physics%' 
    LOOP
        FOR i IN 1..400 LOOP -- 400 questions per physics subject
            INSERT INTO assessment.questions (
                text, type, subject_id, topic_id, difficulty, 
                correct_answer_text, explanation, points, is_active, 
                created_by, created_at, updated_at
            ) VALUES (
                format(question_templates[1 + (i % array_length(question_templates, 1))], 
                       physics_topics[1 + (i % array_length(physics_topics, 1))] || ' concept ' || i),
                question_types[1 + (i % array_length(question_types, 1))],
                subject_record.id,
                1 + (i % 5),
                difficulty_levels[1 + (i % array_length(difficulty_levels, 1))],
                'Solution for question ' || (question_counter + i),
                'Physics explanation covering ' || physics_topics[1 + (i % array_length(physics_topics, 1))] || ' principles.',
                CASE 
                    WHEN difficulty_levels[1 + (i % array_length(difficulty_levels, 1))] = 'EASY' THEN 2
                    WHEN difficulty_levels[1 + (i % array_length(difficulty_levels, 1))] = 'MEDIUM' THEN 3
                    WHEN difficulty_levels[1 + (i % array_length(difficulty_levels, 1))] = 'HARD' THEN 4
                    ELSE 5
                END,
                true,
                11 + (i % 5), -- Physics question setters
                NOW() - INTERVAL (i || ' days'),
                NOW() - INTERVAL ((i % 7) || ' days')
            );
        END LOOP;
        question_counter := question_counter + 400;
    END LOOP;

    -- Generate questions for Chemistry subjects
    FOR subject_record IN 
        SELECT id, name, class_level FROM assessment.subjects 
        WHERE name LIKE '%Chemistry%' 
    LOOP
        FOR i IN 1..400 LOOP -- 400 questions per chemistry subject
            INSERT INTO assessment.questions (
                text, type, subject_id, topic_id, difficulty, 
                correct_answer_text, explanation, points, is_active, 
                created_by, created_at, updated_at
            ) VALUES (
                format(question_templates[1 + (i % array_length(question_templates, 1))], 
                       chemistry_topics[1 + (i % array_length(chemistry_topics, 1))] || ' reaction ' || i),
                question_types[1 + (i % array_length(question_types, 1))],
                subject_record.id,
                1 + (i % 5),
                difficulty_levels[1 + (i % array_length(difficulty_levels, 1))],
                'Chemical answer for question ' || (question_counter + i),
                'Chemistry explanation for ' || chemistry_topics[1 + (i % array_length(chemistry_topics, 1))] || ' mechanisms.',
                CASE 
                    WHEN difficulty_levels[1 + (i % array_length(difficulty_levels, 1))] = 'EASY' THEN 2
                    WHEN difficulty_levels[1 + (i % array_length(difficulty_levels, 1))] = 'MEDIUM' THEN 3
                    WHEN difficulty_levels[1 + (i % array_length(difficulty_levels, 1))] = 'HARD' THEN 4
                    ELSE 5
                END,
                true,
                16 + (i % 5), -- Chemistry question setters
                NOW() - INTERVAL (i || ' days'),
                NOW() - INTERVAL ((i % 7) || ' days')
            );
        END LOOP;
        question_counter := question_counter + 400;
    END LOOP;

    RAISE NOTICE 'Generated % questions across all subjects', question_counter;
END $$;

-- =====================================================
-- MASSIVE QUESTION OPTIONS GENERATION
-- =====================================================

-- Generate options for all MCQ questions
DO $$
DECLARE
    mcq_question RECORD;
    option_templates TEXT[] := ARRAY[
        'Option A: %s', 'Option B: %s', 'Option C: %s', 'Option D: %s',
        'Choice 1: %s', 'Choice 2: %s', 'Choice 3: %s', 'Choice 4: %s'
    ];
    sample_options TEXT[] := ARRAY[
        'True', 'False', 'Sometimes', 'Never', 'Always',
        '1', '2', '3', '4', '5', '0', '-1', '10', '100',
        'Yes', 'No', 'Maybe', 'Depends on conditions',
        'Increases', 'Decreases', 'Remains constant', 'Cannot be determined'
    ];
BEGIN
    FOR mcq_question IN 
        SELECT id FROM assessment.questions WHERE type = 'MCQ' 
    LOOP
        FOR i IN 1..4 LOOP
            INSERT INTO assessment.question_options (question_id, text, option_order) VALUES (
                mcq_question.id,
                format(option_templates[i], sample_options[1 + ((mcq_question.id + i) % array_length(sample_options, 1))]),
                i
            );
        END LOOP;
        
        -- Set correct answer for first option (randomly could be any)
        UPDATE assessment.questions 
        SET correct_answer_option_id = (
            SELECT id FROM assessment.question_options 
            WHERE question_id = mcq_question.id 
            ORDER BY option_order 
            LIMIT 1
        )
        WHERE id = mcq_question.id;
    END LOOP;
END $$;

-- =====================================================
-- EXTENSIVE TOPICS GENERATION
-- =====================================================

-- Generate comprehensive topics for each subject
DO $$
DECLARE
    subject_record RECORD;
    topic_names TEXT[] := ARRAY[
        'Introduction', 'Basic Concepts', 'Advanced Topics', 'Applications', 'Problem Solving',
        'Theory', 'Practical Applications', 'Case Studies', 'Examples', 'Exercises',
        'Review', 'Assessment', 'Projects', 'Research', 'Analysis',
        'Synthesis', 'Evaluation', 'Implementation', 'Testing', 'Optimization'
    ];
    counter INTEGER := 0;
BEGIN
    FOR subject_record IN SELECT id, name FROM assessment.subjects LOOP
        FOR i IN 1..25 LOOP -- 25 topics per subject
            INSERT INTO assessment.topics (
                name, description, subject_id, display_order, 
                is_active, created_at, updated_at
            ) VALUES (
                subject_record.name || ' - ' || topic_names[1 + (i % array_length(topic_names, 1))] || ' ' || i,
                'Comprehensive coverage of ' || topic_names[1 + (i % array_length(topic_names, 1))] || ' in ' || subject_record.name,
                subject_record.id,
                i,
                true,
                NOW() - INTERVAL (i || ' days'),
                NOW() - INTERVAL ((i % 5) || ' days')
            );
            counter := counter + 1;
        END LOOP;
    END LOOP;
    RAISE NOTICE 'Generated % topics across all subjects', counter;
END $$;

-- =====================================================
-- MASSIVE DISCUSSIONS GENERATION
-- =====================================================

-- Generate 1000+ realistic discussions
DO $$
DECLARE
    discussion_titles TEXT[] := ARRAY[
        'Help needed with %s concepts',
        'Struggling with %s problems', 
        'Best approach for %s preparation',
        'Tips for mastering %s',
        'Common mistakes in %s',
        'Study group for %s',
        'Resources for %s practice',
        'Doubt in %s theory',
        'How to improve %s scores',
        'Advanced %s techniques'
    ];
    discussion_content TEXT[] := ARRAY[
        'I am having difficulty understanding the core concepts. Can someone provide a clear explanation?',
        'The practice problems seem too challenging. What is the best way to approach them systematically?',
        'Looking for study partners who are serious about preparation. Anyone interested?',
        'Can experienced students share their preparation strategies and time management tips?',
        'I keep making the same mistakes repeatedly. How can I identify and fix these errors?',
        'What are the most reliable and comprehensive resources for this topic?',
        'The theory seems abstract and difficult to grasp. Are there practical examples?',
        'How much practice is needed to achieve proficiency in this area?',
        'What advanced techniques can help solve complex problems more efficiently?',
        'How should I balance theory study with practical problem solving?'
    ];
    subject_names TEXT[] := ARRAY[
        'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Science',
        'Algebra', 'Geometry', 'Calculus', 'Mechanics', 'Thermodynamics', 'Organic Chemistry'
    ];
    user_ids INTEGER[] := ARRAY[31, 35, 42, 38, 145, 152, 287, 312, 45, 67, 89, 123, 156, 178, 234];
    counter INTEGER := 0;
BEGIN
    FOR i IN 1..1000 LOOP
        INSERT INTO discussion.discussions (
            title, content, type, subject_id, class_level, is_anonymous,
            upvotes_count, downvotes_count, answers_count, views_count, 
            has_accepted_answer, status, author_id, created_at, updated_at
        ) VALUES (
            format(discussion_titles[1 + (i % array_length(discussion_titles, 1))], 
                   subject_names[1 + (i % array_length(subject_names, 1))]),
            discussion_content[1 + (i % array_length(discussion_content, 1))] || 
            ' This is discussion number ' || i || ' seeking community help.',
            CASE 
                WHEN i % 4 = 0 THEN 'QUESTION'
                WHEN i % 4 = 1 THEN 'HELP'
                WHEN i % 4 = 2 THEN 'GENERAL'
                ELSE 'ANNOUNCEMENT'
            END,
            1 + (i % 10), -- Distribute across first 10 subjects
            CASE 
                WHEN i % 7 = 0 THEN 'CLASS_12'
                WHEN i % 7 = 1 THEN 'CLASS_11'
                WHEN i % 7 = 2 THEN 'CLASS_10'
                WHEN i % 7 = 3 THEN 'CLASS_9'
                WHEN i % 7 = 4 THEN 'CLASS_8'
                WHEN i % 7 = 5 THEN 'CLASS_7'
                ELSE 'CLASS_6'
            END,
            (i % 10 = 0), -- 10% anonymous
            (i % 20) + 1, -- 1-20 upvotes
            i % 5, -- 0-4 downvotes
            (i % 8) + 1, -- 1-8 answers
            (i % 100) + 10, -- 10-109 views
            (i % 3 = 0), -- 33% have accepted answers
            'ACTIVE',
            user_ids[1 + (i % array_length(user_ids, 1))],
            NOW() - INTERVAL (i || ' hours'),
            NOW() - INTERVAL ((i % 24) || ' hours')
        );
        counter := counter + 1;
    END LOOP;
    RAISE NOTICE 'Generated % discussions', counter;
END $$;

-- =====================================================
-- MASSIVE ANSWERS GENERATION
-- =====================================================

-- Generate realistic answers for discussions
DO $$
DECLARE
    discussion_record RECORD;
    answer_templates TEXT[] := ARRAY[
        'Here is my approach to this problem: %s',
        'I had the same issue and solved it by: %s',
        'The key concept to understand is: %s',
        'Try this method: %s',
        'From my experience: %s',
        'The solution involves: %s',
        'You should focus on: %s',
        'This worked for me: %s'
    ];
    answer_details TEXT[] := ARRAY[
        'breaking down the problem into smaller steps and solving each systematically',
        'practicing similar problems repeatedly until the pattern becomes clear',
        'understanding the underlying theory before attempting numerical problems',
        'using visual aids and diagrams to grasp abstract concepts better',
        'forming study groups and discussing problems with peers regularly',
        'consulting multiple reference books for different perspectives',
        'creating summary notes and revision cards for quick review',
        'taking regular practice tests to identify weak areas'
    ];
    user_ids INTEGER[] := ARRAY[6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
    counter INTEGER := 0;
BEGIN
    FOR discussion_record IN 
        SELECT id, answers_count FROM discussion.discussions 
        WHERE answers_count > 0 
        ORDER BY id 
        LIMIT 500 -- Process first 500 discussions
    LOOP
        FOR i IN 1..discussion_record.answers_count LOOP
            INSERT INTO discussion.answers (
                content, is_anonymous, upvotes_count, downvotes_count, 
                is_accepted, author_id, discussion_id, created_at, updated_at
            ) VALUES (
                format(answer_templates[1 + (i % array_length(answer_templates, 1))],
                       answer_details[1 + (i % array_length(answer_details, 1))]),
                (i % 15 = 0), -- 6.7% anonymous
                (i % 15) + 1, -- 1-15 upvotes
                i % 3, -- 0-2 downvotes
                (i = 1), -- First answer is accepted if discussion has accepted answer
                user_ids[1 + (i % array_length(user_ids, 1))],
                discussion_record.id,
                NOW() - INTERVAL ((discussion_record.id + i) || ' hours'),
                NOW() - INTERVAL ((discussion_record.id + i) % 12 || ' hours')
            );
            counter := counter + 1;
        END LOOP;
    END LOOP;
    RAISE NOTICE 'Generated % answers across discussions', counter;
END $$;

-- =====================================================
-- CONTEST AND LIVE EXAM EXPANSION
-- =====================================================

-- Generate more contests
INSERT INTO assessment.contests (
    title, description, type, start_time, end_time, duration, 
    participants, status, created_at, updated_at
)
SELECT 
    'Contest ' || gs.id || ' - ' || 
    CASE 
        WHEN gs.id % 4 = 0 THEN 'Mathematics Championship'
        WHEN gs.id % 4 = 1 THEN 'Physics Quiz Bowl'
        WHEN gs.id % 4 = 2 THEN 'Chemistry Challenge'
        ELSE 'Science Olympiad'
    END,
    'Competitive examination testing knowledge across multiple topics and difficulty levels.',
    CASE 
        WHEN gs.id % 4 = 0 THEN 'SPEED'
        WHEN gs.id % 4 = 1 THEN 'ACCURACY'
        WHEN gs.id % 4 = 2 THEN 'MIXED'
        ELSE 'CODING'
    END,
    NOW() + INTERVAL (gs.id || ' days'),
    NOW() + INTERVAL (gs.id || ' days') + INTERVAL '2 hours',
    120,
    0,
    'UPCOMING',
    NOW() - INTERVAL (gs.id || ' days'),
    NOW() - INTERVAL ((gs.id % 7) || ' days')
FROM generate_series(6, 50) AS gs(id);

-- Generate more live exams
INSERT INTO assessment.live_exams (
    title, description, subject_id, class_level, scheduled_at, duration,
    instructions, passing_score, total_participants, status, created_at, updated_at
)
SELECT 
    'Live Exam ' || gs.id || ' - ' || s.name,
    'Comprehensive examination covering all major topics with board exam pattern.',
    s.id,
    s.class_level,
    NOW() + INTERVAL (gs.id || ' days') + INTERVAL '10 hours',
    180,
    'Follow all examination guidelines. Time limit strictly enforced. Show all working clearly.',
    CASE 
        WHEN s.class_level IN ('CLASS_11', 'CLASS_12') THEN 75
        ELSE 60
    END,
    0,
    'SCHEDULED',
    NOW() - INTERVAL (gs.id || ' days'),
    NOW() - INTERVAL ((gs.id % 5) || ' days')
FROM generate_series(4, 25) AS gs(id)
CROSS JOIN (
    SELECT id, name, class_level 
    FROM assessment.subjects 
    WHERE id <= 10
) s;

-- =====================================================
-- DAILY QUESTIONS EXPANSION
-- =====================================================

-- Generate daily questions for the last 365 days
INSERT INTO assessment.daily_questions (question_id, date, subject_id, difficulty, points, created_at)
SELECT 
    1 + (gs.id % (SELECT COUNT(*) FROM assessment.questions WHERE id <= 1000)),
    CURRENT_DATE - INTERVAL (gs.id::text || ' days'),
    1 + (gs.id % 10),
    CASE 
        WHEN gs.id % 4 = 0 THEN 'EASY'
        WHEN gs.id % 4 = 1 THEN 'MEDIUM'
        WHEN gs.id % 4 = 2 THEN 'HARD'
        ELSE 'EXPERT'
    END,
    CASE 
        WHEN gs.id % 4 = 0 THEN 2
        WHEN gs.id % 4 = 1 THEN 3
        WHEN gs.id % 4 = 2 THEN 4
        ELSE 5
    END,
    NOW() - INTERVAL (gs.id::text || ' days')
FROM generate_series(31, 365) AS gs(id)
WHERE NOT EXISTS (
    SELECT 1 FROM assessment.daily_questions 
    WHERE date = CURRENT_DATE - INTERVAL (gs.id::text || ' days')
);

-- =====================================================
-- PRACTICE PROBLEMS EXPANSION  
-- =====================================================

-- Create practice problems from more questions
INSERT INTO assessment.practice_problems (
    question_id, difficulty, topic_id, subject_id, type, points,
    hint_text, solution_steps, is_active, created_at, updated_at
)
SELECT 
    q.id,
    q.difficulty,
    COALESCE(q.topic_id, 1),
    q.subject_id,
    q.type,
    q.points * 5, -- Practice problems worth more points
    'Hint: Focus on the fundamental concepts and apply step-by-step approach.',
    'Step 1: Understand the problem\nStep 2: Identify known values\nStep 3: Apply relevant formulas\nStep 4: Calculate carefully\nStep 5: Verify the answer',
    true,
    q.created_at,
    q.updated_at
FROM assessment.questions q
WHERE q.id BETWEEN 8 AND 1000
AND q.type IN ('MCQ', 'NUMERIC', 'FILL_BLANK')
AND NOT EXISTS (
    SELECT 1 FROM assessment.practice_problems WHERE question_id = q.id
);

-- =====================================================
-- USER PERFORMANCE DATA GENERATION
-- =====================================================

-- This section would include user submissions, streaks, bookmarks, etc.
-- Showing the pattern for massive realistic data creation

-- Update final statistics
DO $$
DECLARE
    stats_summary TEXT;
BEGIN
    SELECT format('DEMO DATA EXPANSION COMPLETE!
    Users: %s
    Subjects: %s  
    Topics: %s
    Questions: %s
    Question Options: %s
    Discussions: %s
    Answers: %s
    Daily Questions: %s
    Practice Problems: %s
    Contests: %s
    Live Exams: %s',
    (SELECT COUNT(*) FROM auth.users),
    (SELECT COUNT(*) FROM assessment.subjects),
    (SELECT COUNT(*) FROM assessment.topics),
    (SELECT COUNT(*) FROM assessment.questions),
    (SELECT COUNT(*) FROM assessment.question_options),
    (SELECT COUNT(*) FROM discussion.discussions),
    (SELECT COUNT(*) FROM discussion.answers),
    (SELECT COUNT(*) FROM assessment.daily_questions),
    (SELECT COUNT(*) FROM assessment.practice_problems),
    (SELECT COUNT(*) FROM assessment.contests),
    (SELECT COUNT(*) FROM assessment.live_exams)
    ) INTO stats_summary;
    
    RAISE NOTICE '%', stats_summary;
END $$;

-- Update all sequences to prevent ID conflicts
SELECT setval(pg_get_serial_sequence('assessment.questions', 'id'), (SELECT MAX(id) FROM assessment.questions));
SELECT setval(pg_get_serial_sequence('assessment.question_options', 'id'), (SELECT MAX(id) FROM assessment.question_options));
SELECT setval(pg_get_serial_sequence('assessment.topics', 'id'), (SELECT MAX(id) FROM assessment.topics));
SELECT setval(pg_get_serial_sequence('discussion.discussions', 'id'), (SELECT MAX(id) FROM discussion.discussions));
SELECT setval(pg_get_serial_sequence('discussion.answers', 'id'), (SELECT MAX(id) FROM discussion.answers));
SELECT setval(pg_get_serial_sequence('assessment.daily_questions', 'id'), (SELECT MAX(id) FROM assessment.daily_questions));
SELECT setval(pg_get_serial_sequence('assessment.practice_problems', 'id'), (SELECT MAX(id) FROM assessment.practice_problems));
SELECT setval(pg_get_serial_sequence('assessment.contests', 'id'), (SELECT MAX(id) FROM assessment.contests));
SELECT setval(pg_get_serial_sequence('assessment.live_exams', 'id'), (SELECT MAX(id) FROM assessment.live_exams));