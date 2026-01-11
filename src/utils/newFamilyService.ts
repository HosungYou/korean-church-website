import { supabase } from '../../lib/supabase'
import type { NewFamilyRegistration, NewFamilyRegistrationInsert } from '../../types/supabase'

export type NewFamilyStatus = 'pending' | 'contacted' | 'visiting' | 'registered' | 'inactive'

export interface NewFamilyFormData {
  koreanName: string
  englishName: string
  birthDate: string
  baptismDate?: string
  gender: string
  country: string
  address1: string
  address2?: string
  city: string
  state: string
  zipCode: string
  email?: string
  phone: string
  churchPosition?: string
  previousChurch?: string
  introduction?: string
  familyInfo?: string
}

// 새가족 등록 데이터 저장
export const addNewFamilyRegistration = async (formData: NewFamilyFormData): Promise<NewFamilyRegistration> => {
  const registration: NewFamilyRegistrationInsert = {
    korean_name: formData.koreanName,
    english_name: formData.englishName || null,
    birth_date: formData.birthDate || null,
    baptism_date: formData.baptismDate || null,
    gender: formData.gender || null,
    country: formData.country || 'United States',
    address_line1: formData.address1,
    address_line2: formData.address2 || null,
    city: formData.city,
    state: formData.state,
    zip_code: formData.zipCode,
    email: formData.email || null,
    phone: formData.phone,
    previous_church_position: formData.churchPosition || null,
    previous_church: formData.previousChurch || null,
    introduction: formData.introduction || null,
    family_info: formData.familyInfo || null,
    status: 'pending',
  }

  const { data, error } = await supabase
    .from('new_family_registrations')
    .insert(registration)
    .select()
    .single()

  if (error) {
    console.error('새가족 등록 저장 오류:', error)
    throw error
  }

  // 관리자에게 이메일 알림 발송 (비동기로 처리)
  sendNewFamilyNotification(data).catch(console.error)

  return data as NewFamilyRegistration
}

// 관리자에게 새가족 등록 알림 이메일 발송
async function sendNewFamilyNotification(registration: NewFamilyRegistration) {
  try {
    const response = await fetch('/api/email/new-family-notification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        registration,
      }),
    })

    if (!response.ok) {
      console.error('이메일 발송 실패:', await response.text())
    }
  } catch (error) {
    console.error('이메일 알림 발송 오류:', error)
  }
}

// 모든 새가족 등록 조회 (관리자용)
export async function getAllNewFamilyRegistrations(status?: NewFamilyStatus) {
  let query = supabase
    .from('new_family_registrations')
    .select('*')
    .order('submitted_at', { ascending: false })

  if (status) {
    query = query.eq('status', status)
  }

  const { data, error } = await query

  if (error) {
    console.error('새가족 등록 목록 조회 오류:', error)
    throw error
  }

  return data as NewFamilyRegistration[]
}

// 새가족 등록 단건 조회
export async function getNewFamilyRegistrationById(id: string) {
  const { data, error } = await supabase
    .from('new_family_registrations')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('새가족 등록 조회 오류:', error)
    throw error
  }

  return data as NewFamilyRegistration
}

// 새가족 등록 상태 업데이트
export async function updateNewFamilyStatus(id: string, status: NewFamilyStatus, notes?: string) {
  const updates: Partial<NewFamilyRegistrationInsert> = {
    status,
    ...(notes !== undefined && { admin_notes: notes }),
  }

  const { data, error } = await supabase
    .from('new_family_registrations')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('새가족 상태 업데이트 오류:', error)
    throw error
  }

  return data as NewFamilyRegistration
}

// 새가족 등록 삭제
export async function deleteNewFamilyRegistration(id: string) {
  const { error } = await supabase
    .from('new_family_registrations')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('새가족 등록 삭제 오류:', error)
    throw error
  }

  return true
}

// 새가족 등록 통계 (상태별 카운트)
export async function getNewFamilyStats() {
  const { count: total } = await supabase
    .from('new_family_registrations')
    .select('id', { count: 'exact', head: true })

  const { count: pending } = await supabase
    .from('new_family_registrations')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'pending')

  const { count: contacted } = await supabase
    .from('new_family_registrations')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'contacted')

  const { count: visiting } = await supabase
    .from('new_family_registrations')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'visiting')

  const { count: registered } = await supabase
    .from('new_family_registrations')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'registered')

  const { count: inactive } = await supabase
    .from('new_family_registrations')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'inactive')

  return {
    total: total || 0,
    pending: pending || 0,
    contacted: contacted || 0,
    visiting: visiting || 0,
    registered: registered || 0,
    inactive: inactive || 0,
  }
}

// 최근 새가족 등록 목록 (대시보드용)
export async function getRecentNewFamilyRegistrations(limit: number = 5) {
  const { data, error } = await supabase
    .from('new_family_registrations')
    .select('*')
    .order('submitted_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('최근 새가족 등록 조회 오류:', error)
    throw error
  }

  return data as NewFamilyRegistration[]
}
