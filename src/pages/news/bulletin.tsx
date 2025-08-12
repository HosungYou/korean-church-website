import Layout from '@/components/Layout'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Image from 'next/image'
import { Download } from 'lucide-react'

const BulletinPage = () => {
  const bulletins = [
    { id: 1, date: '2025년 8월 10일', fileUrl: '/bulletins/20250810.pdf' },
    { id: 2, date: '2025년 8월 3일', fileUrl: '/bulletins/20250803.pdf' },
    { id: 3, date: '2025년 7월 27일', fileUrl: '/bulletins/20250727.pdf' },
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
          <h1 className="text-4xl font-bold text-white font-korean">주보</h1>
        </div>
      </div>
      <div className="max-w-4xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
        <div className="space-y-4">
          {bulletins.map((item) => (
            <div key={item.id} className="flex items-center justify-between bg-white p-4 rounded-lg border border-black/10">
              <p className="text-lg font-semibold font-korean">{item.date} 주보</p>
              <a 
                href={item.fileUrl} 
                download
                className="flex items-center px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
              >
                <Download className="w-5 h-5 mr-2" />
                <span className="font-korean">다운로드</span>
              </a>
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

export default BulletinPage
