import { supabase } from '../../lib/supabase'
import type {
  TrainingProgram,
  TrainingProgramInsert,
  TrainingMaterial,
  TrainingMaterialInsert
} from '../../types/supabase'

export type MaterialType = 'pdf' | 'video' | 'audio'
export type ProgramCategory = 'new_family' | 'discipleship' | 'bible_study' | 'leadership' | 'baptism' | 'general'

export const CATEGORY_LABELS: Record<ProgramCategory, string> = {
  new_family: '새가족 양육',
  discipleship: '제자훈련',
  bible_study: '성경공부',
  leadership: '리더십훈련',
  baptism: '세례교육',
  general: '일반',
}

export const MATERIAL_TYPE_LABELS: Record<MaterialType, string> = {
  pdf: 'PDF 자료',
  video: '영상',
  audio: '오디오',
}

export const MATERIAL_TYPE_ICONS: Record<MaterialType, string> = {
  pdf: '📄',
  video: '🎬',
  audio: '🎧',
}

export interface ProgramFilters {
  category?: ProgramCategory
  isVisible?: boolean
  limit?: number
  offset?: number
}

export interface MaterialFilters {
  programId?: string
  weekNumber?: number
  materialType?: MaterialType
  isVisible?: boolean
  limit?: number
  offset?: number
}

// ========== 프로그램 관련 함수 ==========

// 프로그램 목록 조회 (공개용)
export async function getPrograms(filters: ProgramFilters = {}) {
  let query = supabase
    .from('training_programs')
    .select('*')
    .eq('is_visible', true)
    .order('sort_order', { ascending: true })

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
    console.error('Error fetching programs:', error)
    throw error
  }

  return data as TrainingProgram[]
}

// 모든 프로그램 조회 (관리자용, 숨김 포함)
export async function getAllPrograms(filters: ProgramFilters = {}) {
  let query = supabase
    .from('training_programs')
    .select('*')
    .order('sort_order', { ascending: true })

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
    console.error('Error fetching all programs:', error)
    throw error
  }

  return data as TrainingProgram[]
}

// 프로그램 단건 조회
export async function getProgramById(id: string) {
  const { data, error } = await supabase
    .from('training_programs')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching program:', error)
    throw error
  }

  return data as TrainingProgram
}

// 프로그램과 자료 함께 조회
export async function getProgramWithMaterials(programId: string) {
  const { data: program, error: programError } = await supabase
    .from('training_programs')
    .select('*')
    .eq('id', programId)
    .single()

  if (programError) {
    console.error('Error fetching program:', programError)
    throw programError
  }

  const { data: materials, error: materialsError } = await supabase
    .from('training_materials')
    .select('*')
    .eq('program_id', programId)
    .eq('is_visible', true)
    .order('week_number', { ascending: true })
    .order('sort_order', { ascending: true })

  if (materialsError) {
    console.error('Error fetching materials:', materialsError)
    throw materialsError
  }

  return {
    program: program as TrainingProgram,
    materials: materials as TrainingMaterial[],
  }
}

// 프로그램 생성 (관리자)
export async function createProgram(program: TrainingProgramInsert) {
  const { data, error } = await supabase
    .from('training_programs')
    .insert(program)
    .select()
    .single()

  if (error) {
    console.error('Error creating program:', error)
    throw error
  }

  return data as TrainingProgram
}

// 프로그램 수정 (관리자)
export async function updateProgram(id: string, updates: Partial<TrainingProgramInsert>) {
  const { data, error } = await supabase
    .from('training_programs')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating program:', error)
    throw error
  }

  return data as TrainingProgram
}

// 프로그램 삭제 (관리자) - 자료도 함께 삭제됨 (CASCADE)
export async function deleteProgram(id: string) {
  const { error } = await supabase
    .from('training_programs')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting program:', error)
    throw error
  }

  return true
}

// ========== 자료 관련 함수 ==========

// 자료 목록 조회 (프로그램별)
export async function getMaterialsByProgram(programId: string, filters: MaterialFilters = {}) {
  let query = supabase
    .from('training_materials')
    .select('*')
    .eq('program_id', programId)
    .eq('is_visible', true)
    .order('week_number', { ascending: true })
    .order('sort_order', { ascending: true })

  if (filters.weekNumber) {
    query = query.eq('week_number', filters.weekNumber)
  }

  if (filters.materialType) {
    query = query.eq('material_type', filters.materialType)
  }

  if (filters.limit) {
    query = query.limit(filters.limit)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching materials:', error)
    throw error
  }

  return data as TrainingMaterial[]
}

// 모든 자료 조회 (관리자용, 숨김 포함)
export async function getAllMaterialsByProgram(programId: string, filters: MaterialFilters = {}) {
  let query = supabase
    .from('training_materials')
    .select('*')
    .eq('program_id', programId)
    .order('week_number', { ascending: true })
    .order('sort_order', { ascending: true })

  if (filters.weekNumber) {
    query = query.eq('week_number', filters.weekNumber)
  }

  if (filters.materialType) {
    query = query.eq('material_type', filters.materialType)
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

  return data as TrainingMaterial[]
}

// 자료 단건 조회
export async function getMaterialById(id: string) {
  const { data, error } = await supabase
    .from('training_materials')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching material:', error)
    throw error
  }

  return data as TrainingMaterial
}

