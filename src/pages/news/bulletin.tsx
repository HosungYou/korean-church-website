import Layout from '@/components/Layout'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useState, useEffect, useMemo } from 'react'
import { Download, FileText, Calendar, Filter, Loader2 } from 'lucide-react'
import { getBulletins, getBulletinsByYear } from '../../utils/bulletinService'
import type { Bulletin } from '../../../types/supabase'

const BulletinPage = () => {
  const [bulletins, setBulletins] = useState<Bulletin[]>([])
  const [yearCounts, setYearCounts] = useState<{ [year: number]: number }>({})
  const [loading, setLoading] = useState(true)
  const [selectedYear, setSelectedYear] = useState<number | null>(null)

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
      {/* Hero Section */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-3 h-3 bg-black rounded-full mr-4"></div>
              <h1 className="text-4xl md:text-5xl font-bold text-black font-korean">주보</h1>
              <div className="w-3 h-3 bg-black rounded-full ml-4"></div>
            </div>
            <p className="text-xl text-gray-600 font-korean max-w-2xl mx-auto">
              매주 주일예배 주보를 다운로드하실 수 있습니다
            </p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="bg-gray-50 py-6 border-b border-gray-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 flex-wrap">
            <Filter className="w-5 h-5 text-gray-500" />
            <span className="text-sm text-gray-600 font-korean">년도:</span>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedYear(null)}
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
                  onClick={() => setSelectedYear(year)}
                  className={`px-4 py-2 rounded-lg font-korean text-sm transition-colors ${
                    selectedYear === year
                      ? 'bg-black text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  {year} ({yearCounts[year]})
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bulletin List */}
      <section className="bg-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-8">
            <div className="w-3 h-3 bg-black rounded-full mr-4"></div>
            <h2 className="text-2xl font-bold text-black font-korean">주보 목록</h2>
            <span className="ml-3 text-gray-500 font-korean">({bulletins.length}개)</span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-black" />
            </div>
          ) : bulletins.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-korean">등록된 주보가 없습니다.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bulletins.map((bulletin) => (
                <div
                  key={bulletin.id}
                  className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-black/5 rounded-lg flex items-center justify-center mr-4">
                      <FileText className="w-6 h-6 text-black/60" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold font-korean text-black">
                        {bulletin.title || `${formatDate(bulletin.bulletin_date)} 주보`}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500">
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
                      className="flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      <span className="font-korean">다운로드</span>
                    </a>
                  ) : (
                    <span className="text-gray-400 text-sm font-korean">파일 없음</span>
                  )}
                </div>
              ))}
            </div>
          )}
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
