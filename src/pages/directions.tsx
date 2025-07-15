import type { GetStaticProps, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Layout from '@/components/Layout'
import { useState, useEffect } from 'react'

const Directions: NextPage = () => {
  const { t, i18n } = useTranslation(['directions', 'common'])
  const [copied, setCopied] = useState(false)
  const [mapLoaded, setMapLoaded] = useState(false)

  const churchAddress = '758 Glenn Rd, State College, PA 16803'
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(churchAddress)}`

  const copyAddress = () => {
    navigator.clipboard.writeText(churchAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  useEffect(() => {
    // Simple check to see if iframe has loaded
    const timer = setTimeout(() => setMapLoaded(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <Layout>
      {/* Header Section */}
      <section className="bg-church-primary py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className={`text-4xl font-bold text-white text-center ${
            i18n.language === 'ko' ? 'font-korean' : 'font-english'
          }`}>
            {t('directions:page_title')}
          </h1>
          <p className={`mt-4 text-xl text-gray-100 text-center ${
            i18n.language === 'ko' ? 'font-korean' : 'font-english'
          }`}>
            {t('directions:subtitle')}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Map Section */}
          <div className="order-2 lg:order-1">
            <div className="bg-gray-100 rounded-lg overflow-hidden shadow-lg" style={{ height: '500px' }}>
              {!mapLoaded && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-gray-500">Loading map...</div>
                </div>
              )}
              <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyAT78qq2Q5318akOlvFLCV_YsiwStx0wDs&q=${encodeURIComponent(churchAddress)}&language=${i18n.language}`}
                onLoad={() => setMapLoaded(true)}
              ></iframe>
            </div>
          </div>

          {/* Information Section */}
          <div className="order-1 lg:order-2 space-y-6">
            {/* Address */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className={`text-2xl font-bold text-gray-900 mb-4 ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                {t('directions:address.title')}
              </h2>
              <p className="text-lg text-gray-700 mb-2">{t('directions:address.street')}</p>
              <p className="text-lg text-gray-700 mb-4">{t('directions:address.city_state_zip')}</p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={copyAddress}
                  className={`inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors ${
                    i18n.language === 'ko' ? 'font-korean' : 'font-english'
                  }`}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  {copied ? t('directions:address.address_copied') : t('directions:address.copy_address')}
                </button>
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center px-4 py-2 bg-church-primary hover:bg-church-secondary text-white rounded-md transition-colors ${
                    i18n.language === 'ko' ? 'font-korean' : 'font-english'
                  }`}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {t('directions:directions.open_google_maps')}
                </a>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className={`text-2xl font-bold text-gray-900 mb-4 ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                {t('directions:contact.title')}
              </h2>
              <div className="space-y-3">
                <div>
                  <span className={`font-medium text-gray-700 ${
                    i18n.language === 'ko' ? 'font-korean' : 'font-english'
                  }`}>
                    {t('directions:contact.phone')}:
                  </span>
                  <span className="ml-2 text-gray-600">814-380-9393</span>
                </div>
                <div>
                  <span className={`font-medium text-gray-700 ${
                    i18n.language === 'ko' ? 'font-korean' : 'font-english'
                  }`}>
                    {t('directions:contact.email')}:
                  </span>
                  <span className="ml-2 text-gray-600">KyuHongYeon@gmail.com</span>
                </div>
                <div>
                  <span className={`font-medium text-gray-700 ${
                    i18n.language === 'ko' ? 'font-korean' : 'font-english'
                  }`}>
                    {t('directions:contact.office_hours')}:
                  </span>
                  <span className={`ml-2 text-gray-600 ${
                    i18n.language === 'ko' ? 'font-korean' : 'font-english'
                  }`}>
                    {t('directions:contact.office_hours_detail')}
                  </span>
                </div>
              </div>
            </div>

            {/* Parking Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className={`text-2xl font-bold text-gray-900 mb-4 ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                {t('directions:parking.title')}
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className={`font-semibold text-gray-800 ${
                    i18n.language === 'ko' ? 'font-korean' : 'font-english'
                  }`}>
                    {t('directions:parking.main_lot')}
                  </h3>
                  <p className={`text-gray-600 text-sm ${
                    i18n.language === 'ko' ? 'font-korean' : 'font-english'
                  }`}>
                    {t('directions:parking.main_lot_detail')}
                  </p>
                </div>
                <div>
                  <h3 className={`font-semibold text-gray-800 ${
                    i18n.language === 'ko' ? 'font-korean' : 'font-english'
                  }`}>
                    {t('directions:parking.overflow')}
                  </h3>
                  <p className={`text-gray-600 text-sm ${
                    i18n.language === 'ko' ? 'font-korean' : 'font-english'
                  }`}>
                    {t('directions:parking.overflow_detail')}
                  </p>
                </div>
                <div>
                  <h3 className={`font-semibold text-gray-800 ${
                    i18n.language === 'ko' ? 'font-korean' : 'font-english'
                  }`}>
                    {t('directions:parking.handicap')}
                  </h3>
                  <p className={`text-gray-600 text-sm ${
                    i18n.language === 'ko' ? 'font-korean' : 'font-english'
                  }`}>
                    {t('directions:parking.handicap_detail')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'ko', ['common', 'directions'])),
    },
  }
}

export default Directions