-- =====================================================
-- DISCUSSION SERVICE - User Sync Data
-- =====================================================
-- Copy users from auth service to discussion service for seamless integration

INSERT INTO discussion.users (id, username, email, full_name, bio, avatar_url, created_at, updated_at) VALUES

-- ========== ADMIN USERS ==========
(1, 'admin', 'admin@educonnect.com', 'System Administrator', 'Platform administrator with full access', 'https://ui-avatars.com/api/?name=System+Administrator&background=0D8ABC&color=fff', NOW(), NOW()),
(2, 'super_admin', 'superadmin@educonnect.com', 'Super Admin', 'Senior platform administrator', 'https://ui-avatars.com/api/?name=Super+Admin&background=0D8ABC&color=fff', NOW(), NOW()),
(3, 'tech_admin', 'techadmin@educonnect.com', 'Technical Administrator', 'Technical support and system maintenance', 'https://ui-avatars.com/api/?name=Technical+Administrator&background=0D8ABC&color=fff', NOW(), NOW()),

-- ========== QUESTION SETTERS ==========
(4, 'prof_williams', 'williams@university.edu', 'Prof. Sarah Williams', 'Mathematics Professor at Central University, PhD in Applied Mathematics', 'https://ui-avatars.com/api/?name=Prof+Sarah+Williams&background=28A745&color=fff', NOW(), NOW()),
(5, 'dr_thomson', 'thomson@college.edu', 'Dr. Michael Thomson', 'Physics Department Head, 15 years teaching experience', 'https://ui-avatars.com/api/?name=Dr+Michael+Thomson&background=28A745&color=fff', NOW(), NOW()),
(6, 'prof_chen', 'chen@institute.edu', 'Prof. Lisa Chen', 'Chemistry Professor specializing in Organic Chemistry', 'https://ui-avatars.com/api/?name=Prof+Lisa+Chen&background=28A745&color=fff', NOW(), NOW()),
(7, 'dr_patel', 'patel@biotech.edu', 'Dr. Raj Patel', 'Biology and Biotechnology expert, Research Scientist', 'https://ui-avatars.com/api/?name=Dr+Raj+Patel&background=28A745&color=fff', NOW(), NOW()),
(8, 'prof_garcia', 'garcia@compsci.edu', 'Prof. Maria Garcia', 'Computer Science Professor, Software Engineering specialist', 'https://ui-avatars.com/api/?name=Prof+Maria+Garcia&background=28A745&color=fff', NOW(), NOW()),
(9, 'dr_brown', 'brown@english.edu', 'Dr. James Brown', 'English Literature Professor, Creative Writing expert', 'https://ui-avatars.com/api/?name=Dr+James+Brown&background=28A745&color=fff', NOW(), NOW()),
(10, 'prof_davis', 'davis@history.edu', 'Prof. Emma Davis', 'History Professor specializing in World History', 'https://ui-avatars.com/api/?name=Prof+Emma+Davis&background=28A745&color=fff', NOW(), NOW()),

-- ========== HIGH-PERFORMING STUDENTS ==========
(12, 'alex_student', 'alex@student.edu', 'Alex Johnson', 'Top performer in Mathematics and Physics, loves problem-solving', 'https://ui-avatars.com/api/?name=Alex+Johnson&background=6F42C1&color=fff', NOW(), NOW()),
(13, 'sophia_math', 'sophia@student.edu', 'Sophia Martinez', 'Math enthusiast, participates in olympiads and competitions', 'https://ui-avatars.com/api/?name=Sophia+Martinez&background=6F42C1&color=fff', NOW(), NOW()),
(14, 'david_physics', 'david@student.edu', 'David Chen', 'Physics prodigy, aspiring to be a researcher', 'https://ui-avatars.com/api/?name=David+Chen&background=6F42C1&color=fff', NOW(), NOW()),
(15, 'emily_bio', 'emily@student.edu', 'Emily Rodriguez', 'Biology and Chemistry student, pre-med track', 'https://ui-avatars.com/api/?name=Emily+Rodriguez&background=6F42C1&color=fff', NOW(), NOW()),
(35, 'james_cs', 'james@student.edu', 'James Wilson', 'Computer Science student, competitive programmer', 'https://ui-avatars.com/api/?name=James+Wilson&background=6F42C1&color=fff', NOW(), NOW()),

-- ========== AVERAGE STUDENTS ==========
(16, 'sarah_learner', 'sarah@student.edu', 'Sarah Thompson', 'Hardworking student, enjoys group study sessions', 'https://ui-avatars.com/api/?name=Sarah+Thompson&background=17A2B8&color=fff', NOW(), NOW()),
(17, 'mike_average', 'mike@student.edu', 'Mike Anderson', 'Average performer, interested in multiple subjects', 'https://ui-avatars.com/api/?name=Mike+Anderson&background=17A2B8&color=fff', NOW(), NOW()),
(18, 'lisa_social', 'lisa@student.edu', 'Lisa Kim', 'Social learner, loves discussions and group activities', 'https://ui-avatars.com/api/?name=Lisa+Kim&background=17A2B8&color=fff', NOW(), NOW()),
(19, 'john_steady', 'john@student.edu', 'John Taylor', 'Steady progress student, good at following instructions', 'https://ui-avatars.com/api/?name=John+Taylor&background=17A2B8&color=fff', NOW(), NOW()),
(20, 'anna_curious', 'anna@student.edu', 'Anna White', 'Curious learner, asks lots of questions', 'https://ui-avatars.com/api/?name=Anna+White&background=17A2B8&color=fff', NOW(), NOW()),

