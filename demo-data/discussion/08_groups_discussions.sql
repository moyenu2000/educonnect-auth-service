-- =====================================================
-- DISCUSSION SERVICE - Groups and Discussions
-- =====================================================
-- Comprehensive discussion groups and engaging discussions

-- Insert discussion groups with proper enum values
INSERT INTO discussion.discussion_groups (name, description, type, subject_id, class_level, is_private, rules, members_count, discussions_count, created_by_id, created_at, updated_at) VALUES

-- ========== SUBJECT-BASED GROUPS ==========
('Mathematics Excellence Hub', 'Premier destination for mathematics enthusiasts, problem solvers, and competitive exam aspirants', 'SUBJECT', 1, 'CLASS_10', false, 'Be respectful and helpful. Show your work step by step. No spam or off-topic posts. Help others learn and grow together.', 0, 0, 4, NOW() - INTERVAL '3 months', NOW()),
('Physics Research & Discovery', 'Explore the wonders of physics through experiments, theories, and real-world applications', 'SUBJECT', 2, 'CLASS_10', false, 'Share interesting physics phenomena. Explain concepts clearly. Use proper scientific notation. Encourage curiosity and learning.', 0, 0, 5, NOW() - INTERVAL '2 months', NOW()),
('Chemistry Lab Partners', 'Collaborative space for chemistry experiments, reactions, and molecular understanding', 'SUBJECT', 3, 'CLASS_10', false, 'Safety first in all discussions. Share lab experiences. Help with chemical equations. No dangerous experiment suggestions.', 0, 0, 6, NOW() - INTERVAL '2 months', NOW()),
('Biology & Life Sciences', 'Discover the fascinating world of living organisms, from cells to ecosystems', 'SUBJECT', 4, 'CLASS_10', false, 'Respect all forms of life. Share interesting biological facts. Help with diagrams and processes. Encourage environmental awareness.', 0, 0, 7, NOW() - INTERVAL '1 month', NOW()),
('Computer Science & Programming', 'Code, algorithms, and technology discussions for aspiring programmers', 'SUBJECT', 15, 'CLASS_11', false, 'Share clean, commented code. Help debug issues. No plagiarism. Explain your solutions clearly. Welcome all skill levels.', 0, 0, 8, NOW() - INTERVAL '1 month', NOW()),
('English Literature & Writing', 'Explore great works of literature and improve writing skills together', 'SUBJECT', 5, 'CLASS_10', false, 'Respectful literary discussions. Constructive feedback on writing. No spoilers without warnings. Encourage creative expression.', 0, 0, 9, NOW() - INTERVAL '6 weeks', NOW()),

-- ========== STUDY GROUPS ==========
('Study Warriors - Class 10', 'Dedicated study group for Class 10 students preparing for board examinations', 'STUDY', NULL, 'CLASS_10', false, 'Daily study schedules. Mutual help and motivation. Share study resources. Regular progress updates. Stay focused on goals.', 0, 0, 12, NOW() - INTERVAL '2 months', NOW()),
('Advanced Learners Circle', 'High-achieving students tackling challenging concepts across multiple subjects', 'STUDY', NULL, 'CLASS_11', false, 'Advanced problem solving. Peer teaching encouraged. Share challenging questions. Maintain high academic standards.', 0, 0, 13, NOW() - INTERVAL '6 weeks', NOW()),
('Competitive Exam Prep Group', 'Preparing for entrance exams, olympiads, and competitive assessments', 'STUDY', NULL, 'CLASS_12', false, 'Focus on competitive exam strategies. Time management tips. Mock test discussions. Motivational support system.', 0, 0, 14, NOW() - INTERVAL '1 month', NOW()),
('Peer Tutoring Network', 'Students helping students through collaborative learning and teaching', 'STUDY', NULL, 'CLASS_10', false, 'Teach what you know. Learn from others. Be patient with struggling peers. Create a supportive learning environment.', 0, 0, 16, NOW() - INTERVAL '5 weeks', NOW()),

