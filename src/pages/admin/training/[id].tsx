// ===========================================
// VS Design Diverge: Training Program Editor
// Editorial Form + Material Management
// ===========================================

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import {
  ArrowLeft,
  Save,
  Loader2,
  Image as ImageIcon,
  Upload,
  X,
  Plus,
  FileText,
  Video,
  Headphones,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  BarChart3,
} from 'lucide-react'
import Link from 'next/link'
import AdminLayout from '@/components/AdminLayout'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import {
  getProgramById,
  updateProgram,
  getAllMaterialsByProgram,
  createMaterial,
  updateMaterial,
  deleteMaterial,
  uploadTrainingFile,
  deleteTrainingFile,
  CATEGORY_LABELS,
  MATERIAL_TYPE_LABELS,
  MATERIAL_TYPE_ICONS,
  type ProgramCategory,
  type MaterialType,
} from '../../../utils/trainingService'
import type { TrainingProgram, TrainingMaterial, TrainingMaterialInsert } from '../../../../types/supabase'

const CATEGORY_COLORS: Record<ProgramCategory, string> = {
  new_family: 'oklch(0.55 0.15 340)',   // 새가족 양육 - 로즈핑크
  discipleship: 'oklch(0.45 0.12 265)',
  bible_study: 'oklch(0.55 0.15 145)',
  leadership: 'oklch(0.60 0.18 25)',
  baptism: 'oklch(0.55 0.18 200)',
  general: 'oklch(0.72 0.10 75)',
}

const MATERIAL_TYPE_COLORS: Record<MaterialType, string> = {
  pdf: 'oklch(0.55 0.18 25)',
  video: 'oklch(0.50 0.18 265)',
  audio: 'oklch(0.55 0.15 145)',
}

