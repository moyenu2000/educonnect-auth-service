import { discussionApi } from './api';
import type {
  Group,
  GroupRequest,
  GroupUpdateRequest,
  GroupMember,
  GroupMemberRoleRequest,
  GroupJoinResponse,
  Discussion,
  DiscussionRequest,
  PagedResponse,
  ApiResponse,
  GroupsFilter,
  GroupMembersFilter,
  GroupDiscussionsFilter,
  GroupSearchParams
} from '../types/group';
import { GroupRole } from '../types/group';

/**
 * Comprehensive Group Service
 * Provides all group-related API interactions matching the backend endpoints
 */
export class GroupService {
  
  /**
   * Get all groups with optional filtering
   * GET /groups
   */
  async getGroups(filters?: GroupsFilter): Promise<ApiResponse<PagedResponse<Group>>> {
    try {
      const response = await discussionApi.get('/groups', { params: filters });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get a specific group by ID
   * GET /groups/{id}
   */
  async getGroup(groupId: number): Promise<ApiResponse<Group>> {
    try {
      const response = await discussionApi.get(`/groups/${groupId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Create a new group
   * POST /groups
   */
  async createGroup(groupData: GroupRequest): Promise<ApiResponse<Group>> {
    try {
      const response = await discussionApi.post('/groups', groupData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update an existing group
   * PUT /groups/{id}
   */
  async updateGroup(groupId: number, updateData: GroupUpdateRequest): Promise<ApiResponse<Group>> {
    try {
      const response = await discussionApi.put(`/groups/${groupId}`, updateData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Join or leave a group (toggle membership)
   * POST /groups/{id}/join
   */
  async joinGroup(groupId: number): Promise<ApiResponse<GroupJoinResponse>> {
    try {
      const response = await discussionApi.post(`/groups/${groupId}/join`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get group members with optional filtering
   * GET /groups/{id}/members
   */
  async getGroupMembers(groupId: number, filters?: GroupMembersFilter): Promise<ApiResponse<PagedResponse<GroupMember>>> {
    try {
      const response = await discussionApi.get(`/groups/${groupId}/members`, { params: filters });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Change a group member's role
   * PUT /groups/{id}/members/{userId}/role
   */
  async changeGroupMemberRole(
    groupId: number, 
    userId: number, 
    roleData: GroupMemberRoleRequest
  ): Promise<ApiResponse<string>> {
    try {
      const response = await discussionApi.put(`/groups/${groupId}/members/${userId}/role`, roleData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Remove a member from the group
   * DELETE /groups/{id}/members/{userId}
   */
  async removeGroupMember(groupId: number, userId: number): Promise<ApiResponse<string>> {
    try {
      const response = await discussionApi.delete(`/groups/${groupId}/members/${userId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get discussions within a group
   * GET /groups/{id}/discussions
   */
  async getGroupDiscussions(
    groupId: number, 
    filters?: GroupDiscussionsFilter
  ): Promise<ApiResponse<PagedResponse<Discussion>>> {
    try {
      const response = await discussionApi.get(`/groups/${groupId}/discussions`, { params: filters });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Create a new discussion within a group
   * POST /groups/{id}/discussions
   */
  async createGroupDiscussion(
    groupId: number, 
    discussionData: DiscussionRequest
  ): Promise<ApiResponse<Discussion>> {
    try {
      const response = await discussionApi.post(`/groups/${groupId}/discussions`, discussionData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Search groups by query
   * GET /search/groups
   */
  async searchGroups(searchParams: GroupSearchParams): Promise<ApiResponse<PagedResponse<Group>>> {
    try {
      const response = await discussionApi.get('/search/groups', { params: searchParams });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Utility Methods

  /**
   * Check if current user is admin of a group
   */
  isGroupAdmin(group: Group): boolean {
    return group.userRole === GroupRole.ADMIN;
  }

  /**
   * Check if current user is moderator or admin of a group
   */
  canModerateGroup(group: Group): boolean {
    return group.userRole === GroupRole.ADMIN || group.userRole === GroupRole.MODERATOR;
  }

  /**
   * Check if current user is a member of a group
   */
  isMember(group: Group): boolean {
    return group.isJoined === true;
  }

  /**
   * Get group type display name
   */
  getGroupTypeDisplayName(type: string): string {
    const typeMap: Record<string, string> = {
      STUDY: 'Study Group',
      SUBJECT: 'Subject Group',
      CLASS: 'Class Group',
      PROJECT: 'Project Group',
      GENERAL: 'General Group'
    };
    return typeMap[type] || type;
  }

  /**
   * Get role display name
   */
  getRoleDisplayName(role: string): string {
    const roleMap: Record<string, string> = {
      ADMIN: 'Administrator',
      MODERATOR: 'Moderator',
      MEMBER: 'Member'
    };
    return roleMap[role] || role;
  }

  /**
   * Format member count for display
   */
  formatMemberCount(count: number): string {
    if (count === 1) return '1 member';
    return `${count} members`;
  }

  /**
   * Format discussion count for display
   */
  formatDiscussionCount(count: number): string {
    if (count === 0) return 'No discussions';
    if (count === 1) return '1 discussion';
    return `${count} discussions`;
  }

  /**
   * Check if a group is private
   */
  isPrivateGroup(group: Group): boolean {
    return group.isPrivate === true;
  }

  /**
   * Get group creation time in a readable format
   */
  getTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  }

  /**
   * Error handler for API calls
   */
  private handleError(error: unknown): Error {
    if (typeof error === 'object' && error !== null) {
      const err = error as { response?: { data?: { error?: string; message?: string } }; message?: string };
      if (err.response?.data?.error) {
        return new Error(err.response.data.error);
      }
      if (err.response?.data?.message) {
        return new Error(err.response.data.message);
      }
      if (err.message) {
        return new Error(err.message);
      }
    }
    return new Error('An unexpected error occurred');
  }
}

// Export singleton instance
export const groupService = new GroupService();

// Export individual methods for convenience
export const {
  getGroups,
  getGroup,
  createGroup,
  updateGroup,
  joinGroup,
  getGroupMembers,
  changeGroupMemberRole,
  removeGroupMember,
  getGroupDiscussions,
  createGroupDiscussion,
  searchGroups,
  isGroupAdmin,
  canModerateGroup,
  isMember,
  getGroupTypeDisplayName,
  getRoleDisplayName,
  formatMemberCount,
  formatDiscussionCount,
  isPrivateGroup,
  getTimeAgo
} = groupService;