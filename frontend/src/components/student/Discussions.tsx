import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { discussionService } from '@/services/discussionService'
import { assessmentService } from '@/services/assessmentService'
import { 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown, 
  Bookmark, 
  Eye, 
  Plus,
  Search,
  X
} from 'lucide-react'
import LaTeXText from '../ui/LaTeXText'
import { useToast } from '../../hooks/useToast'

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
  tags?: string[]
}

interface Subject {
  id: number
  name: string
}

interface CreateDiscussionForm {
  title: string
  content: string
  type: string
  subjectId: number | null
  classLevel: string
  tags: string[]
  isAnonymous: boolean
}

const Discussions: React.FC = () => {
  const [discussions, setDiscussions] = useState<Discussion[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<string>('')
  const [selectedSubject, setSelectedSubject] = useState<string>('')
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [createLoading, setCreateLoading] = useState(false)
  const [tagInput, setTagInput] = useState('')
  const { showToast } = useToast()
  
  const [formData, setFormData] = useState<CreateDiscussionForm>({
    title: '',
    content: '',
    type: 'QUESTION',
    subjectId: null,
    classLevel: '',
    tags: [],
    isAnonymous: false
  })

  const loadDiscussions = useCallback(async () => {
    try {
      const params: {
        page: number;
        size: number;
        sortBy: string;
        type?: string;
        subjectId?: number;
      } = {
        page: 0,
        size: 20,
        sortBy: 'NEWEST'
      }
      
      if (selectedType) params.type = selectedType
      if (selectedSubject) params.subjectId = parseInt(selectedSubject)

      console.log('Loading discussions with params:', params)
      
      // Try public endpoint first, then fallback to authenticated endpoint
      let response
      try {
        if (searchQuery.trim()) {
          // Use search endpoint if there's a search query
          const searchParams = {
            page: 0,
            size: 20,
            sortBy: 'NEWEST',
            q: searchQuery.trim(),
            subjectId: selectedSubject ? parseInt(selectedSubject) : undefined,
            type: selectedType || undefined
          }
          response = await discussionService.searchDiscussions(searchParams)
        } else {
          // Use regular listing endpoint
          response = await discussionService.getPublicDiscussions(params)
        }
        console.log('Public discussions response:', response)
      } catch (publicError) {
        console.log('Public endpoint failed, trying authenticated endpoint:', publicError)
        if (searchQuery.trim()) {
          const searchParams = {
            page: 0,
            size: 20,
            sortBy: 'NEWEST',
            q: searchQuery.trim(),
            subjectId: selectedSubject ? parseInt(selectedSubject) : undefined,
            type: selectedType || undefined
          }
          response = await discussionService.searchDiscussions(searchParams)
        } else {
          response = await discussionService.getDiscussions(params)
        }
        console.log('Authenticated discussions response:', response)
      }
      
      const discussions = response.data.data?.content || response.data.content || []
      console.log('Processed discussions:', discussions)
      setDiscussions(discussions)
      
    } catch (error) {
      console.error('Failed to load discussions:', error)
      setDiscussions([]) // Set empty array on error
    } finally {
      setLoading(false)
    }
  }, [selectedType, selectedSubject, searchQuery])

  const loadSubjects = useCallback(async () => {
    try {
      console.log('Loading subjects...')
      const response = await assessmentService.getPublicSubjects()
      console.log('Subjects response:', response)
      setSubjects(response.data.data || [])
    } catch (error) {
      console.error('Failed to load subjects:', error)
    }
  }, [])

  useEffect(() => {
    loadDiscussions()
    loadSubjects()
  }, [loadDiscussions, loadSubjects])

  const handleCreateDiscussion = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      showToast('Please fill in all required fields', 'error')
      return
    }

    try {
      setCreateLoading(true)
      
      const createData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        type: formData.type,
        subjectId: formData.subjectId || undefined,
        classLevel: formData.classLevel || undefined,
        tags: formData.tags.length > 0 ? formData.tags : undefined,
        isAnonymous: formData.isAnonymous
      }

      await discussionService.createDiscussion(createData)
      
      // Reset form
      setFormData({
        title: '',
        content: '',
        type: 'QUESTION',
        subjectId: null,
        classLevel: '',
        tags: [],
        isAnonymous: false
      })
      setTagInput('')
      setShowCreateDialog(false)
      
      // Reload discussions
      loadDiscussions()
      showToast('Discussion created successfully!', 'success')
      
    } catch (error) {
      console.error('Failed to create discussion:', error)
      showToast('Failed to create discussion. Please try again.', 'error')
    } finally {
      setCreateLoading(false)
    }
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

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
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              console.log('New Discussion button clicked')
              setShowCreateDialog(true)
            }}>
              <Plus className="mr-2 h-4 w-4" />
              New Discussion
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Discussion</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="text-sm text-gray-500">
                Debug: Dialog opened, subjects loaded: {subjects.length}
                <button 
                  onClick={() => {
                    console.log('Testing API call...')
                    loadDiscussions()
                  }}
                  className="ml-2 px-2 py-1 bg-blue-500 text-white rounded text-xs"
                >
                  Test API
                </button>
              </div>
              {/* Title */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Title *</label>
                <Input
                  placeholder="Enter discussion title..."
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              {/* Content */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Content *</label>
                <textarea
                  className="w-full p-3 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring min-h-[120px] resize-vertical"
                  placeholder="Describe your question or topic in detail..."
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                />
              </div>

              {/* Type and Subject */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Type</label>
                  <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="QUESTION">Question</SelectItem>
                      <SelectItem value="HELP">Help</SelectItem>
                      <SelectItem value="GENERAL">General</SelectItem>
                      <SelectItem value="ANNOUNCEMENT">Announcement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Subject</label>
                  <Select value={formData.subjectId?.toString() || ""} onValueChange={(value) => setFormData(prev => ({ ...prev, subjectId: value ? parseInt(value) : null }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No Subject</SelectItem>
                      {subjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id.toString()}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Class Level */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Class Level</label>
                <Select value={formData.classLevel} onValueChange={(value) => setFormData(prev => ({ ...prev, classLevel: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select class level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No Class Level</SelectItem>
                    <SelectItem value="CLASS_6">Class 6</SelectItem>
                    <SelectItem value="CLASS_7">Class 7</SelectItem>
                    <SelectItem value="CLASS_8">Class 8</SelectItem>
                    <SelectItem value="CLASS_9">Class 9</SelectItem>
                    <SelectItem value="CLASS_10">Class 10</SelectItem>
                    <SelectItem value="HSC_1">HSC 1st Year</SelectItem>
                    <SelectItem value="HSC_2">HSC 2nd Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Tags</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add tags..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <Button type="button" variant="outline" onClick={handleAddTag}>
                    Add
                  </Button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        #{tag}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => handleRemoveTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Anonymous option */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={formData.isAnonymous}
                  onChange={(e) => setFormData(prev => ({ ...prev, isAnonymous: e.target.checked }))}
                  className="rounded border-input"
                />
                <label htmlFor="anonymous" className="text-sm font-medium">
                  Post anonymously
                </label>
              </div>

              {/* Action buttons */}
              <div className="flex justify-end gap-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowCreateDialog(false)}
                  disabled={createLoading}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateDiscussion} disabled={createLoading}>
                  {createLoading ? 'Creating...' : 'Create Discussion'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
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
              <p className="text-muted-foreground">Be the first to start a discussion!</p>
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
                      <LaTeXText text={discussion.title} />
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
                  <LaTeXText text={discussion.content} />
                </p>

                {discussion.tags && discussion.tags.length > 0 && (
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