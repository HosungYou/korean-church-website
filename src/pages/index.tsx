import type { GetStaticProps, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Layout from '@/components/Layout'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

const Home: NextPage = () => {
  const { t, i18n } = useTranslation(['home', 'common'])

  const featureCards = [
    {
      image: '/images/visitus.jpg',
      title: '새가족 안내',
      description: '교회에 처음 방문하시는 분들을 위한 안내입니다.',
      href: '/about',
    },
    {
      image: '/images/sermon.jpg',
      title: '온라인 예배',
      description: '주일 예배 및 수요 예배를 온라인으로 참여하세요.',
      href: '/sermons',
    },
    {
      image: '/images/nextgen.jpg',
      title: '교회학교',
      description: '다음 세대를 위한 교육 부서입니다.',
      href: '/services',
    },
    {
      image: '/images/community.jpg',
      title: '소그룹 안내',
      description: '함께 교제하고 성장하는 소그룹에 참여하세요.',
      href: '/services',
    },
  ]

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[60vh] bg-white text-black flex items-center">
        <div className="absolute inset-0">
          <Image
            src="/images/church-main-banner.jpg"
            alt="Church"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black opacity-30"></div>
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
            하나님을 경험하는 교회
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-200 sm:text-xl">
            "오직 성령이 너희에게 임하시면 너희가 권능을 받고 예루살렘과 온 유대와 사마리아와 땅 끝까지 이르러 내 증인이 되리라 하시니라" (행 1:8)
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-y-16 sm:grid-cols-2 sm:gap-x-8 lg:gap-x-16">
            {featureCards.map((card) => (
              <Link href={card.href} key={card.title} className="group block">
                <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden relative">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="mt-6">
                  <h3 className="text-2xl font-bold text-black">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-base text-gray-600">
                    {card.description}
                  </p>
                  <div className="mt-4 inline-flex items-center text-black font-semibold group-hover:text-gray-700">
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
