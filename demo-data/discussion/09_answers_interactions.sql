-- =====================================================
-- DISCUSSION SERVICE - Answers and User Interactions
-- =====================================================
-- Comprehensive answers, votes, bookmarks, and user interactions

-- Insert detailed answers for discussions
INSERT INTO discussion.answers (content, author_id, discussion_id, upvotes_count, downvotes_count, is_accepted, created_at, updated_at) VALUES

-- ========== ANSWERS FOR QUADRATIC EQUATIONS DISCUSSION (ID: 1) ==========
('The quadratic formula x = (-b ± √(b²-4ac)) / 2a is always reliable, but here are faster techniques for exams:

1. **Quick Factoring Check**: Look for two numbers that multiply to give ''ac'' and add to give ''b''. For 3x² + 7x - 12, we need numbers that multiply to -36 and add to 7. Those are 9 and -4.

2. **Factoring by Grouping**: Rewrite as 3x² + 9x - 4x - 12, then factor: 3x(x + 3) - 4(x + 3) = (3x - 4)(x + 3)

3. **Completing the Square**: Sometimes faster than the formula for perfect squares.

Time-saving tip: Always check if discriminant is a perfect square first!', 4, 1, 12, 0, true, NOW() - INTERVAL '2 days 18 hours', NOW()),

('Great explanation! I''d add the **discriminant shortcut**:
- If b² - 4ac = 0: One solution (perfect square)
- If b² - 4ac > 0: Two real solutions
- If b² - 4ac < 0: No real solutions

For competitive exams, memorize common discriminant values. Also, for equations like x² + bx + c = 0, if you can quickly spot that the sum of roots = -b and product = c, you can often guess and check faster than calculating!', 12, 1, 8, 0, false, NOW() - INTERVAL '2 days 12 hours', NOW()),

('Here''s a **visual memory trick** that helps me:
Think of the quadratic formula as a song: "x equals negative b, plus or minus the square root, b squared minus four a c, all over two a!"

Also, for multiple choice questions, you can substitute the given options back into the equation - sometimes faster than solving!', 13, 1, 6, 0, false, NOW() - INTERVAL '2 days 6 hours', NOW()),

('Another **competitive exam strategy**: Learn to recognize special forms:
- x² - a² = (x+a)(x-a) [Difference of squares]
- x² + 2ax + a² = (x+a)² [Perfect square]
- For ax² + bx + c, if a+b+c = 0, then x = 1 is a root
- If a-b+c = 0, then x = -1 is a root

These shortcuts can save precious minutes in competitive exams!', 14, 1, 5, 0, false, NOW() - INTERVAL '2 days 2 hours', NOW()),

-- ========== ANSWERS FOR ELECTROMAGNETIC INDUCTION DISCUSSION (ID: 4) ==========
('Lenz''s law is beautifully simple: **the induced current always opposes the change that created it**.

Here''s why the direction changes:
1. When you move the magnet **toward** the coil, the magnetic flux through the coil increases
2. The induced current creates its own magnetic field to **oppose** this increase
3. When you move the magnet **away**, flux decreases, so the induced current reverses to **oppose** this decrease

**Real-world example**: Electric generators in power plants work exactly this way - rotating magnets near coils create alternating current because the magnetic field direction constantly changes!

**Memory trick**: Lenz''s law is nature''s way of being "stubborn" - it always resists change!', 5, 4, 15, 0, true, NOW() - INTERVAL '1 day 20 hours', NOW()),

('Perfect explanation! Let me add the **right-hand rule** for determining current direction:

1. Point your thumb in the direction the magnet is moving
2. Curl your fingers in the direction of the magnetic field lines
3. Your palm shows the direction of the induced current

**Another practical example**: Regenerative braking in electric cars! When you brake, the car''s motion generates electricity that charges the battery - this is Lenz''s law in action, opposing the motion by converting kinetic energy to electrical energy.', 14, 4, 9, 0, false, NOW() - INTERVAL '1 day 12 hours', NOW()),

('Great question! Here''s a simple **experiment** you can try at home:
- Drop a strong magnet through a copper tube
- The magnet falls much slower than expected!
- This is because the changing magnetic field induces currents in the copper (eddy currents) that create an opposing magnetic field

This same principle is used in magnetic levitation trains and electromagnetic dampers in buildings!', 12, 4, 7, 0, false, NOW() - INTERVAL '1 day 6 hours', NOW()),

-- ========== ANSWERS FOR TRIGONOMETRY APPLICATIONS DISCUSSION (ID: 2) ==========
('Trigonometry is everywhere in architecture! Here are specific examples:

**1. Roof Construction**: 
- Sine and cosine determine rafter lengths and angles
- For a 30° roof pitch, rafter length = building width / (2 × cos(30°))

**2. Bridge Design**:
- Suspension bridges use sine curves for cable shapes
- Bridge support angles calculated using trigonometric ratios

**3. Staircase Design**:
- Optimal stair angle is typically 35-37° for comfort
- Rise/run ratios calculated using tangent function

**4. Solar Panel Installation**:
- Panel angle = 90° - latitude for maximum efficiency
- Shadow calculations prevent panel shading

I''m an architecture student and use trig daily for these calculations!', 29, 2, 18, 1, false, NOW() - INTERVAL '6 days 18 hours', NOW()),

-- ========== ANSWERS FOR ORGANIC CHEMISTRY MECHANISMS DISCUSSION (ID: 7) ==========
('Great question! Here''s how to predict SN1 vs SN2 mechanisms:

**SN2 Favored When**:
- Primary carbons (least substituted)
- Strong nucleophile (like OH⁻, CN⁻)
- Polar aprotic solvent (DMSO, acetone)
- Lower temperature

**SN1 Favored When**:
- Tertiary carbons (most substituted)
- Weak nucleophile (like H₂O, alcohols)
- Polar protic solvent (water, alcohols)
- Higher temperature

**Memory trick**: "SN2 likes it simple and strong, SN1 likes it crowded and weak"

**Key difference**: SN2 = one step, inversion of stereochemistry; SN1 = two steps, racemization', 6, 7, 14, 1, true, NOW() - INTERVAL '18 hours', NOW()),

-- ========== ANSWERS FOR PHOTOSYNTHESIS VS RESPIRATION DISCUSSION (ID: 10) ==========
('Think of photosynthesis and cellular respiration as **opposite processes that work together**:

**Photosynthesis** (in plants):
- **Input**: CO₂ + H₂O + sunlight
- **Output**: C₆H₁₂O₆ + O₂
- **Purpose**: Store energy in glucose
- **Location**: Chloroplasts

**Cellular Respiration** (in all living things):
- **Input**: C₆H₁₂O₆ + O₂
- **Output**: CO₂ + H₂O + ATP
- **Purpose**: Release energy from glucose
- **Location**: Mitochondria

**The Beautiful Cycle**: Plants make glucose and oxygen, animals use that glucose and oxygen to make energy, producing CO₂ and water that plants need again!

**Memory trick**: Photosynthesis = "Photo-synthesis" = making something with light. Respiration = breaking down for energy.', 7, 10, 16, 0, true, NOW() - INTERVAL '1 day 18 hours', NOW()),

-- ========== ANSWERS FOR PYTHON VS JAVA DISCUSSION (ID: 13) ==========
('Great question! As someone who''s learned both, here''s my honest take:

**Start with Python if**:
- You want to see results quickly and stay motivated
- You''re interested in data science, AI, or web development
- You prefer readable, concise code
- You''re learning programming concepts for the first time

**Start with Java if**:
- You want to understand programming fundamentals deeply
- You''re aiming for enterprise software development
- You want to build Android apps
- You don''t mind more verbose syntax for stronger structure

**My recommendation**: Start with Python to learn programming logic and problem-solving. Once you''re comfortable with programming concepts, learning Java (or any language) becomes much easier.

Both are valuable - Python for rapid development and prototyping, Java for large-scale applications. You''ll likely use both in your career!', 8, 13, 22, 3, false, NOW() - INTERVAL '3 days 18 hours', NOW()),

('I started with Java and I''m glad I did! Here''s why:

**Java teaches you good habits**:
- Explicit variable types help you understand data better
- Object-oriented principles from the start
- Compiler catches errors early
- Industry-standard practices built-in

**BUT** - Python is definitely more beginner-friendly. The syntax is cleaner and you spend less time fighting with semicolons and brackets.

**Compromise suggestion**: Learn Python first for 2-3 months to get comfortable with programming logic, then switch to Java to understand deeper concepts. This way you get the best of both worlds!

**Career perspective**: Most companies use multiple languages. Being adaptable is more important than mastering one language.', 35, 13, 15, 1, false, NOW() - INTERVAL '3 days 12 hours', NOW()),

-- ========== ANSWERS FOR DATA STRUCTURES DISCUSSION (ID: 14) ==========
('Excellent question! Here''s when to use each data structure:

**Arrays** - Use when:
- You need fast access by index (O(1))
- Memory is limited (most efficient)
- You know the size beforehand
- Example: Storing grades for a fixed number of students

**Linked Lists** - Use when:
- Size changes frequently
- You insert/delete at beginning often
- Memory is not contiguous
- Example: Undo functionality in text editors

**Stacks** - Use when:
- Last-in-first-out needed
- Function calls, undo operations
- Expression evaluation
- Example: Browser back button, recursion

**Queues** - Use when:
- First-in-first-out needed
- Processing tasks in order
- Breadth-first search
- Example: Print queue, customer service lines

**Decision strategy**: Think about your most common operations - accessing, inserting, deleting, or searching?', 8, 14, 19, 0, true, NOW() - INTERVAL '18 hours', NOW()),

-- ========== ANSWERS FOR STUDY SCHEDULE DISCUSSION (ID: 16) ==========
('Here''s my board exam strategy that got me 95%:

**Time Allocation Rule**:
- Strong subjects: 30% of time (maintenance)
- Average subjects: 40% of time (improvement)
- Weak subjects: 30% of time (maximum gain)

**Daily Schedule Example**:
- 6:00-7:30 AM: Weak subject (fresh mind)
- 8:00-9:30 AM: Strong subject (confidence boost)
- 4:00-6:00 PM: Average subject (afternoon focus)
- 8:00-9:30 PM: Review and practice tests

**Weekly Plan**:
- Monday/Wednesday/Friday: Science subjects
- Tuesday/Thursday/Saturday: Math and languages
- Sunday: Mixed revision and mock tests

**Key tips**:
1. Start with your weakest subject when mind is fresh
2. End with strong subjects for confidence
3. Take breaks every 90 minutes
4. Review yesterday''s work before starting new topics

Consistency beats intensity - 6 hours daily is better than 12 hours occasionally!', 12, 16, 21, 0, false, NOW() - INTERVAL '1 day 18 hours', NOW()),

-- ========== ANSWERS FOR MOTIVATION DISCUSSION (ID: 18) ==========
('I completely understand this feeling! Here are strategies that helped me:

**Break Down the Mountain**:
- Don''t think "I have 6 months of syllabus"
- Think "I have today''s 3 topics"
- Celebrate small daily wins

**The 2-Minute Rule**:
- When overwhelmed, commit to just 2 minutes of study
- Usually, you''ll continue once you start
- Builds momentum without pressure

**Study Buddies**:
- Join study groups (like this one!)
- Accountability partners keep you going
- Teaching others reinforces your knowledge

**Mental Health Care**:
- 15-minute walks between study sessions
- Proper sleep (7-8 hours) is non-negotiable
- Talk to family/friends about stress

**Perspective Shift**:
- This is temporary stress for long-term gain
- Everyone feels this way - you''re not alone
- Focus on progress, not perfection

Remember: You''ve handled 100% of your tough days so far. You''ve got this! 💪', 16, 18, 14, 0, false, NOW() - INTERVAL '18 hours', NOW()),

-- ========== RECENT ANSWERS ==========
('This is a test answer for the API test discussion. The functionality is working correctly with proper user authentication and data validation.', 12, 23, 2, 0, false, NOW() - INTERVAL '1 hour', NOW()),
('Confirmed! All discussion service endpoints are functioning properly with the new demo data.', 16, 23, 1, 0, false, NOW() - INTERVAL '30 minutes', NOW());

-- Insert votes on discussions and answers
INSERT INTO discussion.votes (user_id, discussion_id, answer_id, is_upvote, created_at) VALUES

-- ========== VOTES ON DISCUSSIONS ==========
-- Quadratic equations discussion (very popular)
(4, 1, NULL, true, NOW() - INTERVAL '2 days 20 hours'),
(13, 1, NULL, true, NOW() - INTERVAL '2 days 18 hours'),
(14, 1, NULL, true, NOW() - INTERVAL '2 days 16 hours'),
(16, 1, NULL, true, NOW() - INTERVAL '2 days 14 hours'),
(19, 1, NULL, true, NOW() - INTERVAL '2 days 12 hours'),
(21, 1, NULL, true, NOW() - INTERVAL '2 days 10 hours'),
(24, 1, NULL, true, NOW() - INTERVAL '2 days 8 hours'),
(27, 1, NULL, true, NOW() - INTERVAL '2 days 6 hours'),

-- Trigonometry applications (highly upvoted)
(4, 2, NULL, true, NOW() - INTERVAL '6 days 20 hours'),
(12, 2, NULL, true, NOW() - INTERVAL '6 days 18 hours'),
(14, 2, NULL, true, NOW() - INTERVAL '6 days 16 hours'),
(16, 2, NULL, true, NOW() - INTERVAL '6 days 14 hours'),
(19, 2, NULL, true, NOW() - INTERVAL '6 days 12 hours'),
(25, 2, NULL, true, NOW() - INTERVAL '6 days 10 hours'),
(27, 2, NULL, true, NOW() - INTERVAL '6 days 8 hours'),
(29, 2, NULL, true, NOW() - INTERVAL '6 days 6 hours'),
(1, 2, NULL, false, NOW() - INTERVAL '6 days 4 hours'), -- One downvote

-- ========== VOTES ON ANSWERS ==========
-- Votes on quadratic equations answers
(12, NULL, 1, true, NOW() - INTERVAL '2 days 17 hours'), -- Prof Williams' answer
(13, NULL, 1, true, NOW() - INTERVAL '2 days 16 hours'),
(14, NULL, 1, true, NOW() - INTERVAL '2 days 15 hours'),
(16, NULL, 1, true, NOW() - INTERVAL '2 days 14 hours'),
(19, NULL, 1, true, NOW() - INTERVAL '2 days 13 hours'),
(21, NULL, 1, true, NOW() - INTERVAL '2 days 12 hours'),
(24, NULL, 1, true, NOW() - INTERVAL '2 days 11 hours'),
(27, NULL, 1, true, NOW() - INTERVAL '2 days 10 hours'),

-- Votes on Alex's discriminant answer
(4, NULL, 2, true, NOW() - INTERVAL '2 days 11 hours'),
(13, NULL, 2, true, NOW() - INTERVAL '2 days 10 hours'),
(16, NULL, 2, true, NOW() - INTERVAL '2 days 9 hours'),
(19, NULL, 2, true, NOW() - INTERVAL '2 days 8 hours'),
(21, NULL, 2, true, NOW() - INTERVAL '2 days 7 hours'),

-- Votes on electromagnetic induction answers
(12, NULL, 5, true, NOW() - INTERVAL '1 day 19 hours'),
(14, NULL, 5, true, NOW() - INTERVAL '1 day 18 hours'),
(15, NULL, 5, true, NOW() - INTERVAL '1 day 17 hours'),
(16, NULL, 5, true, NOW() - INTERVAL '1 day 16 hours'),

-- Votes on programming discussion answers
(25, NULL, 9, true, NOW() - INTERVAL '3 days 17 hours'),
(29, NULL, 9, true, NOW() - INTERVAL '3 days 16 hours'),
(35, NULL, 9, true, NOW() - INTERVAL '3 days 15 hours'),
(38, NULL, 9, true, NOW() - INTERVAL '3 days 14 hours'),

-- Insert bookmarks (users saving interesting discussions)
INSERT INTO discussion.bookmarks (user_id, discussion_id, created_at) VALUES
-- High performers bookmarking advanced content
(12, 1, NOW() - INTERVAL '2 days 12 hours'), -- Alex bookmarks quadratic strategies
(12, 4, NOW() - INTERVAL '1 day 12 hours'),  -- Alex bookmarks physics
(12, 13, NOW() - INTERVAL '3 days 12 hours'), -- Alex bookmarks programming
(13, 1, NOW() - INTERVAL '2 days 10 hours'), -- Sophia bookmarks math
(13, 2, NOW() - INTERVAL '6 days 10 hours'), -- Sophia bookmarks trigonometry
(14, 4, NOW() - INTERVAL '1 day 10 hours'),  -- David bookmarks physics
(14, 5, NOW() - INTERVAL '4 days 10 hours'), -- David bookmarks quantum physics
(15, 7, NOW() - INTERVAL '12 hours'),        -- Emily bookmarks chemistry
(15, 10, NOW() - INTERVAL '1 day 6 hours'),  -- Emily bookmarks biology

-- Average students bookmarking helpful content
(16, 16, NOW() - INTERVAL '1 day 8 hours'),  -- Sarah bookmarks study schedule
(16, 18, NOW() - INTERVAL '12 hours'),       -- Sarah bookmarks motivation
(17, 17, NOW() - INTERVAL '4 days 8 hours'), -- Mike bookmarks group vs individual study
(18, 16, NOW() - INTERVAL '1 day 6 hours'),  -- Lisa bookmarks study tips
(19, 1, NOW() - INTERVAL '2 days 8 hours'),  -- John bookmarks math help
(20, 10, NOW() - INTERVAL '1 day 4 hours'),  -- Anna bookmarks biology

-- Struggling students bookmarking basic help
(21, 18, NOW() - INTERVAL '6 hours'),        -- Tom bookmarks motivation
(21, 16, NOW() - INTERVAL '1 day 4 hours'),  -- Tom bookmarks study schedule
(22, 11, NOW() - INTERVAL '8 hours'),        -- Mary bookmarks digestive system
(23, 16, NOW() - INTERVAL '1 day 2 hours'),  -- Peter bookmarks study tips

-- International students bookmarking relevant content
(24, 19, NOW() - INTERVAL '6 days 8 hours'), -- Raj bookmarks cultural differences
(25, 20, NOW() - INTERVAL '2 days 8 hours'), -- Yuki bookmarks language barriers
(25, 13, NOW() - INTERVAL '3 days 8 hours'), -- Yuki bookmarks programming
(26, 19, NOW() - INTERVAL '6 days 6 hours'); -- Ahmed bookmarks cultural content

-- Insert notifications for user engagement
INSERT INTO discussion.notifications (type, title, content, user_id, related_id, related_type, is_read, created_at) VALUES

-- ========== ANSWER NOTIFICATIONS ==========
('ANSWER', 'New Answer on Your Question', 'Prof. Williams answered your question about quadratic equation strategies', 12, 1, 'ANSWER', true, NOW() - INTERVAL '2 days 18 hours'),
('ANSWER', 'New Answer on Your Question', 'Dr. Thomson explained electromagnetic induction in your physics discussion', 14, 5, 'ANSWER', true, NOW() - INTERVAL '1 day 20 hours'),
('ANSWER', 'New Answer on Your Question', 'Prof. Chen provided SN1/SN2 mechanism guidance on your chemistry question', 15, 7, 'ANSWER', false, NOW() - INTERVAL '18 hours'),

-- ========== UPVOTE NOTIFICATIONS ==========
('UPVOTE', 'Your Answer Was Upvoted', 'Your quadratic equation explanation received multiple upvotes', 4, 1, 'ANSWER', true, NOW() - INTERVAL '2 days 12 hours'),
('UPVOTE', 'Your Discussion Was Upvoted', 'Your trigonometry applications discussion is trending with 15 upvotes', 13, 2, 'DISCUSSION', true, NOW() - INTERVAL '6 days 8 hours'),
('UPVOTE', 'Your Answer Was Upvoted', 'Your electromagnetic induction answer helped many students', 5, 5, 'ANSWER', true, NOW() - INTERVAL '1 day 16 hours'),

-- ========== GROUP ACTIVITY NOTIFICATIONS ==========
('GROUP_ACTIVITY', 'New Discussion in Your Group', 'Alex posted a new math problem in Mathematics Excellence Hub', 13, 1, 'DISCUSSION', false, NOW() - INTERVAL '3 days'),
('GROUP_ACTIVITY', 'New Discussion in Your Group', 'David shared a physics experiment in Physics Research & Discovery', 12, 4, 'DISCUSSION', false, NOW() - INTERVAL '2 days'),
('GROUP_ACTIVITY', 'New Member Joined', 'Raj Sharma joined Mathematics Excellence Hub', 4, 1, 'GROUP', true, NOW() - INTERVAL '2 weeks'),

-- ========== MENTION NOTIFICATIONS ==========
('MENTION', 'You Were Mentioned', 'Alex mentioned you in a discussion about study strategies', 16, 16, 'DISCUSSION', false, NOW() - INTERVAL '1 day'),
('MENTION', 'You Were Mentioned', 'Emily mentioned you in the biology discussion', 18, 10, 'DISCUSSION', true, NOW() - INTERVAL '1 day 6 hours'),

-- ========== FOLLOW NOTIFICATIONS ==========
('FOLLOW', 'New Follower', 'Sarah Thompson started following your academic activity', 12, 16, 'USER', false, NOW() - INTERVAL '2 days'),
('FOLLOW', 'New Follower', 'Tom Brown started following your helpful answers', 4, 21, 'USER', true, NOW() - INTERVAL '1 week'),

-- ========== ACHIEVEMENT NOTIFICATIONS ==========
('ACHIEVEMENT', 'Answer Accepted!', 'Your answer about quadratic equations was marked as the best solution', 4, 1, 'ANSWER', true, NOW() - INTERVAL '2 days 6 hours'),
('ACHIEVEMENT', 'Top Contributor', 'You''re now a top contributor in the Mathematics Excellence Hub group', 12, 1, 'GROUP', false, NOW() - INTERVAL '1 week'),

-- ========== RECENT NOTIFICATIONS ==========
('UPVOTE', 'Your Test Answer Was Upvoted', 'Your API test answer received positive feedback', 12, 23, 'ANSWER', false, NOW() - INTERVAL '30 minutes'),
('ANSWER', 'New Response to Test Discussion', 'Someone responded to the API test discussion', 1, 23, 'DISCUSSION', false, NOW() - INTERVAL '15 minutes');

-- Update vote counts in discussions and answers
UPDATE discussion.discussions SET 
    upvotes_count = (SELECT COUNT(*) FROM discussion.votes WHERE discussion_id = discussions.id AND is_upvote = true),
    downvotes_count = (SELECT COUNT(*) FROM discussion.votes WHERE discussion_id = discussions.id AND is_upvote = false);

UPDATE discussion.answers SET 
    upvotes_count = (SELECT COUNT(*) FROM discussion.votes WHERE answer_id = answers.id AND is_upvote = true),
    downvotes_count = (SELECT COUNT(*) FROM discussion.votes WHERE answer_id = answers.id AND is_upvote = false);

-- Update answer counts in discussions
UPDATE discussion.discussions SET 
    answers_count = (SELECT COUNT(*) FROM discussion.answers WHERE discussion_id = discussions.id);

-- Print confirmation
SELECT 'Answers and interactions created successfully' as status;
SELECT COUNT(*) as total_answers FROM discussion.answers;
SELECT COUNT(*) as total_votes FROM discussion.votes;
SELECT COUNT(*) as total_bookmarks FROM discussion.bookmarks;
SELECT COUNT(*) as total_notifications FROM discussion.notifications;
SELECT 
    is_upvote,
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
FROM discussion.votes 
GROUP BY is_upvote;