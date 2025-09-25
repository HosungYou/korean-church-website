import type { GetStaticProps } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Layout from '@/components/Layout'
import { useState, useEffect } from 'react'
import { Download, Calendar, Search } from 'lucide-react'
import { useRouter } from 'next/router'
import { getPublishedAnnouncements, PostRecord } from '../utils/postService'

interface SerializedPost {
  id: string
  title: string
  content: string
  type: 'announcement' | 'event' | 'general'
  category?: string
  excerpt?: string | null
  coverImageUrl?: string | null
  attachments?: Array<{name: string, url: string, size: string}>
  important?: boolean
  publishedAt?: string | null
  createdAt?: string | null
}

interface AnnouncementsPageProps {
  posts: SerializedPost[]
}

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

const Announcements = ({ posts: initialPosts }: AnnouncementsPageProps) => {
  const { t, i18n } = useTranslation(['common'])
  const router = useRouter()
  const [posts, setPosts] = useState<SerializedPost[]>(initialPosts)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [backgroundImage, setBackgroundImage] = useState('')

  // 랜덤 배경 이미지 선택
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


  // 클라이언트 사이드에서 최신 데이터 가져오기
  useEffect(() => {
    const fetchLatestPosts = async () => {
      try {
        const response = await fetch('/api/posts/announcements?category=general')
        if (response.ok) {
          const data = await response.json()
          setPosts(data.posts || [])
        }
      } catch (error) {
        console.error('Failed to fetch latest announcements:', error)
      }
    }

    fetchLatestPosts()
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

  return (
    <Layout>
      {/* Header Section with Background */}
      <section className="relative h-64 bg-gray-900 overflow-hidden">
        {backgroundImage && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-60"
            style={{backgroundImage: `url(${backgroundImage})`}}
          ></div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-center h-full">
          <div className="text-center">
            <h1 className={`text-4xl md:text-5xl font-bold text-white mb-4 ${
              i18n.language === 'ko' ? 'font-korean' : 'font-english'
            }`}>
              {i18n.language === 'ko' ? '공지사항' : 'Announcements'}
            </h1>
            <p className={`text-xl text-gray-100 ${
              i18n.language === 'ko' ? 'font-korean' : 'font-english'
            }`}>
              {i18n.language === 'ko' ? '교회 공지사항을 확인하세요' : 'Check our church announcements'}
            </p>
          </div>
        </div>
      </section>


      {/* Search bar */}
      <section className="py-8 bg-white border-b">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder={i18n.language === 'ko' ? '공지사항 검색...' : 'Search announcements...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent ${
                  i18n.language === 'ko' ? 'font-korean' : 'font-english'
                }`}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Announcements List */}
      <section className="py-8 sm:py-12 lg:py-16 bg-gray-50 min-h-screen">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200">
            {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-church-primary mx-auto"></div>
              <p className={`mt-2 text-gray-500 ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                {i18n.language === 'ko' ? '로딩 중...' : 'Loading...'}
              </p>
            </div>
            ) : filteredPosts.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-gray-400" />
                </div>
                <p className={`text-lg text-gray-900 mb-2 ${
                  i18n.language === 'ko' ? 'font-korean' : 'font-english'
                }`}>
                  {i18n.language === 'ko' ? '등록된 공지사항이 없습니다.' : 'No announcements available.'}
                </p>
                <p className={`text-sm text-gray-500 ${
                  i18n.language === 'ko' ? 'font-korean' : 'font-english'
                }`}>
                  {i18n.language === 'ko' ? '새로운 공지사항을 기다려주세요.' : 'Please wait for new announcements.'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredPosts.map((post) => {
                  const displayDate = formatDisplayDate(post.publishedAt, i18n.language)
                  return (
                  <div
                    key={post.id}
                    className="p-4 sm:p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => handlePostClick(post.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`text-xs px-2 py-1 rounded ${
                            i18n.language === 'ko' ? 'font-korean' : 'font-english'
                          } ${
                            post.type === 'announcement' ? 'bg-blue-100 text-blue-700' :
                            post.type === 'event' ? 'bg-green-100 text-green-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {post.type === 'announcement' ? (i18n.language === 'ko' ? '공지' : 'Notice') :
                             post.type === 'event' ? (i18n.language === 'ko' ? '행사' : 'Event') :
                             (i18n.language === 'ko' ? '일반' : 'General')}
                          </span>
                          {displayDate && (
                            <div className={`flex items-center text-sm text-gray-500 ${
                              i18n.language === 'ko' ? 'font-korean' : 'font-english'
                            }`}>
                              <Calendar className="w-4 h-4 mr-1" />
                              <span>{displayDate}</span>
                            </div>
                          )}
                        </div>
                        <h3 className={`text-lg font-semibold text-gray-900 mb-1 ${
                          i18n.language === 'ko' ? 'font-korean' : 'font-english'
                        }`}>
                          {post.title}
                        </h3>
                        <p className={`text-sm text-gray-600 line-clamp-2 ${
                          i18n.language === 'ko' ? 'font-korean' : 'font-english'
                        }`}>
                          {post.excerpt || post.content.slice(0, 140)}
                        </p>

                        {/* File Attachments */}
                        {post.attachments && post.attachments.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {post.attachments.map((file, index) => (
                              <a
                                key={index}
                                href={file.url}
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center px-2 py-1 bg-gray-100 rounded text-xs hover:bg-gray-200 transition-colors"
                                download
                              >
                                <Download className="w-3 h-3 mr-1" />
                                <span className={`${
                                  i18n.language === 'ko' ? 'font-korean' : 'font-english'
                                }`}>
                                  {file.name}
                                </span>
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
                })}
              </div>
            )}
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
      category: 'general',
      content: post.content,
      excerpt: post.excerpt ?? null,
      coverImageUrl: post.coverImageUrl ?? null,
      attachments: [],
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