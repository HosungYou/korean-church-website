// ===========================================
// VS Design Diverge: History Page
// OKLCH Color System + Editorial Minimalism
// ===========================================

import Layout from '@/components/Layout'
import PageHeader from '@/components/PageHeader'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Image from 'next/image'
import { useState } from 'react'

const HistoryPage = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const timeline = [
    {
      year: '1981',
      events: [
        {
          title: '교회 창립 준비',
          description: '대학부 Greenhill Retreat Center에서 첫 모임을 가지며 교회 설립의 기초를 다졌습니다.',
          images: ['/images/history/1981 대학부 Greenhill Retreat Center.jpg', '/images/history/1981 차영균성도부부와 박진수대학생.jpg']
        }
      ]
    },
    {
      year: '1983',
      events: [
        {
          title: '임시공동의회 개최',
          description: '필라연합교회와의 관계를 논의하고, 교회 운영을 위한 첫 임시공동의회를 개최했습니다.',
          images: []
        },
        {
          title: '첫 임원회 구성',
          description: '제1대 김정우 담임목회자를 초빙하기로 결정했습니다.',
          images: []
        }
      ]
    },
    {
      year: '1984',
      events: [
        {
          title: '제2대 차종률 담임목회자 청빙',
          description: '임시공동의회를 통해 차종률 목사님을 제2대 담임목회자로 청빙했습니다.',
          images: []
        },
        {
          title: '첫 성례식 예배',
          description: '교회 역사상 첫 성례식 예배를 드렸습니다.',
          images: []
        },
        {
          title: '첫 제직회 구성',
          description: '교회 운영을 위한 첫 제직회를 구성하고 온가족이 함께 기념촬영을 했습니다.',
          images: ['/images/history/1984-6년 온가족 기념촬영.jpg']
        }
      ]
    },
    {
      year: '1986',
      events: [
        {
          title: '제3대 이명길 목사 청빙',
          description: '정기공동회의를 통해 이명길 목사님을 제3대 담임목회자로 청빙했습니다.',
          images: []
        },
        {
          title: '교회조직 및 기구 정비',
          description: '교회 조직과 기구를 체계적으로 정비했습니다.',
          images: []
        }
      ]
    },
    {
      year: '1988',
      events: [
        {
          title: '제4대 은상기 목사 청빙',
          description: '임시공동의회를 통해 은상기 목사님을 제4대 담임목회자로 청빙했습니다.',
          images: []
        }
      ]
    },
    {
      year: '1999',
      events: [
        {
          title: '세례식',
          description: '많은 성도들이 세례를 받으며 믿음의 결단을 했습니다.',
          images: ['/images/history/1999년 세례식.jpg']
        }
      ]
    },
    {
      year: '2001',
      events: [
        {
          title: '봄 야유회',
          description: '5월에 전교인이 함께 모여 즐거운 야유회를 가졌습니다.',
          images: ['/images/history/2001년 5월 야유회.jpg']
        }
      ]
    },
    {
      year: '2008',
      events: [
        {
          title: '가을 야유회',
          description: '가을의 아름다운 날씨 속에서 교인들이 함께 교제했습니다.',
          images: ['/images/history/2008년 가을야유회.jpg']
        },
        {
          title: '영어대학부 Harvest 행사',
          description: '영어대학부가 Harvest 행사를 통해 은혜로운 시간을 가졌습니다.',
          images: ['/images/history/2008년 영어대학부 Harvest.jpg']
        }
      ]
    },
    {
      year: '2011',
      events: [
        {
          title: '가을 야유회',
          description: '9월에 전교인이 함께 모여 가을 야유회를 즐겼습니다.',
          images: ['/images/history/2011년 9월 가을야유회.jpg']
        },
        {
          title: '청년부 수련회',
          description: '11월 청년부 수련회를 통해 믿음을 굳건히 했습니다.',
          images: ['/images/history/2011년 11월 청년부 수련회를 마치고.JPG']
        }
      ]
    },
    {
      year: '2012',
      events: [
        {
          title: '단기선교',
          description: '8월에 단기선교팀을 파송하여 복음을 전했습니다.',
          images: [
            '/images/history/2012년 8월 단기선교-1.JPG',
            '/images/history/2012년 8월 단기선교-3.JPG',
            '/images/history/2012년 8월 단기선교-7.JPG'
          ]
        }
      ]
    },
    {
      year: '2013',
      events: [
        {
          title: '여름 야유회',
          description: '8월에 전교인이 함께 모여 여름 야유회를 가졌습니다.',
          images: ['/images/history/2013년 8월 야유회.jpg']
        },
        {
          title: '에벤스버그한인교회와 교류',
          description: '에벤스버그한인교회 교우들과 함께 교제의 시간을 가졌습니다.',
          images: ['/images/history/2013년 8월 에벤스버그한인교회 교우들과 함께.jpg']
        }
      ]
    },
    {
      year: '2015',
      events: [
        {
          title: '단기선교 파송',
          description: '7월에 단기선교팀을 파송하여 하나님의 사랑을 전했습니다.',
          images: ['/images/history/2015년 7월 단기선교 파송식.JPG']
        },
        {
          title: '여름성경학교',
          description: '8월에 어린이들을 위한 여름성경학교를 개최했습니다.',
          images: ['/images/history/2015년 8월 여름성경학교-1.JPG']
        },
        {
          title: '성탄절 예배',
          description: '성탄절에 온 교회가 함께 모여 예수님의 탄생을 축하했습니다.',
          images: [
            '/images/history/2015년 12월 성가대모습.JPG',
            '/images/history/2015년 12월 성탄절 예배 후 청년부-1.JPG',
            '/images/history/2015년 12월 성탄절 유년부 특송.JPG'
          ]
        },
        {
          title: '한국학교 종업식',
          description: '12월에 한국학교 종업식을 진행했습니다.',
          images: ['/images/history/2015년 12월 한국학교 종업식.JPG']
        }
      ]
    },
    {
      year: '2016',
      events: [
        {
          title: '임직예배',
          description: '3월에 새로운 직분자들을 세우는 임직예배를 드렸습니다.',
          images: ['/images/history/2016년 3월 임직예배 후 기념촬영.JPG']
        },
        {
          title: '여름 야유회',
          description: '8월에 전교인이 함께 모여 야유회를 즐겼습니다.',
          images: ['/images/history/2016년 8월 교회 야유회.JPG']
        },
        {
          title: '청년부 수련회',
          description: '11월에 청년부가 수련회를 통해 믿음을 다졌습니다.',
          images: ['/images/history/2016년 11월 청년부 수련회.JPG']
        },
        {
          title: '성탄예배',
          description: '성탄절에 유년부가 특별찬양으로 예배를 섬겼습니다.',
          images: ['/images/history/2016년 12월 성탄예배 후 유년부.JPG']
        }
      ]
    },
    {
      year: '2017',
      events: [
        {
          title: '부활절 예배',
          description: '4월 부활절에 예수님의 부활을 기념하는 예배를 드렸습니다.',
          images: ['/images/history/2017년 4월 부활절예배 2.JPG']
        },
        {
          title: '여름 구제봉사활동',
          description: '7월에 지역사회를 위한 구제봉사활동을 진행했습니다.',
          images: ['/images/history/2017년 7월 여름 구제봉사활동 2.JPG']
        }
      ]
    },
    {
      year: '2018',
      events: [
        {
          title: '가을 교회청소',
          description: '12월에 전교인이 함께 교회를 청소하며 한 해를 마무리했습니다.',
          images: ['/images/history/2018년 12월 가을 교회청소 후.JPG']
        }
      ]
    },
    {
      year: '2019',
      events: [
        {
          title: '단기선교',
          description: '7월에 단기선교팀이 복음을 전하는 사역을 감당했습니다.',
          images: [
            '/images/history/2019년 7월 단기선교-1.JPG',
            '/images/history/2019년 7월 단기선교-2.JPG',
            '/images/history/2019년 7월 단기선교 3.JPG'
          ]
        },
        {
          title: 'PCA 동부노회',
          description: '9월에 PCA 동부노회가 우리 교회에서 개최되었습니다.',
          images: ['/images/history/2019년 9월 PCA 동부노회 본당에서.JPG']
        },
        {
          title: '가을 야유회',
          description: '10월에 가을 야유회를 통해 교인들이 함께 교제했습니다.',
          images: ['/images/history/2019년 10월 가을 야유회.jpg']
        }
      ]
    },
    {
      year: '2020',
      events: [
        {
          title: '창립예배',
          description: '3월 창립예배에 은상기 목사님 부부를 초청하여 특별한 예배를 드렸습니다.',
          images: ['/images/history/2020년 3월 창립예배 은상기목사부부 초청예배.JPG']
        }
      ]
    },
    {
      year: '2022',
      events: [
        {
          title: '새가족환영 전교인야유회',
          description: '9월에 새가족을 환영하는 전교인 야유회를 개최했습니다.',
          images: ['/images/history/2022년 9월 가을 새가족환영 전교인야유회.JPG']
        }
      ]
    },
    {
      year: '2023',
      events: [
        {
          title: '김광일 목사님 송별',
          description: '2월에 김광일 목사님의 송별모임을 가졌습니다.',
          images: ['/images/history/2023년 2월 김광일목사님 송별모임 후.JPG']
        },
        {
          title: '담임목사 이취임예배',
          description: '3월에 새로운 담임목사님의 이취임예배를 드렸습니다.',
          images: [
            '/images/history/2023년 3월 담임목사님 이취임예배 후.jpg',
            '/images/history/2023년 3월 담임목사님 이취임예배 후 노회목사님들과 함께.jpg'
          ]
        },
        {
          title: '청년부 뱅큇모임',
          description: '4월에 청년부가 뱅큇모임을 통해 교제했습니다.',
          images: ['/images/history/2023년 4월 청년부 뱅큇모임 사진.JPG']
        },
        {
          title: '전교인 야유회',
          description: '5월에 전교인이 함께 모여 야유회를 즐겼습니다.',
          images: ['/images/history/2023년 5월 전교인 야유회.JPG']
        },
        {
          title: '청년대학부 뱅큇',
          description: '12월에 청년대학부가 한 해를 마무리하는 뱅큇을 가졌습니다.',
          images: ['/images/history/2023년 12월 청년대학부 뱅큇 후.JPG']
        }
      ]
    },
    {
      year: '2024',
      events: [
        {
          title: '제직세미나',
          description: '1월에 제직들을 위한 세미나를 개최했습니다.',
          images: ['/images/history/2024년 1월 제직세미나 후 .JPG']
        },
        {
          title: '청년대학부 봄학기 야유회',
          description: '3월에 청년대학부가 봄학기 야유회를 가졌습니다.',
          images: ['/images/history/2024년 3월 청년대학부 봄학기 야유회.JPG']
        },
        {
          title: '청년대학부 봄학기 종강',
          description: '4월에 청년대학부 봄학기를 마무리했습니다.',
          images: ['/images/history/2024년 4월 청년대학부 봄학기 종강.JPG']
        },
        {
          title: '가을 야유회',
          description: '9월에 전교인이 함께 모여 가을 야유회를 즐겼습니다.',
          images: ['/images/history/2024년 9월 가을야유회.JPG']
        }
      ]
    }
  ]

  return (
    <Layout>
      <PageHeader
        title="교회 역사"
        subtitle="1981년부터 현재까지, 하나님의 은혜 가운데 걸어온 우리 교회의 발자취"
        label="Our History"
        height="h-96"
      />

      {/* Main Content Section */}
      <section style={{ background: 'oklch(0.97 0.005 75)' }} className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Editorial Section Header */}
          <div className="mb-16">
            <div
              className="h-0.5 w-12 mb-6"
              style={{ background: 'linear-gradient(90deg, oklch(0.72 0.10 75), oklch(0.45 0.12 265))' }}
            />
            <span
              className="text-xs font-medium tracking-[0.2em] uppercase mb-4 block"
              style={{ color: 'oklch(0.72 0.10 75)' }}
            >
              Since 1981
            </span>
            <h2
              className="font-headline font-bold mb-4"
              style={{
                fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                letterSpacing: '-0.02em',
                color: 'oklch(0.25 0.05 265)'
              }}
            >
              40년 넘는 역사와 전통
            </h2>
            <p
              className="max-w-2xl leading-relaxed"
              style={{ color: 'oklch(0.55 0.01 75)' }}
            >
              하나님의 인도하심 가운데 성장해온 우리 교회의 역사를 소개합니다
            </p>
          </div>

          {/* Timeline */}
          <div className="flow-root">
            <ul className="-mb-8">
              {timeline.map((yearData, yearIdx) => (
                <li key={yearData.year}>
                  <div className="relative pb-12">
                    {/* Timeline connector line */}
                    {yearIdx !== timeline.length - 1 ? (
                      <span
                        className="absolute left-8 top-8 -ml-px h-full w-0.5"
                        style={{ background: 'oklch(0.88 0.01 75)' }}
                        aria-hidden="true"
                      />
                    ) : null}

                    <div className="relative">
                      {/* Year Header */}
                      <div className="flex items-center mb-6">
                        <span
                          className="h-16 w-16 rounded-sm flex items-center justify-center"
                          style={{
                            background: 'linear-gradient(135deg, oklch(0.45 0.12 265), oklch(0.35 0.10 265))',
                            boxShadow: '0 0 0 4px oklch(0.97 0.005 75), 0 4px 12px oklch(0.30 0.09 265 / 0.15)'
                          }}
                        >
                          <span
                            className="font-bold text-xl"
                            style={{ color: 'oklch(0.98 0.003 75)' }}
                          >
                            {yearData.year.slice(2)}
                          </span>
                        </span>
                        <div className="ml-6">
                          <h3
                            className="font-headline font-bold"
                            style={{
                              fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
                              letterSpacing: '-0.01em',
                              color: 'oklch(0.25 0.05 265)'
                            }}
                          >
                            {yearData.year}년
                          </h3>
                        </div>
                      </div>

                      {/* Events for this year */}
                      <div className="ml-20 space-y-4">
                        {yearData.events.map((event, eventIdx) => (
                          <div
                            key={eventIdx}
                            className="rounded-sm p-6 transition-all duration-300 hover:translate-y-[-2px]"
                            style={{
                              background: 'oklch(0.985 0.003 75)',
                              border: '1px solid oklch(0.92 0.005 75)',
                              boxShadow: '0 2px 8px oklch(0.30 0.09 265 / 0.06)'
                            }}
                          >
                            <h4
                              className="font-semibold mb-2"
                              style={{
                                fontSize: '1.125rem',
                                color: 'oklch(0.30 0.09 265)'
                              }}
                            >
                              {event.title}
                            </h4>
                            <p
                              className="leading-relaxed mb-4"
                              style={{ color: 'oklch(0.55 0.01 75)' }}
                            >
                              {event.description}
                            </p>

                            {/* Images Grid */}
                            {event.images && event.images.length > 0 && (
                              <div
                                className={`grid gap-3 mt-4 ${
                                  event.images.length === 1
                                    ? 'grid-cols-1'
                                    : event.images.length === 2
                                    ? 'grid-cols-2'
                                    : 'grid-cols-3'
                                }`}
                              >
                                {event.images.map((image, imgIdx) => (
                                  <div
                                    key={imgIdx}
                                    className="relative h-48 rounded-sm overflow-hidden cursor-pointer transition-all duration-300 hover:opacity-90"
                                    style={{
                                      background: 'oklch(0.92 0.005 75)',
                                      boxShadow: '0 2px 6px oklch(0.30 0.09 265 / 0.08)'
                                    }}
                                    onClick={() => setSelectedImage(image)}
                                  >
                                    <Image
                                      src={image}
                                      alt={`${yearData.year}년 ${event.title}`}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'oklch(0.15 0.05 265 / 0.9)' }}
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl max-h-[90vh]">
            <Image
              src={selectedImage}
              alt="확대된 이미지"
              width={1200}
              height={800}
              className="object-contain rounded-sm"
            />
            <button
              className="absolute top-4 right-4 rounded-sm p-2 transition-all duration-200"
              style={{
                background: 'oklch(0.15 0.05 265 / 0.6)',
                color: 'oklch(0.98 0.003 75)'
              }}
              onClick={() => setSelectedImage(null)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'ko', ['common'])),
  },
})

export default HistoryPage
