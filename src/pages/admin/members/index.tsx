import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/router'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import {
  Plus,
  Edit,
  Trash2,
  Users,
  Search,
  Download,
  Upload,
  Phone,
  Mail,
  User,
  Calendar,
  UserCheck,
  UserPlus,
  ArrowRight,
} from 'lucide-react'
import Link from 'next/link'
import AdminLayout from '@/components/AdminLayout'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import {
  getAllMembers,
  deleteMember,
  getMemberStats,
  exportMembersToCSV,
  parseCSV,
  importMembersFromCSV,
  type MemberType,
  type MemberStatus,
  type ParsedMemberRow,
  type CSVImportResult,
} from '../../../utils/memberService'
import type { ChurchMember } from '../../../../types/supabase'

// ===========================================
// VS Design Diverge: Member Management
// Editorial Table + OKLCH Color System
// ===========================================

const memberTypeLabels: Record<MemberType, string> = {
  member: '성도',
  deacon: '집사',
  elder: '장로',
  pastor: '목사',
  staff: '교역자',
}

const statusConfig: Record<MemberStatus, { label: string; bg: string; color: string }> = {
  active: { label: '활동', bg: 'oklch(0.55 0.15 145 / 0.15)', color: 'oklch(0.40 0.15 145)' },
  inactive: { label: '비활동', bg: 'oklch(0.60 0.01 75 / 0.15)', color: 'oklch(0.50 0.01 75)' },
  transferred: { label: '이적', bg: 'oklch(0.75 0.12 85 / 0.15)', color: 'oklch(0.50 0.12 85)' },
  deceased: { label: '사망', bg: 'oklch(0.55 0.18 25 / 0.15)', color: 'oklch(0.50 0.18 25)' },
}

