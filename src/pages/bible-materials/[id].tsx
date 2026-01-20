import React, { useEffect } from 'react'
import { GetServerSideProps, NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import Layout from '@/components/Layout'
import { Book, FileText, Video, Download, ArrowLeft, Eye, Calendar, User } from 'lucide-react'
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
        <div
          className="min-h-screen flex items-center justify-center"
          style={{ background: 'oklch(0.985 0.003 75)' }}
        >
          <div className="text-center">
            <h1
              className="font-headline font-bold text-2xl mb-4"
              style={{ color: 'oklch(0.30 0.09 265)' }}
            >
              자료를 찾을 수 없습니다
            </h1>
            <Link
              href="/bible-materials"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-sm text-sm font-medium transition-all hover:translate-x-[-2px]"
              style={{
                background: 'oklch(0.45 0.12 265)',
                color: 'oklch(0.98 0.003 75)',
              }}
            >
              <ArrowLeft className="w-4 h-4" />
              목록으로 돌아가기
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
      <div
        className="min-h-screen relative"
        style={{ background: 'oklch(0.985 0.003 75)' }}
      >
        {/* Grain overlay */}
        <div className="bg-grain absolute inset-0 pointer-events-none" />

        {/* Header */}
        <div
          className="relative py-12"
          style={{
            background: 'linear-gradient(135deg, oklch(0.22 0.07 265) 0%, oklch(0.30 0.09 265) 100%)',
          }}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Back Button */}
            <Link
              href="/bible-materials"
              className="inline-flex items-center gap-2 mb-6 text-sm transition-all hover:translate-x-[-2px]"
              style={{ color: 'oklch(0.85 0.02 75)' }}
            >
              <ArrowLeft className="w-4 h-4" />
              목록으로
            </Link>

            {/* Category & Book */}
            <div className="flex items-center gap-3 mb-4">
              <span
                className="text-xs font-medium px-3 py-1 rounded-sm"
                style={{
                  background: categoryColor,
                  color: 'oklch(0.98 0.003 75)',
                }}
              >
                {CATEGORY_LABELS[material.category]}
              </span>
              {material.book_name && (
                <span
                  className="text-sm"
                  style={{ color: 'oklch(0.85 0.02 75)' }}
                >
                  {material.book_name}
                  {material.chapter_range && ` ${material.chapter_range}`}
                </span>
              )}
            </div>

            {/* Title */}
            <h1
              className="font-headline font-black text-2xl md:text-3xl lg:text-4xl mb-4"
              style={{ color: 'oklch(0.98 0.003 75)', letterSpacing: '-0.02em' }}
            >
              {material.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm" style={{ color: 'oklch(0.85 0.02 75)' }}>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {formattedDate}
              </span>
              {material.author_name && (
                <span className="flex items-center gap-1.5">
                  <User className="w-4 h-4" />
                  {material.author_name}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Eye className="w-4 h-4" />
                조회 {material.view_count}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
          {/* Description */}
          {material.description && (
            <div
              className="p-6 rounded-sm mb-8"
              style={{
                background: 'oklch(0.985 0.003 75)',
                border: '1px solid oklch(0.92 0.005 75)',
                borderLeft: `4px solid ${categoryColor}`,
              }}
            >
              <p
                className="text-lg leading-relaxed font-korean"
                style={{ color: 'oklch(0.35 0.02 265)' }}
              >
                {material.description}
              </p>
            </div>
          )}

          {/* Resources (File & Video) */}
          {(material.file_url || material.video_url) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {/* PDF Download */}
              {material.file_url && (
                <a
                  href={material.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-5 rounded-sm transition-all duration-300 hover:translate-y-[-2px] group"
                  style={{
                    background: 'oklch(0.985 0.003 75)',
                    border: '1px solid oklch(0.92 0.005 75)',
                    boxShadow: '0 2px 8px oklch(0.30 0.09 265 / 0.06)',
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-sm flex items-center justify-center flex-shrink-0"
                    style={{ background: 'oklch(0.55 0.15 25 / 0.1)' }}
                  >
                    <FileText className="w-6 h-6" style={{ color: 'oklch(0.55 0.15 25)' }} />
                  </div>
                  <div className="flex-1">
                    <p
                      className="font-medium mb-1 group-hover:underline"
                      style={{ color: 'oklch(0.30 0.09 265)' }}
                    >
                      {material.file_name || 'PDF 자료'}
                    </p>
                    <p className="text-xs" style={{ color: 'oklch(0.55 0.01 75)' }}>
                      클릭하여 다운로드
                    </p>
                  </div>
                  <Download className="w-5 h-5" style={{ color: 'oklch(0.55 0.15 25)' }} />
                </a>
              )}

              {/* Video Link */}
              {material.video_url && (
                <a
                  href={material.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-5 rounded-sm transition-all duration-300 hover:translate-y-[-2px] group"
                  style={{
                    background: 'oklch(0.985 0.003 75)',
                    border: '1px solid oklch(0.92 0.005 75)',
                    boxShadow: '0 2px 8px oklch(0.30 0.09 265 / 0.06)',
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-sm flex items-center justify-center flex-shrink-0"
                    style={{ background: 'oklch(0.55 0.15 25 / 0.1)' }}
                  >
                    <Video className="w-6 h-6" style={{ color: 'oklch(0.55 0.15 25)' }} />
                  </div>
                  <div className="flex-1">
                    <p
                      className="font-medium mb-1 group-hover:underline"
                      style={{ color: 'oklch(0.30 0.09 265)' }}
                    >
                      영상 보기
                    </p>
                    <p className="text-xs" style={{ color: 'oklch(0.55 0.01 75)' }}>
                      클릭하여 영상 시청
                    </p>
                  </div>
                </a>
              )}
            </div>
          )}

          {/* Main Content */}
          {material.content && (
            <div
              className="p-8 rounded-sm"
              style={{
                background: 'oklch(0.985 0.003 75)',
                border: '1px solid oklch(0.92 0.005 75)',
              }}
            >
              <div
                className="h-0.5 w-12 mb-6"
                style={{ background: `linear-gradient(90deg, ${categoryColor}, oklch(0.45 0.12 265))` }}
              />
              <div
                className="prose prose-lg max-w-none font-korean whitespace-pre-wrap"
                style={{ color: 'oklch(0.35 0.02 75)' }}
              >
                {material.content}
              </div>
            </div>
          )}

          {/* Back Button */}
          <div className="mt-12 text-center">
            <Link
              href="/bible-materials"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-sm text-sm font-medium transition-all hover:translate-x-[-2px]"
              style={{
                background: 'oklch(0.45 0.12 265)',
                color: 'oklch(0.98 0.003 75)',
              }}
            >
              <ArrowLeft className="w-4 h-4" />
              목록으로 돌아가기
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
