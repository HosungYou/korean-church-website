import { GetStaticProps, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Layout from '@/components/Layout'
import PageHeader from '@/components/PageHeader'
import Link from 'next/link'

const MissionarySupportPage: NextPage = () => {
  const { t, i18n } = useTranslation('common')
  const isKorean = i18n.language === 'ko'

  const supportedMissionaries = [
    {
      name: isKorean ? '김선교 선교사' : 'Missionary Kim',
      region: isKorean ? '동남아시아' : 'Southeast Asia',
      field: isKorean ? '교육 선교' : 'Educational Mission',
      since: '2018',
      image: '/images/placeholder-missionary.jpg',
    },
    {
      name: isKorean ? '이복음 선교사' : 'Missionary Lee',
      region: isKorean ? '중앙아시아' : 'Central Asia',
      field: isKorean ? '의료 선교' : 'Medical Mission',
      since: '2015',
      image: '/images/placeholder-missionary.jpg',
    },
    {
      name: isKorean ? '박은혜 선교사' : 'Missionary Park',
      region: isKorean ? '아프리카' : 'Africa',
      field: isKorean ? '아동 사역' : "Children's Ministry",
      since: '2020',
      image: '/images/placeholder-missionary.jpg',
    },
  ]

  const supportMethods = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: isKorean ? '정기 후원' : 'Monthly Support',
      description: isKorean
        ? '매월 정기적으로 선교사님들을 후원합니다.'
        : 'Support missionaries with regular monthly contributions.',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l2.414-2.414a1 1 0 01.707-.293H20" />
        </svg>
      ),
      title: isKorean ? '물품 후원' : 'Supply Support',
      description: isKorean
        ? '선교지에 필요한 물품을 보내드립니다.'
        : 'Send necessary supplies to mission fields.',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      title: isKorean ? '기도 후원' : 'Prayer Support',
      description: isKorean
        ? '선교사님들을 위해 기도로 함께합니다.'
        : 'Support missionaries through prayer.',
    },
  ]

  return (
    <Layout>
      {/* Page Header */}
      <PageHeader
        label={isKorean ? '선교' : 'Missions'}
        title={isKorean ? '선교사 지원' : 'Missionary Support'}
        subtitle={isKorean
          ? '전 세계에서 복음을 전하는 선교사님들을 기도와 물질로 후원합니다. 함께 선교의 사명을 감당합니다.'
          : 'We support missionaries spreading the Gospel worldwide through prayer and financial support. Together, we fulfill the Great Commission.'
        }
      />

      {/* Support Methods Section */}
      <section
        className="py-24 relative"
        style={{ background: 'oklch(0.985 0.003 75)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="mb-16">
            <div
              className="h-0.5 w-12 mb-6"
              style={{ background: 'linear-gradient(90deg, oklch(0.72 0.10 75), oklch(0.45 0.12 265))' }}
            />
            <span
              className="text-xs font-medium tracking-[0.2em] uppercase mb-4 block"
              style={{ color: 'oklch(0.72 0.10 75)' }}
            >
              {isKorean ? '후원 방법' : 'Ways to Support'}
            </span>
            <h2
              className="font-headline font-black"
              style={{
                fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                letterSpacing: '-0.02em',
                color: 'oklch(0.30 0.09 265)',
              }}
            >
              {isKorean ? '함께하는 방법' : 'How to Participate'}
            </h2>
          </div>

          {/* Support Methods Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {supportMethods.map((method, index) => (
              <div
                key={index}
                className="p-8 transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: 'oklch(0.98 0.005 75)',
                  border: '1px solid oklch(0.92 0.01 75)',
                  borderRadius: '2px',
                }}
              >
                <div
                  className="mb-6"
                  style={{ color: 'oklch(0.45 0.12 265)' }}
                >
                  {method.icon}
                </div>
                <h3
                  className="text-xl font-bold mb-3"
                  style={{ color: 'oklch(0.30 0.09 265)' }}
                >
                  {method.title}
                </h3>
                <p
                  className="leading-relaxed"
                  style={{ color: 'oklch(0.55 0.01 75)' }}
                >
                  {method.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Missionaries Section */}
      <section
        className="py-24 relative"
        style={{ background: 'oklch(0.97 0.005 265)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="mb-16">
            <div
              className="h-0.5 w-12 mb-6"
              style={{ background: 'linear-gradient(90deg, oklch(0.72 0.10 75), oklch(0.45 0.12 265))' }}
            />
            <span
              className="text-xs font-medium tracking-[0.2em] uppercase mb-4 block"
              style={{ color: 'oklch(0.72 0.10 75)' }}
            >
              {isKorean ? '후원 선교사' : 'Supported Missionaries'}
            </span>
            <h2
              className="font-headline font-black"
              style={{
                fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                letterSpacing: '-0.02em',
                color: 'oklch(0.30 0.09 265)',
              }}
            >
              {isKorean ? '함께하는 선교사님들' : 'Our Missionaries'}
            </h2>
          </div>

          {/* Missionaries Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {supportedMissionaries.map((missionary, index) => (
              <div
                key={index}
                className="group transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: 'oklch(0.99 0.003 75)',
                  border: '1px solid oklch(0.92 0.01 75)',
                  borderRadius: '2px',
                  overflow: 'hidden',
                }}
              >
                {/* Image placeholder */}
                <div
                  className="h-48 relative"
                  style={{ background: 'oklch(0.92 0.02 265)' }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg
                      className="w-16 h-16"
                      style={{ color: 'oklch(0.72 0.10 75 / 0.5)' }}
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                  {/* Region badge */}
                  <div
                    className="absolute bottom-4 left-4 px-3 py-1 text-xs font-medium tracking-wider"
                    style={{
                      background: 'oklch(0.45 0.12 265)',
                      color: 'oklch(0.98 0.01 75)',
                      borderRadius: '1px',
                    }}
                  >
                    {missionary.region}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3
                    className="text-lg font-bold mb-2"
                    style={{ color: 'oklch(0.30 0.09 265)' }}
                  >
                    {missionary.name}
                  </h3>
                  <p
                    className="text-sm mb-2"
                    style={{ color: 'oklch(0.55 0.01 75)' }}
                  >
                    {missionary.field}
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: 'oklch(0.72 0.10 75)' }}
                  >
                    {isKorean ? `${missionary.since}년부터 사역` : `Serving since ${missionary.since}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-24 relative"
        style={{
          background: 'linear-gradient(135deg, oklch(0.45 0.12 265), oklch(0.30 0.09 265))',
        }}
      >
        {/* Grain overlay */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2
            className="font-headline font-black mb-6"
            style={{
              fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
              letterSpacing: '-0.02em',
              color: 'oklch(0.98 0.01 75)',
            }}
          >
            {isKorean ? '선교에 동참해 주세요' : 'Join Our Mission'}
          </h2>
          <p
            className="text-lg mb-10 max-w-2xl mx-auto"
            style={{ color: 'oklch(0.85 0.02 75)' }}
          >
            {isKorean
              ? '여러분의 후원이 선교사님들에게 큰 힘이 됩니다. 기도와 물질로 함께 해주세요.'
              : 'Your support empowers missionaries. Join us in prayer and giving.'}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/about/directions"
              className="inline-flex items-center justify-center px-8 py-4 text-sm font-semibold tracking-wide transition-all duration-300"
              style={{
                background: 'oklch(0.72 0.10 75)',
                color: 'oklch(0.15 0.05 265)',
                borderRadius: '2px',
              }}
            >
              {isKorean ? '교회 방문하기' : 'Visit Our Church'}
            </Link>
            <Link
              href="/announcements"
              className="inline-flex items-center justify-center px-8 py-4 text-sm font-semibold tracking-wide transition-all duration-300"
              style={{
                background: 'transparent',
                color: 'oklch(0.98 0.01 75)',
                border: '1px solid oklch(0.98 0.01 75 / 0.3)',
                borderRadius: '2px',
              }}
            >
              {isKorean ? '공지사항 보기' : 'View Announcements'}
            </Link>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'ko', ['common'])),
  },
})

export default MissionarySupportPage
