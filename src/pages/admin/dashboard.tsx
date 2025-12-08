import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import {
  LayoutDashboard,
  FileText,
  Mail,
  Users,
  Settings,
  Calendar,
  LogOut,
  BookOpen,
  Megaphone,
  ChevronRight,
  Plus
} from 'lucide-react'
import Link from 'next/link'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import { getPosts, PostRecord } from '@/utils/postService'
import { getSubscriberCount } from '@/utils/emailService'

interface DashboardStats {
  totalPosts: number
  publishedPosts: number
  draftPosts: number
  subscribers: number
}

const AdminDashboardPage = () => {
  const { admin, loading, signOut } = useAdminAuth()
  const [stats, setStats] = useState<DashboardStats>({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    subscribers: 0
  })
  const [recentPosts, setRecentPosts] = useState<PostRecord[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoadingData(true)

        // Fetch posts and subscriber count in parallel
        const [allPosts, subscriberCount] = await Promise.all([
          getPosts(),
          getSubscriberCount()
        ])

        const publishedPosts = allPosts.filter(p => p.status === 'published')
        const draftPosts = allPosts.filter(p => p.status === 'draft')

        setStats({
          totalPosts: allPosts.length,
          publishedPosts: publishedPosts.length,
          draftPosts: draftPosts.length,
          subscribers: subscriberCount
        })

        // Get 5 most recent posts
        setRecentPosts(allPosts.slice(0, 5))
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setIsLoadingData(false)
      }
    }

    if (admin) {
      fetchDashboardData()
    }
  }, [admin])

  const handleLogout = async () => {
    await signOut()
  }

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600 font-korean">로딩 중...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (!admin) {
    return null
  }

  const menuItems = [
    {
      name: '대시보드',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
      current: true
    },
    {
      name: '게시글 관리',
      href: '/admin/posts',
      icon: FileText,
      current: false
    },
    {
      name: '뉴스레터',
      href: '/admin/newsletter',
      icon: Mail,
      current: false
    },
    {
      name: '구독자 관리',
      href: '/admin/subscribers',
      icon: Users,
      current: false
    },
    {
      name: '설정',
      href: '/admin/settings',
      icon: Settings,
      current: false
    }
  ]

  const quickActions = [
    {
      name: '공지사항 작성',
      href: '/admin/posts/new?category=general',
      icon: Megaphone,
      color: 'bg-primary hover:bg-primary-light'
    },
    {
      name: '수요예배 자료',
      href: '/admin/posts/new?category=wednesday',
      icon: Calendar,
      color: 'bg-secondary hover:bg-secondary-light'
    },
    {
      name: '주일예배 자료',
      href: '/admin/posts/new?category=sunday',
      icon: FileText,
      color: 'bg-primary hover:bg-primary-light'
    },
    {
      name: '성경통독 자료',
      href: '/admin/posts/new?category=bible',
      icon: BookOpen,
      color: 'bg-secondary hover:bg-secondary-light'
    }
  ]

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return '-'
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(date))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 font-korean">게시됨</span>
      case 'draft':
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 font-korean">임시저장</span>
      case 'scheduled':
        return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 font-korean">예약됨</span>
      default:
        return null
    }
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-primary text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-secondary rounded-full mr-3"></div>
                <h1 className="text-xl font-serif font-bold">관리자 대시보드</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-300 font-korean">
                  {admin?.name || admin?.email}님
                </span>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-3 py-1.5 border border-white/20 text-sm font-medium rounded-md text-white hover:bg-white/10 transition-colors font-korean"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  로그아웃
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 font-korean">총 게시글</p>
                  <p className="text-2xl font-bold text-primary">
                    {isLoadingData ? '-' : stats.totalPosts}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 font-korean">게시된 글</p>
                  <p className="text-2xl font-bold text-green-600">
                    {isLoadingData ? '-' : stats.publishedPosts}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="p-3 bg-gray-100 rounded-lg">
                  <FileText className="h-6 w-6 text-gray-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 font-korean">임시저장</p>
                  <p className="text-2xl font-bold text-gray-600">
                    {isLoadingData ? '-' : stats.draftPosts}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="p-3 bg-secondary/20 rounded-lg">
                  <Users className="h-6 w-6 text-secondary" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 font-korean">뉴스레터 구독자</p>
                  <p className="text-2xl font-bold text-secondary">
                    {isLoadingData ? '-' : stats.subscribers}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Actions */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="px-6 py-4 border-b border-gray-100">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-secondary rounded-full mr-3"></div>
                    <h3 className="text-lg font-serif font-semibold text-primary">빠른 작업</h3>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  {quickActions.map((action) => {
                    const Icon = action.icon
                    return (
                      <Link
                        key={action.name}
                        href={action.href}
                        className={`${action.color} text-white p-3 rounded-lg flex items-center justify-between transition-colors group`}
                      >
                        <div className="flex items-center">
                          <Icon className="w-5 h-5 mr-3" />
                          <span className="font-korean">{action.name}</span>
                        </div>
                        <Plus className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    )
                  })}
                </div>
              </div>

              {/* Admin Menu */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 mt-6">
                <div className="px-6 py-4 border-b border-gray-100">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-secondary rounded-full mr-3"></div>
                    <h3 className="text-lg font-serif font-semibold text-primary">관리 메뉴</h3>
                  </div>
                </div>
                <div className="p-2">
                  {menuItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`${
                          item.current
                            ? 'bg-primary/5 text-primary border-l-2 border-secondary'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
                        } flex items-center justify-between px-4 py-3 text-sm font-medium rounded-r-md transition-colors`}
                      >
                        <div className="flex items-center">
                          <Icon className="mr-3 h-5 w-5" />
                          <span className="font-korean">{item.name}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 opacity-50" />
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Recent Posts */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-secondary rounded-full mr-3"></div>
                    <h3 className="text-lg font-serif font-semibold text-primary">최근 게시글</h3>
                  </div>
                  <Link
                    href="/admin/posts"
                    className="text-sm text-secondary hover:text-secondary-light font-korean flex items-center"
                  >
                    전체보기 <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
                <div className="divide-y divide-gray-100">
                  {isLoadingData ? (
                    <div className="p-8 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    </div>
                  ) : recentPosts.length === 0 ? (
                    <div className="p-8 text-center">
                      <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 font-korean">아직 게시글이 없습니다.</p>
                      <Link
                        href="/admin/posts/new"
                        className="mt-3 inline-flex items-center text-secondary hover:text-secondary-light font-korean"
                      >
                        <Plus className="w-4 h-4 mr-1" /> 첫 게시글 작성하기
                      </Link>
                    </div>
                  ) : (
                    recentPosts.map((post) => (
                      <Link
                        key={post.id}
                        href={`/admin/posts/${post.id}`}
                        className="block p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-primary truncate font-korean">
                              {post.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-1 font-korean">
                              {post.authorName || '관리자'} • {formatDate(post.createdAt)}
                            </p>
                          </div>
                          <div className="ml-4 flex-shrink-0">
                            {getStatusBadge(post.status)}
                          </div>
                        </div>
                        {post.excerpt && (
                          <p className="text-sm text-gray-600 mt-2 line-clamp-2 font-korean">
                            {post.excerpt}
                          </p>
                        )}
                      </Link>
                    ))
                  )}
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

export default AdminDashboardPage
