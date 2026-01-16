// ===========================================
// VS Design Diverge: Special Praise Page
// OKLCH Color System + Editorial Minimalism
// ===========================================

import Layout from '@/components/Layout'
import PageHeader from '@/components/PageHeader'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Image from 'next/image'
import Link from 'next/link'
import { Music, Play, ArrowRight, Users, Calendar } from 'lucide-react'

const SpecialPraisePage = () => {
  const praises = [
    { id: 1, title: '내 영혼의 그윽히 깊은데서', team: '시온 찬양대', date: '2025-08-10', image: '/images/praise1.jpg' },
    { id: 2, title: '은혜 아니면', team: '호산나 찬양대', date: '2025-08-03', image: '/images/praise2.jpg' },
    { id: 3, title: '주님 말씀하시면', team: '청년부 찬양팀', date: '2025-07-27', image: '/images/praise3.jpg' },
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
        label="Special Praise"
        title="특별찬양"
        subtitle="하나님께 드리는 아름다운 찬양의 제사"
      />

      {/* Praise Teams Info */}
      <section className="py-12" style={{ background: 'oklch(0.97 0.005 75)' }}>
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
              <div className="w-12 h-12 rounded-sm flex items-center justify-center mr-4" style={{ background: 'oklch(0.45 0.12 265 / 0.1)' }}>
                <Users className="w-5 h-5" style={{ color: 'oklch(0.45 0.12 265)' }} />
              </div>
              <div>
                <p className="text-xs font-medium tracking-wider uppercase" style={{ color: 'oklch(0.55 0.01 75)' }}>찬양대</p>
                <p className="font-semibold" style={{ color: 'oklch(0.25 0.05 265)' }}>시온 찬양대</p>
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
              <div className="w-12 h-12 rounded-sm flex items-center justify-center mr-4" style={{ background: 'oklch(0.45 0.12 265 / 0.1)' }}>
                <Users className="w-5 h-5" style={{ color: 'oklch(0.45 0.12 265)' }} />
              </div>
              <div>
                <p className="text-xs font-medium tracking-wider uppercase" style={{ color: 'oklch(0.55 0.01 75)' }}>찬양대</p>
                <p className="font-semibold" style={{ color: 'oklch(0.25 0.05 265)' }}>호산나 찬양대</p>
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
              <div className="w-12 h-12 rounded-sm flex items-center justify-center mr-4" style={{ background: 'oklch(0.72 0.10 75 / 0.15)' }}>
                <Music className="w-5 h-5" style={{ color: 'oklch(0.58 0.11 75)' }} />
              </div>
              <div>
                <p className="text-xs font-medium tracking-wider uppercase" style={{ color: 'oklch(0.55 0.01 75)' }}>찬양팀</p>
                <p className="font-semibold" style={{ color: 'oklch(0.25 0.05 265)' }}>청년부 찬양팀</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Praise List */}
      <section className="py-16" style={{ background: 'oklch(0.985 0.003 75)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Editorial Section Header */}
          <div className="mb-12">
            <div className="h-0.5 w-12 mb-6" style={{ background: 'linear-gradient(90deg, oklch(0.72 0.10 75), oklch(0.45 0.12 265))' }} />
            <h2
              className="font-headline font-bold"
              style={{
                fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                letterSpacing: '-0.02em',
                color: 'oklch(0.25 0.05 265)'
              }}
            >
              특별찬양 목록
            </h2>
          </div>

          <div className="space-y-6">
            {praises.map((praise, index) => (
              <div
                key={praise.id}
                className={`group flex items-center p-5 rounded-sm transition-all duration-300 hover:-translate-y-1 stagger-${index + 1}`}
                style={{
                  background: 'oklch(0.985 0.003 75)',
                  border: '1px solid oklch(0.92 0.005 75)',
                  boxShadow: '0 2px 8px oklch(0.30 0.09 265 / 0.06)'
                }}
              >
                {/* Thumbnail */}
                <div className="relative h-24 w-32 rounded-sm overflow-hidden flex-shrink-0" style={{ background: 'oklch(0.15 0.05 265)' }}>
                  <Image src={praise.image} alt={praise.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
                  <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'oklch(0.15 0.05 265 / 0.3)' }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110" style={{ background: 'oklch(0.98 0.003 75 / 0.2)' }}>
                      <Play className="w-5 h-5 ml-0.5" style={{ color: 'oklch(0.98 0.003 75)' }} />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="ml-6 flex-grow">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'oklch(0.72 0.10 75)' }} />
                    <span className="text-xs flex items-center" style={{ color: 'oklch(0.55 0.01 75)' }}>
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(praise.date)}
                    </span>
                  </div>
                  <h3
                    className="text-xl font-bold mb-1 group-hover:underline decoration-1 underline-offset-4"
                    style={{ color: 'oklch(0.25 0.05 265)' }}
                  >
                    {praise.title}
                  </h3>
                  <p className="text-sm" style={{ color: 'oklch(0.55 0.01 75)' }}>
                    {praise.team}
                  </p>
                </div>

                {/* Play Button */}
                <button
                  className="ml-4 p-4 rounded-sm transition-all duration-300 hover:scale-105"
                  style={{
                    background: 'oklch(0.45 0.12 265)',
                    color: 'oklch(0.98 0.003 75)'
                  }}
                >
                  <Music className="w-5 h-5" />
                </button>
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

export default SpecialPraisePage
