import { supabase } from '../../lib/supabase'
import type { AdminUser } from '../../types/supabase'

export type AdminRole = 'admin' | 'super_admin'

export interface AdminUserWithAuth {
  id: string
  email: string
  name: string
  role: AdminRole
  created_at: string | null
  last_login: string | null
}

// 모든 관리자 목록 조회
export async function getAllAdmins(): Promise<AdminUserWithAuth[]> {
  const { data, error } = await supabase
    .from('admin_users')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching admins:', error)
    throw error
  }

  return data as AdminUserWithAuth[]
}

// 관리자 단건 조회
export async function getAdminById(id: string): Promise<AdminUserWithAuth | null> {
  const { data, error } = await supabase
    .from('admin_users')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    console.error('Error fetching admin:', error)
    throw error
  }

  return data as AdminUserWithAuth
}

// 이메일로 관리자 조회
export async function getAdminByEmail(email: string): Promise<AdminUserWithAuth | null> {
  const { data, error } = await supabase
    .from('admin_users')
    .select('*')
    .eq('email', email)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    console.error('Error fetching admin by email:', error)
    throw error
  }

  return data as AdminUserWithAuth
}

// 관리자 추가 (이메일로 검색하여 auth.users에서 id 가져오기)
export async function addAdmin(email: string, name: string, role: AdminRole = 'admin'): Promise<AdminUserWithAuth> {
  // 먼저 해당 이메일로 이미 관리자가 등록되어 있는지 확인
  const existing = await getAdminByEmail(email)
  if (existing) {
    throw new Error('이미 등록된 관리자입니다.')
  }

  // admin_users 테이블에 추가 (id는 나중에 로그인 시 업데이트)
  // 임시로 UUID 생성
  const { data, error } = await supabase
    .from('admin_users')
    .insert({
      email,
      name,
      role,
    })
    .select()
    .single()

  if (error) {
    console.error('Error adding admin:', error)
    throw error
  }

  return data as AdminUserWithAuth
}

// 관리자 정보 수정
export async function updateAdmin(
  id: string,
  updates: { name?: string; role?: AdminRole }
): Promise<AdminUserWithAuth> {
  const { data, error } = await supabase
    .from('admin_users')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating admin:', error)
    throw error
  }

  return data as AdminUserWithAuth
}

// 관리자 삭제
export async function deleteAdmin(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('admin_users')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting admin:', error)
    throw error
  }

  return true
}

// 관리자 통계
export async function getAdminStats(): Promise<{
  total: number
  admins: number
  superAdmins: number
}> {
  const { count: total } = await supabase
    .from('admin_users')
    .select('*', { count: 'exact', head: true })

  const { count: superAdmins } = await supabase
    .from('admin_users')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'super_admin')

  return {
    total: total ?? 0,
    admins: (total ?? 0) - (superAdmins ?? 0),
    superAdmins: superAdmins ?? 0,
  }
}

// 현재 사용자가 super_admin인지 확인
export async function isSuperAdmin(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('admin_users')
    .select('role')
    .eq('id', userId)
    .single()

  if (error || !data) return false
  return data.role === 'super_admin'
}
