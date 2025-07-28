import React, { useEffect, useRef } from 'react'
import { type Message } from '@/services/discussionService'
import MessageItem from './MessageItem'

interface MessageListProps {
  messages: Message[]
  loading: boolean
  conversationId: number
  onLoadMore?: () => void
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  loading,
  conversationId
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, conversationId])

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

  const currentUserId = getCurrentUserId()

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
          <span className="text-sm text-gray-500">Loading messages...</span>
        </div>
      </div>
    )
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <p className="text-gray-500">No messages yet</p>
          <p className="text-gray-400 text-sm mt-1">Start the conversation!</p>
        </div>
      </div>
    )
  }

  return (
    <div 
      ref={messagesContainerRef}
      className="flex-1 overflow-y-auto p-4 space-y-4"
    >
      {messages.map((message, index) => {
        const isOwn = message.sender?.id === currentUserId
        const previousMessage = index > 0 ? messages[index - 1] : null
        const showDateSeparator = previousMessage && 
          new Date(message.createdAt).toDateString() !== new Date(previousMessage.createdAt).toDateString()
        
        return (
          <React.Fragment key={message.id}>
            {showDateSeparator && (
              <div className="flex items-center justify-center py-2">
                <div className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                  {new Date(message.createdAt).toLocaleDateString()}
                </div>
              </div>
            )}
            
            <MessageItem
              message={message}
              isOwn={isOwn}
              showAvatar={Boolean(!isOwn && (
                !previousMessage || 
                previousMessage.sender?.id !== message.sender?.id ||
                showDateSeparator
              ))}
            />
          </React.Fragment>
        )
      })}
      
      <div ref={messagesEndRef} />
    </div>
  )
}

export default MessageList
