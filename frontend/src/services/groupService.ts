import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

// Types for Group Management
export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  bio: string | null;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Group {
  id: number;
  name: string;
  description: string;
  type: 'STUDY' | 'PROJECT';
  subjectId?: number;
  classLevel?: string;
  isPrivate: boolean;
  avatarUrl?: string;
  rules?: string;
  membersCount: number;
  discussionsCount: number;
  createdBy: User;
  createdAt: string;
  updatedAt: string;
}

export interface GroupMember {
  id: number;
  user: User;
  role: 'ADMIN' | 'MODERATOR' | 'MEMBER';
  joinedAt: string;
}

export interface CreateGroupRequest {
  name: string;
  description: string;
  type: 'STUDY' | 'PROJECT';
  subjectId?: number;
  classLevel?: string;
  isPrivate: boolean;
  avatarUrl?: string;
  rules?: string;
}

export interface UpdateGroupRequest {
  name: string;
  description: string;
  avatarUrl?: string;
  rules?: string;
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

class GroupService {
  private baseUrl = API_ENDPOINTS.DISCUSSION_SERVICE;

  private getAuthHeaders() {
    const token = localStorage.getItem('accessToken');
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  // Get all groups with optional filters
  async getGroups(params?: {
    page?: number;
    size?: number;
    type?: 'STUDY' | 'PROJECT';
    subjectId?: number;
    joined?: boolean;
  }): Promise<PagedResponse<Group>> {
    const response = await axios.get(
      `${this.baseUrl}/groups`,
      {
        headers: this.getAuthHeaders(),
        params: {
          page: params?.page || 0,
          size: params?.size || 20,
          ...(params?.type && { type: params.type }),
          ...(params?.subjectId && { subjectId: params.subjectId }),
          ...(params?.joined !== undefined && { joined: params.joined }),
        },
      }
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to fetch groups');
    }

    return response.data.data;
  }

  // Get specific group by ID
  async getGroupById(groupId: number): Promise<Group> {
    const response = await axios.get(
      `${this.baseUrl}/groups/${groupId}`,
      {
        headers: this.getAuthHeaders(),
      }
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to fetch group');
    }

    return response.data.data;
  }

  // Create new group
  async createGroup(groupData: CreateGroupRequest): Promise<Group> {
    const response = await axios.post(
      `${this.baseUrl}/groups`,
      groupData,
      {
        headers: this.getAuthHeaders(),
      }
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to create group');
    }

    return response.data.data;
  }

  // Update group
  async updateGroup(groupId: number, updateData: UpdateGroupRequest): Promise<Group> {
    const response = await axios.put(
      `${this.baseUrl}/groups/${groupId}`,
      updateData,
      {
        headers: this.getAuthHeaders(),
      }
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to update group');
    }

    return response.data.data;
  }

  // Join or leave group (toggle membership)
  async toggleGroupMembership(groupId: number): Promise<{ joined: boolean; message: string }> {
    const response = await axios.post(
      `${this.baseUrl}/groups/${groupId}/join`,
      {},
      {
        headers: this.getAuthHeaders(),
      }
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to toggle group membership');
    }

    return response.data.data;
  }

  // Get group members
  async getGroupMembers(groupId: number, params?: {
    page?: number;
    size?: number;
    role?: 'ADMIN' | 'MODERATOR' | 'MEMBER';
  }): Promise<PagedResponse<GroupMember>> {
    const response = await axios.get(
      `${this.baseUrl}/groups/${groupId}/members`,
      {
        headers: this.getAuthHeaders(),
        params: {
          page: params?.page || 0,
          size: params?.size || 20,
          ...(params?.role && { role: params.role }),
        },
      }
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to fetch group members');
    }

    return response.data.data;
  }

  // Change member role
  async changeGroupMemberRole(
    groupId: number, 
    userId: number, 
    role: 'ADMIN' | 'MODERATOR' | 'MEMBER'
  ): Promise<void> {
    const response = await axios.put(
      `${this.baseUrl}/groups/${groupId}/members/${userId}/role`,
      { role },
      {
        headers: this.getAuthHeaders(),
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to change member role');
    }
  }

  // Remove member from group
  async removeGroupMember(groupId: number, userId: number): Promise<void> {
    const response = await axios.delete(
      `${this.baseUrl}/groups/${groupId}/members/${userId}`,
      {
        headers: this.getAuthHeaders(),
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to remove group member');
    }
  }

  // Search groups
  async searchGroups(query: string, params?: {
    page?: number;
    size?: number;
    type?: 'STUDY' | 'PROJECT';
  }): Promise<PagedResponse<Group>> {
    const response = await axios.get(
      `${this.baseUrl}/search/groups`,
      {
        headers: this.getAuthHeaders(),
        params: {
          q: query,
          page: params?.page || 0,
          size: params?.size || 20,
          ...(params?.type && { type: params.type }),
        },
      }
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to search groups');
    }

    return response.data.data;
  }

  // Get group discussions (placeholder - discussions service integration)
  async getGroupDiscussions(groupId: number, params?: {
    page?: number;
    size?: number;
    sortBy?: string;
  }): Promise<any> {
    const response = await axios.get(
      `${this.baseUrl}/groups/${groupId}/discussions`,
      {
        headers: this.getAuthHeaders(),
        params: {
          page: params?.page || 0,
          size: params?.size || 20,
          sortBy: params?.sortBy || 'NEWEST',
        },
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to fetch group discussions');
    }

    return response.data.data;
  }
}

export const groupService = new GroupService();
export default groupService;