-- =====================================================
-- EDUCONNECT DEMO DATA INSTALLATION SCRIPT
-- =====================================================
-- Master script to install all demo data across services
-- 
-- USAGE:
-- 1. Ensure all EduConnect services are running
-- 2. Connect to PostgreSQL database as superuser or educonnect user
-- 3. Execute this script: \i /path/to/INSTALL_DEMO_DATA.sql
-- 4. Wait for completion (may take 1-2 minutes)
-- 5. Test APIs using provided test scripts
--
-- IMPORTANT: This script will INSERT data. If you need to reset,
-- run the CLEANUP script first or backup your database.
-- =====================================================

\echo '================================================='
\echo '🚀 EDUCONNECT DEMO DATA INSTALLATION STARTING'
\echo '================================================='
\echo ''

-- Display current database and user
SELECT 
    current_database() as database_name,
    current_user as current_user,
    NOW() as installation_start_time;

\echo ''
\echo '📋 Step 1: Setting up database schemas...'
\i demo-data/shared/00_schema_setup.sql

\echo ''
\echo '👥 Step 2: Creating demo users (Auth Service)...'
\i demo-data/auth/01_demo_users.sql

\echo ''
\echo '📚 Step 3: Setting up subjects and topics (Assessment Service)...'
\i demo-data/assessment/02_subjects_topics.sql

\echo ''
\echo '❓ Step 4: Creating demo questions (Assessment Service)...'
\i demo-data/assessment/03_demo_questions.sql

\echo ''
\echo '🎯 Step 5: Adding question options (Assessment Service)...'
\i demo-data/assessment/04_question_options.sql

\echo ''
\echo '📊 Step 6: Generating user submissions (Assessment Service)...'
\i demo-data/assessment/05_user_submissions.sql

\echo ''
\echo '🏆 Step 7: Creating contests and exams (Assessment Service)...'
\i demo-data/assessment/06_contests_exams.sql

\echo ''
\echo '🎯 Step 8: Creating practice problems (Assessment Service)...'
\i demo-data/assessment/07_practice_problems.sql

\echo ''
\echo '🎓 Step 8a: Adding HSC Questions for Bangladesh Students (Assessment Service)...'
\i demo-data/assessment/08_hsc_questions.sql

\echo ''
\echo '🎯 Step 8b: Adding HSC Question Options (Assessment Service)...'
\i demo-data/assessment/09_hsc_question_options.sql

\echo ''
\echo '👤 Step 9: Syncing users to Discussion Service...'
\i demo-data/discussion/07_discussion_users.sql

\echo ''
\echo '💬 Step 10: Setting up groups and discussions (Discussion Service)...'
\i demo-data/discussion/08_groups_discussions.sql

\echo ''
\echo '💡 Step 11: Adding answers and interactions (Discussion Service)...'
\i demo-data/discussion/09_answers_interactions.sql

\echo ''
\echo '📱 Step 12: Creating messages and AI queries (Discussion Service)...'
\i demo-data/discussion/10_messages_ai.sql

\echo ''
\echo '================================================='
\echo '✅ DEMO DATA INSTALLATION COMPLETED!'
\echo '================================================='

-- Final verification and statistics
\echo ''
\echo '📊 INSTALLATION SUMMARY:'
\echo '========================'

-- Auth Service Statistics
SELECT '🔐 AUTH SERVICE' as service;
SELECT 
    'Users' as entity,
    COUNT(*) as total,
    COUNT(CASE WHEN role = 'ADMIN' THEN 1 END) as admins,
    COUNT(CASE WHEN role = 'QUESTION_SETTER' THEN 1 END) as question_setters,
    COUNT(CASE WHEN role = 'STUDENT' THEN 1 END) as students
FROM auth.users;

