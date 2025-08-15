import type { GetStaticProps, NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Layout from '@/components/Layout'
import Link from 'next/link'
import { ChevronRight, Church, Book, Users, Heart, Globe, Calendar } from 'lucide-react'

const About: NextPage = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-korean">
              스테이트 칼리지 한인교회
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-korean">
              State College Korean Church
            </p>
            <p className="text-lg text-gray-500 mt-4 font-korean">
              하나님의 사랑으로 하나되는 믿음의 공동체
            </p>
          </div>
        </div>
      </section>

      {/* Quick Links Grid */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* 목회 철학 */}
            <Link href="/about/philosophy" className="group">
              <div className="bg-white border-2 border-gray-200 rounded-xl p-8 hover:border-blue-500 hover:shadow-xl transition-all duration-300 h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                    <Church className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 font-korean group-hover:text-blue-600 transition-colors">
                  목회 철학
                </h3>
                <p className="text-gray-600 font-korean text-sm leading-relaxed">
                  교회의 비전, 사명, 핵심 가치와 목회 방향을 소개합니다
                </p>
              </div>
            </Link>

            {/* 인사말 */}
            <Link href="/about/greeting" className="group">
              <div className="bg-white border-2 border-gray-200 rounded-xl p-8 hover:border-blue-500 hover:shadow-xl transition-all duration-300 h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-600 transition-colors">
                    <Heart className="w-7 h-7 text-green-600 group-hover:text-white transition-colors" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 font-korean group-hover:text-green-600 transition-colors">
                  인사말
                </h3>
                <p className="text-gray-600 font-korean text-sm leading-relaxed">
                  담임목사님의 인사말과 교회 소개
                </p>
              </div>
            </Link>

            {/* 교회 역사 */}
            <Link href="/about/history" className="group">
              <div className="bg-white border-2 border-gray-200 rounded-xl p-8 hover:border-blue-500 hover:shadow-xl transition-all duration-300 h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-600 transition-colors">
                    <Book className="w-7 h-7 text-purple-600 group-hover:text-white transition-colors" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 font-korean group-hover:text-purple-600 transition-colors">
                  교회 역사
                </h3>
                <p className="text-gray-600 font-korean text-sm leading-relaxed">
                  교회의 설립과 성장 과정을 소개합니다
                </p>
              </div>
            </Link>

            {/* 섬기는 분들 */}
            <Link href="/about/ministers" className="group">
              <div className="bg-white border-2 border-gray-200 rounded-xl p-8 hover:border-blue-500 hover:shadow-xl transition-all duration-300 h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-600 transition-colors">
                    <Users className="w-7 h-7 text-orange-600 group-hover:text-white transition-colors" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-orange-600 transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 font-korean group-hover:text-orange-600 transition-colors">
                  섬기는 분들
                </h3>
                <p className="text-gray-600 font-korean text-sm leading-relaxed">
                  교역자와 장로, 안수집사, 각 부서 임원을 소개합니다
                </p>
              </div>
            </Link>

            {/* 예배 안내 */}
            <Link href="/about/service-info" className="group">
              <div className="bg-white border-2 border-gray-200 rounded-xl p-8 hover:border-blue-500 hover:shadow-xl transition-all duration-300 h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                    <Calendar className="w-7 h-7 text-indigo-600 group-hover:text-white transition-colors" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 font-korean group-hover:text-indigo-600 transition-colors">
                  예배 안내
                </h3>
                <p className="text-gray-600 font-korean text-sm leading-relaxed">
                  주일예배, 수요예배, 새벽기도 시간을 안내합니다
                </p>
              </div>
            </Link>

            {/* 오시는 길 */}
            <Link href="/about/directions" className="group">
              <div className="bg-white border-2 border-gray-200 rounded-xl p-8 hover:border-blue-500 hover:shadow-xl transition-all duration-300 h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-600 transition-colors">
                    <Globe className="w-7 h-7 text-red-600 group-hover:text-white transition-colors" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-red-600 transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 font-korean group-hover:text-red-600 transition-colors">
                  오시는 길
                </h3>
                <p className="text-gray-600 font-korean text-sm leading-relaxed">
                  교회 위치와 연락처를 안내합니다
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Church Info Section */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Image Placeholder */}
              <div className="bg-gray-200 h-96 lg:h-auto flex items-center justify-center">
                <p className="text-gray-500 font-korean">교회 전경 사진 위치</p>
              </div>
              
              {/* Info Content */}
              <div className="p-8 lg:p-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 font-korean">
                  환영합니다
                </h2>
                <div className="space-y-4 text-gray-700 font-korean">
                  <p className="leading-relaxed">
                    스테이트 칼리지 한인교회는 펜실베이니아 주립대학(Penn State University)과 
                    State College 지역에 거주하는 한인들을 위한 신앙 공동체입니다.
                  </p>
                  <p className="leading-relaxed">
                    1977년 설립 이래로 지역 사회와 캠퍼스 선교에 힘쓰며, 
                    다음 세대를 위한 신앙 교육과 한인 공동체의 화합을 위해 노력하고 있습니다.
                  </p>
                  <p className="leading-relaxed">
                    예수 그리스도의 사랑 안에서 함께 예배하고, 교제하며, 
                    섬기는 아름다운 교회로 여러분을 초대합니다.
                  </p>
                </div>
                
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2 font-korean">주일예배</h3>
                      <p className="text-gray-600 font-korean">매주 주일 오전 11:00</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2 font-korean">수요예배</h3>
                      <p className="text-gray-600 font-korean">매주 수요일 저녁 7:30</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2 font-korean">새벽기도</h3>
                      <p className="text-gray-600 font-korean">화-토 오전 6:00</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2 font-korean">주일학교</h3>
                      <p className="text-gray-600 font-korean">매주 주일 오전 11:00</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-korean">
              연락처 및 위치
            </h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-blue-50 rounded-xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 font-korean">주소</h3>
                  <p className="text-gray-700 font-korean">
                    758 Glenn Rd<br />
                    State College, PA 16803
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 font-korean">전화</h3>
                  <p className="text-gray-700 font-korean">
                    (814) 380-9393
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 font-korean">이메일</h3>
                  <p className="text-gray-700 font-korean">
                    KyuHongYeon@gmail.com
                  </p>
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

export default About