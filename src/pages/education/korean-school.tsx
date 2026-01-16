// ===========================================
// VS Design Diverge: Korean School Page
// OKLCH Color System + Editorial Minimalism
// ===========================================

import type { GetStaticProps, NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Layout from '@/components/Layout'
import PageHeader from '@/components/PageHeader'
import { Book, Users, Clock, Star, Heart, Globe } from 'lucide-react'

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
      icon: Book,
      title: '한글 교육',
      description: '체계적인 한글 읽기, 쓰기 교육을 통해 한국어 실력을 향상시킵니다.'
    },
    {
      icon: Heart,
      title: '한국 문화',
      description: '전통 문화부터 현대 문화까지 다양한 한국 문화를 체험하고 배웁니다.'
    },
    {
      icon: Globe,
      title: '정체성 교육',
      description: '한국계 미국인으로서의 정체성을 확립하고 자긍심을 기릅니다.'
    },
    {
      icon: Users,
      title: '공동체 활동',
      description: '또래 친구들과의 교류를 통해 한국어 사용 기회를 늘리고 우정을 쌓습니다.'
    }
  ]

  const events = [
    { title: '한국 문화 축제', description: '한복 체험, 전통 놀이, 한국 음식 만들기 등 다양한 문화 체험 활동', date: '매년 10월' },
    { title: '한글날 기념행사', description: '한글의 우수성을 배우고 한글 쓰기 대회, 암송 대회 등을 개최', date: '매년 10월 9일' },
    { title: '졸업식 및 발표회', description: '한 해 동안 배운 것을 발표하고 졸업생을 축하하는 의미있는 시간', date: '매년 5월' },
    { title: '여름 캠프', description: '1박 2일 캠프를 통해 한국어 몰입 환경에서 재미있게 학습', date: '매년 7월' },
    { title: '학부모 교육', description: '가정에서 한국어 교육을 지속할 수 있도록 학부모 대상 교육 제공', date: '분기별' },
    { title: '교사 연수', description: '전문적인 한국어 교육을 위한 교사들의 지속적인 역량 강화', date: '분기별' }
  ]

  const educationGoals = [
    '한국어 읽기, 쓰기, 말하기 능력 향상',
    '한국 문화와 역사에 대한 이해 증진',
    '한국계 미국인으로서의 정체성 확립',
    '공동체 의식과 리더십 개발'
  ]

  return (
    <Layout>
      <PageHeader
        title="한글학교"
        subtitle="차세대가 한국어와 한국 문화를 배우며 정체성을 확립할 수 있도록 돕는 교육기관입니다"
        label="교육부서"
      />

      {/* Quick Stats */}
      <section style={{ background: 'oklch(0.985 0.003 75)', borderBottom: '1px solid oklch(0.92 0.005 75)' }}>
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-8 text-sm">
            <div className="flex items-center" style={{ color: 'oklch(0.45 0.03 265)' }}>
              <Clock className="w-5 h-5 mr-2" style={{ color: 'oklch(0.72 0.10 75)' }} />
              <span>매주 일요일</span>
            </div>
            <div className="flex items-center" style={{ color: 'oklch(0.45 0.03 265)' }}>
              <Users className="w-5 h-5 mr-2" style={{ color: 'oklch(0.72 0.10 75)' }} />
              <span>4개 반 운영</span>
            </div>
            <div className="flex items-center" style={{ color: 'oklch(0.45 0.03 265)' }}>
              <Star className="w-5 h-5 mr-2" style={{ color: 'oklch(0.72 0.10 75)' }} />
              <span>15년 전통</span>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section style={{ background: 'oklch(0.97 0.005 75)' }}>
        <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column */}
            <div>
              <div className="mb-12">
                <div className="h-0.5 w-12 mb-6" style={{ background: 'linear-gradient(90deg, oklch(0.72 0.10 75), oklch(0.45 0.12 265))' }} />
                <h2 className="font-headline font-bold mb-6" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', letterSpacing: '-0.02em', color: 'oklch(0.25 0.05 265)' }}>
                  한글학교 소개
                </h2>
                <p className="leading-relaxed mb-4" style={{ color: 'oklch(0.55 0.01 75)' }}>
                  스테이트 칼리지 한인교회 한글학교는 2009년에 설립되어 지금까지 한국계 미국인 자녀들과
                  한국어를 배우고 싶은 지역 주민들에게 체계적인 한국어 교육을 제공하고 있습니다.
                </p>
                <p className="leading-relaxed" style={{ color: 'oklch(0.55 0.01 75)' }}>
                  단순한 언어 교육을 넘어 한국의 역사, 문화, 전통을 함께 배우며 한국계 미국인으로서의
                  정체성을 확립하고 자긍심을 기를 수 있도록 돕고 있습니다.
                </p>
              </div>

              {/* Registration Info */}
              <div
                className="rounded-sm p-6"
                style={{
                  background: 'oklch(0.985 0.003 75)',
                  border: '1px solid oklch(0.92 0.005 75)',
                  boxShadow: '0 2px 8px oklch(0.30 0.09 265 / 0.06)'
                }}
              >
                <h3 className="font-semibold mb-4" style={{ color: 'oklch(0.25 0.05 265)' }}>
                  2024년 가을학기 등록 안내
                </h3>
                <ul className="space-y-2">
                  {[
                    '등록 기간: 8월 1일 - 8월 31일',
                    '개강일: 9월 8일 (일요일)',
                    '수업료: 학기당 $120 (교재비 별도)',
                    '장학금: 다자녀 할인 및 저소득층 지원 가능'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      <div className="w-1.5 h-1.5 rounded-full mt-2 mr-3" style={{ background: 'oklch(0.72 0.10 75)' }} />
                      <span style={{ color: 'oklch(0.45 0.03 265)' }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Column - Education Goals */}
            <div
              className="rounded-sm p-8"
              style={{
                background: 'oklch(0.25 0.08 265)',
                boxShadow: '0 4px 16px oklch(0.30 0.09 265 / 0.15)'
              }}
            >
              <h3 className="font-headline font-bold mb-6" style={{ fontSize: '1.5rem', color: 'oklch(0.98 0.003 75)' }}>
                교육 목표
              </h3>
              <ul className="space-y-4">
                {educationGoals.map((goal, idx) => (
                  <li key={idx} className="flex items-start">
                    <Star className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" style={{ color: 'oklch(0.72 0.10 75)' }} />
                    <span style={{ color: 'oklch(0.90 0.01 75)' }}>{goal}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Classes Section */}
      <section style={{ background: 'oklch(0.985 0.003 75)' }}>
        <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <div className="h-0.5 w-12 mb-6" style={{ background: 'linear-gradient(90deg, oklch(0.72 0.10 75), oklch(0.45 0.12 265))' }} />
            <h2 className="font-headline font-bold mb-4" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', letterSpacing: '-0.02em', color: 'oklch(0.25 0.05 265)' }}>
              반별 안내
            </h2>
            <p style={{ color: 'oklch(0.55 0.01 75)' }}>연령과 수준에 맞는 체계적인 교육과정을 제공합니다</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {classes.map((classInfo, index) => (
              <div
                key={index}
                className="rounded-sm p-6 transition-all duration-300 hover:translate-y-[-2px]"
                style={{
                  background: 'oklch(0.97 0.005 75)',
                  border: '1px solid oklch(0.92 0.005 75)',
                  boxShadow: '0 2px 8px oklch(0.30 0.09 265 / 0.06)'
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold" style={{ fontSize: '1.125rem', color: 'oklch(0.25 0.05 265)' }}>
                    {classInfo.name}
                  </h3>
                  <span
                    className="px-3 py-1 rounded-sm text-sm font-medium"
                    style={{ background: 'oklch(0.45 0.12 265)', color: 'oklch(0.98 0.003 75)' }}
                  >
                    {classInfo.age}
                  </span>
                </div>
                <p className="leading-relaxed mb-4" style={{ color: 'oklch(0.55 0.01 75)' }}>
                  {classInfo.description}
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center" style={{ color: 'oklch(0.45 0.03 265)' }}>
                    <Clock className="w-4 h-4 mr-2" style={{ color: 'oklch(0.72 0.10 75)' }} />
                    <span>{classInfo.schedule}</span>
                  </div>
                  <div className="flex items-center" style={{ color: 'oklch(0.45 0.03 265)' }}>
                    <Users className="w-4 h-4 mr-2" style={{ color: 'oklch(0.72 0.10 75)' }} />
                    <span>담임: {classInfo.teacher}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Activities Section */}
      <section style={{ background: 'oklch(0.97 0.005 75)' }}>
        <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <div className="h-0.5 w-12 mb-6" style={{ background: 'linear-gradient(90deg, oklch(0.72 0.10 75), oklch(0.45 0.12 265))' }} />
            <h2 className="font-headline font-bold mb-4" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', letterSpacing: '-0.02em', color: 'oklch(0.25 0.05 265)' }}>
              교육 활동
            </h2>
            <p style={{ color: 'oklch(0.55 0.01 75)' }}>다양한 활동을 통해 재미있게 한국어를 배웁니다</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {activities.map((activity, index) => {
              const IconComponent = activity.icon
              return (
                <div key={index} className="text-center">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ background: 'oklch(0.45 0.12 265)' }}
                  >
                    <IconComponent className="w-6 h-6" style={{ color: 'oklch(0.98 0.003 75)' }} />
                  </div>
                  <h3 className="font-semibold mb-3" style={{ color: 'oklch(0.25 0.05 265)' }}>
                    {activity.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'oklch(0.55 0.01 75)' }}>
                    {activity.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section style={{ background: 'oklch(0.985 0.003 75)' }}>
        <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <div className="h-0.5 w-12 mb-6" style={{ background: 'linear-gradient(90deg, oklch(0.72 0.10 75), oklch(0.45 0.12 265))' }} />
            <h2 className="font-headline font-bold" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', letterSpacing: '-0.02em', color: 'oklch(0.25 0.05 265)' }}>
              특별 활동 및 행사
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event, index) => (
              <div
                key={index}
                className="rounded-sm p-6"
                style={{
                  background: 'oklch(0.97 0.005 75)',
                  border: '1px solid oklch(0.92 0.005 75)',
                  boxShadow: '0 2px 8px oklch(0.30 0.09 265 / 0.06)'
                }}
              >
                <h3 className="font-semibold mb-3" style={{ color: 'oklch(0.25 0.05 265)' }}>
                  {event.title}
                </h3>
                <p className="text-sm leading-relaxed mb-3" style={{ color: 'oklch(0.55 0.01 75)' }}>
                  {event.description}
                </p>
                <span className="text-xs font-medium" style={{ color: 'oklch(0.72 0.10 75)' }}>{event.date}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration CTA */}
      <section style={{ background: 'oklch(0.20 0.07 265)' }}>
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-headline font-bold mb-4" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: 'oklch(0.98 0.003 75)' }}>
              한글학교 등록
            </h2>
            <p className="mb-8" style={{ color: 'oklch(0.80 0.02 75)' }}>
              우리 아이들의 미래를 위한 투자, 지금 시작하세요
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold mb-2" style={{ color: 'oklch(0.72 0.10 75)' }}>$120</div>
                <div className="text-sm" style={{ color: 'oklch(0.70 0.02 75)' }}>학기당 수업료</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold mb-2" style={{ color: 'oklch(0.72 0.10 75)' }}>90분</div>
                <div className="text-sm" style={{ color: 'oklch(0.70 0.02 75)' }}>주당 수업시간</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold mb-2" style={{ color: 'oklch(0.72 0.10 75)' }}>15주</div>
                <div className="text-sm" style={{ color: 'oklch(0.70 0.02 75)' }}>학기 기간</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                className="px-8 py-3 rounded-sm font-medium transition-all duration-300 hover:translate-y-[-2px]"
                style={{
                  background: 'oklch(0.98 0.003 75)',
                  color: 'oklch(0.25 0.08 265)',
                  boxShadow: '0 2px 8px oklch(0.30 0.09 265 / 0.2)'
                }}
              >
                온라인 등록
              </button>
              <button
                className="px-8 py-3 rounded-sm font-medium transition-all duration-300"
                style={{
                  border: '1px solid oklch(0.72 0.10 75)',
                  color: 'oklch(0.72 0.10 75)',
                  background: 'transparent'
                }}
              >
                자세히 보기
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section style={{ background: 'oklch(0.97 0.005 75)' }}>
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-6">
            <div className="h-0.5 w-12 mb-6 mx-auto" style={{ background: 'linear-gradient(90deg, oklch(0.72 0.10 75), oklch(0.45 0.12 265))' }} />
            <h2 className="font-headline font-bold mb-4" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', letterSpacing: '-0.02em', color: 'oklch(0.25 0.05 265)' }}>
              문의 및 상담
            </h2>
            <p style={{ color: 'oklch(0.55 0.01 75)' }}>
              한글학교에 관한 문의사항이 있으시면 언제든 연락해주세요
            </p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8 mb-4">
            <span style={{ color: 'oklch(0.45 0.03 265)' }}>전화: (814) 380-9393</span>
            <span style={{ color: 'oklch(0.45 0.03 265)' }}>이메일: koreanschool@sckc.org</span>
          </div>
          <p className="text-sm" style={{ color: 'oklch(0.55 0.01 75)' }}>
            한글학교 담당: 김미영 교장 선생님
          </p>
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
