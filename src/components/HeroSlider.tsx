import React, { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'

interface HeroSlide {
  title: string
  subtitle: string
}

interface HeroSliderProps {
  slides: HeroSlide[]
  fontClass?: string
}

const communityImages = [
  '/images/community/community1.jpg',
  '/images/community/community2.jpg',
  '/images/community/community3.jpg',
  '/images/community/community4.jpg',
  '/images/community/community5.jpg',
  '/images/community/community6.jpg',
]

const HeroSlider: React.FC<HeroSliderProps> = ({ slides, fontClass }) => {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Select random images for slides
  const slideImages = useMemo(() => {
    return slides.map(() => {
      return communityImages[Math.floor(Math.random() * communityImages.length)]
    })
  }, [slides])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  return (
    <section className="relative h-screen overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
        >
          <Image
            src={slideImages[index]}
            alt={`Church Community ${index + 1}`}
            fill
            className="object-cover"
            priority={index === 0}
          />

          {/* Gradient overlay for better text visibility and warmth */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-primary/40" />

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white px-4 max-w-4xl">
              <h1 className={`text-5xl md:text-7xl font-serif font-bold mb-6 drop-shadow-lg ${fontClass ?? ''} ${index === currentSlide ? 'animate-fade-in-up' : 'opacity-0'}`}>
                {slide.title}
              </h1>
              <div
                className={`h-1 w-24 bg-secondary mx-auto mb-8 rounded-full ${index === currentSlide ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: '0.2s' }}
              />
              <p
                className={`text-xl md:text-2xl font-light max-w-3xl mx-auto drop-shadow-md ${fontClass ?? ''} ${index === currentSlide ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: '0.4s' }}
              >
                {slide.subtitle}
              </p>
            </div>
          </div>
        </div>
      ))}

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
          />
        ))}
      </div>
    </section>
  )
}

export default HeroSlider
