import type { GetStaticProps, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Layout from '@/components/Layout'
import Image from 'next/image'

const About: NextPage = () => {
  const { t, i18n } = useTranslation(['about', 'common'])

  return (
    <Layout>
      {/* Header Section */}
      <section className="bg-gradient-to-br from-church-primary to-church-secondary py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className={`text-4xl font-bold text-white text-center ${
            i18n.language === 'ko' ? 'font-korean' : 'font-english'
          }`}>
            {t('about:page_title')}
          </h1>
          <p className={`mt-4 text-xl text-gray-100 text-center ${
            i18n.language === 'ko' ? 'font-korean' : 'font-english'
          }`}>
            {t('about:subtitle')}
          </p>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className={`text-3xl font-bold text-gray-900 mb-8 ${
              i18n.language === 'ko' ? 'font-korean' : 'font-english'
            }`}>
              {t('about:vision.title')}
            </h2>
            <p className={`text-xl text-gray-700 mb-6 max-w-4xl mx-auto ${
              i18n.language === 'ko' ? 'font-korean' : 'font-english'
            }`}>
              {t('about:vision.content')}
            </p>
            <div className="bg-church-primary/10 rounded-lg p-6 max-w-4xl mx-auto">
              <p className={`text-church-primary font-medium italic ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                {t('about:vision.scripture')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className={`text-3xl font-bold text-gray-900 mb-12 text-center ${
            i18n.language === 'ko' ? 'font-korean' : 'font-english'
          }`}>
            {t('about:mission.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Worship */}
            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-center">
                <div className="w-16 h-16 bg-church-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
                <h3 className={`text-xl font-bold text-gray-900 mb-2 ${
                  i18n.language === 'ko' ? 'font-korean' : 'font-english'
                }`}>
                  {t('about:mission.worship')}
                </h3>
                <p className={`text-gray-600 ${
                  i18n.language === 'ko' ? 'font-korean' : 'font-english'
                }`}>
                  {t('about:mission.worship_desc')}
                </p>
              </div>
            </div>

            {/* Fellowship */}
            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-center">
                <div className="w-16 h-16 bg-church-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className={`text-xl font-bold text-gray-900 mb-2 ${
                  i18n.language === 'ko' ? 'font-korean' : 'font-english'
                }`}>
                  {t('about:mission.fellowship')}
                </h3>
                <p className={`text-gray-600 ${
                  i18n.language === 'ko' ? 'font-korean' : 'font-english'
                }`}>
                  {t('about:mission.fellowship_desc')}
                </p>
              </div>
            </div>

            {/* Discipleship */}
            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-center">
                <div className="w-16 h-16 bg-church-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className={`text-xl font-bold text-gray-900 mb-2 ${
                  i18n.language === 'ko' ? 'font-korean' : 'font-english'
                }`}>
                  {t('about:mission.discipleship')}
                </h3>
                <p className={`text-gray-600 ${
                  i18n.language === 'ko' ? 'font-korean' : 'font-english'
                }`}>
                  {t('about:mission.discipleship_desc')}
                </p>
              </div>
            </div>

            {/* Evangelism */}
            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-center">
                <div className="w-16 h-16 bg-church-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 4v10a2 2 0 002 2h6a2 2 0 002-2V8M7 8h10M9 12h6m-6 4h6" />
                  </svg>
                </div>
                <h3 className={`text-xl font-bold text-gray-900 mb-2 ${
                  i18n.language === 'ko' ? 'font-korean' : 'font-english'
                }`}>
                  {t('about:mission.evangelism')}
                </h3>
                <p className={`text-gray-600 ${
                  i18n.language === 'ko' ? 'font-korean' : 'font-english'
                }`}>
                  {t('about:mission.evangelism_desc')}
                </p>
              </div>
            </div>

            {/* Missions */}
            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-center">
                <div className="w-16 h-16 bg-church-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className={`text-xl font-bold text-gray-900 mb-2 ${
                  i18n.language === 'ko' ? 'font-korean' : 'font-english'
                }`}>
                  {t('about:mission.missions')}
                </h3>
                <p className={`text-gray-600 ${
                  i18n.language === 'ko' ? 'font-korean' : 'font-english'
                }`}>
                  {t('about:mission.missions_desc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pastor Section */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className={`text-3xl font-bold text-gray-900 mb-12 text-center ${
            i18n.language === 'ko' ? 'font-korean' : 'font-english'
          }`}>
            {t('about:pastor.title')}
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="text-center lg:text-left">
                <Image
                  src="/images/Paster and Family.jpg"
                  alt="Rev. Yoon Seok Yeon"
                  width={400}
                  height={500}
                  className="rounded-lg mx-auto lg:mx-0 mb-6"
                />
                <h3 className={`text-2xl font-bold text-gray-900 mb-4 ${
                  i18n.language === 'ko' ? 'font-korean' : 'font-english'
                }`}>
                  {t('about:pastor.name')}
                </h3>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="space-y-6">
                <div>
                  <h4 className={`text-lg font-semibold text-gray-900 mb-2 ${
                    i18n.language === 'ko' ? 'font-korean' : 'font-english'
                  }`}>
                    {t('about:pastor.education')}
                  </h4>
                  <p className={`text-gray-600 whitespace-pre-line ${
                    i18n.language === 'ko' ? 'font-korean' : 'font-english'
                  }`}>
                    {t('about:pastor.education_detail')}
                  </p>
                </div>
                <div>
                  <h4 className={`text-lg font-semibold text-gray-900 mb-2 ${
                    i18n.language === 'ko' ? 'font-korean' : 'font-english'
                  }`}>
                    {t('about:pastor.experience')}
                  </h4>
                  <p className={`text-gray-600 whitespace-pre-line ${
                    i18n.language === 'ko' ? 'font-korean' : 'font-english'
                  }`}>
                    {t('about:pastor.experience_detail')}
                  </p>
                </div>
                <div>
                  <h4 className={`text-lg font-semibold text-gray-900 mb-2 ${
                    i18n.language === 'ko' ? 'font-korean' : 'font-english'
                  }`}>
                    {t('about:pastor.ministry')}
                  </h4>
                  <p className={`text-gray-600 ${
                    i18n.language === 'ko' ? 'font-korean' : 'font-english'
                  }`}>
                    {t('about:pastor.ministry_detail')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className={`text-3xl font-bold text-gray-900 mb-12 text-center ${
            i18n.language === 'ko' ? 'font-korean' : 'font-english'
          }`}>
            {t('about:history.title')}
          </h2>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-px h-full bg-church-primary"></div>
            <div className="space-y-12">
              {/* Founding */}
              <div className="relative flex items-center">
                <div className="flex-1 text-right pr-8">
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h3 className={`text-xl font-bold text-gray-900 mb-2 ${
                      i18n.language === 'ko' ? 'font-korean' : 'font-english'
                    }`}>
                      {t('about:history.founding')} ({t('about:history.founding_year')})
                    </h3>
                    <p className={`text-gray-600 ${
                      i18n.language === 'ko' ? 'font-korean' : 'font-english'
                    }`}>
                      {t('about:history.founding_desc')}
                    </p>
                  </div>
                </div>
                <div className="w-4 h-4 bg-church-primary rounded-full border-4 border-white shadow-md"></div>
                <div className="flex-1 pl-8"></div>
              </div>

              {/* Growth */}
              <div className="relative flex items-center">
                <div className="flex-1 pr-8"></div>
                <div className="w-4 h-4 bg-church-primary rounded-full border-4 border-white shadow-md"></div>
                <div className="flex-1 text-left pl-8">
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h3 className={`text-xl font-bold text-gray-900 mb-2 ${
                      i18n.language === 'ko' ? 'font-korean' : 'font-english'
                    }`}>
                      {t('about:history.growth')} ({t('about:history.growth_year')})
                    </h3>
                    <p className={`text-gray-600 ${
                      i18n.language === 'ko' ? 'font-korean' : 'font-english'
                    }`}>
                      {t('about:history.growth_desc')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Present */}
              <div className="relative flex items-center">
                <div className="flex-1 text-right pr-8">
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h3 className={`text-xl font-bold text-gray-900 mb-2 ${
                      i18n.language === 'ko' ? 'font-korean' : 'font-english'
                    }`}>
                      {t('about:history.present')} ({t('about:history.present_year')})
                    </h3>
                    <p className={`text-gray-600 ${
                      i18n.language === 'ko' ? 'font-korean' : 'font-english'
                    }`}>
                      {t('about:history.present_desc')}
                    </p>
                  </div>
                </div>
                <div className="w-4 h-4 bg-church-primary rounded-full border-4 border-white shadow-md"></div>
                <div className="flex-1 pl-8"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statement of Faith */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className={`text-3xl font-bold text-gray-900 mb-12 text-center ${
            i18n.language === 'ko' ? 'font-korean' : 'font-english'
          }`}>
            {t('about:beliefs.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className={`text-xl font-semibold text-gray-900 mb-3 ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                {t('about:beliefs.trinity')}
              </h3>
              <p className={`text-gray-600 ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                {t('about:beliefs.trinity_desc')}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className={`text-xl font-semibold text-gray-900 mb-3 ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                {t('about:beliefs.scripture')}
              </h3>
              <p className={`text-gray-600 ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                {t('about:beliefs.scripture_desc')}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className={`text-xl font-semibold text-gray-900 mb-3 ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                {t('about:beliefs.salvation')}
              </h3>
              <p className={`text-gray-600 ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                {t('about:beliefs.salvation_desc')}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className={`text-xl font-semibold text-gray-900 mb-3 ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                {t('about:beliefs.church')}
              </h3>
              <p className={`text-gray-600 ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                {t('about:beliefs.church_desc')}
              </p>
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
      ...(await serverSideTranslations(locale ?? 'ko', ['common', 'about'])),
    },
  }
}

export default About