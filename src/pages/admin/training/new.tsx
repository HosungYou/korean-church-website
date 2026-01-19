// ===========================================
// VS Design Diverge: New Training Program
// Editorial Form + OKLCH Color System
// ===========================================

import { useState, useRef } from 'react'
import { useRouter } from 'next/router'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import {
  ArrowLeft,
  Save,
  Loader2,
  Image as ImageIcon,
  Upload,
  X,
  Heart,
  BookOpen,
  BookMarked,
  Users,
  Droplets,
  Folder,
} from 'lucide-react'
import Link from 'next/link'
import AdminLayout from '@/components/AdminLayout'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import {
  createProgram,
  uploadTrainingFile,
  CATEGORY_LABELS,
  type ProgramCategory
} from '../../../utils/trainingService'
import type { TrainingProgramInsert } from '../../../../types/supabase'

const CATEGORY_COLORS: Record<ProgramCategory, string> = {
  new_family: 'oklch(0.55 0.15 340)',
  discipleship: 'oklch(0.45 0.12 265)',
  bible_study: 'oklch(0.55 0.15 145)',
  leadership: 'oklch(0.60 0.18 25)',
  baptism: 'oklch(0.55 0.18 200)',
  general: 'oklch(0.72 0.10 75)',
}

const CATEGORIES: { id: ProgramCategory; label: string; icon: typeof BookOpen; description: string }[] = [
  { id: 'new_family', label: '새가족 양육', icon: Heart, description: '새가족 정착 및 양육 과정' },
  { id: 'discipleship', label: '제자훈련', icon: BookOpen, description: '제자 양육 과정' },
  { id: 'bible_study', label: '성경공부', icon: BookMarked, description: '성경 연구 과정' },
  { id: 'leadership', label: '리더십훈련', icon: Users, description: '리더 양성 과정' },
  { id: 'baptism', label: '세례교육', icon: Droplets, description: '세례 준비 과정' },
  { id: 'general', label: '일반', icon: Folder, description: '기타 훈련 과정' },
]

const WEEK_OPTIONS = [4, 6, 8, 10, 12, 16, 20, 24]

