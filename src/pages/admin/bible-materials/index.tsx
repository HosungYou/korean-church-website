import React, { useState, useEffect } from 'react'
import { GetServerSideProps, NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Link from 'next/link'
import AdminLayout from '@/components/AdminLayout'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import {
  Book,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  FileText,
  Video,
  Search,
  ChevronRight,
} from 'lucide-react'
import {
  getAllMaterials,
  deleteMaterial,
  updateMaterial,
  type BibleMaterial,
  type BibleMaterialCategory,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
} from '@/utils/bibleMaterialsService'

// ===========================================
// VS Design Diverge: Admin Bible Materials Page
// Editorial Table Layout + OKLCH Color System
// ===========================================

const AdminBibleMaterialsPage: NextPage = () => {
  const { admin, loading: authLoading } = useAdminAuth()
  const [materials, setMaterials] = useState<BibleMaterial[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<BibleMaterialCategory | 'all'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  useEffect(() => {
    if (admin) {
      loadMaterials()
    }
  }, [admin])

  const loadMaterials = async () => {
    setLoading(true)
    try {
      const data = await getAllMaterials()
      setMaterials(data)
    } catch (error) {
      console.error('Error loading materials:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleVisibility = async (material: BibleMaterial) => {
    try {
      await updateMaterial(material.id, { is_visible: !material.is_visible })
      setMaterials((prev) =>
        prev.map((m) =>
          m.id === material.id ? { ...m, is_visible: !m.is_visible } : m
        )
      )
    } catch (error) {
      console.error('Error toggling visibility:', error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteMaterial(id)
      setMaterials((prev) => prev.filter((m) => m.id !== id))
      setDeleteConfirm(null)
    } catch (error) {
      console.error('Error deleting material:', error)
    }
  }

  const filteredMaterials = materials.filter((m) => {
    const matchesCategory = selectedCategory === 'all' || m.category === selectedCategory
    const matchesSearch =
      searchTerm === '' ||
      m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.book_name?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

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

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Book className="w-6 h-6" style={{ color: 'oklch(0.45 0.12 265)' }} />
              <h1
                className="font-headline font-bold text-2xl"
                style={{ color: 'oklch(0.22 0.07 265)' }}
              >
                성경통독 자료 관리
              </h1>
            </div>
            <p className="text-sm" style={{ color: 'oklch(0.55 0.01 75)' }}>
              구약/신약 성경 통독 자료를 관리합니다.
            </p>
          </div>
          <Link
            href="/admin/bible-materials/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-sm text-sm font-medium transition-all hover:scale-[1.02]"
            style={{
              background: 'oklch(0.45 0.12 265)',
              color: 'oklch(0.98 0.003 75)',
            }}
          >
            <Plus className="w-4 h-4" />
            새 자료 추가
          </Link>
        </div>

        {/* Filters */}
        <div
          className="p-4 rounded-sm"
          style={{
            background: 'oklch(0.985 0.003 75)',
            border: '1px solid oklch(0.92 0.005 75)',
          }}
        >
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: 'oklch(0.55 0.01 75)' }}
              />
              <input
                type="text"
                placeholder="제목 또는 성경 이름으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-sm text-sm focus:outline-none focus:ring-2"
                style={{
                  background: 'oklch(0.97 0.005 75)',
                  border: '1px solid oklch(0.88 0.005 75)',
                  color: 'oklch(0.25 0.05 265)',
                  outlineColor: 'oklch(0.45 0.12 265)',
                }}
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2.5 rounded-sm text-sm font-medium transition-all ${
                  selectedCategory === 'all' ? 'scale-[1.02]' : ''
                }`}
                style={{
                  background: selectedCategory === 'all'
                    ? 'oklch(0.45 0.12 265)'
                    : 'oklch(0.97 0.005 75)',
                  color: selectedCategory === 'all'
                    ? 'oklch(0.98 0.003 75)'
                    : 'oklch(0.35 0.02 265)',
                  border: `1px solid ${
                    selectedCategory === 'all'
                      ? 'oklch(0.45 0.12 265)'
                      : 'oklch(0.88 0.005 75)'
                  }`,
                }}
              >
                전체
              </button>
              {(['old_testament', 'new_testament'] as BibleMaterialCategory[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2.5 rounded-sm text-sm font-medium transition-all ${
                    selectedCategory === cat ? 'scale-[1.02]' : ''
                  }`}
                  style={{
                    background: selectedCategory === cat
                      ? CATEGORY_COLORS[cat]
                      : 'oklch(0.97 0.005 75)',
                    color: selectedCategory === cat
                      ? 'oklch(0.98 0.003 75)'
                      : 'oklch(0.35 0.02 265)',
                    border: `1px solid ${
                      selectedCategory === cat
                        ? CATEGORY_COLORS[cat]
                        : 'oklch(0.88 0.005 75)'
                    }`,
                  }}
                >
                  {CATEGORY_LABELS[cat]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Materials List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div
              className="w-10 h-10 border-2 rounded-full animate-spin"
              style={{ borderColor: 'oklch(0.45 0.12 265)', borderTopColor: 'transparent' }}
            />
          </div>
        ) : filteredMaterials.length === 0 ? (
          <div
            className="p-12 rounded-sm text-center"
            style={{
              background: 'oklch(0.985 0.003 75)',
              border: '1px solid oklch(0.92 0.005 75)',
            }}
          >
            <Book
              className="w-12 h-12 mx-auto mb-4"
              style={{ color: 'oklch(0.75 0.01 75)' }}
            />
            <p style={{ color: 'oklch(0.55 0.01 75)' }}>
              {searchTerm || selectedCategory !== 'all'
                ? '검색 결과가 없습니다.'
                : '등록된 자료가 없습니다.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredMaterials.map((material) => (
              <div
                key={material.id}
                className={`p-4 rounded-sm transition-all duration-200 hover:translate-x-1 ${
                  !material.is_visible ? 'opacity-60' : ''
                }`}
                style={{
                  background: 'oklch(0.985 0.003 75)',
                  border: '1px solid oklch(0.92 0.005 75)',
                  borderLeft: `4px solid ${CATEGORY_COLORS[material.category]}`,
                }}
              >
                <div className="flex items-center gap-4">
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="text-xs font-medium px-2 py-0.5 rounded-sm"
                        style={{
                          background: `${CATEGORY_COLORS[material.category]}20`,
                          color: CATEGORY_COLORS[material.category],
                        }}
                      >
                        {CATEGORY_LABELS[material.category]}
                      </span>
                      {material.book_name && (
                        <span className="text-xs" style={{ color: 'oklch(0.55 0.01 75)' }}>
                          {material.book_name}
                          {material.chapter_range && ` ${material.chapter_range}`}
                        </span>
                      )}
                      {!material.is_visible && (
                        <span
                          className="text-xs px-2 py-0.5 rounded-sm"
                          style={{
                            background: 'oklch(0.55 0.15 25 / 0.1)',
                            color: 'oklch(0.55 0.15 25)',
                          }}
                        >
                          숨김
                        </span>
                      )}
                    </div>
                    <h3
                      className="font-medium truncate mb-1"
                      style={{ color: 'oklch(0.22 0.07 265)' }}
                    >
                      {material.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs" style={{ color: 'oklch(0.55 0.01 75)' }}>
                      {material.file_url && (
                        <span className="flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5" />
                          PDF
                        </span>
                      )}
                      {material.video_url && (
                        <span className="flex items-center gap-1">
                          <Video className="w-3.5 h-3.5" />
                          영상
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        {material.view_count}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleVisibility(material)}
                      className="p-2 rounded-sm transition-all hover:scale-110"
                      style={{
                        background: 'oklch(0.97 0.005 75)',
                        color: material.is_visible
                          ? 'oklch(0.55 0.15 145)'
                          : 'oklch(0.55 0.01 75)',
                      }}
                      title={material.is_visible ? '숨기기' : '공개'}
                    >
                      {material.is_visible ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </button>
                    <Link
                      href={`/admin/bible-materials/${material.id}`}
                      className="p-2 rounded-sm transition-all hover:scale-110"
                      style={{
                        background: 'oklch(0.97 0.005 75)',
                        color: 'oklch(0.45 0.12 265)',
                      }}
                      title="수정"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    {deleteConfirm === material.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDelete(material.id)}
                          className="px-3 py-1.5 rounded-sm text-xs font-medium"
                          style={{
                            background: 'oklch(0.55 0.15 25)',
                            color: 'oklch(0.98 0.003 75)',
                          }}
                        >
                          삭제
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="px-3 py-1.5 rounded-sm text-xs font-medium"
                          style={{
                            background: 'oklch(0.92 0.005 75)',
                            color: 'oklch(0.35 0.02 265)',
                          }}
                        >
                          취소
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(material.id)}
                        className="p-2 rounded-sm transition-all hover:scale-110"
                        style={{
                          background: 'oklch(0.97 0.005 75)',
                          color: 'oklch(0.55 0.15 25)',
                        }}
                        title="삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    <Link
                      href={`/bible-materials/${material.id}`}
                      target="_blank"
                      className="p-2 rounded-sm transition-all hover:scale-110"
                      style={{
                        background: 'oklch(0.97 0.005 75)',
                        color: 'oklch(0.55 0.01 75)',
                      }}
                      title="미리보기"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Link>
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

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale || 'ko', ['common'])),
  },
})

export default AdminBibleMaterialsPage
