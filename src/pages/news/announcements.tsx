import { useMemo, useState } from 'react'
import Layout from '@/components/Layout'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Image from 'next/image'
import { Mail, Bell, Search, Calendar } from 'lucide-react'
import { addEmailSubscriber } from '../../utils/emailService'
import { getPublishedAnnouncements, PostRecord } from '../../utils/postService'

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

const formatDisplayDate = (iso?: string | null): string => {
  if (!iso) {
    return ''
  }
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) {
    return ''
  }
  const year = `${date.getFullYear()}`.slice(-2)
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}.${month}.${day}`
}

const coverFallback = '/images/feature-placeholder.svg'

const AnnouncementsPage = ({ posts }: AnnouncementsPageProps) => {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState<'전체' | '공지사항' | '행사' | '일반'>('전체')

  const parsedPosts = useMemo(() =>
    posts.map((post) => ({
      ...post,
      excerpt: post.excerpt || post.content.slice(0, 140),
      publishedAt: post.publishedAt ?? post.createdAt ?? null
    })),
  [posts])

  const featuredPosts = parsedPosts.slice(0, 3)

  const filteredPosts = useMemo(() => {
    const lowerSearch = searchTerm.trim().toLowerCase()

    return parsedPosts.filter((post) => {
      const typeMatch =
        activeTab === '전체' ||
        (activeTab === '공지사항' && post.type === 'announcement') ||
        (activeTab === '행사' && post.type === 'event') ||
        (activeTab === '일반' && post.type === 'general')

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
      console.error('구독 오류:', error)
      alert('구독 중 오류가 발생했습니다. 다시 시도해주세요.')
    }
  }

  return (
    <Layout>
      <div className="relative h-64 bg-black">
        <Image
          src="/images/news-header.jpg"
          alt="News"
          fill
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-white rounded-full mr-4"></div>
            <h1 className="text-4xl font-bold text-white font-korean">교회소식</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* 이메일 구독 섹션 */}
        <div className="mb-12 bg-gray-50 rounded-lg p-8">
          <div className="flex items-center mb-6">
            <div className="w-3 h-3 bg-black rounded-full mr-4"></div>
            <h2 className="text-2xl font-bold text-black font-korean">교회 소식 구독</h2>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <Mail className="w-6 h-6 text-gray-600 mr-3" />
              <p className="text-gray-700 font-korean">새로운 공지사항을 이메일로 받아보세요</p>
            </div>
            <form onSubmit={handleSubscribe} className="flex gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일 주소를 입력해주세요"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent font-korean"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-korean flex items-center"
              >
                <Bell className="w-4 h-4 mr-2" />
                구독하기
              </button>
            </form>
            {isSubscribed && (
              <p className="mt-4 text-green-600 font-korean">성공적으로 구독되었습니다!</p>
            )}
          </div>
        </div>

        {/* 대표 공지 */}
        {featuredPosts.length > 0 && (
          <div className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredPosts.map((post) => {
              const backgroundImage = post.coverImageUrl || coverFallback
              const displayDate = formatDisplayDate(post.publishedAt)

              return (
                <div key={post.id} className="relative h-80 rounded-xl overflow-hidden shadow-lg">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `url(${backgroundImage})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
                  <div className="relative h-full flex flex-col justify-end p-6 text-white">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs bg-white/20 backdrop-blur px-2 py-1 rounded font-korean">
                        {post.type === 'announcement' ? '공지사항' : post.type === 'event' ? '행사' : '일반'}
                      </span>
                      {displayDate && (
                        <div className="flex items-center text-xs text-white/80 font-korean">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>{displayDate}</span>
                        </div>
                      )}
                    </div>
                    <h3 className="text-2xl font-bold font-korean mb-2 line-clamp-2">{post.title}</h3>
                    <p className="text-sm text-white/80 font-korean line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* 검색 및 필터 */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="검색어를 입력해주세요"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent font-korean"
              />
            </div>
            <button className="px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
              <Search className="w-5 h-5" />
            </button>
          </div>

          <div className="flex border-b border-gray-200 flex-wrap">
            {(['전체', '공지사항', '행사', '일반'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-korean font-medium transition-colors ${
                  activeTab === tab
                    ? 'text-black border-b-2 border-black'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* 공지사항 목록 */}
        <div className="bg-white rounded-lg shadow-sm">
          {filteredPosts.length === 0 ? (
            <div className="p-12 text-center text-gray-500 font-korean">표시할 공지사항이 없습니다.</div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredPosts.slice(3).map((post) => {
                const displayDate = formatDisplayDate(post.publishedAt)
                return (
                  <div key={post.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center flex-1">
                        <div className="w-1.5 h-1.5 bg-black rounded-full mr-4"></div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-sm bg-gray-100 px-2 py-1 rounded font-korean">
                              {post.type === 'announcement' ? '공지사항' : post.type === 'event' ? '행사' : '일반'}
                            </span>
                            <h3 className="text-lg font-medium font-korean text-black">
                              {post.title}
                            </h3>
                          </div>
                          <p className="text-sm text-gray-500 font-korean line-clamp-2">{post.excerpt}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span className="text-sm">{displayDate}</span>
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
  const announcementPosts = await getPublishedAnnouncements(30)
  const serialized: SerializedPost[] = announcementPosts.map((post: PostRecord) => ({
    id: post.id,
    title: post.title,
    type: post.type,
    content: post.content,
    excerpt: post.excerpt ?? null,
    coverImageUrl: post.coverImageUrl ?? null,
    publishedAt: post.publishedAt ? post.publishedAt.toISOString() : post.updatedAt ? post.updatedAt.toISOString() : post.createdAt ? post.createdAt.toISOString() : null,
    createdAt: post.createdAt ? post.createdAt.toISOString() : null
  }))

  return {
    props: {
      posts: serialized,
      ...(await serverSideTranslations(locale ?? 'ko', ['common']))
    },
    revalidate: 60
  }
}

export default AnnouncementsPage
