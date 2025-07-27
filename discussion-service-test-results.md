# Discussion Service API Test Results

**Service URL:** http://localhost:8082/api/v1  
**Test Date:** রবিবার 27 জুলাই 2025 06:33:59 অপরাহ্ণ +06  
**JWT Token:** eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiU1RVREVOVCIsInVzZXJJZCI6MSwiZW1haWwiOiJ0ZXN0QGVkdWNvbm5lY3QuY29tIiwic3ViIjoidGVzdHVzZXIiLCJpYXQiOjE3NTM2MTk2MzksImV4cCI6MTc1MzcwNjAzOX0.7D-YCzr0Jn1TRWngx_eqPlGV5L6jodVA_Eeq1GQAyqAUaHj0Cta05MWc_dYqh-3fhl_VV738ZNQhbbw8dACbUQ

---

## Get Public Discussions
**Method:** GET  
**Endpoint:** /discussions/public  
**Authentication Required:** false  

**Request Data:**
```json

```

**Response Status:** 200  
**Response Time:** 0.007483s  
**Response Body:**
```json
{
    "success": true,
    "data": {
        "content": [],
        "totalElements": 0,
        "totalPages": 0,
        "currentPage": 0,
        "size": 20,
        "first": true,
        "last": true,
        "empty": true
    }
}
```

**Status:** ✅ PASS

---

## Get Public Discussion by ID
**Method:** GET  
**Endpoint:** /discussions/1/public  
**Authentication Required:** false  

**Request Data:**
```json

```

**Response Status:** 404  
**Response Time:** 0.016660s  
**Response Body:**
```json
{
    "success": false,
    "error": "Discussion not found with id: 1"
}
```

**Status:** ✅ PASS

---

## Health Check Endpoint
**Method:** GET  
**Endpoint:** /actuator/health  
**Authentication Required:** false  

**Request Data:**
```json

```

**Response Status:** 200  
**Response Time:** 0.010830s  
**Response Body:**
```json
{
    "status": "UP",
    "components": {
        "db": {
            "status": "UP",
            "details": {
                "database": "PostgreSQL",
                "validationQuery": "isValid()"
            }
        },
        "diskSpace": {
            "status": "UP",
            "details": {
                "total": 250375106560,
                "free": 91336409088,
                "threshold": 10485760,
                "path": "/home/pridesys/projects/408_backend/educonnect-auth-service/discussion-service/.",
                "exists": true
            }
        },
        "ping": {
            "status": "UP"
        },
        "rabbit": {
            "status": "UP",
            "details": {
                "version": "3.12.14"
            }
        },
        "redis": {
            "status": "UP",
            "details": {
                "version": "7.4.5"
            }
        },
        "ssl": {
            "status": "UP",
            "details": {
                "validChains": [],
                "invalidChains": []
            }
        }
    }
}
```

**Status:** ✅ PASS

---

## Get All Discussions
**Method:** GET  
**Endpoint:** /discussions  
**Authentication Required:** true  

**Request Data:**
```json

```

**Response Status:** 200  
**Response Time:** 0.013274s  
**Response Body:**
```json
{
    "success": true,
    "data": {
        "content": [],
        "totalElements": 0,
        "totalPages": 0,
        "currentPage": 0,
        "size": 20,
        "first": true,
        "last": true,
        "empty": true
    }
}
```

**Status:** ✅ PASS

---

## Get Discussion by ID
**Method:** GET  
**Endpoint:** /discussions/1  
**Authentication Required:** true  

**Request Data:**
```json

```

**Response Status:** 404  
**Response Time:** 0.015998s  
**Response Body:**
```json
{
    "success": false,
    "error": "Discussion not found with id: 1"
}
```

**Status:** ✅ PASS

---

## Create Discussion
**Method:** POST  
**Endpoint:** /discussions  
**Authentication Required:** true  

**Request Data:**
```json
{"title":"Test Discussion","content":"Test content","type":"QUESTION","subjectId":1}
```

