import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useState, useEffect } from 'react'
import {
  Send,
  Users,
  Mail,
  CheckCircle,
  FileText,
  Clock,
  ArrowRight,
} from 'lucide-react'
import AdminLayout from '@/components/AdminLayout'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import {
  getActiveSubscribers,
  sendNewsletterToSubscribers,
  EmailSubscriber,
} from '../../utils/emailService'

// ===========================================
// VS Design Diverge: Newsletter Management
// Editorial Form + OKLCH Color System
// ===========================================

const NewsletterAdminPage = () => {
  const { admin } = useAdminAuth()
  const [subscribers, setSubscribers] = useState<EmailSubscriber[]>([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [type, setType] = useState<'announcement' | 'event' | 'general'>('announcement')
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)

  useEffect(() => {
    if (!admin) return
    loadSubscribers()
  }, [admin])

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
        type,
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

  const statsCards = [
    { name: '총 구독자', value: subscribers.length, icon: Users },
    { name: '활성 구독자', value: subscribers.length, icon: Mail },
  ]

  return (
    <AdminLayout title="뉴스레터 관리" subtitle="구독자에게 뉴스레터를 발송하세요">
      {/* Action Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <div
            className="h-0.5 w-8 mr-4"
            style={{
              background: 'linear-gradient(90deg, oklch(0.72 0.10 75), oklch(0.45 0.12 265))',
            }}
          />
          <span className="text-sm font-medium" style={{ color: 'oklch(0.55 0.01 75)' }}>
            뉴스레터 발송
          </span>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.name}
              className={`p-5 rounded-sm stagger-${index + 1}`}
              style={{
                background: 'oklch(0.985 0.003 75)',
                border: '1px solid oklch(0.92 0.005 75)',
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className="w-10 h-10 rounded-sm flex items-center justify-center"
                  style={{ background: 'oklch(0.45 0.12 265 / 0.1)' }}
                >
                  <Icon className="w-5 h-5" style={{ color: 'oklch(0.45 0.12 265)' }} />
                </div>
              </div>
              <p className="text-xs font-medium mb-1" style={{ color: 'oklch(0.55 0.01 75)' }}>
                {stat.name}
              </p>
              <span
                className="font-headline font-bold text-2xl"
                style={{ color: 'oklch(0.22 0.07 265)' }}
              >
                {stat.value}
              </span>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 구독자 현황 */}
        <div
          className="p-6 rounded-sm stagger-3"
          style={{
            background: 'oklch(0.985 0.003 75)',
            border: '1px solid oklch(0.92 0.005 75)',
          }}
        >
          <div className="flex items-center mb-6">
            <div
              className="h-0.5 w-6 mr-3"
              style={{ background: 'oklch(0.72 0.10 75)' }}
            />
            <h2
              className="font-headline font-bold text-lg"
              style={{ color: 'oklch(0.22 0.07 265)' }}
            >
              최근 구독자
            </h2>
          </div>

          <div className="space-y-3 max-h-64 overflow-y-auto">
            {subscribers.slice(0, 8).map((subscriber, index) => (
              <div
                key={subscriber.id || index}
                className="flex items-center p-3 rounded-sm transition-all duration-200"
                style={{
                  background: 'oklch(0.97 0.005 265)',
                  border: '1px solid oklch(0.92 0.01 265)',
                }}
              >
                <Mail className="w-4 h-4 mr-3" style={{ color: 'oklch(0.55 0.01 75)' }} />
                <span
                  className="text-sm truncate"
                  style={{ color: 'oklch(0.35 0.02 75)' }}
                >
                  {subscriber.email}
                </span>
              </div>
            ))}
            {subscribers.length === 0 && (
              <p className="text-sm text-center py-4" style={{ color: 'oklch(0.55 0.01 75)' }}>
                구독자가 없습니다
              </p>
            )}
          </div>
        </div>

        {/* 뉴스레터 작성 */}
        <div
          className="lg:col-span-2 p-6 rounded-sm stagger-4"
          style={{
            background: 'oklch(0.985 0.003 75)',
            border: '1px solid oklch(0.92 0.005 75)',
          }}
        >
          <div className="flex items-center mb-6">
            <div
              className="h-0.5 w-6 mr-3"
              style={{ background: 'oklch(0.72 0.10 75)' }}
            />
            <h2
              className="font-headline font-bold text-lg"
              style={{ color: 'oklch(0.22 0.07 265)' }}
            >
              뉴스레터 발송
            </h2>
          </div>

          {isSent && (
            <div
              className="mb-6 p-4 rounded-sm flex items-center"
              style={{
                background: 'oklch(0.55 0.15 145 / 0.1)',
                border: '1px solid oklch(0.55 0.15 145 / 0.3)',
              }}
            >
              <CheckCircle className="w-5 h-5 mr-3" style={{ color: 'oklch(0.40 0.15 145)' }} />
              <p style={{ color: 'oklch(0.35 0.10 145)' }}>
                뉴스레터가 성공적으로 발송되었습니다!
              </p>
            </div>
          )}

          <form onSubmit={handleSendNewsletter} className="space-y-5">
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: 'oklch(0.45 0.01 75)' }}
              >
                유형
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as 'announcement' | 'event' | 'general')}
                className="block w-full px-4 py-2.5 rounded-sm transition-all duration-200 focus:outline-none appearance-none cursor-pointer"
                style={{
                  background: 'oklch(0.97 0.005 265)',
                  border: '1px solid oklch(0.90 0.01 265)',
                  color: 'oklch(0.35 0.02 75)',
                }}
              >
                <option value="announcement">공지사항</option>
                <option value="event">행사 안내</option>
                <option value="general">일반 소식</option>
              </select>
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: 'oklch(0.45 0.01 75)' }}
              >
                제목
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="뉴스레터 제목을 입력해주세요"
                className="block w-full px-4 py-2.5 rounded-sm transition-all duration-200 focus:outline-none"
                style={{
                  background: 'oklch(0.97 0.005 265)',
                  border: '1px solid oklch(0.90 0.01 265)',
                  color: 'oklch(0.25 0.02 75)',
                }}
                required
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: 'oklch(0.45 0.01 75)' }}
              >
                내용
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="뉴스레터 내용을 입력해주세요"
                rows={8}
                className="block w-full px-4 py-3 rounded-sm transition-all duration-200 focus:outline-none resize-none"
                style={{
                  background: 'oklch(0.97 0.005 265)',
                  border: '1px solid oklch(0.90 0.01 265)',
                  color: 'oklch(0.25 0.02 75)',
                }}
                required
              />
            </div>

            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center" style={{ color: 'oklch(0.55 0.01 75)' }}>
                <Mail className="w-4 h-4 mr-2" />
                <span className="text-sm">{subscribers.length}명에게 발송됩니다</span>
              </div>

              <button
                type="submit"
                disabled={isLoading || subscribers.length === 0}
                className="inline-flex items-center px-6 py-2.5 rounded-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                style={{
                  background: 'oklch(0.45 0.12 265)',
                  color: 'oklch(0.98 0.003 75)',
                }}
              >
                {isLoading ? (
                  <>
                    <div
                      className="w-4 h-4 mr-2 rounded-full border-2 border-t-transparent animate-spin"
                      style={{ borderColor: 'oklch(0.98 0.003 75)', borderTopColor: 'transparent' }}
                    />
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

      {/* 사용 안내 */}
      <div
        className="mt-8 p-6 rounded-sm stagger-5"
        style={{
          background: 'oklch(0.97 0.005 265)',
          border: '1px solid oklch(0.92 0.01 265)',
        }}
      >
        <div className="flex items-center mb-6">
          <div
            className="h-0.5 w-6 mr-3"
            style={{ background: 'oklch(0.72 0.10 75)' }}
          />
          <h2
            className="font-headline font-bold text-lg"
            style={{ color: 'oklch(0.22 0.07 265)' }}
          >
            사용 안내
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start gap-3">
            <div
              className="w-8 h-8 rounded-sm flex items-center justify-center flex-shrink-0"
              style={{ background: 'oklch(0.45 0.12 265 / 0.1)' }}
            >
              <FileText className="w-4 h-4" style={{ color: 'oklch(0.45 0.12 265)' }} />
            </div>
            <div>
              <h3 className="font-semibold mb-1" style={{ color: 'oklch(0.30 0.02 75)' }}>
                자동 발송
              </h3>
              <p className="text-sm" style={{ color: 'oklch(0.55 0.01 75)' }}>
                새로운 공지사항을 작성하면 구독자들에게 자동으로 이메일이 발송됩니다.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div
              className="w-8 h-8 rounded-sm flex items-center justify-center flex-shrink-0"
              style={{ background: 'oklch(0.45 0.12 265 / 0.1)' }}
            >
              <Users className="w-4 h-4" style={{ color: 'oklch(0.45 0.12 265)' }} />
            </div>
            <div>
              <h3 className="font-semibold mb-1" style={{ color: 'oklch(0.30 0.02 75)' }}>
                구독자 관리
              </h3>
              <p className="text-sm" style={{ color: 'oklch(0.55 0.01 75)' }}>
                구독자 목록을 확인하고 관리할 수 있습니다. 구독 취소 요청도 처리 가능합니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'ko', ['common'])),
  },
})

export default NewsletterAdminPage
