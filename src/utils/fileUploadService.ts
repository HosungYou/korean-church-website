import { storage } from '../../lib/firebase'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { v4 as uuidv4 } from 'uuid'

export interface UploadResult {
  url: string
  path: string
  fileName: string
}

export const uploadFile = async (
  file: File,
  folder: 'posts' | 'covers'
): Promise<UploadResult> => {
  console.log('Starting file upload, checking Firebase configuration...')

  try {
    // Check if Firebase Storage is available
    if (!storage) {
      console.warn('Firebase Storage not initialized, using base64 fallback')
      return await uploadFileAsBase64(file, folder)
    }

    // Try Firebase Storage upload
    const fileExtension = file.name.split('.').pop()
    const uniqueFileName = `${uuidv4()}.${fileExtension}`
    const filePath = `${folder}/${uniqueFileName}`

    console.log('Uploading to Firebase Storage:', filePath)

    // Create storage reference
    const storageRef = ref(storage, filePath)

    // Upload file with metadata
    const metadata = {
      contentType: file.type,
      customMetadata: {
        originalName: file.name,
        uploadedAt: new Date().toISOString()
      }
    }

    const snapshot = await uploadBytes(storageRef, file, metadata)
    const downloadURL = await getDownloadURL(snapshot.ref)

    console.log('Firebase upload successful:', downloadURL)

    return {
      url: downloadURL,
      path: filePath,
      fileName: file.name
    }
  } catch (error) {
    console.error('Firebase upload failed:', error)

    // Fallback to base64 if Firebase fails
    console.log('Falling back to base64 storage')
    return await uploadFileAsBase64(file, folder)
  }
}

// Helper function for base64 fallback
const uploadFileAsBase64 = async (
  file: File,
  folder: 'posts' | 'covers'
): Promise<UploadResult> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const base64Data = reader.result as string
      const fileExtension = file.name.split('.').pop()
      const uniqueFileName = `${uuidv4()}.${fileExtension}`

      console.log('File converted to base64, using temporary storage')
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
  if (filePath.startsWith('temp/')) {
    console.log('Temporary file, no deletion needed')
    return
  }

  try {
    if (storage) {
      const storageRef = ref(storage, filePath)
      await deleteObject(storageRef)
    }
  } catch (error) {
    console.error('File deletion failed:', error)
    // Don't throw error for deletion failures as they're not critical
  }
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