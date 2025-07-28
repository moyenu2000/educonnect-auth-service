import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog } from '../ui/dialog';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../contexts/AuthContext';
import { type Group, type GroupMember, groupService } from '../../services/groupService';
import { 
  Users, 
  ArrowLeft,
  Crown,
  Shield,
  User,
  MoreVertical,
  UserMinus,
  Settings,
  AlertTriangle
} from 'lucide-react';

const GroupMembers: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  
  const [group, setGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'ADMIN' | 'MODERATOR' | 'MEMBER'>('ALL');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [userRole, setUserRole] = useState<'ADMIN' | 'MODERATOR' | 'MEMBER' | null>(null);
  const [selectedMember, setSelectedMember] = useState<GroupMember | null>(null);
  const [showRoleChangeDialog, setShowRoleChangeDialog] = useState(false);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [newRole, setNewRole] = useState<'ADMIN' | 'MODERATOR' | 'MEMBER'>('MEMBER');

  const fetchGroupDetails = useCallback(async () => {
    if (!groupId) return;
    
    try {
      const groupData = await groupService.getGroupById(parseInt(groupId));
      setGroup(groupData);
    } catch (error) {
      console.error('Error fetching group details:', error);
      showToast('Failed to load group details', 'error');
      navigate('/student/groups');
    }
  }, [groupId, showToast, navigate]);

  const fetchMembers = async (page = 0, role?: 'ADMIN' | 'MODERATOR' | 'MEMBER') => {
    if (!groupId) return;
    
    try {
      setLoading(true);
      const membersData = await groupService.getGroupMembers(parseInt(groupId), {
        page,
        size: 20,
        ...(role && { role })
      });
      
      setMembers(membersData.content);
      setTotalPages(membersData.totalPages);
      setCurrentPage(membersData.currentPage);
      
      // Find current user's role
      const currentUserMember = membersData.content.find(
        member => member.user.id === user?.id
      );
      setUserRole(currentUserMember?.role || null);
    } catch (error) {
      console.error('Error fetching members:', error);
      showToast('Failed to load group members', 'error');
      navigate(`/student/groups/${groupId}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroupDetails();
  }, [fetchGroupDetails]);

  useEffect(() => {
    if (group) {
      fetchMembers(0, roleFilter === 'ALL' ? undefined : roleFilter as 'ADMIN' | 'MODERATOR' | 'MEMBER');
    }
  }, [group, roleFilter]);

  const handleRoleChange = async () => {
    if (!selectedMember || !groupId) return;
    
    try {
      await groupService.changeGroupMemberRole(
        parseInt(groupId),
        selectedMember.user.id,
        newRole
      );
      
      showToast('Member role updated successfully', 'success');
      setShowRoleChangeDialog(false);
      setSelectedMember(null);
      
      // Refresh members list  
      fetchMembers(currentPage, roleFilter === 'ALL' ? undefined : roleFilter as 'ADMIN' | 'MODERATOR' | 'MEMBER');
    } catch (error: any) {
      console.error('Error changing member role:', error);
      showToast(error.message || 'Failed to change member role', 'error');
    }
  };

  const handleRemoveMember = async () => {
    if (!selectedMember || !groupId) return;
    
    try {
      await groupService.removeGroupMember(
        parseInt(groupId),
        selectedMember.user.id
      );
      
      showToast('Member removed successfully', 'success');
      setShowRemoveDialog(false);
      setSelectedMember(null);
      
      // Refresh members list and group details
      await fetchMembers(currentPage, roleFilter === 'ALL' ? undefined : roleFilter as 'ADMIN' | 'MODERATOR' | 'MEMBER');
      await fetchGroupDetails();
    } catch (error: any) {
      console.error('Error removing member:', error);
      showToast(error.message || 'Failed to remove member', 'error');
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'MODERATOR':
        return <Shield className="w-4 h-4 text-blue-500" />;
      default:
        return <User className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRoleBadge = (role: string) => {
    const colors = {
      ADMIN: 'bg-yellow-100 text-yellow-800',
      MODERATOR: 'bg-blue-100 text-blue-800',
      MEMBER: 'bg-gray-100 text-gray-800'
    };
    
    return (
      <Badge className={`text-xs ${colors[role as keyof typeof colors]}`}>
        {getRoleIcon(role)}
        <span className="ml-1 capitalize">{role.toLowerCase()}</span>
      </Badge>
    );
  };

  const canManageMember = (member: GroupMember) => {
    if (!userRole || userRole === 'MEMBER') return false;
    if (member.user.id === user?.id) return false; // Can't manage yourself
    if (userRole === 'MODERATOR' && member.role === 'ADMIN') return false;
    return true;
  };

  const openRoleChangeDialog = (member: GroupMember) => {
    setSelectedMember(member);
    setNewRole(member.role);
    setShowRoleChangeDialog(true);
  };

  const openRemoveDialog = (member: GroupMember) => {
    setSelectedMember(member);
    setShowRemoveDialog(true);
  };

  if (loading && members.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" disabled>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Group Members</h1>
        </div>
        
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4 animate-pulse">
                  <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/4"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate(`/student/groups/${groupId}`)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Group Members</h1>
            {group && (
              <p className="text-gray-600">{group.name}</p>
            )}
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-gray-500" />
                <span className="font-medium">{members.length} members</span>
              </div>
              
              <Select
                value={roleFilter}
                onValueChange={(value) => setRoleFilter(value as typeof roleFilter)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Roles</SelectItem>
                  <SelectItem value="ADMIN">Admins</SelectItem>
                  <SelectItem value="MODERATOR">Moderators</SelectItem>
                  <SelectItem value="MEMBER">Members</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Members List */}
      <div className="space-y-4">
        {members.map((member) => (
          <Card key={member.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-gray-600" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium text-gray-900">
                        {member.user.fullName}
                      </h3>
                      {getRoleBadge(member.role)}
                      {member.user.id === user?.id && (
                        <Badge variant="outline" className="text-xs">
                          You
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">@{member.user.username}</p>
                    <p className="text-xs text-gray-500">
                      Joined {new Date(member.joinedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {canManageMember(member) && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openRoleChangeDialog(member)}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Change Role
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openRemoveDialog(member)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <UserMinus className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <Button
            variant="outline"
            onClick={() => fetchMembers(currentPage - 1, roleFilter === 'ALL' ? undefined : roleFilter as 'ADMIN' | 'MODERATOR' | 'MEMBER')}
            disabled={currentPage === 0 || loading}
          >
            Previous
          </Button>
          
          <span className="text-sm text-gray-600">
            Page {currentPage + 1} of {totalPages}
          </span>
          
          <Button
            variant="outline"
            onClick={() => fetchMembers(currentPage + 1, roleFilter === 'ALL' ? undefined : roleFilter as 'ADMIN' | 'MODERATOR' | 'MEMBER')}
            disabled={currentPage >= totalPages - 1 || loading}
          >
            Next
          </Button>
        </div>
      )}

      {/* Role Change Dialog */}
      <Dialog open={showRoleChangeDialog} onOpenChange={setShowRoleChangeDialog}>
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Change Member Role</h3>
            
            {selectedMember && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  Changing role for <strong>{selectedMember.user.fullName}</strong>
                </p>
                
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as typeof newRole)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="MEMBER">Member</option>
                  <option value="MODERATOR">Moderator</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
            )}
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowRoleChangeDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleRoleChange}
                className="flex-1"
              >
                Change Role
              </Button>
            </div>
          </div>
        </div>
      </Dialog>

      {/* Remove Member Dialog */}
      <Dialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              <h3 className="text-lg font-semibold">Remove Member</h3>
            </div>
            
            {selectedMember && (
              <p className="text-gray-600 mb-4">
                Are you sure you want to remove <strong>{selectedMember.user.fullName}</strong> from this group? 
                This action cannot be undone.
              </p>
            )}
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowRemoveDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleRemoveMember}
                variant="destructive"
                className="flex-1"
              >
                Remove Member
              </Button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default GroupMembers;