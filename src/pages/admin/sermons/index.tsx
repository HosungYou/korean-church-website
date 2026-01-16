import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Calendar,
  Video,
  Play,
  User,
  Star,
  ArrowRight,
} from 'lucide-react'
import Link from 'next/link'
import AdminLayout from '@/components/AdminLayout'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import {
  getSermons,
  deleteSermon,
  getYouTubeThumbnailUrl,
  type SermonType
} from '../../../utils/sermonService'
import type { Sermon } from '../../../../types/supabase'

// ===========================================
// VS Design Diverge: Sermons Management
// Editorial Cards + OKLCH Color System
// ===========================================

const formatKoreanDate = (dateString?: string | null): string => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const year = `${date.getFullYear()}`.slice(-2)
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}.${month}.${day}`
}

const sermonTypeLabels: Record<SermonType, string> = {
  sunday: '주일설교',
  wednesday: '수요설교',
  friday: '금요기도회',
  special: '특별집회'
}

const AdminSermonsPage = () => {
  const router = useRouter()
  const { admin } = useAdminAuth()
  const [sermons, setSermons] = useState<Sermon[]>([])
  const [listLoading, setListLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | SermonType>('all')
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all')

  useEffect(() => {
    if (!admin) return

    const fetchSermons = async () => {
      try {
        setListLoading(true)
        const data = await getSermons({ limit: 100 })
        setSermons(data)
      } catch (error) {
        console.error('설교 조회 오류:', error)
      } finally {
        setListLoading(false)
      }
    }

    fetchSermons()
  }, [admin])

  const handleDelete = async (id: string) => {
    if (!confirm('선택한 설교를 삭제하시겠습니까?')) return

    try {
      await deleteSermon(id)
      setSermons((prev) => prev.filter((sermon) => sermon.id !== id))
    } catch (error) {
      console.error('삭제 오류:', error)
      alert('삭제 중 오류가 발생했습니다.')
    }
  }

  const filteredSermons = useMemo(() => {
    const lowerSearch = searchTerm.trim().toLowerCase()

    return sermons.filter((sermon) => {
      const matchesSearch =
        !lowerSearch ||
        sermon.title.toLowerCase().includes(lowerSearch) ||
        (sermon.speaker || '').toLowerCase().includes(lowerSearch) ||
        (sermon.scripture || '').toLowerCase().includes(lowerSearch)

      const matchesType = filterType === 'all' || sermon.sermon_type === filterType
      const matchesStatus = filterStatus === 'all' || sermon.status === filterStatus

      return matchesSearch && matchesType && matchesStatus
    })
  }, [sermons, searchTerm, filterType, filterStatus])

  const stats = useMemo(() => {
    const total = sermons.length
    const sunday = sermons.filter((s) => s.sermon_type === 'sunday').length
    const wednesday = sermons.filter((s) => s.sermon_type === 'wednesday').length
    const withVideo = sermons.filter((s) => s.youtube_video_id).length

    return { total, sunday, wednesday, withVideo }
  }, [sermons])

  const statsCards = [
    {
      name: '총 설교',
      value: stats.total,
      icon: Video,
    },
    {
      name: '주일설교',
      value: stats.sunday,
      icon: Calendar,
    },
    {
      name: '수요설교',
      value: stats.wednesday,
      icon: Calendar,
    },
    {
      name: '영상 포함',
      value: stats.withVideo,
      icon: Play,
    },
  ]

  const getStatusStyle = (status: string) => {
    if (status === 'published') {
      return {
        background: 'oklch(0.55 0.15 145 / 0.15)',
        color: 'oklch(0.45 0.15 145)',
      }
    }
    return {
      background: 'oklch(0.55 0.01 75 / 0.15)',
      color: 'oklch(0.45 0.01 75)',
    }
  }

  const getTypeStyle = (type: SermonType) => {
    switch (type) {
      case 'sunday':
        return {
          background: 'oklch(0.55 0.12 265 / 0.15)',
          color: 'oklch(0.45 0.12 265)',
        }
      case 'wednesday':
        return {
          background: 'oklch(0.55 0.15 145 / 0.15)',
          color: 'oklch(0.45 0.15 145)',
        }
      case 'friday':
        return {
          background: 'oklch(0.55 0.12 310 / 0.15)',
          color: 'oklch(0.45 0.12 310)',
        }
      default:
        return {
          background: 'oklch(0.72 0.10 75 / 0.15)',
          color: 'oklch(0.55 0.12 75)',
        }
    }
  }

  return (
    <AdminLayout title="설교 관리" subtitle="설교 영상을 관리하세요">
      {/* Action Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <div
            className="h-0.5 w-8 mr-4"
            style={{
              background: 'linear-gradient(90deg, oklch(0.72 0.10 75), oklch(0.45 0.12 265))',
            }}
          />
          <span
            className="text-sm font-medium"
            style={{ color: 'oklch(0.55 0.01 75)' }}
          >
            {filteredSermons.length}개의 설교
          </span>
        </div>
        <Link
          href="/admin/sermons/new"
          className="inline-flex items-center px-5 py-2.5 rounded-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
          style={{
            background: 'oklch(0.45 0.12 265)',
            color: 'oklch(0.98 0.003 75)',
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          새 설교 등록
        </Link>
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
              <p
                className="text-xs font-medium mb-1"
                style={{ color: 'oklch(0.55 0.01 75)' }}
              >
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
          {/* Search Input */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
                style={{ color: 'oklch(0.50 0.01 75)' }}
              />
              <input
                type="text"
                placeholder="제목, 설교자, 본문으로 검색..."
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

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as 'all' | SermonType)}
            className="block w-full px-3 py-2.5 rounded-sm transition-all duration-200 focus:outline-none appearance-none cursor-pointer"
            style={{
              background: 'oklch(0.97 0.005 265)',
              border: '1px solid oklch(0.90 0.01 265)',
              color: 'oklch(0.35 0.02 75)',
            }}
          >
            <option value="all">모든 유형</option>
            <option value="sunday">주일설교</option>
            <option value="wednesday">수요설교</option>
            <option value="friday">금요기도회</option>
            <option value="special">특별집회</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as 'all' | 'published' | 'draft')}
            className="block w-full px-3 py-2.5 rounded-sm transition-all duration-200 focus:outline-none appearance-none cursor-pointer"
            style={{
              background: 'oklch(0.97 0.005 265)',
              border: '1px solid oklch(0.90 0.01 265)',
              color: 'oklch(0.35 0.02 75)',
            }}
          >
            <option value="all">모든 상태</option>
            <option value="published">게시됨</option>
            <option value="draft">임시저장</option>
          </select>
        </div>
      </div>

      {/* Sermons List */}
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
            <p
              className="text-sm font-medium"
              style={{ color: 'oklch(0.55 0.01 75)' }}
            >
              설교 로딩 중...
            </p>
          </div>
        ) : filteredSermons.length === 0 ? (
          <div className="p-12 text-center">
            <div
              className="w-16 h-16 rounded-sm mx-auto mb-4 flex items-center justify-center"
              style={{ background: 'oklch(0.45 0.12 265 / 0.1)' }}
            >
              <Video className="w-8 h-8" style={{ color: 'oklch(0.45 0.12 265)' }} />
            </div>
            <p
              className="text-sm font-medium mb-2"
              style={{ color: 'oklch(0.45 0.01 75)' }}
            >
              등록된 설교가 없습니다
            </p>
            <p
              className="text-xs"
              style={{ color: 'oklch(0.55 0.01 75)' }}
            >
              새 설교를 등록하거나 필터를 변경해보세요
            </p>
          </div>
        ) : (
          <div>
            {filteredSermons.map((sermon, index) => {
              const statusStyle = getStatusStyle(sermon.status)
              const typeStyle = getTypeStyle(sermon.sermon_type as SermonType)

              return (
                <div
                  key={sermon.id}
                  className={`p-6 transition-all duration-200 hover:translate-x-1 stagger-${(index % 6) + 1}`}
                  style={{
                    borderBottom: index < filteredSermons.length - 1 ? '1px solid oklch(0.92 0.005 75)' : 'none',
                  }}
                >
                  <div className="flex items-start gap-5">
                    {/* Thumbnail */}
                    <div className="flex-shrink-0 w-44 h-28 rounded-sm overflow-hidden relative group">
                      {sermon.youtube_video_id ? (
                        <>
                          <img
                            src={getYouTubeThumbnailUrl(sermon.youtube_video_id, 'mq')}
                            alt={sermon.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div
                            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            style={{ background: 'oklch(0.15 0.05 265 / 0.5)' }}
                          >
                            <div
                              className="w-10 h-10 rounded-full flex items-center justify-center"
                              style={{ background: 'oklch(0.72 0.10 75)' }}
                            >
                              <Play className="w-5 h-5 ml-0.5" style={{ color: 'oklch(0.15 0.05 265)' }} />
                            </div>
                          </div>
                        </>
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center"
                          style={{ background: 'oklch(0.92 0.01 265)' }}
                        >
                          <Video className="w-10 h-10" style={{ color: 'oklch(0.70 0.01 75)' }} />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      {/* Tags */}
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className="inline-flex items-center px-2.5 py-1 rounded-sm text-xs font-medium"
                          style={statusStyle}
                        >
                          {sermon.status === 'published' ? '게시됨' : '임시저장'}
                        </span>
                        <span
                          className="inline-flex items-center px-2.5 py-1 rounded-sm text-xs font-medium"
                          style={typeStyle}
                        >
                          {sermonTypeLabels[sermon.sermon_type as SermonType]}
                        </span>
                        {sermon.is_featured && (
                          <span
                            className="inline-flex items-center px-2.5 py-1 rounded-sm text-xs font-medium"
                            style={{
                              background: 'oklch(0.72 0.10 75 / 0.15)',
                              color: 'oklch(0.55 0.12 75)',
                            }}
                          >
                            <Star className="w-3 h-3 mr-1" />
                            추천
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3
                        className="font-headline font-bold text-lg mb-2 line-clamp-1"
                        style={{ color: 'oklch(0.22 0.07 265)' }}
                      >
                        {sermon.title}
                      </h3>

                      {/* Meta */}
                      <div className="flex items-center gap-4">
                        {sermon.speaker && (
                          <span
                            className="flex items-center gap-1.5 text-xs"
                            style={{ color: 'oklch(0.55 0.01 75)' }}
                          >
                            <User className="w-3.5 h-3.5" />
                            {sermon.speaker}
                          </span>
                        )}
                        {sermon.scripture && (
                          <span
                            className="text-xs font-medium"
                            style={{ color: 'oklch(0.45 0.12 265)' }}
                          >
                            {sermon.scripture}
                          </span>
                        )}
                        <span
                          className="flex items-center gap-1.5 text-xs"
                          style={{ color: 'oklch(0.55 0.01 75)' }}
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          {formatKoreanDate(sermon.sermon_date)}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => router.push(`/admin/sermons/${sermon.id}`)}
                        className="group inline-flex items-center px-4 py-2 rounded-sm font-medium text-sm transition-all duration-200 hover:-translate-y-0.5"
                        style={{
                          background: 'oklch(0.45 0.12 265)',
                          color: 'oklch(0.98 0.003 75)',
                        }}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        편집
                        <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                      <button
                        onClick={() => handleDelete(sermon.id)}
                        className="inline-flex items-center px-3 py-2 rounded-sm font-medium text-sm transition-all duration-200 hover:-translate-y-0.5"
                        style={{
                          background: 'oklch(0.55 0.18 25 / 0.1)',
                          color: 'oklch(0.50 0.18 25)',
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
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

export default AdminSermonsPage
