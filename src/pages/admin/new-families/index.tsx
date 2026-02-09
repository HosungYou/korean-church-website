import { useEffect, useState, useMemo } from 'react'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import {
  Trash2,
  UserPlus,
  Search,
  Phone,
  Mail,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Users,
  UserCheck,
  UserX,
} from 'lucide-react'
import AdminLayout from '@/components/AdminLayout'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import { newFamilyService, type NewFamily } from '../../../utils/newFamilyServiceSupabase'
import { convertToMember, updateNewFamilyStatus } from '../../../utils/newFamilyService'

// ===========================================
// VS Design Diverge: New Family Management
// Editorial Cards + OKLCH Color System
// ===========================================

type FamilyStatus = 'pending' | 'contacted' | 'visiting' | 'registered' | 'inactive'

const statusConfig: Record<FamilyStatus, { label: string; bg: string; color: string }> = {
  pending: { label: '대기', bg: 'oklch(0.75 0.12 85 / 0.15)', color: 'oklch(0.50 0.12 85)' },
  contacted: { label: '연락완료', bg: 'oklch(0.55 0.15 265 / 0.15)', color: 'oklch(0.45 0.15 265)' },
  visiting: { label: '방문중', bg: 'oklch(0.55 0.15 300 / 0.15)', color: 'oklch(0.45 0.15 300)' },
  registered: { label: '등록완료', bg: 'oklch(0.55 0.15 145 / 0.15)', color: 'oklch(0.40 0.15 145)' },
  inactive: { label: '비활성', bg: 'oklch(0.60 0.01 75 / 0.15)', color: 'oklch(0.50 0.01 75)' },
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')}`
}

