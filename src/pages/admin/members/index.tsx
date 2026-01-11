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
  Users,
  Loader2,
  Search,
  Download,
  Phone,
  Mail,
  User,
  Calendar
} from 'lucide-react'
import Link from 'next/link'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import {
  getAllMembers,
  deleteMember,
  getMemberStats,
  exportMembersToCSV,
  type MemberType,
  type MemberStatus
} from '../../../utils/memberService'
import type { ChurchMember } from '../../../../types/supabase'

const memberTypeLabels: Record<MemberType, string> = {
  member: '성도',
  deacon: '집사',
  elder: '장로',
  pastor: '목사',
  staff: '교역자'
}

const statusLabels: Record<MemberStatus, string> = {
  active: '활동',
  inactive: '비활동',
  transferred: '이적',
  deceased: '사망'
}

const AdminMembersPage = () => {
  const router = useRouter()
  const { admin, loading } = useAdminAuth()
  const [members, setMembers] = useState<ChurchMember[]>([])
  const [listLoading, setListLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | MemberType>('all')
  const [filterStatus, setFilterStatus] = useState<'all' | MemberStatus>('all')
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    baptized: 0,
    newThisMonth: 0,
    byType: {} as Record<MemberType, number>
  })

  useEffect(() => {
    if (!admin) return
    fetchData()
  }, [admin])

  const fetchData = async () => {
    try {
      setListLoading(true)
      const [membersData, statsData] = await Promise.all([
        getAllMembers(),
        getMemberStats()
      ])
      setMembers(membersData)
      setStats(statsData)
    } catch (error) {
      console.error('교인 조회 오류:', error)
    } finally {
      setListLoading(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`"${name}" 교인 정보를 삭제하시겠습니까?`)) return

    try {
      await deleteMember(id)
      setMembers((prev) => prev.filter((m) => m.id !== id))
      alert('교인 정보가 삭제되었습니다.')
    } catch (error) {
      console.error('삭제 오류:', error)
      alert('삭제 중 오류가 발생했습니다.')
    }
  }

  const handleExport = async () => {
    try {
      const csv = await exportMembersToCSV()
      const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `members_${new Date().toISOString().split('T')[0]}.csv`
      link.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('내보내기 오류:', error)
      alert('내보내기 중 오류가 발생했습니다.')
    }
  }

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      !searchTerm ||
      member.korean_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (member.english_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (member.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (member.phone || '').includes(searchTerm)

    const matchesType = filterType === 'all' || member.member_type === filterType
    const matchesStatus = filterStatus === 'all' || member.status === filterStatus

    return matchesSearch && matchesType && matchesStatus
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
                <h1 className="text-xl font-bold text-gray-900 font-korean">교인 관리</h1>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleExport}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Download className="w-4 h-4 mr-2" />
                  <span className="font-korean">CSV 내보내기</span>
                </button>
                <Link
                  href="/admin/members/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  <span className="font-korean">새 교인</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* 통계 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white overflow-hidden shadow rounded-lg p-4">
                <div className="text-sm font-medium text-gray-500 font-korean">총 교인</div>
                <div className="mt-1 text-2xl font-semibold text-gray-900">{stats.total}</div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg p-4">
                <div className="text-sm font-medium text-gray-500 font-korean">활동 교인</div>
                <div className="mt-1 text-2xl font-semibold text-green-600">{stats.active}</div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg p-4">
                <div className="text-sm font-medium text-gray-500 font-korean">세례 교인</div>
                <div className="mt-1 text-2xl font-semibold text-blue-600">{stats.baptized}</div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg p-4">
                <div className="text-sm font-medium text-gray-500 font-korean">이번 달 등록</div>
                <div className="mt-1 text-2xl font-semibold text-purple-600">{stats.newThisMonth}</div>
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
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as 'all' | MemberType)}
                    className="block w-full md:w-32 px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-black focus:border-black font-korean"
                  >
                    <option value="all">모든 직분</option>
                    <option value="member">성도</option>
                    <option value="deacon">집사</option>
                    <option value="elder">장로</option>
                    <option value="pastor">목사</option>
                    <option value="staff">교역자</option>
                  </select>
                </div>
                <div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as 'all' | MemberStatus)}
                    className="block w-full md:w-32 px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-black focus:border-black font-korean"
                  >
                    <option value="all">모든 상태</option>
                    <option value="active">활동</option>
                    <option value="inactive">비활동</option>
                    <option value="transferred">이적</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 교인 목록 */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              {listLoading ? (
                <div className="p-12 flex justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-black" />
                </div>
              ) : filteredMembers.length === 0 ? (
                <div className="p-12 text-center text-gray-500 font-korean">
                  <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>등록된 교인이 없습니다.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-korean">
                          이름
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-korean">
                          직분
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-korean">
                          연락처
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-korean">
                          상태
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-korean">
                          등록일
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          관리
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredMembers.map((member) => (
                        <tr key={member.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                                {member.profile_image_url ? (
                                  <img
                                    src={member.profile_image_url}
                                    alt=""
                                    className="h-10 w-10 rounded-full object-cover"
                                  />
                                ) : (
                                  <User className="w-5 h-5 text-gray-400" />
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900 font-korean">
                                  {member.korean_name}
                                </div>
                                {member.english_name && (
                                  <div className="text-sm text-gray-500">{member.english_name}</div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {memberTypeLabels[member.member_type as MemberType]}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {member.phone && (
                                <div className="flex items-center">
                                  <Phone className="w-3 h-3 mr-1 text-gray-400" />
                                  {member.phone}
                                </div>
                              )}
                              {member.email && (
                                <div className="flex items-center text-gray-500">
                                  <Mail className="w-3 h-3 mr-1 text-gray-400" />
                                  {member.email}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                member.status === 'active'
                                  ? 'bg-green-100 text-green-800'
                                  : member.status === 'inactive'
                                  ? 'bg-gray-100 text-gray-800'
                                  : member.status === 'transferred'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {statusLabels[member.status as MemberStatus]}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <Calendar className="w-3 h-3 inline mr-1" />
                            {member.registered_date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => router.push(`/admin/members/${member.id}`)}
                                className="text-gray-400 hover:text-gray-600"
                                title="편집"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(member.id, member.korean_name)}
                                className="text-red-400 hover:text-red-600"
                                title="삭제"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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

export default AdminMembersPage