**Response Status:** 200  
**Response Time:** 0.238467s  
**Response Body:**
```json
{
    "success": true,
    "data": {
        "id": 1,
        "title": "Test Discussion",
        "content": "Test content",
        "type": "QUESTION",
        "author": {
            "id": 1,
            "username": "admin",
            "email": "admin@educonnect.com",
            "fullName": "Updated Admin Name",
            "bio": "Updated bio for testing",
            "avatarUrl": null,
            "createdAt": "2025-07-25T04:31:36.817517",
            "updatedAt": "2025-07-25T04:31:36.817559"
        },
        "subjectId": 1,
        "isAnonymous": false,
        "upvotesCount": 0,
        "downvotesCount": 0,
        "answersCount": 0,
        "viewsCount": 0,
        "hasAcceptedAnswer": false,
        "status": "ACTIVE",
        "createdAt": "2025-07-27T18:34:02.810724816",
        "updatedAt": "2025-07-27T18:34:02.810734404"
    },
    "message": "Discussion created successfully"
}
```

**Status:** ❌ FAIL (Expected: 400, Got: 200)

---

## Update Discussion
**Method:** PUT  
**Endpoint:** /discussions/1  
**Authentication Required:** true  

**Request Data:**
```json
{"title":"Updated Discussion","content":"Updated content"}
```

**Response Status:** 400  
**Response Time:** 0.027572s  
**Response Body:**
```json
{
    "success": false,
    "error": "Validation failed: {type=Type is required}"
}
```

**Status:** ❌ FAIL (Expected: 404, Got: 400)

---

## Delete Discussion
**Method:** DELETE  
**Endpoint:** /discussions/1  
**Authentication Required:** true  

**Request Data:**
```json

```

**Response Status:** 200  
**Response Time:** 0.082688s  
**Response Body:**
```json
{
    "success": true,
    "message": "Discussion deleted successfully"
}
```

**Status:** ❌ FAIL (Expected: 404, Got: 200)

---

## Upvote Discussion
**Method:** POST  
**Endpoint:** /discussions/1/upvote  
**Authentication Required:** true  

**Request Data:**
```json

```

**Response Status:** 404  
**Response Time:** 0.023421s  
**Response Body:**
```json
{
    "success": false,
    "error": "Discussion not found with id: 1"
}
```

**Status:** ✅ PASS

---

## Downvote Discussion
**Method:** POST  
**Endpoint:** /discussions/1/downvote  
**Authentication Required:** true  

**Request Data:**
```json

```

**Response Status:** 404  
**Response Time:** 0.021898s  
**Response Body:**
```json
{
    "success": false,
    "error": "Discussion not found with id: 1"
}
```

**Status:** ✅ PASS

---

## Bookmark Discussion
**Method:** POST  
**Endpoint:** /discussions/1/bookmark  
**Authentication Required:** true  

**Request Data:**
```json

```

**Response Status:** 404  
**Response Time:** 0.027715s  
**Response Body:**
```json
{
    "success": false,
    "error": "Discussion not found with id: 1"
}
```

**Status:** ✅ PASS

---

## Get Answers for Discussion
**Method:** GET  
**Endpoint:** /discussions/1/answers  
**Authentication Required:** true  

**Request Data:**
```json

```

**Response Status:** 404  
**Response Time:** 0.008176s  
**Response Body:**
```json
{
    "success": false,
    "error": "Discussion not found with id: 1"
}
```

**Status:** ✅ PASS

---

## Create Answer
**Method:** POST  
**Endpoint:** /discussions/1/answers  
**Authentication Required:** true  

**Request Data:**
```json
{"content":"Test answer"}
```

**Response Status:** 404  
**Response Time:** 0.020033s  
**Response Body:**
```json
{
    "success": false,
    "error": "Discussion not found with id: 1"
}
```

**Status:** ✅ PASS

---

