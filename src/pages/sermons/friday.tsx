// ===========================================
// VS Design Diverge: Friday Sermons Page
// OKLCH Color System + Editorial Minimalism
// ===========================================

import Layout from '@/components/Layout'
import PageHeader from '@/components/PageHeader'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Calendar, User, Clock, Moon } from 'lucide-react'

const FridaySermonsPage = () => {
  const sermons = [
    { id: 1, title: '기도의 능력', speaker: '박현우 교육목사', date: '2025-08-01', videoId: 'dQw4w9WgXcQ', image: '/images/sermon-fri1.jpg' },
    { id: 2, title: '중보기도의 중요성', speaker: '박현우 교육목사', date: '2025-07-25', videoId: 'dQw4w9WgXcQ', image: '/images/sermon-fri2.jpg' },
  ]

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <Layout>
      {/* Hero Header */}
      <PageHeader
        label="Friday Night Prayer"
        title="금요철야"
        subtitle="주님과 함께하는 밤샘 기도와 예배"
      />

      {/* Service Info */}
      <section
        className="py-12"
        style={{ background: 'oklch(0.97 0.005 75)' }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              className="flex items-center p-6 rounded-sm transition-all duration-300 hover:-translate-y-1"
              style={{
                background: 'oklch(0.985 0.003 75)',
                border: '1px solid oklch(0.92 0.005 75)',
                boxShadow: '0 2px 8px oklch(0.30 0.09 265 / 0.06)'
              }}
            >
              <div
                className="w-12 h-12 rounded-sm flex items-center justify-center mr-4"
                style={{ background: 'oklch(0.45 0.12 265 / 0.1)' }}
              >
                <Moon className="w-5 h-5" style={{ color: 'oklch(0.45 0.12 265)' }} />
              </div>
              <div>
                <p className="text-xs font-medium tracking-wider uppercase" style={{ color: 'oklch(0.55 0.01 75)' }}>
                  예배 시간
                </p>
                <p className="font-semibold" style={{ color: 'oklch(0.25 0.05 265)' }}>
                  매주 금요일 저녁 9:00
                </p>
              </div>
            </div>
            <div
              className="flex items-center p-6 rounded-sm transition-all duration-300 hover:-translate-y-1"
              style={{
                background: 'oklch(0.985 0.003 75)',
                border: '1px solid oklch(0.92 0.005 75)',
                boxShadow: '0 2px 8px oklch(0.30 0.09 265 / 0.06)'
              }}
            >
              <div
                className="w-12 h-12 rounded-sm flex items-center justify-center mr-4"
                style={{ background: 'oklch(0.45 0.12 265 / 0.1)' }}
              >
                <User className="w-5 h-5" style={{ color: 'oklch(0.45 0.12 265)' }} />
              </div>
              <div>
                <p className="text-xs font-medium tracking-wider uppercase" style={{ color: 'oklch(0.55 0.01 75)' }}>
                  인도자
                </p>
                <p className="font-semibold" style={{ color: 'oklch(0.25 0.05 265)' }}>
                  박현우 교육목사
                </p>
              </div>
            </div>
            <div
              className="flex items-center p-6 rounded-sm transition-all duration-300 hover:-translate-y-1"
              style={{
                background: 'oklch(0.985 0.003 75)',
                border: '1px solid oklch(0.92 0.005 75)',
                boxShadow: '0 2px 8px oklch(0.30 0.09 265 / 0.06)'
              }}
            >
              <div
                className="w-12 h-12 rounded-sm flex items-center justify-center mr-4"
                style={{ background: 'oklch(0.72 0.10 75 / 0.15)' }}
              >
                <Clock className="w-5 h-5" style={{ color: 'oklch(0.58 0.11 75)' }} />
              </div>
              <div>
                <p className="text-xs font-medium tracking-wider uppercase" style={{ color: 'oklch(0.55 0.01 75)' }}>
                  예배 형식
                </p>
                <p className="font-semibold" style={{ color: 'oklch(0.25 0.05 265)' }}>
                  기도회 중심
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sermons Grid */}
      <section
        className="py-16"
        style={{ background: 'oklch(0.985 0.003 75)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Editorial Section Header */}
          <div className="mb-12">
            <div
              className="h-0.5 w-12 mb-6"
              style={{ background: 'linear-gradient(90deg, oklch(0.72 0.10 75), oklch(0.45 0.12 265))' }}
            />
            <h2
              className="font-headline font-bold"
              style={{
                fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                letterSpacing: '-0.02em',
                color: 'oklch(0.25 0.05 265)'
              }}
            >
              금요철야 설교
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sermons.map((sermon, index) => (
              <div
                key={sermon.id}
                className={`group rounded-sm overflow-hidden transition-all duration-300 hover:-translate-y-2 stagger-${index + 1}`}
                style={{
                  background: 'oklch(0.985 0.003 75)',
                  border: '1px solid oklch(0.92 0.005 75)',
                  boxShadow: '0 4px 12px oklch(0.30 0.09 265 / 0.08)'
                }}
              >
                <Link href={`/sermons/friday/${sermon.id}`}>
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={sermon.image}
                      alt={sermon.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div
                      className="absolute inset-0"
                      style={{ background: 'linear-gradient(to top, oklch(0.15 0.05 265 / 0.6), transparent)' }}
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'oklch(0.72 0.10 75)' }} />
                      <span className="text-xs" style={{ color: 'oklch(0.55 0.01 75)' }}>
                        {formatDate(sermon.date)}
                      </span>
                    </div>
                    <h3
                      className="text-xl font-bold mb-2 group-hover:underline decoration-1 underline-offset-4"
                      style={{ color: 'oklch(0.25 0.05 265)' }}
                    >
                      {sermon.title}
                    </h3>
                    <p className="text-sm" style={{ color: 'oklch(0.55 0.01 75)' }}>
                      {sermon.speaker}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Links */}
      <section className="py-16" style={{ background: 'oklch(0.97 0.005 75)' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <div className="h-0.5 w-12 mb-6" style={{ background: 'linear-gradient(90deg, oklch(0.72 0.10 75), oklch(0.45 0.12 265))' }} />
            <h2 className="font-headline font-bold" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', letterSpacing: '-0.02em', color: 'oklch(0.25 0.05 265)' }}>
              관련 페이지
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { href: '/sermons/sunday', title: '주일설교', desc: '주일예배 설교 영상' },
              { href: '/sermons/wednesday', title: '수요설교', desc: '수요예배 설교' },
              { href: '/about/service-info', title: '예배안내', desc: '예배 시간 및 장소' }
            ].map((link, index) => (
              <Link key={link.href} href={link.href} className={`group block stagger-${index + 1}`}>
                <div className="p-6 rounded-sm transition-all duration-300 hover:-translate-y-1" style={{ background: 'oklch(0.985 0.003 75)', border: '1px solid oklch(0.92 0.005 75)' }}>
                  <div className="flex items-center mb-4">
                    <div className="w-2 h-2 rounded-full mr-3" style={{ background: 'oklch(0.72 0.10 75)' }} />
                    <h3 className="text-lg font-semibold" style={{ color: 'oklch(0.25 0.05 265)' }}>{link.title}</h3>
                  </div>
                  <p className="text-sm mb-4" style={{ color: 'oklch(0.55 0.01 75)' }}>{link.desc}</p>
                  <div className="flex items-center text-sm font-medium" style={{ color: 'oklch(0.45 0.12 265)' }}>
                    자세히 보기
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'ko', ['common'])),
  },
})

export default FridaySermonsPage
