import type { GetStaticProps, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Layout from '@/components/Layout'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Play, Calendar, MapPin, Heart } from 'lucide-react'
import { useState, useEffect } from 'react'

const Home: NextPage = () => {
  const { t, i18n } = useTranslation(['home', 'common'])
  const [currentSlide, setCurrentSlide] = useState(0)
  
  const heroSlides = [
    {
      image: '/images/hero-bw.svg',
      title: '하나님을 경험하는 교회',
      subtitle: '"오직 성령이 너희에게 임하시면 너희가 권능을 받고 예루살렘과 온 유대와 사마리아와 땅 끝까지 이르러 내 증인이 되리라 하시니라" (행 1:8)'
    },
    {
      image: '/images/Paster and Family.jpg',
      title: '함께하는 믿음의 여정',
      subtitle: '하나님의 사랑 안에서 함께 성장하고 섬기는 공동체'
    },
    {
      image: '/images/hero-bw.svg',
      title: '말씀 중심의 예배',
      subtitle: '살아있는 하나님의 말씀으로 변화되는 삶'
    }
  ]
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const actionCards = [
    {
      icon: Play,
      title: '예배 참여하기',
      description: '주일 예배에 함께하세요',
      href: '/sermons/sunday',
      primary: true
    },
    {
      icon: Calendar,
      title: '교회 일정',
      description: '이번 주 교회 행사를 확인하세요',
      href: '/news/announcements',
      primary: false
    },
    {
      icon: MapPin,
      title: '오시는 길',
      description: '교회 위치와 교통정보',
      href: '/about/directions',
      primary: false
    },
    {
      icon: Heart,
      title: '온라인 헌금',
      description: '언제든지 헌금에 참여하세요',
      href: '/giving',
      primary: false
    }
  ]

  const featureCards = [
    {
      image: '/images/feature-placeholder.svg',
      title: '새가족 안내',
      description: '교회에 처음 방문하시는 분들을 위한 안내입니다.',
      href: '/missions/new-family',
    },
    {
      image: '/images/feature-placeholder.svg',
      title: '교회학교',
      description: '다음 세대를 위한 교육 부서입니다.',
      href: '/education/elementary',
    },
    {
      image: '/images/feature-placeholder.svg',
      title: '소그룹 안내',
      description: '함께 교제하고 성장하는 소그룹에 참여하세요.',
      href: '/missions/discipleship',
    },
    {
      image: '/images/feature-placeholder.svg',
      title: '선교 사역',
      description: '국내외 선교 활동에 참여하세요.',
      href: '/missions/domestic',
    },
  ]

  return (
    <Layout>
      {/* Hero Section with Carousel */}
      <section className="relative h-[80vh] bg-white text-black flex items-center overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={slide.image}
              alt={`Slide ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="relative h-full flex items-center justify-center">
              <div className="text-center max-w-4xl px-4">
                <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl mb-6 font-korean">
                  {slide.title}
                </h1>
                <p className="max-w-3xl mx-auto text-lg text-gray-200 sm:text-xl font-korean">
                  {slide.subtitle}
                </p>
              </div>
            </div>
          </div>
        ))}
        
        {/* Slide indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
        
        {/* Action Cards Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {actionCards.map((card) => {
                const Icon = card.icon
                return (
                  <Link
                    key={card.title}
                    href={card.href}
                    className={`group p-4 rounded-lg transition-all duration-300 ${
                      card.primary
                        ? 'bg-white text-black hover:bg-gray-100'
                        : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm'
                    }`}
                  >
                    <Icon className={`h-6 w-6 mb-2 ${
                      card.primary ? 'text-black' : 'text-white'
                    }`} />
                    <h3 className={`font-semibold text-sm mb-1 font-korean ${
                      card.primary ? 'text-black' : 'text-white'
                    }`}>
                      {card.title}
                    </h3>
                    <p className={`text-xs opacity-80 font-korean ${
                      card.primary ? 'text-black/70' : 'text-white/80'
                    }`}>
                      {card.description}
                    </p>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
            {featureCards.map((card) => (
              <Link href={card.href} key={card.title} className="group block">
                <div className="aspect-[16/9] rounded overflow-hidden relative border border-black/10 bg-white">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="mt-4 border border-black/10 p-5">
                  <h3 className="text-2xl font-bold text-black">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-base text-black/70">
                    {card.description}
                  </p>
                  <div className="mt-4 inline-flex items-center text-black font-semibold">
                    자세히 보기
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'ko', ['common', 'home'])),
    },
  }
}

export default Home
