# Messaging System Usage Guide

## 🚀 **How to Use the Messaging System**

### **1. Starting New Conversations**

#### **Search for Users:**
1. Click the "**New**" button in the messages header
2. Type at least 2 characters in the search box
3. Search by:
   - Full name (e.g., "John Smith")
   - Username (e.g., "johnsmith23")
   - Role (e.g., "STUDENT", "TEACHER")

#### **Select User:**
1. Click on any user from the search results
2. A new conversation will be created automatically
3. If a conversation already exists, it will be selected

### **2. Sending Messages**

#### **Text Messages:**
- Type your message in the input field
- Press **Enter** or click the send button
- Use **Shift+Enter** for new lines

#### **File Messages:**
1. Click the **📎 paperclip** icon
2. Select files from your device
3. Files are uploaded automatically
4. Send message with or without additional text

### **3. File Support**

#### **Supported File Types:**
- **Images**: JPG, PNG, GIF, WebP, SVG
- **Videos**: MP4, WebM, OGG
- **Audio**: MP3, WAV, AAC, OGG, FLAC
- **Documents**: PDF, DOC, DOCX, TXT, RTF
- **Archives**: ZIP, RAR, 7Z, TAR, GZ

#### **File Features:**
- **Image Preview**: Click to view full size
- **Video Player**: Built-in video controls
- **Download**: Click download button on any file
- **Multiple Files**: Upload multiple files at once

### **4. Message Features**

#### **Message Status:**
- **✓ Single check**: Message sent
- **✓✓ Double check (blue)**: Message read
- **✓✓ Double check (gray)**: Message delivered but not read

#### **Message Types:**
- **Text**: Regular text messages
- **File**: Messages with file attachments
- **Image**: Image files with previews
- **Video**: Video files with players
- **Audio**: Audio files with controls

### **5. Conversation Management**

#### **Conversation List:**
- Shows all your conversations
- **Red badge**: Unread message count
- **Time stamps**: Last message time
- **User avatars**: Profile pictures or initials
- **Preview**: Last message content

#### **Mobile View:**
- Conversations list hides when chat is open
- **← Back arrow** returns to conversation list
- Touch-optimized interface

### **6. Navigation**

#### **Available Routes:**
- `/student/messages` - Student messaging
- `/admin/messages` - Admin messaging  
- `/question-setter/messages` - Question setter messaging

#### **Responsive Design:**
- **Desktop**: Side-by-side layout
- **Mobile**: Full-screen conversations
- **Tablet**: Adaptive layout

### **7. Security & Privacy**

#### **Authentication:**
- All endpoints require authentication
- JWT token-based security
- Role-based access control

#### **File Security:**
- Files uploaded to secure storage
- Access control on file downloads
- File type validation

### **8. Performance**

#### **Optimizations:**
- **Debounced search**: Reduces API calls
- **Pagination**: Efficient message loading
- **Image optimization**: Automatic resizing
- **Caching**: Local storage for user data

#### **Loading States:**
- Search loading indicators
- File upload progress
- Message sending feedback
- Skeleton loading for conversations

## 🔧 **Developer Integration**

### **Import and Use:**
```typescript
import { MessagingInterface } from '@/components/messaging'

// In your component
<MessagingInterface />
```

### **Required Services:**
- `discussionService` - Backend API integration
- User authentication context
- File upload handling

### **Environment Setup:**
1. Ensure backend discussion service is running
2. Configure API endpoints in `discussionService.ts`
3. Set up authentication tokens
4. Configure file storage

## 📱 **Mobile Experience**

### **Touch Interactions:**
- **Tap**: Select conversation or user
- **Long press**: Future context menu options
- **Swipe**: Navigation gestures (planned)

### **Responsive Features:**
- Adaptive layout for all screen sizes
- Touch-friendly button sizes
- Optimized scroll behavior
- Mobile-first design approach

## 🚀 **Advanced Features (Coming Soon)**

- **Real-time notifications**
- **Typing indicators**
- **Message reactions**
- **Voice messages**
- **Message search**
- **Conversation archiving**
- **Group messaging**
- **Message forwarding**

## 🐛 **Troubleshooting**

### **Common Issues:**
1. **"No conversations"**: Start a new conversation using search
2. **File upload failed**: Check file size and type restrictions
3. **User not found**: Verify user exists and spelling
4. **Messages not loading**: Check internet connection and auth

### **Error Handling:**
- Automatic retry for failed uploads
- Graceful error messages
- Fallback UI states
- Network error recovery