## Update Answer
**Method:** PUT  
**Endpoint:** /answers/1  
**Authentication Required:** true  

**Request Data:**
```json
{"content":"Updated answer"}
```

**Response Status:** 404  
**Response Time:** 0.018986s  
**Response Body:**
```json
{
    "success": false,
    "error": "Answer not found with id: 1"
}
```

**Status:** ✅ PASS

---

## Delete Answer
**Method:** DELETE  
**Endpoint:** /answers/1  
**Authentication Required:** true  

**Request Data:**
```json

```

**Response Status:** 404  
**Response Time:** 0.028487s  
**Response Body:**
```json
{
    "success": false,
    "error": "Answer not found with id: 1"
}
```

**Status:** ✅ PASS

---

## Upvote Answer
**Method:** POST  
**Endpoint:** /answers/1/upvote  
**Authentication Required:** true  

**Request Data:**
```json

```

**Response Status:** 404  
**Response Time:** 0.016610s  
**Response Body:**
```json
{
    "success": false,
    "error": "Answer not found with id: 1"
}
```

**Status:** ✅ PASS

---

## Downvote Answer
**Method:** POST  
**Endpoint:** /answers/1/downvote  
**Authentication Required:** true  

**Request Data:**
```json

```

**Response Status:** 404  
**Response Time:** 0.012385s  
**Response Body:**
```json
{
    "success": false,
    "error": "Answer not found with id: 1"
}
```

**Status:** ✅ PASS

---

## Accept Answer
**Method:** POST  
**Endpoint:** /answers/1/accept  
**Authentication Required:** true  

**Request Data:**
```json

```

**Response Status:** 404  
**Response Time:** 0.020203s  
**Response Body:**
```json
{
    "success": false,
    "error": "Answer not found with id: 1"
}
```

**Status:** ✅ PASS

---

## Get All Groups
**Method:** GET  
**Endpoint:** /groups  
**Authentication Required:** true  

**Request Data:**
```json

```

**Response Status:** 200  
**Response Time:** 0.030340s  
**Response Body:**
```json
{
    "success": true,
    "data": {
        "content": [],
        "totalElements": 0,
        "totalPages": 0,
        "currentPage": 0,
        "size": 20,
        "first": true,
        "last": true,
        "empty": true
    }
}
```

**Status:** ✅ PASS

---

## Get Group by ID
**Method:** GET  
**Endpoint:** /groups/1  
**Authentication Required:** true  

**Request Data:**
```json

```

**Response Status:** 404  
**Response Time:** 0.020901s  
**Response Body:**
```json
{
    "success": false,
    "error": "Group not found with id: 1"
}
```

**Status:** ✅ PASS

---

## Create Group
**Method:** POST  
**Endpoint:** /groups  
**Authentication Required:** true  

**Request Data:**
```json
{"name":"Test Group","description":"Test description","type":"STUDY","isPrivate":false}
```

**Response Status:** 200  
**Response Time:** 0.059975s  
**Response Body:**
```json
{
    "success": true,
    "data": {
        "id": 1,
        "name": "Test Group",
        "description": "Test description",
        "type": "STUDY",
        "isPrivate": false,
        "membersCount": 1,
        "discussionsCount": 0,
        "createdBy": {
            "id": 1,
            "username": "admin",
            "email": "admin@educonnect.com",
            "fullName": "Updated Admin Name",
            "bio": "Updated bio for testing",
            "avatarUrl": null,
            "createdAt": "2025-07-25T04:31:36.817517",
            "updatedAt": "2025-07-25T04:31:36.817559"
        },
        "createdAt": "2025-07-27T18:34:12.060045601",
        "updatedAt": "2025-07-27T18:34:12.060056135"
    },
    "message": "Group created successfully"
}
```

**Status:** ❌ FAIL (Expected: 400, Got: 200)

---

## Update Group
**Method:** PUT  
**Endpoint:** /groups/1  
**Authentication Required:** true  

