import type { GetStaticProps, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Layout from '@/components/Layout'
import { useState, useMemo } from 'react'

interface Sermon {
  id: string
  title: string
  speaker: string
  date: string
  scripture: string
  service: 'sunday_1st' | 'sunday_2nd' | 'wednesday' | 'dawn'
  thumbnail: string
  videoUrl?: string
  audioUrl?: string
  youtubeVideoId?: string
  isLive?: boolean
}

const SermonsLive: NextPage = () => {
  const { t, i18n } = useTranslation(['sermons', 'common'])
  const [selectedFilter, setSelectedFilter] = useState('all')

  // Sample sermon data with YouTube integration
  const sermons = useMemo<Sermon[]>(
    () => [
      {
        id: '1',
        title: i18n.language === 'ko' ? '하나님의 사랑' : 'God\'s Love',
        speaker: i18n.language === 'ko' ? '연규홍 목사' : 'Pastor Kyu Hong Yeon',
        date: '2024-07-14',
        scripture: i18n.language === 'ko' ? '요한복음 3:16' : 'John 3:16',
        service: 'sunday_1st',
        thumbnail: '/images/sermon-placeholder.jpg',
        youtubeVideoId: 'dQw4w9WgXcQ'
      },
      {
        id: '2',
        title: i18n.language === 'ko' ? '믿음의 능력' : 'The Power of Faith',
        speaker: i18n.language === 'ko' ? '연규홍 목사' : 'Pastor Kyu Hong Yeon',
        date: '2024-07-10',
        scripture: i18n.language === 'ko' ? '히브리서 11:1' : 'Hebrews 11:1',
        service: 'wednesday',
        thumbnail: '/images/sermon-placeholder.jpg',
        youtubeVideoId: 'dQw4w9WgXcQ'
      },
      {
        id: '3',
        title: i18n.language === 'ko' ? '새벽기도의 축복' : 'Blessings of Dawn Prayer',
        speaker: i18n.language === 'ko' ? '연규홍 목사' : 'Pastor Kyu Hong Yeon',
        date: '2024-07-08',
        scripture: i18n.language === 'ko' ? '시편 5:3' : 'Psalm 5:3',
        service: 'dawn',
        thumbnail: '/images/sermon-placeholder.jpg',
        youtubeVideoId: 'dQw4w9WgXcQ'
      }
    ],
    [i18n.language]
  )

  const filteredSermons = useMemo(() => {
    let filtered = sermons

    if (selectedFilter !== 'all') {
      if (selectedFilter === 'sunday') {
        filtered = filtered.filter(sermon => sermon.service === 'sunday_1st' || sermon.service === 'sunday_2nd')
      } else if (selectedFilter === 'wednesday') {
        filtered = filtered.filter(sermon => sermon.service === 'wednesday')
      } else if (selectedFilter === 'dawn') {
        filtered = filtered.filter(sermon => sermon.service === 'dawn')
      }
    }

    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [sermons, selectedFilter])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    if (i18n.language === 'ko') {
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
  }

  return (
    <Layout>
      {/* Hero Section with Live Stream */}
      <section className="relative bg-gradient-to-br from-gray-900 to-gray-800 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h1 className={`text-3xl md:text-4xl font-bold text-white ${
              i18n.language === 'ko' ? 'font-korean' : 'font-english'
            }`}>
              {i18n.language === 'ko' ? '주일예배' : 'Sunday Service'}
            </h1>
            <p className={`mt-2 text-lg text-gray-300 ${
              i18n.language === 'ko' ? 'font-korean' : 'font-english'
            }`}>
              {i18n.language === 'ko' ? '하나님의 말씀으로 은혜받는 주일예배에 성교방송' : 'Join us for worship and receive God\'s blessing'}
            </p>
          </div>

          {/* Live Video Section */}
          <div className="relative">
            <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
              {/* YouTube Live Embed - Replace YOUR_CHANNEL_ID with actual channel ID */}
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/live_stream?channel=YOUR_CHANNEL_ID&autoplay=1"
                title="Live Stream"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>

              {/* Live Badge */}
              <div className="absolute top-4 left-4 flex items-center space-x-2">
                <span className="flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  LIVE
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Church Info Section */}
      <section className="bg-gray-100 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className={`text-2xl font-bold text-gray-900 mb-4 ${
              i18n.language === 'ko' ? 'font-korean' : 'font-english'
            }`}>
              {i18n.language === 'ko' ? '최근 설교' : 'Recent Sermons'}
            </h2>
            <p className={`text-gray-600 ${
              i18n.language === 'ko' ? 'font-korean' : 'font-english'
            }`}>
              {i18n.language === 'ko' ? '하나님의 말씀으로 은혜받는 주일예배 설교말씀' : 'Sunday worship sermons filled with God\'s word and grace'}
            </p>
          </div>

          {/* Service Times */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <h3 className={`font-bold text-lg mb-2 ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                {i18n.language === 'ko' ? '예배 시간' : 'Service Time'}
              </h3>
              <p className="text-gray-600">
                {i18n.language === 'ko' ? '주일 오전 11:00' : 'Sunday 11:00 AM'}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <h3 className={`font-bold text-lg mb-2 ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                {i18n.language === 'ko' ? '예배 장소' : 'Location'}
              </h3>
              <p className="text-gray-600">
                {i18n.language === 'ko' ? '본당 대예배실' : 'Main Sanctuary'}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <h3 className={`font-bold text-lg mb-2 ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                {i18n.language === 'ko' ? '동시통역' : 'Translation'}
              </h3>
              <p className="text-gray-600">
                {i18n.language === 'ko' ? '음성인라인' : 'Audio Available'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {[
              { value: 'all', label: i18n.language === 'ko' ? '전체' : 'All' },
              { value: 'sunday', label: i18n.language === 'ko' ? '주일예배' : 'Sunday' },
              { value: 'wednesday', label: i18n.language === 'ko' ? '수요예배' : 'Wednesday' },
              { value: 'dawn', label: i18n.language === 'ko' ? '새벽예배' : 'Dawn' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedFilter(option.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedFilter === option.value
                    ? 'bg-church-primary text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } ${i18n.language === 'ko' ? 'font-korean' : 'font-english'}`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Previous Sermons Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSermons.map((sermon) => (
              <div key={sermon.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                {/* YouTube Thumbnail */}
                <div className="relative aspect-video bg-gray-200">
                  {sermon.youtubeVideoId ? (
                    <div className="relative w-full h-full">
                      <img
                        src={`https://img.youtube.com/vi/${sermon.youtubeVideoId}/maxresdefault.jpg`}
                        alt={sermon.title}
                        className="w-full h-full object-cover"
                      />
                      {/* Play Button Overlay */}
                      <a
                        href={`https://www.youtube.com/watch?v=${sermon.youtubeVideoId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-40 transition-opacity"
                      >
                        <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                      </a>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-church-primary to-church-secondary">
                      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}

                  {/* Service Type Badge */}
                  <div className="absolute top-2 left-2">
                    <span className="bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                      {sermon.service === 'sunday_1st' || sermon.service === 'sunday_2nd'
                        ? (i18n.language === 'ko' ? '주일예배' : 'Sunday')
                        : sermon.service === 'wednesday'
                        ? (i18n.language === 'ko' ? '수요예배' : 'Wednesday')
                        : (i18n.language === 'ko' ? '새벽예배' : 'Dawn')
                      }
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className={`text-xl font-bold text-gray-900 mb-2 line-clamp-2 ${
                    i18n.language === 'ko' ? 'font-korean' : 'font-english'
                  }`}>
                    {sermon.title}
                  </h3>

                  <p className={`text-sm text-gray-600 mb-1 ${
                    i18n.language === 'ko' ? 'font-korean' : 'font-english'
                  }`}>
                    {sermon.speaker}
                  </p>

                  <p className={`text-sm text-gray-500 mb-2 ${
                    i18n.language === 'ko' ? 'font-korean' : 'font-english'
                  }`}>
                    {formatDate(sermon.date)}
                  </p>

                  <p className={`text-sm text-church-primary font-medium ${
                    i18n.language === 'ko' ? 'font-korean' : 'font-english'
                  }`}>
                    {sermon.scripture}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'ko', ['common', 'sermons'])),
    },
  }
}

export default SermonsLive