-- ========== CLASS-BASED GROUPS ==========
('Class 10A - Science Stream', 'Official study group for Class 10A science stream students', 'CLASS', NULL, 'CLASS_10', true, 'Class members only. Help with homework and projects. Share class notes. Coordinate group studies. Respect classmates.', 0, 0, 27, NOW() - INTERVAL '4 months', NOW()),
('Class 11B - Mixed Streams', 'Collaborative space for Class 11B students from all academic streams', 'CLASS', NULL, 'CLASS_11', true, 'Inclusive environment for all streams. Share different perspectives. Help across subjects. Build class unity.', 0, 0, 29, NOW() - INTERVAL '3 months', NOW()),
('Class 12 - Final Year Support', 'Final year students supporting each other through the challenges ahead', 'CLASS', NULL, 'CLASS_12', true, 'Final year motivation. College application help. Stress management tips. Celebrate achievements together.', 0, 0, 31, NOW() - INTERVAL '2 months', NOW()),

-- ========== SPECIAL INTEREST GROUPS ==========
('International Students Connect', 'Global community for international and exchange students', 'GENERAL', NULL, 'CLASS_10', false, 'Cultural exchange welcome. Share different educational perspectives. Help with language barriers. Celebrate diversity.', 0, 0, 24, NOW() - INTERVAL '2 months', NOW()),
('STEM Women Leaders', 'Empowering women in Science, Technology, Engineering, and Mathematics', 'GENERAL', NULL, 'CLASS_11', false, 'Support women in STEM. Share inspiring stories. Mentorship opportunities. Break gender stereotypes in science.', 0, 0, 13, NOW() - INTERVAL '6 weeks', NOW()),
('Creative Problem Solvers', 'Innovative approaches to academic and real-world challenges', 'GENERAL', NULL, 'CLASS_10', false, 'Think outside the box. Share creative solutions. Encourage innovation. Apply learning to real problems.', 0, 0, 20, NOW() - INTERVAL '1 month', NOW()),

-- ========== TEST GROUP ==========
('FIXED API Test Group', 'Test group for API functionality with correct enum values and proper data validation', 'STUDY', NULL, 'CLASS_10', false, 'This study group was created with correct enum values and proper validation for testing API endpoints.', 0, 0, 1, NOW() - INTERVAL '1 week', NOW());

-- Insert group members with diverse roles
INSERT INTO discussion.group_members (user_id, group_id, role, joined_at) VALUES

-- ========== MATHEMATICS EXCELLENCE HUB MEMBERS ==========
(4, 1, 'ADMIN', NOW() - INTERVAL '3 months'),      -- Prof Williams (creator)
(12, 1, 'MODERATOR', NOW() - INTERVAL '2 months'), -- Alex Johnson
(13, 1, 'MODERATOR', NOW() - INTERVAL '2 months'), -- Sophia Martinez  
(14, 1, 'MEMBER', NOW() - INTERVAL '6 weeks'),     -- David Chen
(16, 1, 'MEMBER', NOW() - INTERVAL '5 weeks'),     -- Sarah Thompson
(19, 1, 'MEMBER', NOW() - INTERVAL '4 weeks'),     -- John Taylor
(21, 1, 'MEMBER', NOW() - INTERVAL '3 weeks'),     -- Tom Brown
(24, 1, 'MEMBER', NOW() - INTERVAL '2 weeks'),     -- Raj Sharma
(27, 1, 'MEMBER', NOW() - INTERVAL '1 week'),      -- Ryan Mitchell

-- ========== PHYSICS RESEARCH & DISCOVERY MEMBERS ==========
(5, 2, 'ADMIN', NOW() - INTERVAL '2 months'),      -- Dr Thomson (creator)
(14, 2, 'MODERATOR', NOW() - INTERVAL '6 weeks'),  -- David Chen
(12, 2, 'MEMBER', NOW() - INTERVAL '5 weeks'),     -- Alex Johnson
(15, 2, 'MEMBER', NOW() - INTERVAL '4 weeks'),     -- Emily Rodriguez
(16, 2, 'MEMBER', NOW() - INTERVAL '3 weeks'),     -- Sarah Thompson
(25, 2, 'MEMBER', NOW() - INTERVAL '2 weeks'),     -- Yuki Tanaka

-- ========== CHEMISTRY LAB PARTNERS MEMBERS ==========
(6, 3, 'ADMIN', NOW() - INTERVAL '2 months'),      -- Prof Chen (creator)
(15, 3, 'MODERATOR', NOW() - INTERVAL '6 weeks'),  -- Emily Rodriguez
(16, 3, 'MEMBER', NOW() - INTERVAL '4 weeks'),     -- Sarah Thompson
(26, 3, 'MEMBER', NOW() - INTERVAL '3 weeks'),     -- Ahmed Al-Rashid
(27, 3, 'MEMBER', NOW() - INTERVAL '2 weeks'),     -- Ryan Mitchell

