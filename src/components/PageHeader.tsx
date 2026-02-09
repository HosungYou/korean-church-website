// ===========================================
// VS Design Diverge: Page Header Component
// OKLCH Color System + Editorial Minimalism
// ===========================================

import React, { useMemo } from 'react'
import Image from 'next/image'

interface PageHeaderProps {
  title: string
  subtitle?: string
  height?: string
  label?: string // Micro label above title
  images?: string[] // Custom images array for the page
  image?: string // Single custom image
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
  height = 'h-72 md:h-80',
  label,
  images,
  image
}) => {
  // Select image: single image > custom images array > default community images
  const selectedImage = useMemo(() => {
    if (image) return image
    const imagePool = images && images.length > 0 ? images : communityImages
    return imagePool[Math.floor(Math.random() * imagePool.length)]
  }, [image, images])

  return (
    <div
      className={`relative ${height} overflow-hidden`}
      style={{ background: 'oklch(0.15 0.05 265)' }}
    >
      <Image
        src={selectedImage}
        alt="Church Community"
        fill
        className="object-cover"
        priority
      />

      {/* Deep Indigo gradient overlay - Editorial style */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(
            to bottom,
            oklch(0.15 0.05 265 / 0.75) 0%,
            oklch(0.22 0.08 265 / 0.85) 50%,
            oklch(0.30 0.09 265 / 0.95) 100%
          )`
        }}
      />

      {/* Subtle grain texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          mixBlendMode: 'overlay'
        }}
      />

      {/* Content - Left aligned Editorial style */}
      <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-12 lg:px-20">
        <div className="max-w-4xl">
          {/* Gold accent line */}
          <div
            className="h-0.5 w-12 mb-6"
            style={{
              background: 'linear-gradient(90deg, oklch(0.72 0.10 75), oklch(0.58 0.11 75))'
            }}
          />

          {/* Micro label */}
          {label && (
            <span
              className="text-xs font-medium tracking-[0.2em] uppercase mb-4 block"
              style={{ color: 'oklch(0.72 0.10 75)' }}
            >
              {label}
            </span>
          )}

          {/* Main title - Editorial typography */}
          <h1
            className="font-headline font-black mb-3"
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              letterSpacing: '-0.03em',
              lineHeight: '1.1',
              color: 'oklch(0.98 0.003 75)'
            }}
          >
            {title}
          </h1>

          {/* Subtitle */}
          {subtitle && (
            <p
              className="text-base md:text-lg max-w-2xl leading-relaxed"
              style={{ color: 'oklch(0.75 0.02 75)' }}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Bottom fade for smooth transition */}
      <div
        className="absolute bottom-0 left-0 right-0 h-8"
        style={{
          background: 'linear-gradient(to top, oklch(0.985 0.003 75), transparent)'
        }}
      />
    </div>
  )
}

export default PageHeader
