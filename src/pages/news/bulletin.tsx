// ===========================================
// VS Design Diverge: Bulletin Page
// OKLCH Color System + Editorial Minimalism
// ===========================================

import Layout from '@/components/Layout'
import PageHeader from '@/components/PageHeader'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useState, useEffect, useMemo } from 'react'
import { Download, FileText, Calendar, Filter, Loader2, ArrowRight, Eye, EyeOff } from 'lucide-react'
import { getBulletins, getBulletinsByYear } from '../../utils/bulletinService'
import type { Bulletin } from '../../../types/supabase'
import Link from 'next/link'

const BulletinPage = () => {
  const [bulletins, setBulletins] = useState<Bulletin[]>([])
  const [yearCounts, setYearCounts] = useState<{ [year: number]: number }>({})
  const [loading, setLoading] = useState(true)
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const [showPreview, setShowPreview] = useState(true)

  // 초기 데이터 로드
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [bulletinsData, yearData] = await Promise.all([
          getBulletins(),
          getBulletinsByYear()
        ])
        setBulletins(bulletinsData)
        setYearCounts(yearData)
      } catch (error) {
        console.error('주보 로드 오류:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // 필터 적용된 주보 목록 로드
  useEffect(() => {
    const fetchFilteredBulletins = async () => {
      try {
        setLoading(true)
        const filters: { year?: number } = {}
        if (selectedYear) filters.year = selectedYear
        const data = await getBulletins(filters)
        setBulletins(data)
      } catch (error) {
        console.error('필터 적용 오류:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFilteredBulletins()
  }, [selectedYear])

  // 연도 목록
  const years = useMemo(() => {
    return Object.keys(yearCounts)
      .map(Number)
      .sort((a, b) => b - a)
  }, [yearCounts])

  // 날짜 포맷
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
      {/* Hero Header */}
      <PageHeader
        label="Weekly Bulletin"
        title="주보"
        subtitle="매주 주일예배 주보를 다운로드하실 수 있습니다"
      />

      {/* Filter Section */}
      <section
        className="py-8"
        style={{
          background: 'oklch(0.985 0.003 75)',
          borderBottom: '1px solid oklch(0.92 0.005 75)'
        }}
      >
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 flex-wrap">
            <Filter className="w-5 h-5" style={{ color: 'oklch(0.55 0.01 75)' }} />
            <span className="text-sm font-korean" style={{ color: 'oklch(0.55 0.01 75)' }}>년도:</span>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedYear(null)}
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
                  onClick={() => setSelectedYear(year)}
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
                  {year} ({yearCounts[year]})
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Latest Bulletin Preview */}
      {!loading && bulletins.length > 0 && bulletins[0].file_url && (
        <section className="py-16" style={{ background: 'oklch(0.985 0.003 75)' }}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <div
                className="h-0.5 w-12 mb-6"
                style={{ background: 'linear-gradient(90deg, oklch(0.72 0.10 75), oklch(0.45 0.12 265))' }}
              />
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <span
                    className="text-xs font-medium tracking-[0.2em] uppercase mb-2 block"
                    style={{ color: 'oklch(0.72 0.10 75)' }}
                  >
                    Latest Bulletin
                  </span>
                  <h2
                    className="font-headline font-bold font-korean"
                    style={{
                      fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                      letterSpacing: '-0.02em',
                      color: 'oklch(0.25 0.05 265)'
                    }}
                  >
                    {bulletins[0].title || `${formatDate(bulletins[0].bulletin_date)} 주보`}
                  </h2>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="flex items-center gap-2 px-4 py-2 rounded-sm text-sm font-korean transition-all duration-200"
                    style={{
                      background: 'oklch(0.97 0.005 75)',
                      color: 'oklch(0.45 0.12 265)',
                      border: '1px solid oklch(0.90 0.01 75)',
                    }}
                  >
                    {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    {showPreview ? '미리보기 닫기' : '미리보기 열기'}
                  </button>
                  <a
                    href={bulletins[0].file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-sm text-sm font-korean transition-all duration-200"
                    style={{
                      background: 'oklch(0.45 0.12 265)',
                      color: 'oklch(0.98 0.003 75)',
                    }}
                  >
                    <Download className="w-4 h-4" />
                    다운로드
                  </a>
                </div>
              </div>
            </div>

            {showPreview && (
              <div
                className="rounded-sm overflow-hidden"
                style={{
                  border: '1px solid oklch(0.92 0.005 75)',
                  boxShadow: '0 4px 16px oklch(0.30 0.09 265 / 0.10)',
                }}
              >
                <iframe
                  src={`${bulletins[0].file_url}#toolbar=0&navpanes=0`}
                  className="w-full"
                  style={{ height: '80vh', minHeight: '600px' }}
                  title={bulletins[0].title || '최신 주보 미리보기'}
                />
              </div>
            )}
          </div>
        </section>
      )}

      {/* Bulletin List */}
      <section className="py-16" style={{ background: 'oklch(0.97 0.005 75)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
                주보 목록
              </h2>
              <span style={{ color: 'oklch(0.55 0.01 75)' }}>
                ({bulletins.length}개)
              </span>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'oklch(0.45 0.12 265)' }} />
            </div>
          ) : bulletins.length === 0 ? (
            <div
              className="text-center py-16 rounded-sm"
              style={{
                background: 'oklch(0.985 0.003 75)',
                border: '1px solid oklch(0.92 0.005 75)'
              }}
            >
              <FileText className="w-16 h-16 mx-auto mb-4" style={{ color: 'oklch(0.85 0.01 75)' }} />
              <p className="font-korean" style={{ color: 'oklch(0.55 0.01 75)' }}>등록된 주보가 없습니다.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bulletins.map((bulletin, index) => (
                <div
                  key={bulletin.id}
                  className={`flex items-center justify-between p-5 rounded-sm transition-all duration-300 hover:-translate-y-1 stagger-${(index % 6) + 1}`}
                  style={{
                    background: 'oklch(0.985 0.003 75)',
                    border: '1px solid oklch(0.92 0.005 75)',
                    boxShadow: '0 2px 8px oklch(0.30 0.09 265 / 0.06)'
                  }}
                >
                  <div className="flex items-center">
                    <div
                      className="w-12 h-12 rounded-sm flex items-center justify-center mr-4"
                      style={{ background: 'oklch(0.45 0.12 265 / 0.1)' }}
                    >
                      <FileText className="w-5 h-5" style={{ color: 'oklch(0.45 0.12 265)' }} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold font-korean" style={{ color: 'oklch(0.25 0.05 265)' }}>
                        {bulletin.title || `${formatDate(bulletin.bulletin_date)} 주보`}
                      </h3>
                      <div className="flex items-center text-sm" style={{ color: 'oklch(0.55 0.01 75)' }}>
                        <Calendar className="w-4 h-4 mr-1" />
                        <span className="font-korean">{formatDate(bulletin.bulletin_date)}</span>
                      </div>
                    </div>
                  </div>
                  {bulletin.file_url ? (
                    <a
                      href={bulletin.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-4 py-2 rounded-sm transition-all duration-300 hover:scale-105"
                      style={{
                        background: 'oklch(0.45 0.12 265)',
                        color: 'oklch(0.98 0.003 75)'
                      }}
                    >
                      <Download className="w-5 h-5 mr-2" />
                      <span className="font-korean">다운로드</span>
                    </a>
                  ) : (
                    <span className="text-sm font-korean" style={{ color: 'oklch(0.70 0.01 75)' }}>파일 없음</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

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
              { href: '/news/gallery', title: '행사사진', desc: '교회 행사 사진 갤러리' },
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

export default BulletinPage
