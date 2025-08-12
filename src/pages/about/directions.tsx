import Layout from '@/components/Layout'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { MapPin, Bus, Train, Copy, ExternalLink } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useTranslation } from 'next-i18next'

const DirectionsPage = () => {
  const { t, i18n } = useTranslation(['directions', 'common'])
  const [copied, setCopied] = useState(false)
  const [mapLoaded, setMapLoaded] = useState(false)

  const churchAddress = '758 Glenn Rd, State College, PA 16803'
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(churchAddress)}`

  const copyAddress = () => {
    navigator.clipboard.writeText(churchAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  useEffect(() => {
    const timer = setTimeout(() => setMapLoaded(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <Layout>
      <div className="relative h-64 bg-black">
        <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{backgroundImage: "url('/images/directions-header.jpg')"}}></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-white rounded-full mr-4"></div>
            <h1 className="text-4xl font-bold text-white font-korean">오시는 길</h1>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Map Section */}
          <div>
            <div className="bg-gray-100 rounded-lg overflow-hidden shadow-lg" style={{ height: '500px' }}>
              {!mapLoaded && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-gray-500">Loading map...</div>
                </div>
              )}
              <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyAT78qq2Q5318akOlvFLCV_YsiwStx0wDs&q=${encodeURIComponent(churchAddress)}&language=${i18n.language}`}
                onLoad={() => setMapLoaded(true)}
              ></iframe>
            </div>
          </div>

          {/* Info Section */}
          <div className="space-y-6">
            {/* Address */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
                <h2 className="text-2xl font-bold text-black font-korean">주소</h2>
              </div>
              <p className="text-lg text-gray-700 mb-2 font-korean">758 Glenn Rd</p>
              <p className="text-lg text-gray-700 mb-4 font-korean">State College, PA 16803</p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={copyAddress}
                  className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors font-korean"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  {copied ? '주소 복사됨!' : '주소 복사'}
                </button>
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-md transition-colors font-korean"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  구글 지도로 열기
                </a>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
                <h2 className="text-2xl font-bold text-black font-korean">연락처</h2>
              </div>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="w-1 h-1 bg-black rounded-full mr-3 mt-3"></div>
                  <div>
                    <span className="font-medium text-gray-700 font-korean">전화:</span>
                    <span className="ml-2 text-gray-600">814-380-9393</span>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-1 h-1 bg-black rounded-full mr-3 mt-3"></div>
                  <div>
                    <span className="font-medium text-gray-700 font-korean">이메일:</span>
                    <span className="ml-2 text-gray-600">KyuHongYeon@gmail.com</span>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-1 h-1 bg-black rounded-full mr-3 mt-3"></div>
                  <div>
                    <span className="font-medium text-gray-700 font-korean">사무실 시간:</span>
                    <span className="ml-2 text-gray-600 font-korean">월-금 오전 9시 - 오후 5시</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Parking Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
                <h2 className="text-2xl font-bold text-black font-korean">주차 안내</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-1 h-1 bg-black rounded-full mr-3 mt-3"></div>
                  <div>
                    <h3 className="font-semibold text-gray-800 font-korean">메인 주차장</h3>
                    <p className="text-gray-600 text-sm font-korean">교회 건물 바로 앞 주차장 이용</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-1 h-1 bg-black rounded-full mr-3 mt-3"></div>
                  <div>
                    <h3 className="font-semibold text-gray-800 font-korean">부족 주차장</h3>
                    <p className="text-gray-600 text-sm font-korean">교회 뒤쇼 추가 주차공간 있음</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-1 h-1 bg-black rounded-full mr-3 mt-3"></div>
                  <div>
                    <h3 className="font-semibold text-gray-800 font-korean">장애인 주차</h3>
                    <p className="text-gray-600 text-sm font-korean">메인 입구 근처에 전용 주차공간 마련</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'ko', ['common', 'directions'])),
  },
})

export default DirectionsPage
