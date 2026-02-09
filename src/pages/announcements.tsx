import type { GetStaticProps } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Layout from '@/components/Layout'
import PageHeader from '@/components/PageHeader'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { getPublishedAnnouncements, PostRecord } from '../utils/postService'

interface SerializedPost {
  id: string
  title: string
  content: string
  type: 'announcement' | 'event' | 'general'
  category?: string
  excerpt?: string | null
  coverImageUrl?: string | null
  attachmentUrl?: string | null
  attachmentName?: string | null
  important?: boolean
  publishedAt?: string | null
  createdAt?: string | null
}

interface AnnouncementsPageProps {
  posts: SerializedPost[]
}

const formatDisplayDate = (iso?: string | null, locale: string = 'ko'): string => {
  if (!iso) return ''
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''

  if (locale === 'ko') {
    const year = `${date.getFullYear()}`.slice(-2)
    const month = `${date.getMonth() + 1}`.padStart(2, '0')
    const day = `${date.getDate()}`.padStart(2, '0')
    return `${year}.${month}.${day}`
  }

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date)
}

const Announcements = ({ posts: initialPosts }: AnnouncementsPageProps) => {
  const { t, i18n } = useTranslation(['common'])
  const router = useRouter()
  const isKorean = i18n.language === 'ko'
  const [posts] = useState<SerializedPost[]>(initialPosts)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')

  const filteredPosts = posts.filter((post) => {
    const lowerSearch = searchTerm.trim().toLowerCase()
    const matchesSearch = !lowerSearch ||
      post.title.toLowerCase().includes(lowerSearch) ||
      (post.excerpt ?? '').toLowerCase().includes(lowerSearch) ||
      post.content.toLowerCase().includes(lowerSearch)

    const matchesType = selectedType === 'all' || post.type === selectedType

    return matchesSearch && matchesType
  })

  const handlePostClick = (postId: string) => {
    router.push(`/news/posts/${postId}`)
  }

  const typeFilters = [
    { key: 'all', label: isKorean ? '전체' : 'All' },
    { key: 'announcement', label: isKorean ? '공지' : 'Notice' },
    { key: 'event', label: isKorean ? '행사' : 'Event' },
    { key: 'general', label: isKorean ? '일반' : 'General' },
  ]

  return (
    <Layout>
      {/* Page Header */}
      <PageHeader
        label={isKorean ? '알림 및 공지' : 'News & Updates'}
        title={isKorean ? '공지사항' : 'Announcements'}
        subtitle={isKorean
          ? '스테이트 칼리지 한인교회의 소식과 공지사항을 확인하세요.'
          : 'Stay updated with news and announcements from State College Korean Church.'
        }
      />

      {/* Main Content */}
      <section
        className="py-16 relative"
        style={{ background: 'oklch(0.985 0.003 75)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Posts List */}
            <div className="lg:col-span-2">
              {/* Search & Filter Bar */}
              <div className="mb-8 space-y-4">
                {/* Search */}
                <div className="relative">
                  <svg
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5"
                    style={{ color: 'oklch(0.55 0.01 75)' }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder={isKorean ? '공지사항 검색...' : 'Search announcements...'}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 transition-all duration-300 focus:outline-none"
                    style={{
                      background: 'oklch(0.99 0.003 75)',
                      border: '1px solid oklch(0.92 0.01 75)',
                      borderRadius: '2px',
                      color: 'oklch(0.30 0.09 265)',
                    }}
                  />
                </div>

                {/* Type Filter */}
                <div className="flex flex-wrap gap-2">
                  {typeFilters.map((filter) => (
                    <button
                      key={filter.key}
                      onClick={() => setSelectedType(filter.key)}
                      className="px-4 py-2 text-sm font-medium transition-all duration-300"
                      style={{
                        background: selectedType === filter.key ? 'oklch(0.45 0.12 265)' : 'transparent',
                        color: selectedType === filter.key ? 'oklch(0.98 0.01 75)' : 'oklch(0.55 0.01 75)',
                        border: `1px solid ${selectedType === filter.key ? 'oklch(0.45 0.12 265)' : 'oklch(0.92 0.01 75)'}`,
                        borderRadius: '2px',
                      }}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Posts Header */}
              <div className="mb-6">
                <div
                  className="h-0.5 w-12 mb-6"
                  style={{ background: 'linear-gradient(90deg, oklch(0.72 0.10 75), oklch(0.45 0.12 265))' }}
                />
                <div className="flex items-center justify-between">
                  <span
                    className="text-xs font-medium tracking-[0.2em] uppercase"
                    style={{ color: 'oklch(0.72 0.10 75)' }}
                  >
                    {isKorean ? '최신 공지' : 'Latest'}
                  </span>
                  <span
                    className="text-sm"
                    style={{ color: 'oklch(0.55 0.01 75)' }}
                  >
                    {isKorean ? `총 ${filteredPosts.length}건` : `${filteredPosts.length} posts`}
                  </span>
                </div>
              </div>

              {/* Posts */}
              {filteredPosts.length === 0 ? (
                <div
                  className="p-16 text-center"
                  style={{
                    background: 'oklch(0.99 0.003 75)',
                    border: '1px solid oklch(0.92 0.01 75)',
                    borderRadius: '2px',
                  }}
                >
                  <div
                    className="w-16 h-16 mx-auto mb-6 flex items-center justify-center"
                    style={{ background: 'oklch(0.95 0.01 75)', borderRadius: '50%' }}
                  >
                    <svg
                      className="w-8 h-8"
                      style={{ color: 'oklch(0.55 0.01 75)' }}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p
                    className="text-lg mb-2"
                    style={{ color: 'oklch(0.30 0.09 265)' }}
                  >
                    {searchTerm
                      ? (isKorean ? '검색 결과가 없습니다.' : 'No results found.')
                      : (isKorean ? '등록된 공지사항이 없습니다.' : 'No announcements available.')
                    }
                  </p>
                  <p
                    className="text-sm"
                    style={{ color: 'oklch(0.55 0.01 75)' }}
                  >
                    {isKorean ? '새로운 공지사항을 기다려주세요.' : 'Please wait for new announcements.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredPosts.map((post, index) => {
                    const displayDate = formatDisplayDate(post.publishedAt, i18n.language)
                    return (
                      <article
                        key={post.id}
                        className="group cursor-pointer transition-all duration-300 hover:-translate-y-1"
                        onClick={() => handlePostClick(post.id)}
                        style={{
                          background: 'oklch(0.99 0.003 75)',
                          border: '1px solid oklch(0.92 0.01 75)',
                          borderRadius: '2px',
                          animation: `fadeIn 0.5s ease-out ${index * 0.05}s forwards`,
                          opacity: 0,
                        }}
                      >
                        <div className="p-6 md:p-8">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              {/* Meta info */}
                              <div className="flex flex-wrap items-center gap-3 mb-3">
                                <span
                                  className="text-xs font-medium px-3 py-1"
                                  style={{
                                    background: post.type === 'announcement'
                                      ? 'oklch(0.45 0.12 265 / 0.1)'
                                      : post.type === 'event'
                                      ? 'oklch(0.72 0.10 75 / 0.2)'
                                      : 'oklch(0.92 0.01 75)',
                                    color: post.type === 'announcement'
                                      ? 'oklch(0.45 0.12 265)'
                                      : post.type === 'event'
                                      ? 'oklch(0.50 0.12 75)'
                                      : 'oklch(0.55 0.01 75)',
                                    borderRadius: '1px',
                                  }}
                                >
                                  {post.type === 'announcement'
                                    ? (isKorean ? '공지' : 'Notice')
                                    : post.type === 'event'
                                    ? (isKorean ? '행사' : 'Event')
                                    : (isKorean ? '일반' : 'General')
                                  }
                                </span>
                                {displayDate && (
                                  <span
                                    className="text-xs"
                                    style={{ color: 'oklch(0.55 0.01 75)' }}
                                  >
                                    {displayDate}
                                  </span>
                                )}
                              </div>

                              {/* Title */}
                              <h3
                                className="text-lg md:text-xl font-bold mb-3 transition-colors duration-300"
                                style={{ color: 'oklch(0.30 0.09 265)' }}
                              >
                                {post.title || '(제목 없음)'}
                              </h3>

                              {/* Excerpt */}
                              {(post.excerpt || post.content) && (
                                <p
                                  className="text-sm leading-relaxed line-clamp-2"
                                  style={{ color: 'oklch(0.55 0.01 75)' }}
                                >
                                  {post.excerpt || post.content.slice(0, 140)}
                                </p>
                              )}

                              {/* Attachment */}
                              {post.attachmentUrl && post.attachmentName && (
                                <div className="mt-4">
                                  <a
                                    href={post.attachmentUrl}
                                    onClick={(e) => e.stopPropagation()}
                                    className="inline-flex items-center px-3 py-2 text-xs font-medium transition-all duration-300"
                                    style={{
                                      background: 'oklch(0.95 0.01 75)',
                                      color: 'oklch(0.45 0.12 265)',
                                      borderRadius: '2px',
                                    }}
                                    download
                                  >
                                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    {post.attachmentName}
                                  </a>
                                </div>
                              )}
                            </div>

                            {/* Arrow */}
                            <div
                              className="flex-shrink-0 w-10 h-10 flex items-center justify-center transition-all duration-300 group-hover:translate-x-1"
                              style={{ color: 'oklch(0.72 0.10 75)' }}
                            >
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </article>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-8">
              {/* Church Info Card */}
              <div
                className="overflow-hidden"
                style={{
                  background: 'oklch(0.99 0.003 75)',
                  border: '1px solid oklch(0.92 0.01 75)',
                  borderRadius: '2px',
                }}
              >
                <div
                  className="px-6 py-4"
                  style={{ background: 'oklch(0.22 0.07 265)' }}
                >
                  <h3
                    className="text-lg font-bold"
                    style={{ color: 'oklch(0.98 0.01 75)' }}
                  >
                    {isKorean ? '교회 정보' : 'Church Info'}
                  </h3>
                </div>
                <div className="p-6 space-y-5">
                  <div className="flex items-start gap-4">
                    <div style={{ color: 'oklch(0.72 0.10 75)' }}>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p
                        className="text-sm font-medium mb-1"
                        style={{ color: 'oklch(0.30 0.09 265)' }}
                      >
                        {isKorean ? '주소' : 'Address'}
                      </p>
                      <p
                        className="text-sm"
                        style={{ color: 'oklch(0.55 0.01 75)' }}
                      >
                        758 Glenn Rd, State College, PA 16803
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div style={{ color: 'oklch(0.72 0.10 75)' }}>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p
                        className="text-sm font-medium mb-1"
                        style={{ color: 'oklch(0.30 0.09 265)' }}
                      >
                        {isKorean ? '전화' : 'Phone'}
                      </p>
                      <p
                        className="text-sm"
                        style={{ color: 'oklch(0.55 0.01 75)' }}
                      >
                        814-380-9393
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div style={{ color: 'oklch(0.72 0.10 75)' }}>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p
                        className="text-sm font-medium mb-1"
                        style={{ color: 'oklch(0.30 0.09 265)' }}
                      >
                        {isKorean ? '이메일' : 'Email'}
                      </p>
                      <p
                        className="text-sm"
                        style={{ color: 'oklch(0.55 0.01 75)' }}
                      >
                        KyuHongYeon@gmail.com
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Times Card */}
              <div
                className="overflow-hidden"
                style={{
                  background: 'oklch(0.99 0.003 75)',
                  border: '1px solid oklch(0.92 0.01 75)',
                  borderRadius: '2px',
                }}
              >
                <div className="px-6 py-4" style={{ borderBottom: '1px solid oklch(0.92 0.01 75)' }}>
                  <h3
                    className="text-lg font-bold"
                    style={{ color: 'oklch(0.30 0.09 265)' }}
                  >
                    {isKorean ? '예배 시간' : 'Service Times'}
                  </h3>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ background: 'oklch(0.72 0.10 75)' }}
                      />
                      <span
                        className="text-sm font-medium"
                        style={{ color: 'oklch(0.30 0.09 265)' }}
                      >
                        {isKorean ? '주일예배' : 'Sunday Service'}
                      </span>
                    </div>
                    <span
                      className="text-sm"
                      style={{ color: 'oklch(0.55 0.01 75)' }}
                    >
                      {isKorean ? '오전 11:00' : '11:00 AM'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ background: 'oklch(0.72 0.10 75)' }}
                      />
                      <span
                        className="text-sm font-medium"
                        style={{ color: 'oklch(0.30 0.09 265)' }}
                      >
                        {isKorean ? '수요예배' : 'Wed. Service'}
                      </span>
                    </div>
                    <span
                      className="text-sm"
                      style={{ color: 'oklch(0.55 0.01 75)' }}
                    >
                      {isKorean ? '오후 7:30' : '7:30 PM'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div
                className="overflow-hidden"
                style={{
                  background: 'oklch(0.99 0.003 75)',
                  border: '1px solid oklch(0.92 0.01 75)',
                  borderRadius: '2px',
                }}
              >
                <div className="px-6 py-4" style={{ borderBottom: '1px solid oklch(0.92 0.01 75)' }}>
                  <h3
                    className="text-lg font-bold"
                    style={{ color: 'oklch(0.30 0.09 265)' }}
                  >
                    {isKorean ? '바로가기' : 'Quick Links'}
                  </h3>
                </div>
                <div className="p-4 space-y-1">
                  {[
                    { href: '/worship', label: isKorean ? '예배 안내' : 'Worship Info' },
                    { href: '/news/bulletin', label: isKorean ? '주보' : 'Bulletin' },
                    { href: '/community/settlement-info', label: isKorean ? '정착 도움 정보' : 'Settlement Info' },
                    { href: '/about/directions', label: isKorean ? '오시는 길' : 'Directions' },
                  ].map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center justify-between px-4 py-3 transition-all duration-300"
                      style={{
                        color: 'oklch(0.45 0.12 265)',
                        borderRadius: '2px',
                      }}
                    >
                      <span className="text-sm">{link.label}</span>
                      <svg className="w-4 h-4" style={{ color: 'oklch(0.72 0.10 75)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  ))}
                </div>
              </div>

              {/* CTA Card */}
              <div
                className="p-6 overflow-hidden relative"
                style={{
                  background: 'linear-gradient(135deg, oklch(0.45 0.12 265), oklch(0.30 0.09 265))',
                  borderRadius: '2px',
                }}
              >
                {/* Grain overlay */}
                <div
                  className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                  }}
                />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-3">
                    <svg
                      className="w-5 h-5"
                      style={{ color: 'oklch(0.72 0.10 75)' }}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <h3
                      className="text-lg font-bold"
                      style={{ color: 'oklch(0.98 0.01 75)' }}
                    >
                      {isKorean ? '소식 받기' : 'Stay Updated'}
                    </h3>
                  </div>
                  <p
                    className="text-sm mb-5"
                    style={{ color: 'oklch(0.85 0.02 75)' }}
                  >
                    {isKorean
                      ? '교회 소식을 이메일로 받아보세요.'
                      : 'Get church updates via email.'
                    }
                  </p>
                  <Link
                    href="/about"
                    className="inline-flex items-center px-4 py-2 text-sm font-semibold transition-all duration-300"
                    style={{
                      background: 'oklch(0.72 0.10 75)',
                      color: 'oklch(0.15 0.05 265)',
                      borderRadius: '2px',
                    }}
                  >
                    {isKorean ? '자세히 보기' : 'Learn More'}
                    <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  let serialized: SerializedPost[] = []

  try {
    const announcementPosts = await getPublishedAnnouncements(30)
    serialized = announcementPosts.map((post: PostRecord) => ({
      id: post.id,
      title: post.title,
      type: post.type,
      category: post.category ?? 'general',
      content: post.content,
      excerpt: post.excerpt ?? null,
      coverImageUrl: post.coverImageUrl ?? null,
      attachmentUrl: post.attachmentUrl ?? null,
      attachmentName: post.attachmentName ?? null,
      publishedAt: post.publishedAt
        ? post.publishedAt.toISOString()
        : post.updatedAt
        ? post.updatedAt.toISOString()
        : post.createdAt
        ? post.createdAt.toISOString()
        : null,
      createdAt: post.createdAt ? post.createdAt.toISOString() : null
    }))
  } catch (error) {
    console.error('Failed to fetch announcements during build:', error)
  }

  return {
    props: {
      posts: serialized,
      ...(await serverSideTranslations(locale ?? 'ko', ['common']))
    },
    revalidate: 10
  }
}

export default Announcements
