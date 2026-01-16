// ===========================================
// VS Design Diverge: Elementary Ministry Page
// OKLCH Color System + Editorial Minimalism
// ===========================================

import Layout from '@/components/Layout'
import PageHeader from '@/components/PageHeader'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const ElementaryPage = () => {
  const sundayPrograms = ['찬양과 경배', '말씀 나눔', '소그룹 활동', '만들기 및 게임']
  const specialActivities = ['여름/겨울 성경학교', '체험학습 및 견학', '발표회 및 축제', '부모님과 함께하는 행사']

  const educationalGoals = [
    { title: '믿음의 기초 확립', description: '성경적 세계관 형성과 기독교 가치관 정립' },
    { title: '인격적 성장', description: '하나님의 사랑 안에서 건전한 자아정체성 형성' },
    { title: '공동체 의식', description: '서로 사랑하고 섬기는 공동체 정신 함양' },
    { title: '리더십 개발', description: '미래의 교회와 사회를 이끌 리더로 준비' }
  ]

  return (
    <Layout>
      <PageHeader
        title="초등부"
        subtitle="세상을 이기는 믿음의 용사"
        label="교육부서"
      />

      {/* Main Content */}
      <section style={{ background: 'oklch(0.97 0.005 75)' }}>
        <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
          {/* Vision Section */}
          <div className="mb-16">
            <div className="h-0.5 w-12 mb-6" style={{ background: 'linear-gradient(90deg, oklch(0.72 0.10 75), oklch(0.45 0.12 265))' }} />
            <h2 className="font-headline font-bold mb-4" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', letterSpacing: '-0.02em', color: 'oklch(0.25 0.05 265)' }}>
              초등부 비전
            </h2>
            <p className="leading-relaxed max-w-3xl" style={{ color: 'oklch(0.55 0.01 75)' }}>
              8-13세 학생들이 하나님을 인격적으로 만나는 공간입니다. 초등부는 예배와 소그룹 활동을 통해
              하나님을 인격적으로 만나고, 세상을 살아갈 믿음의 실력을 키우는 부서입니다.
            </p>
          </div>

          {/* Department Info Card */}
          <div
            className="rounded-sm p-8 mb-12"
            style={{
              background: 'oklch(0.985 0.003 75)',
              border: '1px solid oklch(0.92 0.005 75)',
              boxShadow: '0 2px 8px oklch(0.30 0.09 265 / 0.06)'
            }}
          >
            <div className="mb-6">
              <div className="h-0.5 w-8 mb-4" style={{ background: 'oklch(0.72 0.10 75)' }} />
              <h3 className="font-headline font-semibold" style={{ fontSize: '1.25rem', color: 'oklch(0.25 0.05 265)' }}>
                부서 안내
              </h3>
            </div>
            <p className="leading-relaxed mb-4" style={{ color: 'oklch(0.55 0.01 75)' }}>
              체계적인 성경공부와 제자훈련, 그리고 다양한 액티비티를 통해 다음 세대의 리더로 성장하도록 돕습니다.
            </p>
          </div>

          {/* Service Info */}
          <div
            className="rounded-sm p-8 mb-12"
            style={{
              background: 'oklch(0.985 0.003 75)',
              border: '1px solid oklch(0.92 0.005 75)',
              boxShadow: '0 2px 8px oklch(0.30 0.09 265 / 0.06)'
            }}
          >
            <div className="mb-6">
              <div className="h-0.5 w-8 mb-4" style={{ background: 'oklch(0.72 0.10 75)' }} />
              <h3 className="font-headline font-semibold" style={{ fontSize: '1.25rem', color: 'oklch(0.25 0.05 265)' }}>
                예배 정보
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <span className="text-xs font-medium tracking-[0.15em] uppercase block mb-2" style={{ color: 'oklch(0.72 0.10 75)' }}>
                  예배 시간
                </span>
                <p className="font-medium" style={{ color: 'oklch(0.30 0.09 265)' }}>주일 오전 11:00</p>
              </div>
              <div>
                <span className="text-xs font-medium tracking-[0.15em] uppercase block mb-2" style={{ color: 'oklch(0.72 0.10 75)' }}>
                  예배 장소
                </span>
                <p className="font-medium" style={{ color: 'oklch(0.30 0.09 265)' }}>초등부실 (비전센터 1층)</p>
              </div>
              <div>
                <span className="text-xs font-medium tracking-[0.15em] uppercase block mb-2" style={{ color: 'oklch(0.72 0.10 75)' }}>
                  대상 연령
                </span>
                <p className="font-medium" style={{ color: 'oklch(0.30 0.09 265)' }}>8-13세 학생</p>
              </div>
            </div>
          </div>

          {/* Programs Section */}
          <div className="mb-12">
            <div className="h-0.5 w-12 mb-6" style={{ background: 'linear-gradient(90deg, oklch(0.72 0.10 75), oklch(0.45 0.12 265))' }} />
            <h2 className="font-headline font-bold mb-8" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', letterSpacing: '-0.02em', color: 'oklch(0.25 0.05 265)' }}>
              교육 프로그램
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sunday Programs */}
              <div
                className="rounded-sm p-8"
                style={{
                  background: 'oklch(0.985 0.003 75)',
                  border: '1px solid oklch(0.92 0.005 75)',
                  boxShadow: '0 2px 8px oklch(0.30 0.09 265 / 0.06)'
                }}
              >
                <span className="text-xs font-medium tracking-[0.15em] uppercase block mb-4" style={{ color: 'oklch(0.72 0.10 75)' }}>
                  주일 프로그램
                </span>
                <ul className="space-y-3">
                  {sundayPrograms.map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      <div className="w-1.5 h-1.5 rounded-full mt-2 mr-3" style={{ background: 'oklch(0.72 0.10 75)' }} />
                      <span style={{ color: 'oklch(0.45 0.03 265)' }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Special Activities */}
              <div
                className="rounded-sm p-8"
                style={{
                  background: 'oklch(0.985 0.003 75)',
                  border: '1px solid oklch(0.92 0.005 75)',
                  boxShadow: '0 2px 8px oklch(0.30 0.09 265 / 0.06)'
                }}
              >
                <span className="text-xs font-medium tracking-[0.15em] uppercase block mb-4" style={{ color: 'oklch(0.72 0.10 75)' }}>
                  특별 활동
                </span>
                <ul className="space-y-3">
                  {specialActivities.map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      <div className="w-1.5 h-1.5 rounded-full mt-2 mr-3" style={{ background: 'oklch(0.72 0.10 75)' }} />
                      <span style={{ color: 'oklch(0.45 0.03 265)' }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Educational Goals */}
          <div className="mb-12">
            <div className="h-0.5 w-12 mb-6" style={{ background: 'linear-gradient(90deg, oklch(0.72 0.10 75), oklch(0.45 0.12 265))' }} />
            <h2 className="font-headline font-bold mb-8" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', letterSpacing: '-0.02em', color: 'oklch(0.25 0.05 265)' }}>
              교육 목표
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {educationalGoals.map((goal, idx) => (
                <div
                  key={idx}
                  className="rounded-sm p-6"
                  style={{
                    background: 'oklch(0.985 0.003 75)',
                    border: '1px solid oklch(0.92 0.005 75)',
                    boxShadow: '0 2px 8px oklch(0.30 0.09 265 / 0.06)'
                  }}
                >
                  <div className="flex items-start">
                    <div className="w-1.5 h-1.5 rounded-full mt-2 mr-3" style={{ background: 'oklch(0.72 0.10 75)' }} />
                    <div>
                      <h4 className="font-semibold mb-2" style={{ color: 'oklch(0.25 0.05 265)' }}>{goal.title}</h4>
                      <p className="text-sm" style={{ color: 'oklch(0.55 0.01 75)' }}>{goal.description}</p>
                    </div>
                  </div>
                </div>
              ))}
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

export default ElementaryPage
