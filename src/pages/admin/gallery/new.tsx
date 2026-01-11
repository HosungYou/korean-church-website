import { useState, useRef } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../../components/Layout'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import {
  ArrowLeft,
  Save,
  Loader2,
  Image,
  Calendar,
  Upload,
  X
} from 'lucide-react'
import Link from 'next/link'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import { createAlbum, uploadGalleryImage } from '../../../utils/galleryService'
import type { GalleryAlbumInsert } from '../../../../types/supabase'

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
    is_visible: true,
    cover_image_url: ''
  })

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 미리보기 표시
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
                <Link href="/admin/gallery" className="mr-4">
                  <ArrowLeft className="w-5 h-5 text-gray-600 hover:text-black transition-colors" />
                </Link>
                <div className="w-3 h-3 bg-black rounded-full mr-4"></div>
                <h1 className="text-xl font-bold text-gray-900 font-korean">새 앨범 만들기</h1>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleSubmit(false)}
                  disabled={saving}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  <span className="font-korean">비공개로 저장</span>
                </button>
                <button
                  onClick={() => handleSubmit(true)}
                  disabled={saving}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  <span className="font-korean">공개로 저장</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="space-y-6">
              {/* 커버 이미지 */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 font-korean mb-4">
                  <Image className="w-5 h-5 inline mr-2" />
                  커버 이미지
                </h2>
                <div className="flex items-start gap-4">
                  {coverPreview || formData.cover_image_url ? (
                    <div className="relative w-64 aspect-video rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={coverPreview || formData.cover_image_url || ''}
                        alt="커버 미리보기"
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={removeCover}
                        className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      {uploading && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <Loader2 className="w-8 h-8 text-white animate-spin" />
                        </div>
                      )}
                    </div>
                  ) : (
                    <label className="w-64 aspect-video border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500 font-korean">커버 이미지 업로드</span>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleCoverUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* 기본 정보 */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 font-korean mb-4">기본 정보</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 font-korean mb-1">
                      앨범 제목 *
                    </label>
                    <input
                      type="text"
                      value={formData.title || ''}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="예: 2024년 부활절 예배"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black font-korean"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 font-korean mb-1">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      앨범 날짜 *
                    </label>
                    <input
                      type="date"
                      value={formData.album_date || ''}
                      onChange={(e) => setFormData({ ...formData, album_date: e.target.value })}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 font-korean mb-1">
                      카테고리
                    </label>
                    <select
                      value={formData.category || 'general'}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as 'sunday' | 'event' | 'education' | 'missions' | 'general' })}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black font-korean"
                    >
                      <option value="general">일반</option>
                      <option value="sunday">주일 예배</option>
                      <option value="event">행사</option>
                      <option value="education">교육</option>
                      <option value="missions">선교</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 font-korean mb-1">
                      설명
                    </label>
                    <textarea
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      placeholder="앨범에 대한 간략한 설명을 입력하세요"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black font-korean"
                    />
                  </div>
                </div>
              </div>

              {/* 안내 */}
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-800 font-korean">
                  앨범을 저장한 후 사진을 추가할 수 있습니다. 저장 후 편집 화면에서 사진을 업로드해주세요.
                </p>
              </div>
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

export default NewAlbumPage
