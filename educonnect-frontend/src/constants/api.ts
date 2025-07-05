export const API_CONFIG = {
  AUTH_SERVICE: {
    BASE_URL: 'http://34.68.47.215:8081/api',
    ENDPOINTS: {
      REGISTER: '/auth/register',
      LOGIN: '/auth/login',
      VERIFY_2FA: '/auth/verify-2fa',
      REFRESH_TOKEN: '/auth/refresh-token',
      LOGOUT: '/auth/logout',
      VERIFY_EMAIL: '/auth/verify-email',
      RESEND_VERIFICATION: '/auth/resend-verification',
      FORGOT_PASSWORD: '/auth/forgot-password',
      RESET_PASSWORD: '/auth/reset-password',
      CHANGE_PASSWORD: '/auth/change-password',
      ME: '/auth/me',
      UPDATE_PROFILE: '/auth/profile',
      ENABLE_2FA: '/auth/2fa/enable',
      CONFIRM_2FA: '/auth/2fa/confirm',
      DISABLE_2FA: '/auth/2fa/disable',
      OAUTH_GOOGLE: '/oauth2/authorize/google',
      OAUTH_CALLBACK_GOOGLE: '/oauth2/callback/google',
      ADMIN_USERS: '/auth/admin/users',
      ADMIN_UPDATE_ROLE: '/auth/admin/users/{userId}/role',
      ADMIN_UPDATE_STATUS: '/auth/admin/users/{userId}/status'
    }
  },
  ASSESSMENT_SERVICE: {
    BASE_URL: 'http://34.68.47.215:8084/api/v1',
    ENDPOINTS: {
      SUBJECTS: '/subjects',
      SUBJECT_BY_ID: '/subjects/{subjectId}',
      TOPICS: '/topics',
      TOPIC_BY_ID: '/topics/{topicId}',
      QUESTIONS: '/questions',
      QUESTION_BY_ID: '/questions/{questionId}',
      BULK_QUESTIONS: '/questions/bulk',
      DAILY_QUESTIONS: '/daily-questions',
      DAILY_QUESTION_SUBMIT: '/daily-questions/{questionId}/submit',
      DAILY_QUESTION_STREAK: '/daily-questions/streak',
      DAILY_QUESTION_HISTORY: '/daily-questions/history',
      PRACTICE_PROBLEMS: '/practice-problems',
      PRACTICE_PROBLEM_BY_ID: '/practice-problems/{problemId}',
      PRACTICE_PROBLEM_SUBMIT: '/practice-problems/{problemId}/submit',
      PRACTICE_PROBLEM_HINT: '/practice-problems/{problemId}/hint',
      PRACTICE_PROBLEM_BOOKMARK: '/practice-problems/{problemId}/bookmark',
      PRACTICE_RECOMMENDATIONS: '/practice-problems/recommendations',
      LIVE_EXAMS: '/live-exams',
      LIVE_EXAM_BY_ID: '/live-exams/{examId}',
      LIVE_EXAM_REGISTER: '/live-exams/{examId}/register',
      LIVE_EXAM_START: '/live-exams/{examId}/start',
      LIVE_EXAM_SUBMIT_ANSWER: '/live-exams/{examId}/submit-answer',
      LIVE_EXAM_FINISH: '/live-exams/{examId}/finish',
      LIVE_EXAM_RESULTS: '/live-exams/{examId}/results',
      LIVE_EXAM_LEADERBOARD: '/live-exams/{examId}/leaderboard',
      CONTESTS: '/contests',
      CONTEST_PUBLIC: '/contests/public',
      CONTEST_BY_ID: '/contests/{contestId}',
      CONTEST_JOIN: '/contests/{contestId}/join',
      CONTEST_QUESTIONS: '/contests/{contestId}/questions',
      CONTEST_SUBMIT_ANSWER: '/contests/{contestId}/questions/{questionId}/submit',
      CONTEST_LEADERBOARD: '/contests/{contestId}/leaderboard',
      CONTEST_SUBMISSIONS: '/contests/{contestId}/submissions',
      CONTEST_MY_SUBMISSIONS: '/contests/my-submissions',
      CONTEST_RESULTS: '/contests/{contestId}/results',
      CONTEST_START: '/contests/{contestId}/start',
      CONTEST_END: '/contests/{contestId}/end',
      PERSONALIZED_EXAMS: '/personalized-exams',
      PERSONALIZED_EXAM_START: '/personalized-exams/{examId}/start',
      PERSONALIZED_EXAM_SUBMIT: '/personalized-exams/{examId}/submit',
      ANALYTICS_DASHBOARD: '/analytics/dashboard',
      ANALYTICS_PERFORMANCE: '/analytics/performance',
      ANALYTICS_PROGRESS: '/analytics/progress',
      ANALYTICS_RANKINGS: '/analytics/rankings',
      LEADERBOARD_GLOBAL: '/leaderboard/global',
      LEADERBOARD_SUBJECT: '/leaderboard/subject/{subjectId}',
      LEADERBOARD_CLASS: '/leaderboard/class/{classLevel}',
      ADMIN_LIVE_EXAMS: '/admin/live-exams',
      ADMIN_CONTESTS: '/admin/contests',
      ADMIN_DAILY_QUESTIONS: '/admin/daily-questions',
      ADMIN_ANALYTICS: '/admin/analytics'
    }
  },
  DISCUSSION_SERVICE: {
    BASE_URL: 'http://34.68.47.215:8083/api/v1',
    ENDPOINTS: {
      DISCUSSIONS: '/discussions',
      DISCUSSION_BY_ID: '/discussions/{discussionId}',
      DISCUSSION_UPVOTE: '/discussions/{discussionId}/upvote',
      DISCUSSION_DOWNVOTE: '/discussions/{discussionId}/downvote',
      DISCUSSION_BOOKMARK: '/discussions/{discussionId}/bookmark',
      DISCUSSION_ANSWERS: '/discussions/{discussionId}/answers',
      ANSWERS: '/answers/{answerId}',
      ANSWER_UPVOTE: '/answers/{answerId}/upvote',
      ANSWER_DOWNVOTE: '/answers/{answerId}/downvote',
      ANSWER_ACCEPT: '/answers/{answerId}/accept',
      GROUPS: '/groups',
      GROUP_BY_ID: '/groups/{groupId}',
      GROUP_JOIN: '/groups/{groupId}/join',
      GROUP_MEMBERS: '/groups/{groupId}/members',
      GROUP_MEMBER_ROLE: '/groups/{groupId}/members/{userId}/role',
      GROUP_REMOVE_MEMBER: '/groups/{groupId}/members/{userId}',
      GROUP_DISCUSSIONS: '/groups/{groupId}/discussions',
      CONVERSATIONS: '/messages/conversations',
      CONVERSATION_BY_ID: '/messages/conversations/{conversationId}',
      MESSAGES: '/messages',
      MESSAGE_BY_ID: '/messages/{messageId}',
      MESSAGE_READ: '/messages/{messageId}/read',
      UNREAD_COUNT: '/messages/unread-count',
      AI_ASK: '/ai/ask',
      AI_HISTORY: '/ai/history',
      SEARCH_DISCUSSIONS: '/search/discussions',
      SEARCH_GROUPS: '/search/groups',
      SEARCH_USERS: '/search/users',
      NOTIFICATIONS: '/notifications',
      NOTIFICATION_READ: '/notifications/{notificationId}/read',
      NOTIFICATIONS_READ_ALL: '/notifications/read-all',
      NOTIFICATIONS_UNREAD_COUNT: '/notifications/unread-count'
    },
    WEBSOCKET: {
      BASE_URL: 'ws://34.68.47.215:8083',
      ENDPOINTS: {
        MESSAGES: '/ws/messages',
        NOTIFICATIONS: '/ws/notifications',
        GROUPS: '/ws/groups/{groupId}'
      }
    }
  }
} as const;

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
export const SUPPORTED_FILE_TYPES = ['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

export const RATE_LIMITS = {
  LOGIN: 5, // per minute per IP
  REGISTER: 3, // per hour per IP
  PASSWORD_RESET: 3, // per hour per email
  DAILY_QUESTIONS: 50, // per day per user
  PRACTICE_PROBLEMS: 100, // per day per user
  LIVE_EXAMS: 5, // per day per user
  CONTESTS: 10, // per day per user
  ANALYTICS: 100, // per hour per user
  DISCUSSIONS: 5, // per minute per user
  ANSWERS: 10, // per minute per user
  MESSAGES: 30, // per minute per user
  AI_QUERIES: 10, // per hour per user
  VOTES: 100 // per minute per user
} as const;