// ===========================================
// VS Design Diverge: Service Info Page
// OKLCH Color System + Editorial Minimalism
// ===========================================

import Layout from '@/components/Layout'
import PageHeader from '@/components/PageHeader'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { Clock, MapPin, Users, Monitor, Phone, Mail, Calendar } from 'lucide-react'

const ServiceInfoPage = () => {
  const { t, i18n } = useTranslation('common')
  const fontClass = i18n.language === 'ko' ? 'font-korean' : 'font-english'

  return (
    <Layout>
      {/* Hero Section - Using PageHeader Component */}
      <PageHeader
        title={i18n.language === 'ko' ? '예배 안내' : 'Service Information'}
        subtitle={i18n.language === 'ko' ? '함께 예배하는 기쁨, 하나님을 만나는 은혜의 시간' : "Join us in worship and experience God's grace"}
        label={i18n.language === 'ko' ? '예배' : 'Worship'}
      />

      {/* Main Sunday Service */}
      <section className="py-20" style={{ background: 'oklch(0.985 0.003 75)' }}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
          {/* Editorial Section Header */}
          <div className="mb-12">
            <div className="h-0.5 w-12 mb-6" style={{ background: 'linear-gradient(90deg, oklch(0.72 0.10 75), oklch(0.45 0.12 265))' }} />
            <h2 className={`font-headline font-bold ${fontClass}`} style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', letterSpacing: '-0.02em', color: 'oklch(0.25 0.05 265)' }}>
              {i18n.language === 'ko' ? '주일예배' : 'Sunday Service'}
            </h2>
          </div>

          <div
            className="rounded-sm p-8 max-w-3xl"
            style={{
              background: 'oklch(0.985 0.003 75)',
              border: '1px solid oklch(0.92 0.005 75)',
              boxShadow: '0 2px 8px oklch(0.30 0.09 265 / 0.06)'
            }}
          >
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start">
                  <Clock className="w-5 h-5 mt-1 mr-4 flex-shrink-0" style={{ color: 'oklch(0.45 0.12 265)' }} />
                  <div>
                    <p className={`font-semibold mb-1 ${fontClass}`} style={{ color: 'oklch(0.25 0.05 265)' }}>
                      {i18n.language === 'ko' ? '예배 시간' : 'Service Time'}
                    </p>
                    <p className={fontClass} style={{ color: 'oklch(0.55 0.01 75)' }}>
                      {i18n.language === 'ko' ? '매주 일요일 오전 11:00' : 'Every Sunday 11:00 AM'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="w-5 h-5 mt-1 mr-4 flex-shrink-0" style={{ color: 'oklch(0.45 0.12 265)' }} />
                  <div>
                    <p className={`font-semibold mb-1 ${fontClass}`} style={{ color: 'oklch(0.25 0.05 265)' }}>
                      {i18n.language === 'ko' ? '예배 장소' : 'Location'}
                    </p>
                    <p className={fontClass} style={{ color: 'oklch(0.55 0.01 75)' }}>
                      {i18n.language === 'ko' ? '본당 대예배실' : 'Main Sanctuary'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start">
                  <Users className="w-5 h-5 mt-1 mr-4 flex-shrink-0" style={{ color: 'oklch(0.45 0.12 265)' }} />
                  <div>
                    <p className={`font-semibold mb-1 ${fontClass}`} style={{ color: 'oklch(0.25 0.05 265)' }}>
                      {i18n.language === 'ko' ? '설교' : 'Sermon'}
                    </p>
                    <p className={fontClass} style={{ color: 'oklch(0.55 0.01 75)' }}>
                      {i18n.language === 'ko' ? '연규홍 담임목사' : 'Senior Pastor Kyu Hong Yeon'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Calendar className="w-5 h-5 mt-1 mr-4 flex-shrink-0" style={{ color: 'oklch(0.45 0.12 265)' }} />
                  <div>
                    <p className={`font-semibold mb-1 ${fontClass}`} style={{ color: 'oklch(0.25 0.05 265)' }}>
                      {i18n.language === 'ko' ? '예배 순서' : 'Order of Service'}
                    </p>
                    <p className={fontClass} style={{ color: 'oklch(0.55 0.01 75)' }}>
                      {i18n.language === 'ko' ? '찬양, 기도, 설교, 성찬' : 'Praise, Prayer, Sermon, Communion'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Weekday Services */}
      <section className="py-20" style={{ background: 'oklch(0.97 0.005 75)' }}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
          {/* Editorial Section Header */}
          <div className="mb-12">
            <div className="h-0.5 w-12 mb-6" style={{ background: 'linear-gradient(90deg, oklch(0.72 0.10 75), oklch(0.45 0.12 265))' }} />
            <h2 className={`font-headline font-bold ${fontClass}`} style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', letterSpacing: '-0.02em', color: 'oklch(0.25 0.05 265)' }}>
              {i18n.language === 'ko' ? '주중예배' : 'Weekday Services'}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl">
            {/* Wednesday Service */}
            <div
              className="rounded-sm p-6 transition-all duration-300 hover:translate-y-[-2px]"
              style={{
                background: 'oklch(0.985 0.003 75)',
                border: '1px solid oklch(0.92 0.005 75)',
                boxShadow: '0 2px 8px oklch(0.30 0.09 265 / 0.06)'
              }}
            >
              <h3 className={`text-lg font-bold mb-4 ${fontClass}`} style={{ color: 'oklch(0.25 0.05 265)' }}>
                {i18n.language === 'ko' ? '수요예배' : 'Wednesday Service'}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-3" style={{ color: 'oklch(0.45 0.12 265)' }} />
                  <span className={fontClass} style={{ color: 'oklch(0.55 0.01 75)' }}>
                    {i18n.language === 'ko' ? '매주 수요일 오후 7:30' : 'Every Wednesday 7:30 PM'}
                  </span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-3" style={{ color: 'oklch(0.45 0.12 265)' }} />
                  <span className={fontClass} style={{ color: 'oklch(0.55 0.01 75)' }}>
                    {i18n.language === 'ko' ? '본당' : 'Main Sanctuary'}
                  </span>
                </div>
                <div className="pt-3 mt-3" style={{ borderTop: '1px solid oklch(0.92 0.005 75)' }}>
                  <p className={`text-sm ${fontClass}`} style={{ color: 'oklch(0.55 0.01 75)' }}>
                    {i18n.language === 'ko' ? '말씀과 기도로 한 주를 돌아보는 시간' : 'Midweek reflection through Word and prayer'}
                  </p>
                </div>
              </div>
            </div>

            {/* Dawn Prayer */}
            <div
              className="rounded-sm p-6 transition-all duration-300 hover:translate-y-[-2px]"
              style={{
                background: 'oklch(0.985 0.003 75)',
                border: '1px solid oklch(0.92 0.005 75)',
                boxShadow: '0 2px 8px oklch(0.30 0.09 265 / 0.06)'
              }}
            >
              <h3 className={`text-lg font-bold mb-4 ${fontClass}`} style={{ color: 'oklch(0.25 0.05 265)' }}>
                {i18n.language === 'ko' ? '새벽기도' : 'Dawn Prayer'}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-3" style={{ color: 'oklch(0.45 0.12 265)' }} />
                  <span className={fontClass} style={{ color: 'oklch(0.55 0.01 75)' }}>
                    {i18n.language === 'ko' ? '화-금 오전 6:00' : 'Tue-Fri 6:00 AM'}
                  </span>
                </div>
                <div className="flex items-center">
                  <Monitor className="w-4 h-4 mr-3" style={{ color: 'oklch(0.45 0.12 265)' }} />
                  <span className={fontClass} style={{ color: 'oklch(0.55 0.01 75)' }}>
                    {i18n.language === 'ko' ? '온라인 (Zoom)' : 'Online (Zoom)'}
                  </span>
                </div>
                <div className="pt-3 mt-3" style={{ borderTop: '1px solid oklch(0.92 0.005 75)' }}>
                  <p className={`text-sm ${fontClass}`} style={{ color: 'oklch(0.55 0.01 75)' }}>
                    {i18n.language === 'ko' ? '말씀 묵상과 기도로 하루를 시작' : 'Start your day with meditation and prayer'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Online Service Section */}
      <section className="py-20" style={{ background: 'oklch(0.15 0.05 265)' }}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
          {/* Editorial Section Header */}
          <div className="mb-12">
            <div className="h-0.5 w-12 mb-6" style={{ background: 'linear-gradient(90deg, oklch(0.72 0.10 75), oklch(0.58 0.11 75))' }} />
            <h2 className={`font-headline font-bold ${fontClass}`} style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', letterSpacing: '-0.02em', color: 'oklch(0.98 0.003 75)' }}>
              {i18n.language === 'ko' ? '온라인 예배' : 'Online Service'}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl">
            <div
              className="rounded-sm p-6 transition-all duration-300 hover:translate-y-[-2px]"
              style={{
                background: 'oklch(0.22 0.06 265)',
                border: '1px solid oklch(0.30 0.08 265)',
              }}
            >
              <Monitor className="w-10 h-10 mb-4" style={{ color: 'oklch(0.72 0.10 75)' }} />
              <h3 className={`text-lg font-semibold mb-2 ${fontClass}`} style={{ color: 'oklch(0.98 0.003 75)' }}>
                {i18n.language === 'ko' ? 'YouTube 라이브' : 'YouTube Live'}
              </h3>
              <p className={`text-sm ${fontClass}`} style={{ color: 'oklch(0.75 0.02 75)' }}>
                {i18n.language === 'ko' ? '주일 오전 11:00 실시간 중계' : 'Sunday 11:00 AM Live Stream'}
              </p>
            </div>

            <div
              className="rounded-sm p-6 transition-all duration-300 hover:translate-y-[-2px]"
              style={{
                background: 'oklch(0.22 0.06 265)',
                border: '1px solid oklch(0.30 0.08 265)',
              }}
            >
              <Users className="w-10 h-10 mb-4" style={{ color: 'oklch(0.72 0.10 75)' }} />
              <h3 className={`text-lg font-semibold mb-2 ${fontClass}`} style={{ color: 'oklch(0.98 0.003 75)' }}>
                {i18n.language === 'ko' ? 'Zoom 새벽기도' : 'Zoom Dawn Prayer'}
              </h3>
              <p className={`text-sm ${fontClass}`} style={{ color: 'oklch(0.75 0.02 75)' }}>
                {i18n.language === 'ko' ? '화-금 오전 6:00 온라인 모임' : 'Tue-Fri 6:00 AM Online Meeting'}
              </p>
            </div>

            <div
              className="rounded-sm p-6 transition-all duration-300 hover:translate-y-[-2px]"
              style={{
                background: 'oklch(0.22 0.06 265)',
                border: '1px solid oklch(0.30 0.08 265)',
              }}
            >
              <Calendar className="w-10 h-10 mb-4" style={{ color: 'oklch(0.72 0.10 75)' }} />
              <h3 className={`text-lg font-semibold mb-2 ${fontClass}`} style={{ color: 'oklch(0.98 0.003 75)' }}>
                {i18n.language === 'ko' ? '온라인 헌금' : 'Online Giving'}
              </h3>
              <p className={`text-sm ${fontClass}`} style={{ color: 'oklch(0.75 0.02 75)' }}>
                {i18n.language === 'ko' ? '계좌이체 및 온라인 헌금' : 'Bank Transfer & Online Donation'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Giving Section */}
      <section id="giving" className="py-20" style={{ background: 'oklch(0.985 0.003 75)' }}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
          {/* Editorial Section Header */}
          <div className="mb-12">
            <div className="h-0.5 w-12 mb-6" style={{ background: 'linear-gradient(90deg, oklch(0.72 0.10 75), oklch(0.45 0.12 265))' }} />
            <h2 className={`font-headline font-bold ${fontClass}`} style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', letterSpacing: '-0.02em', color: 'oklch(0.25 0.05 265)' }}>
              {i18n.language === 'ko' ? '헌금 안내' : 'Giving Information'}
            </h2>
            <p className={`mt-4 max-w-2xl ${fontClass}`} style={{ color: 'oklch(0.55 0.01 75)' }}>
              {i18n.language === 'ko'
                ? '성도들의 헌금은 교회의 사역과 선교, 지역사회 섬김에 사용됩니다.'
                : 'Your offerings support church ministry, missions, and community service.'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Offering Envelope */}
            <div
              className="rounded-sm p-6 transition-all duration-300 hover:translate-y-[-2px]"
              style={{
                background: 'oklch(0.985 0.003 75)',
                border: '1px solid oklch(0.92 0.005 75)',
                boxShadow: '0 2px 8px oklch(0.30 0.09 265 / 0.06)'
              }}
            >
              <div className="w-12 h-12 rounded-sm flex items-center justify-center mb-4" style={{ background: 'oklch(0.45 0.12 265 / 0.1)' }}>
                <svg className="w-6 h-6" style={{ color: 'oklch(0.45 0.12 265)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h6m-6 4h6m-6 4h6"/>
                </svg>
              </div>
              <h3 className={`font-bold mb-2 ${fontClass}`} style={{ color: 'oklch(0.25 0.05 265)' }}>
                {i18n.language === 'ko' ? '헌금봉투' : 'Offering Envelope'}
              </h3>
              <p className={`text-sm ${fontClass}`} style={{ color: 'oklch(0.55 0.01 75)' }}>
                {i18n.language === 'ko'
                  ? '예배 중 헌금봉투를 사용하여 헌금'
                  : 'Use offering envelopes during service'}
              </p>
            </div>

            {/* Mail */}
            <div
              className="rounded-sm p-6 transition-all duration-300 hover:translate-y-[-2px]"
              style={{
                background: 'oklch(0.985 0.003 75)',
                border: '1px solid oklch(0.92 0.005 75)',
                boxShadow: '0 2px 8px oklch(0.30 0.09 265 / 0.06)'
              }}
            >
              <div className="w-12 h-12 rounded-sm flex items-center justify-center mb-4" style={{ background: 'oklch(0.45 0.12 265 / 0.1)' }}>
                <Mail className="w-6 h-6" style={{ color: 'oklch(0.45 0.12 265)' }} />
              </div>
              <h3 className={`font-bold mb-2 ${fontClass}`} style={{ color: 'oklch(0.25 0.05 265)' }}>
                {i18n.language === 'ko' ? '우편 송금' : 'Mail'}
              </h3>
              <p className={`text-sm ${fontClass}`} style={{ color: 'oklch(0.55 0.01 75)' }}>
                123 Church Street<br />
                State College, PA 16801
              </p>
            </div>

            {/* PayPal */}
            <div
              className="rounded-sm p-6 transition-all duration-300 hover:translate-y-[-2px]"
              style={{
                background: 'oklch(0.985 0.003 75)',
                border: '1px solid oklch(0.92 0.005 75)',
                boxShadow: '0 2px 8px oklch(0.30 0.09 265 / 0.06)'
              }}
            >
              <div className="w-12 h-12 rounded-sm flex items-center justify-center mb-4" style={{ background: 'oklch(0.45 0.12 265 / 0.1)' }}>
                <svg className="w-6 h-6" style={{ color: 'oklch(0.45 0.12 265)' }} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106z"/>
                </svg>
              </div>
              <h3 className={`font-bold mb-2 ${fontClass}`} style={{ color: 'oklch(0.25 0.05 265)' }}>
                PayPal
              </h3>
              <p className={`text-sm ${fontClass}`} style={{ color: 'oklch(0.55 0.01 75)' }}>
                giving@sckoreanchurch.org
              </p>
            </div>

            {/* Venmo */}
            <div
              className="rounded-sm p-6 transition-all duration-300 hover:translate-y-[-2px]"
              style={{
                background: 'oklch(0.985 0.003 75)',
                border: '1px solid oklch(0.92 0.005 75)',
                boxShadow: '0 2px 8px oklch(0.30 0.09 265 / 0.06)'
              }}
            >
              <div className="w-12 h-12 rounded-sm flex items-center justify-center mb-4" style={{ background: 'oklch(0.45 0.12 265 / 0.1)' }}>
                <svg className="w-6 h-6" style={{ color: 'oklch(0.45 0.12 265)' }} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.734 4.371c1.594 2.247 1.594 5.317.547 8.463L16.688 24h-5.469l-3.047-11.672c-.391-1.484-.313-2.578.234-3.203.547-.625 1.484-.859 2.578-.859h1.172l1.953 7.5L16.375 4.37h3.359z"/>
                </svg>
              </div>
              <h3 className={`font-bold mb-2 ${fontClass}`} style={{ color: 'oklch(0.25 0.05 265)' }}>
                Venmo
              </h3>
              <p className={`text-sm ${fontClass}`} style={{ color: 'oklch(0.55 0.01 75)' }}>
                @SCKoreanChurch
              </p>
            </div>
          </div>

          {/* Tax Info */}
          <div
            className="mt-8 rounded-sm p-6"
            style={{
              background: 'oklch(0.72 0.10 75 / 0.1)',
              border: '1px solid oklch(0.72 0.10 75 / 0.2)',
            }}
          >
            <p className={`text-sm ${fontClass}`} style={{ color: 'oklch(0.45 0.05 265)' }}>
              {i18n.language === 'ko'
                ? '스테이트 칼리지 한인교회는 501(c)(3) 비영리 단체입니다. 모든 헌금은 세금 공제 대상이며, 연말에 헌금 영수증을 발급해 드립니다.'
                : 'State College Korean Church is a 501(c)(3) non-profit organization. All donations are tax-deductible, and year-end giving statements are provided.'}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20" style={{ background: 'oklch(0.97 0.005 75)' }}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
          {/* Editorial Section Header */}
          <div className="mb-12">
            <div className="h-0.5 w-12 mb-6" style={{ background: 'linear-gradient(90deg, oklch(0.72 0.10 75), oklch(0.45 0.12 265))' }} />
            <h2 className={`font-headline font-bold ${fontClass}`} style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', letterSpacing: '-0.02em', color: 'oklch(0.25 0.05 265)' }}>
              {i18n.language === 'ko' ? '문의하기' : 'Contact Us'}
            </h2>
          </div>

          <div className="max-w-3xl">
            <div
              className="rounded-sm p-8"
              style={{
                background: 'oklch(0.985 0.003 75)',
                border: '1px solid oklch(0.92 0.005 75)',
                boxShadow: '0 2px 8px oklch(0.30 0.09 265 / 0.06)'
              }}
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-center">
                  <Phone className="w-5 h-5 mr-4" style={{ color: 'oklch(0.45 0.12 265)' }} />
                  <div>
                    <p className={`font-semibold ${fontClass}`} style={{ color: 'oklch(0.25 0.05 265)' }}>
                      {i18n.language === 'ko' ? '전화' : 'Phone'}
                    </p>
                    <p style={{ color: 'oklch(0.55 0.01 75)' }}>(123) 456-7890</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Mail className="w-5 h-5 mr-4" style={{ color: 'oklch(0.45 0.12 265)' }} />
                  <div>
                    <p className={`font-semibold ${fontClass}`} style={{ color: 'oklch(0.25 0.05 265)' }}>
                      {i18n.language === 'ko' ? '이메일' : 'Email'}
                    </p>
                    <p style={{ color: 'oklch(0.55 0.01 75)' }}>info@koreanschurch.org</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6" style={{ borderTop: '1px solid oklch(0.92 0.005 75)' }}>
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 mr-4 mt-1" style={{ color: 'oklch(0.45 0.12 265)' }} />
                  <div>
                    <p className={`font-semibold mb-1 ${fontClass}`} style={{ color: 'oklch(0.25 0.05 265)' }}>
                      {i18n.language === 'ko' ? '교회 주소' : 'Church Address'}
                    </p>
                    <p className={fontClass} style={{ color: 'oklch(0.55 0.01 75)' }}>
                      123 Church Street, City, State 12345
                    </p>
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
    ...(await serverSideTranslations(locale ?? 'ko', ['common'])),
  },
})

export default ServiceInfoPage