**Request Data:**
```json
{"name":"Updated Group"}
```

**Response Status:** 400  
**Response Time:** 0.021923s  
**Response Body:**
```json
{
    "success": false,
    "error": "Validation failed: {description=Description is required, isPrivate=Privacy setting is required, type=Type is required}"
}
```

**Status:** ❌ FAIL (Expected: 404, Got: 400)

---

## Join Group
**Method:** POST  
**Endpoint:** /groups/1/join  
**Authentication Required:** true  

**Request Data:**
```json

```

**Response Status:** 200  
**Response Time:** 0.069393s  
**Response Body:**
```json
{
    "success": true,
    "data": {
        "message": "Group membership toggled successfully",
        "joined": true
    }
}
```

**Status:** ❌ FAIL (Expected: 404, Got: 200)

---

## Get Group Members
**Method:** GET  
**Endpoint:** /groups/1/members  
**Authentication Required:** true  

**Request Data:**
```json

```

**Response Status:** 403  
**Response Time:** 0.025817s  
**Response Body:**
```json
{
    "success": false,
    "error": "You must be a member to view group members"
}
```

**Status:** ❌ FAIL (Expected: 404, Got: 403)

---

## Change Member Role
**Method:** PUT  
**Endpoint:** /groups/1/members/2/role  
**Authentication Required:** true  

**Request Data:**
```json
{"role":"MODERATOR"}
```

**Response Status:** 403  
**Response Time:** 0.023136s  
**Response Body:**
```json
{
    "success": false,
    "error": "You must be a member to change roles"
}
```

**Status:** ❌ FAIL (Expected: 404, Got: 403)

---

## Remove Group Member
**Method:** DELETE  
**Endpoint:** /groups/1/members/2  
**Authentication Required:** true  

**Request Data:**
```json

```

**Response Status:** 403  
**Response Time:** 0.019861s  
**Response Body:**
```json
{
    "success": false,
    "error": "You must be a member to remove members"
}
```

**Status:** ❌ FAIL (Expected: 404, Got: 403)

---

## Get Group Discussions
**Method:** GET  
**Endpoint:** /groups/1/discussions  
**Authentication Required:** true  

**Request Data:**
```json

```

**Response Status:** 403  
**Response Time:** 0.017367s  
**Response Body:**
```json
{
    "success": false,
    "error": "You must be a member of this group to view discussions"
}
```

**Status:** ❌ FAIL (Expected: 404, Got: 403)

---

## Create Group Discussion
**Method:** POST  
**Endpoint:** /groups/1/discussions  
**Authentication Required:** true  

**Request Data:**
```json
{"title":"Group Test","content":"Group content"}
```

**Response Status:** 400  
**Response Time:** 0.008095s  
**Response Body:**
```json
{
    "success": false,
    "error": "Validation failed: {type=Type is required}"
}
```

**Status:** ❌ FAIL (Expected: 404, Got: 400)

---

## Get User Conversations
**Method:** GET  
**Endpoint:** /messages/conversations  
**Authentication Required:** true  

**Request Data:**
```json

```

**Response Status:** 200  
**Response Time:** 0.036409s  
**Response Body:**
```json
{
    "success": true,
    "data": {
        "content": [],
        "totalElements": 0,
        "totalPages": 0,
        "currentPage": 0,
        "size": 20,
        "first": true,
        "last": true,
        "empty": true
    }
}
```

**Status:** ✅ PASS

---

## Get Conversation Messages
**Method:** GET  
**Endpoint:** /messages/conversations/1  
**Authentication Required:** true  

**Request Data:**
```json

```

**Response Status:** 404  
**Response Time:** 0.015818s  
**Response Body:**
```json
{
    "success": false,
    "error": "Conversation not found with id: 1"
}
```

**Status:** ✅ PASS

---

## Send Message
**Method:** POST  
**Endpoint:** /messages  
**Authentication Required:** true  

**Request Data:**
```json
{"receiverId":2,"content":"Test message"}
```

