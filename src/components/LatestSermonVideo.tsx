import { useState, useEffect } from 'react'
import { Play, Calendar, User, BookOpen, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { getSermons, getYouTubeThumbnailUrl } from '../utils/sermonService'
import type { Sermon } from '../../types/supabase'

const LatestSermonVideo = () => {
  const [sermon, setSermon] = useState<Sermon | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const data = await getSermons({ type: 'sunday', status: 'published', limit: 1 })
        if (data.length > 0) setSermon(data[0])
      } catch (error) {
        console.error('최신 설교 조회 오류:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchLatest()
  }, [])

  if (loading || !sermon || !sermon.youtube_video_id) return null

  const formatDate = (dateString: string) => {
    const [y, m, d] = dateString.split('-').map(Number)
    const date = new Date(y, m - 1, d)
    return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  return (
    <section className="py-24 relative overflow-hidden" style={{ background: 'oklch(0.15 0.05 265)' }}>
      <div className="absolute inset-0 bg-grain opacity-[0.03]" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Editorial Section Header */}
        <div className="mb-12">
          <div
            className="h-0.5 w-12 mb-6"
            style={{ background: 'linear-gradient(90deg, oklch(0.72 0.10 75), oklch(0.45 0.12 265))' }}
          />
          <span
            className="text-xs font-medium tracking-[0.2em] uppercase mb-4 block"
            style={{ color: 'oklch(0.72 0.10 75)' }}
          >
            Latest Sermon
          </span>
          <h2
            className="font-headline font-black"
            style={{
              fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
              letterSpacing: '-0.02em',
              color: 'oklch(0.98 0.003 75)',
            }}
          >
            최신 주일설교
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Video */}
          <div className="lg:col-span-3">
            <div className="aspect-video w-full rounded-sm overflow-hidden shadow-2xl">
              <iframe
                src={`https://www.youtube.com/embed/${sermon.youtube_video_id}`}
                title={sermon.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>

          {/* Info */}
          <div className="lg:col-span-2 flex flex-col justify-center">
            <h3
              className="font-headline font-bold text-2xl mb-4"
              style={{ color: 'oklch(0.98 0.003 75)' }}
            >
              {sermon.title}
            </h3>
            <div className="space-y-3 mb-6">
              <div className="flex items-center" style={{ color: 'oklch(0.70 0.02 75)' }}>
                <Calendar className="w-4 h-4 mr-3" />
                <span>{formatDate(sermon.sermon_date)}</span>
              </div>
              {sermon.speaker && (
                <div className="flex items-center" style={{ color: 'oklch(0.70 0.02 75)' }}>
                  <User className="w-4 h-4 mr-3" />
                  <span>{sermon.speaker}</span>
                </div>
              )}
              {sermon.scripture && (
                <div className="flex items-center" style={{ color: 'oklch(0.70 0.02 75)' }}>
                  <BookOpen className="w-4 h-4 mr-3" />
                  <span>{sermon.scripture}</span>
                </div>
              )}
            </div>
            {sermon.description && (
              <p
                className="leading-relaxed mb-6 line-clamp-3"
                style={{ color: 'oklch(0.65 0.01 75)' }}
              >
                {sermon.description}
              </p>
            )}
            <Link
              href="/sermons/sunday"
              className="inline-flex items-center font-semibold text-sm transition-colors duration-300"
              style={{ color: 'oklch(0.72 0.10 75)' }}
            >
              모든 설교 보기
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LatestSermonVideo
