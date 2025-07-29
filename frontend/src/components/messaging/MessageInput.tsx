import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { discussionService } from '@/services/discussionService'
import { useToast } from '../../hooks/useToast'
import { 
  Send, 
  Paperclip, 
  X, 
  File,
  Image as ImageIcon,
  Loader2
} from 'lucide-react'

interface MessageInputProps {
  onSendMessage: (content: string, attachments: string[]) => void
  disabled?: boolean
}

interface AttachedFile {
  file: File
  preview?: string
  uploading: boolean
  uploaded: boolean
  url?: string
  error?: string
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  disabled = false
}) => {
  const { showToast } = useToast()
  const [message, setMessage] = useState('')
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([])
  const [isSending, setIsSending] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length === 0) return

    // Create preview for each file
    const newFiles: AttachedFile[] = files.map(file => ({
      file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      uploading: false,
      uploaded: false
    }))

    setAttachedFiles(prev => [...prev, ...newFiles])

    // Upload files immediately
    for (let i = 0; i < newFiles.length; i++) {
      const fileIndex = attachedFiles.length + i
      await uploadFile(newFiles[i], fileIndex)
    }

    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const uploadFile = async (attachedFile: AttachedFile, index: number) => {
    // Update state to show uploading
    setAttachedFiles(prev => prev.map((file, i) => 
      i === index ? { ...file, uploading: true } : file
    ))

    try {
      const response = await discussionService.uploadFile(attachedFile.file)
      const fileData = response.data?.data
      
      if (fileData && fileData.url) {
        // Update state with uploaded file URL
        setAttachedFiles(prev => prev.map((file, i) => 
          i === index ? { 
            ...file, 
            uploading: false, 
            uploaded: true, 
            url: fileData.url 
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
          error: 'Upload failed' 
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
    
    // Must have either content OR files
    if (!trimmedMessage && uploadedFiles.length === 0) return

    // Check if any files are still uploading
    const stillUploading = attachedFiles.some(f => f.uploading)
    if (stillUploading) {
      showToast('Please wait for files to finish uploading', 'warning')
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
      
      // Ensure we always send some content (backend requires @NotBlank)
      const contentToSend = trimmedMessage || (attachmentUrls.length > 0 ? 'File attachment' : 'Message')
      
      await onSendMessage(contentToSend, attachmentUrls)
      
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

  const canSend = (message.trim().length > 0 || attachedFiles.some(f => f.uploaded)) && 
                  !isSending && 
                  !disabled &&
                  !attachedFiles.some(f => f.uploading)

  return (
    <div className="p-4 border-t bg-white">
      {/* File attachments preview */}
      {attachedFiles.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {attachedFiles.map((attachedFile, index) => (
            <div
              key={index}
              className="relative bg-gray-100 rounded-lg p-2 flex items-center gap-2 max-w-xs"
            >
              {/* File preview */}
              <div className="flex-shrink-0">
                {attachedFile.preview ? (
                  <img
                    src={attachedFile.preview}
                    alt="Preview"
                    className="w-10 h-10 object-cover rounded"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                    {attachedFile.file.type.startsWith('image/') ? (
                      <ImageIcon className="w-5 h-5 text-gray-500" />
                    ) : (
                      <File className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                )}
              </div>

              {/* File info */}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">
                  {attachedFile.file.name}
                </div>
                <div className="flex items-center gap-1">
                  {attachedFile.uploading && (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span className="text-xs text-gray-500">Uploading...</span>
                    </>
                  )}
                  {attachedFile.uploaded && (
                    <Badge variant="secondary" className="text-xs">
                      Uploaded
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
        >
          <Paperclip className="w-4 h-4" />
        </Button>

        <div className="flex-1">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            disabled={disabled || isSending}
            className="resize-none"
          />
        </div>

        <Button
          onClick={handleSend}
          disabled={!canSend}
          size="sm"
          className="flex-shrink-0"
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
          onChange={handleFileSelect}
          className="hidden"
          accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.zip,.rar"
        />
      </div>
    </div>
  )
}

export default MessageInput
