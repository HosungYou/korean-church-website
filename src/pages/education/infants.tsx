import Layout from '@/components/Layout'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Image from 'next/image'

const InfantsPage = () => {
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
          <h1 className="text-4xl font-bold text-white font-korean">영아부</h1>
        </div>
      </div>
      <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-lg font-semibold text-black font-korean">"사랑 안에서 자라나는 아기들"</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl font-korean">
            영아부 (0-3세)
          </h2>
        </div>
        <div className="mt-12 prose lg:prose-xl mx-auto text-gray-700 font-korean">
          <p>
            영아부는 0세부터 3세까지의 아기들이 부모님과 함께 예배드리는 부서입니다. 
            하나님의 사랑을 처음 경험하고, 안전하고 따뜻한 환경에서 신앙의 첫걸음을 내딛습니다.
          </p>
          <ul>
            <li>예배 시간: 주일 오전 11:00</li>
            <li>장소: 영아부실 (본관 1층)</li>
            <li>대상: 0-3세 아기와 부모님</li>
          </ul>
          <p>
            찬양과 율동, 재미있는 성경 이야기와 오감 활동을 통해 아기들이 자연스럽게 하나님과 친해질 수 있도록 돕습니다.
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

export default InfantsPage
