import { assessmentApi } from './api'

// Types
export interface Subject {
  id: number
  name: string
  description: string
  classLevel: string
  displayOrder: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  topicsCount: number
  questionsCount: number
}

export interface Topic {
  id: number
  name: string
  description: string
  subjectId: number
  displayOrder: number
  isActive: boolean
  questionsCount: number
}

export interface QuestionOption {
  id: number
  text: string
}

export interface Question {
  id: number
  text: string
  type: 'MCQ' | 'TRUE_FALSE' | 'FILL_BLANK' | 'NUMERIC' | 'ESSAY'
  subjectId: number
  topicId?: number
  subjectName: string
  topicName?: string
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT'
  options: QuestionOption[]
  correctAnswerOptionId?: number
  correctAnswerText?: string
  explanation?: string
  points: number
  tags: string[]
  attachments: string[]
  isActive: boolean
  createdBy: number
  createdAt: string
  updatedAt: string
}

export interface Contest {
  id: number
  title: string
  description: string
  type: 'PUBLIC' | 'PRIVATE' | 'INVITE_ONLY'
  status: 'SCHEDULED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
  startTime: string
  endTime: string
  duration: number
  maxParticipants?: number
  participantCount: number
  isRegistered: boolean
  classLevel?: string
}

export interface LiveExam {
  id: number
  title: string
  description: string
  subjectId: number
  classLevel: string
  startTime: string
  endTime: string
  duration: number
  totalMarks: number
  passingMarks: number
  status: 'SCHEDULED' | 'ACTIVE' | 'COMPLETED'
  isRegistered: boolean
  registrationCount: number
}

export interface PracticeProblem {
  id: number
  title: string
  description: string
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT'
  subjectId: number
  topicId?: number
  points: number
  hints: string[]
  isBookmarked: boolean
  status: 'NOT_ATTEMPTED' | 'ATTEMPTED' | 'SOLVED'
  submissionCount: number
}

export interface DailyQuestion {
  id: number
  questionId: number
  date: string
  question: Question
  isAnswered: boolean
  userAnswer?: string
  isCorrect?: boolean
}

export interface LeaderboardEntry {
  rank: number
  userId: number
  username: string
  fullName: string
  score: number
  totalQuestions: number
  correctAnswers: number
  accuracy: number
}

