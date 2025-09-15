import type { GetStaticProps, NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Layout from '@/components/Layout'
import { useState } from 'react'
import { Search, Calendar, MapPin, Clock, Users, ChevronDown } from 'lucide-react'

const VolunteerEvents: NextPage = () => {
  const [activeTab, setActiveTab] = useState('전체')
  const [searchFilters, setSearchFilters] = useState({
    category: '교회 부서',
    period: '기간',
    detailed: '주기별 선택'
  })

  const tabs = ['전체', '봉사', '행사']

  const events = [
    {
      id: 1,
      category: '봉사',
      title: '온라인지구 구역장 모집',
      description: '2022년 1월에 시작된 온라인지구는 현재 23개 구역으로 운영중이며, 개속해서 구역원들의 숫자가 늘어나고 있습니다. 그에 비해 구역원들의 신앙을 살피며 함께 구역원들을 이끌어갈 구역지도...',
      date: '주일 08:00 - 22:00',
      location: '제1교육관 2F온라인사역실',
      status: '모집',
      registrationPeriod: '제19차구 - 온라인'
    }
  ]

  const handleFilterChange = (filterType: string, value: string) => {
    setSearchFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
  }

  const filteredEvents = events.filter(event => {
    if (activeTab === '전체') return true
    return event.category === activeTab
  })

  return (
    <Layout>
      {/* Header Section */}
      <section className="bg-white py-16 border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 font-korean">
              봉사/행사
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 font-korean">
              함께하는 섬김으로 하나님의 사랑을 실천합니다
            </p>
          </div>
          
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 justify-center">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 px-4 border-b-2 font-medium text-sm font-korean transition-colors ${
                    activeTab === tab
                      ? 'border-black text-black'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <p className="text-lg text-gray-700 font-korean">
              참여할 봉사/행사를 찾아보세요.
            </p>
          </div>
          
          {/* Search Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="relative">
              <select 
                value={searchFilters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md appearance-none bg-white font-korean focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>교회 부서</option>
                <option>선교부</option>
                <option>봉사부</option>
                <option>교육부</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
            
            <div className="relative">
              <select 
                value={searchFilters.period}
                onChange={(e) => handleFilterChange('period', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md appearance-none bg-white font-korean focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>기간</option>
                <option>이번 주</option>
                <option>이번 달</option>
                <option>다음 달</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
            
            <div className="relative">
              <select 
                value={searchFilters.detailed}
                onChange={(e) => handleFilterChange('detailed', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md appearance-none bg-white font-korean focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>주기별 선택</option>
                <option>매주</option>
                <option>매월</option>
                <option>일회성</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
            
            <button className="bg-black text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-colors flex items-center justify-center font-korean">
              <Search className="w-5 h-5 mr-2" />
              검색
            </button>
          </div>
        </div>
      </section>

      {/* Events List */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {filteredEvents.length > 0 ? (
            <div className="space-y-6">
              {filteredEvents.map((event) => (
                <div key={event.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                  {/* Event Header */}
                  <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-600 font-korean">
                          {event.registrationPeriod}
                        </span>
                      </div>
                      <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-black text-white font-korean">
                        {event.status}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3 font-korean">
                      {event.title}
                    </h3>
                    
                    <p className="text-gray-600 leading-relaxed mb-4 font-korean">
                      {event.description}
                    </p>
                    
                    <button className="text-black hover:text-gray-700 text-sm font-korean border-b border-black hover:border-gray-700 transition-colors">
                      자세히 보기
                    </button>
                  </div>
                  
                  {/* Event Details Footer */}
                  <div className="bg-gray-50 px-6 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="font-korean">{event.date}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="font-korean">{event.location}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Registration Button */}
                  <div className="bg-black px-8 py-6">
                    <button className="w-full text-white font-medium py-3 rounded-md hover:bg-gray-800 transition-colors font-korean">
                      봉사 참여하기
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mb-4">
                <Users className="w-16 h-16 text-gray-300 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2 font-korean">
                해당하는 봉사/행사가 없습니다
              </h3>
              <p className="text-gray-500 font-korean">
                다른 검색 조건을 시도해보세요.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Additional Volunteer Opportunities */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-korean">
              참여할 수 있는 봉사활동
            </h2>
            <p className="text-lg text-gray-600 font-korean">
              다양한 방법으로 교회와 지역사회를 섬길 수 있습니다
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 font-korean">
                예배 섬김
              </h3>
              <p className="text-gray-600 mb-6 font-korean leading-relaxed">
                주일예배와 수요예배에서 안내, 찬양, 방송 등의 봉사에 참여하실 수 있습니다.
              </p>
              <button className="text-black hover:text-gray-700 font-korean text-sm border-b border-black hover:border-gray-700 transition-colors">
                자세히 보기 →
              </button>
            </div>
            
            <div className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mb-6">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 font-korean">
                지역사회 봉사
              </h3>
              <p className="text-gray-600 mb-6 font-korean leading-relaxed">
                지역 주민들을 위한 무료급식, 의료봉사, 교육지원 등의 활동에 참여하실 수 있습니다.
              </p>
              <button className="text-black hover:text-gray-700 font-korean text-sm border-b border-black hover:border-gray-700 transition-colors">
                자세히 보기 →
              </button>
            </div>
            
            <div className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mb-6">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 font-korean">
                선교 사역
              </h3>
              <p className="text-gray-600 mb-6 font-korean leading-relaxed">
                국내외 선교지를 방문하여 복음을 전하고 현지인들을 섬기는 사역에 참여하실 수 있습니다.
              </p>
              <button className="text-black hover:text-gray-700 font-korean text-sm border-b border-black hover:border-gray-700 transition-colors">
                자세히 보기 →
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
              봉사 참여 문의
            </h2>
            <p className="text-lg mb-8 font-korean opacity-90">
              봉사활동 참여에 관한 문의사항이 있으시면 언제든 연락해주세요.
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

export default VolunteerEvents