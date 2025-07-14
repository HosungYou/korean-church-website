import type { GetStaticProps, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Layout from '@/components/Layout'
import Link from 'next/link'
import Image from 'next/image'

const Home: NextPage = () => {
  const { t, i18n } = useTranslation(['home', 'common'])

  const recentSermons = [
    {
      id: 1,
      title: i18n.language === 'ko' ? '하나님의 사랑' : 'God\'s Love',
      speaker: i18n.language === 'ko' ? '김목사' : 'Pastor Kim',
      date: '2024-01-07',
      videoId: 'dQw4w9WgXcQ'
    },
    {
      id: 2,
      title: i18n.language === 'ko' ? '믿음의 여정' : 'Journey of Faith',
      speaker: i18n.language === 'ko' ? '이목사' : 'Pastor Lee',
      date: '2023-12-31',
      videoId: 'dQw4w9WgXcQ'
    },
    {
      id: 3,
      title: i18n.language === 'ko' ? '소망의 빛' : 'Light of Hope',
      speaker: i18n.language === 'ko' ? '박목사' : 'Pastor Park',
      date: '2023-12-24',
      videoId: 'dQw4w9WgXcQ'
    }
  ]

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-church-primary to-church-secondary">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="text-center">
            <h1 className={`text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl ${
              i18n.language === 'ko' ? 'font-korean' : 'font-english'
            }`}>
              {t('home:hero_title')}
            </h1>
            <p className={`mx-auto mt-6 max-w-2xl text-lg text-gray-100 sm:text-xl ${
              i18n.language === 'ko' ? 'font-korean' : 'font-english'
            }`}>
              {t('home:hero_subtitle')}
            </p>
            <div className="mt-10">
              <Link
                href="/services"
                className={`inline-flex items-center rounded-md bg-white px-6 py-3 text-base font-medium text-church-primary shadow-sm hover:bg-gray-50 ${
                  i18n.language === 'ko' ? 'font-korean' : 'font-english'
                }`}
              >
                {t('home:join_us')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
            <div>
              <h2 className={`text-3xl font-bold text-gray-900 sm:text-4xl ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                {t('home:about_section.title')}
              </h2>
              <p className={`mt-4 text-lg text-gray-600 ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                {t('home:about_section.description')}
              </p>
              <div className="mt-8">
                <Link
                  href="/about"
                  className={`inline-flex items-center text-church-primary hover:text-church-secondary ${
                    i18n.language === 'ko' ? 'font-korean' : 'font-english'
                  }`}
                >
                  {t('home:about_section.learn_more')} →
                </Link>
              </div>
            </div>
            <div className="mt-8 lg:mt-0">
              <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg overflow-hidden">
                <Image
                  src="/images/Rev.-Yeon-e1680566245164.jpg"
                  alt="Pastor photo"
                  width={600}
                  height={400}
                  className="w-full h-96 object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Times */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className={`text-3xl font-bold text-center text-gray-900 mb-12 ${
            i18n.language === 'ko' ? 'font-korean' : 'font-english'
          }`}>
            {t('home:service_schedule.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Sunday Services */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className={`text-xl font-semibold text-gray-900 mb-4 ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                {t('common:sunday')}
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className={i18n.language === 'ko' ? 'font-korean' : 'font-english'}>
                    {t('home:service_schedule.korean_1st')}
                  </span>
                  <span className="font-medium">8:00 AM</span>
                </div>
                <div className="flex justify-between">
                  <span className={i18n.language === 'ko' ? 'font-korean' : 'font-english'}>
                    {t('home:service_schedule.korean_2nd')}
                  </span>
                  <span className="font-medium">11:00 AM</span>
                </div>
                <div className="flex justify-between">
                  <span className={i18n.language === 'ko' ? 'font-korean' : 'font-english'}>
                    {t('home:service_schedule.english')}
                  </span>
                  <span className="font-medium">11:00 AM</span>
                </div>
              </div>
            </div>

            {/* Youth & Children */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className={`text-xl font-semibold text-gray-900 mb-4 ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                {t('common:sunday')}
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className={i18n.language === 'ko' ? 'font-korean' : 'font-english'}>
                    {t('home:service_schedule.youth')}
                  </span>
                  <span className="font-medium">11:00 AM</span>
                </div>
                <div className="flex justify-between">
                  <span className={i18n.language === 'ko' ? 'font-korean' : 'font-english'}>
                    {t('home:service_schedule.children')}
                  </span>
                  <span className="font-medium">11:00 AM</span>
                </div>
              </div>
            </div>

            {/* Weekday Services */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className={`text-xl font-semibold text-gray-900 mb-4 ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                {i18n.language === 'ko' ? '주중 예배' : 'Weekday Services'}
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className={i18n.language === 'ko' ? 'font-korean' : 'font-english'}>
                    {t('home:service_schedule.wednesday')}
                  </span>
                  <span className="font-medium">7:30 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className={i18n.language === 'ko' ? 'font-korean' : 'font-english'}>
                    {t('home:service_schedule.dawn')}
                  </span>
                  <span className="font-medium">6:00 AM</span>
                </div>
              </div>
            </div>
          </div>
          <p className={`text-center text-sm text-gray-600 mt-6 ${
            i18n.language === 'ko' ? 'font-korean' : 'font-english'
          }`}>
            * {t('home:service_schedule.time_zone')}
          </p>
        </div>
      </section>

      {/* Latest Sermons */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className={`text-3xl font-bold text-gray-900 ${
              i18n.language === 'ko' ? 'font-korean' : 'font-english'
            }`}>
              {t('home:latest_sermons.title')}
            </h2>
            <Link
              href="/sermons"
              className={`text-church-primary hover:text-church-secondary ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}
            >
              {t('home:latest_sermons.view_all')} →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentSermons.map((sermon) => (
              <div key={sermon.id} className="bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                  <div className="flex items-center justify-center h-48 bg-gray-300">
                    <span className="text-gray-500">Video Thumbnail</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className={`text-lg font-semibold text-gray-900 mb-1 ${
                    i18n.language === 'ko' ? 'font-korean' : 'font-english'
                  }`}>
                    {sermon.title}
                  </h3>
                  <p className={`text-sm text-gray-600 mb-2 ${
                    i18n.language === 'ko' ? 'font-korean' : 'font-english'
                  }`}>
                    {sermon.speaker} • {sermon.date}
                  </p>
                  <Link
                    href={`/sermons/${sermon.id}`}
                    className={`text-church-primary hover:text-church-secondary text-sm ${
                      i18n.language === 'ko' ? 'font-korean' : 'font-english'
                    }`}
                  >
                    {t('home:latest_sermons.watch')} →
                  </Link>
                </div>
              </div>
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