// Assessment Service API
export const assessmentService = {
  // Subjects
  getSubjects: (params?: { classLevel?: string, page?: number, size?: number }) => 
    assessmentApi.get('/subjects', { params }),
  
  getPublicSubjects: () => assessmentApi.get('/subjects/public'),
  
  getSubject: (id: number) => assessmentApi.get(`/subjects/${id}`),
  
  createSubject: (data: Partial<Subject>) => assessmentApi.post('/subjects', data),
  
  updateSubject: (id: number, data: Partial<Subject>) => 
    assessmentApi.put(`/subjects/${id}`, data),
  
  deleteSubject: (id: number) => assessmentApi.delete(`/subjects/${id}`),

  // Topics
  getTopics: (params?: { subjectId?: number, page?: number, size?: number }) =>
    assessmentApi.get('/topics', { params }),
  
  getPublicTopicsBySubject: (subjectId: number) =>
    assessmentApi.get(`/topics/public/by-subject/${subjectId}`),
  
  getTopic: (id: number) => assessmentApi.get(`/topics/${id}`),
  
  createTopic: (data: Partial<Topic>) => assessmentApi.post('/topics', data),
  
  updateTopic: (id: number, data: Partial<Topic>) => 
    assessmentApi.put(`/topics/${id}`, data),
  
  deleteTopic: (id: number) => assessmentApi.delete(`/topics/${id}`),

  // Questions
  getQuestions: (params?: { 
    page?: number
    size?: number
    subjectId?: number
    topicId?: number
    difficulty?: string
    type?: string
    search?: string
  }) => assessmentApi.get('/questions', { params }),
  
  getRandomQuestions: (params: {
    subjectId?: number
    count?: number
    difficulty?: string
  }) => assessmentApi.get('/questions/random', { params }),
  
  getQuestion: (id: number) => assessmentApi.get(`/questions/${id}`),
  
  createQuestion: (data: Partial<Question>) => assessmentApi.post('/questions', data),
  
  updateQuestion: (id: number, data: Partial<Question>) =>
    assessmentApi.put(`/questions/${id}`, data),
  
  deleteQuestion: (id: number) => assessmentApi.delete(`/questions/${id}`),
  
  bulkImportQuestions: (questions: Partial<Question>[]) =>
    assessmentApi.post('/questions/bulk', questions),

  // Daily Questions
  getDailyQuestions: (date?: string) =>
    assessmentApi.get('/daily-questions', { params: { date } }),
  
  getDailyQuestionDetails: (date?: string) =>
    assessmentApi.get('/daily-questions/details', { params: { date } }),
  
  getTodaysDailyQuestions: (subjectId?: number) =>
    assessmentApi.get('/daily-questions/today', { params: { subjectId } }),
  
  submitDailyQuestion: (questionId: number, data: {
    answer: string
    timeTaken: number
    explanation?: string
  }) => assessmentApi.post(`/daily-questions/${questionId}/submit`, data),
  
  getDailyQuestionStreak: () => assessmentApi.get('/daily-questions/streak'),
  
  getDailyQuestionStats: () => assessmentApi.get('/daily-questions/stats'),
  
  setDailyQuestions: (data: { 
    date: string
    questionIds: number[]
    subjectDistribution?: Record<string, unknown>
  }) => assessmentApi.put('/daily-questions', data),
  
  removeDailyQuestion: (dailyQuestionId: number) =>
    assessmentApi.delete(`/daily-questions/${dailyQuestionId}`),

  // Contests
  getContests: (params?: {
    page?: number
    size?: number
    status?: string
    type?: string
  }) => assessmentApi.get('/contests', { params }),
  
  getContest: (id: number) => assessmentApi.get(`/contests/${id}`),
  
  joinContest: (id: number) => assessmentApi.post(`/contests/${id}/join`),
  
  getContestQuestions: (id: number) => assessmentApi.get(`/contests/${id}/questions`),
  
  submitContestAnswer: (contestId: number, questionId: number, data: {
    answer: string
    timeTaken: number
  }) => assessmentApi.post(`/contests/${contestId}/questions/${questionId}/submit`, data),
  
  getContestLeaderboard: (id: number) => assessmentApi.get(`/contests/${id}/leaderboard`),
  
  getContestResults: (id: number) => assessmentApi.get(`/contests/${id}/results`),
  
  createContest: (data: Partial<Contest>) => assessmentApi.post('/contests', data),

  // Live Exams
  getLiveExams: (params?: {
    page?: number
    size?: number
    status?: string
    classLevel?: string
  }) => assessmentApi.get('/live-exams', { params }),
  
  getLiveExam: (id: number) => assessmentApi.get(`/live-exams/${id}`),
  
  getUpcomingLiveExams: () => assessmentApi.get('/live-exams/upcoming'),
  
  getCurrentLiveExams: () => assessmentApi.get('/live-exams/live'),
  
  registerForLiveExam: (id: number) => assessmentApi.post(`/live-exams/${id}/register`),
  
  startLiveExam: (id: number) => assessmentApi.post(`/live-exams/${id}/start`),
  
  submitExamAnswer: (id: number, data: {
    questionId: number
    answer: string
    timeTaken: number
  }) => assessmentApi.post(`/live-exams/${id}/submit-answer`, data),
  
  finishLiveExam: (id: number) => assessmentApi.post(`/live-exams/${id}/finish`),
  
  getLiveExamResults: (id: number) => assessmentApi.get(`/live-exams/${id}/results`),

  // Practice Problems
  getPracticeProblems: (params?: {
    page?: number
    size?: number
    difficulty?: string
    subjectId?: number
    status?: string
  }) => assessmentApi.get('/practice-problems', { params }),
  
  getPracticeProblem: (id: number) => assessmentApi.get(`/practice-problems/${id}`),
  
  submitProblemSolution: (id: number, data: {
    solution: string
    language?: string
  }) => assessmentApi.post(`/practice-problems/${id}/submit`, data),
  
  getProblemHint: (id: number) => assessmentApi.get(`/practice-problems/${id}/hint`),
  
  toggleBookmarkProblem: (id: number) => assessmentApi.post(`/practice-problems/${id}/bookmark`),
  
  getRecommendedProblems: () => assessmentApi.get('/practice-problems/recommendations'),

  // Leaderboard
  getGlobalLeaderboard: (params?: { page?: number, size?: number }) =>
    assessmentApi.get('/leaderboard/global', { params }),
  
  getSubjectLeaderboard: (subjectId: number, params?: { page?: number, size?: number }) =>
    assessmentApi.get(`/leaderboard/subject/${subjectId}`, { params }),
  
  getClassLeaderboard: (classLevel: string, params?: { page?: number, size?: number }) =>
    assessmentApi.get(`/leaderboard/class/${classLevel}`, { params }),

  // Analytics
  getDashboardAnalytics: () => assessmentApi.get('/analytics/dashboard'),
  
  getPerformanceMetrics: () => assessmentApi.get('/analytics/performance'),
  
  getProgressAnalytics: () => assessmentApi.get('/analytics/progress'),
  
  getRankings: (params: { type: string, period: string }) =>
    assessmentApi.get('/analytics/rankings', { params }),

  // Admin
  getAdminAnalytics: (period?: string) =>
    assessmentApi.get('/admin/analytics', { params: { period } }),
  
  createPracticeProblems: (params: { subjectId: number, count: number }) =>
    assessmentApi.post('/admin/create-practice-problems', null, { params }),
  
  createPracticeProblemsFromIds: (questionIds: number[]) =>
    assessmentApi.post('/admin/create-practice-problems-from-ids', questionIds),
  
  // Question Management for Admin/Question Setter
  getQuestionStats: () => assessmentApi.get('/admin/questions/stats'),
  
  setAdminDailyQuestions: (data: {
    date: string
    questionIds: number[]
    subjectDistribution?: Record<string, unknown>
  }) => assessmentApi.put('/admin/daily-questions', data),
  
  addQuestionsToPractice: (questionIds: number[]) =>
    assessmentApi.post('/admin/add-questions-to-practice', questionIds),
}