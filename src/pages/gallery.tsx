import type { GetStaticProps, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Layout from '@/components/Layout'
import Image from 'next/image'

const Gallery: NextPage = () => {
  const { t, i18n } = useTranslation(['common'])

  const photoCategories = [
    {
      id: 1,
      title: i18n.language === 'ko' ? '주일예배' : 'Sunday Service',
      photos: [
        { id: 1, src: '/images/Paster and Family.jpg', alt: 'Sunday Service 1' },
        { id: 2, src: '/images/Paster and Family.jpg', alt: 'Sunday Service 2' },
      ]
    },
    {
      id: 2,
      title: i18n.language === 'ko' ? '교회 행사' : 'Church Events',
      photos: [
        { id: 3, src: '/images/Paster and Family.jpg', alt: 'Church Event 1' },
        { id: 4, src: '/images/Paster and Family.jpg', alt: 'Church Event 2' },
      ]
    }
  ]

  return (
    <Layout>
      {/* Header Section */}
      <section className="bg-church-primary py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className={`text-4xl font-bold text-white text-center ${
            i18n.language === 'ko' ? 'font-korean' : 'font-english'
          }`}>
            {i18n.language === 'ko' ? '사진첩' : 'Photo Gallery'}
          </h1>
          <p className={`mt-4 text-xl text-gray-100 text-center ${
            i18n.language === 'ko' ? 'font-korean' : 'font-english'
          }`}>
            {i18n.language === 'ko' ? '교회의 소중한 순간들' : 'Precious moments of our church'}
          </p>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {photoCategories.map((category) => (
            <div key={category.id} className="mb-12">
              <h2 className={`text-2xl font-bold text-gray-900 mb-6 ${
                i18n.language === 'ko' ? 'font-korean' : 'font-english'
              }`}>
                {category.title}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.photos.map((photo) => (
                  <div key={photo.id} className="bg-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      width={400}
                      height={300}
                      className="w-full h-64 object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
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

export default Gallery