-- ========== BIOLOGY & LIFE SCIENCES MEMBERS ==========
(7, 4, 'ADMIN', NOW() - INTERVAL '1 month'),       -- Dr Patel (creator)
(15, 4, 'MODERATOR', NOW() - INTERVAL '3 weeks'),  -- Emily Rodriguez
(12, 4, 'MEMBER', NOW() - INTERVAL '2 weeks'),     -- Alex Johnson
(18, 4, 'MEMBER', NOW() - INTERVAL '2 weeks'),     -- Lisa Kim
(20, 4, 'MEMBER', NOW() - INTERVAL '1 week'),      -- Anna White
(22, 4, 'MEMBER', NOW() - INTERVAL '1 week'),      -- Mary Davis
(28, 4, 'MEMBER', NOW() - INTERVAL '3 days'),      -- Emma Thompson

-- ========== COMPUTER SCIENCE & PROGRAMMING MEMBERS ==========
(8, 5, 'ADMIN', NOW() - INTERVAL '1 month'),       -- Prof Garcia (creator)
(35, 5, 'MODERATOR', NOW() - INTERVAL '3 weeks'),  -- James Wilson
(25, 5, 'MEMBER', NOW() - INTERVAL '2 weeks'),     -- Yuki Tanaka
(29, 5, 'MEMBER', NOW() - INTERVAL '2 weeks'),     -- Kevin Park
(38, 5, 'MEMBER', NOW() - INTERVAL '1 week'),      -- John Doe

-- ========== STUDY WARRIORS - CLASS 10 MEMBERS ==========
(12, 7, 'ADMIN', NOW() - INTERVAL '2 months'),     -- Alex Johnson (creator)
(16, 7, 'MODERATOR', NOW() - INTERVAL '6 weeks'),  -- Sarah Thompson
(21, 7, 'MEMBER', NOW() - INTERVAL '5 weeks'),     -- Tom Brown
(22, 7, 'MEMBER', NOW() - INTERVAL '4 weeks'),     -- Mary Davis
(27, 7, 'MEMBER', NOW() - INTERVAL '3 weeks'),     -- Ryan Mitchell
(28, 7, 'MEMBER', NOW() - INTERVAL '2 weeks'),     -- Emma Thompson

-- ========== ADVANCED LEARNERS CIRCLE MEMBERS ==========
(13, 8, 'ADMIN', NOW() - INTERVAL '6 weeks'),      -- Sophia Martinez (creator)
(14, 8, 'MODERATOR', NOW() - INTERVAL '4 weeks'),  -- David Chen
(35, 8, 'MEMBER', NOW() - INTERVAL '3 weeks'),     -- James Wilson
(29, 8, 'MEMBER', NOW() - INTERVAL '2 weeks'),     -- Kevin Park
(30, 8, 'MEMBER', NOW() - INTERVAL '1 week'),      -- Rachel Green

-- ========== INTERNATIONAL STUDENTS CONNECT MEMBERS ==========
(24, 14, 'ADMIN', NOW() - INTERVAL '2 months'),    -- Raj Sharma (creator)
(25, 14, 'MODERATOR', NOW() - INTERVAL '6 weeks'), -- Yuki Tanaka
(26, 14, 'MEMBER', NOW() - INTERVAL '4 weeks'),    -- Ahmed Al-Rashid
(36, 14, 'MEMBER', NOW() - INTERVAL '2 weeks'),    -- Marie Dubois

-- ========== TEST GROUP MEMBERS ==========
(1, 17, 'ADMIN', NOW() - INTERVAL '1 week'),       -- Admin (creator)
(12, 17, 'MEMBER', NOW() - INTERVAL '5 days'),     -- Alex Johnson
(16, 17, 'MEMBER', NOW() - INTERVAL '3 days'),     -- Sarah Thompson

-- Update group member counts
UPDATE discussion.discussion_groups SET members_count = (
    SELECT COUNT(*) FROM discussion.group_members WHERE group_id = discussion_groups.id
);

