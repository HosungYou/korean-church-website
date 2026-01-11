import React, { useState, useEffect } from 'react'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import Layout from '../components/Layout'
import { ChevronLeft, ChevronRight, Book, Calendar } from 'lucide-react'
import {
  getActivePlans,
  getEntriesByMonth,
  getTodayReading,
  generateCalendarData,
  type CalendarDay
} from '../utils/bibleReadingService'
import type { BibleReadingPlan, BibleReadingEntry } from '../../types/supabase'

interface BibleReadingPageProps {
  initialPlan: BibleReadingPlan | null
  initialEntries: BibleReadingEntry[]
}

export default function BibleReadingPage({ initialPlan, initialEntries }: BibleReadingPageProps) {
  const { t } = useTranslation('common')
  const [plans, setPlans] = useState<BibleReadingPlan[]>([])
  const [selectedPlan, setSelectedPlan] = useState<BibleReadingPlan | null>(initialPlan)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [entries, setEntries] = useState<BibleReadingEntry[]>(initialEntries)
  const [calendarData, setCalendarData] = useState<CalendarDay[]>([])
  const [todayReading, setTodayReading] = useState<BibleReadingEntry | null>(null)
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null)
  const [loading, setLoading] = useState(false)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth() + 1

  // 계획 목록 로드
  useEffect(() => {
    async function loadPlans() {
      try {
        const data = await getActivePlans()
        setPlans(data)
        if (data.length > 0 && !selectedPlan) {
          setSelectedPlan(data[0])
        }
      } catch (error) {
        console.error('Error loading plans:', error)
      }
    }
    loadPlans()
  }, [])

  // 월별 데이터 로드
  useEffect(() => {
    async function loadEntries() {
      if (!selectedPlan) return

      setLoading(true)
      try {
        const data = await getEntriesByMonth(selectedPlan.id, year, month)
        setEntries(data)

        const calendar = generateCalendarData(year, month, data)
        setCalendarData(calendar)

        // 오늘 읽기 로드
        const today = await getTodayReading(selectedPlan.id)
        setTodayReading(today)
      } catch (error) {
        console.error('Error loading entries:', error)
      } finally {
        setLoading(false)
      }
    }

    loadEntries()
  }, [selectedPlan, year, month])

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 2, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month, 1))
  }

  const handleDayClick = (day: CalendarDay) => {
    if (day.isCurrentMonth && day.reading) {
      setSelectedDay(day)
    }
  }

  const monthNames = [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ]

  const dayNames = ['일', '월', '화', '수', '목', '금', '토']

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-primary text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-4">
              <Book className="w-8 h-8" />
              <h1 className="text-3xl font-bold">{t('bible_reading.title')}</h1>
            </div>
            <p className="text-lg text-gray-200">{t('bible_reading.description')}</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 오늘의 말씀 카드 */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  {t('bible_reading.today_reading')}
                </h2>

                {/* 계획 선택 */}
                {plans.length > 1 && (
                  <div className="mb-4">
                    <select
                      value={selectedPlan?.id || ''}
                      onChange={(e) => {
                        const plan = plans.find(p => p.id === e.target.value)
                        setSelectedPlan(plan || null)
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      {plans.map(plan => (
                        <option key={plan.id} value={plan.id}>
                          {plan.title}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {todayReading ? (
                  <div className="space-y-3">
                    {todayReading.old_testament && (
                      <div className="p-3 bg-blue-50 rounded-md">
                        <p className="text-sm text-blue-600 font-medium">{t('bible_reading.old_testament')}</p>
                        <p className="text-gray-900">{todayReading.old_testament}</p>
                      </div>
                    )}
                    {todayReading.new_testament && (
                      <div className="p-3 bg-green-50 rounded-md">
                        <p className="text-sm text-green-600 font-medium">{t('bible_reading.new_testament')}</p>
                        <p className="text-gray-900">{todayReading.new_testament}</p>
                      </div>
                    )}
                    {todayReading.psalms && (
                      <div className="p-3 bg-purple-50 rounded-md">
                        <p className="text-sm text-purple-600 font-medium">{t('bible_reading.psalms')}</p>
                        <p className="text-gray-900">{todayReading.psalms}</p>
                      </div>
                    )}
                    {todayReading.proverbs && (
                      <div className="p-3 bg-orange-50 rounded-md">
                        <p className="text-sm text-orange-600 font-medium">{t('bible_reading.proverbs')}</p>
                        <p className="text-gray-900">{todayReading.proverbs}</p>
                      </div>
                    )}
                    {todayReading.notes && (
                      <div className="p-3 bg-gray-50 rounded-md">
                        <p className="text-sm text-gray-600">{todayReading.notes}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">{t('bible_reading.no_reading')}</p>
                )}

                {/* 선택된 날짜의 읽기 */}
                {selectedDay && selectedDay.reading && selectedDay.reading.id !== todayReading?.id && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">
                      {new Date(selectedDay.date).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })}
                    </h3>
                    <div className="space-y-2">
                      {selectedDay.reading.old_testament && (
                        <div className="p-2 bg-blue-50 rounded text-sm">
                          <span className="text-blue-600 font-medium">구약: </span>
                          {selectedDay.reading.old_testament}
                        </div>
                      )}
                      {selectedDay.reading.new_testament && (
                        <div className="p-2 bg-green-50 rounded text-sm">
                          <span className="text-green-600 font-medium">신약: </span>
                          {selectedDay.reading.new_testament}
                        </div>
                      )}
                      {selectedDay.reading.psalms && (
                        <div className="p-2 bg-purple-50 rounded text-sm">
                          <span className="text-purple-600 font-medium">시편: </span>
                          {selectedDay.reading.psalms}
                        </div>
                      )}
                      {selectedDay.reading.proverbs && (
                        <div className="p-2 bg-orange-50 rounded text-sm">
                          <span className="text-orange-600 font-medium">잠언: </span>
                          {selectedDay.reading.proverbs}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 캘린더 */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                {/* 캘린더 헤더 */}
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={handlePrevMonth}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-xl font-bold text-gray-900">
                    {year}년 {monthNames[month - 1]}
                  </h2>
                  <button
                    onClick={handleNextMonth}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                {/* 요일 헤더 */}
                <div className="grid grid-cols-7 mb-2">
                  {dayNames.map((day, index) => (
                    <div
                      key={day}
                      className={`text-center py-2 text-sm font-medium ${
                        index === 0 ? 'text-red-500' : index === 6 ? 'text-blue-500' : 'text-gray-600'
                      }`}
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* 캘린더 그리드 */}
                {loading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-7 gap-1">
                    {calendarData.map((day, index) => {
                      const isToday = day.date === new Date().toISOString().split('T')[0]
                      const hasReading = day.reading !== undefined
                      const dayOfWeek = index % 7

                      return (
                        <button
                          key={`${day.date}-${index}`}
                          onClick={() => handleDayClick(day)}
                          disabled={!day.isCurrentMonth || !hasReading}
                          className={`
                            aspect-square p-1 rounded-lg text-sm transition-all
                            ${day.isCurrentMonth ? '' : 'text-gray-300'}
                            ${isToday ? 'ring-2 ring-primary ring-offset-1' : ''}
                            ${hasReading && day.isCurrentMonth ? 'bg-green-50 hover:bg-green-100 cursor-pointer' : ''}
                            ${selectedDay?.date === day.date ? 'bg-primary text-white' : ''}
                            ${dayOfWeek === 0 && day.isCurrentMonth ? 'text-red-500' : ''}
                            ${dayOfWeek === 6 && day.isCurrentMonth ? 'text-blue-500' : ''}
                            disabled:cursor-default
                          `}
                        >
                          <div className="flex flex-col items-center justify-center h-full">
                            <span className={`font-medium ${selectedDay?.date === day.date ? 'text-white' : ''}`}>
                              {day.dayOfMonth}
                            </span>
                            {hasReading && day.isCurrentMonth && (
                              <div className={`w-1.5 h-1.5 rounded-full mt-1 ${
                                selectedDay?.date === day.date ? 'bg-white' : 'bg-green-500'
                              }`} />
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}

                {/* 범례 */}
                <div className="mt-6 pt-4 border-t border-gray-200 flex items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span>읽기 계획 있음</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded ring-2 ring-primary"></div>
                    <span>오늘</span>
                  </div>
                </div>
              </div>

              {/* 계획 설명 */}
              {selectedPlan && (
                <div className="mt-6 bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{selectedPlan.title}</h3>
                  {selectedPlan.description && (
                    <p className="text-gray-600">{selectedPlan.description}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  let initialPlan = null
  let initialEntries: BibleReadingEntry[] = []

  try {
    const plans = await getActivePlans()
    if (plans.length > 0) {
      initialPlan = plans[0]
      const now = new Date()
      initialEntries = await getEntriesByMonth(initialPlan.id, now.getFullYear(), now.getMonth() + 1)
    }
  } catch (error) {
    console.error('Error loading initial data:', error)
  }

  return {
    props: {
      ...(await serverSideTranslations(locale || 'ko', ['common'])),
      initialPlan,
      initialEntries,
    },
    revalidate: 3600, // 1시간마다 재생성
  }
}
