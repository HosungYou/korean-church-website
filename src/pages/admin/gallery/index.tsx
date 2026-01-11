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
  Image,
  Loader2,
  Eye,
  EyeOff,
  FolderOpen
} from 'lucide-react'
import Link from 'next/link'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import { getAllAlbums, deleteAlbum } from '../../../utils/galleryService'
import type { GalleryAlbum } from '../../../../types/supabase'

const formatKoreanDate = (dateString?: string | null): string => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
}

const AdminGalleryPage = () => {
  const router = useRouter()
  const { admin, loading } = useAdminAuth()
  const [albums, setAlbums] = useState<GalleryAlbum[]>([])
  const [listLoading, setListLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterYear, setFilterYear] = useState<string>('all')
  const [filterVisibility, setFilterVisibility] = useState<'all' | 'visible' | 'hidden'>('all')

  useEffect(() => {
    if (!admin) return

    const fetchAlbums = async () => {
      try {
        setListLoading(true)
        const data = await getAllAlbums()
        setAlbums(data)
      } catch (error) {
        console.error('앨범 조회 오류:', error)
      } finally {
        setListLoading(false)
      }
    }

    fetchAlbums()
  }, [admin])

  const handleDelete = async (id: string, albumTitle: string) => {
    if (!confirm(`"${albumTitle}" 앨범과 모든 사진을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`)) return

    try {
      await deleteAlbum(id)
      setAlbums((prev) => prev.filter((album) => album.id !== id))
      alert('앨범이 삭제되었습니다.')
    } catch (error) {
      console.error('삭제 오류:', error)
      alert('삭제 중 오류가 발생했습니다.')
    }
  }

  const years = useMemo(() => {
    const uniqueYears = Array.from(new Set(albums.map((a) => a.year).filter(Boolean)))
    return uniqueYears.sort((a, b) => (b || 0) - (a || 0))
  }, [albums])

  const filteredAlbums = useMemo(() => {
    const lowerSearch = searchTerm.trim().toLowerCase()

    return albums.filter((album) => {
      const matchesSearch =
        !lowerSearch ||
        album.title.toLowerCase().includes(lowerSearch) ||
        (album.description || '').toLowerCase().includes(lowerSearch)

      const matchesYear = filterYear === 'all' || album.year === parseInt(filterYear)
      const matchesVisibility =
        filterVisibility === 'all' ||
        (filterVisibility === 'visible' && album.is_visible) ||
        (filterVisibility === 'hidden' && !album.is_visible)

      return matchesSearch && matchesYear && matchesVisibility
    })
  }, [albums, searchTerm, filterYear, filterVisibility])

  const stats = useMemo(() => {
    const total = albums.length
    const visible = albums.filter((a) => a.is_visible).length
    const totalPhotos = albums.reduce((sum, a) => sum + (a.photo_count || 0), 0)
    const thisYear = albums.filter((a) => a.year === new Date().getFullYear()).length

    return { total, visible, totalPhotos, thisYear }
  }, [albums])

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
                <h1 className="text-xl font-bold text-gray-900 font-korean">갤러리 관리</h1>
              </div>
              <Link
                href="/admin/gallery/new"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
              >
                <Plus className="w-4 h-4 mr-2" />
                <span className="font-korean">새 앨범</span>
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
                      <FolderOpen className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate font-korean">총 앨범</dt>
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
                      <Eye className="h-6 w-6 text-green-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate font-korean">공개 앨범</dt>
                        <dd className="text-lg font-medium text-gray-900">{stats.visible}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Image className="h-6 w-6 text-blue-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate font-korean">총 사진</dt>
                        <dd className="text-lg font-medium text-gray-900">{stats.totalPhotos}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Calendar className="h-6 w-6 text-purple-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate font-korean">올해 앨범</dt>
                        <dd className="text-lg font-medium text-gray-900">{stats.thisYear}</dd>
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
                      placeholder="앨범 제목으로 검색..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-black focus:border-black font-korean"
                    />
                  </div>
                </div>
                <div>
                  <select
                    value={filterYear}
                    onChange={(e) => setFilterYear(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-black focus:border-black font-korean"
                  >
                    <option value="all">모든 연도</option>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}년
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <select
                    value={filterVisibility}
                    onChange={(e) => setFilterVisibility(e.target.value as 'all' | 'visible' | 'hidden')}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-black focus:border-black font-korean"
                  >
                    <option value="all">모든 상태</option>
                    <option value="visible">공개</option>
                    <option value="hidden">비공개</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 앨범 목록 */}
            <div className="bg-white shadow rounded-lg">
              {listLoading ? (
                <div className="p-12 flex justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-black" />
                </div>
              ) : filteredAlbums.length === 0 ? (
                <div className="p-12 text-center text-gray-500 font-korean">등록된 앨범이 없습니다.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                  {filteredAlbums.map((album) => (
                    <div
                      key={album.id}
                      className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      {/* 커버 이미지 */}
                      <div className="aspect-video bg-gray-100 relative">
                        {album.cover_image_url ? (
                          <img
                            src={album.cover_image_url}
                            alt={album.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Image className="w-12 h-12 text-gray-300" />
                          </div>
                        )}
                        {!album.is_visible && (
                          <div className="absolute top-2 right-2 bg-gray-900 bg-opacity-75 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                            <EyeOff className="w-3 h-3" />
                            비공개
                          </div>
                        )}
                      </div>

                      {/* 정보 */}
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-900 font-korean mb-1">
                          {album.title}
                        </h3>
                        <div className="flex items-center text-sm text-gray-500 gap-3 mb-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatKoreanDate(album.album_date)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Image className="w-4 h-4" />
                            {album.photo_count || 0}장
                          </span>
                        </div>
                        {album.description && (
                          <p className="text-sm text-gray-600 line-clamp-2 mb-3">{album.description}</p>
                        )}

                        {/* 액션 버튼 */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => router.push(`/admin/gallery/${album.id}`)}
                            className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            <span className="font-korean">편집</span>
                          </button>
                          <button
                            onClick={() => handleDelete(album.id, album.title)}
                            className="inline-flex items-center justify-center px-3 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
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

export default AdminGalleryPage
