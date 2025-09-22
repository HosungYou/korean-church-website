import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../../components/Layout'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
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
import { getPostById, updatePost, PostRecord } from '../../../utils/postService'

const formatDateTimeInput = (value?: Date | null): string => {
  if (!value) {
    return ''
  }
  const iso = value.toISOString()
  return iso.slice(0, 16)
}

const PostEditPage = () => {
  const router = useRouter()
  const { id } = router.query
  const [user, setUser] = useState<any>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [loadingPost, setLoadingPost] = useState(true)

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [type, setType] = useState<'announcement' | 'event' | 'general'>('announcement')
  const [status, setStatus] = useState<'draft' | 'published' | 'scheduled'>('draft')
  const [scheduledDate, setScheduledDate] = useState('')
  const [coverImageUrl, setCoverImageUrl] = useState('')
  const [sendNewsletter, setSendNewsletter] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const [existingPost, setExistingPost] = useState<PostRecord | null>(null)

  useEffect(() => {
    const adminLoggedIn = typeof window !== 'undefined' ? localStorage.getItem('adminLoggedIn') : null
    const adminUser = typeof window !== 'undefined' ? localStorage.getItem('adminUser') : null

    if (adminLoggedIn === 'true' && adminUser) {
      setUser(JSON.parse(adminUser))
    } else {
      router.push('/admin/login')
    }
    setAuthLoading(false)
  }, [router])

  useEffect(() => {
    if (!id || typeof id !== 'string') {
      return
    }

    const fetchPost = async () => {
      try {
        setLoadingPost(true)
        const post = await getPostById(id)
        if (!post) {
          alert('게시글을 찾을 수 없습니다.')
          router.push('/admin/posts')
          return
        }
        setExistingPost(post)
        setTitle(post.title)
        setContent(post.content)
        setType(post.type)
        setStatus(post.status)
        setCoverImageUrl(post.coverImageUrl ?? '')
        setScheduledDate(formatDateTimeInput(post.scheduledFor))
      } catch (error) {
        console.error('게시글 불러오기 오류:', error)
        alert('게시글을 불러오는 중 오류가 발생했습니다.')
        router.push('/admin/posts')
      } finally {
        setLoadingPost(false)
      }
    }

    fetchPost()
  }, [id, router])

  const previewData = useMemo(() => ({
    title: title || '제목 없음',
    content: content || '내용이 없습니다.'
  }), [title, content])

  const handleSave = async (nextStatus: 'draft' | 'published' | 'scheduled') => {
    if (!title || !content) {
      alert('제목과 내용을 모두 입력해주세요.')
      return
    }

    if (nextStatus === 'scheduled' && !scheduledDate) {
      alert('예약 게시를 위해서는 날짜를 선택해야 합니다.')
      return
    }

    if (!existingPost || typeof id !== 'string') {
      alert('게시글 정보가 로드되지 않았습니다.')
      return
    }

    setIsLoading(true)
    try {
      setStatus(nextStatus)

      await updatePost({
        id,
        title,
        content,
        type,
        status: nextStatus,
        authorEmail: user?.email ?? existingPost.authorEmail ?? null,
        authorName: user?.name ?? existingPost.authorName ?? user?.email ?? '관리자',
        coverImageUrl,
        scheduledFor: nextStatus === 'scheduled' ? scheduledDate : null,
        createdAt: existingPost.createdAt ?? undefined,
        publishedAt: existingPost.publishedAt ?? undefined
      })

      if (nextStatus === 'published' && sendNewsletter) {
        await sendNewsletterToSubscribers({
          title,
          content,
          publishedAt: new Date(),
          type
        })
      }

      alert('게시글이 업데이트되었습니다.')
      router.push('/admin/posts')
    } catch (error) {
      console.error('업데이트 오류:', error)
      alert('저장 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  if (authLoading || loadingPost) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black"></div>
        </div>
      </Layout>
    )
  }

  if (!user || !existingPost) {
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
                <h1 className="text-xl font-bold text-gray-900 font-korean">게시글 편집</h1>
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
              <div className="lg:col-span-3">
                <div className="bg-white shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    {!previewMode ? (
                      <div className="space-y-6">
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
                      <div className="prose max-w-none">
                        <div className="flex items-center mb-6">
                          <div className="w-3 h-3 bg-black rounded-full mr-4"></div>
                          <h1 className="text-2xl font-bold text-black font-korean m-0">{previewData.title}</h1>
                        </div>
                        <div className="whitespace-pre-wrap text-gray-700 font-korean">
                          {previewData.content}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="space-y-6">
                  <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex items-center mb-4">
                        <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900 font-korean">게시 설정</h3>
                      </div>

                      <div className="space-y-4">
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
                            <option value="published">게시됨</option>
                            <option value="scheduled">예약 게시</option>
                          </select>
                        </div>

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

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-3 mt-2"></div>
                      <div>
                        <h4 className="text-sm font-medium text-blue-900 font-korean">도움말</h4>
                        <div className="mt-2 text-sm text-blue-700 font-korean space-y-1">
                          <p>• 임시저장: 게시하지 않고 저장만 합니다.</p>
                          <p>• 게시됨: 즉시 웹사이트에 반영됩니다.</p>
                          <p>• 예약 게시: 지정한 시간에 자동 게시됩니다.</p>
                          <p>• 뉴스레터 발송: 구독자에게 이메일을 보냅니다.</p>
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

export default PostEditPage
