import Layout from '@/components/Layout'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Image from 'next/image'

const DiscipleshipPage = () => {
  return (
    <Layout>
      <div className="relative h-64 bg-black">
        <Image
          src="/images/missions-header.jpg"
          alt="Missions"
          fill
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white font-korean">제자훈련</h1>
        </div>
      </div>
      <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl font-korean">
            예수님의 성숙한 제자로 성장합니다
          </h2>
        </div>
        <div className="mt-12 prose lg:prose-xl mx-auto text-gray-700 font-korean">
          <p>
            제자훈련은 모든 성도들이 예수 그리스도의 성숙한 제자로 성장하도록 돕는 체계적인 훈련 과정입니다. 
            말씀과 기도를 통해 하나님과의 관계를 깊이 하고, 삶의 모든 영역에서 하나님 나라를 이루어가는 훈련을 받습니다.
          </p>
          <p>
            소그룹으로 모여 함께 배우고 나누며, 서로의 삶을 격려하고 도전하는 역동적인 훈련을 통해 세상 속에서 영향력 있는 그리스도인으로 세워집니다.
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

export default DiscipleshipPage
