import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
// Firebase 비활성화 - localStorage 기반 인증 사용
import {
  LayoutDashboard,
  FileText,
  Mail,
  Users,
  Settings,
  Plus,
  TrendingUp,
  Calendar,
  MessageSquare,
  LogOut,
  BookOpen,
  Megaphone
} from 'lucide-react'
import Link from 'next/link'
import { signOut } from 'firebase/auth'
import { auth } from '../../../lib/firebase'

const AdminDashboardPage = () => {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalPosts: 12,
    subscribers: 45,
    recentViews: 1234,
    pendingApprovals: 3
  })

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

  const handleLogout = async () => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem('adminLoggedIn')
        window.localStorage.removeItem('adminUser')
        window.dispatchEvent(new Event('admin-auth-changed'))
      }

      setUser(null)

      await signOut(auth)
    } catch (error) {
      console.error('로그아웃 오류:', error)
    } finally {
      router.push('/').catch((redirectError) => {
        console.error('홈으로 이동하지 못했습니다:', redirectError)
      })
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
      name: '댓글 관리',
      href: '/admin/comments',
      icon: MessageSquare,
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
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      name: '수요예배 자료',
      href: '/admin/posts/new?category=wednesday',
      icon: Calendar,
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      name: '주일예배 자료',
      href: '/admin/posts/new?category=sunday',
      icon: FileText,
      color: 'bg-orange-600 hover:bg-orange-700'
    },
    {
      name: '성경통독 자료',
      href: '/admin/posts/new?category=bible',
      icon: BookOpen,
      color: 'bg-purple-600 hover:bg-purple-700'
    }
  ]

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-black rounded-full mr-4"></div>
                <h1 className="text-xl font-bold text-gray-900 font-korean">관리자 대시보드</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700 font-korean">
                  안녕하세요, {user?.email || user?.name}님
                </span>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  <span className="font-korean">로그아웃</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* 통계 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <FileText className="h-6 w-6 text-gray-400" />
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
                      <Users className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate font-korean">구독자</dt>
                        <dd className="text-lg font-medium text-gray-900">{stats.subscribers}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <TrendingUp className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate font-korean">최근 조회수</dt>
                        <dd className="text-lg font-medium text-gray-900">{stats.recentViews}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <MessageSquare className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate font-korean">승인 대기</dt>
                        <dd className="text-lg font-medium text-gray-900">{stats.pendingApprovals}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* 빠른 작업 */}
              <div className="lg:col-span-1">
                <div className="bg-white shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
                      <h3 className="text-lg leading-6 font-medium text-gray-900 font-korean">빠른 작업</h3>
                    </div>
                    <div className="space-y-3">
                      {quickActions.map((action) => {
                        const Icon = action.icon
                        return (
                          <Link
                            key={action.name}
                            href={action.href}
                            className={`${action.color} text-white p-3 rounded-lg flex items-center transition-colors`}
                          >
                            <Icon className="w-5 h-5 mr-3" />
                            <span className="font-korean">{action.name}</span>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* 메뉴 네비게이션 */}
              <div className="lg:col-span-2">
                <div className="bg-white shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
                      <h3 className="text-lg leading-6 font-medium text-gray-900 font-korean">관리 메뉴</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {menuItems.map((item) => {
                        const Icon = item.icon
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            className={`${
                              item.current
                                ? 'bg-gray-100 text-gray-900'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            } group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors`}
                          >
                            <Icon className="text-gray-400 mr-3 h-6 w-6" />
                            <span className="font-korean">{item.name}</span>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 최근 활동 */}
            <div className="mt-8">
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900 font-korean">최근 활동</h3>
                  </div>
                  <div className="flow-root">
                    <ul className="-mb-8">
                      <li>
                        <div className="relative pb-8">
                          <div className="relative flex space-x-3">
                            <div>
                              <span className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white">
                                <FileText className="w-4 h-4 text-white" />
                              </span>
                            </div>
                            <div className="min-w-0 flex-1 pt-1.5">
                              <div>
                                <p className="text-sm text-gray-500 font-korean">
                                  새로운 공지사항이 게시되었습니다
                                </p>
                                <p className="text-xs text-gray-400">2시간 전</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="relative pb-8">
                          <div className="relative flex space-x-3">
                            <div>
                              <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                                <Mail className="w-4 h-4 text-white" />
                              </span>
                            </div>
                            <div className="min-w-0 flex-1 pt-1.5">
                              <div>
                                <p className="text-sm text-gray-500 font-korean">
                                  뉴스레터가 45명의 구독자에게 발송되었습니다
                                </p>
                                <p className="text-xs text-gray-400">5시간 전</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    </ul>
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

export default AdminDashboardPage