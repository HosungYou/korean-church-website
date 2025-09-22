import type { GetStaticProps, NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Layout from '@/components/Layout'
import { Book, Users, Clock, Calendar, Star, Award, Heart, Globe } from 'lucide-react'

const KoreanSchool: NextPage = () => {
  const classes = [
    {
      name: '유치부',
      age: '4-6세',
      description: '한글의 기초인 자음과 모음을 배우고, 기본적인 한국어 회화를 익힙니다.',
      schedule: '매주 일요일 1:00 PM - 2:30 PM',
      teacher: '김선생님'
    },
    {
      name: '초급반',
      age: '7-9세',
      description: '한글 읽기와 쓰기를 배우고, 간단한 문장 구성과 일상 회화를 연습합니다.',
      schedule: '매주 일요일 1:00 PM - 2:30 PM',
      teacher: '이선생님'
    },
    {
      name: '중급반',
      age: '10-12세',
      description: '한국어 문법과 어휘를 확장하고, 한국 문화와 역사에 대해 배웁니다.',
      schedule: '매주 일요일 1:00 PM - 2:30 PM',
      teacher: '박선생님'
    },
    {
      name: '고급반',
      age: '13-15세',
      description: '한국어 독해와 작문 실력을 향상시키고, 한국 문학과 현대 문화를 탐구합니다.',
      schedule: '매주 일요일 1:00 PM - 2:30 PM',
      teacher: '정선생님'
    }
  ]

  const activities = [
    {
      icon: <Book className="w-6 h-6" />,
      title: '한글 교육',
      description: '체계적인 한글 읽기, 쓰기 교육을 통해 한국어 실력을 향상시킵니다.'
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: '한국 문화',
      description: '전통 문화부터 현대 문화까지 다양한 한국 문화를 체험하고 배웁니다.'
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: '정체성 교육',
      description: '한국계 미국인으로서의 정체성을 확립하고 자긍심을 기릅니다.'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: '공동체 활동',
      description: '또래 친구들과의 교류를 통해 한국어 사용 기회를 늘리고 우정을 쌓습니다.'
    }
  ]

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-white py-16 border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 font-korean">
              스테이트 칼리지 한인교회 한글학교
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 font-korean">
              차세대가 한국어와 한국 문화를 배우며 정체성을 확립할 수 있도록 돕는 교육기관입니다
            </p>
            <div className="flex justify-center space-x-8 text-sm text-gray-600">
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                <span className="font-korean">매주 일요일</span>
              </div>
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                <span className="font-korean">4개 반 운영</span>
              </div>
              <div className="flex items-center">
                <Award className="w-5 h-5 mr-2" />
                <span className="font-korean">15년 전통</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6 font-korean">
                한글학교 소개
              </h2>
              <p className="text-gray-700 mb-6 leading-relaxed font-korean">
                스테이트 칼리지 한인교회 한글학교는 2009년에 설립되어 지금까지 한국계 미국인 자녀들과 
                한국어를 배우고 싶은 지역 주민들에게 체계적인 한국어 교육을 제공하고 있습니다.
              </p>
              <p className="text-gray-700 mb-6 leading-relaxed font-korean">
                단순한 언어 교육을 넘어 한국의 역사, 문화, 전통을 함께 배우며 한국계 미국인으로서의 
                정체성을 확립하고 자긍심을 기를 수 있도록 돕고 있습니다.
              </p>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-3 font-korean">
                  2024년 가을학기 등록 안내
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="font-korean">• 등록 기간: 8월 1일 - 8월 31일</li>
                  <li className="font-korean">• 개강일: 9월 8일 (일요일)</li>
                  <li className="font-korean">• 수업료: 학기당 $120 (교재비 별도)</li>
                  <li className="font-korean">• 장학금: 다자녀 할인 및 저소득층 지원 가능</li>
                </ul>
              </div>
            </div>
            <div className="bg-black rounded-lg p-8 text-white">
              <h3 className="text-2xl font-bold mb-6 font-korean">교육 목표</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Star className="w-5 h-5 mr-3 mt-1 text-yellow-400 flex-shrink-0" />
                  <span className="font-korean">한국어 읽기, 쓰기, 말하기 능력 향상</span>
                </li>
                <li className="flex items-start">
                  <Star className="w-5 h-5 mr-3 mt-1 text-yellow-400 flex-shrink-0" />
                  <span className="font-korean">한국 문화와 역사에 대한 이해 증진</span>
                </li>
                <li className="flex items-start">
                  <Star className="w-5 h-5 mr-3 mt-1 text-yellow-400 flex-shrink-0" />
                  <span className="font-korean">한국계 미국인으로서의 정체성 확립</span>
                </li>
                <li className="flex items-start">
                  <Star className="w-5 h-5 mr-3 mt-1 text-yellow-400 flex-shrink-0" />
                  <span className="font-korean">공동체 의식과 리더십 개발</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Classes Section */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-korean">
              반별 안내
            </h2>
            <p className="text-lg text-gray-600 font-korean">
              연령과 수준에 맞는 체계적인 교육과정을 제공합니다
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {classes.map((classInfo, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900 font-korean">
                    {classInfo.name}
                  </h3>
                  <span className="bg-black text-white px-3 py-1 rounded-full text-sm font-korean">
                    {classInfo.age}
                  </span>
                </div>
                <p className="text-gray-700 mb-4 leading-relaxed font-korean">
                  {classInfo.description}
                </p>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="font-korean">{classInfo.schedule}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    <span className="font-korean">담임: {classInfo.teacher}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Activities Section */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-korean">
              교육 활동
            </h2>
            <p className="text-lg text-gray-600 font-korean">
              다양한 활동을 통해 재미있게 한국어를 배웁니다
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {activities.map((activity, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center text-white mx-auto mb-4">
                  {activity.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 font-korean">
                  {activity.title}
                </h3>
                <p className="text-gray-600 font-korean">
                  {activity.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-korean">
              특별 활동 및 행사
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-3 font-korean">
                한국 문화 축제
              </h3>
              <p className="text-gray-700 mb-3 font-korean">
                한복 체험, 전통 놀이, 한국 음식 만들기 등 다양한 문화 체험 활동
              </p>
              <span className="text-sm text-gray-500 font-korean">매년 10월</span>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-3 font-korean">
                한글날 기념행사
              </h3>
              <p className="text-gray-700 mb-3 font-korean">
                한글의 우수성을 배우고 한글 쓰기 대회, 암송 대회 등을 개최
              </p>
              <span className="text-sm text-gray-500 font-korean">매년 10월 9일</span>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-3 font-korean">
                졸업식 및 발표회
              </h3>
              <p className="text-gray-700 mb-3 font-korean">
                한 해 동안 배운 것을 발표하고 졸업생을 축하하는 의미있는 시간
              </p>
              <span className="text-sm text-gray-500 font-korean">매년 5월</span>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-3 font-korean">
                여름 캠프
              </h3>
              <p className="text-gray-700 mb-3 font-korean">
                1박 2일 캠프를 통해 한국어 몰입 환경에서 재미있게 학습
              </p>
              <span className="text-sm text-gray-500 font-korean">매년 7월</span>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-3 font-korean">
                학부모 교육
              </h3>
              <p className="text-gray-700 mb-3 font-korean">
                가정에서 한국어 교육을 지속할 수 있도록 학부모 대상 교육 제공
              </p>
              <span className="text-sm text-gray-500 font-korean">분기별</span>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-3 font-korean">
                교사 연수
              </h3>
              <p className="text-gray-700 mb-3 font-korean">
                전문적인 한국어 교육을 위한 교사들의 지속적인 역량 강화
              </p>
              <span className="text-sm text-gray-500 font-korean">분기별</span>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Section */}
      <section className="py-16 bg-black text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4 font-korean">
              한글학교 등록
            </h2>
            <p className="text-lg mb-8 font-korean">
              우리 아이들의 미래를 위한 투자, 지금 시작하세요
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold mb-2">$120</div>
                <div className="text-sm opacity-80 font-korean">학기당 수업료</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold mb-2">90분</div>
                <div className="text-sm opacity-80 font-korean">주당 수업시간</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold mb-2">15주</div>
                <div className="text-sm opacity-80 font-korean">학기 기간</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="bg-white text-black px-8 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors font-korean">
                온라인 등록
              </button>
              <button className="border border-white text-white px-8 py-3 rounded-md font-medium hover:bg-white hover:text-black transition-colors font-korean">
                자세히 보기
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-korean">
              문의 및 상담
            </h2>
            <p className="text-lg text-gray-600 mb-8 font-korean">
              한글학교에 관한 문의사항이 있으시면 언제든 연락해주세요
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8">
              <div className="flex items-center">
                <span className="font-korean text-gray-700">전화: (814) 380-9393</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-700">이메일: koreanschool@sckc.org</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-4 font-korean">
              한글학교 담당: 김미영 교장 선생님
            </p>
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

export default KoreanSchool
