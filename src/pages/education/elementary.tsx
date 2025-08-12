import Layout from '@/components/Layout'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Image from 'next/image'

const ElementaryPage = () => {
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
          <h1 className="text-4xl font-bold text-white font-korean">초등부</h1>
        </div>
      </div>
      <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-lg font-semibold text-black font-korean">"세상을 이기는 믿음의 용사"</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl font-korean">
            초등부 (8-13세)
          </h2>
        </div>
        <div className="mt-12 prose lg:prose-xl mx-auto text-gray-700 font-korean">
          <p>
            초등부는 8세부터 13세까지의 학생들이 예배와 소그룹 활동을 통해 하나님을 인격적으로 만나고, 
            세상을 살아갈 믿음의 실력을 키우는 부서입니다.
          </p>
          <ul>
            <li>예배 시간: 주일 오전 11:00</li>
            <li>장소: 초등부실 (비전센터 1층)</li>
            <li>대상: 8-13세 학생</li>
          </ul>
          <p>
            체계적인 성경공부와 제자훈련, 그리고 다양한 액티비티를 통해 다음 세대의 리더로 성장하도록 돕습니다.
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

export default ElementaryPage
