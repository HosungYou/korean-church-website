import type { GetStaticProps, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Layout from '@/components/Layout'
import { useState } from 'react'

const Giving: NextPage = () => {
  const { t, i18n } = useTranslation(['giving', 'common'])
  const [copiedAddress, setCopiedAddress] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedAddress(true)
    setTimeout(() => setCopiedAddress(false), 2000)
  }

  return (
    <Layout>
      {/* Header Section */}
      <section className="bg-gradient-to-br from-church-primary to-church-secondary py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className={`text-4xl font-bold text-white text-center ${
            i18n.language === 'ko' ? 'font-korean' : 'font-english'
          }`}>
            {t('giving:page_title')}
          </h1>
          <p className={`mt-4 text-xl text-gray-100 text-center ${
            i18n.language === 'ko' ? 'font-korean' : 'font-english'
          }`}>
            {t('giving:subtitle')}
          </p>
          <p className={`mt-6 text-lg text-gray-200 text-center max-w-3xl mx-auto ${
            i18n.language === 'ko' ? 'font-korean' : 'font-english'
          }`}>
            {t('giving:intro')}
          </p>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="py-12 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className={`text-3xl font-bold text-gray-900 mb-10 text-center ${
            i18n.language === 'ko' ? 'font-korean' : 'font-english'
          }`}>
            {t('giving:payment_methods.title')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Offering Envelope */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-church-primary rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h6m-6 4h6m-6 4h6"/>
                  </svg>
                </div>
                <div>
                  <h3 className={`text-xl font-bold text-gray-900 ${
                    i18n.language === 'ko' ? 'font-korean' : 'font-english'
                  }`}>
                    {t('giving:payment_methods.envelope.name')}
                  </h3>
                  <p className={`text-sm text-gray-600 ${
                    i18n.language === 'ko' ? 'font-korean' : 'font-english'
                  }`}>
                    {t('giving:payment_methods.envelope.description')}
                  </p>
                </div>
              </div>
              <p className={`text-gray-700 ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                {t('giving:payment_methods.envelope.instructions')}
              </p>
            </div>

            {/* Mail */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-church-primary rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                </div>
                <div>
                  <h3 className={`text-xl font-bold text-gray-900 ${
                    i18n.language === 'ko' ? 'font-korean' : 'font-english'
                  }`}>
                    {t('giving:payment_methods.mail.name')}
                  </h3>
                  <p className={`text-sm text-gray-600 ${
                    i18n.language === 'ko' ? 'font-korean' : 'font-english'
                  }`}>
                    {t('giving:payment_methods.mail.description')}
                  </p>
                </div>
              </div>
              <div className="bg-white rounded p-3 mb-3">
                <p className="font-mono text-sm text-gray-800">{t('giving:payment_methods.mail.address')}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => copyToClipboard(t('giving:payment_methods.mail.address'))}
                  className={`inline-flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors text-sm ${
                    i18n.language === 'ko' ? 'font-korean' : 'font-english'
                  }`}
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                  </svg>
                  {copiedAddress ? (i18n.language === 'ko' ? '복사됨!' : 'Copied!') : (i18n.language === 'ko' ? '주소 복사' : 'Copy Address')}
                </button>
              </div>
              <p className={`text-gray-700 mt-3 ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                {t('giving:payment_methods.mail.instructions')}
              </p>
            </div>

            {/* PayPal */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.255-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106h3.607l.776-4.923h2.234c3.838 0 6.607-1.56 7.45-6.07.674-3.606-.064-5.524-1.412-6.524z"/>
                  </svg>
                </div>
                <div>
                  <h3 className={`text-xl font-bold text-gray-900 ${
                    i18n.language === 'ko' ? 'font-korean' : 'font-english'
                  }`}>
                    {t('giving:payment_methods.paypal.name')}
                  </h3>
                  <p className={`text-sm text-gray-600 ${
                    i18n.language === 'ko' ? 'font-korean' : 'font-english'
                  }`}>
                    {t('giving:payment_methods.paypal.description')}
                  </p>
                </div>
              </div>
              <div className="bg-white rounded p-3 mb-3">
                <p className="font-mono text-sm text-gray-800">{t('giving:payment_methods.paypal.account')}</p>
              </div>
              <a
                href={`https://${t('giving:payment_methods.paypal.account')}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors ${
                  i18n.language === 'ko' ? 'font-korean' : 'font-english'
                }`}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                </svg>
                PayPal {i18n.language === 'ko' ? '열기' : 'Open'}
              </a>
              <p className={`text-gray-700 mt-3 ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                {t('giving:payment_methods.paypal.instructions')}
              </p>
            </div>

            {/* Venmo */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.734 4.371c1.594 2.247 1.594 5.317.547 8.463L16.688 24h-5.469l-3.047-11.672c-.391-1.484-.313-2.578.234-3.203.547-.625 1.484-.859 2.578-.859h1.172l1.953 7.5L16.375 4.37h3.359z"/>
                  </svg>
                </div>
                <div>
                  <h3 className={`text-xl font-bold text-gray-900 ${
                    i18n.language === 'ko' ? 'font-korean' : 'font-english'
                  }`}>
                    {t('giving:payment_methods.venmo.name')}
                  </h3>
                  <p className={`text-sm text-gray-600 ${
                    i18n.language === 'ko' ? 'font-korean' : 'font-english'
                  }`}>
                    {t('giving:payment_methods.venmo.description')}
                  </p>
                </div>
              </div>
              <div className="bg-white rounded p-3 mb-3">
                <p className="font-mono text-sm text-gray-800">{t('giving:payment_methods.venmo.account')}</p>
              </div>
              <a
                href={`https://${t('giving:payment_methods.venmo.account')}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors ${
                  i18n.language === 'ko' ? 'font-korean' : 'font-english'
                }`}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                </svg>
                Venmo {i18n.language === 'ko' ? '열기' : 'Open'}
              </a>
              <p className={`text-gray-700 mt-3 ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                {t('giving:payment_methods.venmo.instructions')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-12 bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className={`text-2xl font-bold text-gray-900 mb-6 text-center ${
            i18n.language === 'ko' ? 'font-korean' : 'font-english'
          }`}>
            {t('giving:security.title')}
          </h2>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <ul className="space-y-3">
              <li className={`flex items-start ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                <span className="w-2 h-2 bg-church-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-gray-700">{t('giving:security.point1')}</span>
              </li>
              <li className={`flex items-start ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                <span className="w-2 h-2 bg-church-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-gray-700">{t('giving:security.point2')}</span>
              </li>
              <li className={`flex items-start ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                <span className="w-2 h-2 bg-church-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-gray-700">{t('giving:security.point3')}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Tax Information */}
      <section className="py-12 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className={`text-2xl font-bold text-gray-900 mb-6 text-center ${
            i18n.language === 'ko' ? 'font-korean' : 'font-english'
          }`}>
            {t('giving:tax.title')}
          </h2>
          <div className="bg-gray-50 rounded-lg p-6">
            <p className={`text-gray-700 mb-4 ${
              i18n.language === 'ko' ? 'font-korean' : 'font-english'
            }`}>
              {t('giving:tax.description')}
            </p>
            <p className={`text-gray-600 text-sm ${
              i18n.language === 'ko' ? 'font-korean' : 'font-english'
            }`}>
              {t('giving:tax.receipt')}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 bg-church-primary">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className={`text-2xl font-bold text-white mb-4 ${
            i18n.language === 'ko' ? 'font-korean' : 'font-english'
          }`}>
            {t('giving:contact.title')}
          </h2>
          <p className={`text-gray-100 mb-6 ${
            i18n.language === 'ko' ? 'font-korean' : 'font-english'
          }`}>
            {t('giving:contact.description')}
          </p>
          <div className="flex justify-center space-x-8">
            <div className="text-center">
              <p className={`text-gray-200 text-sm ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                {i18n.language === 'ko' ? '이메일' : 'Email'}
              </p>
              <a
                href={`mailto:${t('giving:contact.email')}`}
                className={`text-white font-medium hover:text-gray-200 ${
                  i18n.language === 'ko' ? 'font-korean' : 'font-english'
                }`}
              >
                {t('giving:contact.email')}
              </a>
            </div>
            <div className="text-center">
              <p className={`text-gray-200 text-sm ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                {i18n.language === 'ko' ? '전화' : 'Phone'}
              </p>
              <a
                href={`tel:${t('giving:contact.phone')}`}
                className={`text-white font-medium hover:text-gray-200 ${
                  i18n.language === 'ko' ? 'font-korean' : 'font-english'
                }`}
              >
                {t('giving:contact.phone')}
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
      ...(await serverSideTranslations(locale ?? 'ko', ['common', 'giving'])),
    },
  }
}

export default Giving