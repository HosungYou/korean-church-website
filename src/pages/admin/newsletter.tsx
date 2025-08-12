import Layout from '@/components/Layout'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useState, useEffect } from 'react'
import { Send, Users, Mail, Calendar, CheckCircle } from 'lucide-react'
import { getActiveSubscribers, sendNewsletterToSubscribers, EmailSubscriber } from '../../utils/emailService'

const NewsletterAdminPage = () => {
  const [subscribers, setSubscribers] = useState<EmailSubscriber[]>([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [type, setType] = useState<'announcement' | 'event' | 'general'>('announcement')
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)

  useEffect(() => {
    loadSubscribers()
  }, [])

  const loadSubscribers = async () => {
    try {
      const activeSubscribers = await getActiveSubscribers()
      setSubscribers(activeSubscribers)
    } catch (error) {
      console.error('구독자 로딩 오류:', error)
    }
  }

  const handleSendNewsletter = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !content) {
      alert('제목과 내용을 모두 입력해주세요.')
      return
    }

    setIsLoading(true)
    try {
      await sendNewsletterToSubscribers({
        title,
        content,
        publishedAt: new Date(),
        type
      })
      
      setIsSent(true)
      setTitle('')
      setContent('')
      setTimeout(() => setIsSent(false), 5000)
    } catch (error) {
      console.error('뉴스레터 발송 오류:', error)
      alert('뉴스레터 발송 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Layout>
      <div className="relative h-64 bg-black">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-white rounded-full mr-4"></div>
            <h1 className="text-4xl font-bold text-white font-korean">뉴스레터 관리</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 구독자 현황 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-6">
                <div className="w-3 h-3 bg-black rounded-full mr-4"></div>
                <h2 className="text-xl font-bold text-black font-korean">구독자 현황</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <Users className="w-6 h-6 text-gray-600 mr-3" />
                  <div>
                    <p className="text-2xl font-bold text-black">{subscribers.length}</p>
                    <p className="text-sm text-gray-600 font-korean">총 구독자</p>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="font-semibold font-korean mb-3">최근 구독자</h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {subscribers.slice(0, 5).map((subscriber, index) => (
                      <div key={subscriber.id || index} className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-black rounded-full mr-2"></div>
                        <span className="text-sm text-gray-600 truncate">{subscriber.email}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 뉴스레터 작성 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-6">
                <div className="w-3 h-3 bg-black rounded-full mr-4"></div>
                <h2 className="text-xl font-bold text-black font-korean">뉴스레터 발송</h2>
              </div>

              {isSent && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    <p className="text-green-800 font-korean">뉴스레터가 성공적으로 발송되었습니다!</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSendNewsletter} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 font-korean mb-2">
                    유형
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as 'announcement' | 'event' | 'general')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent font-korean"
                  >
                    <option value="announcement">공지사항</option>
                    <option value="event">행사 안내</option>
                    <option value="general">일반 소식</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 font-korean mb-2">
                    제목
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="뉴스레터 제목을 입력해주세요"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent font-korean"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 font-korean mb-2">
                    내용
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="뉴스레터 내용을 입력해주세요"
                    rows={10}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent font-korean"
                    required
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-600">
                    <Mail className="w-4 h-4 mr-2" />
                    <span className="text-sm font-korean">{subscribers.length}명에게 발송됩니다</span>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isLoading || subscribers.length === 0}
                    className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-400 transition-colors font-korean flex items-center"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        발송 중...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        뉴스레터 발송
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* 사용 안내 */}
        <div className="mt-12 bg-gray-50 rounded-lg p-8">
          <div className="flex items-center mb-6">
            <div className="w-3 h-3 bg-black rounded-full mr-4"></div>
            <h2 className="text-xl font-bold text-black font-korean">사용 안내</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-start mb-3">
                <div className="w-2 h-2 bg-black rounded-full mr-3 mt-2"></div>
                <div>
                  <h3 className="font-semibold font-korean">자동 발송</h3>
                  <p className="text-sm text-gray-600 font-korean">
                    새로운 공지사항을 작성하면 구독자들에게 자동으로 이메일이 발송됩니다.
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex items-start mb-3">
                <div className="w-2 h-2 bg-black rounded-full mr-3 mt-2"></div>
                <div>
                  <h3 className="font-semibold font-korean">구독자 관리</h3>
                  <p className="text-sm text-gray-600 font-korean">
                    구독자 목록을 확인하고 관리할 수 있습니다. 구독 취소 요청도 처리 가능합니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'ko', ['common'])),
  },
})

export default NewsletterAdminPage