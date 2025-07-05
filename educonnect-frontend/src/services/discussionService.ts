/* eslint-disable @typescript-eslint/no-explicit-any */
import { discussionApiClient, replacePath } from './api';
import { API_CONFIG } from '../constants/api';
import {
  type Discussion,
  type Answer,
  type Group,
  type Message,
  type Conversation,
  type AIQuery,
  type Notification,
  type PagedResponse,
  type CreateDiscussionRequest,
  type CreateAnswerRequest,
  type CreateGroupRequest,
  type SendMessageRequest,
  type AIQueryRequest,
  DiscussionType,
  GroupType,
  SortBy
} from '../types/discussion';
import { ClassLevel } from '../types/assessment';

class DiscussionService {
  // Discussions
  async getDiscussions(params: {
    page?: number;
    size?: number;
    type?: DiscussionType;
    subjectId?: number;
    topicId?: number;
    classLevel?: ClassLevel;
    sortBy?: SortBy;
  } = {}): Promise<PagedResponse<Discussion>> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
    
    return discussionApiClient.get(`${API_CONFIG.DISCUSSION_SERVICE.ENDPOINTS.DISCUSSIONS}?${searchParams}`);
  }

  async getDiscussionById(discussionId: number): Promise<Discussion> {
    return discussionApiClient.get(
      replacePath(API_CONFIG.DISCUSSION_SERVICE.ENDPOINTS.DISCUSSION_BY_ID, { discussionId: String(discussionId) })
    );
  }

  async createDiscussion(data: CreateDiscussionRequest): Promise<{ success: boolean; data: Discussion; message: string }> {
    return discussionApiClient.post(API_CONFIG.DISCUSSION_SERVICE.ENDPOINTS.DISCUSSIONS, data);
  }

  async updateDiscussion(discussionId: number, data: {
    title: string;
    content: string;
    tags?: string[];
    attachments?: string[];
  }): Promise<{ success: boolean; data: Discussion; message: string }> {
    return discussionApiClient.put(
      replacePath(API_CONFIG.DISCUSSION_SERVICE.ENDPOINTS.DISCUSSION_BY_ID, { discussionId: String(discussionId) }),
      data
    );
  }

  async deleteDiscussion(discussionId: number): Promise<{ success: boolean; message: string }> {
    return discussionApiClient.delete(
      replacePath(API_CONFIG.DISCUSSION_SERVICE.ENDPOINTS.DISCUSSION_BY_ID, { discussionId: String(discussionId) })
    );
  }

  async upvoteDiscussion(discussionId: number): Promise<{
    upvoted: boolean;
    upvotesCount: number;
    downvotesCount: number;
  }> {
    return discussionApiClient.post(
      replacePath(API_CONFIG.DISCUSSION_SERVICE.ENDPOINTS.DISCUSSION_UPVOTE, { discussionId: String(discussionId) })
    );
  }

  async downvoteDiscussion(discussionId: number): Promise<{
    downvoted: boolean;
    upvotesCount: number;
    downvotesCount: number;
  }> {
    return discussionApiClient.post(
      replacePath(API_CONFIG.DISCUSSION_SERVICE.ENDPOINTS.DISCUSSION_DOWNVOTE, { discussionId: String(discussionId) })
    );
  }

  async bookmarkDiscussion(discussionId: number): Promise<{ bookmarked: boolean }> {
    return discussionApiClient.post(
      replacePath(API_CONFIG.DISCUSSION_SERVICE.ENDPOINTS.DISCUSSION_BOOKMARK, { discussionId: String(discussionId) })
    );
  }

  // Answers
  async getAnswers(discussionId: number, params: {
    page?: number;
    size?: number;
    sortBy?: SortBy;
  } = {}): Promise<PagedResponse<Answer>> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
    
    return discussionApiClient.get(
      replacePath(API_CONFIG.DISCUSSION_SERVICE.ENDPOINTS.DISCUSSION_ANSWERS, { discussionId: String(discussionId) }) + 
      `?${searchParams}`
    );
  }

  async createAnswer(discussionId: number, data: CreateAnswerRequest): Promise<{ success: boolean; data: Answer; message: string }> {
    return discussionApiClient.post(
      replacePath(API_CONFIG.DISCUSSION_SERVICE.ENDPOINTS.DISCUSSION_ANSWERS, { discussionId: String(discussionId) }),
      data
    );
  }

  async updateAnswer(answerId: number, data: {
    content: string;
    attachments?: string[];
  }): Promise<{ success: boolean; data: Answer; message: string }> {
    return discussionApiClient.put(
      replacePath(API_CONFIG.DISCUSSION_SERVICE.ENDPOINTS.ANSWERS, { answerId: String(answerId) }),
      data
    );
  }

  async deleteAnswer(answerId: number): Promise<{ success: boolean; message: string }> {
    return discussionApiClient.delete(
      replacePath(API_CONFIG.DISCUSSION_SERVICE.ENDPOINTS.ANSWERS, { answerId: String(answerId) })
    );
  }

  async upvoteAnswer(answerId: number): Promise<{
    upvoted: boolean;
    upvotesCount: number;
    downvotesCount: number;
  }> {
    return discussionApiClient.post(
      replacePath(API_CONFIG.DISCUSSION_SERVICE.ENDPOINTS.ANSWER_UPVOTE, { answerId: String(answerId) })
    );
  }

  async downvoteAnswer(answerId: number): Promise<{
    downvoted: boolean;
    upvotesCount: number;
    downvotesCount: number;
  }> {
    return discussionApiClient.post(
      replacePath(API_CONFIG.DISCUSSION_SERVICE.ENDPOINTS.ANSWER_DOWNVOTE, { answerId: String(answerId) })
    );
  }

  async acceptAnswer(answerId: number): Promise<{ accepted: boolean }> {
    return discussionApiClient.post(
      replacePath(API_CONFIG.DISCUSSION_SERVICE.ENDPOINTS.ANSWER_ACCEPT, { answerId: String(answerId) })
    );
  }

  // Groups
  async getGroups(params: {
    page?: number;
    size?: number;
    type?: GroupType;
    subjectId?: number;
    joined?: boolean;
  } = {}): Promise<PagedResponse<Group>> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
    
    return discussionApiClient.get(`${API_CONFIG.DISCUSSION_SERVICE.ENDPOINTS.GROUPS}?${searchParams}`);
  }

  async getGroupById(groupId: number): Promise<Group> {
    return discussionApiClient.get(
      replacePath(API_CONFIG.DISCUSSION_SERVICE.ENDPOINTS.GROUP_BY_ID, { groupId: String(groupId) })
    );
  }

  async createGroup(data: CreateGroupRequest): Promise<{ success: boolean; data: Group; message: string }> {
    return discussionApiClient.post(API_CONFIG.DISCUSSION_SERVICE.ENDPOINTS.GROUPS, data);
  }

  async updateGroup(groupId: number, data: {
    name: string;
    description: string;
    avatarUrl?: string;
    rules?: string;
  }): Promise<{ success: boolean; data: Group; message: string }> {
    return discussionApiClient.put(
      replacePath(API_CONFIG.DISCUSSION_SERVICE.ENDPOINTS.GROUP_BY_ID, { groupId: String(groupId) }),
      data
    );
  }

  async joinGroup(groupId: number): Promise<{ joined: boolean; membersCount: number }> {
    return discussionApiClient.post(
      replacePath(API_CONFIG.DISCUSSION_SERVICE.ENDPOINTS.GROUP_JOIN, { groupId: String(groupId) })
    );
  }

  async getGroupMembers(groupId: number, params: {
    page?: number;
    size?: number;
    role?: string;
  } = {}): Promise<PagedResponse<any>> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
    
    return discussionApiClient.get(
      replacePath(API_CONFIG.DISCUSSION_SERVICE.ENDPOINTS.GROUP_MEMBERS, { groupId: String(groupId) }) + 
      `?${searchParams}`
    );
  }

  async getGroupDiscussions(groupId: number, params: {
    page?: number;
    size?: number;
    sortBy?: SortBy;
  } = {}): Promise<PagedResponse<Discussion>> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
    
    return discussionApiClient.get(
      replacePath(API_CONFIG.DISCUSSION_SERVICE.ENDPOINTS.GROUP_DISCUSSIONS, { groupId: String(groupId) }) + 
      `?${searchParams}`
    );
  }

  async createGroupDiscussion(groupId: number, data: {
    title: string;
    content: string;
    tags?: string[];
    attachments?: string[];
    isAnonymous?: boolean;
  }): Promise<{ success: boolean; data: Discussion; message: string }> {
    return discussionApiClient.post(
      replacePath(API_CONFIG.DISCUSSION_SERVICE.ENDPOINTS.GROUP_DISCUSSIONS, { groupId: String(groupId) }),
      data
    );
  }

  // Messages
  async getConversations(params: {
    page?: number;
    size?: number;
  } = {}): Promise<PagedResponse<Conversation>> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
    
    return discussionApiClient.get(`${API_CONFIG.DISCUSSION_SERVICE.ENDPOINTS.CONVERSATIONS}?${searchParams}`);
  }

  async getConversationMessages(conversationId: number, params: {
    page?: number;
    size?: number;
    before?: string;
  } = {}): Promise<{
    messages: Message[];
    totalElements: number;
    hasMore: boolean;
    conversation: Conversation;
  }> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
    
    return discussionApiClient.get(
      replacePath(API_CONFIG.DISCUSSION_SERVICE.ENDPOINTS.CONVERSATION_BY_ID, { conversationId: String(conversationId) }) + 
      `?${searchParams}`
    );
  }

  async sendMessage(data: SendMessageRequest): Promise<{ success: boolean; data: Message; message: string }> {
    return discussionApiClient.post(API_CONFIG.DISCUSSION_SERVICE.ENDPOINTS.MESSAGES, data);
  }

  async updateMessage(messageId: number, data: { content: string }): Promise<{ success: boolean; data: Message; message: string }> {
    return discussionApiClient.put(
      replacePath(API_CONFIG.DISCUSSION_SERVICE.ENDPOINTS.MESSAGE_BY_ID, { messageId: String(messageId) }),
      data
    );
  }

  async deleteMessage(messageId: number): Promise<{ success: boolean; message: string }> {
    return discussionApiClient.delete(
      replacePath(API_CONFIG.DISCUSSION_SERVICE.ENDPOINTS.MESSAGE_BY_ID, { messageId: String(messageId) })
    );
  }

  async markMessageAsRead(messageId: number): Promise<{ success: boolean }> {
    return discussionApiClient.put(
      replacePath(API_CONFIG.DISCUSSION_SERVICE.ENDPOINTS.MESSAGE_READ, { messageId: String(messageId) })
    );
  }

  async getUnreadMessageCount(): Promise<{ unreadCount: number }> {
    return discussionApiClient.get(API_CONFIG.DISCUSSION_SERVICE.ENDPOINTS.UNREAD_COUNT);
  }

  // AI Assistant
  async askAI(data: AIQueryRequest): Promise<{
    answer: string;
    sources?: string[];
    confidence: number;
    followUpQuestions?: string[];
  }> {
    return discussionApiClient.post(API_CONFIG.DISCUSSION_SERVICE.ENDPOINTS.AI_ASK, data);
  }

  async getAIHistory(params: {
    page?: number;
    size?: number;
    subjectId?: number;
  } = {}): Promise<PagedResponse<AIQuery>> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
    
    return discussionApiClient.get(`${API_CONFIG.DISCUSSION_SERVICE.ENDPOINTS.AI_HISTORY}?${searchParams}`);
  }

  // Search
  async searchDiscussions(params: {
    q: string;
    page?: number;
    size?: number;
    subjectId?: number;
    type?: DiscussionType;
    sortBy?: SortBy;
  }): Promise<PagedResponse<Discussion>> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
    
    return discussionApiClient.get(`${API_CONFIG.DISCUSSION_SERVICE.ENDPOINTS.SEARCH_DISCUSSIONS}?${searchParams}`);
  }

  async searchGroups(params: {
    q: string;
    page?: number;
    size?: number;
    type?: GroupType;
  }): Promise<PagedResponse<Group>> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
    
    return discussionApiClient.get(`${API_CONFIG.DISCUSSION_SERVICE.ENDPOINTS.SEARCH_GROUPS}?${searchParams}`);
  }

  async searchUsers(params: {
    q: string;
    page?: number;
    size?: number;
  }): Promise<PagedResponse<any>> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
    
    return discussionApiClient.get(`${API_CONFIG.DISCUSSION_SERVICE.ENDPOINTS.SEARCH_USERS}?${searchParams}`);
  }

  // Notifications
  async getNotifications(params: {
    page?: number;
    size?: number;
    type?: string;
    unread?: boolean;
  } = {}): Promise<PagedResponse<Notification> & { unreadCount: number }> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
    
    return discussionApiClient.get(`${API_CONFIG.DISCUSSION_SERVICE.ENDPOINTS.NOTIFICATIONS}?${searchParams}`);
  }

  async markNotificationAsRead(notificationId: number): Promise<{ success: boolean }> {
    return discussionApiClient.put(
      replacePath(API_CONFIG.DISCUSSION_SERVICE.ENDPOINTS.NOTIFICATION_READ, { notificationId: String(notificationId) })
    );
  }

  async markAllNotificationsAsRead(): Promise<{ success: boolean }> {
    return discussionApiClient.put(API_CONFIG.DISCUSSION_SERVICE.ENDPOINTS.NOTIFICATIONS_READ_ALL);
  }

  async getUnreadNotificationCount(): Promise<{ unreadCount: number }> {
    return discussionApiClient.get(API_CONFIG.DISCUSSION_SERVICE.ENDPOINTS.NOTIFICATIONS_UNREAD_COUNT);
  }
}

export const discussionService = new DiscussionService();