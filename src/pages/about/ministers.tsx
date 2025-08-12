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
          <div className="flex items-center">
            <div className="w-3 h-3 bg-white rounded-full mr-4"></div>
            <h1 className="text-4xl font-bold text-white font-korean">섬기는 분들</h1>
          </div>
        </div>
      </div>
      <div className="bg-white">
        <div className="mx-auto max-w-7xl py-20 px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
              <h2 className="text-3xl font-bold text-black font-korean">교역자 소개</h2>
            </div>
            <p className="text-lg text-gray-600 font-korean">하나님의 말씀으로 교회를 섬기는 교역자들을 소개합니다</p>
          </div>

          {/* Ministers Grid */}
          <ul className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
            {ministers.map((person) => (
              <li key={person.name} className="bg-white rounded-lg shadow-md p-8">
                <div className="flex flex-col items-center text-center">
                  <div className="flex items-center mb-4">
                    <div className="w-1 h-1 bg-black rounded-full mr-2"></div>
                    <span className="text-sm text-gray-500 font-korean">교역자</span>
                  </div>
                  <div className="relative h-48 w-48 rounded-full overflow-hidden mb-6">
                    <Image src={person.image} alt={person.name} fill className="object-cover" />
                  </div>
                  <h3 className="text-2xl font-bold text-black font-korean mb-2">{person.name}</h3>
                  <p className="text-lg text-gray-600 font-korean mb-4">{person.role}</p>
                  <div className="space-y-2 text-sm text-gray-500 font-korean">
                    <div className="flex items-center justify-center">
                      <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                      <span>섬김의 자세로 목양</span>
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                      <span>말씀 중심의 사역</span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* Additional Info Section */}
          <div className="mt-16 bg-gray-50 rounded-lg p-8">
            <div className="flex items-center mb-6">
              <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
              <h3 className="text-2xl font-bold text-black font-korean">섬김의 원칙</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <div className="w-1 h-1 bg-black rounded-full mr-2"></div>
                  <h4 className="font-semibold text-gray-800 font-korean">말씀 중심</h4>
                </div>
                <p className="text-sm text-gray-600 font-korean">성경 말씀을 기초로 한 목양</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <div className="w-1 h-1 bg-black rounded-full mr-2"></div>
                  <h4 className="font-semibold text-gray-800 font-korean">사랑의 실천</h4>
                </div>
                <p className="text-sm text-gray-600 font-korean">하나님의 사랑을 실천하는 섬김</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <div className="w-1 h-1 bg-black rounded-full mr-2"></div>
                  <h4 className="font-semibold text-gray-800 font-korean">공동체 세움</h4>
                </div>
                <p className="text-sm text-gray-600 font-korean">건강한 신앙공동체 건설</p>
              </div>
            </div>
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

export default MinistersPage
