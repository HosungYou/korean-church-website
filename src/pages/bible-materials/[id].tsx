import React, { useEffect } from 'react'
import { GetServerSideProps, NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import Layout from '@/components/Layout'
import PageHeader from '@/components/PageHeader'
import { Book, FileText, Video, Download, ArrowLeft, Eye, Calendar, User, ChevronRight } from 'lucide-react'
import {
  getMaterialById,
  incrementViewCount,
  type BibleMaterial,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
} from '@/utils/bibleMaterialsService'

// ===========================================
// VS Design Diverge: Bible Material Detail Page
// Editorial Article Layout + OKLCH Color System
// ===========================================

interface BibleMaterialDetailProps {
  material: BibleMaterial | null
}

const BibleMaterialDetailPage: NextPage<BibleMaterialDetailProps> = ({ material }) => {
  const { t } = useTranslation('common')

  // Increment view count on mount
  useEffect(() => {
    if (material?.id) {
      incrementViewCount(material.id)
    }
  }, [material?.id])

  if (!material) {
    return (
      <Layout>
        <PageHeader
          label={t('bible_materials.label') || '성경통독'}
          title="자료를 찾을 수 없습니다"
          subtitle="요청하신 자료가 존재하지 않거나 삭제되었습니다."
        />
        <div
          className="min-h-[50vh] flex items-center justify-center relative"
          style={{ background: 'oklch(0.985 0.003 75)' }}
        >
          <div className="bg-grain absolute inset-0 pointer-events-none" />
          <div className="text-center relative">
            <div
              className="w-20 h-20 rounded-sm flex items-center justify-center mx-auto mb-6"
              style={{ background: 'oklch(0.45 0.12 265 / 0.1)' }}
            >
              <Book className="w-10 h-10" style={{ color: 'oklch(0.45 0.12 265)' }} />
            </div>
            <Link
              href="/bible-materials"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-sm text-sm font-medium transition-all duration-300 hover:translate-x-[-2px]"
              style={{
                background: 'oklch(0.45 0.12 265)',
                color: 'oklch(0.98 0.003 75)',
              }}
            >
              <ArrowLeft className="w-4 h-4" />
              {t('list') || '목록'}
            </Link>
          </div>
        </div>
      </Layout>
    )
  }

  const categoryColor = CATEGORY_COLORS[material.category]
  const formattedDate = new Date(material.created_at).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <Layout>
      {/* Page Header with Image Background */}
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

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
          {/* Back to List */}
          <Link
            href="/bible-materials"
            className="inline-flex items-center gap-2 mb-8 text-sm font-medium transition-all duration-300 hover:translate-x-[-4px] group"
            style={{ color: 'oklch(0.45 0.12 265)' }}
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            {t('list') || '목록'}
          </Link>

          {/* Article Header Card */}
          <article
            className="rounded-sm overflow-hidden mb-8"
            style={{
              background: 'oklch(0.99 0.002 75)',
              border: '1px solid oklch(0.92 0.005 75)',
              boxShadow: '0 4px 20px oklch(0.30 0.09 265 / 0.08)',
            }}
          >
            {/* Category Color Bar */}
            <div
              className="h-1.5"
              style={{ background: `linear-gradient(90deg, ${categoryColor}, oklch(0.72 0.10 75))` }}
            />

            {/* Article Meta */}
            <div className="p-8 md:p-10">
              {/* Category & Book Badge */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span
                  className="text-xs font-semibold px-3 py-1.5 rounded-sm tracking-wide"
                  style={{
                    background: categoryColor,
                    color: 'oklch(0.98 0.003 75)',
                  }}
                >
                  {CATEGORY_LABELS[material.category]}
                </span>
                {material.book_name && (
                  <span
                    className="text-sm font-medium px-3 py-1 rounded-sm"
                    style={{
                      background: 'oklch(0.45 0.12 265 / 0.08)',
                      color: 'oklch(0.35 0.08 265)',
                    }}
                  >
                    {material.book_name}
                    {material.chapter_range && ` ${material.chapter_range}`}
                  </span>
                )}
              </div>

              {/* Gold Accent Line */}
              <div
                className="h-0.5 w-16 mb-6"
                style={{ background: 'linear-gradient(90deg, oklch(0.72 0.10 75), oklch(0.45 0.12 265))' }}
              />

              {/* Title */}
              <h1
                className="font-headline font-black mb-6"
                style={{
                  fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.2,
                  color: 'oklch(0.22 0.07 265)',
                }}
              >
                {material.title}
              </h1>

              {/* Meta Info */}
              <div
                className="flex flex-wrap items-center gap-6 pt-6"
                style={{ borderTop: '1px solid oklch(0.92 0.005 75)' }}
              >
                <span
                  className="flex items-center gap-2 text-sm"
                  style={{ color: 'oklch(0.50 0.02 75)' }}
                >
                  <Calendar className="w-4 h-4" style={{ color: 'oklch(0.72 0.10 75)' }} />
                  {formattedDate}
                </span>
                {material.author_name && (
                  <span
                    className="flex items-center gap-2 text-sm"
                    style={{ color: 'oklch(0.50 0.02 75)' }}
                  >
                    <User className="w-4 h-4" style={{ color: 'oklch(0.72 0.10 75)' }} />
                    {material.author_name}
                  </span>
                )}
                <span
                  className="flex items-center gap-2 text-sm"
                  style={{ color: 'oklch(0.50 0.02 75)' }}
                >
                  <Eye className="w-4 h-4" style={{ color: 'oklch(0.72 0.10 75)' }} />
                  조회 {material.view_count}
                </span>
              </div>
            </div>
          </article>

          {/* Description Quote */}
          {material.description && (
            <div
              className="p-6 md:p-8 rounded-sm mb-8 relative"
              style={{
                background: 'linear-gradient(135deg, oklch(0.45 0.12 265 / 0.03) 0%, oklch(0.72 0.10 75 / 0.05) 100%)',
                borderLeft: `4px solid ${categoryColor}`,
              }}
            >
              <p
                className="text-lg leading-relaxed font-korean italic"
                style={{ color: 'oklch(0.35 0.04 265)' }}
              >
                &ldquo;{material.description}&rdquo;
              </p>
            </div>
          )}

          {/* Resources Section */}
          {(material.file_url || material.video_url) && (
            <div className="mb-10">
              {/* Section Label */}
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="h-0.5 w-8"
                  style={{ background: 'oklch(0.72 0.10 75)' }}
                />
                <span
                  className="text-xs font-semibold tracking-[0.15em] uppercase"
                  style={{ color: 'oklch(0.72 0.10 75)' }}
                >
                  자료 다운로드
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* PDF Download Card */}
                {material.file_url && (
                  <a
                    href={material.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-5 rounded-sm transition-all duration-300 hover:translate-y-[-3px] group"
                    style={{
                      background: 'oklch(0.99 0.002 75)',
                      border: '1px solid oklch(0.90 0.005 75)',
                      boxShadow: '0 2px 12px oklch(0.30 0.09 265 / 0.06)',
                    }}
                  >
                    <div
                      className="w-14 h-14 rounded-sm flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105"
                      style={{ background: 'linear-gradient(135deg, oklch(0.55 0.18 25 / 0.15) 0%, oklch(0.55 0.18 25 / 0.08) 100%)' }}
                    >
                      <FileText className="w-7 h-7" style={{ color: 'oklch(0.50 0.18 25)' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="font-semibold mb-1 truncate group-hover:underline underline-offset-4"
                        style={{ color: 'oklch(0.25 0.06 265)' }}
                      >
                        {material.file_name || 'PDF 자료'}
                      </p>
                      <p className="text-xs" style={{ color: 'oklch(0.55 0.01 75)' }}>
                        클릭하여 다운로드
                      </p>
                    </div>
                    <Download
                      className="w-5 h-5 flex-shrink-0 transition-transform group-hover:translate-y-1"
                      style={{ color: 'oklch(0.50 0.18 25)' }}
                    />
                  </a>
                )}

                {/* Video Link Card */}
                {material.video_url && (
                  <a
                    href={material.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-5 rounded-sm transition-all duration-300 hover:translate-y-[-3px] group"
                    style={{
                      background: 'oklch(0.99 0.002 75)',
                      border: '1px solid oklch(0.90 0.005 75)',
                      boxShadow: '0 2px 12px oklch(0.30 0.09 265 / 0.06)',
                    }}
                  >
                    <div
                      className="w-14 h-14 rounded-sm flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105"
                      style={{ background: 'linear-gradient(135deg, oklch(0.55 0.15 25 / 0.15) 0%, oklch(0.55 0.15 25 / 0.08) 100%)' }}
                    >
                      <Video className="w-7 h-7" style={{ color: 'oklch(0.50 0.15 25)' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="font-semibold mb-1 group-hover:underline underline-offset-4"
                        style={{ color: 'oklch(0.25 0.06 265)' }}
                      >
                        영상 보기
                      </p>
                      <p className="text-xs" style={{ color: 'oklch(0.55 0.01 75)' }}>
                        클릭하여 영상 시청
                      </p>
                    </div>
                    <ChevronRight
                      className="w-5 h-5 flex-shrink-0 transition-transform group-hover:translate-x-1"
                      style={{ color: 'oklch(0.45 0.12 265)' }}
                    />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Main Content */}
          {material.content && (
            <div
              className="p-8 md:p-10 rounded-sm"
              style={{
                background: 'oklch(0.99 0.002 75)',
                border: '1px solid oklch(0.92 0.005 75)',
                boxShadow: '0 2px 12px oklch(0.30 0.09 265 / 0.04)',
              }}
            >
              {/* Section Label */}
              <div className="flex items-center gap-3 mb-8">
                <div
                  className="h-0.5 w-8"
                  style={{ background: 'oklch(0.72 0.10 75)' }}
                />
                <span
                  className="text-xs font-semibold tracking-[0.15em] uppercase"
                  style={{ color: 'oklch(0.72 0.10 75)' }}
                >
                  본문 내용
                </span>
              </div>

              <div
                className="prose prose-lg max-w-none font-korean whitespace-pre-wrap leading-relaxed"
                style={{
                  color: 'oklch(0.30 0.02 75)',
                  fontSize: '1.05rem',
                  lineHeight: 1.85,
                }}
              >
                {material.content}
              </div>
            </div>
          )}

          {/* Back Button */}
          <div className="mt-12 flex justify-center">
            <Link
              href="/bible-materials"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-sm text-sm font-semibold transition-all duration-300 hover:translate-x-[-4px] group"
              style={{
                background: 'oklch(0.45 0.12 265)',
                color: 'oklch(0.98 0.003 75)',
                boxShadow: '0 4px 16px oklch(0.45 0.12 265 / 0.3)',
              }}
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              {t('list') || '목록'}으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params, locale }) => {
  const id = params?.id as string

  let material: BibleMaterial | null = null

  try {
    material = await getMaterialById(id)
  } catch (error) {
    console.error('Error loading material:', error)
  }

  // Return 404 if not found or not visible
  if (!material || !material.is_visible) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      ...(await serverSideTranslations(locale || 'ko', ['common'])),
      material,
    },
  }
}

export default BibleMaterialDetailPage
