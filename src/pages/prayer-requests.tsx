import type { GetStaticProps, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Layout from '@/components/Layout'
import { Construction } from 'lucide-react'

const PrayerRequests: NextPage = () => {
  const { t, i18n } = useTranslation(['prayer-requests', 'common'])

  return (
    <Layout>
      {/* Header Section */}
      <section className="bg-gradient-to-br from-church-primary to-church-secondary py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className={`text-4xl font-bold text-white text-center ${
            i18n.language === 'ko' ? 'font-korean' : 'font-english'
          }`}>
            {t('prayer-requests:page_title')}
          </h1>
          <p className={`mt-4 text-xl text-gray-100 text-center ${
            i18n.language === 'ko' ? 'font-korean' : 'font-english'
          }`}>
            {t('prayer-requests:subtitle')}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Coming Soon Notice */}
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <Construction className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className={`text-2xl font-bold text-gray-900 mb-4 ${
            i18n.language === 'ko' ? 'font-korean' : 'font-english'
          }`}>
            {i18n.language === 'ko' ? '서비스 준비 중' : 'Coming Soon'}
          </h2>
          <p className={`text-gray-600 mb-6 ${
            i18n.language === 'ko' ? 'font-korean' : 'font-english'
          }`}>
            {i18n.language === 'ko'
              ? '기도요청 게시판이 새로운 시스템으로 업그레이드 중입니다. 곧 더 나은 서비스로 찾아뵙겠습니다.'
              : 'The prayer request board is being upgraded to a new system. We will be back with better service soon.'}
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className={`text-sm text-blue-800 ${
              i18n.language === 'ko' ? 'font-korean' : 'font-english'
            }`}>
              {i18n.language === 'ko'
                ? '기도요청이 있으시면 교회 사무실로 연락해 주세요: 814-380-9393'
                : 'For prayer requests, please contact the church office: 814-380-9393'}
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'ko', ['common', 'prayer-requests'])),
    },
  }
}

export default PrayerRequests
