import { supabase } from '../../lib/supabase'
import type { EmailSubscriber, EmailSubscriberInsert } from '../../types/supabase'

export interface SubscriberFilters {
  isActive?: boolean
  search?: string
  limit?: number
  offset?: number
}

// 활성 구독자 목록 조회 (관리자용)
export async function getActiveSubscribers() {
  const { data, error } = await supabase
    .from('email_subscribers')
    .select('*')
    .eq('is_active', true)
    .order('subscribed_at', { ascending: false })

  if (error) {
    console.error('Error fetching active subscribers:', error)
    throw error
  }

  return data as EmailSubscriber[]
}

// 모든 구독자 조회 (관리자용)
export async function getAllSubscribers(filters: SubscriberFilters = {}) {
  let query = supabase
    .from('email_subscribers')
    .select('*')
    .order('subscribed_at', { ascending: false })

  if (filters.isActive !== undefined) {
    query = query.eq('is_active', filters.isActive)
  }

  if (filters.search) {
    query = query.or(`email.ilike.%${filters.search}%,name.ilike.%${filters.search}%`)
  }

  if (filters.limit) {
    query = query.limit(filters.limit)
  }

  if (filters.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching all subscribers:', error)
    throw error
  }

  return data as EmailSubscriber[]
}

// 구독자 단건 조회
export async function getSubscriberById(id: string) {
  const { data, error } = await supabase
    .from('email_subscribers')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching subscriber:', error)
    throw error
  }

  return data as EmailSubscriber
}

// 이메일로 구독자 조회
export async function getSubscriberByEmail(email: string) {
  const { data, error } = await supabase
    .from('email_subscribers')
    .select('*')
    .eq('email', email.toLowerCase())
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching subscriber by email:', error)
    throw error
  }

  return data as EmailSubscriber | null
}

// 구독 등록 (공개)
export async function subscribe(email: string, name?: string) {
  const normalizedEmail = email.toLowerCase().trim()

  // 이미 구독 중인지 확인
  const existing = await getSubscriberByEmail(normalizedEmail)

  if (existing) {
    if (existing.is_active) {
      throw new Error('이미 구독 중입니다.')
    }

    // 비활성화된 구독자 재활성화
    const { data, error } = await supabase
      .from('email_subscribers')
      .update({
        is_active: true,
        unsubscribed_at: null,
        name: name || existing.name,
      })
      .eq('id', existing.id)
      .select()
      .single()

    if (error) throw error
    return data as EmailSubscriber
  }

  // 새 구독자 등록
  const { data, error } = await supabase
    .from('email_subscribers')
    .insert({
      email: normalizedEmail,
      name: name || null,
      is_active: true,
    })
    .select()
    .single()

  if (error) {
    console.error('Error subscribing:', error)
    throw error
  }

  return data as EmailSubscriber
}

// 구독 해제 (공개)
export async function unsubscribe(email: string) {
  const normalizedEmail = email.toLowerCase().trim()

  const { data, error } = await supabase
    .from('email_subscribers')
    .update({
      is_active: false,
      unsubscribed_at: new Date().toISOString(),
    })
    .eq('email', normalizedEmail)
    .select()
    .single()

  if (error) {
    console.error('Error unsubscribing:', error)
    throw error
  }

  return data as EmailSubscriber
}

// 구독자 정보 수정 (관리자)
export async function updateSubscriber(id: string, updates: Partial<EmailSubscriberInsert>) {
  const { data, error } = await supabase
    .from('email_subscribers')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating subscriber:', error)
    throw error
  }

  return data as EmailSubscriber
}

// 구독자 삭제 (관리자)
export async function deleteSubscriber(id: string) {
  const { error } = await supabase
    .from('email_subscribers')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting subscriber:', error)
    throw error
  }

  return true
}

// 구독자 일괄 삭제 (관리자)
export async function deleteSubscribers(ids: string[]) {
  const { error } = await supabase
    .from('email_subscribers')
    .delete()
    .in('id', ids)

  if (error) {
    console.error('Error deleting subscribers:', error)
    throw error
  }

  return true
}

// 구독자 통계
export async function getSubscriberStats() {
  const { count: total } = await supabase
    .from('email_subscribers')
    .select('*', { count: 'exact', head: true })

  const { count: active } = await supabase
    .from('email_subscribers')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)

  // 이번 주 신규 구독자
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  const { count: thisWeek } = await supabase
    .from('email_subscribers')
    .select('*', { count: 'exact', head: true })
    .gte('subscribed_at', oneWeekAgo.toISOString())

  return {
    total: total ?? 0,
    active: active ?? 0,
    inactive: (total ?? 0) - (active ?? 0),
    thisWeek: thisWeek ?? 0,
  }
}

// 구독자 이메일 목록 (뉴스레터 발송용)
export async function getSubscriberEmails() {
  const { data, error } = await supabase
    .from('email_subscribers')
    .select('email, name')
    .eq('is_active', true)

  if (error) {
    console.error('Error fetching subscriber emails:', error)
    throw error
  }

  return data as { email: string; name: string | null }[]
}

// CSV 내보내기용 데이터
export async function exportSubscribersToCSV() {
  const subscribers = await getAllSubscribers()

  const headers = ['이메일', '이름', '구독일', '상태']
  const rows = subscribers.map((s) => [
    s.email,
    s.name || '',
    new Date(s.subscribed_at).toLocaleDateString('ko-KR'),
    s.is_active ? '활성' : '비활성',
  ])

  const csv = [headers, ...rows].map((row) => row.join(',')).join('\n')
  return csv
}
