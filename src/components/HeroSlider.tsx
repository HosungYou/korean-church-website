import React, { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { HeroSlide as DBHeroSlide } from '../../types/supabase'

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

  // 자동 슬라이드
  useEffect(() => {
    if (activeSlides.length <= 1) return

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeSlides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [activeSlides.length])

  if (activeSlides.length === 0) {
    return null
  }

  return (
    <section className="relative h-screen overflow-hidden">
      {activeSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover"
            priority={index === 0}
          />

          {/* Gradient overlay for better text visibility and warmth */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-primary/40" />

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white px-4 max-w-4xl">
              <h1
                className={`text-5xl md:text-7xl font-serif font-bold mb-6 drop-shadow-lg ${fontClass ?? ''} ${
                  index === currentSlide ? 'animate-fade-in-up' : 'opacity-0'
                }`}
              >
                {slide.title}
              </h1>
              <div
                className={`h-1 w-24 bg-secondary mx-auto mb-8 rounded-full ${
                  index === currentSlide ? 'animate-fade-in-up' : 'opacity-0'
                }`}
                style={{ animationDelay: '0.2s' }}
              />
              {slide.subtitle && (
                <p
                  className={`text-xl md:text-2xl font-light max-w-3xl mx-auto drop-shadow-md ${fontClass ?? ''} ${
                    index === currentSlide ? 'animate-fade-in-up' : 'opacity-0'
                  }`}
                  style={{ animationDelay: '0.4s' }}
                >
                  {slide.subtitle}
                </p>
              )}

              {/* Link Button (DB 슬라이드에서 링크가 있을 때만 표시) */}
              {slide.linkUrl && (
                <Link
                  href={slide.linkUrl}
                  className={`inline-flex items-center mt-8 px-6 py-3 bg-white/20 hover:bg-white/30
                    backdrop-blur-sm rounded-full text-white font-medium transition-all duration-300
                    ${fontClass ?? ''} ${index === currentSlide ? 'animate-fade-in-up' : 'opacity-0'}`}
                  style={{ animationDelay: '0.6s' }}
                >
                  자세히 보기
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Slide indicators */}
      {activeSlides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {activeSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
              aria-label={`슬라이드 ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default HeroSlider
