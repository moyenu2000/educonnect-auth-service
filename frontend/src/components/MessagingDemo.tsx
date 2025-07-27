import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import MessagingInterface from './messaging/MessagingInterface'
import MessageInputEnhanced from './messaging/MessageInputEnhanced'
import { discussionService } from '@/services/discussionService'
import { formatMessageWithFiles, parseMessageFiles, type FileLink } from '@/utils/messageFileUtils'
import { 
  MessageSquare, 
  Users, 
  Settings,
  Info,
  FileText,
  Image,
  Video
} from 'lucide-react'

const MessagingDemo: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState<'full' | 'input' | 'utils'>('full')

  // Demo for file formatting utilities
  const [demoMessage, setDemoMessage] = useState('')
  const [demoFiles, setDemoFiles] = useState<FileLink[]>([
    {
      url: 'https://example.com/files/document.pdf',
      name: 'Assignment.pdf',
      type: 'document',
      size: 1024000
    },
    {
      url: 'https://example.com/files/image.jpg',
      name: 'Screenshot.jpg',
      type: 'image',
      size: 512000
    }
  ])

  const handleDemoSend = (content: string, attachments: string[]) => {
    console.log('Demo message sent:')
    console.log('Content:', content)
    console.log('Attachments:', attachments)
    
    // Example of how to format message with files
    const fileLinks: FileLink[] = attachments.map(url => ({
      url,
      name: url.split('/').pop() || 'file',
      type: 'file'
    }))
    
    const formattedMessage = formatMessageWithFiles(content, fileLinks)
    console.log('Formatted message:', formattedMessage)
    
    alert('Message sent! Check console for details.')
  }

  const testFileFormatting = () => {
    const formatted = formatMessageWithFiles(demoMessage, demoFiles)
    console.log('Formatted message:', formatted)
    
    const parsed = parseMessageFiles(formatted)
    console.log('Parsed message:', parsed)
    
    alert('File formatting test complete! Check console for results.')
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Messaging System Demo
        </h1>
        <p className="text-gray-600">
          Complete messaging interface with file upload support
        </p>
      </div>

      {/* Demo Navigation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Demo Components
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={activeDemo === 'full' ? 'default' : 'outline'}
              onClick={() => setActiveDemo('full')}
            >
              Full Messaging Interface
            </Button>
            <Button
              variant={activeDemo === 'input' ? 'default' : 'outline'}
              onClick={() => setActiveDemo('input')}
            >
              Enhanced Message Input
            </Button>
            <Button
              variant={activeDemo === 'utils' ? 'default' : 'outline'}
              onClick={() => setActiveDemo('utils')}
            >
              File Utilities Demo
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Feature Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <MessageSquare className="w-5 h-5 text-blue-500 mt-1" />
              <div>
                <h3 className="font-semibold">Real-time Messaging</h3>
                <p className="text-sm text-gray-600">Send and receive messages instantly</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-green-500 mt-1" />
              <div>
                <h3 className="font-semibold">File Attachments</h3>
                <p className="text-sm text-gray-600">Upload and share files of various types</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Image className="w-5 h-5 text-purple-500 mt-1" />
              <div>
                <h3 className="font-semibold">Image Preview</h3>
                <p className="text-sm text-gray-600">Preview images and videos inline</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Video className="w-5 h-5 text-red-500 mt-1" />
              <div>
                <h3 className="font-semibold">Media Support</h3>
                <p className="text-sm text-gray-600">Support for video, audio, and documents</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-indigo-500 mt-1" />
              <div>
                <h3 className="font-semibold">Conversation Management</h3>
                <p className="text-sm text-gray-600">Organize conversations and track unread messages</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Settings className="w-5 h-5 text-gray-500 mt-1" />
              <div>
                <h3 className="font-semibold">Drag & Drop</h3>
                <p className="text-sm text-gray-600">Easy file upload via drag and drop</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Demo Content */}
      {activeDemo === 'full' && (
        <Card>
          <CardHeader>
            <CardTitle>Full Messaging Interface</CardTitle>
            <p className="text-sm text-gray-600">
              Complete messaging system with conversations, messages, and file support
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-[600px]">
              <MessagingInterface />
            </div>
          </CardContent>
        </Card>
      )}

      {activeDemo === 'input' && (
        <Card>
          <CardHeader>
            <CardTitle>Enhanced Message Input</CardTitle>
            <p className="text-sm text-gray-600">
              Message input with file upload, drag & drop, and progress tracking
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Features:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• File validation (size, type)</li>
                  <li>• Drag and drop support</li>
                  <li>• Upload progress tracking</li>
                  <li>• File preview for images</li>
                  <li>• Error handling</li>
                  <li>• Multiple file selection</li>
                </ul>
              </div>
              
              <div className="border rounded-lg">
                <MessageInputEnhanced
                  onSendMessage={handleDemoSend}
                  placeholder="Try typing a message and attaching files..."
                  maxFileSize={5} // 5MB for demo
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeDemo === 'utils' && (
        <Card>
          <CardHeader>
            <CardTitle>File Utilities Demo</CardTitle>
            <p className="text-sm text-gray-600">
              Utilities for formatting messages with file links and parsing file information
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Message Content:
                </label>
                <textarea
                  value={demoMessage}
                  onChange={(e) => setDemoMessage(e.target.value)}
                  className="w-full p-2 border rounded"
                  rows={3}
                  placeholder="Enter your message content..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Demo Files:
                </label>
                <div className="space-y-2">
                  {demoFiles.map((file, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <Badge variant="outline">{file.type}</Badge>
                      <span className="text-sm">{file.name}</span>
                      <span className="text-xs text-gray-500">({file.size} bytes)</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <Button onClick={testFileFormatting}>
                Test File Formatting
              </Button>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">How it works:</h4>
                <ol className="text-sm text-blue-800 space-y-1">
                  <li>1. Files are uploaded via API to get download URLs</li>
                  <li>2. File links are embedded in message content using format: [FILE:name:type:url]</li>
                  <li>3. When displaying messages, file markers are parsed and rendered as file components</li>
                  <li>4. This allows for easy storage and retrieval of file information</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Usage Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">1. Basic Setup</h4>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
{`import MessagingInterface from './components/messaging/MessagingInterface'
import Messages from './components/Messages'

// Add to your routes
<Route path="/messages" element={<Messages />} />

// Or use the interface directly
<MessagingInterface />`}
              </pre>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">2. File Upload Flow</h4>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
{`// 1. Upload files to get URLs
const response = await discussionService.uploadFile(file)
const fileUrl = response.data?.data?.downloadUrl

// 2. Send message with file URLs
await discussionService.sendMessage({
  recipientId: userId,
  content: "Check out this file!",
  attachments: [fileUrl]
})`}
              </pre>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">3. File Formatting</h4>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
{`import { formatMessageWithFiles, parseMessageFiles } from '@/utils/messageFileUtils'

// Format message with files
const formatted = formatMessageWithFiles("Hello!", [
  { url: "file.pdf", name: "document.pdf", type: "document" }
])

// Parse message to extract files
const { text, files } = parseMessageFiles(formatted)`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default MessagingDemo
