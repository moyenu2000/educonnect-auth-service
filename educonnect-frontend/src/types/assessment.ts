/* eslint-disable @typescript-eslint/no-explicit-any */
export enum ClassLevel {
  CLASS_6 = 'CLASS_6',
  CLASS_7 = 'CLASS_7',
  CLASS_8 = 'CLASS_8',
  CLASS_9 = 'CLASS_9',
  CLASS_10 = 'CLASS_10',
  CLASS_11 = 'CLASS_11',
  CLASS_12 = 'CLASS_12'
}

export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
  EXPERT = 'EXPERT'
}

export enum QuestionType {
  MCQ = 'MCQ',
  TRUE_FALSE = 'TRUE_FALSE',
  FILL_BLANK = 'FILL_BLANK',
  NUMERIC = 'NUMERIC',
  ESSAY = 'ESSAY'
}

export enum ContestType {
  PRACTICE = 'PRACTICE',
  COMPETITIVE = 'COMPETITIVE'
}

export enum ContestStatus {
  UPCOMING = 'UPCOMING',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED'
}

export enum ExamStatus {
  SCHEDULED = 'SCHEDULED',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum ProblemStatus {
  UNSOLVED = 'UNSOLVED',
  ATTEMPTED = 'ATTEMPTED',
  SOLVED = 'SOLVED',
  BOOKMARKED = 'BOOKMARKED'
}

export enum Period {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
  ALL_TIME = 'ALL_TIME'
}

export interface Subject {
  id: number;
  name: string;
  description: string;
  classLevel: ClassLevel;
  displayOrder: number;
  isActive: boolean;
  topicsCount: number;
  questionsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Topic {
  id: number;
  name: string;
  description: string;
  subjectId: number;
  subject?: Subject;
  displayOrder: number;
  isActive: boolean;
  questionsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  id: number;
  text: string;
  type: QuestionType;
  subjectId: number;
  topicId?: number;
  subject?: Subject;
  topic?: Topic;
  difficulty: Difficulty;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  points: number;
  tags: string[];
  attachments: string[];
  isActive: boolean;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

export interface DailyQuestion {
  id: number;
  question: Question;
  date: string;
  subjectId: number;
  difficulty: Difficulty;
  points: number;
  answered?: boolean;
  correct?: boolean;
  streak?: number;
}

export interface PracticeProblem {
  id: number;
  question: Question;
  difficulty: Difficulty;
  topicId: number;
  subjectId: number;
  type: QuestionType;
  points: number;
  hints: string[];
  similarProblems: number[];
  status?: ProblemStatus;
  attempts?: number;
  solved?: boolean;
  bookmarked?: boolean;
}

export interface LiveExam {
  id: number;
  title: string;
  description: string;
  subjectId: number;
  classLevel: ClassLevel;
  scheduledAt: string;
  duration: number;
  questions: Question[];
  instructions: string;
  passingScore: number;
  totalParticipants: number;
  status: ExamStatus;
  createdAt: string;
  registered?: boolean;
  canStart?: boolean;
  timeRemaining?: number;
}

export interface Contest {
  id: number;
  title: string;
  description: string;
  type: ContestType;
  startTime: string;
  endTime: string;
  duration: number;
  problemIds: number[];
  prizes: string[];
  rules: string;
  participants: number;
  status: ContestStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ExamResult {
  id: number;
  examId: number;
  userId: number;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unanswered: number;
  timeTaken: number;
  rank: number;
  percentile: number;
  passed: boolean;
  submittedAt: string;
  answers: { questionId: number; answer: string; correct: boolean; timeTaken: number; }[];
}

export interface Streak {
  id: number;
  userId: number;
  subjectId: number;
  currentStreak: number;
  longestStreak: number;
  lastActivity: string;
  isActive: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  user: { id: number; username: string; fullName: string; avatarUrl?: string; };
  score: number;
  accuracy: number;
  problemsSolved: number;
  streak: number;
  badges: string[];
}

export interface Analytics {
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  averageTime: number;
  streaks: { [subjectId: number]: number };
  subjectPerformance: { subjectId: number; subjectName: string; accuracy: number; questionsAttempted: number; }[];
  topicMastery: { topicId: number; topicName: string; masteryLevel: number; questionsAttempted: number; }[];
  weakAreas: { topicId: number; topicName: string; accuracy: number; needsImprovement: boolean; }[];
  improvements: { area: string; suggestion: string; priority: 'low' | 'medium' | 'high'; }[];
}

export interface PagedResponse<T> {
  data: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  last?: boolean;
}

export interface SubmitAnswerRequest {
  answer: string;
  timeTaken: number;
  explanation?: string;
  workingSteps?: string;
}

export interface SubmitAnswerResponse {
  correct: boolean;
  correctAnswer: string;
  explanation: string;
  points: number;
  streak?: any;
  ranking?: any;
  hints?: string[];
  similarProblems?: number[];
}