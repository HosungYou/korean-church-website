import type { GetStaticProps, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Layout from '@/components/Layout'
import HeroSlider from '@/components/HeroSlider'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Play, Calendar, MapPin, Heart, Users, BookOpen, Phone, Globe, Mail, Bell } from 'lucide-react'
import { useState, useEffect, useMemo } from 'react'
import { addEmailSubscriber } from '../utils/emailService'
import { getActiveSlides } from '../utils/heroSlideService'
import type { HeroSlide as DBHeroSlide } from '../../types/supabase'

type HeroSlideContent = {
  title: string
  subtitle: string
}

const DEFAULT_HERO_SLIDES: Record<'ko' | 'en', HeroSlideContent[]> = {
  ko: [
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
  ],
  en: [
    {
      title: 'Experience God Together',
      subtitle: '"But you will receive power when the Holy Spirit comes on you; and you will be my witnesses..." (Acts 1:8)'
    },
    {
      title: 'Journey of Faith',
      subtitle: 'Growing together as a community in the love of Christ'
    },
    {
      title: 'Worship Centered on the Word',
      subtitle: 'Lives transformed by the living Word of God'
    }
  ]
}

interface HomeProps {
  dbSlides: DBHeroSlide[]
}

const Home: NextPage<HomeProps> = ({ dbSlides }) => {
  const { t, i18n } = useTranslation(['home', 'common'])
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const fontClass = i18n.language === 'ko' ? 'font-korean' : 'font-english'

  const heroSlides = useMemo<HeroSlideContent[]>(() => {
    const slides = t('home:hero_slides', { returnObjects: true }) as unknown
    if (Array.isArray(slides) && slides.every((slide) => typeof slide?.title === 'string')) {
      return slides as HeroSlideContent[]
    }
    return DEFAULT_HERO_SLIDES[i18n.language === 'ko' ? 'ko' : 'en']
  }, [t, i18n.language])

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    try {
      await addEmailSubscriber(email)
      setIsSubscribed(true)
      setEmail('')
      setTimeout(() => setIsSubscribed(false), 3000)
    } catch (error) {
      console.error('Subscription error:', error)
      alert(t('home:subscribe_section.error'))
    }
  }

  const quickAccessIcons = [
    { icon: Users, titleKey: 'home:quick_access.new_family', href: '/missions/new-family' },
    { icon: BookOpen, titleKey: 'home:quick_access.bulletin', href: '/news/bulletin' },
    { icon: Calendar, titleKey: 'home:quick_access.announcements', href: '/news/announcements' },
    { icon: Play, titleKey: 'home:quick_access.sermons', href: '/sermons' },
    { icon: Globe, titleKey: 'home:quick_access.online_worship', href: '/sermons/sunday' },
    { icon: Heart, titleKey: 'home:quick_access.giving', href: '/giving' },
    { icon: Phone, titleKey: 'home:quick_access.contact', href: '/about/service-info' },
    { icon: MapPin, titleKey: 'home:quick_access.directions', href: '/about/directions' }
  ]

  const worshipCards = [
    {
      title: t('home:worship_section.cards.sunday.title'),
      description: t('home:worship_section.cards.sunday.description'),
      cta: t('home:worship_section.cards.sunday.cta'),
      href: '/sermons/sunday'
    },
    {
      title: t('home:worship_section.cards.wednesday.title'),
      description: t('home:worship_section.cards.wednesday.description'),
      cta: t('home:worship_section.cards.wednesday.cta'),
      href: '/sermons/wednesday'
    },
    {
      title: t('home:worship_section.cards.archive.title'),
      description: t('home:worship_section.cards.archive.description'),
      cta: t('home:worship_section.cards.archive.cta'),
      href: '/sermons'
    }
  ]

  const featureCards = [
    {
      title: t('home:first_time_section.cards.new_family.title'),
      description: t('home:first_time_section.cards.new_family.description'),
      href: '/new-family-guide'
    },
    {
      title: t('home:first_time_section.cards.korean_school.title'),
      description: t('home:first_time_section.cards.korean_school.description'),
      href: '/education/korean-school'
    },
    {
      title: t('home:first_time_section.cards.training.title'),
      description: t('home:first_time_section.cards.training.description'),
      href: '/education/training'
    },
    {
      title: t('home:first_time_section.cards.directions.title'),
      description: t('home:first_time_section.cards.directions.description'),
      href: '/about/directions'
    }
  ]

  return (
    <Layout>
      <HeroSlider slides={heroSlides} dbSlides={dbSlides} fontClass={fontClass} />

      {/* Quick Access Icons */}
      <section className="bg-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-dotted-pattern opacity-30"></div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-4 gap-6 md:grid-cols-8">
            {quickAccessIcons.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.titleKey}
                  href={item.href}
                  className="group flex flex-col items-center p-4 rounded-xl hover:bg-gray-50/80 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center mb-3 group-hover:bg-primary/90 group-hover:scale-110 transition-all duration-300 shadow-md group-hover:shadow-lg">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <span className={`text-sm text-primary font-medium text-center ${fontClass} group-hover:text-secondary transition-colors`}>
                    {t(item.titleKey)}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Worship/Sermon Section */}
      <section className="bg-gray-50 py-20 relative">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mb-12 text-center">
            <h2 className={`text-4xl font-serif font-bold text-primary mb-3 ${fontClass}`}>
              {t('home:worship_section.title')}
            </h2>
            <div className="h-1 w-20 bg-secondary mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {worshipCards.map((card) => (
              <Link href={card.href} key={card.href} className="group block h-full">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 flex flex-col h-full relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-primary/5 rounded-full flex items-center justify-center mr-4 group-hover:bg-primary/10 transition-colors">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                    </div>
                    <h3 className={`text-xl font-bold text-primary ${fontClass}`}>{card.title}</h3>
                  </div>
                  <p className={`text-gray-600 mb-6 flex-grow ${fontClass} leading-relaxed`}>{card.description}</p>
                  <div className={`flex items-center text-secondary font-semibold text-sm ${fontClass} mt-auto`}>
                    {card.cta}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* First-Time Visitors Section */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className={`text-3xl font-serif font-bold text-primary ${fontClass}`}>
              {t('home:first_time_section.title')}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featureCards.map((card) => (
              <Link href={card.href} key={card.title} className="group block">
                <div className="bg-gray-50/50 rounded-xl p-6 hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100 hover:-translate-y-1">
                  <div className="flex items-start mb-4">
                    <div className="w-2 h-2 bg-secondary rounded-full mr-3 mt-2"></div>
                    <div>
                      <h3 className={`text-lg font-bold text-primary mb-2 ${fontClass}`}>
                        {card.title}
                      </h3>
                      <p className={`text-gray-600 text-sm ${fontClass} leading-relaxed`}>
                        {card.description}
                      </p>
                    </div>
                  </div>
                  <div className={`flex items-center text-primary/70 text-sm ${fontClass} group-hover:text-secondary transition-colors`}>
                    {t('home:first_time_section.cta')}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Email Subscription Section */}
      <section className="bg-primary py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-dotted-pattern opacity-5 mix-blend-overlay"></div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-2xl border border-white/10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="md:w-1/2">
                <div className="flex items-center mb-4">
                  <Mail className="w-8 h-8 text-secondary mr-4" />
                  <h2 className={`text-2xl font-serif font-bold text-white ${fontClass}`}>
                    {t('home:subscribe_section.title')}
                  </h2>
                </div>
                <p className={`text-gray-300 text-lg ${fontClass}`}>
                  {t('home:subscribe_section.description')}
                </p>
              </div>

              <div className="md:w-1/2 w-full">
                <form onSubmit={handleSubscribe} className="flex gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('home:subscribe_section.placeholder') as string}
                    className={`flex-1 px-4 py-3 bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all ${fontClass}`}
                    required
                  />
                  <button
                    type="submit"
                    className={`px-6 py-3 bg-secondary text-white font-semibold rounded-lg hover:bg-secondary/90 transition-all shadow-lg flex items-center whitespace-nowrap ${fontClass}`}
                  >
                    <Bell className="w-4 h-4 mr-2" />
                    {t('home:subscribe_section.button')}
                  </button>
                </form>
                {isSubscribed && (
                  <p className={`mt-4 text-green-400 font-medium ${fontClass}`}>
                    {t('home:subscribe_section.success')}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

    </Layout>

  )
}

export const getStaticProps: GetStaticProps<HomeProps> = async ({ locale }) => {
  let dbSlides: DBHeroSlide[] = []

  try {
    dbSlides = await getActiveSlides()
  } catch (error) {
    console.error('Error fetching hero slides:', error)
  }

  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'ko', ['common', 'home'])),
      dbSlides,
    },
    revalidate: 300, // 5분마다 재생성
  }
}

export default Home
