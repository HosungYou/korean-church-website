import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../../components/Layout'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
// Firebase 비활성화 - localStorage 기반 인증 사용
import { 
  Save, 
  Send, 
  Calendar,
  ArrowLeft,
  Eye,
  Upload,
  Image as ImageIcon
} from 'lucide-react'
import Link from 'next/link'
import { sendNewsletterToSubscribers } from '../../../utils/emailService'

const NewPostPage = () => {
  const router = useRouter()
  const { type: queryType } = router.query
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [type, setType] = useState<'announcement' | 'event' | 'general'>('announcement')
  const [status, setStatus] = useState<'draft' | 'published' | 'scheduled'>('draft')
  const [scheduledDate, setScheduledDate] = useState('')
  const [coverImageUrl, setCoverImageUrl] = useState('')
  const [sendNewsletter, setSendNewsletter] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)

  useEffect(() => {
    if (queryType && ['announcement', 'event', 'general'].includes(queryType as string)) {
      setType(queryType as 'announcement' | 'event' | 'general')
    }
  }, [queryType])

  useEffect(() => {
    // localStorage 기반 인증 체크
    const adminLoggedIn = localStorage.getItem('adminLoggedIn')
    const adminUser = localStorage.getItem('adminUser')
    
    if (adminLoggedIn === 'true' && adminUser) {
      setUser(JSON.parse(adminUser))
    } else {
      router.push('/admin/login')
    }
    setLoading(false)
  }, [router])

  const handleSave = async (publishStatus: 'draft' | 'published' | 'scheduled') => {
    if (!title || !content) {
      alert('제목과 내용을 모두 입력해주세요.')
      return
    }

    if (publishStatus === 'scheduled' && !scheduledDate) {
      alert('예약 게시를 위해서는 날짜를 선택해야 합니다.')
      return
    }

    setIsLoading(true)
    try {
      setStatus(publishStatus)

      const response = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          type,
          status: publishStatus,
          authorEmail: user?.email ?? null,
          authorName: user?.name ?? user?.email ?? '관리자',
          coverImageUrl,
          scheduledFor: publishStatus === 'scheduled' ? scheduledDate : null
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || errorData.error || '게시글 생성에 실패했습니다.')
      }

      const result = await response.json()
      const createdId = result.id

      if (publishStatus === 'published' && sendNewsletter) {
        await sendNewsletterToSubscribers({
          title,
          content,
          publishedAt: new Date(),
          type
        })
      }

      console.log('게시글 생성 완료:', createdId)
      alert('게시글이 저장되었습니다.')
      router.push('/admin/posts')
    } catch (error) {
      console.error('저장 오류:', error)
      if (error instanceof Error) {
        alert(`저장 중 오류가 발생했습니다: ${error.message}`)
      } else {
        alert('저장 중 알 수 없는 오류가 발생했습니다.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black"></div>
        </div>
      </Layout>
    )
  }

  if (!user) {
    return null
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Link href="/admin/posts" className="mr-4">
                  <ArrowLeft className="w-5 h-5 text-gray-600 hover:text-black transition-colors" />
                </Link>
                <div className="w-3 h-3 bg-black rounded-full mr-4"></div>
                <h1 className="text-xl font-bold text-gray-900 font-korean">새 게시글 작성</h1>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setPreviewMode(!previewMode)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  <span className="font-korean">{previewMode ? '편집' : '미리보기'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* 메인 편집기 */}
              <div className="lg:col-span-3">
                <div className="bg-white shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    {!previewMode ? (
                      <div className="space-y-6">
                        {/* 제목 */}
                        <div>
                          <label htmlFor="title" className="block text-sm font-medium text-gray-700 font-korean mb-2">
                            제목
                          </label>
                          <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="게시글 제목을 입력하세요"
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-lg font-korean"
                          />
                        </div>

                        {/* 표지 이미지 */}
                        <div>
                          <label htmlFor="cover-image" className="block text-sm font-medium text-gray-700 font-korean mb-2">
                            대표 이미지 URL (선택)
                          </label>
                          <input
                            type="url"
                            id="cover-image"
                            value={coverImageUrl}
                            onChange={(e) => setCoverImageUrl(e.target.value)}
                            placeholder="https://example.com/image.jpg"
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black font-korean"
                          />
                          {coverImageUrl ? (
                            <div
                              className="mt-3 h-40 rounded-md overflow-hidden border border-gray-200 bg-gray-100"
                              style={{ backgroundImage: `url(${coverImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                            />
                          ) : null}
                        </div>

                        {/* 내용 */}
                        <div>
                          <label htmlFor="content" className="block text-sm font-medium text-gray-700 font-korean mb-2">
                            내용
                          </label>
                          <textarea
                            id="content"
                            rows={20}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="게시글 내용을 입력하세요"
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black font-korean"
                          />
                        </div>

                        {/* 툴바 */}
                        <div className="border-t pt-4">
                          <div className="flex items-center space-x-4">
                            <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                              <ImageIcon className="w-4 h-4 mr-2" />
                              <span className="font-korean">이미지 추가</span>
                            </button>
                            <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                              <Upload className="w-4 h-4 mr-2" />
                              <span className="font-korean">파일 첨부</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* 미리보기 */
                      <div className="prose max-w-none">
                        <div className="flex items-center mb-6">
                          <div className="w-3 h-3 bg-black rounded-full mr-4"></div>
                          <h1 className="text-2xl font-bold text-black font-korean m-0">{title || '제목 없음'}</h1>
                        </div>
                        <div className="whitespace-pre-wrap text-gray-700 font-korean">
                          {content || '내용이 없습니다.'}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 사이드바 */}
              <div className="lg:col-span-1">
                <div className="space-y-6">
                  {/* 게시 설정 */}
                  <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex items-center mb-4">
                        <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900 font-korean">게시 설정</h3>
                      </div>

                      <div className="space-y-4">
                        {/* 게시글 유형 */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 font-korean mb-2">
                            게시글 유형
                          </label>
                          <select
                            value={type}
                            onChange={(e) => setType(e.target.value as 'announcement' | 'event' | 'general')}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-black focus:border-black font-korean"
                          >
                            <option value="announcement">공지사항</option>
                            <option value="event">행사</option>
                            <option value="general">일반</option>
                          </select>
                        </div>

                        {/* 게시 상태 */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 font-korean mb-2">
                            게시 상태
                          </label>
                          <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value as 'draft' | 'published' | 'scheduled')}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-black focus:border-black font-korean"
                          >
                            <option value="draft">임시저장</option>
                            <option value="published">즉시 게시</option>
                            <option value="scheduled">예약 게시</option>
                          </select>
                        </div>

                        {/* 예약 날짜 */}
                        {status === 'scheduled' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 font-korean mb-2">
                              예약 날짜
                            </label>
                            <input
                              type="datetime-local"
                              value={scheduledDate}
                              onChange={(e) => setScheduledDate(e.target.value)}
                              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-black focus:border-black"
                            />
                          </div>
                        )}

                        {/* 뉴스레터 발송 */}
                        <div className="flex items-center">
                          <input
                            id="newsletter"
                            type="checkbox"
                            checked={sendNewsletter}
                            onChange={(e) => setSendNewsletter(e.target.checked)}
                            className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                          />
                          <label htmlFor="newsletter" className="ml-2 block text-sm text-gray-900 font-korean">
                            뉴스레터 발송
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 액션 버튼 */}
                  <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="space-y-3">
                        <button
                          onClick={() => handleSave('draft')}
                          disabled={isLoading}
                          className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:bg-gray-100"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          <span className="font-korean">임시저장</span>
                        </button>

                        {status === 'scheduled' ? (
                          <button
                            onClick={() => handleSave('scheduled')}
                            disabled={isLoading || !scheduledDate}
                            className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
                          >
                            <Calendar className="w-4 h-4 mr-2" />
                            <span className="font-korean">예약 게시</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleSave('published')}
                            disabled={isLoading}
                            className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:bg-gray-400"
                          >
                            <Send className="w-4 h-4 mr-2" />
                            <span className="font-korean">게시하기</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 도움말 */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-3 mt-2"></div>
                      <div>
                        <h4 className="text-sm font-medium text-blue-900 font-korean">도움말</h4>
                        <div className="mt-2 text-sm text-blue-700 font-korean space-y-1">
                          <p>• 임시저장: 게시하지 않고 저장만 합니다</p>
                          <p>• 즉시 게시: 바로 웹사이트에 게시됩니다</p>
                          <p>• 예약 게시: 지정한 시간에 자동 게시됩니다</p>
                          <p>• 뉴스레터 발송: 구독자에게 이메일을 보냅니다</p>
                        </div>
                      </div>
                    </div>
                  </div>
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

export default NewPostPage
