import { supabase } from '../../lib/supabase'
import type {
  BibleReadingPlan,
  BibleReadingEntry,
  BibleReadingPlanInsert,
  BibleReadingEntryInsert
} from '../../types/supabase'

// ========== 읽기 계획 관련 함수 ==========

// 활성화된 읽기 계획 목록 조회
export async function getActivePlans() {
  const { data, error } = await supabase
    .from('bible_reading_plans')
    .select('*')
    .eq('is_active', true)
    .order('year', { ascending: false })

  if (error) {
    console.error('Error fetching active plans:', error)
    throw error
  }

  return data as BibleReadingPlan[]
}

// 모든 읽기 계획 조회 (관리자용)
export async function getAllPlans() {
  const { data, error } = await supabase
    .from('bible_reading_plans')
    .select('*')
    .order('year', { ascending: false })

  if (error) {
    console.error('Error fetching all plans:', error)
    throw error
  }

  return data as BibleReadingPlan[]
}

// 특정 연도의 읽기 계획 조회
export async function getPlanByYear(year: number) {
  const { data, error } = await supabase
    .from('bible_reading_plans')
    .select('*')
    .eq('year', year)
    .eq('is_active', true)
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching plan by year:', error)
    throw error
  }

  return data as BibleReadingPlan | null
}

// 읽기 계획 단건 조회
export async function getPlanById(id: string) {
  const { data, error } = await supabase
    .from('bible_reading_plans')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching plan:', error)
    throw error
  }

  return data as BibleReadingPlan
}

// 읽기 계획 생성 (관리자)
export async function createPlan(plan: BibleReadingPlanInsert) {
  const { data, error } = await supabase
    .from('bible_reading_plans')
    .insert(plan)
    .select()
    .single()

  if (error) {
    console.error('Error creating plan:', error)
    throw error
  }

  return data as BibleReadingPlan
}

// 읽기 계획 수정 (관리자)
export async function updatePlan(id: string, updates: Partial<BibleReadingPlanInsert>) {
  const { data, error } = await supabase
    .from('bible_reading_plans')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating plan:', error)
    throw error
  }

  return data as BibleReadingPlan
}

// 읽기 계획 삭제 (관리자)
export async function deletePlan(id: string) {
  const { error } = await supabase
    .from('bible_reading_plans')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting plan:', error)
    throw error
  }

  return true
}

// ========== 읽기 항목 관련 함수 ==========

// 특정 계획의 모든 읽기 항목 조회
export async function getEntriesByPlan(planId: string) {
  const { data, error } = await supabase
    .from('bible_reading_entries')
    .select('*')
    .eq('plan_id', planId)
    .order('reading_date', { ascending: true })

  if (error) {
    console.error('Error fetching entries:', error)
    throw error
  }

  return data as BibleReadingEntry[]
}

// 특정 월의 읽기 항목 조회
export async function getEntriesByMonth(planId: string, year: number, month: number) {
  const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0]
  const endDate = new Date(year, month, 0).toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('bible_reading_entries')
    .select('*')
    .eq('plan_id', planId)
    .gte('reading_date', startDate)
    .lte('reading_date', endDate)
    .order('reading_date', { ascending: true })

  if (error) {
    console.error('Error fetching entries by month:', error)
    throw error
  }

  return data as BibleReadingEntry[]
}

// 오늘의 읽기 항목 조회
export async function getTodayReading(planId: string) {
  const today = new Date().toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('bible_reading_entries')
    .select('*')
    .eq('plan_id', planId)
    .eq('reading_date', today)
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching today reading:', error)
    throw error
  }

  return data as BibleReadingEntry | null
}

// 특정 날짜의 읽기 항목 조회
export async function getReadingByDate(planId: string, date: string) {
  const { data, error } = await supabase
    .from('bible_reading_entries')
    .select('*')
    .eq('plan_id', planId)
    .eq('reading_date', date)
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching reading by date:', error)
    throw error
  }

  return data as BibleReadingEntry | null
}

