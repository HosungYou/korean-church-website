// ===========================================
// VS Design Diverge: Post Editor
// Editorial Form + OKLCH Color System
// ===========================================

import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import {
  Save,
  Send,
  Calendar,
  ArrowLeft,
  Eye,
  EyeOff,
  Upload,
  Image as ImageIcon,
  FileText,
  X,
  Loader2,
  Mail,
  Clock,
  Tag,
} from 'lucide-react'
import Link from 'next/link'
import AdminLayout from '@/components/AdminLayout'
import { sendNewsletterToSubscribers } from '../../../utils/emailService'
import { createPost } from '../../../utils/postService'
import { FileUpload } from '../../../components/FileUpload'
import { UploadResult, deleteFile } from '../../../utils/fileUploadService'
import { useAdminAuth } from '@/hooks/useAdminAuth'

const CATEGORY_CONFIG = {
  general: { label: '공지사항', color: 'oklch(0.45 0.12 265)' },
  wednesday: { label: '수요예배 자료', color: 'oklch(0.55 0.15 145)' },
  sunday: { label: '주일예배 자료', color: 'oklch(0.60 0.18 25)' },
  bible: { label: '성경통독 자료', color: 'oklch(0.55 0.18 200)' },
}

const TYPE_CONFIG = {
  announcement: { label: '공지사항', color: 'oklch(0.45 0.12 265)' },
  event: { label: '행사', color: 'oklch(0.60 0.18 25)' },
  general: { label: '일반', color: 'oklch(0.72 0.10 75)' },
}

