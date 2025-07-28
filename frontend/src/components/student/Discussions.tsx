import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { discussionService } from '@/services/discussionService'
import { 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown, 
  Bookmark, 
  Eye, 
  Plus,
  Search
} from 'lucide-react'

interface Discussion {
  id: number
  title: string
  content: string
  type: string
  authorName: string
  subjectName?: string
  topicName?: string
  classLevel?: string
  voteCount: number
  answerCount: number
  viewCount: number
  isBookmarked: boolean
  hasUpvoted: boolean
  hasDownvoted: boolean
  createdAt: string
  tags: string[]
}

const Discussions: React.FC = () => {
  const [discussions, setDiscussions] = useState<Discussion[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<string>('')
  const [selectedSubject, setSelectedSubject] = useState<string>('')

  const loadDiscussions = useCallback(async () => {
    try {
      const params: {
        page: number;
        size: number;
        sortBy: string;
        type?: string;
        subjectId?: string;
        search?: string;
      } = {
        page: 0,
        size: 20,
        sortBy: 'NEWEST'
      }
      
      if (selectedType) params.type = selectedType
      if (selectedSubject) params.subjectId = selectedSubject
      if (searchQuery.trim()) params.search = searchQuery.trim()

      const response = await discussionService.getDiscussions(params)
      setDiscussions(response.data.data?.content || [])
    } catch (error) {
      console.error('Failed to load discussions:', error)
    } finally {
      setLoading(false)
    }
  }, [selectedType, selectedSubject, searchQuery])

  useEffect(() => {
    loadDiscussions()
  }, [loadDiscussions])

  const handleVote = async (discussionId: number, type: 'up' | 'down') => {
    try {
      if (type === 'up') {
        await discussionService.upvoteDiscussion(discussionId)
      } else {
        await discussionService.downvoteDiscussion(discussionId)
      }
      
      // Update local state
      setDiscussions(prev => prev.map(discussion => 
        discussion.id === discussionId 
          ? { 
              ...discussion, 
              hasUpvoted: type === 'up' ? !discussion.hasUpvoted : false,
              hasDownvoted: type === 'down' ? !discussion.hasDownvoted : false,
              voteCount: discussion.voteCount + (type === 'up' ? 1 : -1)
            }
          : discussion
      ))
    } catch (error) {
      console.error('Failed to vote:', error)
    }
  }

  const handleBookmark = async (discussionId: number) => {
    try {
      await discussionService.bookmarkDiscussion(discussionId)
      
      setDiscussions(prev => prev.map(discussion => 
        discussion.id === discussionId 
          ? { ...discussion, isBookmarked: !discussion.isBookmarked }
          : discussion
      ))
    } catch (error) {
      console.error('Failed to bookmark:', error)
    }
  }

  const getTypeColor = (type: string) => {
    switch (type.toUpperCase()) {
      case 'QUESTION':
        return 'bg-blue-100 text-blue-800'
      case 'HELP':
        return 'bg-orange-100 text-orange-800'
      case 'GENERAL':
        return 'bg-gray-100 text-gray-800'
      case 'ANNOUNCEMENT':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Discussions</h1>
          <p className="text-muted-foreground">
            Join conversations and get help from the community
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Discussion
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search discussions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">All Types</option>
              <option value="QUESTION">Questions</option>
              <option value="HELP">Help</option>
              <option value="GENERAL">General</option>
              <option value="ANNOUNCEMENT">Announcements</option>
            </select>

            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">All Subjects</option>
              <option value="1">Mathematics</option>
              <option value="2">Physics</option>
              <option value="3">Chemistry</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Discussions List */}
      <div className="space-y-4">
        {discussions.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No discussions found</h3>
              <p className="text-muted-foreground mb-4">Be the first to start a discussion!</p>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Discussion
              </Button>
            </CardContent>
          </Card>
        ) : (
          discussions.map((discussion) => (
            <Card key={discussion.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getTypeColor(discussion.type)}>
                        {discussion.type}
                      </Badge>
                      {discussion.subjectName && (
                        <Badge variant="outline">{discussion.subjectName}</Badge>
                      )}
                      {discussion.classLevel && (
                        <Badge variant="outline">{discussion.classLevel}</Badge>
                      )}
                    </div>
                    
                    <CardTitle className="text-xl mb-2 hover:text-primary cursor-pointer">
                      {discussion.title}
                    </CardTitle>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>by {discussion.authorName}</span>
                      <span>{new Date(discussion.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-muted-foreground mb-4 line-clamp-2">
                  {discussion.content}
                </p>

                {discussion.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {discussion.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>{discussion.answerCount} answers</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{discussion.viewCount} views</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant={discussion.hasUpvoted ? "default" : "ghost"}
                      size="sm"
                      onClick={() => handleVote(discussion.id, 'up')}
                      className="flex items-center gap-1"
                    >
                      <ThumbsUp className="h-4 w-4" />
                      <span>{discussion.voteCount}</span>
                    </Button>
                    
                    <Button
                      variant={discussion.hasDownvoted ? "default" : "ghost"}
                      size="sm"
                      onClick={() => handleVote(discussion.id, 'down')}
                    >
                      <ThumbsDown className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant={discussion.isBookmarked ? "default" : "ghost"}
                      size="sm"
                      onClick={() => handleBookmark(discussion.id)}
                    >
                      <Bookmark className={`h-4 w-4 ${discussion.isBookmarked ? 'fill-current' : ''}`} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Load More */}
      {discussions.length > 0 && (
        <div className="text-center">
          <Button variant="outline">
            Load More Discussions
          </Button>
        </div>
      )}
    </div>
  )
}

export default Discussions