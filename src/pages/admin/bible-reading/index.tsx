import { useEffect, useState } from 'react'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import {
  Plus,
  Edit,
  Trash2,
  Book,
  Calendar,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  BookOpen,
  FileText,
} from 'lucide-react'
import AdminLayout from '@/components/AdminLayout'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import {
  getAllPlans,
  createPlan,
  updatePlan,
  deletePlan,
  getEntriesByPlan,
  createEntry,
  deleteEntry,
} from '../../../utils/bibleReadingService'
import type { BibleReadingPlan, BibleReadingEntry, BibleReadingEntryInsert } from '../../../../types/supabase'

// ===========================================
// VS Design Diverge: Bible Reading Management
// Editorial Accordion + OKLCH Color System
// ===========================================

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return `${date.getMonth() + 1}월 ${date.getDate()}일`
}

const AdminBibleReadingPage = () => {
  const { admin } = useAdminAuth()
  const [plans, setPlans] = useState<BibleReadingPlan[]>([])
  const [entries, setEntries] = useState<BibleReadingEntry[]>([])
  const [listLoading, setListLoading] = useState(true)
  const [entriesLoading, setEntriesLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showPlanForm, setShowPlanForm] = useState(false)
  const [showEntryForm, setShowEntryForm] = useState(false)
  const [editingPlan, setEditingPlan] = useState<BibleReadingPlan | null>(null)
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<BibleReadingPlan | null>(null)

  const [planForm, setPlanForm] = useState({
    title: '',
    description: '',
    year: new Date().getFullYear(),
    is_active: true,
  })

  const [entryForm, setEntryForm] = useState({
    reading_date: new Date().toISOString().split('T')[0],
    old_testament: '',
    new_testament: '',
    psalms: '',
    proverbs: '',
    notes: '',
  })

  useEffect(() => {
    if (!admin) return
    fetchPlans()
  }, [admin])

  const fetchPlans = async () => {
    try {
      setListLoading(true)
      const data = await getAllPlans()
      setPlans(data)
    } catch (error) {
      console.error('계획 조회 오류:', error)
    } finally {
      setListLoading(false)
    }
  }

  const fetchEntries = async (planId: string) => {
    try {
      setEntriesLoading(true)
      const data = await getEntriesByPlan(planId)
      setEntries(data)
    } catch (error) {
      console.error('읽기 항목 조회 오류:', error)
    } finally {
      setEntriesLoading(false)
    }
  }

  const handleExpandPlan = async (plan: BibleReadingPlan) => {
    if (expandedPlan === plan.id) {
      setExpandedPlan(null)
      setSelectedPlan(null)
      setEntries([])
    } else {
      setExpandedPlan(plan.id)
      setSelectedPlan(plan)
      await fetchEntries(plan.id)
    }
  }

  const handleCreatePlan = () => {
    setEditingPlan(null)
    setPlanForm({
      title: '',
      description: '',
      year: new Date().getFullYear(),
      is_active: true,
    })
    setShowPlanForm(true)
  }

  const handleEditPlan = (plan: BibleReadingPlan) => {
    setEditingPlan(plan)
    setPlanForm({
      title: plan.title,
      description: plan.description || '',
      year: plan.year,
      is_active: plan.is_active,
    })
    setShowPlanForm(true)
  }

  const handleSubmitPlan = async () => {
    if (!planForm.title.trim()) {
      alert('계획 이름을 입력해주세요.')
      return
    }

    try {
      setSaving(true)
      if (editingPlan) {
        await updatePlan(editingPlan.id, planForm)
      } else {
        await createPlan(planForm)
      }
      await fetchPlans()
      setShowPlanForm(false)
      setEditingPlan(null)
      alert(editingPlan ? '계획이 수정되었습니다.' : '계획이 생성되었습니다.')
    } catch (error) {
      console.error('저장 오류:', error)
      alert('저장 중 오류가 발생했습니다.')
    } finally {
      setSaving(false)
    }
  }

  const handleDeletePlan = async (id: string) => {
    if (!confirm('이 계획과 모든 읽기 항목을 삭제하시겠습니까?')) return

    try {
      await deletePlan(id)
      setPlans((prev) => prev.filter((p) => p.id !== id))
      if (expandedPlan === id) {
        setExpandedPlan(null)
        setSelectedPlan(null)
        setEntries([])
      }
      alert('계획이 삭제되었습니다.')
    } catch (error) {
      console.error('삭제 오류:', error)
      alert('삭제 중 오류가 발생했습니다.')
    }
  }

  const handleAddEntry = () => {
    setEntryForm({
      reading_date: new Date().toISOString().split('T')[0],
      old_testament: '',
      new_testament: '',
      psalms: '',
      proverbs: '',
      notes: '',
    })
    setShowEntryForm(true)
  }

  const handleSubmitEntry = async () => {
    if (!selectedPlan) return
    if (!entryForm.reading_date) {
      alert('날짜를 선택해주세요.')
      return
    }

    try {
      setSaving(true)
      const newEntry = await createEntry({
        plan_id: selectedPlan.id,
        ...entryForm,
      } as BibleReadingEntryInsert)
      setEntries((prev) =>
        [...prev, newEntry].sort(
          (a, b) => new Date(a.reading_date).getTime() - new Date(b.reading_date).getTime()
        )
      )
      setShowEntryForm(false)
      alert('읽기 항목이 추가되었습니다.')
    } catch (error) {
      console.error('저장 오류:', error)
      alert('저장 중 오류가 발생했습니다.')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteEntry = async (entryId: string) => {
    if (!confirm('이 읽기 항목을 삭제하시겠습니까?')) return

    try {
      await deleteEntry(entryId)
      setEntries((prev) => prev.filter((e) => e.id !== entryId))
    } catch (error) {
      console.error('삭제 오류:', error)
      alert('삭제 중 오류가 발생했습니다.')
    }
  }

  const activePlans = plans.filter((p) => p.is_active).length
  const totalEntries = entries.length

  const statsCards = [
    { name: '총 계획', value: plans.length, icon: Book },
    { name: '활성 계획', value: activePlans, icon: BookOpen },
    { name: '현재 항목', value: totalEntries, icon: FileText },
  ]

  return (
    <AdminLayout title="성경읽기표 관리" subtitle="성경 읽기 계획과 일정을 관리하세요">
      {/* Action Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <div
            className="h-0.5 w-8 mr-4"
            style={{
              background: 'linear-gradient(90deg, oklch(0.72 0.10 75), oklch(0.45 0.12 265))',
            }}
          />
          <span className="text-sm font-medium" style={{ color: 'oklch(0.55 0.01 75)' }}>
            {plans.length}개의 계획
          </span>
        </div>
        <button
          onClick={handleCreatePlan}
          className="inline-flex items-center px-5 py-2.5 rounded-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
          style={{
            background: 'oklch(0.45 0.12 265)',
            color: 'oklch(0.98 0.003 75)',
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          새 계획
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.name}
              className={`p-5 rounded-sm stagger-${index + 1}`}
              style={{
                background: 'oklch(0.985 0.003 75)',
                border: '1px solid oklch(0.92 0.005 75)',
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className="w-10 h-10 rounded-sm flex items-center justify-center"
                  style={{ background: 'oklch(0.45 0.12 265 / 0.1)' }}
                >
                  <Icon className="w-5 h-5" style={{ color: 'oklch(0.45 0.12 265)' }} />
                </div>
              </div>
              <p className="text-xs font-medium mb-1" style={{ color: 'oklch(0.55 0.01 75)' }}>
                {stat.name}
              </p>
              <span
                className="font-headline font-bold text-2xl"
                style={{ color: 'oklch(0.22 0.07 265)' }}
              >
                {listLoading ? '—' : stat.value}
              </span>
            </div>
          )
        })}
      </div>

      {/* Plan Form Modal */}
      {showPlanForm && (
        <div
          className="p-6 rounded-sm mb-6 stagger-1"
          style={{
            background: 'oklch(0.985 0.003 75)',
            border: '1px solid oklch(0.92 0.005 75)',
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="h-0.5 w-6 mr-3" style={{ background: 'oklch(0.72 0.10 75)' }} />
              <h2
                className="font-headline font-bold text-lg"
                style={{ color: 'oklch(0.22 0.07 265)' }}
              >
                {editingPlan ? '계획 수정' : '새 계획 만들기'}
              </h2>
            </div>
            <button
              onClick={() => setShowPlanForm(false)}
              className="p-2 rounded-sm transition-colors"
              style={{ color: 'oklch(0.50 0.01 75)' }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2" style={{ color: 'oklch(0.45 0.01 75)' }}>
                계획 이름 *
              </label>
              <input
                type="text"
                value={planForm.title}
                onChange={(e) => setPlanForm({ ...planForm, title: e.target.value })}
                placeholder="예: 2024년 성경통독"
                className="block w-full px-4 py-2.5 rounded-sm focus:outline-none"
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
                className="block w-full px-4 py-2.5 rounded-sm focus:outline-none"
                style={{
                  background: 'oklch(0.97 0.005 265)',
                  border: '1px solid oklch(0.90 0.01 265)',
                  color: 'oklch(0.25 0.02 75)',
                }}
              />
            </div>

            <div className="flex items-center pt-8">
              <input
                type="checkbox"
                id="plan_active"
                checked={planForm.is_active}
                onChange={(e) => setPlanForm({ ...planForm, is_active: e.target.checked })}
                className="h-4 w-4 rounded-sm"
                style={{ accentColor: 'oklch(0.45 0.12 265)' }}
              />
              <label htmlFor="plan_active" className="ml-2 text-sm" style={{ color: 'oklch(0.45 0.01 75)' }}>
                활성화 (메인 페이지에 표시)
              </label>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2" style={{ color: 'oklch(0.45 0.01 75)' }}>
                설명
              </label>
              <textarea
                value={planForm.description}
                onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })}
                rows={2}
                className="block w-full px-4 py-2.5 rounded-sm focus:outline-none resize-none"
                style={{
                  background: 'oklch(0.97 0.005 265)',
                  border: '1px solid oklch(0.90 0.01 265)',
                  color: 'oklch(0.25 0.02 75)',
                }}
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSubmitPlan}
              disabled={saving}
              className="inline-flex items-center px-5 py-2.5 rounded-sm font-medium transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50"
              style={{
                background: 'oklch(0.45 0.12 265)',
                color: 'oklch(0.98 0.003 75)',
              }}
            >
              {saving ? (
                <div className="w-4 h-4 mr-2 border-2 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Check className="w-4 h-4 mr-2" />
              )}
              {editingPlan ? '수정하기' : '생성하기'}
            </button>
          </div>
        </div>
      )}

      {/* Plans List */}
      <div
        className="rounded-sm overflow-hidden"
        style={{
          background: 'oklch(0.985 0.003 75)',
          border: '1px solid oklch(0.92 0.005 75)',
        }}
      >
        {listLoading ? (
          <div className="p-12 flex flex-col items-center justify-center">
            <div
              className="w-10 h-10 rounded-sm mb-4 animate-pulse"
              style={{ background: 'oklch(0.45 0.12 265)' }}
            />
            <p className="text-sm font-medium" style={{ color: 'oklch(0.55 0.01 75)' }}>
              계획 로딩 중...
            </p>
          </div>
        ) : plans.length === 0 ? (
          <div className="p-12 text-center">
            <div
              className="w-16 h-16 rounded-sm mx-auto mb-4 flex items-center justify-center"
              style={{ background: 'oklch(0.45 0.12 265 / 0.1)' }}
            >
              <Book className="w-8 h-8" style={{ color: 'oklch(0.45 0.12 265)' }} />
            </div>
            <p className="text-sm font-medium mb-2" style={{ color: 'oklch(0.45 0.01 75)' }}>
              등록된 계획이 없습니다
            </p>
            <p className="text-xs" style={{ color: 'oklch(0.55 0.01 75)' }}>
              새 계획을 만들어 성경읽기표를 시작하세요
            </p>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: 'oklch(0.92 0.005 75)' }}>
            {plans.map((plan, index) => (
              <div key={plan.id} className={`stagger-${(index % 6) + 1}`}>
                {/* Plan Header */}
                <div
                  className="p-4 flex items-center justify-between cursor-pointer transition-colors"
                  style={{
                    background: expandedPlan === plan.id ? 'oklch(0.97 0.005 265)' : 'transparent',
                  }}
                  onClick={() => handleExpandPlan(plan)}
                >
                  <div className="flex items-center gap-4">
                    {expandedPlan === plan.id ? (
                      <ChevronUp className="w-5 h-5" style={{ color: 'oklch(0.50 0.01 75)' }} />
                    ) : (
                      <ChevronDown className="w-5 h-5" style={{ color: 'oklch(0.50 0.01 75)' }} />
                    )}
                    <div>
                      <h3 className="text-sm font-medium" style={{ color: 'oklch(0.25 0.02 75)' }}>
                        {plan.title}
                        {plan.is_active && (
                          <span
                            className="ml-2 px-2 py-0.5 rounded-sm text-xs font-medium"
                            style={{
                              background: 'oklch(0.55 0.15 145 / 0.15)',
                              color: 'oklch(0.40 0.15 145)',
                            }}
                          >
                            활성
                          </span>
                        )}
                      </h3>
                      <p className="text-sm" style={{ color: 'oklch(0.55 0.01 75)' }}>
                        {plan.year}년
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleEditPlan(plan)}
                      className="p-2 rounded-sm transition-all duration-200 hover:-translate-y-0.5"
                      style={{ background: 'oklch(0.45 0.12 265 / 0.1)', color: 'oklch(0.45 0.12 265)' }}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeletePlan(plan.id)}
                      className="p-2 rounded-sm transition-all duration-200 hover:-translate-y-0.5"
                      style={{ background: 'oklch(0.55 0.18 25 / 0.1)', color: 'oklch(0.50 0.18 25)' }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Expanded Entries */}
                {expandedPlan === plan.id && (
                  <div className="px-4 pb-4" style={{ background: 'oklch(0.97 0.005 265)' }}>
                    {/* Entry Form */}
                    {showEntryForm && (
                      <div
                        className="p-4 mb-4 rounded-sm"
                        style={{
                          background: 'oklch(0.985 0.003 75)',
                          border: '1px solid oklch(0.90 0.01 265)',
                        }}
                      >
                        <h4 className="text-sm font-medium mb-3" style={{ color: 'oklch(0.35 0.02 75)' }}>
                          새 읽기 항목 추가
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                          <div>
                            <label className="block text-xs mb-1" style={{ color: 'oklch(0.55 0.01 75)' }}>
                              날짜 *
                            </label>
                            <input
                              type="date"
                              value={entryForm.reading_date}
                              onChange={(e) => setEntryForm({ ...entryForm, reading_date: e.target.value })}
                              className="block w-full px-2 py-1.5 text-sm rounded-sm focus:outline-none"
                              style={{
                                background: 'oklch(0.97 0.005 265)',
                                border: '1px solid oklch(0.90 0.01 265)',
                                color: 'oklch(0.35 0.02 75)',
                              }}
                            />
                          </div>
                          <div>
                            <label className="block text-xs mb-1" style={{ color: 'oklch(0.55 0.01 75)' }}>
                              구약
                            </label>
                            <input
                              type="text"
                              value={entryForm.old_testament}
                              onChange={(e) => setEntryForm({ ...entryForm, old_testament: e.target.value })}
                              placeholder="창세기 1-3장"
                              className="block w-full px-2 py-1.5 text-sm rounded-sm focus:outline-none"
                              style={{
                                background: 'oklch(0.97 0.005 265)',
                                border: '1px solid oklch(0.90 0.01 265)',
                                color: 'oklch(0.35 0.02 75)',
                              }}
                            />
                          </div>
                          <div>
                            <label className="block text-xs mb-1" style={{ color: 'oklch(0.55 0.01 75)' }}>
                              신약
                            </label>
                            <input
                              type="text"
                              value={entryForm.new_testament}
                              onChange={(e) => setEntryForm({ ...entryForm, new_testament: e.target.value })}
                              placeholder="마태복음 1장"
                              className="block w-full px-2 py-1.5 text-sm rounded-sm focus:outline-none"
                              style={{
                                background: 'oklch(0.97 0.005 265)',
                                border: '1px solid oklch(0.90 0.01 265)',
                                color: 'oklch(0.35 0.02 75)',
                              }}
                            />
                          </div>
                          <div>
                            <label className="block text-xs mb-1" style={{ color: 'oklch(0.55 0.01 75)' }}>
                              시편
                            </label>
                            <input
                              type="text"
                              value={entryForm.psalms}
                              onChange={(e) => setEntryForm({ ...entryForm, psalms: e.target.value })}
                              placeholder="시편 1편"
                              className="block w-full px-2 py-1.5 text-sm rounded-sm focus:outline-none"
                              style={{
                                background: 'oklch(0.97 0.005 265)',
                                border: '1px solid oklch(0.90 0.01 265)',
                                color: 'oklch(0.35 0.02 75)',
                              }}
                            />
                          </div>
                          <div>
                            <label className="block text-xs mb-1" style={{ color: 'oklch(0.55 0.01 75)' }}>
                              잠언
                            </label>
                            <input
                              type="text"
                              value={entryForm.proverbs}
                              onChange={(e) => setEntryForm({ ...entryForm, proverbs: e.target.value })}
                              placeholder="잠언 1장"
                              className="block w-full px-2 py-1.5 text-sm rounded-sm focus:outline-none"
                              style={{
                                background: 'oklch(0.97 0.005 265)',
                                border: '1px solid oklch(0.90 0.01 265)',
                                color: 'oklch(0.35 0.02 75)',
                              }}
                            />
                          </div>
                          <div className="flex items-end gap-2">
                            <button
                              onClick={handleSubmitEntry}
                              disabled={saving}
                              className="flex-1 px-3 py-1.5 text-sm rounded-sm font-medium transition-all"
                              style={{
                                background: 'oklch(0.45 0.12 265)',
                                color: 'oklch(0.98 0.003 75)',
                              }}
                            >
                              {saving ? '저장중...' : '추가'}
                            </button>
                            <button
                              onClick={() => setShowEntryForm(false)}
                              className="px-3 py-1.5 text-sm rounded-sm font-medium"
                              style={{
                                background: 'oklch(0.92 0.005 75)',
                                color: 'oklch(0.45 0.01 75)',
                              }}
                            >
                              취소
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Add Entry Button */}
                    {!showEntryForm && (
                      <button
                        onClick={handleAddEntry}
                        className="w-full mb-4 py-3 rounded-sm text-sm font-medium transition-all duration-200"
                        style={{
                          border: '2px dashed oklch(0.85 0.01 265)',
                          color: 'oklch(0.55 0.01 75)',
                        }}
                      >
                        <Plus className="w-4 h-4 inline mr-1" />
                        읽기 항목 추가
                      </button>
                    )}

                    {/* Entries Table */}
                    {entriesLoading ? (
                      <div className="py-8 flex justify-center">
                        <div
                          className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
                          style={{ borderColor: 'oklch(0.45 0.12 265)', borderTopColor: 'transparent' }}
                        />
                      </div>
                    ) : entries.length === 0 ? (
                      <div className="py-8 text-center text-sm" style={{ color: 'oklch(0.55 0.01 75)' }}>
                        등록된 읽기 항목이 없습니다.
                      </div>
                    ) : (
                      <div
                        className="rounded-sm overflow-hidden"
                        style={{ border: '1px solid oklch(0.90 0.01 265)' }}
                      >
                        <table className="w-full">
                          <thead style={{ background: 'oklch(0.93 0.005 265)' }}>
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'oklch(0.50 0.01 75)' }}>
                                날짜
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'oklch(0.50 0.01 75)' }}>
                                구약
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'oklch(0.50 0.01 75)' }}>
                                신약
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'oklch(0.50 0.01 75)' }}>
                                시편
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'oklch(0.50 0.01 75)' }}>
                                잠언
                              </th>
                              <th className="px-4 py-2"></th>
                            </tr>
                          </thead>
                          <tbody className="divide-y" style={{ borderColor: 'oklch(0.92 0.005 75)' }}>
                            {entries.slice(0, 20).map((entry) => (
                              <tr key={entry.id} className="hover:bg-[oklch(0.97_0.005_265)]">
                                <td className="px-4 py-2 text-sm whitespace-nowrap" style={{ color: 'oklch(0.35 0.02 75)' }}>
                                  <Calendar className="w-3 h-3 inline mr-1" style={{ color: 'oklch(0.55 0.01 75)' }} />
                                  {formatDate(entry.reading_date)}
                                </td>
                                <td className="px-4 py-2 text-sm" style={{ color: 'oklch(0.45 0.12 265)' }}>
                                  {entry.old_testament || '-'}
                                </td>
                                <td className="px-4 py-2 text-sm" style={{ color: 'oklch(0.40 0.15 145)' }}>
                                  {entry.new_testament || '-'}
                                </td>
                                <td className="px-4 py-2 text-sm" style={{ color: 'oklch(0.50 0.15 300)' }}>
                                  {entry.psalms || '-'}
                                </td>
                                <td className="px-4 py-2 text-sm" style={{ color: 'oklch(0.55 0.12 75)' }}>
                                  {entry.proverbs || '-'}
                                </td>
                                <td className="px-4 py-2">
                                  <button
                                    onClick={() => handleDeleteEntry(entry.id)}
                                    className="p-1 rounded-sm transition-colors"
                                    style={{ color: 'oklch(0.55 0.18 25)' }}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {entries.length > 20 && (
                          <div
                            className="px-4 py-2 text-center text-sm"
                            style={{ background: 'oklch(0.95 0.005 265)', color: 'oklch(0.55 0.01 75)' }}
                          >
                            + {entries.length - 20}개 더 있음
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'ko', ['common'])),
  },
})

export default AdminBibleReadingPage
