import type { GetStaticProps, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Layout from '@/components/Layout'
import HeroSlider from '@/components/HeroSlider'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Play, Calendar, MapPin, Heart, Users, BookOpen, Phone, Globe, Coffee, Clock, User, Gift, Mail, Bell } from 'lucide-react'
import { useState, useEffect } from 'react'
import { addEmailSubscriber } from '../utils/emailService'

const Home: NextPage = () => {
  const { t, i18n } = useTranslation(['home', 'common'])
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)

  const heroSlides = [
    {
      title: '하나님을 경험하는 교회',
      subtitle: '"오직 성령이 너희에게 임하시면 너희가 권능을 받고 예루살렘과 온 유대와 사마리아와 땅 끝까지 이르러 내 증인이 되리라 하시니라" (행 1:8)'
    },
    {
      title: '함께하는 믿음의 여정',
      subtitle: '하나님의 사랑 안에서 함께 성장하고 섬기는 공동체'
    },
    {
      title: '말씀 중심의 예배',
      subtitle: '살아있는 하나님의 말씀으로 변화되는 삶'
    }
  ]

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    
    try {
      await addEmailSubscriber(email)
      setIsSubscribed(true)
      setEmail('')
      setTimeout(() => setIsSubscribed(false), 3000)
    } catch (error) {
      console.error('구독 오류:', error)
      alert('구독 중 오류가 발생했습니다. 다시 시도해주세요.')
    }
  }

  const quickAccessIcons = [
    {
      icon: Users,
      title: '새가족',
      href: '/missions/new-family'
    },
    {
      icon: BookOpen,
      title: '주보',
      href: '/news/bulletin'
    },
    {
      icon: Calendar,
      title: '교회소식',
      href: '/news/announcements'
    },
    {
      icon: Play,
      title: '설교듣기',
      href: '/sermons'
    },
    {
      icon: Globe,
      title: '온라인예배',
      href: '/sermons/sunday'
    },
    {
      icon: Heart,
      title: '헌금안내',
      href: '/giving'
    },
    {
      icon: Phone,
      title: '연락처',
      href: '/about/service-info'
    },
    {
      icon: MapPin,
      title: '오시는길',
      href: '/about/directions'
    }
  ]

  const featureCards = [
    {
      title: '새가족 등록',
      description: '교회에 처음 방문하시는 분들을 위한 안내',
      href: '/new-family-guide',
    },
    {
      title: '한글학교',
      description: '한국어와 한국 문화를 배우는 교육 과정',
      href: '/education/korean-school',
    },
    {
      title: '교육/훈련',
      description: '체계적인 신앙 교육과 제자 훈련',
      href: '/education/training',
    },
    {
      title: '오시는 길',
      description: '교회 위치와 교통 안내',
      href: '/about/directions',
    },
  ]

  return (
    <Layout>
      <HeroSlider slides={heroSlides} />

      {/* Quick Access Icons */}
      <section className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-4 gap-6 md:grid-cols-8">
            {quickAccessIcons.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-3 group-hover:bg-gray-800 transition-colors">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-sm font-korean text-black text-center">
                    {item.title}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* 예배/설교 Section */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-black font-korean">예배/설교</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/sermons/sunday" className="group block">
              <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-3 h-3 bg-black rounded-full mr-3"></div>
                  <h3 className="text-xl font-semibold text-black font-korean">주일예배</h3>
                </div>
                <p className="text-gray-600 font-korean mb-3">매주 일요일 오전 11시</p>
                <div className="flex items-center text-black font-korean text-sm">
                  예배 참여하기
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
            <Link href="/sermons/wednesday" className="group block">
              <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-3 h-3 bg-black rounded-full mr-3"></div>
                  <h3 className="text-xl font-semibold text-black font-korean">수요예배</h3>
                </div>
                <p className="text-gray-600 font-korean mb-3">매주 수요일 저녁 7시 30분</p>
                <div className="flex items-center text-black font-korean text-sm">
                  예배 참여하기
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
            <Link href="/sermons" className="group block">
              <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-3 h-3 bg-black rounded-full mr-3"></div>
                  <h3 className="text-xl font-semibold text-black font-korean">설교 아카이브</h3>
                </div>
                <p className="text-gray-600 font-korean mb-3">지난 설교 다시 듣기</p>
                <div className="flex items-center text-black font-korean text-sm">
                  전체 설교 보기
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 처음 오셨나요? Section */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-black font-korean">처음 오셨나요?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featureCards.map((card) => (
              <Link href={card.href} key={card.title} className="group block">
                <div className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
                  <div className="flex items-start mb-4">
                    <div className="w-3 h-3 bg-black rounded-full mr-3 mt-1"></div>
                    <div>
                      <h3 className="text-lg font-semibold text-black font-korean mb-2">
                        {card.title}
                      </h3>
                      <p className="text-gray-600 font-korean text-sm">
                        {card.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center text-black font-korean text-sm">
                    자세히 보기
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 이메일 구독 Section */}
      <section className="bg-gray-100 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <div className="flex items-center mb-6">
              <div className="w-4 h-4 bg-black rounded-full mr-4"></div>
              <h2 className="text-2xl font-bold text-black font-korean">교회 소식 구독</h2>
            </div>
            <div className="flex items-center mb-4">
              <Mail className="w-6 h-6 text-gray-600 mr-3" />
              <p className="text-gray-700 font-korean">새로운 공지사항과 교회 소식을 이메일로 받아보세요</p>
            </div>
            <form onSubmit={handleSubscribe} className="flex gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일 주소를 입력해주세요"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent font-korean"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-korean flex items-center"
              >
                <Bell className="w-4 h-4 mr-2" />
                구독하기
              </button>
            </form>
            {isSubscribed && (
              <p className="mt-4 text-green-600 font-korean">성공적으로 구독되었습니다!</p>
            )}
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
