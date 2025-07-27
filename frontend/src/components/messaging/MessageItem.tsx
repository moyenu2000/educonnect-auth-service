import React from 'react'
import { type Message } from '@/services/discussionService'
import FileMessage from './FileMessage'
import { Check, CheckCheck } from 'lucide-react'

interface MessageItemProps {
  message: Message
  isOwn: boolean
  showAvatar: boolean
}

const MessageItem: React.FC<MessageItemProps> = ({
  message,
  isOwn,
  showAvatar
}) => {
  const formatTime = (timeString: string) => {
    try {
      return new Date(timeString).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    } catch {
      return ''
    }
  }

  const hasFiles = message.attachments && message.attachments.length > 0
  const hasContent = message.content && message.content.trim().length > 0

  const senderName = isOwn ? 'You' : (message.sender?.fullName || message.sender?.username || 'Unknown User')
  const senderInitial = senderName.charAt(0).toUpperCase()

  return (
    <div className={`flex gap-3 ${isOwn ? 'justify-end' : 'justify-start'}`}>
      {/* Avatar for received messages */}
      {!isOwn && (
        <div className={`flex-shrink-0 ${showAvatar ? 'visible' : 'invisible'}`}>
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            {message.sender?.avatarUrl ? (
              <img
                src={message.sender.avatarUrl}
                alt={senderName}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <span className="text-gray-600 text-sm font-medium">
                {senderInitial}
              </span>
            )}
          </div>
        </div>
      )}

      <div className={`max-w-xs lg:max-w-md ${isOwn ? 'order-1' : ''}`}>
        {/* Sender name for received messages */}
        {!isOwn && showAvatar && (
          <div className="text-sm text-gray-600 mb-1 px-1">
            {senderName}
          </div>
        )}

        <div className={`rounded-lg px-3 py-2 ${
          isOwn 
            ? 'bg-blue-500 text-white ml-auto' 
            : 'bg-gray-100 text-gray-900'
        }`}>
          {/* Text content */}
          {hasContent && (
            <div className="break-words">
              {message.content}
            </div>
          )}

          {/* File attachments */}
          {hasFiles && (
            <div className={`${hasContent ? 'mt-2' : ''}`}>
              {message.attachments.map((attachment, index) => (
                <FileMessage
                  key={index}
                  fileUrl={attachment}
                  isOwn={isOwn}
                />
              ))}
            </div>
          )}
        </div>

        {/* Message info */}
        <div className={`flex items-center gap-1 mt-1 text-xs text-gray-500 ${
          isOwn ? 'justify-end' : 'justify-start'
        }`}>
          <span>{formatTime(message.createdAt)}</span>
          
          {/* Read status for own messages */}
          {isOwn && (
            <div className="ml-1">
              {message.isRead ? (
                <CheckCheck className="w-3 h-3 text-blue-500" />
              ) : (
                <Check className="w-3 h-3 text-gray-400" />
              )}
            </div>
          )}
          
          {/* Edited indicator */}
          {message.isEdited && (
            <span className="text-xs text-gray-400">(edited)</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default MessageItem
