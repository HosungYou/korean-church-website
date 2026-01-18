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
  Image,
  Eye,
  EyeOff,
  FolderOpen,
  ArrowRight,
  Users,
  GraduationCap,
  Heart,
  Home,
  Folder,
} from 'lucide-react'
import Link from 'next/link'
import AdminLayout from '@/components/AdminLayout'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import { getAllAlbums, deleteAlbum, DEPARTMENT_LABELS, DEPARTMENT_COLORS, type AlbumDepartment } from '../../../utils/galleryService'
import type { GalleryAlbum } from '../../../../types/supabase'

// ===========================================
// VS Design Diverge: Gallery Management
// Editorial Grid + OKLCH Color System
// ===========================================

const formatKoreanDate = (dateString?: string | null): string => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
}

const AdminGalleryPage = () => {
  const router = useRouter()
  const { admin } = useAdminAuth()
  const [albums, setAlbums] = useState<GalleryAlbum[]>([])
  const [listLoading, setListLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterYear, setFilterYear] = useState<string>('all')
  const [filterVisibility, setFilterVisibility] = useState<'all' | 'visible' | 'hidden'>('all')
  const [filterDepartment, setFilterDepartment] = useState<string>('all')

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

      const matchesDepartment =
        filterDepartment === 'all' ||
        album.department === filterDepartment ||
        (filterDepartment === 'general' && !album.department)

      return matchesSearch && matchesYear && matchesVisibility && matchesDepartment
    })
  }, [albums, searchTerm, filterYear, filterVisibility, filterDepartment])

  const stats = useMemo(() => {
    const total = albums.length
    const visible = albums.filter((a) => a.is_visible).length
    const totalPhotos = albums.reduce((sum, a) => sum + (a.photo_count || 0), 0)
    const thisYear = albums.filter((a) => a.year === new Date().getFullYear()).length

    return { total, visible, totalPhotos, thisYear }
  }, [albums])

  const statsCards = [
    {
      name: '총 앨범',
      value: stats.total,
      icon: FolderOpen,
    },
    {
      name: '공개 앨범',
      value: stats.visible,
      icon: Eye,
    },
    {
      name: '총 사진',
      value: stats.totalPhotos,
      icon: Image,
    },
    {
      name: '올해 앨범',
      value: stats.thisYear,
      icon: Calendar,
    },
  ]

  return (
    <AdminLayout title="갤러리 관리" subtitle="사진 앨범을 관리하세요">
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
            {filteredAlbums.length}개의 앨범
          </span>
        </div>
        <Link
          href="/admin/gallery/new"
          className="inline-flex items-center px-5 py-2.5 rounded-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
          style={{
            background: 'oklch(0.45 0.12 265)',
            color: 'oklch(0.98 0.003 75)',
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          새 앨범
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
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Search Input */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
                style={{ color: 'oklch(0.50 0.01 75)' }}
              />
              <input
                type="text"
                placeholder="앨범 제목으로 검색..."
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

          {/* Department Filter */}
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="block w-full px-3 py-2.5 rounded-sm transition-all duration-200 focus:outline-none appearance-none cursor-pointer"
            style={{
              background: 'oklch(0.97 0.005 265)',
              border: '1px solid oklch(0.90 0.01 265)',
              color: 'oklch(0.35 0.02 75)',
            }}
          >
            <option value="all">모든 부서</option>
            <option value="children">유년부</option>
            <option value="youth">중고등부</option>
            <option value="young_adults">청년대학부</option>
            <option value="district">구역</option>
            <option value="general">일반</option>
          </select>

          {/* Year Filter */}
          <select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="block w-full px-3 py-2.5 rounded-sm transition-all duration-200 focus:outline-none appearance-none cursor-pointer"
            style={{
              background: 'oklch(0.97 0.005 265)',
              border: '1px solid oklch(0.90 0.01 265)',
              color: 'oklch(0.35 0.02 75)',
            }}
          >
            <option value="all">모든 연도</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}년
              </option>
            ))}
          </select>

          {/* Visibility Filter */}
          <select
            value={filterVisibility}
            onChange={(e) => setFilterVisibility(e.target.value as 'all' | 'visible' | 'hidden')}
            className="block w-full px-3 py-2.5 rounded-sm transition-all duration-200 focus:outline-none appearance-none cursor-pointer"
            style={{
              background: 'oklch(0.97 0.005 265)',
              border: '1px solid oklch(0.90 0.01 265)',
              color: 'oklch(0.35 0.02 75)',
            }}
          >
            <option value="all">모든 상태</option>
            <option value="visible">공개</option>
            <option value="hidden">비공개</option>
          </select>
        </div>
      </div>

      {/* Albums Grid */}
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
              앨범 로딩 중...
            </p>
          </div>
        ) : filteredAlbums.length === 0 ? (
          <div className="p-12 text-center">
            <div
              className="w-16 h-16 rounded-sm mx-auto mb-4 flex items-center justify-center"
              style={{ background: 'oklch(0.45 0.12 265 / 0.1)' }}
            >
              <Image className="w-8 h-8" style={{ color: 'oklch(0.45 0.12 265)' }} />
            </div>
            <p
              className="text-sm font-medium mb-2"
              style={{ color: 'oklch(0.45 0.01 75)' }}
            >
              등록된 앨범이 없습니다
            </p>
            <p
              className="text-xs"
              style={{ color: 'oklch(0.55 0.01 75)' }}
            >
              새 앨범을 만들어 사진을 업로드하세요
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {filteredAlbums.map((album, index) => (
              <div
                key={album.id}
                className={`group rounded-sm overflow-hidden transition-all duration-300 hover:-translate-y-1 stagger-${(index % 6) + 1}`}
                style={{
                  background: 'oklch(0.97 0.005 265)',
                  border: '1px solid oklch(0.90 0.01 265)',
                }}
              >
                {/* Cover Image */}
                <div className="aspect-video relative overflow-hidden">
                  {album.cover_image_url ? (
                    <img
                      src={album.cover_image_url}
                      alt={album.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ background: 'oklch(0.92 0.01 265)' }}
                    >
                      <Image className="w-12 h-12" style={{ color: 'oklch(0.70 0.01 75)' }} />
                    </div>
                  )}

                  {/* Department Badge */}
                  {album.department && album.department !== 'general' && (
                    <div
                      className="absolute top-3 left-3 px-2.5 py-1 rounded-sm text-xs font-medium"
                      style={{
                        background: DEPARTMENT_COLORS[album.department as AlbumDepartment],
                        color: 'oklch(0.98 0.003 75)',
                      }}
                    >
                      {DEPARTMENT_LABELS[album.department as AlbumDepartment]}
                      {album.department === 'district' && album.district_number && (
                        <span> {album.district_number}구역</span>
                      )}
                    </div>
                  )}

                  {/* Visibility Badge */}
                  {!album.is_visible && (
                    <div
                      className="absolute top-3 right-3 px-2.5 py-1 rounded-sm flex items-center gap-1.5 text-xs font-medium"
                      style={{
                        background: 'oklch(0.20 0.05 265 / 0.85)',
                        color: 'oklch(0.85 0.01 75)',
                      }}
                    >
                      <EyeOff className="w-3 h-3" />
                      비공개
                    </div>
                  )}

                  {/* Hover Overlay */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                    style={{ background: 'oklch(0.15 0.05 265 / 0.6)' }}
                  >
                    <button
                      onClick={() => router.push(`/admin/gallery/${album.id}`)}
                      className="inline-flex items-center px-4 py-2 rounded-sm font-medium text-sm transition-all duration-200 hover:-translate-y-0.5"
                      style={{
                        background: 'oklch(0.72 0.10 75)',
                        color: 'oklch(0.15 0.05 265)',
                      }}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      편집하기
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3
                    className="font-headline font-bold text-lg mb-2 line-clamp-1"
                    style={{ color: 'oklch(0.22 0.07 265)' }}
                  >
                    {album.title}
                  </h3>

                  <div className="flex items-center gap-4 mb-3">
                    <span
                      className="flex items-center gap-1.5 text-xs"
                      style={{ color: 'oklch(0.55 0.01 75)' }}
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      {formatKoreanDate(album.album_date)}
                    </span>
                    <span
                      className="flex items-center gap-1.5 text-xs"
                      style={{ color: 'oklch(0.55 0.01 75)' }}
                    >
                      <Image className="w-3.5 h-3.5" />
                      {album.photo_count || 0}장
                    </span>
                  </div>

                  {album.description && (
                    <p
                      className="text-sm line-clamp-2 mb-4"
                      style={{ color: 'oklch(0.50 0.01 75)' }}
                    >
                      {album.description}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`/admin/gallery/${album.id}`)}
                      className="flex-1 group/btn inline-flex items-center justify-center px-4 py-2 rounded-sm font-medium text-sm transition-all duration-200 hover:-translate-y-0.5"
                      style={{
                        background: 'oklch(0.45 0.12 265)',
                        color: 'oklch(0.98 0.003 75)',
                      }}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      편집
                      <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                    </button>
                    <button
                      onClick={() => handleDelete(album.id, album.title)}
                      className="inline-flex items-center justify-center px-3 py-2 rounded-sm font-medium text-sm transition-all duration-200 hover:-translate-y-0.5"
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
            ))}
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

export default AdminGalleryPage
