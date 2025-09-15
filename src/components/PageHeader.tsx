import React, { useMemo } from 'react'
import Image from 'next/image'

interface PageHeaderProps {
  title: string
  subtitle?: string
  height?: string
}

const communityImages = [
  '/images/community/community1.jpg',
  '/images/community/community2.jpg',
  '/images/community/community3.jpg',
  '/images/community/community4.jpg',
  '/images/community/community5.jpg',
  '/images/community/community6.jpg',
]

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  height = 'h-64'
}) => {
  // Select a random image on component mount
  const randomImage = useMemo(() => {
    return communityImages[Math.floor(Math.random() * communityImages.length)]
  }, [])

  return (
    <div className={`relative ${height} bg-black overflow-hidden`}>
      <Image
        src={randomImage}
        alt="Church Community"
        fill
        className="object-cover"
        priority
      />
      {/* Dark overlay for better text visibility */}
      <div className="absolute inset-0 bg-black bg-opacity-60" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white font-korean mb-2">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg md:text-xl text-white/80 font-korean max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  )
}

export default PageHeader