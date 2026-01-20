import React, { useState, useEffect } from 'react'
import { GetServerSideProps, NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import AdminLayout from '@/components/AdminLayout'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import {
  Book,
  ArrowLeft,
  Save,
  FileText,
  Video,
  Upload,
  Trash2,
} from 'lucide-react'
import {
  getMaterialById,
  updateMaterial,
  type BibleMaterial,
  type BibleMaterialCategory,
  CATEGORY_LABELS,
} from '@/utils/bibleMaterialsService'
import { supabase } from '../../../../lib/supabase'

// ===========================================
// VS Design Diverge: Admin Bible Materials Edit
// Editorial Form Layout + OKLCH Color System
// ===========================================

interface EditPageProps {
  material: BibleMaterial | null
}

const AdminBibleMaterialEditPage: NextPage<EditPageProps> = ({ material }) => {
  const router = useRouter()
  const { admin, loading: authLoading } = useAdminAuth()
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'old_testament' as BibleMaterialCategory,
    book_name: '',
    chapter_range: '',
    content: '',
    file_url: '',
    file_name: '',
    video_url: '',
    author_name: '',
    is_visible: true,
    sort_order: 0,
  })

  useEffect(() => {
    if (material) {
      setFormData({
        title: material.title || '',
        description: material.description || '',
        category: material.category,
        book_name: material.book_name || '',
        chapter_range: material.chapter_range || '',
        content: material.content || '',
        file_url: material.file_url || '',
        file_name: material.file_name || '',
        video_url: material.video_url || '',
        author_name: material.author_name || '',
        is_visible: material.is_visible,
        sort_order: material.sort_order,
      })
    }
  }, [material])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !supabase) return

    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `bible-materials/${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('uploads')
        .getPublicUrl(fileName)

      setFormData((prev) => ({
        ...prev,
        file_url: publicUrl,
        file_name: file.name,
      }))
    } catch (error) {
      console.error('Error uploading file:', error)
      alert('파일 업로드 중 오류가 발생했습니다.')
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveFile = () => {
    setFormData((prev) => ({
      ...prev,
      file_url: '',
      file_name: '',
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!material) return
    if (!formData.title.trim()) {
      alert('제목을 입력해주세요.')
      return
    }

    setSaving(true)
    try {
      await updateMaterial(material.id, {
        title: formData.title,
        description: formData.description || null,
        category: formData.category,
        book_name: formData.book_name || null,
        chapter_range: formData.chapter_range || null,
        content: formData.content || null,
        file_url: formData.file_url || null,
        file_name: formData.file_name || null,
        video_url: formData.video_url || null,
        author_name: formData.author_name || null,
        is_visible: formData.is_visible,
        sort_order: formData.sort_order,
      })

      router.push('/admin/bible-materials')
    } catch (error) {
      console.error('Error updating material:', error)
      alert('저장 중 오류가 발생했습니다.')
    } finally {
      setSaving(false)
    }
  }

  if (authLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div
            className="w-10 h-10 border-2 rounded-full animate-spin"
            style={{ borderColor: 'oklch(0.45 0.12 265)', borderTopColor: 'transparent' }}
          />
        </div>
      </AdminLayout>
    )
  }

  if (!material) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Book
            className="w-16 h-16 mb-4"
            style={{ color: 'oklch(0.75 0.01 75)' }}
          />
          <h2
            className="text-lg font-medium mb-4"
            style={{ color: 'oklch(0.35 0.02 265)' }}
          >
            자료를 찾을 수 없습니다
          </h2>
          <button
            onClick={() => router.push('/admin/bible-materials')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-sm text-sm font-medium"
            style={{
              background: 'oklch(0.45 0.12 265)',
              color: 'oklch(0.98 0.003 75)',
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            목록으로 돌아가기
          </button>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-sm transition-all hover:translate-x-[-2px]"
              style={{
                background: 'oklch(0.97 0.005 75)',
                color: 'oklch(0.45 0.12 265)',
              }}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Book className="w-5 h-5" style={{ color: 'oklch(0.45 0.12 265)' }} />
                <h1
                  className="font-headline font-bold text-xl"
                  style={{ color: 'oklch(0.22 0.07 265)' }}
                >
                  자료 수정
                </h1>
              </div>
              <p className="text-sm" style={{ color: 'oklch(0.55 0.01 75)' }}>
                성경 통독 자료를 수정합니다.
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div
            className="p-6 rounded-sm space-y-5"
            style={{
              background: 'oklch(0.985 0.003 75)',
              border: '1px solid oklch(0.92 0.005 75)',
            }}
          >
            <h2
              className="font-medium text-lg pb-3"
              style={{
                color: 'oklch(0.22 0.07 265)',
                borderBottom: '1px solid oklch(0.92 0.005 75)',
              }}
            >
              기본 정보
            </h2>

            {/* Title */}
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: 'oklch(0.35 0.02 265)' }}
              >
                제목 *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 rounded-sm text-sm focus:outline-none focus:ring-2"
                style={{
                  background: 'oklch(0.97 0.005 75)',
                  border: '1px solid oklch(0.88 0.005 75)',
                  color: 'oklch(0.25 0.05 265)',
                }}
                placeholder="자료 제목을 입력하세요"
              />
            </div>

            {/* Category & Book */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'oklch(0.35 0.02 265)' }}
                >
                  분류 *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-sm text-sm focus:outline-none focus:ring-2"
                  style={{
                    background: 'oklch(0.97 0.005 75)',
                    border: '1px solid oklch(0.88 0.005 75)',
                    color: 'oklch(0.25 0.05 265)',
                  }}
                >
                  <option value="old_testament">{CATEGORY_LABELS.old_testament}</option>
                  <option value="new_testament">{CATEGORY_LABELS.new_testament}</option>
                </select>
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'oklch(0.35 0.02 265)' }}
                >
                  성경 이름
                </label>
                <input
                  type="text"
                  name="book_name"
                  value={formData.book_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-sm text-sm focus:outline-none focus:ring-2"
                  style={{
                    background: 'oklch(0.97 0.005 75)',
                    border: '1px solid oklch(0.88 0.005 75)',
                    color: 'oklch(0.25 0.05 265)',
                  }}
                  placeholder="예: 창세기"
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'oklch(0.35 0.02 265)' }}
                >
                  장 범위
                </label>
                <input
                  type="text"
                  name="chapter_range"
                  value={formData.chapter_range}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-sm text-sm focus:outline-none focus:ring-2"
                  style={{
                    background: 'oklch(0.97 0.005 75)',
                    border: '1px solid oklch(0.88 0.005 75)',
                    color: 'oklch(0.25 0.05 265)',
                  }}
                  placeholder="예: 1-10장"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: 'oklch(0.35 0.02 265)' }}
              >
                요약 설명
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-4 py-2.5 rounded-sm text-sm focus:outline-none focus:ring-2 resize-none"
                style={{
                  background: 'oklch(0.97 0.005 75)',
                  border: '1px solid oklch(0.88 0.005 75)',
                  color: 'oklch(0.25 0.05 265)',
                }}
                placeholder="자료에 대한 간단한 설명"
              />
            </div>

            {/* Author */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'oklch(0.35 0.02 265)' }}
                >
                  작성자
                </label>
                <input
                  type="text"
                  name="author_name"
                  value={formData.author_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-sm text-sm focus:outline-none focus:ring-2"
                  style={{
                    background: 'oklch(0.97 0.005 75)',
                    border: '1px solid oklch(0.88 0.005 75)',
                    color: 'oklch(0.25 0.05 265)',
                  }}
                  placeholder="작성자 이름"
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'oklch(0.35 0.02 265)' }}
                >
                  정렬 순서
                </label>
                <input
                  type="number"
                  name="sort_order"
                  value={formData.sort_order}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-sm text-sm focus:outline-none focus:ring-2"
                  style={{
                    background: 'oklch(0.97 0.005 75)',
                    border: '1px solid oklch(0.88 0.005 75)',
                    color: 'oklch(0.25 0.05 265)',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div
            className="p-6 rounded-sm space-y-5"
            style={{
              background: 'oklch(0.985 0.003 75)',
              border: '1px solid oklch(0.92 0.005 75)',
            }}
          >
            <h2
              className="font-medium text-lg pb-3"
              style={{
                color: 'oklch(0.22 0.07 265)',
                borderBottom: '1px solid oklch(0.92 0.005 75)',
              }}
            >
              본문 내용
            </h2>

            <div>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows={10}
                className="w-full px-4 py-3 rounded-sm text-sm focus:outline-none focus:ring-2 resize-none font-korean"
                style={{
                  background: 'oklch(0.97 0.005 75)',
                  border: '1px solid oklch(0.88 0.005 75)',
                  color: 'oklch(0.25 0.05 265)',
                }}
                placeholder="자료 본문 내용을 입력하세요..."
              />
            </div>
          </div>

          {/* Attachments */}
          <div
            className="p-6 rounded-sm space-y-5"
            style={{
              background: 'oklch(0.985 0.003 75)',
              border: '1px solid oklch(0.92 0.005 75)',
            }}
          >
            <h2
              className="font-medium text-lg pb-3"
              style={{
                color: 'oklch(0.22 0.07 265)',
                borderBottom: '1px solid oklch(0.92 0.005 75)',
              }}
            >
              첨부 자료
            </h2>

            {/* File Upload */}
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: 'oklch(0.35 0.02 265)' }}
              >
                <FileText className="w-4 h-4 inline mr-1" />
                PDF 파일
              </label>
              <div className="flex items-center gap-3">
                <label
                  className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-sm text-sm font-medium transition-all hover:scale-[1.02]"
                  style={{
                    background: 'oklch(0.45 0.12 265)',
                    color: 'oklch(0.98 0.003 75)',
                  }}
                >
                  <Upload className="w-4 h-4" />
                  {uploading ? '업로드 중...' : '파일 선택'}
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
                {formData.file_name && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm" style={{ color: 'oklch(0.55 0.01 75)' }}>
                      {formData.file_name}
                    </span>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="p-1 rounded-sm transition-all hover:scale-110"
                      style={{ color: 'oklch(0.55 0.15 25)' }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Video URL */}
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: 'oklch(0.35 0.02 265)' }}
              >
                <Video className="w-4 h-4 inline mr-1" />
                영상 링크
              </label>
              <input
                type="url"
                name="video_url"
                value={formData.video_url}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-sm text-sm focus:outline-none focus:ring-2"
                style={{
                  background: 'oklch(0.97 0.005 75)',
                  border: '1px solid oklch(0.88 0.005 75)',
                  color: 'oklch(0.25 0.05 265)',
                }}
                placeholder="https://youtube.com/..."
              />
            </div>
          </div>

          {/* Visibility */}
          <div
            className="p-6 rounded-sm"
            style={{
              background: 'oklch(0.985 0.003 75)',
              border: '1px solid oklch(0.92 0.005 75)',
            }}
          >
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="is_visible"
                checked={formData.is_visible}
                onChange={handleInputChange}
                className="w-5 h-5 rounded-sm"
              />
              <span
                className="text-sm font-medium"
                style={{ color: 'oklch(0.35 0.02 265)' }}
              >
                공개 (체크 해제 시 숨김 처리)
              </span>
            </label>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2.5 rounded-sm text-sm font-medium transition-all"
              style={{
                background: 'oklch(0.92 0.005 75)',
                color: 'oklch(0.35 0.02 265)',
              }}
            >
              취소
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-sm text-sm font-medium transition-all hover:scale-[1.02] disabled:opacity-50"
              style={{
                background: 'oklch(0.45 0.12 265)',
                color: 'oklch(0.98 0.003 75)',
              }}
            >
              <Save className="w-4 h-4" />
              {saving ? '저장 중...' : '저장'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
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

  return {
    props: {
      ...(await serverSideTranslations(locale || 'ko', ['common'])),
      material,
    },
  }
}

export default AdminBibleMaterialEditPage
