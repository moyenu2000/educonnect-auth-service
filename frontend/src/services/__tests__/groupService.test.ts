import { groupService } from '../groupService';
import { GroupType, GroupRole } from '../../types/group';

// Mock the API
jest.mock('../api', () => ({
  discussionApi: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('GroupService', () => {
  const mockGroup = {
    id: 1,
    name: 'Test Group',
    description: 'Test Description',
    type: GroupType.STUDY,
    isPrivate: false,
    membersCount: 5,
    discussionsCount: 3,
    createdBy: {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      fullName: 'Test User',
      createdAt: '2024-01-01T00:00:00Z'
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    isJoined: true,
    userRole: GroupRole.ADMIN
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Utility Methods', () => {
    test('isGroupAdmin should return true for admin role', () => {
      expect(groupService.isGroupAdmin(mockGroup)).toBe(true);
    });

    test('canModerateGroup should return true for admin and moderator', () => {
      expect(groupService.canModerateGroup(mockGroup)).toBe(true);
      
      const moderatorGroup = { ...mockGroup, userRole: GroupRole.MODERATOR };
      expect(groupService.canModerateGroup(moderatorGroup)).toBe(true);
      
      const memberGroup = { ...mockGroup, userRole: GroupRole.MEMBER };
      expect(groupService.canModerateGroup(memberGroup)).toBe(false);
    });

    test('isMember should return correct membership status', () => {
      expect(groupService.isMember(mockGroup)).toBe(true);
      
      const notJoinedGroup = { ...mockGroup, isJoined: false };
      expect(groupService.isMember(notJoinedGroup)).toBe(false);
    });

    test('getGroupTypeDisplayName should return correct display names', () => {
      expect(groupService.getGroupTypeDisplayName('STUDY')).toBe('Study Group');
      expect(groupService.getGroupTypeDisplayName('SUBJECT')).toBe('Subject Group');
      expect(groupService.getGroupTypeDisplayName('CLASS')).toBe('Class Group');
      expect(groupService.getGroupTypeDisplayName('PROJECT')).toBe('Project Group');
      expect(groupService.getGroupTypeDisplayName('GENERAL')).toBe('General Group');
      expect(groupService.getGroupTypeDisplayName('UNKNOWN')).toBe('UNKNOWN');
    });

    test('getRoleDisplayName should return correct role names', () => {
      expect(groupService.getRoleDisplayName('ADMIN')).toBe('Administrator');
      expect(groupService.getRoleDisplayName('MODERATOR')).toBe('Moderator');
      expect(groupService.getRoleDisplayName('MEMBER')).toBe('Member');
      expect(groupService.getRoleDisplayName('UNKNOWN')).toBe('UNKNOWN');
    });

    test('formatMemberCount should format correctly', () => {
      expect(groupService.formatMemberCount(1)).toBe('1 member');
      expect(groupService.formatMemberCount(5)).toBe('5 members');
      expect(groupService.formatMemberCount(0)).toBe('0 members');
    });

    test('formatDiscussionCount should format correctly', () => {
      expect(groupService.formatDiscussionCount(0)).toBe('No discussions');
      expect(groupService.formatDiscussionCount(1)).toBe('1 discussion');
      expect(groupService.formatDiscussionCount(5)).toBe('5 discussions');
    });

    test('isPrivateGroup should return correct privacy status', () => {
      expect(groupService.isPrivateGroup(mockGroup)).toBe(false);
      
      const privateGroup = { ...mockGroup, isPrivate: true };
      expect(groupService.isPrivateGroup(privateGroup)).toBe(true);
    });

    test('getTimeAgo should return relative time', () => {
      const now = new Date();
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      expect(groupService.getTimeAgo(now.toISOString())).toBe('Today');
      expect(groupService.getTimeAgo(yesterday.toISOString())).toBe('Yesterday');
      expect(groupService.getTimeAgo(lastWeek.toISOString())).toContain('week');
    });
  });

  describe('API Method Structure', () => {
    test('should have all required API methods', () => {
      expect(typeof groupService.getGroups).toBe('function');
      expect(typeof groupService.getGroup).toBe('function');
      expect(typeof groupService.createGroup).toBe('function');
      expect(typeof groupService.updateGroup).toBe('function');
      expect(typeof groupService.joinGroup).toBe('function');
      expect(typeof groupService.getGroupMembers).toBe('function');
      expect(typeof groupService.changeGroupMemberRole).toBe('function');
      expect(typeof groupService.removeGroupMember).toBe('function');
      expect(typeof groupService.getGroupDiscussions).toBe('function');
      expect(typeof groupService.createGroupDiscussion).toBe('function');
      expect(typeof groupService.searchGroups).toBe('function');
    });
  });
});