// 주차별 자료 그룹화
export async function getMaterialsByWeek(programId: string) {
  const { data, error } = await supabase
    .from('training_materials')
    .select('*')
    .eq('program_id', programId)
    .eq('is_visible', true)
    .order('week_number', { ascending: true })
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching materials by week:', error)
    throw error
  }

  // 주차별 그룹화
  const grouped: Record<number, TrainingMaterial[]> = {}
  data?.forEach((material) => {
    if (!grouped[material.week_number]) {
      grouped[material.week_number] = []
    }
    grouped[material.week_number].push(material as TrainingMaterial)
  })

  return grouped
}

// 자료 생성 (관리자)
export async function createMaterial(material: TrainingMaterialInsert) {
  const { data, error } = await supabase
    .from('training_materials')
    .insert(material)
    .select()
    .single()

  if (error) {
    console.error('Error creating material:', error)
    throw error
  }

  return data as TrainingMaterial
}

// 여러 자료 생성 (관리자)
export async function createMaterials(materials: TrainingMaterialInsert[]) {
  const { data, error } = await supabase
    .from('training_materials')
    .insert(materials)
    .select()

  if (error) {
    console.error('Error creating materials:', error)
    throw error
  }

  return data as TrainingMaterial[]
}

// 자료 수정 (관리자)
export async function updateMaterial(id: string, updates: Partial<TrainingMaterialInsert>) {
  const { data, error } = await supabase
    .from('training_materials')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating material:', error)
    throw error
  }

  return data as TrainingMaterial
}

// 자료 삭제 (관리자)
export async function deleteMaterial(id: string) {
  const { error } = await supabase
    .from('training_materials')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting material:', error)
    throw error
  }

  return true
}

// 자료 순서 변경 (관리자)
export async function reorderMaterials(materials: { id: string; sort_order: number }[]) {
  const promises = materials.map((material) =>
    supabase
      .from('training_materials')
      .update({ sort_order: material.sort_order })
      .eq('id', material.id)
  )

  await Promise.all(promises)
  return true
}

// 조회수 증가
export async function incrementViewCount(materialId: string) {
  try {
    const { data: material } = await supabase
      .from('training_materials')
      .select('view_count')
      .eq('id', materialId)
      .single()

    if (material) {
      await supabase
        .from('training_materials')
        .update({ view_count: (material.view_count || 0) + 1 })
        .eq('id', materialId)
    }
  } catch (error) {
    console.error('Error incrementing view count:', error)
  }
}

// ========== 파일 업로드 ==========

// 훈련 자료 파일 업로드 (Supabase Storage)
export async function uploadTrainingFile(file: File, programId: string, materialType: MaterialType) {
  const fileExt = file.name.split('.').pop()
  const fileName = `${programId}/${materialType}/${Date.now()}.${fileExt}`

  const { data, error } = await supabase.storage
    .from('training')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    console.error('Error uploading file:', error)
    throw error
  }

  // Public URL 반환
  const { data: publicUrlData } = supabase.storage
    .from('training')
    .getPublicUrl(fileName)

  return publicUrlData.publicUrl
}

// 파일 삭제 (Supabase Storage)
export async function deleteTrainingFile(fileUrl: string) {
  // URL에서 파일 경로 추출
  const urlParts = fileUrl.split('/training/')
  if (urlParts.length < 2) return false

  const filePath = urlParts[1]

  const { error } = await supabase.storage
    .from('training')
    .remove([filePath])

  if (error) {
    console.error('Error deleting file:', error)
    throw error
  }

  return true
}

// ========== 통계 ==========

// 훈련 통계
export async function getTrainingStats() {
  const { count: programCount } = await supabase
    .from('training_programs')
    .select('*', { count: 'exact', head: true })
    .eq('is_visible', true)

  const { count: materialCount } = await supabase
    .from('training_materials')
    .select('*', { count: 'exact', head: true })
    .eq('is_visible', true)

  const { data: totalViews } = await supabase
    .from('training_materials')
    .select('view_count')

  const viewCount = totalViews?.reduce((sum, item) => sum + (item.view_count || 0), 0) ?? 0

  const { data: recentProgram } = await supabase
    .from('training_programs')
    .select('*')
    .eq('is_visible', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  return {
    totalPrograms: programCount ?? 0,
    totalMaterials: materialCount ?? 0,
    totalViews: viewCount,
    recentProgram: recentProgram as TrainingProgram | null,
  }
}

// 카테고리별 프로그램 통계
export async function getProgramsByCategory() {
  const { data, error } = await supabase
    .from('training_programs')
    .select('category')
    .eq('is_visible', true)

  if (error) {
    console.error('Error fetching programs by category:', error)
    throw error
  }

  const stats: Record<ProgramCategory, number> = {
    new_family: 0,
    discipleship: 0,
    bible_study: 0,
    leadership: 0,
    baptism: 0,
    general: 0,
  }

  data?.forEach((item) => {
    const category = (item.category || 'general') as ProgramCategory
    if (stats[category] !== undefined) {
      stats[category]++
    }
  })

  return stats
}
