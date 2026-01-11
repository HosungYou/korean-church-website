import Layout from '@/components/Layout'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Link from 'next/link'
import { Play, Calendar, User, BookOpen, ArrowRight, Filter, Search, Loader2 } from 'lucide-react'
import { useState, useEffect, useMemo } from 'react'
import { getSermons, getYouTubeThumbnailUrl, type SermonType } from '../../utils/sermonService'
import type { Sermon } from '../../../types/supabase'

const SundaySermonsPage = () => {
  const [sermons, setSermons] = useState<Sermon[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedYear, setSelectedYear] = useState('all')
  const [selectedSermon, setSelectedSermon] = useState<Sermon | null>(null)

  useEffect(() => {
    const fetchSermons = async () => {
      try {
        setLoading(true)
        const data = await getSermons({ type: 'sunday', status: 'published' })
        setSermons(data)
        if (data.length > 0) {
          setSelectedSermon(data[0])
        }
      } catch (error) {
        console.error('설교 조회 오류:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSermons()
  }, [])

  const years = useMemo(() => {
    const uniqueYears = ['all', ...Array.from(new Set(sermons.map(s => s.sermon_date.substring(0, 4))))]
    return uniqueYears.sort((a, b) => (b === 'all' ? -1 : a === 'all' ? 1 : b.localeCompare(a)))
  }, [sermons])

  const filteredSermons = useMemo(() => {
    return sermons.filter(sermon => {
      const matchesSearch =
        sermon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (sermon.scripture || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (sermon.speaker || '').toLowerCase().includes(searchTerm.toLowerCase())
      const matchesYear = selectedYear === 'all' || sermon.sermon_date.startsWith(selectedYear)
      return matchesSearch && matchesYear
    })
  }, [sermons, searchTerm, selectedYear])

  const currentSeries = useMemo(() => {
    const seriesSermon = sermons.find(s => s.series_name)
    return seriesSermon?.series_name || '주일설교'
  }, [sermons])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-3 h-3 bg-black rounded-full mr-4"></div>
              <h1 className="text-4xl md:text-5xl font-bold text-black font-korean">주일설교 영상</h1>
              <div className="w-3 h-3 bg-black rounded-full ml-4"></div>
            </div>
            <p className="text-xl text-gray-600 font-korean max-w-2xl mx-auto">
              하나님의 말씀으로 은혜받는 주일예배 설교말씀
            </p>
          </div>
        </div>
      </section>

      {/* Service Info */}
      <section className="bg-gray-50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center justify-center bg-white rounded-lg p-4 shadow-sm">
              <Calendar className="w-5 h-5 text-black mr-3" />
              <div>
                <p className="text-sm text-gray-500 font-korean">예배 시간</p>
                <p className="font-semibold text-black font-korean">매주 일요일 오전 11:00</p>
              </div>
            </div>
            <div className="flex items-center justify-center bg-white rounded-lg p-4 shadow-sm">
              <User className="w-5 h-5 text-black mr-3" />
              <div>
                <p className="text-sm text-gray-500 font-korean">설교자</p>
                <p className="font-semibold text-black font-korean">연규홍 목사</p>
              </div>
            </div>
            <div className="flex items-center justify-center bg-white rounded-lg p-4 shadow-sm">
              <BookOpen className="w-5 h-5 text-black mr-3" />
              <div>
                <p className="text-sm text-gray-500 font-korean">현재 시리즈</p>
                <p className="font-semibold text-black font-korean">{currentSeries}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Player Section */}
      {selectedSermon && selectedSermon.youtube_video_id && (
        <section className="bg-black py-8">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="aspect-video w-full rounded-lg overflow-hidden">
              <iframe
                src={`https://www.youtube.com/embed/${selectedSermon.youtube_video_id}`}
                title={selectedSermon.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="mt-4 text-white">
              <h2 className="text-2xl font-bold font-korean">{selectedSermon.title}</h2>
              <div className="flex items-center gap-4 mt-2 text-gray-300">
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {formatDate(selectedSermon.sermon_date)}
                </span>
                {selectedSermon.speaker && (
                  <span className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {selectedSermon.speaker}
                  </span>
                )}
                {selectedSermon.scripture && (
                  <span className="flex items-center">
                    <BookOpen className="w-4 h-4 mr-1" />
                    {selectedSermon.scripture}
                  </span>
                )}
              </div>
              {selectedSermon.description && (
                <p className="mt-4 text-gray-400">{selectedSermon.description}</p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Filter Section */}
      <section className="bg-white py-8 border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="설교 제목, 성경 구절로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent font-korean"
              />
            </div>

            {/* Year Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <div className="flex gap-2 flex-wrap">
                {years.map((year) => (
                  <button
                    key={year}
                    onClick={() => setSelectedYear(year)}
                    className={`px-4 py-2 rounded-lg font-korean text-sm transition-colors ${
                      selectedYear === year
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {year === 'all' ? '전체' : year}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sermons Grid */}
      <section className="bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-8">
            <div className="w-3 h-3 bg-black rounded-full mr-4"></div>
            <h2 className="text-2xl font-bold text-black font-korean">설교 목록</h2>
            <span className="ml-3 text-gray-500 font-korean">({filteredSermons.length}개)</span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-black" />
            </div>
          ) : filteredSermons.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 font-korean">
                {sermons.length === 0 ? '등록된 설교가 없습니다.' : '검색 결과가 없습니다.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredSermons.map((sermon) => (
                <button
                  key={sermon.id}
                  onClick={() => setSelectedSermon(sermon)}
                  className={`group bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow text-left ${
                    selectedSermon?.id === sermon.id ? 'ring-2 ring-black' : ''
                  }`}
                >
                  <div className="flex">
                    {/* Video Thumbnail */}
                    <div className="relative w-48 h-32 flex-shrink-0 bg-black">
                      {sermon.youtube_video_id ? (
                        <img
                          src={getYouTubeThumbnailUrl(sermon.youtube_video_id, 'mq')}
                          alt={sermon.title}
                          className="w-full h-full object-cover"
                        />
                      ) : null}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                          <Play className="w-6 h-6 text-white ml-1" />
                        </div>
                      </div>
                      {sermon.series_name && (
                        <div className="absolute top-2 left-2">
                          <span className="bg-black/80 text-white text-xs px-2 py-1 rounded font-korean">
                            {sermon.series_name}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-4">
                      <div className="flex items-center mb-2">
                        <div className="w-1.5 h-1.5 bg-black rounded-full mr-2"></div>
                        <span className="text-xs text-gray-500 font-korean">{formatDate(sermon.sermon_date)}</span>
                      </div>
                      <h3 className="text-lg font-bold text-black font-korean mb-1 group-hover:underline line-clamp-1">
                        {sermon.title}
                      </h3>
                      {sermon.speaker && (
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <User className="w-4 h-4 mr-1" />
                          <span className="font-korean">{sermon.speaker}</span>
                        </div>
                      )}
                      {sermon.scripture && (
                        <div className="flex items-center text-sm text-gray-500">
                          <BookOpen className="w-4 h-4 mr-1" />
                          <span className="font-korean">{sermon.scripture}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Related Links */}
      <section className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-8">
            <div className="w-3 h-3 bg-black rounded-full mr-4"></div>
            <h2 className="text-2xl font-bold text-black font-korean">관련 페이지</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/sermons" className="group block">
              <div className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
                <div className="flex items-center mb-4">
                  <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
                  <h3 className="text-lg font-semibold text-black font-korean">설교 안내</h3>
                </div>
                <p className="text-gray-600 font-korean text-sm mb-3">설교 시리즈 및 설교자 정보</p>
                <div className="flex items-center text-black font-korean text-sm">
                  자세히 보기
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
            <Link href="/sermons/wednesday" className="group block">
              <div className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
                <div className="flex items-center mb-4">
                  <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
                  <h3 className="text-lg font-semibold text-black font-korean">수요설교</h3>
                </div>
                <p className="text-gray-600 font-korean text-sm mb-3">수요예배 설교 보기</p>
                <div className="flex items-center text-black font-korean text-sm">
                  자세히 보기
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
            <Link href="/about/service-info" className="group block">
              <div className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
                <div className="flex items-center mb-4">
                  <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
                  <h3 className="text-lg font-semibold text-black font-korean">예배안내</h3>
                </div>
                <p className="text-gray-600 font-korean text-sm mb-3">예배 시간 및 장소 안내</p>
                <div className="flex items-center text-black font-korean text-sm">
                  자세히 보기
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
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

export default SundaySermonsPage
