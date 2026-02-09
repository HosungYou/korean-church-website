import React, { useState, useEffect, useCallback } from 'react'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import Layout from '../components/Layout'
import PageHeader from '../components/PageHeader'
import { ChevronLeft, ChevronRight, Book, BookOpen, Heart, MessageCircle, Calendar } from 'lucide-react'
import {
  getActivePlans,
  getEntriesByMonth,
  getTodayReading,
  generateCalendarData,
  formatDateWithDay,
  type CalendarDay
} from '../utils/bibleReadingService'
import type { BibleReadingPlan, BibleReadingEntry } from '../../types/supabase'

// ===========================================
// VS Design Diverge: Bible Reading Public Page
// Editorial Split Layout: Calendar + Devotional
// OKLCH Color System + Paper Texture
// ===========================================

const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토']
const MONTH_NAMES = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']

interface BibleReadingPageProps {
  initialPlan: BibleReadingPlan | null
  initialEntries: BibleReadingEntry[]
}

export default function BibleReadingPage({ initialPlan, initialEntries }: BibleReadingPageProps) {
  const { t } = useTranslation('common')

  const [plans, setPlans] = useState<BibleReadingPlan[]>([])
  const [selectedPlan, setSelectedPlan] = useState<BibleReadingPlan | null>(initialPlan)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [calendarData, setCalendarData] = useState<CalendarDay[]>([])
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null)
  const [todayReading, setTodayReading] = useState<BibleReadingEntry | null>(null)
  const [loading, setLoading] = useState(false)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth() + 1

  // Load plans on mount
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Load monthly data
  useEffect(() => {
    async function loadEntries() {
      if (!selectedPlan) return

      setLoading(true)
      try {
        const data = await getEntriesByMonth(selectedPlan.id, year, month)
        const calendar = generateCalendarData(year, month, data)
        setCalendarData(calendar)

        // Load today's reading
        const today = await getTodayReading(selectedPlan.id)
        setTodayReading(today)

        // Auto-select today if has reading
        if (today) {
          const todayDate = new Date().toISOString().split('T')[0]
          const todayDay = calendar.find(d => d.date === todayDate && d.reading)
          if (todayDay) {
            setSelectedDay(todayDay)
          }
        }
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
    setSelectedDay(null)
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month, 1))
    setSelectedDay(null)
  }

  const handleDayClick = useCallback((day: CalendarDay) => {
    if (day.isCurrentMonth && day.reading) {
      setSelectedDay(day)
    }
  }, [])

  // Current displayed reading (selected day or today)
  const displayedReading = selectedDay?.reading || todayReading

  return (
    <Layout>
      {/* Page Header */}
      <PageHeader
        label={(t('bible_reading.label') as string) || '성경'}
        title={t('bible_reading.title') as string}
        subtitle={t('bible_reading.description') as string}
      />

      <div
        className="min-h-screen relative"
        style={{ background: 'oklch(0.985 0.003 75)' }}
      >
        {/* Grain overlay */}
        <div className="bg-grain absolute inset-0 pointer-events-none" />

        {/* Plan Selector */}
        {plans.length > 1 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
            <select
              value={selectedPlan?.id || ''}
              onChange={(e) => {
                const plan = plans.find(p => p.id === e.target.value)
                setSelectedPlan(plan || null)
                setSelectedDay(null)
              }}
              className="px-4 py-2 rounded-sm text-sm font-medium focus:outline-none"
              style={{
                background: 'oklch(0.92 0.005 75)',
                border: '1px solid oklch(0.88 0.005 75)',
                color: 'oklch(0.30 0.09 265)',
              }}
            >
              {plans.map(plan => (
                <option key={plan.id} value={plan.id}>
                  {plan.title}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* Left: Calendar (Sticky) */}
            <div className="lg:col-span-5 xl:col-span-4">
              <div
                className="lg:sticky lg:top-24 rounded-sm p-5 card-paper"
                style={{
                  background: 'oklch(0.985 0.003 75)',
                  border: '1px solid oklch(0.92 0.005 75)'
                }}
              >
                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-5">
                  <button
                    onClick={handlePrevMonth}
                    className="p-2 rounded-sm transition-all hover:scale-105"
                    style={{ background: 'oklch(0.92 0.005 75)' }}
                  >
                    <ChevronLeft className="w-5 h-5" style={{ color: 'oklch(0.45 0.01 75)' }} />
                  </button>
                  <h2
                    className="font-headline font-bold text-lg"
                    style={{ color: 'oklch(0.22 0.07 265)', letterSpacing: '-0.01em' }}
                  >
                    {year}년 {MONTH_NAMES[month - 1]}
                  </h2>
                  <button
                    onClick={handleNextMonth}
                    className="p-2 rounded-sm transition-all hover:scale-105"
                    style={{ background: 'oklch(0.92 0.005 75)' }}
                  >
                    <ChevronRight className="w-5 h-5" style={{ color: 'oklch(0.45 0.01 75)' }} />
                  </button>
                </div>

                {/* Day Headers */}
                <div className="grid grid-cols-7 mb-2">
                  {DAY_NAMES.map((day, idx) => (
                    <div
                      key={day}
                      className="text-center py-2 text-xs font-medium"
                      style={{
                        color: idx === 0 ? 'oklch(0.55 0.15 25)' : idx === 6 ? 'oklch(0.45 0.12 265)' : 'oklch(0.55 0.01 75)'
                      }}
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Grid */}
                {loading ? (
                  <div className="py-20 flex justify-center">
                    <div
                      className="w-8 h-8 border-2 rounded-full animate-spin"
                      style={{ borderColor: 'oklch(0.45 0.12 265)', borderTopColor: 'transparent' }}
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-7 gap-1">
                    {calendarData.map((day, index) => {
                      const isToday = day.date === new Date().toISOString().split('T')[0]
                      const hasReading = !!day.reading
                      const hasDevotional = hasReading && (day.reading?.title || day.reading?.pastor_notes)
                      const isSelected = selectedDay?.date === day.date
                      const dayOfWeek = index % 7

                      return (
                        <button
                          key={`${day.date}-${index}`}
                          onClick={() => handleDayClick(day)}
                          disabled={!day.isCurrentMonth || !hasReading}
                          className={`
                            relative aspect-square p-1 rounded-sm text-sm transition-all duration-200
                            ${day.isCurrentMonth && hasReading ? 'hover:scale-105 cursor-pointer' : 'cursor-default'}
                            ${!day.isCurrentMonth ? 'opacity-30' : ''}
                            ${isSelected ? 'ring-2 ring-offset-1' : ''}
                          `}
                          style={{
                            background: isSelected
                              ? 'oklch(0.45 0.12 265)'
                              : hasDevotional
                                ? 'oklch(0.55 0.15 145 / 0.15)'
                                : hasReading
                                  ? 'oklch(0.72 0.10 75 / 0.2)'
                                  : 'transparent',
                            color: isSelected
                              ? 'white'
                              : dayOfWeek === 0 && day.isCurrentMonth
                                ? 'oklch(0.55 0.15 25)'
                                : dayOfWeek === 6 && day.isCurrentMonth
                                  ? 'oklch(0.45 0.12 265)'
                                  : 'oklch(0.35 0.02 75)',
                            outlineColor: 'oklch(0.45 0.12 265)',
                          }}
                          title={day.reading?.title ? `${day.reading.scripture_reference}: ${day.reading.title}` : undefined}
                        >
                          <span className={`font-medium ${isToday ? 'underline underline-offset-2' : ''}`}>
                            {day.dayOfMonth}
                          </span>
                          {hasDevotional && day.isCurrentMonth && !isSelected && (
                            <div
                              className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
                              style={{ background: 'oklch(0.45 0.15 145)' }}
                            />
                          )}
                        </button>
                      )
                    })}
                  </div>
                )}

                {/* Legend */}
                <div
                  className="mt-4 pt-4 flex flex-wrap items-center gap-4 text-xs"
                  style={{ borderTop: '1px solid oklch(0.92 0.005 75)' }}
                >
                  <div className="flex items-center gap-1.5">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ background: 'oklch(0.45 0.15 145)' }}
                    />
                    <span style={{ color: 'oklch(0.55 0.01 75)' }}>묵상 있음</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="underline" style={{ color: 'oklch(0.55 0.01 75)' }}>오늘</span>
                  </div>
                </div>

                {/* Plan Description */}
                {selectedPlan?.description && (
                  <div
                    className="mt-5 pt-4 text-xs leading-relaxed"
                    style={{ borderTop: '1px solid oklch(0.92 0.005 75)', color: 'oklch(0.55 0.01 75)' }}
                  >
                    {selectedPlan.description}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Devotional Content */}
            <div className="lg:col-span-7 xl:col-span-8">
              {displayedReading ? (
                <div className="space-y-6">
                  {/* Date & Scripture Header */}
                  <div
                    className="p-6 rounded-sm card-paper"
                    style={{
                      background: 'oklch(0.985 0.003 75)',
                      border: '1px solid oklch(0.92 0.005 75)'
                    }}
                  >
                    {/* Gold accent line */}
                    <div
                      className="h-0.5 w-12 mb-5"
                      style={{ background: 'linear-gradient(90deg, oklch(0.72 0.10 75), oklch(0.45 0.12 265))' }}
                    />

                    {/* Date */}
                    <p
                      className="text-xs font-medium tracking-wider uppercase mb-2"
                      style={{ color: 'oklch(0.72 0.10 75)' }}
                    >
                      {formatDateWithDay(displayedReading.reading_date)}
                    </p>

                    {/* Scripture Reference */}
                    {displayedReading.scripture_reference && (
                      <div className="flex items-center gap-3 mb-3">
                        <BookOpen className="w-5 h-5" style={{ color: 'oklch(0.45 0.12 265)' }} />
                        <span
                          className="font-headline font-bold text-lg"
                          style={{ color: 'oklch(0.30 0.09 265)' }}
                        >
                          {displayedReading.scripture_reference}
                        </span>
                      </div>
                    )}

                    {/* Title */}
                    {displayedReading.title && (
                      <h2
                        className="font-headline font-black text-2xl md:text-3xl"
                        style={{ color: 'oklch(0.22 0.07 265)', letterSpacing: '-0.02em' }}
                      >
                        &ldquo;{displayedReading.title}&rdquo;
                      </h2>
                    )}
                  </div>

                  {/* Pastor Notes */}
                  {displayedReading.pastor_notes && (
                    <div
                      className="p-6 rounded-sm card-paper"
                      style={{
                        background: 'oklch(0.985 0.003 75)',
                        border: '1px solid oklch(0.92 0.005 75)'
                      }}
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <Calendar className="w-5 h-5" style={{ color: 'oklch(0.45 0.12 265)' }} />
                        <h3
                          className="font-headline font-bold"
                          style={{ color: 'oklch(0.30 0.09 265)' }}
                        >
                          목사님 노트
                        </h3>
                      </div>
                      <div
                        className="prose prose-sm max-w-none leading-relaxed whitespace-pre-wrap font-korean"
                        style={{ color: 'oklch(0.35 0.02 75)' }}
                      >
                        {displayedReading.pastor_notes}
                      </div>
                    </div>
                  )}

                  {/* Application & Prayer in Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Application */}
                    {displayedReading.application && (
                      <div
                        className="p-6 rounded-sm card-paper"
                        style={{
                          background: 'oklch(0.985 0.003 75)',
                          borderLeft: '3px solid oklch(0.55 0.15 25)',
                          border: '1px solid oklch(0.92 0.005 75)',
                        }}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <Heart className="w-5 h-5" style={{ color: 'oklch(0.55 0.15 25)' }} />
                          <h3
                            className="font-headline font-bold"
                            style={{ color: 'oklch(0.30 0.09 265)' }}
                          >
                            적용
                          </h3>
                        </div>
                        <div
                          className="text-sm leading-relaxed whitespace-pre-wrap"
                          style={{ color: 'oklch(0.40 0.02 75)' }}
                        >
                          {displayedReading.application}
                        </div>
                      </div>
                    )}

                    {/* Prayer */}
                    {displayedReading.prayer && (
                      <div
                        className="p-6 rounded-sm card-paper"
                        style={{
                          background: 'oklch(0.985 0.003 75)',
                          borderLeft: '3px solid oklch(0.50 0.15 300)',
                          border: '1px solid oklch(0.92 0.005 75)',
                        }}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <MessageCircle className="w-5 h-5" style={{ color: 'oklch(0.50 0.15 300)' }} />
                          <h3
                            className="font-headline font-bold"
                            style={{ color: 'oklch(0.30 0.09 265)' }}
                          >
                            기도
                          </h3>
                        </div>
                        <div
                          className="text-sm leading-relaxed whitespace-pre-wrap"
                          style={{ color: 'oklch(0.40 0.02 75)' }}
                        >
                          {displayedReading.prayer}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Legacy Bible Reading Fields (if no devotional content) */}
                  {!displayedReading.pastor_notes && !displayedReading.application && (
                    <div
                      className="p-6 rounded-sm card-paper"
                      style={{
                        background: 'oklch(0.985 0.003 75)',
                        border: '1px solid oklch(0.92 0.005 75)'
                      }}
                    >
                      <h3
                        className="font-headline font-bold mb-4"
                        style={{ color: 'oklch(0.30 0.09 265)' }}
                      >
                        오늘의 읽기
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {displayedReading.old_testament && (
                          <div
                            className="p-3 rounded-sm"
                            style={{ background: 'oklch(0.55 0.12 225 / 0.1)' }}
                          >
                            <p className="text-xs font-medium mb-1" style={{ color: 'oklch(0.45 0.12 225)' }}>
                              구약
                            </p>
                            <p style={{ color: 'oklch(0.30 0.09 265)' }}>{displayedReading.old_testament}</p>
                          </div>
                        )}
                        {displayedReading.new_testament && (
                          <div
                            className="p-3 rounded-sm"
                            style={{ background: 'oklch(0.45 0.15 145 / 0.1)' }}
                          >
                            <p className="text-xs font-medium mb-1" style={{ color: 'oklch(0.40 0.15 145)' }}>
                              신약
                            </p>
                            <p style={{ color: 'oklch(0.30 0.09 265)' }}>{displayedReading.new_testament}</p>
                          </div>
                        )}
                        {displayedReading.psalms && (
                          <div
                            className="p-3 rounded-sm"
                            style={{ background: 'oklch(0.50 0.15 300 / 0.1)' }}
                          >
                            <p className="text-xs font-medium mb-1" style={{ color: 'oklch(0.45 0.15 300)' }}>
                              시편
                            </p>
                            <p style={{ color: 'oklch(0.30 0.09 265)' }}>{displayedReading.psalms}</p>
                          </div>
                        )}
                        {displayedReading.proverbs && (
                          <div
                            className="p-3 rounded-sm"
                            style={{ background: 'oklch(0.72 0.10 75 / 0.15)' }}
                          >
                            <p className="text-xs font-medium mb-1" style={{ color: 'oklch(0.55 0.12 75)' }}>
                              잠언
                            </p>
                            <p style={{ color: 'oklch(0.30 0.09 265)' }}>{displayedReading.proverbs}</p>
                          </div>
                        )}
                      </div>
                      {displayedReading.notes && (
                        <div
                          className="mt-4 p-3 rounded-sm text-sm"
                          style={{ background: 'oklch(0.92 0.005 75)', color: 'oklch(0.45 0.01 75)' }}
                        >
                          {displayedReading.notes}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div
                  className="p-12 rounded-sm flex flex-col items-center justify-center text-center card-paper"
                  style={{
                    background: 'oklch(0.985 0.003 75)',
                    border: '1px solid oklch(0.92 0.005 75)',
                    minHeight: '400px'
                  }}
                >
                  <div
                    className="w-16 h-16 rounded-sm flex items-center justify-center mb-4"
                    style={{ background: 'oklch(0.45 0.12 265 / 0.1)' }}
                  >
                    <Book className="w-8 h-8" style={{ color: 'oklch(0.45 0.12 265)' }} />
                  </div>
                  <h3
                    className="font-headline font-bold text-lg mb-2"
                    style={{ color: 'oklch(0.30 0.09 265)' }}
                  >
                    오늘의 묵상이 없습니다
                  </h3>
                  <p className="text-sm" style={{ color: 'oklch(0.55 0.01 75)' }}>
                    캘린더에서 묵상이 있는 날짜를 선택해주세요.<br />
                    녹색 표시가 있는 날짜에 묵상이 등록되어 있습니다.
                  </p>
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
