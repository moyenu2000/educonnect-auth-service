import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { discussionService } from '@/services/discussionService'
import { uploadFilesForMessage, formatFileSize, getFileType } from '@/utils/messageFileUtils'
import { 
  Send, 
  Paperclip, 
  X, 
  File,
  Image as ImageIcon,
  Loader2,
  Upload
} from 'lucide-react'

interface MessageInputEnhancedProps {
  onSendMessage: (content: string, attachments: string[]) => void
  disabled?: boolean
  placeholder?: string
  maxFileSize?: number // in MB
  allowedFileTypes?: string[]
}

interface AttachedFile {
  file: File
  preview?: string
  uploading: boolean
  uploaded: boolean
  url?: string
  error?: string
  progress?: number
}

const MessageInputEnhanced: React.FC<MessageInputEnhancedProps> = ({
  onSendMessage,
  disabled = false,
  placeholder = "Type a message...",
  maxFileSize = 10, // 10MB default
  allowedFileTypes = ['image/*', 'video/*', 'audio/*', '.pdf', '.doc', '.docx', '.txt', '.zip', '.rar']
}) => {
  const [message, setMessage] = useState('')
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([])
  const [isSending, setIsSending] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      return `File size must be less than ${maxFileSize}MB`
    }

    // Check file type (basic validation)
    const fileName = file.name.toLowerCase()
    const allowedExtensions = [
      'jpg', 'jpeg', 'png', 'gif', 'webp', 'svg',
      'mp4', 'avi', 'mov', 'wmv', 'webm',
      'mp3', 'wav', 'aac', 'ogg',
      'pdf', 'doc', 'docx', 'txt', 'rtf',
      'zip', 'rar', '7z'
    ]
    
    const extension = fileName.split('.').pop() || ''
    if (!allowedExtensions.includes(extension)) {
      return 'File type not supported'
    }

    return null
  }

  const handleFileSelect = async (files: File[]) => {
    const validFiles: File[] = []
    const errors: string[] = []

    // Validate each file
    files.forEach(file => {
      const error = validateFile(file)
      if (error) {
        errors.push(`${file.name}: ${error}`)
      } else {
        validFiles.push(file)
      }
    })

    // Show validation errors
    if (errors.length > 0) {
      alert('Some files were rejected:\n' + errors.join('\n'))
    }

    if (validFiles.length === 0) return

    // Create preview for each valid file
    const newFiles: AttachedFile[] = validFiles.map(file => ({
      file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      uploading: false,
      uploaded: false,
      progress: 0
    }))

    setAttachedFiles(prev => [...prev, ...newFiles])

    // Upload files immediately
    for (let i = 0; i < newFiles.length; i++) {
      const fileIndex = attachedFiles.length + i
      await uploadFile(newFiles[i], fileIndex)
    }
  }

  const uploadFile = async (attachedFile: AttachedFile, index: number) => {
    // Update state to show uploading
    setAttachedFiles(prev => prev.map((file, i) => 
      i === index ? { ...file, uploading: true, progress: 0 } : file
    ))

    try {
      // Use the uploadFilesForMessage utility with progress tracking
      const response = await discussionService.uploadFile(attachedFile.file)
      const fileData = response.data?.data
      
      if (fileData && fileData.downloadUrl) {
        // Update state with uploaded file URL
        setAttachedFiles(prev => prev.map((file, i) => 
          i === index ? { 
            ...file, 
            uploading: false, 
            uploaded: true, 
            url: fileData.downloadUrl,
            progress: 100
          } : file
        ))
      } else {
        throw new Error('No download URL received')
      }
    } catch (error) {
      console.error('Failed to upload file:', error)
      
      // Update state with error
      setAttachedFiles(prev => prev.map((file, i) => 
        i === index ? { 
          ...file, 
          uploading: false, 
          uploaded: false, 
          error: 'Upload failed',
          progress: 0
        } : file
      ))
    }
  }

  const removeFile = (index: number) => {
    setAttachedFiles(prev => {
      const newFiles = [...prev]
      const removedFile = newFiles[index]
      
      // Clean up preview URL
      if (removedFile.preview) {
        URL.revokeObjectURL(removedFile.preview)
      }
      
      newFiles.splice(index, 1)
      return newFiles
    })
  }

  const handleSend = async () => {
    if (isSending || disabled) return

    const trimmedMessage = message.trim()
    const uploadedFiles = attachedFiles.filter(f => f.uploaded && f.url)
    
    if (!trimmedMessage && uploadedFiles.length === 0) return

    // Check if any files are still uploading
    const stillUploading = attachedFiles.some(f => f.uploading)
    if (stillUploading) {
      alert('Please wait for files to finish uploading')
      return
    }

    // Check if any files failed to upload
    const failedFiles = attachedFiles.filter(f => f.error)
    if (failedFiles.length > 0) {
      const retry = confirm(`${failedFiles.length} file(s) failed to upload. Remove them and send anyway?`)
      if (retry) {
        // Remove failed files
        setAttachedFiles(prev => prev.filter(f => !f.error))
      } else {
        return
      }
    }

    setIsSending(true)

    try {
      const attachmentUrls = uploadedFiles.map(f => f.url!).filter(Boolean)
      await onSendMessage(trimmedMessage, attachmentUrls)
      
      // Clear input and files
      setMessage('')
      setAttachedFiles(prev => {
        // Clean up preview URLs
        prev.forEach(file => {
          if (file.preview) {
            URL.revokeObjectURL(file.preview)
          }
        })
        return []
      })
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSend()
    }
  }

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length > 0) {
      handleFileSelect(files)
    }
    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Drag and drop handlers
  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault()
    setDragOver(false)
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    setDragOver(false)
    
    const files = Array.from(event.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files)
    }
  }

  const canSend = (message.trim().length > 0 || attachedFiles.some(f => f.uploaded)) && 
                  !isSending && 
                  !disabled &&
                  !attachedFiles.some(f => f.uploading)

  return (
    <div 
      className={`p-4 border-t bg-white ${dragOver ? 'bg-blue-50 border-blue-300' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drag overlay */}
      {dragOver && (
        <div className="absolute inset-0 bg-blue-50 bg-opacity-90 flex items-center justify-center z-10 border-2 border-dashed border-blue-300 rounded-lg">
          <div className="text-center">
            <Upload className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-blue-700 font-medium">Drop files here to upload</p>
          </div>
        </div>
      )}

      {/* File attachments preview */}
      {attachedFiles.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {attachedFiles.map((attachedFile, index) => (
            <div
              key={index}
              className="relative bg-gray-100 rounded-lg p-3 flex items-center gap-3 max-w-xs border"
            >
              {/* File preview */}
              <div className="flex-shrink-0">
                {attachedFile.preview ? (
                  <img
                    src={attachedFile.preview}
                    alt="Preview"
                    className="w-12 h-12 object-cover rounded"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                    {getFileType(attachedFile.file.name) === 'image' ? (
                      <ImageIcon className="w-6 h-6 text-gray-500" />
                    ) : (
                      <File className="w-6 h-6 text-gray-500" />
                    )}
                  </div>
                )}
              </div>

              {/* File info */}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">
                  {attachedFile.file.name}
                </div>
                <div className="text-xs text-gray-500">
                  {formatFileSize(attachedFile.file.size)}
                </div>
                <div className="flex items-center gap-1 mt-1">
                  {attachedFile.uploading && (
                    <div className="flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span className="text-xs text-gray-500">
                        {attachedFile.progress || 0}%
                      </span>
                    </div>
                  )}
                  {attachedFile.uploaded && (
                    <Badge variant="secondary" className="text-xs">
                      ✓ Uploaded
                    </Badge>
                  )}
                  {attachedFile.error && (
                    <Badge variant="destructive" className="text-xs">
                      {attachedFile.error}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Remove button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFile(index)}
                className="h-6 w-6 p-0 hover:bg-gray-200"
                disabled={attachedFile.uploading}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Message input */}
      <div className="flex items-end gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isSending}
          className="flex-shrink-0"
          title="Attach files"
        >
          <Paperclip className="w-4 h-4" />
        </Button>

        <div className="flex-1">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled || isSending}
            className="resize-none"
          />
        </div>

        <Button
          onClick={handleSend}
          disabled={!canSend}
          size="sm"
          className="flex-shrink-0"
          title="Send message"
        >
          {isSending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileInputChange}
          className="hidden"
          accept={allowedFileTypes.join(',')}
        />
      </div>
      
      {/* File upload info */}
      <div className="mt-2 text-xs text-gray-500">
        Supported files: Images, videos, audio, documents, archives (max {maxFileSize}MB each)
      </div>
    </div>
  )
}

export default MessageInputEnhanced
