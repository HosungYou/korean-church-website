// ===========================================
// VS Design Diverge: New Family Page
// OKLCH Color System + Editorial Minimalism
// ===========================================

import Layout from '@/components/Layout'
import PageHeader from '@/components/PageHeader'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const NewFamilyPage = () => {
  return (
    <Layout>
      <PageHeader
        title="새가족양육"
        subtitle="새로운 신앙의 여정을 함께 시작합니다"
        label="New Family Ministry"
      />

      {/* Main Content Section */}
      <section style={{ background: 'oklch(0.97 0.005 75)' }}>
        <div className="max-w-5xl mx-auto py-20 px-6 md:px-12 lg:px-20">
          {/* Welcome Section */}
          <div className="mb-20">
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
                환영합니다
              </h2>
            </div>

            <div
              className="p-8 rounded-sm"
              style={{
                background: 'oklch(0.985 0.003 75)',
                border: '1px solid oklch(0.92 0.005 75)',
                boxShadow: '0 2px 8px oklch(0.30 0.09 265 / 0.06)'
              }}
            >
              <p
                className="text-lg leading-relaxed font-korean mb-4"
                style={{ color: 'oklch(0.35 0.02 265)' }}
              >
                새가족양육부는 교회에 처음 오신 분들이 잘 정착할 수 있도록 돕는 과정입니다.
                4주간의 교육을 통해 교회의 비전을 공유하고, 신앙의 기초를 다지며, 소그룹에 연결되어 교제의 기쁨을 누리도록 안내합니다.
              </p>
              <p
                className="text-lg leading-relaxed font-korean"
                style={{ color: 'oklch(0.35 0.02 265)' }}
              >
                새가족 여러분을 언제나 환영하며, 여러분의 신앙 여정에 든든한 동반자가 되겠습니다.
              </p>
            </div>
          </div>

          {/* 4-Week Curriculum Section */}
          <div className="mb-20">
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
                4주 커리큘럼
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  week: '1주차',
                  title: '교회 소개',
                  items: ['교회 역사와 비전', '예배와 부서 안내']
                },
                {
                  week: '2주차',
                  title: '신앙의 기초',
                  items: ['구원의 확신', '성경 읽기의 중요성']
                },
                {
                  week: '3주차',
                  title: '그리스도인의 삶',
                  items: ['기도와 찬양', '헌금과 봉사']
                },
                {
                  week: '4주차',
                  title: '공동체 참여',
                  items: ['소그룹 연결', '선교와 전도']
                },
              ].map((curriculum, index) => (
                <div
                  key={index}
                  className="p-6 rounded-sm transition-all duration-300 hover:translate-y-[-2px]"
                  style={{
                    background: 'oklch(0.985 0.003 75)',
                    border: '1px solid oklch(0.92 0.005 75)',
                    boxShadow: '0 2px 8px oklch(0.30 0.09 265 / 0.06)'
                  }}
                >
                  <span
                    className="text-xs font-medium tracking-[0.15em] uppercase mb-2 block"
                    style={{ color: 'oklch(0.72 0.10 75)' }}
                  >
                    {curriculum.week}
                  </span>
                  <h3
                    className="font-headline font-semibold mb-4"
                    style={{ color: 'oklch(0.45 0.12 265)' }}
                  >
                    {curriculum.title}
                  </h3>
                  <ul className="space-y-2">
                    {curriculum.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start">
                        <div
                          className="w-1 h-1 rounded-full mt-2 mr-3"
                          style={{ background: 'oklch(0.55 0.01 75)' }}
                        />
                        <span
                          className="text-sm font-korean"
                          style={{ color: 'oklch(0.55 0.01 75)' }}
                        >
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits Section */}
          <div className="mb-20">
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
                지원 혜택
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: '1:1 멘토링', desc: '전담 멘토와 함께하는 개별 상담' },
                { title: '환영 선물', desc: '성경책과 교회 소개 자료 제공' },
                { title: '소그룹 연결', desc: '나이와 관심사에 맞는 소그룹 매칭' },
              ].map((benefit, index) => (
                <div
                  key={index}
                  className="p-6 rounded-sm transition-all duration-300 hover:translate-y-[-2px]"
                  style={{
                    background: 'oklch(0.985 0.003 75)',
                    border: '1px solid oklch(0.92 0.005 75)',
                    boxShadow: '0 2px 8px oklch(0.30 0.09 265 / 0.06)'
                  }}
                >
                  <h3
                    className="font-headline font-semibold mb-2"
                    style={{ color: 'oklch(0.45 0.12 265)' }}
                  >
                    {benefit.title}
                  </h3>
                  <p
                    className="text-sm font-korean"
                    style={{ color: 'oklch(0.55 0.01 75)' }}
                  >
                    {benefit.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact & Registration Section */}
          <div>
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
                참여 안내
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Meeting Info */}
              <div
                className="p-8 rounded-sm"
                style={{
                  background: 'oklch(0.985 0.003 75)',
                  border: '1px solid oklch(0.92 0.005 75)',
                  boxShadow: '0 2px 8px oklch(0.30 0.09 265 / 0.06)'
                }}
              >
                <h3
                  className="font-headline font-semibold mb-4"
                  style={{ color: 'oklch(0.45 0.12 265)' }}
                >
                  모임 정보
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div
                      className="w-1.5 h-1.5 rounded-full mt-2 mr-3"
                      style={{ background: 'oklch(0.72 0.10 75)' }}
                    />
                    <p className="font-korean" style={{ color: 'oklch(0.35 0.02 265)' }}>
                      <span className="font-semibold">시간:</span> 매주 주일 오후 1:00
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div
                      className="w-1.5 h-1.5 rounded-full mt-2 mr-3"
                      style={{ background: 'oklch(0.72 0.10 75)' }}
                    />
                    <p className="font-korean" style={{ color: 'oklch(0.35 0.02 265)' }}>
                      <span className="font-semibold">장소:</span> 새가족실 (교육관 2층)
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div
                      className="w-1.5 h-1.5 rounded-full mt-2 mr-3"
                      style={{ background: 'oklch(0.72 0.10 75)' }}
                    />
                    <p className="font-korean" style={{ color: 'oklch(0.35 0.02 265)' }}>
                      <span className="font-semibold">기간:</span> 4주 과정 (월 1회 개강)
                    </p>
                  </div>
                </div>
              </div>

              {/* Registration */}
              <div
                className="p-8 rounded-sm"
                style={{
                  background: 'oklch(0.985 0.003 75)',
                  border: '1px solid oklch(0.92 0.005 75)',
                  boxShadow: '0 2px 8px oklch(0.30 0.09 265 / 0.06)'
                }}
              >
                <h3
                  className="font-headline font-semibold mb-4"
                  style={{ color: 'oklch(0.45 0.12 265)' }}
                >
                  등록 방법
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div
                      className="w-1.5 h-1.5 rounded-full mt-2 mr-3"
                      style={{ background: 'oklch(0.72 0.10 75)' }}
                    />
                    <p className="font-korean" style={{ color: 'oklch(0.35 0.02 265)' }}>
                      주일 예배 후 안내데스크 방문
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div
                      className="w-1.5 h-1.5 rounded-full mt-2 mr-3"
                      style={{ background: 'oklch(0.72 0.10 75)' }}
                    />
                    <p className="font-korean" style={{ color: 'oklch(0.35 0.02 265)' }}>
                      <span className="font-semibold">전화:</span> 814-380-9393
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div
                      className="w-1.5 h-1.5 rounded-full mt-2 mr-3"
                      style={{ background: 'oklch(0.72 0.10 75)' }}
                    />
                    <p className="font-korean" style={{ color: 'oklch(0.35 0.02 265)' }}>
                      <span className="font-semibold">이메일:</span> newfamily@church.com
                    </p>
                  </div>
                </div>
              </div>
            </div>
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

export default NewFamilyPage
