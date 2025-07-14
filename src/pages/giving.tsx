import type { GetStaticProps, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Layout from '@/components/Layout'
import { useState } from 'react'

const Giving: NextPage = () => {
  const { t, i18n } = useTranslation(['giving', 'common'])
  const [selectedType, setSelectedType] = useState('')
  const [copiedEmail, setCopiedEmail] = useState(false)
  const [copiedVenmo, setCopiedVenmo] = useState(false)

  const copyToClipboard = (text: string, type: 'email' | 'venmo') => {
    navigator.clipboard.writeText(text)
    if (type === 'email') {
      setCopiedEmail(true)
      setTimeout(() => setCopiedEmail(false), 2000)
    } else {
      setCopiedVenmo(true)
      setTimeout(() => setCopiedVenmo(false), 2000)
    }
  }

  const givingTypes = [
    { id: 'tithe', name: t('giving:giving_types.tithe') },
    { id: 'offering', name: t('giving:giving_types.offering') },
    { id: 'mission', name: t('giving:giving_types.mission') },
    { id: 'building', name: t('giving:giving_types.building') },
    { id: 'other', name: t('giving:giving_types.other') },
  ]

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

      {/* Giving Types Selection */}
      <section className="py-12 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className={`text-2xl font-bold text-gray-900 mb-6 text-center ${
            i18n.language === 'ko' ? 'font-korean' : 'font-english'
          }`}>
            {t('giving:giving_types.title')}
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {givingTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  selectedType === type.id
                    ? 'bg-church-primary text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
                } ${i18n.language === 'ko' ? 'font-korean' : 'font-english'}`}
              >
                {type.name}
              </button>
            ))}
          </div>
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
            {/* Zelle */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-xl font-bold text-gray-900 ${
                  i18n.language === 'ko' ? 'font-korean' : 'font-english'
                }`}>
                  {t('giving:payment_methods.zelle.name')}
                </h3>
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  {i18n.language === 'ko' ? '추천' : 'Recommended'}
                </span>
              </div>
              <p className={`text-gray-600 mb-4 ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                {t('giving:payment_methods.zelle.description')}
              </p>
              <div className="bg-white rounded p-4 mb-4">
                <p className={`text-sm text-gray-600 mb-2 ${
                  i18n.language === 'ko' ? 'font-korean' : 'font-english'
                }`}>
                  {i18n.language === 'ko' ? '이메일 주소:' : 'Email Address:'}
                </p>
                <div className="flex items-center justify-between">
                  <code className="text-lg font-mono text-church-primary">
                    {t('giving:payment_methods.zelle.email')}
                  </code>
                  <button
                    onClick={() => copyToClipboard(t('giving:payment_methods.zelle.email'), 'email')}
                    className="ml-2 p-2 text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
                {copiedEmail && (
                  <p className="text-sm text-green-600 mt-2">
                    {i18n.language === 'ko' ? '복사되었습니다!' : 'Copied!'}
                  </p>
                )}
              </div>
              <p className={`text-sm text-gray-600 ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                {t('giving:payment_methods.zelle.instructions')}
              </p>
            </div>

            {/* Venmo */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <h3 className={`text-xl font-bold text-gray-900 mb-4 ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                {t('giving:payment_methods.venmo.name')}
              </h3>
              <p className={`text-gray-600 mb-4 ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                {t('giving:payment_methods.venmo.description')}
              </p>
              <div className="bg-white rounded p-4 mb-4">
                <p className={`text-sm text-gray-600 mb-2 ${
                  i18n.language === 'ko' ? 'font-korean' : 'font-english'
                }`}>
                  {i18n.language === 'ko' ? '계정:' : 'Account:'}
                </p>
                <div className="flex items-center justify-between">
                  <code className="text-lg font-mono text-church-primary">
                    {t('giving:payment_methods.venmo.account')}
                  </code>
                  <button
                    onClick={() => copyToClipboard(t('giving:payment_methods.venmo.account'), 'venmo')}
                    className="ml-2 p-2 text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
                {copiedVenmo && (
                  <p className="text-sm text-green-600 mt-2">
                    {i18n.language === 'ko' ? '복사되었습니다!' : 'Copied!'}
                  </p>
                )}
              </div>
              <p className={`text-sm text-gray-600 ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                {t('giving:payment_methods.venmo.instructions')}
              </p>
            </div>

            {/* PayPal */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <h3 className={`text-xl font-bold text-gray-900 mb-4 ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                {t('giving:payment_methods.paypal.name')}
              </h3>
              <p className={`text-gray-600 mb-4 ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                {t('giving:payment_methods.paypal.description')}
              </p>
              <p className={`text-sm text-gray-600 mb-4 ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                {t('giving:payment_methods.paypal.instructions')}
              </p>
              <a
                href="https://www.paypal.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors ${
                  i18n.language === 'ko' ? 'font-korean' : 'font-english'
                }`}
              >
                {t('giving:payment_methods.paypal.button')} →
              </a>
            </div>

            {/* Check by Mail */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <h3 className={`text-xl font-bold text-gray-900 mb-4 ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                {t('giving:payment_methods.check.name')}
              </h3>
              <p className={`text-gray-600 mb-4 ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                {t('giving:payment_methods.check.description')}
              </p>
              <div className="bg-white rounded p-4 mb-4">
                <p className={`font-medium text-gray-700 mb-2 ${
                  i18n.language === 'ko' ? 'font-korean' : 'font-english'
                }`}>
                  {t('giving:payment_methods.check.payable')}
                </p>
                <p className="text-gray-600">
                  {t('giving:payment_methods.check.address')}
                </p>
              </div>
              <p className={`text-sm text-gray-600 ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                {t('giving:payment_methods.check.instructions')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security and Tax Info */}
      <section className="py-12 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Security */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className={`text-xl font-bold text-gray-900 mb-4 ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                {t('giving:security.title')}
              </h3>
              <ul className={`space-y-3 text-gray-700 ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-church-accent mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {t('giving:security.point1')}
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-church-accent mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {t('giving:security.point2')}
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-church-accent mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {t('giving:security.point3')}
                </li>
              </ul>
            </div>

            {/* Tax Deduction */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className={`text-xl font-bold text-gray-900 mb-4 ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                {t('giving:tax.title')}
              </h3>
              <p className={`text-gray-700 mb-3 ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                {t('giving:tax.description')}
              </p>
              <p className="text-gray-700 mb-3 font-medium">
                {t('giving:tax.ein')}
              </p>
              <p className={`text-gray-700 ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                {t('giving:tax.receipt')}
              </p>
            </div>
          </div>

          {/* Contact Section */}
          <div className="mt-8 bg-church-primary/10 rounded-lg p-8 text-center">
            <h3 className={`text-2xl font-bold text-gray-900 mb-4 ${
              i18n.language === 'ko' ? 'font-korean' : 'font-english'
            }`}>
              {t('giving:contact.title')}
            </h3>
            <p className={`text-gray-700 mb-6 ${
              i18n.language === 'ko' ? 'font-korean' : 'font-english'
            }`}>
              {t('giving:contact.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <div>
                <p className={`font-medium text-gray-900 ${
                  i18n.language === 'ko' ? 'font-korean' : 'font-english'
                }`}>
                  {t('giving:contact.treasurer')}
                </p>
                <p className="text-gray-600">{t('giving:contact.email')}</p>
              </div>
              <div className="hidden sm:block w-px h-12 bg-gray-300"></div>
              <div>
                <p className={`font-medium text-gray-900 ${
                  i18n.language === 'ko' ? 'font-korean' : 'font-english'
                }`}>
                  {t('common:phone')}
                </p>
                <p className="text-gray-600">{t('giving:contact.phone')}</p>
              </div>
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