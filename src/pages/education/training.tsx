import type { GetStaticProps, NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Layout from '@/components/Layout'
import { useState } from 'react'
import { Search, BookOpen, Users, Clock, Calendar, ChevronDown, Star, ArrowRight } from 'lucide-react'

const EducationTraining: NextPage = () => {
  const [activeFilter, setActiveFilter] = useState('전체')
  const [searchTerm, setSearchTerm] = useState('')

  const filterOptions = ['전체', '신입', '재수', '가족', '양육', '훈련']
  const categoryOptions = ['전체', '새가족 양육 프로그램', '제자훈련']

  const programs = [
    {
      id: 1,
      category: '신입자과',
      type: '새가족 양육 프로그램',
      title: '새가족 양육 프로그램',
      duration: '13주',
      description: '새롭게 교회에 나오시는 분들을 위한 기초 신앙교육 과정입니다. 기독교의 기본 교리와 교회 생활에 대해 배웁니다.',
      image: '/images/education/new-member.jpg',
      schedule: '매주 일요일 오후 2시',
      location: '교육관 2층',
      instructor: '김목사',
      status: '모집중',
      level: '기초'
    },
    {
      id: 2,
      category: '제자훈련',
      type: '제자훈련',
      title: '제자훈련',
      duration: '4주',
      description: '영성 생활의 기초를 다지고 깊은 신앙생활을 위한 영성훈련 프로그램입니다. 기도, 말씀묵상, 영적 성장에 집중합니다.',
      image: '/images/education/spiritual.jpg',
      schedule: '매주 수요일 오후 7시',
      location: '본당',
      instructor: '이목사',
      status: '진행중',
      level: '중급'
    }
  ]

  const filteredPrograms = programs.filter(program => {
    const matchesFilter = activeFilter === '전체' || program.category.includes(activeFilter)
    const matchesSearch = program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         program.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <Layout>
      {/* Header Section */}
      <section className="bg-white py-16 border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 font-korean">
              교육/훈련
            </h1>
            <p className="text-xl text-gray-600 mb-8 font-korean">
              체계적인 신앙교육을 통해 성숙한 그리스도인으로 성장하세요
            </p>
            <div className="flex justify-center space-x-8 text-sm text-gray-600">
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                <span className="font-korean">전문 교육진</span>
              </div>
              <div className="flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                <span className="font-korean">체계적 커리큘럼</span>
              </div>
              <div className="flex items-center">
                <Star className="w-5 h-5 mr-2" />
                <span className="font-korean">맞춤형 교육</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="bg-white py-8 border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-lg text-gray-700 mb-6 font-korean">
            참여할 교육/훈련을 찾아보세요.
          </p>
          
          {/* Search Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="강좌명을 입력하세요"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-korean"
              />
            </div>
            <button className="bg-black text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-colors flex items-center justify-center font-korean">
              <Search className="w-5 h-5 mr-2" />
              검색
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {filterOptions.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`py-2 px-4 border-b-2 font-medium text-sm whitespace-nowrap font-korean transition-colors ${
                    activeFilter === filter
                      ? 'border-black text-black'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-12 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {filteredPrograms.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredPrograms.map((program) => (
                <div key={program.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Program Image */}
                  <div className="relative h-48 bg-black">
                    <div className="absolute top-4 left-4">
                      <span className="bg-white text-black px-3 py-1 rounded-full text-sm font-medium font-korean">
                        {program.category}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium font-korean ${
                        program.status === '모집중' 
                          ? 'bg-white text-black' 
                          : 'bg-gray-200 text-gray-700'
                      }`}>
                        {program.status}
                      </span>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white">
                        <h3 className="text-2xl font-bold mb-2 font-korean">
                          {program.title}
                        </h3>
                        <p className="text-lg opacity-90 font-korean">{program.duration}</p>
                      </div>
                    </div>
                  </div>

                  {/* Program Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-gray-600 font-medium font-korean">
                        {program.type}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium font-korean ${
                        program.level === '기초' 
                          ? 'bg-gray-100 text-gray-700'
                          : 'bg-black text-white'
                      }`}>
                        {program.level}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-4 leading-relaxed font-korean">
                      {program.description}
                    </p>
                    
                    {/* Program Details */}
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="font-korean">{program.schedule}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="font-korean">{program.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="font-korean">담당: {program.instructor}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition-colors flex items-center justify-center font-korean">
                      신청하기
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2 font-korean">
                해당하는 교육과정이 없습니다
              </h3>
              <p className="text-gray-500 font-korean">
                다른 검색 조건을 시도해보세요.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Additional Info Section */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* New Member Program */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 font-korean">
                새가족 양육 프로그램
              </h3>
              <p className="text-gray-700 mb-6 font-korean leading-relaxed">
                교회에 처음 나오시는 분들을 위한 체계적인 신앙교육 과정입니다. 
                기독교의 기본 교리부터 교회 생활의 실제까지 단계별로 배워나갑니다.
              </p>
              <ul className="space-y-2 text-gray-700 mb-6">
                <li className="flex items-center font-korean">
                  <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
                  기독교 기본 교리 학습
                </li>
                <li className="flex items-center font-korean">
                  <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
                  교회 역사와 전통 이해
                </li>
                <li className="flex items-center font-korean">
                  <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
                  신앙생활 실습 및 멘토링
                </li>
              </ul>
              <button className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors font-korean">
                프로그램 신청
              </button>
            </div>

            {/* Discipleship Training */}
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 font-korean">
                제자훈련
              </h3>
              <p className="text-gray-700 mb-6 font-korean leading-relaxed">
                성숙한 그리스도인으로 성장하기 위한 심화 교육과정입니다. 
                말씀 연구, 기도 생활, 사역 훈련을 통해 참된 제자의 삶을 배웁니다.
              </p>
              <ul className="space-y-2 text-gray-700 mb-6">
                <li className="flex items-center font-korean">
                  <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
                  깊이 있는 성경 연구
                </li>
                <li className="flex items-center font-korean">
                  <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
                  영성 생활과 기도 훈련
                </li>
                <li className="flex items-center font-korean">
                  <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
                  사역과 전도 실습
                </li>
              </ul>
              <button className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors font-korean">
                훈련 신청
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-black text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4 font-korean">
              교육 프로그램 문의
            </h2>
            <p className="text-lg mb-8 font-korean opacity-90">
              교육과정에 대한 자세한 정보나 신청 문의사항이 있으시면 언제든 연락해주세요.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8">
              <div className="flex items-center">
                <span className="font-korean opacity-90">전화: (814) 380-9393</span>
              </div>
              <div className="flex items-center">
                <span className="opacity-90">이메일: KyuHongYeon@gmail.com</span>
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

export default EducationTraining