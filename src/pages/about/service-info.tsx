import Layout from '@/components/Layout'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Image from 'next/image'
import { Clock, MapPin } from 'lucide-react'

const ServiceInfoPage = () => {
  const services = [
    { name: '주일예배', time: '매주 일요일 오전 11:00', location: '본당' },
    { name: '수요예배', time: '매주 수요일 오후 7:30', location: '본당' },
    { name: '금요철야', time: '매주 금요일 오후 8:00', location: '본당' },
    { name: '새벽기도', time: '화-금 오전 6:00', location: '온라인 (ZOOM)' },
  ]

  return (
    <Layout>
      <div className="relative h-64 bg-black">
        <Image
          src="/images/service-header.jpg"
          alt="Service Information"
          fill
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white font-korean">예배 안내</h1>
        </div>
      </div>
      <div className="bg-dotted-pattern">
        <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {services.map((service) => (
              <div key={service.name} className="bg-white p-8 rounded-lg shadow-lg border border-black/10">
                <h2 className="text-2xl font-bold font-korean mb-4">{service.name}</h2>
                <div className="flex items-center text-lg text-gray-700 mb-2">
                  <Clock className="w-5 h-5 mr-3 text-gray-500" />
                  <span className="font-korean">{service.time}</span>
                </div>
                <div className="flex items-center text-lg text-gray-700">
                  <MapPin className="w-5 h-5 mr-3 text-gray-500" />
                  <span className="font-korean">{service.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'ko', ['common'])),
  },
})

export default ServiceInfoPage
