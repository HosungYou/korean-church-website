import type { GetStaticProps, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Layout from '@/components/Layout'
import PageHeader from '@/components/PageHeader'
import Link from 'next/link'
import { useState } from 'react'

// ===========================================
// VS Design Diverge: Editorial Minimalism
// Unified Worship Page - 통합 예배 페이지
// ===========================================

const Worship: NextPage = () => {
  const { t, i18n } = useTranslation(['worship', 'common'])
  const isKorean = i18n.language === 'ko'
  const fontClass = isKorean ? 'font-korean' : 'font-english'

  const [copiedZoom, setCopiedZoom] = useState(false)
  const [copiedPaypal, setCopiedPaypal] = useState(false)
  const [copiedVenmo, setCopiedVenmo] = useState(false)
  const [copiedAddress, setCopiedAddress] = useState(false)

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    if (type === 'zoom') {
      setCopiedZoom(true)
      setTimeout(() => setCopiedZoom(false), 2000)
    } else if (type === 'paypal') {
      setCopiedPaypal(true)
      setTimeout(() => setCopiedPaypal(false), 2000)
    } else if (type === 'venmo') {
      setCopiedVenmo(true)
      setTimeout(() => setCopiedVenmo(false), 2000)
    } else if (type === 'address') {
      setCopiedAddress(true)
      setTimeout(() => setCopiedAddress(false), 2000)
    }
  }

  return (
    <Layout>
      {/* Page Header - Photo Composite Style */}
      <PageHeader
        label="WORSHIP SERVICE"
        title={isKorean ? '예배 안내' : 'Worship'}
        subtitle={isKorean
          ? '스테이트 칼리지 한인교회의 모든 예배에 여러분을 초대합니다.'
          : 'Join us for worship at State College Korean Church.'}
      />

      {/* Main Service Times Section */}
      <section className="py-24 bg-grain" style={{ background: 'oklch(0.985 0.003 75)' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Section Header - Editorial Style */}
          <div className="mb-16">
            <div
              className="h-0.5 w-16 mb-6"
              style={{ background: 'linear-gradient(90deg, oklch(0.72 0.10 75), oklch(0.45 0.12 265))' }}
            />
            <span
              className="text-xs font-medium tracking-[0.2em] uppercase mb-4 block"
              style={{ color: 'oklch(0.72 0.10 75)' }}
            >
              SERVICE TIMES
            </span>
            <h2
              className={`font-headline font-black ${fontClass}`}
              style={{
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                letterSpacing: '-0.03em',
                color: 'oklch(0.22 0.07 265)',
              }}
            >
              {isKorean ? '예배 시간' : 'Service Times'}
            </h2>
          </div>

          {/* Service Cards - Asymmetric Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sunday Service - Large Card */}
            <div
              className="lg:col-span-7 card-paper rounded-sm p-8 lg:p-12 relative overflow-hidden group"
              style={{ background: 'oklch(0.98 0.003 75)' }}
            >
              {/* Accent Line */}
              <div
                className="absolute left-0 top-0 bottom-0 w-1"
                style={{
                  background: 'linear-gradient(180deg, oklch(0.72 0.10 75), oklch(0.45 0.12 265))',
                }}
              />

              {/* Badge */}
              <span
                className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-full mb-6"
                style={{
                  background: 'oklch(0.72 0.10 75 / 0.15)',
                  color: 'oklch(0.58 0.11 75)',
                }}
              >
                {isKorean ? '주일' : 'SUNDAY'}
              </span>

              <h3
                className={`font-headline font-bold mb-4 ${fontClass}`}
                style={{
                  fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                  color: 'oklch(0.22 0.07 265)',
                }}
              >
                {isKorean ? '주일 예배' : 'Sunday Worship'}
              </h3>

              {/* Time - Large Display */}
              <div
                className="font-display mb-6"
                style={{
                  fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                  fontWeight: 700,
                  letterSpacing: '-0.03em',
                  color: 'oklch(0.45 0.12 265)',
                }}
              >
                {isKorean ? '오전 11:00' : '11:00 AM'}
              </div>

              {/* Details */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: 'oklch(0.93 0.02 265)' }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'oklch(0.45 0.12 265)' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <span className={`text-base ${fontClass}`} style={{ color: 'oklch(0.40 0.04 75)' }}>
                    {isKorean ? '현장 예배 (본당)' : 'In-Person (Sanctuary)'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: 'oklch(0.93 0.02 265)' }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'oklch(0.45 0.12 265)' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className={`text-base ${fontClass}`} style={{ color: 'oklch(0.40 0.04 75)' }}>
                    YouTube Live{' '}
                    <span
                      className="ml-2 px-2 py-0.5 text-xs rounded"
                      style={{
                        background: 'oklch(0.72 0.10 75 / 0.2)',
                        color: 'oklch(0.58 0.11 75)',
                      }}
                    >
                      {isKorean ? '준비중' : 'Coming Soon'}
                    </span>
                  </span>
                </div>
              </div>

              {/* Link to Sermon Archive */}
              <Link
                href="/sermons/sunday"
                className={`inline-flex items-center gap-2 mt-8 text-sm font-medium transition-all group-hover:gap-3 ${fontClass}`}
                style={{ color: 'oklch(0.45 0.12 265)' }}
              >
                {isKorean ? '주일 설교 보기' : 'View Sunday Sermons'}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            {/* Right Column - Stacked Cards */}
            <div className="lg:col-span-5 space-y-8">
              {/* Wednesday Service */}
              <div
                className="card-paper rounded-sm p-8 relative overflow-hidden"
                style={{ background: 'oklch(0.98 0.003 75)' }}
              >
                <div
                  className="absolute left-0 top-0 bottom-0 w-1"
                  style={{ background: 'oklch(0.45 0.12 265)' }}
                />

                <span
                  className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-full mb-4"
                  style={{
                    background: 'oklch(0.45 0.12 265 / 0.1)',
                    color: 'oklch(0.45 0.12 265)',
                  }}
                >
                  {isKorean ? '수요일' : 'WEDNESDAY'}
                </span>

                <h3
                  className={`font-headline font-bold mb-2 ${fontClass}`}
                  style={{
                    fontSize: '1.25rem',
                    color: 'oklch(0.22 0.07 265)',
                  }}
                >
                  {isKorean ? '수요 예배' : 'Wednesday Service'}
                </h3>

                <div
                  className="font-display mb-4"
                  style={{
                    fontSize: '2rem',
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                    color: 'oklch(0.45 0.12 265)',
                  }}
                >
                  {isKorean ? '저녁 7:30' : '7:30 PM'}
                </div>

                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'oklch(0.55 0.01 75)' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <span className={`text-sm ${fontClass}`} style={{ color: 'oklch(0.45 0.03 75)' }}>
                    {isKorean ? '현장 예배' : 'In-Person Only'}
                  </span>
                </div>

                <Link
                  href="/sermons/wednesday"
                  className={`inline-flex items-center gap-2 mt-6 text-sm font-medium ${fontClass}`}
                  style={{ color: 'oklch(0.45 0.12 265)' }}
                >
                  {isKorean ? '수요 설교 보기' : 'View Wednesday Sermons'}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>

              {/* Dawn Prayer */}
              <div
                className="card-paper rounded-sm p-8 relative overflow-hidden"
                style={{ background: 'oklch(0.22 0.07 265)' }}
              >
                <span
                  className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-full mb-4"
                  style={{
                    background: 'oklch(0.72 0.10 75 / 0.2)',
                    color: 'oklch(0.82 0.08 75)',
                  }}
                >
                  {isKorean ? '새벽기도' : 'DAWN PRAYER'}
                </span>

                <h3
                  className={`font-headline font-bold mb-2 ${fontClass}`}
                  style={{
                    fontSize: '1.25rem',
                    color: 'oklch(0.95 0.005 75)',
                  }}
                >
                  {isKorean ? '새벽 기도회' : 'Dawn Prayer Meeting'}
                </h3>

                <div
                  className="font-display mb-4"
                  style={{
                    fontSize: '2rem',
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                    color: 'oklch(0.72 0.10 75)',
                  }}
                >
                  {isKorean ? '새벽 6:30' : '6:30 AM'}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'oklch(0.72 0.10 75)' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span className={`text-sm ${fontClass}`} style={{ color: 'oklch(0.80 0.02 75)' }}>
                      {isKorean ? '화, 수, 금 - Zoom' : 'Tue, Wed, Fri - Zoom'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'oklch(0.72 0.10 75)' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <span className={`text-sm ${fontClass}`} style={{ color: 'oklch(0.80 0.02 75)' }}>
                      {isKorean ? '토 - 교회 본당' : 'Sat - In-Person'}
                    </span>
                  </div>
                </div>

                {/* Zoom Link Button */}
                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href="https://tinyurl.com/sckc3"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-sm transition-all"
                    style={{
                      background: 'oklch(0.72 0.10 75)',
                      color: 'oklch(0.15 0.05 265)',
                    }}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M4.25 4h3.5c.14 0 .25.11.25.25v3.5c0 .14-.11.25-.25.25h-3.5C4.11 8 4 7.89 4 7.75v-3.5c0-.14.11-.25.25-.25zm12 0h3.5c.14 0 .25.11.25.25v3.5c0 .14-.11.25-.25.25h-3.5c-.14 0-.25-.11-.25-.25v-3.5c0-.14.11-.25.25-.25zm-12 8h3.5c.14 0 .25.11.25.25v3.5c0 .14-.11.25-.25.25h-3.5c-.14 0-.25-.11-.25-.25v-3.5c0-.14.11-.25.25-.25zm12 0h3.5c.14 0 .25.11.25.25v3.5c0 .14-.11.25-.25.25h-3.5c-.14 0-.25-.11-.25-.25v-3.5c0-.14.11-.25.25-.25zM8 12h8v4H8v-4z"/>
                    </svg>
                    {isKorean ? 'Zoom 접속' : 'Join Zoom'}
                  </a>
                  <button
                    onClick={() => copyToClipboard('https://tinyurl.com/sckc3', 'zoom')}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-sm transition-all"
                    style={{
                      background: 'oklch(0.95 0.005 75 / 0.1)',
                      color: 'oklch(0.85 0.02 75)',
                      border: '1px solid oklch(0.95 0.005 75 / 0.2)',
                    }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    {copiedZoom ? (isKorean ? '복사됨!' : 'Copied!') : (isKorean ? '링크 복사' : 'Copy Link')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Giving Section */}
      <section
        className="py-24 bg-grain relative overflow-hidden"
        style={{ background: 'oklch(0.93 0.02 265)' }}
      >
        {/* Decorative Pattern */}
        <div
          className="absolute top-0 right-0 w-1/2 h-full opacity-5"
          style={{
            background: 'radial-gradient(circle at 100% 0%, oklch(0.72 0.10 75), transparent 70%)',
          }}
        />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="mb-16">
            <div
              className="h-0.5 w-16 mb-6"
              style={{ background: 'linear-gradient(90deg, oklch(0.72 0.10 75), oklch(0.45 0.12 265))' }}
            />
            <span
              className="text-xs font-medium tracking-[0.2em] uppercase mb-4 block"
              style={{ color: 'oklch(0.72 0.10 75)' }}
            >
              GIVING
            </span>
            <h2
              className={`font-headline font-black ${fontClass}`}
              style={{
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                letterSpacing: '-0.03em',
                color: 'oklch(0.22 0.07 265)',
              }}
            >
              {isKorean ? '헌금 안내' : 'Ways to Give'}
            </h2>
          </div>

          {/* Scripture Quote */}
          <div className="mb-12 max-w-2xl">
            <blockquote
              className="font-scripture italic leading-relaxed"
              style={{
                fontSize: '1.125rem',
                color: 'oklch(0.35 0.06 265)',
              }}
            >
              {isKorean
                ? '"각각 그 마음에 정한 대로 할 것이요 인색함으로나 억지로 하지 말지니 하나님은 즐겨 내는 자를 사랑하시느니라"'
                : '"Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver."'}
            </blockquote>
            <cite
              className="block mt-3 text-sm not-italic"
              style={{ color: 'oklch(0.55 0.03 75)' }}
            >
              {isKorean ? '— 고린도후서 9:7' : '— 2 Corinthians 9:7'}
            </cite>
          </div>

          {/* Giving Methods Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Offering Envelope */}
            <div
              className="card-paper rounded-sm p-6 lg:p-8"
              style={{ background: 'oklch(0.98 0.003 75)' }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-sm flex items-center justify-center flex-shrink-0"
                  style={{ background: 'oklch(0.45 0.12 265)' }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'oklch(0.95 0.005 75)' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h6m-6 4h6m-6 4h6" />
                  </svg>
                </div>
                <div>
                  <h3
                    className={`font-headline font-bold mb-2 ${fontClass}`}
                    style={{ color: 'oklch(0.22 0.07 265)' }}
                  >
                    {isKorean ? '헌금 봉투' : 'Offering Envelope'}
                  </h3>
                  <p
                    className={`text-sm leading-relaxed ${fontClass}`}
                    style={{ color: 'oklch(0.45 0.03 75)' }}
                  >
                    {isKorean
                      ? '교회에 오실 때 입구 로비에 비치된 헌금봉투를 사용해서 예배 전에 헌금함에 넣어 주시기 바랍니다. (예배 중에는 별도의 헌금 순서가 없습니다)'
                      : 'Please use the offering envelopes available in the lobby and place them in the offering box before the service begins. (There is no separate offering time during the service)'}
                  </p>
                </div>
              </div>
            </div>

            {/* Mail */}
            <div
              className="card-paper rounded-sm p-6 lg:p-8"
              style={{ background: 'oklch(0.98 0.003 75)' }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-sm flex items-center justify-center flex-shrink-0"
                  style={{ background: 'oklch(0.45 0.12 265)' }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'oklch(0.95 0.005 75)' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3
                    className={`font-headline font-bold mb-2 ${fontClass}`}
                    style={{ color: 'oklch(0.22 0.07 265)' }}
                  >
                    {isKorean ? '우편' : 'Mail'}
                  </h3>
                  <div
                    className="font-mono text-sm p-3 rounded-sm mb-3"
                    style={{ background: 'oklch(0.95 0.005 75)', color: 'oklch(0.30 0.05 265)' }}
                  >
                    758 Glenn Rd, State College, PA 16803
                  </div>
                  <button
                    onClick={() => copyToClipboard('758 Glenn Rd, State College, PA 16803', 'address')}
                    className={`inline-flex items-center gap-2 text-sm font-medium transition-all ${fontClass}`}
                    style={{ color: 'oklch(0.45 0.12 265)' }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    {copiedAddress ? (isKorean ? '복사됨!' : 'Copied!') : (isKorean ? '주소 복사' : 'Copy Address')}
                  </button>
                </div>
              </div>
            </div>

            {/* PayPal */}
            <div
              className="card-paper rounded-sm p-6 lg:p-8"
              style={{ background: 'oklch(0.98 0.003 75)' }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-sm flex items-center justify-center flex-shrink-0"
                  style={{ background: 'oklch(0.45 0.12 265)' }}
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'oklch(0.95 0.005 75)' }}>
                    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.255-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106h3.607l.776-4.923h2.234c3.838 0 6.607-1.56 7.45-6.07.674-3.606-.064-5.524-1.412-6.524z"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <h3
                    className={`font-headline font-bold mb-2 ${fontClass}`}
                    style={{ color: 'oklch(0.22 0.07 265)' }}
                  >
                    PayPal
                  </h3>
                  <div
                    className="font-mono text-sm p-3 rounded-sm mb-3"
                    style={{ background: 'oklch(0.95 0.005 75)', color: 'oklch(0.30 0.05 265)' }}
                  >
                    paypal.me/sckc9191
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <a
                      href="https://paypal.me/sckc9191"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-sm transition-all"
                      style={{
                        background: 'oklch(0.45 0.12 265)',
                        color: 'oklch(0.95 0.005 75)',
                      }}
                    >
                      {isKorean ? 'PayPal로 헌금' : 'Give via PayPal'}
                    </a>
                    <button
                      onClick={() => copyToClipboard('paypal.me/sckc9191', 'paypal')}
                      className={`inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-sm transition-all ${fontClass}`}
                      style={{
                        background: 'oklch(0.93 0.02 265)',
                        color: 'oklch(0.35 0.08 265)',
                      }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      {copiedPaypal ? (isKorean ? '복사됨!' : 'Copied!') : (isKorean ? '복사' : 'Copy')}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Venmo */}
            <div
              className="card-paper rounded-sm p-6 lg:p-8"
              style={{ background: 'oklch(0.98 0.003 75)' }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-sm flex items-center justify-center flex-shrink-0"
                  style={{ background: 'oklch(0.45 0.12 265)' }}
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'oklch(0.95 0.005 75)' }}>
                    <path d="M19.734 4.371c1.594 2.247 1.594 5.317.547 8.463L16.688 24h-5.469l-3.047-11.672c-.391-1.484-.313-2.578.234-3.203.547-.625 1.484-.859 2.578-.859h1.172l1.953 7.5L16.375 4.37h3.359z"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <h3
                    className={`font-headline font-bold mb-2 ${fontClass}`}
                    style={{ color: 'oklch(0.22 0.07 265)' }}
                  >
                    Venmo
                  </h3>
                  <div
                    className="font-mono text-sm p-3 rounded-sm mb-3"
                    style={{ background: 'oklch(0.95 0.005 75)', color: 'oklch(0.30 0.05 265)' }}
                  >
                    venmo.com/sckc9191
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <a
                      href="https://venmo.com/sckc9191"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-sm transition-all"
                      style={{
                        background: 'oklch(0.45 0.12 265)',
                        color: 'oklch(0.95 0.005 75)',
                      }}
                    >
                      {isKorean ? 'Venmo로 헌금' : 'Give via Venmo'}
                    </a>
                    <button
                      onClick={() => copyToClipboard('venmo.com/sckc9191', 'venmo')}
                      className={`inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-sm transition-all ${fontClass}`}
                      style={{
                        background: 'oklch(0.93 0.02 265)',
                        color: 'oklch(0.35 0.08 265)',
                      }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      {copiedVenmo ? (isKorean ? '복사됨!' : 'Copied!') : (isKorean ? '복사' : 'Copy')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-24 bg-grain" style={{ background: 'oklch(0.985 0.003 75)' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Section Header */}
          <div className="mb-16">
            <div
              className="h-0.5 w-16 mb-6"
              style={{ background: 'linear-gradient(90deg, oklch(0.72 0.10 75), oklch(0.45 0.12 265))' }}
            />
            <span
              className="text-xs font-medium tracking-[0.2em] uppercase mb-4 block"
              style={{ color: 'oklch(0.72 0.10 75)' }}
            >
              LOCATION
            </span>
            <h2
              className={`font-headline font-black ${fontClass}`}
              style={{
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                letterSpacing: '-0.03em',
                color: 'oklch(0.22 0.07 265)',
              }}
            >
              {isKorean ? '오시는 길' : 'Visit Us'}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Address Card */}
            <div
              className="card-paper rounded-sm p-8"
              style={{ background: 'oklch(0.98 0.003 75)' }}
            >
              <h3
                className={`font-headline font-bold mb-4 ${fontClass}`}
                style={{ color: 'oklch(0.22 0.07 265)', fontSize: '1.25rem' }}
              >
                {isKorean ? '스테이트 칼리지 한인교회' : 'State College Korean Church'}
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'oklch(0.72 0.10 75)' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className={`font-medium ${fontClass}`} style={{ color: 'oklch(0.30 0.05 265)' }}>
                      758 Glenn Rd
                    </p>
                    <p className={fontClass} style={{ color: 'oklch(0.45 0.03 75)' }}>
                      State College, PA 16803
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'oklch(0.72 0.10 75)' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a
                    href="tel:814-380-9393"
                    className={`font-medium hover:underline ${fontClass}`}
                    style={{ color: 'oklch(0.45 0.12 265)' }}
                  >
                    814-380-9393
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'oklch(0.72 0.10 75)' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a
                    href="mailto:KyuHongYeon@gmail.com"
                    className={`font-medium hover:underline ${fontClass}`}
                    style={{ color: 'oklch(0.45 0.12 265)' }}
                  >
                    KyuHongYeon@gmail.com
                  </a>
                </div>
              </div>

              <Link
                href="/about/directions"
                className={`inline-flex items-center gap-2 mt-6 px-5 py-2.5 text-sm font-medium rounded-sm transition-all ${fontClass}`}
                style={{
                  background: 'oklch(0.45 0.12 265)',
                  color: 'oklch(0.95 0.005 75)',
                }}
              >
                {isKorean ? '자세한 오시는 길' : 'Get Directions'}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            {/* Map Embed */}
            <div
              className="rounded-sm overflow-hidden h-80 lg:h-full min-h-[320px]"
              style={{ boxShadow: 'var(--shadow-card)' }}
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3020.2!2d-77.8572!3d40.8148!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89cea8bdf84e9c7d%3A0x7d2d10df9c3c2d5a!2s758%20Glenn%20Rd%2C%20State%20College%2C%20PA%2016803!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="State College Korean Church Location"
              />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'ko', ['worship', 'common'])),
  },
})

export default Worship
