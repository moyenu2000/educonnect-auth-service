/* eslint-disable @typescript-eslint/no-explicit-any */
import { assessmentApiClient, replacePath } from './api';
import { API_CONFIG } from '../constants/api';
import {
  type Subject,
  type Topic,
  type Question,
  type DailyQuestion,
  type PracticeProblem,
  type LiveExam,
  type Contest,
  type PagedResponse,
  type SubmitAnswerRequest,
  type SubmitAnswerResponse,
  ClassLevel,
  Difficulty,
  QuestionType,
  ContestType,
  Period
} from '../types/assessment';

class AssessmentService {
  // Subjects
  async getSubjects(page = 0, size = 20, classLevel?: ClassLevel): Promise<PagedResponse<Subject>> {
    const params = new URLSearchParams({ page: String(page), size: String(size) });
    if (classLevel) params.append('classLevel', classLevel);
    
    return assessmentApiClient.get(`${API_CONFIG.ASSESSMENT_SERVICE.ENDPOINTS.SUBJECTS}?${params}`);
  }

  async getSubjectById(subjectId: number): Promise<Subject> {
    return assessmentApiClient.get(
      replacePath(API_CONFIG.ASSESSMENT_SERVICE.ENDPOINTS.SUBJECT_BY_ID, { subjectId: String(subjectId) })
    );
  }

  async createSubject(data: {
    name: string;
    description: string;
    classLevel: ClassLevel;
    displayOrder: number;
    isActive: boolean;
  }): Promise<{ success: boolean; data: Subject; message: string }> {
    return assessmentApiClient.post(API_CONFIG.ASSESSMENT_SERVICE.ENDPOINTS.SUBJECTS, data);
  }

  // Topics
  async getTopics(page = 0, size = 20, subjectId?: number): Promise<PagedResponse<Topic>> {
    const params = new URLSearchParams({ page: String(page), size: String(size) });
    if (subjectId) params.append('subjectId', String(subjectId));
    
    return assessmentApiClient.get(`${API_CONFIG.ASSESSMENT_SERVICE.ENDPOINTS.TOPICS}?${params}`);
  }

  async getTopicById(topicId: number): Promise<Topic> {
    return assessmentApiClient.get(
      replacePath(API_CONFIG.ASSESSMENT_SERVICE.ENDPOINTS.TOPIC_BY_ID, { topicId: String(topicId) })
    );
  }

  async createTopic(data: {
    name: string;
    description: string;
    subjectId: number;
    displayOrder: number;
    isActive: boolean;
  }): Promise<{ success: boolean; data: Topic; message: string }> {
    return assessmentApiClient.post(API_CONFIG.ASSESSMENT_SERVICE.ENDPOINTS.TOPICS, data);
  }

  // Questions
  async getQuestions(params: {
    page?: number;
    size?: number;
    subjectId?: number;
    topicId?: number;
    difficulty?: Difficulty;
    type?: QuestionType;
    search?: string;
  } = {}): Promise<PagedResponse<Question>> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
    
