import { type User } from './auth';
import { ClassLevel } from './assessment';

export enum DiscussionType {
  QUESTION = 'QUESTION',
  HELP = 'HELP',
  GENERAL = 'GENERAL',
  ANNOUNCEMENT = 'ANNOUNCEMENT'
}

export enum DiscussionStatus {
  ACTIVE = 'ACTIVE',
  CLOSED = 'CLOSED',
  HIDDEN = 'HIDDEN'
}

export enum GroupType {
  STUDY = 'STUDY',
  SUBJECT = 'SUBJECT',
  CLASS = 'CLASS',
  PROJECT = 'PROJECT',
  GENERAL = 'GENERAL'
}

export enum GroupRole {
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
  MEMBER = 'MEMBER'
}

export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  FILE = 'FILE',
  AUDIO = 'AUDIO',
  VIDEO = 'VIDEO'
}

export enum AIQueryType {
  CONCEPT = 'CONCEPT',
  PROBLEM = 'PROBLEM',
  EXPLANATION = 'EXPLANATION',
  HOMEWORK = 'HOMEWORK'
}

export enum NotificationType {
  ANSWER = 'ANSWER',
  UPVOTE = 'UPVOTE',
  MENTION = 'MENTION',
  GROUP_INVITE = 'GROUP_INVITE',
  MESSAGE = 'MESSAGE',
  FOLLOW = 'FOLLOW'
}

export enum SortBy {
  NEWEST = 'NEWEST',
  OLDEST = 'OLDEST',
  MOST_UPVOTED = 'MOST_UPVOTED',
  MOST_ANSWERED = 'MOST_ANSWERED',
  MOST_VIEWED = 'MOST_VIEWED'
}

export enum MessageStatus {
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  READ = 'READ'
}

export enum VoteType {
  UPVOTE = 'UPVOTE',
  DOWNVOTE = 'DOWNVOTE',
  NONE = 'NONE'
}

export enum TargetType {
  DISCUSSION = 'DISCUSSION',
  ANSWER = 'ANSWER'
}

export enum MembershipAction {
  JOINED = 'JOINED',
  LEFT = 'LEFT',
  ROLE_CHANGED = 'ROLE_CHANGED'
}

export interface Discussion {
  id: number;
  title: string;
  content: string;
  type: DiscussionType;
  author: User;
  subjectId?: number;
  topicId?: number;
  classLevel?: ClassLevel;
  tags: string[];
  attachments: string[];
  isAnonymous: boolean;
  upvotesCount: number;
  downvotesCount: number;
  answersCount: number;
  viewsCount: number;
  hasAcceptedAnswer: boolean;
  status: DiscussionStatus;
  createdAt: string;
  updatedAt: string;
  upvoted?: boolean;
  downvoted?: boolean;
  bookmarked?: boolean;
}

export interface Answer {
  id: number;
  content: string;
  author: User;
  discussionId: number;
  attachments: string[];
  isAnonymous: boolean;
  upvotesCount: number;
  downvotesCount: number;
  isAccepted: boolean;
  createdAt: string;
  updatedAt: string;
  upvoted?: boolean;
  downvoted?: boolean;
}

export interface Group {
  id: number;
  name: string;
  description: string;
  type: GroupType;
  subjectId?: number;
  classLevel?: ClassLevel;
  isPrivate: boolean;
  avatarUrl?: string;
  rules?: string;
  membersCount: number;
  discussionsCount: number;
  createdBy: User;
  createdAt: string;
  updatedAt: string;
  joined?: boolean;
  userRole?: GroupRole;
}

export interface GroupMember {
  id: number;
  user: User;
  groupId: number;
  role: GroupRole;
  joinedAt: string;
}

export interface Message {
  id: number;
  content: string;
  type: MessageType;
  sender: User;
  recipient: User;
  conversationId: number;
  attachments: string[];
  isRead: boolean;
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  id: number;
  participants: User[];
  lastMessage: Message;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AIQuery {
  id: number;
  question: string;
  answer: string;
  type: AIQueryType;
  subjectId?: number;
  topicId?: number;
  context?: string;
  confidence: number;
  sources: string[];
  userId: number;
  createdAt: string;
}

export interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  content: string;
  userId: number;
  relatedId?: number;
  relatedType?: string;
  isRead: boolean;
  createdAt: string;
}

export interface PagedResponse<T> {
  data: T[];
  totalElements: number;
  totalPages: number;
  currentPage?: number;
  last?: boolean;
}

// Request DTOs
export interface CreateDiscussionRequest {
  title: string;
  content: string;
  type: DiscussionType;
  subjectId?: number;
  topicId?: number;
  classLevel?: ClassLevel;
  tags?: string[];
  attachments?: string[];
  isAnonymous?: boolean;
}

export interface CreateAnswerRequest {
  content: string;
  attachments?: string[];
  isAnonymous?: boolean;
}

export interface CreateGroupRequest {
  name: string;
  description: string;
  type: GroupType;
  subjectId?: number;
  classLevel?: ClassLevel;
  isPrivate: boolean;
  avatarUrl?: string;
  rules?: string;
}

export interface SendMessageRequest {
  recipientId: number;
  content: string;
  type: MessageType;
  attachments?: string[];
}

export interface AIQueryRequest {
  question: string;
  subjectId?: number;
  topicId?: number;
  context?: string;
  type: AIQueryType;
}

// WebSocket DTOs
export interface MessageSendDto {
  recipientId: number;
  content: string;
  type: MessageType;
  attachments?: string[];
  tempId?: string;
}

export interface TypingDto {
  conversationId: number;
  recipientId: number;
}

export interface TypingStatusDto {
  senderId: number;
  senderName: string;
  conversationId: number;
  isTyping: boolean;
}

export interface MessageReadDto {
  messageId: number;
  conversationId: number;
}

export interface MessageStatusDto {
  messageId: number;
  status: MessageStatus;
  timestamp: string;
}

export interface NotificationCountDto {
  unreadCount: number;
  lastUpdated: string;
}

export interface VoteDto {
  targetId: number;
  targetType: TargetType;
  voteType: VoteType;
}

export interface VoteUpdateDto {
  targetId: number;
  targetType: TargetType;
  upvotesCount: number;
  downvotesCount: number;
  userVote: VoteType;
}

export interface MembershipUpdateDto {
  userId: number;
  userName: string;
  action: MembershipAction;
  role?: GroupRole;
  membersCount: number;
}