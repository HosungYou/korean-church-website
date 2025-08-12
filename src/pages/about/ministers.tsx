import Layout from '@/components/Layout'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Image from 'next/image'

const MinistersPage = () => {
  const ministers = [
    { name: '김철수', role: '담임목사', image: '/images/pastor1.jpg' },
    { name: '이영희', role: '부목사', image: '/images/pastor2.jpg' },
    { name: '박현우', role: '교육목사', image: '/images/pastor3.jpg' },
    { name: '최지민', role: '찬양인도', image: '/images/pastor4.jpg' },
  ]

  return (
    <Layout>
      <div className="relative h-64 bg-black">
        <Image
          src="/images/ministers-header.jpg"
          alt="Our Ministers"
          fill
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white font-korean">섬기는 분들</h1>
        </div>
      </div>
      <div className="bg-white">
        <div className="mx-auto max-w-7xl py-20 px-4 sm:px-6 lg:px-8">
          <ul className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
            {ministers.map((person) => (
              <li key={person.name} className="flex flex-col items-center text-center">
                <div className="relative h-48 w-48 rounded-full overflow-hidden">
                  <Image src={person.image} alt={person.name} fill className="object-cover" />
                </div>
                <h3 className="mt-6 text-2xl font-bold text-black font-korean">{person.name}</h3>
                <p className="text-lg text-gray-600 font-korean">{person.role}</p>
              </li>
            ))}
          </ul>
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

export default MinistersPage
