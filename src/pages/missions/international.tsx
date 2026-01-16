// ===========================================
// VS Design Diverge: International Missions Page
// OKLCH Color System + Editorial Minimalism
// ===========================================

import Layout from '@/components/Layout'
import PageHeader from '@/components/PageHeader'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const InternationalMissionsPage = () => {
  return (
    <Layout>
      <PageHeader
        title="해외선교"
        subtitle="땅끝까지 복음을 전하는 사명을 감당합니다"
        label="International Missions"
      />

      {/* Main Content Section */}
      <section style={{ background: 'oklch(0.97 0.005 75)' }}>
        <div className="max-w-5xl mx-auto py-20 px-6 md:px-12 lg:px-20">
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
              사역 소개
            </h2>
          </div>

          {/* Content Cards */}
          <div className="space-y-8">
            <div
              className="p-8 rounded-sm"
              style={{
                background: 'oklch(0.985 0.003 75)',
                border: '1px solid oklch(0.92 0.005 75)',
                boxShadow: '0 2px 8px oklch(0.30 0.09 265 / 0.06)'
              }}
            >
              <p
                className="text-lg leading-relaxed font-korean"
                style={{ color: 'oklch(0.35 0.02 265)' }}
              >
                해외선교부는 예수님의 지상대명령에 순종하여 땅 끝까지 복음을 전하는 사명을 감당합니다.
                전 세계에 파송된 선교사님들을 후원하고 협력하며, 단기선교팀을 파견하여 현지 사역을 돕습니다.
              </p>
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
                className="text-lg leading-relaxed font-korean"
                style={{ color: 'oklch(0.35 0.02 265)' }}
              >
                모든 성도들이 선교에 동참할 수 있도록 기도와 후원, 단기선교 참여 등 다양한 방법을 제시하고 격려합니다.
              </p>
            </div>
          </div>

          {/* Mission Regions Section */}
          <div className="mt-20">
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
                선교 지역
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { region: '아시아', countries: '필리핀, 캄보디아, 베트남' },
                { region: '아프리카', countries: '케냐, 우간다, 탄자니아' },
                { region: '중남미', countries: '멕시코, 과테말라, 에콰도르' },
                { region: '중동', countries: '터키, 이스라엘, 요르단' },
                { region: '유럽', countries: '독일, 영국, 프랑스' },
                { region: '북미', countries: '미국, 캐나다' },
              ].map((item, index) => (
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
                    {item.region}
                  </h3>
                  <p
                    className="text-sm font-korean"
                    style={{ color: 'oklch(0.55 0.01 75)' }}
                  >
                    {item.countries}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Participation Section */}
          <div className="mt-20">
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
                참여 방법
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
              <div className="space-y-4">
                <div className="flex items-start">
                  <div
                    className="w-1.5 h-1.5 rounded-full mt-2 mr-3"
                    style={{ background: 'oklch(0.72 0.10 75)' }}
                  />
                  <p className="font-korean" style={{ color: 'oklch(0.35 0.02 265)' }}>
                    <span className="font-semibold">선교 헌금:</span> 선교사님들의 사역과 생활을 후원합니다
                  </p>
                </div>
                <div className="flex items-start">
                  <div
                    className="w-1.5 h-1.5 rounded-full mt-2 mr-3"
                    style={{ background: 'oklch(0.72 0.10 75)' }}
                  />
                  <p className="font-korean" style={{ color: 'oklch(0.35 0.02 265)' }}>
                    <span className="font-semibold">단기선교:</span> 여름/겨울 방학 기간 단기선교팀에 참여합니다
                  </p>
                </div>
                <div className="flex items-start">
                  <div
                    className="w-1.5 h-1.5 rounded-full mt-2 mr-3"
                    style={{ background: 'oklch(0.72 0.10 75)' }}
                  />
                  <p className="font-korean" style={{ color: 'oklch(0.35 0.02 265)' }}>
                    <span className="font-semibold">선교 기도회:</span> 매월 셋째 주 수요일 선교 기도회에 참석합니다
                  </p>
                </div>
                <div className="flex items-start">
                  <div
                    className="w-1.5 h-1.5 rounded-full mt-2 mr-3"
                    style={{ background: 'oklch(0.72 0.10 75)' }}
                  />
                  <p className="font-korean" style={{ color: 'oklch(0.35 0.02 265)' }}>
                    <span className="font-semibold">선교사 서신:</span> 정기적인 소식을 통해 기도와 후원에 동참합니다
                  </p>
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

export default InternationalMissionsPage
