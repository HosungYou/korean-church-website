import type { GetStaticProps, NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Layout from '@/components/Layout'
import PageHeader from '@/components/PageHeader'
import Image from 'next/image'

const Philosophy: NextPage = () => {
  return (
    <Layout>
      <PageHeader
        title="목회 철학"
        subtitle="하나님의 말씀을 기초로 예수 그리스도의 사랑을 실천하는 교회"
        height="h-72"
      />

      {/* Vision Section */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 font-korean">
                교회 비전
              </h2>
              <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
            </div>
            
            <div className="bg-blue-50 rounded-xl p-8 mb-8">
              <p className="text-2xl font-semibold text-blue-900 text-center leading-relaxed font-korean">
                "복음의 생명으로 세상을 아름답게 하는 성령의 교회"
              </p>
              <p className="text-lg text-blue-700 text-center mt-4 font-korean">
                A Spirit-filled church that beautifies the world with the life of the Gospel
              </p>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6 font-korean">
                스테이트 칼리지 한인교회는 펜실베이니아 주립대학과 지역 사회에서 
                하나님의 사랑을 전하고 실천하는 공동체입니다. 우리는 예배와 말씀, 
                기도와 교제를 통해 그리스도인으로 성장하며, 다음 세대와 지역 사회를 
                섬기는 사명을 감당합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-korean">
              교회 사명
            </h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8 transform hover:scale-105 transition-transform">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center font-korean">
                하나님 나라의 문화 창출
              </h3>
              <p className="text-gray-600 text-center font-korean">
                말씀과 성령의 능력으로 하나님 나라의 가치관을 실현하는 교회
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 transform hover:scale-105 transition-transform">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center font-korean">
                그리스도의 성품을 닮아가는 성도
              </h3>
              <p className="text-gray-600 text-center font-korean">
                예수님의 사랑과 섬김을 본받아 성숙한 그리스도인으로 성장
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 transform hover:scale-105 transition-transform">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center font-korean">
                세상을 섬기는 교회
              </h3>
              <p className="text-gray-600 text-center font-korean">
                지역 사회와 열방을 향한 선교와 봉사로 하나님의 사랑을 실천
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-korean">
              핵심 가치
            </h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-gray-50 rounded-lg p-8">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 font-korean">
                    경건한 예배
                  </h3>
                  <p className="text-gray-600 font-korean">
                    하나님께 드리는 예배를 최우선으로 하며, 성령 충만한 예배를 드립니다
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-8">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 font-korean">
                    말씀 중심
                  </h3>
                  <p className="text-gray-600 font-korean">
                    하나님의 말씀을 삶의 기준으로 삼고 말씀대로 살아갑니다
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-8">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 font-korean">
                    기도의 일상화
                  </h3>
                  <p className="text-gray-600 font-korean">
                    새벽기도와 개인 기도를 통해 하나님과 깊은 교제를 나눕니다
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-8">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    4
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 font-korean">
                    가정의 교회화
                  </h3>
                  <p className="text-gray-600 font-korean">
                    각 가정이 작은 교회가 되어 신앙을 전수하고 실천합니다
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-8">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    5
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 font-korean">
                    사랑의 교제
                  </h3>
                  <p className="text-gray-600 font-korean">
                    그리스도의 사랑으로 서로를 돌보고 섬기는 공동체를 이룹니다
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-8">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    6
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 font-korean">
                    섬김과 나눔
                  </h3>
                  <p className="text-gray-600 font-korean">
                    이웃의 아픔에 동참하고 섬기는 것이 교회의 본질적 사명입니다
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ministry Philosophy Details */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-korean">
              목회 방향
            </h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 font-korean">
                예배와 영성
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4 font-korean">
                스테이트 칼리지 한인교회는 경건하고 절제된 예배를 드립니다. 
                형식적인 예배가 아닌, 성령님의 임재 가운데 드리는 살아있는 예배를 추구합니다. 
                매주일 예배와 수요예배, 그리고 새벽기도를 통해 하나님과의 친밀한 관계를 유지합니다.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 font-korean">
                교육과 양육
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4 font-korean">
                성경적 가치관을 바탕으로 한 체계적인 신앙교육을 실시합니다. 
                유아부터 청년에 이르기까지 각 연령대에 맞는 교육 프로그램을 운영하며, 
                특별히 다음 세대의 신앙 계승을 위해 힘쓰고 있습니다.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 font-korean">
                선교와 봉사
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4 font-korean">
                지역 사회와 캠퍼스 선교에 힘쓰며, 유학생과 새로운 이민자들을 돕는 사역을 감당합니다. 
                또한 국내외 선교사들을 후원하고 단기선교를 통해 복음 전파에 동참합니다.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 font-korean">
                공동체와 교제
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4 font-korean">
                소그룹 모임과 각 부서별 활동을 통해 깊은 교제를 나눕니다. 
                서로의 짐을 나누어 지고, 기쁨과 슬픔을 함께하는 진정한 공동체를 이루어 갑니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pastor's Message Section (Image placeholder) */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-korean">
              담임목사 인사말
            </h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                {/* 사진 플레이스홀더 */}
                <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
                  <p className="text-gray-500 font-korean">담임목사 사진 위치</p>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="prose prose-lg">
                  <p className="text-gray-700 leading-relaxed mb-6 font-korean">
                    주님의 이름으로 문안드립니다.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-6 font-korean">
                    스테이트 칼리지 한인교회는 펜실베이니아 중부 지역에서 
                    하나님의 사랑을 전하고 실천하는 믿음의 공동체입니다.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-6 font-korean">
                    우리 교회는 예수 그리스도의 복음을 통해 영혼을 구원하고, 
                    하나님의 말씀으로 양육하며, 성령의 능력으로 세상을 변화시키는 
                    사명을 감당하고자 합니다.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-6 font-korean">
                    특별히 Penn State 대학의 유학생들과 이 지역에 거주하시는 
                    한인 가정들이 신앙 안에서 하나 되어, 서로 사랑하고 
                    섬기는 아름다운 교회를 만들어가기를 소망합니다.
                  </p>
                  <p className="text-gray-700 leading-relaxed font-korean">
                    여러분을 주님의 사랑으로 환영하며, 함께 하나님 나라를 
                    세워가는 동역자가 되기를 기도합니다.
                  </p>
                  <div className="mt-8">
                    <p className="text-gray-900 font-bold font-korean">
                      스테이트 칼리지 한인교회 담임목사
                    </p>
                    <p className="text-2xl font-bold text-blue-600 mt-2 font-korean">
                      연규홍 목사
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'ko', ['common'])),
    },
  }
}

export default Philosophy