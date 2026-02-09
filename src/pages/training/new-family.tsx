// ===========================================
// VS Design Diverge: New Family Education Page
// Editorial Minimalism + 한국적 미학
// OKLCH Color System
// ===========================================

import { useEffect, useState } from 'react'
import { GetStaticProps, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Link from 'next/link'
import Layout from '@/components/Layout'
import PageHeader from '@/components/PageHeader'
import {
  BookOpen,
  ChevronRight,
  Calendar,
  FileText,
  GraduationCap,
  Users,
} from 'lucide-react'
import { getPrograms, CATEGORY_LABELS, type ProgramCategory } from '../../utils/trainingService'
import type { TrainingProgram } from '../../../types/supabase'

const CATEGORY_COLOR = 'oklch(0.55 0.15 340)' // new_family color

const NewFamilyEducationPage: NextPage = () => {
  const { t, i18n } = useTranslation('training')
  const [programs, setPrograms] = useState<TrainingProgram[]>([])
  const [loading, setLoading] = useState(true)

  const fontClass = i18n.language === 'ko' ? 'font-korean' : 'font-english'

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const data = await getPrograms()
        // Filter for new_family category only
        const newFamilyPrograms = data.filter(p => p.category === 'new_family')
        setPrograms(newFamilyPrograms)
      } catch (error) {
        console.error('프로그램 조회 오류:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchPrograms()
  }, [])

  return (
    <Layout>
      {/* Page Header - Photo Composite Style */}
      <PageHeader
        label={t('new_family.label') as string}
        title={t('new_family.title') as string}
        subtitle={t('new_family.subtitle') as string}
      />

      {/* Main Content */}
      <section
        className="py-20 relative"
        style={{ background: 'oklch(0.985 0.003 75)' }}
      >
        {/* Grain Texture */}
        <div
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="container mx-auto px-4 relative z-10">
          {/* Stats Bar */}
          <div
            className="mb-12 p-6 rounded-sm flex items-center justify-between"
            style={{
              background: 'oklch(0.98 0.003 75)',
              border: '1px solid oklch(0.92 0.005 75)',
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-sm flex items-center justify-center"
                style={{ background: `${CATEGORY_COLOR}15` }}
              >
                <Users className="w-6 h-6" style={{ color: CATEGORY_COLOR }} />
              </div>
              <div>
                <span
                  className="block text-sm font-medium"
                  style={{ color: 'oklch(0.55 0.01 75)' }}
                >
                  {t('stats.programs')}
                </span>
                <span
                  className="font-headline font-bold text-2xl"
                  style={{ color: 'oklch(0.22 0.07 265)' }}
                >
                  {programs.length}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-sm flex items-center justify-center"
                style={{ background: 'oklch(0.45 0.12 265 / 0.1)' }}
              >
                <FileText className="w-6 h-6" style={{ color: 'oklch(0.45 0.12 265)' }} />
              </div>
              <div>
                <span
                  className="block text-sm font-medium"
                  style={{ color: 'oklch(0.55 0.01 75)' }}
                >
                  {t('stats.materials')}
                </span>
                <span
                  className="font-headline font-bold text-2xl"
                  style={{ color: 'oklch(0.22 0.07 265)' }}
                >
                  {programs.reduce((sum, p) => sum + (p.material_count || 0), 0)}
                </span>
              </div>
            </div>
          </div>

          {/* Programs Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div
                className="w-12 h-12 rounded-sm animate-pulse"
                style={{ background: CATEGORY_COLOR }}
              />
            </div>
          ) : programs.length === 0 ? (
            <div className="text-center py-20">
              <div
                className="w-20 h-20 rounded-sm mx-auto mb-6 flex items-center justify-center"
                style={{ background: `${CATEGORY_COLOR}15` }}
              >
                <BookOpen className="w-10 h-10" style={{ color: CATEGORY_COLOR }} />
              </div>
              <p
                className={`${fontClass} text-lg`}
                style={{ color: 'oklch(0.50 0.01 75)' }}
              >
                {t('new_family.empty')}
              </p>
              <Link
                href="/about/new-family-registration"
                className="inline-flex items-center mt-6 px-6 py-3 rounded-sm font-medium transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: CATEGORY_COLOR,
                  color: 'oklch(0.98 0.003 75)',
                }}
              >
                새가족 등록하기
                <ChevronRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {programs.map((program, index) => (
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
                          background: `linear-gradient(135deg, ${CATEGORY_COLOR}, oklch(0.40 0.12 340))`,
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
                        background: CATEGORY_COLOR,
                        color: 'oklch(0.98 0.003 75)',
                      }}
                    >
                      {CATEGORY_LABELS.new_family}
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

          {/* Back to Training Link */}
          <div className="mt-12 text-center">
            <Link
              href="/training"
              className="inline-flex items-center text-sm font-medium transition-all duration-300 hover:-translate-x-1"
              style={{ color: 'oklch(0.45 0.12 265)' }}
            >
              <ChevronRight className="w-4 h-4 mr-1 rotate-180" />
              전체 훈련 프로그램 보기
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-16"
        style={{
          background: `linear-gradient(135deg, ${CATEGORY_COLOR} 0%, oklch(0.45 0.12 340) 100%)`,
        }}
      >
        <div className="container mx-auto px-4 text-center">
          <div
            className="h-0.5 w-12 mx-auto mb-6"
            style={{ background: 'oklch(0.98 0.003 75)' }}
          />
          <h3
            className={`${fontClass} font-headline font-bold text-2xl md:text-3xl mb-4`}
            style={{ color: 'oklch(0.98 0.003 75)' }}
          >
            {t('cta.title')}
          </h3>
          <p
            className={`${fontClass} mb-8 max-w-xl mx-auto`}
            style={{ color: 'oklch(0.90 0.02 75)' }}
          >
            {t('cta.description')}
          </p>
          <Link
            href="/about/new-family-registration"
            className="inline-flex items-center px-8 py-3 rounded-sm font-medium transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            style={{
              background: 'oklch(0.98 0.003 75)',
              color: CATEGORY_COLOR,
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

export default NewFamilyEducationPage
