import { useEffect, useMemo, useState } from 'react'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import {
  Trash2,
  Mail,
  Search,
  Download,
  UserCheck,
  UserX,
  Users,
  Calendar,
  ArrowRight,
} from 'lucide-react'
import AdminLayout from '@/components/AdminLayout'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import {
  getAllSubscribers as getSubscribers,
  updateSubscriber,
  deleteSubscriber,
  getSubscriberStats,
  exportSubscribersToCSV,
} from '../../../utils/subscriberService'
import type { EmailSubscriber } from '../../../../types/supabase'

// ===========================================
// VS Design Diverge: Subscriber Management
// Editorial Table + OKLCH Color System
// ===========================================

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
}

const AdminSubscribersPage = () => {
  const { admin } = useAdminAuth()
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
        getSubscriberStats(),
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
        inactive: subscriber.is_active ? prev.inactive + 1 : prev.inactive - 1,
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
        inactive: deleted?.is_active ? prev.inactive : prev.inactive - 1,
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

  const filteredSubscribers = useMemo(() => {
    return subscribers.filter((subscriber) => {
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
  }, [subscribers, searchTerm, filterStatus])

  const statsCards = [
    { name: '총 구독자', value: stats.total, icon: Users },
    { name: '활성 구독자', value: stats.active, icon: UserCheck },
    { name: '비활성 구독자', value: stats.inactive, icon: UserX },
  ]

  return (
    <AdminLayout title="구독자 관리" subtitle="이메일 구독자를 관리하세요">
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
            {filteredSubscribers.length}명의 구독자
          </span>
        </div>
        <button
          onClick={handleExport}
          className="inline-flex items-center px-5 py-2.5 rounded-sm font-medium transition-all duration-300 hover:-translate-y-0.5"
          style={{
            background: 'oklch(0.97 0.005 265)',
            border: '1px solid oklch(0.90 0.01 265)',
            color: 'oklch(0.35 0.02 75)',
          }}
        >
          <Download className="w-4 h-4 mr-2" />
          CSV 내보내기
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

      {/* Search and Filters */}
      <div
        className="p-6 rounded-sm mb-6"
        style={{
          background: 'oklch(0.985 0.003 75)',
          border: '1px solid oklch(0.92 0.005 75)',
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Input */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
                style={{ color: 'oklch(0.50 0.01 75)' }}
              />
              <input
                type="text"
                placeholder="이메일 또는 이름으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-4 py-2.5 rounded-sm transition-all duration-200 focus:outline-none"
                style={{
                  background: 'oklch(0.97 0.005 265)',
                  border: '1px solid oklch(0.90 0.01 265)',
                  color: 'oklch(0.25 0.02 75)',
                }}
              />
            </div>
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
            className="block w-full px-3 py-2.5 rounded-sm transition-all duration-200 focus:outline-none appearance-none cursor-pointer"
            style={{
              background: 'oklch(0.97 0.005 265)',
              border: '1px solid oklch(0.90 0.01 265)',
              color: 'oklch(0.35 0.02 75)',
            }}
          >
            <option value="all">모든 상태</option>
            <option value="active">활성</option>
            <option value="inactive">비활성</option>
          </select>
        </div>
      </div>

      {/* Subscribers Table */}
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
              구독자 로딩 중...
            </p>
          </div>
        ) : filteredSubscribers.length === 0 ? (
          <div className="p-12 text-center">
            <div
              className="w-16 h-16 rounded-sm mx-auto mb-4 flex items-center justify-center"
              style={{ background: 'oklch(0.45 0.12 265 / 0.1)' }}
            >
              <Mail className="w-8 h-8" style={{ color: 'oklch(0.45 0.12 265)' }} />
            </div>
            <p className="text-sm font-medium mb-2" style={{ color: 'oklch(0.45 0.01 75)' }}>
              구독자가 없습니다
            </p>
            <p className="text-xs" style={{ color: 'oklch(0.55 0.01 75)' }}>
              검색 조건을 변경해보세요
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr style={{ background: 'oklch(0.97 0.005 265)' }}>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: 'oklch(0.50 0.01 75)' }}
                >
                  이메일
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: 'oklch(0.50 0.01 75)' }}
                >
                  이름
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: 'oklch(0.50 0.01 75)' }}
                >
                  상태
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: 'oklch(0.50 0.01 75)' }}
                >
                  구독일
                </th>
                <th
                  className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider"
                  style={{ color: 'oklch(0.50 0.01 75)' }}
                >
                  관리
                </th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'oklch(0.92 0.005 75)' }}>
              {filteredSubscribers.map((subscriber, index) => (
                <tr
                  key={subscriber.id}
                  className={`transition-colors hover:bg-[oklch(0.97_0.005_265)] stagger-${(index % 6) + 1}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Mail
                        className="w-4 h-4 mr-2"
                        style={{ color: 'oklch(0.55 0.01 75)' }}
                      />
                      <span className="text-sm" style={{ color: 'oklch(0.25 0.02 75)' }}>
                        {subscriber.email}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm" style={{ color: 'oklch(0.45 0.01 75)' }}>
                      {subscriber.name || '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleStatus(subscriber)}
                      className="inline-flex items-center px-2.5 py-1 rounded-sm text-xs font-medium transition-all duration-200"
                      style={{
                        background: subscriber.is_active
                          ? 'oklch(0.55 0.15 145 / 0.15)'
                          : 'oklch(0.55 0.01 75 / 0.1)',
                        color: subscriber.is_active
                          ? 'oklch(0.40 0.15 145)'
                          : 'oklch(0.50 0.01 75)',
                      }}
                    >
                      {subscriber.is_active ? '활성' : '비활성'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar
                        className="w-3.5 h-3.5 mr-1.5"
                        style={{ color: 'oklch(0.55 0.01 75)' }}
                      />
                      <span className="text-sm" style={{ color: 'oklch(0.55 0.01 75)' }}>
                        {formatDate(subscriber.subscribed_at)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => handleDelete(subscriber.id)}
                      className="p-2 rounded-sm transition-all duration-200 hover:-translate-y-0.5"
                      style={{
                        background: 'oklch(0.55 0.18 25 / 0.1)',
                        color: 'oklch(0.50 0.18 25)',
                      }}
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
    </AdminLayout>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'ko', ['common'])),
  },
})

export default AdminSubscribersPage
