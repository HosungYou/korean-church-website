import type { GetStaticProps } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Layout from '@/components/Layout'
import { useState, useEffect } from 'react'
import { Download, Calendar, Search, Bell, ChevronRight, MapPin, Phone, Mail, Clock, FileText } from 'lucide-react'
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
  const [posts] = useState<SerializedPost[]>(initialPosts)
  const [searchTerm, setSearchTerm] = useState('')
  const [backgroundImage, setBackgroundImage] = useState('')

  useEffect(() => {
    const images = [
      '/images/community/community1.jpg',
      '/images/community/community2.jpg',
      '/images/community/community3.jpg',
      '/images/community/community4.jpg',
      '/images/community/community5.jpg',
      '/images/community/community6.jpg'
    ]
    const randomImage = images[Math.floor(Math.random() * images.length)]
    setBackgroundImage(randomImage)
  }, [])

  const filteredPosts = posts.filter((post) => {
    const lowerSearch = searchTerm.trim().toLowerCase()
    if (!lowerSearch) return true

    return (
      post.title.toLowerCase().includes(lowerSearch) ||
      (post.excerpt ?? '').toLowerCase().includes(lowerSearch) ||
      post.content.toLowerCase().includes(lowerSearch)
    )
  })

  const handlePostClick = (postId: string) => {
    router.push(`/news/posts/${postId}`)
  }

  const fontClass = i18n.language === 'ko' ? 'font-korean' : 'font-english'

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-72 bg-primary overflow-hidden">
        {backgroundImage && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 to-primary/95" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-center h-full">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-3 h-3 bg-secondary rounded-full mr-3" />
              <Bell className="w-8 h-8 text-secondary" />
              <div className="w-3 h-3 bg-secondary rounded-full ml-3" />
            </div>
            <h1 className={`text-4xl md:text-5xl font-serif font-bold text-white mb-4 ${fontClass}`}>
              {i18n.language === 'ko' ? '공지사항' : 'Announcements'}
            </h1>
            <p className={`text-xl text-gray-200 ${fontClass}`}>
              {i18n.language === 'ko' ? '교회 공지사항을 확인하세요' : 'Check our church announcements'}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-background min-h-screen">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Posts List */}
            <div className="lg:col-span-2">
              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder={i18n.language === 'ko' ? '공지사항 검색...' : 'Search announcements...'}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white shadow-sm ${fontClass}`}
                  />
                </div>
              </div>

              {/* Posts */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="px-6 py-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-secondary rounded-full mr-3" />
                      <h2 className={`text-lg font-serif font-semibold text-primary ${fontClass}`}>
                        {i18n.language === 'ko' ? '최신 공지' : 'Latest Announcements'}
                      </h2>
                    </div>
                    <span className={`text-sm text-gray-500 ${fontClass}`}>
                      {i18n.language === 'ko' ? `총 ${filteredPosts.length}건` : `${filteredPosts.length} posts`}
                    </span>
                  </div>
                </div>

                {filteredPosts.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className={`text-lg text-gray-900 mb-2 ${fontClass}`}>
                      {searchTerm
                        ? (i18n.language === 'ko' ? '검색 결과가 없습니다.' : 'No results found.')
                        : (i18n.language === 'ko' ? '등록된 공지사항이 없습니다.' : 'No announcements available.')
                      }
                    </p>
                    <p className={`text-sm text-gray-500 ${fontClass}`}>
                      {i18n.language === 'ko' ? '새로운 공지사항을 기다려주세요.' : 'Please wait for new announcements.'}
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {filteredPosts.map((post) => {
                      const displayDate = formatDisplayDate(post.publishedAt, i18n.language)
                      return (
                        <article
                          key={post.id}
                          className="p-6 hover:bg-gray-50 transition-colors cursor-pointer group"
                          onClick={() => handlePostClick(post.id)}
                        >
                          <div className="flex items-start gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-2">
                                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${fontClass} ${
                                  post.type === 'announcement'
                                    ? 'bg-primary/10 text-primary'
                                    : post.type === 'event'
                                    ? 'bg-secondary/20 text-secondary'
                                    : 'bg-gray-100 text-gray-700'
                                }`}>
                                  {post.type === 'announcement'
                                    ? (i18n.language === 'ko' ? '공지' : 'Notice')
                                    : post.type === 'event'
                                    ? (i18n.language === 'ko' ? '행사' : 'Event')
                                    : (i18n.language === 'ko' ? '일반' : 'General')
                                  }
                                </span>
                                {displayDate && (
                                  <div className={`flex items-center text-sm text-gray-500 ${fontClass}`}>
                                    <Calendar className="w-4 h-4 mr-1" />
                                    <span>{displayDate}</span>
                                  </div>
                                )}
                              </div>

                              <h3 className={`text-lg font-semibold text-primary mb-2 group-hover:text-secondary transition-colors ${fontClass}`}>
                                {post.title || '(제목 없음)'}
                              </h3>

                              {(post.excerpt || post.content) && (
                                <p className={`text-sm text-gray-600 line-clamp-2 ${fontClass}`}>
                                  {post.excerpt || post.content.slice(0, 140)}
                                </p>
                              )}

                              {post.attachmentUrl && post.attachmentName && (
                                <div className="mt-3">
                                  <a
                                    href={post.attachmentUrl}
                                    onClick={(e) => e.stopPropagation()}
                                    className={`inline-flex items-center px-3 py-1.5 bg-gray-100 rounded-md text-xs hover:bg-gray-200 transition-colors ${fontClass}`}
                                    download
                                  >
                                    <Download className="w-3 h-3 mr-1.5" />
                                    <span>{post.attachmentName}</span>
                                  </a>
                                </div>
                              )}
                            </div>

                            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-secondary transition-colors flex-shrink-0 mt-1" />
                          </div>
                        </article>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Church Info Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-primary px-6 py-4">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-secondary rounded-full mr-3" />
                    <h3 className={`text-lg font-serif font-semibold text-white ${fontClass}`}>
                      {i18n.language === 'ko' ? '교회 정보' : 'Church Info'}
                    </h3>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-secondary mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className={`text-sm font-medium text-primary ${fontClass}`}>
                        {i18n.language === 'ko' ? '주소' : 'Address'}
                      </p>
                      <p className={`text-sm text-gray-600 ${fontClass}`}>
                        758 Glenn Rd, State College, PA 16803
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Phone className="w-5 h-5 text-secondary mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className={`text-sm font-medium text-primary ${fontClass}`}>
                        {i18n.language === 'ko' ? '전화' : 'Phone'}
                      </p>
                      <p className={`text-sm text-gray-600 ${fontClass}`}>814-380-9393</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Mail className="w-5 h-5 text-secondary mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className={`text-sm font-medium text-primary ${fontClass}`}>
                        {i18n.language === 'ko' ? '이메일' : 'Email'}
                      </p>
                      <p className={`text-sm text-gray-600 ${fontClass}`}>KyuHongYeon@gmail.com</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Times Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-secondary rounded-full mr-3" />
                    <h3 className={`text-lg font-serif font-semibold text-primary ${fontClass}`}>
                      {i18n.language === 'ko' ? '예배 시간' : 'Service Times'}
                    </h3>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-secondary mr-2" />
                      <span className={`text-sm font-medium text-primary ${fontClass}`}>
                        {i18n.language === 'ko' ? '주일예배' : 'Sunday Service'}
                      </span>
                    </div>
                    <span className={`text-sm text-gray-600 ${fontClass}`}>
                      {i18n.language === 'ko' ? '오전 11:00' : '11:00 AM'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-secondary mr-2" />
                      <span className={`text-sm font-medium text-primary ${fontClass}`}>
                        {i18n.language === 'ko' ? '수요예배' : 'Wed. Service'}
                      </span>
                    </div>
                    <span className={`text-sm text-gray-600 ${fontClass}`}>
                      {i18n.language === 'ko' ? '오후 7:30' : '7:30 PM'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-secondary rounded-full mr-3" />
                    <h3 className={`text-lg font-serif font-semibold text-primary ${fontClass}`}>
                      {i18n.language === 'ko' ? '바로가기' : 'Quick Links'}
                    </h3>
                  </div>
                </div>
                <div className="p-4">
                  <div className="space-y-2">
                    <Link
                      href="/sermons-live"
                      className={`flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors ${fontClass}`}
                    >
                      <span className="text-sm text-gray-700">
                        {i18n.language === 'ko' ? '실시간 예배' : 'Live Service'}
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </Link>
                    <Link
                      href="/resources"
                      className={`flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors ${fontClass}`}
                    >
                      <span className="text-sm text-gray-700">
                        {i18n.language === 'ko' ? '자료실' : 'Resources'}
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </Link>
                    <Link
                      href="/giving"
                      className={`flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors ${fontClass}`}
                    >
                      <span className="text-sm text-gray-700">
                        {i18n.language === 'ko' ? '온라인 헌금' : 'Online Giving'}
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </Link>
                    <Link
                      href="/about/directions"
                      className={`flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors ${fontClass}`}
                    >
                      <span className="text-sm text-gray-700">
                        {i18n.language === 'ko' ? '오시는 길' : 'Directions'}
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Newsletter Signup */}
              <div className="bg-gradient-to-br from-primary to-primary-light rounded-lg shadow-sm overflow-hidden p-6">
                <div className="flex items-center mb-3">
                  <Bell className="w-5 h-5 text-secondary mr-2" />
                  <h3 className={`text-lg font-serif font-semibold text-white ${fontClass}`}>
                    {i18n.language === 'ko' ? '소식 받기' : 'Stay Updated'}
                  </h3>
                </div>
                <p className={`text-sm text-gray-300 mb-4 ${fontClass}`}>
                  {i18n.language === 'ko'
                    ? '교회 소식을 이메일로 받아보세요.'
                    : 'Get church updates via email.'
                  }
                </p>
                <Link
                  href="/about"
                  className={`inline-flex items-center px-4 py-2 bg-secondary text-primary rounded-md text-sm font-medium hover:bg-secondary-light transition-colors ${fontClass}`}
                >
                  {i18n.language === 'ko' ? '자세히 보기' : 'Learn More'}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
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
