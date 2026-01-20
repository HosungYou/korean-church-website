import React, { useState, useEffect, useMemo } from 'react'
import { GetStaticProps, NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import Layout from '@/components/Layout'
import { Book, FileText, Video, Download, Eye, ChevronRight } from 'lucide-react'
import {
  getMaterials,
  getMaterialCountByCategory,
  type BibleMaterial,
  type BibleMaterialCategory,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
} from '@/utils/bibleMaterialsService'

// ===========================================
// VS Design Diverge: Bible Materials List Page
// Editorial Grid Layout + OKLCH Color System
// ===========================================

interface BibleMaterialsPageProps {
  initialMaterials: BibleMaterial[]
  categoryCounts: Record<BibleMaterialCategory, number>
}

const BibleMaterialsPage: NextPage<BibleMaterialsPageProps> = ({
  initialMaterials,
  categoryCounts,
}) => {
  const { t } = useTranslation('common')
  const [materials, setMaterials] = useState<BibleMaterial[]>(initialMaterials)
  const [selectedCategory, setSelectedCategory] = useState<BibleMaterialCategory | 'all'>('all')
  const [loading, setLoading] = useState(false)

  // Filter materials by category
  const filteredMaterials = useMemo(() => {
    if (selectedCategory === 'all') {
      return materials
    }
    return materials.filter((m) => m.category === selectedCategory)
  }, [materials, selectedCategory])

  // Load materials when category changes (client-side)
  useEffect(() => {
    async function loadMaterials() {
      setLoading(true)
      try {
        const data = await getMaterials(
          selectedCategory === 'all' ? {} : { category: selectedCategory }
        )
        setMaterials(data)
      } catch (error) {
        console.error('Error loading materials:', error)
      } finally {
        setLoading(false)
      }
    }

    // Only reload if we have initial data (meaning we're client-side navigating)
    if (initialMaterials.length > 0 || selectedCategory !== 'all') {
      loadMaterials()
    }
  }, [selectedCategory])

  const totalCount = categoryCounts.old_testament + categoryCounts.new_testament

  return (
    <Layout>
      <div
        className="min-h-screen relative"
        style={{ background: 'oklch(0.985 0.003 75)' }}
      >
        {/* Grain overlay */}
        <div className="bg-grain absolute inset-0 pointer-events-none" />

        {/* Header */}
        <div
          className="relative py-16"
          style={{
            background: 'linear-gradient(135deg, oklch(0.22 0.07 265) 0%, oklch(0.30 0.09 265) 100%)',
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-sm flex items-center justify-center"
                style={{ background: 'oklch(0.72 0.10 75 / 0.2)' }}
              >
                <Book className="w-6 h-6" style={{ color: 'oklch(0.85 0.08 75)' }} />
              </div>
              <div>
                <h1
                  className="font-headline font-black text-3xl md:text-4xl"
                  style={{ color: 'oklch(0.98 0.003 75)', letterSpacing: '-0.02em' }}
                >
                  {t('bible_materials.title')}
                </h1>
                <p className="text-sm mt-1" style={{ color: 'oklch(0.85 0.02 75)' }}>
                  {t('bible_materials.description')}
                </p>
              </div>
            </div>

            {/* Category Filter */}
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-sm text-sm font-medium transition-all duration-200 ${
                  selectedCategory === 'all' ? 'scale-105' : ''
                }`}
                style={{
                  background: selectedCategory === 'all'
                    ? 'oklch(0.72 0.10 75)'
                    : 'oklch(0.98 0.003 75 / 0.15)',
                  color: selectedCategory === 'all'
                    ? 'oklch(0.15 0.05 75)'
                    : 'oklch(0.98 0.003 75)',
                  border: `1px solid ${
                    selectedCategory === 'all'
                      ? 'oklch(0.72 0.10 75)'
                      : 'oklch(0.98 0.003 75 / 0.3)'
                  }`,
                }}
              >
                {t('bible_materials.all')} ({totalCount})
              </button>
              {(['old_testament', 'new_testament'] as BibleMaterialCategory[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-sm text-sm font-medium transition-all duration-200 ${
                    selectedCategory === cat ? 'scale-105' : ''
                  }`}
                  style={{
                    background: selectedCategory === cat
                      ? CATEGORY_COLORS[cat]
                      : 'oklch(0.98 0.003 75 / 0.15)',
                    color: selectedCategory === cat
                      ? 'oklch(0.98 0.003 75)'
                      : 'oklch(0.98 0.003 75)',
                    border: `1px solid ${
                      selectedCategory === cat
                        ? CATEGORY_COLORS[cat]
                        : 'oklch(0.98 0.003 75 / 0.3)'
                    }`,
                  }}
                >
                  {CATEGORY_LABELS[cat]} ({categoryCounts[cat]})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
          {loading ? (
            <div className="flex justify-center py-20">
              <div
                className="w-10 h-10 border-2 rounded-full animate-spin"
                style={{ borderColor: 'oklch(0.45 0.12 265)', borderTopColor: 'transparent' }}
              />
            </div>
          ) : filteredMaterials.length === 0 ? (
            <div
              className="p-12 rounded-sm flex flex-col items-center justify-center text-center"
              style={{
                background: 'oklch(0.985 0.003 75)',
                border: '1px solid oklch(0.92 0.005 75)',
              }}
            >
              <div
                className="w-16 h-16 rounded-sm flex items-center justify-center mb-4"
                style={{ background: 'oklch(0.45 0.12 265 / 0.1)' }}
              >
                <Book className="w-8 h-8" style={{ color: 'oklch(0.45 0.12 265)' }} />
              </div>
              <h3
                className="font-headline font-bold text-lg mb-2"
                style={{ color: 'oklch(0.30 0.09 265)' }}
              >
                {t('bible_materials.no_materials')}
              </h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMaterials.map((material, index) => (
                <Link
                  key={material.id}
                  href={`/bible-materials/${material.id}`}
                  className={`group block rounded-sm overflow-hidden transition-all duration-300 hover:translate-y-[-4px] stagger-${(index % 6) + 1}`}
                  style={{
                    background: 'oklch(0.985 0.003 75)',
                    border: '1px solid oklch(0.92 0.005 75)',
                    boxShadow: '0 2px 8px oklch(0.30 0.09 265 / 0.06)',
                  }}
                >
                  {/* Category Badge */}
                  <div
                    className="h-1.5"
                    style={{ background: CATEGORY_COLORS[material.category] }}
                  />

                  <div className="p-6">
                    {/* Category & Book */}
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className="text-xs font-medium px-2 py-0.5 rounded-sm"
                        style={{
                          background: `${CATEGORY_COLORS[material.category]}20`,
                          color: CATEGORY_COLORS[material.category],
                        }}
                      >
                        {CATEGORY_LABELS[material.category]}
                      </span>
                      {material.book_name && (
                        <span
                          className="text-xs"
                          style={{ color: 'oklch(0.55 0.01 75)' }}
                        >
                          {material.book_name}
                          {material.chapter_range && ` ${material.chapter_range}`}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h2
                      className="font-headline font-bold text-lg mb-2 line-clamp-2 group-hover:underline underline-offset-4"
                      style={{ color: 'oklch(0.22 0.07 265)' }}
                    >
                      {material.title}
                    </h2>

                    {/* Description */}
                    {material.description && (
                      <p
                        className="text-sm line-clamp-2 mb-4"
                        style={{ color: 'oklch(0.55 0.01 75)' }}
                      >
                        {material.description}
                      </p>
                    )}

                    {/* Meta */}
                    <div
                      className="flex items-center justify-between pt-4"
                      style={{ borderTop: '1px solid oklch(0.92 0.005 75)' }}
                    >
                      <div className="flex items-center gap-3">
                        {material.file_url && (
                          <span
                            className="flex items-center gap-1 text-xs"
                            style={{ color: 'oklch(0.55 0.01 75)' }}
                          >
                            <FileText className="w-3.5 h-3.5" />
                            PDF
                          </span>
                        )}
                        {material.video_url && (
                          <span
                            className="flex items-center gap-1 text-xs"
                            style={{ color: 'oklch(0.55 0.01 75)' }}
                          >
                            <Video className="w-3.5 h-3.5" />
                            영상
                          </span>
                        )}
                        <span
                          className="flex items-center gap-1 text-xs"
                          style={{ color: 'oklch(0.55 0.01 75)' }}
                        >
                          <Eye className="w-3.5 h-3.5" />
                          {material.view_count}
                        </span>
                      </div>
                      <ChevronRight
                        className="w-4 h-4 transition-transform group-hover:translate-x-1"
                        style={{ color: 'oklch(0.45 0.12 265)' }}
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  let initialMaterials: BibleMaterial[] = []
  let categoryCounts: Record<BibleMaterialCategory, number> = {
    old_testament: 0,
    new_testament: 0,
  }

  try {
    initialMaterials = await getMaterials({ limit: 50 })
    categoryCounts = await getMaterialCountByCategory()
  } catch (error) {
    console.error('Error loading initial materials:', error)
  }

  return {
    props: {
      ...(await serverSideTranslations(locale || 'ko', ['common'])),
      initialMaterials,
      categoryCounts,
    },
    revalidate: 3600, // 1시간마다 재생성
  }
}

export default BibleMaterialsPage
