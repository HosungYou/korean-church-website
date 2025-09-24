import type { GetStaticProps, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Layout from '@/components/Layout'
import { useState, useEffect } from 'react'
import { FileText, Calendar, BookOpen, Download } from 'lucide-react'

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

const Resources: NextPage = () => {
  const { t, i18n } = useTranslation(['common'])
  const [activeTab, setActiveTab] = useState('wednesday')
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  const categories = [
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

  const currentResources = posts

  return (
    <Layout>
      {/* Header Section */}
      <section className="bg-church-primary py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className={`text-4xl font-bold text-white text-center ${
            i18n.language === 'ko' ? 'font-korean' : 'font-english'
          }`}>
            {i18n.language === 'ko' ? '자료실' : 'Resources'}
          </h1>
          <p className={`mt-4 text-xl text-gray-100 text-center ${
            i18n.language === 'ko' ? 'font-korean' : 'font-english'
          }`}>
            {i18n.language === 'ko' ? '예배 자료와 성경통독 자료를 확인하세요' : 'Check our worship materials and bible resources'}
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

      {/* Resources List */}
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
          ) : currentResources.length === 0 ? (
            <div className="text-center py-12">
              <p className={`text-gray-500 ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                {i18n.language === 'ko' ? '등록된 자료가 없습니다.' : 'No resources available.'}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {currentResources.map((resource) => (
              <div
                key={resource.id}
                className="bg-white rounded-lg shadow-md border-l-4 border-church-primary p-6"
              >
                <div className="flex items-center justify-between mb-3">
                  <h2 className={`text-xl font-semibold text-gray-900 ${
                    i18n.language === 'ko' ? 'font-korean' : 'font-english'
                  }`}>
                    {resource.title}
                  </h2>
                  <span className="text-sm text-gray-500">
                    {new Date(resource.publishedAt).toLocaleDateString(i18n.language === 'ko' ? 'ko-KR' : 'en-US')}
                  </span>
                </div>
                <p className={`text-gray-700 ${
                  i18n.language === 'ko' ? 'font-korean' : 'font-english'
                }`}>
                  {resource.excerpt || resource.content.slice(0, 200) + (resource.content.length > 200 ? '...' : '')}
                </p>

                {/* File Attachments */}
                {resource.attachments && resource.attachments.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className={`text-sm font-medium text-gray-700 mb-2 ${
                      i18n.language === 'ko' ? 'font-korean' : 'font-english'
                    }`}>
                      {i18n.language === 'ko' ? '첨부파일' : 'Attachments'}
                    </p>
                    <div className="space-y-2">
                      {resource.attachments.map((file, index) => (
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

export default Resources