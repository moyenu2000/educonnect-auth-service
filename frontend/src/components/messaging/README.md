# Messaging System with File Support

A comprehensive messaging interface for the EduConnect platform with full file upload and sharing capabilities.

## Features

### 🚀 Core Messaging
- Real-time conversations
- Message read status tracking
- Online/offline user status
- Responsive design for mobile and desktop
- Conversation management with unread counts

### 📁 File Support
- **Multiple file types**: Images, videos, audio, documents, archives
- **File upload with progress tracking**
- **Drag & drop support**
- **File validation** (size, type)
- **Image previews** and inline media display
- **Structured file embedding** in messages

### 🛠️ Technical Implementation
- **File-first approach**: Upload files to get URLs, then send as message attachments
- **Formatted message storage**: File links embedded in structured format for easy parsing
- **Utility functions** for file handling and message formatting
- **Error handling** and upload progress tracking

## Components

### 1. MessagingInterface
Main component that provides the complete messaging experience.

```tsx
import { MessagingInterface } from '@/components/messaging'

<MessagingInterface />
```

### 2. MessageInputEnhanced
Advanced message input with file upload capabilities.

```tsx
import { MessageInputEnhanced } from '@/components/messaging'

<MessageInputEnhanced
  onSendMessage={(content, attachments) => {
    // Handle message sending
  }}
  maxFileSize={10} // MB
  allowedFileTypes={['image/*', 'video/*', '.pdf']}
/>
```

### 3. Individual Components
- `ConversationList` - List of conversations with unread counts
- `MessageList` - Display messages with file support
- `MessageItem` - Individual message with read status
- `FileMessage` - File attachment display with preview

## File Upload Flow

### 1. Upload Files First
```tsx
// Upload file to get download URL
const response = await discussionService.uploadFile(file)
const fileUrl = response.data?.data?.downloadUrl
```

### 2. Send Message with File URLs
```tsx
await discussionService.sendMessage({
  recipientId: userId,
  content: "Check out this document!",
  type: 'FILE',
  attachments: [fileUrl] // Array of file URLs
})
```

### 3. File Information Embedding
Files are embedded in message content using a structured format:
```
Hello! Please review this document.

[FILE:Assignment.pdf:document:https://api.example.com/files/document.pdf]
[FILE:Screenshot.png:image:https://api.example.com/files/image.png]
```

## Utility Functions

### formatMessageWithFiles
Embeds file information in message content:

```tsx
import { formatMessageWithFiles } from '@/utils/messageFileUtils'

const fileLinks = [
  {
    url: 'https://api.example.com/files/doc.pdf',
    name: 'Document.pdf',
    type: 'document'
  }
]

const formatted = formatMessageWithFiles("Hello!", fileLinks)
// Result: "Hello!\n\n[FILE:Document.pdf:document:https://api.example.com/files/doc.pdf]"
```

### parseMessageFiles
Extracts file information from formatted message content:

```tsx
import { parseMessageFiles } from '@/utils/messageFileUtils'

const { text, files } = parseMessageFiles(formattedMessage)
// text: "Hello!"
// files: [{ url: "...", name: "Document.pdf", type: "document" }]
```

### uploadFilesForMessage
Helper for uploading multiple files:

```tsx
import { uploadFilesForMessage } from '@/utils/messageFileUtils'

const urls = await uploadFilesForMessage(files, discussionService.uploadFile)
```

## File Types Supported

### Images
- **Formats**: JPG, JPEG, PNG, GIF, WebP, SVG
- **Features**: Inline preview, click to expand, thumbnail generation

### Videos
- **Formats**: MP4, WebM, OGG
- **Features**: Inline player with controls

### Documents
- **Formats**: PDF, DOC, DOCX, TXT, RTF
- **Features**: Download link, file info display

### Audio
- **Formats**: MP3, WAV, AAC, OGG, FLAC
- **Features**: Inline audio player

### Archives
- **Formats**: ZIP, RAR, 7Z, TAR, GZ
- **Features**: Download with file info

## API Integration

The messaging system integrates with your discussion service API:

```tsx
// Example API methods used
discussionService.getConversations()
discussionService.getConversationMessages(conversationId)
discussionService.sendMessage(messageData)
discussionService.uploadFile(file)
discussionService.markMessageAsRead(messageId)
```

## Configuration

### File Upload Limits
```tsx
<MessageInputEnhanced
  maxFileSize={10} // 10MB per file
  allowedFileTypes={[
    'image/*',
    'video/*',
    'audio/*',
    '.pdf',
    '.doc',
    '.docx',
    '.txt',
    '.zip',
    '.rar'
  ]}
/>
```

### Message Display Options
```tsx
<MessagingInterface
  // Automatically handles responsive design
  // Mobile: Single column, back button
  // Desktop: Dual column layout
/>
```

## Usage Examples

### Basic Setup
```tsx
import { Messages } from '@/components'

// Add to routes
<Route path="/messages" element={<Messages />} />
```

### Custom Implementation
```tsx
import { 
  MessagingInterface,
  MessageInputEnhanced,
  formatMessageWithFiles 
} from '@/components/messaging'

function CustomMessaging() {
  const handleSendMessage = async (content, attachments) => {
    // Custom logic before sending
    console.log('Sending:', content, attachments)
    
    // Send via your API
    await myCustomSendFunction(content, attachments)
  }

  return (
    <div className="h-screen">
      <MessagingInterface />
    </div>
  )
}
```

### File Handling Example
```tsx
import { useCallback } from 'react'
import { discussionService } from '@/services/discussionService'

function FileUploadExample() {
  const handleFileUpload = useCallback(async (files: File[]) => {
    const uploadPromises = files.map(file => 
      discussionService.uploadFile(file)
    )
    
    const responses = await Promise.all(uploadPromises)
    const urls = responses.map(r => r.data?.data?.downloadUrl).filter(Boolean)
    
    return urls
  }, [])

  const handleSendWithFiles = async (content: string, files: File[]) => {
    // Upload files first
    const fileUrls = await handleFileUpload(files)
    
    // Send message with file URLs
    await discussionService.sendMessage({
      recipientId: selectedUserId,
      content,
      attachments: fileUrls
    })
  }

  return (
    <MessageInputEnhanced
      onSendMessage={(content, attachments) => {
        // attachments here are already uploaded URLs
        console.log('Ready to send:', content, attachments)
      }}
    />
  )
}
```

## Demo

Visit `/messaging-demo` in your application to see all components in action with examples and usage instructions.

## Responsive Design

- **Mobile**: Single column view with back navigation
- **Tablet**: Adaptive layout with collapsible sidebar
- **Desktop**: Full dual-column interface

## Error Handling

- File upload failures with retry options
- Network error recovery
- File type and size validation
- Graceful degradation for unsupported features

## Performance Optimizations

- Lazy loading of message history
- Image thumbnail generation
- File upload progress tracking
- Efficient conversation list updates
- Debounced search and filtering

## Security Features

- File type validation
- File size limits
- Secure file upload endpoints
- User authentication required
- Message read status tracking

## Integration Notes

1. **File URLs**: All file attachments use absolute URLs returned by the upload API
2. **Message Format**: Files are embedded in message content using structured markers
3. **Real-time Updates**: Use WebSocket or polling to update conversations in real-time
4. **Storage**: File information is stored both in message content and attachments array
5. **Cleanup**: Implement file cleanup for deleted messages if needed
