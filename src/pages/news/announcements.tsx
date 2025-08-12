import Layout from '@/components/Layout'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Image from 'next/image'
import { useState } from 'react'
import { Mail, Bell, Search, Calendar } from 'lucide-react'
import { addEmailSubscriber } from '../../utils/emailService'

const AnnouncementsPage = () => {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('공지사항')

  const announcements = [
    { id: 1, title: '2025년도 장로선거도 설문조사 결과', date: '25.06.05', type: '공지' },
    { id: 2, title: '담임목사님 신간 안내', date: '25.04.18', type: '공지' },
    { id: 3, title: '2025년 장로선거 2차 투표 결과', date: '25.04.13', type: '공지' },
    { id: 4, title: '광복 80주년 감사예배', date: '25.08.08', type: '행사' },
    { id: 5, title: '담임목사님 동정', date: '25.08.08', type: '공지' },
    { id: 6, title: '주요한 목내 사람', date: '25.08.08', type: '공지' },
    { id: 7, title: '제직회 부사, 공동회 모임', date: '25.08.08', type: '공지' },
    { id: 8, title: '제6대선교회 국내선교', date: '25.08.08', type: '선교' },
    { id: 9, title: '교육부 각 부서 여름 성경학교 및 수학함 일정', date: '25.08.08', type: '교육' },
    { id: 10, title: '소망말슠나끌(주초)', date: '25.08.01', type: '공지' },
  ]

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    
    try {
      await addEmailSubscriber(email)
      setIsSubscribed(true)
      setEmail('')
      setTimeout(() => setIsSubscribed(false), 3000)
    } catch (error) {
      console.error('구독 오류:', error)
      alert('구독 중 오류가 발생했습니다. 다시 시도해주세요.')
    }
  }

  const filteredAnnouncements = announcements.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTab = activeTab === '공지사항' || 
                      (activeTab === '전체' && item.type === '공지') ||
                      (activeTab === '전체')
    return matchesSearch && matchesTab
  })

  return (
    <Layout>
      <div className="relative h-64 bg-black">
        <Image
          src="/images/news-header.jpg"
          alt="News"
          fill
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-white rounded-full mr-4"></div>
            <h1 className="text-4xl font-bold text-white font-korean">교회소식</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* 이메일 구독 섹션 */}
        <div className="mb-12 bg-gray-50 rounded-lg p-8">
          <div className="flex items-center mb-6">
            <div className="w-3 h-3 bg-black rounded-full mr-4"></div>
            <h2 className="text-2xl font-bold text-black font-korean">교회 소식 구독</h2>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <Mail className="w-6 h-6 text-gray-600 mr-3" />
              <p className="text-gray-700 font-korean">새로운 공지사항을 이메일로 받아보세요</p>
            </div>
            <form onSubmit={handleSubscribe} className="flex gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일 주소를 입력해주세요"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent font-korean"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-korean flex items-center"
              >
                <Bell className="w-4 h-4 mr-2" />
                구독하기
              </button>
            </form>
            {isSubscribed && (
              <p className="mt-4 text-green-600 font-korean">성공적으로 구독되었습니다!</p>
            )}
          </div>
        </div>

        {/* 검색 및 필터 */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="검색어를 입력해주세요"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent font-korean"
              />
            </div>
            <button className="px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
              <Search className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex border-b border-gray-200">
            {['공지사항', '전체'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-korean font-medium transition-colors ${
                  activeTab === tab
                    ? 'text-black border-b-2 border-black'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* 공지사항 목록 */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="divide-y divide-gray-200">
            {filteredAnnouncements.map((item) => (
              <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center flex-1">
                    <div className="w-1.5 h-1.5 bg-black rounded-full mr-4"></div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-sm bg-gray-100 px-2 py-1 rounded font-korean">{item.type}</span>
                        <h3 className="text-lg font-medium font-korean text-black hover:underline cursor-pointer">
                          {item.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span className="text-sm">{item.date}</span>
                  </div>
                </div>
              </div>
            ))}
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

export default AnnouncementsPage
