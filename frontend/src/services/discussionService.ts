import { discussionApi } from './api'

// Types
export interface Discussion {
  id: number
  title: string
  content: string
  type: 'QUESTION' | 'HELP' | 'GENERAL' | 'ANNOUNCEMENT'
  authorId: number
  authorName: string
  subjectName?: string
  topicName?: string
  classLevel?: string
  voteCount: number
  answerCount: number
  viewCount: number
  isBookmarked: boolean
  hasUpvoted: boolean
  hasDownvoted: boolean
  isAnonymous: boolean
  createdAt: string
  updatedAt?: string
  tags: string[]
  attachments: string[]
  groupId?: number
  groupName?: string
}

export interface Answer {
  id: number
  content: string
  authorId: number
  authorName: string
  discussionId: number
  voteCount: number
  isAccepted: boolean
  hasUpvoted: boolean
  hasDownvoted: boolean
  isAnonymous: boolean
  createdAt: string
  updatedAt?: string
  attachments: string[]
}

export interface Group {
  id: number
  name: string
  description: string
  type: 'STUDY' | 'SUBJECT' | 'CLASS' | 'PROJECT' | 'GENERAL'
  subjectName?: string
  classLevel?: string
  memberCount: number
  isPrivate: boolean
  isJoined: boolean
  role?: 'ADMIN' | 'MODERATOR' | 'MEMBER'
  creatorName: string
  avatarUrl?: string
  rules?: string
  createdAt: string
  updatedAt?: string
}

export interface GroupMember {
  userId: number
  username: string
  fullName: string
  avatarUrl?: string
  role: 'ADMIN' | 'MODERATOR' | 'MEMBER'
  joinedAt: string
}

export interface Message {
  id: number
  content: string
  sender: User
  recipient: User
  conversationId: number
  type: 'TEXT' | 'IMAGE' | 'FILE' | 'AUDIO' | 'VIDEO'
  isRead: boolean
  isEdited?: boolean
  createdAt: string
  updatedAt?: string
  attachments: string[]
}

export interface Conversation {
  id: number
  participants: User[]
  lastMessage?: Message
  unreadCount: number
  createdAt: string
  updatedAt?: string
}

export interface Notification {
  id: number
  type: 'ANSWER' | 'UPVOTE' | 'MENTION' | 'GROUP_INVITE' | 'MESSAGE' | 'FOLLOW'
  title: string
  content: string
  isRead: boolean
  actionUrl: string
  actionData: Record<string, unknown>
  createdAt: string
}

export interface AIQuery {
  id: number
  question: string
  answer: string
  subjectName?: string
  topicName?: string
  type: 'CONCEPT' | 'PROBLEM' | 'EXPLANATION' | 'HOMEWORK'
  confidence: number
  sources?: string[]
  relatedTopics?: string[]
  createdAt: string
}

export interface FileAttachment {
  id: number
  fileName: string
  originalName: string
  fileSize: number
  mimeType: string
  description?: string
  downloadUrl: string
  uploadedAt: string
  isPublic: boolean
  downloadCount?: number
  uploaderId?: number
  uploaderName?: string
}

export interface User {
  id: number
  username: string
  fullName: string
  bio?: string
  avatarUrl?: string
  role: string
  reputationScore?: number
  followersCount?: number
  followingCount?: number
}

