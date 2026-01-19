import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import {
  Plus,
  Edit,
  Trash2,
  Search,
  BookOpen,
  Eye,
  EyeOff,
  FolderOpen,
  ArrowRight,
  FileText,
  Video,
  Headphones,
  BarChart3,
} from 'lucide-react'
import Link from 'next/link'
import AdminLayout from '@/components/AdminLayout'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import {
  getAllPrograms,
  deleteProgram,
  CATEGORY_LABELS,
  type ProgramCategory
} from '../../../utils/trainingService'
import type { TrainingProgram } from '../../../../types/supabase'

// ===========================================
// VS Design Diverge: Training Management
// Editorial Grid + OKLCH Color System
// ===========================================

const CATEGORY_COLORS: Record<ProgramCategory, string> = {
  new_family: 'oklch(0.55 0.15 340)',    // 새가족 양육 - 로즈핑크
  discipleship: 'oklch(0.45 0.12 265)',  // 제자훈련 - 진한 인디고
  bible_study: 'oklch(0.55 0.15 145)',   // 성경공부 - 녹색
  leadership: 'oklch(0.60 0.18 25)',     // 리더십 - 주황색
  baptism: 'oklch(0.55 0.18 200)',       // 세례교육 - 파란색
  general: 'oklch(0.72 0.10 75)',        // 일반 - 골드
}

const formatKoreanDate = (dateString?: string | null): string => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
}

