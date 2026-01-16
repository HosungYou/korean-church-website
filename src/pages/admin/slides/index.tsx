import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import {
  Plus,
  Edit,
  Trash2,
  Image,
  Eye,
  EyeOff,
  GripVertical,
  Save,
  X,
  Upload,
  Link as LinkIcon,
  Layers,
  CheckCircle,
  ArrowRight,
} from 'lucide-react'
import AdminLayout from '@/components/AdminLayout'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import {
  getAllSlides,
  createSlide,
  updateSlide,
  deleteSlide,
  uploadSlideImage,
} from '../../../utils/heroSlideService'
import type { HeroSlide, HeroSlideInsert } from '../../../../types/supabase'

// ===========================================
// VS Design Diverge: Slide Management
// Editorial Grid + OKLCH Color System
// ===========================================

const AdminSlidesPage = () => {
  const router = useRouter()
  const { admin } = useAdminAuth()
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [listLoading, setListLoading] = useState(true)
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState<Partial<HeroSlideInsert>>({
    title: '',
    subtitle: '',
    image_url: '',
    link_url: '',
    is_active: true,
    sort_order: 0,
  })

  useEffect(() => {
    if (!admin) return
    fetchSlides()
  }, [admin])

  const fetchSlides = async () => {
    try {
      setListLoading(true)
      const data = await getAllSlides()
      setSlides(data)
    } catch (error) {
      console.error('슬라이드 조회 오류:', error)
    } finally {
      setListLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploading(true)
      const url = await uploadSlideImage(file)
      setFormData({ ...formData, image_url: url })
    } catch (error) {
      console.error('이미지 업로드 오류:', error)
      alert('이미지 업로드 중 오류가 발생했습니다.')
    } finally {
      setUploading(false)
    }
  }

  const handleCreate = () => {
    setEditingSlide(null)
    setFormData({
      title: '',
      subtitle: '',
      image_url: '',
      link_url: '',
      is_active: true,
      sort_order: slides.length,
    })
    setIsCreating(true)
  }

  const handleEdit = (slide: HeroSlide) => {
    setEditingSlide(slide)
    setFormData({
      title: slide.title || '',
      subtitle: slide.subtitle || '',
      image_url: slide.image_url,
      link_url: slide.link_url || '',
      is_active: slide.is_active,
      sort_order: slide.sort_order,
    })
    setIsCreating(true)
  }

  const handleSubmit = async () => {
    if (!formData.image_url) {
      alert('배경 이미지를 업로드해주세요.')
      return
    }

    try {
      setSaving(true)
      if (editingSlide) {
        await updateSlide(editingSlide.id, formData)
      } else {
        await createSlide(formData as HeroSlideInsert)
      }
      await fetchSlides()
      setIsCreating(false)
      setEditingSlide(null)
      alert(editingSlide ? '슬라이드가 수정되었습니다.' : '슬라이드가 추가되었습니다.')
    } catch (error) {
      console.error('저장 오류:', error)
      alert('저장 중 오류가 발생했습니다.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('이 슬라이드를 삭제하시겠습니까?')) return

    try {
      await deleteSlide(id)
      setSlides((prev) => prev.filter((s) => s.id !== id))
      alert('슬라이드가 삭제되었습니다.')
    } catch (error) {
      console.error('삭제 오류:', error)
      alert('삭제 중 오류가 발생했습니다.')
    }
  }

  const toggleActive = async (slide: HeroSlide) => {
    try {
      await updateSlide(slide.id, { is_active: !slide.is_active })
      setSlides((prev) =>
        prev.map((s) => (s.id === slide.id ? { ...s, is_active: !s.is_active } : s))
      )
    } catch (error) {
      console.error('상태 변경 오류:', error)
    }
  }

  const stats = {
    total: slides.length,
    active: slides.filter((s) => s.is_active).length,
    inactive: slides.filter((s) => !s.is_active).length,
  }

  const statsCards = [
    { name: '총 슬라이드', value: stats.total, icon: Layers },
    { name: '활성화', value: stats.active, icon: Eye },
    { name: '비활성화', value: stats.inactive, icon: EyeOff },
  ]

  return (
    <AdminLayout title="슬라이더 관리" subtitle="히어로 배너 슬라이드를 관리하세요">
      {/* Action Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <div
            className="h-0.5 w-8 mr-4"
            style={{
              background: 'linear-gradient(90deg, oklch(0.72 0.10 75), oklch(0.45 0.12 265))',
            }}
          />
          <span className="text-sm font-medium" style={{ color: 'oklch(0.55 0.01 75)' }}>
            {slides.length}개의 슬라이드
          </span>
        </div>
        <button
          onClick={handleCreate}
          className="inline-flex items-center px-5 py-2.5 rounded-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
          style={{
            background: 'oklch(0.45 0.12 265)',
            color: 'oklch(0.98 0.003 75)',
          }}
        >
          <Plus className="w-4 h-4 mr-2" />새 슬라이드
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.name}
              className={`p-5 rounded-sm stagger-${index + 1}`}
              style={{
                background: 'oklch(0.985 0.003 75)',
                border: '1px solid oklch(0.92 0.005 75)',
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className="w-10 h-10 rounded-sm flex items-center justify-center"
                  style={{ background: 'oklch(0.45 0.12 265 / 0.1)' }}
                >
                  <Icon className="w-5 h-5" style={{ color: 'oklch(0.45 0.12 265)' }} />
                </div>
              </div>
              <p className="text-xs font-medium mb-1" style={{ color: 'oklch(0.55 0.01 75)' }}>
                {stat.name}
              </p>
              <span
                className="font-headline font-bold text-2xl"
                style={{ color: 'oklch(0.22 0.07 265)' }}
              >
                {listLoading ? '—' : stat.value}
              </span>
            </div>
          )
        })}
      </div>

      {/* Edit Form Modal */}
      {isCreating && (
        <div
          className="rounded-sm p-6 mb-6"
          style={{
            background: 'oklch(0.985 0.003 75)',
            border: '1px solid oklch(0.92 0.005 75)',
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2
              className="font-headline font-bold text-lg"
              style={{ color: 'oklch(0.22 0.07 265)' }}
            >
              {editingSlide ? '슬라이드 수정' : '새 슬라이드 추가'}
            </h2>
            <button
              onClick={() => {
                setIsCreating(false)
                setEditingSlide(null)
              }}
              className="p-2 rounded-sm transition-colors"
              style={{ color: 'oklch(0.50 0.01 75)' }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Image Upload */}
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: 'oklch(0.35 0.02 75)' }}
              >
                배경 이미지 *
              </label>
              <div
                className="relative aspect-video rounded-sm overflow-hidden"
                style={{ background: 'oklch(0.92 0.01 265)' }}
              >
                {formData.image_url ? (
                  <>
                    <img
                      src={formData.image_url}
                      alt="슬라이드 미리보기"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => setFormData({ ...formData, image_url: '' })}
                      className="absolute top-2 right-2 p-1.5 rounded-sm transition-colors"
                      style={{
                        background: 'oklch(0.55 0.18 25)',
                        color: 'oklch(0.98 0.003 75)',
                      }}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer transition-colors hover:bg-[oklch(0.90_0.01_265)]">
                    <Upload className="w-10 h-10 mb-2" style={{ color: 'oklch(0.55 0.01 75)' }} />
                    <span className="text-sm" style={{ color: 'oklch(0.50 0.01 75)' }}>
                      이미지 업로드
                    </span>
                    <span className="text-xs mt-1" style={{ color: 'oklch(0.60 0.01 75)' }}>
                      권장: 1920x600px
                    </span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
                {uploading && (
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ background: 'oklch(0.15 0.05 265 / 0.7)' }}
                  >
                    <div
                      className="w-8 h-8 rounded-sm animate-pulse"
                      style={{ background: 'oklch(0.72 0.10 75)' }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Text Info */}
            <div className="space-y-4">
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'oklch(0.35 0.02 75)' }}
                >
                  제목
                </label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="슬라이드 제목"
                  className="block w-full px-3 py-2.5 rounded-sm transition-all duration-200 focus:outline-none"
                  style={{
                    background: 'oklch(0.97 0.005 265)',
                    border: '1px solid oklch(0.90 0.01 265)',
                    color: 'oklch(0.25 0.02 75)',
                  }}
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'oklch(0.35 0.02 75)' }}
                >
                  부제목
                </label>
                <input
                  type="text"
                  value={formData.subtitle || ''}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="슬라이드 부제목"
                  className="block w-full px-3 py-2.5 rounded-sm transition-all duration-200 focus:outline-none"
                  style={{
                    background: 'oklch(0.97 0.005 265)',
                    border: '1px solid oklch(0.90 0.01 265)',
                    color: 'oklch(0.25 0.02 75)',
                  }}
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'oklch(0.35 0.02 75)' }}
                >
                  <LinkIcon className="w-4 h-4 inline mr-1" />
                  링크 URL
                </label>
                <input
                  type="url"
                  value={formData.link_url || ''}
                  onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                  placeholder="https://..."
                  className="block w-full px-3 py-2.5 rounded-sm transition-all duration-200 focus:outline-none"
                  style={{
                    background: 'oklch(0.97 0.005 265)',
                    border: '1px solid oklch(0.90 0.01 265)',
                    color: 'oklch(0.25 0.02 75)',
                  }}
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active || false}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="h-4 w-4 rounded-sm"
                  style={{ accentColor: 'oklch(0.45 0.12 265)' }}
                />
                <label
                  htmlFor="is_active"
                  className="ml-2 block text-sm"
                  style={{ color: 'oklch(0.45 0.01 75)' }}
                >
                  활성화
                </label>
              </div>

              <button
                onClick={handleSubmit}
                disabled={saving}
                className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-sm font-medium transition-all duration-300 disabled:opacity-50 hover:-translate-y-0.5"
                style={{
                  background: 'oklch(0.72 0.10 75)',
                  color: 'oklch(0.15 0.05 265)',
                }}
              >
                {saving ? (
                  <>
                    <div
                      className="w-4 h-4 mr-2 rounded-full animate-spin"
                      style={{
                        border: '2px solid oklch(0.15 0.05 265)',
                        borderTopColor: 'transparent',
                      }}
                    />
                    저장 중...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {editingSlide ? '수정하기' : '추가하기'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Slides List */}
      <div
        className="rounded-sm overflow-hidden"
        style={{
          background: 'oklch(0.985 0.003 75)',
          border: '1px solid oklch(0.92 0.005 75)',
        }}
      >
        <div
          className="px-6 py-4"
          style={{ borderBottom: '1px solid oklch(0.92 0.005 75)' }}
        >
          <h2
            className="font-headline font-bold text-lg"
            style={{ color: 'oklch(0.22 0.07 265)' }}
          >
            슬라이드 목록
          </h2>
        </div>

        {listLoading ? (
          <div className="p-12 flex flex-col items-center justify-center">
            <div
              className="w-10 h-10 rounded-sm mb-4 animate-pulse"
              style={{ background: 'oklch(0.45 0.12 265)' }}
            />
            <p className="text-sm font-medium" style={{ color: 'oklch(0.55 0.01 75)' }}>
              슬라이드 로딩 중...
            </p>
          </div>
        ) : slides.length === 0 ? (
          <div className="p-12 text-center">
            <div
              className="w-16 h-16 rounded-sm mx-auto mb-4 flex items-center justify-center"
              style={{ background: 'oklch(0.45 0.12 265 / 0.1)' }}
            >
              <Image className="w-8 h-8" style={{ color: 'oklch(0.45 0.12 265)' }} />
            </div>
            <p className="text-sm font-medium mb-2" style={{ color: 'oklch(0.45 0.01 75)' }}>
              등록된 슬라이드가 없습니다
            </p>
            <p className="text-xs" style={{ color: 'oklch(0.55 0.01 75)' }}>
              새 슬라이드를 추가해보세요
            </p>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: 'oklch(0.92 0.005 75)' }}>
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`p-4 flex items-center gap-4 transition-colors stagger-${(index % 6) + 1}`}
                style={{
                  background: slide.is_active ? 'transparent' : 'oklch(0.97 0.005 265)',
                }}
              >
                <div className="flex-shrink-0" style={{ color: 'oklch(0.60 0.01 75)' }}>
                  <GripVertical className="w-5 h-5 cursor-move" />
                </div>
                <div
                  className="flex-shrink-0 text-sm font-medium w-8"
                  style={{ color: 'oklch(0.55 0.01 75)' }}
                >
                  #{index + 1}
                </div>
                <div
                  className="flex-shrink-0 w-40 h-24 rounded-sm overflow-hidden"
                  style={{ background: 'oklch(0.92 0.01 265)' }}
                >
                  <img
                    src={slide.image_url || ''}
                    alt={slide.title || '슬라이드'}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3
                    className="text-sm font-medium truncate"
                    style={{ color: 'oklch(0.25 0.02 75)' }}
                  >
                    {slide.title || '(제목 없음)'}
                  </h3>
                  {slide.subtitle && (
                    <p className="text-sm truncate" style={{ color: 'oklch(0.55 0.01 75)' }}>
                      {slide.subtitle}
                    </p>
                  )}
                  {slide.link_url && (
                    <p className="text-xs truncate" style={{ color: 'oklch(0.45 0.12 265)' }}>
                      {slide.link_url}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleActive(slide)}
                    className="p-2 rounded-sm transition-all duration-200 hover:-translate-y-0.5"
                    style={{
                      background: slide.is_active
                        ? 'oklch(0.55 0.15 145 / 0.15)'
                        : 'oklch(0.55 0.01 75 / 0.1)',
                      color: slide.is_active ? 'oklch(0.45 0.15 145)' : 'oklch(0.50 0.01 75)',
                    }}
                  >
                    {slide.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleEdit(slide)}
                    className="p-2 rounded-sm transition-all duration-200 hover:-translate-y-0.5"
                    style={{
                      background: 'oklch(0.45 0.12 265 / 0.1)',
                      color: 'oklch(0.45 0.12 265)',
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(slide.id)}
                    className="p-2 rounded-sm transition-all duration-200 hover:-translate-y-0.5"
                    style={{
                      background: 'oklch(0.55 0.18 25 / 0.1)',
                      color: 'oklch(0.50 0.18 25)',
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'ko', ['common'])),
  },
})

export default AdminSlidesPage
