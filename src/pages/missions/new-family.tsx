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
          <div className="flex items-center">
            <div className="w-3 h-3 bg-white rounded-full mr-4"></div>
            <h1 className="text-4xl font-bold text-white font-korean">새가족양육</h1>
          </div>
        </div>
      </div>
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
              <h2 className="text-3xl font-bold text-black font-korean">환영합니다</h2>
            </div>
            <p className="text-2xl font-semibold text-black font-korean mb-4">
              교회에 오신 것을 환영합니다
            </p>
            <p className="text-lg text-gray-600 font-korean">
              새로운 신앙의 여정을 함께 시작하게 되어 기쁩니다
            </p>
          </div>

          {/* Program Overview */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-12">
            <div className="flex items-center mb-6">
              <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
              <h3 className="text-2xl font-bold text-black font-korean">새가족양육 프로그램</h3>
            </div>
            <div className="space-y-6 text-lg text-gray-700 font-korean">
              <div className="flex items-start">
                <div className="w-1 h-1 bg-black rounded-full mr-3 mt-3"></div>
                <p>
                  새가족양육부는 교회에 처음 오신 분들이 잘 정착할 수 있도록 돕는 과정입니다. 
                  4주간의 교육을 통해 교회의 비전을 공유하고, 신앙의 기초를 다지며, 소그룹에 연결되어 교제의 기쁨을 누리도록 안내합니다.
                </p>
              </div>
              <div className="flex items-start">
                <div className="w-1 h-1 bg-black rounded-full mr-3 mt-3"></div>
                <p>
                  새가족 여러분을 언제나 환영하며, 여러분의 신앙 여정에 든든한 동반자가 되겠습니다.
                </p>
              </div>
            </div>
          </div>

          {/* 4-Week Curriculum */}
          <div className="bg-gray-50 rounded-lg p-8 mb-12">
            <div className="flex items-center mb-6">
              <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
              <h3 className="text-2xl font-bold text-black font-korean">4주 커리큘럼</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-1 h-1 bg-black rounded-full mr-2"></div>
                    <h4 className="font-semibold text-gray-800 font-korean">1주차: 교회 소개</h4>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-600 font-korean">
                    <li className="flex items-start">
                      <div className="w-1 h-1 bg-gray-400 rounded-full mr-2 mt-2"></div>
                      <span>교회 역사와 비전</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-1 h-1 bg-gray-400 rounded-full mr-2 mt-2"></div>
                      <span>예배와 부서 안내</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-white rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-1 h-1 bg-black rounded-full mr-2"></div>
                    <h4 className="font-semibold text-gray-800 font-korean">2주차: 신앙의 기초</h4>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-600 font-korean">
                    <li className="flex items-start">
                      <div className="w-1 h-1 bg-gray-400 rounded-full mr-2 mt-2"></div>
                      <span>구원의 확신</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-1 h-1 bg-gray-400 rounded-full mr-2 mt-2"></div>
                      <span>성경 읽기의 중요성</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-1 h-1 bg-black rounded-full mr-2"></div>
                    <h4 className="font-semibold text-gray-800 font-korean">3주차: 그리스도인의 삶</h4>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-600 font-korean">
                    <li className="flex items-start">
                      <div className="w-1 h-1 bg-gray-400 rounded-full mr-2 mt-2"></div>
                      <span>기도와 찬양</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-1 h-1 bg-gray-400 rounded-full mr-2 mt-2"></div>
                      <span>헌금과 봉사</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-white rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-1 h-1 bg-black rounded-full mr-2"></div>
                    <h4 className="font-semibold text-gray-800 font-korean">4주차: 공동체 참여</h4>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-600 font-korean">
                    <li className="flex items-start">
                      <div className="w-1 h-1 bg-gray-400 rounded-full mr-2 mt-2"></div>
                      <span>소그룹 연결</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-1 h-1 bg-gray-400 rounded-full mr-2 mt-2"></div>
                      <span>선교와 전도</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits & Support */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-12">
            <div className="flex items-center mb-6">
              <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
              <h3 className="text-2xl font-bold text-black font-korean">지원 혜택</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-1 h-1 bg-black rounded-full mr-2"></div>
                  <h4 className="font-semibold text-gray-800 font-korean">1:1 멘토링</h4>
                </div>
                <p className="text-sm text-gray-600 font-korean">전담 멘토와 함께하는 개별 상담</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-1 h-1 bg-black rounded-full mr-2"></div>
                  <h4 className="font-semibold text-gray-800 font-korean">환영 선물</h4>
                </div>
                <p className="text-sm text-gray-600 font-korean">성경책과 교회 소개 자료 제공</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-1 h-1 bg-black rounded-full mr-2"></div>
                  <h4 className="font-semibold text-gray-800 font-korean">소그룹 연결</h4>
                </div>
                <p className="text-sm text-gray-600 font-korean">나이와 관심사에 맞는 소그룹 매칭</p>
              </div>
            </div>
          </div>

          {/* Contact & Registration */}
          <div className="bg-gray-50 rounded-lg p-8">
            <div className="flex items-center mb-6">
              <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
              <h3 className="text-2xl font-bold text-black font-korean">참여 안내</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center mb-4">
                  <div className="w-1 h-1 bg-black rounded-full mr-2"></div>
                  <h4 className="font-semibold text-gray-800 font-korean">모임 정보</h4>
                </div>
                <div className="space-y-3 text-gray-600 font-korean">
                  <div className="flex items-start">
                    <div className="w-1 h-1 bg-gray-400 rounded-full mr-2 mt-2"></div>
                    <span>시간: 매주 주일 오후 1:00</span>
                  </div>
                  <div className="flex items-start">
                    <div className="w-1 h-1 bg-gray-400 rounded-full mr-2 mt-2"></div>
                    <span>장소: 새가족실 (교육관 2층)</span>
                  </div>
                  <div className="flex items-start">
                    <div className="w-1 h-1 bg-gray-400 rounded-full mr-2 mt-2"></div>
                    <span>기간: 4주 과정 (월 1회 개강)</span>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-center mb-4">
                  <div className="w-1 h-1 bg-black rounded-full mr-2"></div>
                  <h4 className="font-semibold text-gray-800 font-korean">등록 방법</h4>
                </div>
                <div className="space-y-3 text-gray-600 font-korean">
                  <div className="flex items-start">
                    <div className="w-1 h-1 bg-gray-400 rounded-full mr-2 mt-2"></div>
                    <span>주일 예배 후 안내데스크 방문</span>
                  </div>
                  <div className="flex items-start">
                    <div className="w-1 h-1 bg-gray-400 rounded-full mr-2 mt-2"></div>
                    <span>전화: 814-380-9393</span>
                  </div>
                  <div className="flex items-start">
                    <div className="w-1 h-1 bg-gray-400 rounded-full mr-2 mt-2"></div>
                    <span>이메일: newfamily@church.com</span>
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

export default NewFamilyPage
