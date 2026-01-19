import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Link from 'next/link'
import { getPostById } from '../../../utils/postService'
import { useTranslation } from 'next-i18next'

interface SerializedPost {
  id: string
  title: string
  content: string
  type: 'announcement' | 'event' | 'general'
  excerpt?: string | null
  coverImageUrl?: string | null
  attachmentUrl?: string | null
  attachmentName?: string | null
  authorName?: string | null
  publishedAt?: string | null
  createdAt?: string | null
}

interface PostDetailPageProps {
  post: SerializedPost | null
}

const formatDisplayDate = (iso?: string | null, locale: string = 'ko'): string => {
  if (!iso) return ''
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''

  const formatter = new Intl.DateTimeFormat(locale === 'ko' ? 'ko-KR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return formatter.format(date)
}

const PostDetailPage = ({ post }: PostDetailPageProps) => {
  const { t, i18n } = useTranslation(['news', 'common'])
  const isKorean = i18n.language === 'ko'
  const router = useRouter()

  if (router.isFallback) {
    return (
      <Layout>
        <div
          className="min-h-screen flex items-center justify-center"
          style={{ background: 'oklch(0.985 0.003 75)' }}
        >
          <div
            className="w-12 h-12 rounded-full border-2 animate-spin"
            style={{
              borderColor: 'oklch(0.92 0.01 75)',
              borderTopColor: 'oklch(0.45 0.12 265)',
            }}
          />
        </div>
      </Layout>
    )
  }

  if (!post) {
    return (
      <Layout>
        <div
          className="min-h-screen flex items-center justify-center"
          style={{ background: 'oklch(0.985 0.003 75)' }}
        >
          <div className="text-center px-4">
            <div
              className="w-20 h-20 mx-auto mb-8 flex items-center justify-center rounded-full"
              style={{ background: 'oklch(0.95 0.01 75)' }}
            >
              <svg
                className="w-10 h-10"
                style={{ color: 'oklch(0.55 0.01 75)' }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1
              className="text-2xl font-bold mb-4"
              style={{ color: 'oklch(0.30 0.09 265)' }}
            >
              {isKorean ? '게시물을 찾을 수 없습니다' : 'Post not found'}
            </h1>
            <Link
              href="/announcements"
              className="inline-flex items-center px-6 py-3 text-sm font-semibold transition-all duration-300"
              style={{
                background: 'oklch(0.45 0.12 265)',
                color: 'oklch(0.98 0.01 75)',
                borderRadius: '2px',
              }}
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {isKorean ? '목록으로 돌아가기' : 'Back to list'}
            </Link>
          </div>
        </div>
      </Layout>
    )
  }

  const displayDate = formatDisplayDate(post.publishedAt || post.createdAt, i18n.language)

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'announcement':
        return isKorean ? '공지' : 'Notice'
      case 'event':
        return isKorean ? '행사' : 'Event'
      default:
        return isKorean ? '일반' : 'General'
    }
  }

  return (
    <Layout>
      {/* Hero Header */}
      <section
        className="relative min-h-[40vh] flex items-end"
        style={{
          background: 'linear-gradient(135deg, oklch(0.22 0.07 265), oklch(0.15 0.05 265))',
        }}
      >
        {/* Grain overlay */}
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
          {/* Back link */}
          <Link
            href="/announcements"
            className="inline-flex items-center mb-8 text-sm font-medium transition-all duration-300 group"
            style={{ color: 'oklch(0.85 0.02 75)' }}
          >
            <svg
              className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:-translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {isKorean ? '공지사항으로 돌아가기' : 'Back to announcements'}
          </Link>

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span
              className="text-xs font-medium px-3 py-1"
              style={{
                background: post.type === 'announcement'
                  ? 'oklch(0.45 0.12 265 / 0.3)'
                  : post.type === 'event'
                  ? 'oklch(0.72 0.10 75 / 0.3)'
                  : 'oklch(0.55 0.01 75 / 0.3)',
                color: 'oklch(0.98 0.01 75)',
                borderRadius: '1px',
              }}
            >
              {getTypeLabel(post.type)}
            </span>
            {displayDate && (
              <span
                className="text-sm"
                style={{ color: 'oklch(0.85 0.02 75)' }}
              >
                {displayDate}
              </span>
            )}
            {post.authorName && (
              <span
                className="text-sm flex items-center gap-2"
                style={{ color: 'oklch(0.85 0.02 75)' }}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {post.authorName}
              </span>
            )}
          </div>

          {/* Title */}
          <h1
            className="font-headline font-black"
            style={{
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
              color: 'oklch(0.98 0.01 75)',
            }}
          >
            {post.title}
          </h1>
        </div>

        {/* Decorative element */}
        <div
          className="absolute bottom-0 right-0 w-64 h-64 opacity-10"
          style={{
            background: 'radial-gradient(circle, oklch(0.72 0.10 75) 0%, transparent 70%)',
          }}
        />
      </section>

      {/* Content */}
      <section
        className="py-16 relative"
        style={{ background: 'oklch(0.985 0.003 75)' }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Content Card */}
          <article
            className="overflow-hidden"
            style={{
              background: 'oklch(0.99 0.003 75)',
              border: '1px solid oklch(0.92 0.01 75)',
              borderRadius: '2px',
            }}
          >
            {/* Cover Image */}
            {post.coverImageUrl && (
              <div className="relative w-full h-64 md:h-96 overflow-hidden">
                <img
                  src={post.coverImageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
                {/* Subtle gradient overlay */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(to bottom, transparent 60%, oklch(0.99 0.003 75 / 0.3))',
                  }}
                />
              </div>
            )}

            {/* Article Body */}
            <div className="p-8 md:p-12 lg:p-16">
              {/* Gold accent line */}
              <div
                className="h-0.5 w-16 mb-10"
                style={{ background: 'linear-gradient(90deg, oklch(0.72 0.10 75), oklch(0.45 0.12 265))' }}
              />

              {/* Content */}
              <div
                className="prose prose-lg max-w-none"
                style={{
                  color: 'oklch(0.40 0.02 75)',
                  lineHeight: '1.9',
                  letterSpacing: '0.01em',
                }}
              >
                <div
                  className="whitespace-pre-wrap text-base md:text-lg"
                  style={{
                    fontFamily: 'inherit',
                  }}
                >
                  {post.content}
                </div>
              </div>

              {/* Attachment */}
              {post.attachmentUrl && post.attachmentName && (
                <div
                  className="mt-12 pt-10"
                  style={{ borderTop: '1px solid oklch(0.92 0.01 75)' }}
                >
                  <h3
                    className="text-sm font-medium tracking-[0.1em] uppercase mb-4"
                    style={{ color: 'oklch(0.72 0.10 75)' }}
                  >
                    {isKorean ? '첨부파일' : 'Attachment'}
                  </h3>

                  <div
                    className="p-5 flex items-center justify-between"
                    style={{
                      background: 'oklch(0.97 0.005 265)',
                      borderRadius: '2px',
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 flex items-center justify-center"
                        style={{
                          background: 'oklch(0.45 0.12 265 / 0.1)',
                          borderRadius: '2px',
                        }}
                      >
                        <svg
                          className="w-6 h-6"
                          style={{ color: 'oklch(0.45 0.12 265)' }}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <p
                          className="font-medium"
                          style={{ color: 'oklch(0.30 0.09 265)' }}
                        >
                          {post.attachmentName}
                        </p>
                      </div>
                    </div>

                    <a
                      href={post.attachmentUrl}
                      download={post.attachmentName}
                      className="inline-flex items-center px-5 py-3 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5"
                      style={{
                        background: 'oklch(0.45 0.12 265)',
                        color: 'oklch(0.98 0.01 75)',
                        borderRadius: '2px',
                      }}
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      {isKorean ? '다운로드' : 'Download'}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </article>

          {/* Navigation */}
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/announcements"
              className="inline-flex items-center justify-center px-8 py-4 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5"
              style={{
                background: 'oklch(0.45 0.12 265)',
                color: 'oklch(0.98 0.01 75)',
                borderRadius: '2px',
              }}
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {isKorean ? '공지사항 목록' : 'All Announcements'}
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-8 py-4 text-sm font-semibold transition-all duration-300"
              style={{
                background: 'transparent',
                color: 'oklch(0.45 0.12 265)',
                border: '1px solid oklch(0.92 0.01 75)',
                borderRadius: '2px',
              }}
            >
              {isKorean ? '홈으로' : 'Home'}
            </Link>
          </div>
        </div>
      </section>

      {/* Related Links Section */}
      <section
        className="py-16 relative"
        style={{ background: 'oklch(0.97 0.005 265)' }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <div
              className="h-0.5 w-12 mb-6"
              style={{ background: 'linear-gradient(90deg, oklch(0.72 0.10 75), oklch(0.45 0.12 265))' }}
            />
            <h2
              className="text-xl font-bold"
              style={{ color: 'oklch(0.30 0.09 265)' }}
            >
              {isKorean ? '관련 페이지' : 'Related Pages'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { href: '/worship', label: isKorean ? '예배 안내' : 'Worship Info', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
              { href: '/news/bulletin', label: isKorean ? '주보' : 'Bulletin', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
              { href: '/about/directions', label: isKorean ? '오시는 길' : 'Directions', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group flex items-center gap-4 p-5 transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: 'oklch(0.99 0.003 75)',
                  border: '1px solid oklch(0.92 0.01 75)',
                  borderRadius: '2px',
                }}
              >
                <div
                  className="w-10 h-10 flex items-center justify-center flex-shrink-0"
                  style={{
                    background: 'oklch(0.45 0.12 265 / 0.1)',
                    borderRadius: '2px',
                  }}
                >
                  <svg
                    className="w-5 h-5"
                    style={{ color: 'oklch(0.45 0.12 265)' }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={link.icon} />
                  </svg>
                </div>
                <span
                  className="font-medium"
                  style={{ color: 'oklch(0.30 0.09 265)' }}
                >
                  {link.label}
                </span>
                <svg
                  className="w-4 h-4 ml-auto transition-transform duration-300 group-hover:translate-x-1"
                  style={{ color: 'oklch(0.72 0.10 75)' }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params, locale }) => {
  const currentLocale = locale ?? 'ko'
  const id = params?.id as string

  if (!id) {
    return {
      notFound: true
    }
  }

  try {
    const post = await getPostById(id)

    if (!post) {
      return {
        notFound: true
      }
    }

    const serializedPost: SerializedPost = {
      id: post.id,
      title: post.title,
      content: post.content,
      type: post.type,
      excerpt: post.excerpt,
      coverImageUrl: post.coverImageUrl,
      attachmentUrl: post.attachmentUrl ?? null,
      attachmentName: post.attachmentName ?? null,
      authorName: post.authorName,
      publishedAt: post.publishedAt ? post.publishedAt.toISOString() : null,
      createdAt: post.createdAt ? post.createdAt.toISOString() : null
    }

    return {
      props: {
        post: serializedPost,
        ...(await serverSideTranslations(currentLocale, ['common', 'news']))
      }
    }
  } catch (error) {
    console.error('Failed to fetch post:', error)
    return {
      notFound: true
    }
  }
}

export default PostDetailPage
