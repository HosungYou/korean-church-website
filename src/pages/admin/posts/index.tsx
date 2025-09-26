import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../../components/Layout'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Calendar,
  ArrowLeft,
  Tag,
  Loader2
} from 'lucide-react'
import Link from 'next/link'
import {
  deletePost,
  getPosts,
  PostRecord,
  PostStatus,
  PostType
} from '../../../utils/postService'

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
  const [user, setUser] = useState<any>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [posts, setPosts] = useState<PostRecord[]>([])
  const [listLoading, setListLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | PostType>('all')
  const [filterStatus, setFilterStatus] = useState<'all' | PostStatus>('all')
  const [filterCategory, setFilterCategory] = useState<'all' | 'general' | 'wednesday' | 'sunday' | 'bible'>('all')

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
    if (!user) {
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
  }, [user])

  const handleDelete = async (id: string) => {
    if (!confirm('선택한 게시글을 삭제하시겠습니까?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/posts?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || errorData.error || '게시글 삭제에 실패했습니다.')
      }

      setPosts((prev) => prev.filter((post) => post.id !== id))
      alert('게시글이 성공적으로 삭제되었습니다.')
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

    return {
      totalPosts: total,
      published,
      drafts,
      scheduled
    }
  }, [posts])

  if (authLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-black" />
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
                <Link href="/admin/dashboard" className="mr-4">
                  <ArrowLeft className="w-5 h-5 text-gray-600 hover:text-black transition-colors" />
                </Link>
                <div className="w-3 h-3 bg-black rounded-full mr-4"></div>
                <h1 className="text-xl font-bold text-gray-900 font-korean">게시글 관리</h1>
              </div>
              <Link
                href="/admin/posts/new"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
              >
                <Plus className="w-4 h-4 mr-2" />
                <span className="font-korean">새 게시글</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* 통계 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Eye className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate font-korean">총 게시글</dt>
                        <dd className="text-lg font-medium text-gray-900">{stats.totalPosts}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Calendar className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate font-korean">게시된 글</dt>
                        <dd className="text-lg font-medium text-gray-900">{stats.published}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Tag className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate font-korean">임시저장</dt>
                        <dd className="text-lg font-medium text-gray-900">{stats.drafts}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Calendar className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate font-korean">예약 게시</dt>
                        <dd className="text-lg font-medium text-gray-900">{stats.scheduled}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 검색 및 필터 */}
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="제목이나 내용으로 검색..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-black focus:border-black font-korean"
                    />
                  </div>
                </div>
                <div>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as 'all' | PostType)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-black focus:border-black font-korean"
                  >
                    <option value="all">모든 유형</option>
                    <option value="announcement">공지사항</option>
                    <option value="event">행사</option>
                    <option value="general">일반</option>
                  </select>
                </div>
                <div>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value as 'all' | 'general' | 'wednesday' | 'sunday' | 'bible')}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-black focus:border-black font-korean"
                  >
                    <option value="all">모든 카테고리</option>
                    <option value="general">공지사항</option>
                    <option value="wednesday">수요예배 자료</option>
                    <option value="sunday">주일예배 자료</option>
                    <option value="bible">성경통독 자료</option>
                  </select>
                </div>
                <div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as 'all' | PostStatus)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-black focus:border-black font-korean"
                  >
                    <option value="all">모든 상태</option>
                    <option value="published">게시됨</option>
                    <option value="draft">임시저장</option>
                    <option value="scheduled">예약됨</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 게시글 목록 */}
            <div className="bg-white shadow rounded-lg">
              {listLoading ? (
                <div className="p-12 flex justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-black" />
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className="p-12 text-center text-gray-500 font-korean">표시할 게시글이 없습니다.</div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredPosts.map((post) => {
                    const dateForDisplay = post.publishedAt || post.updatedAt || post.createdAt
                    return (
                      <div key={post.id} className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  post.status === 'published'
                                    ? 'bg-green-100 text-green-800'
                                    : post.status === 'scheduled'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {post.status === 'published' ? '게시됨' : post.status === 'scheduled' ? '예약됨' : '임시저장'}
                              </span>
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  post.type === 'announcement'
                                    ? 'bg-red-100 text-red-800'
                                    : post.type === 'event'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-purple-100 text-purple-800'
                                }`}
                              >
                                {post.type === 'announcement' ? '공지사항' : post.type === 'event' ? '행사' : '일반'}
                              </span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 font-korean mb-2">{post.title}</h3>
                            <p className="text-gray-600 text-sm font-korean line-clamp-3 mb-3">
                              {post.excerpt || post.content.slice(0, 140)}
                            </p>
                            <div className="flex items-center text-gray-400 text-sm font-korean gap-4">
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                <span>{formatKoreanDate(dateForDisplay)}</span>
                              </div>
                              <div>{post.authorName || post.authorEmail || '관리자'}</div>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <button
                              onClick={() => router.push(`/admin/posts/${post.id}`)}
                              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              <span className="font-korean">편집</span>
                            </button>
                            <button
                              onClick={() => handleDelete(post.id)}
                              className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              <span className="font-korean">삭제</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
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

export default AdminPostsPage
