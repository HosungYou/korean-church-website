// ===========================================
// VS Design Diverge: Young Adults Ministry Page
// OKLCH Color System + Editorial Minimalism
// ===========================================

import Layout from '@/components/Layout'
import PageHeader from '@/components/PageHeader'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const YoungAdultsPage = () => {
  return (
    <Layout>
      <PageHeader
        title="청년부"
        subtitle="세상의 중심에서 그리스도를 외치는 세대"
        label="교육부서"
      />

      {/* Main Content */}
      <section style={{ background: 'oklch(0.97 0.005 75)' }}>
        <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
          {/* Vision Section */}
          <div className="mb-16">
            <div className="h-0.5 w-12 mb-6" style={{ background: 'linear-gradient(90deg, oklch(0.72 0.10 75), oklch(0.45 0.12 265))' }} />
            <h2 className="font-headline font-bold mb-4" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', letterSpacing: '-0.02em', color: 'oklch(0.25 0.05 265)' }}>
              청년부
            </h2>
            <p className="leading-relaxed max-w-3xl" style={{ color: 'oklch(0.55 0.01 75)' }}>
              청년부는 학업, 직장, 결혼 등 삶의 중요한 전환기를 맞이하는 청년들이 모여
              말씀과 기도로 서로를 격려하고 지지하며, 세상 속에서 그리스도인으로서의 정체성을 굳건히 세워나가는 공동체입니다.
            </p>
          </div>

          {/* Service Info Card */}
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
                예배 안내
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <span className="text-xs font-medium tracking-[0.15em] uppercase block mb-2" style={{ color: 'oklch(0.72 0.10 75)' }}>
                  예배 시간
                </span>
                <p className="font-medium" style={{ color: 'oklch(0.30 0.09 265)' }}>주일 오후 2:00</p>
              </div>
              <div>
                <span className="text-xs font-medium tracking-[0.15em] uppercase block mb-2" style={{ color: 'oklch(0.72 0.10 75)' }}>
                  장소
                </span>
                <p className="font-medium" style={{ color: 'oklch(0.30 0.09 265)' }}>본당</p>
              </div>
              <div>
                <span className="text-xs font-medium tracking-[0.15em] uppercase block mb-2" style={{ color: 'oklch(0.72 0.10 75)' }}>
                  대상
                </span>
                <p className="font-medium" style={{ color: 'oklch(0.30 0.09 265)' }}>대학생 및 미혼 청년</p>
              </div>
            </div>
          </div>

          {/* Programs Section */}
          <div className="mb-12">
            <div className="h-0.5 w-12 mb-6" style={{ background: 'linear-gradient(90deg, oklch(0.72 0.10 75), oklch(0.45 0.12 265))' }} />
            <h2 className="font-headline font-bold mb-8" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', letterSpacing: '-0.02em', color: 'oklch(0.25 0.05 265)' }}>
              교육 프로그램
            </h2>
            <div
              className="rounded-sm p-8"
              style={{
                background: 'oklch(0.985 0.003 75)',
                border: '1px solid oklch(0.92 0.005 75)',
                boxShadow: '0 2px 8px oklch(0.30 0.09 265 / 0.06)'
              }}
            >
              <p className="leading-relaxed" style={{ color: 'oklch(0.55 0.01 75)' }}>
                치열한 삶의 현장에서 겪는 문제들을 함께 나누고 기도하며, 하나님의 인도하심을 구하는 살아있는 예배를 드립니다.
              </p>
              <ul className="mt-6 space-y-3">
                {['찬양 예배', '말씀 나눔', '소그룹 교제', '청년 수련회', '봉사 활동'].map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <div className="w-1.5 h-1.5 rounded-full mt-2 mr-3" style={{ background: 'oklch(0.72 0.10 75)' }} />
                    <span style={{ color: 'oklch(0.45 0.03 265)' }}>{item}</span>
                  </li>
                ))}
              </ul>
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

export default YoungAdultsPage
