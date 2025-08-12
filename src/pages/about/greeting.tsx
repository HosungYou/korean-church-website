import Layout from '@/components/Layout'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Image from 'next/image'

const GreetingPage = () => {
  return (
    <Layout>
      <div className="relative h-64 bg-black">
        <Image
          src="/images/about-header.jpg"
          alt="About us"
          fill
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white font-korean">인사말</h1>
        </div>
      </div>
      <div className="bg-dotted-pattern">
        <div className="max-w-4xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-2xl font-bold text-black font-korean leading-relaxed">
              "하나님을 경험하는 교회, 세상을 변화시키는 교회"
            </p>
            <p className="mt-4 text-lg text-gray-700 font-korean">
              우리 교회에 오신 여러분을 진심으로 환영합니다.
            </p>
          </div>
          <div className="mt-16 text-lg text-gray-800 space-y-6 font-korean leading-relaxed text-left">
            <p>
              이곳은 하나님의 사랑과 은혜가 넘치는 공동체입니다. 우리는 함께 모여 예배하고, 말씀을 배우며, 서로를 위해 기도합니다. 
              성령의 인도하심 속에서 우리는 각자의 삶의 자리에서 빛과 소금의 역할을 감당하며, 이웃과 세상을 섬기는 증인의 삶을 살아가고자 합니다.
            </p>
            <p>
              교회는 건물이 아니라 바로 우리 자신입니다. 여러분 한 분 한 분이 모여 교회를 이룹니다. 
              아직 신앙이 없으신 분이라도 괜찮습니다. 열린 마음으로 오셔서 삶의 참된 의미와 목적을 함께 찾아가는 여정에 동참하시길 바랍니다.
            </p>
            <p>
              여러분의 삶에 하나님의 놀라운 축복이 함께하시기를 기도합니다.
            </p>
            <p className="text-right mt-12 font-semibold">담임목사 드림</p>
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

export default GreetingPage
