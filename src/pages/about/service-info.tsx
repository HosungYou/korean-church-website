import Layout from '@/components/Layout'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { Clock, MapPin, Users, Monitor, Phone, Mail, Calendar } from 'lucide-react'

const ServiceInfoPage = () => {
  const { t, i18n } = useTranslation('common')

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-black to-gray-900 py-24">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className={`text-5xl font-bold text-white mb-4 ${
            i18n.language === 'ko' ? 'font-korean' : 'font-english'
          }`}>
            {i18n.language === 'ko' ? '예배 안내' : 'Service Information'}
          </h1>
          <p className={`text-xl text-gray-300 ${
            i18n.language === 'ko' ? 'font-korean' : 'font-english'
          }`}>
            {i18n.language === 'ko' ? '함께 예배하는 기쁨, 하나님을 만나는 은혜의 시간' : 'Join us in worship and experience God\'s grace'}
          </p>
        </div>
      </section>

      {/* Main Sunday Service */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className={`text-3xl font-bold text-black mb-2 ${
              i18n.language === 'ko' ? 'font-korean' : 'font-english'
            }`}>
              {i18n.language === 'ko' ? '주일예배' : 'Sunday Service'}
            </h2>
            <div className="w-24 h-1 bg-black mx-auto"></div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-3xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-start">
                  <Clock className="w-6 h-6 mt-1 mr-3 text-gray-700" />
                  <div>
                    <p className={`font-semibold text-black ${
                      i18n.language === 'ko' ? 'font-korean' : 'font-english'
                    }`}>
                      {i18n.language === 'ko' ? '예배 시간' : 'Service Time'}
                    </p>
                    <p className={`text-gray-600 ${
                      i18n.language === 'ko' ? 'font-korean' : 'font-english'
                    }`}>
                      {i18n.language === 'ko' ? '매주 일요일 오전 11:00' : 'Every Sunday 11:00 AM'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="w-6 h-6 mt-1 mr-3 text-gray-700" />
                  <div>
                    <p className={`font-semibold text-black ${
                      i18n.language === 'ko' ? 'font-korean' : 'font-english'
                    }`}>
                      {i18n.language === 'ko' ? '예배 장소' : 'Location'}
                    </p>
                    <p className={`text-gray-600 ${
                      i18n.language === 'ko' ? 'font-korean' : 'font-english'
                    }`}>
                      {i18n.language === 'ko' ? '본당 대예배실' : 'Main Sanctuary'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start">
                  <Users className="w-6 h-6 mt-1 mr-3 text-gray-700" />
                  <div>
                    <p className={`font-semibold text-black ${
                      i18n.language === 'ko' ? 'font-korean' : 'font-english'
                    }`}>
                      {i18n.language === 'ko' ? '설교' : 'Sermon'}
                    </p>
                    <p className={`text-gray-600 ${
                      i18n.language === 'ko' ? 'font-korean' : 'font-english'
                    }`}>
                      {i18n.language === 'ko' ? '연규홍 담임목사' : 'Senior Pastor Kyu Hong Yeon'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Calendar className="w-6 h-6 mt-1 mr-3 text-gray-700" />
                  <div>
                    <p className={`font-semibold text-black ${
                      i18n.language === 'ko' ? 'font-korean' : 'font-english'
                    }`}>
                      {i18n.language === 'ko' ? '예배 순서' : 'Order of Service'}
                    </p>
                    <p className={`text-gray-600 ${
                      i18n.language === 'ko' ? 'font-korean' : 'font-english'
                    }`}>
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
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className={`text-3xl font-bold text-black mb-2 ${
              i18n.language === 'ko' ? 'font-korean' : 'font-english'
            }`}>
              {i18n.language === 'ko' ? '주중예배' : 'Weekday Services'}
            </h2>
            <div className="w-24 h-1 bg-black mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Wednesday Service */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <h3 className={`text-xl font-bold text-black mb-4 ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                {i18n.language === 'ko' ? '수요예배' : 'Wednesday Service'}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-3 text-gray-600" />
                  <span className={`text-gray-700 ${
                    i18n.language === 'ko' ? 'font-korean' : 'font-english'
                  }`}>
                    {i18n.language === 'ko' ? '매주 수요일 오후 7:30' : 'Every Wednesday 7:30 PM'}
                  </span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-3 text-gray-600" />
                  <span className={`text-gray-700 ${
                    i18n.language === 'ko' ? 'font-korean' : 'font-english'
                  }`}>
                    {i18n.language === 'ko' ? '본당' : 'Main Sanctuary'}
                  </span>
                </div>
                <div className="pt-2 border-t border-gray-100">
                  <p className={`text-sm text-gray-600 ${
                    i18n.language === 'ko' ? 'font-korean' : 'font-english'
                  }`}>
                    {i18n.language === 'ko' ? '말씀과 기도로 한 주를 돌아보는 시간' : 'Midweek reflection through Word and prayer'}
                  </p>
                </div>
              </div>
            </div>

            {/* Dawn Prayer */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <h3 className={`text-xl font-bold text-black mb-4 ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                {i18n.language === 'ko' ? '새벽기도' : 'Dawn Prayer'}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-3 text-gray-600" />
                  <span className={`text-gray-700 ${
                    i18n.language === 'ko' ? 'font-korean' : 'font-english'
                  }`}>
                    {i18n.language === 'ko' ? '화-금 오전 6:00' : 'Tue-Fri 6:00 AM'}
                  </span>
                </div>
                <div className="flex items-center">
                  <Monitor className="w-5 h-5 mr-3 text-gray-600" />
                  <span className={`text-gray-700 ${
                    i18n.language === 'ko' ? 'font-korean' : 'font-english'
                  }`}>
                    {i18n.language === 'ko' ? '온라인 (Zoom)' : 'Online (Zoom)'}
                  </span>
                </div>
                <div className="pt-2 border-t border-gray-100">
                  <p className={`text-sm text-gray-600 ${
                    i18n.language === 'ko' ? 'font-korean' : 'font-english'
                  }`}>
                    {i18n.language === 'ko' ? '말씀 묵상과 기도로 하루를 시작' : 'Start your day with meditation and prayer'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Online Service Section */}
      <section className="py-16 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className={`text-3xl font-bold mb-2 ${
              i18n.language === 'ko' ? 'font-korean' : 'font-english'
            }`}>
              {i18n.language === 'ko' ? '온라인 예배' : 'Online Service'}
            </h2>
            <div className="w-24 h-1 bg-white mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="bg-white/10 rounded-lg p-6 hover:bg-white/20 transition-colors">
                <Monitor className="w-12 h-12 mx-auto mb-4" />
                <h3 className={`text-lg font-semibold mb-2 ${
                  i18n.language === 'ko' ? 'font-korean' : 'font-english'
                }`}>
                  {i18n.language === 'ko' ? 'YouTube 라이브' : 'YouTube Live'}
                </h3>
                <p className={`text-gray-300 text-sm ${
                  i18n.language === 'ko' ? 'font-korean' : 'font-english'
                }`}>
                  {i18n.language === 'ko' ? '주일 오전 11:00 실시간 중계' : 'Sunday 11:00 AM Live Stream'}
                </p>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-white/10 rounded-lg p-6 hover:bg-white/20 transition-colors">
                <Users className="w-12 h-12 mx-auto mb-4" />
                <h3 className={`text-lg font-semibold mb-2 ${
                  i18n.language === 'ko' ? 'font-korean' : 'font-english'
                }`}>
                  {i18n.language === 'ko' ? 'Zoom 새벽기도' : 'Zoom Dawn Prayer'}
                </h3>
                <p className={`text-gray-300 text-sm ${
                  i18n.language === 'ko' ? 'font-korean' : 'font-english'
                }`}>
                  {i18n.language === 'ko' ? '화-금 오전 6:00 온라인 모임' : 'Tue-Fri 6:00 AM Online Meeting'}
                </p>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-white/10 rounded-lg p-6 hover:bg-white/20 transition-colors">
                <Calendar className="w-12 h-12 mx-auto mb-4" />
                <h3 className={`text-lg font-semibold mb-2 ${
                  i18n.language === 'ko' ? 'font-korean' : 'font-english'
                }`}>
                  {i18n.language === 'ko' ? '온라인 헌금' : 'Online Giving'}
                </h3>
                <p className={`text-gray-300 text-sm ${
                  i18n.language === 'ko' ? 'font-korean' : 'font-english'
                }`}>
                  {i18n.language === 'ko' ? '계좌이체 및 온라인 헌금' : 'Bank Transfer & Online Donation'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className={`text-3xl font-bold text-black mb-2 ${
              i18n.language === 'ko' ? 'font-korean' : 'font-english'
            }`}>
              {i18n.language === 'ko' ? '문의하기' : 'Contact Us'}
            </h2>
            <div className="w-24 h-1 bg-black mx-auto"></div>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-center">
                  <Phone className="w-6 h-6 mr-4 text-gray-700" />
                  <div>
                    <p className={`font-semibold text-black ${
                      i18n.language === 'ko' ? 'font-korean' : 'font-english'
                    }`}>
                      {i18n.language === 'ko' ? '전화' : 'Phone'}
                    </p>
                    <p className="text-gray-600">(123) 456-7890</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Mail className="w-6 h-6 mr-4 text-gray-700" />
                  <div>
                    <p className={`font-semibold text-black ${
                      i18n.language === 'ko' ? 'font-korean' : 'font-english'
                    }`}>
                      {i18n.language === 'ko' ? '이메일' : 'Email'}
                    </p>
                    <p className="text-gray-600">info@koreanschurch.org</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-start">
                  <MapPin className="w-6 h-6 mr-4 mt-1 text-gray-700" />
                  <div>
                    <p className={`font-semibold text-black mb-1 ${
                      i18n.language === 'ko' ? 'font-korean' : 'font-english'
                    }`}>
                      {i18n.language === 'ko' ? '교회 주소' : 'Church Address'}
                    </p>
                    <p className={`text-gray-600 ${
                      i18n.language === 'ko' ? 'font-korean' : 'font-english'
                    }`}>
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