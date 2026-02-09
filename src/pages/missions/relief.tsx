import { GetStaticProps, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Layout from '@/components/Layout'
import PageHeader from '@/components/PageHeader'
import Link from 'next/link'

const ReliefMissionsPage: NextPage = () => {
  const { t, i18n } = useTranslation('common')
  const isKorean = i18n.language === 'ko'

  const reliefAreas = [
    {
      icon: (
        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      title: isKorean ? '주거 지원' : 'Housing Support',
      description: isKorean
        ? '재난으로 주거지를 잃은 이웃들에게 임시 주거와 주택 재건을 지원합니다.'
        : 'Providing temporary housing and reconstruction for disaster victims.',
      stats: isKorean ? '2024년: 15가정 지원' : '2024: 15 families supported',
    },
    {
      icon: (
        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      title: isKorean ? '의료 지원' : 'Medical Aid',
      description: isKorean
        ? '의료 혜택을 받기 어려운 지역에 의료봉사와 의약품을 지원합니다.'
        : 'Medical services and supplies for underserved communities.',
      stats: isKorean ? '2024년: 500명 진료' : '2024: 500 patients treated',
    },
    {
      icon: (
        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      title: isKorean ? '교육 지원' : 'Education Support',
      description: isKorean
        ? '경제적 어려움으로 교육 기회를 얻지 못하는 아이들에게 장학금과 학용품을 지원합니다.'
        : 'Scholarships and supplies for children facing economic hardship.',
      stats: isKorean ? '2024년: 50명 장학금' : '2024: 50 scholarships',
    },
    {
      icon: (
        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
        </svg>
      ),
      title: isKorean ? '식량 지원' : 'Food Relief',
      description: isKorean
        ? '굶주린 이웃들에게 식량 키트와 따뜻한 식사를 제공합니다.'
        : 'Food kits and warm meals for hungry neighbors.',
      stats: isKorean ? '2024년: 2,000식 배식' : '2024: 2,000 meals served',
    },
  ]

  const recentProjects = [
    {
      title: isKorean ? '플로리다 허리케인 구호' : 'Florida Hurricane Relief',
      date: isKorean ? '2024년 10월' : 'October 2024',
      description: isKorean
        ? '허리케인 피해 지역 주민들에게 식량과 생필품을 전달했습니다.'
        : 'Delivered food and supplies to hurricane-affected residents.',
      raised: '$15,000',
      image: '/images/relief-hurricane.jpg',
    },
    {
      title: isKorean ? '지역 노숙인 겨울 지원' : 'Local Winter Homeless Support',
      date: isKorean ? '2024년 1월' : 'January 2024',
      description: isKorean
        ? 'State College 지역 노숙인들에게 방한복과 담요를 지원했습니다.'
        : 'Provided winter clothing and blankets to local homeless.',
      raised: '$5,000',
      image: '/images/relief-winter.jpg',
    },
    {
      title: isKorean ? '튀르키예 지진 구호' : 'Turkey Earthquake Relief',
      date: isKorean ? '2023년 2월' : 'February 2023',
      description: isKorean
        ? '튀르키예 지진 피해 지역에 구호금을 전달했습니다.'
        : 'Sent relief funds to earthquake victims in Turkey.',
      raised: '$10,000',
      image: '/images/relief-turkey.jpg',
    },
  ]

  const donationMethods = [
    {
      method: isKorean ? '헌금 봉투' : 'Offering Envelope',
      description: isKorean
        ? '주일예배 시 구제헌금 봉투를 사용해 헌금하실 수 있습니다.'
        : 'Use relief offering envelopes during Sunday service.',
    },
    {
      method: 'PayPal',
      description: isKorean
        ? 'PayPal을 통해 온라인으로 후원하실 수 있습니다.'
        : 'Donate online through PayPal.',
    },
    {
      method: 'Venmo',
      description: isKorean
        ? 'Venmo (@SCKC-Missions)를 통해 후원하실 수 있습니다.'
        : 'Donate via Venmo (@SCKC-Missions).',
    },
    {
      method: isKorean ? '물품 기부' : 'In-Kind Donations',
      description: isKorean
        ? '의류, 식품 등 물품 기부도 환영합니다.'
        : 'Clothing, food, and other goods are welcome.',
    },
  ]

  return (
    <Layout>
      {/* Page Header */}
      <PageHeader
        label={isKorean ? '선교' : 'Missions'}
        title={isKorean ? '구제선교' : 'Relief Missions'}
        subtitle={isKorean
          ? '굶주리고, 아프고, 어려움에 처한 이웃을 돌보는 것은 그리스도의 사랑을 실천하는 것입니다. 함께 나눔의 손길을 전합니다.'
          : "Caring for the hungry, sick, and those in need is living out Christ's love. Together, we extend helping hands."
        }
      />

      {/* Relief Areas Section */}
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
              {isKorean ? '구제 분야' : 'Relief Areas'}
            </span>
            <h2
              className="font-headline font-black"
              style={{
                fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                letterSpacing: '-0.02em',
                color: 'oklch(0.30 0.09 265)',
              }}
            >
              {isKorean ? '나눔의 영역' : 'Areas of Service'}
            </h2>
          </div>

          {/* Relief Areas Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {reliefAreas.map((area, index) => (
              <div
                key={index}
                className="flex gap-6 p-8 transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: 'oklch(0.99 0.003 75)',
                  border: '1px solid oklch(0.92 0.01 75)',
                  borderRadius: '2px',
                }}
              >
                {/* Icon */}
                <div
                  className="flex-shrink-0"
                  style={{ color: 'oklch(0.50 0.12 25)' }}
                >
                  {area.icon}
                </div>

                {/* Content */}
                <div>
                  <h3
                    className="text-xl font-bold mb-2"
                    style={{ color: 'oklch(0.30 0.09 265)' }}
                  >
                    {area.title}
                  </h3>
                  <p
                    className="mb-3 leading-relaxed"
                    style={{ color: 'oklch(0.55 0.01 75)' }}
                  >
                    {area.description}
                  </p>
                  <span
                    className="text-xs font-medium"
                    style={{ color: 'oklch(0.72 0.10 75)' }}
                  >
                    {area.stats}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Projects Section */}
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
              {isKorean ? '최근 활동' : 'Recent Projects'}
            </span>
            <h2
              className="font-headline font-black"
              style={{
                fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                letterSpacing: '-0.02em',
                color: 'oklch(0.30 0.09 265)',
              }}
            >
              {isKorean ? '구제 활동 현황' : 'Relief Efforts'}
            </h2>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {recentProjects.map((project, index) => (
              <div
                key={index}
                className="group overflow-hidden transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: 'oklch(0.99 0.003 75)',
                  border: '1px solid oklch(0.92 0.01 75)',
                  borderRadius: '2px',
                }}
              >
                {/* Image placeholder */}
                <div
                  className="h-48 relative"
                  style={{ background: 'oklch(0.90 0.03 25)' }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg
                      className="w-16 h-16"
                      style={{ color: 'oklch(0.50 0.12 25 / 0.5)' }}
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  {/* Raised badge */}
                  <div
                    className="absolute top-4 right-4 px-3 py-1 text-sm font-bold"
                    style={{
                      background: 'oklch(0.72 0.10 75)',
                      color: 'oklch(0.15 0.05 265)',
                      borderRadius: '1px',
                    }}
                  >
                    {project.raised}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <span
                    className="text-xs font-medium tracking-wider"
                    style={{ color: 'oklch(0.72 0.10 75)' }}
                  >
                    {project.date}
                  </span>
                  <h3
                    className="text-lg font-bold mt-2 mb-3"
                    style={{ color: 'oklch(0.30 0.09 265)' }}
                  >
                    {project.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: 'oklch(0.55 0.01 75)' }}
                  >
                    {project.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Donation Methods Section */}
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
              {isKorean ? '후원 안내' : 'How to Give'}
            </span>
            <h2
              className="font-headline font-black"
              style={{
                fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                letterSpacing: '-0.02em',
                color: 'oklch(0.30 0.09 265)',
              }}
            >
              {isKorean ? '나눔에 동참하기' : 'Ways to Donate'}
            </h2>
          </div>

          {/* Donation Methods Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {donationMethods.map((donation, index) => (
              <div
                key={index}
                className="p-6 text-center transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: 'oklch(0.99 0.003 75)',
                  border: '1px solid oklch(0.92 0.01 75)',
                  borderRadius: '2px',
                }}
              >
                <h3
                  className="text-lg font-bold mb-3"
                  style={{ color: 'oklch(0.45 0.12 265)' }}
                >
                  {donation.method}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: 'oklch(0.55 0.01 75)' }}
                >
                  {donation.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-24 relative"
        style={{
          background: 'linear-gradient(135deg, oklch(0.50 0.12 25), oklch(0.30 0.09 265))',
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
            {isKorean ? '나눔의 손길을 더해주세요' : 'Join Our Relief Efforts'}
          </h2>
          <p
            className="text-lg mb-10 max-w-2xl mx-auto"
            style={{ color: 'oklch(0.85 0.02 75)' }}
          >
            {isKorean
              ? '여러분의 작은 나눔이 어려운 이웃에게 큰 희망이 됩니다. 그리스도의 사랑을 함께 전해주세요.'
              : 'Your small gift brings great hope to those in need. Share Christ\'s love with us.'}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/worship"
              className="inline-flex items-center justify-center px-8 py-4 text-sm font-semibold tracking-wide transition-all duration-300"
              style={{
                background: 'oklch(0.72 0.10 75)',
                color: 'oklch(0.15 0.05 265)',
                borderRadius: '2px',
              }}
            >
              {isKorean ? '헌금 안내' : 'Giving Info'}
            </Link>
            <Link
              href="/about/directions"
              className="inline-flex items-center justify-center px-8 py-4 text-sm font-semibold tracking-wide transition-all duration-300"
              style={{
                background: 'transparent',
                color: 'oklch(0.98 0.01 75)',
                border: '1px solid oklch(0.98 0.01 75 / 0.3)',
                borderRadius: '2px',
              }}
            >
              {isKorean ? '교회 방문하기' : 'Visit Our Church'}
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

export default ReliefMissionsPage
