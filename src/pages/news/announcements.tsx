// ===========================================
// VS Design Diverge: Announcements Page
// OKLCH Color System + Editorial Minimalism
// ===========================================

import { useMemo, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import PageHeader from '@/components/PageHeader'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Mail, Bell, Search, Calendar, ArrowRight } from 'lucide-react'
import { addEmailSubscriber } from '../../utils/emailService'
import { getPublishedAnnouncements, PostRecord } from '../../utils/postService'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'

interface SerializedPost {
  id: string
  title: string
  type: 'announcement' | 'event' | 'general'
  content: string
  excerpt?: string | null
  coverImageUrl?: string | null
  publishedAt?: string | null
  createdAt?: string | null
}

interface AnnouncementsPageProps {
  posts: SerializedPost[]
}

type AnnouncementTab = 'all' | 'announcement' | 'event' | 'general'

const formatDisplayDate = (iso?: string | null, locale: string = 'ko'): string => {
  if (!iso) {
    return ''
  }
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) {
    return ''
  }

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

const AnnouncementsPage = ({ posts: initialPosts }: AnnouncementsPageProps) => {
  const { t, i18n } = useTranslation(['news', 'common'])
  const fontClass = i18n.language === 'ko' ? 'font-korean' : 'font-english'
  const router = useRouter()
  const [posts, setPosts] = useState<SerializedPost[]>(initialPosts)
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState<AnnouncementTab>('all')

  const serializePost = (post: PostRecord): SerializedPost => ({
    id: post.id,
    title: post.title,
    type: post.type,
    content: post.content,
    excerpt: post.excerpt ?? null,
    coverImageUrl: post.coverImageUrl ?? null,
    publishedAt: post.publishedAt
      ? post.publishedAt.toISOString()
      : post.updatedAt
      ? post.updatedAt.toISOString()
      : post.createdAt
      ? post.createdAt.toISOString()
      : null,
    createdAt: post.createdAt ? post.createdAt.toISOString() : null
  })

  // 클라이언트 사이드에서 최신 데이터 가져오기
  useEffect(() => {
    const fetchLatestPosts = async () => {
      try {
        const latest = await getPublishedAnnouncements(30)
        setPosts(latest.map(serializePost))
      } catch (error) {
        console.error('Failed to fetch latest announcements:', error)
      }
    }

    // Fetch newest data after page load
    fetchLatestPosts()
  }, [])

  const parsedPosts = useMemo(() =>
    posts.map((post) => ({
      ...post,
      excerpt: post.excerpt || post.content.slice(0, 140),
      publishedAt: post.publishedAt ?? post.createdAt ?? null
    })),
  [posts])

  const filteredPosts = useMemo(() => {
    const lowerSearch = searchTerm.trim().toLowerCase()

    return parsedPosts.filter((post) => {
      const typeMatch =
        activeTab === 'all' ||
        (activeTab === 'announcement' && post.type === 'announcement') ||
        (activeTab === 'event' && post.type === 'event') ||
        (activeTab === 'general' && post.type === 'general')

      const searchMatch =
        !lowerSearch ||
        post.title.toLowerCase().includes(lowerSearch) ||
        (post.excerpt ?? '').toLowerCase().includes(lowerSearch) ||
        post.content.toLowerCase().includes(lowerSearch)

      return typeMatch && searchMatch
    })
  }, [parsedPosts, activeTab, searchTerm])


  const handleSubscribe = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!email) {
      return
    }

    try {
      await addEmailSubscriber(email)
      setIsSubscribed(true)
      setEmail('')
      setTimeout(() => setIsSubscribed(false), 3000)
    } catch (error) {
      console.error('Subscription error:', error)
      alert(t('news:announcements.subscribe.error'))
    }
  }

  const handlePostClick = (postId: string) => {
    router.push(`/news/posts/${postId}`)
  }

  const tabOptions: { key: AnnouncementTab; label: string }[] = [
    { key: 'all', label: t('news:announcements.tabs.all') },
    { key: 'announcement', label: t('news:announcements.tabs.announcement') },
    { key: 'event', label: t('news:announcements.tabs.event') },
    { key: 'general', label: t('news:announcements.tabs.general') }
  ]

  return (
    <Layout>
      {/* Hero Header */}
      <PageHeader
        label="Church News"
        title={t('news:announcements.title')}
        subtitle="교회 소식과 행사 안내"
      />

      {/* Email Subscription Section */}
      <section className="py-12" style={{ background: 'oklch(0.97 0.005 75)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="p-8 rounded-sm"
            style={{
              background: 'oklch(0.985 0.003 75)',
              border: '1px solid oklch(0.92 0.005 75)',
              boxShadow: '0 4px 12px oklch(0.30 0.09 265 / 0.08)'
            }}
          >
            <div className="flex items-center mb-6">
              <div
                className="w-12 h-12 rounded-sm flex items-center justify-center mr-4"
                style={{ background: 'oklch(0.72 0.10 75 / 0.15)' }}
              >
                <Mail className="w-5 h-5" style={{ color: 'oklch(0.58 0.11 75)' }} />
              </div>
              <div>
                <h2
                  className={`text-xl font-bold ${fontClass}`}
                  style={{ color: 'oklch(0.25 0.05 265)' }}
                >
                  {t('news:announcements.subscribe.title')}
                </h2>
                <p className={`text-sm ${fontClass}`} style={{ color: 'oklch(0.55 0.01 75)' }}>
                  {t('news:announcements.subscribe.description')}
                </p>
              </div>
            </div>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('news:announcements.subscribe.placeholder') as string}
                className={`flex-1 px-4 py-3 rounded-sm transition-all duration-200 focus:outline-none ${fontClass}`}
                style={{
                  background: 'oklch(0.97 0.005 75)',
                  border: '1px solid oklch(0.90 0.01 75)',
                  color: 'oklch(0.25 0.05 265)'
                }}
                required
              />
              <button
                type="submit"
                className={`px-6 py-3 rounded-sm transition-all duration-300 hover:scale-105 flex items-center justify-center ${fontClass}`}
                style={{
                  background: 'oklch(0.45 0.12 265)',
                  color: 'oklch(0.98 0.003 75)'
                }}
              >
                <Bell className="w-4 h-4 mr-2" />
                {t('news:announcements.subscribe.button')}
              </button>
            </form>
            {isSubscribed && (
              <p className={`mt-4 text-sm ${fontClass}`} style={{ color: 'oklch(0.45 0.15 145)' }}>
                {t('news:announcements.subscribe.success')}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section
        className="py-8"
        style={{
          background: 'oklch(0.985 0.003 75)',
          borderBottom: '1px solid oklch(0.92 0.005 75)'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5"
                style={{ color: 'oklch(0.55 0.01 75)' }}
              />
              <input
                type="text"
                placeholder={t('news:announcements.search.placeholder') as string}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-12 pr-4 py-3 rounded-sm transition-all duration-200 focus:outline-none ${fontClass}`}
                style={{
                  background: 'oklch(0.97 0.005 75)',
                  border: '1px solid oklch(0.90 0.01 75)',
                  color: 'oklch(0.25 0.05 265)'
                }}
              />
            </div>

            {/* Tab Filter */}
            <div className="flex gap-2 flex-wrap">
              {tabOptions.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-2 rounded-sm text-sm font-medium transition-all duration-200 ${fontClass}`}
                  style={{
                    background: activeTab === tab.key
                      ? 'oklch(0.45 0.12 265)'
                      : 'oklch(0.97 0.005 75)',
                    color: activeTab === tab.key
                      ? 'oklch(0.98 0.003 75)'
                      : 'oklch(0.40 0.05 265)',
                    border: `1px solid ${activeTab === tab.key ? 'oklch(0.45 0.12 265)' : 'oklch(0.90 0.01 75)'}`
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Announcements List */}
      <section className="py-16" style={{ background: 'oklch(0.97 0.005 75)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Editorial Section Header */}
          <div className="mb-12">
            <div
              className="h-0.5 w-12 mb-6"
              style={{ background: 'linear-gradient(90deg, oklch(0.72 0.10 75), oklch(0.45 0.12 265))' }}
            />
            <div className="flex items-baseline gap-3">
              <h2
                className={`font-headline font-bold ${fontClass}`}
                style={{
                  fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                  letterSpacing: '-0.02em',
                  color: 'oklch(0.25 0.05 265)'
                }}
              >
                공지사항 목록
              </h2>
              <span style={{ color: 'oklch(0.55 0.01 75)' }}>
                ({filteredPosts.length}개)
              </span>
            </div>
          </div>

          {filteredPosts.length === 0 ? (
            <div
              className={`p-16 text-center rounded-sm ${fontClass}`}
              style={{
                background: 'oklch(0.985 0.003 75)',
                border: '1px solid oklch(0.92 0.005 75)',
                color: 'oklch(0.55 0.01 75)'
              }}
            >
              {t('news:announcements.empty')}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPosts.map((post, index) => {
                const displayDate = formatDisplayDate(post.publishedAt, i18n.language)
                const typeLabel = t(`news:post_types.${post.type}`)
                return (
                  <div
                    key={post.id}
                    className={`p-6 rounded-sm transition-all duration-300 hover:-translate-y-1 cursor-pointer stagger-${(index % 6) + 1}`}
                    style={{
                      background: 'oklch(0.985 0.003 75)',
                      border: '1px solid oklch(0.92 0.005 75)',
                      boxShadow: '0 2px 8px oklch(0.30 0.09 265 / 0.06)'
                    }}
                    onClick={() => handlePostClick(post.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span
                            className={`text-xs px-3 py-1 rounded-sm font-medium ${fontClass}`}
                            style={{
                              background: post.type === 'announcement'
                                ? 'oklch(0.45 0.12 265 / 0.1)'
                                : post.type === 'event'
                                ? 'oklch(0.72 0.10 75 / 0.9)'
                                : 'oklch(0.90 0.02 75)',
                              color: post.type === 'announcement'
                                ? 'oklch(0.45 0.12 265)'
                                : post.type === 'event'
                                ? 'oklch(0.15 0.05 265)'
                                : 'oklch(0.40 0.02 75)'
                            }}
                          >
                            {typeLabel}
                          </span>
                          {displayDate && (
                            <div
                              className={`flex items-center text-sm ${fontClass}`}
                              style={{ color: 'oklch(0.55 0.01 75)' }}
                            >
                              <Calendar className="w-4 h-4 mr-1" />
                              <span>{displayDate}</span>
                            </div>
                          )}
                        </div>
                        <h3
                          className={`text-xl font-bold mb-2 ${fontClass}`}
                          style={{ color: 'oklch(0.25 0.05 265)' }}
                        >
                          {post.title}
                        </h3>
                        <p
                          className={`text-sm line-clamp-2 ${fontClass}`}
                          style={{ color: 'oklch(0.55 0.01 75)' }}
                        >
                          {post.excerpt}
                        </p>
                      </div>
                      <ArrowRight
                        className="w-5 h-5 ml-4 flex-shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                        style={{ color: 'oklch(0.45 0.12 265)' }}
                      />
                    </div>
                  </div>
                )
              })}
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
              className={`font-headline font-bold ${fontClass}`}
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
              { href: '/news/bulletin', title: '주보', desc: '주일예배 주보 다운로드' },
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
                      className={`text-lg font-semibold ${fontClass}`}
                      style={{ color: 'oklch(0.25 0.05 265)' }}
                    >
                      {link.title}
                    </h3>
                  </div>
                  <p
                    className={`text-sm mb-4 ${fontClass}`}
                    style={{ color: 'oklch(0.55 0.01 75)' }}
                  >
                    {link.desc}
                  </p>
                  <div
                    className={`flex items-center text-sm font-medium ${fontClass}`}
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

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  let serialized: SerializedPost[] = []

  try {
    const announcementPosts = await getPublishedAnnouncements(30)
    serialized = announcementPosts.map((post: PostRecord) => ({
      id: post.id,
      title: post.title,
      type: post.type,
      content: post.content,
      excerpt: post.excerpt ?? null,
      coverImageUrl: post.coverImageUrl ?? null,
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
      ...(await serverSideTranslations(locale ?? 'ko', ['common', 'news']))
    },
    revalidate: 10 // Revalidate every 10 seconds for fresh data
  }
}

export default AnnouncementsPage
