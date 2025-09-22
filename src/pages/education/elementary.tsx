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
          <div className="flex items-center">
            <div className="w-3 h-3 bg-white rounded-full mr-4"></div>
            <h1 className="text-4xl font-bold text-white font-korean">초등부</h1>
          </div>
        </div>
      </div>
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
          {/* Vision Statement */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
              <h2 className="text-3xl font-bold text-black font-korean">초등부 비전</h2>
            </div>
            <p className="text-2xl font-semibold text-black font-korean mb-4">&ldquo;세상을 이기는 믿음의 용사&rdquo;</p>
            <p className="text-lg text-gray-600 font-korean">8-13세 학생들이 하나님을 인격적으로 만나는 공간</p>
          </div>

          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-12">
            <div className="flex items-center mb-6">
              <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
              <h3 className="text-2xl font-bold text-black font-korean">부서 안내</h3>
            </div>
            <div className="space-y-4 text-lg text-gray-700 font-korean">
              <div className="flex items-start">
                <div className="w-1 h-1 bg-black rounded-full mr-3 mt-3"></div>
                <div>
                  <p className="mb-2">
                    초등부는 8세부터 13세까지의 학생들이 예배와 소그룹 활동을 통해 하나님을 인격적으로 만나고, 
                    세상을 살아갈 믿음의 실력을 키우는 부서입니다.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-1 h-1 bg-black rounded-full mr-3 mt-3"></div>
                <div>
                  <p>
                    체계적인 성경공부와 제자훈련, 그리고 다양한 액티비티를 통해 다음 세대의 리더로 성장하도록 돕습니다.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Service Information */}
          <div className="bg-gray-50 rounded-lg p-8 mb-12">
            <div className="flex items-center mb-6">
              <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
              <h3 className="text-2xl font-bold text-black font-korean">예배 정보</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-1 h-1 bg-black rounded-full mr-2"></div>
                  <h4 className="font-semibold text-gray-800 font-korean">예배 시간</h4>
                </div>
                <p className="text-gray-600 font-korean">주일 오전 11:00</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-1 h-1 bg-black rounded-full mr-2"></div>
                  <h4 className="font-semibold text-gray-800 font-korean">예배 장소</h4>
                </div>
                <p className="text-gray-600 font-korean">초등부실 (비전센터 1층)</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-1 h-1 bg-black rounded-full mr-2"></div>
                  <h4 className="font-semibold text-gray-800 font-korean">대상 연령</h4>
                </div>
                <p className="text-gray-600 font-korean">8-13세 학생</p>
              </div>
            </div>
          </div>

          {/* Programs */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-12">
            <div className="flex items-center mb-6">
              <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
              <h3 className="text-2xl font-bold text-black font-korean">교육 프로그램</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center mb-4">
                  <div className="w-1 h-1 bg-black rounded-full mr-2"></div>
                  <h4 className="font-semibold text-gray-800 font-korean">주일 프로그램</h4>
                </div>
                <ul className="space-y-2 text-gray-600 font-korean">
                  <li className="flex items-start">
                    <div className="w-1 h-1 bg-gray-400 rounded-full mr-2 mt-2"></div>
                    <span>찬양과 경배</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-1 h-1 bg-gray-400 rounded-full mr-2 mt-2"></div>
                    <span>말씀 나눔</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-1 h-1 bg-gray-400 rounded-full mr-2 mt-2"></div>
                    <span>소그룹 활동</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-1 h-1 bg-gray-400 rounded-full mr-2 mt-2"></div>
                    <span>만들기 및 게임</span>
                  </li>
                </ul>
              </div>
              <div>
                <div className="flex items-center mb-4">
                  <div className="w-1 h-1 bg-black rounded-full mr-2"></div>
                  <h4 className="font-semibold text-gray-800 font-korean">특별 활동</h4>
                </div>
                <ul className="space-y-2 text-gray-600 font-korean">
                  <li className="flex items-start">
                    <div className="w-1 h-1 bg-gray-400 rounded-full mr-2 mt-2"></div>
                    <span>여름/겨울 성경학교</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-1 h-1 bg-gray-400 rounded-full mr-2 mt-2"></div>
                    <span>체험학습 및 견학</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-1 h-1 bg-gray-400 rounded-full mr-2 mt-2"></div>
                    <span>발표회 및 축제</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-1 h-1 bg-gray-400 rounded-full mr-2 mt-2"></div>
                    <span>부모님과 함께하는 행사</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Educational Goals */}
          <div className="bg-gray-50 rounded-lg p-8">
            <div className="flex items-center mb-6">
              <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
              <h3 className="text-2xl font-bold text-black font-korean">교육 목표</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-1 h-1 bg-black rounded-full mr-3 mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-gray-800 font-korean mb-2">믿음의 기초 확립</h4>
                    <p className="text-sm text-gray-600 font-korean">성경적 세계관 형성과 기독교 가치관 정립</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-1 h-1 bg-black rounded-full mr-3 mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-gray-800 font-korean mb-2">인격적 성장</h4>
                    <p className="text-sm text-gray-600 font-korean">하나님의 사랑 안에서 건전한 자아정체성 형성</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-1 h-1 bg-black rounded-full mr-3 mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-gray-800 font-korean mb-2">공동체 의식</h4>
                    <p className="text-sm text-gray-600 font-korean">서로 사랑하고 섬기는 공동체 정신 함양</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-1 h-1 bg-black rounded-full mr-3 mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-gray-800 font-korean mb-2">리더십 개발</h4>
                    <p className="text-sm text-gray-600 font-korean">미래의 교회와 사회를 이끌 리더로 준비</p>
                  </div>
                </div>
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

export default ElementaryPage
