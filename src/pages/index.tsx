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

      {/* Quick Access Icons - Editorial Grid */}
      <section className="bg-church-neutral-50 py-16 relative overflow-hidden">
        {/* Subtle grain texture */}
        <div className="absolute inset-0 bg-grain opacity-30"></div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section header with gold accent */}
          <div className="flex items-center mb-10">
            <div
              className="h-px flex-1 max-w-[60px]"
              style={{ background: 'linear-gradient(90deg, oklch(0.72 0.10 75), transparent)' }}
            />
            <span
              className="px-4 text-xs font-medium tracking-[0.2em] uppercase"
              style={{ color: 'oklch(0.55 0.01 75)' }}
            >
              Quick Access
            </span>
            <div
              className="h-px flex-1"
              style={{ background: 'linear-gradient(90deg, transparent, oklch(0.72 0.10 75) 20%, oklch(0.85 0.006 75))' }}
            />
          </div>

          <div className="grid grid-cols-4 gap-4 md:grid-cols-8 md:gap-6">
            {quickAccessIcons.map((item, index) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.titleKey}
                  href={item.href}
                  className={`group flex flex-col items-center p-4 rounded-sm transition-all duration-500 hover:-translate-y-2 stagger-${(index % 6) + 1}`}
                  style={{
                    animationDelay: `${index * 0.05}s`,
                  }}
                >
                  <div
                    className="w-14 h-14 rounded-sm flex items-center justify-center mb-3 transition-all duration-300 group-hover:scale-110 shadow-church group-hover:shadow-church-lg"
                    style={{
                      background: 'oklch(0.45 0.12 265)',
                    }}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <span
                    className={`text-sm font-medium text-center transition-colors duration-300 ${fontClass}`}
                    style={{ color: 'oklch(0.35 0.008 75)' }}
                  >
                    {t(item.titleKey)}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Worship/Sermon Section - Editorial Cards */}
      <section className="py-24 relative overflow-hidden" style={{ background: 'oklch(0.985 0.003 75)' }}>
        {/* Decorative gradient blob */}
        <div
          className="absolute top-0 right-0 -mt-32 -mr-32 w-[500px] h-[500px] rounded-full blur-3xl opacity-40"
          style={{ background: 'radial-gradient(circle, oklch(0.72 0.10 75 / 0.15), transparent 70%)' }}
        />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Editorial Section Header - Left Aligned */}
          <div className="mb-16">
            <div
              className="h-0.5 w-12 mb-6"
              style={{ background: 'linear-gradient(90deg, oklch(0.72 0.10 75), oklch(0.45 0.12 265))' }}
            />
            <h2
              className={`font-headline font-black mb-4 ${fontClass}`}
              style={{
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                letterSpacing: '-0.03em',
                color: 'oklch(0.22 0.07 265)',
              }}
            >
              {t('home:worship_section.title')}
            </h2>
            <p
              className="text-lg max-w-xl"
              style={{ color: 'oklch(0.55 0.01 75)' }}
            >
              매주 함께 모여 하나님을 경배합니다
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {worshipCards.map((card, index) => (
              <Link href={card.href} key={card.href} className="group block h-full">
                <div
                  className={`card-paper p-8 flex flex-col h-full relative overflow-hidden stagger-${index + 1}`}
                >
                  {/* Gold accent line on hover */}
                  <div
                    className="absolute top-0 left-0 w-full h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                    style={{ background: 'linear-gradient(90deg, oklch(0.72 0.10 75), transparent)' }}
                  />

                  {/* Card number */}
                  <span
                    className="text-xs font-medium tracking-[0.15em] uppercase mb-6"
                    style={{ color: 'oklch(0.72 0.10 75)' }}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <h3
                    className={`font-headline font-bold text-xl mb-4 ${fontClass}`}
                    style={{ color: 'oklch(0.30 0.09 265)' }}
                  >
                    {card.title}
                  </h3>

                  <p
                    className={`mb-8 flex-grow leading-relaxed ${fontClass}`}
                    style={{ color: 'oklch(0.45 0.01 75)' }}
                  >
                    {card.description}
                  </p>

                  <div
                    className={`flex items-center font-semibold text-sm ${fontClass} transition-colors duration-300`}
                    style={{ color: 'oklch(0.45 0.12 265)' }}
                  >
                    {card.cta}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-2" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* First-Time Visitors Section - Accent Style */}
      <section className="py-24 relative" style={{ background: 'oklch(0.97 0.01 265)' }}>
        <div className="absolute inset-0 bg-grain opacity-20"></div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header with Accent Background */}
          <div className="mb-16 flex items-end justify-between">
            <div>
              <span
                className="text-xs font-medium tracking-[0.2em] uppercase mb-4 block"
                style={{ color: 'oklch(0.72 0.10 75)' }}
              >
                For Newcomers
              </span>
              <h2
                className={`font-headline font-black ${fontClass}`}
                style={{
                  fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                  letterSpacing: '-0.02em',
                  color: 'oklch(0.30 0.09 265)',
                }}
              >
                {t('home:first_time_section.title')}
              </h2>
            </div>
            <div
              className="hidden md:block h-px flex-1 max-w-xs ml-8"
              style={{ background: 'linear-gradient(90deg, oklch(0.45 0.12 265 / 0.3), transparent)' }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featureCards.map((card, index) => (
              <Link href={card.href} key={card.title} className="group block">
                <div
                  className={`card-accent p-6 h-full flex flex-col stagger-${index + 1}`}
                >
                  {/* Accent dot */}
                  <div
                    className="w-2 h-2 rounded-full mb-4"
                    style={{ background: 'oklch(0.72 0.10 75)' }}
                  />

                  <h3
                    className={`font-headline font-bold text-lg mb-3 ${fontClass}`}
                    style={{ color: 'oklch(0.25 0.02 75)' }}
                  >
                    {card.title}
                  </h3>

                  <p
                    className={`text-sm leading-relaxed mb-6 flex-grow ${fontClass}`}
                    style={{ color: 'oklch(0.50 0.01 75)' }}
                  >
                    {card.description}
                  </p>

                  <div
                    className={`flex items-center text-sm font-medium ${fontClass} transition-all duration-300 group-hover:translate-x-1`}
                    style={{ color: 'oklch(0.45 0.12 265)' }}
                  >
                    {t('home:first_time_section.cta')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Email Subscription Section - Deep Indigo with Gold Accent */}
      <section
        className="py-24 relative overflow-hidden"
        style={{ background: 'oklch(0.22 0.07 265)' }}
      >
        {/* Grain overlay */}
        <div className="absolute inset-0 bg-grain opacity-[0.03]"></div>

        {/* Gold accent line at top */}
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{ background: 'linear-gradient(90deg, oklch(0.72 0.10 75), oklch(0.45 0.12 265) 50%, transparent)' }}
        />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div
            className="p-10 md:p-16 rounded-sm relative overflow-hidden"
            style={{
              background: 'oklch(0.25 0.06 265 / 0.5)',
              backdropFilter: 'blur(8px)',
              border: '1px solid oklch(1 0 0 / 0.08)',
            }}
          >
            {/* Subtle gradient accent */}
            <div
              className="absolute top-0 right-0 w-1/2 h-full opacity-30"
              style={{
                background: 'radial-gradient(ellipse at top right, oklch(0.72 0.10 75 / 0.2), transparent 60%)',
              }}
            />

            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10 relative z-10">
              <div className="lg:w-1/2">
                <div className="flex items-center mb-6">
                  <div
                    className="w-12 h-12 rounded-sm flex items-center justify-center mr-4"
                    style={{ background: 'oklch(0.72 0.10 75)' }}
                  >
                    <Mail className="w-6 h-6" style={{ color: 'oklch(0.15 0.05 265)' }} />
                  </div>
                  <h2
                    className={`font-headline font-bold text-2xl md:text-3xl ${fontClass}`}
                    style={{ color: 'oklch(0.98 0.003 75)' }}
                  >
                    {t('home:subscribe_section.title')}
                  </h2>
                </div>
                <p
                  className={`text-lg leading-relaxed ${fontClass}`}
                  style={{ color: 'oklch(0.80 0.01 75)' }}
                >
                  {t('home:subscribe_section.description')}
                </p>
              </div>

              <div className="lg:w-1/2 w-full">
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('home:subscribe_section.placeholder') as string}
                    className={`flex-1 px-5 py-4 rounded-sm transition-all duration-300 ${fontClass}`}
                    style={{
                      background: 'oklch(0.18 0.05 265)',
                      border: '1px solid oklch(1 0 0 / 0.15)',
                      color: 'oklch(0.98 0.003 75)',
                    }}
                    required
                  />
                  <button
                    type="submit"
                    className={`px-8 py-4 font-semibold rounded-sm transition-all duration-300 flex items-center justify-center whitespace-nowrap hover:scale-[1.02] ${fontClass}`}
                    style={{
                      background: 'oklch(0.72 0.10 75)',
                      color: 'oklch(0.15 0.05 265)',
                    }}
                  >
                    <Bell className="w-5 h-5 mr-2" />
                    {t('home:subscribe_section.button')}
                  </button>
                </form>
                {isSubscribed && (
                  <p
                    className={`mt-4 font-medium ${fontClass}`}
                    style={{ color: 'oklch(0.75 0.15 145)' }}
                  >
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
