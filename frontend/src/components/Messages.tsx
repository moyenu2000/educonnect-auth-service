import React from 'react'
import MessagingInterface from './messaging/MessagingInterface'

const Messages: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-600 mt-1">
          Chat with your classmates, teachers, and study groups
        </p>
      </div>
      
      <MessagingInterface />
    </div>
  )
}

export default Messages
