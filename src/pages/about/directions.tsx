import Layout from '@/components/Layout'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { MapPin, Bus, Train } from 'lucide-react'

const DirectionsPage = () => {
  return (
    <Layout>
      <div className="relative h-64 bg-black">
        <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{backgroundImage: "url('/images/directions-header.jpg')"}}></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white font-korean">오시는 길</h1>
        </div>
      </div>
      <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Map Section */}
          <div>
            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden border border-black/10">
              {/* Google Maps Embed */}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3164.650821833194!2d127.027586315175!3d37.51723633480294!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357ca3e3a28f1c8b%3A0x8b5a7e5c3c8c8e4!2sGangnam%20Station!5e0!3m2!1sen!2skr!4v1678886412345!5m2!1sen!2skr"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          {/* Info Section */}
          <div className="font-korean">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <MapPin className="w-6 h-6 mr-3" /> 주소
              </h2>
              <p className="text-lg text-gray-700">서울특별시 강남구 강남대로 396</p>
            </div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <Train className="w-6 h-6 mr-3" /> 지하철
              </h2>
              <p className="text-lg text-gray-700">2호선/신분당선 강남역 1번 출구, 도보 5분</p>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <Bus className="w-6 h-6 mr-3" /> 버스
              </h2>
              <p className="text-lg text-gray-700">강남역 정류장 하차</p>
              <p className="text-md text-gray-600 mt-1">간선: 140, 402, 420, 470</p>
              <p className="text-md text-gray-600">지선: 4312, 4412, 5412</p>
            </div>
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

export default DirectionsPage
