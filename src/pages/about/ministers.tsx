// ===========================================
// VS Design Diverge: Ministers Page
// OKLCH Color System + Editorial Minimalism
// ===========================================

import Layout from '@/components/Layout'
import PageHeader from '@/components/PageHeader'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Image from 'next/image'

const MinistersPage = () => {
  const ministers = [
    { name: '김철수', role: '담임목사', image: '/images/pastor1.jpg' },
    { name: '이영희', role: '부목사', image: '/images/pastor2.jpg' },
    { name: '박현우', role: '교육목사', image: '/images/pastor3.jpg' },
    { name: '최지민', role: '찬양인도', image: '/images/pastor4.jpg' },
  ]

  return (
    <Layout>
      <PageHeader
        title="섬기는 분들"
        subtitle="하나님의 말씀으로 교회를 섬기는 교역자들을 소개합니다"
        label="Our Ministers"
      />

      <div style={{ background: 'oklch(0.97 0.005 75)' }}>
        <div className="mx-auto max-w-7xl py-20 px-4 sm:px-6 lg:px-8">
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
              교역자 소개
            </h2>
          </div>

          {/* Ministers Grid */}
          <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
            {ministers.map((person, index) => (
              <li
                key={person.name}
                className={`rounded-sm p-8 transition-all duration-300 hover:translate-y-[-2px] stagger-${index + 1}`}
                style={{
                  background: 'oklch(0.985 0.003 75)',
                  border: '1px solid oklch(0.92 0.005 75)',
                  boxShadow: '0 2px 8px oklch(0.30 0.09 265 / 0.06)'
                }}
              >
                <div className="flex flex-col items-center text-center">
                  {/* Micro label */}
                  <span
                    className="text-xs font-medium tracking-[0.15em] uppercase mb-4"
                    style={{ color: 'oklch(0.72 0.10 75)' }}
                  >
                    교역자
                  </span>

                  {/* Profile image with accent border */}
                  <div
                    className="relative h-48 w-48 rounded-full overflow-hidden mb-6"
                    style={{
                      border: '3px solid oklch(0.92 0.005 75)',
                      boxShadow: '0 4px 12px oklch(0.30 0.09 265 / 0.08)'
                    }}
                  >
                    <Image src={person.image} alt={person.name} fill className="object-cover" />
                  </div>

                  {/* Name */}
                  <h3
                    className="font-headline font-bold mb-2"
                    style={{
                      fontSize: 'clamp(1.25rem, 2.5vw, 1.5rem)',
                      letterSpacing: '-0.01em',
                      color: 'oklch(0.25 0.05 265)'
                    }}
                  >
                    {person.name}
                  </h3>

                  {/* Role */}
                  <p
                    className="text-lg mb-4"
                    style={{ color: 'oklch(0.45 0.12 265)' }}
                  >
                    {person.role}
                  </p>

                  {/* Description items */}
                  <div className="space-y-2 text-sm" style={{ color: 'oklch(0.55 0.01 75)' }}>
                    <div className="flex items-center justify-center">
                      <div
                        className="w-1.5 h-1.5 rounded-full mr-2"
                        style={{ background: 'oklch(0.72 0.10 75)' }}
                      />
                      <span>섬김의 자세로 목양</span>
                    </div>
                    <div className="flex items-center justify-center">
                      <div
                        className="w-1.5 h-1.5 rounded-full mr-2"
                        style={{ background: 'oklch(0.72 0.10 75)' }}
                      />
                      <span>말씀 중심의 사역</span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* Principles Section */}
          <div
            className="mt-16 rounded-sm p-8"
            style={{
              background: 'oklch(0.985 0.003 75)',
              border: '1px solid oklch(0.92 0.005 75)',
              boxShadow: '0 2px 8px oklch(0.30 0.09 265 / 0.06)'
            }}
          >
            {/* Section Header */}
            <div className="mb-8">
              <div
                className="h-0.5 w-10 mb-4"
                style={{ background: 'linear-gradient(90deg, oklch(0.72 0.10 75), oklch(0.45 0.12 265))' }}
              />
              <h3
                className="font-headline font-bold"
                style={{
                  fontSize: 'clamp(1.25rem, 2.5vw, 1.5rem)',
                  letterSpacing: '-0.02em',
                  color: 'oklch(0.25 0.05 265)'
                }}
              >
                섬김의 원칙
              </h3>
            </div>

            {/* Principles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: '말씀 중심', desc: '성경 말씀을 기초로 한 목양' },
                { title: '사랑의 실천', desc: '하나님의 사랑을 실천하는 섬김' },
                { title: '공동체 세움', desc: '건강한 신앙공동체 건설' }
              ].map((principle, index) => (
                <div
                  key={principle.title}
                  className={`text-center p-4 rounded-sm stagger-${index + 1}`}
                  style={{
                    background: 'oklch(0.97 0.005 75)',
                    border: '1px solid oklch(0.92 0.005 75)'
                  }}
                >
                  <div className="flex items-center justify-center mb-2">
                    <div
                      className="w-1.5 h-1.5 rounded-full mr-2"
                      style={{ background: 'oklch(0.72 0.10 75)' }}
                    />
                    <h4
                      className="font-semibold"
                      style={{ color: 'oklch(0.30 0.09 265)' }}
                    >
                      {principle.title}
                    </h4>
                  </div>
                  <p
                    className="text-sm"
                    style={{ color: 'oklch(0.55 0.01 75)' }}
                  >
                    {principle.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'ko', ['common'])),
  },
})

export default MinistersPage
