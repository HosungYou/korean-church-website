import { useMemo, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Mail, Bell, Search, Calendar } from 'lucide-react'
import { addEmailSubscriber } from '../../utils/emailService'
import { getPublishedAnnouncements, PostRecord } from '../../utils/postService'
import { useTranslation } from 'next-i18next'

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

  // 클라이언트 사이드에서 최신 데이터 가져오기
  useEffect(() => {
    const fetchLatestPosts = async () => {
      try {
        const response = await fetch('/api/posts/announcements')
        if (response.ok) {
          const data = await response.json()
          setPosts(data.posts)
        }
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
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-white rounded-full mr-4"></div>
            <h1 className={`text-4xl font-bold text-white ${fontClass}`}>
              {t('news:announcements.title')}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Email subscription section */}
        <div className="mb-12 bg-gray-50 rounded-lg p-8">
          <div className="flex items-center mb-6">
            <div className="w-3 h-3 bg-black rounded-full mr-4"></div>
            <h2 className={`text-2xl font-bold text-black ${fontClass}`}>
              {t('news:announcements.subscribe.title')}
            </h2>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <Mail className="w-6 h-6 text-gray-600 mr-3" />
              <p className={`text-gray-700 ${fontClass}`}>
                {t('news:announcements.subscribe.description')}
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('news:announcements.subscribe.placeholder') as string}
                className={`flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent ${fontClass}`}
                required
              />
              <button
                type="submit"
                className={`px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center ${fontClass}`}
              >
                <Bell className="w-4 h-4 mr-2" />
                {t('news:announcements.subscribe.button')}
              </button>
            </form>
            {isSubscribed && (
              <p className={`mt-4 text-green-600 ${fontClass}`}>
                {t('news:announcements.subscribe.success')}
              </p>
            )}
          </div>
        </div>


        {/* Search and filter */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder={t('news:announcements.search.placeholder') as string}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent ${fontClass}`}
              />
            </div>
            <button
              className="px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              type="button"
              aria-label={t('news:announcements.search.button_label') as string}
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          <div className="flex border-b border-gray-200 flex-wrap">
            {tabOptions.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-6 py-3 ${fontClass} font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'text-black border-b-2 border-black'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 공지사항 목록 */}
        <div className="bg-white rounded-lg shadow-sm">
          {filteredPosts.length === 0 ? (
            <div className={`p-12 text-center text-gray-500 ${fontClass}`}>
              {t('news:announcements.empty')}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredPosts.map((post) => {
                const displayDate = formatDisplayDate(post.publishedAt, i18n.language)
                const typeLabel = t(`news:post_types.${post.type}`)
                return (
                  <div
                    key={post.id}
                    className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => handlePostClick(post.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`text-xs px-2 py-1 rounded ${fontClass} ${
                            post.type === 'announcement' ? 'bg-blue-100 text-blue-700' :
                            post.type === 'event' ? 'bg-green-100 text-green-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {typeLabel}
                          </span>
                          {displayDate && (
                            <div className={`flex items-center text-sm text-gray-500 ${fontClass}`}>
                              <Calendar className="w-4 h-4 mr-1" />
                              <span>{displayDate}</span>
                            </div>
                          )}
                        </div>
                        <h3 className={`text-lg font-semibold text-gray-900 mb-1 ${fontClass}`}>
                          {post.title}
                        </h3>
                        <p className={`text-sm text-gray-600 line-clamp-2 ${fontClass}`}>{post.excerpt}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
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
