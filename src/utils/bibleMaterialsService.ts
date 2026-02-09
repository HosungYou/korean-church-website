import { supabase } from '../../lib/supabase'

export type BibleMaterialCategory = 'old_testament' | 'new_testament'

// ========== 성경 66권 목록 ==========

export interface BibleBook {
  name: string
  abbr: string
  category: BibleMaterialCategory
}

// 구약 39권
export const OLD_TESTAMENT_BOOKS: BibleBook[] = [
  { name: '창세기', abbr: '창', category: 'old_testament' },
  { name: '출애굽기', abbr: '출', category: 'old_testament' },
  { name: '레위기', abbr: '레', category: 'old_testament' },
  { name: '민수기', abbr: '민', category: 'old_testament' },
  { name: '신명기', abbr: '신', category: 'old_testament' },
  { name: '여호수아', abbr: '수', category: 'old_testament' },
  { name: '사사기', abbr: '삿', category: 'old_testament' },
  { name: '룻기', abbr: '룻', category: 'old_testament' },
  { name: '사무엘상', abbr: '삼상', category: 'old_testament' },
  { name: '사무엘하', abbr: '삼하', category: 'old_testament' },
  { name: '열왕기상', abbr: '왕상', category: 'old_testament' },
  { name: '열왕기하', abbr: '왕하', category: 'old_testament' },
  { name: '역대상', abbr: '대상', category: 'old_testament' },
  { name: '역대하', abbr: '대하', category: 'old_testament' },
  { name: '에스라', abbr: '스', category: 'old_testament' },
  { name: '느헤미야', abbr: '느', category: 'old_testament' },
  { name: '에스더', abbr: '에', category: 'old_testament' },
  { name: '욥기', abbr: '욥', category: 'old_testament' },
  { name: '시편', abbr: '시', category: 'old_testament' },
  { name: '잠언', abbr: '잠', category: 'old_testament' },
  { name: '전도서', abbr: '전', category: 'old_testament' },
  { name: '아가', abbr: '아', category: 'old_testament' },
  { name: '이사야', abbr: '사', category: 'old_testament' },
  { name: '예레미야', abbr: '렘', category: 'old_testament' },
  { name: '예레미야애가', abbr: '애', category: 'old_testament' },
  { name: '에스겔', abbr: '겔', category: 'old_testament' },
  { name: '다니엘', abbr: '단', category: 'old_testament' },
  { name: '호세아', abbr: '호', category: 'old_testament' },
  { name: '요엘', abbr: '욜', category: 'old_testament' },
  { name: '아모스', abbr: '암', category: 'old_testament' },
  { name: '오바댜', abbr: '옵', category: 'old_testament' },
  { name: '요나', abbr: '욘', category: 'old_testament' },
  { name: '미가', abbr: '미', category: 'old_testament' },
  { name: '나훔', abbr: '나', category: 'old_testament' },
  { name: '하박국', abbr: '합', category: 'old_testament' },
  { name: '스바냐', abbr: '습', category: 'old_testament' },
  { name: '학개', abbr: '학', category: 'old_testament' },
  { name: '스가랴', abbr: '슥', category: 'old_testament' },
  { name: '말라기', abbr: '말', category: 'old_testament' },
]

// 신약 27권
export const NEW_TESTAMENT_BOOKS: BibleBook[] = [
  { name: '마태복음', abbr: '마', category: 'new_testament' },
  { name: '마가복음', abbr: '막', category: 'new_testament' },
  { name: '누가복음', abbr: '눅', category: 'new_testament' },
  { name: '요한복음', abbr: '요', category: 'new_testament' },
  { name: '사도행전', abbr: '행', category: 'new_testament' },
  { name: '로마서', abbr: '롬', category: 'new_testament' },
  { name: '고린도전서', abbr: '고전', category: 'new_testament' },
  { name: '고린도후서', abbr: '고후', category: 'new_testament' },
  { name: '갈라디아서', abbr: '갈', category: 'new_testament' },
  { name: '에베소서', abbr: '엡', category: 'new_testament' },
  { name: '빌립보서', abbr: '빌', category: 'new_testament' },
  { name: '골로새서', abbr: '골', category: 'new_testament' },
  { name: '데살로니가전서', abbr: '살전', category: 'new_testament' },
  { name: '데살로니가후서', abbr: '살후', category: 'new_testament' },
  { name: '디모데전서', abbr: '딤전', category: 'new_testament' },
  { name: '디모데후서', abbr: '딤후', category: 'new_testament' },
  { name: '디도서', abbr: '딛', category: 'new_testament' },
  { name: '빌레몬서', abbr: '몬', category: 'new_testament' },
  { name: '히브리서', abbr: '히', category: 'new_testament' },
  { name: '야고보서', abbr: '약', category: 'new_testament' },
  { name: '베드로전서', abbr: '벧전', category: 'new_testament' },
  { name: '베드로후서', abbr: '벧후', category: 'new_testament' },
  { name: '요한일서', abbr: '요일', category: 'new_testament' },
  { name: '요한이서', abbr: '요이', category: 'new_testament' },
  { name: '요한삼서', abbr: '요삼', category: 'new_testament' },
  { name: '유다서', abbr: '유', category: 'new_testament' },
  { name: '요한계시록', abbr: '계', category: 'new_testament' },
]

// 전체 66권
export const ALL_BIBLE_BOOKS: BibleBook[] = [
  ...OLD_TESTAMENT_BOOKS,
  ...NEW_TESTAMENT_BOOKS,
]

// 성경책 이름으로 카테고리 찾기
export function getCategoryByBookName(bookName: string): BibleMaterialCategory | null {
  const book = ALL_BIBLE_BOOKS.find(b => b.name === bookName)
  return book?.category ?? null
}

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
  bookName?: string
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

  if (filters.bookName) {
    query = query.eq('book_name', filters.bookName)
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
      upsert: true,
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
