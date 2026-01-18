// ===========================================
// VS Design Diverge: Album Edit Page
// OKLCH Color System + Editorial Minimalism
// ===========================================

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import {
  ArrowLeft,
  Save,
  Loader2,
  Image as ImageIcon,
  Calendar,
  Upload,
  X,
  Trash2,
  Plus,
  Eye,
  EyeOff,
  Grid,
  Camera,
  Folder,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import AdminLayout from '@/components/AdminLayout'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import {
  getAlbumWithPhotos,
  updateAlbum,
  uploadGalleryImage,
  addPhoto,
  deletePhoto,
  DEPARTMENT_LABELS,
  DEPARTMENT_COLORS,
  type AlbumDepartment,
} from '../../../utils/galleryService'
import type { GalleryAlbum, GalleryPhoto, GalleryAlbumInsert } from '../../../../types/supabase'

const CATEGORIES = [
  { value: 'sunday', label: '주일 예배' },
  { value: 'event', label: '행사' },
  { value: 'education', label: '교육' },
  { value: 'missions', label: '선교' },
  { value: 'general', label: '일반' },
]

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
          category: albumData.category || 'general',
          department: albumData.department || 'general',
          district_number: albumData.district_number || null,
          is_visible: albumData.is_visible,
          cover_image_url: albumData.cover_image_url || '',
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
          sort_order: photos.length + uploaded,
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
      <AdminLayout title="앨범 편집" subtitle="로딩 중...">
        <div className="flex items-center justify-center py-20">
          <div
            className="w-12 h-12 rounded-sm animate-pulse"
            style={{ background: 'oklch(0.45 0.12 265)' }}
          />
        </div>
      </AdminLayout>
    )
  }

  if (!admin || !album) return null

  const departmentColor = formData.department
    ? DEPARTMENT_COLORS[formData.department as AlbumDepartment]
    : 'oklch(0.72 0.10 75)'

  return (
    <AdminLayout title="앨범 편집" subtitle={album.title}>
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <Link
          href="/admin/gallery"
          className="inline-flex items-center text-sm font-medium transition-colors hover:-translate-x-1 duration-200"
          style={{ color: 'oklch(0.55 0.01 75)' }}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          갤러리 목록으로
        </Link>
        <div className="flex gap-3">
          <button
            onClick={toggleVisibility}
            className="inline-flex items-center px-4 py-2.5 rounded-sm font-medium text-sm transition-all duration-200 hover:-translate-y-0.5"
            style={{
              background: formData.is_visible
                ? 'oklch(0.55 0.15 145 / 0.15)'
                : 'oklch(0.97 0.005 265)',
              color: formData.is_visible
                ? 'oklch(0.45 0.15 145)'
                : 'oklch(0.55 0.01 75)',
              border: formData.is_visible
                ? '1px solid oklch(0.55 0.15 145 / 0.3)'
                : '1px solid oklch(0.90 0.01 265)',
            }}
          >
            {formData.is_visible ? (
              <>
                <Eye className="w-4 h-4 mr-2" />
                공개
              </>
            ) : (
              <>
                <EyeOff className="w-4 h-4 mr-2" />
                비공개
              </>
            )}
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="inline-flex items-center px-5 py-2.5 rounded-sm font-medium text-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50"
            style={{
              background: 'oklch(0.45 0.12 265)',
              color: 'oklch(0.98 0.003 75)',
            }}
          >
            {saving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            저장
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Album Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Cover Image Card */}
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
                style={{ background: `linear-gradient(90deg, ${departmentColor}, oklch(0.45 0.12 265))` }}
              />
              <h2
                className="font-headline font-bold text-lg flex items-center gap-2"
                style={{ color: 'oklch(0.22 0.07 265)' }}
              >
                <Camera className="w-5 h-5" style={{ color: departmentColor }} />
                커버 이미지
              </h2>
            </div>

            <div className="relative aspect-video rounded-sm overflow-hidden mb-4" style={{ background: 'oklch(0.92 0.005 75)' }}>
              {formData.cover_image_url ? (
                <>
                  <Image
                    src={formData.cover_image_url}
                    alt="커버"
                    fill
                    className="object-cover"
                  />
                  <button
                    onClick={() => setFormData({ ...formData, cover_image_url: '' })}
                    className="absolute top-2 right-2 p-1.5 rounded-sm transition-all duration-200 hover:scale-110"
                    style={{
                      background: 'oklch(0.55 0.18 25)',
                      color: 'white',
                    }}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <label
                  className="w-full h-full flex flex-col items-center justify-center cursor-pointer transition-all duration-200 hover:bg-[oklch(0.90_0.005_75)]"
                >
                  <div
                    className="w-14 h-14 rounded-sm flex items-center justify-center mb-3"
                    style={{ background: 'oklch(0.45 0.12 265 / 0.1)' }}
                  >
                    <Upload className="w-7 h-7" style={{ color: 'oklch(0.45 0.12 265)' }} />
                  </div>
                  <span className="text-sm font-medium" style={{ color: 'oklch(0.45 0.12 265)' }}>
                    커버 업로드
                  </span>
                  <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    className="hidden"
                  />
                </label>
              )}
              {uploading && !uploadProgress && (
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ background: 'oklch(0.15 0.05 265 / 0.7)' }}
                >
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>
              )}
            </div>
          </div>

          {/* Basic Info Card */}
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
                style={{ background: `linear-gradient(90deg, ${departmentColor}, oklch(0.45 0.12 265))` }}
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
                  className="block w-full px-4 py-3 rounded-sm transition-all duration-200 focus:outline-none focus:ring-2"
                  style={{
                    background: 'oklch(0.97 0.005 265)',
                    border: '1px solid oklch(0.90 0.01 265)',
                    color: 'oklch(0.25 0.02 75)',
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
                  앨범 날짜
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
                  }}
                />
              </div>

              {/* Category */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'oklch(0.35 0.05 265)' }}
                >
                  카테고리
                </label>
                <select
                  value={formData.category || 'general'}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value as 'sunday' | 'event' | 'education' | 'missions' | 'general' })
                  }
                  className="block w-full px-4 py-3 rounded-sm transition-all duration-200 focus:outline-none focus:ring-2"
                  style={{
                    background: 'oklch(0.97 0.005 265)',
                    border: '1px solid oklch(0.90 0.01 265)',
                    color: 'oklch(0.25 0.02 75)',
                  }}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Department Badge */}
              {formData.department && formData.department !== 'general' && (
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: 'oklch(0.35 0.05 265)' }}
                  >
                    <Folder className="w-4 h-4 inline mr-1.5" />
                    부서
                  </label>
                  <div
                    className="inline-flex items-center px-3 py-2 rounded-sm text-sm font-medium"
                    style={{
                      background: `${departmentColor}20`,
                      color: departmentColor,
                      border: `1px solid ${departmentColor}40`,
                    }}
                  >
                    {DEPARTMENT_LABELS[formData.department as AlbumDepartment]}
                    {formData.department === 'district' && formData.district_number && (
                      <span className="ml-1">{formData.district_number}구역</span>
                    )}
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'oklch(0.35 0.05 265)' }}
                >
                  설명
                </label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="block w-full px-4 py-3 rounded-sm transition-all duration-200 focus:outline-none focus:ring-2 resize-none"
                  style={{
                    background: 'oklch(0.97 0.005 265)',
                    border: '1px solid oklch(0.90 0.01 265)',
                    color: 'oklch(0.25 0.02 75)',
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Photos Grid */}
        <div className="lg:col-span-2">
          <div
            className="p-6 rounded-sm"
            style={{
              background: 'oklch(0.985 0.003 75)',
              border: '1px solid oklch(0.92 0.005 75)',
            }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <div
                  className="h-0.5 w-8 mb-4"
                  style={{ background: `linear-gradient(90deg, ${departmentColor}, oklch(0.45 0.12 265))` }}
                />
                <h2
                  className="font-headline font-bold text-lg flex items-center gap-2"
                  style={{ color: 'oklch(0.22 0.07 265)' }}
                >
                  <Grid className="w-5 h-5" style={{ color: departmentColor }} />
                  사진 ({photos.length}장)
                </h2>
              </div>
              <label
                className="inline-flex items-center px-5 py-2.5 rounded-sm font-medium text-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer"
                style={{
                  background: departmentColor,
                  color: 'oklch(0.98 0.003 75)',
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                사진 추가
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

            {/* Upload Progress */}
            {uploading && uploadProgress > 0 && (
              <div className="mb-6">
                <div
                  className="flex justify-between text-sm mb-2"
                  style={{ color: 'oklch(0.55 0.01 75)' }}
                >
                  <span>업로드 중...</span>
                  <span style={{ color: departmentColor }}>{uploadProgress}%</span>
                </div>
                <div
                  className="w-full h-2 rounded-full overflow-hidden"
                  style={{ background: 'oklch(0.92 0.005 75)' }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${uploadProgress}%`,
                      background: departmentColor,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Photos Grid */}
            {photos.length === 0 ? (
              <div
                className="text-center py-16 rounded-sm"
                style={{
                  background: 'oklch(0.97 0.005 265)',
                  border: '2px dashed oklch(0.85 0.01 265)',
                }}
              >
                <div
                  className="w-16 h-16 rounded-sm flex items-center justify-center mx-auto mb-4"
                  style={{ background: 'oklch(0.45 0.12 265 / 0.1)' }}
                >
                  <ImageIcon className="w-8 h-8" style={{ color: 'oklch(0.45 0.12 265)' }} />
                </div>
                <p className="font-medium" style={{ color: 'oklch(0.45 0.05 265)' }}>
                  아직 사진이 없습니다.
                </p>
                <p className="text-sm mt-1" style={{ color: 'oklch(0.55 0.01 75)' }}>
                  위의 &ldquo;사진 추가&rdquo; 버튼을 클릭하여 사진을 업로드하세요.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {photos.map((photo, index) => (
                  <div
                    key={photo.id}
                    className={`group relative aspect-square rounded-sm overflow-hidden stagger-${(index % 6) + 1}`}
                    style={{ background: 'oklch(0.92 0.005 75)' }}
                  >
                    <Image
                      src={photo.thumbnail_url || photo.image_url}
                      alt={photo.caption || '사진'}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {/* Hover Overlay */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center"
                      style={{ background: 'oklch(0.15 0.05 265 / 0.6)' }}
                    >
                      <button
                        onClick={() => handleDeletePhoto(photo.id)}
                        className="p-3 rounded-sm transition-all duration-200 hover:scale-110"
                        style={{
                          background: 'oklch(0.55 0.18 25)',
                          color: 'white',
                        }}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    {/* Index Badge */}
                    <div
                      className="absolute top-2 left-2 w-6 h-6 rounded-sm flex items-center justify-center text-xs font-bold"
                      style={{
                        background: 'oklch(0.15 0.05 265 / 0.7)',
                        color: 'oklch(0.98 0.003 75)',
                      }}
                    >
                      {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'ko', ['common'])),
  },
})

export default EditAlbumPage
