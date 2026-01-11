import { supabase } from '../../lib/supabase'
import type { ChurchMember, ChurchMemberInsert } from '../../types/supabase'

export type MemberType = 'member' | 'deacon' | 'elder' | 'pastor' | 'staff'
export type MemberStatus = 'active' | 'inactive' | 'transferred' | 'deceased'

export interface MemberFilters {
  memberType?: MemberType
  status?: MemberStatus
  department?: string
  search?: string
  limit?: number
  offset?: number
}

// 활성 교인 목록 조회 (관리자용)
export async function getActiveMembers(filters: MemberFilters = {}) {
  let query = supabase
    .from('church_members')
    .select('*')
    .eq('status', 'active')
    .order('korean_name', { ascending: true })

  if (filters.memberType) {
    query = query.eq('member_type', filters.memberType)
  }

  if (filters.department) {
    query = query.eq('department', filters.department)
  }

  if (filters.search) {
    query = query.or(`korean_name.ilike.%${filters.search}%,english_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,phone.ilike.%${filters.search}%`)
  }

  if (filters.limit) {
    query = query.limit(filters.limit)
  }

  if (filters.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching active members:', error)
    throw error
  }

  return data as ChurchMember[]
}

// 모든 교인 조회 (관리자용)
export async function getAllMembers(filters: MemberFilters = {}) {
  let query = supabase
    .from('church_members')
    .select('*')
    .order('korean_name', { ascending: true })

  if (filters.memberType) {
    query = query.eq('member_type', filters.memberType)
  }

  if (filters.status) {
    query = query.eq('status', filters.status)
  }

  if (filters.department) {
    query = query.eq('department', filters.department)
  }

  if (filters.search) {
    query = query.or(`korean_name.ilike.%${filters.search}%,english_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,phone.ilike.%${filters.search}%`)
  }

  if (filters.limit) {
    query = query.limit(filters.limit)
  }

  if (filters.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching all members:', error)
    throw error
  }

  return data as ChurchMember[]
}

// 교인 단건 조회
export async function getMemberById(id: string) {
  const { data, error } = await supabase
    .from('church_members')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching member:', error)
    throw error
  }

  return data as ChurchMember
}

// 교인 등록 (관리자)
export async function createMember(member: ChurchMemberInsert) {
  const { data, error } = await supabase
    .from('church_members')
    .insert(member)
    .select()
    .single()

  if (error) {
    console.error('Error creating member:', error)
    throw error
  }

  return data as ChurchMember
}

// 교인 수정 (관리자)
export async function updateMember(id: string, updates: Partial<ChurchMemberInsert>) {
  const { data, error } = await supabase
    .from('church_members')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating member:', error)
    throw error
  }

  return data as ChurchMember
}

// 교인 삭제 (관리자)
export async function deleteMember(id: string) {
  const { error } = await supabase
    .from('church_members')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting member:', error)
    throw error
  }

  return true
}

// 부서 목록 조회
export async function getDepartments() {
  const { data, error } = await supabase
    .from('church_members')
    .select('department')
    .not('department', 'is', null)

  if (error) {
    console.error('Error fetching departments:', error)
    throw error
  }

  // 중복 제거
  const uniqueDepartments = Array.from(new Set(data?.map(d => d.department).filter(Boolean)))
  return uniqueDepartments as string[]
}

// 교인 통계
export async function getMemberStats() {
  const { count: total } = await supabase
    .from('church_members')
    .select('*', { count: 'exact', head: true })

  const { count: active } = await supabase
    .from('church_members')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')

  const { count: baptized } = await supabase
    .from('church_members')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')
    .not('baptism_date', 'is', null)

  // 직분별 통계
  const { data: typeStats } = await supabase
    .from('church_members')
    .select('member_type')
    .eq('status', 'active')

  const typeCount: Record<MemberType, number> = {
    member: 0,
    deacon: 0,
    elder: 0,
    pastor: 0,
    staff: 0,
  }

  typeStats?.forEach((item) => {
    typeCount[item.member_type as MemberType]++
  })

  // 이번 달 등록자
  const thisMonth = new Date()
  thisMonth.setDate(1)
  const { count: newThisMonth } = await supabase
    .from('church_members')
    .select('*', { count: 'exact', head: true })
    .gte('membership_date', thisMonth.toISOString().split('T')[0])

  return {
    total: total ?? 0,
    active: active ?? 0,
    baptized: baptized ?? 0,
    newThisMonth: newThisMonth ?? 0,
    byType: typeCount,
  }
}

// 생일자 목록 (이번 달)
export async function getBirthdaysThisMonth() {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')

  const { data, error } = await supabase
    .from('church_members')
    .select('*')
    .eq('status', 'active')
    .not('birth_date', 'is', null)

  if (error) {
    console.error('Error fetching birthdays:', error)
    throw error
  }

  // 이번 달 생일자 필터링
  const birthdays = data?.filter((member) => {
    if (!member.birth_date) return false
    const memberMonth = member.birth_date.split('-')[1]
    return memberMonth === month
  })

  return birthdays as ChurchMember[]
}

// 프로필 이미지 업로드
export async function uploadMemberImage(file: File, memberId: string) {
  const fileExt = file.name.split('.').pop()
  const fileName = `member_${memberId}.${fileExt}`

  const { data, error } = await supabase.storage
    .from('members')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true,
    })

  if (error) {
    console.error('Error uploading member image:', error)
    throw error
  }

  const { data: publicUrlData } = supabase.storage
    .from('members')
    .getPublicUrl(fileName)

  return publicUrlData.publicUrl
}

// CSV 내보내기용 데이터
export async function exportMembersToCSV(filters: MemberFilters = {}) {
  const members = await getAllMembers(filters)

  const headers = ['이름(한글)', '이름(영문)', '이메일', '전화', '주소', '생년월일', '성별', '직분', '부서', '세례여부', '등록일', '상태']
  const rows = members.map((m) => [
    m.korean_name,
    m.english_name || '',
    m.email || '',
    m.phone || '',
    m.address || '',
    m.birth_date || '',
    m.gender === 'male' ? '남' : m.gender === 'female' ? '여' : '',
    m.member_type === 'member' ? '성도' :
    m.member_type === 'deacon' ? '집사' :
    m.member_type === 'elder' ? '장로' :
    m.member_type === 'pastor' ? '목사' : '교역자',
    m.department || '',
    m.baptized ? '예' : '아니오',
    m.registered_date,
    m.status === 'active' ? '활동' :
    m.status === 'inactive' ? '비활동' :
    m.status === 'transferred' ? '이적' : '사망',
  ])

  const csv = [headers, ...rows].map((row) => row.join(',')).join('\n')
  return csv
}
