import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Filter, Search, TrendingUp, MessageSquare, HelpCircle, Megaphone } from 'lucide-react';
import toast from 'react-hot-toast';

import { DiscussionCard } from '../../components/discussion/DiscussionCard';
import { Card, CardBody, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { discussionService } from '../../services/discussionService';
import { type Discussion, DiscussionType, SortBy } from '../../types/discussion';

export const DiscussionsPage: React.FC = () => {
  const [filters, setFilters] = useState({
    type: '' as DiscussionType | '',
    sortBy: 'NEWEST' as SortBy,
    search: ''
  });
  // Fetch discussions
  const { 
    data: discussionsData, 
    isLoading, 
    refetch 
  } = useQuery(
    ['discussions', filters],
    () => discussionService.getDiscussions({
      type: filters.type || undefined,
      sortBy: filters.sortBy,
      page: 0,
      size: 20
    }),
    {
      onError: (error) => {
        console.error('Failed to fetch discussions:', error);
        toast.error('Failed to load discussions');
      }
    }
  );

  const handleDiscussionSelect = (discussion: Discussion) => {
    // In a real app, you would navigate to the discussion detail page
    console.log('Selected discussion:', discussion);
  };

  const handleUpvote = async (discussionId: number) => {
    try {
      await discussionService.upvoteDiscussion(discussionId);
      refetch();
      toast.success('Vote recorded!');
    } catch (error) {
      console.error('Failed to upvote:', error);
      toast.error('Failed to record vote');
    }
  };

  const handleDownvote = async (discussionId: number) => {
    try {
      await discussionService.downvoteDiscussion(discussionId);
      refetch();
      toast.success('Vote recorded!');
    } catch (error) {
      console.error('Failed to downvote:', error);
      toast.error('Failed to record vote');
    }
  };

  const handleBookmark = async (discussionId: number) => {
    try {
      const result = await discussionService.bookmarkDiscussion(discussionId);
      refetch();
      toast.success(result.bookmarked ? 'Discussion bookmarked!' : 'Bookmark removed!');
    } catch (error) {
      console.error('Failed to bookmark:', error);
      toast.error('Failed to bookmark discussion');
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const getTypeStats = () => {
    const discussions = discussionsData?.data || [];
    return {
      total: discussions.length,
      questions: discussions.filter(d => d.type === 'QUESTION').length,
      help: discussions.filter(d => d.type === 'HELP').length,
      general: discussions.filter(d => d.type === 'GENERAL').length,
      announcements: discussions.filter(d => d.type === 'ANNOUNCEMENT').length,
    };
  };

  const stats = getTypeStats();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900">Discussions</h1>
            <p className="text-secondary-600 mt-2">
              Join the conversation, ask questions, and help others learn
            </p>
          </div>
          
          <Button leftIcon={Plus}>
            New Discussion
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardBody className="flex items-center p-4">
            <MessageSquare className="h-8 w-8 text-primary-600 mr-3" />
            <div>
              <p className="text-sm text-secondary-600">Total</p>
              <p className="text-xl font-bold text-secondary-900">{stats.total}</p>
            </div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="flex items-center p-4">
            <HelpCircle className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-secondary-600">Questions</p>
              <p className="text-xl font-bold text-secondary-900">{stats.questions}</p>
            </div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="flex items-center p-4">
            <TrendingUp className="h-8 w-8 text-orange-600 mr-3" />
            <div>
              <p className="text-sm text-secondary-600">Help Requests</p>
              <p className="text-xl font-bold text-secondary-900">{stats.help}</p>
            </div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="flex items-center p-4">
            <Megaphone className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm text-secondary-600">Announcements</p>
              <p className="text-xl font-bold text-secondary-900">{stats.announcements}</p>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Discussion Type
              </label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="form-select"
              >
                <option value="">All Types</option>
                <option value="QUESTION">Questions</option>
                <option value="HELP">Help Requests</option>
                <option value="GENERAL">General</option>
                <option value="ANNOUNCEMENT">Announcements</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="form-select"
              >
                <option value="NEWEST">Newest</option>
                <option value="OLDEST">Oldest</option>
                <option value="MOST_UPVOTED">Most Upvoted</option>
                <option value="MOST_ANSWERED">Most Answered</option>
                <option value="MOST_VIEWED">Most Viewed</option>
              </select>
            </div>
            
            <Input
              label="Search"
              type="text"
              leftIcon={Search}
              placeholder="Search discussions..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>
        </CardBody>
      </Card>

      {/* Discussions List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-secondary-200 rounded-lg h-32"></div>
            </div>
          ))}
        </div>
      ) : discussionsData?.data && discussionsData.data.length > 0 ? (
        <div className="space-y-4">
          {discussionsData.data.map((discussion) => (
            <DiscussionCard
              key={discussion.id}
              discussion={discussion}
              onSelect={handleDiscussionSelect}
              onUpvote={handleUpvote}
              onDownvote={handleDownvote}
              onBookmark={handleBookmark}
            />
          ))}
          
          {/* Load More Button */}
          {discussionsData.data.length < (discussionsData.totalElements || 0) && (
            <div className="flex justify-center mt-8">
              <Button variant="outline">
                Load More Discussions
              </Button>
            </div>
          )}
        </div>
      ) : (
        <Card>
          <CardBody className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-secondary-900 mb-2">
              No discussions found
            </h3>
            <p className="text-secondary-600 mb-6">
              {filters.search || filters.type 
                ? 'Try adjusting your filters to see more discussions.'
                : 'Be the first to start a discussion!'
              }
            </p>
            <Button leftIcon={Plus}>
              Start a Discussion
            </Button>
          </CardBody>
        </Card>
      )}
    </div>
  );
};