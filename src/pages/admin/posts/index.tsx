import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Calendar,
  Tag,
  FileText,
  Clock,
  ArrowRight,
} from 'lucide-react'
import Link from 'next/link'
import AdminLayout from '@/components/AdminLayout'
import {
  deletePost,
  getPosts,
  PostRecord,
  PostStatus,
  PostType
} from '../../../utils/postService'
import { useAdminAuth } from '@/hooks/useAdminAuth'

// ===========================================
// VS Design Diverge: Posts Management
// Editorial Cards + OKLCH Color System
// ===========================================

const formatKoreanDate = (value?: Date | null): string => {
  if (!value) {
    return ''
  }
  const year = `${value.getFullYear()}`.slice(-2)
  const month = `${value.getMonth() + 1}`.padStart(2, '0')
  const day = `${value.getDate()}`.padStart(2, '0')
  return `${year}.${month}.${day}`
}

const AdminPostsPage = () => {
  const router = useRouter()
  const { admin } = useAdminAuth()
  const [posts, setPosts] = useState<PostRecord[]>([])
  const [listLoading, setListLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | PostType>('all')
  const [filterStatus, setFilterStatus] = useState<'all' | PostStatus>('all')
  const [filterCategory, setFilterCategory] = useState<'all' | 'general' | 'wednesday' | 'sunday' | 'bible'>('all')

  useEffect(() => {
    if (!admin) {
      return
    }

    const fetchPosts = async () => {
      try {
        setListLoading(true)
        const fetched = await getPosts({ limit: 100 })
        setPosts(fetched)
      } catch (error) {
        console.error('게시글 조회 오류:', error)
      } finally {
        setListLoading(false)
      }
    }

    fetchPosts()
  }, [admin])

  const handleDelete = async (id: string) => {
    if (!confirm('선택한 게시글을 삭제하시겠습니까?')) {
      return
    }

    try {
      await deletePost(id)
      setPosts((prev) => prev.filter((post) => post.id !== id))
    } catch (error) {
      console.error('삭제 오류:', error)
      alert(error instanceof Error ? error.message : '삭제 중 오류가 발생했습니다.')
    }
  }

  const filteredPosts = useMemo(() => {
    const lowerSearch = searchTerm.trim().toLowerCase()

    return posts.filter((post) => {
      const matchesSearch =
        !lowerSearch ||
        post.title.toLowerCase().includes(lowerSearch) ||
        post.content.toLowerCase().includes(lowerSearch) ||
        (post.excerpt ?? '').toLowerCase().includes(lowerSearch)

      const matchesType = filterType === 'all' || post.type === filterType
      const matchesStatus = filterStatus === 'all' || post.status === filterStatus
      const matchesCategory = filterCategory === 'all' || post.category === filterCategory

      return matchesSearch && matchesType && matchesStatus && matchesCategory
    })
  }, [posts, searchTerm, filterType, filterStatus, filterCategory])

  const stats = useMemo(() => {
    const total = posts.length
    const published = posts.filter((post) => post.status === 'published').length
    const drafts = posts.filter((post) => post.status === 'draft').length
    const scheduled = posts.filter((post) => post.status === 'scheduled').length

    return { totalPosts: total, published, drafts, scheduled }
  }, [posts])

  const statsCards = [
    {
      name: '총 게시글',
      value: stats.totalPosts,
      icon: FileText,
    },
    {
      name: '게시됨',
      value: stats.published,
      icon: Eye,
    },
    {
      name: '임시저장',
      value: stats.drafts,
      icon: Tag,
    },
    {
      name: '예약됨',
      value: stats.scheduled,
      icon: Clock,
    },
  ]

  const getStatusStyle = (status: PostStatus) => {
    switch (status) {
      case 'published':
        return {
          background: 'oklch(0.55 0.15 145 / 0.15)',
          color: 'oklch(0.45 0.15 145)',
        }
      case 'scheduled':
        return {
          background: 'oklch(0.55 0.12 265 / 0.15)',
          color: 'oklch(0.45 0.12 265)',
        }
      default:
        return {
          background: 'oklch(0.55 0.01 75 / 0.15)',
          color: 'oklch(0.45 0.01 75)',
        }
    }
  }

  const getTypeStyle = (type: PostType) => {
    switch (type) {
      case 'announcement':
        return {
          background: 'oklch(0.60 0.15 25 / 0.15)',
          color: 'oklch(0.50 0.15 25)',
        }
      case 'event':
        return {
          background: 'oklch(0.72 0.10 75 / 0.15)',
          color: 'oklch(0.55 0.12 75)',
        }
      default:
        return {
          background: 'oklch(0.45 0.12 265 / 0.15)',
          color: 'oklch(0.40 0.12 265)',
        }
    }
  }

  return (
    <AdminLayout title="게시글 관리" subtitle="공지사항 및 게시글을 관리하세요">
      {/* Action Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <div
            className="h-0.5 w-8 mr-4"
            style={{
              background: 'linear-gradient(90deg, oklch(0.72 0.10 75), oklch(0.45 0.12 265))',
            }}
          />
          <span
            className="text-sm font-medium"
            style={{ color: 'oklch(0.55 0.01 75)' }}
          >
            {filteredPosts.length}개의 게시글
          </span>
        </div>
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center px-5 py-2.5 rounded-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
          style={{
            background: 'oklch(0.45 0.12 265)',
            color: 'oklch(0.98 0.003 75)',
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          새 게시글
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
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
              <p
                className="text-xs font-medium mb-1"
                style={{ color: 'oklch(0.55 0.01 75)' }}
              >
                {stat.name}
              </p>
              <span
                className="font-headline font-bold text-2xl"
                style={{ color: 'oklch(0.22 0.07 265)' }}
              >
                {listLoading ? '—' : stat.value}
              </span>
            </div>
          )
        })}
      </div>

      {/* Search and Filters */}
      <div
        className="p-6 rounded-sm mb-6"
        style={{
          background: 'oklch(0.985 0.003 75)',
          border: '1px solid oklch(0.92 0.005 75)',
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Search Input */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
                style={{ color: 'oklch(0.50 0.01 75)' }}
              />
              <input
                type="text"
                placeholder="제목이나 내용으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-4 py-2.5 rounded-sm transition-all duration-200 focus:outline-none"
                style={{
                  background: 'oklch(0.97 0.005 265)',
                  border: '1px solid oklch(0.90 0.01 265)',
                  color: 'oklch(0.25 0.02 75)',
                }}
              />
            </div>
          </div>

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as 'all' | PostType)}
            className="block w-full px-3 py-2.5 rounded-sm transition-all duration-200 focus:outline-none appearance-none cursor-pointer"
            style={{
              background: 'oklch(0.97 0.005 265)',
              border: '1px solid oklch(0.90 0.01 265)',
              color: 'oklch(0.35 0.02 75)',
            }}
          >
            <option value="all">모든 유형</option>
            <option value="announcement">공지사항</option>
            <option value="event">행사</option>
            <option value="general">일반</option>
          </select>

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as 'all' | 'general' | 'wednesday' | 'sunday' | 'bible')}
            className="block w-full px-3 py-2.5 rounded-sm transition-all duration-200 focus:outline-none appearance-none cursor-pointer"
            style={{
              background: 'oklch(0.97 0.005 265)',
              border: '1px solid oklch(0.90 0.01 265)',
              color: 'oklch(0.35 0.02 75)',
            }}
          >
            <option value="all">모든 카테고리</option>
            <option value="general">공지사항</option>
            <option value="wednesday">수요예배 자료</option>
            <option value="sunday">주일예배 자료</option>
            <option value="bible">성경통독 자료</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as 'all' | PostStatus)}
            className="block w-full px-3 py-2.5 rounded-sm transition-all duration-200 focus:outline-none appearance-none cursor-pointer"
            style={{
              background: 'oklch(0.97 0.005 265)',
              border: '1px solid oklch(0.90 0.01 265)',
              color: 'oklch(0.35 0.02 75)',
            }}
          >
            <option value="all">모든 상태</option>
            <option value="published">게시됨</option>
            <option value="draft">임시저장</option>
            <option value="scheduled">예약됨</option>
          </select>
        </div>
      </div>

      {/* Posts List */}
      <div
        className="rounded-sm overflow-hidden"
        style={{
          background: 'oklch(0.985 0.003 75)',
          border: '1px solid oklch(0.92 0.005 75)',
        }}
      >
        {listLoading ? (
          <div className="p-12 flex flex-col items-center justify-center">
            <div
              className="w-10 h-10 rounded-sm mb-4 animate-pulse"
              style={{ background: 'oklch(0.45 0.12 265)' }}
            />
            <p
              className="text-sm font-medium"
              style={{ color: 'oklch(0.55 0.01 75)' }}
            >
              게시글 로딩 중...
            </p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="p-12 text-center">
            <div
              className="w-16 h-16 rounded-sm mx-auto mb-4 flex items-center justify-center"
              style={{ background: 'oklch(0.45 0.12 265 / 0.1)' }}
            >
              <FileText className="w-8 h-8" style={{ color: 'oklch(0.45 0.12 265)' }} />
            </div>
            <p
              className="text-sm font-medium mb-2"
              style={{ color: 'oklch(0.45 0.01 75)' }}
            >
              표시할 게시글이 없습니다
            </p>
            <p
              className="text-xs"
              style={{ color: 'oklch(0.55 0.01 75)' }}
            >
              새 게시글을 작성하거나 필터를 변경해보세요
            </p>
          </div>
        ) : (
          <div>
            {filteredPosts.map((post, index) => {
              const dateForDisplay = post.publishedAt || post.updatedAt || post.createdAt
              const statusStyle = getStatusStyle(post.status)
              const typeStyle = getTypeStyle(post.type)

              return (
                <div
                  key={post.id}
                  className={`p-6 transition-all duration-200 hover:translate-x-1 stagger-${(index % 6) + 1}`}
                  style={{
                    borderBottom: index < filteredPosts.length - 1 ? '1px solid oklch(0.92 0.005 75)' : 'none',
                  }}
                >
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1 min-w-0">
                      {/* Tags */}
                      <div className="flex items-center gap-2 mb-3">
                        <span
                          className="inline-flex items-center px-2.5 py-1 rounded-sm text-xs font-medium"
                          style={statusStyle}
                        >
                          {post.status === 'published' ? '게시됨' : post.status === 'scheduled' ? '예약됨' : '임시저장'}
                        </span>
                        <span
                          className="inline-flex items-center px-2.5 py-1 rounded-sm text-xs font-medium"
                          style={typeStyle}
                        >
                          {post.type === 'announcement' ? '공지사항' : post.type === 'event' ? '행사' : '일반'}
                        </span>
                      </div>

                      {/* Title */}
                      <h3
                        className="font-headline font-bold text-lg mb-2 line-clamp-1"
                        style={{ color: 'oklch(0.22 0.07 265)' }}
                      >
                        {post.title}
                      </h3>

                      {/* Excerpt */}
                      <p
                        className="text-sm line-clamp-2 mb-3"
                        style={{ color: 'oklch(0.50 0.01 75)' }}
                      >
                        {post.excerpt || post.content.slice(0, 140)}
                      </p>

                      {/* Meta */}
                      <div className="flex items-center gap-4">
                        <div className="flex items-center">
                          <Calendar
                            className="w-4 h-4 mr-1.5"
                            style={{ color: 'oklch(0.55 0.01 75)' }}
                          />
                          <span
                            className="text-xs"
                            style={{ color: 'oklch(0.55 0.01 75)' }}
                          >
                            {formatKoreanDate(dateForDisplay)}
                          </span>
                        </div>
                        <span
                          className="text-xs"
                          style={{ color: 'oklch(0.55 0.01 75)' }}
                        >
                          {post.authorName || post.authorEmail || '관리자'}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => router.push(`/admin/posts/${post.id}`)}
                        className="group inline-flex items-center px-4 py-2 rounded-sm font-medium text-sm transition-all duration-200 hover:-translate-y-0.5"
                        style={{
                          background: 'oklch(0.45 0.12 265)',
                          color: 'oklch(0.98 0.003 75)',
                        }}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        편집
                        <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="inline-flex items-center px-3 py-2 rounded-sm font-medium text-sm transition-all duration-200 hover:-translate-y-0.5"
                        style={{
                          background: 'oklch(0.55 0.18 25 / 0.1)',
                          color: 'oklch(0.50 0.18 25)',
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'ko', ['common'])),
  },
})

export default AdminPostsPage
