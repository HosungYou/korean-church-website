// ===========================================
// VS Design Diverge: Greeting Page
// OKLCH Color System + Editorial Minimalism
// ===========================================

import Layout from '@/components/Layout'
import PageHeader from '@/components/PageHeader'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const GreetingPage = () => {
  return (
    <Layout>
      <PageHeader
        title="인사말"
        subtitle="하나님의 사랑과 은혜가 넘치는 공동체에 오신 것을 환영합니다"
        label="About Us"
      />

      {/* Main Content Section */}
      <section
        className="py-20"
        style={{ background: 'oklch(0.97 0.005 75)' }}
      >
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          {/* Vision Statement Card */}
          <div
            className="p-8 md:p-12 rounded-sm mb-12"
            style={{
              background: 'oklch(0.985 0.003 75)',
              border: '1px solid oklch(0.92 0.005 75)',
              boxShadow: '0 2px 8px oklch(0.30 0.09 265 / 0.06)'
            }}
          >
            {/* Editorial Section Header */}
            <div className="mb-8">
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
                교회 비전
              </h2>
            </div>

            <div className="text-center py-8">
              <p
                className="font-headline font-bold leading-relaxed"
                style={{
                  fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
                  color: 'oklch(0.30 0.09 265)'
                }}
              >
                &ldquo;하나님을 경험하는 교회, 세상을 변화시키는 교회&rdquo;
              </p>
              <p
                className="mt-6 text-lg leading-relaxed"
                style={{ color: 'oklch(0.55 0.01 75)' }}
              >
                우리 교회에 오신 여러분을 진심으로 환영합니다.
              </p>
            </div>
          </div>

          {/* Pastor's Message Card */}
          <div
            className="p-8 md:p-12 rounded-sm"
            style={{
              background: 'oklch(0.985 0.003 75)',
              border: '1px solid oklch(0.92 0.005 75)',
              boxShadow: '0 2px 8px oklch(0.30 0.09 265 / 0.06)'
            }}
          >
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
                담임목사 인사말
              </h2>
            </div>

            <div className="space-y-8">
              {/* Message paragraphs with accent markers */}
              <div className="flex items-start gap-4">
                <div
                  className="w-1.5 h-1.5 rounded-full mt-3 flex-shrink-0"
                  style={{ background: 'oklch(0.72 0.10 75)' }}
                />
                <p
                  className="text-lg leading-relaxed"
                  style={{ color: 'oklch(0.40 0.02 265)' }}
                >
                  이곳은 하나님의 사랑과 은혜가 넘치는 공동체입니다. 우리는 함께 모여 예배하고, 말씀을 배우며, 서로를 위해 기도합니다.
                  성령의 인도하심 속에서 우리는 각자의 삶의 자리에서 빛과 소금의 역할을 감당하며, 이웃과 세상을 섬기는 증인의 삶을 살아가고자 합니다.
                </p>
              </div>

              <div className="flex items-start gap-4">
                <div
                  className="w-1.5 h-1.5 rounded-full mt-3 flex-shrink-0"
                  style={{ background: 'oklch(0.72 0.10 75)' }}
                />
                <p
                  className="text-lg leading-relaxed"
                  style={{ color: 'oklch(0.40 0.02 265)' }}
                >
                  교회는 건물이 아니라 바로 우리 자신입니다. 여러분 한 분 한 분이 모여 교회를 이룹니다.
                  아직 신앙이 없으신 분이라도 괜찮습니다. 열린 마음으로 오셔서 삶의 참된 의미와 목적을 함께 찾아가는 여정에 동참하시길 바랍니다.
                </p>
              </div>

              <div className="flex items-start gap-4">
                <div
                  className="w-1.5 h-1.5 rounded-full mt-3 flex-shrink-0"
                  style={{ background: 'oklch(0.72 0.10 75)' }}
                />
                <p
                  className="text-lg leading-relaxed"
                  style={{ color: 'oklch(0.40 0.02 265)' }}
                >
                  여러분의 삶에 하나님의 놀라운 축복이 함께하시기를 기도합니다.
                </p>
              </div>

              {/* Signature */}
              <div className="pt-8 text-right">
                <div
                  className="h-px w-24 ml-auto mb-4"
                  style={{ background: 'oklch(0.85 0.005 75)' }}
                />
                <p
                  className="font-medium"
                  style={{ color: 'oklch(0.45 0.12 265)' }}
                >
                  담임목사 드림
                </p>
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

export default GreetingPage
