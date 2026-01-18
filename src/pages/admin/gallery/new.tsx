// ===========================================
// VS Design Diverge: New Album Creation
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
  Calendar,
  Upload,
  X,
  Folder,
  Users,
  MapPin,
} from 'lucide-react'
import Link from 'next/link'
import AdminLayout from '@/components/AdminLayout'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import { createAlbum, uploadGalleryImage, DEPARTMENT_LABELS, DEPARTMENT_COLORS, type AlbumDepartment } from '../../../utils/galleryService'
import type { GalleryAlbumInsert } from '../../../../types/supabase'

const DEPARTMENTS: { id: AlbumDepartment; label: string; icon: typeof Users; description: string }[] = [
  { id: 'children', label: '유년부', icon: Users, description: '영아부, 유치부, 초등부' },
  { id: 'youth', label: '중고등부', icon: Users, description: '중학생, 고등학생' },
  { id: 'young_adults', label: '청년대학부', icon: Users, description: '대학생, 청년' },
  { id: 'district', label: '구역', icon: MapPin, description: '1~4구역 사진' },
  { id: 'general', label: '일반', icon: Folder, description: '전체 교회 행사' },
]

const DISTRICT_NUMBERS = [1, 2, 3, 4]

const NewAlbumPage = () => {
  const router = useRouter()
  const { admin, loading } = useAdminAuth()
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState<Partial<GalleryAlbumInsert>>({
    title: '',
    description: '',
    album_date: new Date().toISOString().split('T')[0],
    category: 'general',
    department: 'general',
    district_number: null,
    is_visible: true,
    cover_image_url: ''
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
      const url = await uploadGalleryImage(file, 'covers')
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

  const handleDepartmentSelect = (dept: AlbumDepartment) => {
    setFormData({
      ...formData,
      department: dept,
      district_number: dept === 'district' ? 1 : null
    })
  }

  const handleSubmit = async (isVisible: boolean) => {
    if (!formData.title?.trim()) {
      alert('앨범 제목을 입력해주세요.')
      return
    }
    if (!formData.album_date) {
      alert('앨범 날짜를 선택해주세요.')
      return
    }

    try {
      setSaving(true)
      const album = await createAlbum({
        ...formData,
        is_visible: isVisible,
        title: formData.title!.trim(),
        album_date: formData.album_date!
      } as GalleryAlbumInsert)

      alert('앨범이 생성되었습니다.')
      router.push(`/admin/gallery/${album.id}`)
    } catch (error) {
      console.error('저장 오류:', error)
      alert('저장 중 오류가 발생했습니다.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout title="새 앨범" subtitle="앨범 생성 중...">
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
    <AdminLayout title="새 앨범 만들기" subtitle="사진첩에 새 앨범을 추가합니다">
      {/* Action Header */}
      <div className="flex justify-between items-center mb-8">
        <Link
          href="/admin/gallery"
          className="inline-flex items-center text-sm font-medium transition-colors"
          style={{ color: 'oklch(0.55 0.01 75)' }}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          갤러리 목록으로
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
          {/* Department Selection */}
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
                부서 선택
              </h2>
              <p className="text-sm mt-1" style={{ color: 'oklch(0.55 0.01 75)' }}>
                앨범이 속할 부서를 선택하세요
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {DEPARTMENTS.map((dept) => {
                const Icon = dept.icon
                const isSelected = formData.department === dept.id
                const color = DEPARTMENT_COLORS[dept.id]

                return (
                  <button
                    key={dept.id}
                    onClick={() => handleDepartmentSelect(dept.id)}
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
                      {dept.label}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: 'oklch(0.55 0.01 75)' }}
                    >
                      {dept.description}
                    </p>
                  </button>
                )
              })}
            </div>

            {/* District Number Selection */}
            {formData.department === 'district' && (
              <div className="mt-6 pt-6" style={{ borderTop: '1px solid oklch(0.92 0.005 75)' }}>
                <p className="text-sm font-medium mb-3" style={{ color: 'oklch(0.35 0.05 265)' }}>
                  구역 번호 선택
                </p>
                <div className="flex gap-3">
                  {DISTRICT_NUMBERS.map((num) => (
                    <button
                      key={num}
                      onClick={() => setFormData({ ...formData, district_number: num })}
                      className={`w-12 h-12 rounded-sm font-bold text-lg transition-all duration-200 hover:-translate-y-0.5`}
                      style={{
                        background: formData.district_number === num
                          ? DEPARTMENT_COLORS.district
                          : 'oklch(0.97 0.005 265)',
                        color: formData.district_number === num
                          ? 'white'
                          : 'oklch(0.45 0.05 265)',
                        border: `1px solid ${formData.district_number === num ? DEPARTMENT_COLORS.district : 'oklch(0.90 0.01 265)'}`,
                      }}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            )}
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
                앨범 정보
              </h2>
            </div>

            <div className="space-y-5">
              {/* Title */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'oklch(0.35 0.05 265)' }}
                >
                  앨범 제목 <span style={{ color: 'oklch(0.60 0.18 25)' }}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="예: 2026년 부활절 예배"
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

              {/* Date */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'oklch(0.35 0.05 265)' }}
                >
                  <Calendar className="w-4 h-4 inline mr-1.5" />
                  앨범 날짜 <span style={{ color: 'oklch(0.60 0.18 25)' }}>*</span>
                </label>
                <input
                  type="date"
                  value={formData.album_date || ''}
                  onChange={(e) => setFormData({ ...formData, album_date: e.target.value })}
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

              {/* Description */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'oklch(0.35 0.05 265)' }}
                >
                  설명 (선택)
                </label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  placeholder="앨범에 대한 간략한 설명을 입력하세요"
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
                앨범 목록에 표시됩니다
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
                앨범을 저장한 후 사진을 추가할 수 있습니다. 저장 후 편집 화면에서 사진을 업로드해주세요.
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

export default NewAlbumPage
