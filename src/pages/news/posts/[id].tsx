import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { ArrowLeft, Calendar, User } from 'lucide-react'
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
  const fontClass = i18n.language === 'ko' ? 'font-korean' : 'font-english'
  const router = useRouter()

  if (router.isFallback) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black"></div>
        </div>
      </Layout>
    )
  }

  if (!post) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className={`text-2xl font-bold text-gray-900 mb-4 ${fontClass}`}>
              {t('news:post_detail.not_found_title')}
            </h1>
            <Link href="/news/announcements" className={`text-blue-600 hover:text-blue-800 ${fontClass}`}>
              {t('news:post_detail.back_to_list')}
            </Link>
          </div>
        </div>
      </Layout>
    )
  }

  const displayDate = formatDisplayDate(post.publishedAt || post.createdAt, i18n.language)

  return (
    <Layout>
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/news/announcements" className={`inline-flex items-center text-white/80 hover:text-white transition-colors mb-6 ${fontClass}`}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('news:post_detail.back_to_list')}
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <span className={`text-xs px-3 py-1 rounded-full ${fontClass} ${
              post.type === 'announcement' ? 'bg-blue-500/20 text-blue-200' :
              post.type === 'event' ? 'bg-green-500/20 text-green-200' :
              'bg-gray-500/20 text-gray-200'
            }`}>
              {t(`news:post_types.${post.type}`)}
            </span>
          </div>

          <h1 className={`text-3xl md:text-4xl font-bold text-white mb-6 ${fontClass}`}>{post.title}</h1>

          <div className={`flex flex-wrap items-center gap-6 text-white/80 text-sm ${fontClass}`}>
            {post.authorName && (
              <div className="flex items-center">
                <User className="w-4 h-4 mr-1" />
                <span>{post.authorName}</span>
              </div>
            )}
            {displayDate && (
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                <span>{displayDate}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Cover Image */}
          {post.coverImageUrl && (
            <div className="w-full h-64 md:h-96 relative">
              <img
                src={post.coverImageUrl}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Article Content */}
          <div className="p-8 md:p-16 lg:p-20">
            <div className={`prose prose-xl max-w-none ${fontClass}`}>
              <div
                className="text-gray-800 leading-relaxed whitespace-pre-wrap text-lg md:text-xl"
                style={{ lineHeight: '2', letterSpacing: '0.02em' }}
              >
                {post.content}
              </div>
            </div>
          </div>

        </div>

        {/* Navigation */}
        <div className="mt-8 flex justify-center">
          <Link
            href="/news/announcements"
            className={`inline-flex items-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors ${fontClass}`}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('news:post_detail.back_to_list')}
          </Link>
        </div>
      </div>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params, locale }) => {
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
      authorName: post.authorName,
      publishedAt: post.publishedAt ? post.publishedAt.toISOString() : null,
      createdAt: post.createdAt ? post.createdAt.toISOString() : null
    }

    return {
      props: {
        post: serializedPost,
        ...(await serverSideTranslations(locale ?? 'ko', ['common', 'news']))
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
