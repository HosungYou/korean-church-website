// ===========================================
// VS Design Diverge: Gallery Page
// OKLCH Color System + Editorial Minimalism
// ===========================================

import Layout from '@/components/Layout'
import PageHeader from '@/components/PageHeader'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, useMemo } from 'react'
import { Filter, X, ChevronLeft, ChevronRight, Calendar, Image as ImageIcon, Loader2, Camera, ArrowRight } from 'lucide-react'
import { getAlbums, getAlbumsByYear, getAlbumWithPhotos } from '../../utils/galleryService'
import type { GalleryAlbum, GalleryPhoto } from '../../../types/supabase'

const GalleryPage = () => {
  const [albums, setAlbums] = useState<GalleryAlbum[]>([])
  const [yearMonthData, setYearMonthData] = useState<{ [year: number]: number[] }>({})
  const [loading, setLoading] = useState(true)
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null)

  // 라이트박스 상태
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentAlbum, setCurrentAlbum] = useState<GalleryAlbum | null>(null)
  const [currentPhotos, setCurrentPhotos] = useState<GalleryPhoto[]>([])
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [photosLoading, setPhotosLoading] = useState(false)

  // 초기 데이터 로드
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [albumsData, yearData] = await Promise.all([
          getAlbums(),
          getAlbumsByYear()
        ])
        setAlbums(albumsData)
        setYearMonthData(yearData)
      } catch (error) {
        console.error('갤러리 로드 오류:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // 필터 적용된 앨범 목록 로드
  useEffect(() => {
    const fetchFilteredAlbums = async () => {
      try {
        setLoading(true)
        const filters: { year?: number; month?: number } = {}
        if (selectedYear) filters.year = selectedYear
        if (selectedMonth) filters.month = selectedMonth
        const data = await getAlbums(filters)
        setAlbums(data)
      } catch (error) {
        console.error('필터 적용 오류:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFilteredAlbums()
  }, [selectedYear, selectedMonth])

  // 연도 목록
  const years = useMemo(() => {
    return Object.keys(yearMonthData)
      .map(Number)
      .sort((a, b) => b - a)
  }, [yearMonthData])

  // 선택된 연도의 월 목록
  const months = useMemo(() => {
    if (!selectedYear || !yearMonthData[selectedYear]) return []
    return yearMonthData[selectedYear].sort((a, b) => b - a)
  }, [selectedYear, yearMonthData])

  // 앨범 클릭 시 사진 로드
  const handleAlbumClick = async (album: GalleryAlbum) => {
    setCurrentAlbum(album)
    setPhotosLoading(true)
    setLightboxOpen(true)
    setCurrentPhotoIndex(0)

    try {
      const { photos } = await getAlbumWithPhotos(album.id)
      setCurrentPhotos(photos)
    } catch (error) {
      console.error('사진 로드 오류:', error)
      setCurrentPhotos([])
    } finally {
      setPhotosLoading(false)
    }
  }

  // 라이트박스 닫기
  const closeLightbox = () => {
    setLightboxOpen(false)
    setCurrentAlbum(null)
    setCurrentPhotos([])
    setCurrentPhotoIndex(0)
  }

  // 이전/다음 사진
  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) =>
      prev === 0 ? currentPhotos.length - 1 : prev - 1
    )
  }

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) =>
      prev === currentPhotos.length - 1 ? 0 : prev + 1
    )
  }

  // 키보드 네비게이션
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') prevPhoto()
      if (e.key === 'ArrowRight') nextPhoto()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxOpen, currentPhotos.length])

  // 필터 초기화
  const clearFilters = () => {
    setSelectedYear(null)
    setSelectedMonth(null)
  }

  // 날짜 포맷
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const monthNames = ['', '1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']

  return (
    <Layout>
      {/* Hero Header */}
      <PageHeader
        label="Photo Gallery"
        title="행사사진"
        subtitle="함께한 소중한 순간들을 담은 사진 갤러리입니다"
      />

      {/* Filter Section */}
      <section
        className="py-8"
        style={{
          background: 'oklch(0.985 0.003 75)',
          borderBottom: '1px solid oklch(0.92 0.005 75)'
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Year Filter */}
            <div className="flex items-center gap-3 flex-wrap">
              <Filter className="w-5 h-5" style={{ color: 'oklch(0.55 0.01 75)' }} />
              <span className="text-sm font-korean" style={{ color: 'oklch(0.55 0.01 75)' }}>년도:</span>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => {
                    setSelectedYear(null)
                    setSelectedMonth(null)
                  }}
                  className="px-4 py-2 rounded-sm font-korean text-sm transition-all duration-200"
                  style={{
                    background: selectedYear === null
                      ? 'oklch(0.45 0.12 265)'
                      : 'oklch(0.97 0.005 75)',
                    color: selectedYear === null
                      ? 'oklch(0.98 0.003 75)'
                      : 'oklch(0.40 0.05 265)',
                    border: `1px solid ${selectedYear === null ? 'oklch(0.45 0.12 265)' : 'oklch(0.90 0.01 75)'}`
                  }}
                >
                  전체
                </button>
                {years.map((year) => (
                  <button
                    key={year}
                    onClick={() => {
                      setSelectedYear(year)
                      setSelectedMonth(null)
                    }}
                    className="px-4 py-2 rounded-sm font-korean text-sm transition-all duration-200"
                    style={{
                      background: selectedYear === year
                        ? 'oklch(0.45 0.12 265)'
                        : 'oklch(0.97 0.005 75)',
                      color: selectedYear === year
                        ? 'oklch(0.98 0.003 75)'
                        : 'oklch(0.40 0.05 265)',
                      border: `1px solid ${selectedYear === year ? 'oklch(0.45 0.12 265)' : 'oklch(0.90 0.01 75)'}`
                    }}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>

            {/* Month Filter */}
            {selectedYear && months.length > 0 && (
              <div className="flex items-center gap-3 flex-wrap">
                <Calendar className="w-5 h-5" style={{ color: 'oklch(0.55 0.01 75)' }} />
                <span className="text-sm font-korean" style={{ color: 'oklch(0.55 0.01 75)' }}>월:</span>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setSelectedMonth(null)}
                    className="px-3 py-1.5 rounded-sm font-korean text-sm transition-all duration-200"
                    style={{
                      background: selectedMonth === null
                        ? 'oklch(0.45 0.12 265)'
                        : 'oklch(0.97 0.005 75)',
                      color: selectedMonth === null
                        ? 'oklch(0.98 0.003 75)'
                        : 'oklch(0.40 0.05 265)',
                      border: `1px solid ${selectedMonth === null ? 'oklch(0.45 0.12 265)' : 'oklch(0.90 0.01 75)'}`
                    }}
                  >
                    전체
                  </button>
                  {months.map((month) => (
                    <button
                      key={month}
                      onClick={() => setSelectedMonth(month)}
                      className="px-3 py-1.5 rounded-sm font-korean text-sm transition-all duration-200"
                      style={{
                        background: selectedMonth === month
                          ? 'oklch(0.45 0.12 265)'
                          : 'oklch(0.97 0.005 75)',
                        color: selectedMonth === month
                          ? 'oklch(0.98 0.003 75)'
                          : 'oklch(0.40 0.05 265)',
                        border: `1px solid ${selectedMonth === month ? 'oklch(0.45 0.12 265)' : 'oklch(0.90 0.01 75)'}`
                      }}
                    >
                      {monthNames[month]}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Clear Filters */}
            {(selectedYear || selectedMonth) && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-sm transition-colors"
                style={{ color: 'oklch(0.55 0.01 75)' }}
              >
                <X className="w-4 h-4" />
                <span className="font-korean">필터 초기화</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Album Grid */}
      <section className="py-16" style={{ background: 'oklch(0.97 0.005 75)' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Editorial Section Header */}
          <div className="mb-12">
            <div
              className="h-0.5 w-12 mb-6"
              style={{ background: 'linear-gradient(90deg, oklch(0.72 0.10 75), oklch(0.45 0.12 265))' }}
            />
            <div className="flex items-baseline gap-3">
              <h2
                className="font-headline font-bold font-korean"
                style={{
                  fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                  letterSpacing: '-0.02em',
                  color: 'oklch(0.25 0.05 265)'
                }}
              >
                앨범 목록
              </h2>
              <span style={{ color: 'oklch(0.55 0.01 75)' }}>
                ({albums.length}개)
              </span>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'oklch(0.45 0.12 265)' }} />
            </div>
          ) : albums.length === 0 ? (
            <div
              className="text-center py-16 rounded-sm"
              style={{
                background: 'oklch(0.985 0.003 75)',
                border: '1px solid oklch(0.92 0.005 75)'
              }}
            >
              <ImageIcon className="w-16 h-16 mx-auto mb-4" style={{ color: 'oklch(0.85 0.01 75)' }} />
              <p className="font-korean" style={{ color: 'oklch(0.55 0.01 75)' }}>등록된 앨범이 없습니다.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {albums.map((album, index) => (
                <button
                  key={album.id}
                  onClick={() => handleAlbumClick(album)}
                  className={`group text-left stagger-${(index % 6) + 1}`}
                >
                  <div
                    className="relative aspect-[4/3] overflow-hidden rounded-sm mb-4"
                    style={{ background: 'oklch(0.92 0.005 75)' }}
                  >
                    {album.cover_image_url ? (
                      <Image
                        src={album.cover_image_url}
                        alt={album.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ background: 'oklch(0.92 0.005 75)' }}
                      >
                        <Camera className="w-12 h-12" style={{ color: 'oklch(0.70 0.01 75)' }} />
                      </div>
                    )}
                    <div
                      className="absolute inset-0 transition-colors duration-300"
                      style={{ background: 'oklch(0.15 0.05 265 / 0)' }}
                    />
                    <div
                      className="absolute top-3 right-3 px-2 py-1 rounded-sm text-sm font-korean flex items-center gap-1"
                      style={{
                        background: 'oklch(0.15 0.05 265 / 0.7)',
                        color: 'oklch(0.98 0.003 75)'
                      }}
                    >
                      <ImageIcon className="w-4 h-4" />
                      {album.photo_count || 0}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'oklch(0.72 0.10 75)' }} />
                      <span className="text-sm font-korean" style={{ color: 'oklch(0.55 0.01 75)' }}>
                        {formatDate(album.album_date)}
                      </span>
                    </div>
                    <h3
                      className="text-lg font-bold font-korean group-hover:underline decoration-1 underline-offset-4"
                      style={{ color: 'oklch(0.25 0.05 265)' }}
                    >
                      {album.title}
                    </h3>
                    {album.description && (
                      <p
                        className="text-sm mt-2 line-clamp-2 font-korean"
                        style={{ color: 'oklch(0.55 0.01 75)' }}
                      >
                        {album.description}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-50"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Album Title */}
          <div className="absolute top-4 left-4 text-white z-50">
            <h3 className="text-xl font-bold font-korean">{currentAlbum?.title}</h3>
            {currentPhotos.length > 0 && (
              <p className="text-white/70 text-sm mt-1">
                {currentPhotoIndex + 1} / {currentPhotos.length}
              </p>
            )}
          </div>

          {/* Content */}
          <div
            className="flex items-center justify-center w-full h-full px-16"
            onClick={(e) => e.stopPropagation()}
          >
            {photosLoading ? (
              <Loader2 className="w-10 h-10 animate-spin text-white" />
            ) : currentPhotos.length === 0 ? (
              <p className="text-white/70 font-korean">사진이 없습니다.</p>
            ) : (
              <>
                {/* Previous Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    prevPhoto()
                  }}
                  className="absolute left-4 p-2 text-white/70 hover:text-white transition-colors"
                >
                  <ChevronLeft className="w-10 h-10" />
                </button>

                {/* Photo */}
                <div className="relative max-w-5xl max-h-[80vh] w-full h-full">
                  <Image
                    src={currentPhotos[currentPhotoIndex]?.image_url || ''}
                    alt={currentPhotos[currentPhotoIndex]?.caption || '사진'}
                    fill
                    className="object-contain"
                  />
                </div>

                {/* Caption */}
                {currentPhotos[currentPhotoIndex]?.caption && (
                  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-lg max-w-lg text-center">
                    <p className="font-korean">{currentPhotos[currentPhotoIndex].caption}</p>
                  </div>
                )}

                {/* Next Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    nextPhoto()
                  }}
                  className="absolute right-4 p-2 text-white/70 hover:text-white transition-colors"
                >
                  <ChevronRight className="w-10 h-10" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail Strip */}
          {currentPhotos.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 overflow-x-auto max-w-[90vw] p-2">
              {currentPhotos.map((photo, index) => (
                <button
                  key={photo.id}
                  onClick={(e) => {
                    e.stopPropagation()
                    setCurrentPhotoIndex(index)
                  }}
                  className={`relative w-16 h-16 flex-shrink-0 rounded-sm overflow-hidden transition-all ${
                    index === currentPhotoIndex
                      ? 'ring-2 ring-white scale-110'
                      : 'opacity-50 hover:opacity-80'
                  }`}
                >
                  <Image
                    src={photo.thumbnail_url || photo.image_url}
                    alt=""
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Related Links */}
      <section className="py-16" style={{ background: 'oklch(0.985 0.003 75)' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <div
              className="h-0.5 w-12 mb-6"
              style={{ background: 'linear-gradient(90deg, oklch(0.72 0.10 75), oklch(0.45 0.12 265))' }}
            />
            <h2
              className="font-headline font-bold font-korean"
              style={{
                fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                letterSpacing: '-0.02em',
                color: 'oklch(0.25 0.05 265)'
              }}
            >
              관련 페이지
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { href: '/news/announcements', title: '공지사항', desc: '교회 소식과 공지' },
              { href: '/news/bulletin', title: '주보', desc: '주일예배 주보 다운로드' },
              { href: '/sermons/sunday', title: '주일설교', desc: '주일예배 설교 영상' }
            ].map((link, index) => (
              <Link key={link.href} href={link.href} className={`group block stagger-${index + 1}`}>
                <div
                  className="p-6 rounded-sm transition-all duration-300 hover:-translate-y-1"
                  style={{
                    background: 'oklch(0.97 0.005 75)',
                    border: '1px solid oklch(0.92 0.005 75)'
                  }}
                >
                  <div className="flex items-center mb-4">
                    <div
                      className="w-2 h-2 rounded-full mr-3"
                      style={{ background: 'oklch(0.72 0.10 75)' }}
                    />
                    <h3
                      className="text-lg font-semibold font-korean"
                      style={{ color: 'oklch(0.25 0.05 265)' }}
                    >
                      {link.title}
                    </h3>
                  </div>
                  <p
                    className="text-sm mb-4 font-korean"
                    style={{ color: 'oklch(0.55 0.01 75)' }}
                  >
                    {link.desc}
                  </p>
                  <div
                    className="flex items-center text-sm font-medium font-korean"
                    style={{ color: 'oklch(0.45 0.12 265)' }}
                  >
                    자세히 보기
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'ko', ['common'])),
  },
})

export default GalleryPage
