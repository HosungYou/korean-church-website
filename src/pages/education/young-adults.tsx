import Layout from '@/components/Layout'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Image from 'next/image'

const YoungAdultsPage = () => {
  return (
    <Layout>
      <div className="relative h-64 bg-black">
        <Image
          src="/images/education-header.jpg"
          alt="Church School"
          fill
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white font-korean">청년부</h1>
        </div>
      </div>
      <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-lg font-semibold text-black font-korean">"세상의 중심에서 그리스도를 외치는 세대"</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl font-korean">
            청년부
          </h2>
        </div>
        <div className="mt-12 prose lg:prose-xl mx-auto text-gray-700 font-korean">
          <p>
            청년부는 학업, 직장, 결혼 등 삶의 중요한 전환기를 맞이하는 청년들이 모여 
            말씀과 기도로 서로를 격려하고 지지하며, 세상 속에서 그리스도인으로서의 정체성을 굳건히 세워나가는 공동체입니다.
          </p>
          <ul>
            <li>예배 시간: 주일 오후 2:00</li>
            <li>장소: 본당</li>
            <li>대상: 대학생 및 미혼 청년</li>
          </ul>
          <p>
            치열한 삶의 현장에서 겪는 문제들을 함께 나누고 기도하며, 하나님의 인도하심을 구하는 살아있는 예배를 드립니다.
          </p>
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

export default YoungAdultsPage
