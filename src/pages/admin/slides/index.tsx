import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../../components/Layout'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import {
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  Image,
  Loader2,
  Eye,
  EyeOff,
  GripVertical,
  Save,
  X,
  Upload,
  Link as LinkIcon
} from 'lucide-react'
import Link from 'next/link'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import {
  getActiveSlides,
  getAllSlides,
  createSlide,
  updateSlide,
  deleteSlide,
  uploadSlideImage
} from '../../../utils/heroSlideService'
import type { HeroSlide, HeroSlideInsert } from '../../../../types/supabase'

const AdminSlidesPage = () => {
  const router = useRouter()
  const { admin, loading } = useAdminAuth()
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
    sort_order: 0
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
      sort_order: slides.length
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
      sort_order: slide.sort_order
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

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-black" />
        </div>
      </Layout>
    )
  }

  if (!admin) return null

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Link href="/admin/dashboard" className="mr-4">
                  <ArrowLeft className="w-5 h-5 text-gray-600 hover:text-black transition-colors" />
                </Link>
                <div className="w-3 h-3 bg-black rounded-full mr-4"></div>
                <h1 className="text-xl font-bold text-gray-900 font-korean">슬라이더/배너 관리</h1>
              </div>
              <button
                onClick={handleCreate}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800"
              >
                <Plus className="w-4 h-4 mr-2" />
                <span className="font-korean">새 슬라이드</span>
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* 편집 폼 */}
            {isCreating && (
              <div className="bg-white shadow rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium text-gray-900 font-korean">
                    {editingSlide ? '슬라이드 수정' : '새 슬라이드 추가'}
                  </h2>
                  <button
                    onClick={() => {
                      setIsCreating(false)
                      setEditingSlide(null)
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 이미지 업로드 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 font-korean mb-2">
                      배경 이미지 *
                    </label>
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                      {formData.image_url ? (
                        <>
                          <img
                            src={formData.image_url}
                            alt="슬라이드 미리보기"
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => setFormData({ ...formData, image_url: '' })}
                            className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                          <Upload className="w-10 h-10 text-gray-400 mb-2" />
                          <span className="text-sm text-gray-500 font-korean">이미지 업로드</span>
                          <span className="text-xs text-gray-400">권장: 1920x600px</span>
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
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <Loader2 className="w-8 h-8 text-white animate-spin" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 텍스트 정보 */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 font-korean mb-1">
                        제목
                      </label>
                      <input
                        type="text"
                        value={formData.title || ''}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="슬라이드 제목"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black font-korean"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 font-korean mb-1">
                        부제목
                      </label>
                      <input
                        type="text"
                        value={formData.subtitle || ''}
                        onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                        placeholder="슬라이드 부제목"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black font-korean"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 font-korean mb-1">
                        <LinkIcon className="w-4 h-4 inline mr-1" />
                        링크 URL
                      </label>
                      <input
                        type="url"
                        value={formData.link_url || ''}
                        onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                        placeholder="https://..."
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="is_active"
                        checked={formData.is_active || false}
                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                        className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                      />
                      <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700 font-korean">
                        활성화
                      </label>
                    </div>

                    <button
                      onClick={handleSubmit}
                      disabled={saving}
                      className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 disabled:opacity-50"
                    >
                      {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                      <span className="font-korean">{editingSlide ? '수정하기' : '추가하기'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 슬라이드 목록 */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 font-korean">
                  슬라이드 목록 ({slides.length}개)
                </h2>
              </div>

              {listLoading ? (
                <div className="p-12 flex justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-black" />
                </div>
              ) : slides.length === 0 ? (
                <div className="p-12 text-center text-gray-500 font-korean">
                  <Image className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>등록된 슬라이드가 없습니다.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {slides.map((slide, index) => (
                    <div
                      key={slide.id}
                      className={`p-4 flex items-center gap-4 ${!slide.is_active ? 'bg-gray-50' : ''}`}
                    >
                      <div className="flex-shrink-0 text-gray-400 cursor-move">
                        <GripVertical className="w-5 h-5" />
                      </div>
                      <div className="flex-shrink-0 text-sm text-gray-500 w-8">
                        #{index + 1}
                      </div>
                      <div className="flex-shrink-0 w-40 h-24 rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={slide.image_url || ''}
                          alt={slide.title || '슬라이드'}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate font-korean">
                          {slide.title || '(제목 없음)'}
                        </h3>
                        {slide.subtitle && (
                          <p className="text-sm text-gray-500 truncate">{slide.subtitle}</p>
                        )}
                        {slide.link_url && (
                          <p className="text-xs text-blue-500 truncate">{slide.link_url}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleActive(slide)}
                          className={`p-2 rounded-full ${
                            slide.is_active
                              ? 'bg-green-100 text-green-600 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                          }`}
                        >
                          {slide.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleEdit(slide)}
                          className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(slide.id)}
                          className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'ko', ['common'])),
  },
})

export default AdminSlidesPage