-- Assessment Service Statistics  
SELECT '📝 ASSESSMENT SERVICE' as service;
SELECT 'Subjects' as entity, COUNT(*) as total FROM assessment.subjects;
SELECT 'Topics' as entity, COUNT(*) as total FROM assessment.topics;
SELECT 'Questions' as entity, COUNT(*) as total FROM assessment.questions;
SELECT 'Practice Problems' as entity, COUNT(*) as total FROM assessment.practice_problems;
SELECT 'Question Options' as entity, COUNT(*) as total FROM assessment.question_options;
SELECT 'User Submissions' as entity, COUNT(*) as total FROM assessment.user_submissions;
SELECT 'Contests' as entity, COUNT(*) as total FROM assessment.contests;
SELECT 'Live Exams' as entity, COUNT(*) as total FROM assessment.live_exams;
SELECT 'Personalized Exams' as entity, COUNT(*) as total FROM assessment.personalized_exams;
SELECT 'Daily Questions' as entity, COUNT(*) as total FROM assessment.daily_questions;
SELECT 'User Streaks' as entity, COUNT(*) as total FROM assessment.user_streaks;

-- Discussion Service Statistics
SELECT '💬 DISCUSSION SERVICE' as service;
SELECT 'Users' as entity, COUNT(*) as total FROM discussion.users;
SELECT 'Groups' as entity, COUNT(*) as total FROM discussion.discussion_groups;
SELECT 'Discussions' as entity, COUNT(*) as total FROM discussion.discussions;
SELECT 'Answers' as entity, COUNT(*) as total FROM discussion.answers;
SELECT 'Votes' as entity, COUNT(*) as total FROM discussion.votes;
SELECT 'Bookmarks' as entity, COUNT(*) as total FROM discussion.bookmarks;
SELECT 'Notifications' as entity, COUNT(*) as total FROM discussion.notifications;
SELECT 'Conversations' as entity, COUNT(*) as total FROM discussion.conversations;
SELECT 'Messages' as entity, COUNT(*) as total FROM discussion.messages;
SELECT 'AI Queries' as entity, COUNT(*) as total FROM discussion.ai_queries;

\echo ''
\echo '🎯 NEXT STEPS:'
\echo '=============='
\echo '1. Test Auth Service APIs:'
\echo '   ./test-discussion-working.sh'
\echo ''
\echo '2. Test Assessment Service APIs:'
\echo '   ./test-all-assessment-apis.sh'
\echo ''
\echo '3. Login with demo users:'
\echo '   - Email: admin@educonnect.com | Password: password123'
\echo '   - Email: alex@student.edu | Password: password123'
\echo '   - Email: williams@university.edu | Password: password123'
\echo ''
\echo '4. Explore demo data:'
\echo '   - 38+ users across all roles'
\echo '   - 30+ subjects and topics'
\echo '   - 100+ questions with multiple choice options (including HSC questions)'
\echo '   - 17+ discussion groups'
\echo '   - 23+ active discussions'
\echo '   - Comprehensive HSC questions for Bangladesh curriculum'
\echo '   - Realistic user interactions and performance data'
\echo ''
\echo '📁 Demo data files organized in:'
\echo '   - demo-data/auth/ (User management)'
\echo '   - demo-data/assessment/ (Questions, exams, analytics)'
\echo '   - demo-data/discussion/ (Forums, messages, AI)'
\echo '   - demo-data/shared/ (Database setup)'
\echo ''
\echo '🎉 Ready to explore EduConnect with rich demo data!'
\echo '================================================='

-- Set installation completion timestamp
CREATE TABLE IF NOT EXISTS demo_installation_log (
    installed_at TIMESTAMP DEFAULT NOW(),
    version VARCHAR(50) DEFAULT '1.0',
    total_records INTEGER
);

INSERT INTO demo_installation_log (total_records) VALUES (
    (SELECT 
        (SELECT COUNT(*) FROM auth.users) +
        (SELECT COUNT(*) FROM assessment.subjects) +
        (SELECT COUNT(*) FROM assessment.questions) +
        (SELECT COUNT(*) FROM discussion.discussions) +
        (SELECT COUNT(*) FROM discussion.messages)
    )
);

SELECT 
    'Demo data installation completed successfully!' as status,
    installed_at,
    total_records || ' records created' as summary
FROM demo_installation_log 
ORDER BY installed_at DESC 
LIMIT 1;