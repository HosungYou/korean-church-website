import { v4 as uuidv4 } from 'uuid'

export interface UploadResult {
  url: string
  path: string
  fileName: string
}

/**
 * Upload file as base64 data URL
 * Note: For production, consider using Supabase Storage
 */
export const uploadFile = async (
  file: File,
  folder: 'posts' | 'covers'
): Promise<UploadResult> => {
  console.log('Starting file upload using base64 encoding...')

  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const base64Data = reader.result as string
      const fileExtension = file.name.split('.').pop()
      const uniqueFileName = `${uuidv4()}.${fileExtension}`

      console.log('File converted to base64 successfully')
      resolve({
        url: base64Data,
        path: `temp/${folder}/${uniqueFileName}`,
        fileName: file.name
      })
    }
    reader.onerror = () => {
      console.error('Failed to read file')
      reject(new Error('파일 읽기에 실패했습니다.'))
    }
    reader.readAsDataURL(file)
  })
}

export const deleteFile = async (filePath: string): Promise<void> => {
  // For base64 files (temp storage), we don't need to delete anything
  if (filePath.startsWith('temp/') || filePath.startsWith('data:')) {
    console.log('Temporary/base64 file, no deletion needed')
    return
  }
  // No-op for now - files stored as base64 in database don't need cleanup
  console.log('File deletion skipped:', filePath)
}

export const validateFile = (file: File, maxSizeMB: number = 10): string | null => {
  // Check file size
  if (file.size > maxSizeMB * 1024 * 1024) {
    return `파일 크기는 ${maxSizeMB}MB 이하여야 합니다.`
  }

  // Check file type for attachments
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp'
  ]

  if (!allowedTypes.includes(file.type)) {
    return '지원되지 않는 파일 형식입니다.'
  }

  return null
}

export const validateImageFile = (file: File, maxSizeMB: number = 5): string | null => {
  // Check file size
  if (file.size > maxSizeMB * 1024 * 1024) {
    return `이미지 크기는 ${maxSizeMB}MB 이하여야 합니다.`
  }

  // Check if it's an image
  const allowedImageTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp'
  ]

  if (!allowedImageTypes.includes(file.type)) {
    return '이미지 파일만 업로드 가능합니다.'
  }

  return null
}