-- Insert engaging discussions
INSERT INTO discussion.discussions (title, content, type, author_id, subject_id, topic_id, class_level, upvotes_count, downvotes_count, answers_count, views_count, has_accepted_answer, status, group_id, created_at, updated_at) VALUES

-- ========== MATHEMATICS DISCUSSIONS ==========
('Advanced Quadratic Equation Strategies', 'I''ve been working on complex quadratic equations for competitive exams. Can someone explain the most efficient methods for solving equations like 3x² + 7x - 12 = 0 when factoring seems difficult? I''ve tried the quadratic formula but wonder if there are faster approaches for exam conditions.', 'QUESTION', 12, 1, 4, 'CLASS_10', 8, 0, 4, 127, true, 'ACTIVE', 1, NOW() - INTERVAL '3 days', NOW()),
('Trigonometry in Real Life Applications', 'I''m fascinated by how trigonometry is used in architecture and engineering. Can anyone share specific examples of how sine, cosine, and tangent functions are applied in real-world construction projects? Looking for practical applications beyond textbook problems.', 'GENERAL', 13, 1, 8, 'CLASS_10', 15, 1, 7, 203, false, 'ACTIVE', 1, NOW() - INTERVAL '1 week', NOW()),
('Help with Calculus Derivative Rules', 'Struggling with the chain rule in calculus. When I have a function like f(x) = (3x² + 5)⁴, I get confused about which rule to apply first. Can someone break down the step-by-step process for complex composite functions?', 'QUESTION', 21, 11, NULL, 'CLASS_11', 5, 0, 6, 89, true, 'ACTIVE', 8, NOW() - INTERVAL '1 day', NOW()),

-- ========== PHYSICS DISCUSSIONS ==========
('Electromagnetic Induction Experiments', 'Our class conducted the electromagnetic induction experiment with copper coils and magnets. The results were interesting but I''m confused about why the induced current direction changes. Can someone explain Lenz''s law with practical examples?', 'HELP', 14, 2, 4, 'CLASS_10', 12, 0, 5, 156, true, 'ACTIVE', 2, NOW() - INTERVAL '2 days', NOW()),
('Quantum Physics for Beginners', 'I''ve heard about quantum physics and find it fascinating. As a Class 11 student, what are the fundamental concepts I should understand before diving deeper? Any recommended resources or simple explanations for wave-particle duality?', 'GENERAL', 29, 12, NULL, 'CLASS_11', 23, 2, 12, 287, false, 'ACTIVE', 8, NOW() - INTERVAL '5 days', NOW()),
('Projectile Motion Problem Solutions', 'Working on projectile motion problems where we need to find the maximum height and range. I understand the basic equations but struggle with problems involving angles and air resistance. Looking for systematic problem-solving approaches.', 'QUESTION', 16, 2, 5, 'CLASS_10', 6, 0, 3, 74, false, 'ACTIVE', 2, NOW() - INTERVAL '6 hours', NOW()),

-- ========== CHEMISTRY DISCUSSIONS ==========
('Organic Chemistry Reaction Mechanisms', 'The SN1 and SN2 reaction mechanisms are confusing me. I understand the basic difference but struggle to predict which mechanism will occur in different scenarios. Can someone share tips for identifying reaction conditions that favor each mechanism?', 'QUESTION', 15, 3, 11, 'CLASS_10', 9, 1, 8, 142, true, 'ACTIVE', 3, NOW() - INTERVAL '1 day', NOW()),
('Balancing Complex Chemical Equations', 'Need help with balancing equations involving multiple elements and compounds. Equations like the combustion of organic compounds or redox reactions seem overwhelming. What systematic approaches work best for complex balancing?', 'HELP', 26, 3, 10, 'CLASS_10', 4, 0, 5, 67, false, 'ACTIVE', 3, NOW() - INTERVAL '4 hours', NOW()),
('Lab Safety and Best Practices', 'After our recent lab accident (minor!), I''m more conscious about safety protocols. What are the most important safety practices for handling acids, bases, and organic solvents? Share your lab safety tips and experiences.', 'GENERAL', 27, 3, 1, 'CLASS_10', 18, 0, 11, 198, false, 'ACTIVE', 3, NOW() - INTERVAL '1 week', NOW()),