const AdminTrainingPage = () => {
  const router = useRouter()
  const { admin } = useAdminAuth()
  const [programs, setPrograms] = useState<TrainingProgram[]>([])
  const [listLoading, setListLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterVisibility, setFilterVisibility] = useState<'all' | 'visible' | 'hidden'>('all')

  useEffect(() => {
    if (!admin) return

    const fetchPrograms = async () => {
      try {
        setListLoading(true)
        const data = await getAllPrograms()
        setPrograms(data)
      } catch (error) {
        console.error('프로그램 조회 오류:', error)
      } finally {
        setListLoading(false)
      }
    }

    fetchPrograms()
  }, [admin])

  const handleDelete = async (id: string, programTitle: string) => {
    if (!confirm(`"${programTitle}" 프로그램과 모든 자료를 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`)) return

    try {
      await deleteProgram(id)
      setPrograms((prev) => prev.filter((program) => program.id !== id))
    } catch (error) {
      console.error('삭제 오류:', error)
      alert('삭제 중 오류가 발생했습니다.')
    }
  }

  const filteredPrograms = useMemo(() => {
    const lowerSearch = searchTerm.trim().toLowerCase()

    return programs.filter((program) => {
      const matchesSearch =
        !lowerSearch ||
        program.title.toLowerCase().includes(lowerSearch) ||
        (program.description || '').toLowerCase().includes(lowerSearch)

      const matchesCategory = filterCategory === 'all' || program.category === filterCategory

      const matchesVisibility =
        filterVisibility === 'all' ||
        (filterVisibility === 'visible' && program.is_visible) ||
        (filterVisibility === 'hidden' && !program.is_visible)

      return matchesSearch && matchesCategory && matchesVisibility
    })
  }, [programs, searchTerm, filterCategory, filterVisibility])

  const stats = useMemo(() => {
    const total = programs.length
    const visible = programs.filter((p) => p.is_visible).length
    const totalMaterials = programs.reduce((sum, p) => sum + (p.material_count || 0), 0)
    const discipleship = programs.filter((p) => p.category === 'discipleship').length

    return { total, visible, totalMaterials, discipleship }
  }, [programs])

  const statsCards = [
    {
      name: '총 프로그램',
      value: stats.total,
      icon: FolderOpen,
    },
    {
      name: '공개 프로그램',
      value: stats.visible,
      icon: Eye,
    },
    {
      name: '총 자료',
      value: stats.totalMaterials,
      icon: FileText,
    },
    {
      name: '제자훈련',
      value: stats.discipleship,
      icon: BookOpen,
    },
  ]

  return (
    <AdminLayout title="훈련 관리" subtitle="제자훈련 프로그램과 자료를 관리하세요">
      {/* Action Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <div
            className="h-0.5 w-8 mr-4"
            style={{
              background: 'linear-gradient(90deg, oklch(0.72 0.10 75), oklch(0.45 0.12 265))',
            }}
          />
          <span
            className="text-sm font-medium"
            style={{ color: 'oklch(0.55 0.01 75)' }}
          >
            {filteredPrograms.length}개의 프로그램
          </span>
        </div>
        <Link
          href="/admin/training/new"
          className="inline-flex items-center px-5 py-2.5 rounded-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
          style={{
            background: 'oklch(0.45 0.12 265)',
            color: 'oklch(0.98 0.003 75)',
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          새 프로그램
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
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
              <p
                className="text-xs font-medium mb-1"
                style={{ color: 'oklch(0.55 0.01 75)' }}
              >
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

      {/* Search and Filters */}
      <div
        className="p-6 rounded-sm mb-6"
        style={{
          background: 'oklch(0.985 0.003 75)',
          border: '1px solid oklch(0.92 0.005 75)',
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search Input */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
                style={{ color: 'oklch(0.50 0.01 75)' }}
              />
              <input
                type="text"
                placeholder="프로그램 제목으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-4 py-2.5 rounded-sm transition-all duration-200 focus:outline-none"
                style={{
                  background: 'oklch(0.97 0.005 265)',
                  border: '1px solid oklch(0.90 0.01 265)',
                  color: 'oklch(0.25 0.02 75)',
                }}
              />
            </div>
          </div>

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="block w-full px-3 py-2.5 rounded-sm transition-all duration-200 focus:outline-none appearance-none cursor-pointer"
            style={{
              background: 'oklch(0.97 0.005 265)',
              border: '1px solid oklch(0.90 0.01 265)',
              color: 'oklch(0.35 0.02 75)',
            }}
          >
            <option value="all">모든 카테고리</option>
            <option value="new_family">새가족 양육</option>
            <option value="discipleship">제자훈련</option>
            <option value="bible_study">성경공부</option>
            <option value="leadership">리더십훈련</option>
            <option value="baptism">세례교육</option>
            <option value="general">일반</option>
          </select>

          {/* Visibility Filter */}
          <select
            value={filterVisibility}
            onChange={(e) => setFilterVisibility(e.target.value as 'all' | 'visible' | 'hidden')}
            className="block w-full px-3 py-2.5 rounded-sm transition-all duration-200 focus:outline-none appearance-none cursor-pointer"
            style={{
              background: 'oklch(0.97 0.005 265)',
              border: '1px solid oklch(0.90 0.01 265)',
              color: 'oklch(0.35 0.02 75)',
            }}
          >
            <option value="all">모든 상태</option>
            <option value="visible">공개</option>
            <option value="hidden">비공개</option>
          </select>
        </div>
      </div>

      {/* Programs Grid */}
      <div
        className="rounded-sm overflow-hidden"
        style={{
          background: 'oklch(0.985 0.003 75)',
          border: '1px solid oklch(0.92 0.005 75)',
        }}
      >
        {listLoading ? (
          <div className="p-12 flex flex-col items-center justify-center">
            <div
              className="w-10 h-10 rounded-sm mb-4 animate-pulse"
              style={{ background: 'oklch(0.45 0.12 265)' }}
            />
            <p
              className="text-sm font-medium"
              style={{ color: 'oklch(0.55 0.01 75)' }}
            >
              프로그램 로딩 중...
            </p>
          </div>
        ) : filteredPrograms.length === 0 ? (
          <div className="p-12 text-center">
            <div
              className="w-16 h-16 rounded-sm mx-auto mb-4 flex items-center justify-center"
              style={{ background: 'oklch(0.45 0.12 265 / 0.1)' }}
            >
              <BookOpen className="w-8 h-8" style={{ color: 'oklch(0.45 0.12 265)' }} />
            </div>
            <p
              className="text-sm font-medium mb-2"
              style={{ color: 'oklch(0.45 0.01 75)' }}
            >
              등록된 프로그램이 없습니다
            </p>
            <p
              className="text-xs"
              style={{ color: 'oklch(0.55 0.01 75)' }}
            >
              새 프로그램을 만들어 훈련 자료를 업로드하세요
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {filteredPrograms.map((program, index) => (
              <div
                key={program.id}
                className={`group rounded-sm overflow-hidden transition-all duration-300 hover:-translate-y-1 stagger-${(index % 6) + 1}`}
                style={{
                  background: 'oklch(0.97 0.005 265)',
                  border: '1px solid oklch(0.90 0.01 265)',
                }}
              >
                {/* Cover Image / Header */}
                <div className="aspect-video relative overflow-hidden">
                  {program.cover_image_url ? (
                    <img
                      src={program.cover_image_url}
                      alt={program.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{
                        background: `linear-gradient(135deg, ${CATEGORY_COLORS[program.category as ProgramCategory] || CATEGORY_COLORS.general}, oklch(0.30 0.08 265))`,
                      }}
                    >
                      <BookOpen className="w-16 h-16" style={{ color: 'oklch(0.98 0.003 75 / 0.5)' }} />
                    </div>
                  )}

                  {/* Category Badge */}
                  <div
                    className="absolute top-3 left-3 px-2.5 py-1 rounded-sm text-xs font-medium"
                    style={{
                      background: CATEGORY_COLORS[program.category as ProgramCategory] || CATEGORY_COLORS.general,
                      color: 'oklch(0.98 0.003 75)',
                    }}
                  >
                    {CATEGORY_LABELS[program.category as ProgramCategory] || '일반'}
                  </div>

                  {/* Visibility Badge */}
                  {!program.is_visible && (
                    <div
                      className="absolute top-3 right-3 px-2.5 py-1 rounded-sm flex items-center gap-1.5 text-xs font-medium"
                      style={{
                        background: 'oklch(0.20 0.05 265 / 0.85)',
                        color: 'oklch(0.85 0.01 75)',
                      }}
                    >
                      <EyeOff className="w-3 h-3" />
                      비공개
                    </div>
                  )}

                  {/* Hover Overlay */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                    style={{ background: 'oklch(0.15 0.05 265 / 0.6)' }}
                  >
                    <button
                      onClick={() => router.push(`/admin/training/${program.id}`)}
                      className="inline-flex items-center px-4 py-2 rounded-sm font-medium text-sm transition-all duration-200 hover:-translate-y-0.5"
                      style={{
                        background: 'oklch(0.72 0.10 75)',
                        color: 'oklch(0.15 0.05 265)',
                      }}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      편집하기
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3
                    className="font-headline font-bold text-lg mb-2 line-clamp-1"
                    style={{ color: 'oklch(0.22 0.07 265)' }}
                  >
                    {program.title}
                  </h3>

                  <div className="flex items-center gap-4 mb-3">
                    <span
                      className="flex items-center gap-1.5 text-xs"
                      style={{ color: 'oklch(0.55 0.01 75)' }}
                    >
                      <BarChart3 className="w-3.5 h-3.5" />
                      {program.total_weeks}주 과정
                    </span>
                    <span
                      className="flex items-center gap-1.5 text-xs"
                      style={{ color: 'oklch(0.55 0.01 75)' }}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      {program.material_count || 0}개 자료
                    </span>
                  </div>

                  {program.description && (
                    <p
                      className="text-sm line-clamp-2 mb-4"
                      style={{ color: 'oklch(0.50 0.01 75)' }}
                    >
                      {program.description}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`/admin/training/${program.id}`)}
                      className="flex-1 group/btn inline-flex items-center justify-center px-4 py-2 rounded-sm font-medium text-sm transition-all duration-200 hover:-translate-y-0.5"
                      style={{
                        background: 'oklch(0.45 0.12 265)',
                        color: 'oklch(0.98 0.003 75)',
                      }}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      편집
                      <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                    </button>
                    <button
                      onClick={() => handleDelete(program.id, program.title)}
                      className="inline-flex items-center justify-center px-3 py-2 rounded-sm font-medium text-sm transition-all duration-200 hover:-translate-y-0.5"
                      style={{
                        background: 'oklch(0.55 0.18 25 / 0.1)',
                        color: 'oklch(0.50 0.18 25)',
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
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

export default AdminTrainingPage