// 읽기 항목 생성 (관리자)
export async function createEntry(entry: BibleReadingEntryInsert) {
  const { data, error } = await supabase
    .from('bible_reading_entries')
    .insert(entry)
    .select()
    .single()

  if (error) {
    console.error('Error creating entry:', error)
    throw error
  }

  return data as BibleReadingEntry
}

// 여러 읽기 항목 일괄 생성 (관리자)
export async function createEntries(entries: BibleReadingEntryInsert[]) {
  const { data, error } = await supabase
    .from('bible_reading_entries')
    .insert(entries)
    .select()

  if (error) {
    console.error('Error creating entries:', error)
    throw error
  }

  return data as BibleReadingEntry[]
}

// 읽기 항목 수정 (관리자)
export async function updateEntry(id: string, updates: Partial<BibleReadingEntryInsert>) {
  const { data, error } = await supabase
    .from('bible_reading_entries')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating entry:', error)
    throw error
  }

  return data as BibleReadingEntry
}

// 읽기 항목 삭제 (관리자)
export async function deleteEntry(id: string) {
  const { error } = await supabase
    .from('bible_reading_entries')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting entry:', error)
    throw error
  }

  return true
}

// 특정 계획의 모든 읽기 항목 삭제 (관리자)
export async function deleteEntriesByPlan(planId: string) {
  const { error } = await supabase
    .from('bible_reading_entries')
    .delete()
    .eq('plan_id', planId)

  if (error) {
    console.error('Error deleting entries:', error)
    throw error
  }

  return true
}

// ========== 캘린더 데이터 생성 헬퍼 ==========

export interface CalendarDay {
  date: string
  dayOfMonth: number
  isCurrentMonth: boolean
  reading?: BibleReadingEntry
}

// 특정 월의 캘린더 데이터 생성
export function generateCalendarData(
  year: number,
  month: number,
  readings: BibleReadingEntry[]
): CalendarDay[] {
  const firstDay = new Date(year, month - 1, 1)
  const lastDay = new Date(year, month, 0)
  const startDayOfWeek = firstDay.getDay()

  const calendar: CalendarDay[] = []

  // 이전 달 날짜 채우기
  const prevMonth = new Date(year, month - 1, 0)
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const dayOfMonth = prevMonth.getDate() - i
    const date = new Date(year, month - 2, dayOfMonth).toISOString().split('T')[0]
    calendar.push({
      date,
      dayOfMonth,
      isCurrentMonth: false,
    })
  }

  // 현재 달 날짜 채우기
  for (let day = 1; day <= lastDay.getDate(); day++) {
    const date = new Date(year, month - 1, day).toISOString().split('T')[0]
    const reading = readings.find(r => r.reading_date === date)
    calendar.push({
      date,
      dayOfMonth: day,
      isCurrentMonth: true,
      reading,
    })
  }

  // 다음 달 날짜 채우기 (6주를 채우기 위해)
  const remainingDays = 42 - calendar.length
  for (let day = 1; day <= remainingDays; day++) {
    const date = new Date(year, month, day).toISOString().split('T')[0]
    calendar.push({
      date,
      dayOfMonth: day,
      isCurrentMonth: false,
    })
  }

  return calendar
}

// 성경읽기표 통계
export async function getBibleReadingStats(planId: string) {
  const { count: totalEntries } = await supabase
    .from('bible_reading_entries')
    .select('id', { count: 'exact', head: true })
    .eq('plan_id', planId)

  const today = new Date().toISOString().split('T')[0]
  const { count: completedDays } = await supabase
    .from('bible_reading_entries')
    .select('id', { count: 'exact', head: true })
    .eq('plan_id', planId)
    .lte('reading_date', today)

  return {
    totalEntries: totalEntries || 0,
    completedDays: completedDays || 0,
    progressPercent: totalEntries ? Math.round((completedDays || 0) / totalEntries * 100) : 0,
  }
}
