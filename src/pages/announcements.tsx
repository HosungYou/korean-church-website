import type { GetStaticProps, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Layout from '@/components/Layout'

const Announcements: NextPage = () => {
  const { t, i18n } = useTranslation(['common'])

  const announcements = [
    {
      id: 1,
      title: i18n.language === 'ko' ? '새해 감사예배 안내' : 'New Year Thanksgiving Service',
      date: '2024-01-01',
      content: i18n.language === 'ko' 
        ? '새해를 맞아 감사예배를 드립니다. 모든 성도님들의 참석을 부탁드립니다.'
        : 'We will hold a thanksgiving service for the new year. All members are invited to attend.',
      important: true
    },
    {
      id: 2,
      title: i18n.language === 'ko' ? '교회 청소 봉사' : 'Church Cleaning Service',
      date: '2024-01-15',
      content: i18n.language === 'ko'
        ? '매월 셋째 주 토요일 오전 10시에 교회 청소 봉사가 있습니다.'
        : 'Church cleaning service is held every third Saturday at 10 AM.',
      important: false
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
            {i18n.language === 'ko' ? '공지사항' : 'Announcements'}
          </h1>
          <p className={`mt-4 text-xl text-gray-100 text-center ${
            i18n.language === 'ko' ? 'font-korean' : 'font-english'
          }`}>
            {i18n.language === 'ko' ? '교회 소식을 확인하세요' : 'Check our latest church news'}
          </p>
        </div>
      </section>

      {/* Announcements List */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {announcements.map((announcement) => (
              <div
                key={announcement.id}
                className={`bg-white rounded-lg shadow-md border-l-4 p-6 ${
                  announcement.important 
                    ? 'border-red-500 bg-red-50' 
                    : 'border-church-primary'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h2 className={`text-xl font-semibold text-gray-900 ${
                    i18n.language === 'ko' ? 'font-korean' : 'font-english'
                  }`}>
                    {announcement.title}
                    {announcement.important && (
                      <span className="ml-2 px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                        {i18n.language === 'ko' ? '중요' : 'Important'}
                      </span>
                    )}
                  </h2>
                  <span className="text-sm text-gray-500">{announcement.date}</span>
                </div>
                <p className={`text-gray-700 ${
                  i18n.language === 'ko' ? 'font-korean' : 'font-english'
                }`}>
                  {announcement.content}
                </p>
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

export default Announcements