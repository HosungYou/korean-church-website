import type { GetStaticProps, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Layout from '@/components/Layout'
import { useState, useMemo } from 'react'
import Image from 'next/image'

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
}

const Sermons: NextPage = () => {
  const { t, i18n } = useTranslation(['sermons', 'common'])
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Sample sermon data - replace with actual data
  const sermons: Sermon[] = [
    {
      id: '1',
      title: i18n.language === 'ko' ? '하나님의 사랑' : 'God\'s Love',
      speaker: i18n.language === 'ko' ? '연규홍 목사' : 'Pastor Kyu Hong Yeon',
      date: '2024-07-14',
      scripture: i18n.language === 'ko' ? '요한복음 3:16' : 'John 3:16',
      service: 'sunday_1st',
      thumbnail: '/images/sermon-placeholder.jpg'
    },
    {
      id: '2', 
      title: i18n.language === 'ko' ? '믿음의 능력' : 'The Power of Faith',
      speaker: i18n.language === 'ko' ? '연규홍 목사' : 'Pastor Kyu Hong Yeon',
      date: '2024-07-10',
      scripture: i18n.language === 'ko' ? '히브리서 11:1' : 'Hebrews 11:1',
      service: 'wednesday',
      thumbnail: '/images/sermon-placeholder.jpg'
    },
    {
      id: '3',
      title: i18n.language === 'ko' ? '새벽기도의 축복' : 'Blessings of Dawn Prayer',
      speaker: i18n.language === 'ko' ? '연규홍 목사' : 'Pastor Kyu Hong Yeon',
      date: '2024-07-08',
      scripture: i18n.language === 'ko' ? '시편 5:3' : 'Psalm 5:3',
      service: 'dawn',
      thumbnail: '/images/sermon-placeholder.jpg'
    },
    {
      id: '4',
      title: i18n.language === 'ko' ? '그리스도의 십자가' : 'The Cross of Christ',
      speaker: i18n.language === 'ko' ? '연규홍 목사' : 'Pastor Kyu Hong Yeon',
      date: '2024-07-07',
      scripture: i18n.language === 'ko' ? '갈라디아서 2:20' : 'Galatians 2:20',
      service: 'sunday_2nd',
      thumbnail: '/images/sermon-placeholder.jpg'
    },
    {
      id: '5',
      title: i18n.language === 'ko' ? '성령의 열매' : 'Fruits of the Spirit',
      speaker: i18n.language === 'ko' ? '연규홍 목사' : 'Pastor Kyu Hong Yeon',
      date: '2024-07-03',
      scripture: i18n.language === 'ko' ? '갈라디아서 5:22-23' : 'Galatians 5:22-23',
      service: 'wednesday',
      thumbnail: '/images/sermon-placeholder.jpg'
    },
    {
      id: '6',
      title: i18n.language === 'ko' ? '주님의 재림' : 'The Second Coming',
      speaker: i18n.language === 'ko' ? '연규홍 목사' : 'Pastor Kyu Hong Yeon',
      date: '2024-06-30',
      scripture: i18n.language === 'ko' ? '요한계시록 22:20' : 'Revelation 22:20',
      service: 'sunday_1st',
      thumbnail: '/images/sermon-placeholder.jpg'
    }
  ]

  const filteredSermons = useMemo(() => {
    let filtered = sermons

    // Filter by service type
    if (selectedFilter !== 'all') {
      if (selectedFilter === 'sunday') {
        filtered = filtered.filter(sermon => sermon.service === 'sunday_1st' || sermon.service === 'sunday_2nd')
      } else if (selectedFilter === 'wednesday') {
        filtered = filtered.filter(sermon => sermon.service === 'wednesday')
      } else if (selectedFilter === 'dawn') {
        filtered = filtered.filter(sermon => sermon.service === 'dawn')
      }
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(sermon =>
        sermon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sermon.scripture.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sermon.speaker.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [sermons, selectedFilter, searchTerm])

  const filterOptions = [
    { value: 'all', label: t('sermons:filter.all') },
    { value: 'sunday', label: t('sermons:filter.sunday') },
    { value: 'wednesday', label: t('sermons:filter.wednesday') },
    { value: 'dawn', label: t('sermons:filter.dawn') }
  ]

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
      {/* Header Section */}
      <section className="bg-gradient-to-br from-church-primary to-church-secondary py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className={`text-4xl font-bold text-white text-center ${
            i18n.language === 'ko' ? 'font-korean' : 'font-english'
          }`}>
            {t('sermons:page_title')}
          </h1>
          <p className={`mt-4 text-xl text-gray-100 text-center ${
            i18n.language === 'ko' ? 'font-korean' : 'font-english'
          }`}>
            {t('sermons:subtitle')}
          </p>
        </div>
      </section>

      {/* Filter and Search Section */}
      <section className="py-8 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedFilter(option.value)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedFilter === option.value
                      ? 'bg-church-primary text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
                  } ${i18n.language === 'ko' ? 'font-korean' : 'font-english'}`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {/* Search Box */}
            <div className="relative">
              <input
                type="text"
                placeholder={t('sermons:search_placeholder') as string}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full md:w-80 px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-church-primary focus:border-transparent ${
                  i18n.language === 'ko' ? 'font-korean' : 'font-english'
                }`}
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Sermons Grid */}
      <section className="py-12 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {filteredSermons.length === 0 ? (
            <div className="text-center py-12">
              <p className={`text-gray-500 text-lg ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                {t('sermons:no_results')}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredSermons.map((sermon) => (
                <div key={sermon.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                  {/* Thumbnail */}
                  <div className="relative aspect-video bg-gray-200">
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-church-primary to-church-secondary">
                      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m2-10.5V6a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-1.5m-16.5-4.5h.01m15.99 0h.01M12 16h.01" />
                      </svg>
                    </div>
                    {/* Service Type Badge */}
                    <div className="absolute top-2 left-2">
                      <span className="bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                        {t(`sermons:service_types.${sermon.service}`)}
                      </span>
                    </div>
                    {/* Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black bg-opacity-30">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-church-primary ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
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
                    
                    <p className={`text-sm text-church-primary font-medium mb-4 ${
                      i18n.language === 'ko' ? 'font-korean' : 'font-english'
                    }`}>
                      {sermon.scripture}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex justify-between items-center">
                      <button className={`flex items-center text-church-primary hover:text-church-secondary transition-colors ${
                        i18n.language === 'ko' ? 'font-korean' : 'font-english'
                      }`}>
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                        {t('sermons:watch_sermon')}
                      </button>
                      
                      <div className="flex gap-2">
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                          </svg>
                        </button>
                        
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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

export default Sermons