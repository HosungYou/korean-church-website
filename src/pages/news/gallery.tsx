import Layout from '@/components/Layout'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Image from 'next/image'

const GalleryPage = () => {
  const images = [
    { id: 1, src: '/images/gallery1.jpg', alt: 'Summer retreat' },
    { id: 2, src: '/images/gallery2.jpg', alt: 'Christmas service' },
    { id: 3, src: '/images/gallery3.jpg', alt: 'Church picnic' },
    { id: 4, src: '/images/gallery4.jpg', alt: 'Baptism ceremony' },
    { id: 5, src: '/images/gallery5.jpg', alt: 'Praise night' },
    { id: 6, src: '/images/gallery6.jpg', alt: 'Youth group activity' },
  ]

  return (
    <Layout>
      <div className="relative h-64 bg-black">
        <Image
          src="/images/news-header.jpg"
          alt="News"
          fill
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white font-korean">행사사진</h1>
        </div>
      </div>
      <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {images.map((image) => (
            <div key={image.id} className="group aspect-w-1 aspect-h-1 block w-full overflow-hidden rounded-lg bg-gray-100">
              <Image src={image.src} alt={image.alt} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
            </div>
          ))}
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

export default GalleryPage