const AdminNewFamiliesPage = () => {
  const { admin } = useAdminAuth()
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
    inactive: 0,
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
        newFamilyService.getStatistics(),
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
      setFamilies((prev) => prev.map((f) => (f.id === id ? { ...f, status: newStatus } : f)))
      await newFamilyService.getStatistics().then(setStats)

      // 상태가 'registered'로 변경되면 자동으로 교인 등록
      if (newStatus === 'registered') {
        const family = families.find((f) => f.id === id)
        if (family) {
          try {
            await convertToMember(id)
            alert(`"${family.korean_name || family.english_name}"님이 교인으로 자동 등록되었습니다.`)
          } catch (error: any) {
            console.error('교인 전환 오류:', error)
            alert(`교인 전환 중 오류: ${error.message}`)
          }
        }
      }
    } catch (error) {
      console.error('상태 변경 오류:', error)
      alert('상태 변경 중 오류가 발생했습니다.')
    }
  }

  const handleConvertToMember = async (id: string, name: string) => {
    if (!confirm(`"${name}"님을 교인으로 등록하시겠습니까?`)) return
    try {
      await convertToMember(id)
      await updateNewFamilyStatus(id, 'registered')
      setFamilies((prev) => prev.map((f) => (f.id === id ? { ...f, status: 'registered' } : f)))
      await newFamilyService.getStatistics().then(setStats)
      alert(`"${name}"님이 교인으로 등록되었습니다.`)
    } catch (error: any) {
      console.error('교인 전환 오류:', error)
      alert(`교인 전환 중 오류: ${error.message}`)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`"${name}" 새가족 정보를 삭제하시겠습니까?`)) return

    try {
      await newFamilyService.deleteNewFamily(id)
      setFamilies((prev) => prev.filter((f) => f.id !== id))
      await newFamilyService.getStatistics().then(setStats)
      if (selectedFamily?.id === id) setSelectedFamily(null)
      alert('새가족 정보가 삭제되었습니다.')
    } catch (error) {
      console.error('삭제 오류:', error)
      alert('삭제 중 오류가 발생했습니다.')
    }
  }

  const filteredFamilies = useMemo(() => {
    return families.filter((family) => {
      const familyName = family.korean_name || family.english_name || ''
      const matchesSearch =
        !searchTerm ||
        familyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (family.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (family.phone || '').includes(searchTerm)

      const matchesStatus = filterStatus === 'all' || family.status === filterStatus

      return matchesSearch && matchesStatus
    })
  }, [families, searchTerm, filterStatus])

  const statsCards = [
    { name: '전체', value: stats.total, icon: Users },
    { name: '대기', value: stats.pending, icon: Clock },
    { name: '연락완료', value: stats.contacted, icon: Phone },
    { name: '등록완료', value: stats.registered, icon: UserCheck },
  ]

  return (
    <AdminLayout title="새가족 관리" subtitle="새가족 등록 정보를 관리하세요">
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
            {filteredFamilies.length}명의 새가족
          </span>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as 'all' | FamilyStatus)}
            className="block w-full px-3 py-2.5 rounded-sm transition-all duration-200 focus:outline-none appearance-none cursor-pointer"
            style={{
              background: 'oklch(0.97 0.005 265)',
              border: '1px solid oklch(0.90 0.01 265)',
              color: 'oklch(0.35 0.02 75)',
            }}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Family List */}
        <div className="lg:col-span-2">
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
                  새가족 로딩 중...
                </p>
              </div>
            ) : filteredFamilies.length === 0 ? (
              <div className="p-12 text-center">
                <div
                  className="w-16 h-16 rounded-sm mx-auto mb-4 flex items-center justify-center"
                  style={{ background: 'oklch(0.45 0.12 265 / 0.1)' }}
                >
                  <UserPlus className="w-8 h-8" style={{ color: 'oklch(0.45 0.12 265)' }} />
                </div>
                <p className="text-sm font-medium mb-2" style={{ color: 'oklch(0.45 0.01 75)' }}>
                  등록된 새가족이 없습니다
                </p>
                <p className="text-xs" style={{ color: 'oklch(0.55 0.01 75)' }}>
                  검색 조건을 변경해보세요
                </p>
              </div>
            ) : (
              <div className="divide-y" style={{ borderColor: 'oklch(0.92 0.005 75)' }}>
                {filteredFamilies.map((family, index) => (
                  <div
                    key={family.id}
                    className={`p-4 cursor-pointer transition-all duration-200 stagger-${(index % 6) + 1}`}
                    style={{
                      background:
                        selectedFamily?.id === family.id
                          ? 'oklch(0.45 0.12 265 / 0.05)'
                          : 'transparent',
                    }}
                    onClick={() => setSelectedFamily(family)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-sm flex items-center justify-center"
                          style={{ background: 'oklch(0.45 0.12 265 / 0.1)' }}
                        >
                          <UserPlus className="w-5 h-5" style={{ color: 'oklch(0.45 0.12 265)' }} />
                        </div>
                        <div>
                          <h3 className="text-sm font-medium" style={{ color: 'oklch(0.25 0.02 75)' }}>
                            {family.korean_name || family.english_name}
                          </h3>
                          <div className="flex items-center gap-2 text-xs" style={{ color: 'oklch(0.55 0.01 75)' }}>
                            <Clock className="w-3 h-3" />
                            {formatDate(family.submitted_at)}
                          </div>
                        </div>
                      </div>
                      <span
                        className="px-2.5 py-1 rounded-sm text-xs font-medium"
                        style={{
                          background: statusConfig[family.status as FamilyStatus].bg,
                          color: statusConfig[family.status as FamilyStatus].color,
                        }}
                      >
                        {statusConfig[family.status as FamilyStatus].label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-1">
          <div
            className="p-6 rounded-sm sticky top-24"
            style={{
              background: 'oklch(0.985 0.003 75)',
              border: '1px solid oklch(0.92 0.005 75)',
            }}
          >
            {selectedFamily ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="h-0.5 w-6 mr-3" style={{ background: 'oklch(0.72 0.10 75)' }} />
                    <h3
                      className="font-headline font-bold text-lg"
                      style={{ color: 'oklch(0.22 0.07 265)' }}
                    >
                      상세 정보
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        handleConvertToMember(
                          selectedFamily.id,
                          selectedFamily.korean_name || selectedFamily.english_name || ''
                        )
                      }
                      className="p-2 rounded-sm transition-all duration-200 hover:-translate-y-0.5"
                      style={{
                        background: 'oklch(0.55 0.15 145 / 0.1)',
                        color: 'oklch(0.40 0.15 145)',
                      }}
                      title="교인 등록"
                    >
                      <UserPlus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() =>
                        handleDelete(
                          selectedFamily.id,
                          selectedFamily.korean_name || selectedFamily.english_name || ''
                        )
                      }
                      className="p-2 rounded-sm transition-all duration-200 hover:-translate-y-0.5"
                      style={{ background: 'oklch(0.55 0.18 25 / 0.1)', color: 'oklch(0.50 0.18 25)' }}
                      title="삭제"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs" style={{ color: 'oklch(0.55 0.01 75)' }}>
                      이름
                    </label>
                    <p className="font-medium" style={{ color: 'oklch(0.25 0.02 75)' }}>
                      {selectedFamily.korean_name}
                      {selectedFamily.english_name && ` (${selectedFamily.english_name})`}
                    </p>
                  </div>

                  {selectedFamily.phone && (
                    <div>
                      <label className="text-xs" style={{ color: 'oklch(0.55 0.01 75)' }}>
                        연락처
                      </label>
                      <p className="flex items-center gap-2">
                        <Phone className="w-4 h-4" style={{ color: 'oklch(0.55 0.01 75)' }} />
                        <a
                          href={`tel:${selectedFamily.phone}`}
                          style={{ color: 'oklch(0.45 0.12 265)' }}
                        >
                          {selectedFamily.phone}
                        </a>
                      </p>
                    </div>
                  )}

                  {selectedFamily.email && (
                    <div>
                      <label className="text-xs" style={{ color: 'oklch(0.55 0.01 75)' }}>
                        이메일
                      </label>
                      <p className="flex items-center gap-2">
                        <Mail className="w-4 h-4" style={{ color: 'oklch(0.55 0.01 75)' }} />
                        <a
                          href={`mailto:${selectedFamily.email}`}
                          style={{ color: 'oklch(0.45 0.12 265)' }}
                        >
                          {selectedFamily.email}
                        </a>
                      </p>
                    </div>
                  )}

                  {selectedFamily.address1 && (
                    <div>
                      <label className="text-xs" style={{ color: 'oklch(0.55 0.01 75)' }}>
                        주소
                      </label>
                      <p className="text-sm" style={{ color: 'oklch(0.35 0.02 75)' }}>
                        {selectedFamily.address1}
                        {selectedFamily.address2 && `, ${selectedFamily.address2}`}
                        {selectedFamily.city && `, ${selectedFamily.city}`}
                        {selectedFamily.state && `, ${selectedFamily.state}`}
                        {selectedFamily.zip_code && ` ${selectedFamily.zip_code}`}
                      </p>
                    </div>
                  )}

                  {selectedFamily.birth_date && (
                    <div>
                      <label className="text-xs" style={{ color: 'oklch(0.55 0.01 75)' }}>
                        생년월일
                      </label>
                      <p className="flex items-center gap-2 text-sm" style={{ color: 'oklch(0.35 0.02 75)' }}>
                        <Calendar className="w-4 h-4" style={{ color: 'oklch(0.55 0.01 75)' }} />
                        {selectedFamily.birth_date}
                      </p>
                    </div>
                  )}

                  {selectedFamily.previous_church && (
                    <div>
                      <label className="text-xs" style={{ color: 'oklch(0.55 0.01 75)' }}>
                        이전 교회
                      </label>
                      <p className="text-sm" style={{ color: 'oklch(0.35 0.02 75)' }}>
                        {selectedFamily.previous_church}
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="text-xs" style={{ color: 'oklch(0.55 0.01 75)' }}>
                      세례 여부
                    </label>
                    <p className="flex items-center gap-2 text-sm">
                      {selectedFamily.baptism_date ? (
                        <>
                          <CheckCircle className="w-4 h-4" style={{ color: 'oklch(0.40 0.15 145)' }} />
                          <span style={{ color: 'oklch(0.40 0.15 145)' }}>
                            세례 받음 ({selectedFamily.baptism_date})
                          </span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4" style={{ color: 'oklch(0.55 0.01 75)' }} />
                          <span style={{ color: 'oklch(0.55 0.01 75)' }}>미세례</span>
                        </>
                      )}
                    </p>
                  </div>

                  {selectedFamily.introduction && (
                    <div>
                      <label className="text-xs" style={{ color: 'oklch(0.55 0.01 75)' }}>
                        자기소개
                      </label>
                      <p
                        className="text-sm p-3 rounded-sm"
                        style={{
                          background: 'oklch(0.97 0.005 265)',
                          color: 'oklch(0.35 0.02 75)',
                        }}
                      >
                        {selectedFamily.introduction}
                      </p>
                    </div>
                  )}

                  {selectedFamily.admin_notes && (
                    <div>
                      <label className="text-xs" style={{ color: 'oklch(0.55 0.01 75)' }}>
                        관리자 메모
                      </label>
                      <p
                        className="text-sm p-3 rounded-sm"
                        style={{
                          background: 'oklch(0.72 0.10 75 / 0.1)',
                          color: 'oklch(0.45 0.08 75)',
                        }}
                      >
                        {selectedFamily.admin_notes}
                      </p>
                    </div>
                  )}

                  {/* Status Change */}
                  <div className="pt-4" style={{ borderTop: '1px solid oklch(0.92 0.005 75)' }}>
                    <label className="text-xs block mb-2" style={{ color: 'oklch(0.55 0.01 75)' }}>
                      상태 변경
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {(Object.keys(statusConfig) as FamilyStatus[]).map((status) => (
                        <button
                          key={status}
                          onClick={() => handleStatusChange(selectedFamily.id, status)}
                          className="px-3 py-1.5 rounded-sm text-xs font-medium transition-all duration-200"
                          style={{
                            background:
                              selectedFamily.status === status
                                ? statusConfig[status].bg
                                : 'oklch(0.95 0.005 75)',
                            color:
                              selectedFamily.status === status
                                ? statusConfig[status].color
                                : 'oklch(0.55 0.01 75)',
                          }}
                        >
                          {statusConfig[status].label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <div
                  className="w-16 h-16 rounded-sm mx-auto mb-4 flex items-center justify-center"
                  style={{ background: 'oklch(0.45 0.12 265 / 0.1)' }}
                >
                  <Eye className="w-8 h-8" style={{ color: 'oklch(0.45 0.12 265)' }} />
                </div>
                <p className="text-sm" style={{ color: 'oklch(0.55 0.01 75)' }}>
                  새가족을 선택하면
                  <br />
                  상세 정보를 볼 수 있습니다.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'ko', ['common'])),
  },
})

export default AdminNewFamiliesPage
