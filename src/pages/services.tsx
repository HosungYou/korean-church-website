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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
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
              <p className={`text-gray-600 mb-1 ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                {t('services:weekday_services.dawn.schedule')}
              </p>
              <p className={`text-gray-600 mb-3 ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                {t('services:weekday_services.dawn.location')}
              </p>
              <p className={`text-gray-700 text-sm mb-4 ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                {t('services:weekday_services.dawn.description')}
              </p>
              <a
                href={t('services:weekday_services.dawn.link') as string}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors ${
                  i18n.language === 'ko' ? 'font-korean' : 'font-english'
                }`}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                </svg>
                {t('services:weekday_services.dawn.link_text')}
              </a>
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
              {t('services:additional_info.title')}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className={`text-lg font-semibold text-gray-900 mb-3 ${
                  i18n.language === 'ko' ? 'font-korean' : 'font-english'
                }`}>
                  {t('services:additional_info.parking.title')}
                </h4>
                <p className={`text-gray-700 text-sm ${
                  i18n.language === 'ko' ? 'font-korean' : 'font-english'
                }`}>
                  {t('services:additional_info.parking.description')}
                </p>
              </div>
              
              <div>
                <h4 className={`text-lg font-semibold text-gray-900 mb-3 ${
                  i18n.language === 'ko' ? 'font-korean' : 'font-english'
                }`}>
                  {t('services:additional_info.contact.title')}
                </h4>
                <p className={`text-gray-700 text-sm mb-2 ${
                  i18n.language === 'ko' ? 'font-korean' : 'font-english'
                }`}>
                  {t('services:additional_info.contact.phone')}
                </p>
                <p className={`text-gray-700 text-sm ${
                  i18n.language === 'ko' ? 'font-korean' : 'font-english'
                }`}>
                  {t('services:additional_info.contact.email')}
                </p>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className={`text-sm text-gray-600 ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                {t('services:timezone_notice')}
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
      ...(await serverSideTranslations(locale ?? 'ko', ['common', 'services'])),
    },
  }
}

export default Services