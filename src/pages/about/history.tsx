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
        height="h-96"
      />

      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 font-korean mb-4">
              40년 넘는 역사와 전통
            </h2>
            <p className="text-lg text-gray-600 font-korean">
              하나님의 인도하심 가운데 성장해온 우리 교회의 역사를 소개합니다
            </p>
          </div>

          <div className="flow-root">
            <ul className="-mb-8">
              {timeline.map((yearData, yearIdx) => (
                <li key={yearData.year}>
                  <div className="relative pb-12">
                    {yearIdx !== timeline.length - 1 ? (
                      <span className="absolute left-8 top-8 -ml-px h-full w-0.5 bg-gray-300" aria-hidden="true" />
                    ) : null}

                    <div className="relative">
                      {/* Year Header */}
                      <div className="flex items-center mb-6">
                        <span className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center ring-8 ring-white shadow-lg">
                          <span className="text-white font-bold text-xl">{yearData.year.slice(2)}</span>
                        </span>
                        <h3 className="ml-6 text-3xl font-bold text-gray-900 font-korean">
                          {yearData.year}년
                        </h3>
                      </div>

                      {/* Events for this year */}
                      <div className="ml-20 space-y-6">
                        {yearData.events.map((event, eventIdx) => (
                          <div key={eventIdx} className="bg-white rounded-lg shadow-md p-6">
                            <h4 className="text-xl font-semibold text-gray-900 font-korean mb-2">
                              {event.title}
                            </h4>
                            <p className="text-gray-600 font-korean mb-4">
                              {event.description}
                            </p>

                            {/* Images Grid */}
                            {event.images && event.images.length > 0 && (
                              <div className={`grid gap-4 mt-4 ${event.images.length === 1 ? 'grid-cols-1' : event.images.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                                {event.images.map((image, imgIdx) => (
                                  <div
                                    key={imgIdx}
                                    className="relative h-48 bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
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
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl max-h-[90vh]">
            <Image
              src={selectedImage}
              alt="확대된 이미지"
              width={1200}
              height={800}
              className="object-contain"
            />
            <button
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
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
