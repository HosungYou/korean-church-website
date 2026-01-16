// ===========================================
// VS Design Diverge: Discipleship Page
// OKLCH Color System + Editorial Minimalism
// ===========================================

import Layout from '@/components/Layout'
import PageHeader from '@/components/PageHeader'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const DiscipleshipPage = () => {
  return (
    <Layout>
      <PageHeader
        title="제자훈련"
        subtitle="예수님의 성숙한 제자로 성장합니다"
        label="Discipleship Training"
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
              훈련 소개
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
                제자훈련은 모든 성도들이 예수 그리스도의 성숙한 제자로 성장하도록 돕는 체계적인 훈련 과정입니다.
                말씀과 기도를 통해 하나님과의 관계를 깊이 하고, 삶의 모든 영역에서 하나님 나라를 이루어가는 훈련을 받습니다.
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
                소그룹으로 모여 함께 배우고 나누며, 서로의 삶을 격려하고 도전하는 역동적인 훈련을 통해
                세상 속에서 영향력 있는 그리스도인으로 세워집니다.
              </p>
            </div>
          </div>

          {/* Training Programs Section */}
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
                훈련 과정
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: '기초반', desc: '신앙의 기초를 다지는 입문 과정' },
                { title: '성장반', desc: '말씀과 기도의 깊이를 더하는 성장 과정' },
                { title: '사역반', desc: '은사를 발견하고 섬김을 배우는 과정' },
                { title: '리더반', desc: '소그룹 리더로 세워지는 훈련 과정' },
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

          {/* Schedule Section */}
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
                모임 안내
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
                    <span className="font-semibold">시간:</span> 매주 수요일 저녁 7:30
                  </p>
                </div>
                <div className="flex items-start">
                  <div
                    className="w-1.5 h-1.5 rounded-full mt-2 mr-3"
                    style={{ background: 'oklch(0.72 0.10 75)' }}
                  />
                  <p className="font-korean" style={{ color: 'oklch(0.35 0.02 265)' }}>
                    <span className="font-semibold">장소:</span> 교육관 소그룹실
                  </p>
                </div>
                <div className="flex items-start">
                  <div
                    className="w-1.5 h-1.5 rounded-full mt-2 mr-3"
                    style={{ background: 'oklch(0.72 0.10 75)' }}
                  />
                  <p className="font-korean" style={{ color: 'oklch(0.35 0.02 265)' }}>
                    <span className="font-semibold">문의:</span> 교육부 담당자
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

export default DiscipleshipPage