**Response Status:** 400  
**Response Time:** 0.026101s  
**Response Body:**
```json
{
    "success": false,
    "error": "Validation failed: {recipientId=Recipient ID is required, type=Message type is required}"
}
```

**Status:** ✅ PASS

---

## Update Message
**Method:** PUT  
**Endpoint:** /messages/1  
**Authentication Required:** true  

**Request Data:**
```json
{"content":"Updated message"}
```

**Response Status:** 404  
**Response Time:** 0.028222s  
**Response Body:**
```json
{
    "success": false,
    "error": "Message not found with id: 1"
}
```

**Status:** ✅ PASS

---

## Delete Message
**Method:** DELETE  
**Endpoint:** /messages/1  
**Authentication Required:** true  

**Request Data:**
```json

```

**Response Status:** 404  
**Response Time:** 0.016758s  
**Response Body:**
```json
{
    "success": false,
    "error": "Message not found with id: 1"
}
```

**Status:** ✅ PASS

---

## Mark Message as Read
**Method:** PUT  
**Endpoint:** /messages/1/read  
**Authentication Required:** true  

**Request Data:**
```json

```

**Response Status:** 404  
**Response Time:** 0.016541s  
**Response Body:**
```json
{
    "success": false,
    "error": "Message not found with id: 1"
}
```

**Status:** ✅ PASS

---

## Get Unread Messages Count
**Method:** GET  
**Endpoint:** /messages/unread-count  
**Authentication Required:** true  

**Request Data:**
```json

```

**Response Status:** 200  
**Response Time:** 0.030001s  
**Response Body:**
```json
{
    "success": true,
    "data": {
        "unreadCount": 0
    }
}
```

**Status:** ✅ PASS

---

## Get User Notifications
**Method:** GET  
**Endpoint:** /notifications  
**Authentication Required:** true  

**Request Data:**
```json

```

**Response Status:** 200  
**Response Time:** 0.049669s  
**Response Body:**
```json
{
    "success": true,
    "data": {
        "content": [],
        "totalElements": 0,
        "totalPages": 0,
        "currentPage": 0,
        "size": 20,
        "first": true,
        "last": true,
        "empty": true
    }
}
```

**Status:** ✅ PASS

---

## Mark Notification as Read
**Method:** PUT  
**Endpoint:** /notifications/1/read  
**Authentication Required:** true  

**Request Data:**
```json

```

**Response Status:** 404  
**Response Time:** 0.020575s  
**Response Body:**
```json
{
    "success": false,
    "error": "Notification not found with id: 1"
}
```

**Status:** ✅ PASS

---

## Mark All Notifications as Read
**Method:** PUT  
**Endpoint:** /notifications/read-all  
**Authentication Required:** true  

**Request Data:**
```json

```

**Response Status:** 200  
**Response Time:** 0.019950s  
**Response Body:**
```json
{
    "success": true,
    "message": "All notifications marked as read"
}
```

**Status:** ✅ PASS

---

## Get Unread Notifications Count
**Method:** GET  
**Endpoint:** /notifications/unread-count  
**Authentication Required:** true  

**Request Data:**
```json

```

**Response Status:** 200  
**Response Time:** 0.013333s  
**Response Body:**
```json
{
    "success": true,
    "data": {
        "unreadCount": 0
    }
}
```

**Status:** ✅ PASS

---

## Ask AI Question
**Method:** POST  
**Endpoint:** /ai/ask  
**Authentication Required:** true  

**Request Data:**
```json
{"query":"What is programming?","subjectId":1}
```

**Response Status:** 400  
**Response Time:** 0.016600s  
**Response Body:**
```json
{
    "success": false,
    "error": "Validation failed: {question=Question is required, type=Query type is required}"
}
```

**Status:** ❌ FAIL (Expected: 500, Got: 400)

---

## Get AI Query History
**Method:** GET  
**Endpoint:** /ai/history  
**Authentication Required:** true  

