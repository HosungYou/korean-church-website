import type { GetStaticProps, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Layout from '@/components/Layout'
import Link from 'next/link'
import { ArrowRight, BookOpen, Calendar, Clock, User, Play, Mic } from 'lucide-react'

const SermonsPage: NextPage = () => {
  useTranslation(['common'])

  const currentSeries = {
    title: '요한복음 강해',
    description: '생명의 말씀, 예수 그리스도를 통한 구원의 복음',
    startDate: '2024년 9월',
    speaker: '연규홍 목사',
    totalSermons: 12,
    currentSermon: 5
  }

  const sermonSchedule = [
    {
      day: '주일예배',
      time: '오전 11:00',
      description: '전 교인이 함께 드리는 주일 대예배',
      icon: Calendar
    },
    {
      day: '수요예배',
      time: '저녁 7:30',
      description: '말씀 중심의 수요 저녁 예배',
      icon: Clock
    }
  ]

  const preachers = [
    {
      name: '연규홍 목사',
      role: '담임목사',
      description: '주일예배, 수요예배 설교'
    }
  ]

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-3 h-3 bg-black rounded-full mr-4"></div>
              <h1 className="text-4xl md:text-5xl font-bold text-black font-korean">설교</h1>
              <div className="w-3 h-3 bg-black rounded-full ml-4"></div>
            </div>
            <p className="text-xl text-gray-600 font-korean max-w-2xl mx-auto">
              하나님의 말씀으로 은혜받고, 삶의 변화를 경험하는 설교 사역
            </p>
          </div>
        </div>
      </section>

      {/* Current Sermon Series */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-8">
            <div className="w-3 h-3 bg-black rounded-full mr-4"></div>
            <h2 className="text-3xl font-bold text-black font-korean">현재 설교 시리즈</h2>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="flex items-center mb-4">
                  <BookOpen className="w-6 h-6 text-black mr-3" />
                  <span className="text-sm text-gray-500 font-korean">진행중인 시리즈</span>
                </div>
                <h3 className="text-2xl font-bold text-black font-korean mb-4">{currentSeries.title}</h3>
                <p className="text-gray-600 font-korean mb-6">{currentSeries.description}</p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
                    <div>
                      <p className="text-sm text-gray-500 font-korean">시작</p>
                      <p className="font-semibold text-black font-korean">{currentSeries.startDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
                    <div>
                      <p className="text-sm text-gray-500 font-korean">설교자</p>
                      <p className="font-semibold text-black font-korean">{currentSeries.speaker}</p>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-500 font-korean mb-2">
                    <span>진행률</span>
                    <span>{currentSeries.currentSermon}/{currentSeries.totalSermons}회</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-black h-2 rounded-full"
                      style={{ width: `${(currentSeries.currentSermon / currentSeries.totalSermons) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-center">
                <Link
                  href="/sermons/sunday"
                  className="group flex items-center justify-between bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors mb-3"
                >
                  <div className="flex items-center">
                    <Play className="w-5 h-5 text-black mr-3" />
                    <span className="font-korean text-black">주일설교 영상 보기</span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/sermons/wednesday"
                  className="group flex items-center justify-between bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center">
                    <Play className="w-5 h-5 text-black mr-3" />
                    <span className="font-korean text-black">수요설교 영상 보기</span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sermon Schedule */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-8">
            <div className="w-3 h-3 bg-black rounded-full mr-4"></div>
            <h2 className="text-3xl font-bold text-black font-korean">예배 시간</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sermonSchedule.map((schedule) => {
              const Icon = schedule.icon
              return (
                <div key={schedule.day} className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-black font-korean mb-1">{schedule.day}</h3>
                      <p className="text-2xl font-semibold text-black font-english mb-2">{schedule.time}</p>
                      <p className="text-gray-600 font-korean">{schedule.description}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Preachers */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-8">
            <div className="w-3 h-3 bg-black rounded-full mr-4"></div>
            <h2 className="text-3xl font-bold text-black font-korean">설교자</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {preachers.map((preacher) => (
              <div key={preacher.name} className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                    <User className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-black font-korean">{preacher.name}</h3>
                    <p className="text-sm text-gray-500 font-korean">{preacher.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 font-korean">{preacher.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sermon Philosophy */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-8">
            <div className="w-3 h-3 bg-black rounded-full mr-4"></div>
            <h2 className="text-3xl font-bold text-black font-korean">설교 철학</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
                <h3 className="text-lg font-bold text-black font-korean">말씀 중심</h3>
              </div>
              <p className="text-gray-600 font-korean">
                성경의 본문을 정확하게 해석하고, 원래의 의미를 전달하는 강해 설교를 지향합니다.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
                <h3 className="text-lg font-bold text-black font-korean">삶의 적용</h3>
              </div>
              <p className="text-gray-600 font-korean">
                말씀이 일상의 삶 속에서 실제적으로 적용될 수 있도록 구체적인 방향을 제시합니다.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
                <h3 className="text-lg font-bold text-black font-korean">복음 선포</h3>
              </div>
              <p className="text-gray-600 font-korean">
                예수 그리스도의 복음을 중심으로, 구원의 은혜와 소망을 전합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-black py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
            <Mic className="w-8 h-8 text-white" />
            <div className="w-2 h-2 bg-white rounded-full ml-3"></div>
          </div>
          <h2 className="text-3xl font-bold text-white font-korean mb-4">설교 영상 보기</h2>
          <p className="text-gray-300 font-korean mb-8 max-w-xl mx-auto">
            지난 예배의 설교를 다시 보시거나, 놓친 예배를 시청하실 수 있습니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sermons/sunday"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-black rounded-lg font-korean hover:bg-gray-100 transition-colors"
            >
              <Play className="w-5 h-5 mr-2" />
              주일설교 영상
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              href="/sermons/wednesday"
              className="inline-flex items-center justify-center px-6 py-3 bg-transparent text-white border border-white rounded-lg font-korean hover:bg-white/10 transition-colors"
            >
              <Play className="w-5 h-5 mr-2" />
              수요설교 영상
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
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

export default SermonsPage
