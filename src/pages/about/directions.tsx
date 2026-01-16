// ===========================================
// VS Design Diverge: Directions Page
// OKLCH Color System + Editorial Minimalism
// ===========================================

import Layout from '@/components/Layout'
import PageHeader from '@/components/PageHeader'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { MapPin, Phone, Mail, Clock, Car, Copy, ExternalLink } from 'lucide-react'
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
      <PageHeader
        title="오시는 길"
        subtitle="State College 한인교회를 방문해 주세요"
        label="DIRECTIONS"
      />

      {/* Main Content Section */}
      <section
        className="py-20"
        style={{ background: 'oklch(0.985 0.003 75)' }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Map Section */}
            <div className="order-2 lg:order-1">
              <div
                className="rounded-sm overflow-hidden"
                style={{
                  height: '500px',
                  background: 'oklch(0.97 0.005 75)',
                  border: '1px solid oklch(0.92 0.005 75)',
                  boxShadow: '0 4px 16px oklch(0.30 0.09 265 / 0.08)'
                }}
              >
                {!mapLoaded && (
                  <div
                    className="flex items-center justify-center h-full"
                    style={{ color: 'oklch(0.55 0.01 75)' }}
                  >
                    <div className="text-center">
                      <div
                        className="w-8 h-8 border-2 rounded-full animate-spin mx-auto mb-4"
                        style={{
                          borderColor: 'oklch(0.92 0.005 75)',
                          borderTopColor: 'oklch(0.45 0.12 265)'
                        }}
                      />
                      <p>지도를 불러오는 중...</p>
                    </div>
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
            <div className="order-1 lg:order-2 space-y-8">
              {/* Section Header */}
              <div className="mb-12">
                <div
                  className="h-0.5 w-12 mb-6"
                  style={{ background: 'linear-gradient(90deg, oklch(0.72 0.10 75), oklch(0.45 0.12 265))' }}
                />
                <h2
                  className="font-headline font-bold"
                  style={{
                    fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                    letterSpacing: '-0.02em',
                    color: 'oklch(0.25 0.05 265)'
                  }}
                >
                  교회 위치 안내
                </h2>
              </div>

              {/* Address Card */}
              <div
                className="p-6 rounded-sm"
                style={{
                  background: 'oklch(0.985 0.003 75)',
                  border: '1px solid oklch(0.92 0.005 75)',
                  boxShadow: '0 2px 8px oklch(0.30 0.09 265 / 0.06)'
                }}
              >
                <div className="flex items-center mb-4">
                  <div
                    className="w-10 h-10 rounded-sm flex items-center justify-center mr-4"
                    style={{ background: 'oklch(0.45 0.12 265 / 0.1)' }}
                  >
                    <MapPin className="w-5 h-5" style={{ color: 'oklch(0.45 0.12 265)' }} />
                  </div>
                  <h3
                    className="font-headline font-semibold"
                    style={{ color: 'oklch(0.25 0.05 265)' }}
                  >
                    주소
                  </h3>
                </div>
                <p
                  className="text-lg mb-1"
                  style={{ color: 'oklch(0.35 0.03 265)' }}
                >
                  758 Glenn Rd
                </p>
                <p
                  className="text-lg mb-5"
                  style={{ color: 'oklch(0.35 0.03 265)' }}
                >
                  State College, PA 16803
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={copyAddress}
                    className="inline-flex items-center px-4 py-2.5 rounded-sm transition-all duration-300"
                    style={{
                      background: 'oklch(0.97 0.005 75)',
                      color: 'oklch(0.35 0.03 265)',
                      border: '1px solid oklch(0.90 0.005 75)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'oklch(0.94 0.005 75)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'oklch(0.97 0.005 75)'
                    }}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    {copied ? '복사됨!' : '주소 복사'}
                  </button>
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2.5 rounded-sm transition-all duration-300"
                    style={{
                      background: 'oklch(0.45 0.12 265)',
                      color: 'oklch(0.98 0.003 75)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'oklch(0.35 0.10 265)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'oklch(0.45 0.12 265)'
                    }}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    구글 지도로 열기
                  </a>
                </div>
              </div>

              {/* Contact Info Card */}
              <div
                className="p-6 rounded-sm"
                style={{
                  background: 'oklch(0.985 0.003 75)',
                  border: '1px solid oklch(0.92 0.005 75)',
                  boxShadow: '0 2px 8px oklch(0.30 0.09 265 / 0.06)'
                }}
              >
                <div className="flex items-center mb-4">
                  <div
                    className="w-10 h-10 rounded-sm flex items-center justify-center mr-4"
                    style={{ background: 'oklch(0.72 0.10 75 / 0.15)' }}
                  >
                    <Phone className="w-5 h-5" style={{ color: 'oklch(0.58 0.11 75)' }} />
                  </div>
                  <h3
                    className="font-headline font-semibold"
                    style={{ color: 'oklch(0.25 0.05 265)' }}
                  >
                    연락처
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-3" style={{ color: 'oklch(0.55 0.01 75)' }} />
                    <span style={{ color: 'oklch(0.35 0.03 265)' }}>814-380-9393</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-3" style={{ color: 'oklch(0.55 0.01 75)' }} />
                    <span style={{ color: 'oklch(0.35 0.03 265)' }}>KyuHongYeon@gmail.com</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-3" style={{ color: 'oklch(0.55 0.01 75)' }} />
                    <span style={{ color: 'oklch(0.35 0.03 265)' }}>월-금 오전 9시 - 오후 5시</span>
                  </div>
                </div>
              </div>

              {/* Parking Info Card */}
              <div
                className="p-6 rounded-sm"
                style={{
                  background: 'oklch(0.985 0.003 75)',
                  border: '1px solid oklch(0.92 0.005 75)',
                  boxShadow: '0 2px 8px oklch(0.30 0.09 265 / 0.06)'
                }}
              >
                <div className="flex items-center mb-4">
                  <div
                    className="w-10 h-10 rounded-sm flex items-center justify-center mr-4"
                    style={{ background: 'oklch(0.45 0.12 265 / 0.1)' }}
                  >
                    <Car className="w-5 h-5" style={{ color: 'oklch(0.45 0.12 265)' }} />
                  </div>
                  <h3
                    className="font-headline font-semibold"
                    style={{ color: 'oklch(0.25 0.05 265)' }}
                  >
                    주차 안내
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div
                      className="w-1.5 h-1.5 rounded-full mt-2 mr-3 flex-shrink-0"
                      style={{ background: 'oklch(0.72 0.10 75)' }}
                    />
                    <div>
                      <h4
                        className="font-medium mb-1"
                        style={{ color: 'oklch(0.30 0.05 265)' }}
                      >
                        메인 주차장
                      </h4>
                      <p
                        className="text-sm"
                        style={{ color: 'oklch(0.55 0.01 75)' }}
                      >
                        교회 건물 바로 앞 주차장 이용
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div
                      className="w-1.5 h-1.5 rounded-full mt-2 mr-3 flex-shrink-0"
                      style={{ background: 'oklch(0.72 0.10 75)' }}
                    />
                    <div>
                      <h4
                        className="font-medium mb-1"
                        style={{ color: 'oklch(0.30 0.05 265)' }}
                      >
                        추가 주차장
                      </h4>
                      <p
                        className="text-sm"
                        style={{ color: 'oklch(0.55 0.01 75)' }}
                      >
                        교회 뒤쪽 추가 주차공간 있음
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div
                      className="w-1.5 h-1.5 rounded-full mt-2 mr-3 flex-shrink-0"
                      style={{ background: 'oklch(0.72 0.10 75)' }}
                    />
                    <div>
                      <h4
                        className="font-medium mb-1"
                        style={{ color: 'oklch(0.30 0.05 265)' }}
                      >
                        장애인 주차
                      </h4>
                      <p
                        className="text-sm"
                        style={{ color: 'oklch(0.55 0.01 75)' }}
                      >
                        메인 입구 근처에 전용 주차공간 마련
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'ko', ['common', 'directions'])),
  },
})

export default DirectionsPage
