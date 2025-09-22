import Layout from '@/components/Layout'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Image from 'next/image'

const YouthPage = () => {
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
          <h1 className="text-4xl font-bold text-white font-korean">중고등부</h1>
        </div>
      </div>
      <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-lg font-semibold text-black font-korean">&ldquo;비전으로 세상을 품는 청소년&rdquo;</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl font-korean">
            중고등부 (14-19세)
          </h2>
        </div>
        <div className="mt-12 prose lg:prose-xl mx-auto text-gray-700 font-korean">
          <p>
            중고등부는 청소년 시기에 겪는 다양한 고민과 질문에 대해 말씀 안에서 답을 찾고, 
            하나님이 주신 비전을 발견하여 세상을 변화시키는 리더로 성장하도록 돕는 공동체입니다.
          </p>
          <ul>
            <li>예배 시간: 주일 오전 11:00</li>
            <li>장소: 중고등부실 (비전센터 2층)</li>
            <li>대상: 14-19세 청소년</li>
          </ul>
          <p>
            역동적인 찬양과 깊이 있는 말씀, 그리고 진솔한 나눔이 있는 소그룹을 통해 하나님과 깊은 관계를 맺어갑니다.
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

export default YouthPage
