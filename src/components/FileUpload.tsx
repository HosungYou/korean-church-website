import React, { useState, useRef, useCallback } from 'react'
import { Upload, X, File, Image as ImageIcon, AlertCircle } from 'lucide-react'
import { uploadFile, validateFile, validateImageFile, UploadResult } from '../utils/fileUploadService'

interface FileUploadProps {
  onUpload: (result: UploadResult) => void
  onRemove?: () => void
  currentFile?: { url: string; fileName: string } | null
  accept?: string
  isImage?: boolean
  label: string
  disabled?: boolean
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onUpload,
  onRemove,
  currentFile,
  accept,
  isImage = false,
  label,
  disabled = false
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = useCallback(async (file: File) => {
    setError(null)
    setIsUploading(true)

    try {
      // Validate file
      const validationError = isImage ? validateImageFile(file) : validateFile(file)
      if (validationError) {
        setError(validationError)
        return
      }

      // Upload file
      const result = await uploadFile(file, isImage ? 'covers' : 'posts')
      onUpload(result)
    } catch (err) {
      console.error('File upload error:', err)
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('파일 업로드에 실패했습니다. 다시 시도해주세요.')
      }
    } finally {
      setIsUploading(false)
    }
  }, [isImage, onUpload])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (disabled || isUploading) return

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }, [handleFileUpload, disabled, isUploading])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled && !isUploading) {
      setIsDragging(true)
    }
  }, [disabled, isUploading])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }, [handleFileUpload])

  const handleClick = useCallback(() => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click()
    }
  }, [disabled, isUploading])

  const handleRemove = useCallback(() => {
    if (onRemove) {
      onRemove()
    }
    setError(null)
  }, [onRemove])

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 font-korean mb-2">
        {isImage ? <ImageIcon className="inline-block w-4 h-4 mr-1" /> : <Upload className="inline-block w-4 h-4 mr-1" />}
        {label}
      </label>

      {currentFile ? (
        <div className="relative">
          {isImage ? (
            <div className="relative">
              <img
                src={currentFile.url}
                alt="Cover"
                className="w-full h-40 object-cover rounded-md border border-gray-300"
              />
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                disabled={disabled}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 border border-gray-300 rounded-md bg-gray-50">
              <div className="flex items-center">
                <File className="w-5 h-5 text-gray-600 mr-2" />
                <span className="text-sm text-gray-700 font-korean">{currentFile.fileName}</span>
              </div>
              <button
                type="button"
                onClick={handleRemove}
                className="text-red-500 hover:text-red-700 transition-colors"
                disabled={disabled}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div
          className={`
            relative border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors
            ${isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300'}
            ${disabled || isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400'}
          `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept={accept}
            onChange={handleFileSelect}
            disabled={disabled || isUploading}
          />

          {isUploading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
              <p className="text-sm text-gray-600 font-korean">업로드 중...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              {isImage ? (
                <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
              ) : (
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
              )}
              <p className="text-sm text-gray-600 font-korean mb-1">
                파일을 드래그하거나 클릭하여 업로드
              </p>
              <p className="text-xs text-gray-500 font-korean">
                {isImage ? 'JPG, PNG, GIF, WebP (최대 5MB)' : 'PDF, DOC, PPT, XLS, 이미지 (최대 10MB)'}
              </p>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="mt-2 flex items-center text-red-600 text-sm">
          <AlertCircle className="w-4 h-4 mr-1" />
          <span className="font-korean">{error}</span>
        </div>
      )}
    </div>
  )
}