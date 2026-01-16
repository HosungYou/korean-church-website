// ===========================================
// VS Design Diverge: Domestic Missions Page
// OKLCH Color System + Editorial Minimalism
// ===========================================

import Layout from '@/components/Layout'
import PageHeader from '@/components/PageHeader'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const DomesticMissionsPage = () => {
  return (
    <Layout>
      <PageHeader
        title="국내선교"
        subtitle="우리 주변의 이웃을 섬기며 그리스도의 사랑을 실천합니다"
        label="Domestic Missions"
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
                국내선교부는 우리 주변의 소외된 이웃들에게 그리스도의 사랑을 실천하며,
                지역 사회를 섬기는 다양한 사역을 감당하고 있습니다.
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
                주요 사역으로는 미자립교회 지원, 농어촌 봉사활동, 노숙인 사역, 지역아동센터 지원 등이 있으며,
                성도님들의 자발적인 참여와 후원을 통해 이루어집니다.
              </p>
            </div>
          </div>

          {/* Ministry Areas Section */}
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
                주요 사역
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: '미자립교회 지원', desc: '어려운 환경에서 사역하는 교회들을 물질과 기도로 후원합니다' },
                { title: '농어촌 봉사', desc: '일손이 부족한 농어촌 지역을 방문하여 사랑을 실천합니다' },
                { title: '노숙인 사역', desc: '거리의 이웃들에게 따뜻한 밥 한 끼와 복음을 전합니다' },
                { title: '지역아동센터', desc: '지역 사회 아이들의 교육과 돌봄을 지원합니다' },
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
                    {item.title}
                  </h3>
                  <p
                    className="text-sm font-korean"
                    style={{ color: 'oklch(0.55 0.01 75)' }}
                  >
                    {item.desc}
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
                참여 안내
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
                    <span className="font-semibold">정기 후원:</span> 매월 정기 헌금으로 지속적인 사역을 후원합니다
                  </p>
                </div>
                <div className="flex items-start">
                  <div
                    className="w-1.5 h-1.5 rounded-full mt-2 mr-3"
                    style={{ background: 'oklch(0.72 0.10 75)' }}
                  />
                  <p className="font-korean" style={{ color: 'oklch(0.35 0.02 265)' }}>
                    <span className="font-semibold">봉사 참여:</span> 분기별 봉사활동에 직접 참여할 수 있습니다
                  </p>
                </div>
                <div className="flex items-start">
                  <div
                    className="w-1.5 h-1.5 rounded-full mt-2 mr-3"
                    style={{ background: 'oklch(0.72 0.10 75)' }}
                  />
                  <p className="font-korean" style={{ color: 'oklch(0.35 0.02 265)' }}>
                    <span className="font-semibold">기도 동참:</span> 국내선교 기도 모임에 참여하여 함께 기도합니다
                  </p>
                </div>
                <div className="flex items-start">
                  <div
                    className="w-1.5 h-1.5 rounded-full mt-2 mr-3"
                    style={{ background: 'oklch(0.72 0.10 75)' }}
                  />
                  <p className="font-korean" style={{ color: 'oklch(0.35 0.02 265)' }}>
                    <span className="font-semibold">문의:</span> 선교부 담당자에게 연락주세요
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

export default DomesticMissionsPage
