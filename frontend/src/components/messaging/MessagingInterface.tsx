import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import ConversationList from './ConversationList'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import NewConversation from './NewConversation'
import { discussionService, type Conversation, type Message, type User } from '@/services/discussionService'
import { ArrowLeft, Phone, Video, MoreVertical, Plus } from 'lucide-react'

const MessagingInterface: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [messagesLoading, setMessagesLoading] = useState(false)
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768)
  const [showNewConversation, setShowNewConversation] = useState(false)

  // Load conversations on component mount
  useEffect(() => {
    loadConversations()
    
    // Handle window resize for responsive design
    const handleResize = () => setIsMobileView(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Load messages when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id)
    }
  }, [selectedConversation])

  const loadConversations = async () => {
    try {
      setLoading(true)
      const response = await discussionService.getConversations({ page: 0, size: 50 })
      const conversationsData = response.data?.data?.content || []
      setConversations(conversationsData)
    } catch (error) {
      console.error('Failed to load conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadMessages = async (conversationId: number) => {
    try {
      setMessagesLoading(true)
      
      // Skip loading messages for temporary conversations (new conversations)
      if (conversationId > 1000000000) {
        setMessages([])
        setMessagesLoading(false)
        return
      }
      
      const response = await discussionService.getConversationMessages(conversationId, {
        page: 0,
        size: 100
      })
      const messagesData = response.data?.data?.content || []
      setMessages(messagesData.reverse()) // Reverse to show oldest first
    } catch (error) {
      console.error('Failed to load messages:', error)
      setMessages([])
    } finally {
      setMessagesLoading(false)
    }
  }

  const handleSendMessage = async (content: string, attachments: string[] = []) => {
    if (!selectedConversation || (!content.trim() && attachments.length === 0)) return

    try {
      // Get the other participant (not current user)
      const currentUserId = getCurrentUserId()
      const otherParticipant = selectedConversation.participants.find(p => p.id !== currentUserId)
      
      if (!otherParticipant) {
        console.error('Could not find recipient')
        return
      }

      // Prepare message content - backend requires @NotBlank content
      const messageContent = content.trim() || (attachments.length > 0 ? 'File attachment' : 'Message')

      const messageData = {
        recipientId: otherParticipant.id,
        content: messageContent,
        type: attachments.length > 0 ? 'FILE' as const : 'TEXT' as const,
        attachments
      }

      const response = await discussionService.sendMessage(messageData)
      const newMessage = response.data?.data

      if (newMessage) {
        setMessages(prev => [...prev, newMessage])
        
        // If this was a temporary conversation (new conversation), update with real data
        if (selectedConversation.id > 1000000000) { // Temporary ID check
          // Find or create the real conversation
          const realConversationId = newMessage.conversationId
          
          // Update conversations list
          setConversations(prev => prev.map(conv => 
            conv.id === selectedConversation.id
              ? {
                  ...conv,
                  id: realConversationId,
                  lastMessage: newMessage,
                  updatedAt: new Date().toISOString()
                }
              : conv
          ))
          
          // Update selected conversation
          setSelectedConversation(prev => prev ? {
            ...prev,
            id: realConversationId,
            lastMessage: newMessage,
            updatedAt: new Date().toISOString()
          } : null)
        } else {
          // Update existing conversation
          setConversations(prev => prev.map(conv => 
            conv.id === selectedConversation.id
              ? {
                  ...conv,
                  lastMessage: newMessage,
                  updatedAt: new Date().toISOString()
                }
              : conv
          ))
        }
      }
    } catch (error) {
      console.error('Failed to send message:', error)
      alert('Failed to send message. Please try again.')
    }
  }

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

  const handleStartConversation = async (user: User) => {
    try {
      // Check if conversation already exists
      const existingConversation = conversations.find(conv => 
        conv.participants.some(p => p.id === user.id)
      )
      
      if (existingConversation) {
        // Select existing conversation
        setSelectedConversation(existingConversation)
        setShowNewConversation(false)
        return
      }

      // Create a temporary conversation to show in UI
      const tempConversation: Conversation = {
        id: Date.now(), // Temporary ID
        participants: [user],
        unreadCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      // Add to conversations list and select it
      setConversations(prev => [tempConversation, ...prev])
      setSelectedConversation(tempConversation)
      setShowNewConversation(false)
      setMessages([]) // Clear messages for new conversation
    } catch (error) {
      console.error('Failed to start conversation:', error)
      alert('Failed to start conversation. Please try again.')
    }
  }

  const handleConversationSelect = (conversation: Conversation) => {
    setSelectedConversation(conversation)
    
    // Mark messages as read
    if (conversation.unreadCount > 0) {
      // Update local state
      setConversations(prev => prev.map(conv => 
        conv.id === conversation.id
          ? { ...conv, unreadCount: 0 }
          : conv
      ))
    }
  }

  const handleBackToList = () => {
    setSelectedConversation(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-12rem)] flex bg-white rounded-lg border overflow-hidden">
      {/* Conversations List - Hide on mobile when conversation is selected */}
      <div className={`${
        isMobileView && selectedConversation ? 'hidden' : 'block'
      } w-full md:w-1/3 lg:w-1/4 border-r flex flex-col`}>
        <div className="p-4 border-b bg-gray-50">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">Messages</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowNewConversation(!showNewConversation)}
              className="flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              New
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
            </Badge>
            {conversations.some(c => c.unreadCount > 0) && (
              <Badge variant="destructive">
                {conversations.reduce((sum, c) => sum + c.unreadCount, 0)} unread
              </Badge>
            )}
          </div>
        </div>

        {/* New Conversation Component */}
        {showNewConversation && (
          <div className="p-4 border-b">
            <NewConversation
              isOpen={showNewConversation}
              onClose={() => setShowNewConversation(false)}
              onConversationStart={handleStartConversation}
            />
          </div>
        )}
        
        <ConversationList
          conversations={conversations}
          selectedConversation={selectedConversation}
          onSelect={handleConversationSelect}
        />
      </div>

      {/* Message Area - Hide on mobile when no conversation is selected */}
      <div className={`${
        isMobileView && !selectedConversation ? 'hidden' : 'flex'
      } flex-1 flex flex-col`}>
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isMobileView && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBackToList}
                    className="mr-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                )}
                
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      {getOtherParticipant(selectedConversation)?.avatarUrl ? (
                        <img
                          src={getOtherParticipant(selectedConversation)?.avatarUrl}
                          alt={getOtherParticipant(selectedConversation)?.fullName || 'User'}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-600 font-medium">
                          {getOtherParticipant(selectedConversation)?.fullName?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      )}
                    </div>
                    {/* Note: Online status not available in backend response */}
                  </div>
                  
                  <div>
                    <h3 className="font-semibold">{getOtherParticipant(selectedConversation)?.fullName || 'Unknown User'}</h3>
                    <p className="text-xs text-gray-500">
                      @{getOtherParticipant(selectedConversation)?.username || 'unknown'}
                    </p>
                  </div>
                </div>
              </div>

              {/* <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Video className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div> */}
            </div>

            {/* Messages */}
            <MessageList
              messages={messages}
              loading={messagesLoading}
              conversationId={selectedConversation.id}
              onLoadMore={() => {
                // Implement pagination if needed
              }}
            />

            {/* Message Input */}
            <MessageInput
              onSendMessage={handleSendMessage}
              disabled={messagesLoading}
            />
          </>
        ) : (
          /* No Conversation Selected */
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No conversation selected</h3>
              <p className="text-gray-500">Choose a conversation from the list to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MessagingInterface