-- ========== BIOLOGY DISCUSSIONS ==========
('Photosynthesis vs Cellular Respiration', 'I''m getting confused between photosynthesis and cellular respiration processes. They seem like opposite reactions but both involve glucose and ATP. Can someone clarify the key differences and how they work together in the ecosystem?', 'QUESTION', 18, 4, 1, 'CLASS_10', 11, 0, 6, 134, true, 'ACTIVE', 4, NOW() - INTERVAL '2 days', NOW()),
('Human Digestive System Detailed Study', 'Preparing for exams on the digestive system. The process from mouth to absorption is complex with many enzymes and organs involved. Looking for memory techniques or mnemonics to remember the sequence and functions of each part.', 'HELP', 22, 4, 1, 'CLASS_10', 7, 0, 4, 92, false, 'ACTIVE', 4, NOW() - INTERVAL '12 hours', NOW()),
('Genetics and Heredity Patterns', 'Mendel''s laws make sense individually, but I struggle with dihybrid crosses and inheritance patterns involving multiple traits. Can someone walk through a complex genetics problem step by step?', 'QUESTION', 20, 4, 7, 'CLASS_10', 13, 1, 9, 167, true, 'ACTIVE', 4, NOW() - INTERVAL '3 days', NOW()),

-- ========== COMPUTER SCIENCE DISCUSSIONS ==========
('Python vs Java for Beginners', 'Starting my programming journey and torn between Python and Java. I''ve heard Python is easier to learn but Java is more widely used in industry. What would you recommend for someone who wants to eventually work in software development?', 'GENERAL', 25, 15, 1, 'CLASS_11', 28, 5, 15, 342, false, 'ACTIVE', 5, NOW() - INTERVAL '4 days', NOW()),
('Data Structures: When to Use What?', 'Learning about arrays, linked lists, stacks, and queues. I understand how each works but struggle to know when to use which data structure for specific problems. Looking for practical examples and decision-making strategies.', 'QUESTION', 35, 15, 4, 'CLASS_11', 16, 0, 8, 189, true, 'ACTIVE', 5, NOW() - INTERVAL '1 day', NOW()),
('Debugging Strategies and Best Practices', 'Spending too much time debugging my code. What are the most effective debugging techniques and tools? How do experienced programmers approach finding and fixing bugs efficiently?', 'HELP', 38, 15, 1, 'CLASS_11', 19, 1, 12, 223, false, 'ACTIVE', 5, NOW() - INTERVAL '2 days', NOW()),

-- ========== STUDY GROUP DISCUSSIONS ==========
('Effective Study Schedule for Board Exams', 'With board exams approaching, I''m struggling to create an effective study schedule that covers all subjects. How do you balance time between strong and weak subjects? Looking for practical timetable suggestions.', 'GENERAL', 27, NULL, NULL, 'CLASS_10', 14, 0, 9, 178, false, 'ACTIVE', 7, NOW() - INTERVAL '2 days', NOW()),
('Group Study vs Individual Study', 'Some topics I understand better in group discussions, while others need quiet individual focus. How do you decide which study method to use for different subjects? Share your strategies for maximizing both approaches.', 'GENERAL', 16, NULL, NULL, 'CLASS_10', 21, 2, 13, 245, false, 'ACTIVE', 10, NOW() - INTERVAL '5 days', NOW()),
('Motivation During Exam Stress', 'Feeling overwhelmed with the amount of syllabus to cover. How do you stay motivated when the workload seems impossible? Looking for mental health tips and stress management strategies from fellow students.', 'HELP', 21, NULL, NULL, 'CLASS_10', 17, 0, 11, 201, false, 'ACTIVE', 7, NOW() - INTERVAL '1 day', NOW()),

-- ========== INTERNATIONAL STUDENT DISCUSSIONS ==========
('Cultural Differences in Education Systems', 'Coming from a different education system, I''m adjusting to new teaching methods and assessment styles. How do educational approaches differ across countries? Share your experiences adapting to new academic environments.', 'GENERAL', 24, NULL, NULL, 'CLASS_10', 25, 0, 14, 298, false, 'ACTIVE', 14, NOW() - INTERVAL '1 week', NOW()),
('Language Barriers in Science Subjects', 'Sometimes scientific terminology in English is challenging for non-native speakers. Are there effective ways to build scientific vocabulary while learning complex concepts? Looking for language learning strategies.', 'HELP', 25, NULL, NULL, 'CLASS_11', 12, 0, 7, 143, false, 'ACTIVE', 14, NOW() - INTERVAL '3 days', NOW()),