const NewPostPage = () => {
  const router = useRouter()
  const { admin, loading: authLoading } = useAdminAuth()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [type, setType] = useState<'announcement' | 'event' | 'general'>('announcement')
  const [category, setCategory] = useState<'general' | 'wednesday' | 'sunday' | 'bible'>('general')
  const [status, setStatus] = useState<'draft' | 'published' | 'scheduled'>('draft')
  const [scheduledDate, setScheduledDate] = useState('')
  const [coverImage, setCoverImage] = useState<{ url: string; fileName: string; path?: string } | null>(null)
  const [attachment, setAttachment] = useState<{ url: string; fileName: string; path?: string } | null>(null)
  const [sendNewsletter, setSendNewsletter] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)

  const handleCoverImageUpload = (result: UploadResult) => {
    setCoverImage({
      url: result.url,
      fileName: result.fileName,
      path: result.path
    })
  }

  const handleAttachmentUpload = (result: UploadResult) => {
    setAttachment({
      url: result.url,
      fileName: result.fileName,
      path: result.path
    })
  }

  const handleCoverImageRemove = () => {
    if (coverImage?.path) {
      deleteFile(coverImage.path).catch(console.error)
    }
    setCoverImage(null)
  }

  const handleAttachmentRemove = () => {
    if (attachment?.path) {
      deleteFile(attachment.path).catch(console.error)
    }
    setAttachment(null)
  }

  useEffect(() => {
    const { type: queryType, category: queryCategory } = router.query

    if (queryType && ['announcement', 'event', 'general'].includes(queryType as string)) {
      setType(queryType as 'announcement' | 'event' | 'general')
    }

    if (queryCategory && ['general', 'wednesday', 'sunday', 'bible'].includes(queryCategory as string)) {
      setCategory(queryCategory as 'general' | 'wednesday' | 'sunday' | 'bible')
    }
  }, [router.query])

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

      const createdId = await createPost({
        title,
        content,
        type,
        category,
        status: publishStatus,
        authorEmail: admin?.email ?? null,
        authorName: admin?.name ?? admin?.email ?? '관리자',
        coverImageUrl: coverImage?.url ?? null,
        attachmentUrl: attachment?.url ?? null,
        attachmentName: attachment?.fileName ?? null,
        scheduledFor: publishStatus === 'scheduled' ? scheduledDate : null
      })

      if (publishStatus === 'published' && sendNewsletter) {
        await sendNewsletterToSubscribers({
          title,
          content,
          publishedAt: new Date(),
          type
        })
      }

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

  if (authLoading) {
    return (
      <AdminLayout title="새 게시글" subtitle="로딩 중...">
        <div className="flex items-center justify-center py-20">
          <div
            className="w-12 h-12 rounded-sm animate-pulse"
            style={{ background: 'oklch(0.45 0.12 265)' }}
          />
        </div>
      </AdminLayout>
    )
  }

  if (!admin) return null

  return (
    <AdminLayout title="새 게시글 작성" subtitle="공지사항, 자료 등을 게시하세요">
      {/* Action Header */}
      <div className="flex justify-between items-center mb-8">
        <Link
          href="/admin/posts"
          className="inline-flex items-center text-sm font-medium transition-colors"
          style={{ color: 'oklch(0.55 0.01 75)' }}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          목록으로
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="inline-flex items-center px-4 py-2 rounded-sm font-medium text-sm transition-all duration-200 hover:-translate-y-0.5"
            style={{
              background: previewMode ? 'oklch(0.55 0.15 145 / 0.1)' : 'oklch(0.45 0.12 265 / 0.1)',
              color: previewMode ? 'oklch(0.40 0.15 145)' : 'oklch(0.45 0.12 265)',
              border: `1px solid ${previewMode ? 'oklch(0.55 0.15 145 / 0.3)' : 'oklch(0.45 0.12 265 / 0.3)'}`,
            }}
          >
            {previewMode ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            {previewMode ? '편집 모드' : '미리보기'}
          </button>
          <button
            onClick={() => handleSave('draft')}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 rounded-sm font-medium text-sm transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50"
            style={{
              background: 'oklch(0.97 0.005 265)',
              color: 'oklch(0.35 0.05 265)',
              border: '1px solid oklch(0.90 0.01 265)',
            }}
          >
            {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            임시저장
          </button>
          <button
            onClick={() => status === 'scheduled' ? handleSave('scheduled') : handleSave('published')}
            disabled={isLoading || (status === 'scheduled' && !scheduledDate)}
            className="inline-flex items-center px-5 py-2.5 rounded-sm font-medium text-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50"
            style={{
              background: status === 'scheduled' ? 'oklch(0.55 0.18 200)' : 'oklch(0.45 0.12 265)',
              color: 'oklch(0.98 0.003 75)',
            }}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : status === 'scheduled' ? (
              <Calendar className="w-4 h-4 mr-2" />
            ) : (
              <Send className="w-4 h-4 mr-2" />
            )}
            {status === 'scheduled' ? '예약 게시' : '게시하기'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Editor - Left Column */}
        <div className="lg:col-span-3 space-y-6">
          {!previewMode ? (
            <>
              {/* Title */}
              <div
                className="p-6 rounded-sm"
                style={{
                  background: 'oklch(0.985 0.003 75)',
                  border: '1px solid oklch(0.92 0.005 75)',
                }}
              >
                <label
                  className="block text-sm font-medium mb-3"
                  style={{ color: 'oklch(0.35 0.05 265)' }}
                >
                  <FileText className="w-4 h-4 inline mr-2" />
                  제목
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="게시글 제목을 입력하세요"
                  className="block w-full px-4 py-3 rounded-sm transition-all duration-200 focus:outline-none focus:ring-2 text-lg font-medium"
                  style={{
                    background: 'oklch(0.97 0.005 265)',
                    border: '1px solid oklch(0.90 0.01 265)',
                    color: 'oklch(0.22 0.07 265)',
                  }}
                />
              </div>

              {/* Cover Image */}
              <div
                className="p-6 rounded-sm"
                style={{
                  background: 'oklch(0.985 0.003 75)',
                  border: '1px solid oklch(0.92 0.005 75)',
                }}
              >
                <label
                  className="block text-sm font-medium mb-3"
                  style={{ color: 'oklch(0.35 0.05 265)' }}
                >
                  <ImageIcon className="w-4 h-4 inline mr-2" />
                  대표 이미지
                </label>
                <FileUpload
                  onUpload={handleCoverImageUpload}
                  onRemove={handleCoverImageRemove}
                  currentFile={coverImage}
                  isImage={true}
                  label=""
                  accept="image/*"
                  disabled={isLoading}
                />
              </div>

              {/* Attachment */}
              <div
                className="p-6 rounded-sm"
                style={{
                  background: 'oklch(0.985 0.003 75)',
                  border: '1px solid oklch(0.92 0.005 75)',
                }}
              >
                <label
                  className="block text-sm font-medium mb-3"
                  style={{ color: 'oklch(0.35 0.05 265)' }}
                >
                  <Upload className="w-4 h-4 inline mr-2" />
                  첨부파일
                </label>
                <FileUpload
                  onUpload={handleAttachmentUpload}
                  onRemove={handleAttachmentRemove}
                  currentFile={attachment}
                  isImage={false}
                  label=""
                  disabled={isLoading}
                />
              </div>

              {/* Content */}
              <div
                className="p-6 rounded-sm"
                style={{
                  background: 'oklch(0.985 0.003 75)',
                  border: '1px solid oklch(0.92 0.005 75)',
                }}
              >
                <label
                  className="block text-sm font-medium mb-3"
                  style={{ color: 'oklch(0.35 0.05 265)' }}
                >
                  내용
                </label>
                <textarea
                  rows={20}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="게시글 내용을 입력하세요"
                  className="block w-full px-4 py-3 rounded-sm transition-all duration-200 focus:outline-none resize-none leading-relaxed"
                  style={{
                    background: 'oklch(0.97 0.005 265)',
                    border: '1px solid oklch(0.90 0.01 265)',
                    color: 'oklch(0.25 0.02 75)',
                  }}
                />
              </div>
            </>
          ) : (
            /* Preview Mode */
            <div
              className="p-8 rounded-sm"
              style={{
                background: 'oklch(0.985 0.003 75)',
                border: '1px solid oklch(0.92 0.005 75)',
              }}
            >
              {/* Category Badge */}
              <div className="mb-6">
                <span
                  className="inline-flex items-center px-3 py-1.5 rounded-sm text-xs font-bold tracking-wider uppercase"
                  style={{
                    background: CATEGORY_CONFIG[category].color,
                    color: 'oklch(0.98 0.003 75)',
                  }}
                >
                  {CATEGORY_CONFIG[category].label}
                </span>
              </div>

              {/* Title */}
              <h1
                className="font-headline font-black mb-6"
                style={{
                  fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                  letterSpacing: '-0.02em',
                  color: 'oklch(0.22 0.07 265)',
                }}
              >
                {title || '제목 없음'}
              </h1>

              {/* Cover Image Preview */}
              {coverImage && (
                <div className="aspect-video rounded-sm overflow-hidden mb-8">
                  <img
                    src={coverImage.url}
                    alt="대표 이미지"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Content */}
              <div
                className="prose max-w-none whitespace-pre-wrap leading-relaxed"
                style={{ color: 'oklch(0.35 0.02 75)' }}
              >
                {content || '내용이 없습니다.'}
              </div>

              {/* Attachment Preview */}
              {attachment && (
                <div
                  className="mt-8 p-4 rounded-sm flex items-center gap-3"
                  style={{
                    background: 'oklch(0.97 0.005 265)',
                    border: '1px solid oklch(0.90 0.01 265)',
                  }}
                >
                  <FileText className="w-5 h-5" style={{ color: 'oklch(0.45 0.12 265)' }} />
                  <span style={{ color: 'oklch(0.35 0.05 265)' }}>{attachment.fileName}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar - Right Column */}
        <div className="lg:col-span-1 space-y-6">
          {/* Publish Settings */}
          <div
            className="p-6 rounded-sm"
            style={{
              background: 'oklch(0.985 0.003 75)',
              border: '1px solid oklch(0.92 0.005 75)',
            }}
          >
            <div className="flex items-center mb-5">
              <div
                className="h-0.5 w-8 mr-3"
                style={{ background: 'linear-gradient(90deg, oklch(0.72 0.10 75), oklch(0.45 0.12 265))' }}
              />
              <h3
                className="font-headline font-bold text-lg"
                style={{ color: 'oklch(0.22 0.07 265)' }}
              >
                게시 설정
              </h3>
            </div>

            <div className="space-y-5">
              {/* Category */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'oklch(0.35 0.05 265)' }}
                >
                  <Tag className="w-3.5 h-3.5 inline mr-1.5" />
                  카테고리
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as typeof category)}
                  className="block w-full px-3 py-2.5 rounded-sm transition-all duration-200 focus:outline-none cursor-pointer"
                  style={{
                    background: 'oklch(0.97 0.005 265)',
                    border: '1px solid oklch(0.90 0.01 265)',
                    color: 'oklch(0.25 0.02 75)',
                  }}
                >
                  {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                    <option key={key} value={key}>{config.label}</option>
                  ))}
                </select>
              </div>

              {/* Type */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'oklch(0.35 0.05 265)' }}
                >
                  게시글 유형
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(TYPE_CONFIG).map(([key, config]) => (
                    <button
                      key={key}
                      onClick={() => setType(key as typeof type)}
                      className="py-2 rounded-sm text-xs font-medium transition-all duration-200"
                      style={{
                        background: type === key ? config.color : 'oklch(0.97 0.005 265)',
                        color: type === key ? 'oklch(0.98 0.003 75)' : 'oklch(0.45 0.05 265)',
                        border: `1px solid ${type === key ? config.color : 'oklch(0.90 0.01 265)'}`,
                      }}
                    >
                      {config.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'oklch(0.35 0.05 265)' }}
                >
                  <Clock className="w-3.5 h-3.5 inline mr-1.5" />
                  게시 상태
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as typeof status)}
                  className="block w-full px-3 py-2.5 rounded-sm transition-all duration-200 focus:outline-none cursor-pointer"
                  style={{
                    background: 'oklch(0.97 0.005 265)',
                    border: '1px solid oklch(0.90 0.01 265)',
                    color: 'oklch(0.25 0.02 75)',
                  }}
                >
                  <option value="draft">임시저장</option>
                  <option value="published">즉시 게시</option>
                  <option value="scheduled">예약 게시</option>
                </select>
              </div>

              {/* Scheduled Date */}
              {status === 'scheduled' && (
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: 'oklch(0.35 0.05 265)' }}
                  >
                    <Calendar className="w-3.5 h-3.5 inline mr-1.5" />
                    예약 날짜
                  </label>
                  <input
                    type="datetime-local"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="block w-full px-3 py-2.5 rounded-sm transition-all duration-200 focus:outline-none"
                    style={{
                      background: 'oklch(0.97 0.005 265)',
                      border: '1px solid oklch(0.90 0.01 265)',
                      color: 'oklch(0.25 0.02 75)',
                    }}
                  />
                </div>
              )}

              {/* Newsletter */}
              <div
                className="flex items-center p-3 rounded-sm"
                style={{ background: 'oklch(0.97 0.005 265)' }}
              >
                <input
                  id="newsletter"
                  type="checkbox"
                  checked={sendNewsletter}
                  onChange={(e) => setSendNewsletter(e.target.checked)}
                  className="h-4 w-4 rounded-sm cursor-pointer"
                  style={{
                    accentColor: 'oklch(0.45 0.12 265)',
                  }}
                />
                <label
                  htmlFor="newsletter"
                  className="ml-3 flex items-center text-sm cursor-pointer"
                  style={{ color: 'oklch(0.35 0.05 265)' }}
                >
                  <Mail className="w-3.5 h-3.5 mr-1.5" />
                  뉴스레터 발송
                </label>
              </div>
            </div>
          </div>

          {/* Help */}
          <div
            className="p-5 rounded-sm"
            style={{
              background: 'oklch(0.45 0.12 265 / 0.05)',
              border: '1px solid oklch(0.45 0.12 265 / 0.15)',
            }}
          >
            <h4
              className="text-sm font-bold mb-3"
              style={{ color: 'oklch(0.35 0.10 265)' }}
            >
              도움말
            </h4>
            <div
              className="space-y-2 text-xs leading-relaxed"
              style={{ color: 'oklch(0.45 0.05 265)' }}
            >
              <p>• <strong>임시저장</strong>: 게시하지 않고 저장</p>
              <p>• <strong>즉시 게시</strong>: 바로 웹사이트에 공개</p>
              <p>• <strong>예약 게시</strong>: 지정 시간에 자동 게시</p>
              <p>• <strong>뉴스레터</strong>: 구독자에게 이메일 발송</p>
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

export default NewPostPage
