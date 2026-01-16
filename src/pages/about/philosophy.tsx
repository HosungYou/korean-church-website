// ===========================================
// VS Design Diverge: Philosophy Page
// OKLCH Color System + Editorial Minimalism
// ===========================================

import type { GetStaticProps, NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Layout from '@/components/Layout'
import PageHeader from '@/components/PageHeader'

const Philosophy: NextPage = () => {
  return (
    <Layout>
      <PageHeader
        title="목회 철학"
        subtitle="하나님의 말씀을 기초로 예수 그리스도의 사랑을 실천하는 교회"
        label="Ministry Philosophy"
        height="h-72 md:h-80"
      />

      {/* Vision Section */}
      <section className="py-20" style={{ background: 'oklch(0.985 0.003 75)' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Editorial Section Header */}
            <div className="mb-12">
              <div className="h-0.5 w-12 mb-6" style={{ background: 'linear-gradient(90deg, oklch(0.72 0.10 75), oklch(0.45 0.12 265))' }} />
              <span
                className="text-xs font-medium tracking-[0.2em] uppercase mb-4 block"
                style={{ color: 'oklch(0.72 0.10 75)' }}
              >
                Church Vision
              </span>
              <h2
                className="font-headline font-bold"
                style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', letterSpacing: '-0.02em', color: 'oklch(0.25 0.05 265)' }}
              >
                교회 비전
              </h2>
            </div>

            {/* Vision Statement Card */}
            <div
              className="rounded-sm p-8 md:p-10 mb-8"
              style={{
                background: 'linear-gradient(135deg, oklch(0.30 0.09 265 / 0.05), oklch(0.72 0.10 75 / 0.08))',
                border: '1px solid oklch(0.72 0.10 75 / 0.3)',
              }}
            >
              <p
                className="text-xl md:text-2xl font-semibold leading-relaxed font-korean"
                style={{ color: 'oklch(0.30 0.09 265)' }}
              >
                &ldquo;복음의 생명으로 세상을 아름답게 하는 성령의 교회&rdquo;
              </p>
              <p
                className="text-base md:text-lg mt-4 font-korean"
                style={{ color: 'oklch(0.55 0.01 75)' }}
              >
                A Spirit-filled church that beautifies the world with the life of the Gospel
              </p>
            </div>

            <p className="leading-relaxed font-korean" style={{ color: 'oklch(0.45 0.03 75)' }}>
              스테이트 칼리지 한인교회는 펜실베이니아 주립대학과 지역 사회에서
              하나님의 사랑을 전하고 실천하는 공동체입니다. 우리는 예배와 말씀,
              기도와 교제를 통해 그리스도인으로 성장하며, 다음 세대와 지역 사회를
              섬기는 사명을 감당합니다.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20" style={{ background: 'oklch(0.97 0.005 75)' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Editorial Section Header */}
          <div className="mb-12">
            <div className="h-0.5 w-12 mb-6" style={{ background: 'linear-gradient(90deg, oklch(0.72 0.10 75), oklch(0.45 0.12 265))' }} />
            <span
              className="text-xs font-medium tracking-[0.2em] uppercase mb-4 block"
              style={{ color: 'oklch(0.72 0.10 75)' }}
            >
              Church Mission
            </span>
            <h2
              className="font-headline font-bold"
              style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', letterSpacing: '-0.02em', color: 'oklch(0.25 0.05 265)' }}
            >
              교회 사명
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl">
            {/* Mission Card 1 */}
            <div
              className="rounded-sm p-8 transition-all duration-300 hover:translate-y-[-2px]"
              style={{
                background: 'oklch(0.985 0.003 75)',
                border: '1px solid oklch(0.92 0.005 75)',
                boxShadow: '0 2px 8px oklch(0.30 0.09 265 / 0.06)'
              }}
            >
              <div
                className="w-14 h-14 rounded-sm flex items-center justify-center mb-6"
                style={{ background: 'oklch(0.30 0.09 265 / 0.08)' }}
              >
                <svg className="w-7 h-7" style={{ color: 'oklch(0.45 0.12 265)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-3 font-korean" style={{ color: 'oklch(0.25 0.05 265)' }}>
                하나님 나라의 문화 창출
              </h3>
              <p className="text-sm font-korean leading-relaxed" style={{ color: 'oklch(0.55 0.01 75)' }}>
                말씀과 성령의 능력으로 하나님 나라의 가치관을 실현하는 교회
              </p>
            </div>

            {/* Mission Card 2 */}
            <div
              className="rounded-sm p-8 transition-all duration-300 hover:translate-y-[-2px]"
              style={{
                background: 'oklch(0.985 0.003 75)',
                border: '1px solid oklch(0.92 0.005 75)',
                boxShadow: '0 2px 8px oklch(0.30 0.09 265 / 0.06)'
              }}
            >
              <div
                className="w-14 h-14 rounded-sm flex items-center justify-center mb-6"
                style={{ background: 'oklch(0.30 0.09 265 / 0.08)' }}
              >
                <svg className="w-7 h-7" style={{ color: 'oklch(0.45 0.12 265)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-3 font-korean" style={{ color: 'oklch(0.25 0.05 265)' }}>
                그리스도의 성품을 닮아가는 성도
              </h3>
              <p className="text-sm font-korean leading-relaxed" style={{ color: 'oklch(0.55 0.01 75)' }}>
                예수님의 사랑과 섬김을 본받아 성숙한 그리스도인으로 성장
              </p>
            </div>

            {/* Mission Card 3 */}
            <div
              className="rounded-sm p-8 transition-all duration-300 hover:translate-y-[-2px]"
              style={{
                background: 'oklch(0.985 0.003 75)',
                border: '1px solid oklch(0.92 0.005 75)',
                boxShadow: '0 2px 8px oklch(0.30 0.09 265 / 0.06)'
              }}
            >
              <div
                className="w-14 h-14 rounded-sm flex items-center justify-center mb-6"
                style={{ background: 'oklch(0.30 0.09 265 / 0.08)' }}
              >
                <svg className="w-7 h-7" style={{ color: 'oklch(0.45 0.12 265)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-3 font-korean" style={{ color: 'oklch(0.25 0.05 265)' }}>
                세상을 섬기는 교회
              </h3>
              <p className="text-sm font-korean leading-relaxed" style={{ color: 'oklch(0.55 0.01 75)' }}>
                지역 사회와 열방을 향한 선교와 봉사로 하나님의 사랑을 실천
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-20" style={{ background: 'oklch(0.985 0.003 75)' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Editorial Section Header */}
          <div className="mb-12">
            <div className="h-0.5 w-12 mb-6" style={{ background: 'linear-gradient(90deg, oklch(0.72 0.10 75), oklch(0.45 0.12 265))' }} />
            <span
              className="text-xs font-medium tracking-[0.2em] uppercase mb-4 block"
              style={{ color: 'oklch(0.72 0.10 75)' }}
            >
              Core Values
            </span>
            <h2
              className="font-headline font-bold"
              style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', letterSpacing: '-0.02em', color: 'oklch(0.25 0.05 265)' }}
            >
              핵심 가치
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
            {[
              { num: '1', title: '경건한 예배', desc: '하나님께 드리는 예배를 최우선으로 하며, 성령 충만한 예배를 드립니다' },
              { num: '2', title: '말씀 중심', desc: '하나님의 말씀을 삶의 기준으로 삼고 말씀대로 살아갑니다' },
              { num: '3', title: '기도의 일상화', desc: '새벽기도와 개인 기도를 통해 하나님과 깊은 교제를 나눕니다' },
              { num: '4', title: '가정의 교회화', desc: '각 가정이 작은 교회가 되어 신앙을 전수하고 실천합니다' },
              { num: '5', title: '사랑의 교제', desc: '그리스도의 사랑으로 서로를 돌보고 섬기는 공동체를 이룹니다' },
              { num: '6', title: '섬김과 나눔', desc: '이웃의 아픔에 동참하고 섬기는 것이 교회의 본질적 사명입니다' },
            ].map((item, index) => (
              <div
                key={index}
                className="rounded-sm p-6 md:p-8"
                style={{
                  background: 'oklch(0.97 0.005 75)',
                  border: '1px solid oklch(0.92 0.005 75)',
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-sm flex items-center justify-center font-bold text-sm"
                    style={{
                      background: 'oklch(0.45 0.12 265)',
                      color: 'oklch(0.98 0.003 75)',
                    }}
                  >
                    {item.num}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2 font-korean" style={{ color: 'oklch(0.25 0.05 265)' }}>
                      {item.title}
                    </h3>
                    <p className="text-sm font-korean leading-relaxed" style={{ color: 'oklch(0.55 0.01 75)' }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ministry Philosophy Details */}
      <section className="py-20" style={{ background: 'oklch(0.97 0.005 75)' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Editorial Section Header */}
          <div className="mb-12">
            <div className="h-0.5 w-12 mb-6" style={{ background: 'linear-gradient(90deg, oklch(0.72 0.10 75), oklch(0.45 0.12 265))' }} />
            <span
              className="text-xs font-medium tracking-[0.2em] uppercase mb-4 block"
              style={{ color: 'oklch(0.72 0.10 75)' }}
            >
              Ministry Direction
            </span>
            <h2
              className="font-headline font-bold"
              style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', letterSpacing: '-0.02em', color: 'oklch(0.25 0.05 265)' }}
            >
              목회 방향
            </h2>
          </div>

          <div className="max-w-4xl space-y-6">
            {[
              {
                title: '예배와 영성',
                content: '스테이트 칼리지 한인교회는 경건하고 절제된 예배를 드립니다. 형식적인 예배가 아닌, 성령님의 임재 가운데 드리는 살아있는 예배를 추구합니다. 매주일 예배와 수요예배, 그리고 새벽기도를 통해 하나님과의 친밀한 관계를 유지합니다.'
              },
              {
                title: '교육과 양육',
                content: '성경적 가치관을 바탕으로 한 체계적인 신앙교육을 실시합니다. 유아부터 청년에 이르기까지 각 연령대에 맞는 교육 프로그램을 운영하며, 특별히 다음 세대의 신앙 계승을 위해 힘쓰고 있습니다.'
              },
              {
                title: '선교와 봉사',
                content: '지역 사회와 캠퍼스 선교에 힘쓰며, 유학생과 새로운 이민자들을 돕는 사역을 감당합니다. 또한 국내외 선교사들을 후원하고 단기선교를 통해 복음 전파에 동참합니다.'
              },
              {
                title: '공동체와 교제',
                content: '소그룹 모임과 각 부서별 활동을 통해 깊은 교제를 나눕니다. 서로의 짐을 나누어 지고, 기쁨과 슬픔을 함께하는 진정한 공동체를 이루어 갑니다.'
              },
            ].map((item, index) => (
              <div
                key={index}
                className="rounded-sm p-8"
                style={{
                  background: 'oklch(0.985 0.003 75)',
                  border: '1px solid oklch(0.92 0.005 75)',
                  boxShadow: '0 2px 8px oklch(0.30 0.09 265 / 0.04)'
                }}
              >
                <h3
                  className="text-xl font-bold mb-4 font-korean"
                  style={{ color: 'oklch(0.30 0.09 265)' }}
                >
                  {item.title}
                </h3>
                <p className="leading-relaxed font-korean" style={{ color: 'oklch(0.45 0.03 75)' }}>
                  {item.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pastor's Message Section */}
      <section className="py-20" style={{ background: 'oklch(0.985 0.003 75)' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Editorial Section Header */}
          <div className="mb-12">
            <div className="h-0.5 w-12 mb-6" style={{ background: 'linear-gradient(90deg, oklch(0.72 0.10 75), oklch(0.45 0.12 265))' }} />
            <span
              className="text-xs font-medium tracking-[0.2em] uppercase mb-4 block"
              style={{ color: 'oklch(0.72 0.10 75)' }}
            >
              Pastor&apos;s Message
            </span>
            <h2
              className="font-headline font-bold"
              style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', letterSpacing: '-0.02em', color: 'oklch(0.25 0.05 265)' }}
            >
              담임목사 인사말
            </h2>
          </div>

          <div className="max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div className="order-2 lg:order-1">
                {/* Photo Placeholder */}
                <div
                  className="rounded-sm h-96 flex items-center justify-center"
                  style={{
                    background: 'oklch(0.92 0.005 75)',
                    border: '1px solid oklch(0.88 0.005 75)',
                  }}
                >
                  <p className="font-korean" style={{ color: 'oklch(0.55 0.01 75)' }}>담임목사 사진 위치</p>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="space-y-5">
                  <p className="leading-relaxed font-korean" style={{ color: 'oklch(0.45 0.03 75)' }}>
                    주님의 이름으로 문안드립니다.
                  </p>
                  <p className="leading-relaxed font-korean" style={{ color: 'oklch(0.45 0.03 75)' }}>
                    스테이트 칼리지 한인교회는 펜실베이니아 중부 지역에서
                    하나님의 사랑을 전하고 실천하는 믿음의 공동체입니다.
                  </p>
                  <p className="leading-relaxed font-korean" style={{ color: 'oklch(0.45 0.03 75)' }}>
                    우리 교회는 예수 그리스도의 복음을 통해 영혼을 구원하고,
                    하나님의 말씀으로 양육하며, 성령의 능력으로 세상을 변화시키는
                    사명을 감당하고자 합니다.
                  </p>
                  <p className="leading-relaxed font-korean" style={{ color: 'oklch(0.45 0.03 75)' }}>
                    특별히 Penn State 대학의 유학생들과 이 지역에 거주하시는
                    한인 가정들이 신앙 안에서 하나 되어, 서로 사랑하고
                    섬기는 아름다운 교회를 만들어가기를 소망합니다.
                  </p>
                  <p className="leading-relaxed font-korean" style={{ color: 'oklch(0.45 0.03 75)' }}>
                    여러분을 주님의 사랑으로 환영하며, 함께 하나님 나라를
                    세워가는 동역자가 되기를 기도합니다.
                  </p>
                  <div className="pt-6">
                    <p className="font-bold font-korean" style={{ color: 'oklch(0.30 0.09 265)' }}>
                      스테이트 칼리지 한인교회 담임목사
                    </p>
                    <p
                      className="text-2xl font-bold mt-2 font-korean"
                      style={{ color: 'oklch(0.45 0.12 265)' }}
                    >
                      연규홍 목사
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

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'ko', ['common'])),
    },
  }
}

export default Philosophy
