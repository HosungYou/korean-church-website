import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../../components/Layout'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import {
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  Book,
  Loader2,
  Calendar,
  Check,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import Link from 'next/link'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import {
  getAllPlans,
  createPlan,
  updatePlan,
  deletePlan,
  getEntriesByPlan,
  createEntry,
  deleteEntry
} from '../../../utils/bibleReadingService'
import type { BibleReadingPlan, BibleReadingEntry, BibleReadingEntryInsert } from '../../../../types/supabase'

const AdminBibleReadingPage = () => {
  const router = useRouter()
  const { admin, loading } = useAdminAuth()
  const [plans, setPlans] = useState<BibleReadingPlan[]>([])
  const [selectedPlan, setSelectedPlan] = useState<BibleReadingPlan | null>(null)
  const [entries, setEntries] = useState<BibleReadingEntry[]>([])
  const [listLoading, setListLoading] = useState(true)
  const [entriesLoading, setEntriesLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showPlanForm, setShowPlanForm] = useState(false)
  const [showEntryForm, setShowEntryForm] = useState(false)
  const [editingPlan, setEditingPlan] = useState<BibleReadingPlan | null>(null)
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null)

  const [planForm, setPlanForm] = useState({
    title: '',
    description: '',
    year: new Date().getFullYear(),
    is_active: true
  })

  const [entryForm, setEntryForm] = useState({
    reading_date: new Date().toISOString().split('T')[0],
    old_testament: '',
    new_testament: '',
    psalms: '',
    proverbs: '',
    notes: ''
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
      is_active: true
    })
    setShowPlanForm(true)
  }

  const handleEditPlan = (plan: BibleReadingPlan) => {
    setEditingPlan(plan)
    setPlanForm({
      title: plan.title,
      description: plan.description || '',
      year: plan.year,
      is_active: plan.is_active
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
      notes: ''
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
        ...entryForm
      } as BibleReadingEntryInsert)
      setEntries((prev) => [...prev, newEntry].sort((a, b) =>
        new Date(a.reading_date).getTime() - new Date(b.reading_date).getTime()
      ))
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.getMonth() + 1}월 ${date.getDate()}일`
  }

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-black" />
        </div>
      </Layout>
    )
  }

  if (!admin) return null

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Link href="/admin/dashboard" className="mr-4">
                  <ArrowLeft className="w-5 h-5 text-gray-600 hover:text-black transition-colors" />
                </Link>
                <div className="w-3 h-3 bg-black rounded-full mr-4"></div>
                <h1 className="text-xl font-bold text-gray-900 font-korean">성경읽기표 관리</h1>
              </div>
              <button
                onClick={handleCreatePlan}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800"
              >
                <Plus className="w-4 h-4 mr-2" />
                <span className="font-korean">새 계획</span>
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* 계획 생성/수정 폼 */}
            {showPlanForm && (
              <div className="bg-white shadow rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium text-gray-900 font-korean">
                    {editingPlan ? '계획 수정' : '새 계획 만들기'}
                  </h2>
                  <button onClick={() => setShowPlanForm(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 font-korean mb-1">
                      계획 이름 *
                    </label>
                    <input
                      type="text"
                      value={planForm.title}
                      onChange={(e) => setPlanForm({ ...planForm, title: e.target.value })}
                      placeholder="예: 2024년 성경통독"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black font-korean"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 font-korean mb-1">
                      연도
                    </label>
                    <input
                      type="number"
                      value={planForm.year}
                      onChange={(e) => setPlanForm({ ...planForm, year: parseInt(e.target.value) })}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                    />
                  </div>

                  <div className="flex items-center pt-6">
                    <input
                      type="checkbox"
                      id="plan_active"
                      checked={planForm.is_active}
                      onChange={(e) => setPlanForm({ ...planForm, is_active: e.target.checked })}
                      className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                    />
                    <label htmlFor="plan_active" className="ml-2 block text-sm text-gray-700 font-korean">
                      활성화 (메인 페이지에 표시)
                    </label>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 font-korean mb-1">
                      설명
                    </label>
                    <textarea
                      value={planForm.description}
                      onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })}
                      rows={2}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black font-korean"
                    />
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleSubmitPlan}
                    disabled={saving}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}
                    <span className="font-korean">{editingPlan ? '수정하기' : '생성하기'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* 계획 목록 */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 font-korean">
                  <Book className="w-5 h-5 inline mr-2" />
                  읽기 계획 ({plans.length}개)
                </h2>
              </div>

              {listLoading ? (
                <div className="p-12 flex justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-black" />
                </div>
              ) : plans.length === 0 ? (
                <div className="p-12 text-center text-gray-500 font-korean">
                  <Book className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>등록된 계획이 없습니다.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {plans.map((plan) => (
                    <div key={plan.id}>
                      {/* 계획 헤더 */}
                      <div
                        className={`p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 ${
                          !plan.is_active ? 'bg-gray-50' : ''
                        }`}
                        onClick={() => handleExpandPlan(plan)}
                      >
                        <div className="flex items-center gap-4">
                          {expandedPlan === plan.id ? (
                            <ChevronUp className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          )}
                          <div>
                            <h3 className="text-sm font-medium text-gray-900 font-korean">
                              {plan.title}
                              {plan.is_active && (
                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                  활성
                                </span>
                              )}
                            </h3>
                            <p className="text-sm text-gray-500">{plan.year}년</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleEditPlan(plan)}
                            className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeletePlan(plan.id)}
                            className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* 확장된 계획 - 읽기 항목 */}
                      {expandedPlan === plan.id && (
                        <div className="px-4 pb-4 bg-gray-50">
                          {/* 항목 추가 폼 */}
                          {showEntryForm && (
                            <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
                              <h4 className="text-sm font-medium text-gray-900 font-korean mb-3">새 읽기 항목 추가</h4>
                              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                                <div>
                                  <label className="block text-xs text-gray-500 mb-1">날짜 *</label>
                                  <input
                                    type="date"
                                    value={entryForm.reading_date}
                                    onChange={(e) => setEntryForm({ ...entryForm, reading_date: e.target.value })}
                                    className="block w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-500 mb-1">구약</label>
                                  <input
                                    type="text"
                                    value={entryForm.old_testament}
                                    onChange={(e) => setEntryForm({ ...entryForm, old_testament: e.target.value })}
                                    placeholder="창세기 1-3장"
                                    className="block w-full px-2 py-1 text-sm border border-gray-300 rounded-md font-korean"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-500 mb-1">신약</label>
                                  <input
                                    type="text"
                                    value={entryForm.new_testament}
                                    onChange={(e) => setEntryForm({ ...entryForm, new_testament: e.target.value })}
                                    placeholder="마태복음 1장"
                                    className="block w-full px-2 py-1 text-sm border border-gray-300 rounded-md font-korean"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-500 mb-1">시편</label>
                                  <input
                                    type="text"
                                    value={entryForm.psalms}
                                    onChange={(e) => setEntryForm({ ...entryForm, psalms: e.target.value })}
                                    placeholder="시편 1편"
                                    className="block w-full px-2 py-1 text-sm border border-gray-300 rounded-md font-korean"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-500 mb-1">잠언</label>
                                  <input
                                    type="text"
                                    value={entryForm.proverbs}
                                    onChange={(e) => setEntryForm({ ...entryForm, proverbs: e.target.value })}
                                    placeholder="잠언 1장"
                                    className="block w-full px-2 py-1 text-sm border border-gray-300 rounded-md font-korean"
                                  />
                                </div>
                                <div className="flex items-end gap-2">
                                  <button
                                    onClick={handleSubmitEntry}
                                    disabled={saving}
                                    className="flex-1 px-3 py-1 bg-black text-white text-sm rounded-md hover:bg-gray-800 disabled:opacity-50"
                                  >
                                    {saving ? '저장중...' : '추가'}
                                  </button>
                                  <button
                                    onClick={() => setShowEntryForm(false)}
                                    className="px-3 py-1 bg-gray-200 text-gray-600 text-sm rounded-md hover:bg-gray-300"
                                  >
                                    취소
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* 항목 추가 버튼 */}
                          {!showEntryForm && (
                            <button
                              onClick={handleAddEntry}
                              className="w-full mb-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors font-korean text-sm"
                            >
                              <Plus className="w-4 h-4 inline mr-1" />
                              읽기 항목 추가
                            </button>
                          )}

                          {/* 읽기 항목 목록 */}
                          {entriesLoading ? (
                            <div className="py-8 flex justify-center">
                              <Loader2 className="h-6 w-6 animate-spin text-black" />
                            </div>
                          ) : entries.length === 0 ? (
                            <div className="py-8 text-center text-gray-500 font-korean text-sm">
                              등록된 읽기 항목이 없습니다.
                            </div>
                          ) : (
                            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 font-korean">날짜</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 font-korean">구약</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 font-korean">신약</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 font-korean">시편</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 font-korean">잠언</th>
                                    <th className="px-4 py-2"></th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                  {entries.slice(0, 20).map((entry) => (
                                    <tr key={entry.id} className="hover:bg-gray-50">
                                      <td className="px-4 py-2 text-sm text-gray-900 whitespace-nowrap">
                                        <Calendar className="w-3 h-3 inline mr-1 text-gray-400" />
                                        {formatDate(entry.reading_date)}
                                      </td>
                                      <td className="px-4 py-2 text-sm text-blue-600 font-korean">{entry.old_testament || '-'}</td>
                                      <td className="px-4 py-2 text-sm text-green-600 font-korean">{entry.new_testament || '-'}</td>
                                      <td className="px-4 py-2 text-sm text-purple-600 font-korean">{entry.psalms || '-'}</td>
                                      <td className="px-4 py-2 text-sm text-orange-600 font-korean">{entry.proverbs || '-'}</td>
                                      <td className="px-4 py-2">
                                        <button
                                          onClick={() => handleDeleteEntry(entry.id)}
                                          className="text-red-400 hover:text-red-600"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                              {entries.length > 20 && (
                                <div className="px-4 py-2 bg-gray-50 text-center text-sm text-gray-500">
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
          </div>
        </div>
      </div>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'ko', ['common'])),
  },
})

export default AdminBibleReadingPage
