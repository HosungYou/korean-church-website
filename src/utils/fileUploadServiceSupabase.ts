import { createSupabaseClient } from '@/lib/supabaseClient'
import { v4 as uuidv4 } from 'uuid'

export interface UploadResult {
  url: string
  path: string
  size: number
  type: string
}

export interface UploadError {
  message: string
  code?: string
}

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
const ALLOWED_DOCUMENT_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']

export const fileUploadService = {
  /**
   * Upload an image file to Supabase Storage
   */
  async uploadImage(
    file: File,
    folder: 'covers' | 'posts' | 'general' = 'general'
  ): Promise<UploadResult | UploadError> {
    try {
      // Validate file type
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        return {
          message: '허용되지 않는 이미지 형식입니다. JPEG, PNG, GIF, WebP만 가능합니다.'
        }
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        return {
          message: `파일 크기가 너무 큽니다. 최대 ${MAX_FILE_SIZE / (1024 * 1024)}MB까지 가능합니다.`
        }
      }

      const supabase = createSupabaseClient()

      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${folder}/${uuidv4()}.${fileExt}`

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        console.error('Upload error:', error)
        return {
          message: '파일 업로드에 실패했습니다.',
          code: error.message
        }
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(fileName)

      return {
        url: publicUrl,
        path: data.path,
        size: file.size,
        type: file.type
      }
    } catch (error: any) {
      console.error('Upload error:', error)
      return {
        message: '파일 업로드 중 오류가 발생했습니다.',
        code: error.message
      }
    }
  },

  /**
   * Upload a document file (PDF, DOC, etc.)
   */
  async uploadDocument(
    file: File,
    folder: 'sermons' | 'bulletins' | 'resources' = 'resources'
  ): Promise<UploadResult | UploadError> {
    try {
      // Validate file type
      if (!ALLOWED_DOCUMENT_TYPES.includes(file.type)) {
        return {
          message: '허용되지 않는 문서 형식입니다. PDF, DOC, DOCX만 가능합니다.'
        }
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        return {
          message: `파일 크기가 너무 큽니다. 최대 ${MAX_FILE_SIZE / (1024 * 1024)}MB까지 가능합니다.`
        }
      }

      const supabase = createSupabaseClient()

      // Generate unique filename with original name preserved
      const fileExt = file.name.split('.').pop()
      const baseName = file.name.replace(`.${fileExt}`, '')
      const fileName = `${folder}/${baseName}_${uuidv4()}.${fileExt}`

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('documents')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        console.error('Upload error:', error)
        return {
          message: '파일 업로드에 실패했습니다.',
          code: error.message
        }
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName)

      return {
        url: publicUrl,
        path: data.path,
        size: file.size,
        type: file.type
      }
    } catch (error: any) {
      console.error('Upload error:', error)
      return {
        message: '파일 업로드 중 오류가 발생했습니다.',
        code: error.message
      }
    }
  },

  /**
   * Delete a file from Supabase Storage
   */
  async deleteFile(
    path: string,
    bucket: 'images' | 'documents' = 'images'
  ): Promise<boolean> {
    try {
      const supabase = createSupabaseClient()

      const { error } = await supabase.storage
        .from(bucket)
        .remove([path])

      if (error) {
        console.error('Delete error:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Delete error:', error)
      return false
    }
  },

  /**
   * Get a signed URL for temporary access to a private file
   */
  async getSignedUrl(
    path: string,
    bucket: 'images' | 'documents' = 'documents',
    expiresIn = 3600 // 1 hour default
  ): Promise<string | null> {
    try {
      const supabase = createSupabaseClient()

      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(path, expiresIn)

      if (error) {
        console.error('Signed URL error:', error)
        return null
      }

      return data.signedUrl
    } catch (error) {
      console.error('Signed URL error:', error)
      return null
    }
  },

  /**
   * List files in a specific folder
   */
  async listFiles(
    folder: string,
    bucket: 'images' | 'documents' = 'images',
    limit = 100
  ): Promise<Array<{
    name: string
    id: string
    size: number
    createdAt: string
  }>> {
    try {
      const supabase = createSupabaseClient()

      const { data, error } = await supabase.storage
        .from(bucket)
        .list(folder, {
          limit,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' }
        })

      if (error) {
        console.error('List files error:', error)
        return []
      }

      return data.map(file => ({
        name: file.name,
        id: file.id || '',
        size: file.metadata?.size || 0,
        createdAt: file.created_at
      }))
    } catch (error) {
      console.error('List files error:', error)
      return []
    }
  }
}