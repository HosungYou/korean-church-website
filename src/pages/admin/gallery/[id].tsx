import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../../components/Layout'
import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import {
  ArrowLeft,
  Save,
  Loader2,
  Image,
  Calendar,
  Upload,
  X,
  Trash2,
  Plus,
  Eye,
  EyeOff
} from 'lucide-react'
import Link from 'next/link'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import {
  getAlbumWithPhotos,
  updateAlbum,
  uploadGalleryImage,
  addPhoto,
  deletePhoto
} from '../../../utils/galleryService'
import type { GalleryAlbum, GalleryPhoto, GalleryAlbumInsert } from '../../../../types/supabase'

const EditAlbumPage = () => {
  const router = useRouter()
  const { id } = router.query
  const { admin, loading } = useAdminAuth()
  const [album, setAlbum] = useState<GalleryAlbum | null>(null)
  const [photos, setPhotos] = useState<GalleryPhoto[]>([])
  const [pageLoading, setPageLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const coverInputRef = useRef<HTMLInputElement>(null)
  const photosInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState<Partial<GalleryAlbumInsert>>({})

  useEffect(() => {
    if (!id || !admin) return

    const fetchAlbum = async () => {
      try {
        const { album: albumData, photos: photosData } = await getAlbumWithPhotos(id as string)
        setAlbum(albumData)
        setPhotos(photosData)
        setFormData({
          title: albumData.title,
          description: albumData.description || '',
          album_date: albumData.album_date,
          category: albumData.category || '',
          is_visible: albumData.is_visible,
          cover_image_url: albumData.cover_image_url || ''
        })
      } catch (error) {
        console.error('앨범 조회 오류:', error)
        alert('앨범을 찾을 수 없습니다.')
        router.push('/admin/gallery')
      } finally {
        setPageLoading(false)
      }
    }

    fetchAlbum()
  }, [id, admin, router])

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploading(true)
      const url = await uploadGalleryImage(file, 'covers')
      setFormData({ ...formData, cover_image_url: url })
    } catch (error) {
      console.error('이미지 업로드 오류:', error)
      alert('이미지 업로드 중 오류가 발생했습니다.')
    } finally {
      setUploading(false)
    }
  }

  const handlePhotosUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0 || !id) return

    setUploading(true)
    setUploadProgress(0)
    const totalFiles = files.length
    let uploaded = 0

    try {
      for (const file of Array.from(files)) {
        const imageUrl = await uploadGalleryImage(file, 'photos')
        const newPhoto = await addPhoto({
          album_id: id as string,
          image_url: imageUrl,
          caption: '',
          sort_order: photos.length + uploaded
        })
        setPhotos((prev) => [...prev, newPhoto])
        uploaded++
        setUploadProgress(Math.round((uploaded / totalFiles) * 100))
      }
      alert(`${uploaded}장의 사진이 업로드되었습니다.`)
    } catch (error) {
      console.error('사진 업로드 오류:', error)
      alert('일부 사진 업로드 중 오류가 발생했습니다.')
    } finally {
      setUploading(false)
      setUploadProgress(0)
      if (photosInputRef.current) {
        photosInputRef.current.value = ''
      }
    }
  }

  const handleDeletePhoto = async (photoId: string) => {
    if (!confirm('이 사진을 삭제하시겠습니까?')) return

    try {
      await deletePhoto(photoId)
      setPhotos((prev) => prev.filter((p) => p.id !== photoId))
    } catch (error) {
      console.error('사진 삭제 오류:', error)
      alert('사진 삭제 중 오류가 발생했습니다.')
    }
  }

  const handleSubmit = async () => {
    if (!formData.title?.trim()) {
      alert('앨범 제목을 입력해주세요.')
      return
    }

    try {
      setSaving(true)
      await updateAlbum(id as string, formData)
      alert('앨범이 수정되었습니다.')
    } catch (error) {
      console.error('저장 오류:', error)
      alert('저장 중 오류가 발생했습니다.')
    } finally {
      setSaving(false)
    }
  }

  const toggleVisibility = async () => {
    const newVisibility = !formData.is_visible
    setFormData({ ...formData, is_visible: newVisibility })
    try {
      await updateAlbum(id as string, { is_visible: newVisibility })
    } catch (error) {
      console.error('상태 변경 오류:', error)
      setFormData({ ...formData, is_visible: !newVisibility })
    }
  }

  if (loading || pageLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-black" />
        </div>
      </Layout>
    )
  }

  if (!admin || !album) return null

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
                <h1 className="text-xl font-bold text-gray-900 font-korean">앨범 편집</h1>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={toggleVisibility}
                  className={`inline-flex items-center px-4 py-2 border shadow-sm text-sm font-medium rounded-md ${
                    formData.is_visible
                      ? 'border-green-300 text-green-700 bg-green-50 hover:bg-green-100'
                      : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                  }`}
                >
                  {formData.is_visible ? (
                    <>
                      <Eye className="w-4 h-4 mr-2" />
                      <span className="font-korean">공개</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-4 h-4 mr-2" />
                      <span className="font-korean">비공개</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={saving}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  <span className="font-korean">저장</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 앨범 정보 */}
            <div className="lg:col-span-1">
              <div className="bg-white shadow rounded-lg p-6 space-y-6">
                {/* 커버 이미지 */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 font-korean mb-2">커버 이미지</h3>
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                    {formData.cover_image_url ? (
                      <>
                        <img
                          src={formData.cover_image_url}
                          alt="커버"
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => setFormData({ ...formData, cover_image_url: '' })}
                          className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500 font-korean">커버 업로드</span>
                        <input
                          ref={coverInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleCoverUpload}
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

                {/* 기본 정보 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 font-korean mb-1">
                    앨범 제목 *
                  </label>
                  <input
                    type="text"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black font-korean"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 font-korean mb-1">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    앨범 날짜
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
                    value={formData.category || ''}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as 'sunday' | 'event' | 'education' | 'missions' | 'general' | undefined })}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black font-korean"
                  >
                    <option value="">선택하세요</option>
                    <option value="sunday">주일 예배</option>
                    <option value="event">행사</option>
                    <option value="education">교육</option>
                    <option value="missions">선교</option>
                    <option value="general">일반</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 font-korean mb-1">
                    설명
                  </label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black font-korean"
                  />
                </div>
              </div>
            </div>

            {/* 사진 관리 */}
            <div className="lg:col-span-2">
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-medium text-gray-900 font-korean">
                    <Image className="w-5 h-5 inline mr-2" />
                    사진 ({photos.length}장)
                  </h2>
                  <label className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 cursor-pointer">
                    <Plus className="w-4 h-4 mr-2" />
                    <span className="font-korean">사진 추가</span>
                    <input
                      ref={photosInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotosUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* 업로드 진행률 */}
                {uploading && uploadProgress > 0 && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>업로드 중...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-black h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* 사진 그리드 */}
                {photos.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 font-korean">
                    <Image className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>아직 사진이 없습니다.</p>
                    <p className="text-sm">위의 &ldquo;사진 추가&rdquo; 버튼을 클릭하여 사진을 업로드하세요.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {photos.map((photo) => (
                      <div key={photo.id} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={photo.thumbnail_url || photo.image_url}
                          alt={photo.caption || '사진'}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                          <button
                            onClick={() => handleDeletePhoto(photo.id)}
                            className="opacity-0 group-hover:opacity-100 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all"
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
      </div>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'ko', ['common'])),
  },
})

export default EditAlbumPage
