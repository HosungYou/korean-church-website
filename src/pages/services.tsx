import type { GetStaticProps, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Layout from '@/components/Layout'

const Services: NextPage = () => {
  const { t, i18n } = useTranslation(['services', 'common'])

  return (
    <Layout>
      {/* Header Section */}
      <section className="bg-church-primary py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className={`text-4xl font-bold text-white text-center ${
            i18n.language === 'ko' ? 'font-korean' : 'font-english'
          }`}>
            {t('services:page_title')}
          </h1>
          <p className={`mt-4 text-xl text-gray-100 text-center ${
            i18n.language === 'ko' ? 'font-korean' : 'font-english'
          }`}>
            {t('services:subtitle')}
          </p>
        </div>
      </section>

      {/* Sunday Services */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className={`text-3xl font-bold text-gray-900 mb-8 text-center ${
            i18n.language === 'ko' ? 'font-korean' : 'font-english'
          }`}>
            {t('services:sunday_services.title')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 1st Korean Service */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-church-primary rounded-full text-white text-2xl font-bold mb-4">
                  1
                </div>
                <h3 className={`text-xl font-semibold text-gray-900 ${
                  i18n.language === 'ko' ? 'font-korean' : 'font-english'
                }`}>
                  {t('services:sunday_services.korean_1st.name')}
                </h3>
                <p className="text-2xl font-bold text-church-primary mt-2">
                  {t('services:sunday_services.korean_1st.time')}
                </p>
                <p className={`text-gray-600 mt-1 ${
                  i18n.language === 'ko' ? 'font-korean' : 'font-english'
                }`}>
                  {t('services:sunday_services.korean_1st.location')}
                </p>
              </div>
              <p className={`text-gray-700 text-sm ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                {t('services:sunday_services.korean_1st.description')}
              </p>
            </div>

            {/* 2nd Korean Service */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-church-primary rounded-full text-white text-2xl font-bold mb-4">
                  2
                </div>
                <h3 className={`text-xl font-semibold text-gray-900 ${
                  i18n.language === 'ko' ? 'font-korean' : 'font-english'
                }`}>
                  {t('services:sunday_services.korean_2nd.name')}
                </h3>
                <p className="text-2xl font-bold text-church-primary mt-2">
                  {t('services:sunday_services.korean_2nd.time')}
                </p>
                <p className={`text-gray-600 mt-1 ${
                  i18n.language === 'ko' ? 'font-korean' : 'font-english'
                }`}>
                  {t('services:sunday_services.korean_2nd.location')}
                </p>
              </div>
              <p className={`text-gray-700 text-sm ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                {t('services:sunday_services.korean_2nd.description')}
              </p>
            </div>

            {/* English Service */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-church-secondary rounded-full text-white text-xl font-bold mb-4">
                  EN
                </div>
                <h3 className={`text-xl font-semibold text-gray-900 ${
                  i18n.language === 'ko' ? 'font-korean' : 'font-english'
                }`}>
                  {t('services:sunday_services.english.name')}
                </h3>
                <p className="text-2xl font-bold text-church-secondary mt-2">
                  {t('services:sunday_services.english.time')}
                </p>
                <p className={`text-gray-600 mt-1 ${
                  i18n.language === 'ko' ? 'font-korean' : 'font-english'
                }`}>
                  {t('services:sunday_services.english.location')}
                </p>
              </div>
              <p className={`text-gray-700 text-sm ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                {t('services:sunday_services.english.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Youth & Children Ministry */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className={`text-3xl font-bold text-gray-900 mb-8 text-center ${
            i18n.language === 'ko' ? 'font-korean' : 'font-english'
          }`}>
            {t('services:youth_children.title')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Youth Group */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className={`text-xl font-semibold text-gray-900 mb-2 ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                {t('services:youth_children.youth.name')}
              </h3>
              <div className="space-y-2 mb-4">
                <p className="text-lg font-medium text-church-accent">
                  {t('services:youth_children.youth.time')}
                </p>
                <p className={`text-gray-600 ${
                  i18n.language === 'ko' ? 'font-korean' : 'font-english'
                }`}>
                  {t('services:youth_children.youth.location')}
                </p>
                <p className={`text-gray-600 ${
                  i18n.language === 'ko' ? 'font-korean' : 'font-english'
                }`}>
                  {t('services:youth_children.youth.grades')}
                </p>
              </div>
              <p className={`text-gray-700 text-sm ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                {t('services:youth_children.youth.description')}
              </p>
            </div>

            {/* Children's Ministry */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className={`text-xl font-semibold text-gray-900 mb-2 ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                {t('services:youth_children.children.name')}
              </h3>
              <div className="space-y-2 mb-4">
                <p className="text-lg font-medium text-church-accent">
                  {t('services:youth_children.children.time')}
                </p>
                <p className={`text-gray-600 ${
                  i18n.language === 'ko' ? 'font-korean' : 'font-english'
                }`}>
                  {t('services:youth_children.children.location')}
                </p>
                <p className={`text-gray-600 ${
                  i18n.language === 'ko' ? 'font-korean' : 'font-english'
                }`}>
                  {t('services:youth_children.children.grades')}
                </p>
              </div>
              <p className={`text-gray-700 text-sm ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                {t('services:youth_children.children.description')}
              </p>
            </div>

            {/* Nursery */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className={`text-xl font-semibold text-gray-900 mb-2 ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                {t('services:youth_children.nursery.name')}
              </h3>
              <div className="space-y-2 mb-4">
                <p className="text-lg font-medium text-church-accent">
                  {t('services:youth_children.nursery.time')}
                </p>
                <p className={`text-gray-600 ${
                  i18n.language === 'ko' ? 'font-korean' : 'font-english'
                }`}>
                  {t('services:youth_children.nursery.location')}
                </p>
                <p className={`text-gray-600 ${
                  i18n.language === 'ko' ? 'font-korean' : 'font-english'
                }`}>
                  {t('services:youth_children.nursery.ages')}
                </p>
              </div>
              <p className={`text-gray-700 text-sm ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                {t('services:youth_children.nursery.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Weekday Services */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className={`text-3xl font-bold text-gray-900 mb-8 text-center ${
            i18n.language === 'ko' ? 'font-korean' : 'font-english'
          }`}>
            {t('services:weekday_services.title')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Wednesday Service */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
              <h3 className={`text-xl font-semibold text-gray-900 mb-2 ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                {t('services:weekday_services.wednesday.name')}
              </h3>
              <p className="text-lg font-medium text-church-primary mb-1">
                {t('services:weekday_services.wednesday.time')}
              </p>
              <p className={`text-gray-600 mb-3 ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                {t('services:weekday_services.wednesday.location')}
              </p>
              <p className={`text-gray-700 text-sm ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                {t('services:weekday_services.wednesday.description')}
              </p>
            </div>

            {/* Dawn Prayer */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
              <h3 className={`text-xl font-semibold text-gray-900 mb-2 ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                {t('services:weekday_services.dawn.name')}
              </h3>
              <p className="text-lg font-medium text-church-primary mb-1">
                {t('services:weekday_services.dawn.time')}
              </p>
              <p className={`text-gray-600 mb-3 ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                {t('services:weekday_services.dawn.location')}
              </p>
              <p className={`text-gray-700 text-sm ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                {t('services:weekday_services.dawn.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Information */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg p-8 shadow-md">
            <h3 className={`text-2xl font-bold text-gray-900 mb-6 ${
              i18n.language === 'ko' ? 'font-korean' : 'font-english'
            }`}>
              {t('services:special_services.title')}
            </h3>
            <ul className={`space-y-3 text-gray-700 ${
              i18n.language === 'ko' ? 'font-korean' : 'font-english'
            }`}>
              <li className="flex items-center">
                <span className="text-church-accent mr-2">•</span>
                {t('services:special_services.communion')}
              </li>
              <li className="flex items-center">
                <span className="text-church-accent mr-2">•</span>
                {t('services:special_services.baptism')}
              </li>
              <li className="flex items-center">
                <span className="text-church-accent mr-2">•</span>
                {t('services:special_services.revival')}
              </li>
            </ul>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className={`text-sm text-gray-600 mb-2 ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                {t('services:timezone_notice')}
              </p>
              <p className={`text-sm text-gray-600 ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                {t('services:parking')}
              </p>
            </div>

            {/* Online Service */}
            <div className="mt-8 bg-church-primary/10 rounded-lg p-6">
              <h4 className={`text-xl font-semibold text-gray-900 mb-2 ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                {t('services:online.title')}
              </h4>
              <p className={`text-gray-700 mb-4 ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                {t('services:online.description')}
              </p>
              <a
                href="#"
                className={`inline-flex items-center px-4 py-2 bg-church-primary text-white rounded-md hover:bg-church-secondary transition-colors ${
                  i18n.language === 'ko' ? 'font-korean' : 'font-english'
                }`}
              >
                {t('services:online.watch_live')} →
              </a>
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
      ...(await serverSideTranslations(locale ?? 'ko', ['common', 'services'])),
    },
  }
}

export default Services