// Utility functions for handling file attachments in messages

export interface FileLink {
  url: string
  name: string
  type: string
  size?: number
}

/**
 * Format message content with file links
 * This function embeds file information in the message content in a structured way
 */
export const formatMessageWithFiles = (content: string, files: FileLink[]): string => {
  if (!files || files.length === 0) return content

  const fileSection = files.map(file => 
    `[FILE:${file.name}:${file.type}:${file.url}]`
  ).join('\n')

  return content + (content ? '\n\n' : '') + fileSection
}

/**
 * Parse message content to extract file links
 * This function extracts file information from formatted message content
 */
export const parseMessageFiles = (content: string): { text: string; files: FileLink[] } => {
  const fileRegex = /\[FILE:([^:]+):([^:]+):([^\]]+)\]/g
  const files: FileLink[] = []
  let match

  while ((match = fileRegex.exec(content)) !== null) {
    files.push({
      name: match[1],
      type: match[2],
      url: match[3]
    })
  }

  // Remove file markers from text content
  const text = content.replace(fileRegex, '').trim()

  return { text, files }
}

/**
 * Upload files and return their URLs for message sending
 */
export const uploadFilesForMessage = async (
  files: File[], 
  uploadFunction: (file: File) => Promise<{ data?: { data?: { downloadUrl?: string } } }>
): Promise<string[]> => {
  const uploadPromises = files.map(async (file) => {
    try {
      const response = await uploadFunction(file)
      return response.data?.data?.downloadUrl || null
    } catch (error) {
      console.error(`Failed to upload ${file.name}:`, error)
      return null
    }
  })

  const results = await Promise.all(uploadPromises)
  return results.filter(url => url !== null)
}

/**
 * Format file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Get file type from extension
 */
export const getFileType = (filename: string): string => {
  const extension = filename.split('.').pop()?.toLowerCase() || ''
  
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) {
    return 'image'
  }
  if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'].includes(extension)) {
    return 'video'
  }
  if (['mp3', 'wav', 'aac', 'ogg', 'flac'].includes(extension)) {
    return 'audio'
  }
  if (['pdf', 'doc', 'docx', 'txt', 'rtf'].includes(extension)) {
    return 'document'
  }
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension)) {
    return 'archive'
  }
  
  return 'file'
}

/**
 * Check if file type is supported for inline preview
 */
export const isPreviewable = (filename: string): boolean => {
  const extension = filename.split('.').pop()?.toLowerCase() || ''
  return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'webm', 'pdf'].includes(extension)
}
