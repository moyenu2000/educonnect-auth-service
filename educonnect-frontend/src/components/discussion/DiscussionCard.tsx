import React from 'react';
import { 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown, 
  Eye, 
  CheckCircle,
  Bookmark,
  Calendar,
  Tag
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { type Discussion, DiscussionType } from '../../types/discussion';
import { Card, CardBody } from '../ui/Card';
import { Button } from '../ui/Button';

interface DiscussionCardProps {
  discussion: Discussion;
  onSelect: (discussion: Discussion) => void;
  onUpvote?: (discussionId: number) => void;
  onDownvote?: (discussionId: number) => void;
  onBookmark?: (discussionId: number) => void;
  compact?: boolean;
}

export const DiscussionCard: React.FC<DiscussionCardProps> = ({
  discussion,
  onSelect,
  onUpvote,
  onDownvote,
  onBookmark,
  compact = false
}) => {
  const getTypeColor = (type: DiscussionType) => {
    switch (type) {
      case 'QUESTION': return 'bg-blue-100 text-blue-800';
      case 'HELP': return 'bg-orange-100 text-orange-800';
      case 'GENERAL': return 'bg-gray-100 text-gray-800';
      case 'ANNOUNCEMENT': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: DiscussionType) => {
    switch (type) {
      case 'QUESTION': return '❓';
      case 'HELP': return '🙋';
      case 'GENERAL': return '💬';
      case 'ANNOUNCEMENT': return '📢';
      default: return '💬';
    }
  };

  const handleUpvote = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpvote?.(discussion.id);
  };

  const handleDownvote = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDownvote?.(discussion.id);
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    onBookmark?.(discussion.id);
  };

  return (
    <Card 
      className="hover:shadow-md transition-shadow duration-200 cursor-pointer"
      onClick={() => onSelect(discussion)}
    >
      <CardBody className={compact ? 'p-4' : 'p-6'}>
        <div className="flex items-start space-x-4">
          {/* Vote Section */}
          <div className="flex flex-col items-center space-y-1 min-w-[60px]">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleUpvote}
              className={`p-1 h-auto ${discussion.upvoted ? 'text-success-600' : 'text-secondary-600'}`}
            >
              <ThumbsUp className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium text-secondary-700">
              {discussion.upvotesCount - discussion.downvotesCount}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownvote}
              className={`p-1 h-auto ${discussion.downvoted ? 'text-error-600' : 'text-secondary-600'}`}
            >
              <ThumbsDown className="h-4 w-4" />
            </Button>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {/* Type Badge */}
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(discussion.type)}`}>
                    <span className="mr-1">{getTypeIcon(discussion.type)}</span>
                    {discussion.type}
                  </span>
                  {discussion.hasAcceptedAnswer && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success-100 text-success-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Solved
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-secondary-900 mb-2 line-clamp-2">
                  {discussion.title}
                </h3>

                {/* Content Preview */}
                {!compact && (
                  <p className="text-secondary-600 text-sm mb-3 line-clamp-2">
                    {discussion.content}
                  </p>
                )}

                {/* Tags */}
                {discussion.tags && discussion.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {discussion.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded text-xs bg-secondary-100 text-secondary-700"
                      >
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                    {discussion.tags.length > 3 && (
                      <span className="text-xs text-secondary-500">
                        +{discussion.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {/* Author and Time */}
                <div className="flex items-center text-sm text-secondary-500 space-x-4">
                  <div className="flex items-center">
                    {discussion.author.avatarUrl ? (
                      <img
                        src={discussion.author.avatarUrl}
                        alt={discussion.author.fullName}
                        className="h-5 w-5 rounded-full mr-2"
                      />
                    ) : (
                      <div className="h-5 w-5 rounded-full bg-primary-600 flex items-center justify-center mr-2">
                        <span className="text-white text-xs">
                          {discussion.author.fullName?.charAt(0) || discussion.author.username?.charAt(0)}
                        </span>
                      </div>
                    )}
                    <span>
                      {discussion.isAnonymous ? 'Anonymous' : (discussion.author.fullName || discussion.author.username)}
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{formatDistanceToNow(new Date(discussion.createdAt), { addSuffix: true })}</span>
                  </div>
                </div>
              </div>

              {/* Bookmark Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBookmark}
                className={`ml-2 ${discussion.bookmarked ? 'text-warning-600' : 'text-secondary-400'}`}
              >
                <Bookmark className="h-4 w-4" />
              </Button>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-secondary-200">
              <div className="flex items-center space-x-4 text-sm text-secondary-600">
                <div className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  <span>{discussion.answersCount} answers</span>
                </div>
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  <span>{discussion.viewsCount} views</span>
                </div>
              </div>

              {/* Activity Indicator */}
              <div className="text-xs text-secondary-500">
                Last activity: {formatDistanceToNow(new Date(discussion.updatedAt), { addSuffix: true })}
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};