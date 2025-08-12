import Layout from '@/components/Layout'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Image from 'next/image'
import Link from 'next/link'

const FridaySermonsPage = () => {
  const sermons = [
    { id: 1, title: '기도의 능력', speaker: '박현우 교육목사', date: '2025-08-01', videoId: 'dQw4w9WgXcQ', image: '/images/sermon-fri1.jpg' },
    { id: 2, title: '중보기도의 중요성', speaker: '박현우 교육목사', date: '2025-07-25', videoId: 'dQw4w9WgXcQ', image: '/images/sermon-fri2.jpg' },
  ]

  return (
    <Layout>
      <div className="relative h-64 bg-black">
        <Image
          src="/images/sermons-header.jpg"
          alt="Sermons"
          fill
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white font-korean">금요철야</h1>
        </div>
      </div>
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12">
            {sermons.map((sermon) => (
              <div key={sermon.id} className="group">
                <Link href={`/sermons/friday/${sermon.id}`}>
                  <div className="relative aspect-w-16 aspect-h-9 rounded-lg overflow-hidden border border-black/10">
                    <Image src={sermon.image} alt={sermon.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
                  </div>
                  <div className="mt-4">
                    <h3 className="text-xl font-bold text-black font-korean group-hover:underline">{sermon.title}</h3>
                    <p className="mt-1 text-base text-gray-600 font-korean">{sermon.speaker}</p>
                    <p className="mt-1 text-sm text-gray-500 font-english">{sermon.date}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
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

export default FridaySermonsPage
