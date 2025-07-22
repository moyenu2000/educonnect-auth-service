# 🎓 EduConnect Demo Data

This directory contains comprehensive demo data for the EduConnect educational platform, providing realistic test data across all microservices.

## 📁 Directory Structure

```
demo-data/
├── shared/           # Database schema setup
├── auth/            # Authentication service data
├── assessment/      # Assessment service data  
├── discussion/      # Discussion service data
├── INSTALL_DEMO_DATA.sql  # Master installation script
└── README.md        # This file
```

## 🚀 Quick Installation

```bash
# 1. Ensure all services are running
docker-compose up -d

# 2. Install demo data
psql -U educonnect -d educonnect -f demo-data/INSTALL_DEMO_DATA.sql

# 3. Test APIs
./test-discussion-working.sh
./test-all-assessment-apis.sh
```

## 📊 Demo Data Overview

### 👥 Users (38 total)
- **3 Admins**: System administrators with full access
- **7 Question Setters**: Professors and teachers creating content
- **28+ Students**: Diverse learners across different performance levels

### 📚 Educational Content
- **30+ Subjects**: Mathematics, Physics, Chemistry, Biology, Computer Science, etc.
- **50+ Questions**: Multiple choice, numeric, essay, and fill-in-the-blank
- **Complete Topics**: Organized by class level (10, 11, 12)

### 💬 Social Learning
- **17+ Discussion Groups**: Subject-based, study groups, and class groups
- **23+ Active Discussions**: Real conversations with detailed answers
- **Rich Interactions**: Votes, bookmarks, notifications, private messages

### 🏆 Assessment Features
- **Contests**: Math olympiads, programming challenges, science bowls
- **Live Exams**: Scheduled and completed exams with realistic participation
- **Personalized Exams**: Adaptive assessments based on student performance
- **Analytics Data**: User streaks, performance metrics, leaderboards

## 🔑 Demo User Credentials

All users have the password: `password123`

### Admin Users
- `admin@educonnect.com` - System Administrator
- `superadmin@educonnect.com` - Super Admin
- `techadmin@educonnect.com` - Technical Administrator

### Question Setters (Professors)
- `williams@university.edu` - Prof. Sarah Williams (Mathematics)
- `thomson@college.edu` - Dr. Michael Thomson (Physics)
- `chen@institute.edu` - Prof. Lisa Chen (Chemistry)
- `patel@biotech.edu` - Dr. Raj Patel (Biology)

### High-Performing Students
- `alex@student.edu` - Alex Johnson (Math & Physics prodigy)
- `sophia@student.edu` - Sophia Martinez (Math olympiad participant)
- `david@student.edu` - David Chen (Physics enthusiast)
- `emily@student.edu` - Emily Rodriguez (Biology pre-med student)

### Average Students
- `sarah@student.edu` - Sarah Thompson (Group study leader)
- `mike@student.edu` - Mike Anderson (Multi-subject learner)
- `lisa@student.edu` - Lisa Kim (Social learner)

### International Students
- `raj@international.edu` - Raj Sharma (From India, math-focused)
- `yuki@exchange.edu` - Yuki Tanaka (From Japan, tech-interested)
- `ahmed@scholar.edu` - Ahmed Al-Rashid (Scholarship student)

## 📋 File Descriptions

### Shared Infrastructure
- `00_schema_setup.sql` - Database schemas and permissions

### Auth Service
- `01_demo_users.sql` - Comprehensive user accounts with roles

### Assessment Service
- `02_subjects_topics.sql` - Educational subjects and topics
- `03_demo_questions.sql` - Question bank with multiple difficulties
- `04_question_options.sql` - Multiple choice options
- `05_user_submissions.sql` - Student performance data
- `06_contests_exams.sql` - Competitive assessments

### Discussion Service
- `07_discussion_users.sql` - User synchronization for discussions
- `08_groups_discussions.sql` - Study groups and forum discussions
- `09_answers_interactions.sql` - Detailed answers and user interactions
- `10_messages_ai.sql` - Private messaging and AI query responses

## 🎯 Testing Scenarios

### Authentication Testing
```bash
# Test login with different roles
curl -X POST http://localhost:8081/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "alex@student.edu", "password": "password123"}'
```

### Assessment Testing
- Browse questions by subject and difficulty
- Take personalized exams
- Join contests and competitions
- View analytics and leaderboards

### Discussion Testing
- Join study groups
- Participate in subject discussions
- Send private messages
- Use AI query system

## 📊 Performance Patterns

The demo data includes realistic performance patterns:

### High Performers (Top 10%)
- Alex Johnson: 92% average, 7-day math streak
- Sophia Martinez: 85% average, math olympiad participant
- David Chen: 87% physics average, research-oriented

### Average Performers (Middle 70%)
- Sarah Thompson: 67% average, strong group collaboration
- Mike Anderson: 70% average, multi-subject interest
- Realistic mix of correct/incorrect answers

### Struggling Students (Bottom 20%)
- Tom Brown: 45% average, needs extra support
- Mary Davis: 52% average, improving with help
- Benefit from peer tutoring

## 🔄 Data Relationships

The demo data maintains referential integrity:
- Users exist in both auth and discussion services
- Questions link to subjects and topics
- Discussions reference groups and users
- Answers connect to discussions and authors
- Votes and bookmarks create engagement metrics

## 🧹 Cleanup (Optional)

To reset demo data:
```sql
-- Remove demo data (keep structure)
TRUNCATE auth.users RESTART IDENTITY CASCADE;
TRUNCATE assessment.subjects RESTART IDENTITY CASCADE;
TRUNCATE discussion.users RESTART IDENTITY CASCADE;
-- ... (truncate other tables as needed)
```

## 🎉 Features Demonstrated

### Educational Platform
- ✅ Multi-role user management
- ✅ Comprehensive question bank
- ✅ Adaptive assessment system
- ✅ Performance analytics
- ✅ Competitive learning

### Social Learning
- ✅ Discussion forums
- ✅ Study groups
- ✅ Peer-to-peer messaging
- ✅ AI-powered help system
- ✅ Notification system

### Microservices Architecture
- ✅ Service separation
- ✅ Data consistency
- ✅ JWT authentication
- ✅ API integration
- ✅ Scalable design

## 🛠️ Customization

To add your own demo data:
1. Follow the existing SQL file patterns
2. Maintain foreign key relationships
3. Use realistic timestamps and data
4. Update the master installation script
5. Test API endpoints after changes

## 📞 Support

For questions about the demo data:
1. Check the CLAUDE.md file for platform overview
2. Review individual SQL files for specific data
3. Test with provided API scripts
4. Verify service health endpoints

---

**Ready to explore EduConnect! 🚀**