import React from 'react'
import { Badge } from '@/components/ui/badge'
import { type Conversation } from '@/services/discussionService'

interface ConversationListProps {
  conversations: Conversation[]
  selectedConversation: Conversation | null
  onSelect: (conversation: Conversation) => void
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedConversation,
  onSelect
}) => {
  const getCurrentUserId = () => {
    try {
      const userStr = localStorage.getItem('user')
      if (userStr) {
        const user = JSON.parse(userStr)
        return user.id
      }
    } catch (error) {
      console.error('Failed to get current user ID:', error)
    }
    return null
  }

  const getOtherParticipant = (conversation: Conversation) => {
    const currentUserId = getCurrentUserId()
    return conversation.participants.find(p => p.id !== currentUserId)
  }

  const formatTime = (timeString: string) => {
    try {
      const date = new Date(timeString)
      const now = new Date()
      const diffMs = now.getTime() - date.getTime()
      const diffMins = Math.floor(diffMs / (1000 * 60))
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

      if (diffMins < 1) return 'just now'
      if (diffMins < 60) return `${diffMins}m ago`
      if (diffHours < 24) return `${diffHours}h ago`
      if (diffDays < 7) return `${diffDays}d ago`
      
      return date.toLocaleDateString()
    } catch {
      return ''
    }
  }

  const truncateMessage = (message: string, maxLength: number = 50) => {
    if (message.length <= maxLength) return message
    return message.substring(0, maxLength) + '...'
  }

  const getLastMessageText = (conversation: Conversation) => {
    if (!conversation.lastMessage) return 'No messages yet'
    
    if (conversation.lastMessage.type === 'FILE' && conversation.lastMessage.attachments.length > 0) {
      return '📎 Sent a file'
    }
    if (conversation.lastMessage.type === 'IMAGE') {
      return '🖼️ Sent an image'
    }
    if (conversation.lastMessage.type === 'VIDEO') {
      return '🎥 Sent a video'
    }
    if (conversation.lastMessage.type === 'AUDIO') {
      return '🎵 Sent audio'
    }
    
    return conversation.lastMessage.content || 'Message'
  }

  if (conversations.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm">No conversations yet</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {conversations.map((conversation) => {
        const otherParticipant = getOtherParticipant(conversation)
        const lastMessageText = getLastMessageText(conversation)
        const lastMessageTime = conversation.lastMessage?.createdAt || conversation.updatedAt || conversation.createdAt
        
        return (
          <div
            key={conversation.id}
            onClick={() => onSelect(conversation)}
            className={`p-4 border-b cursor-pointer transition-colors hover:bg-gray-50 ${
              selectedConversation?.id === conversation.id ? 'bg-blue-50 border-blue-200' : ''
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                  {otherParticipant?.avatarUrl ? (
                    <img
                      src={otherParticipant.avatarUrl}
                      alt={otherParticipant.fullName || 'User'}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-600 font-medium text-lg">
                      {otherParticipant?.fullName?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  )}
                </div>
                
                {/* Note: Online status not available in backend response */}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className={`font-medium truncate ${
                    conversation.unreadCount > 0 ? 'text-gray-900' : 'text-gray-700'
                  }`}>
                    {otherParticipant?.fullName || 'Unknown User'}
                  </h3>
                  
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {conversation.unreadCount > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {conversation.unreadCount}
                      </Badge>
                    )}
                    <span className="text-xs text-gray-500">
                      {formatTime(lastMessageTime)}
                    </span>
                  </div>
                </div>
                
                <p className={`text-sm truncate ${
                  conversation.unreadCount > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'
                }`}>
                  {truncateMessage(lastMessageText)}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default ConversationList
