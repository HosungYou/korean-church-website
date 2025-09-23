import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { ArrowLeft, Calendar, User } from 'lucide-react'
import Link from 'next/link'
import { getPostById, PostRecord } from '../../../utils/postService'

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

const formatDisplayDate = (iso?: string | null): string => {
  if (!iso) return ''
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''

  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  })
}

const PostDetailPage = ({ post }: PostDetailPageProps) => {
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
            <h1 className="text-2xl font-bold text-gray-900 font-korean mb-4">게시글을 찾을 수 없습니다</h1>
            <Link href="/news/announcements" className="text-blue-600 hover:text-blue-800 font-korean">
              교회소식으로 돌아가기
            </Link>
          </div>
        </div>
      </Layout>
    )
  }

  const displayDate = formatDisplayDate(post.publishedAt || post.createdAt)

  return (
    <Layout>
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/news/announcements" className="inline-flex items-center text-white/80 hover:text-white transition-colors mb-6 font-korean">
            <ArrowLeft className="w-4 h-4 mr-2" />
            교회소식으로 돌아가기
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <span className={`text-xs px-3 py-1 rounded-full font-korean ${
              post.type === 'announcement' ? 'bg-blue-500/20 text-blue-200' :
              post.type === 'event' ? 'bg-green-500/20 text-green-200' :
              'bg-gray-500/20 text-gray-200'
            }`}>
              {post.type === 'announcement' ? '공지사항' : post.type === 'event' ? '행사' : '일반'}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-white font-korean mb-6">{post.title}</h1>

          <div className="flex flex-wrap items-center gap-6 text-white/80 text-sm font-korean">
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
            <div className="prose prose-xl max-w-none font-korean">
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
            className="inline-flex items-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-korean"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            목록으로 돌아가기
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
        ...(await serverSideTranslations(locale ?? 'ko', ['common']))
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