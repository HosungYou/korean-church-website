import { GetStaticProps, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Layout from '@/components/Layout'
import PageHeader from '@/components/PageHeader'
import Link from 'next/link'

const SettlementInfoPage: NextPage = () => {
  const { i18n } = useTranslation('common')
  const isKorean = i18n.language === 'ko'

  const categories = [
    {
      id: 'housing',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      title: isKorean ? '주거 / 부동산' : 'Housing / Real Estate',
      items: [
        {
          name: 'Apartments.com',
          description: isKorean ? 'State College 지역 아파트 검색' : 'Search apartments in State College area',
          url: 'https://www.apartments.com/state-college-pa/',
        },
        {
          name: 'Zillow',
          description: isKorean ? '주택 구매 및 렌트 정보' : 'Home buying and rental information',
          url: 'https://www.zillow.com/state-college-pa/',
        },
        {
          name: 'Penn State Off-Campus Housing',
          description: isKorean ? 'PSU 학생/직원 주거 정보' : 'PSU student/staff housing info',
          url: 'https://offcampushousing.psu.edu/',
        },
        {
          name: 'Craigslist State College',
          description: isKorean ? '개인 간 렌트/매매 게시판' : 'Private rental/sale listings',
          url: 'https://pennstate.craigslist.org/',
        },
      ],
    },
    {
      id: 'schools',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
        </svg>
      ),
      title: isKorean ? '학교 / 교육' : 'Schools / Education',
      items: [
        {
          name: 'State College Area School District',
          description: isKorean ? 'K-12 공립학교 정보 및 등록' : 'K-12 public school info and enrollment',
          url: 'https://www.scasd.org/',
        },
        {
          name: 'Penn State University',
          description: isKorean ? '펜실베이니아 주립대학교' : 'Pennsylvania State University',
          url: 'https://www.psu.edu/',
        },
        {
          name: 'GreatSchools',
          description: isKorean ? '학교 평점 및 리뷰 확인' : 'School ratings and reviews',
          url: 'https://www.greatschools.org/pennsylvania/state-college/',
        },
        {
          name: isKorean ? 'SCKC 한국학교' : 'SCKC Korean School',
          description: isKorean ? '교회 한국어 교육 프로그램' : 'Church Korean language program',
          url: '/korean-school',
          internal: true,
        },
      ],
    },
    {
      id: 'medical',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      title: isKorean ? '의료 / 건강' : 'Medical / Health',
      items: [
        {
          name: 'Mount Nittany Health',
          description: isKorean ? 'State College 종합병원' : 'State College general hospital',
          url: 'https://www.mountnittany.org/',
        },
        {
          name: 'Penn State Health',
          description: isKorean ? 'PSU 의료 시스템' : 'PSU medical system',
          url: 'https://www.pennstatehealth.org/',
        },
        {
          name: 'Geisinger',
          description: isKorean ? '지역 의료 서비스' : 'Regional medical services',
          url: 'https://www.geisinger.org/',
        },
        {
          name: 'CVS Pharmacy',
          description: isKorean ? '약국 및 기본 진료' : 'Pharmacy and basic care',
          url: 'https://www.cvs.com/',
        },
      ],
    },
    {
      id: 'shopping',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: isKorean ? '쇼핑 / 마트' : 'Shopping / Grocery',
      items: [
        {
          name: 'Wegmans',
          description: isKorean ? '대형 슈퍼마켓 (아시안 식품 코너 있음)' : 'Large supermarket (Asian food section)',
          url: 'https://www.wegmans.com/',
        },
        {
          name: 'H Mart (Online)',
          description: isKorean ? '한국 식품 온라인 주문' : 'Korean groceries online order',
          url: 'https://www.hmart.com/',
        },
        {
          name: 'Walmart',
          description: isKorean ? '종합 마트' : 'General store',
          url: 'https://www.walmart.com/',
        },
        {
          name: 'Target',
          description: isKorean ? '생활용품 및 의류' : 'Household items and clothing',
          url: 'https://www.target.com/',
        },
        {
          name: 'Costco (Altoona)',
          description: isKorean ? '대용량 할인매장 (차로 45분)' : 'Bulk discount store (45 min drive)',
          url: 'https://www.costco.com/',
        },
      ],
    },
    {
      id: 'admin',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: isKorean ? '행정 절차' : 'Administrative Procedures',
      items: [
        {
          name: isKorean ? 'PA 운전면허 (PennDOT)' : 'PA Driver\'s License (PennDOT)',
          description: isKorean ? '운전면허 발급 및 차량 등록' : 'Driver\'s license and vehicle registration',
          url: 'https://www.dmv.pa.gov/',
        },
        {
          name: isKorean ? 'Social Security Administration' : 'Social Security Administration',
          description: isKorean ? 'SSN 발급 및 관련 서비스' : 'SSN issuance and related services',
          url: 'https://www.ssa.gov/',
        },
        {
          name: 'USCIS',
          description: isKorean ? '이민 서류 및 비자 관련' : 'Immigration documents and visa',
          url: 'https://www.uscis.gov/',
        },
        {
          name: isKorean ? 'Centre County 정부' : 'Centre County Government',
          description: isKorean ? '지역 행정 서비스' : 'Local administrative services',
          url: 'https://www.centrecountypa.gov/',
        },
      ],
    },
    {
      id: 'transportation',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
      title: isKorean ? '교통 / 이동' : 'Transportation',
      items: [
        {
          name: 'CATA Bus',
          description: isKorean ? 'State College 시내버스 (무료 for PSU)' : 'State College city bus (free for PSU)',
          url: 'https://www.catabus.com/',
        },
        {
          name: 'Megabus / FlixBus',
          description: isKorean ? '뉴욕, 필라델피아 장거리 버스' : 'Long-distance bus to NYC, Philadelphia',
          url: 'https://www.megabus.com/',
        },
        {
          name: 'University Park Airport',
          description: isKorean ? '지역 공항 (SCE)' : 'Regional airport (SCE)',
          url: 'https://www.universityparkairport.com/',
        },
        {
          name: 'Amtrak',
          description: isKorean ? '기차 (Lewistown역 이용)' : 'Train (use Lewistown station)',
          url: 'https://www.amtrak.com/',
        },
      ],
    },
  ]

  const tips = [
    {
      title: isKorean ? '도착 후 첫 주' : 'First Week After Arrival',
      items: isKorean
        ? [
            'SSN 신청 (입국 후 10일 이후 가능)',
            '은행 계좌 개설 (Chase, PNC, Bank of America 등)',
            '핸드폰 개통 (T-Mobile, AT&T, Verizon)',
            '임시 주거에서 영구 주거로 이동 준비',
          ]
        : [
            'Apply for SSN (possible after 10 days of arrival)',
            'Open bank account (Chase, PNC, Bank of America, etc.)',
            'Get phone plan (T-Mobile, AT&T, Verizon)',
            'Prepare to move from temporary to permanent housing',
          ],
    },
    {
      title: isKorean ? '첫 달 이내' : 'Within First Month',
      items: isKorean
        ? [
            '운전면허 취득 (PA 면허)',
            '차량 구매 및 등록/보험',
            '자녀 학교 등록 (필요시)',
            '의료보험 가입 확인',
          ]
        : [
            'Get driver\'s license (PA license)',
            'Purchase car and register/insure',
            'Enroll children in school (if needed)',
            'Confirm health insurance coverage',
          ],
    },
    {
      title: isKorean ? '정착 팁' : 'Settlement Tips',
      items: isKorean
        ? [
            '교회 성도님들께 경험을 물어보세요',
            'Facebook "State College 한인회" 그룹 활용',
            '한국 식품은 Wegmans 아시안 코너 또는 H Mart 온라인',
            '대형마트는 Costco (Altoona) 추천',
          ]
        : [
            'Ask church members for their experiences',
            'Use Facebook "State College Korean Community" group',
            'Korean groceries at Wegmans Asian section or H Mart online',
            'For bulk shopping, recommend Costco (Altoona)',
          ],
    },
  ]

  return (
    <Layout>
      {/* Page Header - Photo Composite Style */}
      <PageHeader
        label={isKorean ? '알림 및 공지' : 'Announcements'}
        title={isKorean ? 'State College 정착 도움 정보' : 'State College Settlement Guide'}
        subtitle={isKorean
          ? 'State College에 새로 오시는 분들을 위한 생활 정보 모음입니다.'
          : 'A collection of helpful information for those new to State College.'}
      />

      {/* Quick Tips Section */}
      <section
        className="py-16 relative"
        style={{ background: 'oklch(0.97 0.005 265)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <div
              className="h-0.5 w-12 mb-6"
              style={{ background: 'linear-gradient(90deg, oklch(0.72 0.10 75), oklch(0.45 0.12 265))' }}
            />
            <span
              className="text-xs font-medium tracking-[0.2em] uppercase mb-4 block"
              style={{ color: 'oklch(0.72 0.10 75)' }}
            >
              {isKorean ? '정착 체크리스트' : 'Settlement Checklist'}
            </span>
            <h2
              className="font-headline font-black"
              style={{
                fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                letterSpacing: '-0.02em',
                color: 'oklch(0.30 0.09 265)',
              }}
            >
              {isKorean ? '처음 오시는 분들을 위한 가이드' : 'Guide for Newcomers'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tips.map((tip, index) => (
              <div
                key={index}
                className="p-6 transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: 'oklch(0.99 0.003 75)',
                  border: '1px solid oklch(0.92 0.01 75)',
                  borderRadius: '2px',
                }}
              >
                <div
                  className="text-sm font-medium mb-4 pb-3"
                  style={{
                    color: 'oklch(0.45 0.12 265)',
                    borderBottom: '1px solid oklch(0.92 0.01 75)',
                  }}
                >
                  {tip.title}
                </div>
                <ul className="space-y-3">
                  {tip.items.map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      className="flex items-start gap-3 text-sm"
                      style={{ color: 'oklch(0.45 0.02 75)' }}
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                        style={{ background: 'oklch(0.72 0.10 75)' }}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section
        className="py-20 relative"
        style={{ background: 'oklch(0.985 0.003 75)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <div
              className="h-0.5 w-12 mb-6"
              style={{ background: 'linear-gradient(90deg, oklch(0.72 0.10 75), oklch(0.45 0.12 265))' }}
            />
            <span
              className="text-xs font-medium tracking-[0.2em] uppercase mb-4 block"
              style={{ color: 'oklch(0.72 0.10 75)' }}
            >
              {isKorean ? '카테고리별 정보' : 'Information by Category'}
            </span>
            <h2
              className="font-headline font-black"
              style={{
                fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                letterSpacing: '-0.02em',
                color: 'oklch(0.30 0.09 265)',
              }}
            >
              {isKorean ? '유용한 링크 모음' : 'Useful Links Collection'}
            </h2>
          </div>

          <div className="space-y-12">
            {categories.map((category, catIndex) => (
              <div key={category.id}>
                {/* Category Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className="w-14 h-14 flex items-center justify-center"
                    style={{
                      background: 'oklch(0.45 0.12 265 / 0.1)',
                      color: 'oklch(0.45 0.12 265)',
                      borderRadius: '2px',
                    }}
                  >
                    {category.icon}
                  </div>
                  <h3
                    className="text-xl font-bold"
                    style={{ color: 'oklch(0.30 0.09 265)' }}
                  >
                    {category.title}
                  </h3>
                </div>

                {/* Category Items */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {category.items.map((item, itemIndex) => (
                    item.internal ? (
                      <Link
                        key={itemIndex}
                        href={item.url}
                        className="group p-5 transition-all duration-300 hover:-translate-y-1"
                        style={{
                          background: 'oklch(0.99 0.003 75)',
                          border: '1px solid oklch(0.92 0.01 75)',
                          borderRadius: '2px',
                        }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4
                            className="font-medium"
                            style={{ color: 'oklch(0.30 0.09 265)' }}
                          >
                            {item.name}
                          </h4>
                          <svg
                            className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                            style={{ color: 'oklch(0.72 0.10 75)' }}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                        <p
                          className="text-sm"
                          style={{ color: 'oklch(0.55 0.01 75)' }}
                        >
                          {item.description}
                        </p>
                      </Link>
                    ) : (
                      <a
                        key={itemIndex}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group p-5 transition-all duration-300 hover:-translate-y-1"
                        style={{
                          background: 'oklch(0.99 0.003 75)',
                          border: '1px solid oklch(0.92 0.01 75)',
                          borderRadius: '2px',
                        }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4
                            className="font-medium"
                            style={{ color: 'oklch(0.30 0.09 265)' }}
                          >
                            {item.name}
                          </h4>
                          <svg
                            className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            style={{ color: 'oklch(0.72 0.10 75)' }}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </div>
                        <p
                          className="text-sm"
                          style={{ color: 'oklch(0.55 0.01 75)' }}
                        >
                          {item.description}
                        </p>
                      </a>
                    )
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-20 relative"
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
            {isKorean ? '도움이 필요하시면 연락주세요' : 'Contact Us for Help'}
          </h2>
          <p
            className="text-lg mb-10 max-w-2xl mx-auto"
            style={{ color: 'oklch(0.85 0.02 75)' }}
          >
            {isKorean
              ? '정착에 어려움이 있으시면 교회로 연락주세요. 교회 성도님들이 도움을 드릴 수 있습니다.'
              : 'If you need help settling in, please contact the church. Our members can assist you.'}
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

          {/* Contact info */}
          <div
            className="mt-12 pt-10 flex flex-wrap justify-center gap-8"
            style={{ borderTop: '1px solid oklch(0.98 0.01 75 / 0.2)' }}
          >
            <div className="text-center">
              <p
                className="text-xs font-medium tracking-wider uppercase mb-2"
                style={{ color: 'oklch(0.72 0.10 75)' }}
              >
                {isKorean ? '전화' : 'Phone'}
              </p>
              <p style={{ color: 'oklch(0.98 0.01 75)' }}>814-380-9393</p>
            </div>
            <div className="text-center">
              <p
                className="text-xs font-medium tracking-wider uppercase mb-2"
                style={{ color: 'oklch(0.72 0.10 75)' }}
              >
                {isKorean ? '이메일' : 'Email'}
              </p>
              <p style={{ color: 'oklch(0.98 0.01 75)' }}>KyuHongYeon@gmail.com</p>
            </div>
            <div className="text-center">
              <p
                className="text-xs font-medium tracking-wider uppercase mb-2"
                style={{ color: 'oklch(0.72 0.10 75)' }}
              >
                {isKorean ? '주소' : 'Address'}
              </p>
              <p style={{ color: 'oklch(0.98 0.01 75)' }}>758 Glenn Rd, State College, PA 16803</p>
            </div>
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

export default SettlementInfoPage
