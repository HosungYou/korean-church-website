import type { GetStaticProps, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Layout from '@/components/Layout'
import { useState, useEffect } from 'react'
import { FileText, Calendar, BookOpen, Megaphone, Download } from 'lucide-react'

interface Post {
  id: string
  title: string
  content: string
  type: string
  category: string
  excerpt?: string
  coverImageUrl?: string
  attachments?: Array<{name: string, url: string, size: string}>
  important?: boolean
  publishedAt: string
  createdAt: string
}

const Announcements: NextPage = () => {
  const { t, i18n } = useTranslation(['common'])
  const [activeTab, setActiveTab] = useState('general')
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  const categories = [
    { id: 'general', name: i18n.language === 'ko' ? '공지사항' : 'General', icon: Megaphone },
    { id: 'wednesday', name: i18n.language === 'ko' ? '수요예배 자료' : 'Wednesday Service', icon: Calendar },
    { id: 'sunday', name: i18n.language === 'ko' ? '주일예배 자료' : 'Sunday Service', icon: FileText },
    { id: 'bible', name: i18n.language === 'ko' ? '성경통독 자료' : 'Bible Reading', icon: BookOpen },
  ]


  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/posts/announcements?category=${activeTab}`)
        const data = await response.json()
        setPosts(data.posts || [])
      } catch (error) {
        console.error('Failed to fetch posts:', error)
        setPosts([])
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [activeTab])

  const currentAnnouncements = posts

  return (
    <Layout>
      {/* Header Section */}
      <section className="bg-church-primary py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className={`text-4xl font-bold text-white text-center ${
            i18n.language === 'ko' ? 'font-korean' : 'font-english'
          }`}>
            {i18n.language === 'ko' ? '교회 소식' : 'Church News'}
          </h1>
          <p className={`mt-4 text-xl text-gray-100 text-center ${
            i18n.language === 'ko' ? 'font-korean' : 'font-english'
          }`}>
            {i18n.language === 'ko' ? '교회 소식과 예배 자료를 확인하세요' : 'Check our church news and worship materials'}
          </p>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="bg-white border-b">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveTab(category.id)}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-t-lg transition-colors ${
                    activeTab === category.id
                      ? 'bg-church-primary text-white'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  } ${
                    i18n.language === 'ko' ? 'font-korean' : 'font-english'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {category.name}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Announcements List */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-church-primary mx-auto"></div>
              <p className={`mt-2 text-gray-500 ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                {i18n.language === 'ko' ? '로딩 중...' : 'Loading...'}
              </p>
            </div>
          ) : currentAnnouncements.length === 0 ? (
            <div className="text-center py-12">
              <p className={`text-gray-500 ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                {i18n.language === 'ko' ? '등록된 게시물이 없습니다.' : 'No posts available.'}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {currentAnnouncements.map((announcement) => (
              <div
                key={announcement.id}
                className={`bg-white rounded-lg shadow-md border-l-4 p-6 ${
                  announcement.important 
                    ? 'border-red-500 bg-red-50' 
                    : 'border-church-primary'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h2 className={`text-xl font-semibold text-gray-900 ${
                    i18n.language === 'ko' ? 'font-korean' : 'font-english'
                  }`}>
                    {announcement.title}
                    {announcement.important && (
                      <span className="ml-2 px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                        {i18n.language === 'ko' ? '중요' : 'Important'}
                      </span>
                    )}
                  </h2>
                  <span className="text-sm text-gray-500">
                    {new Date(announcement.publishedAt).toLocaleDateString(i18n.language === 'ko' ? 'ko-KR' : 'en-US')}
                  </span>
                </div>
                <p className={`text-gray-700 ${
                  i18n.language === 'ko' ? 'font-korean' : 'font-english'
                }`}>
                  {announcement.excerpt || announcement.content.slice(0, 200) + (announcement.content.length > 200 ? '...' : '')}
                </p>

                {/* File Attachments */}
                {announcement.attachments && announcement.attachments.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className={`text-sm font-medium text-gray-700 mb-2 ${
                      i18n.language === 'ko' ? 'font-korean' : 'font-english'
                    }`}>
                      {i18n.language === 'ko' ? '첨부파일' : 'Attachments'}
                    </p>
                    <div className="space-y-2">
                      {announcement.attachments.map((file, index) => (
                        <a
                          key={index}
                          href={file.url}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                          download
                        >
                          <div className="flex items-center">
                            <Download className="w-4 h-4 text-gray-500 mr-2" />
                            <span className={`text-sm text-gray-700 ${
                              i18n.language === 'ko' ? 'font-korean' : 'font-english'
                            }`}>
                              {file.name}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">{file.size}</span>
                        </a>
                      ))}
                    </div>
                  </div>
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

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'ko', ['common'])),
    },
  }
}

export default Announcements