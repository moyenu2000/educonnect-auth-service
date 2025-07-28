import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { discussionService, type User } from '@/services/discussionService'
import { Search, Plus, X, Loader2 } from 'lucide-react'

interface NewConversationProps {
  onConversationStart: (user: User) => void
  isOpen: boolean
  onClose: () => void
}

const NewConversation: React.FC<NewConversationProps> = ({
  onConversationStart,
  isOpen,
  onClose
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Focus input when opened
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isOpen])

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const searchUsers = useCallback(async () => {
    if (searchQuery.trim().length < 2) return

    try {
      setLoading(true)
      const response = await discussionService.searchUsers({
        q: searchQuery.trim(),
        page: 0,
        size: 10
      })
      
      const users = response.data?.data?.content || []
      setSearchResults(users)
      setShowResults(true)
    } catch (error) {
      console.error('Failed to search users:', error)
      setSearchResults([])
    } finally {
      setLoading(false)
    }
  }, [searchQuery])

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        searchUsers()
      } else {
        setSearchResults([])
        setShowResults(false)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery, searchUsers])

  const handleUserSelect = (user: User) => {
    onConversationStart(user)
    setSearchQuery('')
    setSearchResults([])
    setShowResults(false)
    onClose()
  }

  const handleClose = () => {
    setSearchQuery('')
    setSearchResults([])
    setShowResults(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="relative" ref={containerRef}>
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Plus className="w-4 h-4 text-blue-600" />
            <h3 className="font-medium text-blue-900">Start New Conversation</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="ml-auto h-6 w-6 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                ref={searchInputRef}
                type="text"
                placeholder="Search users by name or username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10"
              />
              {loading && (
                <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 animate-spin text-gray-400" />
              )}
            </div>

            {/* Search Results */}
            {showResults && (
              <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-64 overflow-y-auto">
                <CardContent className="p-0">
                  {searchResults.length > 0 ? (
                    <div className="divide-y">
                      {searchResults.map((user) => (
                        <div
                          key={user.id}
                          onClick={() => handleUserSelect(user)}
                          className="p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                              {user.avatarUrl ? (
                                <img
                                  src={user.avatarUrl}
                                  alt={user.fullName}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                              ) : (
                                <span className="text-gray-600 font-medium">
                                  {user.fullName?.charAt(0).toUpperCase() || 'U'}
                                </span>
                              )}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-gray-900 truncate">
                                {user.fullName || 'Unknown User'}
                              </div>
                              <div className="text-sm text-gray-500 truncate">
                                @{user.username}
                                {user.role && (
                                  <span className="ml-2 px-1.5 py-0.5 bg-gray-200 text-xs rounded">
                                    {user.role}
                                  </span>
                                )}
                              </div>
                              {user.bio && (
                                <div className="text-xs text-gray-400 truncate mt-1">
                                  {user.bio}
                                </div>
                              )}
                            </div>

                            <div className="text-xs text-gray-400">
                              Click to chat
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      {searchQuery.trim().length < 2 
                        ? 'Type at least 2 characters to search'
                        : 'No users found'
                      }
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          <div className="text-xs text-gray-600 mt-2">
            Search by name, username, or role to find users to message
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default NewConversation
