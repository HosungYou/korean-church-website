import type { GetStaticProps, NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Layout from '@/components/Layout'
import { Users, Heart, BookOpen, Music, Baby, School, GraduationCap, Home, Globe, Flower2 } from 'lucide-react'
import Link from 'next/link'

const ChurchDepartments: NextPage = () => {
  const departments = [
    {
      category: '예배부',
      icon: <Music className="w-6 h-6" />,
      departments: [
        {
          name: '경조부',
          description: '성도님들의 경조사를 섬기며 위로와 축하를 함께 나눕니다. 장례, 결혼, 출산, 이사 등 중요한 삶의 순간에 교회가족과 함께합니다.',
          leader: '부장: 김철수',
          contact: '부장: 이영희'
        },
        {
          name: '경찰교정선교부',
          description: '지역 경찰과 교정시설을 방문하여 복음을 전하고 예배를 드립니다. 수용자와 가족들을 위한 상담과 지원 사역을 감당합니다.',
          leader: '교역자: 홍길동',
          contact: '부장: 김영수'
        }
      ]
    },
    {
      category: '교육부',
      icon: <BookOpen className="w-6 h-6" />,
      departments: [
        {
          name: '국내선교부',
          description: '국내의 미자립교회와 개척교회를 지원하고, 지역사회 복음화를 위한 전도활동과 의료봉사를 진행합니다.',
          leader: '교역자: 조성실',
          contact: '부장: 이명희, 조장수'
        },
        {
          name: '군선교부',
          description: '군부대를 방문하여 장병들에게 복음을 전하고, 세례식과 성경공부를 진행합니다. 군인가족을 위한 기도와 지원도 함께 합니다.',
          leader: '교역자: 이재용',
          contact: '부장: 차준'
        }
      ]
    },
    {
      category: '문화사역부',
      icon: <Heart className="w-6 h-6" />,
      departments: [
        {
          name: '문화사교부',
          description: '문화를 통한 선교와 전도를 담당합니다. 음악회, 연극, 미술전시 등 다양한 문화행사를 통해 복음을 전합니다.',
          leader: '교역자: 문승주',
          contact: '부장: 박상훈'
        },
        {
          name: '봉방선교부',
          description: '해외선교사를 파송하고 후원하며, 단기선교팀을 조직하여 해외 선교지를 방문합니다. 선교사님들의 사역을 위해 기도와 물질로 섬깁니다.',
          leader: '교역자: 정복환',
          contact: '부장: 박경원'
        }
      ]
    },
    {
      category: '봉사부',
      icon: <Home className="w-6 h-6" />,
      departments: [
        {
          name: '사랑나눔부',
          description: '이웃 사랑의 실천으로 지역사회 어려운 이웃을 돕고, 독거노인과 소외계층을 방문하여 말씀과 사랑을 전합니다.',
          leader: '교역자: 한일환',
          contact: '부장: 최순민'
        },
        {
          name: '사회봉사부',
          description: '지역사회와 함께하는 봉사활동을 기획하고 실행합니다. 무료급식, 의료봉사, 이웃돕기 바자회 등을 통해 그리스도의 사랑을 실천합니다.',
          leader: '교역자: 이성민',
          contact: '부장: 이인홍'
        }
      ]
    },
    {
      category: '새가족부',
      icon: <Flower2 className="w-6 h-6" />,
      departments: [
        {
          name: '새가족부',
          description: '새가족을 환영하고 교회 정착을 돕습니다. 새가족 교육과정을 운영하고 멘토링을 통해 신앙생활을 시작할 수 있도록 섬깁니다.',
          leader: '교역자: 박형진',
          contact: '부장: 이경애'
        },
        {
          name: '새개척교부',
          description: '새롭게 개척되는 교회를 지원하고 협력합니다. 개척교회 목회자와 성도들을 위한 기도와 물질적 후원을 제공합니다.',
          leader: '교역자: 김광규',
          contact: '부장: 정현진'
        }
      ]
    },
    {
      category: '청소년부',
      icon: <School className="w-6 h-6" />,
      departments: [
        {
          name: '소망청학부',
          description: '청소년들의 신앙 성장을 돕고 건전한 문화활동을 제공합니다. 수련회, 캠프, 문화행사를 통해 믿음의 다음세대를 양육합니다.',
          leader: '교역자: 김주영',
          contact: '부장: 이성미'
        },
        {
          name: '예배부',
          description: '예배를 섬기는 모든 봉사자들을 관리하고 지원합니다. 찬양팀, 안내팀, 방송팀 등 예배에 필요한 모든 부서를 조직하고 훈련합니다.',
          leader: '교역자: 홍성민, 권인규',
          contact: '부장: 김형기, 강현미'
        }
      ]
    },
    {
      category: '음악부',
      icon: <Music className="w-6 h-6" />,
      departments: [
        {
          name: '음악부',
          description: '교회 음악사역 전반을 담당합니다. 성가대, 찬양팀, 오케스트라를 운영하며 정기 음악회와 특별찬양을 준비합니다.',
          leader: '교역자: 김수영',
          contact: '부장: -'
        },
        {
          name: '의료선교부',
          description: '의료인들이 모여 의료선교를 실시합니다. 국내외 의료봉사, 시골지역 무료진료, 의료선교사 파송과 후원을 담당합니다.',
          leader: '교역자: -',
          contact: '부장: -'
        }
      ]
    }
  ]

  return (
    <Layout>
      {/* Header Section */}
      <section className="bg-white py-16 border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 font-korean">
              교회부서
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-korean mb-2">
              각자의 달란트를 살려 함께하는 소망교회 가족입니다
            </p>
            <p className="text-lg text-gray-500 font-korean">
              특별한 일을 함께하는 소망교회 가족입니다
            </p>
          </div>
        </div>
      </section>

      {/* Departments Grid */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {departments.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white mr-4">
                    {category.icon}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 font-korean">
                    {category.category}
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {category.departments.map((dept, deptIndex) => (
                    <div key={deptIndex} className="bg-white border border-gray-200 rounded-lg p-8 hover:shadow-lg transition-shadow">
                      <h3 className="text-xl font-bold text-gray-900 mb-4 font-korean">
                        {dept.name}
                      </h3>
                      <p className="text-gray-600 mb-6 font-korean leading-relaxed">
                        {dept.description}
                      </p>
                      <div className="space-y-2 text-sm">
                        {dept.leader && (
                          <div className="flex items-start">
                            <Users className="w-4 h-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                            <span className="text-gray-700 font-korean">{dept.leader}</span>
                          </div>
                        )}
                        {dept.contact && dept.contact !== '-' && (
                          <div className="flex items-start">
                            <Users className="w-4 h-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                            <span className="text-gray-700 font-korean">{dept.contact}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-black text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4 font-korean">
              함께 섬기실 분을 찾습니다
            </h2>
            <p className="text-lg mb-8 font-korean opacity-90">
              각 부서에서 함께 섬기실 봉사자를 모집하고 있습니다.<br />
              하나님의 일에 동참하실 분들의 많은 관심과 참여 부탁드립니다.
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                href="/new-family-guide"
                className="inline-flex items-center px-6 py-3 bg-white text-black font-medium rounded-lg hover:bg-gray-100 transition-colors font-korean"
              >
                새가족 등록
              </Link>
              <Link
                href="/about/directions"
                className="inline-flex items-center px-6 py-3 border border-white text-white font-medium rounded-lg hover:bg-white hover:text-black transition-colors font-korean"
              >
                오시는 길
              </Link>
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

export default ChurchDepartments
