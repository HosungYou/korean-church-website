import Layout from '@/components/Layout'
import PageHeader from '@/components/PageHeader'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Image from 'next/image'
import Link from 'next/link'

const SundaySermonsPage = () => {
  const sermons = [
    { id: 1, title: '믿음의 기초', speaker: '김철수 목사', date: '2025-08-10', videoId: 'dQw4w9WgXcQ', image: '/images/sermon1.jpg' },
    { id: 2, title: '사랑의 실천', speaker: '김철수 목사', date: '2025-08-03', videoId: 'dQw4w9WgXcQ', image: '/images/sermon2.jpg' },
    { id: 3, title: '소망의 이유', speaker: '이영희 부목사', date: '2025-07-27', videoId: 'dQw4w9WgXcQ', image: '/images/sermon3.jpg' },
    { id: 4, title: '은혜의 통로', speaker: '김철수 목사', date: '2025-07-20', videoId: 'dQw4w9WgXcQ', image: '/images/sermon4.jpg' },
  ]

  return (
    <Layout>
      <PageHeader
        title="주일예배"
        subtitle="하나님의 말씀으로 은혜받는 주일예배 설교말씀"
      />
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
              <h2 className="text-3xl font-bold text-black font-korean">최근 설교</h2>
            </div>
            <p className="text-lg text-gray-600 font-korean">하나님의 말씀으로 은혜받는 주일예배 설교말씀</p>
          </div>

          {/* Service Info */}
          <div className="bg-gray-50 rounded-lg p-8 mb-12">
            <div className="flex items-center mb-6">
              <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
              <h3 className="text-2xl font-bold text-black font-korean">예배 안내</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <div className="w-1 h-1 bg-black rounded-full mr-2"></div>
                  <h4 className="font-semibold text-gray-800 font-korean">예배 시간</h4>
                </div>
                <p className="text-sm text-gray-600 font-korean">주일 오전 11:00</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <div className="w-1 h-1 bg-black rounded-full mr-2"></div>
                  <h4 className="font-semibold text-gray-800 font-korean">예배 장소</h4>
                </div>
                <p className="text-sm text-gray-600 font-korean">본당 (메인홀)</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <div className="w-1 h-1 bg-black rounded-full mr-2"></div>
                  <h4 className="font-semibold text-gray-800 font-korean">동시통역</h4>
                </div>
                <p className="text-sm text-gray-600 font-korean">한국어/영어</p>
              </div>
            </div>
          </div>

          {/* Sermons Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12">
            {sermons.map((sermon) => (
              <div key={sermon.id} className="group bg-white rounded-lg shadow-md overflow-hidden">
                <Link href={`/sermons/sunday/${sermon.id}`}>
                  <div className="relative aspect-w-16 aspect-h-9">
                    <Image src={sermon.image} alt={sermon.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center mb-3">
                      <div className="w-1 h-1 bg-black rounded-full mr-2"></div>
                      <span className="text-xs text-gray-500 font-korean">설교말씀</span>
                    </div>
                    <h3 className="text-xl font-bold text-black font-korean group-hover:underline mb-2">{sermon.title}</h3>
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                        <p className="text-base text-gray-600 font-korean">{sermon.speaker}</p>
                      </div>
                      <div className="flex items-center">
                        <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                        <p className="text-sm text-gray-500 font-english">{sermon.date}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* Additional Resources */}
          <div className="mt-16 bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center mb-6">
              <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
              <h3 className="text-2xl font-bold text-black font-korean">설교 자료</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center mb-4">
                  <div className="w-1 h-1 bg-black rounded-full mr-2"></div>
                  <h4 className="font-semibold text-gray-800 font-korean">온라인 시청</h4>
                </div>
                <ul className="space-y-2 text-sm text-gray-600 font-korean">
                  <li className="flex items-center">
                    <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                    YouTube 라이브 스트리밍
                  </li>
                  <li className="flex items-center">
                    <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                    과거 설교 아카이브 제공
                  </li>
                </ul>
              </div>
              <div>
                <div className="flex items-center mb-4">
                  <div className="w-1 h-1 bg-black rounded-full mr-2"></div>
                  <h4 className="font-semibold text-gray-800 font-korean">설교 노트</h4>
                </div>
                <ul className="space-y-2 text-sm text-gray-600 font-korean">
                  <li className="flex items-center">
                    <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                    PDF 다운로드 가능
                  </li>
                  <li className="flex items-center">
                    <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                    성경 본문 및 요약 포함
                  </li>
                </ul>
              </div>
            </div>
          </div>
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

export default SundaySermonsPage