-- ========== CREATIVE AND INNOVATIVE DISCUSSIONS ==========
('Mathematics in Art and Design', 'Discovered that many art forms use mathematical principles like golden ratio, fractals, and geometric patterns. Can anyone share examples of how math concepts appear in visual arts, music, or architecture?', 'GENERAL', 36, 1, 2, 'CLASS_10', 31, 1, 16, 367, false, 'ACTIVE', 16, NOW() - INTERVAL '6 days', NOW()),
('Environmental Solutions Through Science', 'Climate change and environmental issues need scientific solutions. What innovative ideas can we students contribute using our knowledge of chemistry, biology, and physics? Let''s brainstorm eco-friendly projects.', 'GENERAL', 20, NULL, NULL, 'CLASS_10', 27, 0, 18, 289, false, 'ACTIVE', 16, NOW() - INTERVAL '4 days', NOW()),

-- ========== RECENT ACTIVE DISCUSSIONS ==========
('Complete API Test Discussion ✅', 'This discussion demonstrates all fixed functionality including proper enum handling, user synchronization, and comprehensive testing coverage for the discussion service API endpoints.', 'ANNOUNCEMENT', 1, NULL, NULL, 'CLASS_10', 3, 0, 2, 45, false, 'ACTIVE', 17, NOW() - INTERVAL '2 hours', NOW());

-- Update discussion counts in groups
UPDATE discussion.discussion_groups SET discussions_count = (
    SELECT COUNT(*) FROM discussion.discussions WHERE group_id = discussion_groups.id
);

-- Insert discussion tags for better categorization
INSERT INTO discussion.discussion_tags (discussion_id, tags) VALUES
(1, '{"quadratic", "equations", "competitive", "exams", "algebra"}'),
(2, '{"trigonometry", "real-world", "applications", "architecture", "engineering"}'),
(3, '{"calculus", "derivatives", "chain-rule", "composite-functions"}'),
(4, '{"electromagnetic", "induction", "experiments", "lenz-law", "physics"}'),
(5, '{"quantum", "physics", "beginner", "wave-particle", "duality"}'),
(6, '{"projectile", "motion", "mechanics", "problem-solving"}'),
(7, '{"organic", "chemistry", "SN1", "SN2", "mechanisms"}'),
(8, '{"chemical", "equations", "balancing", "redox", "combustion"}'),
(9, '{"lab", "safety", "protocols", "acids", "bases", "solvents"}'),
(10, '{"photosynthesis", "cellular", "respiration", "glucose", "ATP"}'),
(11, '{"digestive", "system", "enzymes", "absorption", "biology"}'),
(12, '{"genetics", "heredity", "mendel", "dihybrid", "crosses"}'),
(13, '{"python", "java", "programming", "beginners", "career"}'),
(14, '{"data", "structures", "arrays", "linked-lists", "algorithms"}'),
(15, '{"debugging", "programming", "best-practices", "tools"}'),
(16, '{"study", "schedule", "board", "exams", "time-management"}'),
(17, '{"group", "study", "individual", "strategies", "methods"}'),
(18, '{"motivation", "stress", "mental-health", "exam-pressure"}'),
(19, '{"cultural", "differences", "education", "international", "adaptation"}'),
(20, '{"language", "barriers", "scientific", "terminology", "vocabulary"}'),
(21, '{"mathematics", "art", "design", "golden-ratio", "fractals"}'),
(22, '{"environment", "climate", "science", "solutions", "sustainability"}'),
(23, '{"api", "testing", "functionality", "discussion", "service"}');

-- Print confirmation
SELECT 'Groups and discussions created successfully' as status;
SELECT COUNT(*) as total_groups FROM discussion.discussion_groups;
SELECT type, COUNT(*) as count FROM discussion.discussion_groups GROUP BY type;
SELECT COUNT(*) as total_discussions FROM discussion.discussions;
SELECT type, COUNT(*) as count FROM discussion.discussions GROUP BY type;
SELECT COUNT(*) as total_group_members FROM discussion.group_members;
SELECT COUNT(*) as total_discussion_tags FROM discussion.discussion_tags;