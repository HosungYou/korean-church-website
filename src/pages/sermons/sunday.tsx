// ===========================================
// VS Design Diverge: Sunday Sermons Page
// OKLCH Color System + Editorial Minimalism
// ===========================================

import Layout from '@/components/Layout'
import PageHeader from '@/components/PageHeader'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Link from 'next/link'
import { Play, Calendar, User, BookOpen, ArrowRight, Filter, Search, Loader2 } from 'lucide-react'
import { useState, useEffect, useMemo } from 'react'
import { getSermons, getYouTubeThumbnailUrl, type SermonType } from '../../utils/sermonService'
import type { Sermon } from '../../../types/supabase'
import { parseLocalDate } from '../../utils/dateHelpers'

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
    const date = parseLocalDate(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <Layout>
      {/* Hero Header */}
      <PageHeader
        label="Sunday Worship"
        title="주일설교 영상"
        subtitle="하나님의 말씀으로 은혜받는 주일예배 설교말씀"
      />

      {/* Service Info - Editorial Cards */}
      <section
        className="py-12"
        style={{ background: 'oklch(0.97 0.005 75)' }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Time Card */}
            <div
              className="flex items-center p-6 rounded-sm transition-all duration-300 hover:-translate-y-1"
              style={{
                background: 'oklch(0.985 0.003 75)',
                border: '1px solid oklch(0.92 0.005 75)',
                boxShadow: '0 2px 8px oklch(0.30 0.09 265 / 0.06)'
              }}
            >
              <div
                className="w-12 h-12 rounded-sm flex items-center justify-center mr-4"
                style={{ background: 'oklch(0.45 0.12 265 / 0.1)' }}
              >
                <Calendar className="w-5 h-5" style={{ color: 'oklch(0.45 0.12 265)' }} />
              </div>
              <div>
                <p
                  className="text-xs font-medium tracking-wider uppercase"
                  style={{ color: 'oklch(0.55 0.01 75)' }}
                >
                  예배 시간
                </p>
                <p
                  className="font-semibold"
                  style={{ color: 'oklch(0.25 0.05 265)' }}
                >
                  매주 일요일 오전 11:00
                </p>
              </div>
            </div>

            {/* Speaker Card */}
            <div
              className="flex items-center p-6 rounded-sm transition-all duration-300 hover:-translate-y-1"
              style={{
                background: 'oklch(0.985 0.003 75)',
                border: '1px solid oklch(0.92 0.005 75)',
                boxShadow: '0 2px 8px oklch(0.30 0.09 265 / 0.06)'
              }}
            >
              <div
                className="w-12 h-12 rounded-sm flex items-center justify-center mr-4"
                style={{ background: 'oklch(0.45 0.12 265 / 0.1)' }}
              >
                <User className="w-5 h-5" style={{ color: 'oklch(0.45 0.12 265)' }} />
              </div>
              <div>
                <p
                  className="text-xs font-medium tracking-wider uppercase"
                  style={{ color: 'oklch(0.55 0.01 75)' }}
                >
                  설교자
                </p>
                <p
                  className="font-semibold"
                  style={{ color: 'oklch(0.25 0.05 265)' }}
                >
                  연규홍 목사
                </p>
              </div>
            </div>

            {/* Series Card */}
            <div
              className="flex items-center p-6 rounded-sm transition-all duration-300 hover:-translate-y-1"
              style={{
                background: 'oklch(0.985 0.003 75)',
                border: '1px solid oklch(0.92 0.005 75)',
                boxShadow: '0 2px 8px oklch(0.30 0.09 265 / 0.06)'
              }}
            >
              <div
                className="w-12 h-12 rounded-sm flex items-center justify-center mr-4"
                style={{ background: 'oklch(0.72 0.10 75 / 0.15)' }}
              >
                <BookOpen className="w-5 h-5" style={{ color: 'oklch(0.58 0.11 75)' }} />
              </div>
              <div>
                <p
                  className="text-xs font-medium tracking-wider uppercase"
                  style={{ color: 'oklch(0.55 0.01 75)' }}
                >
                  현재 시리즈
                </p>
                <p
                  className="font-semibold"
                  style={{ color: 'oklch(0.25 0.05 265)' }}
                >
                  {currentSeries}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Player Section */}
      {selectedSermon && selectedSermon.youtube_video_id && (
        <section
          className="py-10"
          style={{ background: 'oklch(0.15 0.05 265)' }}
        >
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="aspect-video w-full rounded-sm overflow-hidden shadow-2xl">
              <iframe
                src={`https://www.youtube.com/embed/${selectedSermon.youtube_video_id}`}
                title={selectedSermon.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="mt-6">
              <h2
                className="text-2xl font-bold font-headline"
                style={{ color: 'oklch(0.98 0.003 75)' }}
              >
                {selectedSermon.title}
              </h2>
              <div
                className="flex flex-wrap items-center gap-4 mt-3"
                style={{ color: 'oklch(0.70 0.02 75)' }}
              >
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {formatDate(selectedSermon.sermon_date)}
                </span>
                {selectedSermon.speaker && (
                  <span className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    {selectedSermon.speaker}
                  </span>
                )}
                {selectedSermon.scripture && (
                  <span
                    className="flex items-center px-3 py-1 rounded-sm"
                    style={{ background: 'oklch(0.72 0.10 75 / 0.2)', color: 'oklch(0.82 0.08 75)' }}
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    {selectedSermon.scripture}
                  </span>
                )}
              </div>
              {selectedSermon.description && (
                <p
                  className="mt-4 leading-relaxed"
                  style={{ color: 'oklch(0.65 0.01 75)' }}
                >
                  {selectedSermon.description}
                </p>
              )}
            </div>
          </div>
        </section>
      )}

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
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5"
                style={{ color: 'oklch(0.55 0.01 75)' }}
              />
              <input
                type="text"
                placeholder="설교 제목, 성경 구절로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-sm transition-all duration-200 focus:outline-none"
                style={{
                  background: 'oklch(0.97 0.005 75)',
                  border: '1px solid oklch(0.90 0.01 75)',
                  color: 'oklch(0.25 0.05 265)'
                }}
              />
            </div>

            {/* Year Filter */}
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5" style={{ color: 'oklch(0.55 0.01 75)' }} />
              <div className="flex gap-2 flex-wrap">
                {years.map((year) => (
                  <button
                    key={year}
                    onClick={() => setSelectedYear(year)}
                    className="px-4 py-2 rounded-sm text-sm font-medium transition-all duration-200"
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
                    {year === 'all' ? '전체' : year}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sermons Grid */}
      <section
        className="py-16"
        style={{ background: 'oklch(0.97 0.005 75)' }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Editorial Section Header */}
          <div className="mb-12">
            <div
              className="h-0.5 w-12 mb-6"
              style={{
                background: 'linear-gradient(90deg, oklch(0.72 0.10 75), oklch(0.45 0.12 265))'
              }}
            />
            <div className="flex items-baseline gap-3">
              <h2
                className="font-headline font-bold"
                style={{
                  fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                  letterSpacing: '-0.02em',
                  color: 'oklch(0.25 0.05 265)'
                }}
              >
                설교 목록
              </h2>
              <span style={{ color: 'oklch(0.55 0.01 75)' }}>
                ({filteredSermons.length}개)
              </span>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2
                className="w-8 h-8 animate-spin"
                style={{ color: 'oklch(0.45 0.12 265)' }}
              />
            </div>
          ) : filteredSermons.length === 0 ? (
            <div className="text-center py-16">
              <p style={{ color: 'oklch(0.55 0.01 75)' }}>
                {sermons.length === 0 ? '등록된 설교가 없습니다.' : '검색 결과가 없습니다.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredSermons.map((sermon, index) => (
                <button
                  key={sermon.id}
                  onClick={() => setSelectedSermon(sermon)}
                  className={`group text-left rounded-sm overflow-hidden transition-all duration-300 hover:-translate-y-1 stagger-${(index % 6) + 1}`}
                  style={{
                    background: 'oklch(0.985 0.003 75)',
                    border: selectedSermon?.id === sermon.id
                      ? '2px solid oklch(0.45 0.12 265)'
                      : '1px solid oklch(0.92 0.005 75)',
                    boxShadow: selectedSermon?.id === sermon.id
                      ? '0 8px 24px oklch(0.45 0.12 265 / 0.15)'
                      : '0 2px 8px oklch(0.30 0.09 265 / 0.06)'
                  }}
                >
                  <div className="flex">
                    {/* Video Thumbnail */}
                    <div
                      className="relative w-48 h-32 flex-shrink-0"
                      style={{ background: 'oklch(0.15 0.05 265)' }}
                    >
                      {sermon.youtube_video_id ? (
                        <img
                          src={getYouTubeThumbnailUrl(sermon.youtube_video_id, 'mq')}
                          alt={sermon.title}
                          className="w-full h-full object-cover"
                        />
                      ) : null}
                      <div
                        className="absolute inset-0 flex items-center justify-center"
                        style={{ background: 'oklch(0.15 0.05 265 / 0.4)' }}
                      >
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                          style={{ background: 'oklch(0.98 0.003 75 / 0.2)' }}
                        >
                          <Play
                            className="w-6 h-6 ml-0.5"
                            style={{ color: 'oklch(0.98 0.003 75)' }}
                          />
                        </div>
                      </div>
                      {sermon.series_name && (
                        <div className="absolute top-2 left-2">
                          <span
                            className="text-xs px-2 py-1 rounded-sm font-medium"
                            style={{
                              background: 'oklch(0.72 0.10 75 / 0.9)',
                              color: 'oklch(0.15 0.05 265)'
                            }}
                          >
                            {sermon.series_name}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-5">
                      <div className="flex items-center mb-2">
                        <div
                          className="w-1.5 h-1.5 rounded-full mr-2"
                          style={{ background: 'oklch(0.72 0.10 75)' }}
                        />
                        <span
                          className="text-xs"
                          style={{ color: 'oklch(0.55 0.01 75)' }}
                        >
                          {formatDate(sermon.sermon_date)}
                        </span>
                      </div>
                      <h3
                        className="text-lg font-bold mb-2 line-clamp-1 group-hover:underline decoration-1 underline-offset-2"
                        style={{ color: 'oklch(0.25 0.05 265)' }}
                      >
                        {sermon.title}
                      </h3>
                      {sermon.speaker && (
                        <div
                          className="flex items-center text-sm mb-1"
                          style={{ color: 'oklch(0.45 0.05 265)' }}
                        >
                          <User className="w-4 h-4 mr-1.5" />
                          <span>{sermon.speaker}</span>
                        </div>
                      )}
                      {sermon.scripture && (
                        <div
                          className="flex items-center text-sm"
                          style={{ color: 'oklch(0.55 0.01 75)' }}
                        >
                          <BookOpen className="w-4 h-4 mr-1.5" />
                          <span>{sermon.scripture}</span>
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

      {/* Related Links - Editorial Style */}
      <section
        className="py-16"
        style={{ background: 'oklch(0.985 0.003 75)' }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Editorial Section Header */}
          <div className="mb-12">
            <div
              className="h-0.5 w-12 mb-6"
              style={{
                background: 'linear-gradient(90deg, oklch(0.72 0.10 75), oklch(0.45 0.12 265))'
              }}
            />
            <h2
              className="font-headline font-bold"
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
              { href: '/sermons', title: '설교 안내', desc: '설교 시리즈 및 설교자 정보' },
              { href: '/sermons/wednesday', title: '수요설교', desc: '수요예배 설교 보기' },
              { href: '/about/service-info', title: '예배안내', desc: '예배 시간 및 장소 안내' }
            ].map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                className={`group block stagger-${index + 1}`}
              >
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
                      className="text-lg font-semibold"
                      style={{ color: 'oklch(0.25 0.05 265)' }}
                    >
                      {link.title}
                    </h3>
                  </div>
                  <p
                    className="text-sm mb-4"
                    style={{ color: 'oklch(0.55 0.01 75)' }}
                  >
                    {link.desc}
                  </p>
                  <div
                    className="flex items-center text-sm font-medium"
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

export default SundaySermonsPage
