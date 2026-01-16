// ===========================================
// VS Design Diverge: About Main Page
// OKLCH Color System + Editorial Minimalism
// ===========================================

import type { GetStaticProps, NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Layout from '@/components/Layout'
import PageHeader from '@/components/PageHeader'
import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const AboutMain: NextPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      id: 1,
      category: "사명 선교",
      title: "지역 안의 모든 사랑이 하나",
      description: "스테이트 칼리지 한인교회는 교회 건물성과 지역사회를 결과 일상이 있는지에 상관없이 교회의 안전한 교회 기대 중요서 이상과 결정들을 나고 결과와 있습니다.",
      image: "/images/mission.jpg"
    },
    {
      id: 2,
      category: "가정의 교회화",
      title: "늘 하나의 청취, 거룩",
      description: "가정과 교회가 하나가 될 수 있는 교육과 지속적인 활동을 통해 가족들과 함께 성장하고 있습니다. 소그룹 활동을 통해 서로를 돌보며 하나님 안에서 성장해 나갑니다.",
      image: "/images/family.jpg"
    },
    {
      id: 3,
      category: "활음, 기아, 빈곤",
      title: "아와 서로 한국 마음 바라시 허치",
      description: "빈곤과 소외의 문제로 고통받는 이웃들에게 하나님의 사랑을 실천으로 전하며, 지역사회와 해외 선교지에서 필요한 도움을 제공하고 있습니다.",
      image: "/images/outreach.jpg"
    }
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const visionCards = [
    {
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'oklch(0.45 0.12 265)' }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      title: "경건한 예배 중심의 교회",
      verse: "하나님은 영이시니 예배하는 자가 영과 진리로 예배할지니라 (요한복음 4:24)",
      description: "스테이트 칼리지 한인교회는 개혁교회 정통을 인정을 지키며 경건한 예배를 추구하는 예배 중심의 교회입니다."
    },
    {
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'oklch(0.45 0.12 265)' }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: "그리스도 안에서 한 몸을 이루는 교회",
      verse: "우리 많은 사람이 그리스도 안에서 한 몸이 되어 서로 지체가 되었느니라 (로마서 12:5)",
      description: "스테이트 칼리지 한인교회는 여러 형태의 만남간 가운용 활발하고, 아울러 일째 날음을 실천하며 살아가는 유기적 공동체입니다."
    },
    {
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'oklch(0.45 0.12 265)' }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      title: "세상을 아름답게 만드는 교회",
      verse: "하나님이 지으신 그 모든 것을 보시니 보시기에 심히 좋았더라 (창세기 1:31)",
      description: "스테이트 칼리지 한인교회는 하나님이 창조하신 아름다운 피조세계를 회복하고변화), 공동선(이미용을 실천(교과이), 복인 주인로 동기 위해(제한민인) 노력합니다."
    },
    {
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'oklch(0.45 0.12 265)' }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      title: "그리스도의 인격을 닮은 리더를 세우는 교회",
      verse: "너희는 세상의 소금이니 소금이 만일 그 맛을 잃으면 무엇으로 짜게 하리요 (마태복음 5:13)",
      description: "스테이트 칼리지 한인교회는 다음 세대와 협은이가 섭새에 선한 영향력을 끼치는 신앙한 리더가 되도록 체계적으로 양육합니다."
    },
    {
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'oklch(0.45 0.12 265)' }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "복음이 살아있는 교회",
      verse: "또 이르시되 너희는 온 천하에 다니며 만민에게 복음을 전파라 (마가복음 16:15)",
      description: "스테이트 칼리지 한인교회는 예수 그리스도의 복음으로 죽어가는 영적생명을 살리고 선한 직인 예수 그리스도를 증거하는 교회입니다."
    }
  ]

  return (
    <Layout>
      {/* Hero Section with PageHeader */}
      <PageHeader
        title="복음의 생명으로 세상을 아름답게 하는 성령의 교회"
        subtitle="스테이트 칼리지 한인교회는 복음전파와 이웃 사랑으로 죽어가는 생명을 살리고 세상을 아름답게 만드시는 아버지 교회를 닮아가는 생명의 유기체로 만드는 바로 성령이십니다."
        label="교회 소개"
        height="h-[420px] md:h-[480px]"
      />

      {/* Vision Cards Section */}
      <section
        className="py-20"
        style={{ background: 'oklch(0.985 0.003 75)' }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
              우리의 비전
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visionCards.map((card, index) => (
              <div
                key={index}
                className="p-8 rounded-sm transition-all duration-300 hover:translate-y-[-4px]"
                style={{
                  background: 'oklch(0.985 0.003 75)',
                  border: '1px solid oklch(0.92 0.005 75)',
                  boxShadow: '0 2px 8px oklch(0.30 0.09 265 / 0.06)'
                }}
              >
                {/* Icon */}
                <div
                  className="w-16 h-16 mb-6 rounded-full flex items-center justify-center"
                  style={{ background: 'oklch(0.97 0.02 265 / 0.5)' }}
                >
                  {card.icon}
                </div>

                {/* Title */}
                <h3
                  className="font-headline font-bold mb-4"
                  style={{
                    fontSize: 'clamp(1.1rem, 2vw, 1.25rem)',
                    color: 'oklch(0.25 0.05 265)',
                    letterSpacing: '-0.01em'
                  }}
                >
                  {card.title}
                </h3>

                {/* Verse */}
                <p
                  className="text-sm leading-relaxed mb-4"
                  style={{ color: 'oklch(0.55 0.01 75)' }}
                >
                  {card.verse}
                </p>

                {/* Description */}
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: 'oklch(0.45 0.02 75)' }}
                >
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Life & Community Section */}
      <section
        className="py-20"
        style={{ background: 'oklch(0.97 0.005 75)' }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
              우리의 활동
            </h2>
          </div>

          <div className="space-y-20">
            {/* Worship Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div
                  className="h-80 flex items-center justify-center rounded-sm"
                  style={{
                    background: 'oklch(0.92 0.005 75)',
                    border: '1px solid oklch(0.90 0.005 75)'
                  }}
                >
                  <p style={{ color: 'oklch(0.55 0.01 75)' }}>예배 이미지</p>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <span
                  className="inline-block px-3 py-1 rounded-sm text-xs font-medium tracking-wider uppercase mb-4"
                  style={{
                    background: 'oklch(0.45 0.12 265 / 0.1)',
                    color: 'oklch(0.45 0.12 265)'
                  }}
                >
                  예배
                </span>
                <h3
                  className="font-headline font-bold mb-4"
                  style={{
                    fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                    color: 'oklch(0.25 0.05 265)',
                    letterSpacing: '-0.02em'
                  }}
                >
                  뉴 노멀의 예배
                </h3>
                <p
                  className="text-lg mb-6"
                  style={{ color: 'oklch(0.40 0.03 265)' }}
                >
                  &ldquo;선함과 사랑이 우리하는 담긴의 대비!&rdquo;
                </p>
                <p
                  className="leading-relaxed"
                  style={{ color: 'oklch(0.55 0.01 75)' }}
                >
                  뉴 노멀 시대에는 온라인 예배를 천는 성도들이 요구는 계속될 것입니다. 스테이트 칼리지 한인교회는 친숙한 시대의 변햄을 품는 온라인 예배를 지향하며, 협로로 진행이 알아하는 공간과 방식 중심의 온라인 예배를 준비합니다.
                </p>
                <div className="mt-6 flex space-x-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: 'oklch(0.45 0.12 265)' }}
                  />
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: 'oklch(0.85 0.01 75)' }}
                  />
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: 'oklch(0.85 0.01 75)' }}
                  />
                </div>
              </div>
            </div>

            {/* Fellowship Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2">
                <div
                  className="h-80 flex items-center justify-center rounded-sm"
                  style={{
                    background: 'oklch(0.92 0.005 75)',
                    border: '1px solid oklch(0.90 0.005 75)'
                  }}
                >
                  <p style={{ color: 'oklch(0.55 0.01 75)' }}>구역모임 이미지</p>
                </div>
              </div>
              <div className="order-1">
                <span
                  className="inline-block px-3 py-1 rounded-sm text-xs font-medium tracking-wider uppercase mb-4"
                  style={{
                    background: 'oklch(0.72 0.10 75 / 0.15)',
                    color: 'oklch(0.58 0.11 75)'
                  }}
                >
                  교제
                </span>
                <h3
                  className="font-headline font-bold mb-4"
                  style={{
                    fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                    color: 'oklch(0.25 0.05 265)',
                    letterSpacing: '-0.02em'
                  }}
                >
                  구역모임
                </h3>
                <p
                  className="text-lg mb-6"
                  style={{ color: 'oklch(0.40 0.03 265)' }}
                >
                  &ldquo;기동 구어나 담아 박옥과 고화&rdquo;
                </p>
                <p
                  className="leading-relaxed"
                  style={{ color: 'oklch(0.55 0.01 75)' }}
                >
                  지구 담임목사는 주일찬교를 비롯으로 한 구역예배 활성화, 대성양 및 전인사양을 지속하니다. 더불어 나그 영역 걸곰원이 만는 성도가이 만내에를, 분석 급동려를 연결하여 교재의 폭을 웨장시킵니다.
                </p>
                <div className="mt-6 flex space-x-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: 'oklch(0.72 0.10 75)' }}
                  />
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: 'oklch(0.85 0.01 75)' }}
                  />
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: 'oklch(0.85 0.01 75)' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Slider Section */}
      <section
        className="py-20"
        style={{ background: 'oklch(0.985 0.003 75)' }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
              우리의 사역
            </h2>
          </div>

          <div className="relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div
                  className="h-80 flex items-center justify-center rounded-sm"
                  style={{
                    background: 'oklch(0.92 0.005 75)',
                    border: '1px solid oklch(0.90 0.005 75)'
                  }}
                >
                  <p style={{ color: 'oklch(0.55 0.01 75)' }}>{slides[currentSlide].category} 이미지</p>
                </div>
              </div>
              <div className="order-1 lg:order-2 relative">
                <span
                  className="inline-block px-3 py-1 rounded-sm text-xs font-medium tracking-wider uppercase mb-4"
                  style={{
                    background: 'oklch(0.45 0.12 265 / 0.1)',
                    color: 'oklch(0.45 0.12 265)'
                  }}
                >
                  {slides[currentSlide].category}
                </span>
                <h3
                  className="font-headline font-bold mb-4"
                  style={{
                    fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                    color: 'oklch(0.25 0.05 265)',
                    letterSpacing: '-0.02em'
                  }}
                >
                  {slides[currentSlide].title}
                </h3>
                <p
                  className="leading-relaxed mb-6"
                  style={{ color: 'oklch(0.55 0.01 75)' }}
                >
                  {slides[currentSlide].description}
                </p>

                {/* Navigation */}
                <div className="flex items-center space-x-4">
                  <button
                    onClick={prevSlide}
                    className="p-2 rounded-full transition-all duration-300"
                    style={{
                      background: 'oklch(0.97 0.005 75)',
                      border: '1px solid oklch(0.90 0.005 75)',
                      color: 'oklch(0.45 0.12 265)'
                    }}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="flex space-x-2">
                    {slides.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className="w-2 h-2 rounded-full transition-all duration-300"
                        style={{
                          background: index === currentSlide
                            ? 'oklch(0.45 0.12 265)'
                            : 'oklch(0.85 0.01 75)'
                        }}
                      />
                    ))}
                  </div>
                  <button
                    onClick={nextSlide}
                    className="p-2 rounded-full transition-all duration-300"
                    style={{
                      background: 'oklch(0.97 0.005 75)',
                      border: '1px solid oklch(0.90 0.005 75)',
                      color: 'oklch(0.45 0.12 265)'
                    }}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
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

export default AboutMain
