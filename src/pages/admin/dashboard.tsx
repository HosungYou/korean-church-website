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
  Plus,
  TrendingUp,
  Calendar,
  MessageSquare,
  LogOut,
  BookOpen,
  Megaphone,
  Video,
  Image,
  Newspaper,
  UserPlus,
  SlidersHorizontal,
  Church
} from 'lucide-react'
import Link from 'next/link'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import { getSermonStats } from '../../utils/sermonService'
import { getGalleryStats } from '../../utils/galleryService'
import { getSubscriberStats } from '../../utils/subscriberService'
import { getMemberStats } from '../../utils/memberService'

interface DashboardStats {
  sermons: number
  galleryAlbums: number
  galleryPhotos: number
  subscribers: number
  newFamilies: number
  members: number
}

const AdminDashboardPage = () => {
  const { admin, loading, signOut } = useAdminAuth()
  const [stats, setStats] = useState<DashboardStats>({
    sermons: 0,
    galleryAlbums: 0,
    galleryPhotos: 0,
    subscribers: 0,
    newFamilies: 0,
    members: 0
  })
  const [statsLoading, setStatsLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const [sermonStats, galleryStats, subscriberStats, memberStats] = await Promise.all([
          getSermonStats().catch(() => ({ total: 0 })),
          getGalleryStats().catch(() => ({ totalAlbums: 0, totalPhotos: 0 })),
          getSubscriberStats().catch(() => ({ active: 0 })),
          getMemberStats().catch(() => ({ active: 0 }))
        ])

        setStats({
          sermons: sermonStats.total || 0,
          galleryAlbums: galleryStats.totalAlbums || 0,
          galleryPhotos: galleryStats.totalPhotos || 0,
          subscribers: subscriberStats.active || 0,
          newFamilies: 0, // 새가족 통계는 별도로 구현
          members: memberStats.active || 0
        })
      } catch (error) {
        console.error('Error loading stats:', error)
      } finally {
        setStatsLoading(false)
      }
    }

    if (admin) {
      loadStats()
    }
  }, [admin])

  const handleLogout = async () => {
    await signOut()
  }

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </Layout>
    )
  }

  if (!admin) {
    return null
  }

  // 관리 메뉴 - 새로운 기능들 추가
  const menuItems = [
    {
      name: '대시보드',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
      current: true,
      description: '전체 현황'
    },
    {
      name: '슬라이더/배너',
      href: '/admin/slides',
      icon: SlidersHorizontal,
      current: false,
      description: '홈페이지 메인 슬라이더'
    },
    {
      name: '설교 관리',
      href: '/admin/sermons',
      icon: Video,
      current: false,
      description: '주일/수요 설교 영상'
    },
    {
      name: '갤러리 관리',
      href: '/admin/gallery',
      icon: Image,
      current: false,
      description: '사진첩 관리'
    },
    {
      name: '성경읽기표',
      href: '/admin/bible-reading',
      icon: BookOpen,
      current: false,
      description: '성경통독 계획'
    },
    {
      name: '주보 관리',
      href: '/admin/bulletins',
      icon: Newspaper,
      current: false,
      description: '주보 PDF 업로드'
    },
    {
      name: '게시글 관리',
      href: '/admin/posts',
      icon: FileText,
      current: false,
      description: '공지사항, 자료실'
    },
    {
      name: '새가족 관리',
      href: '/admin/new-families',
      icon: UserPlus,
      current: false,
      description: '새가족 등록 현황'
    },
    {
      name: '구독자 관리',
      href: '/admin/subscribers',
      icon: Mail,
      current: false,
      description: '이메일 구독자'
    },
    {
      name: '교인 관리',
      href: '/admin/members',
      icon: Church,
      current: false,
      description: '교회 구성원'
    },
    {
      name: '뉴스레터',
      href: '/admin/newsletter',
      icon: Mail,
      current: false,
      description: '뉴스레터 발송'
    },
    {
      name: '설정',
      href: '/admin/settings',
      icon: Settings,
      current: false,
      description: '시스템 설정'
    }
  ]

  // 빠른 작업
  const quickActions = [
    {
      name: '설교 등록',
      href: '/admin/sermons/new',
      icon: Video,
      color: 'bg-blue-600 hover:bg-blue-700',
      description: '새 설교 영상 추가'
    },
    {
      name: '갤러리 추가',
      href: '/admin/gallery/new',
      icon: Image,
      color: 'bg-green-600 hover:bg-green-700',
      description: '새 앨범 생성'
    },
    {
      name: '공지사항 작성',
      href: '/admin/posts/new?type=announcement',
      icon: Megaphone,
      color: 'bg-orange-600 hover:bg-orange-700',
      description: '공지사항 등록'
    },
    {
      name: '주보 업로드',
      href: '/admin/bulletins/new',
      icon: Newspaper,
      color: 'bg-purple-600 hover:bg-purple-700',
      description: '이번 주 주보'
    }
  ]

  // 통계 카드
  const statsCards = [
    {
      name: '설교 영상',
      value: stats.sermons,
      icon: Video,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      name: '갤러리 앨범',
      value: stats.galleryAlbums,
      icon: Image,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      subValue: `${stats.galleryPhotos}장`
    },
    {
      name: '활성 구독자',
      value: stats.subscribers,
      icon: Mail,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      name: '활성 교인',
      value: stats.members,
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
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
                <div className="w-3 h-3 bg-primary rounded-full mr-4"></div>
                <h1 className="text-xl font-bold text-gray-900 font-korean">관리자 대시보드</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700 font-korean">
                  안녕하세요, {admin?.email || admin?.name}님
                </span>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
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
              {statsCards.map((stat) => {
                const Icon = stat.icon
                return (
                  <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 p-3 rounded-lg ${stat.bgColor}`}>
                          <Icon className={`h-6 w-6 ${stat.color}`} />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate font-korean">
                              {stat.name}
                            </dt>
                            <dd className="flex items-baseline">
                              <span className="text-2xl font-semibold text-gray-900">
                                {statsLoading ? '-' : stat.value}
                              </span>
                              {stat.subValue && (
                                <span className="ml-2 text-sm text-gray-500">
                                  ({stat.subValue})
                                </span>
                              )}
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* 빠른 작업 */}
              <div className="lg:col-span-1">
                <div className="bg-white shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      <h3 className="text-lg leading-6 font-medium text-gray-900 font-korean">빠른 작업</h3>
                    </div>
                    <div className="space-y-3">
                      {quickActions.map((action) => {
                        const Icon = action.icon
                        return (
                          <Link
                            key={action.name}
                            href={action.href}
                            className={`${action.color} text-white p-4 rounded-lg flex items-center transition-colors group`}
                          >
                            <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                            <div>
                              <span className="font-korean font-medium block">{action.name}</span>
                              <span className="text-xs text-white/80">{action.description}</span>
                            </div>
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
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      <h3 className="text-lg leading-6 font-medium text-gray-900 font-korean">관리 메뉴</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {menuItems.map((item) => {
                        const Icon = item.icon
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            className={`${
                              item.current
                                ? 'bg-primary/10 border-primary text-primary'
                                : 'border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                            } border rounded-lg p-3 transition-colors group`}
                          >
                            <div className="flex items-center mb-1">
                              <Icon className={`h-5 w-5 mr-2 ${item.current ? 'text-primary' : 'text-gray-400 group-hover:text-gray-500'}`} />
                              <span className="font-korean font-medium text-sm">{item.name}</span>
                            </div>
                            <p className="text-xs text-gray-500 font-korean">{item.description}</p>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 최근 활동 & 알림 */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* 최근 활동 */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900 font-korean">최근 활동</h3>
                  </div>
                  <div className="flow-root">
                    <ul className="-mb-8">
                      <li>
                        <div className="relative pb-8">
                          <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                          <div className="relative flex space-x-3">
                            <div>
                              <span className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white">
                                <FileText className="w-4 h-4 text-white" />
                              </span>
                            </div>
                            <div className="min-w-0 flex-1 pt-1.5">
                              <p className="text-sm text-gray-500 font-korean">
                                시스템이 Supabase로 업그레이드되었습니다
                              </p>
                              <p className="text-xs text-gray-400">방금 전</p>
                            </div>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="relative pb-8">
                          <div className="relative flex space-x-3">
                            <div>
                              <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                                <Settings className="w-4 h-4 text-white" />
                              </span>
                            </div>
                            <div className="min-w-0 flex-1 pt-1.5">
                              <p className="text-sm text-gray-500 font-korean">
                                새로운 관리 기능이 추가되었습니다
                              </p>
                              <p className="text-xs text-gray-400">오늘</p>
                            </div>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 시스템 상태 */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900 font-korean">시스템 상태</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 font-korean">데이터베이스</span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        연결됨
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 font-korean">파일 저장소</span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        정상
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 font-korean">이메일 서비스</span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        설정 필요
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 font-korean">백엔드</span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Supabase
                      </span>
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

export default AdminDashboardPage
