import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Download, 
  File, 
  Image, 
  Video, 
  Music,
  FileText,
  Archive,
  Eye
} from 'lucide-react'

interface FileMessageProps {
  fileUrl: string
  isOwn: boolean
}

const FileMessage: React.FC<FileMessageProps> = ({ fileUrl, isOwn }) => {
  const [imageError, setImageError] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  // Extract file information from URL
  const getFileInfo = (url: string) => {
    try {
      // Extract filename from URL (assumes format like /files/filename.ext)
      const urlParts = url.split('/')
      const filename = urlParts[urlParts.length - 1]
      const extension = filename.split('.').pop()?.toLowerCase() || ''
      
      return {
        filename,
        extension,
        displayName: decodeURIComponent(filename)
      }
    } catch {
      return {
        filename: 'file',
        extension: '',
        displayName: 'Unknown file'
      }
    }
  }

  const getFileIcon = (extension: string) => {
    const iconProps = { className: "w-5 h-5" }
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) {
      return <Image {...iconProps} />
    }
    if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'].includes(extension)) {
      return <Video {...iconProps} />
    }
    if (['mp3', 'wav', 'aac', 'ogg', 'flac'].includes(extension)) {
      return <Music {...iconProps} />
    }
    if (['pdf', 'doc', 'docx', 'txt', 'rtf'].includes(extension)) {
      return <FileText {...iconProps} />
    }
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension)) {
      return <Archive {...iconProps} />
    }
    
    return <File {...iconProps} />
  }

  const isImage = (extension: string) => {
    return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)
  }

  const isVideo = (extension: string) => {
    return ['mp4', 'webm', 'ogg'].includes(extension)
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = fileUrl
    link.download = fileInfo.filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handlePreview = () => {
    setIsPreviewOpen(true)
  }

  const fileInfo = getFileInfo(fileUrl)

  return (
    <>
      <div className={`rounded-lg border ${
        isOwn ? 'border-blue-300 bg-blue-50' : 'border-gray-300 bg-white'
      } p-3 max-w-sm`}>
        
        {/* Image preview */}
        {isImage(fileInfo.extension) && !imageError && (
          <div className="mb-2">
            <img
              src={fileUrl}
              alt={fileInfo.displayName}
              className="max-w-full h-auto rounded cursor-pointer hover:opacity-80 transition-opacity"
              style={{ maxHeight: '200px' }}
              onClick={handlePreview}
              onError={() => setImageError(true)}
            />
          </div>
        )}

        {/* Video preview */}
        {isVideo(fileInfo.extension) && (
          <div className="mb-2">
            <video
              controls
              className="max-w-full h-auto rounded"
              style={{ maxHeight: '200px' }}
            >
              <source src={fileUrl} type={`video/${fileInfo.extension}`} />
              Your browser does not support the video tag.
            </video>
          </div>
        )}

        {/* File info */}
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded ${
            isOwn ? 'bg-blue-100' : 'bg-gray-100'
          }`}>
            {getFileIcon(fileInfo.extension)}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className={`font-medium text-sm truncate ${
              isOwn ? 'text-blue-900' : 'text-gray-900'
            }`}>
              {fileInfo.displayName}
            </div>
            <div className={`text-xs ${
              isOwn ? 'text-blue-700' : 'text-gray-500'
            }`}>
              {fileInfo.extension.toUpperCase()} file
            </div>
          </div>
          
          <div className="flex gap-1">
            {isImage(fileInfo.extension) && !imageError && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePreview}
                className="h-8 w-8 p-0"
              >
                <Eye className="w-4 h-4" />
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              className="h-8 w-8 p-0"
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Image preview modal */}
      {isPreviewOpen && isImage(fileInfo.extension) && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setIsPreviewOpen(false)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img
              src={fileUrl}
              alt={fileInfo.displayName}
              className="max-w-full max-h-full object-contain"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsPreviewOpen(false)}
              className="absolute top-2 right-2 text-white hover:bg-white hover:bg-opacity-20"
            >
              ✕
            </Button>
          </div>
        </div>
      )}
    </>
  )
}

export default FileMessage
