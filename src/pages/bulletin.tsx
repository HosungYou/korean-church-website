import type { GetStaticProps, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Layout from '@/components/Layout'

const Bulletin: NextPage = () => {
  const { t, i18n } = useTranslation(['common'])

  const bulletins = [
    {
      id: 1,
      date: '2024-01-07',
      title: i18n.language === 'ko' ? '주일 주보' : 'Sunday Bulletin',
      downloadUrl: '#'
    },
    {
      id: 2,
      date: '2023-12-31',
      title: i18n.language === 'ko' ? '송년 예배 주보' : 'Year-end Service Bulletin',
      downloadUrl: '#'
    },
    {
      id: 3,
      date: '2023-12-24',
      title: i18n.language === 'ko' ? '성탄절 예배 주보' : 'Christmas Service Bulletin',
      downloadUrl: '#'
    }
  ]

  return (
    <Layout>
      {/* Header Section */}
      <section className="bg-church-primary py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className={`text-4xl font-bold text-white text-center ${
            i18n.language === 'ko' ? 'font-korean' : 'font-english'
          }`}>
            {i18n.language === 'ko' ? '주보' : 'Bulletin'}
          </h1>
          <p className={`mt-4 text-xl text-gray-100 text-center ${
            i18n.language === 'ko' ? 'font-korean' : 'font-english'
          }`}>
            {i18n.language === 'ko' ? '주간 교회 소식과 예배 순서' : 'Weekly church news and service order'}
          </p>
        </div>
      </section>

      {/* Bulletin List */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {bulletins.map((bulletin) => (
              <div
                key={bulletin.id}
                className="bg-white rounded-lg shadow-md border p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className={`text-lg font-semibold text-gray-900 ${
                      i18n.language === 'ko' ? 'font-korean' : 'font-english'
                    }`}>
                      {bulletin.title}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">{bulletin.date}</p>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      className={`inline-flex items-center px-4 py-2 bg-church-primary hover:bg-church-secondary text-white rounded-md transition-colors ${
                        i18n.language === 'ko' ? 'font-korean' : 'font-english'
                      }`}
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {i18n.language === 'ko' ? '보기' : 'View'}
                    </button>
                    <button
                      className={`inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors ${
                        i18n.language === 'ko' ? 'font-korean' : 'font-english'
                      }`}
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {i18n.language === 'ko' ? '다운로드' : 'Download'}
                    </button>
                  </div>
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
      ...(await serverSideTranslations(locale ?? 'ko', ['common'])),
    },
  }
}

export default Bulletin