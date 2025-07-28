export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  bio?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
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

export interface Group {
  id: number;
  name: string;
  description: string;
  type: GroupType;
  isPrivate: boolean;
  membersCount: number;
  discussionsCount: number;
  createdBy: User;
  createdAt: string;
  updatedAt: string;
  avatarUrl?: string;
  rules?: string;
  subjectId?: number;
  classLevel?: string;
  isJoined?: boolean;
  userRole?: GroupRole;
}

export interface GroupMember {
  user: User;
  role: GroupRole;
  joinedAt: string;
}

export interface GroupRequest {
  name: string;
  description: string;
  type: GroupType;
  isPrivate?: boolean;
  avatarUrl?: string;
  rules?: string;
  subjectId?: number;
  classLevel?: string;
}

export interface GroupUpdateRequest {
  name?: string;
  description?: string;
  type?: GroupType;
  isPrivate?: boolean;
  avatarUrl?: string;
  rules?: string;
}

export interface GroupMemberRoleRequest {
  role: GroupRole;
}

export interface GroupJoinResponse {
  joined: boolean;
  message: string;
}

export interface Discussion {
  id: number;
  title: string;
  content: string;
  type: 'QUESTION' | 'HELP' | 'GENERAL' | 'ANNOUNCEMENT';
  author: User;
  groupId?: number;
  voteCount: number;
  answerCount: number;
  viewCount: number;
  isBookmarked: boolean;
  hasUpvoted: boolean;
  hasDownvoted: boolean;
  isAnonymous: boolean;
  createdAt: string;
  updatedAt?: string;
  tags: string[];
  attachments: string[];
}

export interface DiscussionRequest {
  title: string;
  content: string;
  type: 'QUESTION' | 'HELP' | 'GENERAL' | 'ANNOUNCEMENT';
  tags?: string[];
  attachments?: string[];
  isAnonymous?: boolean;
}

export interface GroupsFilter {
  page?: number;
  size?: number;
  type?: GroupType;
  subjectId?: number;
  joined?: boolean;
}

export interface GroupMembersFilter {
  page?: number;
  size?: number;
  role?: GroupRole;
}

export interface GroupDiscussionsFilter {
  page?: number;
  size?: number;
  sortBy?: 'NEWEST' | 'OLDEST' | 'MOST_VOTED' | 'MOST_ANSWERED';
}

export interface GroupSearchParams {
  q: string;
  page?: number;
  size?: number;
  type?: GroupType;
}