**Request Data:**
```json

```

**Response Status:** 200  
**Response Time:** 0.013461s  
**Response Body:**
```json
{
    "success": true,
    "data": {
        "content": [],
        "totalElements": 0,
        "totalPages": 0,
        "currentPage": 0,
        "size": 20,
        "first": true,
        "last": true,
        "empty": true
    }
}
```

**Status:** ✅ PASS

---

## Search Discussions
**Method:** GET  
**Endpoint:** /search/discussions?q=test  
**Authentication Required:** true  

**Request Data:**
```json

```

**Response Status:** 200  
**Response Time:** 0.037414s  
**Response Body:**
```json
{
    "success": true,
    "data": {
        "content": [],
        "totalElements": 0,
        "totalPages": 0,
        "currentPage": 0,
        "size": 20,
        "first": true,
        "last": true,
        "empty": true
    }
}
```

**Status:** ✅ PASS

---

## Search Groups
**Method:** GET  
**Endpoint:** /search/groups?q=test  
**Authentication Required:** true  

**Request Data:**
```json

```

**Response Status:** 200  
**Response Time:** 0.016907s  
**Response Body:**
```json
{
    "success": true,
    "data": {
        "content": [],
        "totalElements": 0,
        "totalPages": 0,
        "currentPage": 0,
        "size": 20,
        "first": true,
        "last": true,
        "empty": true
    }
}
```

**Status:** ✅ PASS

---

## Search Users
**Method:** GET  
**Endpoint:** /search/users?q=test  
**Authentication Required:** true  

**Request Data:**
```json

```

**Response Status:** 200  
**Response Time:** 0.014719s  
**Response Body:**
```json
{
    "success": true,
    "data": {
        "content": [
            {
                "id": 39,
                "username": "testuser",
                "email": "test@example.com",
                "fullName": "Test User",
                "bio": null,
                "avatarUrl": null,
                "createdAt": "2025-07-25T04:29:26.516288",
                "updatedAt": "2025-07-25T04:29:26.516318"
            }
        ],
        "totalElements": 1,
        "totalPages": 1,
        "currentPage": 0,
        "size": 20,
        "first": true,
        "last": true,
        "empty": false
    }
}
```

**Status:** ✅ PASS

---

## Get My Files
**Method:** GET  
**Endpoint:** /files/my  
**Authentication Required:** true  

**Request Data:**
```json

```

**Response Status:** 200  
**Response Time:** 0.018167s  
**Response Body:**
```json
{
    "success": true,
    "data": {
        "content": [],
        "totalElements": 0,
        "totalPages": 0,
        "currentPage": 0,
        "size": 20,
        "first": true,
        "last": true,
        "empty": true
    }
}
```

**Status:** ✅ PASS

---

## Get File Details
**Method:** GET  
**Endpoint:** /files/details/1  
**Authentication Required:** true  

**Request Data:**
```json

```

**Response Status:** 404  
**Response Time:** 0.026214s  
**Response Body:**
```json

```

**Status:** ✅ PASS

---

## Delete File
**Method:** DELETE  
**Endpoint:** /files/1  
**Authentication Required:** true  

**Request Data:**
```json

```

**Response Status:** 400  
**Response Time:** 0.018460s  
**Response Body:**
```json
{
    "success": false,
    "error": "Unable to delete file or file not found"
}
```

**Status:** ✅ PASS

---

## Get Storage Info
**Method:** GET  
**Endpoint:** /files/storage-info  
**Authentication Required:** true  

**Request Data:**
```json

```

**Response Status:** 200  
**Response Time:** 0.039708s  
**Response Body:**
```json
{
    "success": true,
    "data": {
        "maxSizeMB": 100,
        "usagePercentage": 0.0,
        "totalSizeMB": 0.0,
        "totalFiles": 0,
        "totalSizeBytes": 0
    }
}
```

**Status:** ✅ PASS

---

