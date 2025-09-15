import Layout from '@/components/Layout'
import PageHeader from '@/components/PageHeader'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const InternationalMissionsPage = () => {
  return (
    <Layout>
      <PageHeader
        title="해외선교"
        subtitle="땅끝까지 복음을 전하는 사명을 감당합니다"
      />
      <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl font-korean">
            땅 끝까지 복음을 전합니다
          </h2>
        </div>
        <div className="mt-12 prose lg:prose-xl mx-auto text-gray-700 font-korean">
          <p>
            해외선교부는 예수님의 지상대명령에 순종하여 땅 끝까지 복음을 전하는 사명을 감당합니다. 
            전 세계에 파송된 선교사님들을 후원하고 협력하며, 단기선교팀을 파견하여 현지 사역을 돕습니다.
          </p>
          <p>
            모든 성도들이 선교에 동참할 수 있도록 기도와 후원, 단기선교 참여 등 다양한 방법을 제시하고 격려합니다.
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

export default InternationalMissionsPage
