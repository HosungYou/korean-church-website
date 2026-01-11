import { useEffect, useState } from 'react'
import Layout from '../../../components/Layout'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import {
  Trash2,
  ArrowLeft,
  Mail,
  Loader2,
  Search,
  Download,
  UserCheck,
  UserX,
  Users
} from 'lucide-react'
import Link from 'next/link'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import {
  getAllSubscribers as getSubscribers,
  updateSubscriber,
  deleteSubscriber,
  getSubscriberStats,
  exportSubscribersToCSV
} from '../../../utils/subscriberService'
import type { EmailSubscriber } from '../../../../types/supabase'

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')}`
}

const AdminSubscribersPage = () => {
  const { admin, loading } = useAdminAuth()
  const [subscribers, setSubscribers] = useState<EmailSubscriber[]>([])
  const [listLoading, setListLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all')
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 })

  useEffect(() => {
    if (!admin) return
    fetchData()
  }, [admin])

  const fetchData = async () => {
    try {
      setListLoading(true)
      const [subscribersData, statsData] = await Promise.all([
        getSubscribers(),
        getSubscriberStats()
      ])
      setSubscribers(subscribersData)
      setStats(statsData)
    } catch (error) {
      console.error('구독자 조회 오류:', error)
    } finally {
      setListLoading(false)
    }
  }

  const handleToggleStatus = async (subscriber: EmailSubscriber) => {
    try {
      await updateSubscriber(subscriber.id, { is_active: !subscriber.is_active })
      setSubscribers((prev) =>
        prev.map((s) => (s.id === subscriber.id ? { ...s, is_active: !s.is_active } : s))
      )
      setStats((prev) => ({
        ...prev,
        active: subscriber.is_active ? prev.active - 1 : prev.active + 1,
        inactive: subscriber.is_active ? prev.inactive + 1 : prev.inactive - 1
      }))
    } catch (error) {
      console.error('상태 변경 오류:', error)
      alert('상태 변경 중 오류가 발생했습니다.')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('이 구독자를 삭제하시겠습니까?')) return

    try {
      await deleteSubscriber(id)
      const deleted = subscribers.find((s) => s.id === id)
      setSubscribers((prev) => prev.filter((s) => s.id !== id))
      setStats((prev) => ({
        total: prev.total - 1,
        active: deleted?.is_active ? prev.active - 1 : prev.active,
        inactive: deleted?.is_active ? prev.inactive : prev.inactive - 1
      }))
      alert('구독자가 삭제되었습니다.')
    } catch (error) {
      console.error('삭제 오류:', error)
      alert('삭제 중 오류가 발생했습니다.')
    }
  }

  const handleExport = async () => {
    try {
      const csv = await exportSubscribersToCSV()
      const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `subscribers_${new Date().toISOString().split('T')[0]}.csv`
      link.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('내보내기 오류:', error)
      alert('내보내기 중 오류가 발생했습니다.')
    }
  }

  const filteredSubscribers = subscribers.filter((subscriber) => {
    const matchesSearch =
      !searchTerm ||
      subscriber.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (subscriber.name || '').toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'active' && subscriber.is_active) ||
      (filterStatus === 'inactive' && !subscriber.is_active)

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
                <h1 className="text-xl font-bold text-gray-900 font-korean">구독자 관리</h1>
              </div>
              <button
                onClick={handleExport}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <Download className="w-4 h-4 mr-2" />
                <span className="font-korean">CSV 내보내기</span>
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* 통계 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Users className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate font-korean">총 구독자</dt>
                        <dd className="text-lg font-medium text-gray-900">{stats.total}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <UserCheck className="h-6 w-6 text-green-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate font-korean">활성 구독자</dt>
                        <dd className="text-lg font-medium text-gray-900">{stats.active}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <UserX className="h-6 w-6 text-red-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate font-korean">비활성 구독자</dt>
                        <dd className="text-lg font-medium text-gray-900">{stats.inactive}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
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
                      placeholder="이메일 또는 이름으로 검색..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-black focus:border-black font-korean"
                    />
                  </div>
                </div>
                <div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
                    className="block w-full md:w-40 px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-black focus:border-black font-korean"
                  >
                    <option value="all">모든 상태</option>
                    <option value="active">활성</option>
                    <option value="inactive">비활성</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 구독자 목록 */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              {listLoading ? (
                <div className="p-12 flex justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-black" />
                </div>
              ) : filteredSubscribers.length === 0 ? (
                <div className="p-12 text-center text-gray-500 font-korean">
                  <Mail className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>구독자가 없습니다.</p>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-korean">
                        이메일
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-korean">
                        이름
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-korean">
                        상태
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-korean">
                        구독일
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        관리
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredSubscribers.map((subscriber) => (
                      <tr key={subscriber.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Mail className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">{subscriber.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900 font-korean">
                            {subscriber.name || '-'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleToggleStatus(subscriber)}
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              subscriber.is_active
                                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            }`}
                          >
                            {subscriber.is_active ? '활성' : '비활성'}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(subscriber.subscribed_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button
                            onClick={() => handleDelete(subscriber.id)}
                            className="text-red-400 hover:text-red-600"
                            title="삭제"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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

export default AdminSubscribersPage
