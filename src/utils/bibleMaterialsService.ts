import { supabase } from '../../lib/supabase'

export type BibleMaterialCategory = 'old_testament' | 'new_testament'

export interface BibleMaterial {
  id: string
  title: string
  description: string | null
  category: BibleMaterialCategory
  book_name: string | null
  chapter_range: string | null
  content: string | null
  file_url: string | null
  file_name: string | null
  video_url: string | null
  author_name: string | null
  is_visible: boolean
  sort_order: number
  view_count: number
  created_at: string
  updated_at: string
}

export interface BibleMaterialInsert {
  title: string
  description?: string | null
  category: BibleMaterialCategory
  book_name?: string | null
  chapter_range?: string | null
  content?: string | null
  file_url?: string | null
  file_name?: string | null
  video_url?: string | null
  author_name?: string | null
  is_visible?: boolean
  sort_order?: number
}

export const CATEGORY_LABELS: Record<BibleMaterialCategory, string> = {
  old_testament: '구약',
  new_testament: '신약',
}

export const CATEGORY_COLORS: Record<BibleMaterialCategory, string> = {
  old_testament: 'oklch(0.55 0.12 225)',   // 파란색 계열
  new_testament: 'oklch(0.45 0.15 145)',   // 녹색 계열
}

export interface MaterialFilters {
  category?: BibleMaterialCategory
  isVisible?: boolean
  limit?: number
  offset?: number
}

// ========== 공개 함수 ==========

// 공개된 자료 목록 조회
export async function getMaterials(filters: MaterialFilters = {}) {
  let query = supabase
    .from('bible_materials')
    .select('*')
    .eq('is_visible', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })

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
    console.error('Error fetching bible materials:', error)
    throw error
  }

  return data as BibleMaterial[]
}

// 단건 조회
export async function getMaterialById(id: string) {
  const { data, error } = await supabase
    .from('bible_materials')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching material:', error)
    throw error
  }

  return data as BibleMaterial
}

// 카테고리별 자료 개수
export async function getMaterialCountByCategory() {
  const { data, error } = await supabase
    .from('bible_materials')
    .select('category')
    .eq('is_visible', true)

  if (error) {
    console.error('Error fetching material counts:', error)
    throw error
  }

  const counts: Record<BibleMaterialCategory, number> = {
    old_testament: 0,
    new_testament: 0,
  }

  data?.forEach((item) => {
    const cat = item.category as BibleMaterialCategory
    if (counts[cat] !== undefined) {
      counts[cat]++
    }
  })

  return counts
}

// 조회수 증가
export async function incrementViewCount(materialId: string) {
  try {
    const { data: material } = await supabase
      .from('bible_materials')
      .select('view_count')
      .eq('id', materialId)
      .single()

    if (material) {
      await supabase
        .from('bible_materials')
        .update({ view_count: (material.view_count || 0) + 1 })
        .eq('id', materialId)
    }
  } catch (error) {
    console.error('Error incrementing view count:', error)
  }
}

// ========== 관리자 함수 ==========

// 모든 자료 조회 (관리자용)
export async function getAllMaterials(filters: MaterialFilters = {}) {
  let query = supabase
    .from('bible_materials')
    .select('*')
    .order('category', { ascending: true })
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })

  if (filters.category) {
    query = query.eq('category', filters.category)
  }

  if (filters.isVisible !== undefined) {
    query = query.eq('is_visible', filters.isVisible)
  }

  if (filters.limit) {
    query = query.limit(filters.limit)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching all materials:', error)
    throw error
  }

  return data as BibleMaterial[]
}

// 자료 생성
export async function createMaterial(material: BibleMaterialInsert) {
  const { data, error } = await supabase
    .from('bible_materials')
    .insert({
      ...material,
      is_visible: material.is_visible ?? true,
      sort_order: material.sort_order ?? 0,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating material:', error)
    throw error
  }

  return data as BibleMaterial
}

// 자료 수정
export async function updateMaterial(id: string, updates: Partial<BibleMaterialInsert>) {
  const { data, error } = await supabase
    .from('bible_materials')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating material:', error)
    throw error
  }

  return data as BibleMaterial
}

// 자료 삭제
export async function deleteMaterial(id: string) {
  const { error } = await supabase
    .from('bible_materials')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting material:', error)
    throw error
  }

  return true
}

// 자료 순서 변경
export async function reorderMaterials(materials: { id: string; sort_order: number }[]) {
  const promises = materials.map((material) =>
    supabase
      .from('bible_materials')
      .update({ sort_order: material.sort_order })
      .eq('id', material.id)
  )

  await Promise.all(promises)
  return true
}

// 파일 업로드 (Supabase Storage)
export async function uploadMaterialFile(file: File, category: BibleMaterialCategory) {
  const fileExt = file.name.split('.').pop()
  const fileName = `${category}/${Date.now()}.${fileExt}`

  const { data, error } = await supabase.storage
    .from('bible-materials')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    console.error('Error uploading file:', error)
    throw error
  }

  const { data: publicUrlData } = supabase.storage
    .from('bible-materials')
    .getPublicUrl(fileName)

  return publicUrlData.publicUrl
}

// 파일 삭제 (Supabase Storage)
export async function deleteMaterialFile(fileUrl: string) {
  const urlParts = fileUrl.split('/bible-materials/')
  if (urlParts.length < 2) return false

  const filePath = urlParts[1]

  const { error } = await supabase.storage
    .from('bible-materials')
    .remove([filePath])

  if (error) {
    console.error('Error deleting file:', error)
    throw error
  }

  return true
}

// ========== 통계 ==========

export async function getMaterialStats() {
  const { count: totalCount } = await supabase
    .from('bible_materials')
    .select('*', { count: 'exact', head: true })
    .eq('is_visible', true)

  const { data: totalViews } = await supabase
    .from('bible_materials')
    .select('view_count')

  const viewCount = totalViews?.reduce((sum, item) => sum + (item.view_count || 0), 0) ?? 0

  const categoryCount = await getMaterialCountByCategory()

  const { data: recentMaterial } = await supabase
    .from('bible_materials')
    .select('*')
    .eq('is_visible', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  return {
    totalMaterials: totalCount ?? 0,
    totalViews: viewCount,
    oldTestamentCount: categoryCount.old_testament,
    newTestamentCount: categoryCount.new_testament,
    recentMaterial: recentMaterial as BibleMaterial | null,
  }
}