const NewTrainingProgramPage = () => {
  const router = useRouter()
  const { admin, loading } = useAdminAuth()
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState<Partial<TrainingProgramInsert>>({
    title: '',
    description: '',
    category: 'discipleship',
    total_weeks: 10,
    is_visible: true,
    cover_image_url: '',
    sort_order: 0,
  })

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      setCoverPreview(event.target?.result as string)
    }
    reader.readAsDataURL(file)

    try {
      setUploading(true)
      const url = await uploadTrainingFile(file, 'covers', 'pdf')
      setFormData({ ...formData, cover_image_url: url })
    } catch (error) {
      console.error('이미지 업로드 오류:', error)
      alert('이미지 업로드 중 오류가 발생했습니다.')
      setCoverPreview(null)
    } finally {
      setUploading(false)
    }
  }

  const removeCover = () => {
    setCoverPreview(null)
    setFormData({ ...formData, cover_image_url: '' })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleCategorySelect = (category: ProgramCategory) => {
    setFormData({ ...formData, category })
  }

  const handleSubmit = async (isVisible: boolean) => {
    if (!formData.title?.trim()) {
      alert('프로그램 제목을 입력해주세요.')
      return
    }

    try {
      setSaving(true)
      const program = await createProgram({
        ...formData,
        is_visible: isVisible,
        title: formData.title!.trim(),
      } as TrainingProgramInsert)

      alert('프로그램이 생성되었습니다.')
      router.push(`/admin/training/${program.id}`)
    } catch (error) {
      console.error('저장 오류:', error)
      alert('저장 중 오류가 발생했습니다.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout title="새 프로그램" subtitle="프로그램 생성 중...">
        <div className="flex items-center justify-center py-20">
          <div
            className="w-12 h-12 rounded-sm animate-pulse"
            style={{ background: 'oklch(0.45 0.12 265)' }}
          />
        </div>
      </AdminLayout>
    )
  }

  if (!admin) return null

  return (
    <AdminLayout title="새 훈련 프로그램" subtitle="제자훈련 프로그램을 추가합니다">
      {/* Action Header */}
      <div className="flex justify-between items-center mb-8">
        <Link
          href="/admin/training"
          className="inline-flex items-center text-sm font-medium transition-colors"
          style={{ color: 'oklch(0.55 0.01 75)' }}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          훈련 목록으로
        </Link>
        <div className="flex gap-3">
          <button
            onClick={() => handleSubmit(false)}
            disabled={saving}
            className="inline-flex items-center px-5 py-2.5 rounded-sm font-medium text-sm transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50"
            style={{
              background: 'oklch(0.97 0.005 265)',
              color: 'oklch(0.35 0.05 265)',
              border: '1px solid oklch(0.90 0.01 265)',
            }}
          >
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            비공개로 저장
          </button>
          <button
            onClick={() => handleSubmit(true)}
            disabled={saving}
            className="inline-flex items-center px-5 py-2.5 rounded-sm font-medium text-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50"
            style={{
              background: 'oklch(0.45 0.12 265)',
              color: 'oklch(0.98 0.003 75)',
            }}
          >
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            공개로 저장
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Category Selection */}
          <div
            className="p-6 rounded-sm"
            style={{
              background: 'oklch(0.985 0.003 75)',
              border: '1px solid oklch(0.92 0.005 75)',
            }}
          >
            <div className="mb-6">
              <div
                className="h-0.5 w-8 mb-4"
                style={{ background: 'linear-gradient(90deg, oklch(0.72 0.10 75), oklch(0.45 0.12 265))' }}
              />
              <h2
                className="font-headline font-bold text-lg"
                style={{ color: 'oklch(0.22 0.07 265)' }}
              >
                카테고리 선택
              </h2>
              <p className="text-sm mt-1" style={{ color: 'oklch(0.55 0.01 75)' }}>
                프로그램의 유형을 선택하세요
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon
                const isSelected = formData.category === cat.id
                const color = CATEGORY_COLORS[cat.id]

                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.id)}
                    className="group p-4 rounded-sm text-left transition-all duration-200 hover:-translate-y-0.5"
                    style={{
                      background: isSelected ? `${color}20` : 'oklch(0.97 0.005 265)',
                      border: `2px solid ${isSelected ? color : 'oklch(0.90 0.01 265)'}`,
                      boxShadow: isSelected ? `0 0 0 2px ${color}40` : 'none',
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-sm flex items-center justify-center mb-3 transition-colors"
                      style={{
                        background: isSelected ? color : 'oklch(0.92 0.01 265)',
                        color: isSelected ? 'white' : 'oklch(0.55 0.01 75)',
                      }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <p
                      className="font-medium text-sm mb-0.5"
                      style={{ color: isSelected ? color : 'oklch(0.30 0.05 265)' }}
                    >
                      {cat.label}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: 'oklch(0.55 0.01 75)' }}
                    >
                      {cat.description}
                    </p>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Basic Info */}
          <div
            className="p-6 rounded-sm"
            style={{
              background: 'oklch(0.985 0.003 75)',
              border: '1px solid oklch(0.92 0.005 75)',
            }}
          >
            <div className="mb-6">
              <div
                className="h-0.5 w-8 mb-4"
                style={{ background: 'linear-gradient(90deg, oklch(0.72 0.10 75), oklch(0.45 0.12 265))' }}
              />
              <h2
                className="font-headline font-bold text-lg"
                style={{ color: 'oklch(0.22 0.07 265)' }}
              >
                프로그램 정보
              </h2>
            </div>

            <div className="space-y-5">
              {/* Title */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'oklch(0.35 0.05 265)' }}
                >
                  프로그램 제목 <span style={{ color: 'oklch(0.60 0.18 25)' }}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="예: 새가족 10주간 제자훈련"
                  className="block w-full px-4 py-3 rounded-sm transition-all duration-200 focus:outline-none focus:ring-2"
                  style={{
                    background: 'oklch(0.97 0.005 265)',
                    border: '1px solid oklch(0.90 0.01 265)',
                    color: 'oklch(0.25 0.02 75)',
                    // @ts-ignore
                    '--tw-ring-color': 'oklch(0.45 0.12 265)',
                  }}
                />
              </div>

              {/* Total Weeks */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'oklch(0.35 0.05 265)' }}
                >
                  총 주차 수
                </label>
                <div className="flex gap-2 flex-wrap">
                  {WEEK_OPTIONS.map((weeks) => (
                    <button
                      key={weeks}
                      onClick={() => setFormData({ ...formData, total_weeks: weeks })}
                      className="px-4 py-2 rounded-sm font-medium text-sm transition-all duration-200 hover:-translate-y-0.5"
                      style={{
                        background: formData.total_weeks === weeks
                          ? 'oklch(0.45 0.12 265)'
                          : 'oklch(0.97 0.005 265)',
                        color: formData.total_weeks === weeks
                          ? 'oklch(0.98 0.003 75)'
                          : 'oklch(0.45 0.05 265)',
                        border: `1px solid ${formData.total_weeks === weeks ? 'oklch(0.45 0.12 265)' : 'oklch(0.90 0.01 265)'}`,
                      }}
                    >
                      {weeks}주
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'oklch(0.35 0.05 265)' }}
                >
                  프로그램 설명 (선택)
                </label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  placeholder="프로그램에 대한 설명을 입력하세요. 대상자, 목표, 진행 방식 등을 포함할 수 있습니다."
                  className="block w-full px-4 py-3 rounded-sm transition-all duration-200 focus:outline-none focus:ring-2 resize-none"
                  style={{
                    background: 'oklch(0.97 0.005 265)',
                    border: '1px solid oklch(0.90 0.01 265)',
                    color: 'oklch(0.25 0.02 75)',
                    // @ts-ignore
                    '--tw-ring-color': 'oklch(0.45 0.12 265)',
                  }}
                />
              </div>

              {/* Sort Order */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'oklch(0.35 0.05 265)' }}
                >
                  정렬 순서 (낮을수록 먼저 표시)
                </label>
                <input
                  type="number"
                  value={formData.sort_order || 0}
                  onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                  min={0}
                  className="block w-32 px-4 py-3 rounded-sm transition-all duration-200 focus:outline-none focus:ring-2"
                  style={{
                    background: 'oklch(0.97 0.005 265)',
                    border: '1px solid oklch(0.90 0.01 265)',
                    color: 'oklch(0.25 0.02 75)',
                    // @ts-ignore
                    '--tw-ring-color': 'oklch(0.45 0.12 265)',
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Cover Image */}
        <div className="lg:col-span-1">
          <div
            className="p-6 rounded-sm sticky top-24"
            style={{
              background: 'oklch(0.985 0.003 75)',
              border: '1px solid oklch(0.92 0.005 75)',
            }}
          >
            <div className="mb-6">
              <div
                className="h-0.5 w-8 mb-4"
                style={{ background: 'linear-gradient(90deg, oklch(0.72 0.10 75), oklch(0.45 0.12 265))' }}
              />
              <h2
                className="font-headline font-bold text-lg"
                style={{ color: 'oklch(0.22 0.07 265)' }}
              >
                <ImageIcon className="w-5 h-5 inline mr-2" />
                커버 이미지
              </h2>
              <p className="text-sm mt-1" style={{ color: 'oklch(0.55 0.01 75)' }}>
                프로그램 목록에 표시됩니다
              </p>
            </div>

            {coverPreview || formData.cover_image_url ? (
              <div className="relative aspect-video rounded-sm overflow-hidden mb-4">
                <img
                  src={coverPreview || formData.cover_image_url || ''}
                  alt="커버 미리보기"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={removeCover}
                  className="absolute top-2 right-2 p-1.5 rounded-sm transition-all duration-200 hover:scale-110"
                  style={{
                    background: 'oklch(0.55 0.18 25)',
                    color: 'white',
                  }}
                >
                  <X className="w-4 h-4" />
                </button>
                {uploading && (
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ background: 'oklch(0.15 0.05 265 / 0.7)' }}
                  >
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  </div>
                )}
              </div>
            ) : (
              <label
                className="block aspect-video rounded-sm cursor-pointer transition-all duration-200 hover:-translate-y-1"
                style={{
                  background: 'oklch(0.97 0.005 265)',
                  border: '2px dashed oklch(0.85 0.01 265)',
                }}
              >
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <div
                    className="w-14 h-14 rounded-sm flex items-center justify-center mb-3"
                    style={{ background: 'oklch(0.45 0.12 265 / 0.1)' }}
                  >
                    <Upload className="w-7 h-7" style={{ color: 'oklch(0.45 0.12 265)' }} />
                  </div>
                  <span
                    className="text-sm font-medium"
                    style={{ color: 'oklch(0.45 0.12 265)' }}
                  >
                    이미지 업로드
                  </span>
                  <span
                    className="text-xs mt-1"
                    style={{ color: 'oklch(0.55 0.01 75)' }}
                  >
                    클릭하여 선택
                  </span>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleCoverUpload}
                  className="hidden"
                />
              </label>
            )}

            {/* Info Box */}
            <div
              className="p-4 rounded-sm mt-6"
              style={{
                background: 'oklch(0.55 0.15 200 / 0.1)',
                border: '1px solid oklch(0.55 0.15 200 / 0.3)',
              }}
            >
              <p
                className="text-sm"
                style={{ color: 'oklch(0.35 0.10 200)' }}
              >
                프로그램을 저장한 후 훈련 자료(PDF, 영상, 오디오)를 추가할 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'ko', ['common'])),
  },
})

export default NewTrainingProgramPage
