import Layout from '@/components/Layout'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Image from 'next/image'

const NewFamilyPage = () => {
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
          <h1 className="text-4xl font-bold text-white font-korean">새가족양육</h1>
        </div>
      </div>
      <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl font-korean">
            교회에 오신 것을 환영합니다
          </h2>
        </div>
        <div className="mt-12 prose lg:prose-xl mx-auto text-gray-700 font-korean">
          <p>
            새가족양육부는 교회에 처음 오신 분들이 잘 정착할 수 있도록 돕는 과정입니다. 
            4주간의 교육을 통해 교회의 비전을 공유하고, 신앙의 기초를 다지며, 소그룹에 연결되어 교제의 기쁨을 누리도록 안내합니다.
          </p>
          <p>
            새가족 여러분을 언제나 환영하며, 여러분의 신앙 여정에 든든한 동반자가 되겠습니다.
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

export default NewFamilyPage
