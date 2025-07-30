import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../contexts/AuthContext';
import { discussionService } from '../../services/discussionService';
import { 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown,
  Eye, 
  ArrowLeft,
  Calendar,
  User,
  Bookmark,
  BookmarkCheck,
  Reply,
  Check
} from 'lucide-react';

interface Answer {
  id: number;
  content: string;
  author: {
    id: number;
    username: string;
    fullName: string;
    avatarUrl?: string;
  };
  discussionId: number;
  upvotesCount: number;
  downvotesCount: number;
  isAccepted: boolean;
  upvoted?: boolean;
  downvoted?: boolean;
  isAnonymous: boolean;
  createdAt: string;
  updatedAt?: string;
  attachments: string[];
}

interface Discussion {
  id: number;
  title: string;
  content: string;
  type: 'QUESTION' | 'HELP' | 'GENERAL' | 'ANNOUNCEMENT';
  author: {
    id: number;
    username: string;
    fullName: string;
    avatarUrl?: string;
  };
  upvotesCount: number;
  downvotesCount: number;
  answersCount: number;
  viewsCount: number;
  bookmarked: boolean;
  upvoted?: boolean;
  downvoted?: boolean;
  isAnonymous: boolean;
  createdAt: string;
  updatedAt?: string;
  tags: string[];
  attachments: string[];
  groupId?: number;
}

