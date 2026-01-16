import { useState, useEffect } from 'react'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Link from 'next/link'
import {
  FileText,
  Mail,
  Users,
  Settings,
  Plus,
  Video,
  Image,
  Newspaper,
  Megaphone,
  TrendingUp,
  ArrowRight,
} from 'lucide-react'
import AdminLayout from '@/components/AdminLayout'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import { getSermonStats } from '../../utils/sermonService'
import { getGalleryStats } from '../../utils/galleryService'
import { getSubscriberStats } from '../../utils/subscriberService'
import { getMemberStats } from '../../utils/memberService'

// ===========================================
// VS Design Diverge: Admin Dashboard
// Editorial Cards + OKLCH Color System
// ===========================================

interface DashboardStats {
  sermons: number
  galleryAlbums: number
  galleryPhotos: number
  subscribers: number
  newFamilies: number
  members: number
}

const AdminDashboardPage = () => {
  const { admin } = useAdminAuth()
  const [stats, setStats] = useState<DashboardStats>({
    sermons: 0,
    galleryAlbums: 0,
    galleryPhotos: 0,
    subscribers: 0,
    newFamilies: 0,
    members: 0,
  })
  const [statsLoading, setStatsLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const [sermonStats, galleryStats, subscriberStats, memberStats] = await Promise.all([
          getSermonStats().catch(() => ({ total: 0 })),
          getGalleryStats().catch(() => ({ totalAlbums: 0, totalPhotos: 0 })),
          getSubscriberStats().catch(() => ({ active: 0 })),
          getMemberStats().catch(() => ({ active: 0 })),
        ])

        setStats({
          sermons: sermonStats.total || 0,
          galleryAlbums: galleryStats.totalAlbums || 0,
          galleryPhotos: galleryStats.totalPhotos || 0,
          subscribers: subscriberStats.active || 0,
          newFamilies: 0,
          members: memberStats.active || 0,
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

  // 빠른 작업
  const quickActions = [
    {
      name: '설교 등록',
      href: '/admin/sermons/new',
      icon: Video,
      description: '새 설교 영상 추가',
    },
    {
      name: '갤러리 추가',
      href: '/admin/gallery/new',
      icon: Image,
      description: '새 앨범 생성',
    },
    {
      name: '공지사항 작성',
      href: '/admin/posts/new?type=announcement',
      icon: Megaphone,
      description: '공지사항 등록',
    },
    {
      name: '주보 업로드',
      href: '/admin/bulletins',
      icon: Newspaper,
      description: '이번 주 주보',
    },
  ]

  // 통계 카드
  const statsCards = [
    {
      name: '설교 영상',
      value: stats.sermons,
      icon: Video,
      href: '/admin/sermons',
    },
    {
      name: '갤러리 앨범',
      value: stats.galleryAlbums,
      icon: Image,
      subValue: `${stats.galleryPhotos}장`,
      href: '/admin/gallery',
    },
    {
      name: '활성 구독자',
      value: stats.subscribers,
      icon: Mail,
      href: '/admin/subscribers',
    },
    {
      name: '활성 교인',
      value: stats.members,
      icon: Users,
      href: '/admin/members',
    },
  ]

  return (
    <AdminLayout title="대시보드" subtitle="전체 현황을 확인하세요">
      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Link
              key={stat.name}
              href={stat.href}
              className={`group block stagger-${index + 1}`}
            >
              <div
                className="p-6 rounded-sm transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: 'oklch(0.985 0.003 75)',
                  border: '1px solid oklch(0.92 0.005 75)',
                  boxShadow: '0 2px 8px oklch(0.45 0.12 265 / 0.05)',
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-sm flex items-center justify-center"
                    style={{ background: 'oklch(0.45 0.12 265 / 0.1)' }}
                  >
                    <Icon className="w-6 h-6" style={{ color: 'oklch(0.45 0.12 265)' }} />
                  </div>
                  <ArrowRight
                    className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1"
                    style={{ color: 'oklch(0.72 0.10 75)' }}
                  />
                </div>
                <p
                  className="text-sm font-medium mb-1"
                  style={{ color: 'oklch(0.55 0.01 75)' }}
                >
                  {stat.name}
                </p>
                <div className="flex items-baseline">
                  <span
                    className="font-headline font-bold text-3xl"
                    style={{ color: 'oklch(0.22 0.07 265)' }}
                  >
                    {statsLoading ? '—' : stat.value}
                  </span>
                  {stat.subValue && (
                    <span
                      className="ml-2 text-sm"
                      style={{ color: 'oklch(0.55 0.01 75)' }}
                    >
                      ({stat.subValue})
                    </span>
                  )}
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 빠른 작업 */}
        <div className="lg:col-span-1">
          <div
            className="p-6 rounded-sm"
            style={{
              background: 'oklch(0.985 0.003 75)',
              border: '1px solid oklch(0.92 0.005 75)',
            }}
          >
            {/* Section header */}
            <div className="flex items-center mb-6">
              <div
                className="h-0.5 w-8 mr-4"
                style={{
                  background: 'linear-gradient(90deg, oklch(0.72 0.10 75), oklch(0.45 0.12 265))',
                }}
              />
              <h3
                className="font-headline font-bold text-lg"
                style={{ color: 'oklch(0.22 0.07 265)' }}
              >
                빠른 작업
              </h3>
            </div>

            <div className="space-y-3">
              {quickActions.map((action, index) => {
                const Icon = action.icon
                return (
                  <Link
                    key={action.name}
                    href={action.href}
                    className={`group flex items-center p-4 rounded-sm transition-all duration-300 hover:-translate-y-0.5 stagger-${index + 1}`}
                    style={{
                      background: 'oklch(0.45 0.12 265)',
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-sm flex items-center justify-center mr-4 flex-shrink-0"
                      style={{ background: 'oklch(0.35 0.10 265)' }}
                    >
                      <Icon className="w-5 h-5" style={{ color: 'oklch(0.72 0.10 75)' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span
                        className="block font-medium text-sm"
                        style={{ color: 'oklch(0.98 0.003 75)' }}
                      >
                        {action.name}
                      </span>
                      <span
                        className="block text-xs"
                        style={{ color: 'oklch(0.80 0.01 75)' }}
                      >
                        {action.description}
                      </span>
                    </div>
                    <Plus
                      className="w-5 h-5 flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity"
                      style={{ color: 'oklch(0.72 0.10 75)' }}
                    />
                  </Link>
                )
              })}
            </div>
          </div>
        </div>

        {/* 최근 활동 & 시스템 상태 */}
        <div className="lg:col-span-2 space-y-8">
          {/* 최근 활동 */}
          <div
            className="p-6 rounded-sm"
            style={{
              background: 'oklch(0.985 0.003 75)',
              border: '1px solid oklch(0.92 0.005 75)',
            }}
          >
            <div className="flex items-center mb-6">
              <div
                className="h-0.5 w-8 mr-4"
                style={{
                  background: 'linear-gradient(90deg, oklch(0.72 0.10 75), oklch(0.45 0.12 265))',
                }}
              />
              <h3
                className="font-headline font-bold text-lg"
                style={{ color: 'oklch(0.22 0.07 265)' }}
              >
                최근 활동
              </h3>
            </div>

            <div className="space-y-4">
              {[
                {
                  icon: TrendingUp,
                  text: '시스템이 Supabase로 업그레이드되었습니다',
                  time: '방금 전',
                  color: 'oklch(0.55 0.15 145)',
                },
                {
                  icon: Settings,
                  text: '새로운 관리 기능이 추가되었습니다',
                  time: '오늘',
                  color: 'oklch(0.45 0.12 265)',
                },
              ].map((activity, index) => {
                const Icon = activity.icon
                return (
                  <div key={index} className="flex items-start">
                    <div
                      className="w-8 h-8 rounded-sm flex items-center justify-center mr-4 flex-shrink-0"
                      style={{ background: activity.color }}
                    >
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm"
                        style={{ color: 'oklch(0.35 0.008 75)' }}
                      >
                        {activity.text}
                      </p>
                      <p
                        className="text-xs mt-0.5"
                        style={{ color: 'oklch(0.55 0.01 75)' }}
                      >
                        {activity.time}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* 시스템 상태 */}
          <div
            className="p-6 rounded-sm"
            style={{
              background: 'oklch(0.985 0.003 75)',
              border: '1px solid oklch(0.92 0.005 75)',
            }}
          >
            <div className="flex items-center mb-6">
              <div
                className="h-0.5 w-8 mr-4"
                style={{
                  background: 'linear-gradient(90deg, oklch(0.72 0.10 75), oklch(0.45 0.12 265))',
                }}
              />
              <h3
                className="font-headline font-bold text-lg"
                style={{ color: 'oklch(0.22 0.07 265)' }}
              >
                시스템 상태
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { name: '데이터베이스', status: '연결됨', ok: true },
                { name: '파일 저장소', status: '정상', ok: true },
                { name: '이메일 서비스', status: '설정 필요', ok: false },
                { name: '백엔드', status: 'Supabase', ok: true },
              ].map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between p-3 rounded-sm"
                  style={{ background: 'oklch(0.97 0.005 265)' }}
                >
                  <span
                    className="text-sm"
                    style={{ color: 'oklch(0.45 0.01 75)' }}
                  >
                    {item.name}
                  </span>
                  <span
                    className="text-xs font-medium px-2 py-1 rounded-sm"
                    style={{
                      background: item.ok
                        ? 'oklch(0.55 0.15 145 / 0.15)'
                        : 'oklch(0.70 0.15 85 / 0.15)',
                      color: item.ok
                        ? 'oklch(0.45 0.15 145)'
                        : 'oklch(0.55 0.15 85)',
                    }}
                  >
                    {item.status}
                  </span>
                </div>
              ))}
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

export default AdminDashboardPage
