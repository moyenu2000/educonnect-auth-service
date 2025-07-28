import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { useToast } from '../../hooks/useToast';
import { type Group, groupService } from '../../services/groupService';
import { 
  Users, 
  MessageSquare, 
  Search, 
  Filter, 
  Plus, 
  BookOpen, 
  FolderOpen,
  Lock,
  Globe
} from 'lucide-react';

const GroupList: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'STUDY' | 'PROJECT'>('ALL');
  const [filterJoined, setFilterJoined] = useState<'ALL' | 'JOINED' | 'NOT_JOINED'>('ALL');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const { showToast } = useToast();

  const fetchGroups = async (page = 0, search = '') => {
    try {
      setLoading(true);
      let result;

      if (search.trim()) {
        setIsSearching(true);
        result = await groupService.searchGroups(search, {
          page,
          size: 12,
          ...(filterType !== 'ALL' && { type: filterType }),
        });
      } else {
        setIsSearching(false);
        result = await groupService.getGroups({
          page,
          size: 12,
          ...(filterType !== 'ALL' && { type: filterType }),
          ...(filterJoined === 'JOINED' && { joined: true }),
        });
      }

      setGroups(result.content);
      setTotalPages(result.totalPages);
      setCurrentPage(result.currentPage);
    } catch (error) {
      console.error('Error fetching groups:', error);
      showToast('Failed to load groups', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups(0, searchTerm);
  }, [filterType, filterJoined]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(0);
    fetchGroups(0, searchTerm);
  };

  const handleJoinToggle = async (groupId: number) => {
    try {
      const result = await groupService.toggleGroupMembership(groupId);
      showToast(result.message, 'success');
      // Refresh the current page
      fetchGroups(currentPage, searchTerm);
    } catch (error) {
      console.error('Error toggling group membership:', error);
      showToast('Failed to update group membership', 'error');
    }
  };

  const getGroupTypeIcon = (type: string) => {
    return type === 'STUDY' ? <BookOpen className="w-4 h-4" /> : <FolderOpen className="w-4 h-4" />;
  };

  const getGroupTypeBadge = (type: string) => {
    return (
      <Badge variant={type === 'STUDY' ? 'default' : 'secondary'} className="text-xs">
        {getGroupTypeIcon(type)}
        <span className="ml-1">{type}</span>
      </Badge>
    );
  };

  if (loading && groups.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Study Groups</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-3 bg-gray-300 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-2/3"></div>
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Study Groups</h1>
        <Link to="/student/groups/create">
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Group
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search groups..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </form>

            {/* Filters */}
            <div className="flex gap-2">
              <Select
                value={filterType}
                onValueChange={(value) => setFilterType(value as 'ALL' | 'STUDY' | 'PROJECT')}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Types</SelectItem>
                  <SelectItem value="STUDY">Study Groups</SelectItem>
                  <SelectItem value="PROJECT">Project Groups</SelectItem>
                </SelectContent>
              </Select>

              {!isSearching && (
                <Select
                  value={filterJoined}
                  onValueChange={(value) => setFilterJoined(value as 'ALL' | 'JOINED' | 'NOT_JOINED')}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select groups" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Groups</SelectItem>
                    <SelectItem value="JOINED">My Groups</SelectItem>
                    <SelectItem value="NOT_JOINED">Available</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Groups Grid */}
      {groups.length === 0 && !loading ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No groups found</h3>
            <p className="text-gray-500 text-center mb-4">
              {searchTerm ? 'Try adjusting your search terms.' : 'Create your first group to get started!'}
            </p>
            <Link to="/student/groups/create">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Group
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group) => (
              <Card key={group.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-2">{group.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        {getGroupTypeBadge(group.type)}
                        {group.isPrivate ? (
                          <Badge variant="outline" className="text-xs">
                            <Lock className="w-3 h-3 mr-1" />
                            Private
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            <Globe className="w-3 h-3 mr-1" />
                            Public
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                    {group.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{group.membersCount}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        <span>{group.discussionsCount}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 text-xs text-gray-400">
                    Created by {group.createdBy.fullName}
                  </div>
                </CardContent>

                <CardFooter className="flex gap-2">
                  <Link to={`/student/groups/${group.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      View Details
                    </Button>
                  </Link>
                  <Button
                    onClick={() => handleJoinToggle(group.id)}
                    className="flex-1"
                    variant="default"
                  >
                    Join
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <Button
                variant="outline"
                onClick={() => fetchGroups(currentPage - 1, searchTerm)}
                disabled={currentPage === 0 || loading}
              >
                Previous
              </Button>
              
              <span className="text-sm text-gray-600">
                Page {currentPage + 1} of {totalPages}
              </span>
              
              <Button
                variant="outline"
                onClick={() => fetchGroups(currentPage + 1, searchTerm)}
                disabled={currentPage >= totalPages - 1 || loading}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default GroupList;