import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../../components/Layout'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Calendar,
  ArrowLeft,
  Video,
  Loader2,
  Play,
  User
} from 'lucide-react'
import Link from 'next/link'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import {
  getSermons,
  deleteSermon,
  getYouTubeThumbnailUrl,
  type SermonType
} from '../../../utils/sermonService'
import type { Sermon } from '../../../../types/supabase'

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
  const { admin, loading } = useAdminAuth()
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
      alert('설교가 성공적으로 삭제되었습니다.')
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
                <h1 className="text-xl font-bold text-gray-900 font-korean">설교 관리</h1>
              </div>
              <Link
                href="/admin/sermons/new"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
              >
                <Plus className="w-4 h-4 mr-2" />
                <span className="font-korean">새 설교 등록</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* 통계 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Video className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate font-korean">총 설교</dt>
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
                      <Calendar className="h-6 w-6 text-blue-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate font-korean">주일설교</dt>
                        <dd className="text-lg font-medium text-gray-900">{stats.sunday}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Calendar className="h-6 w-6 text-green-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate font-korean">수요설교</dt>
                        <dd className="text-lg font-medium text-gray-900">{stats.wednesday}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Play className="h-6 w-6 text-red-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate font-korean">영상 포함</dt>
                        <dd className="text-lg font-medium text-gray-900">{stats.withVideo}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 검색 및 필터 */}
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="제목, 설교자, 본문으로 검색..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-black focus:border-black font-korean"
                    />
                  </div>
                </div>
                <div>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as 'all' | SermonType)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-black focus:border-black font-korean"
                  >
                    <option value="all">모든 유형</option>
                    <option value="sunday">주일설교</option>
                    <option value="wednesday">수요설교</option>
                    <option value="friday">금요기도회</option>
                    <option value="special">특별집회</option>
                  </select>
                </div>
                <div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as 'all' | 'published' | 'draft')}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-black focus:border-black font-korean"
                  >
                    <option value="all">모든 상태</option>
                    <option value="published">게시됨</option>
                    <option value="draft">임시저장</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 설교 목록 */}
            <div className="bg-white shadow rounded-lg">
              {listLoading ? (
                <div className="p-12 flex justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-black" />
                </div>
              ) : filteredSermons.length === 0 ? (
                <div className="p-12 text-center text-gray-500 font-korean">등록된 설교가 없습니다.</div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredSermons.map((sermon) => (
                    <div key={sermon.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start gap-4">
                        {/* 썸네일 */}
                        {sermon.youtube_video_id ? (
                          <div className="flex-shrink-0 w-40 h-24 rounded-lg overflow-hidden bg-gray-100">
                            <img
                              src={getYouTubeThumbnailUrl(sermon.youtube_video_id, 'mq')}
                              alt={sermon.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex-shrink-0 w-40 h-24 rounded-lg bg-gray-200 flex items-center justify-center">
                            <Video className="w-8 h-8 text-gray-400" />
                          </div>
                        )}

                        {/* 정보 */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                sermon.status === 'published'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {sermon.status === 'published' ? '게시됨' : '임시저장'}
                            </span>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                sermon.sermon_type === 'sunday'
                                  ? 'bg-blue-100 text-blue-800'
                                  : sermon.sermon_type === 'wednesday'
                                  ? 'bg-green-100 text-green-800'
                                  : sermon.sermon_type === 'friday'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {sermonTypeLabels[sermon.sermon_type as SermonType]}
                            </span>
                            {sermon.is_featured && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                추천
                              </span>
                            )}
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 font-korean mb-1">
                            {sermon.title}
                          </h3>
                          <div className="flex items-center text-sm text-gray-500 gap-4">
                            {sermon.speaker && (
                              <div className="flex items-center">
                                <User className="w-4 h-4 mr-1" />
                                <span>{sermon.speaker}</span>
                              </div>
                            )}
                            {sermon.scripture && (
                              <div className="text-primary">{sermon.scripture}</div>
                            )}
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              <span>{formatKoreanDate(sermon.sermon_date)}</span>
                            </div>
                          </div>
                        </div>

                        {/* 액션 버튼 */}
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => router.push(`/admin/sermons/${sermon.id}`)}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            <span className="font-korean">편집</span>
                          </button>
                          <button
                            onClick={() => handleDelete(sermon.id)}
                            className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            <span className="font-korean">삭제</span>
                          </button>
                        </div>
                      </div>
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

export default AdminSermonsPage
