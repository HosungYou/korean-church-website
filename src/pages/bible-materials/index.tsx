import React, { useState, useEffect, useMemo } from 'react'
import { GetStaticProps, NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import Layout from '@/components/Layout'
import PageHeader from '@/components/PageHeader'
import { Book, FileText, Video, Eye, ChevronRight } from 'lucide-react'
import {
  getMaterials,
  getMaterialCountByCategory,
  type BibleMaterial,
  type BibleMaterialCategory,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  OLD_TESTAMENT_BOOKS,
  NEW_TESTAMENT_BOOKS,
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
  categoryCounts: initialCategoryCounts,
}) => {
  const { t } = useTranslation('common')
  const [materials, setMaterials] = useState<BibleMaterial[]>(initialMaterials)
  const [categoryCounts, setCategoryCounts] = useState(initialCategoryCounts)
  const [selectedCategory, setSelectedCategory] = useState<BibleMaterialCategory | 'all'>('all')
  const [selectedBook, setSelectedBook] = useState<string>('')
  const [loading, setLoading] = useState(false)

  // Load category counts on mount (클라이언트에서 동적으로 카운트 업데이트)
  useEffect(() => {
    async function loadCounts() {
      try {
        const counts = await getMaterialCountByCategory()
        setCategoryCounts(counts)
      } catch (error) {
        console.error('Error loading category counts:', error)
      }
    }
    loadCounts()
  }, [])

  // Filter materials by category and book
  const filteredMaterials = useMemo(() => {
    let result = materials
    if (selectedCategory !== 'all') {
      result = result.filter((m) => m.category === selectedCategory)
    }
    if (selectedBook) {
      result = result.filter((m) => m.book_name === selectedBook)
    }
    return result
  }, [materials, selectedCategory, selectedBook])

  // Load materials when filter changes (client-side)
  useEffect(() => {
    async function loadMaterials() {
      setLoading(true)
      try {
        const filters: { category?: BibleMaterialCategory; bookName?: string } = {}
        if (selectedCategory !== 'all') {
          filters.category = selectedCategory
        }
        if (selectedBook) {
          filters.bookName = selectedBook
        }
        const data = await getMaterials(filters)
        setMaterials(data)
      } catch (error) {
        console.error('Error loading materials:', error)
      } finally {
        setLoading(false)
      }
    }

    // Only reload if we have initial data (meaning we're client-side navigating)
    if (initialMaterials.length > 0 || selectedCategory !== 'all' || selectedBook) {
      loadMaterials()
    }
  }, [selectedCategory, selectedBook])

  // Reset book selection when category changes
  const handleCategoryChange = (category: BibleMaterialCategory | 'all') => {
    setSelectedCategory(category)
    setSelectedBook('')
  }

  // Handle book selection from dropdown
  const handleBookChange = (bookName: string) => {
    setSelectedBook(bookName)
    // Auto-detect category from book name
    if (bookName) {
      const oldBook = OLD_TESTAMENT_BOOKS.find(b => b.name === bookName)
      if (oldBook) {
        setSelectedCategory('old_testament')
      } else {
        setSelectedCategory('new_testament')
      }
    }
  }

  const totalCount = categoryCounts.old_testament + categoryCounts.new_testament

  return (
    <Layout>
      {/* Page Header - Editorial Style with Image Background */}
      <PageHeader
        label={t('bible_materials.label') || '성경통독'}
        title={t('bible_materials.title') || '성경통독 자료'}
        subtitle={t('bible_materials.description') || '성경 통독을 위한 자료와 해설을 제공합니다.'}
      />

      <div
        className="min-h-screen relative"
        style={{ background: 'oklch(0.985 0.003 75)' }}
      >
        {/* Grain overlay */}
        <div className="bg-grain absolute inset-0 pointer-events-none" />

        {/* Filter Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-4 relative">
          {/* Category Filter */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <button
              onClick={() => handleCategoryChange('all')}
              className={`px-4 py-2.5 rounded-sm text-sm font-medium transition-all duration-200 ${
                selectedCategory === 'all' && !selectedBook ? 'scale-[1.02]' : ''
              }`}
              style={{
                background: selectedCategory === 'all' && !selectedBook
                  ? 'oklch(0.45 0.12 265)'
                  : 'oklch(0.97 0.005 75)',
                color: selectedCategory === 'all' && !selectedBook
                  ? 'oklch(0.98 0.003 75)'
                  : 'oklch(0.35 0.02 265)',
                border: `1px solid ${
                  selectedCategory === 'all' && !selectedBook
                    ? 'oklch(0.45 0.12 265)'
                    : 'oklch(0.88 0.005 75)'
                }`,
              }}
            >
              {t('bible_materials.all')} ({totalCount})
            </button>
            {(['old_testament', 'new_testament'] as BibleMaterialCategory[]).map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-2.5 rounded-sm text-sm font-medium transition-all duration-200 ${
                  selectedCategory === cat && !selectedBook ? 'scale-[1.02]' : ''
                }`}
                style={{
                  background: selectedCategory === cat && !selectedBook
                    ? CATEGORY_COLORS[cat]
                    : 'oklch(0.97 0.005 75)',
                  color: selectedCategory === cat && !selectedBook
                    ? 'oklch(0.98 0.003 75)'
                    : 'oklch(0.35 0.02 265)',
                  border: `1px solid ${
                    selectedCategory === cat && !selectedBook
                      ? CATEGORY_COLORS[cat]
                      : 'oklch(0.88 0.005 75)'
                  }`,
                }}
              >
                {CATEGORY_LABELS[cat]} ({categoryCounts[cat]})
              </button>
            ))}
          </div>

          {/* Bible Book Dropdown */}
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={selectedBook}
              onChange={(e) => handleBookChange(e.target.value)}
              className="px-4 py-2.5 rounded-sm text-sm font-medium transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2"
              style={{
                background: selectedBook
                  ? 'oklch(0.45 0.12 265)'
                  : 'oklch(0.97 0.005 75)',
                color: selectedBook
                  ? 'oklch(0.98 0.003 75)'
                  : 'oklch(0.35 0.02 265)',
                border: `1px solid ${
                  selectedBook
                    ? 'oklch(0.45 0.12 265)'
                    : 'oklch(0.88 0.005 75)'
                }`,
                minWidth: '200px',
                outlineColor: 'oklch(0.45 0.12 265)',
              }}
            >
              <option value="">성경책 선택 (66권)</option>
              <optgroup label="━━ 구약 (39권) ━━">
                {OLD_TESTAMENT_BOOKS.map((book) => (
                  <option key={book.name} value={book.name}>
                    {book.name} ({book.abbr})
                  </option>
                ))}
              </optgroup>
              <optgroup label="━━ 신약 (27권) ━━">
                {NEW_TESTAMENT_BOOKS.map((book) => (
                  <option key={book.name} value={book.name}>
                    {book.name} ({book.abbr})
                  </option>
                ))}
              </optgroup>
            </select>
            {selectedBook && (
              <button
                onClick={() => setSelectedBook('')}
                className="px-3 py-2 rounded-sm text-xs font-medium transition-all duration-200 hover:scale-[1.02]"
                style={{
                  background: 'oklch(0.55 0.15 25 / 0.1)',
                  color: 'oklch(0.55 0.15 25)',
                  border: '1px solid oklch(0.55 0.15 25 / 0.3)',
                }}
              >
                ✕ 초기화
              </button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredMaterials.map((material, index) => (
                <Link
                  key={material.id}
                  href={`/bible-materials/${material.id}`}
                  className={`group block rounded-sm overflow-hidden transition-all duration-500 hover:translate-y-[-6px] stagger-${(index % 6) + 1}`}
                  style={{
                    background: 'oklch(0.99 0.002 75)',
                    border: '1px solid oklch(0.90 0.005 75)',
                    boxShadow: '0 4px 20px oklch(0.30 0.09 265 / 0.06)',
                  }}
                >
                  {/* Category Gradient Bar */}
                  <div
                    className="h-2"
                    style={{
                      background: `linear-gradient(90deg, ${CATEGORY_COLORS[material.category]}, oklch(0.72 0.10 75))`,
                    }}
                  />

                  <div className="p-7">
                    {/* Category & Book Badges */}
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <span
                        className="text-[10px] font-bold px-2.5 py-1 rounded-sm tracking-wide uppercase"
                        style={{
                          background: CATEGORY_COLORS[material.category],
                          color: 'oklch(0.98 0.003 75)',
                        }}
                      >
                        {CATEGORY_LABELS[material.category]}
                      </span>
                      {material.book_name && (
                        <span
                          className="text-xs font-medium px-2.5 py-1 rounded-sm"
                          style={{
                            background: 'oklch(0.45 0.12 265 / 0.08)',
                            color: 'oklch(0.40 0.08 265)',
                          }}
                        >
                          {material.book_name.split(',').join(', ')}
                          {material.chapter_range && ` ${material.chapter_range}`}
                        </span>
                      )}
                    </div>

                    {/* Gold Accent Line */}
                    <div
                      className="h-0.5 w-10 mb-4 transition-all duration-300 group-hover:w-16"
                      style={{ background: 'linear-gradient(90deg, oklch(0.72 0.10 75), oklch(0.45 0.12 265))' }}
                    />

                    {/* Title */}
                    <h2
                      className="font-headline font-black text-xl mb-3 line-clamp-2 transition-colors duration-300"
                      style={{
                        color: 'oklch(0.20 0.06 265)',
                        letterSpacing: '-0.01em',
                        lineHeight: 1.3,
                      }}
                    >
                      <span className="group-hover:underline underline-offset-4 decoration-2" style={{ textDecorationColor: 'oklch(0.72 0.10 75)' }}>
                        {material.title}
                      </span>
                    </h2>

                    {/* Description */}
                    {material.description && (
                      <p
                        className="text-sm line-clamp-2 mb-5 leading-relaxed"
                        style={{ color: 'oklch(0.50 0.02 75)' }}
                      >
                        {material.description}
                      </p>
                    )}

                    {/* Meta Footer */}
                    <div
                      className="flex items-center justify-between pt-5"
                      style={{ borderTop: '1px solid oklch(0.92 0.005 75)' }}
                    >
                      {/* Resource Badges */}
                      <div className="flex items-center gap-3">
                        {material.file_url && (
                          <span
                            className="flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-sm"
                            style={{
                              background: 'oklch(0.55 0.18 25 / 0.08)',
                              color: 'oklch(0.50 0.15 25)',
                            }}
                          >
                            <FileText className="w-3.5 h-3.5" />
                            PDF
                          </span>
                        )}
                        {material.video_url && (
                          <span
                            className="flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-sm"
                            style={{
                              background: 'oklch(0.55 0.15 25 / 0.08)',
                              color: 'oklch(0.50 0.12 25)',
                            }}
                          >
                            <Video className="w-3.5 h-3.5" />
                            영상
                          </span>
                        )}
                        <span
                          className="flex items-center gap-1.5 text-xs"
                          style={{ color: 'oklch(0.55 0.01 75)' }}
                        >
                          <Eye className="w-3.5 h-3.5" style={{ color: 'oklch(0.72 0.10 75)' }} />
                          {material.view_count}
                        </span>
                      </div>

                      {/* Arrow */}
                      <div
                        className="w-8 h-8 rounded-sm flex items-center justify-center transition-all duration-300 group-hover:translate-x-1"
                        style={{
                          background: 'oklch(0.45 0.12 265 / 0.08)',
                        }}
                      >
                        <ChevronRight
                          className="w-4 h-4"
                          style={{ color: 'oklch(0.45 0.12 265)' }}
                        />
                      </div>
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
