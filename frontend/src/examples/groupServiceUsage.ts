/**
 * Example usage of the Group Service
 * This file demonstrates how to use the comprehensive group service
 */

import { groupService } from '../services/groupService';
import { GroupType, GroupRole } from '../types/group';

// Example: Creating a new study group
export const createStudyGroup = async () => {
  try {
    const groupData = {
      name: 'Advanced Mathematics Study Group',
      description: 'A group for students studying advanced mathematics topics',
      type: GroupType.STUDY,
      isPrivate: false,
      rules: 'Be respectful and help each other learn',
      subjectId: 1
    };

    const response = await groupService.createGroup(groupData);
    if (response.success && response.data) {
      console.log('Group created successfully:', response.data);
      return response.data;
    }
  } catch (error) {
    console.error('Failed to create group:', error);
  }
};

// Example: Getting all groups with filtering
export const getStudyGroups = async () => {
  try {
    const filters = {
      page: 0,
      size: 20,
      type: GroupType.STUDY,
      joined: false // Get groups I haven't joined yet
    };

    const response = await groupService.getGroups(filters);
    if (response.success && response.data) {
      console.log('Available study groups:', response.data.content);
      return response.data;
    }
  } catch (error) {
    console.error('Failed to fetch groups:', error);
  }
};

// Example: Joining a group
export const joinGroup = async (groupId: number) => {
  try {
    const response = await groupService.joinGroup(groupId);
    if (response.success && response.data) {
      console.log('Group membership status:', response.data);
      return response.data;
    }
  } catch (error) {
    console.error('Failed to join group:', error);
  }
};

// Example: Getting group members with admin privileges check
export const manageGroupMembers = async (groupId: number) => {
  try {
    // First get the group to check if we're admin
    const groupResponse = await groupService.getGroup(groupId);
    if (!groupResponse.success || !groupResponse.data) {
      throw new Error('Failed to fetch group details');
    }

    const group = groupResponse.data;
    
    // Check if user can manage members
    if (!groupService.canModerateGroup(group)) {
      console.log('You do not have permission to manage members');
      return;
    }

    // Get all members
    const membersResponse = await groupService.getGroupMembers(groupId, {
      page: 0,
      size: 50
    });

    if (membersResponse.success && membersResponse.data) {
      console.log('Group members:', membersResponse.data.content);
      
      // Example utility usage
      console.log(`Group has ${groupService.formatMemberCount(group.membersCount)}`);
      console.log(`Created ${groupService.getTimeAgo(group.createdAt)}`);
      
      return membersResponse.data;
    }
  } catch (error) {
    console.error('Failed to manage group members:', error);
  }
};

// Example: Creating a group discussion
export const createGroupDiscussion = async (groupId: number) => {
  try {
    const discussionData = {
      title: 'Weekly Study Session Planning',
      content: 'Let\'s discuss our study schedule for this week',
      type: 'GENERAL' as const,
      tags: ['study-planning', 'schedule'],
      isAnonymous: false
    };

    const response = await groupService.createGroupDiscussion(groupId, discussionData);
    if (response.success && response.data) {
      console.log('Discussion created:', response.data);
      return response.data;
    }
  } catch (error) {
    console.error('Failed to create discussion:', error);
  }
};

// Example: Searching for groups
export const searchMathGroups = async () => {
  try {
    const searchParams = {
      q: 'mathematics',
      page: 0,
      size: 10,
      type: GroupType.STUDY
    };

    const response = await groupService.searchGroups(searchParams);
    if (response.success && response.data) {
      console.log('Math groups found:', response.data.content);
      
      // Using utility methods to display group info
      response.data.content.forEach(group => {
        console.log(`${group.name} - ${groupService.getGroupTypeDisplayName(group.type)}`);
        console.log(`Privacy: ${groupService.isPrivateGroup(group) ? 'Private' : 'Public'}`);
        console.log(`Members: ${groupService.formatMemberCount(group.membersCount)}`);
        console.log(`Discussions: ${groupService.formatDiscussionCount(group.discussionsCount)}`);
      });
      
      return response.data;
    }
  } catch (error) {
    console.error('Failed to search groups:', error);
  }
};

// Example: Updating group settings (admin only)
export const updateGroupSettings = async (groupId: number) => {
  try {
    // First check if user is admin
    const groupResponse = await groupService.getGroup(groupId);
    if (!groupResponse.success || !groupResponse.data) {
      throw new Error('Failed to fetch group details');
    }

    if (!groupService.isGroupAdmin(groupResponse.data)) {
      console.log('Only group admins can update settings');
      return;
    }

    const updateData = {
      description: 'Updated description with new study focus',
      rules: 'Updated rules: Be respectful, participate actively, and help others',
      isPrivate: true
    };

    const response = await groupService.updateGroup(groupId, updateData);
    if (response.success && response.data) {
      console.log('Group updated successfully:', response.data);
      return response.data;
    }
  } catch (error) {
    console.error('Failed to update group:', error);
  }
};

// Example: Managing member roles (admin/moderator only)
export const promoteToModerator = async (groupId: number, userId: number) => {
  try {
    const response = await groupService.changeGroupMemberRole(groupId, userId, {
      role: GroupRole.MODERATOR
    });

    if (response.success) {
      console.log('Member promoted to moderator successfully');
      return response;
    }
  } catch (error) {
    console.error('Failed to promote member:', error);
  }
};

// Example: Get group discussions with sorting
export const getRecentGroupDiscussions = async (groupId: number) => {
  try {
    const response = await groupService.getGroupDiscussions(groupId, {
      page: 0,
      size: 10,
      sortBy: 'NEWEST'
    });

    if (response.success && response.data) {
      console.log('Recent discussions:', response.data.content);
      return response.data;
    }
  } catch (error) {
    console.error('Failed to fetch discussions:', error);
  }
};