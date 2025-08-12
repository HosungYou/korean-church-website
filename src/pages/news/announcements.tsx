import Layout from '@/components/Layout'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Image from 'next/image'

const AnnouncementsPage = () => {
  const announcements = [
    { id: 1, title: '8월 정기운영위원회', date: '2025-08-17' },
    { id: 2, title: '전교인 수련회 안내', date: '2025-08-15' },
    { id: 3, title: '새가족 환영회', date: '2025-08-10' },
    { id: 4, title: '주차장 이용 안내', date: '2025-08-01' },
  ]

  return (
    <Layout>
      <div className="relative h-64 bg-black">
        <Image
          src="/images/news-header.jpg"
          alt="News"
          fill
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white font-korean">교회소식</h1>
        </div>
      </div>
      <div className="max-w-4xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
        <div className="divide-y divide-gray-200">
          {announcements.map((item) => (
            <div key={item.id} className="py-6">
              <h3 className="text-xl font-bold font-korean text-black hover:underline cursor-pointer">{item.title}</h3>
              <p className="mt-1 text-sm text-gray-500 font-english">{item.date}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'ko', ['common'])),
  },
})

export default AnnouncementsPage