-- ========== STRUGGLING STUDENTS ==========
(21, 'tom_struggling', 'tom@student.edu', 'Tom Brown', 'Needs extra help, benefits from peer support', 'https://ui-avatars.com/api/?name=Tom+Brown&background=FD7E14&color=fff', NOW(), NOW()),
(22, 'mary_effort', 'mary@student.edu', 'Mary Davis', 'Puts in effort but struggles with concepts', 'https://ui-avatars.com/api/?name=Mary+Davis&background=FD7E14&color=fff', NOW(), NOW()),
(23, 'peter_help', 'peter@student.edu', 'Peter Garcia', 'Seeks help regularly, improving slowly', 'https://ui-avatars.com/api/?name=Peter+Garcia&background=FD7E14&color=fff', NOW(), NOW()),

-- ========== DIVERSE BACKGROUNDS ==========
(24, 'raj_international', 'raj@international.edu', 'Raj Sharma', 'International student from India, strong in mathematics', 'https://ui-avatars.com/api/?name=Raj+Sharma&background=E83E8C&color=fff', NOW(), NOW()),
(25, 'yuki_exchange', 'yuki@exchange.edu', 'Yuki Tanaka', 'Exchange student from Japan, interested in technology', 'https://ui-avatars.com/api/?name=Yuki+Tanaka&background=E83E8C&color=fff', NOW(), NOW()),
(26, 'ahmed_scholar', 'ahmed@scholar.edu', 'Ahmed Al-Rashid', 'Scholarship student, excellent in sciences', 'https://ui-avatars.com/api/?name=Ahmed+Al-Rashid&background=E83E8C&color=fff', NOW(), NOW()),
(36, 'marie_artist', 'marie@arts.edu', 'Marie Dubois', 'Arts student also taking science courses', 'https://ui-avatars.com/api/?name=Marie+Dubois&background=E83E8C&color=fff', NOW(), NOW()),

-- ========== CLASS LEVEL STUDENTS ==========
(27, 'class10_student1', 'c10s1@class10.edu', 'Ryan Mitchell', 'Class 10 student, preparing for board exams', 'https://ui-avatars.com/api/?name=Ryan+Mitchell&background=20C997&color=fff', NOW(), NOW()),
(28, 'class10_student2', 'c10s2@class10.edu', 'Emma Thompson', 'Class 10 student, strong in languages', 'https://ui-avatars.com/api/?name=Emma+Thompson&background=20C997&color=fff', NOW(), NOW()),
(29, 'class11_student1', 'c11s1@class11.edu', 'Kevin Park', 'Class 11 student, science stream', 'https://ui-avatars.com/api/?name=Kevin+Park&background=20C997&color=fff', NOW(), NOW()),
(30, 'class11_student2', 'c11s2@class11.edu', 'Rachel Green', 'Class 11 student, commerce stream', 'https://ui-avatars.com/api/?name=Rachel+Green&background=20C997&color=fff', NOW(), NOW()),
(31, 'class12_student1', 'c12s1@class12.edu', 'Daniel Lee', 'Class 12 student, preparing for college entrance', 'https://ui-avatars.com/api/?name=Daniel+Lee&background=20C997&color=fff', NOW(), NOW()),
(32, 'class12_student2', 'c12s2@class12.edu', 'Olivia Brown', 'Class 12 student, arts stream', 'https://ui-avatars.com/api/?name=Olivia+Brown&background=20C997&color=fff', NOW(), NOW()),

-- ========== SPECIAL USERS ==========
(33, 'inactive_user', 'inactive@test.edu', 'Inactive User', 'Account disabled for testing', 'https://ui-avatars.com/api/?name=Inactive+User&background=6C757D&color=fff', NOW(), NOW()),
(34, 'unverified_user', 'unverified@test.edu', 'Unverified User', 'Email not verified for testing', 'https://ui-avatars.com/api/?name=Unverified+User&background=6C757D&color=fff', NOW(), NOW()),
(37, 'oauth_user', 'oauth@gmail.com', 'OAuth Test User', 'Google OAuth user for testing', 'https://ui-avatars.com/api/?name=OAuth+Test+User&background=DC3545&color=fff', NOW(), NOW()),

-- ========== LEGACY USERS FOR COMPATIBILITY ==========
(38, 'john_doe', 'john.doe@example.com', 'John Doe', 'Computer Science student passionate about programming', 'https://ui-avatars.com/api/?name=John+Doe&background=007BFF&color=fff', NOW(), NOW()),
(39, 'jane_smith', 'jane.smith@example.com', 'Jane Smith', 'Mathematics teacher with 10 years experience', 'https://ui-avatars.com/api/?name=Jane+Smith&background=28A745&color=fff', NOW(), NOW());

-- Print confirmation
SELECT 'Discussion service users synchronized successfully' as status;
SELECT COUNT(*) as total_users FROM discussion.users;