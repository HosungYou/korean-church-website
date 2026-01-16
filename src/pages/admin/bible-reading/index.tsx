import { useEffect, useState, useCallback } from 'react'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import {
  Plus,
  Save,
  Trash2,
  Book,
  Calendar,
  ChevronLeft,
  ChevronRight,
  X,
  BookOpen,
  FileText,
  Heart,
  MessageCircle,
} from 'lucide-react'
import AdminLayout from '@/components/AdminLayout'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import {
  getAllPlans,
  createPlan,
  updatePlan,
  deletePlan,
  getEntriesByMonth,
  createEntry,
  updateEntry,
  deleteEntry,
  generateCalendarData,
  formatDateWithDay,
  type CalendarDay
} from '../../../utils/bibleReadingService'
import type { BibleReadingPlan, BibleReadingEntry, BibleReadingEntryInsert } from '../../../../types/supabase'

// ===========================================
// VS Design Diverge: Bible Reading Management
// Editorial Split Layout: Calendar + Editor
// OKLCH Color System + Paper Texture
// ===========================================

const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토']
const MONTH_NAMES = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']

interface DevotionalForm {
  reading_date: string
  title: string
  scripture_reference: string
  pastor_notes: string
  application: string
  prayer: string
  // Legacy fields for backwards compatibility
  old_testament: string
  new_testament: string
  psalms: string
  proverbs: string
}

const emptyForm: DevotionalForm = {
  reading_date: '',
  title: '',
  scripture_reference: '',
  pastor_notes: '',
  application: '',
  prayer: '',
  old_testament: '',
  new_testament: '',
  psalms: '',
  proverbs: '',
}

