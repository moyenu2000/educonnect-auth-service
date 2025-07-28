import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../contexts/AuthContext';
import { type Group, type GroupMember, groupService } from '../../services/groupService';
import { 
  Users, 
  MessageSquare, 
  Calendar,
  BookOpen, 
  FolderOpen,
  Lock,
  Globe,
  Edit,
  UserPlus,
  Settings,
  ArrowLeft,
  Crown,
  Shield,
  User
} from 'lucide-react';

const GroupDetails: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  
  const [group, setGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [memberLoading, setMemberLoading] = useState(true);
  const [isJoined, setIsJoined] = useState(false);
  const [userRole, setUserRole] = useState<'ADMIN' | 'MODERATOR' | 'MEMBER' | null>(null);

  const fetchGroupDetails = useCallback(async () => {
    if (!groupId) return;
    
    try {
      setLoading(true);
      const groupData = await groupService.getGroupById(parseInt(groupId));
      setGroup(groupData);
    } catch (error) {
      console.error('Error fetching group details:', error);
      showToast('Failed to load group details', 'error');
      navigate('/student/groups');
    } finally {
      setLoading(false);
    }
  }, [groupId, showToast, navigate]);

  const fetchGroupMembers = useCallback(async () => {
    if (!groupId) return;
    
    try {
      setMemberLoading(true);
      const membersData = await groupService.getGroupMembers(parseInt(groupId), {
        size: 50 // Get first 50 members
      });
      setMembers(membersData.content);
      
      // Check if current user is a member and get their role
      const currentUserMember = membersData.content.find(
        member => member.user.id === user?.id
      );
      setIsJoined(!!currentUserMember);
      setUserRole(currentUserMember?.role || null);
    } catch (error) {
      // If user is not a member, they can't see members list
      console.log('Cannot access members list - user not a member');
      setIsJoined(false);
      setUserRole(null);
      setMembers([]);
    } finally {
      setMemberLoading(false);
    }
  }, [groupId, user?.id]);

  useEffect(() => {
    fetchGroupDetails();
  }, [groupId, fetchGroupDetails]);

  useEffect(() => {
    if (group) {
      fetchGroupMembers();
    }
  }, [group, fetchGroupMembers]);

  const handleJoinToggle = async () => {
    if (!group) return;
    
    try {
      const result = await groupService.toggleGroupMembership(group.id);
      showToast(result.message, 'success');
      
      // Refresh group and member data
      await fetchGroupDetails();
      await fetchGroupMembers();
    } catch (error) {
      console.error('Error toggling group membership:', error);
      showToast('Failed to update group membership', 'error');
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

  const canManageGroup = userRole === 'ADMIN' || userRole === 'MODERATOR';

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-300 rounded w-1/3"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-full"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardHeader>
                <div className="h-5 bg-gray-300 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-full"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">Group not found</h2>
        <p className="text-gray-600 mt-2">The group you're looking for doesn't exist.</p>
        <Link to="/student/groups" className="mt-4 inline-block">
          <Button>Back to Groups</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/student/groups">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Group Details</h1>
        </div>
        
        {canManageGroup && (
          <div className="flex gap-2">
            <Link to={`/student/groups/${group.id}/edit`}>
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </Link>
            <Link to={`/student/groups/${group.id}/manage`}>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Manage
              </Button>
            </Link>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Group Info */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{group.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={group.type === 'STUDY' ? 'default' : 'secondary'}>
                      {group.type === 'STUDY' ? (
                        <BookOpen className="w-4 h-4 mr-1" />
                      ) : (
                        <FolderOpen className="w-4 h-4 mr-1" />
                      )}
                      {group.type}
                    </Badge>
                    
                    {group.isPrivate ? (
                      <Badge variant="outline">
                        <Lock className="w-4 h-4 mr-1" />
                        Private
                      </Badge>
                    ) : (
                      <Badge variant="outline">
                        <Globe className="w-4 h-4 mr-1" />
                        Public
                      </Badge>
                    )}
                    
                    {isJoined && userRole && getRoleBadge(userRole)}
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600">{group.description}</p>
                </div>
                
                {group.rules && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Group Rules</h3>
                    <p className="text-gray-600 text-sm">{group.rules}</p>
                  </div>
                )}
                
                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{group.membersCount} members</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    <span>{group.discussionsCount} discussions</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Created {new Date(group.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="text-sm text-gray-500">
                  Created by <span className="font-medium">{group.createdBy.fullName}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-3">
                {!isJoined ? (
                  <Button onClick={handleJoinToggle} className="flex-1">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Join Group
                  </Button>
                ) : (
                  <Button onClick={handleJoinToggle} variant="outline" className="flex-1">
                    Leave Group
                  </Button>
                )}
                
                {isJoined && (
                  <Link to={`/student/groups/${group.id}/discussions`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      View Discussions
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Members */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Members ({group.membersCount})</CardTitle>
            </CardHeader>
            <CardContent>
              {memberLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3 animate-pulse">
                      <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-300 rounded w-1/2 mt-1"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : members.length > 0 ? (
                <>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {members.slice(0, 10).map((member) => (
                      <div key={member.id} className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">
                            {member.user.fullName}
                          </div>
                          <div className="flex items-center gap-2">
                            {getRoleBadge(member.role)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {members.length > 10 && (
                    <Link to={`/student/groups/${group.id}/members`} className="block mt-3">
                      <Button variant="outline" size="sm" className="w-full">
                        View All Members
                      </Button>
                    </Link>
                  )}
                </>
              ) : isJoined ? (
                <p className="text-gray-500 text-sm">No members found.</p>
              ) : (
                <p className="text-gray-500 text-sm">
                  Join the group to see members.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Members</span>
                  <span className="font-medium">{group.membersCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Discussions</span>
                  <span className="font-medium">{group.discussionsCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Type</span>
                  <span className="font-medium">{group.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Privacy</span>
                  <span className="font-medium">{group.isPrivate ? 'Private' : 'Public'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GroupDetails;