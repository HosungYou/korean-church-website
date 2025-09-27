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
  try {
    // Check if Firebase is properly configured
    if (!storage) {
      throw new Error('Firebase Storage가 설정되지 않았습니다. 임시 저장 기능을 사용합니다.')
    }

    // Try Firebase upload first
    try {
      // Create unique file name
      const fileExtension = file.name.split('.').pop()
      const uniqueFileName = `${uuidv4()}.${fileExtension}`
      const filePath = `${folder}/${uniqueFileName}`

      // Create storage reference
      const storageRef = ref(storage, filePath)

      // Upload file
      const snapshot = await uploadBytes(storageRef, file)

      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref)

      return {
        url: downloadURL,
        path: filePath,
        fileName: file.name
      }
    } catch (firebaseError) {
      console.warn('Firebase upload failed, using fallback method:', firebaseError)

      // Fallback: Convert to base64 and store temporarily
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          const base64Data = reader.result as string
          const uniqueFileName = `${uuidv4()}_${file.name}`

          resolve({
            url: base64Data,
            path: `temp/${uniqueFileName}`,
            fileName: file.name
          })
        }
        reader.onerror = () => {
          reject(new Error('파일 읽기에 실패했습니다.'))
        }
        reader.readAsDataURL(file)
      })
    }
  } catch (error) {
    console.error('File upload failed:', error)
    if (error instanceof Error && error.message.includes('auth/invalid-api-key')) {
      throw new Error('Firebase 인증이 설정되지 않았습니다. 관리자에게 문의하세요.')
    }
    throw new Error('파일 업로드에 실패했습니다.')
  }
}

export const deleteFile = async (filePath: string): Promise<void> => {
  try {
    const storageRef = ref(storage, filePath)
    await deleteObject(storageRef)
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