import { supabase } from '../../lib/supabase'
import type { Sermon, SermonInsert } from '../../types/supabase'
import { toLocalDateString } from './dateHelpers'

export type SermonType = 'sunday' | 'wednesday' | 'friday' | 'special'

export interface SermonFilters {
  type?: SermonType
  year?: number
  search?: string
  status?: 'draft' | 'published'
  isFeatured?: boolean
  limit?: number
  offset?: number
}

// 설교 목록 조회
export async function getSermons(filters: SermonFilters = {}) {
  let query = supabase
    .from('sermons')
    .select('*')
    .order('sermon_date', { ascending: false })

  if (filters.type) {
    query = query.eq('sermon_type', filters.type)
  }

  if (filters.year) {
    const startDate = `${filters.year}-01-01`
    const endDate = `${filters.year}-12-31`
    query = query.gte('sermon_date', startDate).lte('sermon_date', endDate)
  }

  if (filters.search) {
    query = query.or(`title.ilike.%${filters.search}%,scripture.ilike.%${filters.search}%,speaker.ilike.%${filters.search}%`)
  }

  if (filters.status) {
    query = query.eq('status', filters.status)
  }

  if (filters.isFeatured !== undefined) {
    query = query.eq('is_featured', filters.isFeatured)
  }

  if (filters.limit) {
    query = query.limit(filters.limit)
  }

  if (filters.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching sermons:', error)
    throw error
  }

  return data as Sermon[]
}

// 설교 단건 조회
export async function getSermonById(id: string) {
  const { data, error } = await supabase
    .from('sermons')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching sermon:', error)
    throw error
  }

  return data as Sermon
}

// 최근 설교 조회 (타입별)
export async function getRecentSermons(type?: SermonType, limit: number = 5) {
  let query = supabase
    .from('sermons')
    .select('*')
    .eq('status', 'published')
    .order('sermon_date', { ascending: false })
    .limit(limit)

  if (type) {
    query = query.eq('sermon_type', type)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching recent sermons:', error)
    throw error
  }

  return data as Sermon[]
}

// 주요 설교 조회 (is_featured = true)
export async function getFeaturedSermons(limit: number = 3) {
  const { data, error } = await supabase
    .from('sermons')
    .select('*')
    .eq('status', 'published')
    .eq('is_featured', true)
    .order('sermon_date', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching featured sermons:', error)
    throw error
  }

  return data as Sermon[]
}

// 설교 시리즈 목록 조회
export async function getSermonSeries() {
  const { data, error } = await supabase
    .from('sermons')
    .select('series_name')
    .not('series_name', 'is', null)
    .eq('status', 'published')

  if (error) {
    console.error('Error fetching sermon series:', error)
    throw error
  }

  // 중복 제거
  const uniqueSeries = Array.from(new Set(data?.map(d => d.series_name).filter(Boolean)))
  return uniqueSeries as string[]
}

// 설교 생성 (관리자)
export async function createSermon(sermon: SermonInsert) {
  const { data, error } = await supabase
    .from('sermons')
    .insert(sermon)
    .select()
    .single()

  if (error) {
    console.error('Error creating sermon:', error)
    throw error
  }

  return data as Sermon
}

// 설교 수정 (관리자)
export async function updateSermon(id: string, updates: Partial<SermonInsert>) {
  const { data, error } = await supabase
    .from('sermons')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating sermon:', error)
    throw error
  }

  return data as Sermon
}

// 설교 삭제 (관리자)
export async function deleteSermon(id: string) {
  const { error } = await supabase
    .from('sermons')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting sermon:', error)
    throw error
  }

  return true
}

// 설교 첨부파일 업로드 (Supabase Storage)
export async function uploadSermonAttachment(file: File, sermonDate: string) {
  const fileExt = file.name.split('.').pop()
  const fileName = `sermon_${sermonDate.replace(/-/g, '')}_${Date.now()}.${fileExt}`

  const { data, error } = await supabase.storage
    .from('sermons')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true,
    })

  if (error) {
    console.error('Error uploading sermon attachment:', error)
    throw error
  }

  const { data: publicUrlData } = supabase.storage
    .from('sermons')
    .getPublicUrl(fileName)

  return { url: publicUrlData.publicUrl, name: file.name }
}

// 설교 첨부파일 삭제
export async function deleteSermonAttachment(fileUrl: string) {
  const urlParts = fileUrl.split('/sermons/')
  if (urlParts.length < 2) return false

  const filePath = urlParts[1]
  const { error } = await supabase.storage
    .from('sermons')
    .remove([filePath])

  if (error) {
    console.error('Error deleting sermon attachment:', error)
    throw error
  }

  return true
}

// 조회수 증가
export async function incrementViewCount(id: string) {
  const { error } = await supabase.rpc('increment_sermon_views', { sermon_id: id })

  if (error) {
    // RPC가 없으면 직접 업데이트
    const { data: sermon } = await supabase
      .from('sermons')
      .select('view_count')
      .eq('id', id)
      .single()

    if (sermon) {
      await supabase
        .from('sermons')
        .update({ view_count: (sermon.view_count || 0) + 1 })
        .eq('id', id)
    }
  }
}

// 설교 통계
export async function getSermonStats() {
  const { count: total } = await supabase
    .from('sermons')
    .select('*', { count: 'exact', head: true })

  const { count: published } = await supabase
    .from('sermons')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published')

  const { count: thisMonth } = await supabase
    .from('sermons')
    .select('*', { count: 'exact', head: true })
    .gte('sermon_date', toLocalDateString(new Date(new Date().getFullYear(), new Date().getMonth(), 1)))

  return {
    total: total ?? 0,
    published: published ?? 0,
    thisMonth: thisMonth ?? 0,
  }
}

// YouTube URL에서 Video ID 추출 (클라이언트 측 헬퍼)
export function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null

  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) {
      return match[1]
    }
  }

  return null
}

// YouTube 썸네일 URL 생성
export function getYouTubeThumbnailUrl(videoId: string, quality: 'default' | 'hq' | 'mq' | 'sd' | 'maxres' = 'hq'): string {
  const qualityMap = {
    default: 'default',
    hq: 'hqdefault',
    mq: 'mqdefault',
    sd: 'sddefault',
    maxres: 'maxresdefault',
  }
  return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`
}
