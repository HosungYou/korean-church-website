import { GetStaticProps, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Layout from '@/components/Layout'
import PageHeader from '@/components/PageHeader'
import Link from 'next/link'

const ShortTermMissionsPage: NextPage = () => {
  const { t, i18n } = useTranslation('common')
  const isKorean = i18n.language === 'ko'

  const upcomingTrips = [
    {
      destination: isKorean ? '멕시코' : 'Mexico',
      period: isKorean ? '2025년 7월 10일 - 20일' : 'July 10-20, 2025',
      focus: isKorean ? '건축 봉사 및 VBS' : 'Construction & VBS',
      spots: 12,
      filled: 5,
    },
    {
      destination: isKorean ? '필리핀' : 'Philippines',
      period: isKorean ? '2025년 8월 5일 - 15일' : 'August 5-15, 2025',
      focus: isKorean ? '의료 봉사' : 'Medical Mission',
      spots: 8,
      filled: 3,
    },
    {
      destination: isKorean ? '인도' : 'India',
      period: isKorean ? '2025년 12월 20일 - 30일' : 'December 20-30, 2025',
      focus: isKorean ? '교육 선교' : 'Educational Mission',
      spots: 10,
      filled: 2,
    },
  ]

  const pastTrips = [
    {
      year: '2024',
      destination: isKorean ? '캄보디아' : 'Cambodia',
      participants: 15,
      highlight: isKorean ? '학교 건축 완료' : 'School Construction Completed',
    },
    {
      year: '2023',
      destination: isKorean ? '케냐' : 'Kenya',
      participants: 12,
      highlight: isKorean ? '우물 2개 설치' : '2 Wells Installed',
    },
    {
      year: '2022',
      destination: isKorean ? '과테말라' : 'Guatemala',
      participants: 10,
      highlight: isKorean ? 'VBS 300명 참여' : 'VBS with 300 Children',
    },
  ]

  const preparationSteps = [
    {
      step: '01',
      title: isKorean ? '신청서 제출' : 'Application',
      description: isKorean
        ? '단기선교 참가 신청서를 작성하여 제출합니다.'
        : 'Submit your short-term mission application.',
    },
    {
      step: '02',
      title: isKorean ? '면담' : 'Interview',
      description: isKorean
        ? '담당 목사님과 면담을 통해 참가 여부를 결정합니다.'
        : 'Interview with the pastor to confirm participation.',
    },
    {
      step: '03',
      title: isKorean ? '훈련' : 'Training',
      description: isKorean
        ? '출발 전 4주간 선교 훈련에 참가합니다.'
        : 'Participate in 4-week pre-trip training.',
    },
    {
      step: '04',
      title: isKorean ? '출발' : 'Departure',
      description: isKorean
        ? '팀과 함께 선교지로 출발합니다.'
        : 'Depart for the mission field with your team.',
    },
  ]

  return (
    <Layout>
      {/* Page Header */}
      <PageHeader
        label={isKorean ? '선교' : 'Missions'}
        title={isKorean ? '단기선교' : 'Short-term Missions'}
        subtitle={isKorean
          ? '세상 끝까지 복음을 전하라는 주님의 명령에 순종하여, 매년 단기선교를 통해 선교지를 섬기고 있습니다.'
          : 'Following the Great Commission, we serve mission fields annually through short-term mission trips.'
        }
      />

      {/* Upcoming Trips Section */}
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
              {isKorean ? '예정된 선교' : 'Upcoming Trips'}
            </span>
            <h2
              className="font-headline font-black"
              style={{
                fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                letterSpacing: '-0.02em',
                color: 'oklch(0.30 0.09 265)',
              }}
            >
              {isKorean ? '2025년 단기선교 일정' : '2025 Mission Trips'}
            </h2>
          </div>

          {/* Trips Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {upcomingTrips.map((trip, index) => (
              <div
                key={index}
                className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: 'oklch(0.99 0.003 75)',
                  border: '1px solid oklch(0.92 0.01 75)',
                  borderRadius: '2px',
                }}
              >
                {/* Top accent */}
                <div
                  className="h-1"
                  style={{
                    background: 'linear-gradient(90deg, oklch(0.72 0.10 75), oklch(0.45 0.12 265))',
                  }}
                />

                <div className="p-8">
                  {/* Destination */}
                  <h3
                    className="text-2xl font-bold mb-2"
                    style={{ color: 'oklch(0.30 0.09 265)' }}
                  >
                    {trip.destination}
                  </h3>

                  {/* Period */}
                  <p
                    className="text-sm mb-4"
                    style={{ color: 'oklch(0.55 0.01 75)' }}
                  >
                    {trip.period}
                  </p>

                  {/* Focus */}
                  <div
                    className="inline-block px-3 py-1 text-xs font-medium mb-6"
                    style={{
                      background: 'oklch(0.45 0.12 265 / 0.1)',
                      color: 'oklch(0.45 0.12 265)',
                      borderRadius: '1px',
                    }}
                  >
                    {trip.focus}
                  </div>

                  {/* Spots indicator */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs mb-2">
                      <span style={{ color: 'oklch(0.55 0.01 75)' }}>
                        {isKorean ? '참가 현황' : 'Spots Filled'}
                      </span>
                      <span style={{ color: 'oklch(0.72 0.10 75)' }}>
                        {trip.filled}/{trip.spots}
                      </span>
                    </div>
                    <div
                      className="h-2 w-full rounded-full overflow-hidden"
                      style={{ background: 'oklch(0.92 0.01 75)' }}
                    >
                      <div
                        className="h-full transition-all duration-500"
                        style={{
                          width: `${(trip.filled / trip.spots) * 100}%`,
                          background: 'linear-gradient(90deg, oklch(0.72 0.10 75), oklch(0.45 0.12 265))',
                        }}
                      />
                    </div>
                  </div>

                  {/* Apply button */}
                  <button
                    className="mt-6 w-full py-3 text-sm font-semibold tracking-wide transition-all duration-300"
                    style={{
                      background: 'oklch(0.45 0.12 265)',
                      color: 'oklch(0.98 0.01 75)',
                      borderRadius: '2px',
                    }}
                  >
                    {isKorean ? '신청하기' : 'Apply Now'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Preparation Steps Section */}
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
              {isKorean ? '참가 과정' : 'How to Join'}
            </span>
            <h2
              className="font-headline font-black"
              style={{
                fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                letterSpacing: '-0.02em',
                color: 'oklch(0.30 0.09 265)',
              }}
            >
              {isKorean ? '단기선교 준비 과정' : 'Preparation Process'}
            </h2>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {preparationSteps.map((step, index) => (
              <div key={index} className="relative">
                {/* Step number */}
                <div
                  className="text-6xl font-black mb-4"
                  style={{ color: 'oklch(0.72 0.10 75 / 0.3)' }}
                >
                  {step.step}
                </div>

                {/* Step title */}
                <h3
                  className="text-xl font-bold mb-3"
                  style={{ color: 'oklch(0.30 0.09 265)' }}
                >
                  {step.title}
                </h3>

                {/* Step description */}
                <p
                  className="leading-relaxed"
                  style={{ color: 'oklch(0.55 0.01 75)' }}
                >
                  {step.description}
                </p>

                {/* Connector line (not on last item) */}
                {index < preparationSteps.length - 1 && (
                  <div
                    className="hidden lg:block absolute top-8 left-full w-full h-0.5"
                    style={{
                      background: 'linear-gradient(90deg, oklch(0.72 0.10 75 / 0.3), transparent)',
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Past Trips Section */}
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
              {isKorean ? '지난 선교' : 'Past Missions'}
            </span>
            <h2
              className="font-headline font-black"
              style={{
                fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                letterSpacing: '-0.02em',
                color: 'oklch(0.30 0.09 265)',
              }}
            >
              {isKorean ? '선교 발자취' : 'Our Mission History'}
            </h2>
          </div>

          {/* Past trips list */}
          <div className="space-y-4">
            {pastTrips.map((trip, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row md:items-center justify-between p-6 transition-all duration-300"
                style={{
                  background: 'oklch(0.99 0.003 75)',
                  border: '1px solid oklch(0.92 0.01 75)',
                  borderRadius: '2px',
                }}
              >
                <div className="flex items-center gap-6 mb-4 md:mb-0">
                  <span
                    className="text-3xl font-black"
                    style={{ color: 'oklch(0.72 0.10 75)' }}
                  >
                    {trip.year}
                  </span>
                  <div>
                    <h3
                      className="text-lg font-bold"
                      style={{ color: 'oklch(0.30 0.09 265)' }}
                    >
                      {trip.destination}
                    </h3>
                    <p
                      className="text-sm"
                      style={{ color: 'oklch(0.55 0.01 75)' }}
                    >
                      {trip.participants} {isKorean ? '명 참가' : ' participants'}
                    </p>
                  </div>
                </div>

                <div
                  className="px-4 py-2 text-sm font-medium"
                  style={{
                    background: 'oklch(0.45 0.12 265 / 0.1)',
                    color: 'oklch(0.45 0.12 265)',
                    borderRadius: '1px',
                  }}
                >
                  {trip.highlight}
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
          background: 'linear-gradient(135deg, oklch(0.35 0.10 145), oklch(0.22 0.07 265))',
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
            {isKorean ? '단기선교에 동참하세요' : 'Join Our Mission Team'}
          </h2>
          <p
            className="text-lg mb-10 max-w-2xl mx-auto"
            style={{ color: 'oklch(0.85 0.02 75)' }}
          >
            {isKorean
              ? '단기선교를 통해 세계 선교의 현장을 경험하고, 하나님의 나라를 확장하는 일에 함께해 주세요.'
              : 'Experience global missions firsthand and participate in expanding God\'s kingdom.'}
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
              {isKorean ? '문의하기' : 'Contact Us'}
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

export default ShortTermMissionsPage