const AdminBibleReadingPage = () => {
  const { admin } = useAdminAuth()

  // Plans state
  const [plans, setPlans] = useState<BibleReadingPlan[]>([])
  const [selectedPlan, setSelectedPlan] = useState<BibleReadingPlan | null>(null)
  const [showPlanModal, setShowPlanModal] = useState(false)
  const [planForm, setPlanForm] = useState({ title: '', description: '', year: new Date().getFullYear(), is_active: true })

  // Calendar state
  const [currentDate, setCurrentDate] = useState(new Date())
  const [calendarData, setCalendarData] = useState<CalendarDay[]>([])
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null)

  // Editor state
  const [form, setForm] = useState<DevotionalForm>(emptyForm)
  const [editingEntry, setEditingEntry] = useState<BibleReadingEntry | null>(null)

  // Loading states
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth() + 1

  // Load plans on mount
  useEffect(() => {
    if (!admin) return
    fetchPlans()
  }, [admin])

  // Load entries when plan or month changes
  useEffect(() => {
    if (!selectedPlan) return
    loadMonthEntries()
  }, [selectedPlan, year, month])

  const fetchPlans = async () => {
    try {
      setLoading(true)
      const data = await getAllPlans()
      setPlans(data)
      if (data.length > 0) {
        setSelectedPlan(data[0])
      }
    } catch (error) {
      console.error('계획 로드 오류:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadMonthEntries = async () => {
    if (!selectedPlan) return
    try {
      const entries = await getEntriesByMonth(selectedPlan.id, year, month)
      const calendar = generateCalendarData(year, month, entries)
      setCalendarData(calendar)
    } catch (error) {
      console.error('항목 로드 오류:', error)
    }
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 2, 1))
    setSelectedDay(null)
    setForm(emptyForm)
    setEditingEntry(null)
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month, 1))
    setSelectedDay(null)
    setForm(emptyForm)
    setEditingEntry(null)
  }

  const handleDayClick = useCallback((day: CalendarDay) => {
    if (!day.isCurrentMonth) return

    setSelectedDay(day)

    if (day.reading) {
      // Edit existing entry
      setEditingEntry(day.reading)
      setForm({
        reading_date: day.reading.reading_date,
        title: day.reading.title || '',
        scripture_reference: day.reading.scripture_reference || '',
        pastor_notes: day.reading.pastor_notes || '',
        application: day.reading.application || '',
        prayer: day.reading.prayer || '',
        old_testament: day.reading.old_testament || '',
        new_testament: day.reading.new_testament || '',
        psalms: day.reading.psalms || '',
        proverbs: day.reading.proverbs || '',
      })
    } else {
      // Create new entry
      setEditingEntry(null)
      setForm({
        ...emptyForm,
        reading_date: day.date,
      })
    }
  }, [])

  const handleSave = async () => {
    if (!selectedPlan || !form.reading_date) {
      alert('날짜를 선택해주세요.')
      return
    }

    try {
      setSaving(true)

      const entryData: BibleReadingEntryInsert = {
        plan_id: selectedPlan.id,
        reading_date: form.reading_date,
        title: form.title || null,
        scripture_reference: form.scripture_reference || null,
        pastor_notes: form.pastor_notes || null,
        application: form.application || null,
        prayer: form.prayer || null,
        old_testament: form.old_testament || null,
        new_testament: form.new_testament || null,
        psalms: form.psalms || null,
        proverbs: form.proverbs || null,
      }

      if (editingEntry) {
        await updateEntry(editingEntry.id, entryData)
      } else {
        await createEntry(entryData)
      }

      await loadMonthEntries()
      alert(editingEntry ? '수정되었습니다.' : '저장되었습니다.')
    } catch (error) {
      console.error('저장 오류:', error)
      alert('저장 중 오류가 발생했습니다.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!editingEntry) return
    if (!confirm('이 묵상을 삭제하시겠습니까?')) return

    try {
      setSaving(true)
      await deleteEntry(editingEntry.id)
      await loadMonthEntries()
      setSelectedDay(null)
      setForm(emptyForm)
      setEditingEntry(null)
      alert('삭제되었습니다.')
    } catch (error) {
      console.error('삭제 오류:', error)
      alert('삭제 중 오류가 발생했습니다.')
    } finally {
      setSaving(false)
    }
  }

  const handleCreatePlan = async () => {
    if (!planForm.title.trim()) {
      alert('계획 이름을 입력해주세요.')
      return
    }
    try {
      setSaving(true)
      await createPlan(planForm)
      await fetchPlans()
      setShowPlanModal(false)
      setPlanForm({ title: '', description: '', year: new Date().getFullYear(), is_active: true })
    } catch (error) {
      console.error('계획 생성 오류:', error)
      alert('생성 중 오류가 발생했습니다.')
    } finally {
      setSaving(false)
    }
  }

  const handleDeletePlan = async (id: string) => {
    if (!confirm('이 계획과 모든 묵상을 삭제하시겠습니까?')) return
    try {
      await deletePlan(id)
      await fetchPlans()
    } catch (error) {
      console.error('삭제 오류:', error)
    }
  }

  // Count entries for current month
  const entriesThisMonth = calendarData.filter(d => d.isCurrentMonth && d.reading).length

  return (
    <AdminLayout title="성경읽기표 관리" subtitle="매일 묵상을 등록하고 관리하세요">
      {/* Plan Selector Header */}
      <div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 p-4 rounded-sm"
        style={{
          background: 'oklch(0.985 0.003 75)',
          border: '1px solid oklch(0.92 0.005 75)'
        }}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-10 h-10 rounded-sm flex items-center justify-center"
            style={{ background: 'oklch(0.45 0.12 265 / 0.1)' }}
          >
            <Book className="w-5 h-5" style={{ color: 'oklch(0.45 0.12 265)' }} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'oklch(0.55 0.01 75)' }}>
              읽기 계획
            </label>
            {plans.length > 0 ? (
              <select
                value={selectedPlan?.id || ''}
                onChange={(e) => {
                  const plan = plans.find(p => p.id === e.target.value)
                  setSelectedPlan(plan || null)
                  setSelectedDay(null)
                  setForm(emptyForm)
                  setEditingEntry(null)
                }}
                className="px-3 py-1.5 rounded-sm text-sm font-medium focus:outline-none"
                style={{
                  background: 'oklch(0.97 0.005 265)',
                  border: '1px solid oklch(0.90 0.01 265)',
                  color: 'oklch(0.25 0.02 75)',
                  minWidth: '200px'
                }}
              >
                {plans.map(plan => (
                  <option key={plan.id} value={plan.id}>
                    {plan.title} ({plan.year}년)
                  </option>
                ))}
              </select>
            ) : (
              <span className="text-sm" style={{ color: 'oklch(0.55 0.01 75)' }}>
                등록된 계획 없음
              </span>
            )}
          </div>
        </div>
        <button
          onClick={() => setShowPlanModal(true)}
          className="inline-flex items-center px-4 py-2 rounded-sm text-sm font-medium transition-all hover:-translate-y-0.5"
          style={{
            background: 'oklch(0.45 0.12 265)',
            color: 'oklch(0.98 0.003 75)',
          }}
        >
          <Plus className="w-4 h-4 mr-1.5" />
          새 계획
        </button>
      </div>

      {/* Main Content: Calendar + Editor Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel: Calendar */}
        <div
          className="rounded-sm p-5"
          style={{
            background: 'oklch(0.985 0.003 75)',
            border: '1px solid oklch(0.92 0.005 75)'
          }}
        >
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-5">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-sm transition-all hover:scale-105"
              style={{ background: 'oklch(0.92 0.005 75)' }}
            >
              <ChevronLeft className="w-5 h-5" style={{ color: 'oklch(0.45 0.01 75)' }} />
            </button>
            <div className="text-center">
              <h2
                className="font-headline font-bold text-xl"
                style={{ color: 'oklch(0.22 0.07 265)', letterSpacing: '-0.02em' }}
              >
                {year}년 {MONTH_NAMES[month - 1]}
              </h2>
              <p className="text-xs mt-1" style={{ color: 'oklch(0.55 0.01 75)' }}>
                {entriesThisMonth}개의 묵상 등록됨
              </p>
            </div>
            <button
              onClick={handleNextMonth}
              className="p-2 rounded-sm transition-all hover:scale-105"
              style={{ background: 'oklch(0.92 0.005 75)' }}
            >
              <ChevronRight className="w-5 h-5" style={{ color: 'oklch(0.45 0.01 75)' }} />
            </button>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 mb-2">
            {DAY_NAMES.map((day, idx) => (
              <div
                key={day}
                className="text-center py-2 text-xs font-medium"
                style={{
                  color: idx === 0 ? 'oklch(0.55 0.15 25)' : idx === 6 ? 'oklch(0.45 0.12 265)' : 'oklch(0.55 0.01 75)'
                }}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarData.map((day, index) => {
              const isToday = day.date === new Date().toISOString().split('T')[0]
              const hasReading = !!day.reading
              const hasDevotional = hasReading && (day.reading?.title || day.reading?.pastor_notes)
              const isSelected = selectedDay?.date === day.date
              const dayOfWeek = index % 7

              return (
                <button
                  key={`${day.date}-${index}`}
                  onClick={() => day.isCurrentMonth && handleDayClick(day)}
                  disabled={!day.isCurrentMonth}
                  className={`
                    relative aspect-square p-1 rounded-sm text-sm transition-all duration-200
                    ${day.isCurrentMonth ? 'hover:scale-105 cursor-pointer' : 'opacity-30 cursor-default'}
                    ${isSelected ? 'ring-2 ring-offset-1' : ''}
                  `}
                  style={{
                    background: isSelected
                      ? 'oklch(0.45 0.12 265)'
                      : hasDevotional
                        ? 'oklch(0.55 0.15 145 / 0.15)'
                        : hasReading
                          ? 'oklch(0.72 0.10 75 / 0.2)'
                          : 'transparent',
                    color: isSelected
                      ? 'white'
                      : dayOfWeek === 0 && day.isCurrentMonth
                        ? 'oklch(0.55 0.15 25)'
                        : dayOfWeek === 6 && day.isCurrentMonth
                          ? 'oklch(0.45 0.12 265)'
                          : 'oklch(0.35 0.02 75)',
                    outlineColor: 'oklch(0.45 0.12 265)',
                  }}
                  title={day.reading?.title ? `${day.reading.scripture_reference}: ${day.reading.title}` : undefined}
                >
                  <span className={`font-medium ${isToday ? 'underline underline-offset-2' : ''}`}>
                    {day.dayOfMonth}
                  </span>
                  {hasDevotional && day.isCurrentMonth && !isSelected && (
                    <div
                      className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
                      style={{ background: 'oklch(0.45 0.15 145)' }}
                    />
                  )}
                </button>
              )
            })}
          </div>

          {/* Legend */}
          <div
            className="mt-4 pt-4 flex flex-wrap items-center gap-4 text-xs"
            style={{ borderTop: '1px solid oklch(0.92 0.005 75)' }}
          >
            <div className="flex items-center gap-1.5">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ background: 'oklch(0.55 0.15 145 / 0.15)' }}
              />
              <span style={{ color: 'oklch(0.55 0.01 75)' }}>묵상 있음</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ background: 'oklch(0.72 0.10 75 / 0.2)' }}
              />
              <span style={{ color: 'oklch(0.55 0.01 75)' }}>기본 정보만</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="underline" style={{ color: 'oklch(0.55 0.01 75)' }}>오늘</span>
            </div>
          </div>
        </div>

        {/* Right Panel: Editor */}
        <div
          className="rounded-sm"
          style={{
            background: 'oklch(0.985 0.003 75)',
            border: '1px solid oklch(0.92 0.005 75)'
          }}
        >
          {selectedDay ? (
            <div className="p-5">
              {/* Editor Header */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className="h-0.5 w-6"
                      style={{ background: 'linear-gradient(90deg, oklch(0.72 0.10 75), oklch(0.45 0.12 265))' }}
                    />
                    <span
                      className="text-xs font-medium tracking-wider uppercase"
                      style={{ color: 'oklch(0.72 0.10 75)' }}
                    >
                      {editingEntry ? '묵상 수정' : '새 묵상'}
                    </span>
                  </div>
                  <h3
                    className="font-headline font-bold text-lg"
                    style={{ color: 'oklch(0.22 0.07 265)' }}
                  >
                    {formatDateWithDay(selectedDay.date)}
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setSelectedDay(null)
                    setForm(emptyForm)
                    setEditingEntry(null)
                  }}
                  className="p-2 rounded-sm transition-colors"
                  style={{ color: 'oklch(0.55 0.01 75)' }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Fields */}
              <div className="space-y-4 max-h-[calc(100vh-400px)] overflow-y-auto pr-2">
                {/* Scripture Reference */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2" style={{ color: 'oklch(0.45 0.01 75)' }}>
                    <BookOpen className="w-4 h-4" style={{ color: 'oklch(0.45 0.12 265)' }} />
                    본문 (예: 베드로전서 3:1-7)
                  </label>
                  <input
                    type="text"
                    value={form.scripture_reference}
                    onChange={(e) => setForm({ ...form, scripture_reference: e.target.value })}
                    placeholder="베드로전서 3:1-7"
                    className="w-full px-3 py-2.5 rounded-sm text-sm focus:outline-none"
                    style={{
                      background: 'oklch(0.97 0.005 265)',
                      border: '1px solid oklch(0.90 0.01 265)',
                      color: 'oklch(0.25 0.02 75)',
                    }}
                  />
                </div>

                {/* Title */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2" style={{ color: 'oklch(0.45 0.01 75)' }}>
                    <FileText className="w-4 h-4" style={{ color: 'oklch(0.72 0.10 75)' }} />
                    제목
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="부부안에 이뤄지는 아름다운 삶"
                    className="w-full px-3 py-2.5 rounded-sm text-sm focus:outline-none"
                    style={{
                      background: 'oklch(0.97 0.005 265)',
                      border: '1px solid oklch(0.90 0.01 265)',
                      color: 'oklch(0.25 0.02 75)',
                    }}
                  />
                </div>

                {/* Pastor Notes */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2" style={{ color: 'oklch(0.45 0.01 75)' }}>
                    <Calendar className="w-4 h-4" style={{ color: 'oklch(0.45 0.12 265)' }} />
                    목사님 노트
                  </label>
                  <textarea
                    value={form.pastor_notes}
                    onChange={(e) => setForm({ ...form, pastor_notes: e.target.value })}
                    rows={8}
                    placeholder="본문 해설을 입력하세요..."
                    className="w-full px-3 py-2.5 rounded-sm text-sm focus:outline-none resize-none leading-relaxed"
                    style={{
                      background: 'oklch(0.97 0.005 265)',
                      border: '1px solid oklch(0.90 0.01 265)',
                      color: 'oklch(0.25 0.02 75)',
                    }}
                  />
                </div>

                {/* Application */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2" style={{ color: 'oklch(0.45 0.01 75)' }}>
                    <Heart className="w-4 h-4" style={{ color: 'oklch(0.55 0.15 25)' }} />
                    적용
                  </label>
                  <textarea
                    value={form.application}
                    onChange={(e) => setForm({ ...form, application: e.target.value })}
                    rows={4}
                    placeholder="오늘의 적용을 입력하세요..."
                    className="w-full px-3 py-2.5 rounded-sm text-sm focus:outline-none resize-none leading-relaxed"
                    style={{
                      background: 'oklch(0.97 0.005 265)',
                      border: '1px solid oklch(0.90 0.01 265)',
                      color: 'oklch(0.25 0.02 75)',
                    }}
                  />
                </div>

                {/* Prayer */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2" style={{ color: 'oklch(0.45 0.01 75)' }}>
                    <MessageCircle className="w-4 h-4" style={{ color: 'oklch(0.50 0.15 300)' }} />
                    기도
                  </label>
                  <textarea
                    value={form.prayer}
                    onChange={(e) => setForm({ ...form, prayer: e.target.value })}
                    rows={4}
                    placeholder="기도 제목을 입력하세요..."
                    className="w-full px-3 py-2.5 rounded-sm text-sm focus:outline-none resize-none leading-relaxed"
                    style={{
                      background: 'oklch(0.97 0.005 265)',
                      border: '1px solid oklch(0.90 0.01 265)',
                      color: 'oklch(0.25 0.02 75)',
                    }}
                  />
                </div>

                {/* Legacy Bible Reading Fields (collapsible) */}
                <details className="pt-2">
                  <summary
                    className="text-xs font-medium cursor-pointer mb-3"
                    style={{ color: 'oklch(0.55 0.01 75)' }}
                  >
                    성경통독 필드 (선택사항)
                  </summary>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs mb-1" style={{ color: 'oklch(0.55 0.01 75)' }}>구약</label>
                      <input
                        type="text"
                        value={form.old_testament}
                        onChange={(e) => setForm({ ...form, old_testament: e.target.value })}
                        placeholder="창세기 1-3장"
                        className="w-full px-2 py-1.5 rounded-sm text-xs focus:outline-none"
                        style={{
                          background: 'oklch(0.97 0.005 265)',
                          border: '1px solid oklch(0.90 0.01 265)',
                          color: 'oklch(0.35 0.02 75)',
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs mb-1" style={{ color: 'oklch(0.55 0.01 75)' }}>신약</label>
                      <input
                        type="text"
                        value={form.new_testament}
                        onChange={(e) => setForm({ ...form, new_testament: e.target.value })}
                        placeholder="마태복음 1장"
                        className="w-full px-2 py-1.5 rounded-sm text-xs focus:outline-none"
                        style={{
                          background: 'oklch(0.97 0.005 265)',
                          border: '1px solid oklch(0.90 0.01 265)',
                          color: 'oklch(0.35 0.02 75)',
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs mb-1" style={{ color: 'oklch(0.55 0.01 75)' }}>시편</label>
                      <input
                        type="text"
                        value={form.psalms}
                        onChange={(e) => setForm({ ...form, psalms: e.target.value })}
                        placeholder="시편 1편"
                        className="w-full px-2 py-1.5 rounded-sm text-xs focus:outline-none"
                        style={{
                          background: 'oklch(0.97 0.005 265)',
                          border: '1px solid oklch(0.90 0.01 265)',
                          color: 'oklch(0.35 0.02 75)',
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs mb-1" style={{ color: 'oklch(0.55 0.01 75)' }}>잠언</label>
                      <input
                        type="text"
                        value={form.proverbs}
                        onChange={(e) => setForm({ ...form, proverbs: e.target.value })}
                        placeholder="잠언 1장"
                        className="w-full px-2 py-1.5 rounded-sm text-xs focus:outline-none"
                        style={{
                          background: 'oklch(0.97 0.005 265)',
                          border: '1px solid oklch(0.90 0.01 265)',
                          color: 'oklch(0.35 0.02 75)',
                        }}
                      />
                    </div>
                  </div>
                </details>
              </div>

              {/* Action Buttons */}
              <div
                className="flex items-center justify-between mt-5 pt-4"
                style={{ borderTop: '1px solid oklch(0.92 0.005 75)' }}
              >
                {editingEntry && (
                  <button
                    onClick={handleDelete}
                    disabled={saving}
                    className="inline-flex items-center px-4 py-2 rounded-sm text-sm font-medium transition-all hover:-translate-y-0.5"
                    style={{
                      background: 'oklch(0.55 0.18 25 / 0.1)',
                      color: 'oklch(0.50 0.18 25)',
                    }}
                  >
                    <Trash2 className="w-4 h-4 mr-1.5" />
                    삭제
                  </button>
                )}
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center px-5 py-2.5 rounded-sm text-sm font-medium transition-all hover:-translate-y-0.5 ml-auto"
                  style={{
                    background: 'oklch(0.45 0.12 265)',
                    color: 'oklch(0.98 0.003 75)',
                  }}
                >
                  {saving ? (
                    <div className="w-4 h-4 mr-1.5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'white', borderTopColor: 'transparent' }} />
                  ) : (
                    <Save className="w-4 h-4 mr-1.5" />
                  )}
                  {editingEntry ? '수정하기' : '저장하기'}
                </button>
              </div>
            </div>
          ) : (
            <div className="p-12 flex flex-col items-center justify-center h-full min-h-[400px]">
              <div
                className="w-16 h-16 rounded-sm flex items-center justify-center mb-4"
                style={{ background: 'oklch(0.45 0.12 265 / 0.1)' }}
              >
                <Calendar className="w-8 h-8" style={{ color: 'oklch(0.45 0.12 265)' }} />
              </div>
              <p className="text-sm font-medium mb-1" style={{ color: 'oklch(0.45 0.01 75)' }}>
                날짜를 선택하세요
              </p>
              <p className="text-xs text-center" style={{ color: 'oklch(0.55 0.01 75)' }}>
                캘린더에서 날짜를 클릭하면<br />묵상을 등록하거나 수정할 수 있습니다
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Plan Creation Modal */}
      {showPlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0"
            style={{ background: 'oklch(0.15 0.05 265 / 0.6)' }}
            onClick={() => setShowPlanModal(false)}
          />
          <div
            className="relative w-full max-w-md rounded-sm p-6 animate-[fadeInUp_0.3s_ease-out]"
            style={{
              background: 'oklch(0.985 0.003 75)',
              boxShadow: '0 8px 32px oklch(0.15 0.05 265 / 0.2)'
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div
                  className="h-0.5 w-6"
                  style={{ background: 'oklch(0.72 0.10 75)' }}
                />
                <h3
                  className="font-headline font-bold text-lg"
                  style={{ color: 'oklch(0.22 0.07 265)' }}
                >
                  새 읽기 계획
                </h3>
              </div>
              <button
                onClick={() => setShowPlanModal(false)}
                className="p-2"
                style={{ color: 'oklch(0.55 0.01 75)' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'oklch(0.45 0.01 75)' }}>
                  계획 이름 *
                </label>
                <input
                  type="text"
                  value={planForm.title}
                  onChange={(e) => setPlanForm({ ...planForm, title: e.target.value })}
                  placeholder="2026년 성경읽기표"
                  className="w-full px-3 py-2.5 rounded-sm text-sm focus:outline-none"
                  style={{
                    background: 'oklch(0.97 0.005 265)',
                    border: '1px solid oklch(0.90 0.01 265)',
                    color: 'oklch(0.25 0.02 75)',
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'oklch(0.45 0.01 75)' }}>
                  연도
                </label>
                <input
                  type="number"
                  value={planForm.year}
                  onChange={(e) => setPlanForm({ ...planForm, year: parseInt(e.target.value) })}
                  className="w-full px-3 py-2.5 rounded-sm text-sm focus:outline-none"
                  style={{
                    background: 'oklch(0.97 0.005 265)',
                    border: '1px solid oklch(0.90 0.01 265)',
                    color: 'oklch(0.25 0.02 75)',
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'oklch(0.45 0.01 75)' }}>
                  설명
                </label>
                <textarea
                  value={planForm.description}
                  onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })}
                  rows={2}
                  placeholder="1년 동안 성경 전체를 함께 읽는 통독 프로그램입니다."
                  className="w-full px-3 py-2.5 rounded-sm text-sm focus:outline-none resize-none"
                  style={{
                    background: 'oklch(0.97 0.005 265)',
                    border: '1px solid oklch(0.90 0.01 265)',
                    color: 'oklch(0.25 0.02 75)',
                  }}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="modal_plan_active"
                  checked={planForm.is_active}
                  onChange={(e) => setPlanForm({ ...planForm, is_active: e.target.checked })}
                  className="h-4 w-4 rounded-sm"
                  style={{ accentColor: 'oklch(0.45 0.12 265)' }}
                />
                <label htmlFor="modal_plan_active" className="text-sm" style={{ color: 'oklch(0.45 0.01 75)' }}>
                  활성화 (메인 페이지에 표시)
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowPlanModal(false)}
                className="px-4 py-2 rounded-sm text-sm font-medium"
                style={{
                  background: 'oklch(0.92 0.005 75)',
                  color: 'oklch(0.45 0.01 75)',
                }}
              >
                취소
              </button>
              <button
                onClick={handleCreatePlan}
                disabled={saving}
                className="inline-flex items-center px-4 py-2 rounded-sm text-sm font-medium transition-all"
                style={{
                  background: 'oklch(0.45 0.12 265)',
                  color: 'oklch(0.98 0.003 75)',
                }}
              >
                {saving && (
                  <div className="w-4 h-4 mr-1.5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'white', borderTopColor: 'transparent' }} />
                )}
                생성하기
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'ko', ['common'])),
  },
})

export default AdminBibleReadingPage
