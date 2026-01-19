// ===========================================
// VS Design Diverge: Training Programs Page
// Editorial Minimalism + 한국적 미학
// OKLCH Color System
// ===========================================

import { useEffect, useState } from 'react'
import { GetStaticProps, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Link from 'next/link'
import Layout from '@/components/Layout'
import {
  BookOpen,
  ChevronRight,
  Calendar,
  FileText,
  GraduationCap,
} from 'lucide-react'
import { getPrograms, CATEGORY_LABELS, type ProgramCategory } from '../../utils/trainingService'
import type { TrainingProgram } from '../../../types/supabase'

const CATEGORY_COLORS: Record<ProgramCategory, string> = {
  new_family: 'oklch(0.55 0.15 340)',
  discipleship: 'oklch(0.45 0.12 265)',
  bible_study: 'oklch(0.55 0.15 145)',
  leadership: 'oklch(0.60 0.18 25)',
  baptism: 'oklch(0.55 0.18 200)',
  general: 'oklch(0.72 0.10 75)',
}

const TrainingPage: NextPage = () => {
  const { t, i18n } = useTranslation('training')
  const [programs, setPrograms] = useState<TrainingProgram[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const fontClass = i18n.language === 'ko' ? 'font-korean' : 'font-english'

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const data = await getPrograms()
        setPrograms(data)
      } catch (error) {
        console.error('프로그램 조회 오류:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchPrograms()
  }, [])

  const filteredPrograms = selectedCategory === 'all'
    ? programs
    : programs.filter(p => p.category === selectedCategory)

  const categories = Array.from(new Set(programs.map(p => p.category)))

  return (
    <Layout>
      {/* Hero Section - Editorial Style */}
      <section
        className="relative min-h-[60vh] flex items-center"
        style={{
          background: 'linear-gradient(135deg, oklch(0.15 0.05 265) 0%, oklch(0.22 0.08 265) 50%, oklch(0.18 0.06 265) 100%)',
        }}
      >
        {/* Grain Texture Overlay */}
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Decorative Elements */}
        <div
          className="absolute top-20 right-10 w-64 h-64 rounded-full opacity-10"
          style={{ background: 'oklch(0.72 0.10 75)' }}
        />
        <div
          className="absolute bottom-20 left-10 w-32 h-32 rounded-full opacity-10"
          style={{ background: 'oklch(0.72 0.10 75)' }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            {/* Micro Label */}
            <div className="flex items-center gap-3 mb-8 stagger-1">
              <div
                className="h-px w-16"
                style={{ background: 'linear-gradient(90deg, oklch(0.72 0.10 75), transparent)' }}
              />
              <span
                className="text-xs font-medium tracking-[0.3em] uppercase"
                style={{ color: 'oklch(0.72 0.10 75)' }}
              >
                {t('hero.label')}
              </span>
            </div>

            {/* Hero Title */}
            <h1
              className={`${fontClass} font-headline font-black mb-6 stagger-2`}
              style={{
                fontSize: 'clamp(2.5rem, 7vw, 4.5rem)',
                letterSpacing: '-0.03em',
                lineHeight: '1.1',
                color: 'oklch(0.98 0.003 75)',
              }}
            >
              {t('hero.title')}
            </h1>

            {/* Hero Subtitle */}
            <p
              className={`${fontClass} text-lg md:text-xl max-w-2xl leading-relaxed mb-8 stagger-3`}
              style={{ color: 'oklch(0.75 0.02 75)' }}
            >
              {t('hero.subtitle')}
            </p>

            {/* Stats */}
            <div className="flex gap-8 stagger-4">
              <div className="text-center">
                <span
                  className="block font-headline font-black text-4xl"
                  style={{ color: 'oklch(0.72 0.10 75)' }}
                >
                  {programs.length}
                </span>
                <span
                  className="text-xs uppercase tracking-wider"
                  style={{ color: 'oklch(0.65 0.02 75)' }}
                >
                  {t('stats.programs')}
                </span>
              </div>
              <div
                className="w-px"
                style={{ background: 'oklch(0.72 0.10 75 / 0.3)' }}
              />
              <div className="text-center">
                <span
                  className="block font-headline font-black text-4xl"
                  style={{ color: 'oklch(0.72 0.10 75)' }}
                >
                  {programs.reduce((sum, p) => sum + (p.material_count || 0), 0)}
                </span>
                <span
                  className="text-xs uppercase tracking-wider"
                  style={{ color: 'oklch(0.65 0.02 75)' }}
                >
                  {t('stats.materials')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Gradient Fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32"
          style={{
            background: 'linear-gradient(to top, oklch(0.985 0.003 75), transparent)',
          }}
        />
      </section>

      {/* Main Content */}
      <section
        className="py-20 relative"
        style={{ background: 'oklch(0.985 0.003 75)' }}
      >
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="mb-12">
            <div
              className="h-0.5 w-12 mb-6"
              style={{ background: 'linear-gradient(90deg, oklch(0.72 0.10 75), oklch(0.45 0.12 265))' }}
            />
            <span
              className="text-xs font-medium tracking-[0.2em] uppercase mb-4 block"
              style={{ color: 'oklch(0.72 0.10 75)' }}
            >
              {t('programs.label')}
            </span>
            <h2
              className={`${fontClass} font-headline font-black`}
              style={{
                fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                letterSpacing: '-0.02em',
                color: 'oklch(0.22 0.07 265)',
              }}
            >
              {t('programs.title')}
            </h2>
          </div>

          {/* Category Filter */}
          {categories.length > 1 && (
            <div className="flex flex-wrap gap-3 mb-10">
              <button
                onClick={() => setSelectedCategory('all')}
                className="px-4 py-2 rounded-sm text-sm font-medium transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  background: selectedCategory === 'all' ? 'oklch(0.45 0.12 265)' : 'oklch(0.95 0.005 75)',
                  color: selectedCategory === 'all' ? 'oklch(0.98 0.003 75)' : 'oklch(0.45 0.05 265)',
                  border: `1px solid ${selectedCategory === 'all' ? 'oklch(0.45 0.12 265)' : 'oklch(0.90 0.01 265)'}`,
                }}
              >
                {t('filter.all')}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className="px-4 py-2 rounded-sm text-sm font-medium transition-all duration-200 hover:-translate-y-0.5"
                  style={{
                    background: selectedCategory === cat ? CATEGORY_COLORS[cat as ProgramCategory] : 'oklch(0.95 0.005 75)',
                    color: selectedCategory === cat ? 'oklch(0.98 0.003 75)' : 'oklch(0.45 0.05 265)',
                    border: `1px solid ${selectedCategory === cat ? CATEGORY_COLORS[cat as ProgramCategory] : 'oklch(0.90 0.01 265)'}`,
                  }}
                >
                  {CATEGORY_LABELS[cat as ProgramCategory]}
                </button>
              ))}
            </div>
          )}

          {/* Programs Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div
                className="w-12 h-12 rounded-sm animate-pulse"
                style={{ background: 'oklch(0.45 0.12 265)' }}
              />
            </div>
          ) : filteredPrograms.length === 0 ? (
            <div className="text-center py-20">
              <div
                className="w-20 h-20 rounded-sm mx-auto mb-6 flex items-center justify-center"
                style={{ background: 'oklch(0.45 0.12 265 / 0.1)' }}
              >
                <BookOpen className="w-10 h-10" style={{ color: 'oklch(0.45 0.12 265)' }} />
              </div>
              <p
                className={`${fontClass} text-lg`}
                style={{ color: 'oklch(0.50 0.01 75)' }}
              >
                {t('programs.empty')}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPrograms.map((program, index) => (
                <Link
                  key={program.id}
                  href={`/training/${program.id}`}
                  className={`group block rounded-sm overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl stagger-${(index % 6) + 1}`}
                  style={{
                    background: 'oklch(0.98 0.003 75)',
                    border: '1px solid oklch(0.92 0.005 75)',
                  }}
                >
                  {/* Cover */}
                  <div className="aspect-[16/10] relative overflow-hidden">
                    {program.cover_image_url ? (
                      <img
                        src={program.cover_image_url}
                        alt={program.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{
                          background: `linear-gradient(135deg, ${CATEGORY_COLORS[program.category as ProgramCategory] || CATEGORY_COLORS.general}, oklch(0.30 0.08 265))`,
                        }}
                      >
                        <GraduationCap
                          className="w-20 h-20 transition-transform duration-500 group-hover:scale-110"
                          style={{ color: 'oklch(0.98 0.003 75 / 0.3)' }}
                        />
                      </div>
                    )}

                    {/* Category Badge */}
                    <div
                      className="absolute top-4 left-4 px-3 py-1.5 rounded-sm text-xs font-bold tracking-wider uppercase"
                      style={{
                        background: CATEGORY_COLORS[program.category as ProgramCategory] || CATEGORY_COLORS.general,
                        color: 'oklch(0.98 0.003 75)',
                      }}
                    >
                      {CATEGORY_LABELS[program.category as ProgramCategory]}
                    </div>

                    {/* Hover Overlay */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                      style={{ background: 'oklch(0.15 0.05 265 / 0.5)' }}
                    >
                      <span
                        className="px-5 py-2.5 rounded-sm font-medium text-sm flex items-center gap-2"
                        style={{
                          background: 'oklch(0.72 0.10 75)',
                          color: 'oklch(0.15 0.05 265)',
                        }}
                      >
                        {t('programs.view')}
                        <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3
                      className={`${fontClass} font-headline font-bold text-xl mb-3 line-clamp-2 group-hover:text-[oklch(0.45_0.12_265)] transition-colors`}
                      style={{ color: 'oklch(0.22 0.07 265)' }}
                    >
                      {program.title}
                    </h3>

                    {program.description && (
                      <p
                        className={`${fontClass} text-sm line-clamp-2 mb-4 leading-relaxed`}
                        style={{ color: 'oklch(0.50 0.01 75)' }}
                      >
                        {program.description}
                      </p>
                    )}

                    {/* Meta Info */}
                    <div className="flex items-center gap-4 pt-4" style={{ borderTop: '1px solid oklch(0.92 0.005 75)' }}>
                      <span
                        className="flex items-center gap-1.5 text-xs font-medium"
                        style={{ color: 'oklch(0.55 0.01 75)' }}
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        {program.total_weeks}{t('programs.weeks')}
                      </span>
                      <span
                        className="flex items-center gap-1.5 text-xs font-medium"
                        style={{ color: 'oklch(0.55 0.01 75)' }}
                      >
                        <FileText className="w-3.5 h-3.5" />
                        {program.material_count || 0}{t('programs.materials')}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-16"
        style={{
          background: 'linear-gradient(135deg, oklch(0.45 0.12 265) 0%, oklch(0.35 0.10 265) 100%)',
        }}
      >
        <div className="container mx-auto px-4 text-center">
          <div
            className="h-0.5 w-12 mx-auto mb-6"
            style={{ background: 'oklch(0.72 0.10 75)' }}
          />
          <h3
            className={`${fontClass} font-headline font-bold text-2xl md:text-3xl mb-4`}
            style={{ color: 'oklch(0.98 0.003 75)' }}
          >
            {t('cta.title')}
          </h3>
          <p
            className={`${fontClass} mb-8 max-w-xl mx-auto`}
            style={{ color: 'oklch(0.80 0.02 75)' }}
          >
            {t('cta.description')}
          </p>
          <Link
            href="/missions/new-family"
            className="inline-flex items-center px-8 py-3 rounded-sm font-medium transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            style={{
              background: 'oklch(0.72 0.10 75)',
              color: 'oklch(0.15 0.05 265)',
            }}
          >
            {t('cta.button')}
            <ChevronRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'ko', ['common', 'training'])),
  },
})

export default TrainingPage
