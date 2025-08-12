import Layout from '@/components/Layout'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Image from 'next/image'
import Link from 'next/link'

const SundaySermonsPage = () => {
  const sermons = [
    { id: 1, title: '믿음의 기초', speaker: '김철수 목사', date: '2025-08-10', videoId: 'dQw4w9WgXcQ', image: '/images/sermon1.jpg' },
    { id: 2, title: '사랑의 실천', speaker: '김철수 목사', date: '2025-08-03', videoId: 'dQw4w9WgXcQ', image: '/images/sermon2.jpg' },
    { id: 3, title: '소망의 이유', speaker: '이영희 부목사', date: '2025-07-27', videoId: 'dQw4w9WgXcQ', image: '/images/sermon3.jpg' },
    { id: 4, title: '은혜의 통로', speaker: '김철수 목사', date: '2025-07-20', videoId: 'dQw4w9WgXcQ', image: '/images/sermon4.jpg' },
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
          <h1 className="text-4xl font-bold text-white font-korean">주일예배</h1>
        </div>
      </div>
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12">
            {sermons.map((sermon) => (
              <div key={sermon.id} className="group">
                <Link href={`/sermons/sunday/${sermon.id}`}>
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

export default SundaySermonsPage
