import Layout from '@/components/Layout'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Image from 'next/image'

const DomesticMissionsPage = () => {
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
          <h1 className="text-4xl font-bold text-white font-korean">국내선교</h1>
        </div>
      </div>
      <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl font-korean">
            우리 주변의 이웃을 섬깁니다
          </h2>
        </div>
        <div className="mt-12 prose lg:prose-xl mx-auto text-gray-700 font-korean">
          <p>
            국내선교부는 우리 주변의 소외된 이웃들에게 그리스도의 사랑을 실천하며, 
            지역 사회를 섬기는 다양한 사역을 감당하고 있습니다.
          </p>
          <p>
            주요 사역으로는 미자립교회 지원, 농어촌 봉사활동, 노숙인 사역, 지역아동센터 지원 등이 있으며, 
            성도님들의 자발적인 참여와 후원을 통해 이루어집니다.
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

export default DomesticMissionsPage
