import Layout from '@/components/Layout'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, useMemo } from 'react'
import { Filter, X, ChevronLeft, ChevronRight, Calendar, Image as ImageIcon, Loader2, Camera } from 'lucide-react'
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
      {/* Hero Section */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-3 h-3 bg-black rounded-full mr-4"></div>
              <h1 className="text-4xl md:text-5xl font-bold text-black font-korean">행사사진</h1>
              <div className="w-3 h-3 bg-black rounded-full ml-4"></div>
            </div>
            <p className="text-xl text-gray-600 font-korean max-w-2xl mx-auto">
              함께한 소중한 순간들을 담은 사진 갤러리입니다
            </p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="bg-gray-50 py-6 border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Year Filter */}
            <div className="flex items-center gap-3 flex-wrap">
              <Filter className="w-5 h-5 text-gray-500" />
              <span className="text-sm text-gray-600 font-korean">년도:</span>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => {
                    setSelectedYear(null)
                    setSelectedMonth(null)
                  }}
                  className={`px-4 py-2 rounded-lg font-korean text-sm transition-colors ${
                    selectedYear === null
                      ? 'bg-black text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
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
                    className={`px-4 py-2 rounded-lg font-korean text-sm transition-colors ${
                      selectedYear === year
                        ? 'bg-black text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>

            {/* Month Filter */}
            {selectedYear && months.length > 0 && (
              <div className="flex items-center gap-3 flex-wrap">
                <Calendar className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-600 font-korean">월:</span>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setSelectedMonth(null)}
                    className={`px-3 py-1.5 rounded-lg font-korean text-sm transition-colors ${
                      selectedMonth === null
                        ? 'bg-black text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                    }`}
                  >
                    전체
                  </button>
                  {months.map((month) => (
                    <button
                      key={month}
                      onClick={() => setSelectedMonth(month)}
                      className={`px-3 py-1.5 rounded-lg font-korean text-sm transition-colors ${
                        selectedMonth === month
                          ? 'bg-black text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                      }`}
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
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-4 h-4" />
                <span className="font-korean">필터 초기화</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Album Grid */}
      <section className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-8">
            <div className="w-3 h-3 bg-black rounded-full mr-4"></div>
            <h2 className="text-2xl font-bold text-black font-korean">앨범 목록</h2>
            <span className="ml-3 text-gray-500 font-korean">({albums.length}개)</span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-black" />
            </div>
          ) : albums.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-korean">등록된 앨범이 없습니다.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {albums.map((album) => (
                <button
                  key={album.id}
                  onClick={() => handleAlbumClick(album)}
                  className="group text-left"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-gray-100 mb-4">
                    {album.cover_image_url ? (
                      <Image
                        src={album.cover_image_url}
                        alt={album.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <Camera className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                    <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-sm font-korean flex items-center gap-1">
                      <ImageIcon className="w-4 h-4" />
                      {album.photo_count || 0}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 bg-black rounded-full"></div>
                      <span className="text-sm text-gray-500 font-korean">
                        {formatDate(album.album_date)}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-black font-korean group-hover:underline">
                      {album.title}
                    </h3>
                    {album.description && (
                      <p className="text-gray-600 text-sm mt-1 line-clamp-2 font-korean">
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
                  className={`relative w-16 h-16 flex-shrink-0 rounded overflow-hidden transition-all ${
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
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'ko', ['common'])),
  },
})

export default GalleryPage
