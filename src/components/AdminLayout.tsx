import React, { useState, ReactNode } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {
  LayoutDashboard,
  FileText,
  Mail,
  Users,
  Settings,
  LogOut,
  BookOpen,
  Video,
  Image,
  Newspaper,
  UserPlus,
  SlidersHorizontal,
  Church,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react'
import { useAdminAuth } from '@/hooks/useAdminAuth'

// ===========================================
// VS Design Diverge: Admin Editorial Layout
// Deep Indigo Sidebar + Paper-texture Content
// ===========================================

interface AdminLayoutProps {
  children: ReactNode
  title?: string
  subtitle?: string
}

const menuItems = [
  {
    name: '대시보드',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
    description: '전체 현황',
  },
  {
    name: '슬라이더/배너',
    href: '/admin/slides',
    icon: SlidersHorizontal,
    description: '홈페이지 메인 슬라이더',
  },
  {
    name: '설교 관리',
    href: '/admin/sermons',
    icon: Video,
    description: '주일/수요 설교 영상',
  },
  {
    name: '갤러리 관리',
    href: '/admin/gallery',
    icon: Image,
    description: '사진첩 관리',
  },
  {
    name: '성경읽기표',
    href: '/admin/bible-reading',
    icon: BookOpen,
    description: '성경통독 계획',
  },
  {
    name: '주보 관리',
    href: '/admin/bulletins',
    icon: Newspaper,
    description: '주보 PDF 업로드',
  },
  {
    name: '게시글 관리',
    href: '/admin/posts',
    icon: FileText,
    description: '공지사항, 자료실',
  },
  {
    name: '새가족 관리',
    href: '/admin/new-families',
    icon: UserPlus,
    description: '새가족 등록 현황',
  },
  {
    name: '구독자 관리',
    href: '/admin/subscribers',
    icon: Mail,
    description: '이메일 구독자',
  },
  {
    name: '교인 관리',
    href: '/admin/members',
    icon: Church,
    description: '교회 구성원',
  },
  {
    name: '뉴스레터',
    href: '/admin/newsletter',
    icon: Mail,
    description: '뉴스레터 발송',
  },
  {
    name: '관리자 관리',
    href: '/admin/admins',
    icon: Settings,
    description: '관리자 권한 설정',
  },
]

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title, subtitle }) => {
  const router = useRouter()
  const { admin, loading, signOut } = useAdminAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    await signOut()
  }

  // 로딩 상태
  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'oklch(0.97 0.005 265)' }}
      >
        <div className="text-center">
          <div
            className="w-12 h-12 rounded-sm mx-auto mb-4 animate-pulse"
            style={{ background: 'oklch(0.45 0.12 265)' }}
          />
          <p
            className="text-sm font-medium"
            style={{ color: 'oklch(0.55 0.01 75)' }}
          >
            로딩 중...
          </p>
        </div>
      </div>
    )
  }

  // 미인증 상태
  if (!admin) {
    return null
  }

  return (
    <div
      className="min-h-screen flex"
      style={{ background: 'oklch(0.97 0.005 265)' }}
    >
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        </div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ background: 'oklch(0.15 0.05 265)' }}
      >
        {/* Sidebar Header */}
        <div
          className="h-16 flex items-center justify-between px-6"
          style={{ borderBottom: '1px solid oklch(0.25 0.06 265)' }}
        >
          <Link href="/admin/dashboard" className="flex items-center space-x-3">
            <div
              className="w-8 h-8 rounded-sm flex items-center justify-center"
              style={{ background: 'oklch(0.72 0.10 75)' }}
            >
              <Church className="w-5 h-5" style={{ color: 'oklch(0.15 0.05 265)' }} />
            </div>
            <span
              className="font-headline font-bold text-lg"
              style={{ color: 'oklch(0.98 0.003 75)' }}
            >
              SCKC Admin
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-sm transition-colors"
            style={{ color: 'oklch(0.70 0.01 75)' }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Gold accent line */}
        <div
          className="h-0.5"
          style={{
            background: 'linear-gradient(90deg, oklch(0.72 0.10 75), transparent)',
          }}
        />

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-4">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = router.pathname === item.href || router.pathname.startsWith(item.href + '/')

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-4 py-3 rounded-sm transition-all duration-200 ${
                    isActive ? '' : 'hover:translate-x-1'
                  }`}
                  style={{
                    background: isActive ? 'oklch(0.25 0.06 265)' : 'transparent',
                  }}
                >
                  <Icon
                    className="w-5 h-5 mr-3 flex-shrink-0 transition-colors"
                    style={{
                      color: isActive ? 'oklch(0.72 0.10 75)' : 'oklch(0.55 0.01 75)',
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <span
                      className="block text-sm font-medium truncate transition-colors"
                      style={{
                        color: isActive ? 'oklch(0.98 0.003 75)' : 'oklch(0.75 0.01 75)',
                      }}
                    >
                      {item.name}
                    </span>
                    <span
                      className="block text-xs truncate"
                      style={{ color: 'oklch(0.50 0.01 75)' }}
                    >
                      {item.description}
                    </span>
                  </div>
                  {isActive && (
                    <ChevronRight
                      className="w-4 h-4"
                      style={{ color: 'oklch(0.72 0.10 75)' }}
                    />
                  )}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* User section */}
        <div
          className="p-4"
          style={{ borderTop: '1px solid oklch(0.25 0.06 265)' }}
        >
          <div className="flex items-center mb-4 px-2">
            <div
              className="w-10 h-10 rounded-sm flex items-center justify-center mr-3"
              style={{ background: 'oklch(0.30 0.09 265)' }}
            >
              <Users className="w-5 h-5" style={{ color: 'oklch(0.72 0.10 75)' }} />
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-medium truncate"
                style={{ color: 'oklch(0.98 0.003 75)' }}
              >
                {admin?.name || '관리자'}
              </p>
              <p
                className="text-xs truncate"
                style={{ color: 'oklch(0.55 0.01 75)' }}
              >
                {admin?.email}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-2.5 rounded-sm transition-all duration-200 hover:translate-y-[-1px]"
            style={{
              background: 'oklch(0.25 0.06 265)',
              color: 'oklch(0.80 0.01 75)',
            }}
          >
            <LogOut className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">로그아웃</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top header */}
        <header
          className="h-16 flex items-center justify-between px-6 lg:px-8"
          style={{
            background: 'oklch(0.985 0.003 75)',
            borderBottom: '1px solid oklch(0.92 0.005 75)',
          }}
        >
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 mr-4 rounded-sm transition-colors"
              style={{ color: 'oklch(0.45 0.12 265)' }}
            >
              <Menu className="w-6 h-6" />
            </button>

            {title && (
              <div>
                <h1
                  className="font-headline font-bold text-xl"
                  style={{ color: 'oklch(0.22 0.07 265)' }}
                >
                  {title}
                </h1>
                {subtitle && (
                  <p
                    className="text-sm"
                    style={{ color: 'oklch(0.55 0.01 75)' }}
                  >
                    {subtitle}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="text-sm font-medium px-4 py-2 rounded-sm transition-all duration-200 hover:translate-y-[-1px]"
              style={{
                color: 'oklch(0.45 0.12 265)',
                border: '1px solid oklch(0.45 0.12 265 / 0.3)',
              }}
            >
              사이트 보기
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6 lg:p-8">
          {/* Grain texture overlay */}
          <div className="fixed inset-0 pointer-events-none bg-grain opacity-20 z-0" />

          <div className="relative z-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
