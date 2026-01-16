import React, { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { HeroSlide as DBHeroSlide } from '../../types/supabase'

// ===========================================
// VS Design Diverge: Editorial Minimalism
// Ken Burns + Grain + Staggered Animation
// ===========================================

// 번역 기반 슬라이드 (기본 폴백)
interface TranslationSlide {
  title: string
  subtitle: string
}

// DB 기반 슬라이드 (이미지 포함)
interface DBSlide {
  id: string
  title: string
  subtitle: string | null
  image_url: string | null
  link_url: string | null
  link_text?: string | null
}

interface HeroSliderProps {
  slides?: TranslationSlide[]  // 번역 기반 슬라이드 (폴백)
  dbSlides?: DBSlide[]         // DB 기반 슬라이드 (우선순위)
  fontClass?: string
}

// 기본 커뮤니티 이미지 (DB 슬라이드에 이미지가 없을 때 폴백)
const communityImages = [
  '/images/community/community1.jpg',
  '/images/community/community2.jpg',
  '/images/community/community3.jpg',
  '/images/community/community4.jpg',
  '/images/community/community5.jpg',
  '/images/community/community6.jpg',
]

const HeroSlider: React.FC<HeroSliderProps> = ({ slides = [], dbSlides = [], fontClass }) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // DB 슬라이드가 있으면 우선 사용, 없으면 번역 슬라이드 사용
  const activeSlides = useMemo(() => {
    if (dbSlides && dbSlides.length > 0) {
      return dbSlides.map((slide) => ({
        id: slide.id,
        title: slide.title,
        subtitle: slide.subtitle || '',
        image: slide.image_url || communityImages[Math.floor(Math.random() * communityImages.length)],
        linkUrl: slide.link_url,
        isDBSlide: true,
      }))
    }

    return slides.map((slide, index) => ({
      id: `translation-${index}`,
      title: slide.title,
      subtitle: slide.subtitle,
      image: communityImages[Math.floor(Math.random() * communityImages.length)],
      linkUrl: null as string | null,
      isDBSlide: false,
    }))
  }, [slides, dbSlides])

  // 자동 슬라이드 with transition state
  useEffect(() => {
    if (activeSlides.length <= 1) return

    const timer = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % activeSlides.length)
        setIsTransitioning(false)
      }, 100)
    }, 7000) // 7초로 늘려서 Ken Burns 효과가 더 잘 보이게

    return () => clearInterval(timer)
  }, [activeSlides.length])

  if (activeSlides.length === 0) {
    return null
  }

  return (
    <section className="relative h-screen overflow-hidden bg-church-neutral-950">
      {activeSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* Ken Burns Image Container */}
          <div className="absolute inset-0 ken-burns-container">
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className={`object-cover transition-transform duration-[12000ms] ease-in-out ${
                index === currentSlide ? 'scale-110' : 'scale-100'
              }`}
              priority={index === 0}
              sizes="100vw"
            />
          </div>

          {/* Grain Texture Overlay */}
          <div
            className="absolute inset-0 z-20 pointer-events-none opacity-[0.04] mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Editorial Gradient Overlay - 좌측에서 더 어둡게 */}
          <div
            className="absolute inset-0 z-10"
            style={{
              background: `linear-gradient(
                135deg,
                oklch(0.12 0.04 265 / 0.92) 0%,
                oklch(0.18 0.06 265 / 0.75) 35%,
                oklch(0.25 0.05 265 / 0.5) 60%,
                oklch(0.30 0.04 265 / 0.3) 100%
              )`,
            }}
          />

          {/* Gold Accent Line (상단) */}
          <div
            className="absolute top-0 left-0 right-0 h-1 z-30"
            style={{
              background: 'linear-gradient(90deg, oklch(0.72 0.10 75) 0%, transparent 50%)',
            }}
          />

          {/* Content - Editorial Left Aligned */}
          <div className="absolute inset-0 z-20 flex items-center">
            <div className="container mx-auto px-6 md:px-12 lg:px-24">
              <div className="max-w-3xl">
                {/* Micro Label */}
                <div
                  className={`mb-6 transition-all duration-700 ease-out ${
                    index === currentSlide && !isTransitioning
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-4'
                  }`}
                  style={{ transitionDelay: '0.1s' }}
                >
                  <span
                    className="inline-block px-3 py-1.5 text-xs font-medium tracking-[0.2em] uppercase"
                    style={{
                      color: 'oklch(0.82 0.08 75)',
                      borderLeft: '2px solid oklch(0.72 0.10 75)',
                      paddingLeft: '12px',
                    }}
                  >
                    State College Korean Church
                  </span>
                </div>

                {/* Title - 극단적 크기 */}
                <h1
                  className={`font-headline font-black text-white mb-6 leading-[0.95] transition-all duration-700 ease-out ${
                    index === currentSlide && !isTransitioning
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-8'
                  }`}
                  style={{
                    fontSize: 'clamp(2.5rem, 7vw, 5.5rem)',
                    letterSpacing: '-0.03em',
                    textShadow: '0 4px 24px oklch(0.15 0.05 265 / 0.4)',
                    transitionDelay: '0.2s',
                  }}
                >
                  {slide.title}
                </h1>

                {/* Accent Line */}
                <div
                  className={`h-0.5 mb-8 transition-all duration-700 ease-out ${
                    index === currentSlide && !isTransitioning
                      ? 'opacity-100 w-24'
                      : 'opacity-0 w-0'
                  }`}
                  style={{
                    background: 'linear-gradient(90deg, oklch(0.72 0.10 75), oklch(0.45 0.12 265))',
                    transitionDelay: '0.35s',
                  }}
                />

                {/* Subtitle */}
                {slide.subtitle && (
                  <p
                    className={`text-lg md:text-xl lg:text-2xl font-light max-w-2xl leading-relaxed transition-all duration-700 ease-out ${
                      index === currentSlide && !isTransitioning
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-6'
                    }`}
                    style={{
                      color: 'oklch(0.92 0.005 75)',
                      transitionDelay: '0.45s',
                    }}
                  >
                    {slide.subtitle}
                  </p>
                )}

                {/* CTA Button */}
                {slide.linkUrl && (
                  <Link
                    href={slide.linkUrl}
                    className={`inline-flex items-center mt-10 group transition-all duration-700 ease-out ${
                      index === currentSlide && !isTransitioning
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-6'
                    }`}
                    style={{ transitionDelay: '0.6s' }}
                  >
                    <span
                      className="px-6 py-3 font-medium text-sm tracking-wide transition-all duration-300"
                      style={{
                        background: 'oklch(0.72 0.10 75)',
                        color: 'oklch(0.15 0.05 265)',
                      }}
                    >
                      자세히 보기
                    </span>
                    <span
                      className="flex items-center justify-center w-12 h-12 transition-all duration-300 group-hover:translate-x-1"
                      style={{
                        background: 'oklch(0.58 0.11 75)',
                        color: 'oklch(0.15 0.05 265)',
                      }}
                    >
                      <ArrowRight className="w-5 h-5" />
                    </span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Slide Indicators - 좌측 하단, 수직 배치 (Editorial 스타일) */}
      {activeSlides.length > 1 && (
        <div className="absolute bottom-12 left-6 md:left-12 lg:left-24 z-30 flex flex-col space-y-3">
          {activeSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsTransitioning(true)
                setTimeout(() => {
                  setCurrentSlide(index)
                  setIsTransitioning(false)
                }, 100)
              }}
              className="group flex items-center space-x-3 transition-all duration-300"
              aria-label={`슬라이드 ${index + 1}`}
            >
              <span
                className={`block h-0.5 transition-all duration-500 ${
                  index === currentSlide ? 'w-8' : 'w-4 group-hover:w-6'
                }`}
                style={{
                  background: index === currentSlide
                    ? 'oklch(0.72 0.10 75)'
                    : 'oklch(1 0 0 / 0.4)',
                }}
              />
              <span
                className={`text-xs font-medium tracking-wider transition-all duration-300 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'
                }`}
                style={{ color: 'oklch(0.92 0.005 75)' }}
              >
                {String(index + 1).padStart(2, '0')}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Scroll Indicator */}
      <div
        className="absolute bottom-8 right-6 md:right-12 lg:right-24 z-30 flex flex-col items-center space-y-2 animate-pulse-soft"
      >
        <span
          className="text-xs font-medium tracking-[0.2em] uppercase"
          style={{ color: 'oklch(0.92 0.005 75 / 0.6)' }}
        >
          Scroll
        </span>
        <div
          className="w-px h-12"
          style={{
            background: 'linear-gradient(to bottom, oklch(0.72 0.10 75), transparent)',
          }}
        />
      </div>
    </section>
  )
}

export default HeroSlider
