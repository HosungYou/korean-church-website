import Layout from '@/components/Layout'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Image from 'next/image'

const HistoryPage = () => {
  const timeline = [
    { year: '2010', event: '교회 설립 준비 모임 시작' },
    { year: '2011', event: '첫 예배 및 교회 창립' },
    { year: '2015', event: '첫 단기선교 파송' },
    { year: '2020', event: '새 성전으로 이전' },
    { year: '2023', event: '온라인 예배 시스템 구축 및 송출 시작' },
  ]

  return (
    <Layout>
      <div className="relative h-64 bg-black">
        <Image
          src="/images/history-header.jpg"
          alt="Church History"
          fill
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white font-korean">교회 연혁</h1>
        </div>
      </div>
      <div className="max-w-4xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
        <div className="flow-root">
          <ul className="-mb-8">
            {timeline.map((item, itemIdx) => (
              <li key={item.year}>
                <div className="relative pb-8">
                  {itemIdx !== timeline.length - 1 ? (
                    <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                  ) : null}
                  <div className="relative flex space-x-3">
                    <div>
                      <span className="h-8 w-8 rounded-full bg-black flex items-center justify-center ring-8 ring-white">
                        <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
                        </svg>
                      </span>
                    </div>
                    <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                      <div>
                        <p className="text-xl font-semibold text-gray-900 font-korean">{item.year}</p>
                        <p className="mt-1 text-base text-gray-600 font-korean">{item.event}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
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

export default HistoryPage
