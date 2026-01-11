import { supabase } from '../../lib/supabase'
import type { HeroSlide, HeroSlideInsert } from '../../types/supabase'

// 활성화된 슬라이드 목록 조회 (공개)
export async function getActiveSlides() {
  const today = new Date().toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('hero_slides')
    .select('*')
    .eq('is_active', true)
    .or(`start_date.is.null,start_date.lte.${today}`)
    .or(`end_date.is.null,end_date.gte.${today}`)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching active slides:', error)
    throw error
  }

  return data as HeroSlide[]
}

// 모든 슬라이드 조회 (관리자용)
export async function getAllSlides() {
  const { data, error } = await supabase
    .from('hero_slides')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching all slides:', error)
    throw error
  }

  return data as HeroSlide[]
}

// 슬라이드 단건 조회
export async function getSlideById(id: string) {
  const { data, error } = await supabase
    .from('hero_slides')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching slide:', error)
    throw error
  }

  return data as HeroSlide
}

// 슬라이드 생성 (관리자)
export async function createSlide(slide: HeroSlideInsert) {
  // 새 슬라이드의 sort_order 계산
  const { data: existing } = await supabase
    .from('hero_slides')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)
    .single()

  const nextOrder = (existing?.sort_order || 0) + 1

  const { data, error } = await supabase
    .from('hero_slides')
    .insert({ ...slide, sort_order: slide.sort_order ?? nextOrder })
    .select()
    .single()

  if (error) {
    console.error('Error creating slide:', error)
    throw error
  }

  return data as HeroSlide
}

// 슬라이드 수정 (관리자)
export async function updateSlide(id: string, updates: Partial<HeroSlideInsert>) {
  const { data, error } = await supabase
    .from('hero_slides')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating slide:', error)
    throw error
  }

  return data as HeroSlide
}

// 슬라이드 삭제 (관리자)
export async function deleteSlide(id: string) {
  const { error } = await supabase
    .from('hero_slides')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting slide:', error)
    throw error
  }

  return true
}

// 슬라이드 순서 변경 (관리자)
export async function reorderSlides(slides: { id: string; sort_order: number }[]) {
  const promises = slides.map((slide) =>
    supabase
      .from('hero_slides')
      .update({ sort_order: slide.sort_order })
      .eq('id', slide.id)
  )

  await Promise.all(promises)
  return true
}

// 슬라이드 활성화/비활성화 토글 (관리자)
export async function toggleSlideActive(id: string) {
  const { data: current } = await supabase
    .from('hero_slides')
    .select('is_active')
    .eq('id', id)
    .single()

  if (!current) throw new Error('Slide not found')

  const { data, error } = await supabase
    .from('hero_slides')
    .update({ is_active: !current.is_active })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error toggling slide:', error)
    throw error
  }

  return data as HeroSlide
}

// 슬라이드 이미지 업로드 (Supabase Storage)
export async function uploadSlideImage(file: File) {
  const fileExt = file.name.split('.').pop()
  const fileName = `slide_${Date.now()}.${fileExt}`

  const { data, error } = await supabase.storage
    .from('slides')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    console.error('Error uploading slide image:', error)
    throw error
  }

  const { data: publicUrlData } = supabase.storage
    .from('slides')
    .getPublicUrl(fileName)

  return publicUrlData.publicUrl
}

// 슬라이드 이미지 삭제 (Supabase Storage)
export async function deleteSlideImage(imageUrl: string) {
  const urlParts = imageUrl.split('/slides/')
  if (urlParts.length < 2) return false

  const filePath = urlParts[1]

  const { error } = await supabase.storage
    .from('slides')
    .remove([filePath])

  if (error) {
    console.error('Error deleting slide image:', error)
    throw error
  }

  return true
}
