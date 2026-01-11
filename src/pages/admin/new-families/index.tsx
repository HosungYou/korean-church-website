import { useEffect, useState } from 'react'
import Layout from '../../../components/Layout'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import {
  Trash2,
  ArrowLeft,
  UserPlus,
  Loader2,
  Search,
  Phone,
  Mail,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  UserCheck,
  Eye
} from 'lucide-react'
import Link from 'next/link'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import { newFamilyService, type NewFamily } from '../../../utils/newFamilyServiceSupabase'

type FamilyStatus = 'pending' | 'contacted' | 'visiting' | 'registered' | 'inactive'

const statusLabels: Record<FamilyStatus, { label: string; color: string }> = {
  pending: { label: '대기', color: 'bg-yellow-100 text-yellow-800' },
  contacted: { label: '연락완료', color: 'bg-blue-100 text-blue-800' },
  visiting: { label: '방문중', color: 'bg-purple-100 text-purple-800' },
  registered: { label: '등록완료', color: 'bg-green-100 text-green-800' },
  inactive: { label: '비활성', color: 'bg-gray-100 text-gray-800' }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')}`
}

const AdminNewFamiliesPage = () => {
  const { admin, loading } = useAdminAuth()
  const [families, setFamilies] = useState<NewFamily[]>([])
  const [listLoading, setListLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | FamilyStatus>('all')
  const [selectedFamily, setSelectedFamily] = useState<NewFamily | null>(null)
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    contacted: 0,
    visiting: 0,
    registered: 0,
    inactive: 0
  })

  useEffect(() => {
    if (!admin) return
    fetchData()
  }, [admin])

  const fetchData = async () => {
    try {
      setListLoading(true)
      const [familiesData, statsData] = await Promise.all([
        newFamilyService.getNewFamilies(),
        newFamilyService.getStatistics()
      ])
      setFamilies(familiesData)
      setStats(statsData)
    } catch (error) {
      console.error('새가족 조회 오류:', error)
    } finally {
      setListLoading(false)
    }
  }

  const handleStatusChange = async (id: string, newStatus: FamilyStatus) => {
    try {
      await newFamilyService.updateNewFamilyStatus(id, newStatus)
      setFamilies((prev) =>
        prev.map((f) => (f.id === id ? { ...f, status: newStatus } : f))
      )
      // Update stats
      await newFamilyService.getStatistics().then(setStats)
    } catch (error) {
      console.error('상태 변경 오류:', error)
      alert('상태 변경 중 오류가 발생했습니다.')
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`"${name}" 새가족 정보를 삭제하시겠습니까?`)) return

    try {
      await newFamilyService.deleteNewFamily(id)
      setFamilies((prev) => prev.filter((f) => f.id !== id))
      await newFamilyService.getStatistics().then(setStats)
      alert('새가족 정보가 삭제되었습니다.')
    } catch (error) {
      console.error('삭제 오류:', error)
      alert('삭제 중 오류가 발생했습니다.')
    }
  }

  const filteredFamilies = families.filter((family) => {
    const familyName = family.korean_name || family.english_name || ''
    const matchesSearch =
      !searchTerm ||
      familyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (family.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (family.phone || '').includes(searchTerm)

    const matchesStatus = filterStatus === 'all' || family.status === filterStatus

    return matchesSearch && matchesStatus
  })

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
                <h1 className="text-xl font-bold text-gray-900 font-korean">새가족 관리</h1>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* 통계 */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              <div className="bg-white overflow-hidden shadow rounded-lg p-4">
                <div className="text-sm font-medium text-gray-500 font-korean">전체</div>
                <div className="mt-1 text-2xl font-semibold text-gray-900">{stats.total}</div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg p-4 border-l-4 border-yellow-400">
                <div className="text-sm font-medium text-gray-500 font-korean">대기</div>
                <div className="mt-1 text-2xl font-semibold text-yellow-600">{stats.pending}</div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg p-4 border-l-4 border-blue-400">
                <div className="text-sm font-medium text-gray-500 font-korean">연락완료</div>
                <div className="mt-1 text-2xl font-semibold text-blue-600">{stats.contacted}</div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg p-4 border-l-4 border-purple-400">
                <div className="text-sm font-medium text-gray-500 font-korean">방문중</div>
                <div className="mt-1 text-2xl font-semibold text-purple-600">{stats.visiting}</div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg p-4 border-l-4 border-green-400">
                <div className="text-sm font-medium text-gray-500 font-korean">등록완료</div>
                <div className="mt-1 text-2xl font-semibold text-green-600">{stats.registered}</div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg p-4 border-l-4 border-gray-400">
                <div className="text-sm font-medium text-gray-500 font-korean">비활성</div>
                <div className="mt-1 text-2xl font-semibold text-gray-600">{stats.inactive}</div>
              </div>
            </div>

            {/* 검색 및 필터 */}
            <div className="bg-white shadow rounded-lg p-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="이름, 이메일, 전화번호로 검색..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-black focus:border-black font-korean"
                    />
                  </div>
                </div>
                <div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as 'all' | FamilyStatus)}
                    className="block w-full md:w-40 px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-black focus:border-black font-korean"
                  >
                    <option value="all">모든 상태</option>
                    <option value="pending">대기</option>
                    <option value="contacted">연락완료</option>
                    <option value="visiting">방문중</option>
                    <option value="registered">등록완료</option>
                    <option value="inactive">비활성</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 목록 */}
              <div className="lg:col-span-2">
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900 font-korean">
                      <UserPlus className="w-5 h-5 inline mr-2" />
                      새가족 목록 ({filteredFamilies.length}명)
                    </h2>
                  </div>

                  {listLoading ? (
                    <div className="p-12 flex justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-black" />
                    </div>
                  ) : filteredFamilies.length === 0 ? (
                    <div className="p-12 text-center text-gray-500 font-korean">
                      <UserPlus className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>등록된 새가족이 없습니다.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-200">
                      {filteredFamilies.map((family) => (
                        <div
                          key={family.id}
                          className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                            selectedFamily?.id === family.id ? 'bg-blue-50' : ''
                          }`}
                          onClick={() => setSelectedFamily(family)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                <UserPlus className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <h3 className="text-sm font-medium text-gray-900 font-korean">
                                  {family.korean_name || family.english_name}
                                </h3>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                  <Clock className="w-3 h-3" />
                                  {formatDate(family.submitted_at)}
                                </div>
                              </div>
                            </div>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                statusLabels[family.status as FamilyStatus].color
                              }`}
                            >
                              {statusLabels[family.status as FamilyStatus].label}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* 상세 정보 */}
              <div className="lg:col-span-1">
                <div className="bg-white shadow rounded-lg p-6 sticky top-24">
                  {selectedFamily ? (
                    <>
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-medium text-gray-900 font-korean">상세 정보</h3>
                        <button
                          onClick={() => handleDelete(selectedFamily.id, selectedFamily.korean_name || selectedFamily.english_name || '')}
                          className="text-red-400 hover:text-red-600"
                          title="삭제"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="text-xs text-gray-500 font-korean">이름</label>
                          <p className="text-lg font-medium text-gray-900 font-korean">
                            {selectedFamily.korean_name}
                            {selectedFamily.english_name && ` (${selectedFamily.english_name})`}
                          </p>
                        </div>

                        {selectedFamily.phone && (
                          <div>
                            <label className="text-xs text-gray-500 font-korean">연락처</label>
                            <p className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-gray-400" />
                              <a href={`tel:${selectedFamily.phone}`} className="text-blue-600 hover:underline">
                                {selectedFamily.phone}
                              </a>
                            </p>
                          </div>
                        )}

                        {selectedFamily.email && (
                          <div>
                            <label className="text-xs text-gray-500 font-korean">이메일</label>
                            <p className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-gray-400" />
                              <a href={`mailto:${selectedFamily.email}`} className="text-blue-600 hover:underline">
                                {selectedFamily.email}
                              </a>
                            </p>
                          </div>
                        )}

                        {selectedFamily.address_line1 && (
                          <div>
                            <label className="text-xs text-gray-500 font-korean">주소</label>
                            <p className="text-gray-900 font-korean">
                              {selectedFamily.address_line1}
                              {selectedFamily.address_line2 && `, ${selectedFamily.address_line2}`}
                              {selectedFamily.city && `, ${selectedFamily.city}`}
                              {selectedFamily.state && `, ${selectedFamily.state}`}
                              {selectedFamily.zip_code && ` ${selectedFamily.zip_code}`}
                            </p>
                          </div>
                        )}

                        {selectedFamily.birth_date && (
                          <div>
                            <label className="text-xs text-gray-500 font-korean">생년월일</label>
                            <p className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              {selectedFamily.birth_date}
                            </p>
                          </div>
                        )}

                        {selectedFamily.previous_church && (
                          <div>
                            <label className="text-xs text-gray-500 font-korean">이전 교회</label>
                            <p className="text-gray-900 font-korean">{selectedFamily.previous_church}</p>
                          </div>
                        )}

                        <div>
                          <label className="text-xs text-gray-500 font-korean">세례 여부</label>
                          <p className="flex items-center gap-2">
                            {selectedFamily.baptism_date ? (
                              <>
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span className="text-green-600">세례 받음 ({selectedFamily.baptism_date})</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-500">미세례</span>
                              </>
                            )}
                          </p>
                        </div>

                        {selectedFamily.introduction && (
                          <div>
                            <label className="text-xs text-gray-500 font-korean">자기소개</label>
                            <p className="text-gray-900 font-korean text-sm bg-gray-50 p-3 rounded-lg">
                              {selectedFamily.introduction}
                            </p>
                          </div>
                        )}

                        {selectedFamily.admin_notes && (
                          <div>
                            <label className="text-xs text-gray-500 font-korean">관리자 메모</label>
                            <p className="text-gray-900 font-korean text-sm bg-yellow-50 p-3 rounded-lg">
                              {selectedFamily.admin_notes}
                            </p>
                          </div>
                        )}

                        {/* 상태 변경 */}
                        <div className="pt-4 border-t border-gray-200">
                          <label className="text-xs text-gray-500 font-korean block mb-2">상태 변경</label>
                          <div className="flex flex-wrap gap-2">
                            {(Object.keys(statusLabels) as FamilyStatus[]).map((status) => (
                              <button
                                key={status}
                                onClick={() => handleStatusChange(selectedFamily.id, status)}
                                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                                  selectedFamily.status === status
                                    ? statusLabels[status].color
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                              >
                                {statusLabels[status].label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <Eye className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="font-korean">새가족을 선택하면<br />상세 정보를 볼 수 있습니다.</p>
                    </div>
                  )}
                </div>
              </div>
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

export default AdminNewFamiliesPage
