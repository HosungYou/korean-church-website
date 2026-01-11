import { supabase } from '../../lib/supabase'
import type { GalleryAlbum, GalleryPhoto, GalleryAlbumInsert, GalleryPhotoInsert } from '../../types/supabase'

export type AlbumCategory = 'sunday' | 'event' | 'education' | 'missions' | 'general'

export interface AlbumFilters {
  year?: number
  month?: number
  category?: AlbumCategory
  limit?: number
  offset?: number
}

// ========== 앨범 관련 함수 ==========

// 앨범 목록 조회 (년/월 필터 지원)
export async function getAlbums(filters: AlbumFilters = {}) {
  let query = supabase
    .from('gallery_albums')
    .select('*')
    .eq('is_visible', true)
    .order('album_date', { ascending: false })

  if (filters.year) {
    query = query.eq('year', filters.year)
  }

  if (filters.month) {
    query = query.eq('month', filters.month)
  }

  if (filters.category) {
    query = query.eq('category', filters.category)
  }

  if (filters.limit) {
    query = query.limit(filters.limit)
  }

  if (filters.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching albums:', error)
    throw error
  }

  return data as GalleryAlbum[]
}

// 모든 앨범 조회 (관리자용, 숨김 포함)
export async function getAllAlbums(filters: AlbumFilters = {}) {
  let query = supabase
    .from('gallery_albums')
    .select('*')
    .order('album_date', { ascending: false })

  if (filters.year) {
    query = query.eq('year', filters.year)
  }

  if (filters.month) {
    query = query.eq('month', filters.month)
  }

  if (filters.category) {
    query = query.eq('category', filters.category)
  }

  if (filters.limit) {
    query = query.limit(filters.limit)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching all albums:', error)
    throw error
  }

  return data as GalleryAlbum[]
}

// 앨범 단건 조회 (사진 포함)
export async function getAlbumWithPhotos(albumId: string) {
  const { data: album, error: albumError } = await supabase
    .from('gallery_albums')
    .select('*')
    .eq('id', albumId)
    .single()

  if (albumError) {
    console.error('Error fetching album:', albumError)
    throw albumError
  }

  const { data: photos, error: photosError } = await supabase
    .from('gallery_photos')
    .select('*')
    .eq('album_id', albumId)
    .order('sort_order', { ascending: true })

  if (photosError) {
    console.error('Error fetching photos:', photosError)
    throw photosError
  }

  return {
    album: album as GalleryAlbum,
    photos: photos as GalleryPhoto[],
  }
}

// 연도별 앨범 그룹화
export async function getAlbumsByYear() {
  const { data, error } = await supabase
    .from('gallery_albums')
    .select('year, month')
    .eq('is_visible', true)
    .order('year', { ascending: false })
    .order('month', { ascending: false })

  if (error) {
    console.error('Error fetching albums by year:', error)
    throw error
  }

  // 연도별 그룹화
  const grouped: { [year: number]: number[] } = {}
  data?.forEach((item) => {
    if (!grouped[item.year]) {
      grouped[item.year] = []
    }
    if (!grouped[item.year].includes(item.month)) {
      grouped[item.year].push(item.month)
    }
  })

  return grouped
}

// 앨범 생성 (관리자)
export async function createAlbum(album: GalleryAlbumInsert) {
  const { data, error } = await supabase
    .from('gallery_albums')
    .insert(album)
    .select()
    .single()

  if (error) {
    console.error('Error creating album:', error)
    throw error
  }

  return data as GalleryAlbum
}

// 앨범 수정 (관리자)
export async function updateAlbum(id: string, updates: Partial<GalleryAlbumInsert>) {
  const { data, error } = await supabase
    .from('gallery_albums')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating album:', error)
    throw error
  }

  return data as GalleryAlbum
}

// 앨범 삭제 (관리자) - 사진도 함께 삭제됨 (CASCADE)
export async function deleteAlbum(id: string) {
  const { error } = await supabase
    .from('gallery_albums')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting album:', error)
    throw error
  }

  return true
}

// ========== 사진 관련 함수 ==========

// 앨범의 사진 목록 조회
export async function getPhotosByAlbum(albumId: string) {
  const { data, error } = await supabase
    .from('gallery_photos')
    .select('*')
    .eq('album_id', albumId)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching photos:', error)
    throw error
  }

  return data as GalleryPhoto[]
}

// 사진 추가 (관리자)
export async function addPhoto(photo: GalleryPhotoInsert) {
  const { data, error } = await supabase
    .from('gallery_photos')
    .insert(photo)
    .select()
    .single()

  if (error) {
    console.error('Error adding photo:', error)
    throw error
  }

  return data as GalleryPhoto
}

// 여러 사진 추가 (관리자)
export async function addPhotos(photos: GalleryPhotoInsert[]) {
  const { data, error } = await supabase
    .from('gallery_photos')
    .insert(photos)
    .select()

  if (error) {
    console.error('Error adding photos:', error)
    throw error
  }

  return data as GalleryPhoto[]
}

// 사진 수정 (관리자)
export async function updatePhoto(id: string, updates: Partial<GalleryPhotoInsert>) {
  const { data, error } = await supabase
    .from('gallery_photos')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating photo:', error)
    throw error
  }

  return data as GalleryPhoto
}

// 사진 삭제 (관리자)
export async function deletePhoto(id: string) {
  const { error } = await supabase
    .from('gallery_photos')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting photo:', error)
    throw error
  }

  return true
}

// 사진 순서 변경 (관리자)
export async function reorderPhotos(photos: { id: string; sort_order: number }[]) {
  const promises = photos.map((photo) =>
    supabase
      .from('gallery_photos')
      .update({ sort_order: photo.sort_order })
      .eq('id', photo.id)
  )

  await Promise.all(promises)
  return true
}

// ========== 이미지 업로드 ==========

// 갤러리 이미지 업로드 (Supabase Storage)
export async function uploadGalleryImage(file: File, albumId: string) {
  const fileExt = file.name.split('.').pop()
  const fileName = `${albumId}/${Date.now()}.${fileExt}`

  const { data, error } = await supabase.storage
    .from('gallery')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    console.error('Error uploading image:', error)
    throw error
  }

  // Public URL 반환
  const { data: publicUrlData } = supabase.storage
    .from('gallery')
    .getPublicUrl(fileName)

  return publicUrlData.publicUrl
}

// 이미지 삭제 (Supabase Storage)
export async function deleteGalleryImage(imageUrl: string) {
  // URL에서 파일 경로 추출
  const urlParts = imageUrl.split('/gallery/')
  if (urlParts.length < 2) return false

  const filePath = urlParts[1]

  const { error } = await supabase.storage
    .from('gallery')
    .remove([filePath])

  if (error) {
    console.error('Error deleting image:', error)
    throw error
  }

  return true
}

// 갤러리 통계
export async function getGalleryStats() {
  const { count: albumCount } = await supabase
    .from('gallery_albums')
    .select('*', { count: 'exact', head: true })

  const { count: photoCount } = await supabase
    .from('gallery_photos')
    .select('*', { count: 'exact', head: true })

  const { data: recentAlbum } = await supabase
    .from('gallery_albums')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  return {
    totalAlbums: albumCount ?? 0,
    totalPhotos: photoCount ?? 0,
    recentAlbum: recentAlbum as GalleryAlbum | null,
  }
}
