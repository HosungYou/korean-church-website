import Layout from '@/components/Layout'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Image from 'next/image'
import { Music } from 'lucide-react'

const SpecialPraisePage = () => {
  const praises = [
    { id: 1, title: '내 영혼의 그윽히 깊은데서', team: '시온 찬양대', date: '2025-08-10', image: '/images/praise1.jpg' },
    { id: 2, title: '은혜 아니면', team: '호산나 찬양대', date: '2025-08-03', image: '/images/praise2.jpg' },
    { id: 3, title: '주님 말씀하시면', team: '청년부 찬양팀', date: '2025-07-27', image: '/images/praise3.jpg' },
  ]

  return (
    <Layout>
      <div className="relative h-64 bg-black">
        <Image
          src="/images/praise-header.jpg"
          alt="Special Praise"
          fill
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white font-korean">특별찬양</h1>
        </div>
      </div>
      <div className="bg-dotted-pattern">
        <div className="max-w-4xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {praises.map((praise) => (
              <div key={praise.id} className="flex items-center bg-white p-4 rounded-lg shadow-md border border-black/10">
                <div className="relative h-24 w-32 rounded-md overflow-hidden">
                  <Image src={praise.image} alt={praise.title} fill className="object-cover" />
                </div>
                <div className="ml-6 flex-grow">
                  <h3 className="text-xl font-bold text-black font-korean">{praise.title}</h3>
                  <p className="text-base text-gray-600 font-korean">{praise.team}</p>
                  <p className="text-sm text-gray-500 font-english mt-1">{praise.date}</p>
                </div>
                <button className="ml-4 p-3 rounded-full bg-black text-white hover:bg-gray-800 transition-colors">
                  <Music className="w-6 h-6" />
                </button>
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

export default SpecialPraisePage