const TrainingProgramEditPage = () => {
  const router = useRouter()
  const { id } = router.query
  const { admin, loading: authLoading } = useAdminAuth()

  const [program, setProgram] = useState<TrainingProgram | null>(null)
  const [materials, setMaterials] = useState<TrainingMaterial[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  // Form states
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [totalWeeks, setTotalWeeks] = useState(10)
  const [category, setCategory] = useState<ProgramCategory>('discipleship')
  const [isVisible, setIsVisible] = useState(true)
  const [sortOrder, setSortOrder] = useState(0)
  const [coverImageUrl, setCoverImageUrl] = useState('')
  const [coverPreview, setCoverPreview] = useState<string | null>(null)

  // Material form states
  const [showMaterialForm, setShowMaterialForm] = useState(false)
  const [editingMaterialId, setEditingMaterialId] = useState<string | null>(null)
  const [materialForm, setMaterialForm] = useState<Partial<TrainingMaterialInsert>>({
    title: '',
    description: '',
    week_number: 1,
    material_type: 'pdf',
    file_url: '',
    video_url: '',
    file_name: '',
    is_visible: true,
    sort_order: 0,
  })
  const [materialUploading, setMaterialUploading] = useState(false)

  const coverFileInputRef = useRef<HTMLInputElement>(null)
  const materialFileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!admin || !id) return

    const fetchData = async () => {
      try {
        setLoading(true)
        const [programData, materialsData] = await Promise.all([
          getProgramById(id as string),
          getAllMaterialsByProgram(id as string)
        ])

        setProgram(programData)
        setMaterials(materialsData)

        // Set form values
        setTitle(programData.title)
        setDescription(programData.description || '')
        setTotalWeeks(programData.total_weeks)
        setCategory(programData.category as ProgramCategory)
        setIsVisible(programData.is_visible)
        setSortOrder(programData.sort_order)
        setCoverImageUrl(programData.cover_image_url || '')
      } catch (error) {
        console.error('데이터 조회 오류:', error)
        alert('프로그램을 찾을 수 없습니다.')
        router.push('/admin/training')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [admin, id, router])

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
      const url = await uploadTrainingFile(file, id as string, 'pdf')
      setCoverImageUrl(url)
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
    setCoverImageUrl('')
    if (coverFileInputRef.current) {
      coverFileInputRef.current.value = ''
    }
  }

  const handleSaveProgram = async () => {
    if (!title.trim()) {
      alert('프로그램 제목을 입력해주세요.')
      return
    }

    try {
      setSaving(true)
      await updateProgram(id as string, {
        title: title.trim(),
        description,
        total_weeks: totalWeeks,
        category,
        is_visible: isVisible,
        sort_order: sortOrder,
        cover_image_url: coverImageUrl || null,
      })
      alert('프로그램이 저장되었습니다.')
    } catch (error) {
      console.error('저장 오류:', error)
      alert('저장 중 오류가 발생했습니다.')
    } finally {
      setSaving(false)
    }
  }

  // Material management functions
  const handleMaterialFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setMaterialUploading(true)
      const url = await uploadTrainingFile(file, id as string, materialForm.material_type as MaterialType)
      setMaterialForm({
        ...materialForm,
        file_url: url,
        file_name: file.name,
        file_size: file.size,
      })
    } catch (error) {
      console.error('파일 업로드 오류:', error)
      alert('파일 업로드 중 오류가 발생했습니다.')
    } finally {
      setMaterialUploading(false)
    }
  }

  const resetMaterialForm = () => {
    setMaterialForm({
      title: '',
      description: '',
      week_number: 1,
      material_type: 'pdf',
      file_url: '',
      video_url: '',
      file_name: '',
      is_visible: true,
      sort_order: materials.length,
    })
    setEditingMaterialId(null)
    setShowMaterialForm(false)
    if (materialFileInputRef.current) {
      materialFileInputRef.current.value = ''
    }
  }

  const handleEditMaterial = (material: TrainingMaterial) => {
    setMaterialForm({
      title: material.title,
      description: material.description || '',
      week_number: material.week_number,
      material_type: material.material_type as MaterialType,
      file_url: material.file_url || '',
      video_url: material.video_url || '',
      file_name: material.file_name || '',
      duration_minutes: material.duration_minutes || undefined,
      is_visible: material.is_visible,
      sort_order: material.sort_order,
    })
    setEditingMaterialId(material.id)
    setShowMaterialForm(true)
  }

  const handleSaveMaterial = async () => {
    if (!materialForm.title?.trim()) {
      alert('자료 제목을 입력해주세요.')
      return
    }

    if (materialForm.material_type === 'video' && !materialForm.video_url?.trim()) {
      alert('영상 URL을 입력해주세요.')
      return
    }

    if ((materialForm.material_type === 'pdf' || materialForm.material_type === 'audio') && !materialForm.file_url) {
      alert('파일을 업로드해주세요.')
      return
    }

    try {
      setSaving(true)

      if (editingMaterialId) {
        // Update existing
        const updated = await updateMaterial(editingMaterialId, {
          ...materialForm,
          title: materialForm.title!.trim(),
        })
        setMaterials(prev => prev.map(m => m.id === editingMaterialId ? updated : m))
      } else {
        // Create new
        const created = await createMaterial({
          ...materialForm,
          program_id: id as string,
          title: materialForm.title!.trim(),
        } as TrainingMaterialInsert)
        setMaterials(prev => [...prev, created])
      }

      resetMaterialForm()
    } catch (error) {
      console.error('자료 저장 오류:', error)
      alert('저장 중 오류가 발생했습니다.')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteMaterial = async (materialId: string, materialTitle: string) => {
    if (!confirm(`"${materialTitle}" 자료를 삭제하시겠습니까?`)) return

    try {
      await deleteMaterial(materialId)
      setMaterials(prev => prev.filter(m => m.id !== materialId))
    } catch (error) {
      console.error('삭제 오류:', error)
      alert('삭제 중 오류가 발생했습니다.')
    }
  }

  const toggleMaterialVisibility = async (material: TrainingMaterial) => {
    try {
      const updated = await updateMaterial(material.id, { is_visible: !material.is_visible })
      setMaterials(prev => prev.map(m => m.id === material.id ? updated : m))
    } catch (error) {
      console.error('상태 변경 오류:', error)
    }
  }

  // Group materials by week
  const materialsByWeek = materials.reduce((acc, material) => {
    const week = material.week_number
    if (!acc[week]) acc[week] = []
    acc[week].push(material)
    return acc
  }, {} as Record<number, TrainingMaterial[]>)

  if (authLoading || loading) {
    return (
      <AdminLayout title="프로그램 편집" subtitle="로딩 중...">
        <div className="flex items-center justify-center py-20">
          <div
            className="w-12 h-12 rounded-sm animate-pulse"
            style={{ background: 'oklch(0.45 0.12 265)' }}
          />
        </div>
      </AdminLayout>
    )
  }

  if (!admin || !program) return null

  return (
    <AdminLayout title="프로그램 편집" subtitle={program.title}>
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
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsVisible(!isVisible)}
            className="inline-flex items-center px-4 py-2 rounded-sm font-medium text-sm transition-all duration-200"
            style={{
              background: isVisible ? 'oklch(0.55 0.15 145 / 0.1)' : 'oklch(0.55 0.01 75 / 0.1)',
              color: isVisible ? 'oklch(0.40 0.15 145)' : 'oklch(0.45 0.01 75)',
              border: `1px solid ${isVisible ? 'oklch(0.55 0.15 145 / 0.3)' : 'oklch(0.55 0.01 75 / 0.3)'}`,
            }}
          >
            {isVisible ? <Eye className="w-4 h-4 mr-2" /> : <EyeOff className="w-4 h-4 mr-2" />}
            {isVisible ? '공개 중' : '비공개'}
          </button>
          <button
            onClick={handleSaveProgram}
            disabled={saving}
            className="inline-flex items-center px-5 py-2.5 rounded-sm font-medium text-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50"
            style={{
              background: 'oklch(0.45 0.12 265)',
              color: 'oklch(0.98 0.003 75)',
            }}
          >
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            저장
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Program Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Cover Image */}
          <div
            className="p-6 rounded-sm"
            style={{
              background: 'oklch(0.985 0.003 75)',
              border: '1px solid oklch(0.92 0.005 75)',
            }}
          >
            <div className="mb-4">
              <h3
                className="font-headline font-bold text-lg"
                style={{ color: 'oklch(0.22 0.07 265)' }}
              >
                <ImageIcon className="w-5 h-5 inline mr-2" />
                커버 이미지
              </h3>
            </div>

            {coverPreview || coverImageUrl ? (
              <div className="relative aspect-video rounded-sm overflow-hidden mb-4">
                <img
                  src={coverPreview || coverImageUrl}
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
                  <Upload className="w-8 h-8 mb-2" style={{ color: 'oklch(0.45 0.12 265)' }} />
                  <span className="text-sm" style={{ color: 'oklch(0.45 0.12 265)' }}>
                    이미지 업로드
                  </span>
                </div>
                <input
                  ref={coverFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleCoverUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Program Info */}
          <div
            className="p-6 rounded-sm"
            style={{
              background: 'oklch(0.985 0.003 75)',
              border: '1px solid oklch(0.92 0.005 75)',
            }}
          >
            <div className="mb-4">
              <h3
                className="font-headline font-bold text-lg"
                style={{ color: 'oklch(0.22 0.07 265)' }}
              >
                프로그램 정보
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'oklch(0.35 0.05 265)' }}>
                  제목
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="block w-full px-3 py-2 rounded-sm transition-all duration-200 focus:outline-none focus:ring-2"
                  style={{
                    background: 'oklch(0.97 0.005 265)',
                    border: '1px solid oklch(0.90 0.01 265)',
                    color: 'oklch(0.25 0.02 75)',
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'oklch(0.35 0.05 265)' }}>
                  카테고리
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ProgramCategory)}
                  className="block w-full px-3 py-2 rounded-sm transition-all duration-200 focus:outline-none"
                  style={{
                    background: 'oklch(0.97 0.005 265)',
                    border: '1px solid oklch(0.90 0.01 265)',
                    color: 'oklch(0.25 0.02 75)',
                  }}
                >
                  {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'oklch(0.35 0.05 265)' }}>
                  총 주차
                </label>
                <input
                  type="number"
                  value={totalWeeks}
                  onChange={(e) => setTotalWeeks(parseInt(e.target.value) || 1)}
                  min={1}
                  className="block w-full px-3 py-2 rounded-sm transition-all duration-200 focus:outline-none"
                  style={{
                    background: 'oklch(0.97 0.005 265)',
                    border: '1px solid oklch(0.90 0.01 265)',
                    color: 'oklch(0.25 0.02 75)',
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'oklch(0.35 0.05 265)' }}>
                  설명
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="block w-full px-3 py-2 rounded-sm transition-all duration-200 focus:outline-none resize-none"
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

        {/* Right Column - Materials */}
        <div className="lg:col-span-2">
          <div
            className="p-6 rounded-sm"
            style={{
              background: 'oklch(0.985 0.003 75)',
              border: '1px solid oklch(0.92 0.005 75)',
            }}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3
                  className="font-headline font-bold text-lg"
                  style={{ color: 'oklch(0.22 0.07 265)' }}
                >
                  훈련 자료
                </h3>
                <p className="text-sm" style={{ color: 'oklch(0.55 0.01 75)' }}>
                  {materials.length}개의 자료
                </p>
              </div>
              <button
                onClick={() => {
                  resetMaterialForm()
                  setShowMaterialForm(true)
                }}
                className="inline-flex items-center px-4 py-2 rounded-sm font-medium text-sm transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  background: 'oklch(0.72 0.10 75)',
                  color: 'oklch(0.15 0.05 265)',
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                자료 추가
              </button>
            </div>

            {/* Material Form */}
            {showMaterialForm && (
              <div
                className="p-5 rounded-sm mb-6"
                style={{
                  background: 'oklch(0.97 0.005 265)',
                  border: '1px solid oklch(0.90 0.01 265)',
                }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium" style={{ color: 'oklch(0.30 0.05 265)' }}>
                    {editingMaterialId ? '자료 편집' : '새 자료 추가'}
                  </h4>
                  <button
                    onClick={resetMaterialForm}
                    className="p-1.5 rounded-sm transition-all"
                    style={{ color: 'oklch(0.50 0.01 75)' }}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'oklch(0.35 0.05 265)' }}>
                      자료 유형
                    </label>
                    <div className="flex gap-2">
                      {(['pdf', 'video', 'audio'] as MaterialType[]).map((type) => (
                        <button
                          key={type}
                          onClick={() => setMaterialForm({ ...materialForm, material_type: type, file_url: '', video_url: '' })}
                          className="flex-1 py-2 rounded-sm font-medium text-sm transition-all"
                          style={{
                            background: materialForm.material_type === type ? MATERIAL_TYPE_COLORS[type] : 'oklch(0.92 0.01 265)',
                            color: materialForm.material_type === type ? 'white' : 'oklch(0.45 0.05 265)',
                          }}
                        >
                          {MATERIAL_TYPE_ICONS[type]} {MATERIAL_TYPE_LABELS[type]}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'oklch(0.35 0.05 265)' }}>
                      주차
                    </label>
                    <select
                      value={materialForm.week_number}
                      onChange={(e) => setMaterialForm({ ...materialForm, week_number: parseInt(e.target.value) })}
                      className="block w-full px-3 py-2 rounded-sm focus:outline-none"
                      style={{
                        background: 'oklch(0.95 0.005 265)',
                        border: '1px solid oklch(0.88 0.01 265)',
                        color: 'oklch(0.25 0.02 75)',
                      }}
                    >
                      {Array.from({ length: totalWeeks }, (_, i) => i + 1).map((week) => (
                        <option key={week} value={week}>{week}주차</option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'oklch(0.35 0.05 265)' }}>
                      자료 제목
                    </label>
                    <input
                      type="text"
                      value={materialForm.title}
                      onChange={(e) => setMaterialForm({ ...materialForm, title: e.target.value })}
                      placeholder="예: 1주차 - 신앙의 기초"
                      className="block w-full px-3 py-2 rounded-sm focus:outline-none"
                      style={{
                        background: 'oklch(0.95 0.005 265)',
                        border: '1px solid oklch(0.88 0.01 265)',
                        color: 'oklch(0.25 0.02 75)',
                      }}
                    />
                  </div>

                  {materialForm.material_type === 'video' ? (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1.5" style={{ color: 'oklch(0.35 0.05 265)' }}>
                        영상 URL (YouTube, Vimeo 등)
                      </label>
                      <input
                        type="url"
                        value={materialForm.video_url || ''}
                        onChange={(e) => setMaterialForm({ ...materialForm, video_url: e.target.value })}
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="block w-full px-3 py-2 rounded-sm focus:outline-none"
                        style={{
                          background: 'oklch(0.95 0.005 265)',
                          border: '1px solid oklch(0.88 0.01 265)',
                          color: 'oklch(0.25 0.02 75)',
                        }}
                      />
                    </div>
                  ) : (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1.5" style={{ color: 'oklch(0.35 0.05 265)' }}>
                        파일 업로드
                      </label>
                      {materialForm.file_url ? (
                        <div
                          className="flex items-center justify-between p-3 rounded-sm"
                          style={{ background: 'oklch(0.55 0.15 145 / 0.1)' }}
                        >
                          <span className="text-sm" style={{ color: 'oklch(0.35 0.10 145)' }}>
                            {materialForm.file_name || '파일 업로드됨'}
                          </span>
                          <button
                            onClick={() => setMaterialForm({ ...materialForm, file_url: '', file_name: '' })}
                            className="p-1"
                            style={{ color: 'oklch(0.55 0.18 25)' }}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <label
                          className="flex items-center justify-center p-4 rounded-sm cursor-pointer transition-all hover:-translate-y-0.5"
                          style={{
                            background: 'oklch(0.95 0.005 265)',
                            border: '2px dashed oklch(0.85 0.01 265)',
                          }}
                        >
                          {materialUploading ? (
                            <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'oklch(0.45 0.12 265)' }} />
                          ) : (
                            <>
                              <Upload className="w-5 h-5 mr-2" style={{ color: 'oklch(0.45 0.12 265)' }} />
                              <span style={{ color: 'oklch(0.45 0.12 265)' }}>
                                {materialForm.material_type === 'pdf' ? 'PDF 파일' : '오디오 파일'} 선택
                              </span>
                            </>
                          )}
                          <input
                            ref={materialFileInputRef}
                            type="file"
                            accept={materialForm.material_type === 'pdf' ? '.pdf' : 'audio/*'}
                            onChange={handleMaterialFileUpload}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  )}

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'oklch(0.35 0.05 265)' }}>
                      설명 (선택)
                    </label>
                    <textarea
                      value={materialForm.description || ''}
                      onChange={(e) => setMaterialForm({ ...materialForm, description: e.target.value })}
                      rows={2}
                      className="block w-full px-3 py-2 rounded-sm focus:outline-none resize-none"
                      style={{
                        background: 'oklch(0.95 0.005 265)',
                        border: '1px solid oklch(0.88 0.01 265)',
                        color: 'oklch(0.25 0.02 75)',
                      }}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-4">
                  <button
                    onClick={resetMaterialForm}
                    className="px-4 py-2 rounded-sm font-medium text-sm transition-all"
                    style={{
                      background: 'oklch(0.92 0.01 265)',
                      color: 'oklch(0.45 0.05 265)',
                    }}
                  >
                    취소
                  </button>
                  <button
                    onClick={handleSaveMaterial}
                    disabled={saving}
                    className="px-4 py-2 rounded-sm font-medium text-sm transition-all hover:-translate-y-0.5"
                    style={{
                      background: 'oklch(0.45 0.12 265)',
                      color: 'white',
                    }}
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : '저장'}
                  </button>
                </div>
              </div>
            )}

            {/* Materials List by Week */}
            {materials.length === 0 ? (
              <div className="text-center py-12">
                <div
                  className="w-16 h-16 rounded-sm mx-auto mb-4 flex items-center justify-center"
                  style={{ background: 'oklch(0.45 0.12 265 / 0.1)' }}
                >
                  <FileText className="w-8 h-8" style={{ color: 'oklch(0.45 0.12 265)' }} />
                </div>
                <p style={{ color: 'oklch(0.50 0.01 75)' }}>
                  아직 등록된 자료가 없습니다
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {Array.from({ length: totalWeeks }, (_, i) => i + 1).map((week) => {
                  const weekMaterials = materialsByWeek[week] || []
                  if (weekMaterials.length === 0) return null

                  return (
                    <div key={week}>
                      <div className="flex items-center gap-2 mb-3">
                        <span
                          className="px-2.5 py-1 rounded-sm text-xs font-bold"
                          style={{
                            background: 'oklch(0.45 0.12 265)',
                            color: 'white',
                          }}
                        >
                          {week}주차
                        </span>
                        <span className="text-xs" style={{ color: 'oklch(0.55 0.01 75)' }}>
                          {weekMaterials.length}개 자료
                        </span>
                      </div>

                      <div className="space-y-2">
                        {weekMaterials.map((material) => (
                          <div
                            key={material.id}
                            className="flex items-center justify-between p-4 rounded-sm transition-all hover:-translate-y-0.5"
                            style={{
                              background: 'oklch(0.97 0.005 265)',
                              border: '1px solid oklch(0.90 0.01 265)',
                              opacity: material.is_visible ? 1 : 0.6,
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className="w-10 h-10 rounded-sm flex items-center justify-center text-lg"
                                style={{
                                  background: `${MATERIAL_TYPE_COLORS[material.material_type as MaterialType]}20`,
                                }}
                              >
                                {MATERIAL_TYPE_ICONS[material.material_type as MaterialType]}
                              </div>
                              <div>
                                <h4 className="font-medium" style={{ color: 'oklch(0.25 0.05 265)' }}>
                                  {material.title}
                                </h4>
                                <div className="flex items-center gap-2 text-xs" style={{ color: 'oklch(0.55 0.01 75)' }}>
                                  <span
                                    className="px-1.5 py-0.5 rounded-sm"
                                    style={{
                                      background: MATERIAL_TYPE_COLORS[material.material_type as MaterialType],
                                      color: 'white',
                                    }}
                                  >
                                    {MATERIAL_TYPE_LABELS[material.material_type as MaterialType]}
                                  </span>
                                  {material.view_count > 0 && (
                                    <span>조회 {material.view_count}</span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {(material.file_url || material.video_url) && (
                                <a
                                  href={material.file_url || material.video_url || '#'}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 rounded-sm transition-all"
                                  style={{ color: 'oklch(0.45 0.12 265)' }}
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                              )}
                              <button
                                onClick={() => toggleMaterialVisibility(material)}
                                className="p-2 rounded-sm transition-all"
                                style={{ color: material.is_visible ? 'oklch(0.55 0.15 145)' : 'oklch(0.55 0.01 75)' }}
                              >
                                {material.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                              </button>
                              <button
                                onClick={() => handleEditMaterial(material)}
                                className="p-2 rounded-sm transition-all"
                                style={{ color: 'oklch(0.45 0.12 265)' }}
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteMaterial(material.id, material.title)}
                                className="p-2 rounded-sm transition-all"
                                style={{ color: 'oklch(0.55 0.18 25)' }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
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

export default TrainingProgramEditPage
