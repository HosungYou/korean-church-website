import { supabase } from '../../lib/supabase'
import type { Bulletin, BulletinInsert } from '../../types/supabase'

export interface BulletinFilters {
  year?: number
  limit?: number
  offset?: number
}

// 공개된 주보 목록 조회
export async function getBulletins(filters: BulletinFilters = {}) {
  let query = supabase
    .from('bulletins')
    .select('*')
    .eq('is_visible', true)
    .order('bulletin_date', { ascending: false })

  if (filters.year) {
    const startDate = `${filters.year}-01-01`
    const endDate = `${filters.year}-12-31`
    query = query.gte('bulletin_date', startDate).lte('bulletin_date', endDate)
  }

  if (filters.limit) {
    query = query.limit(filters.limit)
  }

  if (filters.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching bulletins:', error)
    throw error
  }

  return data as Bulletin[]
}

// 모든 주보 조회 (관리자용)
export async function getAllBulletins(filters: BulletinFilters = {}) {
  let query = supabase
    .from('bulletins')
    .select('*')
    .order('bulletin_date', { ascending: false })

  if (filters.year) {
    const startDate = `${filters.year}-01-01`
    const endDate = `${filters.year}-12-31`
    query = query.gte('bulletin_date', startDate).lte('bulletin_date', endDate)
  }

  if (filters.limit) {
    query = query.limit(filters.limit)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching all bulletins:', error)
    throw error
  }

  return data as Bulletin[]
}

// 최근 주보 조회
export async function getLatestBulletin() {
  const { data, error } = await supabase
    .from('bulletins')
    .select('*')
    .eq('is_visible', true)
    .order('bulletin_date', { ascending: false })
    .limit(1)
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching latest bulletin:', error)
    throw error
  }

  return data as Bulletin | null
}

// 주보 단건 조회
export async function getBulletinById(id: string) {
  const { data, error } = await supabase
    .from('bulletins')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching bulletin:', error)
    throw error
  }

  return data as Bulletin
}

// 특정 날짜의 주보 조회
export async function getBulletinByDate(date: string) {
  const { data, error } = await supabase
    .from('bulletins')
    .select('*')
    .eq('bulletin_date', date)
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching bulletin by date:', error)
    throw error
  }

  return data as Bulletin | null
}

// 주보 생성 (관리자)
export async function createBulletin(bulletin: BulletinInsert) {
  const { data, error } = await supabase
    .from('bulletins')
    .insert(bulletin)
    .select()
    .single()

  if (error) {
    console.error('Error creating bulletin:', error)
    throw error
  }

  return data as Bulletin
}

// 주보 수정 (관리자)
export async function updateBulletin(id: string, updates: Partial<BulletinInsert>) {
  const { data, error } = await supabase
    .from('bulletins')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating bulletin:', error)
    throw error
  }

  return data as Bulletin
}

// 주보 삭제 (관리자)
export async function deleteBulletin(id: string) {
  const { error } = await supabase
    .from('bulletins')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting bulletin:', error)
    throw error
  }

  return true
}

// 주보 PDF 업로드 (Supabase Storage)
export async function uploadBulletinPDF(file: File, date: string) {
  const fileExt = file.name.split('.').pop()
  const fileName = `bulletin_${date.replace(/-/g, '')}.${fileExt}`

  const { data, error } = await supabase.storage
    .from('bulletins')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true, // 같은 날짜 주보 덮어쓰기 허용
    })

  if (error) {
    console.error('Error uploading bulletin PDF:', error)
    throw error
  }

  const { data: publicUrlData } = supabase.storage
    .from('bulletins')
    .getPublicUrl(fileName)

  return publicUrlData.publicUrl
}

// 주보 PDF 삭제 (Supabase Storage)
export async function deleteBulletinPDF(fileUrl: string) {
  const urlParts = fileUrl.split('/bulletins/')
  if (urlParts.length < 2) return false

  const filePath = urlParts[1]

  const { error } = await supabase.storage
    .from('bulletins')
    .remove([filePath])

  if (error) {
    console.error('Error deleting bulletin PDF:', error)
    throw error
  }

  return true
}

// 연도별 주보 그룹화
export async function getBulletinsByYear() {
  const { data, error } = await supabase
    .from('bulletins')
    .select('bulletin_date')
    .eq('is_visible', true)
    .order('bulletin_date', { ascending: false })

  if (error) {
    console.error('Error fetching bulletins by year:', error)
    throw error
  }

  // 연도별 그룹화
  const grouped: { [year: number]: number } = {}
  data?.forEach((item) => {
    const year = new Date(item.bulletin_date).getFullYear()
    grouped[year] = (grouped[year] || 0) + 1
  })

  return grouped
}

// 주보 통계
export async function getBulletinStats() {
  const { count: total } = await supabase
    .from('bulletins')
    .select('id', { count: 'exact', head: true })

  const { data: latest } = await supabase
    .from('bulletins')
    .select('bulletin_date')
    .eq('is_visible', true)
    .order('bulletin_date', { ascending: false })
    .limit(1)
    .single()

  return {
    total: total || 0,
    latestDate: latest?.bulletin_date || null,
  }
}
