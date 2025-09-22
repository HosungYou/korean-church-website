import Layout from '@/components/Layout'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Image from 'next/image'

const KindergartenPage = () => {
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
          <h1 className="text-4xl font-bold text-white font-korean">유치부</h1>
        </div>
      </div>
      <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-lg font-semibold text-black font-korean">&ldquo;말씀을 배우는 어린이&rdquo;</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl font-korean">
            유치부 (4-7세)
          </h2>
        </div>
        <div className="mt-12 prose lg:prose-xl mx-auto text-gray-700 font-korean">
          <p>
            유치부는 4세부터 7세까지의 어린이들이 함께 예배하며 신앙을 키워나가는 공동체입니다. 
            다양한 활동과 성경공부를 통해 하나님의 말씀을 쉽고 재미있게 배웁니다.
          </p>
          <ul>
            <li>예배 시간: 주일 오전 11:00</li>
            <li>장소: 유치부실 (본관 2층)</li>
            <li>대상: 4-7세 어린이</li>
          </ul>
          <p>
            암송, 찬양, 그룹 활동 등을 통해 아이들이 말씀 안에서 서로 교제하며 건강한 신앙인으로 성장하도록 돕습니다.
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

export default KindergartenPage
