// ===========================================
// VS Design Diverge: Training Program Detail
// Editorial Minimalism + 한국적 미학
// OKLCH Color System
// ===========================================

import { useEffect, useState } from 'react'
import { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Link from 'next/link'
import Layout from '@/components/Layout'
import {
  ArrowLeft,
  Download,
  Play,
  Headphones,
  FileText,
  Calendar,
  Clock,
  Eye,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import {
  getProgramWithMaterials,
  getMaterialsByWeek,
  incrementViewCount,
  CATEGORY_LABELS,
  MATERIAL_TYPE_LABELS,
  MATERIAL_TYPE_ICONS,
  type ProgramCategory,
  type MaterialType,
} from '../../utils/trainingService'
import type { TrainingProgram, TrainingMaterial } from '../../../types/supabase'

const CATEGORY_COLORS: Record<ProgramCategory, string> = {
  discipleship: 'oklch(0.45 0.12 265)',
  bible_study: 'oklch(0.55 0.15 145)',
  leadership: 'oklch(0.60 0.18 25)',
  baptism: 'oklch(0.55 0.18 200)',
  general: 'oklch(0.72 0.10 75)',
}

const MATERIAL_TYPE_COLORS: Record<MaterialType, string> = {
  pdf: 'oklch(0.55 0.18 25)',
  video: 'oklch(0.50 0.18 265)',
  audio: 'oklch(0.55 0.15 145)',
}

interface Props {
  program: TrainingProgram | null
  materials: TrainingMaterial[]
  materialsByWeek: Record<number, TrainingMaterial[]>
}

const TrainingDetailPage: NextPage<Props> = ({ program, materials, materialsByWeek }) => {
  const { t, i18n } = useTranslation('training')
  const router = useRouter()
  const [expandedWeeks, setExpandedWeeks] = useState<number[]>([1])
  const [selectedType, setSelectedType] = useState<string>('all')

  const fontClass = i18n.language === 'ko' ? 'font-korean' : 'font-english'

  if (!program) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <p style={{ color: 'oklch(0.50 0.01 75)' }}>
            {t('detail.notFound')}
          </p>
        </div>
      </Layout>
    )
  }

  const toggleWeek = (week: number) => {
    setExpandedWeeks(prev =>
      prev.includes(week)
        ? prev.filter(w => w !== week)
        : [...prev, week]
    )
  }

  const handleMaterialClick = async (material: TrainingMaterial) => {
    await incrementViewCount(material.id)

    if (material.material_type === 'video' && material.video_url) {
      window.open(material.video_url, '_blank')
    } else if (material.file_url) {
      window.open(material.file_url, '_blank')
    }
  }

  const filteredMaterialsByWeek = Object.entries(materialsByWeek).reduce((acc, [week, mats]) => {
    const filtered = selectedType === 'all'
      ? mats
      : mats.filter(m => m.material_type === selectedType)
    if (filtered.length > 0) {
      acc[parseInt(week)] = filtered
    }
    return acc
  }, {} as Record<number, TrainingMaterial[]>)

  const materialTypes = Array.from(new Set(materials.map(m => m.material_type)))

  return (
    <Layout>
      {/* Hero Section */}
      <section
        className="relative min-h-[50vh] flex items-end"
        style={{
          background: program.cover_image_url
            ? undefined
            : `linear-gradient(135deg, ${CATEGORY_COLORS[program.category as ProgramCategory] || CATEGORY_COLORS.general}, oklch(0.25 0.08 265))`,
        }}
      >
        {program.cover_image_url && (
          <>
            <img
              src={program.cover_image_url}
              alt={program.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to top, oklch(0.15 0.05 265 / 0.95), oklch(0.15 0.05 265 / 0.3))',
              }}
            />
          </>
        )}

        {/* Grain Texture */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="container mx-auto px-4 py-16 relative z-10">
          {/* Back Link */}
          <Link
            href="/training"
            className="inline-flex items-center text-sm font-medium mb-8 transition-colors hover:opacity-80"
            style={{ color: 'oklch(0.72 0.10 75)' }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('detail.backToList')}
          </Link>

          {/* Category Badge */}
          <div
            className="inline-block px-3 py-1.5 rounded-sm text-xs font-bold tracking-wider uppercase mb-4"
            style={{
              background: CATEGORY_COLORS[program.category as ProgramCategory] || CATEGORY_COLORS.general,
              color: 'oklch(0.98 0.003 75)',
            }}
          >
            {CATEGORY_LABELS[program.category as ProgramCategory]}
          </div>

          {/* Title */}
          <h1
            className={`${fontClass} font-headline font-black mb-4`}
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              letterSpacing: '-0.03em',
              lineHeight: '1.1',
              color: 'oklch(0.98 0.003 75)',
            }}
          >
            {program.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-6 mb-6">
            <span
              className="flex items-center gap-2 text-sm"
              style={{ color: 'oklch(0.75 0.02 75)' }}
            >
              <Calendar className="w-4 h-4" />
              {program.total_weeks}{t('detail.weekCourse')}
            </span>
            <span
              className="flex items-center gap-2 text-sm"
              style={{ color: 'oklch(0.75 0.02 75)' }}
            >
              <FileText className="w-4 h-4" />
              {materials.length}{t('detail.materials')}
            </span>
          </div>

          {/* Description */}
          {program.description && (
            <p
              className={`${fontClass} text-lg max-w-3xl leading-relaxed`}
              style={{ color: 'oklch(0.80 0.02 75)' }}
            >
              {program.description}
            </p>
          )}
        </div>
      </section>

      {/* Materials Section */}
      <section
        className="py-16"
        style={{ background: 'oklch(0.985 0.003 75)' }}
      >
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10">
            <div>
              <div
                className="h-0.5 w-12 mb-6"
                style={{ background: 'linear-gradient(90deg, oklch(0.72 0.10 75), oklch(0.45 0.12 265))' }}
              />
              <span
                className="text-xs font-medium tracking-[0.2em] uppercase mb-4 block"
                style={{ color: 'oklch(0.72 0.10 75)' }}
              >
                {t('detail.curriculum')}
              </span>
              <h2
                className={`${fontClass} font-headline font-black`}
                style={{
                  fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                  letterSpacing: '-0.02em',
                  color: 'oklch(0.22 0.07 265)',
                }}
              >
                {t('detail.weeklyMaterials')}
              </h2>
            </div>

            {/* Type Filter */}
            {materialTypes.length > 1 && (
              <div className="flex gap-2 mt-6 md:mt-0">
                <button
                  onClick={() => setSelectedType('all')}
                  className="px-4 py-2 rounded-sm text-sm font-medium transition-all"
                  style={{
                    background: selectedType === 'all' ? 'oklch(0.45 0.12 265)' : 'oklch(0.95 0.005 75)',
                    color: selectedType === 'all' ? 'white' : 'oklch(0.45 0.05 265)',
                  }}
                >
                  {t('filter.all')}
                </button>
                {materialTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className="px-4 py-2 rounded-sm text-sm font-medium transition-all"
                    style={{
                      background: selectedType === type ? MATERIAL_TYPE_COLORS[type as MaterialType] : 'oklch(0.95 0.005 75)',
                      color: selectedType === type ? 'white' : 'oklch(0.45 0.05 265)',
                    }}
                  >
                    {MATERIAL_TYPE_ICONS[type as MaterialType]} {MATERIAL_TYPE_LABELS[type as MaterialType]}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Week Accordions */}
          {Object.keys(filteredMaterialsByWeek).length === 0 ? (
            <div className="text-center py-16">
              <p style={{ color: 'oklch(0.50 0.01 75)' }}>
                {t('detail.noMaterials')}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {Array.from({ length: program.total_weeks }, (_, i) => i + 1).map((week) => {
                const weekMaterials = filteredMaterialsByWeek[week]
                if (!weekMaterials || weekMaterials.length === 0) return null

                const isExpanded = expandedWeeks.includes(week)

                return (
                  <div
                    key={week}
                    className="rounded-sm overflow-hidden transition-all duration-300"
                    style={{
                      background: 'oklch(0.98 0.003 75)',
                      border: '1px solid oklch(0.92 0.005 75)',
                    }}
                  >
                    {/* Week Header */}
                    <button
                      onClick={() => toggleWeek(week)}
                      className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-[oklch(0.97_0.005_75)]"
                    >
                      <div className="flex items-center gap-4">
                        <span
                          className="w-12 h-12 rounded-sm flex items-center justify-center font-headline font-black text-lg"
                          style={{
                            background: 'oklch(0.45 0.12 265)',
                            color: 'white',
                          }}
                        >
                          {week}
                        </span>
                        <div>
                          <h3
                            className={`${fontClass} font-bold text-lg`}
                            style={{ color: 'oklch(0.22 0.07 265)' }}
                          >
                            {week}{t('detail.week')}
                          </h3>
                          <p className="text-sm" style={{ color: 'oklch(0.55 0.01 75)' }}>
                            {weekMaterials.length}{t('detail.materialCount')}
                          </p>
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5" style={{ color: 'oklch(0.45 0.12 265)' }} />
                      ) : (
                        <ChevronDown className="w-5 h-5" style={{ color: 'oklch(0.55 0.01 75)' }} />
                      )}
                    </button>

                    {/* Week Content */}
                    {isExpanded && (
                      <div
                        className="px-5 pb-5"
                        style={{ borderTop: '1px solid oklch(0.92 0.005 75)' }}
                      >
                        <div className="pt-4 space-y-3">
                          {weekMaterials.map((material) => (
                            <button
                              key={material.id}
                              onClick={() => handleMaterialClick(material)}
                              className="w-full flex items-center gap-4 p-4 rounded-sm text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md group"
                              style={{
                                background: 'oklch(0.97 0.005 265)',
                                border: '1px solid oklch(0.90 0.01 265)',
                              }}
                            >
                              {/* Icon */}
                              <div
                                className="w-12 h-12 rounded-sm flex items-center justify-center text-2xl shrink-0"
                                style={{
                                  background: `${MATERIAL_TYPE_COLORS[material.material_type as MaterialType]}20`,
                                }}
                              >
                                {material.material_type === 'pdf' && <FileText className="w-6 h-6" style={{ color: MATERIAL_TYPE_COLORS.pdf }} />}
                                {material.material_type === 'video' && <Play className="w-6 h-6" style={{ color: MATERIAL_TYPE_COLORS.video }} />}
                                {material.material_type === 'audio' && <Headphones className="w-6 h-6" style={{ color: MATERIAL_TYPE_COLORS.audio }} />}
                              </div>

                              {/* Info */}
                              <div className="flex-1 min-w-0">
                                <h4
                                  className={`${fontClass} font-medium text-base mb-1 group-hover:text-[oklch(0.45_0.12_265)] transition-colors`}
                                  style={{ color: 'oklch(0.25 0.05 265)' }}
                                >
                                  {material.title}
                                </h4>
                                <div className="flex items-center gap-3 text-xs" style={{ color: 'oklch(0.55 0.01 75)' }}>
                                  <span
                                    className="px-2 py-0.5 rounded-sm"
                                    style={{
                                      background: MATERIAL_TYPE_COLORS[material.material_type as MaterialType],
                                      color: 'white',
                                    }}
                                  >
                                    {MATERIAL_TYPE_LABELS[material.material_type as MaterialType]}
                                  </span>
                                  {material.duration_minutes && (
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      {material.duration_minutes}{t('detail.minutes')}
                                    </span>
                                  )}
                                  {material.view_count > 0 && (
                                    <span className="flex items-center gap-1">
                                      <Eye className="w-3 h-3" />
                                      {material.view_count}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Action */}
                              <div
                                className="shrink-0 w-10 h-10 rounded-sm flex items-center justify-center transition-all group-hover:scale-110"
                                style={{
                                  background: 'oklch(0.72 0.10 75)',
                                  color: 'oklch(0.15 0.05 265)',
                                }}
                              >
                                {material.material_type === 'pdf' ? (
                                  <Download className="w-5 h-5" />
                                ) : (
                                  <ExternalLink className="w-5 h-5" />
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ params, locale }) => {
  const id = params?.id as string

  try {
    const { program, materials } = await getProgramWithMaterials(id)
    const materialsByWeek = await getMaterialsByWeek(id)

    return {
      props: {
        ...(await serverSideTranslations(locale ?? 'ko', ['common', 'training'])),
        program,
        materials,
        materialsByWeek,
      },
    }
  } catch (error) {
    return {
      props: {
        ...(await serverSideTranslations(locale ?? 'ko', ['common', 'training'])),
        program: null,
        materials: [],
        materialsByWeek: {},
      },
    }
  }
}

export default TrainingDetailPage