const DiscussionDetail: React.FC = () => {
  const { groupId, discussionId } = useParams<{ groupId: string; discussionId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  
  const [discussion, setDiscussion] = useState<Discussion | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [answersLoading, setAnswersLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [sortBy, setSortBy] = useState('NEWEST');
  
  // Reply state
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);

  const fetchDiscussion = useCallback(async () => {
    if (!discussionId) return;
    
    try {
      setLoading(true);
      const response = await discussionService.getDiscussion(parseInt(discussionId));
      const discussionData = response.data?.data || response.data || response;
      setDiscussion(discussionData);
    } catch (error: any) {
      console.error('Error fetching discussion:', error);
      showToast(error.response?.data?.error || 'Failed to load discussion', 'error');
      navigate(-1);
    } finally {
      setLoading(false);
    }
  }, [discussionId, showToast, navigate]);

  const fetchAnswers = useCallback(async (page = 0) => {
    if (!discussionId) return;
    
    try {
      setAnswersLoading(true);
      const response = await discussionService.getAnswers(parseInt(discussionId), {
        page,
        size: 20,
        sortBy
      });
      
      const answersData = response.data?.data || response.data || response;
      setAnswers(answersData.content || []);
      setTotalPages(answersData.totalPages || 0);
      setCurrentPage(answersData.currentPage || 0);
    } catch (error: any) {
      console.error('Error fetching answers:', error);
      showToast(error.response?.data?.error || 'Failed to load answers', 'error');
    } finally {
      setAnswersLoading(false);
    }
  }, [discussionId, sortBy, showToast]);

  useEffect(() => {
    fetchDiscussion();
  }, [fetchDiscussion]);

  useEffect(() => {
    if (discussion) {
      fetchAnswers(0);
    }
  }, [discussion, fetchAnswers]);

  // Vote and bookmark handlers for discussion
  const handleDiscussionUpvote = async () => {
    if (!discussion) return;
    try {
      await discussionService.upvoteDiscussion(discussion.id);
      showToast('Vote updated successfully!', 'success');
      fetchDiscussion(); // Reload discussion
    } catch (error: any) {
      console.error('Error upvoting discussion:', error);
      showToast(error.response?.data?.error || 'Failed to upvote discussion', 'error');
    }
  };

  const handleDiscussionDownvote = async () => {
    if (!discussion) return;
    try {
      await discussionService.downvoteDiscussion(discussion.id);
      showToast('Vote updated successfully!', 'success');
      fetchDiscussion(); // Reload discussion
    } catch (error: any) {
      console.error('Error downvoting discussion:', error);
      showToast(error.response?.data?.error || 'Failed to downvote discussion', 'error');
    }
  };

  const handleDiscussionBookmark = async () => {
    if (!discussion) return;
    try {
      await discussionService.bookmarkDiscussion(discussion.id);
      showToast('Bookmark updated successfully!', 'success');
      fetchDiscussion(); // Reload discussion
    } catch (error: any) {
      console.error('Error bookmarking discussion:', error);
      showToast(error.response?.data?.error || 'Failed to bookmark discussion', 'error');
    }
  };

  // Vote handlers for answers
  const handleAnswerUpvote = async (answerId: number) => {
    try {
      await discussionService.upvoteAnswer(answerId);
      showToast('Vote updated successfully!', 'success');
      fetchAnswers(currentPage); // Reload answers
    } catch (error: any) {
      console.error('Error upvoting answer:', error);
      showToast(error.response?.data?.error || 'Failed to upvote answer', 'error');
    }
  };

  const handleAnswerDownvote = async (answerId: number) => {
    try {
      await discussionService.downvoteAnswer(answerId);
      showToast('Vote updated successfully!', 'success');
      fetchAnswers(currentPage); // Reload answers
    } catch (error: any) {
      console.error('Error downvoting answer:', error);
      showToast(error.response?.data?.error || 'Failed to downvote answer', 'error');
    }
  };

  const handleAcceptAnswer = async (answerId: number) => {
    try {
      await discussionService.acceptAnswer(answerId);
      showToast('Answer accepted successfully!', 'success');
      fetchAnswers(currentPage); // Reload answers
      fetchDiscussion(); // Reload discussion to update hasAcceptedAnswer
    } catch (error: any) {
      console.error('Error accepting answer:', error);
      showToast(error.response?.data?.error || 'Failed to accept answer', 'error');
    }
  };

  // Reply handlers
  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!discussionId || !replyContent.trim()) {
      showToast('Please enter a reply', 'error');
      return;
    }

    try {
      setReplyLoading(true);
      await discussionService.createAnswer(parseInt(discussionId), {
        content: replyContent.trim(),
        isAnonymous
      });

      setReplyContent('');
      setIsAnonymous(false);
      setShowReplyForm(false);
      showToast('Reply posted successfully!', 'success');
      fetchAnswers(0); // Reload answers
      fetchDiscussion(); // Reload discussion to update answer count
    } catch (error: any) {
      console.error('Error posting reply:', error);
      showToast(error.response?.data?.error || 'Failed to post reply', 'error');
    } finally {
      setReplyLoading(false);
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" disabled>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Loading...</h1>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4 animate-pulse">
              <div className="h-6 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              <div className="h-20 bg-gray-300 rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!discussion) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link to={groupId ? `/student/groups/${groupId}/discussions` : '/student/discussions'}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Discussion not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to={groupId ? `/student/groups/${groupId}/discussions` : '/student/discussions'}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Discussions
          </Button>
        </Link>
      </div>

      {/* Discussion Card */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <Badge className={`text-sm ${getTypeColor(discussion.type)}`}>
                    {discussion.type}
                  </Badge>
                  {discussion.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                  {discussion.title}
                </h1>
                
                <div className="prose max-w-none text-gray-700 mb-4">
                  <p className="whitespace-pre-wrap">{discussion.content}</p>
                </div>
              </div>
            </div>

            {/* Meta Information */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>{discussion.isAnonymous ? 'Anonymous' : discussion.author.fullName}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{timeAgo(discussion.createdAt)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{discussion.viewsCount} views</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Voting buttons */}
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`p-2 h-auto ${discussion.upvoted ? 'text-green-600 bg-green-50' : 'text-gray-500 hover:text-green-600 hover:bg-green-50'}`}
                    onClick={handleDiscussionUpvote}
                  >
                    <ThumbsUp className="w-4 h-4" />
                  </Button>
                  <span className="text-sm font-medium mx-1">{discussion.upvotesCount}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`p-2 h-auto ${discussion.downvoted ? 'text-red-600 bg-red-50' : 'text-gray-500 hover:text-red-600 hover:bg-red-50'}`}
                    onClick={handleDiscussionDownvote}
                  >
                    <ThumbsDown className="w-4 h-4" />
                  </Button>
                  <span className="text-sm font-medium mx-1">{discussion.downvotesCount}</span>
                </div>

                {/* Bookmark button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className={`p-2 h-auto ${discussion.bookmarked ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'}`}
                  onClick={handleDiscussionBookmark}
                >
                  {discussion.bookmarked ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reply Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Answers ({discussion.answersCount})
            </CardTitle>
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="NEWEST">Newest</option>
                <option value="OLDEST">Oldest</option>
                <option value="MOST_UPVOTED">Most Upvoted</option>
              </select>
              <Button 
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="flex items-center gap-2"
              >
                <Reply className="w-4 h-4" />
                Reply
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Reply Form */}
          {showReplyForm && (
            <form onSubmit={handleSubmitReply} className="p-4 border rounded-lg bg-gray-50">
              <div className="space-y-3">
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write your answer..."
                  required
                  disabled={replyLoading}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="reply-anonymous"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      disabled={replyLoading}
                      className="mr-2"
                    />
                    <label htmlFor="reply-anonymous" className="text-sm text-gray-700">
                      Post anonymously
                    </label>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowReplyForm(false)}
                      disabled={replyLoading}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={replyLoading}>
                      {replyLoading ? 'Posting...' : 'Post Answer'}
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          )}

          {/* Answers List */}
          {answersLoading && answers.length === 0 ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="p-4 border rounded-lg">
                  <div className="space-y-2 animate-pulse">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : answers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>No answers yet. Be the first to answer!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {answers.map((answer) => (
                <div key={answer.id} className={`p-4 border rounded-lg ${answer.isAccepted ? 'border-green-500 bg-green-50' : ''}`}>
                  <div className="space-y-3">
                    {answer.isAccepted && (
                      <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                        <Check className="w-4 h-4" />
                        Accepted Answer
                      </div>
                    )}
                    
                    <div className="prose max-w-none text-gray-700">
                      <p className="whitespace-pre-wrap">{answer.content}</p>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{answer.isAnonymous ? 'Anonymous' : answer.author.fullName}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{timeAgo(answer.createdAt)}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {/* Accept answer button (only for discussion author) */}
                        {user?.id === discussion.author.id && discussion.type === 'QUESTION' && !answer.isAccepted && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAcceptAnswer(answer.id)}
                            className="text-green-600 border-green-600 hover:bg-green-50"
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Accept
                          </Button>
                        )}
                        
                        {/* Voting buttons */}
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`p-1 h-auto ${answer.upvoted ? 'text-green-600' : 'text-gray-500 hover:text-green-600'}`}
                            onClick={() => handleAnswerUpvote(answer.id)}
                          >
                            <ThumbsUp className="w-4 h-4" />
                          </Button>
                          <span className="text-sm font-medium mx-1">{answer.upvotesCount}</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`p-1 h-auto ${answer.downvoted ? 'text-red-600' : 'text-gray-500 hover:text-red-600'}`}
                            onClick={() => handleAnswerDownvote(answer.id)}
                          >
                            <ThumbsDown className="w-4 h-4" />
                          </Button>
                          <span className="text-sm font-medium mx-1">{answer.downvotesCount}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => fetchAnswers(currentPage - 1)}
                disabled={currentPage === 0 || answersLoading}
              >
                Previous
              </Button>
              
              <span className="text-sm text-gray-600">
                Page {currentPage + 1} of {totalPages}
              </span>
              
              <Button
                variant="outline"
                onClick={() => fetchAnswers(currentPage + 1)}
                disabled={currentPage >= totalPages - 1 || answersLoading}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DiscussionDetail;