// Discussion Service API
export const discussionService = {
  // Discussions
  getDiscussions: (params?: {
    page?: number
    size?: number
    type?: string
    subjectId?: number
    topicId?: number
    classLevel?: string
    sortBy?: string
  }) => discussionApi.get('/discussions', { params }),
  
  getPublicDiscussions: (params?: {
    page?: number
    size?: number
    type?: string
    subjectId?: number
    sortBy?: string
  }) => discussionApi.get('/discussions/public', { params }),
  
  getDiscussion: (id: number) => discussionApi.get(`/discussions/${id}`),
  
  getPublicDiscussion: (id: number) => discussionApi.get(`/discussions/${id}/public`),
  
  createDiscussion: (data: {
    title: string
    content: string
    type: string
    subjectId?: number
    topicId?: number
    classLevel?: string
    tags?: string[]
    attachments?: string[]
    isAnonymous?: boolean
  }) => discussionApi.post('/discussions', data),
  
  updateDiscussion: (id: number, data: Partial<Discussion>) =>
    discussionApi.put(`/discussions/${id}`, data),
  
  deleteDiscussion: (id: number) => discussionApi.delete(`/discussions/${id}`),
  
  upvoteDiscussion: (id: number) => discussionApi.post(`/discussions/${id}/upvote`),
  
  downvoteDiscussion: (id: number) => discussionApi.post(`/discussions/${id}/downvote`),
  
  bookmarkDiscussion: (id: number) => discussionApi.post(`/discussions/${id}/bookmark`),

  // Answers
  getAnswers: (discussionId: number, params?: {
    page?: number
    size?: number
    sortBy?: string
  }) => discussionApi.get(`/discussions/${discussionId}/answers`, { params }),
  
  createAnswer: (discussionId: number, data: {
    content: string
    attachments?: string[]
    isAnonymous?: boolean
  }) => discussionApi.post(`/discussions/${discussionId}/answers`, data),
  
  updateAnswer: (id: number, data: {
    content: string
    attachments?: string[]
    isAnonymous?: boolean
  }) => discussionApi.put(`/answers/${id}`, data),
  
  deleteAnswer: (id: number) => discussionApi.delete(`/answers/${id}`),
  
  upvoteAnswer: (id: number) => discussionApi.post(`/answers/${id}/upvote`),
  
  downvoteAnswer: (id: number) => discussionApi.post(`/answers/${id}/downvote`),
  
  acceptAnswer: (id: number) => discussionApi.post(`/answers/${id}/accept`),

  // Groups
  getGroups: (params?: {
    page?: number
    size?: number
    type?: string
    subjectId?: number
    joined?: boolean
  }) => discussionApi.get('/groups', { params }),
  
  getGroup: (id: number) => discussionApi.get(`/groups/${id}`),
  
  createGroup: (data: {
    name: string
    description: string
    type: string
    subjectId?: number
    classLevel?: string
    isPrivate?: boolean
    avatarUrl?: string
    rules?: string
  }) => discussionApi.post('/groups', data),
  
  updateGroup: (id: number, data: Partial<Group>) =>
    discussionApi.put(`/groups/${id}`, data),
  
  joinGroup: (id: number) => discussionApi.post(`/groups/${id}/join`),
  
  getGroupMembers: (id: number, params?: {
    page?: number
    size?: number
    role?: string
  }) => discussionApi.get(`/groups/${id}/members`, { params }),
  
  changeGroupMemberRole: (groupId: number, userId: number, role: string) =>
    discussionApi.put(`/groups/${groupId}/members/${userId}/role`, { role }),
  
  removeGroupMember: (groupId: number, userId: number) =>
    discussionApi.delete(`/groups/${groupId}/members/${userId}`),
  
  getGroupDiscussions: (id: number, params?: {
    page?: number
    size?: number
    sortBy?: string
  }) => discussionApi.get(`/groups/${id}/discussions`, { params }),
  
  createGroupDiscussion: (id: number, data: {
    title: string
    content: string
    type: string
    tags?: string[]
    attachments?: string[]
    isAnonymous?: boolean
  }) => discussionApi.post(`/groups/${id}/discussions`, data),

  // Search
  searchDiscussions: (params: {
    q: string
    page?: number
    size?: number
    subjectId?: number
    type?: string
    sortBy?: string
  }) => discussionApi.get('/search/discussions', { params }),
  
  searchGroups: (params: {
    q: string
    page?: number
    size?: number
    type?: string
  }) => discussionApi.get('/search/groups', { params }),
  
  searchUsers: (params: {
    q: string
    page?: number
    size?: number
  }) => discussionApi.get('/search/users', { params }),

  // Messages
  getConversations: (params?: {
    page?: number
    size?: number
  }) => discussionApi.get('/messages/conversations', { params }),
  
  getConversationMessages: (conversationId: number, params?: {
    page?: number
    size?: number
    before?: string
  }) => discussionApi.get(`/messages/conversations/${conversationId}`, { params }),
  
  sendMessage: (data: {
    recipientId: number
    content: string
    type: 'TEXT' | 'IMAGE' | 'FILE' | 'AUDIO' | 'VIDEO'
    attachments?: string[]
  }) => discussionApi.post('/messages', data),
  
  updateMessage: (id: number, content: string) =>
    discussionApi.put(`/messages/${id}`, { content }),
  
  deleteMessage: (id: number) => discussionApi.delete(`/messages/${id}`),
  
  markMessageAsRead: (id: number) => discussionApi.put(`/messages/${id}/read`),
  
  getUnreadMessageCount: () => discussionApi.get('/messages/unread-count'),

  // Notifications
  getNotifications: (params?: {
    page?: number
    size?: number
    type?: string
    unread?: boolean
  }) => discussionApi.get('/notifications', { params }),
  
  markNotificationAsRead: (id: number) =>
    discussionApi.put(`/notifications/${id}/read`),
  
  markAllNotificationsAsRead: () => discussionApi.put('/notifications/read-all'),
  
  getUnreadNotificationCount: () => discussionApi.get('/notifications/unread-count'),

  // AI Assistant
  askAI: (data: {
    question: string
    subjectId?: number
    topicId?: number
    context?: string
    type?: string
  }) => discussionApi.post('/ai/ask', data),
  
  getAIHistory: (params?: {
    page?: number
    size?: number
    subjectId?: number
  }) => discussionApi.get('/ai/history', { params }),

  // File Upload
  uploadFile: (file: File, description?: string) => {
    const formData = new FormData()
    formData.append('file', file)
    if (description) formData.append('description', description)
    return discussionApi.post('/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  
  uploadMultipleFiles: (files: File[], description?: string) => {
    const formData = new FormData()
    files.forEach(file => formData.append('files', file))
    if (description) formData.append('description', description)
    return discussionApi.post('/files/upload/multiple', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  
  downloadFile: async (fileName: string) => {
    const response = await discussionApi.get(`/files/${fileName}`, {
      responseType: 'blob', // Important for file downloads
      headers: {
        'Accept': '*/*' // Accept any content type
      }
    });
    
    // Create a blob URL and trigger download
    const blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    // Extract filename from response headers or use provided fileName
    const contentDisposition = response.headers['content-disposition'];
    let downloadFileName = fileName;
    if (contentDisposition) {
      const matches = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (matches != null && matches[1]) {
        downloadFileName = matches[1].replace(/['"]/g, '');
      }
    }
    
    link.setAttribute('download', downloadFileName);
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    return response;
  },

  downloadFileById: async (fileId: number) => {
    // First get file details to get the filename
    const detailsResponse = await discussionApi.get(`/files/details/${fileId}`);
    const fileDetails = detailsResponse.data.data;
    
    // Then download using the filename
    return discussionService.downloadFile(fileDetails.fileName);
  },

  // Helper method to download any attachment URL with authentication
  downloadAttachment: async (attachmentUrl: string, filename?: string) => {
    // Extract filename from URL if not provided
    if (!filename) {
      const urlParts = attachmentUrl.split('/');
      filename = urlParts[urlParts.length - 1];
    }
    
    // Use the API with authentication
    const response = await discussionApi.get(attachmentUrl, {
      responseType: 'blob',
      headers: {
        'Accept': '*/*'
      }
    });
    
    // Create download
    const blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    // Extract filename from response headers if available
    const contentDisposition = response.headers['content-disposition'];
    let downloadFileName = filename;
    if (contentDisposition) {
      const matches = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (matches != null && matches[1]) {
        downloadFileName = matches[1].replace(/['"]/g, '');
      }
    }
    
    link.setAttribute('download', downloadFileName);
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    return response;
  },
  
  getUserFiles: (params?: {
    page?: number
    size?: number
  }) => discussionApi.get('/files/my', { params }),
  
  getFileDetails: (id: number) => discussionApi.get(`/files/details/${id}`),
  
  deleteFile: (id: number) => discussionApi.delete(`/files/${id}`),
  
  getStorageInfo: () => discussionApi.get('/files/storage-info'),
}