const AdminMembersPage = () => {
  const router = useRouter()
  const { admin } = useAdminAuth()
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
    byType: {} as Record<MemberType, number>,
  })
  const [showImportModal, setShowImportModal] = useState(false)
  const [importPreview, setImportPreview] = useState<ParsedMemberRow[]>([])
  const [importResult, setImportResult] = useState<CSVImportResult | null>(null)
  const [importing, setImporting] = useState(false)

  useEffect(() => {
    if (!admin) return
    fetchData()
  }, [admin])

  const fetchData = async () => {
    try {
      setListLoading(true)
      const [membersData, statsData] = await Promise.all([getAllMembers(), getMemberStats()])
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

  const handleCSVFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      const parsed = parseCSV(text)
      setImportPreview(parsed)
      setImportResult(null)
    }
    reader.readAsText(file, 'UTF-8')
  }

  const handleImport = async () => {
    if (importPreview.length === 0) return
    setImporting(true)
    try {
      const result = await importMembersFromCSV(importPreview)
      setImportResult(result)
      if (result.success > 0) fetchData()
    } catch (error) {
      console.error('Import error:', error)
    } finally {
      setImporting(false)
    }
  }

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
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
  }, [members, searchTerm, filterType, filterStatus])

  const statsCards = [
    { name: '총 교인', value: stats.total, icon: Users },
    { name: '활동 교인', value: stats.active, icon: UserCheck },
    { name: '세례 교인', value: stats.baptized, icon: User },
    { name: '이번 달 등록', value: stats.newThisMonth, icon: UserPlus },
  ]

  return (
    <AdminLayout title="교인 관리" subtitle="교인 정보를 관리하세요">
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
            {filteredMembers.length}명의 교인
          </span>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowImportModal(true)}
            className="inline-flex items-center px-5 py-2.5 rounded-sm font-medium transition-all duration-300 hover:-translate-y-0.5"
            style={{
              background: 'oklch(0.97 0.005 265)',
              border: '1px solid oklch(0.90 0.01 265)',
              color: 'oklch(0.35 0.02 75)',
            }}
          >
            <Upload className="w-4 h-4 mr-2" />
            CSV 가져오기
          </button>
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
          <Link
            href="/admin/members/new"
            className="inline-flex items-center px-5 py-2.5 rounded-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
            style={{
              background: 'oklch(0.45 0.12 265)',
              color: 'oklch(0.98 0.003 75)',
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            새 교인
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
                style={{ color: 'oklch(0.50 0.01 75)' }}
              />
              <input
                type="text"
                placeholder="이름, 이메일, 전화번호로 검색..."
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
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as 'all' | MemberType)}
            className="block w-full px-3 py-2.5 rounded-sm transition-all duration-200 focus:outline-none appearance-none cursor-pointer"
            style={{
              background: 'oklch(0.97 0.005 265)',
              border: '1px solid oklch(0.90 0.01 265)',
              color: 'oklch(0.35 0.02 75)',
            }}
          >
            <option value="all">모든 직분</option>
            <option value="member">성도</option>
            <option value="deacon">집사</option>
            <option value="elder">장로</option>
            <option value="pastor">목사</option>
            <option value="staff">교역자</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as 'all' | MemberStatus)}
            className="block w-full px-3 py-2.5 rounded-sm transition-all duration-200 focus:outline-none appearance-none cursor-pointer"
            style={{
              background: 'oklch(0.97 0.005 265)',
              border: '1px solid oklch(0.90 0.01 265)',
              color: 'oklch(0.35 0.02 75)',
            }}
          >
            <option value="all">모든 상태</option>
            <option value="active">활동</option>
            <option value="inactive">비활동</option>
            <option value="transferred">이적</option>
          </select>
        </div>
      </div>

      {/* Members Table */}
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
              교인 로딩 중...
            </p>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="p-12 text-center">
            <div
              className="w-16 h-16 rounded-sm mx-auto mb-4 flex items-center justify-center"
              style={{ background: 'oklch(0.45 0.12 265 / 0.1)' }}
            >
              <Users className="w-8 h-8" style={{ color: 'oklch(0.45 0.12 265)' }} />
            </div>
            <p className="text-sm font-medium mb-2" style={{ color: 'oklch(0.45 0.01 75)' }}>
              등록된 교인이 없습니다
            </p>
            <p className="text-xs" style={{ color: 'oklch(0.55 0.01 75)' }}>
              새 교인을 등록하세요
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ background: 'oklch(0.97 0.005 265)' }}>
                <tr>
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
                    직분
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: 'oklch(0.50 0.01 75)' }}
                  >
                    연락처
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
                    등록일
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
                {filteredMembers.map((member, index) => (
                  <tr
                    key={member.id}
                    className={`transition-colors hover:bg-[oklch(0.97_0.005_265)] stagger-${(index % 6) + 1}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className="flex-shrink-0 h-10 w-10 rounded-sm flex items-center justify-center"
                          style={{ background: 'oklch(0.45 0.12 265 / 0.1)' }}
                        >
                          {member.profile_image_url ? (
                            <img
                              src={member.profile_image_url}
                              alt=""
                              className="h-10 w-10 rounded-sm object-cover"
                            />
                          ) : (
                            <User className="w-5 h-5" style={{ color: 'oklch(0.45 0.12 265)' }} />
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium" style={{ color: 'oklch(0.25 0.02 75)' }}>
                            {member.korean_name}
                          </div>
                          {member.english_name && (
                            <div className="text-sm" style={{ color: 'oklch(0.55 0.01 75)' }}>
                              {member.english_name}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className="px-2.5 py-1 rounded-sm text-xs font-medium"
                        style={{
                          background: 'oklch(0.45 0.12 265 / 0.1)',
                          color: 'oklch(0.45 0.12 265)',
                        }}
                      >
                        {memberTypeLabels[member.member_type as MemberType]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        {member.phone && (
                          <div className="flex items-center" style={{ color: 'oklch(0.35 0.02 75)' }}>
                            <Phone className="w-3 h-3 mr-1.5" style={{ color: 'oklch(0.55 0.01 75)' }} />
                            {member.phone}
                          </div>
                        )}
                        {member.email && (
                          <div className="flex items-center" style={{ color: 'oklch(0.55 0.01 75)' }}>
                            <Mail className="w-3 h-3 mr-1.5" style={{ color: 'oklch(0.55 0.01 75)' }} />
                            {member.email}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className="px-2.5 py-1 rounded-sm text-xs font-medium"
                        style={{
                          background: statusConfig[member.status as MemberStatus].bg,
                          color: statusConfig[member.status as MemberStatus].color,
                        }}
                      >
                        {statusConfig[member.status as MemberStatus].label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: 'oklch(0.55 0.01 75)' }}>
                      <div className="flex items-center">
                        <Calendar className="w-3.5 h-3.5 mr-1.5" style={{ color: 'oklch(0.55 0.01 75)' }} />
                        {member.registered_date}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => router.push(`/admin/members/${member.id}`)}
                          className="p-2 rounded-sm transition-all duration-200 hover:-translate-y-0.5"
                          style={{
                            background: 'oklch(0.45 0.12 265 / 0.1)',
                            color: 'oklch(0.45 0.12 265)',
                          }}
                          title="편집"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(member.id, member.korean_name)}
                          className="p-2 rounded-sm transition-all duration-200 hover:-translate-y-0.5"
                          style={{
                            background: 'oklch(0.55 0.18 25 / 0.1)',
                            color: 'oklch(0.50 0.18 25)',
                          }}
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

      {/* CSV Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'oklch(0 0 0 / 0.5)' }}>
          <div className="w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-sm p-6" style={{ background: 'oklch(0.985 0.003 75)' }}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold" style={{ color: 'oklch(0.22 0.07 265)' }}>CSV 가져오기</h3>
              <button onClick={() => { setShowImportModal(false); setImportPreview([]); setImportResult(null) }} className="text-2xl" style={{ color: 'oklch(0.55 0.01 75)' }}>&times;</button>
            </div>
            <input type="file" accept=".csv" onChange={handleCSVFile} className="mb-4 block w-full text-sm" />
            {importPreview.length > 0 && !importResult && (
              <div>
                <p className="text-sm mb-2" style={{ color: 'oklch(0.45 0.01 75)' }}>{importPreview.length}명의 교인 데이터가 확인되었습니다.</p>
                <div className="max-h-48 overflow-y-auto mb-4 rounded-sm" style={{ border: '1px solid oklch(0.92 0.005 75)' }}>
                  <table className="w-full text-sm">
                    <thead style={{ background: 'oklch(0.97 0.005 265)' }}>
                      <tr>
                        <th className="px-3 py-2 text-left">이름</th>
                        <th className="px-3 py-2 text-left">전화</th>
                        <th className="px-3 py-2 text-left">이메일</th>
                        <th className="px-3 py-2 text-left">직분</th>
                      </tr>
                    </thead>
                    <tbody>
                      {importPreview.slice(0, 10).map((row, i) => (
                        <tr key={i} style={{ borderTop: '1px solid oklch(0.92 0.005 75)' }}>
                          <td className="px-3 py-2">{row.korean_name}</td>
                          <td className="px-3 py-2">{row.phone || '-'}</td>
                          <td className="px-3 py-2">{row.email || '-'}</td>
                          <td className="px-3 py-2">{row.member_type || 'member'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {importPreview.length > 10 && <p className="p-2 text-xs text-center" style={{ color: 'oklch(0.55 0.01 75)' }}>... 외 {importPreview.length - 10}명</p>}
                </div>
                <button onClick={handleImport} disabled={importing} className="px-5 py-2.5 rounded-sm font-medium transition-all duration-300" style={{ background: 'oklch(0.45 0.12 265)', color: 'oklch(0.98 0.003 75)' }}>
                  {importing ? '가져오는 중...' : `${importPreview.length}명 가져오기`}
                </button>
              </div>
            )}
            {importResult && (
              <div className="mt-4 p-4 rounded-sm" style={{ background: 'oklch(0.97 0.005 75)', border: '1px solid oklch(0.92 0.005 75)' }}>
                <p className="font-medium mb-2" style={{ color: 'oklch(0.22 0.07 265)' }}>가져오기 결과</p>
                <p style={{ color: 'oklch(0.40 0.15 145)' }}>성공: {importResult.success}명</p>
                {importResult.duplicates > 0 && <p style={{ color: 'oklch(0.50 0.12 85)' }}>중복: {importResult.duplicates}명</p>}
                {importResult.failed > 0 && <p style={{ color: 'oklch(0.50 0.18 25)' }}>실패: {importResult.failed}명</p>}
                {importResult.errors.length > 0 && (
                  <div className="mt-2 max-h-32 overflow-y-auto text-xs" style={{ color: 'oklch(0.55 0.01 75)' }}>
                    {importResult.errors.map((err, i) => <p key={i}>{err}</p>)}
                  </div>
                )}
              </div>
            )}
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

export default AdminMembersPage