    return assessmentApiClient.get(`${API_CONFIG.ASSESSMENT_SERVICE.ENDPOINTS.QUESTIONS}?${searchParams}`);
  }

  async getQuestionById(questionId: number): Promise<Question> {
    return assessmentApiClient.get(
      replacePath(API_CONFIG.ASSESSMENT_SERVICE.ENDPOINTS.QUESTION_BY_ID, { questionId: String(questionId) })
    );
  }

  async createQuestion(data: {
    text: string;
    type: QuestionType;
    subjectId: number;
    topicId?: number;
    difficulty: Difficulty;
    options?: string[];
    correctAnswer: string;
    explanation: string;
    points: number;
    tags?: string[];
    attachments?: string[];
  }): Promise<{ success: boolean; data: Question; message: string }> {
    return assessmentApiClient.post(API_CONFIG.ASSESSMENT_SERVICE.ENDPOINTS.QUESTIONS, data);
  }

  // Daily Questions
  async getDailyQuestions(params: {
    date?: string;
    subjectId?: number;
    classLevel?: ClassLevel;
    difficulty?: Difficulty;
  } = {}): Promise<{ success: boolean; data: { questions: DailyQuestion[]; streakInfo?: any; totalQuestions: number } }> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
    
    return assessmentApiClient.get(`${API_CONFIG.ASSESSMENT_SERVICE.ENDPOINTS.DAILY_QUESTIONS}?${searchParams}`);
  }

  async submitDailyQuestion(questionId: number, data: SubmitAnswerRequest): Promise<SubmitAnswerResponse> {
    return assessmentApiClient.post(
      replacePath(API_CONFIG.ASSESSMENT_SERVICE.ENDPOINTS.DAILY_QUESTION_SUBMIT, { questionId: String(questionId) }),
      data
    );
  }

  async getDailyQuestionStreak(subjectId?: number, period?: Period): Promise<{
    currentStreak: number;
    longestStreak: number;
    streakHistory: any[];
    subjectStreaks: any[];
  }> {
    const params = new URLSearchParams();
    if (subjectId) params.append('subjectId', String(subjectId));
    if (period) params.append('period', period);
    
    return assessmentApiClient.get(`${API_CONFIG.ASSESSMENT_SERVICE.ENDPOINTS.DAILY_QUESTION_STREAK}?${params}`);
  }

  // Practice Problems
  async getPracticeProblems(params: {
    page?: number;
    size?: number;
    subjectId?: number;
    topicId?: number;
    difficulty?: Difficulty;
    type?: QuestionType;
    status?: string;
    search?: string;
  } = {}): Promise<PagedResponse<PracticeProblem>> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
    
    return assessmentApiClient.get(`${API_CONFIG.ASSESSMENT_SERVICE.ENDPOINTS.PRACTICE_PROBLEMS}?${searchParams}`);
  }

  async getPracticeProblemById(problemId: number): Promise<PracticeProblem> {
    return assessmentApiClient.get(
      replacePath(API_CONFIG.ASSESSMENT_SERVICE.ENDPOINTS.PRACTICE_PROBLEM_BY_ID, { problemId: String(problemId) })
    );
  }

  async submitPracticeProblem(problemId: number, data: SubmitAnswerRequest): Promise<SubmitAnswerResponse> {
    return assessmentApiClient.post(
      replacePath(API_CONFIG.ASSESSMENT_SERVICE.ENDPOINTS.PRACTICE_PROBLEM_SUBMIT, { problemId: String(problemId) }),
      data
    );
  }

  async getPracticeProblemHint(problemId: number, hintLevel?: number): Promise<{
    hint: string;
    level: number;
    pointsDeducted: number;
  }> {
    const params = hintLevel ? `?hintLevel=${hintLevel}` : '';
    return assessmentApiClient.get(
      replacePath(API_CONFIG.ASSESSMENT_SERVICE.ENDPOINTS.PRACTICE_PROBLEM_HINT, { problemId: String(problemId) }) + params
    );
  }

  async bookmarkPracticeProblem(problemId: number): Promise<{ bookmarked: boolean }> {
    return assessmentApiClient.post(
      replacePath(API_CONFIG.ASSESSMENT_SERVICE.ENDPOINTS.PRACTICE_PROBLEM_BOOKMARK, { problemId: String(problemId) })
    );
  }

  async getPracticeRecommendations(count = 10, subjectId?: number, difficulty?: Difficulty): Promise<{
    recommendations: PracticeProblem[];
    reason: string;
  }> {
    const params = new URLSearchParams({ count: String(count) });
    if (subjectId) params.append('subjectId', String(subjectId));
    if (difficulty) params.append('difficulty', difficulty);
    
    return assessmentApiClient.get(`${API_CONFIG.ASSESSMENT_SERVICE.ENDPOINTS.PRACTICE_RECOMMENDATIONS}?${params}`);
  }

  // Live Exams
  async getLiveExams(params: {
    page?: number;
    size?: number;
    status?: string;
    subjectId?: number;
    classLevel?: ClassLevel;
    upcoming?: boolean;
  } = {}): Promise<PagedResponse<LiveExam>> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
    
    return assessmentApiClient.get(`${API_CONFIG.ASSESSMENT_SERVICE.ENDPOINTS.LIVE_EXAMS}?${searchParams}`);
  }

  async getLiveExamById(examId: number): Promise<LiveExam> {
    return assessmentApiClient.get(
      replacePath(API_CONFIG.ASSESSMENT_SERVICE.ENDPOINTS.LIVE_EXAM_BY_ID, { examId: String(examId) })
    );
  }

  async registerForLiveExam(examId: number): Promise<{ registered: boolean; registrationId: number }> {
    return assessmentApiClient.post(
      replacePath(API_CONFIG.ASSESSMENT_SERVICE.ENDPOINTS.LIVE_EXAM_REGISTER, { examId: String(examId) })
    );
  }

  async startLiveExam(examId: number): Promise<{
    sessionId: string;
    questions: Question[];
    timeLimit: number;
    startTime: string;
  }> {
    return assessmentApiClient.post(
      replacePath(API_CONFIG.ASSESSMENT_SERVICE.ENDPOINTS.LIVE_EXAM_START, { examId: String(examId) })
    );
  }

  // Contests
  async getContests(params: {
    page?: number;
    size?: number;
    status?: string;
    type?: ContestType;
  } = {}): Promise<PagedResponse<Contest>> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
    
    return assessmentApiClient.get(`${API_CONFIG.ASSESSMENT_SERVICE.ENDPOINTS.CONTESTS}?${searchParams}`);
  }

  async getPublicContests(): Promise<Contest[]> {
    return assessmentApiClient.get(API_CONFIG.ASSESSMENT_SERVICE.ENDPOINTS.CONTEST_PUBLIC);
  }

  async getContestById(contestId: number): Promise<{
    contest: Contest;
    questionsCount: number;
    timeRemaining: number;
    canParticipate: boolean;
  }> {
    return assessmentApiClient.get(
      replacePath(API_CONFIG.ASSESSMENT_SERVICE.ENDPOINTS.CONTEST_BY_ID, { contestId: String(contestId) })
    );
  }

  async joinContest(contestId: number): Promise<{ success: boolean; message: string }> {
    return assessmentApiClient.post(
      replacePath(API_CONFIG.ASSESSMENT_SERVICE.ENDPOINTS.CONTEST_JOIN, { contestId: String(contestId) })
    );
  }

  // Analytics
  async getAnalyticsDashboard(period?: Period, subjectId?: number): Promise<{
    overview: any;
    streaks: any;
    performance: any;
    rankings: any;
    recommendations: any[];
  }> {
    const params = new URLSearchParams();
    if (period) params.append('period', period);
    if (subjectId) params.append('subjectId', String(subjectId));
    
    return assessmentApiClient.get(`${API_CONFIG.ASSESSMENT_SERVICE.ENDPOINTS.ANALYTICS_DASHBOARD}?${params}`);
  }

  async getPerformanceAnalytics(period?: Period, subjectId?: number, type?: string): Promise<{
    accuracy: any;
    speed: any;
    difficulty: any;
    topics: any;
    trends: any[];
  }> {
    const params = new URLSearchParams();
    if (period) params.append('period', period);
    if (subjectId) params.append('subjectId', String(subjectId));
    if (type) params.append('type', type);
    
    return assessmentApiClient.get(`${API_CONFIG.ASSESSMENT_SERVICE.ENDPOINTS.ANALYTICS_PERFORMANCE}?${params}`);
  }

  async getProgressAnalytics(subjectId?: number, period?: Period): Promise<{
    skillProgress: any;
    topicMastery: any;
    weakAreas: any[];
    strongAreas: any[];
    recommendations: any[];
  }> {
    const params = new URLSearchParams();
    if (subjectId) params.append('subjectId', String(subjectId));
    if (period) params.append('period', period);
    
    return assessmentApiClient.get(`${API_CONFIG.ASSESSMENT_SERVICE.ENDPOINTS.ANALYTICS_PROGRESS}?${params}`);
  }

  // Leaderboard
  async getGlobalLeaderboard(page = 0, size = 20, period?: Period, subjectId?: number): Promise<{
    leaderboard: any[];
    totalUsers: number;
    userRank?: number;
    period: string;
  }> {
    const params = new URLSearchParams({ page: String(page), size: String(size) });
    if (period) params.append('period', period);
    if (subjectId) params.append('subjectId', String(subjectId));
    
    return assessmentApiClient.get(`${API_CONFIG.ASSESSMENT_SERVICE.ENDPOINTS.LEADERBOARD_GLOBAL}?${params}`);
  }

  async getSubjectLeaderboard(subjectId: number, page = 0, size = 20, period?: Period): Promise<{
    leaderboard: any[];
    totalUsers: number;
    userRank?: number;
    subject: Subject;
  }> {
    const params = new URLSearchParams({ page: String(page), size: String(size) });
    if (period) params.append('period', period);
    
    return assessmentApiClient.get(
      replacePath(API_CONFIG.ASSESSMENT_SERVICE.ENDPOINTS.LEADERBOARD_SUBJECT, { subjectId: String(subjectId) }) + 
      `?${params}`
    );
  }
}

export const assessmentService = new AssessmentService();