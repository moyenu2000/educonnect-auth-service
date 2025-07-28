import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../contexts/AuthContext';
import { type Group, groupService } from '../../services/groupService';
import { discussionService } from '../../services/discussionService';
import { 
  MessageSquare, 
  ThumbsUp, 
  Eye, 
  Plus,
  Search,
  ArrowLeft,
  Calendar,
  User,
  Filter,
  X
} from 'lucide-react';

interface Discussion {
  id: number;
  title: string;
  content: string;
  type: 'QUESTION' | 'HELP' | 'GENERAL' | 'ANNOUNCEMENT';
  authorId: number;
  authorName: string;
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

interface DiscussionsResponse {
  content: Discussion[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

const GroupDiscussions: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  
  const [group, setGroup] = useState<Group | null>(null);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [sortBy, setSortBy] = useState('NEWEST');
  
  // Modal state for creating discussion
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'GENERAL' as 'QUESTION' | 'HELP' | 'GENERAL' | 'ANNOUNCEMENT',
    tags: '',
    isAnonymous: false
  });

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

  const loadDiscussions = useCallback(async (page = 0) => {
    if (!groupId) return;
    
    try {
      setLoading(true);
      const params = {
        page,
        size: 20,
        sortBy,
        ...(selectedType && { type: selectedType }),
        ...(searchQuery && { search: searchQuery })
      };
      
      const response = await discussionService.getGroupDiscussions(parseInt(groupId), params);
      
      // Handle the response structure - it might be wrapped in success/data
      const discussionsData: DiscussionsResponse = response.data?.data || response.data || response;
      
      setDiscussions(discussionsData.content || []);
      setTotalPages(discussionsData.totalPages || 0);
      setCurrentPage(discussionsData.currentPage || 0);
    } catch (error: any) {
      console.error('Error loading discussions:', error);
      showToast(error.response?.data?.error || 'Failed to load discussions', 'error');
    } finally {
      setLoading(false);
    }
  }, [groupId, sortBy, selectedType, searchQuery, showToast]);

  useEffect(() => {
    fetchGroupDetails();
  }, [fetchGroupDetails]);

  useEffect(() => {
    if (group) {
      loadDiscussions(0);
    }
  }, [group, loadDiscussions]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(0);
    loadDiscussions(0);
  };

  const handleCreateDiscussion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupId || !formData.title.trim() || !formData.content.trim()) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    try {
      setCreateLoading(true);
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      await discussionService.createGroupDiscussion(parseInt(groupId), {
        title: formData.title.trim(),
        content: formData.content.trim(),
        type: formData.type,
        tags: tagsArray,
        isAnonymous: formData.isAnonymous
      });

      setShowCreateModal(false);
      setFormData({
        title: '',
        content: '',
        type: 'GENERAL',
        tags: '',
        isAnonymous: false
      });
      showToast('Discussion created successfully!', 'success');
      loadDiscussions(0); // Reload discussions
    } catch (error: any) {
      console.error('Error creating discussion:', error);
      showToast(error.response?.data?.error || 'Failed to create discussion', 'error');
    } finally {
      setCreateLoading(false);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'QUESTION':
        return 'bg-blue-100 text-blue-800';
      case 'HELP':
        return 'bg-orange-100 text-orange-800'; 
      case 'GENERAL':
        return 'bg-green-100 text-green-800';
      case 'ANNOUNCEMENT':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  if (loading && discussions.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" disabled>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Group Discussions</h1>
        </div>
        
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="space-y-2 animate-pulse">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-300 rounded w-2/3"></div>
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
          <Link to={`/student/groups/${groupId}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Group
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Group Discussions</h1>
            {group && (
              <p className="text-gray-600">{group.name}</p>
            )}
          </div>
        </div>
        
        <Button className="flex items-center gap-2" onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4" />
          New Discussion
        </Button>
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
                  placeholder="Search discussions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </form>

            {/* Filters */}
            <div className="flex gap-2">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                <option value="QUESTION">Questions</option>
                <option value="HELP">Help</option>
                <option value="GENERAL">General</option>
                <option value="ANNOUNCEMENT">Announcements</option>
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="NEWEST">Newest</option>
                <option value="OLDEST">Oldest</option>
                <option value="MOST_VOTED">Most Voted</option>
                <option value="MOST_ANSWERED">Most Answered</option>
                <option value="MOST_VIEWED">Most Viewed</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Discussions List */}
      {discussions.length === 0 && !loading ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageSquare className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No discussions yet</h3>
            <p className="text-gray-500 text-center mb-4">
              {searchQuery ? 'No discussions match your search.' : 'Start the conversation by creating the first discussion!'}
            </p>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Discussion
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-4">
            {discussions.map((discussion) => (
              <Card key={discussion.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={`text-xs ${getTypeColor(discussion.type)}`}>
                            {discussion.type}
                          </Badge>
                          {discussion.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <h3 className="text-lg font-medium text-gray-900 hover:text-blue-600 cursor-pointer line-clamp-2">
                          {discussion.title}
                        </h3>
                        
                        <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                          {discussion.content}
                        </p>
                      </div>
                    </div>

                    {/* Meta Information */}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{discussion.isAnonymous ? 'Anonymous' : discussion.authorName}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{timeAgo(discussion.createdAt)}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="w-4 h-4" />
                          <span>{discussion.voteCount}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4" />
                          <span>{discussion.answerCount}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{discussion.viewCount}</span>
                        </div>
                      </div>
                    </div>
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
                onClick={() => loadDiscussions(currentPage - 1)}
                disabled={currentPage === 0 || loading}
              >
                Previous
              </Button>
              
              <span className="text-sm text-gray-600">
                Page {currentPage + 1} of {totalPages}
              </span>
              
              <Button
                variant="outline"
                onClick={() => loadDiscussions(currentPage + 1)}
                disabled={currentPage >= totalPages - 1 || loading}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      {/* Create Discussion Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Create New Discussion</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCreateModal(false)}
                disabled={createLoading}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <form onSubmit={handleCreateDiscussion} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter discussion title..."
                  required
                  disabled={createLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content *
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Share your thoughts..."
                  required
                  disabled={createLoading}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  disabled={createLoading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="GENERAL">General</option>
                  <option value="QUESTION">Question</option>
                  <option value="HELP">Help</option>
                  <option value="ANNOUNCEMENT">Announcement</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (comma-separated)
                </label>
                <Input
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="e.g. math, homework, study-group"
                  disabled={createLoading}
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={formData.isAnonymous}
                  onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
                  disabled={createLoading}
                  className="mr-2"
                />
                <label htmlFor="anonymous" className="text-sm text-gray-700">
                  Post anonymously
                </label>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                  disabled={createLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createLoading}>
                  {createLoading ? 'Creating...' : 'Create Discussion'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupDiscussions;